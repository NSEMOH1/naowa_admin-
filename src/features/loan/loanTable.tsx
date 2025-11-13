import { Avatar, Badge, Button, Toast } from "@chakra-ui/react";
import DataTable from "../../components/table";
import { useMemo, useState, useEffect } from "react";
import { fetchLoans } from "../../api/loan";
import type { Loan, TableColumn } from "../../lib/types";
import LoanDetailsView from "./details";
import Loader from "../../components/loader";
import { exportToExcel } from "../../lib/excelExport";

const loanColumns: TableColumn<Loan>[] = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Members Name",
    dataIndex: "member",
    key: "member",
    render: (member: any) => (
      <span className="font-semibold flex items-center gap-2">
        <Avatar src={member.full_name} size="sm" />
        {`${member?.full_name}` || "N/A"}
      </span>
    ),
  },
  {
    title: "Loan Reference",
    dataIndex: "reference",
    key: "reference",
  },
  {
    title: "Date",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (date: string) => new Date(date).toLocaleDateString(),
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
    render: (amount: string) => (
      <span className="font-semibold">₦{amount}</span>
    ),
  },
  {
    title: "Approved Amount",
    dataIndex: "approvedAmount",
    key: "approvedAmount",
    render: (amount: string) => (
      <span className="font-semibold">₦{amount}</span>
    ),
  },
  {
    title: "Approved By",
    dataIndex: "approvedBy",
    key: "approvedBy",
    render: (approvedBy: { full_name: string; email: string } | null) =>
      approvedBy ? (
        <div className="flex flex-col">
          <span className="font-medium">{approvedBy.full_name}</span>
          <span className="text-xs text-gray-500">{approvedBy.email}</span>
        </div>
      ) : (
        <span className="text-gray-400">Not approved</span>
      ),
  },
  {
    title: "Rejected By",
    dataIndex: "rejectedBy",
    key: "rejectedBy",
    render: (rejectedBy: { full_name: string; email: string } | null) =>
      rejectedBy ? (
        <div className="flex flex-col">
          <span className="font-medium">{rejectedBy.full_name}</span>
          <span className="text-xs text-gray-500">{rejectedBy.email}</span>
        </div>
      ) : (
        <span className="text-gray-400">Not rejected</span>
      ),
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status: string) => (
      <Badge
        colorScheme={
          status === "APPROVED"
            ? "green"
            : status === "PENDING"
            ? "yellow"
            : status === "PENDING_VERIFICATION"
            ? "blue"
            : status === "DISBURSED"
            ? "purple"
            : "red"
        }
        px={3}
        py={1}
        borderRadius="full"
        textTransform="capitalize"
      >
        {status}
      </Badge>
    ),
  },
];

const buttons = [
  { name: "All Loans", filter: "all" },
  { name: "Approved Loan", filter: "APPROVED" },
  { name: "Disbursed Loan", filter: "ACTIVE" },
  { name: "Pending Approval", filter: "PENDING" },
  { name: "Rejected Loan Request", filter: "REJECTED" },
];

export default function LoanTable() {
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLoans = async () => {
      try {
        setLoading(true);
        const response = await fetchLoans();
        setLoans(response.result);
      } catch (err) {
        setError("Failed to fetch loans");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadLoans();
  }, []);

  const handleRowClick = (record: Loan) => {
    setSelectedLoan(record);
  };

  const handleBackToList = () => {
    setSelectedLoan(null);
  };

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
  };

  const filteredLoans = useMemo(() => {
    if (activeFilter === "all") {
      return loans;
    }
    return loans.filter((loan) => loan.status === activeFilter);
  }, [activeFilter, loans]);

  const statusCounts = useMemo(() => {
    const approved = loans.filter((loan) => loan.status === "APPROVED").length;
    const pending = loans.filter((loan) => loan.status === "PENDING").length;
    const rejected = loans.filter((loan) => loan.status === "REJECTED").length;
    const disbursed = loans.filter((loan) => loan.status === "ACTIVE").length;

    return {
      all: loans.length,
      APPROVED: approved,
      DISBURSED: disbursed,
      PENDING: pending,
      REJECTED: rejected,
    };
  }, [loans]);

  const buttonsWithCounts = buttons.map((button) => ({
    ...button,
    name: `${button.name} (${
      statusCounts[button.filter as keyof typeof statusCounts] || 0
    })`,
  }));

  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (selectedLoan) {
    return (
      <div className="mt-7">
        <Button onClick={handleBackToList} mb={4} variant="outline">
          Back to List
        </Button>
        <LoanDetailsView data={selectedLoan} />
      </div>
    );
  }

  return (
    <div className="mt-15">
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-wrap gap-3">
          {buttonsWithCounts.map((button, index) => (
            <Button
              key={index}
              onClick={() => handleFilterClick(button.filter)}
              variant={activeFilter === button.filter ? "solid" : "outline"}
              colorScheme={activeFilter === button.filter ? "blue" : "gray"}
              size="sm"
              className="transition-all duration-200"
            >
              {button.name}
            </Button>
          ))}
        </div>
        <button
          style={{
            background: "green",
            color: "white",
            padding: "8px 16px",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer",
          }}
          onClick={() => {
            try {
              const exportData = filteredLoans.map((loan) => ({
                ID: loan.id,
                "Member Name": `${loan.member.full_name}`,
                "Loan Reference": loan.reference,
                "Date Applied": new Date(loan.createdAt).toLocaleDateString(),
                Amount: loan.amount.toString(),
                "Approved Amount": loan.approvedAmount
                  ? loan.approvedAmount.toString()
                  : "N/A",
                "Approved By": loan.approvedBy
                  ? loan.approvedBy.full_name
                  : "Not approved",
                "Rejected By": loan.rejectedBy
                  ? loan.rejectedBy.full_name
                  : "Not rejected",
                Status: loan.status,
                "Interest Rate": loan.interestRate
                  ? loan.interestRate.toString()
                  : "N/A",
                "Duration (Months)": loan.durationMonths
                  ? loan.durationMonths.toString()
                  : "N/A",
                "Start Date": loan.startDate
                  ? new Date(loan.startDate).toLocaleDateString()
                  : "N/A",
                "End Date": loan.endDate
                  ? new Date(loan.endDate).toLocaleDateString()
                  : "N/A",
              }));

              if (exportData.length === 0) {
                Toast({ title: "No loan to export", status: "warning" });
                return;
              }

              const columns = [
                { key: "ID", header: "ID", width: 10 },
                { key: "Member Name", header: "Member Name", width: 20 },
                { key: "Loan Reference", header: "Loan Reference", width: 18 },
                { key: "Date Applied", header: "Date Applied", width: 15 },
                { key: "Amount", header: "Amount", width: 15 },
                {
                  key: "Approved Amount",
                  header: "Approved Amount",
                  width: 18,
                },
                { key: "Approved By", header: "Approved By", width: 20 },
                { key: "Rejected By", header: "Rejected By", width: 20 },
                { key: "Status", header: "Status", width: 15 },
                { key: "Interest Rate", header: "Interest Rate", width: 15 },
                {
                  key: "Duration (Months)",
                  header: "Duration (Months)",
                  width: 18,
                },
                { key: "Start Date", header: "Start Date", width: 15 },
                { key: "End Date", header: "End Date", width: 15 },
              ];

              exportToExcel({
                data: exportData,
                columns,
                filename: `loans_${activeFilter}_${new Date()
                  .toISOString()
                  .slice(0, 10)}.xlsx`,
                sheetName: "Loans",
                title: `${
                  activeFilter === "all"
                    ? "All"
                    : activeFilter.charAt(0) +
                      activeFilter.slice(1).toLowerCase()
                } Loans Report`,
              });

              console.log(`Successfully exported ${exportData.length} loans`);
            } catch (error) {
              console.error("Export failed:", error);
              Toast({ title: "Export Failed", status: "error" });
            }
          }}
        >
          Export ({filteredLoans.length})
        </button>
      </div>
      <DataTable
        data={filteredLoans}
        columns={loanColumns}
        rowKey="id"
        showExport={true}
        showFilters={true}
        tableHeaderBg="#F1F4F9"
        tableHeaderColor="black"
        onRowClick={handleRowClick}
      />
    </div>
  );
}
