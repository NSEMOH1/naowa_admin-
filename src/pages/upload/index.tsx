import { useState, useEffect } from "react";
import {
  Upload,
  Download,
  FileText,
  CheckCircle,
  XCircle,
  Filter,
} from "lucide-react";
import {
  Button,
  Input,
  HStack,
  VStack,
  Box,
  Text,
  Badge,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Progress,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Checkbox,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Spinner,
} from "@chakra-ui/react";
import type { UploadLog, UploadResult } from "../../lib/types";
import * as XLSX from "xlsx";
import api from "../../api";

const BulkUpload = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [uploadLogs, setUploadLogs] = useState<UploadLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectedLogs, setSelectedLogs] = useState<string[]>([]);

  const fetchUploadLogs = async () => {
    setLoading(true);
    try {
      const params = {
        ...(startDate && endDate && { startDate, endDate }),
      };
      const response = await api.get("/api/savings/logs", { params });
      setUploadLogs(response.data.data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch upload logs",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
      ];

      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please select an Excel file (.xlsx or .xls)",
          status: "error",
        });
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "File size must be less than 10MB",
          status: "error",
        });
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a file to upload",
        status: "warning",
      });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      console.log(selectedFile);
      formData.append("uploadType", "MONTHLY DEDUCTIONS");

      const response = await api.post(
        "/api/savings/upload/cooperative-savings",
        formData,
        {
          headers: {
            "Content-Type": undefined,
          },
        }
      );

      setUploadResult(response.data);

      if (response.data.success) {
        toast({
          title: "Upload Successful",
          description: `Processed ${response.data.processedCount} records successfully`,
          status: "success",
        });

        fetchUploadLogs();

        setSelectedFile(null);
        const fileInput = document.getElementById(
          "file-upload"
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      } else {
        toast({
          title: "Upload Failed",
          description: "Some records could not be processed",
          status: "warning",
        });
      }
      onOpen();
    } catch (error) {
      toast({
        title: "Upload Error",
        description: error instanceof Error ? error.message : "Upload failed",
        status: "error",
      });
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const template = [
      ["Email", "Username", "Amount", "Name"],
      ["john.doe@example.com", "JohnDoe", "15000", "John Doe"],
      ["jane.smith@example.com", "JaneDoe", "20000", "Jane Smith"],
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(template);
    XLSX.utils.book_append_sheet(wb, ws, "Template");

    XLSX.writeFile(wb, "monthly_deductions_template.xlsx");
  };

  const handleLogSelection = (logId: string, checked: boolean) => {
    if (checked) {
      setSelectedLogs([...selectedLogs, logId]);
    } else {
      setSelectedLogs(selectedLogs.filter((id) => id !== logId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLogs(uploadLogs.map((log) => log.id));
    } else {
      setSelectedLogs([]);
    }
  };

  useEffect(() => {
    fetchUploadLogs();
  }, [startDate, endDate]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-teal-600"></h1>
        </div>

        <Menu>
          <MenuButton
            as={Button}
            colorScheme="teal"
            size="sm"
            rightIcon={<Upload size={16} />}
          >
            Bulk Uploads
          </MenuButton>
          <MenuList>
            <MenuItem
              icon={<FileText size={16} />}
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              Upload Cooperative Deductions
            </MenuItem>
            <MenuItem icon={<Download size={16} />} onClick={downloadTemplate}>
              Download Template
            </MenuItem>
          </MenuList>
        </Menu>

        <input
          id="file-upload"
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />
      </div>

      {selectedFile && (
        <Box
          p={4}
          bg="gray.50"
          borderRadius="md"
          border="1px solid"
          borderColor="gray.200"
        >
          <VStack spacing={3}>
            <HStack spacing={3} width="100%">
              <FileText size={20} color="teal" />
              <VStack align="start" spacing={0} flex={1}>
                <Text fontWeight="medium">{selectedFile.name}</Text>
                <Text fontSize="sm" color="gray.600">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </Text>
              </VStack>
              <Button
                colorScheme="teal"
                size="sm"
                onClick={handleUpload}
                isLoading={uploading}
                loadingText="Uploading..."
              >
                Upload File
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedFile(null);
                  const fileInput = document.getElementById(
                    "file-upload"
                  ) as HTMLInputElement;
                  if (fileInput) fileInput.value = "";
                }}
              >
                Cancel
              </Button>
            </HStack>

            {uploading && (
              <Box width="100%">
                <Progress size="sm" isIndeterminate colorScheme="teal" />
                <Text fontSize="sm" color="gray.600" mt={1}>
                  Processing file... This may take a few minutes.
                </Text>
              </Box>
            )}
          </VStack>
        </Box>
      )}

      <div>
        <div className="flex justify-between items-center mb-4">
          <p className="text-lg font-semibold text-teal-600">
            Upload Deductions
          </p>

          <HStack spacing={4}>
            <HStack>
              <Text fontSize="sm">From</Text>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                size="sm"
                width="150px"
              />
            </HStack>
            <HStack>
              <Text fontSize="sm">To</Text>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                size="sm"
                width="150px"
              />
            </HStack>
            <Button variant="outline" size="sm">
              <Filter size={16} />
            </Button>
          </HStack>
        </div>

        <TableContainer>
          <Table variant="simple" size="sm">
            <Thead bg="#F1F4F9">
              <Tr>
                <Th>
                  <Checkbox
                    isChecked={
                      selectedLogs.length === uploadLogs.length &&
                      uploadLogs.length > 0
                    }
                    isIndeterminate={
                      selectedLogs.length > 0 &&
                      selectedLogs.length < uploadLogs.length
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </Th>
                <Th>File Name</Th>
                <Th>Upload Type</Th>
                <Th>Processed Time</Th>
                <Th>Processed Items</Th>
                <Th>Failed Items</Th>
                <Th>Date</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {loading ? (
                <Tr>
                  <Td colSpan={7} textAlign="center" py={8}>
                    <Spinner size="sm" mr={2} />
                    Loading...
                  </Td>
                </Tr>
              ) : uploadLogs.length === 0 ? (
                <Tr>
                  <Td colSpan={7} textAlign="center" py={8} color="gray.500">
                    No Data
                  </Td>
                </Tr>
              ) : (
                uploadLogs.map((log) => (
                  <Tr key={log.id} _hover={{ bg: "gray.50" }}>
                    <Td>
                      <Checkbox
                        isChecked={selectedLogs.includes(log.id)}
                        onChange={(e) =>
                          handleLogSelection(log.id, e.target.checked)
                        }
                      />
                    </Td>
                    <Td>
                      <HStack>
                        <FileText size={16} color="teal" />
                        <Text fontWeight="medium">{log.fileName}</Text>
                      </HStack>
                    </Td>
                    <Td>
                      <Badge colorScheme="blue" variant="subtle">
                        {log.uploadType}
                      </Badge>
                    </Td>
                    <Td>{log.processedTime}</Td>
                    <Td>
                      <HStack>
                        <CheckCircle size={14} color="green" />
                        <Text>{log.processedItems}</Text>
                      </HStack>
                    </Td>
                    <Td>
                      {log.failedItems > 0 ? (
                        <HStack>
                          <XCircle size={14} color="red" />
                          <Text color="red.500">{log.failedItems}</Text>
                        </HStack>
                      ) : (
                        <Text color="gray.500">0</Text>
                      )}
                    </Td>
                    <Td>{new Date(log.date).toLocaleDateString()}</Td>
                    <Td>
                      <Text
                        fontWeight="semibold"
                        color={
                          log.status === "COMPLETED"
                            ? "green"
                            : log.status === "PROCESSING"
                            ? "orange"
                            : log.status === "FAILED"
                            ? "red"
                            : "gray"
                        }
                      >
                        {log.status}
                      </Text>
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </div>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload Results</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {uploadResult && (
              <VStack spacing={4} align="stretch">
                <Alert status={uploadResult.success ? "success" : "error"}>
                  <AlertIcon />
                  <Box>
                    <AlertTitle>
                      {uploadResult.success
                        ? "Upload Completed!"
                        : "Upload Failed!"}
                    </AlertTitle>
                    <AlertDescription>
                      Processed {uploadResult.processedCount} records
                      successfully.
                      {uploadResult.errorCount > 0 &&
                        ` ${uploadResult.errorCount} records failed.`}
                    </AlertDescription>
                  </Box>
                </Alert>

                <HStack spacing={4}>
                  <Box p={3} bg="green.50" borderRadius="md" flex={1}>
                    <Text fontSize="sm" color="green.600">
                      Total Amount
                    </Text>
                    <Text fontSize="lg" fontWeight="bold" color="green.700">
                      ₦{uploadResult.summary.totalAmount.toLocaleString()}
                    </Text>
                  </Box>
                  <Box p={3} bg="blue.50" borderRadius="md" flex={1}>
                    <Text fontSize="sm" color="blue.600">
                      Valid Records
                    </Text>
                    <Text fontSize="lg" fontWeight="bold" color="blue.700">
                      {uploadResult.summary.validRecords}
                    </Text>
                  </Box>
                  <Box p={3} bg="red.50" borderRadius="md" flex={1}>
                    <Text fontSize="sm" color="red.600">
                      Invalid Records
                    </Text>
                    <Text fontSize="lg" fontWeight="bold" color="red.700">
                      {uploadResult.summary.invalidRecords}
                    </Text>
                  </Box>
                </HStack>

                {uploadResult.errors.length > 0 && (
                  <Box>
                    <Text fontWeight="bold" mb={2} color="red.600">
                      Errors ({uploadResult.errors.length}):
                    </Text>
                    <Box
                      maxH="200px"
                      overflowY="auto"
                      bg="red.50"
                      p={3}
                      borderRadius="md"
                    >
                      <VStack spacing={2} align="stretch">
                        {uploadResult.errors.map((error, index) => (
                          <Box
                            key={index}
                            p={2}
                            bg="white"
                            borderRadius="sm"
                            fontSize="sm"
                          >
                            <Text fontWeight="medium">
                              Row {error.row}
                              {error.serviceNumber &&
                                ` (${error.serviceNumber})`}
                              :
                            </Text>
                            <Text color="red.600">{error.error}</Text>
                          </Box>
                        ))}
                      </VStack>
                    </Box>
                  </Box>
                )}
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default BulkUpload;
