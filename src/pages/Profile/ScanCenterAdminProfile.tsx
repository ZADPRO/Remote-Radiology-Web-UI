import React, { useEffect, useRef, useState } from "react";
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
import {
  ListSpecificScanCenterAdmin,
  scanCenterAdminService,
} from "@/services/scancenterService";
import { useAuth } from "../Routes/AuthContext";

const ScanCenterAdminProfile: React.FC = () => {
  const { user } = useAuth();

  // const scanCenterId = role?.scanCenterId;
  // const scanCenterAdminId = role?.userId;

  const scanCenterId = user?.refSCId;
  const scanCenterAdminId = user?.refUserId;

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [error]);

  const [formData, setFormData] = useState<ListSpecificScanCenterAdmin | null>(
    null
  );

  console.log("\n\n\n\nformData", formData);

  const getSpecificCenterAdmin = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!scanCenterId || !scanCenterAdminId) return;
      const res = await scanCenterAdminService.getSpecificScanCenterAdmin(
        scanCenterId,
        scanCenterAdminId
      );
      if (res.data && res.data.length > 0) {
        setFormData(res.data[0]);
      } else {
        setError("Scan Center Admin data not found.");
        setFormData(null);
      }
    } catch (error: any) {
      console.error("Error fetching scan center admin:", error);
      setError(error.message || "Failed to fetch scan center admin details.");
      setFormData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (scanCenterId && scanCenterAdminId) {
      getSpecificCenterAdmin();
    } else {
      setError("Scan Center ID or Admin ID is not provided.");
      setLoading(false);
      setFormData(null);
    }
  }, [scanCenterId, scanCenterAdminId]);

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
      <div className="p-4">
        No Scan Center Admin data found or ID not provided.
      </div>
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
                src={`data:${formData.profileImgFile.contentType};base64,${formData.profileImgFile.base64Data}`}
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
              <Label className="text-sm" htmlFor="scan-center-admin-id-display">
                Scan Center Admin ID
              </Label>
              <Input
                id="scan-center-admin-id-display"
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
              <Label className="text-sm" htmlFor="fullname-display">
                Full Name
              </Label>
              <Input
                id="fullname-display"
                type="text"
                placeholder="N/A"
                className="bg-white"
                value={
                  `${formData.refUserFirstName || ""} ${
                    formData.refUserLastName || ""
                  }`.trim() || "N/A"
                }
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
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm" htmlFor="ssn-display">
                Social Security Number
              </Label>
              <Input
                id="ssn-display"
                type="text"
                placeholder="N/A"
                className="bg-white"
                value={formData.refRDSSId || ""}
                readOnly
              />
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
                  value={formData.refCODOPhoneNo1CountryCode || ""}
                >
                  <SelectTrigger
                    className="bg-white disabled:opacity-100 disabled:pointer-events-none"
                    disabled
                  >
                    <SelectValue placeholder="N/A" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value={formData.refCODOPhoneNo1CountryCode || ""}
                    >
                      {formData.refCODOPhoneNo1CountryCode || "N/A"}
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
              <Input
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
            {/* Driving License File Display - Assuming it might have base64 data in future or a filename */}
            <div className="flex flex-col gap-1.5 w-full">
              <Label className="text-sm font-medium">Driving License</Label>
              {formData.drivingLicenseFile?.base64Data ? (
                <div
                  className="mt-2 flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-all cursor-pointer"
                  onClick={() =>
                    downloadFile(
                      formData.drivingLicenseFile.base64Data,
                      formData.drivingLicenseFile.contentType,
                      formData.refRDDrivingLicense || "Driving_License.pdf"
                    )
                  }
                  title={`Download ${
                    formData.refRDDrivingLicense || "Driving License Document"
                  }`}
                >
                  <div className="bg-green-100 p-2 rounded-md">
                    <FileText className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="truncate text-sm font-medium text-green-800">
                    {formData.refRDDrivingLicense || "Driving License Document"}
                  </span>
                </div>
              ) : formData.refRDDrivingLicense ? (
                <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
                  Driving License: {formData.refRDDrivingLicense} (Preview not
                  available).
                </div>
              ) : (
                <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500">
                  No Driving License document uploaded.
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

export default ScanCenterAdminProfile;
