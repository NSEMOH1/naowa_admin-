import { useState, useCallback, useEffect, useRef } from "react";
import {
  Box,
  Text,
  Icon,
  VStack,
  HStack,
  useToast,
  FormControl,
  FormErrorMessage,
} from "@chakra-ui/react";
import { FolderUp, X, Image, CreditCard } from "lucide-react";

interface Document {
  id: string;
  name: string;
  file: File;
  type: "picture" | "validId";
}

interface UploadDocumentProps {
  onDocumentsChange: (docs: { picture?: File; validId?: File }) => void;
  onValidationChange?: (valid: boolean) => void;
  initialData?: {
    picture?: File;
    validId?: File;
  };
}

export const UploadDocument = ({
  onDocumentsChange,
  onValidationChange,
  initialData = {},
}: UploadDocumentProps) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const toast = useToast();
  const initialRender = useRef(true);

  const documentTypes = [
    { type: "picture", label: "Profile Picture", icon: Image, required: true },
    { type: "validId", label: "Valid ID", icon: CreditCard, required: true },
  ];

  useEffect(() => {
    if (initialRender.current) {
      const initialDocs: Document[] = [];
      Object.entries(initialData).forEach(([type, file]) => {
        if (file) {
          initialDocs.push({
            id: `${type}-${Date.now()}`,
            name: file.name,
            file,
            type: type as Document["type"],
          });
        }
      });
      setDocuments(initialDocs);
      initialRender.current = false;
    }
  }, [initialData]);

  useEffect(() => {
    if (!initialRender.current) {
      const files = {
        picture: undefined as File | undefined,
        signature: undefined as File | undefined,
        validId: undefined as File | undefined,
        personnelId: undefined as File | undefined,
      };

      documents.forEach((doc) => {
        files[doc.type] = doc.file;
      });

      onDocumentsChange(files);

      if (onValidationChange) {
        const isValid = documentTypes.every(
          (dt) => !dt.required || documents.some((d) => d.type === dt.type)
        );
        onValidationChange(isValid);
      }
    }
  }, [documents, onDocumentsChange, onValidationChange]);

  const handleFileUpload = useCallback(
    (type: Document["type"], e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files?.[0]) return;
      const file = e.target.files[0];

      const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a JPEG, PNG, or PDF file",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      const maxSizeInBytes = 2 * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 2MB",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      setDocuments((prev) => [
        ...prev.filter((doc) => doc.type !== type),
        {
          id: `${type}-${Date.now()}`,
          name: file.name,
          file,
          type,
        },
      ]);

      e.target.value = "";
    },
    [toast]
  );

  const removeDocument = useCallback((id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  }, []);

  return (
    <Box maxW="600px" mx="auto" p={4}>
      <VStack spacing={6} align="stretch">
        {documentTypes.map((docType: any) => {
          const uploadedDoc = documents.find(
            (doc) => doc.type === docType.type
          );
          const isRequired = docType.required;
          const isMissing = isRequired && !uploadedDoc;

          return (
            <FormControl key={docType.type} isInvalid={isMissing}>
              <Text mb={2} fontWeight="medium">
                {docType.label}
                {isRequired && <span style={{ color: "red" }}>*</span>}
              </Text>

              {uploadedDoc ? (
                <HStack
                  p={3}
                  bg="gray.50"
                  borderRadius="md"
                  justify="space-between"
                >
                  <HStack>
                    <Icon as={docType.icon} />
                    <Text>{uploadedDoc.name}</Text>
                  </HStack>
                  <Icon
                    as={X}
                    cursor="pointer"
                    onClick={() => removeDocument(uploadedDoc.id)}
                  />
                </HStack>
              ) : (
                <Box
                  as="label"
                  display="block"
                  p={6}
                  border="2px dashed"
                  borderColor={isMissing ? "red.300" : "gray.300"}
                  borderRadius="md"
                  textAlign="center"
                  cursor="pointer"
                  background="white"
                  _hover={{ borderColor: "blue.500" }}
                >
                  <VStack>
                    <Icon as={FolderUp} />
                    <Text>Upload {docType.label}</Text>
                    <Text fontSize="sm" color="gray.500">
                      {docType.type === "picture"
                        ? "Image (JPEG/PNG) MAX SIZE OF 2MB"
                        : "Image or PDF (MAX SIZE OF 2MB)"}
                    </Text>
                  </VStack>
                  <input
                    type="file"
                    accept={
                      docType.type === "picture"
                        ? "image/jpeg,image/png"
                        : "image/jpeg,image/png,application/pdf"
                    }
                    style={{ display: "none" }}
                    onChange={(e) => handleFileUpload(docType.type, e)}
                  />
                </Box>
              )}
              {isMissing && (
                <FormErrorMessage>{docType.label} is required</FormErrorMessage>
              )}
            </FormControl>
          );
        })}
      </VStack>
    </Box>
  );
};
