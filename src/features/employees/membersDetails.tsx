import { Avatar, Badge, Box, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Table, Tbody, Td, Th, Thead, Tr, useDisclosure, useToast } from "@chakra-ui/react";
import type { Member } from "../../lib/types";
import { Ban, BookUser, Home, Mail, PhoneIncoming, ShieldHalf, Tag, User, X } from "lucide-react";
import ActionModal from "../../components/actionModal";
import LoanBalanceDashboard from "./loan-balance";
import api from "../../api";
import { useState } from "react";
export default function MemberDetailsView({ data }: { data: Member }) {
    const toast = useToast()
    const [savingsHistory, setSavingsHistory] = useState<any[]>([]);
    const [loanHistory, setLoanHistory] = useState<any[]>([]);
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

    const {
        isOpen: isSavingsOpen,
        onOpen: onSavingsOpen,
        onClose: onSavingsClose
    } = useDisclosure();

    const {
        isOpen: isLoansOpen,
        onOpen: onLoansOpen,
        onClose: onLoansClose
    } = useDisclosure();

    const {
        isOpen: isStatementOpen,
        onOpen: onStatementOpen,
        onClose: onStatementClose
    } = useDisclosure();

    const fetchSavingsHistory = async () => {
        try {
            const response = await api.get(`/api/members/${data.id}/savings`);
            setSavingsHistory(response.data);
            onSavingsOpen();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch savings history",
                status: "error",
            });
        }
    };

    const fetchLoanHistory = async () => {
        try {
            const response = await api.get(`/api/members/${data.id}/loans`);
            setLoanHistory(response.data);
            onLoansOpen();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch loan history",
                status: "error",
            });
        }
    };

    // const handleAccept = async () => {
    //     try {
    //         await api.get(`/api/members/${data.id}/approve`)
    //         toast({ title: "Member Approved Successfully", status: "success" })
    //         onAcceptOpen();
    //     } catch (err) {
    //         let errorMessage = "Approval Failed";
    //         if (typeof err === "object" && err !== null && "response" in err) {
    //             const response = (err as any).response;
    //             if (response && response.data && response.data.message) {
    //                 errorMessage = response.data.message;
    //             }
    //         }
    //         toast({
    //             title: "Error",
    //             description: errorMessage,
    //             status: "error",
    //         });
    //     }

    // };

    // const handleReject = async () => {
    //     try {
    //         await api.get(`/api/members/${data.id}/reject`)
    //         toast({ title: "Member Rejected Successfully", status: "success" })
    //         onRejectOpen();
    //     } catch (err) {
    //         let errorMessage = "Rejection Failed";
    //         if (typeof err === "object" && err !== null && "response" in err) {
    //             const response = (err as any).response;
    //             if (response && response.data && response.data.message) {
    //                 errorMessage = response.data.message;
    //             }
    //         }
    //         toast({
    //             title: "Error",
    //             description: errorMessage,
    //             status: "error",
    //         });
    //     }
    // };
    return (
        <Box bg="white" borderRadius="lg" boxShadow="md">
            <div className="p-4">
                <Box
                    position="fixed"
                    top="0"
                    left="0"
                    width="100vw"
                    height="103vh"
                    backgroundColor="rgba(128, 128, 128, 0.5)"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                >
                    <div className="relative">
                        <div className="absolute -top-7 -right-8 z-10">
                            <div style={{ border: "1px solid white" }} className="bg-transparent rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => window.location.reload()}>
                                <X
                                    size={20}
                                    color="white"
                                />
                            </div>
                        </div>
                        <div className="bg-[#F2F7FA] rounded-lg p-6 shadow-xl">
                            <div style={{ border: "1px solid gray" }}>
                                <div className="rounded flex gap-2">
                                    <div className="p-2">
                                        <div className="bg-white rounded text-xs p-4 px-8 flex flex-col gap-2">
                                            <p className="font-semibold">Member's Name</p>
                                            <p className="flex items-center gap-2"><User size={10} />{data.first_name} {data.last_name}</p>
                                            <p className="flex items-center gap-2"><ShieldHalf size={10} />{data.Personel?.rank}</p>
                                            <p className="flex items-center gap-2"><BookUser size={10} />{data.service_number}</p>
                                        </div>
                                        <div className="bg-white rounded text-xs p-4 px-8 flex flex-col gap-2 mt-2">
                                            <p className="font-semibold">Member's Information</p>
                                            <p className="flex items-center gap-2"><PhoneIncoming size={10} />{data.phone}</p>
                                            <p className="flex items-center gap-2"><Mail size={10} />{data.email}</p>
                                            <p className="flex items-center gap-2"><Home size={10} />{data.address}</p>
                                        </div>
                                        <div className="bg-white rounded text-xs p-4 px-8 flex flex-col gap-2 mt-2">
                                            <p className="font-semibold">Service Information</p>
                                            <p className="flex items-center gap-2">ID: {data.id}</p>
                                            <p className="flex items-center gap-2">Account Number: {data.bank[0].account_number}</p>
                                            <p className="flex items-center gap-2">Date Joined: {(data.created_at).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex flex-col justify-center items-center pt-2">
                                            <Avatar size='xl' name={`${data.first_name} ${data.last_name}`} />
                                        </div>
                                        <LoanBalanceDashboard />
                                        {/* <div className="mt-4 mb-4 mr-2">
                                            {data.status === 'PENDING' && (
                                                <div className="flex gap-6 mt">
                                                    <Button
                                                        leftIcon={<Tag />}
                                                        colorScheme="green"
                                                        onClick={handleAccept}
                                                        size='sm'
                                                    >
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        leftIcon={<Ban />}
                                                        colorScheme="red"
                                                        onClick={handleReject}
                                                        size='sm'
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
                                                        size='sm'
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
                                                        size='sm'
                                                    >
                                                        Approve
                                                    </Button>
                                                </div>
                                            )}
                                        </div> */}
                                    </div>
                                </div>
                                <div className="bg-[#556308] p-1">
                                    <p className="text-white">Quick links</p>
                                </div>
                                <div className="grid grid-cols-3 gap-2 px-2 text-[#556308] py-2">
                                    <p className="underline cursor-pointer" onClick={onStatementOpen}>View Account Statement</p>
                                    <p className="underline cursor-pointer" onClick={fetchSavingsHistory}>View Savings History</p>
                                    <p className="underline cursor-pointer">Update Member Balance</p>
                                    <p className="underline cursor-pointer" onClick={fetchLoanHistory}>View Loan History</p>
                                    <p className="underline cursor-pointer">Download</p>
                                </div>
                            </div>

                        </div>
                    </div>

                </Box>

            </div>

            {/* Savings History Modal */}
            <Modal isOpen={isSavingsOpen} onClose={onSavingsClose} size="5xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Savings History for {data.first_name} {data.last_name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Table variant="simple">
                            <Thead>
                                <Tr>
                                    <Th>Date</Th>
                                    <Th>Reference</Th>
                                    <Th>Transaction Type</Th>
                                    <Th>Amount (₦)</Th>
                                    <Th>Status</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {savingsHistory.map((saving) => {
                                    const isDeposit = parseFloat(saving.amount) > 0;
                                    return (
                                        <Tr key={saving.id}>
                                            <Td>{new Date(saving.createdAt).toLocaleDateString()}</Td>
                                            <Td>{saving.reference}</Td>
                                            <Td>
                                                <Box
                                                    display="inline-flex"
                                                    alignItems="center"
                                                    px={2}
                                                    py={1}
                                                    borderRadius="md"
                                                    bg={isDeposit ? "green.100" : "red.100"}
                                                    color={isDeposit ? "green.800" : "red.800"}
                                                >
                                                    {isDeposit ? "Deposit" : "Withdrawal"}
                                                </Box>
                                            </Td>
                                            <Td fontWeight="semibold">
                                                {isDeposit ? '+' : ''}{parseFloat(saving.amount).toLocaleString('en-NG', {
                                                    style: 'currency',
                                                    currency: 'NGN',
                                                    minimumFractionDigits: 2
                                                })}
                                            </Td>
                                            <Td>
                                                <Box
                                                    display="inline-flex"
                                                    alignItems="center"
                                                    px={2}
                                                    py={1}
                                                    borderRadius="md"
                                                    bg={saving.status === 'COMPLETED' ? "blue.100" : "yellow.100"}
                                                    color={saving.status === 'COMPLETED' ? "blue.800" : "yellow.800"}
                                                >
                                                    {saving.status}
                                                </Box>
                                            </Td>
                                        </Tr>
                                    );
                                })}
                            </Tbody>
                        </Table>
                    </ModalBody>
                </ModalContent>
            </Modal>

            <Modal isOpen={isLoansOpen} onClose={onLoansClose} size="6xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Loan History for {data.first_name} {data.last_name} ({loanHistory.length} loans)</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody mb={6}>
                        <Box overflowX="auto">
                            <Table size="md">
                                <Thead bg="gray.100">
                                    <Tr>
                                        <Th>Reference</Th>
                                        <Th>Amount</Th>
                                        <Th>Account Number</Th>
                                        <Th>Status</Th>
                                        <Th>Date</Th>
                                        <Th>Actions</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {loanHistory.map((loan) => (
                                        <Tr key={loan.id}>
                                            <Td fontWeight="semibold">{loan.reference}</Td>
                                            <Td>
                                                {parseFloat(loan.amount).toLocaleString('en-NG', {
                                                    style: 'currency',
                                                    currency: 'NGN'
                                                })}
                                            </Td>
                                            <Td>{loan.accountNumber || 'N/A'}</Td>
                                            <Td>
                                                <Badge
                                                    colorScheme={
                                                        loan.status === 'APPROVED' ? 'green' :
                                                            loan.status === 'REJECTED' ? 'red' :
                                                                'yellow'
                                                    }
                                                    px={2}
                                                    py={1}
                                                    borderRadius="md"
                                                >
                                                    {loan.status.replace('_', ' ')}
                                                </Badge>
                                            </Td>
                                            <Td>{new Date(loan.createdAt).toLocaleDateString()}</Td>
                                            <Td>
                                                <Button
                                                    size="sm"
                                                    colorScheme="blue"
                                                    onClick={() => {
                                                        // Add your view details handler here
                                                        console.log('View details for loan:', loan.id);
                                                    }}
                                                >
                                                    View
                                                </Button>
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </Box>
                    </ModalBody>
                </ModalContent>
            </Modal>

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