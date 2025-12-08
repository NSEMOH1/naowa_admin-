import { lazy } from "react";
import { Route } from "react-router-dom";
import { routes } from "../lib/routes.ts";
import { ProtectedRoute } from "../components/protectedRoutes.tsx";
import { UserRole } from "../lib/types.ts";

const Dashboard = lazy(() => import("../pages/dashboard/index.tsx"));
const Login = lazy(() => import("../pages/auth/login/index.tsx"));
const Register = lazy(() => import("../pages/auth/register/index.tsx"));
const Members = lazy(() => import("../pages/members/index.tsx"));
const Loan = lazy(() => import("../pages/loan/index.tsx"));
const Request = lazy(() => import("../pages/request/index.tsx"));
const Termination = lazy(() => import("../pages/termination/index.tsx"));
const NewMember = lazy(() => import("../pages/members/new.tsx"))
const Uploads = lazy(() => import("../pages/upload/index.tsx"));
const AccountManagement = lazy(
  () => import("../pages/account-management/index.tsx")
);
const Reports = lazy(() => import("../pages/report/index.tsx"));
const MonthlyDeductionReport = lazy(
  () => import("../pages/report/deduction/index.tsx")
);
const DividendReport = lazy(() => import("../pages/report/dividend/index.tsx"));
const FinancialReport = lazy(
  () => import("../pages/report/financial/index.tsx")
);
const InterestReport = lazy(() => import("../pages/report/interest/index.tsx"));
const IPPIS = lazy(() => import("../pages/report/ippis/index.tsx"));
const LoanRepaymentReport = lazy(
  () => import("../pages/report/repayment/index.tsx")
);
const Savings = lazy(() => import("../pages/savings/index.tsx"));
const Withdrawal = lazy(() => import("../pages/withdrawal/index.tsx"))
const Unauthorized = lazy(() => import("../pages/unauthorized/index.tsx"));

const ROUTE_PERMISSIONS = {
  dashboard: [UserRole.STAFF, UserRole.ADMIN],
  members: [UserRole.STAFF, UserRole.ADMIN],
  loans: [UserRole.ADMIN],
  request: [UserRole.STAFF, UserRole.ADMIN],
  termination: [UserRole.STAFF, UserRole.ADMIN],
  uploads: [UserRole.STAFF, UserRole.ADMIN],
  accountmanagement: [UserRole.ADMIN],
  report: [UserRole.ADMIN],
  savings: [UserRole.ADMIN],
  withdrawal: [UserRole.ADMIN],
};

export const sappersRoutes = () => {
  return (
    <>
      <Route index element={<Login />} />
      <Route path={routes.auth.register.index} element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route
        path={routes.dashboard.index}
        element={
          <ProtectedRoute allowedRoles={ROUTE_PERMISSIONS.dashboard}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path={routes.members.index}
        element={
          <ProtectedRoute allowedRoles={ROUTE_PERMISSIONS.members}>
            <Members />
          </ProtectedRoute>
        }
      />
      <Route
        path={routes.members.new}
        element={
          <ProtectedRoute allowedRoles={ROUTE_PERMISSIONS.members}>
            <NewMember />
          </ProtectedRoute>
        }
      />
      <Route
        path={routes.loan.index}
        element={
          <ProtectedRoute allowedRoles={ROUTE_PERMISSIONS.loans}>
            <Loan />
          </ProtectedRoute>
        }
      />
      <Route
        path={routes.request.index}
        element={
          <ProtectedRoute allowedRoles={ROUTE_PERMISSIONS.request}>
            <Request />
          </ProtectedRoute>
        }
      />
      <Route
        path={routes.termination.index}
        element={
          <ProtectedRoute allowedRoles={ROUTE_PERMISSIONS.termination}>
            <Termination />
          </ProtectedRoute>
        }
      />
      <Route
        path={routes.uploads.index}
        element={
          <ProtectedRoute allowedRoles={ROUTE_PERMISSIONS.uploads}>
            <Uploads />
          </ProtectedRoute>
        }
      />
      <Route
        path={routes.withdrawal.index}
        element={
          <ProtectedRoute allowedRoles={ROUTE_PERMISSIONS.withdrawal}>
            <Withdrawal />
          </ProtectedRoute>
        }
      />
      <Route
        path={routes.accountManagement.index}
        element={
          <ProtectedRoute allowedRoles={ROUTE_PERMISSIONS.accountmanagement}>
            <AccountManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path={routes.reports.index}
        element={
          <ProtectedRoute allowedRoles={ROUTE_PERMISSIONS.report}>
            <Reports />
          </ProtectedRoute>
        }
      />
      <Route
        path={routes.reports.deduction}
        element={
          <ProtectedRoute allowedRoles={ROUTE_PERMISSIONS.report}>
            <MonthlyDeductionReport />
          </ProtectedRoute>
        }
      />
      <Route
        path={routes.reports.dividend}
        element={
          <ProtectedRoute allowedRoles={ROUTE_PERMISSIONS.report}>
            <DividendReport />
          </ProtectedRoute>
        }
      />
      <Route
        path={routes.reports.financial}
        element={
          <ProtectedRoute allowedRoles={ROUTE_PERMISSIONS.report}>
            <FinancialReport />
          </ProtectedRoute>
        }
      />
      <Route
        path={routes.reports.interest}
        element={
          <ProtectedRoute allowedRoles={ROUTE_PERMISSIONS.report}>
            <InterestReport />
          </ProtectedRoute>
        }
      />
      <Route
        path={routes.reports.ippis}
        element={
          <ProtectedRoute allowedRoles={ROUTE_PERMISSIONS.report}>
            <IPPIS />
          </ProtectedRoute>
        }
      />
      <Route
        path={routes.reports.repayment}
        element={
          <ProtectedRoute allowedRoles={ROUTE_PERMISSIONS.report}>
            <LoanRepaymentReport />
          </ProtectedRoute>
        }
      />
      <Route
        path={routes.savings.index}
        element={
          <ProtectedRoute allowedRoles={ROUTE_PERMISSIONS.savings}>
            <Savings />
          </ProtectedRoute>
        }
      />
    </>
  );
};
