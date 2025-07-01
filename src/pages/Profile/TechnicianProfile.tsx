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
import {
  ListSpecificTechnician,
  technicianService,
} from "@/services/technicianServices";
import { Camera, FileText } from "lucide-react"; // Added ImageIcon
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../Routes/AuthContext";

const TechnicianProfile: React.FC = () => {

    const { user } = useAuth();
    
      const scanCenterId = user?.refSCId;
      const technicianId = user?.refUserId;
    
      // const scanCenterId = 5;
      // const technicianId = 52;
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [error]);

  const [formData, setFormData] = useState<ListSpecificTechnician | null>(
    null
  );

  const getSpecificTechnician = async () => {
    setLoading(true);
    setError(null);
    try {
      if(scanCenterId && technicianId) {
        const res = await technicianService.getSpecificTechnician(
        scanCenterId, // Pass scanCenterId if your service requires it
        technicianId
      );
      if (res.data && res.data.length > 0) {
        setFormData(res.data[0]);
      } else {
        setError("Technician data not found.");
        setFormData(null);
      }
      }
      
    } catch (err) {
      console.error("Error fetching technician data:", err);
      setError("Failed to fetch technician details.");
      setFormData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (technicianId && scanCenterId) {
      // Add scanCenterId to dependency array if it can change and trigger re-fetch
      getSpecificTechnician();
    }
  }, [technicianId, scanCenterId]);

  const downloadFile = (
    base64Data: string,
    contentType: string,
    filename: string
  ) => {
    try {
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length)
        .fill(0)
        .map((_, i) => byteCharacters.charCodeAt(i));
      const byteArray = new Uint8Array(byteNumbers);

      const blob = new Blob([byteArray], { type: contentType });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) {
      console.error("Error downloading file:", e);
      setError("Could not process file for download.");
    }
  };

  if (loading) return <LoadingOverlay />;
  if (error && !formData) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }
  if (!formData) return <div className="p-4">No technician data found.</div>;

  return (
    <div className="w-full p-4">
      {/* Profile Image and Basic Info */}
      <div className="w-full flex flex-col lg:flex-row items-center justify-start p-2 gap-6 rounded-xl mb-6">
        {formData.profileImgFile?.base64Data ? (
          <div className="relative w-32 h-32 lg:w-40 lg:h-40">
            <img
              src={`data:${formData.profileImgFile.contentType};base64,${formData.profileImgFile.base64Data}`}
              alt="Profile"
              className="w-full h-full rounded-full object-cover border-4 border-gray-300 shadow"
            />
          </div>
        ) : (
          <div className="relative w-32 h-32 lg:w-40 lg:h-40 flex items-center justify-center bg-gray-200 rounded-full text-gray-500 shadow-md">
            <Camera className="w-16 h-16" />
          </div>
        )}
        <div className="flex flex-col gap-4 w-full lg:w-1/3">
          <div>
            <Label htmlFor="technicianID">Technician ID</Label>
            <Input
              id="technicianID"
              value={formData.refUserCustId || "N/A"}
              readOnly
              className="bg-white"
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={String(formData.refUserStatus)} disabled>
              <SelectTrigger id="status" className="bg-white w-full">
                <SelectValue placeholder="Status" />
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
      <h2 className="text-xl font-semibold my-4 border-b pb-2">
        Personal Details
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={formData.refUserFirstName || "N/A"}
            readOnly
            className="bg-white"
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={formData.refUserLastName || "N/A"}
            readOnly
            className="bg-white"
          />
        </div>
        <div>
          <Label htmlFor="email">E-Mail</Label>
          <Input
            id="email"
            type="email"
            value={formData.refCODOEmail || "N/A"}
            readOnly
            className="bg-white"
          />
        </div>
        <div>
          <Label htmlFor="phone">Contact Number</Label>
          <div className="flex gap-2">
            <Select
              value={formData.refCODOPhoneNo1CountryCode || ""}
              disabled
            >
              <SelectTrigger className="bg-white w-[100px]">
                <SelectValue placeholder="Code" />
              </SelectTrigger>
              <SelectContent>
                {formData.refCODOPhoneNo1CountryCode && (
                  <SelectItem value={formData.refCODOPhoneNo1CountryCode}>
                    {formData.refCODOPhoneNo1CountryCode}
                  </SelectItem>
                )}
                {/* Add common codes or ensure the loaded one is present */}
                <SelectItem value="+1">USA (+1)</SelectItem>
                <SelectItem value="+91">IN (+91)</SelectItem>
              </SelectContent>
            </Select>
            <Input
              id="phone"
              type="tel"
              value={formData.refCODOPhoneNo1 || "N/A"}
              readOnly
              className="bg-white flex-1"
            />
          </div>
        </div>
        <div>
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
        <div>
          <Label htmlFor="ssn">Social Security Number</Label>
          <Input
            id="ssn"
            value={formData.refTDSSNo || "N/A"}
            readOnly
            className="bg-white"
          />
        </div>
        <div>
          <Label>Driving License</Label>
          {formData.refTDDrivingLicense &&
          formData.drivingLicenseFile?.base64Data ? (
            <div
              className="mt-1 flex items-center gap-3 bg-green-50 border border-blue-200 rounded-lg px-4 py-2 shadow-sm hover:shadow-md transition-all cursor-pointer"
              onClick={() =>
                downloadFile(
                  formData.drivingLicenseFile.base64Data,
                  formData.drivingLicenseFile.contentType,
                  `DrivingLicense_${formData.refUserCustId}.pdf` // Or a more generic name
                )
              }
            >
              <div className="bg-green-100 p-2 rounded-md">
                      <FileText className="w-5 h-5 text-green-600" />
                    </div>
              <span className="truncate font-semibold text-sm text-green-800">
                View Driving License
              </span>
            </div>
          ) : (
            <p className="text-sm text-gray-500 mt-1">Not available</p>
          )}
        </div>
      </div>

      {/* Professional Details */}
      <h2 className="text-xl font-semibold my-6 border-b pb-2">
        Professional Details
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <div>
          <Label htmlFor="trainedEaseQT">Trained EASE QT Status</Label>
          <Input
            id="trainedEaseQT"
            value={formData.refTDTrainedEaseQTStatus ? "Yes" : "No"}
            readOnly
            className="bg-white"
          />
        </div>
        
        <div>
          <Label>License Files</Label>
          {formData.licenseFiles && formData.licenseFiles.length > 0 ? (
            <div className="mt-1 flex flex-col gap-2">
              {formData.licenseFiles.map((file, index) => (
                <div
                  key={`license-${index}`}
                  className="flex items-center justify-between bg-green-50 border border-blue-200 rounded-lg px-4 py-2 shadow-sm hover:shadow-md transition-all group cursor-pointer"
                  onClick={() => {
                    if (file.lFileData?.base64Data) {
                      downloadFile(
                        file.lFileData.base64Data,
                        file.lFileData.contentType,
                        file.refLOldFileName ||
                          `LicenseFile_${index + 1}.pdf`
                      );
                    } else {
                      setError("File data is not available for download.");
                    }
                  }}
                >
                  <div className="flex items-center gap-3 w-full truncate">
                    <div className="bg-green-100 p-2 rounded-md">
                      <FileText className="w-5 h-5 text-green-600" />
                    </div>
                    <span
                      title={file.refLOldFileName}
                      className="truncate font-semibold text-sm text-green-800"
                    >
                      {file.refLOldFileName || `License File ${index + 1}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 mt-1">
              No license files available.
            </p>
          )}
        </div>

        <div>
          <Label>Digital Signature</Label>
          {formData.refTDDigitalSignature &&
          formData.digitalSignatureFile?.base64Data ? (
            <div className="mt-1 p-2 border rounded-md bg-gray-50 inline-block">
              <img
                src={`data:${formData.digitalSignatureFile.contentType};base64,${formData.digitalSignatureFile.base64Data}`}
                alt="Digital Signature"
                className="h-20 w-auto rounded object-contain"
              />
            </div>
          ) : (
            <p className="text-sm text-gray-500 mt-1">Not available</p>
          )}
        </div>
      </div>

      {error && !loading && (
        <Alert ref={errorRef} variant="destructive" className="mt-6">
          <AlertTitle>Notice</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default TechnicianProfile;