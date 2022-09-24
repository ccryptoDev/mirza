import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ScreenTracking } from '../../../user/screen-tracking/entities/screen-tracking.entity';
import { LoggerService } from '../../../logger/services/logger.service';
import { MathExtService } from '../../../loan/mathext/services/mathext.service';
import { Merchant } from '../../../admin/merchant/entities/merchant.entity';
import { SelectOfferDto } from '../validation/selectOffer.dto';
import {
  ILoanTiers,
  ILoanSettings,
} from '../../../admin/merchant/interfaces/MerchantTerms';
import Offer from '../interfaces/Offer';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(ScreenTracking)
    private readonly screenTrackingRepository: Repository<ScreenTracking>,
    @InjectRepository(Merchant)
    private readonly merchantRepository: Repository<Merchant>,
    private readonly mathExtService: MathExtService,
    private readonly logger: LoggerService,
  ) {}

  calcMonthlyPayment(
    apr = 0,
    contractAmount = 0,
    downPayment = 0,
    term = 0,
    requestId: string,
  ) {
    this.logger.log(
      'Calculating monthly payment with arguments',
      `${OffersService.name}#calcMonthlyPayment`,
      requestId,
      { apr, contractAmount, term },
    );
    const decimalRate = apr / 100 / 12;
    const xPowerVal = decimalRate + 1;
    const financedAmount = contractAmount - downPayment;
    if (!term || isNaN(term)) {
      return {
        decimalRate,
        xPowerVal,
        financeCharge: null, // depend on "term"
        decimalAmount: null,
        fullNumberAmount: null,
        totalLoanAmount: null,
        powerRateVal: null,
        monthlyPayment: null,
      };
    }

    let financeCharge = 0;
    let monthlyPayment = financedAmount / term;
    let totalLoanAmount = financedAmount;
    const powerRateVal = Math.pow(xPowerVal, term) - 1;
    if (apr) {
      monthlyPayment = parseFloat(
        ((decimalRate + decimalRate / powerRateVal) * financedAmount).toFixed(
          2,
        ),
      );
      const amortizationSchedule = this.mathExtService.makeAmortizationSchedule(
        financedAmount,
        monthlyPayment,
        apr,
        term,
        requestId,
      );
      if (amortizationSchedule.interestPaid)
        financeCharge = this.mathExtService.float(
          amortizationSchedule.interestPaid,
        );
      totalLoanAmount = this.mathExtService.float(
        financedAmount + financeCharge + downPayment,
      );
    }

    monthlyPayment = parseFloat(parseFloat(String(monthlyPayment)).toFixed(2));
    totalLoanAmount = parseFloat(
      parseFloat(String(totalLoanAmount)).toFixed(2),
    );
    financeCharge = parseFloat(parseFloat(String(financeCharge)).toFixed(2));
    const monthlyPaymentArray = monthlyPayment.toFixed(2).split('.');
    let fullNumberAmount = '0';
    let decimalAmount = '.00';
    if (monthlyPaymentArray[0]) {
      fullNumberAmount = monthlyPaymentArray[0];
    }
    if (monthlyPaymentArray[1]) {
      decimalAmount = `.${monthlyPaymentArray[1]}`;
    }

    const result = {
      decimalRate,
      xPowerVal,
      financeCharge,
      decimalAmount,
      fullNumberAmount,
      totalLoanAmount,
      powerRateVal,
      monthlyPayment,
    };
    this.logger.log(
      'Calculated monthly payment:',
      `${OffersService.name}#calcMonthlyPayment`,
      requestId,
      result,
    );

    return result;
  }

  async getOffers(
    screenTrackingId: string,
    requestId: string,
  ): Promise<Offer[]> {
    this.logger.log(
      'Getting merchant offers with arguments',
      `${OffersService.name}#getMerchantOffers`,
      requestId,
      { screenTrackingDocument: screenTrackingId },
    );

    const screenTracking: ScreenTracking =
      await this.screenTrackingRepository.findOne({
        where: {
          id: screenTrackingId,
        },
        relations: ['merchant'],
      });
    if (!screenTracking) {
      const errorMessage = `Screen tracking id ${screenTracking.id} not found`;
      this.logger.error(
        errorMessage,
        `${OffersService.name}#getOffers`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }
    if (!screenTracking.merchant) {
      const errorMessage = `Merchant not found for screen tracking id ${screenTracking.id}`;
      this.logger.error(
        errorMessage,
        `${OffersService.name}#getOffers`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }

    const merchant: Merchant = await this.merchantRepository.findOne({
      where: {
        id: (screenTracking.merchant as Merchant).id,
      },
      relations: ['terms'],
    });
    const { terms } = merchant;
    const offers = terms.loanSettings
      .filter((loanSetting) => loanSetting.active)
      .map((term: ILoanSettings) => {
        const { tiers } = term;
        const firstActiveTier: ILoanTiers = tiers.find(
          (activeTier: ILoanTiers) => activeTier.active,
        );

        const { downPaymentType } = terms;
        const { apr, contractAmount } = firstActiveTier;
        let { downPayment } = firstActiveTier;
        if (downPayment > 0 && downPaymentType === 'percentage') {
          downPayment = (contractAmount * downPayment) / 100;
        }

        const { monthlyPayment } = this.calcMonthlyPayment(
          apr,
          contractAmount,
          downPayment,
          term.loanTerm,
          requestId,
        );

        return {
          term: term.loanTerm,
          apr,
          downPayment,
          contractAmount,
          monthlyPayment,
        };
      });

    return offers;
  }

  async selectOffer(
    screenTrackingId: string,
    selectOfferDto: SelectOfferDto,
    requestId: string,
  ) {
    this.logger.log(
      'Selecting offer with arguments',
      `${OffersService.name}#selectOffer`,
      requestId,
      selectOfferDto,
    );
    const { term } = selectOfferDto;
    const screenTracking: ScreenTracking =
      await this.screenTrackingRepository.findOne({
        where: {
          id: screenTrackingId,
        },
        relations: ['merchant'],
      });
    if (!screenTracking) {
      const errorMessage = `Screen tracking id ${screenTracking} not found`;
      this.logger.error(
        errorMessage,
        `${OffersService.name}#selectOffer`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }
    if (!screenTracking.merchant) {
      const errorMessage = `Merchant not found for screen tracking id ${screenTrackingId}`;
      this.logger.error(
        errorMessage,
        `${OffersService.name}#selectOffer`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }

    const { merchant } = screenTracking;
    const { terms } = await this.merchantRepository.findOne({
      where: {
        id: (merchant as Merchant).id,
      },
      relations: ['terms'],
    });
    const selectedLoanSetting: ILoanSettings = terms.loanSettings.find(
      (loanSetting: ILoanSettings): boolean => loanSetting.loanTerm === term,
    );
    if (!selectedLoanSetting || !selectedLoanSetting.active) {
      const errorMessage = `Could not find offer for loan term ${term} or it's not active for this merchant`;
      this.logger.error(
        errorMessage,
        `${OffersService.name}#selectOffer`,
        requestId,
      );
      throw new NotFoundException(undefined, errorMessage);
    }

    const activeTier: ILoanTiers = selectedLoanSetting.tiers.find(
      (tier: ILoanTiers): boolean => tier.active,
    );
    const { downPaymentType } = terms;
    const { apr, contractAmount } = activeTier;
    let { downPayment } = activeTier;
    if (downPayment > 0 && downPaymentType === 'percentage') {
      downPayment = (contractAmount * downPayment) / 100;
    }

    const { monthlyPayment } = this.calcMonthlyPayment(
      apr,
      contractAmount,
      downPayment,
      selectedLoanSetting.loanTerm,
      requestId,
    );
    const selectedOffer: Offer = {
      apr: activeTier.apr,
      downPayment,
      contractAmount: activeTier.contractAmount,
      monthlyPayment,
      term: selectedLoanSetting.loanTerm,
    };

    await this.screenTrackingRepository.update(
      { id: screenTracking.id },
      { selectedOffer },
    );
  }
}
