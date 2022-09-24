import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import moment from 'moment';
import { nanoid } from 'nanoid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';

import { PaymentManagement } from '../entities/payment-management.entity';
import { UserConsent } from '../../../../user/consent/entities/consent.entity';
import { MathExtService } from '../../../mathext/services/mathext.service';
import { CountersService } from '../../../../counter/services/counters.service';
import { LoggerService } from '../../../../logger/services/logger.service';
import { ScreenTracking } from '../../../../user/screen-tracking/entities/screen-tracking.entity';
import { IPaymentScheduleItem } from '../interfaces/payment-schedule-item.interface';
import { LedgerService } from '../../../ledger/services/ledger.service';
import { ChangePaymentAmountDto } from '../validation/change-payment-amount.dto';
import { PaymentService } from '../../../../user/payments/services/payment.service';

@Injectable()
export class PaymentManagementService {
  constructor(
    @InjectRepository(PaymentManagement)
    private readonly paymentManagementRepository: Repository<PaymentManagement>,
    @InjectRepository(UserConsent)
    private readonly userConsentRepository: Repository<UserConsent>,
    @InjectRepository(ScreenTracking)
    private readonly screenTrackingRepository: Repository<ScreenTracking>,
    private readonly mathExtService: MathExtService,
    private readonly ledgerService: LedgerService,
    private readonly countersService: CountersService,
    private readonly paymentService: PaymentService,
    private readonly logger: LoggerService,
  ) {}

  async createLoanPaymentSchedule(
    screenTracking: ScreenTracking,
    requestId: string,
  ) {
    this.logger.log(
      'Creating payment schedule with arguments',
      `${PaymentManagementService.name}#createLoanPaymentSchedule`,
      requestId,
      screenTracking,
    );
    const paymentManagement: PaymentManagement =
      await this.paymentManagementRepository.findOne({
        where: { screenTracking: screenTracking.id },
      });
    if (!paymentManagement) {
      const errorMessage = `Payment management for screen tracking id ${screenTracking.id} not found`;
      this.logger.error(
        errorMessage,
        `${PaymentManagementService.name}#createLoanPaymentSchedule`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }

    const { selectedOffer } = screenTracking;
    const maturityDate = moment()
      .startOf('day')
      .add(selectedOffer.term, 'months')
      .toDate();
    const paymentSchedule: any[] = this.getLoanPaymentSchedule(
      screenTracking,
      false,
      requestId,
    );
    const loanReferenceData = await this.countersService.getNextSequenceValue(
      'loan',
      requestId,
    );

    const paymentManagementObject: Partial<PaymentManagement> = {
      apr: selectedOffer.apr,
      canRunAutomaticPayment: true,
      currentPaymentAmount: selectedOffer.monthlyPayment,
      initialPaymentSchedule: paymentSchedule,
      interestApplied: selectedOffer.apr,
      loanReference: `LN_${loanReferenceData.sequenceValue}`,
      loanStartDate: moment().startOf('day').toDate(),
      loanTermCount: selectedOffer.term,
      maturityDate: maturityDate,
      minimumPaymentAmount: selectedOffer.monthlyPayment,
      nextPaymentSchedule: moment
        .utc()
        .add(1, 'months')
        .startOf('day')
        .toDate(),
      paymentSchedule,
      payOffAmount: selectedOffer.contractAmount,
      principalAmount: selectedOffer.contractAmount,
      status: screenTracking.isBackendApplication
        ? 'request-funds'
        : 'in-repayment prime',
    };
    await this.paymentManagementRepository.update(
      { id: paymentManagement.id },
      paymentManagementObject,
    );
    this.logger.log(
      'Payment schedule created',
      `${PaymentManagementService.name}#createLoanPaymentSchedule`,
      requestId,
      paymentManagement,
    );

    this.logger.log(
      'Updating user consent agreement with arguments',
      `${PaymentManagementService.name}#createLoanPaymentSchedule`,
      requestId,
      { paymentManagement: paymentManagement.id },
    );
    const userConsentAgreements: UpdateResult =
      await this.userConsentRepository.update(
        { screenTracking: screenTracking.user },
        {
          paymentManagement: paymentManagement.id,
        },
      );

    this.logger.log(
      'User consent agreements updated:',
      `${PaymentManagementService.name}#createLoanPaymentSchedule`,
      requestId,
      userConsentAgreements,
    );

    return paymentManagement;
  }

  getLoanPaymentSchedule(
    screenTracking: ScreenTracking,
    forRIC = false,
    requestId: string,
  ): IPaymentScheduleItem[] {
    this.logger.log(
      'Creating payment schedule with arguments',
      `${PaymentManagementService.name}#getLoanPaymentSchedule`,
      requestId,
      { screenTracking, forRIC },
    );
    const selectedOffer = screenTracking.selectedOffer;
    const contractAmount = selectedOffer.contractAmount;
    const loanInterestRate = selectedOffer.apr;
    const monthlyPayment = selectedOffer.monthlyPayment;
    const loanTerm = selectedOffer.term;
    const paymentSchedule: IPaymentScheduleItem[] = [];
    const amortizationSchedule = this.mathExtService.makeAmortizationSchedule(
      contractAmount,
      monthlyPayment,
      loanInterestRate,
      loanTerm,
      requestId,
    );
    amortizationSchedule.schedule.forEach((item) => {
      paymentSchedule.push({
        amount: item.payment,
        date: moment().startOf('day').add(item.id, 'months').toDate(),
        endPrincipal: item.endBalance,
        fees: 0,
        interest: item.interest,
        month: item.id,
        paidFees: 0,
        paidInterest: 0,
        paidPastDueInterest: 0,
        paidPrincipal: 0,
        pastDueInterest: 0,
        payment: 0,
        paymentType: 'automatic',
        principal: item.principal,
        startPrincipal: item.startBalance,
        status: 'opened',
        transactionId: nanoid(10),
      });
    });
    this.logger.log(
      'Payment schedule created:',
      `${PaymentManagementService.name}#getLoanPaymentSchedule`,
      requestId,
      paymentSchedule,
    );

    return paymentSchedule;
  }

  async createPaymentManagement(
    screenTracking: ScreenTracking,
    status: 'approved' | 'pending',
    requestId: string,
  ) {
    const existingPaymentManagement: PaymentManagement =
      await this.paymentManagementRepository.findOne({
        where: { screenTracking: screenTracking.id },
        relations: ['merchant'],
      });
    if (existingPaymentManagement) {
      const errorMessage = `Payment management for screen tracking id ${screenTracking.id} already exists`;
      this.logger.error(
        errorMessage,
        `${PaymentManagementService.name}#createPaymentManagement`,
        requestId,
      );
      throw new BadRequestException(undefined, errorMessage);
    }

    const paymentObj: Partial<PaymentManagement> = {
      merchant: screenTracking.merchant,
      screenTracking: screenTracking.id,
      status,
      user: screenTracking.user,
    };
    this.logger.log(
      'Creating payment Management with arguments',
      `${PaymentManagementService.name}#createPaymentManagement`,
      requestId,
      paymentObj,
    );
    const paymentManagement =
      this.paymentManagementRepository.create(paymentObj);
    await this.paymentManagementRepository.save(paymentManagement);
  }

  async setInRepaymentNonPrimeStatus(userId: string, requestId: string) {
    const screenTrackingDocument = await this.screenTrackingRepository.findOne({
      user: userId,
    });
    if (!screenTrackingDocument) {
      const errorMessage = `Could not find screen tracking for user id: ${userId}`;
      this.logger.error(
        errorMessage,
        `${PaymentManagementService.name}#setInRepaymentStatus`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }

    const { selectedOffer: offerData } = screenTrackingDocument;
    if (!offerData.downPayment || offerData.downPayment <= 0) {
      return;
    }

    await this.paymentManagementRepository.update(
      {
        screenTracking: screenTrackingDocument.id,
      },
      { status: 'in-repayment non-prime' },
    );
  }

  async getPaymentSchedule(screenTrackingId: string, requestId: string) {
    const paymentManagement: PaymentManagement | null =
      await this.paymentManagementRepository.findOne({
        screenTracking: screenTrackingId,
      });
    const screenTracking: ScreenTracking | null =
      await this.screenTrackingRepository.findOne(screenTrackingId);
    if (!paymentManagement) {
      const errorMessage = `Payment schedule not found for payment management id ${paymentManagement.id}`;
      this.logger.log(
        errorMessage,
        `${PaymentManagementService.name}#getPaymentSchedule`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }

    const { status } = paymentManagement;
    if (status === 'approved' || status === 'pending' || status === 'expired') {
      return paymentManagement;
    }

    const ledger = this.ledgerService.getPaymentLedger(
      paymentManagement,
      moment().startOf('day').toDate(),
      requestId,
    );
    paymentManagement.payOffAmount = ledger.payoff;
    paymentManagement.screenTracking = screenTracking;

    return paymentManagement;
  }

  async changeMonthlyPaymentAmount(
    changePaymentAmountDto: ChangePaymentAmountDto,
    requestId: string,
  ) {
    const { screenTracking, amount } = changePaymentAmountDto;
    const paymentManagement: PaymentManagement | null =
      await this.paymentManagementRepository.findOne({
        screenTracking,
      });
    if (!paymentManagement) {
      const errorMessage = `Payment schedule not found for payment management id ${paymentManagement}`;
      this.logger.log(
        errorMessage,
        `${PaymentManagementService.name}#changeMonthlyPaymentAmount`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }

    const { minimumPaymentAmount, payOffAmount } = paymentManagement;
    if (amount < minimumPaymentAmount || amount > payOffAmount) {
      const errorMessage = `Amount should be higher than ${minimumPaymentAmount} and lower than ${payOffAmount}`;
      this.logger.error(
        errorMessage,
        `${PaymentManagementService.name}#changeMonthlyPaymentAmount`,
        requestId,
      );
      throw new BadRequestException(undefined, errorMessage);
    }

    const newPaymentSchedule = this.paymentService.amortizeSchedule(
      amount,
      paymentManagement,
      requestId,
    );

    await this.paymentManagementRepository.update(paymentManagement.id, {
      currentPaymentAmount: amount,
      paymentSchedule: newPaymentSchedule,
    });
  }
}
