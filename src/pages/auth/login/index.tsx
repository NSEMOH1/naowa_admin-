import {
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { routes } from "../../../lib/routes";
import signupBg from "../../../assets/sign-up.svg";
import { Logo } from "../../../components/icons/logo";
import { Eye, EyeClosed, IdCard, Key } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { useState } from "react";
import api from "../../../api";

const Login = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const payload = {
    email: email,
    password: password,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const res = await api.post("/api/auth/user/login", payload);
      const { id, email, full_name, role } = res.data.user;
      setUser({ id, email, full_name, role });
      window.location.href = routes.dashboard.index;
    } catch (err: any) {
      let errorMessage = "Login Failed";
      if (err.response) {
        if (err.response.data?.details) {
          errorMessage = err.response.data.details;
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.statusText) {
          errorMessage = err.response.statusText;
        }
      } else if (err.request) {
        errorMessage = "No response received from server";
      } else {
        errorMessage = err.message || "Error setting up request";
      }

      toast({ title: errorMessage, status: "error", position: "top-right" });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="flex flex-col p-10 items-center text-white justify-center"
      style={{
        backgroundImage: `url("${signupBg}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <div className="flex flex-col items-center gap-4 mb-6">
        <Logo className="w-20" showText={false} />
        <p className="font-semibold text-xl">Login NAOWA Staff</p>
      </div>
      <div
        className="w-[40vw] rounded-3xl text-sm border border-white bg-white/10 backdrop-blur-sm p-6"
        style={{
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="mt-6">
          <FormControl fontWeight="light" className="mt-4 mb-3">
            <FormLabel fontWeight="light" fontSize={13} className="text-white">
              Staff ID Or Email
            </FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <IdCard color="white" />
              </InputLeftElement>
              <Input
                fontSize={13}
                type="text"
                placeholder="Staff ID or Email"
                borderColor="white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </InputGroup>
          </FormControl>
          <FormControl fontWeight="light" className="mt-4 mb-3">
            <div className="flex justify-between">
              <FormLabel
                fontWeight="light"
                fontSize={13}
                className="text-white"
              >
                Password
              </FormLabel>
              <p
                className="text-[#ECF15E] cursor-pointer"
                onClick={() => navigate(routes.auth.forgotPassword)}
              >
                Forgot Password?
              </p>
            </div>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Key color="white" />
              </InputLeftElement>
              <Input
                fontSize={13}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                borderColor="white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            width="full"
            bg={"#982323"}
            onClick={handleSubmit}
            isLoading={isSubmitting}
          >
            Staff Sign In
          </Button>
          <p className="text-xs text-blue-500 mt-4 text-center">
            Do not have an account?{" "}
            <span
              className="cursor-pointer text-[#ECF15E]"
              onClick={() => navigate(routes.auth.register.index)}
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
      <div className="text-gray-200 text-xs flex gap-2 items-start mt-4">
        <p>Terms</p>
        <p>•</p>
        <p>Privacy</p>
        <p>•</p>
        <p>Docs</p>
        <p>•</p>
        <p>Helps</p>
      </div>
    </div>
  );
};

export default Login;
