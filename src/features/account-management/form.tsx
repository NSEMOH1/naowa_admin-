import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast,
  FormErrorMessage,
} from "@chakra-ui/react";
import { departments } from "../loan/data";
import { BadgeCheck } from "lucide-react";
import { useState } from "react";
import api from "../../api";
export default function AdminUserForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    full_name: "",
    department: "",
    email: "",
    password: "",
    role: "",
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.full_name.trim())
      newErrors.full_name = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (!formData.role) newErrors.role = "Role is required";
    if (!formData.department) newErrors.department = "Department is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await api.post("/api/auth/user/register", formData);
      setIsSuccess(true);
      toast({
        title: "Registration Successful",
        status: "success",
      });
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Registration Failed",
        description: err.response?.data?.message || "An error occurred",
        status: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex justify-center">
        <div className="flex flex-col items-center justify-center p-4 w-full md:w-[40vw] py-16 mt-14 shadow-2xl rounded-lg">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <BadgeCheck className="h-10 w-10 text-green-600" />
          </div>
          <p className="text-2xl font-bold pt-6 text-center">
            Admin Successfully Added
          </p>
          <Button
            bg="#2D9CDB"
            color="white"
            _hover={{ bg: "#1e8cc4" }}
            onClick={() => window.location.reload()}
            mt={4}
          >
            Continue
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-[#982323]">
          <p className="text-white p-4 font-bold">Create Admin</p>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormControl isInvalid={!!errors.full_name} className="mb-4">
            <FormLabel fontSize={13}>Full Name</FormLabel>
            <Input
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              variant="filled"
              fontSize={13}
              placeholder="John Doe"
            />
            <FormErrorMessage>{errors.full_name}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.email} className="mb-4">
            <FormLabel fontSize={13}>Email Address</FormLabel>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              variant="filled"
              fontSize={13}
              placeholder="john@example.com"
            />
            <FormErrorMessage>{errors.email}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.password} className="mb-4">
            <FormLabel fontSize={13}>Password</FormLabel>
            <Input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              variant="filled"
              fontSize={13}
              placeholder="At least 8 characters"
            />
            <FormErrorMessage>{errors.password}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.role} className="mb-4">
            <FormLabel fontSize={13}>Role</FormLabel>
            <Select
              name="role"
              value={formData.role}
              onChange={handleChange}
              variant="filled"
              placeholder="Select role"
            >
              <option value="ADMIN">Admin</option>
              <option value="STAFF">Staff</option>
            </Select>
            <FormErrorMessage>{errors.role}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.department} className="mb-4">
            <FormLabel fontSize={13}>Department</FormLabel>
            <Select
              name="department"
              value={formData.department}
              onChange={handleChange}
              variant="filled"
              placeholder="Select department"
            >
              {departments.map((data) => (
                <option key={data.value} value={data.value}>
                  {data.label}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{errors.department}</FormErrorMessage>
          </FormControl>
        </div>
        <div className="flex justify-end p-6 border-t">
          <Button
            type="submit"
            className="flex gap-3"
            bg="#982323"
            color="white"
            _hover={{ bg: "#556308" }}
            isLoading={isSubmitting}
            loadingText="Submitting..."
            rightIcon={<BadgeCheck />}
          >
            Create Admin
          </Button>
        </div>
      </div>
    </form>
  );
}
