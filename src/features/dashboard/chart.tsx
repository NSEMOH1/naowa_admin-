import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { ChartData, Loan } from "../../lib/types";
import { useEffect, useState } from "react";
import { fetchLoans } from "../../api/loan";

const processLoanDataForChart = (loans: Loan[]): ChartData[] => {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const currentYear = new Date().getFullYear();

  const chartData: ChartData[] = monthNames.map((month) => ({
    month,
    approved: 0,
    rejected: 0,
    pending: 0,
  }));

  loans.forEach((loan) => {
    const loanDate = new Date(loan.createdAt);
    const loanYear = loanDate.getFullYear();

    if (loanYear === currentYear) {
      const monthIndex = loanDate.getMonth();
      const monthData = chartData[monthIndex];

      switch (loan.status) {
        case "APPROVED":
        case "DISBURSED":
          monthData.approved++;
          break;
        case "REJECTED":
          monthData.rejected++;
          break;
        case "PENDING":
        case "PENDING_VERIFICATION":
          monthData.pending++;
          break;
      }
    }
  });

  return chartData;
};

export default function DashboardChart() {
  const [chartData, setChartData] = useState<ChartData[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLoanData = async () => {
      try {
        setLoading(true);
        const loansResponse = await fetchLoans();
        const processedData = processLoanDataForChart(loansResponse.result);
        setChartData(processedData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load loan data"
        );
        console.error("Error loading loan data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadLoanData();
  }, []);

  if (loading) {
    return (
      <div className="h-[400px] bg-white p-4 rounded-lg shadow mt-6">
        <h2 className="text-lg font-semibold mb-4">Loan Applications (2025)</h2>
        <div className="flex items-center justify-center h-[300px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[400px] bg-white p-4 rounded-lg shadow mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Loan Applications (2025)</h2>
        {error && (
          <span className="text-sm text-red-500">
            Using fallback data - {error}
          </span>
        )}
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          barSize={7}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="approved"
            fill="#2D9CDB"
            name="Approved Loans"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="rejected"
            fill="#FF6B6B"
            name="Rejected Loans"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="pending"
            fill="#FFD93D"
            name="Pending Loans"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
