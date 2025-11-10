import api from ".";
import type { IAdminUser } from "../lib/types";

interface UsersQueryParams {
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

interface UsersResponse {
    success: boolean;
    users: IAdminUser[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalUsers: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}

export const fetchUsers = async (
    params: UsersQueryParams = {}
): Promise<UsersResponse> => {
    try {
        const {
            page = 1,
            limit = 10,
            search = "",
            sortBy = "created_at",
            sortOrder = "desc",
            role,
            status,
            createdAfter,
            createdBefore,
        } = params;

        const response = await api.get<UsersResponse>("/api/users", {
            params: {
                page,
                limit,
                search,
                sortBy,
                sortOrder,
                ...(role && { role }),
                ...(status && { status }),
                ...(createdAfter && { createdAfter }),
                ...(createdBefore && { createdBefore }),
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};
