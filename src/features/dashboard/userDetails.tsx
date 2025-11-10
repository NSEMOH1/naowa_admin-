import { Badge, Box, Button, useDisclosure, useToast } from "@chakra-ui/react";
import type { Member } from "../../lib/types";
import { Logo } from "../../components/icons/logo";
import { Ban, Tag } from "lucide-react";
import ActionModal from "../../components/actionModal";
import api from "../../api";

const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div>
        <p className="text-sm text-gray-500 mb-1">{label}</p>
        <p className="font-medium text-lg">{value}</p>
    </div>
);

export default function UserDetailsView({ data }: { data: Member }) {
    const toast = useToast()
    const {
        isOpen: isAcceptOpen,
        onOpen: onAcceptOpen,
        onClose: onAcceptClose
    } = useDisclosure();

    const {
        isOpen: isRejectOpen,
        onOpen: onRejectOpen,
        onClose: onRejectClose
    } = useDisclosure();

    const handleAccept = async () => {
        try {
            await api.get(`/api/members/${data.id}/approve`)
            toast({ title: "Member Approved Successfully", status: "success" })
            onAcceptOpen();
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

    const handleReject = async () => {
        try {
            await api.get(`/api/members/${data.id}/reject`)
            toast({ title: "Member Rejected Successfully", status: "success" })
            onRejectOpen();
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

    return (
        <Box bg="white" borderRadius="lg" boxShadow="md">
            <div className="bg-[#2D9CDB] text-white p-4 rounded-t-lg">
                <p className="font-semibold">User Details</p>
            </div>
            <div className="p-4">
                <div className="flex justify-between mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <DetailItem label="Full Name" value={`${data.first_name} ${data.last_name}`} />
                        <DetailItem label="Rank" value={data?.Personel?.rank} />
                        <DetailItem label="SVN" value={data.service_number} />
                        <DetailItem label="Phone Number" value={data.phone} />
                        <DetailItem label="Email" value={
                            <a href={`mailto:${data.email}`} className="text-blue-500 hover:underline">
                                {data.email}
                            </a>
                        } />
                        <DetailItem label="Status" value={
                            <Badge
                                colorScheme={
                                    data.status === 'APPROVED' ? 'green' :
                                        data.status === 'PENDING' ? 'yellow' :
                                            'red'
                                }
                                px={3}
                                py={1}
                                borderRadius="full"
                            >
                                {data.status}
                            </Badge>
                        } />
                    </div>
                    <div>
                        <Logo />
                    </div>
                </div>
                {data.status === 'PENDING' && (
                    <div className="flex gap-6">
                        <Button
                            leftIcon={<Tag />}
                            colorScheme="green"
                            onClick={handleAccept}
                        >
                            Approve
                        </Button>
                        <Button
                            leftIcon={<Ban />}
                            colorScheme="red"
                            onClick={handleReject}
                        >
                            Reject
                        </Button>
                    </div>
                )}

                {data.status === 'APPROVED' && (
                    <div className="flex gap-6">
                        <Button
                            leftIcon={<Ban />}
                            colorScheme="red"
                            onClick={handleReject}
                        >
                            Reject
                        </Button>
                    </div>
                )}

                {data.status === 'REJECTED' && (
                    <div className="flex gap-6">
                        <Button
                            leftIcon={<Tag />}
                            colorScheme="green"
                            onClick={handleAccept}
                        >
                            Approve
                        </Button>
                    </div>
                )}
            </div>

            {/* Success Modal for Acceptance */}
            <ActionModal
                isOpen={isAcceptOpen}
                onClose={onAcceptClose}
                status="success"
                title="User Approved"
                message={`${data.first_name} ${data.last_name} has been successfully approved.`}
            />

            {/* Rejection Modal for Rejection */}
            <ActionModal
                isOpen={isRejectOpen}
                onClose={onRejectClose}
                status="error"
                title="User Rejected"
                message={`${data.first_name} ${data.last_name} has been rejected.`}
            />
        </Box>
    );
}