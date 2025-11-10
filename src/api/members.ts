import api from ".";
import type { MembersParams, MembersResponse } from "../lib/types";

export const fetchMembers = async (
    params: MembersParams = {}
): Promise<MembersResponse> => {
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

    try {
        const response = await api.get<MembersResponse>("/api/members", {
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
        console.error("Error fetching members:", error);
        throw error;
    }
};
