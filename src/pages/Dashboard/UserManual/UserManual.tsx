import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/pages/Routes/AuthContext";
import React from "react";
import WELLGREENPERFORMINPROVIDERUSERMANUAL from "../../../assets/UserManual/WELLGREEN PERFORMIN PROVIDER USER MANUAL.pdf";
import TECHNICIANUSERMANUAL from "../../../assets/UserManual/TECHNICIAN USER MANUAL.pdf";
import WELLGREENMANAGERUSERMANUAL from "../../../assets/UserManual/WELLGREEN MANAGER USER MANUAL.pdf";
import SCANCENTREADMINUSERMANUAL from "../../../assets/UserManual/SCAN CENTRE ADMIN USER MANUAL.pdf";
import SCRIBEUSERMANUAL from "../../../assets/UserManual/SCRIBE LOGIN USER MANUAL.pdf";
import RADIOLOGYUSERMANUAL from "../../../assets/UserManual/RADIOLOGY LOGIN USER MANUAL.pdf";
import CENTREREVIEWERUSERMANUAL from "../../../assets/UserManual/CENTRE REVIEWER USER MANUAL.pdf";
import SCANCENTREPERFORMINGPROVIDERUSERMANUAL from "../../../assets/UserManual/SCAN CENTRE PERFORMING PROVIDER USER MANUAL.pdf";
import ADMINUSERMANUAL from "../../../assets/UserManual/ADMIN LOGIN USER MANUAL.pdf";

const UserManual: React.FC = () => {
  const { role } = useAuth();

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

  return (
    <DialogContent className="max-[90%] h-[90vh]">
      {/* Header */}
      <DialogHeader className="flex flex-row items-center justify-between border-b pb-2">
        <DialogTitle className="text-lg font-semibold">User Manual</DialogTitle>
      </DialogHeader>

      {/* Notification List */}
      <div className="space-y-2 h-[73vh] overflow-y-auto">
        <iframe
          src={ViewFile() || ""}
          title="Report Preview"
          className="w-full h-[73vh] border rounded-md"
        />
      </div>
    </DialogContent>
  );
};

export default UserManual;
