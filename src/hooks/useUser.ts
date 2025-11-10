import { useState } from "react";
import type {
    UsersParams,
    PaginationState,
    UseUsersDataReturn,
    IAdminUser,
} from "../lib/types";
import { fetchUsers } from "../api/user";

export const useUsersData = (): UseUsersDataReturn => {
    const [users, setUsers] = useState<IAdminUser[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<PaginationState>({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    });

    const loadUsers = async (params: UsersParams = {}): Promise<void> => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetchUsers({
                page: params.page?.toString(),
                limit: params.limit?.toString(),
                search: params.search,
                sortBy: params.sortBy,
                sortOrder: params.sortOrder,
                role: params.role,
                status: params.status,
                createdAfter: params.createdAfter,
                createdBefore: params.createdBefore,
            });

            setUsers(response.users);
            setPagination({
                page: response.pagination.currentPage,
                limit: 10,
                total: response.pagination.totalUsers,
                totalPages: response.pagination.totalPages,
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
            console.error("Failed to load users:", err);
        } finally {
            setLoading(false);
        }
    };

    return {
        users,
        loading,
        error,
        pagination,
        loadUsers,
    };
};