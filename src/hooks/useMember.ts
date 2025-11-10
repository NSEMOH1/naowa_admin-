import { useState } from "react";
import type {
  Member,
  MembersParams,
  PaginationState,
  UseMembersDataReturn,
} from "../lib/types";
import { fetchMembers } from "../api/members";

export const useMembersData = (): UseMembersDataReturn => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const loadMembers = async (params: MembersParams = {}): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchMembers(params);
      setMembers(response.users);
      setPagination({
        page: response.pagination.currentPage,
        limit: 10,
        total: response.pagination.totalMembers,
        totalPages: response.pagination.totalPages,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return {
    members,
    loading,
    error,
    pagination,
    loadMembers,
  };
};
