import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import LoadingOverlay from "@/components/ui/CustomComponents/loadingOverlay";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ListSpecificManager, managerService } from "@/services/managerService";
import { Camera, CircleAlert, FileText } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useAuth } from "../Routes/AuthContext";

const WellthGreenAdminProfile: React.FC = () => {
    const { user } = useAuth();
        
        
          const managerId = user?.refUserId;
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ListSpecificManager | null>(null);

  const fetchManagerData = async () => {
    setLoading(true);
    setError(null);
    try {
        if(managerId) {
            const res = await managerService.listSpecificWellthGreenManager(managerId);
      if (res.data && res.data.length > 0) {
        setFormData(res.data[0]);
      } else {
        setError("Manager data not found.");
        setFormData(null);
      }
        }
      
    } catch (err) {
      console.error("Error fetching manager data:", err);
      setError("Failed to load manager data. Please try again.");
      setFormData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (managerId) {
      fetchManagerData();
    }
  }, [managerId]);

  const downloadFile = (base64Data: string, contentType: string, filename: string) => {
    try {
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: contentType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Download failed:", e);
      setError("Failed to download file.");
    }
  };

  if (loading) return <LoadingOverlay />;
  if (!formData) return <div className="p-4 text-center">{error || "Manager data could not be loaded."}</div>;

  return (
    <div className="w-full p-4">
      {/* Profile Image and Basic Info */}
      <div className="w-full flex flex-col lg:flex-row items-center justify-start p-2 gap-6 rounded-xl">
        <div className="relative w-32 h-32 lg:w-45 lg:h-45">
          {formData.refUserProfileImg && formData.profileImgFile ? (
            <img
              src={`data:${formData.profileImgFile.contentType};base64,${formData.profileImgFile.base64Data}`}
              alt="Manager Profile"
              className="w-full h-full rounded-full object-cover border-4 border-[#A3B1A1] shadow"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-full text-gray-500">
              <Camera className="w-16 h-16" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 w-full lg:w-1/3">
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm" htmlFor="managerIdDisplay">
              Manager ID
            </Label>
            <Input
              id="managerIdDisplay"
              value={formData.refUserCustId}
              readOnly
              className="bg-white"
            />
          </div>
          <div className="flex flex-col gap-1.5 w-full">
            <Label className="text-sm" htmlFor="status">
              Status
            </Label>
            <Select value={String(formData.refUserStatus === true)} disabled>
              <SelectTrigger id="status" className="bg-white w-full">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Personal Details */}
      <h1 className="text-2xl font-bold my-4">Personal Details</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-15 w-full">
        {/* Left Column */}
        <div className="flex flex-col gap-4 2xl:gap-6 w-full">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="firstname">Full Name</Label>
            <Input
              id="firstname"
              value={formData.refUserFirstName || ""}
              readOnly
              className="bg-white"
            />
          </div>

          <div className="flex flex-col">
            <Label className="text-sm" htmlFor="email">
              E-Mail
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.refCODOEmail || ""}
              readOnly
              className="bg-white"
            />
          </div>

          {/* Aadhar Card */}
          <div className="flex flex-col gap-1.5 w-full">
            <Label className="text-sm">Aadhar Card</Label>
            {formData.refMDAadhar && formData.aadharFile ? (
              <div
                className="mt-2 flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-all cursor-pointer"
                onClick={() =>
                  downloadFile(
                    formData.aadharFile!.base64Data,
                    formData.aadharFile!.contentType,
                    "Aadhar.pdf"
                  )
                }
              >
                <div className="bg-green-100 p-2 rounded-md">
                  <FileText className="w-5 h-5 text-green-600" />
                </div>
                <span className="truncate text-sm font-medium text-green-800">
                  Aadhar Document
                </span>
              </div>
            ) : (
              <div className="mt-1 text-sm text-gray-500">Not provided.</div>
            )}
          </div>

          {/* Driver's License */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm">Driver's License</Label>
            {formData.refMDDrivingLicense && formData.drivingLicenseFile ? (
              <div
                className="mt-2 flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-all cursor-pointer"
                onClick={() =>
                  downloadFile(
                    formData.drivingLicenseFile!.base64Data,
                    formData.drivingLicenseFile!.contentType,
                    "License.pdf"
                  )
                }
              >
                <div className="bg-green-100 p-2 rounded-md">
                  <FileText className="w-5 h-5 text-green-600" />
                </div>
                <span className="truncate text-sm font-medium text-green-800">
                  Driving License Document
                </span>
              </div>
            ) : (
              <div className="mt-1 text-sm text-gray-500">Not provided.</div>
            )}
          </div>
        </div>
        {/* Right Column */}
        <div className="flex flex-col gap-4 2xl:gap-6 w-full">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="phone">Contact Number</Label>
            <div className="flex gap-2 relative">
              <Select value={formData.refCODOPhoneNo1CountryCode || "+91"}>
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="+91">IN (+91)</SelectItem>
                </SelectContent>
              </Select>
              <Input
                id="phone"
                type="number"
                value={formData.refCODOPhoneNo1 || ""}
                readOnly
                className="bg-white flex-1"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="dob">Date Of Birth</Label>
            <Input
                        id="dob"
                        value={
                          formData.refUserDOB
                            ? new Date(formData.refUserDOB).toLocaleDateString()
                            : "N/A"
                        }
                        readOnly
                        className="bg-white"
                      />
          </div>

          {/* PAN Card */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm">PAN Card</Label>
            {formData.refMDPan && formData.panFile ? (
              <div
                className="mt-2 flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-all cursor-pointer"
                onClick={() =>
                  downloadFile(
                    formData.panFile!.base64Data,
                    formData.panFile!.contentType,
                    "PAN.pdf"
                  )
                }
              >
                <div className="bg-green-100 p-2 rounded-md">
                  <FileText className="w-5 h-5 text-green-600" />
                </div>
                <span className="truncate text-sm font-medium text-green-800">
                  PAN Document
                </span>
              </div>
            ) : (
              <div className="mt-1 text-sm text-gray-500">Not provided.</div>
            )}
          </div>
        </div>
      </div>

      {/* Professional Details - Education Certificates */}
      <h1 className="text-2xl font-bold my-4">Professional Details</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-15 w-full">
        <div className="flex flex-col gap-4 2xl:gap-6 w-full">
          <Label>Educational Certificates</Label>
          {formData.educationCertificateFiles && formData.educationCertificateFiles.length > 0 ? (
            <div className="mt-3 flex flex-col gap-3">
              {formData.educationCertificateFiles.map((cert, index) => (
                <div
                  key={cert.refECId || `existing-${index}`}
                  className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition-all group cursor-pointer"
                  onClick={() =>
                    downloadFile(
                      cert.educationCertificateFile.base64Data,
                      cert.educationCertificateFile.contentType,
                      cert.refECOldFileName || `Certificate-${index + 1}.pdf`
                    )
                  }
                >
                  <div className="flex items-center gap-3 w-full truncate">
                    <div className="bg-green-100 p-2 rounded-md">
                      <FileText className="w-5 h-5 text-green-600" />
                    </div>
                    <span
                      title={cert.refECOldFileName || `Certificate ${index + 1}`}
                      className="truncate font-semibold text-green-800"
                    >
                      {cert.refECOldFileName || `Certificate ${index + 1}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-1 text-sm text-gray-500">No certificates provided.</div>
          )}
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <CircleAlert className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* <div className="flex justify-center mt-6">
        <Button
          className="bg-[#A3B1A1] hover:bg-[#81927f] w-full lg:w-2/5"
          type="button"
          onClick={() => setIsProfileDialogOpen(false)}
        >
          Close
        </Button>
      </div> */}
    </div>
  );
};

export default WellthGreenAdminProfile;

