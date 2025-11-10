import api from '.';
import type { LoansResponse } from '../lib/types';


export const fetchLoans = async (): Promise<LoansResponse> => {
    try {
        const response = await api.get<LoansResponse>('/api/loan');
        return response.data;
    } catch (error) {
        console.error('Error fetching loans:', error);
        throw error;
    }
};