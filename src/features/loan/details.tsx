import { Badge, Box, Button, Text, useToast } from "@chakra-ui/react";
import { Logo } from "../../components/icons/logo";
import { formatApprovalDate } from "../../lib/utils";
import { Download } from "lucide-react";
import api from "../../api";
import { useState } from "react";

const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div>
    <p className="text-sm text-gray-500 mb-1">{label}</p>
    <p className="font-medium text-lg">{value}</p>
  </div>
);

interface FileViewerProps {
  filename: string | null;
  label: string;
}

const FileViewer = ({ filename, label }: FileViewerProps) => {
  const toast = useToast();

  const handleDownload = async () => {
    if (!filename) return;
    try {
      const response = await api.get(`/api/file/download/${filename}`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      toast({ title: "Failed to download file", status: "error" });
    }
  };

  if (!filename) {
    return (
      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        <Text fontSize="sm" color="gray.500">
          No file uploaded
        </Text>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between border border-gray-200 py-2 px-2 rounded-lg bg-gray-100 hover:border-blue-300 transition-colors">
        <span className="text-sm font-bold text-gray-700">⦿ {label}</span>
        <div className="flex gap-2">
          <Button
            size="sm"
            colorScheme="green"
            variant="ghost"
            leftIcon={<Download size={16} />}
            onClick={handleDownload}
          >
            Download
          </Button>
        </div>
      </div>
    </>
  );
};

const LoanDetailsView = ({ data }: any) => {
  const toast = useToast();
  const [loading, setIsLoading] = useState(false);
  const handleApprove = async () => {
    setIsLoading(true);
    try {
      await api.post(`/api/loan/${data.id}/approve`);
      window.location.reload();
    } catch (e) {
      toast({ title: "Failed to approve loan", status: "error" });
    } finally {
      setIsLoading(false);
    }
  };
  const handleReject = async () => {
    try {
      await api.post(`/api/loan/${data.id}/reject`);
      window.location.reload();
    } catch (e) {
      toast({ title: "Failed to reject loan", status: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisburse = async () => {
    try {
      await api.post(`/api/loan/${data.id}/disburse`);
      window.location.reload();
    } catch (e) {
      toast({ title: "Failed to disburse loan", status: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box bg="white" borderRadius="lg" boxShadow="md">
      <div className="bg-[#2D9CDB] text-white p-4 rounded-t-lg">
        <p className="font-semibold">Details</p>
      </div>
      <div className="p-4">
        <div className="flex justify-between mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DetailItem
              label="Member Name"
              value={`${data.member.full_name}`}
            />
            <DetailItem
              label="Servicing Loan"
              value={`${data.servicingLoan}`}
            />
            <DetailItem label="Loan ID" value={`${data.id}`} />
            <DetailItem label="Loan Category" value={`${data.category.name}`} />
            <DetailItem label="Reference" value={data.reference} />
            <DetailItem label="Amount" value={`₦${data.amount}`} />
            <DetailItem
              label="Approved Amount"
              value={`₦${data.approvedAmount}`}
            />
            <DetailItem label="Months" value={data.durationMonths} />
            <DetailItem label="Interest Rate" value={`${data.interestRate}%`} />
            <DetailItem
              label="Date Applied"
              value={`${formatApprovalDate(data.createdAt)}`}
            />
            <DetailItem
              label="Date Approved"
              value={
                data.start_date ? formatApprovalDate(data.start_date) : "N/A"
              }
            />
            <DetailItem
              label="Status"
              value={
                <Badge
                  colorScheme={
                    data.status === "APPROVED"
                      ? "green"
                      : data.status === "PENDING"
                      ? "yellow"
                      : data.status === "PENDING_VERIFICATION"
                      ? "yellow"
                      : "red"
                  }
                  px={3}
                  py={1}
                  borderRadius="full"
                >
                  {data.status}
                </Badge>
              }
            />
          </div>
          <div>
            <Logo />
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <p className="text-lg font-bold pb-4">Supporting Documents</p>

          <FileViewer
            filename={data.nonIndebtedness}
            label="Letter of Non-Indebtedness"
          />

          <FileViewer filename={data.validId} label="Valid ID" />

          <FileViewer filename={data.application} label="Application Letter" />

          <FileViewer filename={data.incomeProof} label="Income Proof" />

          <FileViewer filename={data.accountStatement} label="Account Statement" />

          <FileViewer filename={data.utilityBill} label="Utility Bill" />

          <FileViewer filename={data.guarantorLetter} label="Guarantor Letter" />

          <FileViewer filename={data.guarantorPassport} label="Guarantor Passport" />

          <FileViewer filename={data.personalPassport} label="Personal Passport" />
        </div>

        <div className="flex gap-5 mt-8">
          {data.status === "PENDING" && (
            <>
              <Button
                isLoading={loading}
                w="30%"
                colorScheme="green"
                onClick={handleApprove}
              >
                Approve
              </Button>
              <Button
                isLoading={loading}
                w="30%"
                colorScheme="red"
                onClick={handleReject}
              >
                Reject
              </Button>
            </>
          )}

          {data.status === "APPROVED" && (
            <Button
              isLoading={loading}
              w="30%"
              colorScheme="blue"
              onClick={handleDisburse}
            >
              Disburse
            </Button>
          )}

          {data.status === "REJECTED" && (
            <Text color="red.500" fontStyle="italic">
              This loan application has been rejected
            </Text>
          )}
        </div>
      </div>
    </Box>
  );
};

export default LoanDetailsView;
