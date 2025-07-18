import {
  Mail,
  Phone,
  FileText,
  Info,
  BookOpen,
  ClipboardList,
  FileSignature,
  FileImage,
  ReceiptText,
} from "lucide-react";
import React, { JSX, useEffect, useState } from "react";
import { UserProfile } from "../Routes/AuthContext";
import { dashboardService } from "@/services/dashboardService";
import TechGuidelines from "../Consent/TechGuidelines";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import logoNew from "../../assets/LogoNew.png";
import UserConsent from "../Consent/UserConsent";
import Brochure from "./Brochure";
import Disclaimer from "./Disclaimer";
import GeneralGuidelines from "./GeneralGuidelines";
import RadiologyTrainingMaterial from "./RadiologyTrainingMaterial";
import InvoicePopUp from "./InvoicePopUp";
import LoadingOverlay from "@/components/ui/CustomComponents/loadingOverlay";

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<UserProfile>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeDialogContent, setActiveDialogContent] =
    useState<JSX.Element | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  const cards = [
    {
      label: "Brochure",
      icon: <FileText className="w-10 h-10" />,
      dialogContent: <Brochure />,
    },
    {
      label: "Disclaimer",
      icon: <Info className="w-10 h-10" />,
      dialogContent: <Disclaimer />,
    },
    {
      label: "Tech Guidelines",
      icon: <BookOpen className="w-10 h-10" />,
      dialogContent: <TechGuidelines />,
    },
    {
      label: "General Guidelines",
      icon: <ClipboardList className="w-10 h-10" />,
      dialogContent: <GeneralGuidelines />,
    },
    {
      label: "Consent Form",
      icon: <FileSignature className="w-10 h-10" />,
      dialogContent: (
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

          <UserConsent viewOnly />
        </DialogContent>
      ),
    },
    {
      label: "Radiology training Material",
      icon: <FileImage className="w-10 h-10" />,
      dialogContent: <RadiologyTrainingMaterial />,
      allowedRoles: [1, 6],
    },
    {
      label: "Invoices",
      icon: <ReceiptText className="w-10 h-10" />,
      dialogContent: <InvoicePopUp />,
      allowedRoles: [1, 6, 7, 9, 3],
    },
  ];

  const fetchDashboardInfo = async () => {
    setLoading(true);
    try {
      const res = await dashboardService.dashboardInfo();
      console.log(res);
      if (res.status) {
        setUser(res.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardInfo();
  }, []);

  return (
    <div className="flex flex-col px-10 pt-10 gap-5">
      {loading && <LoadingOverlay />}
      <div className="flex flex-col lg:flex-row items-start justify-between gap-4 w-full">
        {/* Left Section */}
        <div className="w-full lg:w-2/5 rounded-lg text-sm font-sans">
          <div className="relative h-[20vh] lg:w-full w-full bg-[#F9F4EF] rounded-lg px-4 shadow-sm flex justify-between items-center overflow-visible">
            {/* Left: Welcome Text */}
            <div className="flex flex-col justify-center w-full">
              <p className="text-xl lg:text-3xl font-medium">
                Welcome{" "}
                <span className="text-[#a3b1a0] font-semibold">
                  {user?.refUserFirstName}
                </span>
                ,
              </p>
              <p className="text-gray-600 mt-1 text-lg lg:text-xl">
                Have a nice day at work
              </p>
            </div>

            {/* Right: Image popping out of top */}
            {/* <div className="w-full relative self-end lg:w-1/3 lg:h-auto">
    <img
      src="/src/assets/DoctorInPhone.png" // replace this
      alt="Person Illustration"
      className="absolute bottom-0 left-1/2 transform -translate-x-1/2  object-contain h-[10rem]"
    />
  </div> */}
          </div>
          <div className="w-full mt-4 lg:w-full bg-[#F9F4EF] rounded-lg p-4 shadow-sm text-sm font-sans">
            {/* Top Section */}
            <div className="flex items-center gap-4 mb-4">
              {/* <div className="bg-[#a3b1a0] w-24 h-24 rounded-md" /> */}
              {user?.profileImgFile?.base64Data ? (
                <img
                  id="profile-img"
                  src={`data:${user.profileImgFile.contentType};base64,${user.profileImgFile.base64Data}`}
                  alt="Preview"
                  className="bg-[#a3b1a0] w-24 h-24 rounded-md object-cover border-4 border-[#A3B1A1] shadow"
                />
              ) : (
                <div className="bg-[#a3b1a0] w-24 h-24 rounded-md flex items-center justify-center text-white text-sm font-medium border-4 border-[#A3B1A1] shadow">
                  No Image
                </div>
              )}
              <div>
                <p className="text-lg font-semibold">
                  {user?.refUserFirstName}
                </p>
                <p className="text-gray-600">{user?.refUserCustId}</p>
              </div>
            </div>

            {/* Info Section */}
            <div className="space-y-2 divide-y divide-dashed divide-gray-300">
              <div className="flex justify-between items-center pt-2">
                <span className="text-gray-500 flex items-center gap-1">
                  <Mail className="w-4 h-4" /> E-Mail
                </span>
                <span className="text-black">{user?.refCODOEmail}</span>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-gray-500 flex items-center gap-1">
                  <Phone className="w-4 h-4" /> Contact
                </span>
                <span className="text-black">{user?.refCODOPhoneNo1}</span>
              </div>

              {/* <div className="flex justify-between items-center pt-2">
              <span className="text-gray-500 flex items-center gap-1">
                <MapPin className="w-4 h-4" /> Address
              </span>
              <span className="text-black text-right">
                3/9, Fairlands, Salem- 636130.
              </span>
            </div> */}
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-3/5 grid grid-cols-3 gap-4">
          {cards.map((card, index) => (
            <div
              key={index}
              onClick={() => {
                setActiveDialogContent(card.dialogContent);
                setDialogOpen(true);
              }}
              hidden={
                card.allowedRoles && // If there are role restrictions...
                (!user || !card.allowedRoles.includes(user.refRTId)) // ...hide if user isn't loaded OR user's role is not allowed.
              }
              className="bg-[#f9f4ec] shadow-sm rounded-md flex flex-col items-center justify-center p-4 h-38 hover:shadow-md transition border-b-4 border-b-[#A4B2A1] cursor-pointer"
            >
              {card.icon}
              <p className="text-lg text-center mt-2 font-medium">
                {card.label}
              </p>
            </div>
          ))}
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <div className="mt-4">{activeDialogContent}</div>
        </Dialog>
      </div>
    </div>
  );
};

export default Dashboard;
