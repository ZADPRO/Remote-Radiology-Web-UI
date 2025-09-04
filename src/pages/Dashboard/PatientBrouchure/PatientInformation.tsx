import { DialogContent, DialogHeader } from "@/components/ui/dialog";
import React, { useEffect, useState } from "react";
import logoNew from "../../../assets/LogoNew.png";
import WGPatientInfo from "./WGPatientInfo";
import { useAuth } from "@/pages/Routes/AuthContext";
import SCPatientInfo from "./SCPatientInfo";
import { dynamicBrochure } from "@/services/dynamicForms";
import LoadingOverlay from "@/components/ui/CustomComponents/loadingOverlay";
import { Button } from "@/components/ui/button";

interface Props {
  onNext?: () => void;
  scId?: number;
}

const PatientInformation: React.FC<Props> = ({ onNext, scId }) => {
  const { user, role } = useAuth();
  const [defaultInfo, setDefaultInfo] = useState(false);

  const [patientInfo, setPatientInfo] = useState("");

  const [scPatientInfo, setScPatientInfo] = useState("");

  const [loading, setLoading] = useState(false);

  const listBrochure = async () => {
    setLoading(true);
    try {
      const res = await dynamicBrochure.listBrochure(
        scId ?? user?.refSCId ?? 0
      );
      console.log(res);

      if (res.status) {
        setPatientInfo(res.WGPatientBrochure);
        setScPatientInfo(res.SCPatientBrochure);
        setDefaultInfo(res.SCBrochureAccessStatus);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const updateBrochure = async () => {
    setLoading(true);
    try {
      const res = await dynamicBrochure.updateBrochure(
        user?.refSCId == 0 ? patientInfo : scPatientInfo,
        user?.refSCId ?? 0,
        defaultInfo
      );
      console.log(res);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    listBrochure();
  }, []);

  return (
    <DialogContent
      style={{
        background:
          "radial-gradient(100.97% 186.01% at 50.94% 50%, #F9F4EC 25.14%, #EED8D6 100%)",
      }}
      className="h-11/12 w-[90vw] lg:w-[70vw] overflow-y-auto p-0 flex flex-col"
    >
      {loading && <LoadingOverlay />}
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
          <h2 className="text-2xl font-semibold">Brochure</h2>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            EaseQT Platform
          </p>
        </div>

        {/* Spacer to balance logo width */}
        <div className="hidden lg:inline h-12 w-24 sm:h-14 sm:w-28 flex-shrink-0" />
      </DialogHeader>

      <div className="w-11/12 mx-auto">
        {role?.type === "manager" || role?.type == "admin" ? (
          <WGPatientInfo
            patientInfo={patientInfo}
            setPatientInfo={setPatientInfo}
            onSubmit={updateBrochure}
          />
        ) : role?.type === "scadmin" ? (
          <SCPatientInfo
            defaultInfo={defaultInfo}
            setDefaultInfo={setDefaultInfo}
            patientInfo={patientInfo}
            scPatientInfo={scPatientInfo}
            setScPatientInfo={setScPatientInfo}
            onSubmit={updateBrochure}
          />
        ) : (
          <div className="flex flex-col gap-2 w-full pb-5">
            <div
              className="ql-editor border-2  border-gray-300 rounded-2xl shadow-2xl p-5"
              dangerouslySetInnerHTML={{
                __html: defaultInfo ? patientInfo : scPatientInfo,
              }}
            />
            {onNext && (
              <Button
                variant="greenTheme"
                className="self-end"
                onClick={onNext}
              >
                Next
              </Button>
            )}
          </div>
        )}
      </div>

      {/* <Brochure />
      <h2 className="text-2xl text-center my-3 font-semibold">
        General Guidelines
      </h2>
      <GeneralGuidelines />
      <h2 className="text-2xl text-center my-3 font-semibold">Disclaimer</h2>
      <Disclaimer /> */}
    </DialogContent>
  );
};

export default PatientInformation;
