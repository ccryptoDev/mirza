export const BASE_ROUTE = "/borrower";

export const pageName = {
  MY_LOAN: "my-loan",
};

const { MY_LOAN } = pageName;

export const routes = {
  DASHBOARD: `${BASE_ROUTE}`,
  MY_LOAN: `${BASE_ROUTE}/${MY_LOAN}`,
};
