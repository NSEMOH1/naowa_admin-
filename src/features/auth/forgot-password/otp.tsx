import { Input } from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface OtpProps {
  onOtpChange: (otp: string) => void;
}
const Otp = ({ onOtpChange }: OtpProps) => {
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [otp, setOtp] = useState<string>("");

  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleResend = () => {
    setTimeLeft(60);
    setCanResend(false);
    console.log("OTP resent!");
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newOtp = e.target.value;
    setOtp(newOtp);
    onOtpChange(newOtp);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div>
      <div className="flex justify-center items-center">
        <div className="w-full rounded-lg bg-white md:p-8">
          <div className="flex flex-col items-center">
            <p className="font-thin pb-3 text-sm">
              An OTP has been sent to your phone number/email address
            </p>
          </div>
          <Input
            mb={4}
            fontWeight="thin"
            placeholder="Enter your OTP"
            value={otp}
            onChange={handleOtpChange}
          />
          {canResend ? (
            <p
              className="font-thin text-center text-sm underline cursor-pointer"
              onClick={handleResend}
            >
              Resend OTP
            </p>
          ) : (
            <p className="font-thin text-center text-sm">
              Resend OTP in {formatTime(timeLeft)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Otp;
