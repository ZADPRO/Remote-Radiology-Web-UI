import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import logoNew from "../../assets/LogoNew.png";
// import userSignUpImg from "../../assets/Login/signup.png";
// import logo from "../../assets/Logo.png";
import { signupService } from "@/services/authenticationService";
// import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import loginImg from "../../assets/Login/Login.png";
import loginTexture from "../../assets/Login/Login-Texture.png"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Checkbox } from "@/components/ui/checkbox";
import Timer from "@/components/Timer/Timer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "../Routes/AuthContext";

const SignUp: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phoneCountryCode: "+1",
    phone: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const [timerFinished, setTimerFinished] = useState<boolean>(false);
  const [reSend, setReSend] = useState<boolean>(false);

  const [success, setSuccess] = useState(false);

  const handleTimerEnd = () => {
    setTimerFinished(true);
  };

  const [passwordRules, setPasswordRules] = useState({
  minLength: false,
  hasNumber: false,
  hasSpecialChar: false,
});

  const navigate = useNavigate();

  const { refreshToken } = useAuth();

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword((prev) => !prev);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (step === 1) {
        const phoneLength = formData.phone.trim().length;

        if (formData.phoneCountryCode === "+91" && phoneLength !== 10) {
          setError("Indian phone number must be 10 digits.");
          setLoading(false);
          return;
        }

        if (formData.phoneCountryCode === "+1" && phoneLength !== 10) {
          setError("US phone number must be 10 digits.");
          setLoading(false);
          return;
        }

        await handleVerifyUser();
        return;
      }

      if (step === 2) {
        if (!formData.otp) {
          setError("Please enter the Passcode.");
          return;
        }
        await handleVerifyOtp();
        return;
      }

      if (step === 3) {
        const password = formData.password;
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

        await handleRegister();
      }

    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleReLogin = async () => {
  setReSend(true);
  setError("");
  setTimerKey((prevKey) => prevKey + 1);
  try {
    await handleVerifyUser();
  } finally {
    setReSend(false);
    setTimerFinished(false);
  }
};

  const handleVerifyUser = async () => {
  try {
    const res = await signupService.getOtp(formData);

    if (res.data?.status) {
      setStep(2);
    } else {
      setError(res.data?.message || "Failed to get Passcode.");
    }
  } catch (error) {
    console.error("Verify User Error:", error);
    setError("Something went wrong. Please try again.");
  }
};


  const handleVerifyOtp = async() => {
    try {
      const tempFormData = {
        ...formData,
        otp: Number(formData.otp),
      };
      const res = await signupService.verifyOtp(tempFormData);
      console.log(res);
      if(res.data.status) {
        setStep(3);
        return;
      } else {
        setError(res.data.message);
      }
    } catch (error) {
      console.log(error);
      setError("Something went wrong. Please try again.");
    }
  }

  const handleRegister = async() => {
    try {
      const tempFormData = {
        ...formData,
        otp: Number(formData.otp),
      };
      const res = await signupService.signup(tempFormData);
      console.log(res);
      if(res.data.status) {
        setSuccess(true);
        refreshToken();
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        setError(res.data.message);
      }
    } catch (error) {
      console.log(error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-svh bg-gray-50 lg:bg-white lg:flex-row">
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

      <div className="flex flex-1 lg:basis-[45%] flex-col justify-start py-8 lg:px-8 lg:shadow-2xl lg:justify-center bg-[#EDD1CE] relative">
        <img
          src={logoNew}
          className="hidden w-[40%] h-[20%] mx-auto lg:inline"
        />
        <div className="w-[90%] mx-auto p-5 rounded-lg shadow-lg lg:w-[80%] lg:shadow-none">
          <div className="flex flex-col items-center gap-2 text-center">
            {/* <div className="items-center justify-around gap-10% pb-3 hidden lg:flex">
              <img src={logo} alt="logo" className="w-[20%] h-[20%]" />
              <h1 className="text-3xl font-[700] text-[#525252]">
                Remote Radiology
              </h1>
            </div> */}

            <div className="hidden flex-col w-full items-start justify-center text-start text-[#525252] lg:flex">
              <h1 className="text-2xl font-bold">
                {step === 1 && "Create Account"}
                {step === 2 && "Verify Email"}
                {step === 3 && "Set Password"}
              </h1>
              <p className="text-sm text-[#525252]">
                Sign up to access your account
              </p>
            </div>

            <div className="w-full text-start flex flex-col items-start gap-1 lg:hidden">
              <h1 className="text-2xl font-[800] text-[#525252]">
                {step === 1 && "Create Account"}
                {step === 2 && "Verify Email"}
                {step === 3 && "Set Password"}
              </h1>
              <p className="text-sm text-muted-foreground">
                Sign up to access your account
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-6">
            {step === 1 && (
              <>
                <div className="flex gap-2 justify-between">
                  <div className="grid gap-2 w-full text-[#828282] text-[14px]">
                    <Label htmlFor="firstname" className="text-[#525252]">
                      Full Name
                    </Label>
                    <Input
                      id="firstname"
                      type="text"
                      placeholder="Full Name"
                      className="bg-[#A3B1A1] border border-[#3F3F3D] text-[#FFF5F5]"
                      value={formData.firstname}
                      onChange={(e) =>
                        setFormData({ ...formData, firstname: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-[#828282] text-[14px]" htmlFor="phone">
                    Phone Number
                  </Label>
                  <div className="flex gap-2">
                    <Select
                      value={formData.phoneCountryCode}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          phoneCountryCode: value,
                        }))
                      }
                    >
                      <SelectTrigger className="bg-[#A3B1A1] text-[#FFF5F5] border border-[#3F3F3D] flex-[1]">
                        <SelectValue placeholder="Country Code" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="+1">USA (+1)</SelectItem>
                      </SelectContent>
                    </Select>

                    <Input
                      id="phone"
                      type="number"
                      placeholder="Enter Phone Number"
                      className="bg-[#A3B1A1] border border-[#3F3F3D] text-[#FFF5F5] flex-[5]"
                      value={formData.phone}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.length <= 10) {
                          setFormData((prev) => ({
                            ...prev,
                            phone: value,
                          }));
                        }
                      }}
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-2 text-[#828282] text-[14px]">
                  <Label htmlFor="email" className="text-[#525252]">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    className="bg-[#A3B1A1] border border-[#3F3F3D] text-[#FFF5F5]"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
              </>
            )}

            {step === 2 && (
              <div className="grid gap-2 text-[#828282] text-[14px]">
                <Label htmlFor="otp" className="text-[#525252]">
                  Enter Passcode
                </Label>
                <div className="flex items-center justify-center">
                  <InputOTP
                    maxLength={6}
                    value={formData.otp}
                    onChange={(e) =>
                      setFormData({ ...formData, otp: e.replace(/\D/g, "") })
                    }
                    required
                  >
                    <InputOTPGroup className="space-x-2">
                      {[0, 1, 2, 3, 4, 5].map((index) => (
                        <InputOTPSlot
                          key={index}
                          index={index}
                          className="rounded-lg border-1 size-10 text-black font-bold border-black shadow-inner dark:shadow-primary/10"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <div className="flex items-center justify-center">
                  {timerFinished ? (
                    <div className="text-[14px] flex justify-center p-4 mx-auto my-0">
                      <span className="text-[#525252]">
                        Didn't receive the code?{" "}
                        <span
                          onClick={() => handleReLogin()}
                          className={`text-[#277EBE] font-[600] cursor-pointer hover:underline ${
                            reSend ? "opacity-50 pointer-events-none" : ""
                          }`}
                        >
                          {reSend ? "Resending..." : "Re-send"}
                        </span>
                      </span>
                    </div>
                  ) : (
                    <Timer
                      key={timerKey}
                      initialTime={60}
                      onTimerEnd={handleTimerEnd}
                    />
                  )}
                </div>
              </div>
            )}

            {step === 3 && (
              <>
                <div className="grid gap-2 text-[#828282] text-[14px]">
                  <Label htmlFor="password" className="text-[#525252]">
                    Password
                  </Label>
                  <div className="relative flex items-center rounded-md border bg-[#A3B1A1] border-[#3F3F3D] text-[#FFF5F5] pr-2 focus-within:ring-3 focus-within:ring-ring/50 focus-within:border-gray-400 focus-within:ring-offset-0 shadow-xs transition-[color,box-shadow]">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="border-0 bg-transparent focus-visible:ring-0 shadow-none"
                      value={formData.password}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData({ ...formData, password: value });

                        setPasswordRules({
                          minLength: value.length >= 8,
                          hasNumber: /\d/.test(value),
                          hasSpecialChar: /[!@#$%^&*]/.test(value),
                        });
                      }}
                      required
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

                <div className="grid gap-2 text-[#828282] text-[14px]">
                  <Label htmlFor="confirmPassword" className="text-[#525252]">
                    Confirm Password
                  </Label>
                  <div className="relative flex items-center rounded-md border bg-[#A3B1A1] border-[#3F3F3D] text-[#FFF5F5] pr-2 focus-within:ring-3 focus-within:ring-ring/50 focus-within:border-gray-400 focus-within:ring-offset-0 shadow-xs transition-[color,box-shadow]">
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
              </>
            )}

            {error && (
              <p className="text-sm text-start text-red-500">{error}</p>
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

                  <span className="text-sm font-semibold text-green-600 verified-text">
                    Account Created Successfully
                  </span>
                </div>
              )}

            <Button
              type="submit"
              className="w-full cursor-pointer bg-[#F9F5EE] text-[#3F3F3D] text-lg font-bold hover:bg-[#fef3e1]"
              disabled={loading}
            >
              {step === 1 && (loading ? "Loading..." : "Continue")}
              {step === 2 && (loading ? "Verifying..." : "Verify Passcode")}
              {step === 3 && (loading ? "Signing up..." : "Sign Up")}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
