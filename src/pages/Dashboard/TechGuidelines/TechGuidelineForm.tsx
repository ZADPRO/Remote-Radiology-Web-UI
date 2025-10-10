import { DialogContent, DialogHeader } from "@/components/ui/dialog";
import React, { useEffect, useState } from "react";
import logoNew from "../../../assets/LogoNew.png";
import { useAuth } from "@/pages/Routes/AuthContext";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox2 } from "@/components/ui/CustomComponents/checkbox2";
import { format } from "date-fns";
import SCTechGuidelines from "./SCTechGuidelines";
import LoadingOverlay from "@/components/ui/CustomComponents/loadingOverlay";
import WGTechGuidelines from "./WGTechGuidelines";
import { dynamicTechGuidelines } from "@/services/dynamicForms";

interface Props {
  onSubmit?: (updatedState?: Record<string, any>) => void;
  scId?: number;
}

const TechGuidelineForm: React.FC<Props> = ({ onSubmit, scId }) => {
  const [defaultCheck, setDefaultCheck] = useState(false);

  const [techGuidelines, setTechGuidelines] = useState("");

  const [scTechGuidelines, setScTechGuidelines] = useState("");

  const [isRoleChecked, setRoleChecked] = useState(false);

  const { user, role } = useAuth();

  const [loading, setLoading] = useState(false);

  const signatureRow = `
                      <h6 class=\"ql-align-right\"><strong>Electronically signed by</strong></h6><h6 class=\"ql-align-right\"><strong>${
                        user?.refUserFirstName
                      },</strong></h6><h6 class=\"ql-align-right\"><strong><em>${format(
    new Date(),
    "dd/MM/yyyy"
  )}</em></strong></h6>
                        `;

  const addSignature = (val: boolean) => {
    setRoleChecked(val);

    setTechGuidelines((prev) => {
      if (val) {
        console.log(prev.includes(signatureRow));
        // Add signatureRow if not already present
        return prev.includes(signatureRow) ? prev : prev + signatureRow;
      } else {
        // Remove signatureRow if present
        return prev.replace(signatureRow, "");
      }
    });
  };

  const updateTechGuidelines = async () => {
    setLoading(true);
    try {
      const res = await dynamicTechGuidelines.updateTechGuidelines(
        user?.refSCId == 0 ? techGuidelines : scTechGuidelines,
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

  const listConsent = async () => {
    setLoading(true);
    try {
      const res = await dynamicTechGuidelines.listTechGuidelines(
        scId ?? user?.refSCId ?? 0
      );
      console.log(res);

      if (res.status) {
        setTechGuidelines(res.WGPatientBrochure);
        setScTechGuidelines(res.SCPatientBrochure);
        setDefaultCheck(res.SCBrochureAccessStatus);
      }
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
      className="w-[100vw] h-[90vh] lg:w-[70vw] overflow-y-auto p-0 flex flex-col"
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
          <h2 className="text-2xl font-semibold">QT Technologist Guidelines</h2>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            Wellthgreen Report Portal Platform
          </p>
        </div>

        {/* Spacer to balance logo width */}
        <div className="hidden lg:inline h-12 w-24 sm:h-14 sm:w-28 flex-shrink-0" />
      </DialogHeader>
      <div className="w-11/12 mx-auto">
        {role?.type === "manager" || role?.type == "admin" ? (
          <WGTechGuidelines
            techGuidelines={techGuidelines}
            setTechGuidelines={setTechGuidelines}
            onSubmit={updateTechGuidelines}
          />
        ) : role?.type === "scadmin" ? (
          <SCTechGuidelines
            defaultCheck={defaultCheck}
            setDefaultCheck={setDefaultCheck}
            techGuidelines={techGuidelines}
            scTechGuidelines={scTechGuidelines}
            setScTechGuidelines={setScTechGuidelines}
            onSubmit={updateTechGuidelines}
          />
        ) : (
          <div className="flex flex-col gap-2 w-full">
            <div
              className="ql-editor border-2 border-gray-300 rounded-2xl shadow-2xl p-10"
              dangerouslySetInnerHTML={{
                __html: defaultCheck ? techGuidelines : scTechGuidelines,
              }}
            />
            {onSubmit && (
              <>
                <div className="flex items-center space-x-2 mt-4">
                  <Checkbox2
                    className="bg-white"
                    checked={isRoleChecked}
                    id="role-consent"
                    onCheckedChange={(val) => addSignature(!!val)}
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

                <Button
                  variant="greenTheme"
                  className="self-end"
                  disabled={!isRoleChecked}
                  onClick={() =>
                    onSubmit({
                      consent: defaultCheck ? techGuidelines : scTechGuidelines,
                    })
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

export default TechGuidelineForm;
