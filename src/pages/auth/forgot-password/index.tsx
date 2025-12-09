import { useState } from "react";
import {
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepSeparator,
  Box,
  useSteps,
  Button,
  Flex,
  Heading,
  VStack,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { routes } from "../../../lib/routes";
import EmailOtp from "../../../features/auth/forgot-password/email";
import { Logo } from "../../../components/icons/logo";
import Otp from "../../../features/auth/forgot-password/otp";
import { NewPassword } from "../../../features/auth/forgot-password/new-password";
import api from "../../../api";

const steps = [
  { title: "Email Address" },
  { title: "Otp" },
  { title: "New Password" },
];

const SuccessPage = ({ onContinue }: { onContinue: () => void }) => (
  <VStack spacing={6} textAlign="center" py={10}>
    <Heading size="md">Password Changed Successfully!</Heading>
    <img width={200} src="/src/assets/success.svg" alt="success" />
    <Button colorScheme="blue" onClick={onContinue} mt={6} width="50%">
      Done
    </Button>
  </VStack>
);

interface ForgotPasswordData {
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
  isPasswordValid: boolean;
  isConfirmPasswordValid: boolean;
  isMember: boolean;
}

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const [formData, setFormData] = useState<ForgotPasswordData>({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
    isPasswordValid: false,
    isConfirmPasswordValid: false,
    isMember: false,
  });

  useSteps({
    index: activeStep,
    count: steps.length,
  });

  const clearError = () => setError("");

  const handleEmailChange = (email: string) => {
    setFormData((prev) => ({ ...prev, email }));
    clearError();
  };

  const handleSendOtp = async () => {
    if (!formData.email) {
      setError("Please enter your email");
      return;
    }

    setIsLoading(true);
    clearError();

    try {
      const response = await api.post("/api/auth/verify-email", {
        email: formData.email,
      });

      if (response.data.success) {
        setActiveStep(1);
      } else {
        setError("Failed to send OTP. Please try again.");
      }
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      setError(
        error.response?.data?.error || "An error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (otp: string) => {
    setFormData((prev) => ({ ...prev, otp }));
    clearError();
  };

  const handleVerifyOtp = async () => {
    if (!formData.otp || formData.otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    clearError();

    try {
      const response = await api.post("/api/auth/verify-otp", {
        email: formData.email,
        otp: formData.otp,
      });

      if (response.data.success) {
        setFormData((prev) => ({
          ...prev,
          isMember: response.data.data.isMember,
        }));
        setActiveStep(2);
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      setError(
        error.response?.data?.error || "Failed to verify OTP. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = (password: string, isValid: boolean) => {
    setFormData((prev) => ({
      ...prev,
      password,
      isPasswordValid: isValid,
    }));
    clearError();
  };

  const handleConfirmPasswordChange = (
    confirmPassword: string,
    isMatch: boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      confirmPassword,
      isConfirmPasswordValid: isMatch,
    }));
    clearError();
  };

  const handleResetPassword = async () => {
    if (!formData.isPasswordValid) {
      setError("Please ensure your password meets all requirements");
      return;
    }

    if (!formData.isConfirmPasswordValid) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    clearError();

    try {
      const response = await api.post("/api/auth/reset-password", {
        email: formData.email,
        newPassword: formData.password,
        isMember: formData.isMember,
      });

      if (response.data.success) {
        setIsComplete(true);
      } else {
        setError("Failed to reset password. Please try again.");
      }
    } catch (error: any) {
      console.error("Error resetting password:", error);
      setError(
        error.response?.data?.error || "An error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    navigate(routes.index);
  };

  const StepForms = [
    <Box key={0} p={6} rounded="md">
      <EmailOtp
        onEmailChange={handleEmailChange}
        initialEmail={formData.email}
      />
    </Box>,
    <Box key={1} p={6} rounded="md">
      <Otp onOtpChange={handleOtpChange} />
    </Box>,
    <Box key={2} p={6} rounded="md">
      <NewPassword
        onPasswordChange={handlePasswordChange}
        onConfirmPasswordChange={handleConfirmPasswordChange}
      />
    </Box>,
  ];

  const handleNext = () => {
    switch (activeStep) {
      case 0:
        handleSendOtp();
        break;
      case 1:
        handleVerifyOtp();
        break;
      case 2:
        handleResetPassword();
        break;
      default:
        setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    clearError();
  };

  const getNextButtonText = () => {
    switch (activeStep) {
      case 0:
        return "Send OTP";
      case 1:
        return "Verify OTP";
      case 2:
        return "Reset Password";
      default:
        return "Next →";
    }
  };

  const isNextDisabled = () => {
    switch (activeStep) {
      case 0:
        return !formData.email || isLoading;
      case 1:
        return !formData.otp || formData.otp.length !== 6 || isLoading;
      case 2:
        return (
          !formData.isPasswordValid ||
          !formData.isConfirmPasswordValid ||
          isLoading
        );
      default:
        return false;
    }
  };

  if (isComplete) {
    return (
      <div className="p-10 bg-gray-100 h-[100vh]">
        <Logo showText={false} />
        <div className="flex justify-center">
          <Box className="w-[90vw] md:w-[40vw] rounded-lg bg-white p-8">
            <SuccessPage onContinue={handleContinue} />
          </Box>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 bg-gray-100 h-[100vh]">
      <Logo className="w-30" showText={false} />
      <div className="flex justify-center">
        <Box className="w-[90vw] md:w-[40vw] rounded-lg bg-white p-8">
          <Box display={{ base: "none", md: "block" }}>
            <Stepper index={activeStep} size="sm">
              {steps.map((_step, index) => (
                <Step key={index}>
                  <StepIndicator>
                    <StepStatus
                      complete={<StepIcon />}
                      incomplete={<StepNumber />}
                      active={<StepNumber />}
                    />
                  </StepIndicator>
                  <StepSeparator />
                </Step>
              ))}
            </Stepper>
          </Box>

          {error && (
            <Alert status="error" borderRadius="md" mb={4}>
              <AlertIcon />
              {error}
            </Alert>
          )}

          <Box
            flexGrow={1}
            overflowY="auto"
            className="custom-scrollbar"
            pr={2}
          >
            {StepForms[activeStep]}
          </Box>

          <Flex justify="space-between" mt={4} gap={2}>
            {activeStep > 0 && (
              <Button
                onClick={handleBack}
                isDisabled={isLoading}
                variant="outline"
              >
                Back
              </Button>
            )}

            <Button
              bg="#109CF1"
              onClick={handleNext}
              ml={activeStep === 0 ? "auto" : undefined}
              width={activeStep === 0 ? "full" : undefined}
              color="white"
              isDisabled={isNextDisabled()}
              isLoading={isLoading}
              loadingText={
                activeStep === 0
                  ? "Sending OTP..."
                  : activeStep === 1
                  ? "Verifying..."
                  : "Resetting..."
              }
            >
              {getNextButtonText()}
            </Button>
          </Flex>
        </Box>
      </div>
    </div>
  );
};

export default ForgotPassword;
