import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, Equal } from 'typeorm';

import { LoggerService } from '../../../logger/services/logger.service';
import { Roles } from '../entities/roles.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
    private readonly logger: LoggerService,
  ) {}

  async getAdminRoles(requestId: string) {
    const response: Roles[] = await this.rolesRepository.find({
      where: [{ roleName: Not(Equal('User')) }],
      order: {
        roleName: 'ASC',
      },
    });
    if (!response || response.length <= 0) {
      const errorMessage = 'No roles found';
      this.logger.error(
        errorMessage,
        `${RolesService.name}#getAdminRoles`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }

    return response;
  }
}
