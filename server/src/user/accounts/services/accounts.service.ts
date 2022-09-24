import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { LoggerService } from '../../../logger/services/logger.service';
import { ScreenTracking } from '../../screen-tracking/entities/screen-tracking.entity';
import { Accounts } from '../entities/accounts.entity';
import { AddAccountDto } from '../validation/add-account.dto';
import { SetDefaultPaymentMethodDto } from '../validation/set-default-payment-method.dto';
import { Cards } from '../../cards/entities/cards.entity';
import { User } from '../../entities/user.entity';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(ScreenTracking)
    private readonly screenTrackingRepository: Repository<ScreenTracking>,
    @InjectRepository(Accounts)
    private readonly accountsRepository: Repository<Accounts>,
    @InjectRepository(Cards)
    private readonly cardsRepository: Repository<Cards>,
    private readonly logger: LoggerService,
  ) {}

  async addAccount(
    screenTrackingId: string,
    addAccountDto: AddAccountDto,
    requestId: string,
  ) {
    this.logger.log(
      'Adding account with arguments',
      `${AccountsService.name}.addAccount`,
      requestId,
      { screenTrackingId, addAccountDto },
    );

    const screenTracking: ScreenTracking =
      await this.screenTrackingRepository.findOne({
        where: {
          id: screenTrackingId,
        },
        relations: ['user'],
      });
    if (!screenTracking) {
      const errorMessage = `Screen tracking id ${screenTrackingId} not found`;
      this.logger.error(
        errorMessage,
        `${AccountsService.name}#addAccount`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }
    if (!screenTracking.user) {
      const errorMessage = `User for screen tracking id ${screenTrackingId} not found`;
      this.logger.error(
        errorMessage,
        `${AccountsService.name}#addAccount`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }

    const {
      accountHolder,
      accountNumber,
      routingNumber,
      bankName,
      isDefaultPaymentMethod,
    } = addAccountDto;
    const existingAccount: Accounts = await this.accountsRepository.findOne({
      user: screenTracking.user,
      accountHolder,
      accountNumber,
      bankName,
      routingNumber,
    });
    if (existingAccount) {
      const errorMessage = `Account already added`;
      this.logger.error(
        errorMessage,
        `${AccountsService.name}#addAccount`,
        requestId,
      );
      throw new BadRequestException(undefined, errorMessage);
    }

    let account: Accounts = this.accountsRepository.create({
      ...addAccountDto,
      user: screenTracking.user,
    });
    account = await this.accountsRepository.save(account);
    if (isDefaultPaymentMethod) {
      await this.setDefaultPaymentMethod(
        screenTracking.id,
        { accountId: account.id },
        requestId,
      );
    }
    this.logger.log(
      'Added account',
      `${AccountsService.name}.addAccount`,
      requestId,
      account,
    );
  }

  async getAccounts(
    screenTrackingId: string,
    requestId: string,
  ): Promise<Accounts[]> {
    this.logger.log(
      'Getting merchant accounts with arguments',
      `${AccountsService.name}#getAccounts`,
      requestId,
      { screenTrackingId },
    );

    const screenTracking: ScreenTracking =
      await this.screenTrackingRepository.findOne({
        where: {
          id: screenTrackingId,
        },
        relations: ['user'],
      });
    if (!screenTracking) {
      const errorMessage = `Screen tracking id ${screenTrackingId} not found`;
      this.logger.error(
        errorMessage,
        `${AccountsService.name}#getAccounts`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }
    if (!screenTracking.user) {
      const errorMessage = `User for screen tracking id ${screenTrackingId} not found`;
      this.logger.error(
        errorMessage,
        `${AccountsService.name}#getAccounts`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }

    const accounts: Accounts[] = await this.accountsRepository.find({
      where: {
        user: screenTracking.user,
      },
      order: {
        createdAt: 'DESC',
      },
    });
    if (!accounts || accounts.length <= 0) {
      const errorMessage = `Could not find any account for user id ${screenTrackingId}`;
      this.logger.error(
        errorMessage,
        `${AccountsService.name}#getAccounts`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }

    this.logger.log(
      'Got user accounts:',
      `${AccountsService.name}#getAccounts`,
      requestId,
      accounts,
    );

    return accounts;
  }

  async setDefaultPaymentMethod(
    screenTrackingId: string,
    setDefaultPaymentMethodDto: SetDefaultPaymentMethodDto,
    requestId: string,
  ): Promise<void> {
    this.logger.log(
      'Setting the default payment method with arguments',
      `${AccountsService.name}#setDefaultPaymentMethod`,
      requestId,
      { setDefaultPaymentMethodDto },
    );

    const screenTracking: ScreenTracking =
      await this.screenTrackingRepository.findOne({
        where: {
          id: screenTrackingId,
        },
        relations: ['user'],
      });
    if (!screenTracking) {
      const errorMessage = `Screen tracking id ${screenTrackingId} not found`;
      this.logger.error(
        errorMessage,
        `${AccountsService.name}#setDefaultPaymentMethod`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }
    if (!screenTracking.user) {
      const errorMessage = `User for screen tracking id ${screenTrackingId} not found`;
      this.logger.error(
        errorMessage,
        `${AccountsService.name}#setDefaultPaymentMethod`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }

    const { accountId } = setDefaultPaymentMethodDto;
    const { user } = screenTracking;
    const account: Accounts = await this.accountsRepository.findOne({
      user: screenTracking.user,
      id: accountId,
    });
    if (!account) {
      const errorMessage = `Could not find account id ${accountId} for user id ${
        (user as User).id
      }`;
      this.logger.error(
        errorMessage,
        `${AccountsService.name}#setDefaultPaymentMethod`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }
    const cards: Cards[] = await this.cardsRepository.find({
      user: screenTracking.user,
    });

    if (!cards || cards.length <= 0) {
      await this.accountsRepository.update(
        { user },
        { isDefaultPaymentMethod: false },
      );
    } else {
      await Promise.all([
        this.accountsRepository.update(
          { user },
          { isDefaultPaymentMethod: false },
        ),
        this.cardsRepository.update(
          { user },
          { isDefaultPaymentMethod: false },
        ),
      ]);
    }

    await this.accountsRepository.update(
      { id: accountId },
      { isDefaultPaymentMethod: true },
    );

    this.logger.log(
      'Set the default payment method',
      `${AccountsService.name}#setDefaultPaymentMethod`,
      requestId,
    );
  }
}
