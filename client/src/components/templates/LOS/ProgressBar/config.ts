import { routes } from "../../../../routes/los/routes";

export const steps = [
  { route: routes.INCOME, number: 1, id: "1" },
  { route: routes.CHILDCARE, number: 2, id: "2" },
  { route: routes.PRE_APPROVAL, number: 3, id: "3" },
  { route: routes.ARGYLE, number: 4, id: "4" },
  { route: routes.FORGIVENESS, number: 5, id: "5" },
  { route: routes.FINANCING_APPLY, number: 6, id: "6" },
  { route: routes.OFFER, number: 7, id: "7" },
  { route: routes.OFFER_REVIEW, number: 7, id: "77" },
  { route: routes.PLAN_REVIEW, number: 7, id: "777" },
  { route: routes.CONTRACT, number: 8, id: "8" },
  { route: routes.COMPLETION, number: 9, id: "9" },
];

export const numberOfSteps = 9;

export const currentStep = (currentRoute: string) => {
  const curStep = steps.find((step) => step.route === currentRoute);
  if (curStep && curStep.number) {
    return curStep.number;
  }
  return 1;
};
