import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation, useNavigate } from "react-router-dom";
import { authenticationService } from "@/services/authenticationService";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import loginImg from "../../assets/Login/Login.png";
import loginTexture from "../../assets/Login/Login-Texture.png";
import logoNew from "../../assets/LogoNew.png";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import UserConsent from "../Consent/UserConsent";
import { useAuth } from "../Routes/AuthContext";
import TechConsentForm from "../Dashboard/TechConsent/TechConsentForm";

const ResetPassword: React.FC = () => {
  const location = useLocation();
  const email = (location.state as { email?: string })?.email || "";
  const token = (location.state as { token?: string })?.token || "";
  const scancenterId =
    (location.state as { scancenterId?: number })?.scancenterId || 0;

  const [passwordRules, setPasswordRules] = useState({
    minLength: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { role, refreshToken } = useAuth();
  const navigate = useNavigate();

  const [consent, setConsent] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleReset = async () => {
    const password = formData.newPassword;
    const confirmPassword = formData.confirmPassword;

    if (!password) {
      setErrorMessage("Password is required.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    if (!/\d/.test(password)) {
      setErrorMessage("Password must include at least one number.");
      return;
    }

    if (!/[!@#$%^&*]/.test(password)) {
      setErrorMessage("Password must include at least one special character.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      setErrorMessage("");
      const response = await authenticationService.resetPassword(
        {
          password: formData.newPassword,
          consent: consent,
        },
        token
      );
      console.log(response);
      if (response.status) {
        refreshToken();
        setSuccess(true);

        if (role?.type === "patient") {
          setTimeout(() => navigate(`/patient/myCare`), 2000);  
        } else {
          setTimeout(() => navigate(`/${role?.type}/dashboard`), 2000);
        }
      } else {
        setErrorMessage(response.data.message || "Password reset failed.");
      }
    } catch (error) {
      console.error("Reset error:", error);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-svh bg-gray-50 lg:bg-white lg:flex-row">
      {/* Left image section */}
      <div
        style={{ backgroundImage: `url(${loginTexture})` }}
        className="flex flex-1 lg:basis-[55%] items-center justify-center bg-[#F9F5EF] lg:bg-cover lg:bg-center lg:bg-no-repeat"
      >
        <img src={loginImg} alt="Login" className="w-[90%] lg:w-[80%]" />
      </div>

      {/* Right section */}
      <div className="flex flex-1 lg:basis-[45%] bg-[#EDD1CE] flex-col justify-start lg:py-8 lg:px-8 lg:justify-center lg:shadow-2xl relative">
        <img
          src={logoNew}
           className="hidden w-auto h-[15%] mx-auto lg:inline"
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
                Reset Your Password
              </h1>
              <p className="text-[12px] text-[#525252] lg:text-[16px] mb-2">
                E-Mail: <b>{email}</b>
              </p>
            </div>

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

              {errorMessage && (
                <p className="text-sm text-red-500">{errorMessage}</p>
              )}
              {success && (
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
                    Password Reset Successful
                  </span>
                </div>
              )}
              <Button
                type="button"
                onClick={handleReset}
                disabled={isSubmitting}
                className="w-full lg:w-full mt-2 p-4 cursor-pointer text-lg font-bold bg-[#F9F5EE] text-[#3F3F3D] hover:bg-[#fef3e1]"
              >
                {isSubmitting ? "Resetting..." : "Reset Password"}
              </Button>
            </div>
          </form>
        </div>
      </div>

      <Dialog open={isEditDialogOpen}>
        {role?.type == "technician" ? (
          <TechConsentForm
            scId={scancenterId}
            onSubmit={(consent) => consent && setConsent(consent)}
            setDialogOpen={setIsEditDialogOpen}
          />
        ) : (
          <DialogContent
            style={{
              background:
                "radial-gradient(100.97% 186.01% at 50.94% 50%, #F9F4EC 25.14%, #EED8D6 100%)",
            }}
            className="h-11/12 w-[90vw] lg:w-[70vw] overflow-y-auto p-0"
          >
            <DialogHeader className="bg-[#eac9c5] border-1 border-b-gray-400 flex flex-col lg:flex-row items-center justify-between px-4 py-2">
              {/* Logo (Left) */}
              <div className="h-12 w-24 sm:h-14 sm:w-28 flex-shrink-0">
                <img
                  src={logoNew}
                  alt="logo"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Centered Content */}
              <div className="flex-1 text-center">
                <h2 className="text-2xl font-semibold">User Consent Form</h2>
                <p className="text-sm text-gray-600 max-w-md mx-auto">
                  EaseQT Platform
                </p>
              </div>

              {/* Spacer to balance logo width */}
              <div className="hidden lg:inline h-12 w-24 sm:h-14 sm:w-28 flex-shrink-0" />
            </DialogHeader>

            <UserConsent setEditingDialogOpen={setIsEditDialogOpen} />
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default ResetPassword;
