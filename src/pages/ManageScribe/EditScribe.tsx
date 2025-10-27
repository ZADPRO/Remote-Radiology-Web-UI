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
// import { parseLocalDate } from "@/lib/dateUtils";
import { uploadService } from "@/services/commonServices";
import { ListSpecificScribe, scribeService } from "@/services/scribeService";
import { Camera, FileText, Pencil, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface EditScribeProps {
  scribeId: number;
  setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onUpdate: () => void;
}

interface TempFilesState {
  profile_img: File | null;
  aadhar: File | null;
  drivers_license: File | null;
  pan: File | null;
  education_certificate: File[];
}

interface TempUpdateFiles {
  id?: number;
  file_name: string;
  old_file_name: string;
  status: "new" | "delete"; // you can expand status as needed
}

const EditScribe: React.FC<EditScribeProps> = ({
  scribeId,
  setIsEditDialogOpen,
  onUpdate,
}) => {
  console.log(scribeId);

  const [loading, setLoading] = useState<boolean>(false);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null); // State for error messages
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [error]);

  const [formData, setFormData] = useState<ListSpecificScribe>({
    aadharFile: {
      base64Data: "",
      contentType: "",
    },
    drivingLicenseFile: {
      base64Data: "",
      contentType: "",
    },
    panFile: {
      base64Data: "",
      contentType: "",
    },
    profileImgFile: {
      base64Data: "",
      contentType: "",
    },
    educationCertificateFiles: [],

    refCODOEmail: "",
    refCODOPhoneNo1: "",
    refCODOPhoneNo1CountryCode: "",

    refRTId: 0,
    refSDAadhar: "",
    refSDDrivingLicense: "",
    refSDPan: "",

    refUserAgreementStatus: false,
    refUserCustId: "",
    refUserDOB: "",
    refUserFirstName: "",
    refUserId: 0,
    refUserLastName: "",
    refUserProfileImg: "",
    refUserStatus: false,
  });

  const [files, setFiles] = useState<TempFilesState>({
    profile_img: null,
    aadhar: null,
    drivers_license: null,
    pan: null,
    education_certificate: [],
  });

  const [tempEduFiles, setTempEduFiles] = useState<TempUpdateFiles[]>([]);
  const getSpecificScribe = async () => {
    setLoading(true);
    try {
      const res = await scribeService.listSpecificScribe(scribeId);
      console.log(res);
      setFormData(res.data[0]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSpecificScribe();
  }, [scribeId]);

  const handleProfileImageUpload = async (file: File) => {
    const formDataImg = new FormData();
    formDataImg.append("profileImage", file);

    try {
      const response = await uploadService.uploadImage({
        formImg: formDataImg,
      });
      console.log("Profile image upload response:", response);

      if (response.status) {
        setFormData((prev) => ({
          ...prev,
          refUserProfileImg: response.fileName,
        }));

        setFiles((prev) => ({
          ...prev,
          profile_img: file,
        }));
      } else {
        setError("Profile image upload failed");
      }
    } catch (err) {
      setError("Error uploading profile image");
    }
  };
  const handleSingleFileUpload = async ({
    file,
    fieldName, // e.g., "aadhar_file" or "pan_file"
    tempFileKey, // e.g., "aadhar" or "pan"
  }: {
    file: File;
    fieldName: keyof ListSpecificScribe;
    tempFileKey: keyof TempFilesState;
  }) => {
    const formDataObj = new FormData();
    formDataObj.append("file", file);

    try {
      const response = await uploadService.uploadFile({
        formFile: formDataObj,
      });

      if (response.status) {
        setFormData((prev) => ({
          ...prev,
          [fieldName]: response.fileName, // just path to backend
        }));

        setFiles((prev) => ({
          ...prev,
          [tempFileKey]: file, // store full File object for UI
        }));
      } else {
        setError(`Upload failed for file: ${file.name}`);
      }
    } catch (err) {
      setError(`Error uploading file: ${file.name}`);
    }
  };

  const uploadAndStoreFile = async (
    file: File,
    tempField: keyof TempFilesState,
    uploadFn = uploadService.uploadFile // optional, default upload function
  ): Promise<void> => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await uploadFn({ formFile: formData });

      if (response.status) {
        const result: TempUpdateFiles = {
          file_name: response.fileName,
          old_file_name: file.name,
          status: "new" as const,
        };

        console.log(result);

        if (tempField == "education_certificate") {
          setTempEduFiles((prev) => [...prev, result]);
        }

        setFiles((prev) => ({
          ...prev,
          [tempField]: [...((prev[tempField] as File[]) || []), file],
        }));
      } else {
        setError(`Upload failed for file: ${file.name}`);
      }
    } catch (err) {
      setError(`Error uploading file: ${file.name}`);
    }
  };

  if (loading) return <LoadingOverlay />;

  if (!formData) return <div className="p-4">No scribe data found.</div>;

  function downloadFile(
    base64Data: string,
    contentType: string,
    filename: string
  ) {
    // Convert base64 to byte array
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length)
      .fill(0)
      .map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);

    // Create blob and URL
    const blob = new Blob([byteArray], { type: contentType });
    const url = URL.createObjectURL(blob);

    // Create a temporary <a> and trigger click
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}`; // Desired filename
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Optional: revoke URL after some delay
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const handleSubmit = async () => {
    setSaveLoading(true);
    setError("");

    try {
      const payload = {
        id: formData.refUserId,
        firstname: formData.refUserFirstName,
        lastname: formData.refUserLastName,
        email: formData.refCODOEmail,
        dob: formData.refUserDOB,
        phone: formData.refCODOPhoneNo1,
        phoneCountryCode: formData.refCODOPhoneNo1CountryCode,
        pan: formData.refSDPan,
        aadhar: formData.refSDAadhar,
        drivers_license: formData.refSDDrivingLicense,
        profile_img: formData.refUserProfileImg,
        status: formData.refUserStatus,
        education_certificate: tempEduFiles,
      };
      console.log(payload);
      const res = await scribeService.updateScribe(payload);
      console.log(res);
      if (res.status) {
        toast.success(res.message);
        setIsEditDialogOpen(false);
        onUpdate();
      } else {
        setError(res.message);
      }
    } catch (error) {
      console.log(error);
      setError("Failed to update scribe. Please try again.");
    } finally {
      setLoading(false);
      setSaveLoading(false);
    }
  };

  console.log(tempEduFiles);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="w-full"
    >
      {loading && <LoadingOverlay />}
      <div className="w-full flex flex-col lg:flex-row items-center justify-start p-2 gap-6 rounded-xl">
        {formData.refUserProfileImg.length == 0 ? (
          <>
            <div className="relative w-32 h-32 lg:w-45 lg:h-45 flex flex-col items-center justify-center bg-[#A3B1A1] rounded-full text-white shadow-md hover:bg-[#81927f] cursor-pointer">
              <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                <Camera className="w-16 h-16" />
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.svg"
                  className="hidden"
                  id="profile-img-upload"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    const maxSize = 5 * 1024 * 1024;
                    if (file.size > maxSize) {
                      setError("Image must be less than 5MB.");
                      return;
                    }

                    handleProfileImageUpload(file);
                  }}
                />
              </label>
            </div>
            {/* <span className="text-sm font-medium text-foreground">
                Add Photo
              </span> */}
          </>
        ) : (
          <div className="relative w-32 h-32 lg:w-45 lg:h-45">
            <img
              id="profile-img"
              src={
                files.profile_img
                  ? URL.createObjectURL(files.profile_img)
                  : `data:${formData.profileImgFile?.contentType};base64,${formData.profileImgFile?.base64Data}`
              }
              alt="Preview"
              className="w-full h-full rounded-full object-cover border-4 border-[#A3B1A1] shadow"
            />
            <label className="absolute bottom-1 right-1 bg-[#A3B1A1] rounded-full p-2 shadow cursor-pointer hover:bg-[#728270]">
              <Pencil className="w-5 h-5 text-background" />
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.svg"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const maxSize = 5 * 1024 * 1024;
                  if (file.size > maxSize) {
                    setError("Image must be less than 5MB.");
                    return;
                  }

                  handleProfileImageUpload(file);
                }}
              />
            </label>
          </div>
        )}
        <div className="flex flex-col gap-4 w-full lg:w-1/3">
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm" htmlFor="Scribe ID">
              Scribe ID
            </Label>
            <Input
              id="Scribe ID"
              type="text"
              className="bg-white"
              disabled
              value={formData.refUserCustId}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5 w-full relative">
            <Label className="text-sm" htmlFor="status">
              Status <span className="text-red-500">*</span>
            </Label>
            <Select
              value={String(formData.refUserStatus)}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  refUserStatus: value === "true",
                }))
              }
              required
            >
              <SelectTrigger id="gender" className="bg-white w-full">
                <SelectValue placeholder="Select Status" />
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
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="firstname"
              type="text"
              placeholder="Enter First Name"
              className="bg-white"
              value={formData.refUserFirstName || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  refUserFirstName: e.target.value,
                }))
              }
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm" htmlFor="email">
              E-Mail <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              className="bg-white"
              value={formData.refCODOEmail || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  refCODOEmail: e.target.value,
                }))
              }
              required
              disabled
            />
          </div>
          <div className="flex flex-col gap-1.5 w-full">
            <Label className="text-sm font-medium" htmlFor="aadhar-upload">
              Aadhar <span className="text-red-500">*</span>
            </Label>
            <Input
              id="aadhar"
              type="text"
              placeholder="Enter Aadhar Number"
              className="bg-white"
              value={formData.refSDAadhar || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  refSDAadhar: e.target.value,
                }))
              }
              required
            />

            {/* <FileUploadButton
              id="aadhar-upload"
              label="Upload Aadhar"
              required={true}
              isFilePresent={formData.refSDAadhar.length > 0}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (file.size > 5 * 1024 * 1024) {
                    setError("File must be less than 5MB.");
                    return;
                  }
                  handleSingleFileUpload({
                    file,
                    fieldName: "refSDAadhar",
                    tempFileKey: "aadhar",
                  });
                }
              }}
            /> */}

            {/* Show uploaded or existing Aadhar file */}
            {/* {files.aadhar ? (
              <div className="mt-2 flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-all">
                <div className="bg-blue-100 p-2 rounded-md">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <span className="truncate text-sm font-medium text-blue-800">
                  {files.aadhar.name}
                </span>
              </div>
            ) : (
              formData.refSDAadhar &&
              formData.aadharFile?.base64Data && (
                <div
                  className="mt-2 flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-all cursor-pointer"
                  onClick={() =>
                    downloadFile(
                      formData.aadharFile.base64Data,
                      formData.aadharFile.contentType,
                      "Aadhar_File"
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
              )
            )} */}
          </div>
          <div className="flex flex-col gap-1.5 w-full">
            <Label
              className="text-sm font-medium"
              htmlFor="drivers-license-upload"
            >
              Driving License
            </Label>

            <FileUploadButton
              id="license-upload"
              label="Upload License"
              isFilePresent={!!formData.refSDDrivingLicense}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (file.size > 5 * 1024 * 1024) {
                    setError("File must be less than 5MB.");
                    return;
                  }

                  handleSingleFileUpload({
                    file,
                    fieldName: "refSDDrivingLicense",
                    tempFileKey: "drivers_license",
                  });
                }
              }}
            />

            {/* Show uploaded or existing Driving License file */}
            {files.drivers_license ? (
              <div className="mt-2 flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-all">
                <div className="bg-blue-100 p-2 rounded-md">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <span className="truncate text-sm font-medium text-blue-800">
                  {files.drivers_license.name}
                </span>
              </div>
            ) : (
              formData.refSDDrivingLicense &&
              formData.drivingLicenseFile && (
                <div
                  className="mt-2 flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-all cursor-pointer"
                  onClick={() =>
                    downloadFile(
                      formData.drivingLicenseFile.base64Data,
                      formData.drivingLicenseFile.contentType,
                      "drivers_license"
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
              )
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 2xl:gap-6 w-full lg:w-1/2">
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm" htmlFor="phone">
              Contact Number <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-2 relative">
              <Select
                value={formData.refCODOPhoneNo1CountryCode || "+1"}
                onValueChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    refCODOPhoneNo1CountryCode: e,
                  }))
                }
                disabled
              >
                <SelectTrigger disabled className="bg-white">
                  <SelectValue placeholder="Country Code" />
                </SelectTrigger>
                <SelectContent>
                  {/* <SelectItem value="+1">USA (+1)</SelectItem> */}
                  <SelectItem value="+91">IN (+91)</SelectItem>
                  {/* Add more country codes as needed */}
                </SelectContent>
              </Select>
              <Input
                id="phone"
                type="number"
                placeholder="Enter Phone Number"
                className="bg-white flex-1"
                value={formData.refCODOPhoneNo1 || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 10) {
                    setFormData((prev) => ({
                      ...prev,
                      refCODOPhoneNo1: e.target.value,
                    }));
                  }
                }}
                required
                disabled
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 w-full relative">
            <Label className="text-sm" htmlFor="dob">
              Date Of Birth <span className="text-red-500">*</span>
            </Label>
            {/* <DatePicker
              value={
                formData.refUserDOB
                  ? parseLocalDate(formData.refUserDOB)
                  : undefined
              }
              className="pointer-events-auto"
              onChange={(val) => {
                console.log(val);
                setFormData((prev) => ({
                  ...prev,
                  refUserDOB: val?.toLocaleDateString("en-CA") || "",
                }));
              }}
              required
            /> */}
            <DefaultDatePicker
              value={formData.refUserDOB}
              onChange={(val) => {
                setFormData((prev) => ({
                  ...prev,
                  refUserDOB: val.target.value,
                }));
              }}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-sm" htmlFor="pan-upload">
              PAN <span className="text-red-500">*</span>
            </Label>

            <Input
              id="pan"
              type="text"
              placeholder="Enter PAN"
              className="bg-white"
              value={formData.refSDPan || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  refSDPan: e.target.value,
                }))
              }
              required
            />

            {/* <FileUploadButton
              id="pan-upload"
              label="Upload PAN"
              required={false}
              isFilePresent={!!formData.refSDPan}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (file.size > 5 * 1024 * 1024) {
                    setError("File must be less than 5MB.");
                    return;
                  }
                  handleSingleFileUpload({
                    file,
                    fieldName: "refSDPan",
                    tempFileKey: "pan",
                  });
                }
              }}
            /> */}

            {/* Show uploaded or existing PAN file */}
            {/* {files.pan ? (
              <div className="mt-2 flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-all">
                <div className="bg-blue-100 p-2 rounded-md">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <span className="truncate text-sm font-medium text-blue-800">
                  {files.pan.name}
                </span>
              </div>
            ) : (
              formData.refSDPan &&
              formData.panFile && (
                <div
                  className="mt-2 flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-all cursor-pointer"
                  onClick={() =>
                    downloadFile(
                      formData.panFile.base64Data,
                      formData.panFile.contentType,
                      "Pan_File"
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
              )
            )} */}
          </div>
        </div>
      </div>

      <h1 className="text-2xl font-bold my-4">Professional Details</h1>

      <div className="flex flex-col lg:flex-row items-start justify-between gap-4 lg:gap-15 w-full">
        <div className="flex flex-col gap-4 2xl:gap-6 w-full lg:w-1/2">
          <div className="flex flex-col gap-1.5 w-full">
            <Label className="text-sm font-medium" htmlFor="license-upload">
              Education Certificate
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
                      await uploadAndStoreFile(file, "education_certificate");
                    }
                  }
                }
              }}
            />

            {/* Uploaded License Files */}
            {files.education_certificate?.length > 0 && (
              <div className="mt-3 flex flex-col gap-3">
                {files.education_certificate.map((file, index) => (
                  <div
                    key={index}
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
                    <button
                      type="button"
                      onClick={() => {
                        setFiles((prev) => ({
                          ...prev,
                          education_certificate:
                            prev.education_certificate?.filter(
                              (_, i) => i !== index
                            ) || [],
                        }));
                        setTempEduFiles((prev) =>
                          prev.filter(
                            (education_certificate) =>
                              education_certificate.old_file_name !== file.name
                          )
                        );
                      }}
                      className="text-red-500 hover:text-red-700 transition"
                      title="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Existing License Files */}
            {formData.educationCertificateFiles?.length > 0 && (
              <div className="mt-3 flex flex-col gap-3">
                {formData.educationCertificateFiles.map((file, index) => (
                  <div
                    key={`existing-license-${index}`}
                    className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition-all group cursor-pointer"
                  >
                    <div
                      className="flex items-center gap-3 w-4/5 truncate"
                      onClick={() =>
                        downloadFile(
                          file.educationCertificateFile.base64Data,
                          file.educationCertificateFile.contentType,
                          file.refECOldFileName
                        )
                      }
                    >
                      <div className="bg-green-100 p-2 rounded-md">
                        <FileText className="w-5 h-5 text-green-600" />
                      </div>
                      <span
                        title={file.refECOldFileName}
                        className="truncate font-semibold text-green-800"
                      >
                        {file.refECOldFileName ||
                          `Existing Education Certificate ${index + 1}`}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => {
                          const updatedLicenseFiles =
                            prev.educationCertificateFiles?.filter(
                              (_, i) => i !== index
                            );
                          return {
                            ...prev,
                            educationCertificateFiles:
                              updatedLicenseFiles || [],
                          };
                        });

                        const data = {
                          id: file.refECId,
                          file_name: file.refECFileName,
                          old_file_name: file.refECOldFileName,
                          status: "delete" as const,
                        };
                        setTempEduFiles((prev) => [...prev, data]);
                      }}
                      className="text-red-500 hover:text-red-700 transition"
                      title="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <Button
          className="bg-[#A3B1A1] hover:bg-[#81927f] w-full lg:w-2/5"
          type="submit"
          disabled={loading}
        >
          {saveLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {error && (
        <Alert ref={errorRef} variant="destructive" className="mt-2">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </form>
  );
};

export default EditScribe;
