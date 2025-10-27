import {
  Mail,
  Phone,
  FileText,
  BookOpen,
  FileSignature,
  FileImage,
  ReceiptText,
  User,
  UserCog,
  Stethoscope,
  ScrollText,
  TextCursorInput,
} from "lucide-react";
import React, { JSX, useEffect, useState } from "react";
import { useAuth, UserProfile } from "../Routes/AuthContext";
import { dashboardService } from "@/services/dashboardService";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import logoNew from "../../assets/LogoNew.png";
import UserConsent from "../Consent/UserConsent";
import RadiologyTrainingMaterial from "./RadiologyTrainingMaterial";
import InvoicePopUp from "./InvoicePopUp";
import LoadingOverlay from "@/components/ui/CustomComponents/loadingOverlay";
import PatientInformation from "./PatientBrouchure/PatientInformation";
import ConsentForm from "./ConsentForm/ConsentForm";
import TechGuidelineForm from "./TechGuidelines/TechGuidelineForm";
import TechConsentForm from "./TechConsent/TechConsentForm";
import ImpressionandRecommendationEdit from "./ImpressionRecommendationEdit/ImpressionandRecommendationEdit";

const Dashboard: React.FC = () => {
  const [userData, setUserData] = useState<UserProfile>();
  const [loading, setLoading] = useState(false);

  const { role } = useAuth();

  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<
    {
      label: string;
      icon: JSX.Element;
      dialogContent: JSX.Element;
      allowesUser: string[];
    }[]
  >([]);
  const [activeDialogContent, setActiveDialogContent] =
    useState<JSX.Element | null>(null);

  /** Fetch user profile */
  const fetchDashboardInfo = async () => {
    setLoading(true);
    try {
      const res = await dashboardService.dashboardInfo();
      if (res.status) {
        console.log(res.data);
        setUserData(res.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardInfo();
  }, []);

  /** Role to resources mapping */
  const roleOptions = [
    {
      role: "Patient",
      icon: <User className="w-12 h-12 text-[#4e5b4d]" />,
      options: [
        {
          label: "Patient Brochure",
          icon: <FileText className="w-6 h-6" />,
          dialogContent: <PatientInformation />,
          allowesUser: [
            "admin",
            "technician",
            "scadmin",
            "patient",
            "radiologist",
            "scribe",
            "codoctor",
            "manager",
            "doctor",
            "wgdoctor",
          ],
        },
        // {
        //   label: "Brochure",
        //   icon: <FileText className="w-6 h-6" />,
        //   dialogContent: <Brochure />,
        //   allowesUser: [
        //     "admin",
        //     "technician",
        //     "scadmin",
        //     "patient",
        //     "radiologist",
        //     "scribe",
        //     "codoctor",
        //     "manager",
        //     "wgdoctor"
        //   ],
        // },
        // {
        //   label: "Disclaimer",
        //   icon: <Info className="w-6 h-6" />,
        //   dialogContent: <Disclaimer />,
        //   allowesUser: [
        //     "admin",
        //     "technician",
        //     "scadmin",
        //     "patient",
        //     "radiologist",
        //     "scribe",
        //     "codoctor",
        //     "manager",
        //     "wgdoctor"
        //   ],
        // },
        // {
        //   label: "General Guidelines",
        //   icon: <ClipboardList className="w-6 h-6" />,
        //   dialogContent: <GeneralGuidelines />,
        //   allowesUser: [
        //     "admin",
        //     "technician",
        //     "scadmin",
        //     "patient",
        //     "radiologist",
        //     "scribe",
        //     "codoctor",
        //     "manager",
        //     "wgdoctor"
        //   ],
        // },
        {
          label: "Consent Form",
          icon: <FileSignature className="w-6 h-6" />,
          dialogContent: <ConsentForm />,
          allowesUser: [
            "admin",
            "technician",
            "scadmin",
            "patient",
            "scribe",
            "codoctor",
            "doctor",
            "manager",
            "wgdoctor",
          ],
        },
      ],
      allowesUser: [
        "admin",
        "technician",
        "scadmin",
        "patient",
        "radiologist",
        "scribe",
        "codoctor",
        "doctor",
        "manager",
        "wgdoctor",
      ],
    },
    {
      role: "Technician",
      icon: <UserCog className="w-12 h-12 text-[#4e5b4d]" />,
      options: [
        {
          label: "Tech Guidelines",
          icon: <BookOpen className="w-6 h-6" />,
          dialogContent: <TechGuidelineForm />,
          allowesUser: [
            "admin",
            "technician",
            "scadmin",
            "radiologist",
            "scribe",
            "codoctor",
            "doctor",
            "manager",
            "wgdoctor",
          ],
        },
        {
          label: "Consent Form",
          icon: <FileSignature className="w-6 h-6" />,
          dialogContent: <TechConsentForm />,
          allowesUser: [
            "admin",
            "technician",
            "scadmin",
            "scribe",
            "codoctor",
            "doctor",
            "manager",
            "wgdoctor",
          ],
        },
      ],
      allowesUser: [
        "admin",
        "technician",
        "scadmin",
        "radiologist",
        "scribe",
        "doctor",
        "codoctor",
        "manager",
        "wgdoctor",
      ],
    },
    {
      role: "Radiologist",
      icon: <Stethoscope className="w-12 h-12 text-[#4e5b4d]" />,
      options: [
        {
          label: "Consent Form",
          icon: <FileSignature className="w-6 h-6" />,
          dialogContent: (
            <DialogContent
              style={{
                background:
                  "radial-gradient(100.97% 186.01% at 50.94% 50%, #F9F4EC 25.14%, #EED8D6 100%)",
              }}
              className="h-11/12 w-[90vw] lg:w-[70vw] overflow-y-auto p-0"
            >
              <DialogHeader className="bg-[#eac9c5] border-1 border-b-gray-400 flex flex-col lg:flex-row items-center justify-between px-4 py-2">
                <div className="h-12 w-24 sm:h-14 sm:w-28 flex-shrink-0">
                  <img
                    src={logoNew}
                    alt="logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1 text-center">
                  <h2 className="text-2xl font-semibold">
                    Radiologist Consent Form
                  </h2>
                  <p className="text-sm text-gray-600 max-w-md mx-auto">
                    Wellthgreen Report Portal Platform
                  </p>
                </div>
                <div className="hidden lg:inline h-12 w-24 sm:h-14 sm:w-28 flex-shrink-0" />
              </DialogHeader>
              <UserConsent viewOnly staticType={"radiologist"} />
            </DialogContent>
          ),
          allowesUser: ["admin", "radiologist", "manager", "wgdoctor"],
        },
        {
          label: "Radiology Training Materials",
          icon: <FileImage className="w-6 h-6" />,
          dialogContent: <RadiologyTrainingMaterial />,
          allowesUser: ["admin", "radiologist", "manager", "wgdoctor"],
        },
      ],
      allowesUser: ["admin", "radiologist", "manager", "wgdoctor"],
    },
    {
      role: "Invoice",
      icon: <ScrollText className="w-12 h-12 text-[#4e5b4d]" />,
      options: [
        {
          label: "Invoices",
          icon: <ReceiptText className="w-6 h-6" />,
          dialogContent: <InvoicePopUp />,
          allowesUser: [
            "admin",
            "radiologist",
            "scribe",
            "wgdoctor",
            "scadmin",
            "manager",
          ],
        },
      ],
      allowesUser: [
        "admin",
        "radiologist",
        "scribe",
        "wgdoctor",
        "scadmin",
        "manager",
      ],
    },
    {
      role: "Sentence Edit",
      icon: <TextCursorInput className="w-12 h-12 text-[#4e5b4d]" />,
      options: [
        {
          label: "Impression and Recommendation",
          icon: <BookOpen className="w-6 h-6" />,
          dialogContent: <ImpressionandRecommendationEdit />,
          allowesUser: ["admin"],
        },
      ],
      allowesUser: ["admin"],
    },
  ];

  return (
    <div className="flex flex-col px-10 pt-10 gap-5">
      {loading && <LoadingOverlay />}

      <div className="flex flex-col lg:flex-row justify-between gap-4 w-full">
        {/* Left Profile Section */}
        <div className="w-full lg:w-2/5 rounded-lg text-sm">
          <div className="relative h-[20vh] bg-[#F9F4EF] rounded-lg px-4 flex justify-between items-center shadow-sm">
            <div className="flex flex-col justify-center w-full">
              <p className="text-xl lg:text-3xl font-medium">
                Welcome{" "}
                <span className="text-[#a3b1a0] font-semibold">
                  {userData?.refUserFirstName}
                </span>
                ,
              </p>
              <p className="text-gray-600 mt-1 text-lg lg:text-xl">
                Have a nice day at work
              </p>
            </div>
          </div>

          <div className="w-full mt-4 bg-[#F9F4EF] rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              {userData?.profileImgFile?.base64Data ? (
                <img
                  src={`data:${userData.profileImgFile.contentType};base64,${userData.profileImgFile.base64Data}`}
                  alt="Profile"
                  className="bg-[#a3b1a0] w-24 h-24 rounded-md object-cover border-4 border-[#A3B1A1] shadow"
                />
              ) : (
                <div className="bg-[#a3b1a0] w-24 h-24 rounded-md flex items-center justify-center text-white text-sm font-medium border-4 border-[#A3B1A1] shadow">
                  No Image
                </div>
              )}
              <div>
                <p className="text-lg font-semibold">
                  {userData?.refUserFirstName}
                </p>
                <p className="text-gray-600">{userData?.refUserCustId}</p>
              </div>
            </div>

            <div className="space-y-2 divide-y divide-dashed divide-gray-300">
              <div className="flex justify-between items-center pt-2">
                <span className="text-gray-500 flex items-center gap-1">
                  <Mail className="w-4 h-4" /> E-Mail
                </span>
                <span className="text-black">{userData?.refCODOEmail}</span>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-gray-500 flex items-center gap-1">
                  <Phone className="w-4 h-4" /> Contact
                </span>
                <span className="text-black">{userData?.refCODOPhoneNo1}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Role Selection Section */}
        <div className="w-full lg:w-3/5 grid grid-cols-2 md:grid-cols-2 gap-4 pb-10 h-[80vh] px-5 overflow-auto">
          {roleOptions.map((item, idx) => (
            <>
              {item.allowesUser.includes(role?.type || "") && (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedOptions(item.options);
                    setRoleDialogOpen(true);
                  }}
                  className="bg-[#f9f4ec] shadow-sm rounded-md flex flex-col items-center justify-center p-4 h-46 hover:shadow-md transition border-b-4 border-[#A4B2A1] cursor-pointer"
                >
                  {item.icon}
                  <p className="text-center mt-2 text-sm font-medium">
                    {item.role}
                  </p>
                </div>
              )}
            </>
          ))}
        </div>
      </div>

      {/* Role Options Dialog */}
      <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <DialogContent className="max-w-[90vw] md:max-w-[500px]">
          <p className="text-lg font-semibold mb-4">Available Resources</p>
          <div className="flex flex-col gap-2">
            {selectedOptions.map((opt, i) => (
              <>
                {opt.allowesUser.includes(role?.type || "") && (
                  <button
                    key={i}
                    onClick={() => {
                      setRoleDialogOpen(false);
                      setActiveDialogContent(opt.dialogContent);
                    }}
                    className="flex items-center gap-3 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 text-left"
                  >
                    {opt.icon}
                    <span className="font-medium">{opt.label}</span>
                  </button>
                )}
              </>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Active Resource Dialog */}
      <Dialog
        open={!!activeDialogContent}
        onOpenChange={() => setActiveDialogContent(null)}
      >
        {activeDialogContent}
      </Dialog>
    </div>
  );
};

export default Dashboard;
