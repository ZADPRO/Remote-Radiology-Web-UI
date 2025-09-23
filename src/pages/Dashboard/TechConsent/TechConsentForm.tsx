import { DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useAuth } from "@/pages/Routes/AuthContext";
import React, { useEffect, useState } from "react";
import logoNew from "../../../assets/LogoNew.png";
import SCTechConsentForm from "./SCTechConsentForm";
import WGTechConsentForm from "./WGTechConsentForm";
import { dynamicTechConsent } from "@/services/dynamicForms";
import LoadingOverlay from "@/components/ui/CustomComponents/loadingOverlay";
import { Button } from "@/components/ui/button";
import { Checkbox2 } from "@/components/ui/CustomComponents/checkbox2";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";

interface Props {
onSubmit?: (updatedState?: string) => void;
  scId?: number;
  setDialogOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const TechConsentForm: React.FC<Props> = ({ onSubmit, scId, setDialogOpen }) => {
  const [defaultCheck, setDefaultCheck] = useState(false);

  const [techConsent, setTechConsent] = useState("");

  const [scTechConsent, setScTechConsent] = useState("");

  const [isRoleChecked, setRoleChecked] = useState(false);

  const { user, role } = useAuth();

  const [loading, setLoading] = useState(false);

  const signatureRow = `<br/><h6 class=\"ql-align-right\"><strong>Electronically signed</strong></h6><h6 class=\"ql-align-right\"></h6><h6 class=\"ql-align-right\"><strong><em>${format(new Date(),"dd/MM/yyyy")}</em></strong></h6>`;

  const listConsent = async () => {
    setLoading(true);
    try {
      const res = await dynamicTechConsent.listTechConsent(scId ?? user?.refSCId ?? 0);
      console.log(res);

      if (res.status) {
        setTechConsent(res.WGPatientBrochure);
        setScTechConsent(res.SCPatientBrochure);
        setDefaultCheck(res.SCBrochureAccessStatus);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const updateConsent = async () => {
    setLoading(true);
    try {
      const res = await dynamicTechConsent.updateTechConsent(
        user?.refSCId == 0 ? techConsent : scTechConsent,
        user?.refSCId ?? 0,
        defaultCheck
      );
      console.log(res);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    listConsent();
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
          <h2 className="text-2xl font-semibold">Technician Consent Form</h2>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            EaseQT Platform
          </p>
        </div>

        {/* Spacer to balance logo width */}
        <div className="hidden lg:inline h-12 w-24 sm:h-14 sm:w-28 flex-shrink-0" />
      </DialogHeader>

      <div className="w-11/12 mx-auto">
        {role?.type === "manager" || role?.type == "admin" ? (
          <WGTechConsentForm
            techConsent={techConsent}
            setTechConsent={setTechConsent}
            onSubmit={updateConsent}
          />
        ) : role?.type === "scadmin" ? (
          <SCTechConsentForm
            defaultCheck={defaultCheck}
            setDefaultCheck={setDefaultCheck}
            techConsent={techConsent}
            scTechConsent={scTechConsent}
            setScTechConsent={setScTechConsent}
            onSubmit={updateConsent}
          />
        ) : (
          <div className="flex flex-col gap-2 w-full">
            <div
              className="ql-editor border-2 border-gray-300 rounded-2xl shadow-2xl p-10"
              dangerouslySetInnerHTML={{
                __html: defaultCheck
  ? (isRoleChecked ? techConsent + signatureRow : techConsent)
  : (isRoleChecked ? scTechConsent + signatureRow : scTechConsent),
              }}
            />
            {onSubmit && (
              <>
              <div className="flex items-center space-x-2 mt-4">
                <Checkbox2
                  className="bg-white"
                  checked={isRoleChecked}
                  id="role-consent"
                  onCheckedChange={(val) => setRoleChecked(!!val)}
                  required
                />
                <Label
                  htmlFor="role-consent"
                  className="text-sm cursor-pointer"
                >
                  By checking this box, I acknowledge that I have read and agree
                  to the consent for receiving my medical imaging results via
                  this platform.
                </Label>
              </div>

              <Button
                variant="greenTheme"
                className="self-end"
                disabled={!isRoleChecked}
                onClick={() =>{
    onSubmit?.(defaultCheck
  ? (isRoleChecked ? techConsent + signatureRow : techConsent)
  : (isRoleChecked ? scTechConsent + signatureRow : scTechConsent));
    setDialogOpen?.(false);
    }
  }
              >
                Submit
              </Button>
              </>
            )}
          </div>
        )}
      </div>
    </DialogContent>
  );
};

export default TechConsentForm;
