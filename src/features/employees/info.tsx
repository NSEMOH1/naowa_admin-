import React, { useState, useEffect } from "react";
import {
  FormControl,
  FormLabel,
  Grid,
  Input,
  // Spinner,
  // Text,
  Box,
  Select,
  InputGroup,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import { Eye, EyeOff } from "lucide-react";
import { states } from "../../api/data";
import { useBanks, useAccountName } from "../../hooks/useBanks";
import { SearchableSelect } from "../../components/bank-select";

type FieldType = "text" | "select" | "date" | "number" | "password" | "email";

interface FormFieldConfig {
  name: keyof FormData;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: { value: string; label: string }[];
  colSpan?: number;
  required?: boolean;
}

interface FormData {
  full_name: string;
  username: string;
  password: string;
  gender: string;
  phone_number: string;
  email: string;
  address: string;
  date_of_birth: string;
  state_of_origin: string;
  bank_name: string;
  account_number: string;
  account_name: string;
  pin: string;
  occupation: string;
  place_of_work: string;
  marital_status: string;
  spouse_name: string;
  monthlyDeduction: number;
}

interface StateOption {
  value: string;
  label: string;
}

interface EnterInfoProps {
  onFormDataChange?: (formData: FormData) => void;
  onValidationChange?: (isValid: boolean) => void;
  initialData?: Partial<FormData>;
}

const personalInfoFields: FormFieldConfig[] = [
  {
    name: "full_name",
    label: "Full Name",
    type: "text",
    placeholder: "Full Name",
    required: true,
  },
  {
    name: "username",
    label: "Username",
    type: "text",
    placeholder: "Username",
    required: true,
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Password",
    required: true,
  },
  {
    name: "gender",
    label: "Gender",
    type: "select",
    required: true,
    options: [
      { value: "MALE", label: "Male" },
      { value: "FEMALE", label: "Female" },
    ],
  },
  {
    name: "phone_number",
    label: "Phone Number",
    type: "number",
    placeholder: "Phone Number",
    required: true,
  },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    placeholder: "",
    required: true,
  },
  {
    name: "occupation",
    label: "Occupation",
    type: "text",
    placeholder: "Occupation",
    required: true,
  },
  {
    name: "place_of_work",
    label: "Place Of Work",
    type: "text",
    placeholder: "",
    required: true,
  },
  {
    name: "marital_status",
    label: "Marital Status",
    type: "select",
    options: [
      { label: "Single", value: "Single" },
      { label: "Married", value: "Married" },
      { label: "Divorced", value: "Divorced" },
      { label: "Widowed", value: "Widowed" },
    ],
    required: true,
  },
  {
    name: "spouse_name",
    label: "Spouse Name",
    type: "text",
    placeholder: "",
    required: true,
  },
  {
    name: "date_of_birth",
    label: "Date of Birth",
    type: "date",
    placeholder: "YYYY-MM-DD",
    required: true,
  },
  {
    name: "address",
    label: "House Address",
    type: "text",
    placeholder: "House Address",
    required: true,
  },
  {
    name: "state_of_origin",
    label: "State of Origin",
    type: "select",
    required: true,
  },
];

const financialInfoFields: FormFieldConfig[] = [
  {
    name: "account_number",
    label: "Salary Account Number",
    type: "number",
    placeholder: "Account Number",
    required: true,
  },
  {
    name: "pin",
    label: "Transaction Pin",
    type: "password",
    placeholder: "Enter 4 digits pin",
    required: true,
  },
  {
    name: "monthlyDeduction",
    label: "Monthly Deduction",
    type: "number",
    placeholder: "",
    required: true,
  },
];

interface FormFieldProps {
  field: FormFieldConfig;
  value: string;
  onChange: (name: keyof FormData, value: string) => void;
  stateOptions?: StateOption[];
  showPassword?: boolean;
  onTogglePassword?: () => void;
}

const FormField: React.FC<FormFieldProps> = ({
  field,
  value,
  onChange,
  stateOptions,
  showPassword,
  onTogglePassword,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    onChange(field.name, e.target.value);
  };

  const getFieldOptions = () => {
    if (field.name === "state_of_origin") {
      return stateOptions || [];
    }
    return field.options || [];
  };

  const isPasswordField = field.type === "password" || field.name === "pin";

  return (
    <FormControl fontWeight="light" gridColumn={`span ${field.colSpan || 1}`}>
      <FormLabel fontSize={13}>
        {field.label}
        {field.required && <span style={{ color: "red" }}>*</span>}
      </FormLabel>
      {field.type === "select" ? (
        <Select
          isRequired={field.required}
          bg="white"
          placeholder={`Select ${field.label.toLowerCase()}`}
          fontSize={13}
          value={value}
          onChange={handleChange}
        >
          {getFieldOptions().map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      ) : isPasswordField ? (
        <InputGroup>
          <Input
            isRequired={field.required}
            type={
              showPassword
                ? "text"
                : field.type === "password"
                ? "password"
                : "number"
            }
            placeholder={field.placeholder}
            fontSize={13}
            bg="white"
            value={value}
            onChange={handleChange}
          />
          <InputRightElement>
            <IconButton
              aria-label={showPassword ? "Hide password" : "Show password"}
              icon={showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              size="sm"
              variant="ghost"
              onClick={onTogglePassword}
            />
          </InputRightElement>
        </InputGroup>
      ) : (
        <Input
          isRequired={field.required}
          type={field.type}
          placeholder={field.placeholder}
          fontSize={13}
          bg="white"
          value={value}
          onChange={handleChange}
        />
      )}
    </FormControl>
  );
};

export const EnterInfo: React.FC<EnterInfoProps> = ({
  onFormDataChange,
  onValidationChange,
  initialData = {},
}) => {
  const { banks, loading: banksLoading, error: banksError } = useBanks();
  const {
    accountName,
    loading: accountNameLoading,
    error: _accountNameError,
    resolveAccountName,
    resetAccountName,
  } = useAccountName();

  const [formData, setFormData] = useState<FormData>({
    full_name: "",
    password: "",
    username: "",
    gender: "",
    phone_number: "",
    email: "",
    address: "",
    state_of_origin: "",
    bank_name: "",
    account_number: "",
    account_name: "",
    pin: "",
    occupation: "",
    place_of_work: "",
    marital_status: "",
    spouse_name: "",
    monthlyDeduction: 0,
    date_of_birth: "",
    ...initialData,
  });

  const [bankCode, setBankCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPin, setShowPin] = useState(false);

  const validateForm = (): boolean => {
    const allFields = [...personalInfoFields, ...financialInfoFields];
    return allFields.every((field) => {
      if (field.required) {
        const fieldName = field.name as keyof FormData;
        const value = formData[fieldName];
        return Boolean(
          value !== undefined && value !== null && String(value).trim() !== ""
        );
      }
      return true;
    });
  };

  useEffect(() => {
    if (formData.account_number && bankCode) {
      resolveAccountName(formData.account_number, bankCode);
    } else {
      resetAccountName();
    }
  }, [formData.account_number, bankCode]);

  useEffect(() => {
    if (accountName) {
      setFormData((prev) => ({
        ...prev,
        account_name: accountName,
      }));
    }
  }, [accountName]);

  useEffect(() => {
    if (onFormDataChange) {
      onFormDataChange(formData);
    }

    if (onValidationChange) {
      const isValid = validateForm();
      onValidationChange(isValid);
    }
  }, [formData, onFormDataChange, onValidationChange]);

  const handleFieldChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBankChange = (bankName: string, code: string) => {
    setBankCode(code);
    setFormData((prev) => ({
      ...prev,
      bank_name: bankName,
    }));
  };

  const stateOptions = Object.keys(states).map((state) => ({
    value: state,
    label: state,
  }));

  return (
    <div>
      <div className="flex flex-col justify-center items-center mb-6">
        <p className="font-bold text-lg md:text-3xl text-[#982323]">
          Create Profile
        </p>
        <p className="pt-4">Enter Your current information</p>
      </div>

      <Grid
        templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
        gap={4}
        mt={4}
      >
        {personalInfoFields.map((field) => (
          <FormField
            key={field.name}
            field={field}
            value={
              formData[field.name as keyof FormData] !== undefined
                ? String(formData[field.name as keyof FormData])
                : ""
            }
            onChange={handleFieldChange}
            stateOptions={
              field.name === "state_of_origin" ? stateOptions : undefined
            }
            showPassword={field.name === "password" ? showPassword : undefined}
            onTogglePassword={
              field.name === "password"
                ? () => setShowPassword(!showPassword)
                : undefined
            }
          />
        ))}
      </Grid>

      <Grid
        templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
        gap={4}
        mt={4}
      >
        <SearchableSelect
          banks={banks}
          value={formData.bank_name}
          onChange={handleBankChange}
          label="Bank"
          placeholder="Search bank..."
          required={true}
          loading={banksLoading}
          error={banksError}
        />

        {financialInfoFields.map((field) => (
          <FormField
            key={field.name}
            field={field}
            value={
              formData[field.name as keyof FormData] !== undefined
                ? String(formData[field.name as keyof FormData])
                : ""
            }
            onChange={handleFieldChange}
            showPassword={field.name === "pin" ? showPin : undefined}
            onTogglePassword={
              field.name === "pin" ? () => setShowPin(!showPin) : undefined
            }
          />
        ))}

        <FormControl fontWeight="light">
          <FormLabel fontSize={13}>Bank Account Name</FormLabel>
          <Box position="relative">
            <Input
              type="text"
              placeholder="Enter account name"
              fontSize={13}
              bg="white"
              value={formData.account_name}
              onChange={(e) =>
                handleFieldChange("account_name", e.target.value)
              }
              opacity={accountNameLoading ? 0.6 : 1}
            />
            {/* {accountNameLoading && (
              <Box
                position="absolute"
                right={3}
                top="50%"
                transform="translateY(-50%)"
              >
                <Spinner size="sm" />
              </Box>
            )} */}
          </Box>
        </FormControl>
      </Grid>
    </div>
  );
};

export default EnterInfo;
