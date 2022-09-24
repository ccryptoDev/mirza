type IStatus = {
  APPROVED: string;
  PENDING: string;
  DENIED: string;
  EXPIRED: string;
  IN_REPAYMENT: string;
  PAID: string;
  FUNDED: string;
  ALL: string[];
};

export const tStatus: IStatus = {
  APPROVED: "approved",
  PENDING: "pending",
  DENIED: "denied",
  EXPIRED: "expired",
  IN_REPAYMENT: "repayment",
  PAID: "paid",
  FUNDED: "funded",
  ALL: ["approved", "pending", "denied", "expired", "funded"],
};

type IFilter = {
  APPROVED: string;
  PENDING: string;
  DENIED: string;
  EXPIRED: string;
  IN_REPAYMENT: string;
  PAID: string;
  FUNDED: string;
  ALL: string;
};

export const tFilter: IFilter = {
  APPROVED: "Approved",
  PENDING: "Pending",
  DENIED: "Denied",
  EXPIRED: "Expired",
  IN_REPAYMENT: "In-Repayment",
  PAID: "Paid",
  FUNDED: "Funded",
  ALL: "All",
};

type IType = {
  MANAGE_USERS: string;
};

export const tType: IType = {
  MANAGE_USERS: "MANAGE_USERS",
};
