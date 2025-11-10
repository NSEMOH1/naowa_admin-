import { useState, useEffect, useMemo } from 'react';
import { Badge, Button, HStack, Input, Toast } from "@chakra-ui/react";
import DataTable from '../../../components/table';
import api from '../../../api';
import { exportToExcel } from '../../../lib/excelExport';

const FinancialReport = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/api/admin-report/financial');
                setData(response.data);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to fetch financial data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredData = useMemo(() => {
        return data.filter((item: any) => {
            const itemDate = new Date(item.date);
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
            title: "Debit",
            dataIndex: "debit",
            key: "debit",
            render: (text: string) => text !== '-' ? <Badge colorScheme="red">{text}</Badge> : '-',
        },
        {
            title: "Credit",
            dataIndex: "credit",
            key: "credit",
            render: (text: string) => text !== '-' ? <Badge colorScheme="green">{text}</Badge> : '-',
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
        },
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
            render: (text: string) => new Date(text).toLocaleDateString(),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (text: string) => text !== '-' ? <Badge colorScheme="green">{text}</Badge> : '-',
        },
    ];

    const handlePrint = () => {
        window.print();
    };

    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="mt-7">
            <p className="text-3xl font-bold mb-6">Financial Reports</p>
            <div className='flex justify-between items-center'>
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
                                // Transform the data to match column keys
                                const exportData = filteredData.map((item: any) => ({
                                    'Full Name': item.fullName,
                                    'Service Number': item.serviceNumber,
                                    'Account Number': item.accountNo,
                                    'Debit': item.debit,
                                    'Credit': item.credit,
                                    'Type': item.type,
                                    'Date': new Date(item.date).toLocaleDateString(),
                                    'Status': item.status
                                }));

                                // Check if there's data to export
                                if (exportData.length === 0) {
                                    Toast({ title: 'No data found', status: 'warning' })
                                    return;
                                }

                                const columns = [
                                    { key: 'Full Name', header: 'Full Name', width: 20 },
                                    { key: 'Service Number', header: 'Service Number', width: 18 },
                                    { key: 'Account Number', header: 'Account Number', width: 18 },
                                    { key: 'Debit', header: 'Debit', width: 15, type: 'currency' as const },
                                    { key: 'Credit', header: 'Credit', width: 15, type: 'currency' as const },
                                    { key: 'Type', header: 'Type', width: 15 },
                                    { key: 'Date', header: 'Date', width: 15 },
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
                                    filename: `financial-report${dateRange}_${new Date().toISOString().slice(0, 10)}.xlsx`,
                                    sheetName: 'Financial Report',
                                    title: `Financial Report${dateRange ? ` (${dateRange.replace(/_/g, ' ')})` : ''}`
                                });

                                console.log(`Successfully exported ${exportData.length} financial records`);

                            } catch (error) {
                                console.error('Export failed:', error);
                                Toast({ title: 'Export failed', status: 'error' })
                            }
                        }}
                    >
                        Export ({filteredData.length})
                    </button>

                    <Button onClick={handlePrint} colorScheme="teal" size="sm">Print Report</Button>
                </HStack>

                <HStack spacing={4} mb={4}>
                    <HStack>
                        <label htmlFor="startDate" className="text-xs font-medium mb-1">From</label>
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
}

export default FinancialReport;