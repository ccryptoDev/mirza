import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt';
import moment from 'moment';
import passwordGenerator from 'generate-password';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  UpdateResult,
  WhereExpressionBuilder,
  Brackets,
  getRepository,
} from 'typeorm';

import { LoggerService } from '../../logger/services/logger.service';
import { Roles } from '../../authentication/roles/entities/roles.entity';
import { Admin } from '../entities/admin.entity';
import { CreateAdminDto } from '../validation/create-admin.dto';
import { Merchant } from '../merchant/entities/merchant.entity';
import { SendGridService } from '../../email/services/sendgrid.service';
import { NunjucksService } from '../../html-parser/services/nunjucks.service';
import { AdminJwtPayload } from '../../authentication/types/jwt-payload.types';
import { UpdateAdminDto } from '../validation/update-admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
    @InjectRepository(Merchant)
    private readonly merchantRepository: Repository<Merchant>,
    private readonly nunjucksService: NunjucksService,
    private readonly sendGridService: SendGridService,
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {}

  async createAdmin(createAdminDto: CreateAdminDto, requestId: string) {
    const { userName, email, phoneNumber, role, merchantId } = createAdminDto;
    this.logger.log(
      'Creating admin user with arguments',
      `${AdminService.name}#createNewUser`,
      requestId,
      createAdminDto,
    );
    const user: Admin | null = await this.adminRepository.findOne({
      where: {
        email,
      },
    });
    if (user) {
      const errorMessage = 'User already exists';
      this.logger.error(
        errorMessage,
        `${AdminService.name}#createNewUser`,
        requestId,
      );
      throw new BadRequestException(undefined, errorMessage);
    }

    const adminData: any = {};
    adminData.userName = userName;
    adminData.email = email;
    adminData.isDeleted = false;
    adminData.phoneNumber = phoneNumber;
    const initialPassword: string = await this.generateInitialPassword();
    adminData.password = await this.generateEncryptedPassword(initialPassword);
    const roleDocument: Roles | null = await this.rolesRepository.findOne({
      roleName: role,
    });
    if (!roleDocument) {
      const errorMessage = `Role ${role} not found`;
      this.logger.error(
        errorMessage,
        `${AdminService.name}#createNewUser`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }

    adminData.role = roleDocument.id;
    const merchant: Merchant | null = await this.merchantRepository.findOne({
      id: merchantId,
    });
    if (!merchant) {
      const errorMessage = `Merchant id ${Merchant} not found`;
      this.logger.error(
        errorMessage,
        `${AdminService.name}#createNewUser`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }
    adminData.merchant = merchant;

    const newAdmin: Admin = this.adminRepository.create({
      userName: adminData.userName,
      email: adminData.email,
      isDeleted: adminData.isDeleted,
      phoneNumber: adminData.phoneNumber,
      password: adminData.password,
      role: adminData.role,
      merchant: adminData.merchant,
    });
    await this.adminRepository.save(newAdmin);

    const context = {
      userName: adminData.userName,
      email: adminData.email,
      password: initialPassword,
      roleName: roleDocument.roleName,
      link: `${this.configService.get<string>('baseUrl')}/admin/login`,
    };
    const html: string = await this.nunjucksService.htmlToString(
      'emails/admin-register.html',
      context,
    );
    await this.sendGridService.sendEmail(
      'Mirza <support-mirza@heymirza.com>',
      adminData.email,
      'Admin registration',
      html,
      requestId,
    );

    const response = {
      adminId: newAdmin.id,
    };

    return response;
  }

  async getAllAdmins(
    admin: AdminJwtPayload,
    queryParams: { page: number; perPage: number; search: string },
    requestId: string,
  ) {
    this.logger.log(
      'Getting all admins with arguments',
      `${AdminService.name}#getAllAdmins`,
      requestId,
      { admin, getAllAdminsDto: queryParams },
    );
    const { page, perPage, search } = queryParams;
    const adminsResponse: [Admin[], number] = await getRepository(Admin)
      .createQueryBuilder('admin')
      .leftJoinAndSelect('admin.role', 'role')
      .leftJoinAndSelect('admin.merchant', 'merchant')
      .where(
        new Brackets((whereExpressionBuilder: WhereExpressionBuilder) => {
          whereExpressionBuilder.where('admin.isDeleted = :isDeleted', {
            isDeleted: false,
          });

          if (search) {
            whereExpressionBuilder.andWhere(
              new Brackets(
                (andWhereExpressionBuilder: WhereExpressionBuilder) => {
                  andWhereExpressionBuilder
                    .where(`admin.userName ILIKE '%${search}%'`)
                    .orWhere(`admin.email ILIKE '%${search}%'`)
                    .orWhere(`admin.phoneNumber ILIKE '%${search}%'`)
                    .orWhere(`role.roleName ::text ILIKE '%${search}%'`)
                    .orWhere(`merchant.businessCategory ILIKE '%${search}%'`);
                },
              ),
            );
          }
        }),
      )
      .take(perPage)
      .skip((page - 1) * perPage)
      .orderBy('admin.createdAt', 'DESC')
      .getManyAndCount();

    const admins = adminsResponse[0].map((admin: any) => {
      return {
        id: admin?.id,
        userName: admin?.userName,
        email: admin?.email,
        phone: admin?.phoneNumber,
        role: admin?.role.roleName,
        businessCategory: admin?.merchant?.businessCategory || '',
        createdDate: moment(admin.createdAt).format('MM/DD/YYYY hh:mm a'),
      };
    });
    const response = { items: admins, total: adminsResponse[1] };
    this.logger.log(
      'Got admins:',
      `${AdminService.name}#getAllAdmins`,
      requestId,
      response,
    );

    return response;
  }

  async getAllMerchantUsers(
    admin: AdminJwtPayload,
    queryParams: { page: number; perPage: number; search: string },
    requestId: string,
  ) {
    this.logger.log(
      'Getting all merchant users with arguments',
      `${AdminService.name}#getAllMerchantUsers`,
      requestId,
      { admin, getAllAdminsDto: queryParams },
    );
    const { page, perPage, search } = queryParams;
    const adminsResponse: [Admin[], number] = await getRepository(Admin)
      .createQueryBuilder('admin')
      .leftJoinAndSelect('admin.role', 'role')
      .leftJoinAndSelect('admin.merchant', 'merchant')
      .where(
        new Brackets((whereExpressionBuilder: WhereExpressionBuilder) => {
          whereExpressionBuilder
            .where('admin.isDeleted = :isDeleted', {
              isDeleted: false,
            })
            .andWhere('merchant.id = :merchantId', {
              merchantId: admin.merchant,
            })
            .andWhere('role.roleName != :merchantRole', {
              merchantRole: 'Merchant',
            });

          if (search) {
            whereExpressionBuilder.andWhere(
              new Brackets(
                (andWhereExpressionBuilder: WhereExpressionBuilder) => {
                  andWhereExpressionBuilder
                    .where(`admin.userName ILIKE '%${search}%'`)
                    .orWhere(`admin.email ILIKE '%${search}%'`)
                    .orWhere(`admin.phoneNumber ILIKE '%${search}%'`)
                    .orWhere(`role.roleName ::text ILIKE '%${search}%'`)
                    .orWhere(`merchant.businessCategory ILIKE '%${search}%'`);
                },
              ),
            );
          }
        }),
      )
      .take(perPage)
      .skip((page - 1) * perPage)
      .orderBy('admin.createdAt', 'DESC')
      .getManyAndCount();

    const admins = adminsResponse[0].map((admin: any) => {
      return {
        id: admin?.id,
        userName: admin?.userName,
        email: admin?.email,
        phone: admin?.phoneNumber,
        role: admin?.role.roleName,
        createdDate: moment(admin.createdAt).format('MM/DD/YYYY hh:mm a'),
      };
    });
    const response = { items: admins, total: adminsResponse[1] };
    this.logger.log(
      'Got admins:',
      `${AdminService.name}#getAllAdmins`,
      requestId,
      response,
    );

    return response;
  }

  async getAdminById(id: string, requestId: string) {
    this.logger.log(
      'Getting admin with arguments',
      `${AdminService.name}#getAdminById`,
      requestId,
      { id },
    );
    const admin: Admin | null = await this.adminRepository.findOne({
      where: {
        id,
      },
      relations: ['role', 'merchant'],
    });

    if (!admin) {
      const errorMessage = `Could not find user id ${id}`;
      this.logger.error(
        errorMessage,
        `${AdminService.name}#getAdminById`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }
    delete admin.password;

    this.logger.log(
      'Got admin:',
      `${AdminService.name}#getAdminById`,
      requestId,
      admin,
    );

    return admin;
  }

  async updateAdminById(
    id: string,
    updateAdminDto: UpdateAdminDto,
    requestId: string,
  ) {
    this.logger.log(
      'Updating admin with arguments',
      `${AdminService.name}#getAdminById`,
      requestId,
      { id, ...updateAdminDto },
    );
    const role: Roles | null = await this.rolesRepository.findOne({
      roleName: updateAdminDto.role,
    });
    if (!role) {
      const errorMessage = `Could not find role ${updateAdminDto.role}`;
      this.logger.error(
        errorMessage,
        `${AdminService.name}#getAdminById`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }

    const updateResult: UpdateResult = await this.adminRepository.update(
      { id },
      { ...updateAdminDto, role: role.id },
    );
    if (updateResult.affected === 0) {
      const errorMessage = `Could not find user id ${id}`;
      this.logger.error(
        errorMessage,
        `${AdminService.name}#getAdminById`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }
    const admin: Admin = await this.adminRepository.findOne(id);

    this.logger.log(
      'Updated admin:',
      `${AdminService.name}#getAdminById`,
      requestId,
      admin,
    );

    return admin;
  }

  async generateEncryptedPassword(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  async generateInitialPassword(): Promise<string> {
    return passwordGenerator.generate({
      length: 10,
      numbers: true,
      uppercase: true,
      strict: true,
    });
  }
}
