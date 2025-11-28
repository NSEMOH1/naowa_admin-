import { Card, CardBody } from "@chakra-ui/react";
import { TrendingUpDownIcon, BadgeDollarSign, Box, ChartNoAxesCombined, History, LibraryBig } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchLoans } from "../../api/loan";

export default function LoanCards() {
    const [loanStats, setLoanStats] = useState({
        disbursed: 0,
        approved: 0,
        rejected: 0,
        pending: 0,
        total: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadLoanStats = async () => {
            try {
                setLoading(true);
                const response = await fetchLoans();
                const loans = response.result;

                const stats = {
                    disbursed: loans.filter((loan: { status: string; }) => loan.status === 'DISBURSED').length,
                    approved: loans.filter((loan: { status: string; }) => loan.status === 'APPROVED').length,
                    rejected: loans.filter((loan: { status: string; }) => loan.status === 'REJECTED').length,
                    pending: loans.filter((loan: { status: string; }) => loan.status === 'PENDING').length,
                    total: loans.length
                };

                setLoanStats(stats);
            } catch (error) {
                console.error('Error fetching loan stats:', error);
            } finally {
                setLoading(false);
            }
        };

        loadLoanStats();
    }, []);

    const formatNumber = (num: number) => {
        return num.toLocaleString();
    };

    const loanCards = [
        {
            id: 1,
            title: "Disbursed Loans",
            icon: BadgeDollarSign,
            count: formatNumber(loanStats.disbursed),
            color: "#8280FF",
            percentage: calculatePercentage(loanStats.disbursed, loanStats.total),
        },
        {
            id: 2,
            title: "Approved Loans",
            icon: Box,
            count: formatNumber(loanStats.approved),
            color: "#FEC53D",
            percentage: calculatePercentage(loanStats.approved, loanStats.total),
        },
        {
            id: 3,
            title: "Rejected Loans",
            icon: ChartNoAxesCombined,
            count: formatNumber(loanStats.rejected),
            color: "#4AD991",
            percentage: calculatePercentage(loanStats.rejected, loanStats.total),
        },
        {
            id: 4,
            title: "Pending Loans",
            icon: History,
            count: formatNumber(loanStats.pending),
            color: "#FF9066",
            percentage: calculatePercentage(loanStats.pending, loanStats.total),
        },
        {
            id: 5,
            title: "Total Loans",
            icon: LibraryBig,
            count: formatNumber(loanStats.total),
            color: "#9F7AEA",
            percentage: "100%",
        },
    ];

    function calculatePercentage(count: number, total: number): string {
        if (total === 0) return "0%";
        return `${((count / total) * 100).toFixed(1)}%`;
    }

    if (loading) {
        return <div>Loading loan statistics...</div>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 w-full">
            {loanCards.map((data, _index) => (
                <Card
                    key={data.id}
                    className="w-full transition-all duration-300 ease-in-out hover:border-black hover:border-2 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
                    <CardBody className="shadow-lg">
                        <div className="flex justify-between items-center gap-6">
                            <div>
                                <p className="text-sm text-gray-600">{data.title}</p>
                                <p className="text-2xl font-bold">{data.count}</p>
                            </div>
                            <div className="p-2 rounded-lg transition-transform duration-300 hover:scale-110" style={{ background: data.color }}>
                                <data.icon size={20} color="white" />
                            </div>
                        </div>
                        <p className="flex items-center gap-2 pt-4 text-sm text-gray-500">
                            <TrendingUpDownIcon size={16} color="#38A169" />
                            <span>{data.percentage} {data.id !== 5 ? "of total loans" : ""}</span>
                        </p>
                    </CardBody>
                </Card>
            ))}
        </div>
    );
}