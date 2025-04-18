export const BASE_ROUTE = "/application";

export const pageName = {
  LOGIN: "login",
  FORGOT_PASSWORD: "password-recover",
  INCOME: "apply",
  CHILDCARE: "childcare",
  PRE_APPROVAL: "pre-approval",
  ARGYLE: "argyle",
  FORGIVENESS: "forgiveness",
  FORGIVENESS_FULL: "forgiveness-full",
  FORGIVENESS_PARTIAL: "forgiveness-partial",
  FINANCING_APPLY: "financing-apply",
  OFFER: "offer",
  OFFER_REVIEW: "offer-review",
  PLAN_REVIEW: "plan-review",
  CONTRACT: "contract",
  COMPLETION: "completion",
};

const {
  LOGIN,
  FORGOT_PASSWORD,
  CHILDCARE,
  ARGYLE,
  INCOME,
  PRE_APPROVAL,
  FORGIVENESS,
  FORGIVENESS_FULL,
  FORGIVENESS_PARTIAL,
  FINANCING_APPLY,
  OFFER,
  OFFER_REVIEW,
  PLAN_REVIEW,
  CONTRACT,
  COMPLETION,
} = pageName;

export const routes = {
  HOME: `${BASE_ROUTE}/`,
  LOGIN: `${BASE_ROUTE}/${LOGIN}`,
  FORGOT_PASSWORD: `${BASE_ROUTE}/${FORGOT_PASSWORD}`,
  INCOME: `${BASE_ROUTE}/${INCOME}`,
  CHILDCARE: `${BASE_ROUTE}/${CHILDCARE}`,
  FORGIVENESS: `${BASE_ROUTE}/${FORGIVENESS}`,
  FORGIVENESS_FULL: `${BASE_ROUTE}/${FORGIVENESS_FULL}`,
  FORGIVENESS_PARTIAL: `${BASE_ROUTE}/${FORGIVENESS_PARTIAL}`,
  PRE_APPROVAL: `${BASE_ROUTE}/${PRE_APPROVAL}`,
  ARGYLE: `${BASE_ROUTE}/${ARGYLE}`,
  FINANCING_APPLY: `${BASE_ROUTE}/${FINANCING_APPLY}`,
  OFFER: `${BASE_ROUTE}/${OFFER}`,
  OFFER_REVIEW: `${BASE_ROUTE}/${OFFER_REVIEW}`,
  PLAN_REVIEW: `${BASE_ROUTE}/${PLAN_REVIEW}`,
  CONTRACT: `${BASE_ROUTE}/${CONTRACT}`,
  COMPLETION: `${BASE_ROUTE}/${COMPLETION}`,
};
