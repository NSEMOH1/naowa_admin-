import { useState, useEffect } from 'react';
import { Download, FileText } from 'lucide-react';
import type { TableColumn } from '../../lib/types';
import DataTable from '../../components/table';
import { Badge, Button, Input, HStack } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import api from '../../api';

interface IRequest {
    id: string;
    email: string;
    phone: string;
    reason: string;
    status: 'APPROVED' | 'PENDING' | 'REJECTED';
    member: {
        first_name: string;
        last_name: string;
    };
    createdAt: string;
}

const Request = () => {
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [requests, setRequests] = useState<IRequest[]>([]);
    const [filteredRequests, setFilteredRequests] = useState<IRequest[]>([]);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
    });

    const requestStats = [
        {
            name: "All Requests",
            value: requests?.length || 0,
            color: "#1E17DB",
            bg: "#8280FF"
        },
        {
            name: "Approved Requests",
            value: requests?.filter(r => r.status === 'APPROVED')?.length || 0,
            color: "#A6039F",
            bg: "#FFDDFD"
        },
        {
            name: "Pending Requests",
            value: requests?.filter(r => r.status === 'PENDING')?.length || 0,
            color: "#FEC53D",
            bg: "#FFDDFD"
        },
        {
            name: "Rejected Requests",
            value: requests?.filter(r => r.status === 'REJECTED')?.length || 0,
            color: "red",
            bg: "#FFCCCB"
        },
    ];

    const requestColumns: TableColumn<IRequest>[] = [
        {
            title: 'Name',
            dataIndex: 'member',
            key: 'name',
            width: 70,
            render: (member: { first_name: string, last_name: string }) => (
                <span className="font-semibold">{member.first_name} {member.last_name}</span>
            ),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: (email: string) => (
                <a href={`mailto:${email}`} className="text-blue-500 hover:underline">
                    {email}
                </a>
            ),
        },
        {
            title: 'Phone Number',
            dataIndex: 'phone',
            key: 'phoneNumber',
        },
        {
            title: 'Reason',
            dataIndex: 'reason',
            key: 'reason',
        },

        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'date',
            render: (date: string) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: 'APPROVED' | 'PENDING' | 'REJECTED') => (
                <Badge
                    colorScheme={
                        status === 'APPROVED' ? 'green' :
                            status === 'PENDING' ? 'yellow' : 'red'
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

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const params = {
                page: pagination.page,
                limit: pagination.limit,
                ...(startDate && endDate && {
                    startDate,
                    endDate
                })
            };

            const response = await api.get('/api/requests', { params });
            const data = response.data.data || []
            setRequests(data);
            setFilteredRequests(response.data.data);
            setPagination(prev => ({
                ...prev,
                total: response.data.total || 0
            }));
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch requests",
                status: "error",
            });
            setRequests([]);
            setFilteredRequests([]);

        } finally {
            setLoading(false);
        }
    };

    const handleFilter = () => {
        if (!startDate || !endDate) {
            setFilteredRequests(requests);
            return;
        }

        const filtered = requests?.filter(request => {
            const requestDate = new Date(request.createdAt);
            const start = new Date(startDate);
            const end = new Date(endDate);
            return requestDate >= start && requestDate <= end;
        });

        setFilteredRequests(filtered || []);
    };

    const handleTableChange = (pagination: any) => {
        setPagination(prev => ({
            ...prev,
            page: pagination.current,
            limit: pagination.pageSize
        }));
    };

    useEffect(() => {
        fetchRequests();
    }, [pagination.page, pagination.limit]);

    useEffect(() => {
        handleFilter();
    }, [startDate, endDate, requests]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between gap-4">
                {requestStats.map((data, index) => (
                    <div key={index} className="bg-gray-100 p-4 rounded-lg cursor-pointer w-full">
                        <div className="flex justify-between">
                            <p className="font-semibold text-lg">{data.name}</p>
                            <div className="rounded-full p-2" style={{ background: data.bg }}>
                                <FileText size={15} color={data.color} />
                            </div>
                        </div>
                        <p className="font-bold text-3xl pt-7">{data.value}</p>
                    </div>
                ))}
            </div>

            <HStack spacing={4} mb={4} justifyContent='space-between'>
                <div className='flex gap-4'>
                    <HStack>
                        <label className='text-xs' htmlFor="">From</label>
                        <Input

                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            placeholder="Start Date"
                            size="xs"
                        />
                    </HStack>
                    <HStack>
                        <label className='text-xs' htmlFor="">To</label>
                        <Input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            placeholder="End Date"
                            size="xs"
                        />
                    </HStack>
                </div>
                <Button
                    variant='outline'
                    size='xs'
                    // onClick={handleExport}
                    colorScheme="blue"
                >
                    <Download size={18} />
                </Button>
            </HStack>

            <DataTable
                data={filteredRequests || []}
                columns={requestColumns}
                rowKey="id"
                showExport={false}
                showFilters={true}
                tableHeaderBg="#F1F4F9"
                tableHeaderColor="black"
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
};

export default Request;