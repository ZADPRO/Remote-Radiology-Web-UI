// src/Dashboard/MasterAdmin.tsx

import React, { JSX, useEffect, useState } from "react";
import { ChartPie, PersonStanding, Settings2 } from "lucide-react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/LogoNew.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "../Routes/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import RadiologistProfile from "../Profile/RadiologistProfile";
import ScanCenterAdminProfile from "../Profile/ScanCenterAdminProfile";
import ScribeProfile from "../Profile/ScribeProfile";
import TechnicianProfile from "../Profile/TechnicianProfile";
import PerformingProviderProfile from "../Profile/PerformingProviderProfile";
import CoReportingDoctorProfile from "../Profile/CoReportingDoctorProfile";
import WellthGreenAdminProfile from "../Profile/WellthGreenAdminProfile";
import dashboard from "../../assets/Administration/Dashboard.png";
import medicalHistory from "../../assets/Administration/MedicalHistory.png";
import PatientBrochure from "../../assets/Administration/PatientBrochure.png";
import Brochure from "./Brochure";
import Disclaimer from "./Disclaimer";
import GeneralGuidelines from "./GeneralGuidelines";
import UserConsent from "../Consent/UserConsent";
import logoNew from "../../assets/LogoNew.png";
import PatientProfile from "../Profile/PatientProfile";
import WGPerformingProvider from "../Profile/WGPerformingProvider";
// import {
//   HiChartPie,
//   HiUser,
//   HiShoppingBag,
// } from "react-icons/hi";

const MasterAdmin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role, setRole } = useAuth();

  const renderProfileComponent = () => {
    console.log(role?.type);
    switch (role?.type) {
      case "scadmin":
        return <ScanCenterAdminProfile />;
      case "scribe":
        return <ScribeProfile />;
      case "technician":
        return <TechnicianProfile />;
      case "doctor":
        return <PerformingProviderProfile />;
      case "codoctor":
        return <CoReportingDoctorProfile />;
      case "radiologist":
        return <RadiologistProfile />;
      case "wgdoctor":
        return <WGPerformingProvider />;
      case "patient":
        return <PatientProfile />;
      case "admin":
        return <PatientProfile />;
      // Add more roles if needed
      case "manager":
        return <WellthGreenAdminProfile />;
      default:
        return <div>No profile available for this role</div>;
    }
  };

  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);

  const [isDropdownOpen, setIsDropDownOpen] = useState<boolean>(false);

  const [BrochureMenu, setBrochureMenu] = useState(false);
  const [BrochureMobileMenu, setBrochureMobileMenu] = useState(false);
  const [BrochureMenuopen, setBrochureMenuopen] = useState(false);
  const [activeDialogContent, setActiveDialogContent] =
    useState<JSX.Element | null>(null);

  const roleMenus: Record<
    string,
    { label: string; path: string; icon: JSX.Element }[]
  > = {
    admin: [
      {
        label: "Dashboard",
        path: "/admin/dashboard",
        icon: <img src={dashboard} className="w-4 h-4" />,
      },
      {
        label: "Administration",
        path: "/admin/administration",
        icon: <Settings2 className="w-4 h-4" />,
      },
      {
        label: "Patient Queue",
        path: "/admin/patientQueue",
        icon: <PersonStanding className="w-4 h-4" />,
      },
      {
        label: "Analytics",
        path: "/admin/analytics",
        icon: <ChartPie className="w-4 h-4" />,
      },
    ],
    scadmin: [
      {
        label: "Dashboard",
        path: "/scadmin/dashboard",
        icon: <img src={dashboard} className="w-4 h-4" />,
      },
      {
        label: "Administration",
        path: `/scadmin/administration/${user?.refSCId}`,
        icon: <Settings2 className="w-4 h-4" />,
      },
      {
        label: "Patient Queue",
        path: "/scadmin/patientQueue",
        icon: <PersonStanding className="w-4 h-4" />,
      },
      {
        label: "Analytics",
        path: "/scadmin/analytics",
        icon: <ChartPie className="w-4 h-4" />,
      },
    ],
    technician: [
      {
        label: "Dashboard",
        path: "/technician/dashboard",
        icon: <img src={dashboard} className="w-4 h-4" />,
      },
      {
        label: "Patient Queue",
        path: "/technician/patientQueue",
        icon: <PersonStanding className="w-4 h-4" />,
      },
      {
        label: "Analytics",
        path: "/technician/analytics",
        icon: <ChartPie className="w-4 h-4" />,
      },
    ],
    radiologist: [
      {
        label: "Dashboard",
        path: "/radiologist/dashboard",
        icon: <img src={dashboard} className="w-4 h-4" />,
      },
      {
        label: "Patient Queue",
        path: "/radiologist/patientQueue",
        icon: <PersonStanding className="w-4 h-4" />,
      },
      {
        label: "Analytics",
        path: "/radiologist/analytics",
        icon: <ChartPie className="w-4 h-4" />,
      },
    ],
    scribe: [
      {
        label: "Dashboard",
        path: "/scribe/dashboard",
        icon: <img src={dashboard} className="w-4 h-4" />,
      },
      {
        label: "Patient Queue",
        path: "/scribe/patientQueue",
        icon: <PersonStanding className="w-4 h-4" />,
      },
      {
        label: "Analytics",
        path: "/scribe/analytics",
        icon: <ChartPie className="w-4 h-4" />,
      },
    ],
    patient: [
      {
        label: "Home",
        path: "/patient/myCare",
        icon: <img src={dashboard} className="w-4 h-4" />,
      },
      {
        label: "My Reports",
        path: "/patient/medicalHistory",
        icon: <img src={medicalHistory} className="w-5 h-5" />,
      },
      {
        label: "Patient Info",
        path: "/patient/dashboard",
        icon: <img src={PatientBrochure} className="w-5 h-5" />,
      },
    ],
    manager: [
      {
        label: "Dashboard",
        path: "/manager/dashboard",
        icon: <img src={dashboard} className="w-4 h-4" />,
      },
      {
        label: "Administration",
        path: "/manager/administration",
        icon: <Settings2 className="w-4 h-4" />,
      },
      {
        label: "Patient Queue",
        path: "/manager/patientQueue",
        icon: <PersonStanding className="w-4 h-4" />,
      },
      {
        label: "Analytics",
        path: "/manager/analytics",
        icon: <ChartPie className="w-4 h-4" />,
      },
    ],
    doctor: [
      {
        label: "Dashboard",
        path: "/doctor/dashboard",
        icon: <img src={dashboard} className="w-4 h-4" />,
      },
      {
        label: "Patient Queue",
        path: "/doctor/patientQueue",
        icon: <PersonStanding className="w-4 h-4" />,
      },
      {
        label: "Analytics",
        path: "/doctor/analytics",
        icon: <ChartPie className="w-4 h-4" />,
      },
    ],
    codoctor: [
      {
        label: "Dashboard",
        path: "/codoctor/dashboard",
        icon: <img src={dashboard} className="w-4 h-4" />,
      },
      {
        label: "Patient Queue",
        path: "/codoctor/patientQueue",
        icon: <PersonStanding className="w-4 h-4" />,
      },
      {
        label: "Analytics",
        path: "/codoctor/analytics",
        icon: <ChartPie className="w-4 h-4" />,
      },
    ],
    wgdoctor: [
      {
        label: "Dashboard",
        path: "/wgdoctor/dashboard",
        icon: <img src={dashboard} className="w-4 h-4" />,
      },
      {
        label: "Patient Queue",
        path: "/wgdoctor/patientQueue",
        icon: <PersonStanding className="w-4 h-4" />,
      },
      {
        label: "Analytics",
        path: "/wgdoctor/analytics",
        icon: <ChartPie className="w-4 h-4" />,
      },
    ],
  };

  const menus = role?.type ? roleMenus[role.type] || [] : [];

  const [selectedMenu, setSelectedMenu] = useState<string>("");

  useEffect(() => {
    const currentPath = location.pathname;

    const activeMenu = role?.type
      ? roleMenus[role.type]?.find((menu) => currentPath.startsWith(menu.path))
      : null;

    if (activeMenu) {
      setSelectedMenu(activeMenu.label);
    }
  }, [location.pathname, role?.type]);

  return (
    <div className={`flex h-dvh bg-gradient-to-b from-[#EED2CF] to-[#FEEEED]`}>
      <Dialog open={BrochureMenuopen} onOpenChange={setBrochureMenuopen}>
        <div className="mt-4">{activeDialogContent}</div>
      </Dialog>
      {/* Bottom - Mobile view */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full h-[8vh] bg-white rounded-t-2xl shadow-md flex items-center justify-between px-10 z-50">
        {menus.map((menu) => (
          <>
            {menu.label === "Patient Info" ? (
              <>
                <DropdownMenu
                  open={BrochureMobileMenu}
                  onOpenChange={setBrochureMobileMenu}
                >
                  <DropdownMenuTrigger asChild>
                    <div className="bg-[#f8f3eb] p-2 2 rounded-full hover:bg-[#ffeac9] hover:text-white transition">
                      {React.cloneElement(menu.icon, {
                        className: "w-5 h-5 text-gray-700",
                      })}
                    </div>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => {
                        setBrochureMobileMenu(false);
                        setBrochureMenuopen(true);
                        setActiveDialogContent(
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
                                <h2 className="text-2xl font-semibold">
                                  Brochure
                                </h2>
                                <p className="text-sm text-gray-600 max-w-md mx-auto">
                                  EaseQT Platform
                                </p>
                              </div>

                              {/* Spacer to balance logo width */}
                              <div className="hidden lg:inline h-12 w-24 sm:h-14 sm:w-28 flex-shrink-0" />
                            </DialogHeader>
                            <Brochure />
                            <h2 className="text-2xl text-center my-3 font-semibold">
                              General Guidelines
                            </h2>
                            <GeneralGuidelines />
                            <h2 className="text-2xl text-center my-3 font-semibold">
                              Disclaimer
                            </h2>
                            <Disclaimer />
                          </DialogContent>
                        );
                      }}
                    >
                      Brochure
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => {
                        setBrochureMobileMenu(false);
                        setBrochureMenuopen(true);
                        setActiveDialogContent(<Disclaimer />);
                      }}
                    >
                      Disclaimer
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => {
                        setBrochureMobileMenu(false);
                        setBrochureMenuopen(true);
                        setActiveDialogContent(<GeneralGuidelines />);
                      }}
                    >
                      General guidelines
                    </DropdownMenuItem> */}
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => {
                        setBrochureMobileMenu(false);
                        setBrochureMenuopen(true);
                        setActiveDialogContent(
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
                                <h2 className="text-2xl font-semibold">
                                  User Consent Form
                                </h2>
                                <p className="text-sm text-gray-600 max-w-md mx-auto">
                                  EaseQT Platform
                                </p>
                              </div>

                              {/* Spacer to balance logo width */}
                              <div className="hidden lg:inline h-12 w-24 sm:h-14 sm:w-28 flex-shrink-0" />
                            </DialogHeader>

                            <UserConsent viewOnly />
                          </DialogContent>
                        );
                      }}
                    >
                      Consent Form
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div
                key={menu.path}
                className="flex flex-col items-center justify-center gap-[2px] cursor-pointer"
                onClick={() => navigate(menu.path)}
              >
                <div className="bg-[#f8f3eb] p-2 rounded-full hover:bg-[#ffeac9] hover:text-white transition">
                  {React.cloneElement(menu.icon, {
                    className: "w-5 h-5 text-gray-700",
                  })}
                </div>
                {/* Optional: Add this span if you want text below icons */}
                {/* <span className="text-[10px] text-gray-700 font-medium">{menu.label}</span> */}
              </div>
            )}
          </>
        ))}
      </div>

      {/* Main Area */}
      <div className="flex flex-col flex-1">
        {/* Top Navbar */}
        <header className="flex justify-between items-center h-[10vh] px-2">
          {/* Left Section */}
          <div className="h-12 w-32 lg:h-[8vh] lg:w-[10vw] flex items-end justify-start">
            <img
              src={logo}
              alt="logo"
              className="w-full h-full object-contain self-end block"
            />
          </div>

          {/* Right Section */}
          <div className="hidden lg:flex items-center gap-3">
            {menus.map((menu) => (
              <>
                {menu.label === "Patient Info" ? (
                  <>
                    <DropdownMenu
                      open={BrochureMenu}
                      onOpenChange={setBrochureMenu}
                    >
                      <DropdownMenuTrigger asChild>
                        <div
                          key={menu.path}
                          className={`flex items-center justify-center gap-2 py-1.5 2xl:py-3 px-3 2xl:px-4 rounded-3xl cursor-pointer transition ${
                            selectedMenu === menu.label
                              ? "bg-[#B1B8AA]"
                              : "bg-[#f8f3eb]"
                          }`}
                        >
                          {menu.icon}
                          <span className="text-sm 2xl:text-lg font-semibold mt-[1.5px]">
                            {menu.label}
                          </span>
                        </div>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => {
                            setBrochureMenu(false);
                            setBrochureMenuopen(true);
                            setActiveDialogContent(
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
                                    <h2 className="text-2xl font-semibold">
                                      Brochure
                                    </h2>
                                    <p className="text-sm text-gray-600 max-w-md mx-auto">
                                      EaseQT Platform
                                    </p>
                                  </div>

                                  {/* Spacer to balance logo width */}
                                  <div className="hidden lg:inline h-12 w-24 sm:h-14 sm:w-28 flex-shrink-0" />
                                </DialogHeader>
                                <Brochure />
                                <h2 className="text-2xl text-center my-3 font-semibold">
                                  General Guidelines
                                </h2>
                                <GeneralGuidelines />
                                <h2 className="text-2xl text-center my-3 font-semibold">
                                  Disclaimer
                                </h2>
                                <Disclaimer />
                              </DialogContent>
                            );
                          }}
                        >
                          Brochure
                        </DropdownMenuItem>
                        {/* <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => {
                            setBrochureMenu(false);
                            setBrochureMenuopen(true);
                            setActiveDialogContent(<Disclaimer />);
                          }}
                        >
                          Disclaimer
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => {
                            setBrochureMenu(false);
                            setBrochureMenuopen(true);
                            setActiveDialogContent(<GeneralGuidelines />);
                          }}
                        >
                          General guidelines
                        </DropdownMenuItem> */}
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => {
                            setBrochureMenu(false);
                            setBrochureMenuopen(true);
                            setActiveDialogContent(
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
                                    <h2 className="text-2xl font-semibold">
                                      User Consent Form
                                    </h2>
                                    <p className="text-sm text-gray-600 max-w-md mx-auto">
                                      EaseQT Platform
                                    </p>
                                  </div>

                                  {/* Spacer to balance logo width */}
                                  <div className="hidden lg:inline h-12 w-24 sm:h-14 sm:w-28 flex-shrink-0" />
                                </DialogHeader>

                                <UserConsent viewOnly />
                              </DialogContent>
                            );
                          }}
                        >
                          Consent Form
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                ) : (
                  <div
                    key={menu.path}
                    className={`flex items-center justify-center gap-2 py-1.5 2xl:py-3 px-3 2xl:px-4 rounded-3xl cursor-pointer transition ${
                      selectedMenu === menu.label
                        ? "bg-[#B1B8AA]"
                        : "bg-[#f8f3eb]"
                    }`}
                    onClick={() => {
                      navigate(menu.path);
                      setSelectedMenu(menu.label);
                    }}
                  >
                    {menu.icon}
                    <span className="text-sm 2xl:text-lg font-semibold mt-[1.5px]">
                      {menu.label}
                    </span>
                  </div>
                )}
              </>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* <Button
              variant="outline"
              className="rounded-3xl bg-[#f8f3eb]"
              size="icon"
            >
              <HelpCircleIcon />
            </Button>
            <div className="relative">
              <Button
                variant="outline"
                className="rounded-3xl bg-[#f8f3eb]"
                size="icon"
              >
                <BellIcon />
              </Button>
              {/* <span className="absolute top-1 right-1 px-1.5 py-0.5 min-w-4 translate-x-1/2 -translate-y-1/2 origin-center flex items-center justify-center rounded-sm text-xs bg-[#F3C294] text-destructive-foreground">
                2
              </span> */}{" "}
            {/*}
            </div> */}
            <DropdownMenu
              open={isDropdownOpen}
              onOpenChange={setIsDropDownOpen}
            >
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer p-2 rounded-md">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="/profile.jpg" alt="User" />
                    <AvatarFallback className="bg-[#f9f4ec] text-xs">
                      {user?.refUserFirstName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">
                      {user?.refUserFirstName}
                    </span>
                    <span className="text-xs font-semibold">
                      {user?.refUserCustId}
                    </span>
                    <span className="text-xs font-semibold">
                      {user?.refRTId === 1
                        ? "Master Admin"
                        : user?.refRTId === 2
                        ? "Scan Center Technician"
                        : user?.refRTId === 3
                        ? "Scan Center Manager"
                        : user?.refRTId === 4
                        ? "Patient"
                        : user?.refRTId === 5
                        ? "Scan Center Performing Provider"
                        : user?.refRTId === 6
                        ? "WellthGreen Radiologist"
                        : user?.refRTId === 7
                        ? "WellthGreen Scribe"
                        : user?.refRTId === 8
                        ? "Scan Center Co-Reporting Doctor"
                        : user?.refRTId === 9 ? "WellthGreen Manager" : 
                        user?.refRTId === 10 && "WellthGreen Performing Provider"}
                    </span>
                  </div>
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    setIsEditDialogOpen(true);
                    setIsDropDownOpen(false);
                  }}
                >
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    localStorage.clear();
                    navigate("/");
                    setRole(null);
                  }}
                  className="cursor-pointer text-red-500 focus:text-red-600"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent
              style={{
                background:
                  "radial-gradient(100.97% 186.01% at 50.94% 50%, #F9F4EC 25.14%, #EED8D6 100%)",
              }}
              className="h-11/12 w-[80vw] overflow-y-auto"
            >
              <DialogTitle>My Profile</DialogTitle>

              {renderProfileComponent()}
            </DialogContent>
          </Dialog>
        </header>

        {/* Content */}
        <main className="flex-1 h-[80vh] lg:h-[90vh] pb-[8vh] lg:pb-0 lg:mx-0 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MasterAdmin;
