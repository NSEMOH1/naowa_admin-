import { useState } from "react";
import {
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepTitle,
  StepDescription,
  StepSeparator,
  Box,
  useSteps,
  Button,
  Flex,
  Heading,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { Logo } from "../../components/icons/logo";
import EnterInfo from "../../features/employees/info";
import { CreateProfile } from "../../features/employees/next-of-kin";
import { UploadDocument } from "../../features/employees/document";
import { SecurityQuestions } from "../../features/employees/security-questions";
import { useNavigate } from "react-router-dom";
import { routes } from "../../lib/routes";
import api from "../../api";
import type { PersonelRegistrationData } from "../../lib/types";
import { PreviewStep } from "../../features/employees/preview";
import successImg from "../../assets/success.svg";

const steps = [
  { title: "Enter Info", description: "Basic details" },
  { title: "Create Profile", description: "Address & phone" },
  { title: "Upload Documents", description: "Credentials" },
  { title: "Security Questions", description: "Review details" },
  { title: "Review", description: "Confirm details" },
];

const SuccessPage = ({ onContinue }: { onContinue: () => void }) => (
  <VStack spacing={6} textAlign="center" py={10}>
    <Heading size="md" color="red">
      Registration Successful!
    </Heading>
    <Text color="#0692DE">New member account has been created successfully.</Text>
    <img width={200} src={successImg} alt="success" />
    <Button colorScheme="red" onClick={onContinue} mt={6} w="full">
      Done
    </Button>
  </VStack>
);

const PersonelRegisteration = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const [personalInfo, setPersonalInfo] = useState<any>({});
  const [nextOfKinInfo, setNextOfKinInfo] = useState<any>({});
  const [documents, setDocuments] = useState<any>({});
  const [securityInfo, setSecurityInfo] = useState<any>({});

  useSteps({
    index: activeStep,
    count: steps.length,
  });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      const payload: PersonelRegistrationData = {
        email: personalInfo.email,
        username: personalInfo.username,
        password: personalInfo.password,
        full_name: personalInfo.full_name,
        gender: personalInfo.gender,
        phone: personalInfo.phone_number,
        address: personalInfo.address,
        state_of_origin: personalInfo.state_of_origin,
        pin: personalInfo.pin,
        occupation: personalInfo.occupation,
        place_of_work: personalInfo.place_of_work,
        marital_status: personalInfo.marital_status,
        spouse_name: personalInfo.spouse_name || null,
        date_of_birth: new Date(personalInfo.date_of_birth),
        monthly_deduction: personalInfo.monthlyDeduction || 0,
        bank_name: personalInfo.bank_name,
        account_number: personalInfo.account_number,
        account_name: personalInfo.account_name || "N/A",
        profile_picture: documents.picture || "",
        nin_document: documents.validId || "",
        kin_first_name: nextOfKinInfo.first_name,
        kin_last_name: nextOfKinInfo.last_name,
        relationship: nextOfKinInfo.relationship,
        kin_phone: nextOfKinInfo.phone,
        kin_email: nextOfKinInfo.email,
        kin_address: nextOfKinInfo.address,
        kin_gender: nextOfKinInfo.gender,
        security_question: securityInfo.question,
        security_answer: securityInfo.answer,
      };
      console.log(payload);
      formData.append("data", JSON.stringify(payload));
      if (documents.picture)
        formData.append("profile_picture", documents.picture);
      if (documents.validId) formData.append("nin_document", documents.validId);

      await api.post("/api/auth/member/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setIsComplete(true);
      toast({
        title: "Registration successful",
        status: "success",
      });
    } catch (error) {
      console.error("Registration failed:", error);
      toast({
        title: "Registration failed",
        description: "Please try again",
        status: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const StepForms = [
    <Box key={0} rounded="md">
      <EnterInfo
        onFormDataChange={setPersonalInfo}
        onValidationChange={setIsFormValid}
        initialData={personalInfo}
      />
    </Box>,

    <Box key={1} p={6} rounded="md">
      <CreateProfile
        onFormDataChange={setNextOfKinInfo}
        onValidationChange={setIsFormValid}
        initialData={nextOfKinInfo}
      />
    </Box>,

    <Box key={2} p={6} rounded="md">
      <UploadDocument
        onDocumentsChange={setDocuments}
        onValidationChange={setIsFormValid}
        initialData={documents}
      />
    </Box>,

    <Box key={3} p={6} rounded="md">
      <SecurityQuestions
        onSecurityDataChange={setSecurityInfo}
        onValidationChange={setIsFormValid}
        initialData={securityInfo}
      />
    </Box>,

    <Box key={4} p={6} rounded="md">
      <PreviewStep
        personalInfo={personalInfo}
        nextOfKinInfo={nextOfKinInfo}
        documents={documents}
        securityInfo={securityInfo}
      />
    </Box>,
  ];

  if (isComplete) {
    return (
      <div
        className="min-h-screen w-full bg-[url('/src/assets/success-bg.svg')] bg-cover bg-no-repeat bg-center flex justify-center items-center"
        style={{
          backgroundAttachment: "fixed",
          overflow: "hidden",
        }}
      >
        <div className="container w-[50vw] px-4 py-8">
          <Flex justify="center" mb={6}>
            <Logo className="w-40" showText={false} />
          </Flex>
          <Box bg="whiteAlpha.800" p={6} rounded="lg" backdropFilter="blur(0)">
            <SuccessPage onContinue={() => navigate(routes.index)} />
          </Box>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative flex flex-col justify-center items-center">
      <div
        className="absolute inset-0 bg-[#982323] bg-center"
        style={{
          position: "fixed",
          zIndex: -1,
          width: "100vw",
          height: "100vh",
        }}
      />
      <div className="container w-[90vw] sm:w-[60vw]">
        <Box bg="whiteAlpha.800" p={6} rounded="lg" backdropFilter="blur(0)">
          <div className="hidden md:block">
            <Stepper index={activeStep} mb={8}>
              {steps.map((step, index) => (
                <Step key={index}>
                  <StepIndicator>
                    <StepStatus
                      complete={<StepIcon />}
                      incomplete={<StepNumber />}
                      active={<StepNumber />}
                    />
                  </StepIndicator>
                  <Box flexShrink="0">
                    <StepTitle fontSize={13}>{step.title}</StepTitle>
                    <StepDescription fontSize={11}>
                      {step.description}
                    </StepDescription>
                  </Box>
                  <StepSeparator />
                </Step>
              ))}
            </Stepper>
          </div>

          <Box
            flexGrow={1}
            overflowY="auto"
            className="custom-scrollbar"
            pr={2}
          >
            {StepForms[activeStep]}
          </Box>

          <Flex justify="space-between" mt={8} gap={2}>
            {activeStep > 0 && (
              <Button onClick={() => setActiveStep((prev) => prev - 1)}>
                Back
              </Button>
            )}
            {activeStep < steps.length - 1 ? (
              <Button
                bg="#982323"
                onClick={() => setActiveStep((prev) => prev + 1)}
                ml="auto"
                width="full"
                isDisabled={!isFormValid}
                opacity={!isFormValid ? 0.6 : 1}
              >
                Next →
              </Button>
            ) : (
              <Button
                isLoading={isSubmitting}
                loadingText="Submitting"
                bg="#982323"
                onClick={handleSubmit}
                width="full"
                isDisabled={!isFormValid}
                opacity={!isFormValid ? 0.6 : 1}
              >
                Submit →
              </Button>
            )}
          </Flex>
        </Box>
      </div>
    </div>
  );
};

export default PersonelRegisteration;
