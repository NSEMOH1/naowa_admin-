import { Box, Text } from "@chakra-ui/react";
import { Input } from "antd";
import { CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";

interface NewPasswordProps {
  onPasswordChange: (password: string, isValid: boolean) => void;
  onConfirmPasswordChange: (confirmPassword: string, isMatch: boolean) => void;
}

export const NewPassword = ({
  onPasswordChange,
  onConfirmPasswordChange,
}: NewPasswordProps) => {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordChecks, setPasswordChecks] = useState({
    minLength: false,
    hasUppercase: false,
    hasSymbol: false,
  });

  const validatePassword = (pwd: string) => {
    const checks = {
      minLength: pwd.length >= 8,
      hasUppercase: /[A-Z]/.test(pwd),
      hasSymbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
    };

    setPasswordChecks(checks);

    const isValid = checks.minLength && checks.hasUppercase && checks.hasSymbol;
    onPasswordChange(pwd, isValid);

    return isValid;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);

    if (confirmPassword) {
      const isMatch = newPassword === confirmPassword;
      onConfirmPasswordChange(confirmPassword, isMatch);
    }
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);

    const isMatch = password === newConfirmPassword;
    onConfirmPasswordChange(newConfirmPassword, isMatch);
  };

  const getCheckIcon = (isValid: boolean) => {
    return isValid ? (
      <CheckCircle size={18} className="text-green-500" />
    ) : (
      <XCircle size={18} className="text-red-500" />
    );
  };

  const getCheckTextClass = (isValid: boolean) => {
    return `flex gap-2 items-center ${
      isValid ? "text-green-600" : "text-gray-400"
    }`;
  };

  return (
    <Box>
      <Text fontSize="md" color="gray.600" textAlign="center" mb={4}>
        Enter your new password
      </Text>

      <Input.Password
        className="mb-5 h-10"
        placeholder="Enter new password"
        variant="filled"
        value={password}
        onChange={handlePasswordChange}
      />

      <div className="text-xs gap-2 flex flex-col mb-4">
        <p className={getCheckTextClass(passwordChecks.minLength)}>
          {getCheckIcon(passwordChecks.minLength)}
          Minimum of eight (8) characters
        </p>
        <p className={getCheckTextClass(passwordChecks.hasUppercase)}>
          {getCheckIcon(passwordChecks.hasUppercase)}
          At least one (1) uppercase character
        </p>
        <p className={getCheckTextClass(passwordChecks.hasSymbol)}>
          {getCheckIcon(passwordChecks.hasSymbol)}
          At least one (1) symbol
        </p>
      </div>

      <Input.Password
        className="h-10 mb-3"
        placeholder="Confirm new password"
        variant="filled"
        value={confirmPassword}
        onChange={handleConfirmPasswordChange}
      />

      {confirmPassword && password !== confirmPassword && (
        <Text fontSize="xs" color="red.500" mb={3}>
          Passwords do not match
        </Text>
      )}

      {confirmPassword && password === confirmPassword && (
        <Text fontSize="xs" color="green.500" mb={3}>
          Passwords match!
        </Text>
      )}
    </Box>
  );
};
