import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../../entities/user.entity';
import { Cards } from '../entities/cards.entity';
import { Accounts } from '../../accounts/entities/accounts.entity';
import { ScreenTracking } from '../../screen-tracking/entities/screen-tracking.entity';
import { LoggerService } from '../../../logger/services/logger.service';
import { AddCardDto } from '../validation/add-card.dto';
import { SetDefaultPaymentMethodDto } from '../validation/set-default-payment-method.dto';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Cards)
    private readonly cardsRepository: Repository<Cards>,
    @InjectRepository(ScreenTracking)
    private readonly screenTrackingRepository: Repository<ScreenTracking>,
    @InjectRepository(Accounts)
    private readonly accountsRepository: Repository<Accounts>,
    private readonly logger: LoggerService,
  ) {}

  async addCard(
    screenTrackingId: string,
    addCardDto: AddCardDto & { customerVaultId: string },
    requestId: string,
  ) {
    this.logger.log(
      'Adding card with arguments:',
      `${CardsService.name}#addCard`,
      requestId,
      addCardDto,
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
        `${CardsService.name}#addCard`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }
    if (!screenTracking.user) {
      const errorMessage = `User for screen tracking id ${screenTrackingId} not found`;
      this.logger.error(
        errorMessage,
        `${CardsService.name}#addCard`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }

    const user: User = screenTracking.user as User;
    const { cardNumber, isDefaultPaymentMethod } = addCardDto;
    const cardNumberLastFourDigits = cardNumber.substring(
      cardNumber.length - 4,
    );
    let card: Cards = this.cardsRepository.create({
      ...addCardDto,
      cardNumberLastFourDigits,
      user,
    });
    card = await this.cardsRepository.save(card);
    if (isDefaultPaymentMethod) {
      await this.setDefaultPaymentMethod(
        screenTrackingId,
        { cardId: card.id },
        requestId,
      );
    }

    const response = {
      user: user.id,
      id: card.id,
      cardNumberLastFourDigits,
    };
    this.logger.log(
      'Card added',
      `${CardsService.name}#addCard`,
      requestId,
      response,
    );

    return response;
  }

  async getUserCards(screenTrackingId: string, requestId: string) {
    this.logger.log(
      'Getting user cards with arguments',
      `${CardsService.name}#getUserCards`,
      requestId,
      { screenTrackingId },
    );
    const screenTracking: ScreenTracking =
      await this.screenTrackingRepository.findOne({
        where: { id: screenTrackingId },
        relations: ['user'],
      });

    if (!screenTracking) {
      const errorMessage = `Screen tracking id ${screenTrackingId} not found.`;
      this.logger.error(
        errorMessage,
        `${CardsService.name}#getUserCards`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }
    if (!screenTracking.user) {
      const errorMessage = `User not found for screen tracking id ${screenTrackingId}`;
      this.logger.error(
        errorMessage,
        `${CardsService.name}#getUserCards`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }

    const user = screenTracking.user as User;
    const cards: Cards[] = await this.cardsRepository.find({ user });

    const response = cards.map((card) => {
      return {
        customerVaultId: card.customerVaultId,
        cardNumberLastFour: card.cardNumberLastFourDigits,
        createdAt: card.createdAt,
        updatedAt: card.updatedAt,
        firstName: card.billingFirstName,
        lastName: card.billingLastName,
        cardExpiration: `${card.expirationMonth}/${card.expirationYear}`,
        isDefaultPaymentMethod: card.isDefaultPaymentMethod,
        id: card.id,
      };
    });
    this.logger.log(
      'Got user cards:',
      `${CardsService.name}#getUserCards`,
      requestId,
      response,
    );

    return response;
  }

  async setDefaultPaymentMethod(
    screenTrackingId: string,
    setDefaultPaymentMethodDto: SetDefaultPaymentMethodDto,
    requestId: string,
  ): Promise<void> {
    this.logger.log(
      'Setting the default payment method with arguments',
      `${CardsService.name}#setDefaultPaymentMethod`,
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
        `${CardsService.name}#setDefaultPaymentMethod`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }
    if (!screenTracking.user) {
      const errorMessage = `User for screen tracking id ${screenTrackingId} not found`;
      this.logger.error(
        errorMessage,
        `${CardsService.name}#setDefaultPaymentMethod`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }

    const { cardId } = setDefaultPaymentMethodDto;
    const { user } = screenTracking;
    const card: Cards = await this.cardsRepository.findOne({
      user: screenTracking.user,
      id: cardId,
    });
    if (!card) {
      const errorMessage = `Could not find card id ${cardId} for user id ${
        (user as User).id
      }`;
      this.logger.error(
        errorMessage,
        `${CardsService.name}#setDefaultPaymentMethod`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }
    const accounts: Accounts[] = await this.accountsRepository.find({
      user: screenTracking.user,
    });
    if (!accounts || accounts.length <= 0) {
      await this.cardsRepository.update(
        { user },
        { isDefaultPaymentMethod: false },
      );
    } else {
      await Promise.all([
        this.cardsRepository.update(
          { user },
          { isDefaultPaymentMethod: false },
        ),
        this.accountsRepository.update(
          { user },
          { isDefaultPaymentMethod: false },
        ),
      ]);
    }

    await this.cardsRepository.update(
      { id: cardId },
      { isDefaultPaymentMethod: true },
    );

    this.logger.log(
      'Set the default payment method',
      `${CardsService.name}#setDefaultPaymentMethod`,
      requestId,
    );
  }
}
