export interface ILoanTiers {
  active: boolean;
  apr: number;
  downPayment: number;
  ficoMax: number;
  ficoMin: number;
  contractAmount: number;
  merchantDiscountRate: number;
  paymentDiscountRate: number;
  minAnnualIncome: number;
  name: string;
}

export interface ILoanSettings {
  active: boolean;
  loanTerm: number;
  tiers: ILoanTiers[];
  activeStates: 'all'[];
}

export interface IMerchantTerms {
  loanSettings: ILoanSettings[];
  downPaymentType: 'dollarAmount' | 'percentage';
}
