import {
  Badge,
  Button,
  Input,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import DataTable from "../../components/table";
import type { Member, TableColumn } from "../../lib/types";
import { useEffect, useMemo, useState } from "react";
import MemberDetailsView from "./membersDetails";
import { Eye, Plus, Trash2 } from "lucide-react";
import ActionModal from "../../components/actionModal";
import { useMembersData } from "../../hooks/useMember";
import api from "../../api";
import { exportToExcel } from "../../lib/excelExport";
import { useNavigate } from "react-router-dom";
import { routes } from "../../lib/routes";
import { useAuth } from "../../hooks/useAuth";

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
    render: (status: "ACTIVE" | "INACTIVE") => (
      <Badge
        colorScheme={
          status === "ACTIVE"
            ? "green"
            : status === "INACTIVE"
            ? "red"
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
  const [searchTerm, setSearchTerm] = useState<string>("");
  const toast = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { members, loading, pagination, loadMembers } = useMembersData();
  const [paginationState, setPaginationState] = useState({
    page: 1,
    limit: 10,
  });

  const handleExportData = () => {
    return members.map((member: any) => ({
      ID: member.id,
      "Full Name": member.full_name,
      "Phone Number": member.phone,
      Email: member.email,
      username: member.username || "N/A",
      Status: member.status,
    }));
  };

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const {
    isOpen: isDeactivateOpen,
    onOpen: onDeactivateOpen,
    onClose: onDeactivateClose,
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
    if (user?.role !== "SUPER_ADMIN") {
      toast({
        title: "Error",
        description: "You are unauthorized to perform this action",
        status: "error",
      });
      return;
    }
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

  const handleDeactivate = async (selectedRows: Member[]) => {
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
      await api.put(`/api/member/${member.id}/deactivate`);
      toast({ title: "Member Deactivated Successfully", status: "success" });
      onDeactivateOpen();
      loadMembers({
        page: paginationState.page,
        limit: paginationState.limit,
        status:
          activeFilter === "all"
            ? undefined
            : (activeFilter as "APPROVED" | "PENDING" | "REJECTED"),
      });
    } catch (err) {
      let errorMessage = "Deactivation Failed";
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

  const addNewMember = () => {
    if (user?.role !== "SUPER_ADMIN") {
      toast({
        title: "Error",
        description: "You are unauthorized to perform this action",
        status: "error",
      });
    } else {
      navigate(routes.members.new);
    }
  };

  const defaultActionButtons = [
    {
      name: "View Details",
      icon: <Eye size={16} />,
      colorScheme: "blue",
      variant: "outline",
      onClick: handleViewDetails,
    },
     {
      name: "Deactivate",
      icon: <Eye size={16} />,
      colorScheme: "purple",
      variant: "outline",
      onClick: handleDeactivate,
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
      status:
        activeFilter === "all"
          ? undefined
          : (activeFilter as "APPROVED" | "PENDING" | "REJECTED"),
    });
  }, [paginationState.page, paginationState.limit, activeFilter]);

  const handleSearchClick = () => {
    loadMembers({
      page: 1,
      limit: paginationState.limit,
      search: searchTerm,
      status:
        activeFilter === "all"
          ? undefined
          : (activeFilter as "APPROVED" | "PENDING" | "REJECTED"),
    });
  };

  const filteredMembers = useMemo(() => {
    return members;
  }, [members]);

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
              colorScheme={activeFilter === button.filter ? "red" : "gray"}
              size="sm"
              className="transition-all duration-200"
              mr={6}
              mt={1}
            >
              {button.name}
            </Button>
          ))}
          <Input
            placeholder="Search by Name or Email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="md"
            width="300px"
          />
          <Button onClick={handleSearchClick} colorScheme="red">
            Search
          </Button>
          <Button colorScheme="green" onClick={addNewMember}>
            <Plus color="white" className="mr-2" />
            Add New Member
          </Button>
        </div>
        <button
          style={{
            background: "black",
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
                { key: "Full Name", header: "Full Name", width: 20 },
                { key: "Phone Number", header: "Phone Number", width: 18 },
                { key: "Email", header: "Email", width: 30 },
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
        status="success"
        title=""
        message={`Member Successfully Deleted`}
      />

      <ActionModal
        isOpen={isDeactivateOpen}
        onClose={onDeactivateClose}
        status="success"
        title=""
        message={`Member Successfully Deactivated`}
      />
    </div>
  );
}
