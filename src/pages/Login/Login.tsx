import React, { useState } from "react";
// import logoNew from "../../assets/LogoNew.png";
import logoNew from "../../assets/LogoNewTM.png";
import loginImg from "../../assets/Login/Login.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import welcomeImg from "../../assets/Login/Welcome.png";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import loginTexture from "../../assets/Login/Login-Texture.png"
// import { decrypt } from "@/Helper";
import { useNavigate } from "react-router-dom";
import { authenticationService } from "@/services/authenticationService";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [isVerifying, setIsVerifying] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const login = async (e: any) => {
    // setRole('admin');
    // navigate('/admin');
    e.preventDefault();
    setIsVerifying(true);
    setErrorMessage("");
    try {
      const response = await authenticationService.loginAuth(formData);
      console.log(response);
      const ResponseData = response.data.data;
      if (ResponseData.status) {
        navigate("/verifyOtp", {
          state: { loginData: formData, email: ResponseData.email },
        });
        setIsVerifying(false);
        setErrorMessage(""); // Clear any previous error
      } else {
        setErrorMessage(ResponseData.message); // Show message below the form
        setIsVerifying(false);
      }
    } catch (e) {
      console.log(e);
      setErrorMessage("Something went wrong. Please try again.");
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex flex-col min-h-svh lg:bg-white lg:flex-row">
      {/* <div className="flex items-center justify-center gap-2 px-4 py-3 mt-4 lg:hidden">
        <img
          src={logoNew}
          alt="logo"
          className="w-[40%] max-w-[52px] object-contain"
        />
      </div> */}

      {/* Left image section */}
      <div style={{ backgroundImage: `url(${loginTexture})`, }} className="flex flex-1 lg:basis-[55%] items-center justify-center bg-[#a4b2a1] lg:bg-cover lg:bg-center lg:bg-no-repeat">
        <img
          src={loginImg}
          alt="Login"
          className="w-[300px] md:w-[500px]"
        />
      </div>

      {/* Right login form section */}
      <div className="flex flex-1 lg:basis-[45%] bg-[#EDD1CE] flex-col justify-center lg:px-8 lg:shadow-2xl lg:justify-center relative">
        <img
          src={logoNew}
          className="hidden h-[15%] w-auto mx-auto lg:inline"
        />
        <div className="w-[90%] my-5 mx-auto p-5 pb-0 rounded-lg shadow-lg lg:w-[70%] lg:shadow-none">
          <form onSubmit={(e: any) => login(e)} className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2 text-center">
              {/* <div className="items-center justify-around gap-10% pb-3 hidden lg:flex">
                <img src={logo} alt="logo" className="w-[20%] h-[20%]" />
                <h1 className="text-3xl font-[700] text-[#525252]">
                  Remote Radiology
                </h1>
              </div> */}
              <div className="hidden flex-col w-full items-start justify-center text-start text-[#525252] lg:flex">
                <h1 className="text-2xl font-bold">Login to your account</h1>
                <p className="text-sm text-[#525252]">
                  Enter your email below to login to your account
                </p>
              </div>

              <div className="w-full text-start flex items-center gap-1 lg:hidden">
                <h1 className="text-2xl font-[800] text-[#525252]">
                  Hi, Welcome!
                </h1>
                <img src={welcomeImg} className="w-[6%] h-[6%]" />
              </div>
            </div>

            <div className="grid gap-4 lg:gap-6">
              <div className="grid gap-2 text-[14px]">
                <Label htmlFor="email" className="text-[#525252]">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  className="bg-[#A3B1A1] border border-[#3F3F3D]"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2 text-[14px]">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="password" className="text-[#525252]">Password</Label>
                  <div className="relative flex items-center rounded-md border bg-[#A3B1A1] border-[#3F3F3D] pr-2 focus-within:ring-3 focus-within:ring-ring/50 focus-within:border-gray-400 focus-within:ring-offset-0 shadow-xs transition-[color,box-shadow]">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="border-0 bg-transparent focus-visible:ring-0 shadow-none"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
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

                <div className="flex justify-between items-center">
                  {/* <div className="flex items-center gap-3">
                    <Checkbox id="rememberMe" className="text-[#3F3F3D]" />
                    <label
                      htmlFor="rememberMe"
                      className="text-sm font-medium text-[#3F3F3D] text-[12px] leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Remember Me
                    </label>
                  </div> */}

                  <div
                    onClick={() => {
                      navigate("/forgotPassword");
                    }}
                    className="ml-auto text-[12px] text-[#525252] underline-offset-4 cursor-pointer hover:underline"
                  >
                    Forgot your password?
                  </div>
                </div>
              </div>
              {errorMessage && (
                <p className="text-red-500 text-sm text-center">
                  {errorMessage}
                </p>
              )}
              <Button
                type="submit"
                disabled={isVerifying}
                className="w-full mt-2 p-4 mb-5 cursor-pointer text-lg font-bold bg-[#F9F5EE] text-[#3F3F3D] hover:bg-[#fef3e1]"
              >
                {isVerifying ? "Verifying..." : "Login"}
              </Button>

            </div>

            {/* <div className="text-sm mx-auto text-[#525252]">
              Don't have an account?{" "}
              <span
                className="text-[#91c3ce] font-bold hover:underline cursor-pointer"
                onClick={() => navigate("/registerUser")}
              >
                Sign Up
              </span>
            </div> */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
