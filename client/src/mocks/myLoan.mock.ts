import { ReactComponent as CoinsStackIcon } from "../assets/svgs/illustrations/accounting-coins-stack-1.svg";
import { ReactComponent as CoinsStack2Icon } from "../assets/svgs/illustrations/accounting-coins-stack.svg";
import { ReactComponent as CoinStashIcon } from "../assets/svgs/illustrations/cash-payment-coin-stash.svg";

export const vestingSchedule = [
  {
    id: 1,
    title: "Year 1",
    loanAmount: 1000,
    forgivenPerYear: {
      percent: 25,
      amount: 250,
    },
  },
  {
    id: 2,
    title: "Year 2",
    loanAmount: 1000,
    forgivenPerYear: {
      percent: 25,
      amount: 250,
    },
  },
  {
    id: 3,
    title: "Year 3",
    loanAmount: 1000,
    forgivenPerYear: {
      percent: 25,
      amount: 250,
    },
  },
];

export const summaryData = [
  {
    icon: CoinsStack2Icon,
    label: "Total loan amount",
    amount: 3000,
    color: "var(--color-purple-4)",
  },
  {
    icon: CoinStashIcon,
    label: "Amount forgiven per month",
    amount: 250,
    color: "var(--color-green-4)",
  },
  {
    icon: CoinsStackIcon,
    label: "Total forgiveness amount",
    amount: 750,
    color: "var(--color-orange-4)",
  },
];

export const payments = {
  UPCOMING: [
    { id: 1, date: "Oct 11, 2021", method: "Credit Card", status: "UPCOMING" },
    { id: 2, date: "Oct 11, 2021", method: "Credit Card", status: "UPCOMING" },
    { id: 3, date: "Oct 11, 2021", method: "Credit Card", status: "UPCOMING" },
    { id: 4, date: "Oct 11, 2021", method: "Credit Card", status: "UPCOMING" },
    { id: 5, date: "Oct 11, 2021", method: "Credit Card", status: "UPCOMING" },
  ],
  PAST: [
    { id: 6, date: "Oct 11, 2021", method: "Credit Card", status: "PAST_DUE" },
    { id: 7, date: "Oct 11, 2021", method: "Credit Card", status: "PAST_DUE" },
    { id: 8, date: "Oct 11, 2021", method: "Credit Card", status: "PAID" },
    { id: 9, date: "Oct 11, 2021", method: "Credit Card", status: "PAID" },
    { id: 10, date: "Oct 11, 2021", method: "Credit Card", status: "PAID" },
  ],
};

export const currentTransactions = [
  {
    month: "01",
    date: "14 Mar 2022",
    disbursement: "$200",
    repayment: "-",
    loanBalance: "$200",
    paymentRef: "Disbursement 01",
  },
  {
    month: "02",
    date: "04 Apr 2022",
    disbursement: "$200",
    repayment: "-",
    loanBalance: "$400",
    paymentRef: "Disbursement 02",
  },
  {
    month: "03",
    date: "18 Apr 2022",
    disbursement: "$200",
    repayment: "-",
    loanBalance: "$600",
    paymentRef: "Disbursement 03",
  },
];

export const futureTransactions = [
  {
    month: "03",
    date: "02 May 2022",
    disbursement: "$200",
    repayment: "-",
    loanBalance: "$800",
    paymentRef: "Disbursement 04",
  },
  {
    month: "03",
    date: "16 May 2022",
    disbursement: "$200",
    repayment: "-",
    loanBalance: "$1,000",
    paymentRef: "Disbursement 05",
  },
  {
    month: "03",
    date: "30 May 2022",
    disbursement: "$200",
    repayment: "-",
    loanBalance: "$1,200",
    paymentRef: "Disbursement 06",
  },
];
