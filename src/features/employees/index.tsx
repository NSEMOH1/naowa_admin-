import {
  Badge,
  Button,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import DataTable from "../../components/table";
import type { Member, TableColumn } from "../../lib/types";
import { useEffect, useMemo, useState } from "react";
import MemberDetailsView from "./membersDetails";
import { Eye, Trash2 } from "lucide-react";
import ActionModal from "../../components/actionModal";
import { useMembersData } from "../../hooks/useMember";
import api from "../../api";
import { exportToExcel } from "../../lib/excelExport";

const membersColumns: TableColumn<Member>[] = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: 70,
    render: (id: number) => <span className="font-semibold">{id}</span>,
  },
  {
    title: "Full Name",
    dataIndex: "full_name",
    key: "first_name",
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

const buttons = [{ name: "Total Members", filter: "all" }];

export default function MembersTable() {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const toast = useToast();
  const { members, loading, pagination, loadMembers } = useMembersData();
  const [paginationState, setPaginationState] = useState({
    page: 1,
    limit: 10,
  });

  const handleExportData = () => {
    return filteredMembers.map((member: any) => ({
      ID: member.id,
      "First Name": member.first_name,
      "Last Name": member.last_name,
      "Phone Number": member.phone,
      Email: member.email,
      SVN: member.service_number || "N/A",
      Status: member.status,
    }));
  };
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const handleViewDetails = (selectedRows: Member[]) => {
    if (selectedRows.length === 1) {
      setSelectedMember(selectedRows[0]);
    } else {
      toast({
        title: "Error",
        description: "Please select exactly one member to view details",
        status: "error",
      });
    }
  };

  const handleDelete = async (selectedRows: Member[]) => {
    if (selectedRows.length !== 1) {
      toast({
        title: "Error",
        description: "Please select exactly one member to delete",
        status: "error",
      });
      return;
    }

    const member = selectedRows[0];
    try {
      await api.delete(`/api/member/${member.id}`);
      toast({ title: "Member Deleted Successfully", status: "success" });
      onDeleteOpen();
      loadMembers({
        page: paginationState.page,
        limit: paginationState.limit,
        status:
          activeFilter === "all"
            ? undefined
            : (activeFilter as "APPROVED" | "PENDING" | "REJECTED"),
      });
    } catch (err) {
      let errorMessage = "Deletion Failed";
      if (typeof err === "object" && err !== null && "response" in err) {
        const response = (err as any).response;
        if (response && response.data && response.data.message) {
          errorMessage = response.data.message;
        }
      }
      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
      });
    }
  };

  const defaultActionButtons = [
    {
      name: "View Details",
      icon: <Eye size={16} />,
      colorScheme: "blue",
      variant: "solid",
      onClick: handleViewDetails,
    },
    {
      name: "Delete",
      icon: <Trash2 size={16} />,
      colorScheme: "red",
      variant: "outline",
      onClick: handleDelete,
    },
  ];

  const handleRowClick = (record: Member) => {
    setSelectedMember(record);
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
    return members.filter(
      (member: { status: string }) => member.status === activeFilter
    );
  }, [members, activeFilter]);

  const statusCounts = useMemo(() => {
    const approved = members.filter(
      (member: { status: string }) => member.status === "APPROVED"
    ).length;
    const pending = members.filter(
      (member: { status: string }) => member.status === "PENDING"
    ).length;
    const rejected = members.filter(
      (member: { status: string }) => member.status === "REJECTED"
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
        <MemberDetailsView data={selectedMember} />
      </div>
    );
  }

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center">
        <div className="mb-6 flex flex-wrap gap-3">
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
              const exportData = handleExportData();

              if (exportData.length === 0) {
                toast({
                  title: "No Data",
                  description: "No members found to export",
                  status: "warning",
                });
                return;
              }

              const columns = [
                { key: "ID", header: "ID", width: 10 },
                { key: "First Name", header: "First Name", width: 20 },
                { key: "Last Name", header: "Last Name", width: 20 },
                { key: "Rank", header: "Rank", width: 15 },
                { key: "Phone Number", header: "Phone Number", width: 18 },
                { key: "Email", header: "Email", width: 30 },
                { key: "SVN", header: "SVN", width: 15 },
                { key: "Status", header: "Status", width: 15 },
              ];

              exportToExcel({
                data: exportData,
                columns,
                filename: `members_${activeFilter}_${new Date()
                  .toISOString()
                  .slice(0, 10)}.xlsx`,
                sheetName: "Members",
                title: `${
                  activeFilter === "all"
                    ? "All"
                    : activeFilter.charAt(0) +
                      activeFilter.slice(1).toLowerCase()
                } Members Report`,
              });

              toast({
                title: "Export Successful",
                description: `${exportData.length} members exported successfully`,
                status: "success",
              });
            } catch (error) {
              console.error("Export failed:", error);
              toast({
                title: "Export Failed",
                description: "Failed to export members data",
                status: "error",
              });
            }
          }}
        >
          Export ({filteredMembers.length})
        </button>
      </div>

      <DataTable
        data={filteredMembers}
        columns={membersColumns}
        rowKey="id"
        showExport={true}
        showFilters={true}
        tableHeaderBg="#F1F4F9"
        tableHeaderColor="black"
        showActionBar={true}
        actionButtons={defaultActionButtons}
        onRowClick={handleRowClick}
        loading={loading}
        pagination={{
          current: pagination.page,
          pageSize: pagination.limit,
          total: pagination.total,
        }}
        onChange={handleTableChange}
      />

      <ActionModal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        status="error"
        title=""
        message={`Member Successfully Deleted`}
      />
    </div>
  );
}
