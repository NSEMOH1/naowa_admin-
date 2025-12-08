import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { banksData } from "./banks";

interface Bank {
  label: string;
  value: string;
}

interface AccountNameResponse {
  status: boolean;
  message: string;
  data: {
    account_number: string;
    account_name: string;
    bank_code: string;
  };
}

export const useBanks = () => {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      try {
        setBanks(banksData);
        setError(null);
      } catch (err) {
        setError("Error loading banks data");
        console.error("Error loading banks:", err);
      } finally {
        setLoading(false);
      }
    }, 500);
  }, []);

  return { banks, loading, error };
};

export const useAccountName = () => {
  const [accountName, setAccountName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const apiKey = import.meta.env.VITE_SQUAD_SECRET_KEY;
  const baseUrl = import.meta.env.VITE_SQUAD_BASE_URL;

  const resolveAccountName = useCallback(
    async (accountNumber: string, bankCode: string) => {
      if (!accountNumber || accountNumber.length !== 10) {
        setAccountName("");
        return;
      }

      if (!bankCode) {
        setAccountName("");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await axios.post<AccountNameResponse>(
          `${baseUrl}/payout/account/lookup`,
          {
            bank_code: bankCode,
            account_number: accountNumber,
          },
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.status && response.data.data) {
          setAccountName(response.data.data.account_name);
        } else {
          setError("Could not resolve account name");
          setAccountName("");
        }
      } catch (err: any) {
        if (err.response?.status === 429) {
          setError("Too many requests. Please wait a moment and try again.");
        } else {
          const errorMessage =
            err.response?.data?.message || "Error resolving account name";
          setError(errorMessage);
        }
        setAccountName("");
        console.error("Error resolving account name:", err);
      } finally {
        setLoading(false);
      }
    },
    [apiKey, baseUrl]
  );

  const resetAccountName = () => {
    setAccountName("");
    setError(null);
  };
  

  return { accountName, loading, error, resolveAccountName, resetAccountName };
};
