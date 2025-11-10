import { Badge, Button } from "@chakra-ui/react";
import DataTable from "../../components/table";
import type { Member, TableColumn } from "../../lib/types";
import { useMemo, useState, useEffect } from "react";
import UserDetailsView from "./userDetails";
import { useMembersData } from "../../hooks/useMember";

const userColumns: TableColumn<Member>[] = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: 70,
    render: (id: number) => <span className="font-semibold">{id}</span>,
  },
  {
    title: "First Name",
    dataIndex: "first_name",
    key: "first_name",
  },
  {
    title: "Last Name",
    dataIndex: "last_name",
    key: "last_name",
  },
  {
    title: "Phone Number",
    dataIndex: "phone",
    key: "phoneNumber",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    render: (email: string) => (
      <a href={`mailto:${email}`} className="text-blue-500 hover:underline">
        {email}
      </a>
    ),
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status: "APPROVED" | "PENDING" | "REJECTED") => (
      <Badge
        colorScheme={
          status === "APPROVED"
            ? "green"
            : status === "PENDING"
            ? "yellow"
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
  { name: "Total Members", filter: "all" },
  { name: "Approved Members", filter: "APPROVED" },
  { name: "Pending Members", filter: "PENDING" },
  { name: "Rejected Members", filter: "REJECTED" },
];

export default function DashboardTable() {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [paginationState, setPaginationState] = useState({
    page: 1,
    limit: 10,
  });

  const { members, loading, error, pagination, loadMembers } = useMembersData();

  const handleRowClick = (record: Member) => {
    setSelectedMember(record);
  };

  const handleBackToList = () => {
    setSelectedMember(null);
  };

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    loadMembers({
      page: 1,
      limit: 10,
      status:
        filter === "all"
          ? undefined
          : (filter as "APPROVED" | "PENDING" | "REJECTED"),
    });
  };

  const handleTableChange = (pagination: any) => {
    setPaginationState({
      page: pagination.current,
      limit: pagination.pageSize,
    });
    loadMembers({
      page: pagination.current,
      limit: pagination.pageSize,
      status:
        activeFilter === "all"
          ? undefined
          : (activeFilter as "APPROVED" | "PENDING" | "REJECTED"),
    });
  };

  useEffect(() => {
    loadMembers({
      page: paginationState.page,
      limit: paginationState.limit,
    });
  }, []);

  const filteredMembers = useMemo(() => {
    if (activeFilter === "all") {
      return members;
    }
    return members.filter((member) => member.status === activeFilter);
  }, [members, activeFilter]);

  const statusCounts = useMemo(() => {
    const approved = members.filter(
      (member) => member.status === "APPROVED"
    ).length;
    const pending = members.filter(
      (member) => member.status === "PENDING"
    ).length;
    const rejected = members.filter(
      (member) => member.status === "REJECTED"
    ).length;

    return {
      all: members.length,
      APPROVED: approved,
      PENDING: pending,
      REJECTED: rejected,
    };
  }, [members]);

  const buttonsWithCounts = buttons.map((button) => ({
    ...button,
    name: `${button.name} (${
      statusCounts[button.filter as keyof typeof statusCounts]
    })`,
  }));

  if (selectedMember) {
    return (
      <div className="mt-7">
        <Button onClick={handleBackToList} mb={4} variant="outline">
          Back to List
        </Button>

        <UserDetailsView data={selectedMember} />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="mt-7">
      <div className="mb-6 flex flex-wrap gap-3">
        {buttonsWithCounts.map((button, index) => (
          <Button
            key={index}
            onClick={() => handleFilterClick(button.filter)}
            variant={activeFilter === button.filter ? "solid" : "outline"}
            colorScheme={activeFilter === button.filter ? "blue" : "gray"}
            size="sm"
            className="transition-all duration-200"
            isLoading={loading}
          >
            {button.name}
          </Button>
        ))}
      </div>
      <DataTable
        data={filteredMembers}
        columns={userColumns}
        rowKey="id"
        showExport={true}
        showFilters={true}
        tableHeaderBg="#F1F4F9"
        tableHeaderColor="black"
        onRowClick={handleRowClick}
        loading={loading}
        pagination={{
          current: pagination.page,
          pageSize: pagination.limit,
          total: pagination.total,
        }}
        onChange={handleTableChange}
      />
    </div>
  );
}
