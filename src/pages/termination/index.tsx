import { useState, useEffect } from 'react';
import { Download, UserX } from 'lucide-react';
import type { TableColumn } from '../../lib/types';
import DataTable from '../../components/table';
import { Badge, Button, Input, HStack } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import api from '../../api';

interface ITermination {
    id: string;
    reason: string;
    status: 'APPROVED' | 'PENDING' | 'REJECTED';
    member: {
        first_name: string;
        last_name: string;
        service_number: string;
        email: string;
        phone: string;
    };
    createdAt: string;
}

const Termination = () => {
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [terminations, setTerminations] = useState<ITermination[]>([]);
    const [filteredTerminations, setFilteredTerminations] = useState<ITermination[]>([]);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
    });

    const terminationStats = [
        {
            name: "All Terminations",
            value: terminations?.length || 0,
            color: "#1E17DB",
            bg: "#8280FF"
        },
        {
            name: "Approved Terminations",
            value: terminations?.filter(t => t.status === 'APPROVED')?.length || 0,
            color: "#A6039F",
            bg: "#FFDDFD"
        },
        {
            name: "Pending Terminations",
            value: terminations?.filter(t => t.status === 'PENDING')?.length || 0,
            color: "#FEC53D",
            bg: "#FFDDFD"
        },
        {
            name: "Rejected Terminations",
            value: terminations?.filter(t => t.status === 'REJECTED')?.length || 0,
            color: "red",
            bg: "#FFCCCB"
        },
    ];

    const terminationColumns: TableColumn<ITermination>[] = [
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
            title: 'Service Number',
            dataIndex: 'member',
            key: 'serviceNumber',
            render: (member: { service_number: string }) => (
                <span className="font-mono text-sm">{member.service_number}</span>
            ),
        },
        {
            title: 'Reason',
            dataIndex: 'reason',
            key: 'reason',
            render: (reason: string) => (
                <div className="max-w-xs truncate" title={reason}>
                    {reason}
                </div>
            ),
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

    const fetchTerminations = async () => {
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

            const response = await api.get('/api/termination', { params });
            const data = response.data.data || []
            setTerminations(data);
            setFilteredTerminations(response.data.data);
            setPagination(prev => ({
                ...prev,
                total: response.data.total || 0
            }));
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch termination requests",
                status: "error",
            });
            setTerminations([]);
            setFilteredTerminations([]);

        } finally {
            setLoading(false);
        }
    };

    const handleFilter = () => {
        if (!startDate || !endDate) {
            setFilteredTerminations(terminations);
            return;
        }

        const filtered = terminations?.filter(termination => {
            const terminationDate = new Date(termination.createdAt);
            const start = new Date(startDate);
            const end = new Date(endDate);
            return terminationDate >= start && terminationDate <= end;
        });

        setFilteredTerminations(filtered || []);
    };

    const handleTableChange = (pagination: any) => {
        setPagination(prev => ({
            ...prev,
            page: pagination.current,
            limit: pagination.pageSize
        }));
    };

    useEffect(() => {
        fetchTerminations();
    }, [pagination.page, pagination.limit]);

    useEffect(() => {
        handleFilter();
    }, [startDate, endDate, terminations]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between gap-4">
                {terminationStats.map((data, index) => (
                    <div key={index} className="bg-gray-100 p-4 rounded-lg cursor-pointer w-full">
                        <div className="flex justify-between">
                            <p className="font-semibold text-lg">{data.name}</p>
                            <div className="rounded-full p-2" style={{ background: data.bg }}>
                                <UserX size={15} color={data.color} />
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
                data={filteredTerminations || []}
                columns={terminationColumns}
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

export default Termination;