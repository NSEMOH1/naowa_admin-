import { Input } from "@chakra-ui/react";
import { CheckCircle } from "lucide-react";
import { useState } from "react";

interface EmailOtpProps {
  onEmailChange: (email: string) => void;
  initialEmail?: string;
}

const EmailOtp = ({ onEmailChange, initialEmail = "" }: EmailOtpProps) => {
  const [email, setEmail] = useState<string>(initialEmail);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    onEmailChange(newEmail);
  };

  return (
    <div>
      <div className="flex justify-center items-center">
        <div className="w-full rounded-lg bg-white md:p-8">
          <div className="flex flex-col items-center">
            <p className="font-bold text-sm md:text-xl pb-1">Forgot Password</p>
            <p className="font-thin pb-3 text-xs md:text-sm">
              Please provide your Email Address
            </p>
          </div>
          <Input
            onChange={handleEmailChange}
            mb={4}
            fontWeight="thin"
            placeholder="Email Address"
            value={email}
          />
          <div className="text-xs gap-2 flex flex-col">
            <p className="flex gap-2 items-center font-thin">
              <CheckCircle size={18} /> An OTP will be sent to your email
            </p>
            <p className="flex gap-2 items-center font-thin">
              <CheckCircle size={18} />
              Else enter any of your 10 digits password to begin
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailOtp;
