import React, { useState } from 'react';
import {
    Button,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Checkbox,
    Flex,
    Box,
    Select,
    HStack,
    Text,
    IconButton,
    Fade,
    Spinner,
    Center,
} from '@chakra-ui/react';
import { MoveRight, MoveLeft, Eye, Check, Key, X, Edit, Trash2 } from 'lucide-react';
import type { CSSProperties } from 'react';
import type { TableColumn } from '../../lib/types';

interface ActionButton {
    name: string;
    icon?: React.ReactNode;
    colorScheme?: string;
    variant?: string;
    onClick?: (selectedRows: any[]) => void;
}

interface Pagination {
    current: number;
    pageSize: number;
    total: number;
}

interface DataTableProps<T> {
    data: T[];
    columns: TableColumn<T>[];
    rowKey: string;
    showExport?: boolean;
    showFilters?: boolean;
    pageSizeOptions?: number[];
    backgroundImage?: string;
    scrollX?: number;
    tableHeaderBg?: string;
    tableHeaderColor?: string;
    btnData?: ButtonData[] | undefined;
    actionButtons?: ActionButton[];
    showActionBar?: boolean;
    onRowClick?: (record: T) => void;
    loading?: boolean;
    pagination?: Pagination;
    onChange?: (pagination: Pagination) => void;
    onBtnClick?: (buttonName: any) => void
    
}

interface ButtonData {
    name: string;
}

const DataTable = <T extends object>({
    data,
    columns,
    rowKey,
    pageSizeOptions = [10, 20, 50, 100],
    backgroundImage,
    tableHeaderBg,
    tableHeaderColor,
    btnData = [],
    actionButtons = [],
    showActionBar = false,
    onBtnClick,
    onRowClick,
    loading = false,
    pagination: externalPagination,
    onChange,
}: DataTableProps<T>) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [internalPageSize, setInternalPageSize] = useState(pageSizeOptions[0]);
    const [internalCurrentPage, setInternalCurrentPage] = useState(1);

    // Use external pagination if provided, otherwise use internal state
    const isControlled = externalPagination !== undefined;
    const pagination = isControlled ? externalPagination : {
        current: internalCurrentPage,
        pageSize: internalPageSize,
        total: data.length,
    };

    const { current: currentPage, pageSize, total } = pagination;

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, total);
    const currentData = isControlled ? data : data.slice(startIndex, endIndex);
    const totalPages = Math.ceil(total / pageSize);

    // Get selected row data
    const selectedRows = data.filter(row => selectedRowKeys.includes((row as any)[rowKey]));

    const handleRowSelection = (id: React.Key) => {
        setSelectedRowKeys(prev =>
            prev.includes(id)
                ? prev.filter(key => key !== id)
                : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedRowKeys.length === currentData.length) {
            setSelectedRowKeys([]);
        } else {
            const currentIds = currentData.map(row => (row as any)[rowKey]);
            setSelectedRowKeys(currentIds);
        }
    };

    const handlePageChange = (newPage: number) => {
        if (isControlled) {
            onChange?.({ ...pagination, current: newPage });
        } else {
            setInternalCurrentPage(newPage);
        }
    };

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSize = parseInt(e.target.value);
        if (isControlled) {
            onChange?.({ ...pagination, pageSize: newSize, current: 1 });
        } else {
            setInternalPageSize(newSize);
            setInternalCurrentPage(1);
        }
    };

    const getDefaultActionButtons = (): ActionButton[] => [
        {
            name: 'View Details',
            icon: <Eye size={16} />,
            colorScheme: 'blue',
            variant: 'solid',
            onClick: () => null
        },
        {
            name: 'Approve',
            icon: <Check size={16} />,
            colorScheme: 'green',
            variant: 'solid',
            onClick: () => null
        },
        {
            name: 'Generate Password',
            icon: <Key size={16} />,
            colorScheme: 'purple',
            variant: 'solid',
            onClick: () => null
        },
        {
            name: 'Reject',
            icon: <X size={16} />,
            colorScheme: 'red',
            variant: 'solid',
            onClick: () => null
        },
        {
            name: 'Edit',
            icon: <Edit size={16} />,
            colorScheme: 'orange',
            variant: 'solid',
            onClick: () => null
        },
        {
            name: 'Delete',
            icon: <Trash2 size={16} />,
            colorScheme: 'red',
            variant: 'outline',
            onClick: () => null
        }
    ];

    const buttonsToShow = actionButtons.length > 0 ? actionButtons : getDefaultActionButtons();

    const containerStyle: CSSProperties = {
        position: 'relative',
        borderRadius: '8px',
        overflow: 'hidden',
    };

    const backgroundStyle: CSSProperties = backgroundImage ? {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `url(${backgroundImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'contain',
        opacity: 0.4,
        pointerEvents: 'none',
    } : {};

    return (
        <Box className="rounded-lg shadow-lg p-2" style={containerStyle}>
            {backgroundImage && <Box style={backgroundStyle} />}

            <Box position="relative" zIndex={1}>
                <div className='flex justify-between'>
                    {btnData.length > 0 && (
                        <Flex mb={4} gap={2} wrap="wrap">
                            {btnData.map((data, index) => (
                                <Button
                                    key={`${data.name}-${index}`}
                                    size="sm"
                                    variant="outline"
                                    borderWidth="1px"
                                    onClick={onBtnClick}
                                >
                                    {data.name}
                                </Button>
                            ))}
                        </Flex>
                    )}
                </div>

                <TableContainer maxHeight='100%' overflowX="auto" maxWidth="100%">
                    {/* Conditional Action Bar */}
                    {showActionBar && (
                        <Fade in={selectedRowKeys.length > 0}>
                            <Box
                                bg="blue.50"
                                borderRadius="md"
                                border="1px solid"
                                borderColor="blue.200"
                                mb={2}
                                transition="all 0.2s"
                                display='flex'
                                justifyContent='flex-end'
                            >
                                {selectedRowKeys.length > 0 && (
                                    <Box p={3}>
                                        <Flex gap={2} wrap="wrap">
                                            {buttonsToShow.map((button, index) => (
                                                <Button
                                                    key={`action-${index}`}
                                                    size="sm"
                                                    color={button.colorScheme || 'blue'}
                                                    variant={button.variant || 'solid'}
                                                    onClick={() => button.onClick?.(selectedRows)}
                                                    bg='transparent'
                                                >
                                                    {button.name}
                                                </Button>
                                            ))}
                                        </Flex>
                                    </Box>
                                )}
                            </Box>
                        </Fade>
                    )}

                    <Table variant="simple" size="md" className="bg-transparent">
                        <Thead bg={tableHeaderBg}>
                            <Tr>
                                <Th px={3} py={2} borderWidth="1px">
                                    <Checkbox
                                        isChecked={currentData.length > 0 && selectedRowKeys.length === currentData.length}
                                        onChange={handleSelectAll}
                                        colorScheme='green'
                                    />
                                </Th>
                                {columns.map((column, index) => (
                                    <Th
                                        key={index}
                                        px={3}
                                        py={2}
                                        borderWidth="1px"
                                        minWidth={column.width || 'auto'}
                                        color={tableHeaderColor}
                                    >
                                        {column.title}
                                    </Th>
                                ))}
                            </Tr>
                        </Thead>
                        <Tbody>
                            {loading ? (
                                <Tr>
                                    <Td colSpan={columns.length + 1}>
                                        <Center py={10}>
                                            <Spinner size="xl" />
                                        </Center>
                                    </Td>
                                </Tr>
                            ) : (
                                currentData.map((record: any) => (
                                    <Tr key={record[rowKey]}>
                                        <Td px={3} py={2} borderWidth="1px">
                                            <Checkbox
                                                isChecked={selectedRowKeys.includes(record[rowKey])}
                                                onChange={() => handleRowSelection(record[rowKey])}
                                                colorScheme='green'
                                            />
                                        </Td>
                                        {columns.map((column, index) => (
                                            <Td
                                                key={index}
                                                px={3}
                                                py={2}
                                                borderWidth="1px"
                                                onClick={() => onRowClick?.(record)}
                                                cursor={onRowClick ? "pointer" : "default"}
                                            >
                                                {column.render
                                                    ? column.render(column.dataIndex ? record[column.dataIndex] : undefined, record)
                                                    : column.dataIndex ? record[column.dataIndex] : undefined}
                                            </Td>
                                        ))}
                                    </Tr>
                                ))
                            )}
                        </Tbody>
                    </Table>
                </TableContainer>

                {/* Custom Pagination */}
                <Flex justify="space-between" mt={4} align="center">
                    <Box>
                        <Text fontSize="sm">
                            Showing {startIndex + 1} to {Math.min(endIndex, total)} of {total} entries
                        </Text>
                    </Box>

                    <HStack spacing={2}>
                        <IconButton
                            aria-label="Previous page"
                            icon={<MoveLeft />}
                            size="sm"
                            onClick={() => handlePageChange(currentPage - 1)}
                            isDisabled={currentPage === 1 || loading}
                        />

                        <Text fontSize="sm">
                            Page {currentPage} of {totalPages}
                        </Text>

                        <IconButton
                            aria-label="Next page"
                            icon={<MoveRight />}
                            size="sm"
                            onClick={() => handlePageChange(currentPage + 1)}
                            isDisabled={currentPage === totalPages || loading}
                        />

                        <Select
                            value={pageSize}
                            onChange={handlePageSizeChange}
                            size="sm"
                            width="80px"
                            isDisabled={loading}
                        >
                            {pageSizeOptions.map(size => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </Select>
                        <Text fontSize="sm">per page</Text>
                    </HStack>
                </Flex>
            </Box>
        </Box>
    );
};

export default DataTable;