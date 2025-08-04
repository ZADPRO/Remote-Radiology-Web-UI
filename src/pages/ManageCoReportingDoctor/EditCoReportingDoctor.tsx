import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import LoadingOverlay from "@/components/ui/CustomComponents/loadingOverlay";
import { Input } from "@/components/ui/input"; // Import Input
import { Label } from "@/components/ui/label"; // Import Label
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Import Select components
import DatePicker from "@/components/date-picker";
import { Camera, FileText, Pencil, X } from "lucide-react";
import { uploadService } from "@/services/commonServices";
import { toast } from "sonner";
import { doctorService, ListSpecificCoDoctor } from "@/services/doctorService";
import FileUploadButton from "@/components/ui/CustomComponents/FileUploadButton";
import { Switch } from "@/components/ui/switch";


// Define the props interface for EditCoReportingDoctor
interface EditCoReportingDoctorProps {
    scanCenterId: number;
  scanCenterDoctorId: number;
  setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onUpdate: () => void;
}
// Interface for temporary file storage
interface TempFilesState {
  profile_img: File | null;
  license_files: File[];
  drivers_license: File | null;
  malpracticeinsureance_files: File[];
  digital_signature: File | null;
}

interface TempLicense {
  id?: number;
  file_name: string;
  old_file_name: string;
  status: "new" | "delete"; // you can expand status as needed
}

const EditCoReportingDoctor: React.FC<EditCoReportingDoctorProps> = ({
    scanCenterId,
  scanCenterDoctorId,
  setIsEditDialogOpen,
  onUpdate,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null); // State for error messages

  console.log(error);

  const [tempLicenses, setTempLicenses] = useState<TempLicense[]>([]);
    const [tempMalpractice, setTempMalpractice] = useState<TempLicense[]>([]);

  const [formData, setFormData] = useState<ListSpecificCoDoctor>({
  profileImgFile: {
    base64Data: "",
    contentType: "",
  },
  digitalSignatureFile: {
    base64Data: "",
    contentType: "",
  },
  driversLicenseFile: {
    base64Data: "",
    contentType: "",
  },

  licenseFiles: [],
  malpracticeinsureance_files: [],
  medicalLicenseSecurity: [],

  aadharFile: {
    base64Data: "",
    contentType: "",
  }, // optional based on earlier structure
  panFile: {
    base64Data: "",
    contentType: "",
  },    // optional based on earlier structure

  refCODOEmail: "",
  refCODOPhoneNo1: "",
  refCODOPhoneNo1CountryCode: "",

  refCDNPI: "",
  refCDSocialSecurityNo: "",

  digital_signature: "",
  drivers_license: "",
  Specialization: "",

  refRTId: 0,
  refUserCustId: "",
  refUserDOB: "",
  refUserFirstName: "",
  refUserLastName: "",
  refUserId: 0,
  refUserProfileImg: "",
  refUserStatus: false,
  refCDEaseQTReportAccess: false
});


  const [files, setFiles] = useState<TempFilesState>({
      profile_img: null,
      license_files: [],
      drivers_license: null,
      malpracticeinsureance_files: [],
      digital_signature: null,
    });

  const getSpecificCoDoctor = async () => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      const res = await doctorService.getSpecificCoDoctor(
        scanCenterId, scanCenterDoctorId
      );
      console.log("Fetching Co-Doctor...", res);

      setFormData(res.data[0]);
    } catch (error: any) {
      console.error("Error fetching co-doctor:", error);
      setError(error.message || "Failed to fetch co-doctor details.");
    } finally {
      setLoading(false);
    }
  };

  console.log(formData);
  console.log(files);

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
    fieldName: keyof ListSpecificCoDoctor;
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

  useEffect(() => {
    getSpecificCoDoctor();
  }, [scanCenterDoctorId]); // Re-run effect if scanCenterDoctorId changes

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
        drivers_license_no: formData.drivers_license,
        social_security_no: formData.refCDSocialSecurityNo,
        drivers_license: formData.drivers_license,
        Specialization: formData.Specialization,
        npi: formData.refCDNPI,
        status: formData.refUserStatus,
        license_files: tempLicenses,
        malpracticeinsureance_files: tempMalpractice,
        digital_signature:  formData.digital_signature,
        easeQTReportAccess: formData.refCDEaseQTReportAccess
      };
      console.log("payload",payload);
      const res = await doctorService.updateCoDoctor(payload);
      console.log(res);
      if (res.status) {
        toast.success(res.message);
        setIsEditDialogOpen(false);
        onUpdate();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setSaveLoading(false);
    }
  };

  if(loading) return (<LoadingOverlay />);

  if (!formData) return <div className="p-4">No Co-Doctor data found.</div>;

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
  }

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
          const result: TempLicense = {
            file_name: response.fileName,
            old_file_name: file.name,
            status: "new" as const,
          };
  
          console.log(result);
  
          if (tempField == "license_files") {
            setTempLicenses((prev) => [...prev, result]);
          }
  
          if (tempField == "malpracticeinsureance_files") {
            setTempMalpractice((prev) => [...prev, result]);
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
              digital_signature: response.fileName,
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

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="w-full"
      >
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
              <Label className="text-sm" htmlFor="CoDoctorID">
                Co-Doctor ID
              </Label>
              <Input
                id="CoDoctorID"
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
                    refUserStatus: Boolean(value === "true"),
                  }))
                }
                required
              >
                <SelectTrigger id="status" className="bg-white w-full">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">InActive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="self-start mt-2 w-full">
                          <div className="flex items-center justify-between gap-4 px-3 py-2 bg-muted shadow rounded-md">
                            <div>
                              <Label className="font-semibold text-base">
                                Ease QT 10/10 Report Access
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                Toggle to enable access
                              </p>
                            </div>
                            <Switch
                              id="qtAccess"
                              className="cursor-pointer"
                              checked={formData.refCDEaseQTReportAccess}
                              onCheckedChange={(checked: boolean) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  refCDEaseQTReportAccess: checked,
                                }))
                              }
                            />
                          </div>
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
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-sm " htmlFor="social_security_no">
                Social Security Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="social_security_no"
                type="text"
                placeholder="Enter Social Security Number"
                className="bg-white"
                value={formData.refCDSocialSecurityNo}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    refCDSocialSecurityNo: e.target.value,
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
                >
                  <SelectTrigger
                    disabled
                    className="bg-white disabled:opacity-100 disabled:pointer-events-none"
                  >
                    <SelectValue placeholder="Country Code" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+1">USA (+1)</SelectItem>
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
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5 w-full relative">
              <Label className="text-sm" htmlFor="dob">
                Date Of Birth <span className="text-red-500">*</span>
              </Label>
              <DatePicker
                value={
                  formData.refUserDOB
                    ? new Date(formData.refUserDOB)
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
              isFilePresent={!!formData.drivers_license}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (file.size > 5 * 1024 * 1024) {
                    setError("File must be less than 5MB.");
                    return;
                  }

                  handleSingleFileUpload({
                    file,
                    fieldName: "drivers_license",
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
                formData.drivers_license &&
                formData.driversLicenseFile && (
                  <div
                    className="mt-2 flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-all cursor-pointer"
                    onClick={() =>
                      downloadFile(
                        formData.driversLicenseFile.base64Data,
                        formData.driversLicenseFile.contentType,
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
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm " htmlFor="npi">
                NPI <span className="text-red-500">*</span>
              </Label>
              <Input
                id="npi"
                type="text"
                placeholder="Enter NPI"
                className="bg-white"
                value={formData.refCDNPI}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, refCDNPI: e.target.value }))
                }
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm" htmlFor="specialization">
                Specialization <span className="text-red-500">*</span>
              </Label>
              <Input
                id="specialization"
                type="text"
                placeholder="Enter Specialization"
                className="bg-white"
                value={formData.Specialization || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    Specialization: e.target.value,
                  }))
                }
                required
              />
            </div>
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
                              prev.license_files?.filter(
                                (_, i) => i !== index
                              ) || [],
                          }));
                          setTempLicenses((prev) =>
                            prev.filter(
                              (license) => license.old_file_name !== file.name
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
                            `Existing License ${index + 1}`}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => {
                            const updatedLicenseFiles =
                              prev.licenseFiles?.filter((_, i) => i !== index);
                            return {
                              ...prev,
                              licenseFiles: updatedLicenseFiles || [],
                            };
                          });

                          const data = {
                            id: file.refLId,
                            file_name: file.refLFileName,
                            old_file_name: file.refLOldFileName,
                            status: "delete" as const,
                          };
                          setTempLicenses((prev) => [...prev, data]);
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
              <Label
                className="text-sm font-medium"
                htmlFor="malpractice-upload"
              >
                Malpractice Insurance <span className="text-red-500">*</span>
              </Label>

              <FileUploadButton
                id="malpractice-upload"
                label="Upload Malpractice Insurance"
                multiple
                required={formData.malpracticeinsureance_files.length === 0}
                isFilePresent={files.malpracticeinsureance_files.length > 0}
                onChange={async (e) => {
                  const filesSelected = e.target.files;
                  if (!filesSelected) return;

                  const selectedFiles = Array.from(filesSelected);
                  const filteredFiles = selectedFiles.filter(
                    (file) =>
                      file.size <= 5 * 1024 * 1024 &&
                      !files.malpracticeinsureance_files.some(
                        (f) => f.name === file.name
                      )
                  );

                  for (const file of filteredFiles) {
                    await uploadAndStoreFile(
                      file,
                      "malpracticeinsureance_files"
                    );
                  }
                }}
              />

              {/* Uploaded New Malpractice Insurance Files */}
              {files.malpracticeinsureance_files?.length > 0 && (
                <div className="mt-3 flex flex-col gap-3">
                  {files.malpracticeinsureance_files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center gap-3 w-4/5 truncate">
                        <div className="bg-blue-100 p-2 rounded-md">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <span
                          className="truncate font-semibold text-blue-800"
                          title={file.name}
                        >
                          {file.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFiles((prev) => ({
                            ...prev,
                            malpracticeinsureance_files:
                              prev.malpracticeinsureance_files?.filter(
                                (_, i) => i !== index
                              ) || [],
                          }));
                          setTempMalpractice((prev) =>
                            prev.filter((m) => m.old_file_name !== file.name)
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

              {/* Existing Malpractice Insurance Files from Backend */}
              {formData.malpracticeinsureance_files?.length > 0 && (
                <div className="mt-3 flex flex-col gap-3">
                  {formData.malpracticeinsureance_files.map((file, index) => (
                    <div
                      key={`existing-malpractice-${index}`}
                      className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition-all group cursor-pointer"
                    >
                      <div
                        className="flex items-center gap-3 w-4/5 truncate"
                        onClick={() =>
                          downloadFile(
                            file.MPFileData.base64Data,
                            file.MPFileData.contentType,
                            file.refMPOldFileName
                          )
                        }
                      >
                        <div className="bg-green-100 p-2 rounded-md">
                          <FileText className="w-5 h-5 text-green-600" />
                        </div>
                        <span
                          className="truncate font-semibold text-green-800"
                          title={file.refMPOldFileName}
                        >
                          {file.refMPOldFileName ||
                            `Malpractice File ${index + 1}`}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => {
                            const updated =
                              prev.malpracticeinsureance_files?.filter(
                                (_, i) => i !== index
                              );
                            return {
                              ...prev,
                              malpracticeinsureance_files: updated || [],
                            };
                          });

                          const data = {
                            id: file.refMPId,
                            file_name: file.refMPFileName,
                            old_file_name: file.refMPOldFileName,
                            status: "delete" as const,
                          };
                          setTempMalpractice((prev) => [...prev, data]);
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

            <div className="flex flex-col gap-1.5 w-full">
              <Label className="text-sm" htmlFor="digital-signature-upload">
                Digital Signature <span className="text-red-500">*</span>
              </Label>

              <FileUploadButton
                id="digital-signature-upload"
                label="Upload Digital Signature"
                accept="image/png, image/jpeg, image/jpg"
                required={
                  !formData.digital_signature && !files.digital_signature
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
                formData.digital_signature &&
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
                          refRADigitalSignature: "",
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
      </form>
    </>
  );
};

export default EditCoReportingDoctor;