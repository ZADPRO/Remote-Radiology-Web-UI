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
  doctorService,
  ListSpecificPerformingProvider,
} from "@/services/doctorService";
import { Camera, FileText } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../Routes/AuthContext"; // Assuming this might be used later or for consistency

const PerformingProviderProfile: React.FC = () => {
  const { user } = useAuth(); 
  const scanCenterId = user?.refSCId; 
  const performingProviderId = user?.refUserId;

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [error]);

  const [formData, setFormData] =
    useState<ListSpecificPerformingProvider | null>(null);

  const getSpecificPerformingProvider = async () => {
    if (!scanCenterId || !performingProviderId) {
      setError("Required IDs are not available.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await doctorService.getSpecificPerformingProvider(
        scanCenterId,
        performingProviderId
      );
      if (res.data && res.data.length > 0) {
        setFormData(res.data[0]);
      } else {
        setError("Performing Provider data not found.");
        setFormData(null);
      }
    } catch (err) {
      console.error("Error fetching performing provider data:", err);
      setError("Failed to fetch performing provider details.");
      setFormData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSpecificPerformingProvider();
  }, [scanCenterId, performingProviderId]);

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
  if (!formData) {
    return <div className="p-4">No Performing Provider data found.</div>;
  }

  return (
    <div className="w-full p-4">
      <div className="w-full flex flex-col lg:flex-row items-center justify-start p-2 gap-6 rounded-xl mb-6">
        {formData.profileImgFile?.base64Data ? (
          <div className="relative w-32 h-32 lg:w-40 lg:h-40">
            <img
              src={`data:${formData.profileImgFile.contentType};base64,${formData.profileImgFile.base64Data}`}
              alt="Profile"
              className="w-full h-full rounded-full object-cover border-4 border-[#A3B1A1] shadow"
            />
          </div>
        ) : (
          <div className="relative w-32 h-32 lg:w-40 lg:h-40 flex items-center justify-center bg-[#A3B1A1] rounded-full text-white shadow-md">
            <Camera className="w-16 h-16" />
          </div>
        )}
        <div className="flex flex-col gap-4 w-full lg:w-1/3">
          <div>
            <Label htmlFor="providerID">Performing Provider ID</Label>
            <Input
              id="providerID"
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

      <h1 className="text-2xl font-bold my-4">Personal Details</h1>
      <div className="flex flex-col lg:flex-row items-start justify-between gap-4 lg:gap-15 w-full">
        <div className="flex flex-col gap-4 2xl:gap-6 w-full lg:w-1/2">
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
            <Label htmlFor="socialSecurityNo">Social Security Number</Label>
            <Input
              id="socialSecurityNo"
              value={formData.refDDSocialSecurityNo || "N/A"}
              readOnly
              className="bg-white"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 2xl:gap-6 w-full lg:w-1/2">
          <div>
            <Label htmlFor="phone">Contact Number</Label>
            <div className="flex gap-2">
              <Select
                value={formData.refCODOPhoneNo1CountryCode || ""}
                disabled
              >
                <SelectTrigger className="bg-white w-[100px] disabled:opacity-100 disabled:pointer-events-none">
                  <SelectValue placeholder="Code" />
                </SelectTrigger>
                <SelectContent>
                  {formData.refCODOPhoneNo1CountryCode && (
                    <SelectItem value={formData.refCODOPhoneNo1CountryCode}>
                      {formData.refCODOPhoneNo1CountryCode}
                    </SelectItem>
                  )}
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
                  ? new Date(formData.refUserDOB).toLocaleDateString("en-CA")
                  : "N/A"
              }
              readOnly
              className="bg-white"
            />
          </div>
          <div>
            <Label>Driving License</Label>
            {formData.drivers_license && formData.driversLicenseFile?.base64Data ? (
              <div
                className="mt-1 flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-all cursor-pointer"
                onClick={() =>
                  downloadFile(
                    formData.driversLicenseFile.base64Data,
                    formData.driversLicenseFile.contentType,
                    `DrivingLicense_${formData.refUserCustId}.pdf`
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
              <p className="text-sm text-gray-500 mt-1">Not available</p>
            )}
          </div>
        </div>
      </div>

      <h1 className="text-2xl font-bold my-6">Professional Details</h1>
      <div className="flex flex-col lg:flex-row items-start justify-between gap-4 lg:gap-15 w-full">
        <div className="flex flex-col gap-4 2xl:gap-6 w-full lg:w-1/2">
          <div>
            <Label htmlFor="npi">NPI</Label>
            <Input
              id="npi"
              value={formData.refDDNPI || "N/A"}
              readOnly
              className="bg-white"
            />
          </div>
          <div>
            <Label htmlFor="specialization">Specialization</Label>
            <Input
              id="specialization"
              value={formData.Specialization || "N/A"}
              readOnly
              className="bg-white"
            />
          </div>
          <div>
            <Label>License Files</Label>
            {formData.licenseFiles && formData.licenseFiles.length > 0 ? (
              <div className="mt-1 flex flex-col gap-3">
                {formData.licenseFiles.map((file, index) => (
                  <div
                    key={`license-${index}`}
                    className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-all cursor-pointer"
                    onClick={() => {
                      if (file.lFileData?.base64Data) {
                        downloadFile(
                          file.lFileData.base64Data,
                          file.lFileData.contentType,
                          file.refLOldFileName || `License_${index + 1}.pdf`
                        );
                      } else {
                        setError("License file data is not available.");
                      }
                    }}
                  >
                    <div className="bg-green-100 p-2 rounded-md">
                      <FileText className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="truncate text-sm font-medium text-green-800">
                      {file.refLOldFileName || `License File ${index + 1}`}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 mt-1">
                No license files available.
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 2xl:gap-6 w-full lg:w-1/2">
          <div>
            <Label>Malpractice Insurance Files</Label>
            {formData.malpracticeinsureance_files &&
            formData.malpracticeinsureance_files.length > 0 ? (
              <div className="mt-1 flex flex-col gap-3">
                {formData.malpracticeinsureance_files.map((file, index) => (
                  <div
                    key={`malpractice-${index}`}
                    className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-all cursor-pointer"
                    onClick={() => {
                      if (file.MPFileData?.base64Data) {
                        downloadFile(
                          file.MPFileData.base64Data,
                          file.MPFileData.contentType,
                          file.refMPOldFileName ||
                            `Malpractice_Insurance_${index + 1}.pdf`
                        );
                      } else {
                        setError(
                          "Malpractice insurance file data is not available."
                        );
                      }
                    }}
                  >
                    <div className="bg-green-100 p-2 rounded-md">
                      <FileText className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="truncate text-sm font-medium text-green-800">
                      {file.refMPOldFileName ||
                        `Malpractice Insurance ${index + 1}`}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 mt-1">
                No malpractice insurance files available.
              </p>
            )}
          </div>
          <div>
            <Label>Digital Signature</Label>
            {formData.digital_signature &&
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

export default PerformingProviderProfile;