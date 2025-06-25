import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import logoNew from "../../assets/LogoNew.png";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Timer from "@/components/Timer/Timer";
import { useLocation, useNavigate } from "react-router-dom";
import { authenticationService } from "@/services/authenticationService";
import loginImg from "../../assets/Login/Login.png";
import loginTexture from "../../assets/Login/Login-Texture.png";
import { RoleList, useAuth } from "../Routes/AuthContext";

interface LoginData {
  username: string;
  password: string;
}

const VerifyOTP: React.FC = () => {
  const location = useLocation();
  const { loginData, email } = location.state as {
    loginData: LoginData;
    email: string;
  };

  const { setRole } = useAuth();
  const [otp, setOtp] = useState("");
  const [timerFinished, setTimerFinished] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [reSend, setReSend] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleTimerEnd = () => {
    setTimerFinished(true);
  };

  const handleResendOTP = () => {
    handleReLogin();
  };

  const handleReLogin = async () => {
    setReSend(true);
    try {
      const response = await authenticationService.loginAuth(loginData);
      if (response.data.data.status) {
        setTimerFinished(false);
        setTimerKey((prevKey) => prevKey + 1);
        setErrorMessage(null); // Clear error if resend was successful
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("Failed to resend OTP. Please try again.");
    } finally {
      setReSend(false);
    }
  };

  const handleVerify = async () => {
    setIsVerifying(true);
    setErrorMessage(null);

    try {
      const payload = {
        username: loginData.username,
        password: loginData.password,
        otp: Number(otp),
        scanCenterId: 0,
      };
      const response = await authenticationService.loginVerify(payload);

      if (response.data.data.status) {
        const { token, RoleType, PasswordStatus } = response.data.data;
        console.log(response);
        localStorage.setItem("token", token);
        setIsVerifying(false);

        // Set role
        let role: (typeof RoleList)[number] | null = null;

        switch (RoleType) {
          case 1:
            role = { type: "admin", id: 1 };
            break;
          case 2:
            role = { type: "technician", id: 2 };
            break;
          case 3:
            role = { type: "scadmin", id: 3 };
            break;
          case 4:
            role = { type: "patient", id: 4 };
            break;
          case 5:
            role = { type: "doctor", id: 5 };
            break;
          case 6:
            role = { type: "radiologist", id: 6 };
            break;
          case 7:
            role = { type: "scribe", id: 7 };
            break;
          case 8:
            role = { type: "codoctor", id: 8 };
            break;
          case 9:
            role = { type: "manager", id: 9 };
            break;
          default:
            role = null; // Or assign a default role if needed
            break;
        }

        setRole(role);

        // If password status is true, redirect to reset password
        if (PasswordStatus) {
          setShowSuccess(true);
          setTimeout(() => {
            navigate("/resetPass", { state: { email: email } });
          }, 2000);
          return;
        }

        // Else, route based on role
        setShowSuccess(true);
        setTimeout(() => {
          navigate(`/${String(role?.type)}/administration`);
        }, 2000);
      } else {
        setIsVerifying(false);
        setErrorMessage(response.data.data.message); // Show error in UI
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setIsVerifying(false);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-svh lg:flex-row">
      {/* Left image section */}
      <div
        style={{ backgroundImage: `url(${loginTexture})` }}
        className="flex flex-1 lg:basis-[55%] items-center justify-center bg-[#F9F5EF] lg:bg-cover lg:bg-center lg:bg-no-repeat"
      >
        <img
          src={loginImg}
          alt="Login"
          className="h-[75%] w-[90%] max-w-[500px] max-h-[500px] lg:h-[65%] lg:w-[80%]"
        />
      </div>

      {/* Right section */}
      <div className="flex flex-1 lg:basis-[45%] bg-[#EDD1CE] flex-col justify-start lg:py-8 lg:px-8 lg:justify-center lg:shadow-2xl relative">
        <img
          src={logoNew}
          className="hidden w-[40%] h-[20%] mx-auto lg:inline"
        />
        <div className="w-[90%] mx-auto p-5 lg:w-[70%]">
          <form className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2 text-center">
              {/* <div className="items-center justify-around gap-10% pb-3 hidden lg:flex">
                <img src={logo} alt="logo" className="w-[20%] h-[20%]" />
                <h1 className="text-3xl font-[700] text-[#525252]">
                  Remote Radiology
                </h1>
              </div> */}
            </div>

            <div className="flex flex-col w-full items-center justify-center gap-2 text-[#525252] text-center">
              <h1 className="text-[18px] text-[#525252] font-bold lg:text-2xl">
                Verification Code
              </h1>
              <p className="text-[12px] lg:text-[18px]">
                We have sent the verification code to <b>{email}</b>
              </p>
            </div>

            <div className="flex items-center justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(val) => {
                  setOtp(val);
                  if (errorMessage) setErrorMessage(null); // Clear on change
                }}
              >
                <InputOTPGroup className="space-x-2 font-bold">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className="rounded-lg border-1 size-10 border-black shadow-inner dark:shadow-primary/10"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>

            {errorMessage && (
              <p className="text-red-600 text-sm text-center mt-2">
                {errorMessage}
              </p>
            )}

            <div className="flex flex-col items-center gap-4">
              {!showSuccess ? (
                !timerFinished ? (
                  <>
                    <Timer
                      key={timerKey}
                      initialTime={60}
                      onTimerEnd={handleTimerEnd}
                    />
                    <p className="text-sm text-gray-500">
                      Waiting for Passcode...
                    </p>
                  </>
                ) : (
                  <div className="flex gap-1 items-center">
                    <p className="text-sm text-gray-500">
                      Didn't Receive Passcode?
                    </p>
                    <span
                      onClick={() => handleResendOTP()}
                      className={`text-[#277EBE] font-[600] cursor-pointer hover:underline ${
                        reSend ? "opacity-50 pointer-events-none" : ""
                      }`}
                    >
                      {reSend ? "Resending..." : "Re-send"}
                    </span>
                  </div>
                )
              ) : (
                <div className="flex items-center">
                  <svg
                    className="checkmark"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 52 52"
                  >
                    <circle
                      className="checkmark__circle"
                      cx="26"
                      cy="26"
                      r="25"
                      fill="none"
                    />
                    <path
                      className="checkmark__check"
                      fill="none"
                      d="M14.1 27.2l7.1 7.2 16.7-16.8"
                    />
                  </svg>

                  <span className="text-sm font-semibold text-green-600 verified-text">
                    Passcode Verified
                  </span>
                </div>
              )}
            </div>

            <Button
              type="button"
              onClick={handleVerify}
              disabled={isVerifying}
              className="w-[80%] lg:w-full mx-auto my-0 p-4 cursor-pointer text-lg font-bold bg-[#F9F5EE] text-[#3F3F3D] hover:bg-[#fef3e1]"
            >
              {isVerifying ? "Verifying..." : "Verify"}
            </Button>

            {/* {!showSuccess && (
              <div className="flex items-center gap-3">
                <svg
                  className="checkmark"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 52 52"
                >
                  <circle
                    className="checkmark__circle"
                    cx="26"
                    cy="26"
                    r="25"
                    fill="none"
                  />
                  <path
                    className="checkmark__check"
                    fill="none"
                    d="M14.1 27.2l7.1 7.2 16.7-16.8"
                  />
                </svg>

                <span className="text-lg font-semibold text-green-600 verified-text">
                  Passcode Verified
                </span>
              </div>
            )} */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
