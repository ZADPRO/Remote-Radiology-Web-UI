import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAuth } from "@/pages/Routes/AuthContext";
import React, { useEffect, useState } from "react";
import WELLGREENPERFORMINPROVIDERUSERMANUAL from "../../../assets/UserManual/WELLGREEN PERFORMIN PROVIDER USER MANUAL.pdf";
import TECHNICIANUSERMANUAL from "../../../assets/UserManual/TECHNICIAN USER MANUAL.pdf";
import WELLGREENMANAGERUSERMANUAL from "../../../assets/UserManual/WELLGREEN MANAGER USER MANUAL.pdf";
import SCANCENTREADMINUSERMANUAL from "../../../assets/UserManual/SCAN CENTRE ADMIN USER MANUAL.pdf";
import SCRIBEUSERMANUAL from "../../../assets/UserManual/SCRIBE LOGIN USER MANUAL.pdf";
import RADIOLOGYUSERMANUAL from "../../../assets/UserManual/RADIOLOGY LOGIN USER MANUAL.pdf";
import CENTREREVIEWERUSERMANUAL from "../../../assets/UserManual/CENTRE REVIEWER USER MANUAL.pdf";
import SCANCENTREPERFORMINGPROVIDERUSERMANUAL from "../../../assets/UserManual/SCAN CENTRE PERFORMING PROVIDER USER MANUAL.pdf";
import ADMINUSERMANUAL from "../../../assets/UserManual/ADMIN LOGIN USER MANUAL.pdf";
import PDFPreviewer from "../PDFPreviewer";

interface UserManualProps {
  userManualOpen: boolean;
  setUserManualOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserManual: React.FC<UserManualProps> = (props) => {
  const { role } = useAuth();
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

  const ViewFile = () => {
    switch (role?.type) {
      case "admin":
        return ADMINUSERMANUAL;
      case "technician":
        return TECHNICIANUSERMANUAL;
      case "scadmin":
        return SCANCENTREADMINUSERMANUAL;
      case "patient":
        return null;
      case "doctor":
        return SCANCENTREPERFORMINGPROVIDERUSERMANUAL;
      case "radiologist":
        return RADIOLOGYUSERMANUAL;
      case "scribe":
        return SCRIBEUSERMANUAL;
      case "codoctor":
        return CENTREREVIEWERUSERMANUAL;
      case "manager":
        return WELLGREENMANAGERUSERMANUAL;
      case "wgdoctor":
        return WELLGREENPERFORMINPROVIDERUSERMANUAL;
      default:
        return null;
    }
  };

  // 🧠 Convert URL to Blob once role changes
  useEffect(() => {
    const loadBlob = async () => {
      const fileUrl = ViewFile();
      if (!fileUrl) return setPdfBlob(null);
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      setPdfBlob(blob);
    };
    loadBlob();
  }, [role]);

  return (
    <>
      <Dialog
        open={props.userManualOpen}
        onOpenChange={props.setUserManualOpen}
      >
        <DialogContent
          style={{
            background:
              "radial-gradient(100.97% 186.01% at 50.94% 50%, #F9F4EC 25.14%, #EED8D6 100%)",
          }}
          className="h-[90vh] w-[90%]"
        >
          <PDFPreviewer
            blob={pdfBlob || null}
            // name={pdfPreviewFile.name}
            // onClose={() => setShowPreview(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserManual;
