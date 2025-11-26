export const UserRole = {
  STAFF: "STAFF",
  ADMIN: "ADMIN",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface Loan {
  id: string | number;
  category: {
    name: string;
  };
  amount: string;
  approvedAmount: string;
  status: string;
  interestRate: number;
  durationMonths: number;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
  member: {
    full_name: string;
  };
  reference: string;
  approvedBy: {
    id: string;
    full_name: string;
    email: string;
  };
  rejectedBy: {
    id: string;
    full_name: string;
    email: string;
  };
}

export interface LoansResponse {
  result: Loan[];
}

export interface SavingsResponse {
  success: boolean;
  savings: Savings[];
  total: number;
}

export interface Savings {
  id: string | number;
  category: {
    name: string;
  };
  status: string;
  amount: string;
  createdAt: string;
  member: {
    full_name: string;
    email: string;
    phone: string;
  };
  reference: string;
}

export interface ChartData {
  month: string;
  approved: number;
  rejected: number;
  pending: number;
}

export interface DashboardCard {
  id: number;
  title: string;
  icon: any;
  count: string;
  color: string;
  percentage: string;
}

export interface TableColumn<T> {
  title: string;
  dataIndex: keyof T;
  key: string;
  render?: (value: any, record: T) => React.ReactNode;
  sorter?: (a: T, b: T) => number;
  filters?: { text: string; value: any }[];
  onFilter?: (value: any, record: T) => boolean;
  width?: number | string;
}

export interface Member {
  id: string | number;
  email: string;
  full_name: string;
  username: string;
  place_of_work: string;
  occupation: string;
  spouse_name: string;
  marital_status: string;
  gender: string;
  phone: string;
  address: string;
  state_of_origin: string;
  role: string;
  type: string;
  lga: string;
  date_of_birth: string;
  created_at: string;
  updated_at: string;
  profile_picture: string;
  totalSavings: number;
  monthlyDeduction: number;
  service_number: string;
  status: "APPROVED" | "REJECTED" | "PENDING" | "ACTIVE" | "INACTIVE";
  bank: [{ account_number: string; name: string }];
}

export interface MembersResponse {
  success: boolean;
  users: Member[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalMembers: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface MembersParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "created_at" | "email" | "first_name" | "last_name";
  sortOrder?: "asc" | "desc";
  role?: string;
  createdAfter?: string;
  createdBefore?: string;
  status?: "APPROVED" | "REJECTED" | "PENDING" | "ACTIVE" | "INACTIVE";
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UseMembersDataReturn {
  members: Member[];
  loading: boolean;
  error: string | null;
  pagination: PaginationState;
  loadMembers: (params?: MembersParams) => Promise<void>;
}

export interface UploadLog {
  id: string;
  fileName: string;
  uploadType: string;
  processedTime: string;
  processedItems: number;
  failedItems: number;
  date: string;
  status: "COMPLETED" | "FAILED" | "PROCESSING";
}

export interface UploadResult {
  success: boolean;
  processedCount: number;
  errorCount: number;
  errors: Array<{
    row: number;
    serviceNumber?: string;
    error: string;
  }>;
  summary: {
    totalAmount: number;
    validRecords: number;
    invalidRecords: number;
  };
}

export interface IAdminUser {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface UsersParams {
  page?: string;
  limit?: string;
  search?: string;
  sortBy?: "created_at" | "email";
  sortOrder?: "asc" | "desc";
  role?: string;
  status?: string;
  createdAfter?: string;
  createdBefore?: string;
}

export interface UseUsersDataReturn {
  users: IAdminUser[];
  loading: boolean;
  error: string | null;
  pagination: PaginationState;
  loadUsers: (params?: UsersParams) => Promise<void>;
}

export interface Withdrawal {
  id: string;
  reference: string;
  amount: number | string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";
  reason?: string | null;
  rejectionReason?: string | null;
  requestedAt: string;
  approvedAt?: string | null;
  rejectedAt?: string | null;
  member: {
    id: string;
    full_name: string;
    email: string;
    phone: string;
  };
  category: {
    id: string;
    name: string;
    type: string;
  };
}