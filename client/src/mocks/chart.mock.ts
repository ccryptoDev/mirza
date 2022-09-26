type LoanOverviewParams = {
  month: string;
  loanRepaymentAmount?: number;
  outstandingAmount?: number;
};

export const loanOverviewChartData: LoanOverviewParams[] = [
  {
    month: "Jan",
  },
  {
    month: "Fev",
  },
  {
    month: "Mar",
  },
  {
    month: "Apr",
  },
  {
    month: "May",
  },
  {
    month: "Jun",
    loanRepaymentAmount: 100,
  },
  {
    month: "Jul",
    loanRepaymentAmount: 95,
    outstandingAmount: 2800,
  },
  {
    month: "Aug",
    loanRepaymentAmount: 95,
    outstandingAmount: 2700,
  },
  {
    month: "Sep",
    loanRepaymentAmount: 95,
    outstandingAmount: 2600,
  },
  {
    month: "Oct",
    loanRepaymentAmount: 95,
    outstandingAmount: 2500,
  },
  {
    month: "Nov",
    loanRepaymentAmount: 70,
    outstandingAmount: 2400,
  },
  {
    month: "Dec",
    outstandingAmount: 2300,
  },
];
