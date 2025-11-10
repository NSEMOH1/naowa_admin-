import { Badge, Box } from "@chakra-ui/react"
import { Logo } from "../../components/icons/logo";
import { formatApprovalDate } from "../../lib/utils";


const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div>
        <p className="text-sm text-gray-500 mb-1">{label}</p>
        <p className="font-medium text-lg">{value}</p>
    </div>
);

const LoanDetailsView = ({ data }: any) => {

    return (
        <Box bg="white" borderRadius="lg" boxShadow="md">
            <div className="bg-[#2D9CDB] text-white p-4 rounded-t-lg">
                <p className="font-semibold">Details</p>
            </div>
            <div className="p-4">
                <div className="flex justify-between mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <DetailItem label="Member Name" value={`${data.member.first_name} ${data.member.last_name}`} />
                        <DetailItem label="Loan ID" value={`${data.id}`} />
                        <DetailItem label="Loan Category" value={`${data.category.name}`} />
                        <DetailItem label="Reference" value={data.reference} />
                        <DetailItem label="Amount" value={`₦${data.amount}`} />
                        <DetailItem label="Approved Amount" value={`₦${data.approvedAmount}`} />
                        <DetailItem label="Months" value={data.durationMonths} />
                        <DetailItem label="Interest Rate" value={`${data.interestRate}%`} />
                        <DetailItem label="Date Applied" value={`${formatApprovalDate(data.createdAt)}`} />
                        <DetailItem
                            label="Date Approved"
                            value={data.start_date ? formatApprovalDate(data.start_date) : 'N/A'}
                        />
                        <DetailItem label="Status" value={
                            <Badge
                                colorScheme={
                                    data.status === 'APPROVED' ? 'green' :
                                        data.status === 'PENDING' ? 'yellow' :
                                            data.status === 'PENDING_VERIFICATION' ? 'yellow' :
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
            </div>
        </Box>
    )
}

export default LoanDetailsView