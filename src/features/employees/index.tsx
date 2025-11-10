import {
  Badge,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import DataTable from "../../components/table";
import type { Member, TableColumn } from "../../lib/types";
import { useEffect, useMemo, useState } from "react";
import MemberDetailsView from "./membersDetails";
import { Check, Copy, Edit, Eye, Key, Trash2, X } from "lucide-react";
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

export default function MembersTable() {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [password, _setPassword] = useState("GD236823");
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
    isOpen: isAcceptOpen,
    onOpen: onAcceptOpen,
    onClose: onAcceptClose,
  } = useDisclosure();
  const {
    isOpen: isRejectOpen,
    onOpen: onRejectOpen,
    onClose: onRejectClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const {
    isOpen: isGeneratePasswordOpen,
    onOpen: onGeneratePasswordOpen,
    onClose: onGeneratePasswordClose,
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

  const handleApprove = async (selectedRows: Member[]) => {
    if (selectedRows.length !== 1) {
      toast({
        title: "Error",
        description: "Please select exactly one member to approve",
        status: "error",
      });
      return;
    }

    const member = selectedRows[0];
    try {
      await api.get(`/api/members/${member.id}/approve`);
      toast({ title: "Member Approved Successfully", status: "success" });
      onAcceptOpen();
      loadMembers({
        page: paginationState.page,
        limit: paginationState.limit,
        status:
          activeFilter === "all"
            ? undefined
            : (activeFilter as "APPROVED" | "PENDING" | "REJECTED"),
      });
    } catch (err) {
      let errorMessage = "Approval Failed";
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

  const handleReject = async (selectedRows: Member[]) => {
    if (selectedRows.length !== 1) {
      toast({
        title: "Error",
        description: "Please select exactly one member to reject",
        status: "error",
      });
      return;
    }

    const member = selectedRows[0];
    try {
      await api.get(`/api/members/${member.id}/reject`);
      toast({ title: "Member Rejected Successfully", status: "success" });
      onRejectOpen();
      loadMembers({
        page: paginationState.page,
        limit: paginationState.limit,
        status:
          activeFilter === "all"
            ? undefined
            : (activeFilter as "APPROVED" | "PENDING" | "REJECTED"),
      });
    } catch (err) {
      let errorMessage = "Rejection Failed";
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

  const handleGeneratePassword = async (selectedRows: Member[]) => {
    if (selectedRows.length !== 1) {
      toast({
        title: "Error",
        description:
          "Please select exactly one member to generate password for",
        status: "error",
      });
      return;
    }

    const member = selectedRows[0];
    try {
      const response = await api.post(
        `/api/member/${member.id}/generate-password`
      );

      _setPassword(response.data.data.temporaryPassword);

      toast({
        title: "Password Generated",
        description: "New temporary password created successfully",
        status: "success",
      });

      onGeneratePasswordOpen();
    } catch (err) {
      let errorMessage = "Password generation failed";
      if (typeof err === "object" && err !== null && "response" in err) {
        const response = (err as any).response;
        if (response?.data?.message) {
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

  const handleEdit = (selectedRows: Member[]) => {
    if (selectedRows.length !== 1) {
      toast({
        title: "Error",
        description: "Please select exactly one member to edit",
        status: "error",
      });
      return;
    }
    setSelectedMember(selectedRows[0]);
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

  const handleCopyPassword = (password: string) => {
    try {
      navigator.clipboard.writeText(password);
      toast({ title: "Password Copied", status: "success" });
    } catch (e) {
      toast({ title: "Failed to copy password", status: "error" });
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
      name: "Approve",
      icon: <Check size={16} />,
      colorScheme: "green",
      variant: "solid",
      onClick: handleApprove,
    },
    {
      name: "Generate Password",
      icon: <Key size={16} />,
      colorScheme: "purple",
      variant: "solid",
      onClick: handleGeneratePassword,
    },
    {
      name: "Reject",
      icon: <X size={16} />,
      colorScheme: "red",
      variant: "solid",
      onClick: handleReject,
    },
    {
      name: "Edit",
      icon: <Edit size={16} />,
      colorScheme: "orange",
      variant: "solid",
      onClick: handleEdit,
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
    return members.filter((member: { status: string; }) => member.status === activeFilter);
  }, [members, activeFilter]);

  const statusCounts = useMemo(() => {
    const approved = members.filter(
      (member: { status: string; }) => member.status === "APPROVED"
    ).length;
    const pending = members.filter(
      (member: { status: string; }) => member.status === "PENDING"
    ).length;
    const rejected = members.filter(
      (member: { status: string; }) => member.status === "REJECTED"
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
        isOpen={isAcceptOpen}
        onClose={onAcceptClose}
        status="success"
        title=""
        message={`Member Successfully Approved`}
      />

      <ActionModal
        isOpen={isRejectOpen}
        onClose={onRejectClose}
        status="error"
        title=""
        message={`Member Successfully Rejected`}
      />

      <ActionModal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        status="error"
        title=""
        message={`Member Successfully Deleted`}
      />
      <Modal isOpen={isGeneratePasswordOpen} onClose={onGeneratePasswordClose}>
        <ModalOverlay />
        <ModalContent bg="#EAF3F9">
          <ModalCloseButton />
          <ModalBody>
            <div className="mt-10">
              <p className="font-bold text-xl text-center">
                Generated Temporary Password
              </p>
              <p className="text-sm text-center text-gray-500 mt-2">
                This password should be shared securely with the member
              </p>
            </div>
            <div className="bg-[#0089ED] text-white p-4 mt-6 rounded-lg flex flex-col gap-6">
              <p className="flex justify-end gap-2">
                Copy Password
                <Copy
                  className="cursor-pointer"
                  onClick={() => handleCopyPassword(password)}
                />
              </p>
              <p className="text-center text-xl font-mono text-green-200">
                {password}
              </p>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onGeneratePasswordClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
