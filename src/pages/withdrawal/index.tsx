import { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  RefreshCw,
} from "lucide-react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Input,
  Select,
} from "@chakra-ui/react";
import api from "../../api";
import DataTable from "../../components/table";

interface Withdrawal {
  id: string;
  reference: string;
  amount: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";
  reason?: string;
  rejectionReason?: string;
  requestedAt: string;
  approvedAt?: string;
  rejectedAt?: string;
  member: {
    id: string;
    full_name: string;
    email: string;
    phone: string;
  };
  category: {
    id: string;
    name: string;
    type: string;
  };
}

const Withdrawals = () => {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [filteredWithdrawals, setFilteredWithdrawals] = useState<Withdrawal[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWithdrawal, setSelectedWithdrawal] =
    useState<Withdrawal | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const { isOpen: isViewModalOpen, onOpen: onViewModalOpen, onClose: onViewModalClose } = useDisclosure();
  const { isOpen: isApproveModalOpen, onOpen: onApproveModalOpen, onClose: onApproveModalClose } = useDisclosure();
  const { isOpen: isRejectModalOpen, onOpen: onRejectModalOpen, onClose: onRejectModalClose } = useDisclosure();

  const fetchWithdrawals = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/withdrawal/admin");
      if (response.data?.success) {
        setWithdrawals(response.data.data);
        setFilteredWithdrawals(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching withdrawals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  useEffect(() => {
    let filtered = withdrawals;

    if (selectedStatus !== "ALL") {
      filtered = filtered.filter((w) => w.status === selectedStatus);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (w) =>
          w.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
          w.member.full_name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          w.member.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredWithdrawals(filtered);
  }, [selectedStatus, searchQuery, withdrawals]);

  const handleApprove = async () => {
    if (!selectedWithdrawal) return;

    setActionLoading(true);
    try {
      const response = await api.patch(
        `/api/withdrawal/${selectedWithdrawal.id}/approve`
      );

      if (response.data?.success) {
        await fetchWithdrawals();
        onApproveModalClose();
        onViewModalClose();
      }
    } catch (error: any) {
      console.error("Error approving withdrawal:", error);
      alert(error.response?.data?.error || "Failed to approve withdrawal");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedWithdrawal || !rejectionReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }

    setActionLoading(true);
    try {
      const response = await api.patch(
        `/api/withdrawal/${selectedWithdrawal.id}/reject`,
        { rejectionReason }
      );

      if (response.data?.success) {
        await fetchWithdrawals();
        onRejectModalClose();
        onViewModalClose();
        setRejectionReason("");
      }
    } catch (error: any) {
      console.error("Error rejecting withdrawal:", error);
      alert(error.response?.data?.error || "Failed to reject withdrawal");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING: "bg-yellow-100 text-yellow-800",
      APPROVED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800",
      COMPLETED: "bg-blue-100 text-blue-800",
    };

    const icons = {
      PENDING: <Clock className="w-4 h-4" />,
      APPROVED: <CheckCircle className="w-4 h-4" />,
      REJECTED: <XCircle className="w-4 h-4" />,
      COMPLETED: <CheckCircle className="w-4 h-4" />,
    };

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
          styles[status as keyof typeof styles]
        }`}
      >
        {icons[status as keyof typeof icons]}
        {status}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  const stats = {
    total: withdrawals.length,
    pending: withdrawals.filter((w) => w.status === "PENDING").length,
    approved: withdrawals.filter((w) => w.status === "APPROVED").length,
    rejected: withdrawals.filter((w) => w.status === "REJECTED").length,
    totalAmount: withdrawals.reduce((sum, w) => sum + w.amount, 0),
  };

  const columns = [
    {
      header: "Reference",
      accessor: "reference" as keyof Withdrawal,
      render: (value: any) => (
        <div className="text-sm font-medium text-gray-900">{value}</div>
      ),
    },
    {
      header: "Member",
      accessor: "member" as keyof Withdrawal,
      render: (value: any) => (
        <div>
          <div className="text-sm font-medium text-gray-900">
            {value.full_name}
          </div>
          <div className="text-sm text-gray-500">{value.email}</div>
        </div>
      ),
    },
    {
      header: "Amount",
      accessor: "amount" as keyof Withdrawal,
      render: (value: any) => (
        <div className="text-sm font-bold text-gray-900">
          {formatCurrency(value)}
        </div>
      ),
    },
    {
      header: "Category",
      accessor: "category" as keyof Withdrawal,
      render: (value: any) => (
        <div className="text-sm text-gray-900">{value.name}</div>
      ),
    },
    {
      header: "Status",
      accessor: "status" as keyof Withdrawal,
      render: (value: any) => getStatusBadge(value),
    },
    {
      header: "Date",
      accessor: "requestedAt" as keyof Withdrawal,
      render: (value: any) => (
        <div className="text-sm text-gray-900">{formatDate(value)}</div>
      ),
    },
  ];

  const actions = [
    {
      label: "View Details",
      onClick: (withdrawal: Withdrawal) => {
        setSelectedWithdrawal(withdrawal);
        onViewModalOpen();
      },
      icon: <Eye className="w-4 h-4" />,
      variant: "primary" as const,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <p className="text-3xl font-bold text-gray-900">
            Withdrawal
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600">Total Requests</div>
            <div className="text-2xl font-bold text-gray-900 mt-2">
              {stats.total}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600">Pending</div>
            <div className="text-2xl font-bold text-yellow-600 mt-2">
              {stats.pending}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600">Approved</div>
            <div className="text-2xl font-bold text-green-600 mt-2">
              {stats.approved}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600">Rejected</div>
            <div className="text-2xl font-bold text-red-600 mt-2">
              {stats.rejected}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600">Total Amount</div>
            <div className="text-xl font-bold text-blue-600 mt-2">
              {formatCurrency(stats.totalAmount)}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="Search by reference, name, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <Select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="COMPLETED">Completed</option>
              </Select>
            </div>

            <button
              onClick={fetchWithdrawals}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        <DataTable
          data={filteredWithdrawals}
          columns={columns}
          actions={actions}
        />
      </div>

      <Modal isOpen={isViewModalOpen} onClose={onViewModalClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <div>
              <h2 className="text-xl font-bold">Withdrawal Details</h2>
              <p className="text-sm text-gray-600 mt-1">
                {selectedWithdrawal?.reference}
              </p>
            </div>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="space-y-6">
              <div>
                {selectedWithdrawal && getStatusBadge(selectedWithdrawal.status)}
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Member Information
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">
                      {selectedWithdrawal?.member.full_name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">
                      {selectedWithdrawal?.member.email}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">
                      {selectedWithdrawal?.member.phone}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Withdrawal Information
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-bold text-lg">
                      {selectedWithdrawal && formatCurrency(selectedWithdrawal.amount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">
                      {selectedWithdrawal?.category.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Requested:</span>
                    <span className="font-medium">
                      {selectedWithdrawal && formatDate(selectedWithdrawal.requestedAt)}
                    </span>
                  </div>
                  {selectedWithdrawal?.reason && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reason:</span>
                      <span className="font-medium">
                        {selectedWithdrawal.reason}
                      </span>
                    </div>
                  )}
                  {selectedWithdrawal?.approvedAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Approved:</span>
                      <span className="font-medium">
                        {formatDate(selectedWithdrawal.approvedAt)}
                      </span>
                    </div>
                  )}
                  {selectedWithdrawal?.rejectedAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rejected:</span>
                      <span className="font-medium">
                        {formatDate(selectedWithdrawal.rejectedAt)}
                      </span>
                    </div>
                  )}
                  {selectedWithdrawal?.rejectionReason && (
                    <div className="mt-4">
                      <span className="text-gray-600 block mb-2">
                        Rejection Reason:
                      </span>
                      <div className="bg-red-50 border border-red-200 rounded p-3 text-red-800">
                        {selectedWithdrawal.rejectionReason}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {selectedWithdrawal?.status === "PENDING" && (
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={onApproveModalOpen}
                    className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 font-medium"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Approve
                  </button>
                  <button
                    onClick={onRejectModalOpen}
                    className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 font-medium"
                  >
                    <XCircle className="w-5 h-5" />
                    Reject
                  </button>
                </div>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onViewModalClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isApproveModalOpen} onClose={onApproveModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Approve Withdrawal</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p className="text-gray-600 mb-4">
              Are you sure you want to approve this withdrawal?
            </p>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Amount:</strong>{" "}
                {selectedWithdrawal && formatCurrency(selectedWithdrawal.amount)}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Member:</strong> {selectedWithdrawal?.member.full_name}
              </p>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onApproveModalClose}>
              Cancel
            </Button>
            <Button
              colorScheme="green"
              onClick={handleApprove}
              isLoading={actionLoading}
            >
              Approve
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isRejectModalOpen} onClose={onRejectModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reject Withdrawal</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejection
            </p>
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Amount:</strong>{" "}
                  {selectedWithdrawal && formatCurrency(selectedWithdrawal.amount)}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Member:</strong> {selectedWithdrawal?.member.full_name}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason *
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Enter reason for rejection..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  required
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onRejectModalClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={handleReject}
              isLoading={actionLoading}
            >
              Reject
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Withdrawals;