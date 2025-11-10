import { useState, useEffect, useMemo } from 'react';
import { Badge, Button, HStack, Input, Toast } from "@chakra-ui/react";
import DataTable from '../../../components/table';
import api from '../../../api';
import { exportToExcel } from '../../../lib/excelExport';

const MonthlyDeductionReport = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/api/admin-report/monthly-deductions');
                setData(response.data);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to fetch deductions data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredData = useMemo(() => {
        if (!startDate && !endDate) return data;

        return data.filter((item: any) => {
            const itemDate = new Date(item.date || item.createdAt);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;

            if (start && itemDate < start) return false;
            if (end && itemDate > end) return false;
            return true;
        });
    }, [data, startDate, endDate]);

    const columns = [
        {
            title: "Full Name",
            dataIndex: "fullName",
            key: "fullName",
        },
        {
            title: "Service Number",
            dataIndex: "serviceNumber",
            key: "serviceNumber",
        },
        {
            title: "Account Number",
            dataIndex: "accountNo",
            key: "accountNo",
        },
        {
            title: "Deduction Amount",
            dataIndex: "deduction",
            key: "deduction",
            render: (text: string) => <Badge colorScheme="blue">{text}</Badge>,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (text: string) => (
                <Badge colorScheme={text === 'ACTIVE' ? 'green' : 'red'}>
                    {text}
                </Badge>
            ),
        },
    ];

    const handlePrint = () => {
        window.print();
    };

    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="mt-14">
            <p className="text-3xl font-bold mb-6">Monthly Deductions</p>
            <div className='flex justify-between'>
                <HStack spacing={4}>
                    <button
                        style={{
                            background: "green",
                            color: "white",
                            padding: "8px 16px",
                            borderRadius: '5px',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                        onClick={() => {
                            try {

                                const exportData = filteredData.map((item: any) => ({
                                    'Full Name': item.fullName,
                                    'Service Number': item.serviceNumber,
                                    'Account Number': item.accountNo,
                                    'Deduction Amount': item.deduction,
                                    'Status': item.status
                                }));

                                if (exportData.length === 0) {
                                    Toast({ title: 'No deduction data found', status: 'warning'})
                                    return;
                                }

                                const columns = [
                                    { key: 'Full Name', header: 'Full Name', width: 20 },
                                    { key: 'Service Number', header: 'Service Number', width: 18 },
                                    { key: 'Account Number', header: 'Account Number', width: 18 },
                                    { key: 'Deduction Amount', header: 'Deduction Amount', width: 18 },
                                    { key: 'Status', header: 'Status', width: 15 }
                                ];

                                const dateRange = startDate && endDate
                                    ? `_${startDate}_to_${endDate}`
                                    : startDate
                                        ? `_from_${startDate}`
                                        : endDate
                                            ? `_to_${endDate}`
                                            : '';

                                exportToExcel({
                                    data: exportData,
                                    columns,
                                    filename: `monthly-deductions${dateRange}_${new Date().toISOString().slice(0, 10)}.xlsx`,
                                    sheetName: 'Monthly Deductions',
                                    title: `Monthly Deductions Report${dateRange ? ` (${dateRange.replace(/_/g, ' ')})` : ''}`
                                });

                                console.log(`Successfully exported ${exportData.length} deduction records`);

                            } catch (error) {
                                console.error('Export failed:', error);
                                Toast({ title: 'Export failed', status: 'error'})
                                
                            }
                        }}
                    >
                        Export Excel ({filteredData.length})
                    </button>

                    <Button onClick={handlePrint} colorScheme="teal" size="sm">Print Report</Button>
                </HStack>

                <HStack spacing={4} mb={4}>
                    <HStack>
                        <label htmlFor="startDate" className="block text-xs font-medium mb-1">From</label>
                        <Input
                            size='sm'
                            type="date"
                            id="startDate"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            max={endDate || undefined}
                        />
                    </HStack>
                    <HStack>
                        <label htmlFor="endDate" className="block text-xs font-medium mb-1">To</label>
                        <Input
                            size='sm'
                            type="date"
                            id="endDate"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            min={startDate || undefined}
                        />
                    </HStack>
                </HStack>
            </div>

            <DataTable
                data={filteredData}
                columns={columns}
                loading={loading}
                rowKey="serviceNumber"
            />
        </div>
    );
};

export default MonthlyDeductionReport;