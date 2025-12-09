import { useNavigate } from "react-router-dom";
import {
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Select,
  useToast,
} from "@chakra-ui/react";
// import { GoogleIcon } from "../../../components/icons";
import { routes } from "../../../lib/routes";
import { Logo } from "../../../components/icons/logo";
import signupBg from "../../../assets/sign-up.svg";
import { Eye, EyeClosed, Key, Mail, User2Icon } from "lucide-react";
import { useState } from "react";
import api from "../../../api";
import { departments } from "../../../api/data";

const Register = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    department: "",
    email: "",
    password: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await api.post("/api/auth/user/register", formData);
      navigate(routes.index);
      toast({ title: "Registeration Successful", status: "success" });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="flex p-10 gap-[200px] text-white"
      style={{
        backgroundImage: `url("${signupBg}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <div className="w-100 flex flex-col justify-center items-center">
        <Logo className="w-60" showText={false} />
        <p className="font-bold text-center">
          NAOWA MULTIPURPOSE COOPERATIVE SOCIETY
        </p>
        <p className="pt-6 text-center">
          Empower members financially by promoting economic independence and
          stability. Provide credit facilities with easy access to loans and
          competitive rates
        </p>
        <div className="text-gray-200 text-xs flex gap-2 items-start mt-10">
          <p>Terms</p>
          <p>•</p>
          <p>Privacy</p>
          <p>•</p>
          <p>Docs</p>
          <p>•</p>
          <p>Helps</p>
        </div>
      </div>
      <div
        className="w-[40vw] rounded-3xl text-sm border border-white bg-white/10 backdrop-blur-sm p-6"
        style={{
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* <div className="flex flex-col items-center gap-4">
          <p className="text-white">Register with:</p>
          <Button
            leftIcon={<GoogleIcon />}
            variant="outline"
            bg="white/10"
            borderColor="white"
            _hover={{ bg: "white/20" }}
            color="white"
            width="full"
            style={{
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.4)",
            }}
          >
            Google
          </Button>
          <p className="text-white">
            --------------------------- OR ---------------------------
          </p>
        </div> */}
        <div className="mt-20">
          <div className="flex gap-2">
            <FormControl fontWeight="light">
              <FormLabel
                fontWeight="light"
                fontSize={13}
                className="text-white"
              >
                Full Name
              </FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <User2Icon color="white" />
                </InputLeftElement>
                <Input
                  fontSize={13}
                  type="text"
                  placeholder="Full Name"
                  borderColor="white"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                />
              </InputGroup>
            </FormControl>
            <FormControl fontWeight="light" className="mb-3">
              <FormLabel
                fontWeight="light"
                fontSize={13}
                className="text-white"
              >
                Department
              </FormLabel>
              <InputGroup>
                <Select
                  value={formData.department}
                  onChange={handleChange}
                  name="department"
                  placeholder="Select Department"
                >
                  {departments.map((data) => (
                    <option style={{ background: "black" }} value={data.value}>
                      {data.label}
                    </option>
                  ))}
                </Select>
              </InputGroup>
            </FormControl>
          </div>
          <FormControl fontWeight="light" className="mt-4 mb-3">
            <FormLabel fontWeight="light" fontSize={13} className="text-white">
              Email
            </FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Mail color="white" />
              </InputLeftElement>
              <Input
                fontSize={13}
                type="text"
                placeholder="Email"
                borderColor="white"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </InputGroup>
          </FormControl>
          <FormControl fontWeight="light" className="mt-4 mb-3">
            <FormLabel fontWeight="light" fontSize={13} className="text-white">
              Password
            </FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Key color="white" />
              </InputLeftElement>
              <Input
                fontSize={13}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                name="password"
                borderColor="white"
                value={formData.password}
                onChange={handleChange}
              />
              <InputRightElement>
                <IconButton
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  icon={
                    showPassword ? (
                      <EyeClosed color="white" />
                    ) : (
                      <Eye color="white" />
                    )
                  }
                  onClick={() => setShowPassword(!showPassword)}
                  variant="ghost"
                  size="sm"
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <p className="text-xs text-blue-500">
            Minimum length is 8 characters
          </p>
          <Button
            color="white"
            mt={5}
            mb={2}
            isLoading={isSubmitting}
            width="full"
            style={{
              background: "linear-gradient(to bottom, #ECF15E, #D6DD13)",
            }}
            onClick={handleSubmit}
          >
            Sign Up
          </Button>
          <p className="text-xs text-blue-500">
            By creating an account, you agree to the{" "}
            <span className="text-white underline">Terms of Service.</span>{" "}
            We'll occasionally send you account-related emails.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
