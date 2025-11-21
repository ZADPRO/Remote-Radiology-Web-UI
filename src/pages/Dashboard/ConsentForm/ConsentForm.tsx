import { DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useAuth } from "@/pages/Routes/AuthContext";
import React, { useEffect, useState } from "react";
import logoNew from "../../../assets/LogoNew.png";
import SCConsentForm from "./SCConsentForm";
import WGConsentForm from "./WGConsentForm";
import { dynamicConsents } from "@/services/dynamicForms";
import LoadingOverlay from "@/components/ui/CustomComponents/loadingOverlay";
import { Button } from "@/components/ui/button";
import { Checkbox2 } from "@/components/ui/CustomComponents/checkbox2";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";

interface Props {
  onSubmit?: (updatedState?: string) => void;
  scId?: number;
  viewStatus?: boolean;
}

const ConsentForm: React.FC<Props> = ({
  onSubmit,
  scId,
  viewStatus = false,
}) => {
  const [defaultCheck, setDefaultCheck] = useState(false);

  const [patientConsent, setPatientConsent] = useState("");

  const [scPatientConsent, setScPatientConsent] = useState("");

  const [isRoleChecked, setRoleChecked] = useState(false);

  const { user, role } = useAuth();

  const [loading, setLoading] = useState(false);

  const signatureRow = `<br/><h6 class=\"ql-align-right\"><strong>Electronically signed by</strong></h6><h6 class=\"ql-align-right\"><strong>${
    user?.refUserFirstName
  },</strong></h6><h6 class=\"ql-align-right\"><strong><em>${format(
    new Date(),
    "dd/MM/yyyy"
  )}</em></strong></h6>`;

  const listConsent = async () => {
    setLoading(true);
    try {
      const res = await dynamicConsents.listConsent(
        parseInt(String(scId ?? user?.refSCId ?? 0))
      );
      console.log(res);

      if (res.status) {
        setPatientConsent(res.WGPatientBrochure);
        setScPatientConsent(res.SCPatientBrochure);
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
      const res = await dynamicConsents.updateConsent(
        user?.refSCId == 0 ? patientConsent : scPatientConsent,
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
          <h2 className="text-2xl font-semibold">User Consent Form</h2>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            Wellthgreen Report Portal Platform
          </p>
        </div>

        {/* Spacer to balance logo width */}
        <div className="hidden lg:inline h-12 w-24 sm:h-14 sm:w-28 flex-shrink-0" />
      </DialogHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit?.(
            defaultCheck
              ? isRoleChecked
                ? patientConsent + signatureRow
                : patientConsent
              : isRoleChecked
              ? scPatientConsent + signatureRow
              : scPatientConsent
          );
        }}
      >
        <div className="w-11/12 mx-auto">
          {(role?.type === "manager" || role?.type == "admin") &&
          !viewStatus ? (
            <WGConsentForm
              patientConsent={patientConsent}
              setPatientConsent={setPatientConsent}
              onSubmit={updateConsent}
            />
          ) : role?.type === "scadmin" && !viewStatus ? (
            <SCConsentForm
              defaultCheck={defaultCheck}
              setDefaultCheck={setDefaultCheck}
              patientConsent={patientConsent}
              scPatientConsent={scPatientConsent}
              setScPatientConsent={setScPatientConsent}
              onSubmit={updateConsent}
            />
          ) : (
            <div className="flex flex-col gap-2 w-full">
              <div
                className="ql-editor border-2 border-gray-300 rounded-2xl shadow-2xl p-10"
                dangerouslySetInnerHTML={{
                  __html: defaultCheck
                    ? isRoleChecked
                      ? patientConsent + signatureRow
                      : patientConsent
                    : isRoleChecked
                    ? scPatientConsent + signatureRow
                    : scPatientConsent,
                }}
              />
              {onSubmit && (
                <>
                  {role?.id === 4 && (
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
                        By checking this box, I acknowledge that I have read and
                        agree to the consent for receiving my medical imaging
                        results via this platform.
                      </Label>
                    </div>
                  )}

                  <Button
                    variant="greenTheme"
                    type="submit"
                    className="self-end"
                    disabled={!viewStatus && !isRoleChecked}
                    // onClick={() =>

                    // }
                  >
                    Submit
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </form>
    </DialogContent>
  );
};

export default ConsentForm;
