import React, { useState, useEffect } from "react";
import { FormControl, FormLabel, Grid, Input, Select } from "@chakra-ui/react";

type FieldType = "text" | "select" | "number" | "email";

interface NextOfKinFormData {
  first_name: string;
  last_name: string;
  gender: string;
  relationship: string;
  email: string;
  phone: string;
  address: string;
}

interface FormFieldConfig {
  name: keyof NextOfKinFormData;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: { value: string; label: string }[];
  colSpan?: number;
  required?: boolean;
}

const personalInfoFields: FormFieldConfig[] = [
  {
    name: "first_name",
    label: "First Name",
    type: "text",
    placeholder: "Enter First Name",
    required: true,
  },
  {
    name: "last_name",
    label: "Surname",
    type: "text",
    placeholder: "Enter Last Name",
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
    name: "relationship",
    label: "Relationship",
    type: "select",
    required: true,
    options: [
      { value: "SPOUSE", label: "Spouse" },
      { value: "FATHER", label: "Father" },
      { value: "MOTHER", label: "Mother" },
      { value: "SON", label: "Son" },
      { value: "DAUGHTER", label: "Daughter" },
      { value: "SIBLING", label: "Brother/Sister" },
      { value: "GUARDIAN", label: "Guardian" },
      { value: "OTHER", label: "Other" },
    ],
  },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    placeholder: "Enter Email Address",
    required: true,
  },
  {
    name: "phone",
    label: "Phone",
    type: "number",
    placeholder: "",
    required: true,
  },
  {
    name: "address",
    label: "Address",
    type: "text",
    placeholder: "",
    required: true,
  },
];

interface FormFieldProps {
  field: FormFieldConfig;
  value: string;
  onChange: (name: keyof NextOfKinFormData, value: string) => void;
  stateOptions?: { value: string; label: string }[];
  lgaOptions?: { value: string; label: string }[];
}

const FormField: React.FC<FormFieldProps> = ({ field, value, onChange }) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    onChange(field.name, e.target.value);
  };

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
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
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

interface CreateProfileProps {
  onFormDataChange?: (formData: NextOfKinFormData) => void;
  onValidationChange?: (isValid: boolean) => void;
  initialData?: Partial<NextOfKinFormData>;
}

export const CreateProfile: React.FC<CreateProfileProps> = ({
  onFormDataChange,
  onValidationChange,
  initialData = {},
}) => {
  const [formData, setFormData] = useState<NextOfKinFormData>({
    first_name: "",
    last_name: "",
    gender: "",
    relationship: "",
    email: "",
    phone: "",
    address: "",
    ...initialData,
  });

  const validateForm = (): boolean => {
    return personalInfoFields.every((field) => {
      if (field.required) {
        const value = formData[field.name];
        return value && value.trim() !== "";
      }
      return true;
    });
  };

  useEffect(() => {
    if (onFormDataChange) {
      onFormDataChange(formData);
    }

    if (onValidationChange) {
      const isValid = validateForm();
      onValidationChange(isValid);
    }
  }, [formData, onFormDataChange, onValidationChange]);

  const handleFieldChange = (name: keyof NextOfKinFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div>
      <div className="flex flex-col justify-center items-center mb-6">
        <p className="font-bold text-3xl text-[#982323]">Enter Next of Kin</p>
        <p>Enter next of kin details</p>
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
            value={formData[field.name]}
            onChange={handleFieldChange}
          />
        ))}
      </Grid>
    </div>
  );
};
