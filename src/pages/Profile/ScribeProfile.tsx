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
import { ListSpecificScribe, scribeService } from "@/services/scribeService";
import { Camera, FileText } from "lucide-react"; // Removed Pencil, X
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../Routes/AuthContext";


const ScribeProfile: React.FC = () => {

    const { user } = useAuth();
    
      const scribeId = user?.refUserId;
    
      // const scribeId = 72;

  const [loading, setLoading] = useState<boolean>(true); // Start with loading true
  const [error, setError] = useState<string | null>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [error]);

  const [formData, setFormData] = useState<ListSpecificScribe | null>(null);

  const getSpecificScribe = async () => {
    setLoading(true);
    setError(null);
    try {
      if(scribeId) {
const res = await scribeService.listSpecificScribe(scribeId);
      if (res.data && res.data.length > 0) {
        setFormData(res.data[0]);
      } else {
        setError("Scribe data not found.");
        setFormData(null);
      }
      }
      
    } catch (err) {
      console.error("Error fetching scribe data:", err);
      setError("Failed to fetch scribe details.");
      setFormData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (scribeId) {
      getSpecificScribe();
    }
  }, [scribeId]);

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
      a.download = filename; // Use provided filename
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
  if (error && !formData) { // Show error prominently if data couldn't be loaded
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }
  if (!formData) return <div className="p-4">No scribe data found.</div>;

  return (
    <div className="w-full">
      <div className="w-full flex flex-col lg:flex-row items-center justify-start p-2 gap-6 rounded-xl">
        {formData.profileImgFile?.base64Data ? (
          <div className="relative w-32 h-32 lg:w-45 lg:h-45">
            <img
              id="profile-img"
              src={`data:${formData.profileImgFile.contentType};base64,${formData.profileImgFile.base64Data}`}
              alt="Profile"
              className="w-full h-full rounded-full object-cover border-4 border-[#A3B1A1] shadow"
            />
          </div>
        ) : (
          <div className="relative w-32 h-32 lg:w-45 lg:h-45 flex flex-col items-center justify-center bg-[#A3B1A1] rounded-full text-white shadow-md">
            <Camera className="w-16 h-16" />
          </div>
        )}
        <div className="flex flex-col gap-4 w-full lg:w-1/3">
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm" htmlFor="ScribeID">
              Scribe ID
            </Label>
            <Input
              id="ScribeID"
              type="text"
              className="bg-white"
              value={formData.refUserCustId || "N/A"}
              readOnly
            />
          </div>

          <div className="flex flex-col gap-1.5 w-full relative">
            <Label className="text-sm" htmlFor="status">
              Status
            </Label>
            <Select value={String(formData.refUserStatus)} disabled>
              <SelectTrigger id="status" className="bg-white w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">InActive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <h1 className="text-2xl font-bold my-4">Personal Details</h1>

      <div className="flex flex-col lg:flex-row items-start justify-between gap-4 lg:gap-15 w-full">
        <div className="flex flex-col gap-4 2xl:gap-6 w-full lg:w-1/2">
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm" htmlFor="firstname">
              First Name
            </Label>
            <Input
              id="firstname"
              type="text"
              className="bg-white"
              value={formData.refUserFirstName || "N/A"}
              readOnly
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm" htmlFor="lastname">
              Last Name
            </Label>
            <Input
              id="lastname"
              type="text"
              className="bg-white"
              value={formData.refUserLastName || "N/A"}
              readOnly
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm" htmlFor="email">
              E-Mail
            </Label>
            <Input
              id="email"
              type="email"
              className="bg-white"
              value={formData.refCODOEmail || "N/A"}
              readOnly
            />
          </div>
          <div className="flex flex-col gap-1.5 w-full">
            <Label className="text-sm font-medium">Aadhar</Label>
            {formData.refSDAadhar && formData.aadharFile?.base64Data ? (
              <div
                className="mt-2 flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-all cursor-pointer"
                onClick={() =>
                  downloadFile(
                    formData.aadharFile.base64Data,
                    formData.aadharFile.contentType,
                    `Aadhar_${formData.refUserCustId}.pdf`
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
              <p className="text-sm text-gray-500 mt-1">Not available</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5 w-full">
            <Label className="text-sm font-medium">Driving License</Label>
            {formData.refSDDrivingLicense &&
            formData.drivingLicenseFile?.base64Data ? (
              <div
                className="mt-2 flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-all cursor-pointer"
                onClick={() =>
                  downloadFile(
                    formData.drivingLicenseFile.base64Data,
                    formData.drivingLicenseFile.contentType,
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

        <div className="flex flex-col gap-4 2xl:gap-6 w-full lg:w-1/2">
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm" htmlFor="phone">
              Contact Number
            </Label>
            <div className="flex gap-2 relative">
              <Select
                value={formData.refCODOPhoneNo1CountryCode || ""}
                disabled
              >
                <SelectTrigger
                  disabled
                  className="bg-white disabled:opacity-100 disabled:pointer-events-none w-[80px]"
                >
                  <SelectValue placeholder="Code" />
                </SelectTrigger>
                <SelectContent>
                  {formData.refCODOPhoneNo1CountryCode && (
                    <SelectItem value={formData.refCODOPhoneNo1CountryCode}>
                      {formData.refCODOPhoneNo1CountryCode}
                    </SelectItem>
                  )}
                  <SelectItem value="+91">IN (+91)</SelectItem>
                  <SelectItem value="+1">USA (+1)</SelectItem>
                  {/* Add more country codes if needed, or ensure the loaded one is primary */}
                </SelectContent>
              </Select>
              <Input
                id="phone"
                type="tel"
                className="bg-white flex-1"
                value={formData.refCODOPhoneNo1 || "N/A"}
                readOnly
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 w-full relative">
            <Label className="text-sm" htmlFor="dob">
              Date Of Birth
            </Label>
            {/* Using Input for read-only date display for simplicity and guaranteed non-interactivity */}
            <Input
              id="dob"
              type="text"
              className="bg-white"
              value={
                formData.refUserDOB
                  ? new Date(formData.refUserDOB).toLocaleDateString("en-CA", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })
                  : "N/A"
              }
              readOnly
            />
            {/* Alternative: Disabled DatePicker if it visually suits better
            <DatePicker
              value={
                formData.refUserDOB ? parseLocalDate(formData.refUserDOB) : undefined
              }
              disabled
            /> */}
          </div>

          <div className="flex flex-col gap-1.5 w-full">
            <Label className="text-sm font-medium">PAN</Label>
            {formData.refSDPan && formData.panFile?.base64Data ? (
              <div
                className="mt-2 flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-all cursor-pointer"
                onClick={() =>
                  downloadFile(
                    formData.panFile.base64Data,
                    formData.panFile.contentType,
                    `PAN_${formData.refUserCustId}.pdf`
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
              <p className="text-sm text-gray-500 mt-1">Not available</p>
            )}
          </div>
        </div>
      </div>

      <h1 className="text-2xl font-bold my-4">Professional Details</h1>

      <div className="flex flex-col lg:flex-row items-start justify-between gap-4 lg:gap-15 w-full">
        <div className="flex flex-col gap-4 2xl:gap-6 w-full lg:w-1/2">
          <div className="flex flex-col gap-1.5 w-full">
            <Label className="text-sm font-medium">
              Education Certificates
            </Label>
            {formData.educationCertificateFiles &&
            formData.educationCertificateFiles.length > 0 ? (
              <div className="mt-3 flex flex-col gap-3">
                {formData.educationCertificateFiles.map((file, index) => (
                  <div
                    key={`existing-license-${index}`}
                    className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition-all group cursor-pointer"
                  >
                    <div
                      className="flex items-center gap-3 w-full truncate"
                      onClick={() => {
                        if (file.educationCertificateFile) {
                          downloadFile(
                            file.educationCertificateFile.base64Data,
                            file.educationCertificateFile.contentType,
                            file.refECOldFileName ||
                              `EducationCertificate_${index + 1}.pdf`
                          );
                        } else {
                          setError("File data is not available for download.");
                        }
                      }}
                    >
                      <div className="bg-green-100 p-2 rounded-md">
                        <FileText className="w-5 h-5 text-green-600" />
                      </div>
                      <span
                        title={file.refECOldFileName}
                        className="truncate font-semibold text-green-800"
                      >
                        {file.refECOldFileName ||
                          `Education Certificate ${index + 1}`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 mt-1">
                No education certificates available.
              </p>
            )}
          </div>
        </div>
        {/* Placeholder for the right column if needed, or remove if layout is single column for this section */}
        <div className="w-full lg:w-1/2"></div>
      </div>

      {error && !loading && ( // Display non-critical errors at the bottom
        <Alert ref={errorRef} variant="destructive" className="mt-4">
          <AlertTitle>Notice</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ScribeProfile;