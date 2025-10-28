import React, { useEffect, useRef, useState } from "react";
import {
  ListSpecificRadiologist,
  radiologistService,
} from "@/services/radiologistService";
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
import { Camera, FileText } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "../Routes/AuthContext";

const RadiologistProfile: React.FC = () => {
  const { user } = useAuth();

  // const scribeId = role?.scanCenterId;

  const radiologistId = user?.refUserId;

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [error]);

  const [formData, setFormData] = useState<ListSpecificRadiologist | null>(
    null
  );

  const getSpecificRadiologist = async () => {
    setLoading(true);
    setError(null);
    try {
      if (radiologistId === undefined) return;
      const res = await radiologistService.listSpecificRadiologist(
        radiologistId
      );
      if (res.data && res.data.length > 0) {
        setFormData(res.data[0]);
      } else {
        setError("Radiologist data not found.");
        setFormData(null);
      }
    } catch (error: any) {
      console.error("Error fetching radiologist:", error);
      setError(error.message || "Failed to fetch radiologist details.");
      setFormData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (radiologistId) {
      getSpecificRadiologist();
    } else {
      setError("Radiologist ID is not provided.");
      setLoading(false);
      setFormData(null);
    }
  }, [radiologistId]);

  const downloadFile = (
    base64Data: string,
    contentType: string,
    filename: string
  ) => {
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
  };

  if (loading) return <LoadingOverlay />;
  if (error && !formData)
    return <div className="p-4 text-red-500">{error}</div>;
  if (!formData)
    return (
      <div className="p-4">No radiologist data found or ID not provided.</div>
    );

  return (
    <>
      <div className="w-full">
        <div className="w-full flex flex-col lg:flex-row items-center justify-start p-2 gap-6 rounded-xl">
          {/* Profile Image Display */}
          {formData.profileImgFile?.base64Data ? (
            <div className="relative w-32 h-32 lg:w-45 lg:h-45">
              <img
                id="profile-img"
                src={
                  formData?.profileImgFile
                    ? formData.profileImgFile.base64Data?.startsWith("https://")
                      ? formData.profileImgFile.base64Data // S3 URL directly
                      : `data:${formData.profileImgFile.contentType};base64,${formData.profileImgFile.base64Data}` // Base64 encoded
                    : "/default-profile.png" // fallback if no image
                }
                alt="Profile"
                className="w-full h-full rounded-full object-cover border-4 border-[#A3B1A1] shadow"
              />
            </div>
          ) : (
            <div className="relative w-32 h-32 lg:w-45 lg:h-45 flex flex-col items-center justify-center bg-[#A3B1A1] rounded-full text-white shadow-md">
              <Camera className="w-16 h-16" />
              <span className="text-sm font-medium text-white mt-2">
                No Photo
              </span>
            </div>
          )}
          <div className="flex flex-col gap-4 w-full lg:w-1/3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm" htmlFor="Radiologist ID">
                Radiologist ID
              </Label>
              <Input
                id="Radiologist ID"
                type="text"
                className="bg-white"
                value={formData.refUserCustId || ""}
                readOnly
              />
            </div>
            <div className="flex flex-col gap-1.5 w-full relative">
              <Label className="text-sm" htmlFor="status-display">
                Status
              </Label>
              <Select disabled value={String(formData.refUserStatus)}>
                <SelectTrigger
                  id="status-display-trigger"
                  className="bg-white w-full"
                  disabled
                >
                  <SelectValue placeholder="N/A" />
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
          {/* Left Column */}
          <div className="flex flex-col gap-4 2xl:gap-6 w-full lg:w-1/2">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm" htmlFor="firstname-display">
                Full Name
              </Label>
              <Input
                id="firstname-display"
                type="text"
                placeholder="N/A"
                className="bg-white"
                value={formData.refUserFirstName || ""}
                readOnly
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm" htmlFor="email-display">
                E-Mail
              </Label>
              <Input
                id="email-display"
                type="email"
                placeholder="N/A"
                className="bg-white"
                value={formData.refCODOEmail || ""}
                readOnly
              />
            </div>
            {/* Aadhar File Display */}
            <div className="flex flex-col gap-1.5 w-full">
              <Label className="text-sm font-medium">Aadhar</Label>
              {formData.aadharFile?.base64Data ? (
                <div
                  className="mt-2 flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-all cursor-pointer"
                  onClick={() =>
                    downloadFile(
                      formData.aadharFile.base64Data,
                      formData.aadharFile.contentType,
                      formData.refRAAadhar || "Aadhar_Document.pdf"
                    )
                  }
                  title={`Download ${
                    formData.refRAAadhar || "Aadhar Document"
                  }`}
                >
                  <div className="bg-green-100 p-2 rounded-md">
                    <FileText className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="truncate text-sm font-medium text-green-800">
                    {formData.refRAAadhar || "Aadhar Document"}
                  </span>
                </div>
              ) : formData.refRAAadhar ? (
                <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
                  Aadhar document: {formData.refRAAadhar} (Preview not
                  available).
                </div>
              ) : (
                <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500">
                  No Aadhar document uploaded.
                </div>
              )}
            </div>
            {/* Driving License File Display */}
            <div className="flex flex-col gap-1.5 w-full">
              <Label className="text-sm font-medium">Driving License</Label>
              {formData.drivingLicenseFile?.base64Data ? (
                <div
                  className="mt-2 flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-all cursor-pointer"
                  onClick={() =>
                    downloadFile(
                      formData.drivingLicenseFile.base64Data,
                      formData.drivingLicenseFile.contentType,
                      formData.refRADrivingLicense || "Driving_License.pdf"
                    )
                  }
                  title={`Download ${
                    formData.refRADrivingLicense || "Driving License Document"
                  }`}
                >
                  <div className="bg-green-100 p-2 rounded-md">
                    <FileText className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="truncate text-sm font-medium text-green-800">
                    {formData.refRADrivingLicense || "Driving License Document"}
                  </span>
                </div>
              ) : formData.refRADrivingLicense ? (
                <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
                  Driving License: {formData.refRADrivingLicense} (Preview not
                  available).
                </div>
              ) : (
                <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500">
                  No Driving License document uploaded.
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-4 2xl:gap-6 w-full lg:w-1/2">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm" htmlFor="phone-display">
                Contact Number
              </Label>
              <div className="flex gap-2 relative">
                <Select
                  disabled
                  value={formData.refCODOPhoneNo1CountryCode || "+91"}
                >
                  <SelectTrigger
                    className="bg-white disabled:opacity-100 disabled:pointer-events-none"
                    disabled
                  >
                    <SelectValue placeholder="N/A" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value={formData.refCODOPhoneNo1CountryCode || "+91"}
                    >
                      {formData.refCODOPhoneNo1CountryCode || "IN (+91)"}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  id="phone-display"
                  type="text"
                  placeholder="N/A"
                  className="bg-white flex-1"
                  value={formData.refCODOPhoneNo1 || ""}
                  readOnly
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5 w-full relative">
              <Label className="text-sm" htmlFor="dob-display">
                Date Of Birth
              </Label>
              <Input // Using Input for simple text display of date
                id="dob-display"
                type="text"
                placeholder="N/A"
                className="bg-white"
                value={
                  formData.refUserDOB
                    ? new Date(formData.refUserDOB).toLocaleDateString()
                    : "N/A"
                }
                readOnly
              />
            </div>
            {/* PAN File Display */}
            <div className="flex flex-col gap-1.5 w-full">
              <Label className="text-sm font-medium">PAN</Label>
              {formData.panFile?.base64Data ? (
                <div
                  className="mt-2 flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-all cursor-pointer"
                  onClick={() =>
                    downloadFile(
                      formData.panFile.base64Data,
                      formData.panFile.contentType,
                      formData.refRAPan || "PAN_Document.pdf"
                    )
                  }
                  title={`Download ${formData.refRAPan || "PAN Document"}`}
                >
                  <div className="bg-green-100 p-2 rounded-md">
                    <FileText className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="truncate text-sm font-medium text-green-800">
                    {formData.refRAPan || "PAN Document"}
                  </span>
                </div>
              ) : formData.refRAPan ? (
                <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
                  PAN document: {formData.refRAPan} (Preview not available).
                </div>
              ) : (
                <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500">
                  No PAN document uploaded.
                </div>
              )}
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold my-4">Professional Details</h1>
        <div className="flex flex-col lg:flex-row items-start justify-between gap-4 lg:gap-15 w-full">
          {/* Left Column */}
          <div className="flex flex-col gap-4 2xl:gap-6 w-full lg:w-1/2">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm" htmlFor="mbbsRegNo-display">
                MBBS Registration Number
              </Label>
              <Input
                id="mbbsRegNo-display"
                type="text"
                placeholder="N/A"
                className="bg-white"
                value={formData.refRAMBBSRegNo || ""}
                readOnly
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm" htmlFor="specialization-display">
                Specialization
              </Label>
              <Input
                id="specialization-display"
                type="text"
                placeholder="N/A"
                className="bg-white"
                value={formData.refRASpecialization || ""}
                readOnly
              />
            </div>
            {/* License Files Display */}
            <div className="flex flex-col gap-1.5 w-full">
              <Label className="text-sm font-medium">License(s)</Label>
              {formData.licenseFiles && formData.licenseFiles.length > 0 ? (
                <div className="mt-3 flex flex-col gap-3">
                  {formData.licenseFiles.map((file, index) => (
                    <div
                      key={`existing-license-${index}`}
                      className={`flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition-all group ${
                        file.lFileData?.base64Data
                          ? "cursor-pointer"
                          : "cursor-default"
                      }`}
                      onClick={() =>
                        file.lFileData?.base64Data &&
                        downloadFile(
                          file.lFileData.base64Data,
                          file.lFileData.contentType,
                          file.refLOldFileName || `License_${index + 1}.pdf`
                        )
                      }
                      title={
                        file.lFileData?.base64Data
                          ? `Download ${
                              file.refLOldFileName || `License ${index + 1}`
                            }`
                          : file.refLOldFileName || `License ${index + 1}`
                      }
                    >
                      <div className="flex items-center gap-3 w-full truncate">
                        <div className="bg-green-100 p-2 rounded-md">
                          <FileText className="w-5 h-5 text-green-600" />
                        </div>
                        <span className="truncate font-semibold text-green-800">
                          {file.refLOldFileName ||
                            `Existing License ${index + 1}`}
                          {!file.lFileData?.base64Data &&
                            " (Preview not available)"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500">
                  No license documents uploaded.
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-4 2xl:gap-6 w-full lg:w-1/2">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm" htmlFor="mdRegNo-display">
                MD Registration Number
              </Label>
              <Input
                id="mdRegNo-display"
                type="text"
                placeholder="N/A"
                className="bg-white"
                value={formData.refRAMDRegNo || ""}
                readOnly
              />
            </div>
            {/* CV Files Display */}
            <div className="flex flex-col gap-1.5 w-full">
              <Label className="text-sm font-medium">CV(s)</Label>
              {formData.cvFiles && formData.cvFiles.length > 0 ? (
                <div className="mt-3 flex flex-col gap-3">
                  {formData.cvFiles.map((file, index) => (
                    <div
                      key={`existing-cv-${index}`}
                      className={`flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition-all group ${
                        file.cvFileData?.base64Data
                          ? "cursor-pointer"
                          : "cursor-default"
                      }`}
                      onClick={() =>
                        file.cvFileData?.base64Data &&
                        downloadFile(
                          file.cvFileData.base64Data,
                          file.cvFileData.contentType,
                          file.refCVOldFileName || `CV_${index + 1}.pdf`
                        )
                      }
                      title={
                        file.cvFileData?.base64Data
                          ? `Download ${
                              file.refCVOldFileName || `CV ${index + 1}`
                            }`
                          : file.refCVOldFileName || `CV ${index + 1}`
                      }
                    >
                      <div className="flex items-center gap-3 w-full truncate">
                        <div className="bg-green-100 p-2 rounded-md">
                          <FileText className="w-5 h-5 text-green-600" />
                        </div>
                        <span className="truncate font-semibold text-green-800">
                          {file.refCVOldFileName || `Existing CV ${index + 1}`}
                          {!file.cvFileData?.base64Data &&
                            " (Preview not available)"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500">
                  No CV documents uploaded.
                </div>
              )}
            </div>
            {/* Malpractice Insurance Files Display */}
            <div className="flex flex-col gap-1.5 w-full">
              <Label className="text-sm font-medium">
                Malpractice Insurance
              </Label>
              {formData.malpracticeinsureance_files &&
              formData.malpracticeinsureance_files.length > 0 ? (
                <div className="mt-3 flex flex-col gap-3">
                  {formData.malpracticeinsureance_files.map((file, index) => (
                    <div
                      key={`existing-malpractice-${index}`}
                      className={`flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition-all group ${
                        file.MPFileData?.base64Data
                          ? "cursor-pointer"
                          : "cursor-default"
                      }`}
                      onClick={() =>
                        file.MPFileData?.base64Data &&
                        downloadFile(
                          file.MPFileData.base64Data,
                          file.MPFileData.contentType,
                          file.refMPOldFileName ||
                            `Malpractice_${index + 1}.pdf`
                        )
                      }
                      title={
                        file.MPFileData?.base64Data
                          ? `Download ${
                              file.refMPOldFileName ||
                              `Malpractice File ${index + 1}`
                            }`
                          : file.refMPOldFileName ||
                            `Malpractice File ${index + 1}`
                      }
                    >
                      <div className="flex items-center gap-3 w-full truncate">
                        <div className="bg-green-100 p-2 rounded-md">
                          <FileText className="w-5 h-5 text-green-600" />
                        </div>
                        <span className="truncate font-semibold text-green-800">
                          {file.refMPOldFileName ||
                            `Malpractice File ${index + 1}`}
                          {!file.MPFileData?.base64Data &&
                            " (Preview not available)"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500">
                  No Malpractice Insurance documents uploaded.
                </div>
              )}
            </div>
            {/* Digital Signature Display */}
            <div className="flex flex-col gap-1.5 w-full">
              <Label className="text-sm">Digital Signature</Label>
              {formData.digitalSignatureFile?.base64Data ? (
                <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-start border border-gray-300 rounded-lg p-3 bg-green-50">
                  <img
                    src={`data:${formData.digitalSignatureFile.contentType};base64,${formData.digitalSignatureFile.base64Data}`}
                    alt="Digital Signature"
                    className="h-16 w-auto rounded border object-contain"
                  />
                </div>
              ) : formData.refRADigitalSignature ? (
                <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
                  Digital signature: {formData.refRADigitalSignature} (Preview
                  not available).
                </div>
              ) : (
                <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500">
                  No digital signature uploaded.
                </div>
              )}
            </div>
          </div>
        </div>

        {error && !loading && (
          <Alert ref={errorRef} variant="destructive" className="mt-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    </>
  );
};

export default RadiologistProfile;
