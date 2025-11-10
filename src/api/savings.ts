import api from ".";
import type { SavingsResponse } from "../lib/types";

export const fetchSavings = async (): Promise<SavingsResponse> => {
  try {
    const response = await api.get<SavingsResponse>("/api/savings");
    return response.data;
  } catch (error) {
    console.error("Error fetching savings:", error);
    throw error;
  }
};
