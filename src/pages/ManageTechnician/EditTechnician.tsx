import DatePicker from "@/components/date-picker";
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
import { uploadService } from "@/services/commonServices";
import { ListSpecificTechnician, technicianService } from "@/services/technicianServices";
import { Camera, FileText, Pencil, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface EditTechnicianProps {
  scanCenterId: number;
  technicianId: number;
  setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onUpdate: () => void;
}

interface TempFilesState {
  profile_img: File | null;
  drivers_license: File | null;
  license_files: File[];
  digital_signature: File | null;
}

interface TempUpdateFiles {
  id?: number;
  file_name: string;
  old_file_name: string;
  status: "new" | "delete"; // you can expand status as needed
}

const EditTechnician: React.FC<EditTechnicianProps> = ({
  scanCenterId,
  technicianId,
  setIsEditDialogOpen,
  onUpdate,
}) => {
  console.log(technicianId);

  const [loading, setLoading] = useState<boolean>(false);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null); // State for error messages
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [error]);

  const [formData, setFormData] = useState<ListSpecificTechnician>({
  drivingLicenseFile: {
    base64Data: "",
    contentType: "",
  },
  profileImgFile: {
    base64Data: "",
    contentType: "",
  },
  digitalSignatureFile: {
    base64Data: "",
    contentType: "",
  },

  licenseFiles: [],

  refCODOEmail: "",
  refCODOPhoneNo1: "",
  refCODOPhoneNo1CountryCode: "",

  refRTId: 0,
  refTDDrivingLicense: "",
  refTDDigitalSignature: "",
  refTDSSNo: "",
  refTDTrainedEaseQTStatus: false,

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
    drivers_license: null,
    license_files: [],
    digital_signature: null,
  });

  const [tempLicense, setTempLicense] = useState<TempUpdateFiles[]>([]);
  const getSpecificTechnician = async () => {
    setLoading(true);
    try {
      const res = await technicianService.getSpecificTechnician(scanCenterId, technicianId);
      console.log(res);
      setFormData(res.data[0]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSpecificTechnician();
  }, [technicianId]);

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
    fieldName: keyof ListSpecificTechnician;
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

        if (tempField == "license_files") {
          setTempLicense((prev) => [...prev, result]);
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

  if (!formData) return <div className="p-4">No technician data found.</div>;

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
    a.download = `${filename}.pdf`; // Desired filename
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Optional: revoke URL after some delay
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleDigitalSignatureUpload = async (
      file: File,
    ) => {
      const formDataImg = new FormData();
      formDataImg.append("profileImage", file);
      setError("");
      try {
        const response = await uploadService.uploadImage({
          formImg: formDataImg,
        });
    
        if (response.status) {
          setFormData((prev) => ({
            ...prev,
            refRADigitalSignature: response.fileName,
            digitalSignatureFile: null,
          }));
    
          setFiles((prev) => ({
            ...prev,
            digital_signature: file,
          }));
        } else {
          setError("Digital signature upload failed.");
        }
      } catch (err) {
        setError("Error uploading digital signature.");
      }
    };

    const handleRemoveSingleFile = (key: "profile_img" | "pan" | "aadhar" | "digital_signature") => {
    setFiles((prev) => ({
      ...prev,
      [key]: null,
    }));

    setFormData((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        [key]: key === "profile_img" ? "" : null,
      };
    });
  };

  const handleSubmit = async () => {
    setSaveLoading(true);
    setError("");

    try {
      const payload = {
        id: formData.refUserId,
        firstname: formData.refUserFirstName,
        lastname: formData.refUserLastName,
        profile_img: formData.refUserProfileImg,
        email: formData.refCODOEmail,
        dob: formData.refUserDOB,
        phone: formData.refCODOPhoneNo1,
        phoneCountryCode: formData.refCODOPhoneNo1CountryCode,
        social_security_no: formData.refTDSSNo,
        trained_ease_qt: formData.refTDTrainedEaseQTStatus,
        drivers_license: formData.refTDDrivingLicense,
        status: formData.refUserStatus,
        license_files: tempLicense,
        digital_signature: formData.refTDDigitalSignature,
      };
      console.log(payload);
      const res = await technicianService.updateTechnician(payload);
      console.log(res);
      if (res.status) {
        toast.success(res.message);
        setIsEditDialogOpen(false);
        onUpdate();
      }
      else {
        setError(res.message);
      }
    } catch (error) {
      console.log(error);
      setError("Failed to update Technician. Please try again.");
    } finally {
      setLoading(false);
      setSaveLoading(false);
    }
  };

  console.log(tempLicense);

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
            <Label className="text-sm" htmlFor="Technician ID">
              Technician ID
            </Label>
            <Input
              id="Technician ID"
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
                  refUserStatus: value == "true",
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

          <div className="flex flex-col gap-1.5">
            <Label className="text-sm " htmlFor="ss_no">
              Social Security Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="ss_no"
              type="text"
              placeholder="Enter Social Security Number"
              className="bg-white"
              value={formData.refTDSSNo}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  refTDSSNo: e.target.value,
                }))
              }
              required
            />
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
                <SelectTrigger
                  disabled
                  className="bg-white "
                >
                  <SelectValue placeholder="Country Code" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="+1">USA (+1)</SelectItem>
                  {/* <SelectItem value="+91">IN (+91)</SelectItem> */}
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
            <DatePicker
              value={
                formData.refUserDOB ? new Date(formData.refUserDOB) : undefined
              }
              className="pointer-events-auto"
              onChange={(val) => {
                console.log(val);
                setFormData((prev) => ({
                  ...prev,
                  refUserDOB: val?.toLocaleDateString("en-CA") || "",
                }));
              }}
            />
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
              isFilePresent={!!formData.refTDDrivingLicense}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (file.size > 5 * 1024 * 1024) {
                    setError("File must be less than 5MB.");
                    return;
                  }

                  handleSingleFileUpload({
                    file,
                    fieldName: "refTDDrivingLicense",
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
              formData.refTDDrivingLicense &&
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
      </div>

      <h1 className="text-2xl font-bold my-4">Professional Details</h1>

      <div className="flex flex-col lg:flex-row items-start justify-between gap-4 lg:gap-15 w-full">
        <div className="flex flex-col gap-4 2xl:gap-6 w-full lg:w-1/2">
          <div className="flex flex-col gap-1.5 w-full">
            <Label className="text-sm font-medium" htmlFor="license-upload">
              License <span className="text-red-500">*</span>
            </Label>

            <FileUploadButton
                            id="license-upload"
                            multiple
                            required={
                              !(
                                formData.licenseFiles?.length > 0 ||
                                files.license_files.length > 0
                              )
                            }
                            isFilePresent={files.license_files.length > 0}
                            onChange={async (e) => {
                              const filesSelected = e.target.files;
                              if (!filesSelected) return;
            
                              const selectedFiles = Array.from(filesSelected);
                              const filteredFiles = selectedFiles.filter(
                                (file) =>
                                  file.size <= 10 * 1024 * 1024 &&
                                  !files.license_files.some((f) => f.name === file.name)
                              );
            
                              for (const file of filteredFiles) {
                                await uploadAndStoreFile(file, "license_files");
                              }
                            }}
                          />

            {/* Uploaded License Files */}
            {files.license_files?.length > 0 && (
              <div className="mt-3 flex flex-col gap-3">
                {files.license_files.map((file, index) => (
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
                          license_files:
                            prev.license_files?.filter((_, i) => i !== index) ||
                            [],
                        }));
                        setTempLicense((prev) =>
                          prev.filter(
                            (license_files) =>
                              license_files.old_file_name !== file.name
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
            {formData.licenseFiles?.length > 0 && (
              <div className="mt-3 flex flex-col gap-3">
                {formData.licenseFiles.map((file, index) => (
                  <div
                    key={`existing-license-${index}`}
                    className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition-all group cursor-pointer"
                  >
                    <div
                      className="flex items-center gap-3 w-4/5 truncate"
                      onClick={() =>
                        downloadFile(
                          file.lFileData.base64Data,
                          file.lFileData.contentType,
                          file.refLOldFileName
                        )
                      }
                    >
                      <div className="bg-green-100 p-2 rounded-md">
                        <FileText className="w-5 h-5 text-green-600" />
                      </div>
                      <span
                        title={file.refLOldFileName}
                        className="truncate font-semibold text-green-800"
                      >
                        {file.refLOldFileName ||
                          `Existing Education Certificate ${index + 1}`}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => {
                          const updatedLicenseFiles = prev.licenseFiles?.filter(
                            (_, i) => i !== index
                          );
                          return {
                            ...prev,
                            license_files:
                              updatedLicenseFiles || [],
                          };
                        });

                        const data = {
                          id: file.refLId,
                          file_name: file.refLFileName,
                          old_file_name: file.refLOldFileName,
                          status: "delete" as const,
                        };
                        setTempLicense((prev) => [...prev, data]);
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

        <div className="flex flex-col gap-4 2xl:gap-6 w-full lg:w-1/2">
          <div className="flex flex-col gap-1.5 w-full">
                        <Label className="text-sm" htmlFor="digital-signature-upload">
                          Digital Signature <span className="text-red-500">*</span>
                        </Label>
          
                        <FileUploadButton
                id="digital-signature-upload"
                label="Upload Digital Signature"
                accept="image/png, image/jpeg, image/jpg"
                required={
                  !formData.refTDDigitalSignature && !files.digital_signature
                }
                isFilePresent={!!files.digital_signature}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const maxSize = 5 * 1024 * 1024; // 5MB
                  if (file.size > maxSize) {
                    setError("Digital signature image must be less than 5MB.");
                    return;
                  }

                  handleDigitalSignatureUpload(file); // updates files.digital_signature
                  setError(null);
                }}
              />
          
                        {/* Show newly uploaded signature */}
                        {files.digital_signature && (
                          <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between border border-gray-300 rounded-lg px-3 py-2 hover:shadow-sm transition bg-blue-100 text-sm text-gray-800 font-medium gap-2">
                            <img
                              src={URL.createObjectURL(files.digital_signature)}
                              alt="Digital Signature"
                              className="h-16 w-auto rounded border object-contain"
                            />
          
                            <button
                              type="button"
                              onClick={() => handleRemoveSingleFile("digital_signature")}
                              className="text-red-500 hover:text-red-700 cursor-pointer self-start sm:self-auto"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}
          
                        {/* Show existing digital signature from backend */}
                        {!files.digital_signature &&
                          formData.refTDDigitalSignature &&
                          formData.digitalSignatureFile && (
                            <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between border border-gray-300 rounded-lg px-3 py-2 hover:shadow-sm transition bg-green-100 text-sm text-green-800 font-medium gap-2">
                              <img
                                src={`data:${formData.digitalSignatureFile.contentType};base64,${formData.digitalSignatureFile.base64Data}`}
                                alt="Digital Signature"
                                className="h-16 w-auto rounded border object-contain"
                              />
          
                              <button
                                type="button"
                                onClick={() => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    refTDDigitalSignature: "",
                                    digitalSignatureFile: null,
                                  }));
                                }}
                                className="text-red-500 hover:text-red-700 cursor-pointer self-start sm:self-auto"
                              >
                                <X className="w-4 h-4" />
                              </button>
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

export default EditTechnician;