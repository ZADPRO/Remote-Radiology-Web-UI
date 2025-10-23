// import DatePicker from "@/components/date-picker";
import DefaultDatePicker from "@/components/DefaultDatePicker";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import FileUploadButton from "@/components/ui/CustomComponents/FileUploadButton";
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
// import { dateDisablers, parseLocalDate } from "@/lib/dateUtils";
import { uploadService } from "@/services/commonServices";
import { ListSpecificManager, managerService } from "@/services/managerService";
import { Camera, FileText, Pencil, X, CircleAlert } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// For tracking newly uploaded files in UI
interface TempFilesState {
  profile_img: File | null;
  aadhar: File | null;
  drivers_license: File | null;
  pan: File | null;
  education_certificate: File[];
}

// For payload to update education certificates
interface TempUpdateEduFile {
  id?: number; // For existing files (to mark for deletion or reference)
  file_name: string; // Path of new file, or existing file_name
  old_file_name: string; // Original name of new file, or existing old_file_name
  status: "new" | "delete";
}

// --- Component Props ---
interface EditWellthGreenManagerProps {
  managerId: number;
  setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onUpdate: () => void; // Callback after successful update
}

const EditWellthGreenManager: React.FC<EditWellthGreenManagerProps> = ({
  managerId,
  setIsEditDialogOpen,
  onUpdate,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<ListSpecificManager | null>({
    refUserId: 0,
    refUserCustId: "",
    refUserFirstName: "",
    refUserLastName: "",
    refUserProfileImg: "",
    profileImgFile: {
      base64Data: "",
      contentType: "",
    },

    refUserDOB: "", // actual value
    refCODOPhoneNo1CountryCode: "+91",
    refCODOPhoneNo1: "",
    refCODOEmail: "",

    refMDDrivingLicense: "",
    drivingLicenseFile: undefined,

    refMDPan: "",
    panFile: undefined,

    refMDAadhar: "",
    aadharFile: undefined,

    refRTId: undefined,
    refUserAgreementStatus: undefined,

    educationCertificateFiles: [],
    refUserStatus: true, // default active
  });

  const [files, setFiles] = useState<TempFilesState>({
    profile_img: null,
    aadhar: null,
    drivers_license: null,
    pan: null,
    education_certificate: [],
  });
  const [tempEduFiles, setTempEduFiles] = useState<TempUpdateEduFile[]>([]);

  console.log(tempEduFiles, "tempEduFiles");
  console.log(files, "files");
  console.log(formData, "formData");

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [error]);

  const fetchManagerData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await managerService.listSpecificWellthGreenManager(
        managerId
      );
      if (res.data && res.data.length > 0) {
        setFormData(res.data[0]);
      } else {
        setError("Manager data not found.");
        setFormData(null);
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

  const handleProfileImageUpload = async (file: File) => {
    setError(null);
    const formDataImg = new FormData();
    formDataImg.append("profileImage", file);

    try {
      const response = await uploadService.uploadImage({
        formImg: formDataImg,
      });
      if (response.status && response.fileName) {
        setFormData((prev) =>
          prev ? { ...prev, refUserProfileImg: response.fileName } : null
        );
        setFiles((prev) => ({ ...prev, profile_img: file }));
      } else {
        setError(response.message || "Profile image upload failed.");
      }
    } catch (err) {
      console.error(err);
      setError("Error uploading profile image.");
    }
  };

  const handleSingleFileUpload = async ({
    file,
    fieldName,
    tempFileKey,
  }: {
    file: File;
    fieldName: keyof ListSpecificManager;
    tempFileKey: keyof TempFilesState;
  }) => {
    setError(null);
    const formDataObj = new FormData();
    formDataObj.append("file", file);

    try {
      const response = await uploadService.uploadFile({
        formFile: formDataObj,
      });
      if (response.status && response.fileName) {
        setFormData((prev) =>
          prev ? { ...prev, [fieldName]: response.fileName } : null
        );
        setFiles((prev) => ({ ...prev, [tempFileKey]: file }));
      } else {
        setError(response.message || `Upload failed for ${file.name}.`);
      }
    } catch (err) {
      console.error(err);
      setError(`Error uploading ${file.name}.`);
    }
  };

  const uploadAndStoreEduFile = async (file: File) => {
    setError(null);
    const formDataObj = new FormData();
    formDataObj.append("file", file);

    try {
      const response = await uploadService.uploadFile({
        formFile: formDataObj,
      });
      if (response.status && response.fileName) {
        const newEduFileEntry: TempUpdateEduFile = {
          file_name: response.fileName,
          old_file_name: file.name,
          status: "new",
        };
        setTempEduFiles((prev) => [...prev, newEduFileEntry]);
        setFiles((prev) => ({
          ...prev,
          education_certificate: [...prev.education_certificate, file],
        }));
      } else {
        setError(
          response.message ||
            `Upload failed for education certificate: ${file.name}.`
        );
      }
    } catch (err) {
      console.error(err);
      setError(`Error uploading education certificate: ${file.name}.`);
    }
  };

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
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Download failed:", e);
      setError("Failed to download file.");
    }
  };

  const handleSubmit = async () => {
    if (!formData) {
      setError("Form data is not loaded.");
      return;
    }
    setError(null);
    setSaveLoading(true);

    const payload = {
      id: formData.refUserId,
      firstname: formData.refUserFirstName,
      lastname: formData.refUserLastName,
      email: formData.refCODOEmail,
      dob: formData.refUserDOB,
      phone: formData.refCODOPhoneNo1,
      phoneCountryCode: formData.refCODOPhoneNo1CountryCode,
      pan: formData.refMDPan,
      aadhar: formData.refMDAadhar,
      drivers_license: formData.refMDDrivingLicense,
      profile_img: formData.refUserProfileImg,
      status: formData.refUserStatus,
      education_certificate: tempEduFiles,
    };

    try {
      const res = await managerService.updateWellthGreenAdmin(payload);
      if (res.status) {
        toast.success(res.message || "Manager updated successfully!");
        onUpdate();
        setIsEditDialogOpen(false);
      } else {
        setError(res.message || "Failed to update manager.");
      }
    } catch (err) {
      console.error("Error updating manager:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) return <LoadingOverlay />;
  if (!formData)
    return (
      <div className="p-4 text-center">
        {error || "Manager data could not be loaded."}
      </div>
    );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="w-full"
    >
      {loading && <LoadingOverlay />}
      {/* Profile Image and Basic Info */}
      <div className="w-full flex flex-col lg:flex-row items-center justify-start p-2 gap-6 rounded-xl">
        <div className="relative w-32 h-32 lg:w-45 lg:h-45">
          {files.profile_img ? (
            <img
              src={URL.createObjectURL(files.profile_img)}
              alt="Preview"
              className="w-full h-full rounded-full object-cover border-4 border-[#A3B1A1] shadow"
            />
          ) : formData.refUserProfileImg && formData.profileImgFile ? (
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
          <label className="absolute bottom-1 right-1 bg-[#A3B1A1] rounded-full p-2 shadow cursor-pointer hover:bg-[#728270]">
            <Pencil className="w-5 h-5 text-background" />
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (file.size > 5 * 1024 * 1024) {
                    setError("Image must be less than 5MB.");
                    return;
                  }
                  handleProfileImageUpload(file);
                }
              }}
            />
          </label>
        </div>

        <div className="flex flex-col gap-4 w-full lg:w-1/3">
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm" htmlFor="managerIdDisplay">
              Manager ID
            </Label>
            <Input
              id="managerIdDisplay"
              value={formData.refUserCustId}
              disabled
              className="bg-white"
            />
          </div>
          <div className="flex flex-col gap-1.5 w-full">
            <Label className="text-sm" htmlFor="status">
              Status <span className="text-red-500">*</span>
            </Label>
            <Select
              value={String(formData.refUserStatus === true)}
              onValueChange={(value) =>
                setFormData((prev) =>
                  prev ? { ...prev, refUserStatus: value === "true" } : null
                )
              }
            >
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
      {/* Changed justify-between to justify-start and added more gap for better visual separation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-15 w-full">
        {/* Left Column */}
        <div className="flex flex-col gap-4 2xl:gap-6 w-full">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="firstname">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="firstname"
              value={formData.refUserFirstName || ""}
              onChange={(e) =>
                setFormData((prev) =>
                  prev ? { ...prev, refUserFirstName: e.target.value } : null
                )
              }
              required
              className="bg-white"
            />
          </div>

          <div className="flex flex-col">
            <Label className="text-sm" htmlFor="email">
              E-Mail <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.refCODOEmail || ""}
              onChange={(e) =>
                setFormData((prev) =>
                  prev ? { ...prev, refCODOEmail: e.target.value } : null
                )
              }
              required
              className="bg-white"
              disabled
            />
          </div>

          {/* Aadhar Card */}
          <div className="flex flex-col gap-1.5 w-full">
            <Label className="text-sm" htmlFor="aadhar-upload">
              Aadhar <span className="text-red-500">*</span>
            </Label>
            <Input
              id="aadhar"
              type="text"
              placeholder="Enter Aadhar Number"
              value={formData.refMDAadhar || ""}
              onChange={(e) => {
                if (e.target.value.length <= 10) {
                  setFormData((prev) =>
                    prev ? { ...prev, refMDAadhar: e.target.value } : null
                  );
                }
              }}
              required
              className="bg-white"
            />
            {/* <FileUploadButton
              id="aadhar-upload"
              label="Upload Aadhar"
              required={true}
              isFilePresent={formData.refMDAadhar.length > 0}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (file.size > 5 * 1024 * 1024) {
                    setError("File must be less than 5MB.");
                    return;
                  }
                  handleSingleFileUpload({
                    file,
                    fieldName: "refMDAadhar",
                    tempFileKey: "aadhar",
                  });
                }
              }}
            />
            {files.aadhar ? (
              <div className="mt-2 flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-all">
                <div className="bg-blue-100 p-2 rounded-md">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <span className="truncate text-sm font-medium text-blue-800">
                  {files.aadhar.name}
                </span>
              </div>
            ) : formData.refMDAadhar && formData.aadharFile ? (
              <div
                className="mt-2 flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-all cursor-pointer"
                onClick={() =>
                  downloadFile(
                    formData.aadharFile!.base64Data,
                    formData.aadharFile!.contentType,
                    "Aadhar"
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
            ) : formData.refMDAadhar ? (
              <div className="mt-1 text-xs text-gray-500 italic">
                Aadhar uploaded (preview unavailable)
              </div>
            ) : null} */}
          </div>

          {/* Driver's License */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm" htmlFor="license-upload">
              Driver's License
            </Label>
            <FileUploadButton
              id="license-upload"
              label="Upload License"
              isFilePresent={!!formData.refMDDrivingLicense}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (file.size > 5 * 1024 * 1024) {
                    setError("File must be less than 5MB.");
                    return;
                  }

                  handleSingleFileUpload({
                    file,
                    fieldName: "refMDDrivingLicense",
                    tempFileKey: "drivers_license",
                  });
                }
              }}
            />

            {files.drivers_license ? (
              <div className="mt-2 flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-all">
                <div className="bg-blue-100 p-2 rounded-md">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <span className="truncate text-sm font-medium text-blue-800">
                  {files.drivers_license.name}
                </span>
              </div>
            ) : formData.refMDDrivingLicense && formData.drivingLicenseFile ? (
              <div
                className="mt-2 flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-all cursor-pointer"
                onClick={() =>
                  downloadFile(
                    formData.drivingLicenseFile!.base64Data,
                    formData.drivingLicenseFile!.contentType,
                    "License"
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
            ) : formData.refMDDrivingLicense ? (
              <div className="mt-1 text-xs text-gray-500 italic">
                License uploaded (preview unavailable)
              </div>
            ) : null}
          </div>
        </div>
        {/* Right Column */}
        <div className="flex flex-col gap-4 2xl:gap-6 w-full">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="phone">
              Contact Number <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-2 relative">
              <Select
                value={formData.refCODOPhoneNo1CountryCode || "+91"}
                onValueChange={(value) =>
                  setFormData((prev) =>
                    prev ? { ...prev, refCODOPhoneNo1CountryCode: value } : null
                  )
                }
                disabled
              >
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="+91">IN (+91)</SelectItem>
                  {/* Add other country codes if needed */}
                </SelectContent>
              </Select>
              <Input
                id="phone"
                type="number"
                placeholder="Enter Phone Number"
                value={formData.refCODOPhoneNo1 || ""}
                onChange={(e) => {
                  if (e.target.value.length <= 10) {
                    setFormData((prev) =>
                      prev ? { ...prev, refCODOPhoneNo1: e.target.value } : null
                    );
                  }
                }}
                required
                className="bg-white flex-1"
                disabled
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="dob">
              Date Of Birth <span className="text-red-500">*</span>
            </Label>
            {/* <DatePicker
              value={
                formData.refUserDOB
                  ? parseLocalDate(formData.refUserDOB)
                  : undefined
              }
              className="pointer-events-auto"
              onChange={(date) =>
                setFormData((prev) =>
                  prev
                    ? {
                        ...prev,
                        refUserDOB: date
                          ? date.toLocaleDateString("en-CA")
                          : "",
                      }
                    : null
                )
              }
              disabledDates={dateDisablers.noFuture}
            /> */}
            <DefaultDatePicker
              value={formData.refUserDOB}
              onChange={(val) => {
                setFormData((prev) => {
                  if (!prev) return prev; // keep null if formData is null
                  return {
                    ...prev,
                    refUserDOB: val.target.value, // just updating this field
                  };
                });
              }}
              required
            />
          </div>

          {/* PAN Card */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm" htmlFor="pan-upload">
              PAN <span className="text-red-500">*</span>
            </Label>
            <Input
              id="pan"
              type="text"
              placeholder="Enter Pan"
              value={formData.refMDPan || ""}
              onChange={(e) => {
                if (e.target.value.length <= 10) {
                  setFormData((prev) =>
                    prev ? { ...prev, refMDPan: e.target.value } : null
                  );
                }
              }}
              required
              className="bg-white"
            />
            {/* <FileUploadButton
              id="pan-upload"
              label="Upload PAN"
              required={false}
              isFilePresent={!!formData.refMDPan}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (file.size > 5 * 1024 * 1024) {
                    setError("File must be less than 5MB.");
                    return;
                  }
                  handleSingleFileUpload({
                    file,
                    fieldName: "refMDPan",
                    tempFileKey: "pan",
                  });
                }
              }}
            /> */}
            {/* 
            {files.pan ? (
              <div className="mt-2 flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-all">
                <div className="bg-blue-100 p-2 rounded-md">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <span className="truncate text-sm font-medium text-blue-800">
                  {files.pan.name}
                </span>
              </div>
            ) : formData.refMDPan && formData.panFile ? (
              <div
                className="mt-2 flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-all cursor-pointer"
                onClick={() =>
                  downloadFile(
                    formData.panFile!.base64Data,
                    formData.panFile!.contentType,
                    "PAN"
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
            ) : formData.refMDPan ? (
              <div className="mt-1 text-xs text-gray-500 italic">
                PAN uploaded (preview unavailable)
              </div>
            ) : null} */}
          </div>
        </div>
      </div>

      {/* Professional Details - Education Certificates */}
      <h1 className="text-2xl font-bold my-4">Professional Details</h1>
      {/* Changed justify-between to justify-start and removed fixed width from parent to let grid handle it */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-15 w-full">
        <div className="flex flex-col gap-4 2xl:gap-6 w-full">
          <Label htmlFor="edu-certs-upload">
            Educational Certificates (multiple, max 10MB each){" "}
          </Label>
          <FileUploadButton
            id="edu-certs-upload"
            label="Upload Education Certificates"
            multiple
            // required={false}
            isFilePresent={files.education_certificate.length > 0}
            onChange={async (e) => {
              const selectedFiles = e.target.files;
              if (selectedFiles) {
                for (const file of Array.from(selectedFiles)) {
                  if (file.size > 10 * 1024 * 1024) {
                    setError(`File ${file.name} exceeds 10MB limit.`);
                    continue;
                  }
                  if (
                    !files.education_certificate.find(
                      (f) => f.name === file.name
                    )
                  ) {
                    await uploadAndStoreEduFile(file);
                  }
                }
              }
            }}
          />

          {/* Display Existing Education Certificates */}
          {formData.educationCertificateFiles &&
            formData.educationCertificateFiles.length > 0 && (
              <div className="mt-3 flex flex-col gap-3">
                {formData.educationCertificateFiles.map((cert, index) => (
                  <div
                    key={cert.refECId || `existing-${index}`}
                    className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition-all group cursor-pointer"
                  >
                    <div
                      className="flex items-center gap-3 w-4/5 truncate"
                      onClick={() =>
                        downloadFile(
                          cert.educationCertificateFile.base64Data,
                          cert.educationCertificateFile.contentType,
                          cert.refECOldFileName || `Certificate-${index + 1}`
                        )
                      }
                    >
                      <div className="bg-green-100 p-2 rounded-md">
                        <FileText className="w-5 h-5 text-green-600" />
                      </div>
                      <span
                        title={
                          cert.refECOldFileName || `Certificate ${index + 1}`
                        }
                        className="truncate font-semibold text-green-800"
                      >
                        {cert.refECOldFileName || `Certificate ${index + 1}`}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 transition p-1 h-auto"
                      title="Remove file"
                      onClick={() => {
                        setTempEduFiles((prev) => [
                          ...prev,
                          {
                            id: cert.refECId,
                            file_name: cert.refECFileName,
                            old_file_name: cert.refECOldFileName,
                            status: "delete" as const,
                          },
                        ]);
                        setFormData((prev) =>
                          prev
                            ? {
                                ...prev,
                                educationCertificateFiles:
                                  prev.educationCertificateFiles.filter(
                                    (_, i) => i !== index
                                  ),
                              }
                            : null
                        );
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          {/* Display Newly Added Education Certificates */}
          {files.education_certificate.length > 0 && (
            <div className="mt-3 flex flex-col gap-3">
              {files.education_certificate.map((file, index) => (
                <div
                  key={`new-${index}`}
                  className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-3 w-4/5 truncate">
                    <div className="bg-blue-100 p-2 rounded-md">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <span
                      title={file.name}
                      className="truncate font-semibold text-blue-800"
                    >
                      {file.name}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 transition p-1 h-auto"
                    title="Remove file"
                    onClick={() => {
                      setFiles((prev) => ({
                        ...prev,
                        education_certificate:
                          prev.education_certificate.filter(
                            (_, i) => i !== index
                          ),
                      }));
                      setTempEduFiles((prevTemp) =>
                        prevTemp.filter(
                          (tempFile) =>
                            tempFile.old_file_name !== file.name ||
                            tempFile.status !== "new"
                        )
                      );
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {error && (
        <Alert ref={errorRef} variant="destructive" className="mt-4">
          <CircleAlert className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-center mt-6">
        <Button
          className="bg-[#A3B1A1] hover:bg-[#81927f] w-full lg:w-2/5"
          type="submit"
          disabled={saveLoading || loading}
        >
          {saveLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};

export default EditWellthGreenManager;
