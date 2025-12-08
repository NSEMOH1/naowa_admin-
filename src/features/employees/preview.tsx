import React from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Badge,
  Grid,
  GridItem,
  Card,
  CardHeader,
  CardBody,
  Icon,
} from "@chakra-ui/react";
import {
  UserIcon,
  Phone,
  Mail,
  MapPin,
  FileText,
  Shield,
  CreditCard,
} from "lucide-react";

interface PreviewStepProps {
  personalInfo: any;
  nextOfKinInfo: any;
  documents: any;
  securityInfo: any;
}

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) => (
  <HStack spacing={3} align="start">
    <Icon as={icon} color="blue.500" mt={1} />
    <Box>
      <Text fontSize="sm" color="gray.600" fontWeight="medium">
        {label}
      </Text>
      <Text fontSize="sm" color="gray.800">
        {value || "Not provided"}
      </Text>
    </Box>
  </HStack>
);

const SectionCard = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: any;
  children: React.ReactNode;
}) => (
  <Card variant="outline" size="sm">
    <CardHeader pb={2}>
      <HStack>
        <Icon as={icon} color="blue.500" />
        <Heading size="sm" color="blue.600">
          {title}
        </Heading>
      </HStack>
    </CardHeader>
    <CardBody pt={0}>{children}</CardBody>
  </Card>
);

export const PreviewStep: React.FC<PreviewStepProps> = ({
  personalInfo,
  nextOfKinInfo,
  documents,
  securityInfo,
}) => {
  return (
    <VStack spacing={6} align="stretch">
      <Box textAlign="center">
        <Heading size="md" color="#982323" mb={2}>
          Review Your Information
        </Heading>
        <Text fontSize="sm" color="gray.600">
          Please review all the information below before submitting your
          registration
        </Text>
      </Box>

      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
        {/* Personal Information */}
        <GridItem>
          <SectionCard title="Personal Information" icon={UserIcon}>
            <VStack spacing={3} align="stretch">
              <InfoRow
                icon={UserIcon}
                label="Full Name"
                value={personalInfo.full_name}
              />

              <InfoRow icon={Mail} label="Email" value={personalInfo?.email} />

              <InfoRow
                icon={Phone}
                label="Phone"
                value={personalInfo?.phone_number}
              />

              <InfoRow
                icon={MapPin}
                label="Address"
                value={personalInfo?.address}
              />

              <HStack spacing={3}>
                <Icon as={MapPin} color="blue.500" />
                <Box>
                  <Text fontSize="sm" color="gray.600" fontWeight="medium">
                    Location
                  </Text>
                  <Text fontSize="sm" color="gray.800">
                    {personalInfo?.lga}, {personalInfo?.state_of_origin}
                  </Text>
                </Box>
              </HStack>

              <HStack spacing={3}>
                <Icon as={UserIcon} color="blue.500" />
                <Box>
                  <Text fontSize="sm" color="gray.600" fontWeight="medium">
                    Gender
                  </Text>
                  <Badge colorScheme="blue" size="sm">
                    {personalInfo?.gender}
                  </Badge>
                </Box>
              </HStack>
            </VStack>
          </SectionCard>
        </GridItem>
        <GridItem>
          <SectionCard title="Next of Kin" icon={UserIcon}>
            <VStack spacing={3} align="stretch">
              <InfoRow
                icon={UserIcon}
                label="Name"
                value={`${nextOfKinInfo?.title || ""} ${
                  nextOfKinInfo?.first_name || ""
                } ${nextOfKinInfo?.last_name || ""}`.trim()}
              />

              <InfoRow
                icon={UserIcon}
                label="Relationship"
                value={nextOfKinInfo?.relationship}
              />

              <InfoRow
                icon={Phone}
                label="Phone"
                value={nextOfKinInfo?.phone}
              />

              <InfoRow icon={Mail} label="Email" value={nextOfKinInfo?.email} />

              <InfoRow
                icon={MapPin}
                label="Address"
                value={nextOfKinInfo?.address}
              />

              <HStack spacing={3}>
                <Icon as={UserIcon} color="blue.500" />
                <Box>
                  <Text fontSize="sm" color="gray.600" fontWeight="medium">
                    Details
                  </Text>
                  <Text fontSize="sm" color="gray.800">
                    {nextOfKinInfo?.gender}, {nextOfKinInfo?.nationality}
                  </Text>
                </Box>
              </HStack>
            </VStack>
          </SectionCard>
        </GridItem>

        {/* Service Information */}
        <GridItem>
          <SectionCard title="Service Information" icon={FileText}>
            <VStack spacing={3} align="stretch">
              <InfoRow icon={FileText} label="PIN" value="●●●●" />

              <InfoRow
                icon={CreditCard}
                label="Monthly Deduction"
                value={
                  personalInfo?.monthlyDeduction
                    ? `₦${personalInfo.monthlyDeduction.toLocaleString()}`
                    : "Not set"
                }
              />
            </VStack>
          </SectionCard>
        </GridItem>

        {/* Bank Information */}
        <GridItem>
          <SectionCard title="Bank Information" icon={CreditCard}>
            <VStack spacing={3} align="stretch">
              <InfoRow
                icon={CreditCard}
                label="Bank Name"
                value={personalInfo?.bank_name}
              />

              <InfoRow
                icon={CreditCard}
                label="Account Number"
                value={personalInfo?.account_number}
              />
            </VStack>
          </SectionCard>
        </GridItem>

        {/* Documents */}
        <GridItem colSpan={{ base: 1, md: 2 }}>
          <SectionCard title="Documents" icon={FileText}>
            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr 1fr" }} gap={4}>
              <Box textAlign="center">
                <Text fontSize="sm" color="gray.600" mb={2}>
                  Valid ID
                </Text>
                <Badge
                  colorScheme={documents?.picture ? "green" : "red"}
                  size="sm"
                >
                  {documents.picture ? "Selected" : "Not uploaded"}
                </Badge>
              </Box>

              <Box textAlign="center">
                <Text fontSize="sm" color="gray.600" mb={2}>
                  Valid ID
                </Text>
                <Badge
                  colorScheme={documents?.validId ? "green" : "red"}
                  size="sm"
                >
                  {documents?.validId ? "Selected" : "Not uploaded"}
                </Badge>
              </Box>

            </Grid>
          </SectionCard>
        </GridItem>

        {/* Security Question */}
        <GridItem colSpan={{ base: 1, md: 2 }}>
          <SectionCard title="Security Information" icon={Shield}>
            <VStack spacing={3} align="stretch">
              <InfoRow
                icon={Shield}
                label="Security Question"
                value={securityInfo?.question}
              />

              <InfoRow
                icon={Shield}
                label="Answer"
                value={securityInfo?.answer ? "●●●●●●●●" : "Not provided"}
              />
            </VStack>
          </SectionCard>
        </GridItem>
      </Grid>

      <Box bg="blue.50" p={4} borderRadius="md" textAlign="center">
        <Text fontSize="sm" color="blue.700">
          Please review all information carefully. Once submitted, some details
          may not be editable.
        </Text>
      </Box>
    </VStack>
  );
};
