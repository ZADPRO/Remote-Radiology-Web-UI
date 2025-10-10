
import React, { useState } from "react";
// import logo from "../../assets/Logo.png";
// import forgotPassImg from "../../assets/Login/ForgotPassword.png";
// import loginBgDesign from "../../assets/Login/LoginBg-Design.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { forgotPasswordService } from "@/services/authenticationService";
import { useNavigate } from "react-router-dom";
import loginImg from "../../assets/Login/Login.png";
import loginTexture from "../../assets/Login/Login-Texture.png"
import logoNew from "../../assets/LogoNew.png";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Checkbox } from "@/components/ui/checkbox";


const ForgotPasword: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordRules, setPasswordRules] = useState({
    minLength: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

const [successMessage, setSuccessMessage] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const [step, setStep] = useState<"emailOtp" | "newPassword">("emailOtp");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await forgotPasswordService.verifyUser({email: formData.email});
      console.log(response);
      if(response.data.data.status) {
        setSuccessMessage("Passcode sent successfully!");
        setStep("emailOtp");
        setOtpSent(true);
      } else {
        setError(response.data.data.message);
      }
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
      setSuccessMessage("");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await forgotPasswordService.verifyOtp({email: formData.email, OTP: Number(formData
        .otp)
      });
      console.log(response);
      if(response.data.data.status) {
        setSuccessMessage("Passcode verified successfully!");
        setStep("newPassword");
      } else {
        setError("Invalid Passcode. Please try again.");
        setSuccessMessage("");
      }
    } catch (err) {
      setError("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    const password = formData.newPassword;
    const confirmPassword = formData.confirmPassword;

    if (!password) {
      setError("Password is required.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (!/\d/.test(password)) {
      setError("Password must include at least one number.");
      return;
    }

    if (!/[!@#$%^&*]/.test(password)) {
      setError("Password must include at least one special character.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const response = await forgotPasswordService.resetPassword({
        email: formData.email,
        OTP: Number(formData.otp),
        password: formData.newPassword,
      });
      console.log(response);
      if (response.data.data.status) {
        setSuccessMessage("Password reset successful!");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setError("Failed to reset password.");
        setSuccessMessage("");
      }
    } catch (err) {
      setError("Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-svh bg-gray-50 lg:bg-white lg:flex-row">
      {/* Left image section */}
      <div
        style={{ backgroundImage: `url(${loginTexture})` }}
        className="flex flex-1 lg:basis-[55%] items-center justify-center bg-[#a4b2a1] lg:bg-cover lg:bg-center lg:bg-no-repeat"
      >
        <img
          src={loginImg}
          alt="Login"
          className="w-[90%] lg:w-[80%]"
        />
      </div>

      {/* Right section */}
      <div className="flex flex-1 lg:basis-[45%] bg-[#EDD1CE] flex-col justify-start lg:px-8 lg:shadow-2xl lg:justify-center relative">
        <img
          src={logoNew}
          className="hidden h-[15%] w-auto mx-auto lg:inline"
        />
        <div className="w-[90%] mx-auto p-5 rounded-lg shadow-lg lg:w-[70%] lg:shadow-none">
          <div className="flex flex-col items-center gap-2 text-center">
            {/* <div className="items-center justify-around gap-10% pb-3 hidden lg:flex">
              <img src={logo} alt="logo" className="w-[20%] h-[20%]" />
              <h1 className="text-3xl font-[700] text-[#525252]">
                Remote Radiology
              </h1>
            </div> */}

            <div className="hidden flex-col w-full items-start justify-center text-start text-[#525252] lg:flex">
              <h1 className="text-2xl text-[#525252] font-bold">
                Forgot Password
              </h1>
              {step === "emailOtp" && (
                <p className="text-sm text-[#525252]">
                  Don't worry! It happens. Please enter the email and we will
                  send the OTP to this email.
                </p>
              )}
              {step === "newPassword" && (
                <p className="text-sm text-[#525252]">
                  Make sure to enter the right password
                </p>
              )}
            </div>

            <div className="w-full text-start flex flex-col items-start gap-1 lg:hidden">
              <h1 className="text-2xl font-[800] text-[#525252]">
                Forgot Password
              </h1>
              {step === "emailOtp" && (
                <p className="text-sm text-[#525252]">
                  Don't worry! It happens. Please enter the email and we will
                  send the OTP to this email.
                </p>
              )}
              {step === "newPassword" && (
                <p className="text-sm text-[#525252]">
                  Make sure to enter the right password
                </p>
              )}
              {/* <img src={welcomeImg} className="w-[8%] h-[8%]" /> */}
            </div>
          </div>

          {/* Email & OTP Form */}
          {step === "emailOtp" && (
            <form
              onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}
              className="flex flex-col gap-6 mt-6"
            >
              <div className="grid gap-6">
                <div className="grid gap-2 text-[14px]">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    className="bg-[#A3B1A1] border border-[#3F3F3D]"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    disabled={otpSent}
                  />
                </div>

                {otpSent && (
                  <div className="grid gap-2 text-[14px]">
                    <Label htmlFor="otp">Passcode</Label>
                    {/* <Input
                      id="otp"
                      type="text"
                      placeholder="Enter Passcode"
                      className="bg-[#A3B1A1] border border-[#3F3F3D] text-[#FFF5F5]"
                      value={formData.otp}
                      onChange={(e) =>
                        setFormData({ ...formData, otp: e.target.value })
                      }
                      required
                    /> */}
                    <InputOTP
                      maxLength={6}
                      value={formData.otp}
                      onChange={(e) =>
                          setFormData({ ...formData, otp: e })
                        }
                      required
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
                )}

                {error && <p className="text-sm text-red-500">{error}</p>}
                {successMessage.length > 0 && (
                  <p className="text-sm text-green-600">{successMessage}</p>
                )}

                <Button
                  type="submit"
                  className="w-full mx-auto my-0 p-4 cursor-pointer text-lg font-bold bg-[#F9F5EE] text-[#3F3F3D] hover:bg-[#fef3e1]"
                  disabled={loading}
                >
                  {loading
                    ? "Please wait..."
                    : otpSent
                    ? "Verify Passcode"
                    : "Get Passcode"}
                </Button>
              </div>
            </form>
          )}

          {/* New Password Form */}
          {step === "newPassword" && (
            <form
              onSubmit={handleResetPassword}
              className="flex flex-col gap-6 mt-6"
            >
              <div className="grid gap-6">
                <div className="grid gap-2 text-[14px]">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative flex items-center rounded-md border bg-[#A3B1A1] border-[#3F3F3D] pr-2 focus-within:ring-3 focus-within:ring-ring/50 focus-within:border-gray-400 focus-within:ring-offset-0 shadow-xs transition-[color,box-shadow]">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="border-0 bg-transparent focus-visible:ring-0 shadow-none"
                      value={formData.newPassword}
                     onChange={(e) => {
                        const value = e.target.value;
                        setFormData({ ...formData, newPassword: value });

                        setPasswordRules({
                          minLength: value.length >= 8,
                          hasNumber: /\d/.test(value),
                          hasSpecialChar: /[!@#$%^&*]/.test(value),
                        });
                      }}
                    />
                    <button type="button" onClick={togglePasswordVisibility}>
                      {showPassword ? (
                        <EyeOffIcon className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2 rounded-md border p-4 bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={passwordRules.minLength} disabled />
                    <span className="text-sm text-muted-foreground">
                      At least 8 characters
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox checked={passwordRules.hasNumber} disabled />
                    <span className="text-sm text-muted-foreground">
                      Contains a number
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox checked={passwordRules.hasSpecialChar} disabled />
                    <span className="text-sm text-muted-foreground">
                      Special character (!@#$%^&*)
                    </span>
                  </div>
                </div>

                <div className="grid gap-2 text-[14px]">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative flex items-center rounded-md border bg-[#A3B1A1] border-[#3F3F3D] pr-2 focus-within:ring-3 focus-within:ring-ring/50 focus-within:border-gray-400 focus-within:ring-offset-0 shadow-xs transition-[color,box-shadow]">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm password"
                      className="border-0 bg-transparent focus-visible:ring-0 shadow-none"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      required
                    />
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                    >
                      {showConfirmPassword ? (
                        <EyeOffIcon className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}
                {successMessage.length > 0 && (
                  <div className="flex justify-start items-center">
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

                  <span className="text-sm font-semibold verified-text">
                    {successMessage}
                  </span>
                </div>
                )}

                <Button
                  type="submit"
                  className="w-full mx-auto my-0 p-4 cursor-pointer text-lg font-bold bg-[#F9F5EE] text-[#3F3F3D] hover:bg-[#fef3e1]"
                  disabled={loading}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasword;