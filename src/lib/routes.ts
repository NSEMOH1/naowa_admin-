export const routes = {
  index: "/",
  auth: {
    register: {
      index: "/auth/register",
    },
    login: "/auth/login",
    forgotPassword: "/auth/forgot-password",
  },
  dashboard: {
    index: "/dashboard",
  },
  members: {
    index: "/members",
    createCivilian: "/members/civilian",
    createPersonel: "/members/personel",
  },
  loan: {
    index: "/loan",
  },
  request: {
    index: "/request",
  },
  termination: {
    index: "/termination",
  },
  uploads: {
    index: "/upload",
  },
  accountManagement: {
    index: "/account-management",
  },
  reports: {
    index: "/report",
    deduction: "/report/deduction",
    dividend: "/report/dividend",
    financial: "/report/financial",
    interest: "/report/interest",
    ippis: "/report/ippis",
    repayment: "/report/repayment",
  },
  savings: {
    index: "/savings"
  }
};
