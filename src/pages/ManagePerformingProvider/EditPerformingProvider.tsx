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
// import DatePicker from "@/components/date-picker";
import { Camera, FileText, Pencil, X } from "lucide-react";
import { uploadService } from "@/services/commonServices";
import { toast } from "sonner";
import {
  doctorService,
  ListSpecificPerformingProvider,
} from "@/services/doctorService";
import FileUploadButton from "@/components/ui/CustomComponents/FileUploadButton";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "../Routes/AuthContext";
// import { parseLocalDate } from "@/lib/dateUtils";
import DefaultDatePicker from "@/components/DefaultDatePicker";

// Define the props interface for EditPerformingProvider
interface EditPerformingProviderProps {
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

const EditPerformingProvider: React.FC<EditPerformingProviderProps> = ({
  scanCenterId,
  scanCenterDoctorId,
  setIsEditDialogOpen,
  onUpdate,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null); // State for error messages

  console.log(error);

  const { role } = useAuth();

  const [tempLicenses, setTempLicenses] = useState<TempLicense[]>([]);
  const [tempMalpractice, setTempMalpractice] = useState<TempLicense[]>([]);

  const [formData, setFormData] = useState<ListSpecificPerformingProvider>({
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
    }, // optional based on earlier structure

    refCODOEmail: "",
    refCODOPhoneNo1: "",
    refCODOPhoneNo1CountryCode: "",

    refDDNPI: "",
    refDDSocialSecurityNo: "",

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
    refDDEaseQTReportAccess: false,
    refDDNAsystemReportAccess: false,
  });

  const [files, setFiles] = useState<TempFilesState>({
    profile_img: null,
    license_files: [],
    drivers_license: null,
    malpracticeinsureance_files: [],
    digital_signature: null,
  });

  const getSpecificCenterAdmin = async () => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      const res = await doctorService.getSpecificPerformingProvider(
        scanCenterId,
        scanCenterDoctorId
      );
      console.log("Fetching Center Admin...", res);

      setFormData(res.data[0]);
    } catch (error: any) {
      console.error("Error fetching center admin:", error);
      setError(error.message || "Failed to fetch center admin details.");
    } finally {
      setLoading(false);
    }
  };

  console.log(formData);
  console.log(files);

  const handleProfileImageUpload = async (file: File) => {
    setError("");
    const formDataImg = new FormData();
    formDataImg.append("profileImage", file);

    try {
      const response = await uploadService.uploadImage(file);
      console.log("Profile image upload response:", response);

      if (response.status) {
        const cleanUrl = response.viewURL.includes("?")
          ? response.viewURL.split("?")[0]
          : response.viewURL;
        setFormData((prev) => ({
          ...prev,
          refUserProfileImg: cleanUrl,
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
    fieldName: keyof ListSpecificPerformingProvider;
    tempFileKey: keyof TempFilesState;
  }) => {
    setError("");
    const formDataObj = new FormData();
    formDataObj.append("file", file);

    try {
      const response = await uploadService.uploadFile(file);

      if (response.status) {
        const cleanUrl = response.viewURL.includes("?")
          ? response.viewURL.split("?")[0]
          : response.viewURL;
        setFormData((prev) => ({
          ...prev,
          [fieldName]: cleanUrl, // just path to backend
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

  //   const uploadAndStoreFile = async (
  //     file: File,
  //     tempField: keyof files,
  //     uploadFn = uploadService.uploadFile // optional, default upload function
  //   ): Promise<void> => {
  //     const formData = new FormData();
  //     formData.append("file", file);

  //     try {
  //       const response = await uploadFn({ formFile: formData });

  //       if (response.status) {
  //         const result: TempLicense = {
  //           file_name: response.fileName,
  //           old_file_name: file.name,
  //           status: "new" as const,
  //         };

  //         console.log(result);

  //         if (tempField == "license_files") {
  //           setTempLicenses((prev) => [...prev, result]);
  //         }

  //         if (tempField == "cv_files") {
  //           setTempCVs((prev) => [...prev, result]);
  //         }

  //         setFiles((prev) => ({
  //           ...prev,
  //           [tempField]: [...((prev[tempField] as File[]) || []), file],
  //         }));
  //       } else {
  //         setError(`Upload failed for file: ${file.name}`);
  //       }
  //     } catch (err) {
  //       setError(`Error uploading file: ${file.name}`);
  //     }
  //   };

  const handleRemoveSingleFile = (
    key: "profile_img" | "pan" | "aadhar" | "digital_signature"
  ) => {
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
    getSpecificCenterAdmin();
  }, [scanCenterDoctorId]); // Re-run effect if scanCenterAdminId changes

  const handleSubmit = async () => {
    setSaveLoading(true);
    setError("");

    const cleanUrl = formData.refUserProfileImg.includes("?")
      ? formData.refUserProfileImg.split("?")[0]
      : formData.refUserProfileImg;

    const cleanS3Url = (url: any): string => {
      if (!url) return "";

      if (typeof url === "object" && url.url) {
        url = url.url;
      }

      if (typeof url !== "string") {
        try {
          url = String(url);
        } catch {
          return "";
        }
      }

      const decoded = decodeURIComponent(url);
      const parts = decoded.split("?");

      return parts[0];
    };

    try {
      const payload = {
        id: formData.refUserId,
        firstname: formData.refUserFirstName,
        lastname: formData.refUserLastName,
        profile_img: cleanS3Url(formData.refUserProfileImg || cleanUrl),
        email: formData.refCODOEmail,
        dob: formData.refUserDOB,
        phone: formData.refCODOPhoneNo1,
        phoneCountryCode: formData.refCODOPhoneNo1CountryCode,
        drivers_license_no: cleanS3Url(formData.drivers_license),
        social_security_no: formData.refDDSocialSecurityNo,
        drivers_license: cleanS3Url(formData.drivers_license),
        Specialization: formData.Specialization,
        npi: formData.refDDNPI,
        status: formData.refUserStatus,
        license_files: tempLicenses,
        malpracticeinsureance_files: tempMalpractice,
        digital_signature: cleanS3Url(formData.digital_signature),
        easeQTReportAccess: formData.refDDEaseQTReportAccess,
        naSystemreportAcess: formData.refDDNAsystemReportAccess,
      };

      console.log("\n\npayload", payload);

      const res = await doctorService.updatePerformingProvider(payload);
      console.log(res);

      if (res.status) {
        toast.success(res.message);
        setIsEditDialogOpen(false);
        onUpdate();
      }
    } catch (err) {
      console.error("❌ Error updating provider:", err);
      toast.error("Failed to update provider");
    } finally {
      setLoading(false);
      setSaveLoading(false);
    }
  };

  //   if (error) return <div className="text-red-500 mb-4 p-4">{error}</div>;
  if (loading) return <LoadingOverlay />;

  if (!formData)
    return <div className="p-4">No Performing Provider Admin data found.</div>;

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

  const uploadAndStoreFile = async (
    file: File,
    tempField: keyof TempFilesState,
    uploadFn = uploadService.uploadFile // optional, default upload function
  ): Promise<void> => {
    setError("");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await uploadFn(file);

      if (response.status) {
        const cleanUrl = response.viewURL.includes("?")
          ? response.viewURL.split("?")[0]
          : response.viewURL;
        const result: TempLicense = {
          file_name: cleanUrl,
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

  const handleDigitalSignatureUpload = async (file: File) => {
    setError("");
    const formDataImg = new FormData();
    formDataImg.append("profileImage", file);
    setError("");
    try {
      const response = await uploadService.uploadImage(file);

      if (response.status) {
        const cleanUrl = response.viewURL.includes("?")
          ? response.viewURL.split("?")[0]
          : response.viewURL;
        setFormData((prev) => ({
          ...prev,
          digital_signature: cleanUrl,
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
                    ? URL.createObjectURL(files.profile_img) // Local uploaded file
                    : formData.refUserProfileImg &&
                      formData.refUserProfileImg.startsWith("https")
                    ? formData.refUserProfileImg // S3 URL (presigned or public)
                    : formData.profileImgFile?.base64Data
                    ? `data:${formData.profileImgFile?.contentType};base64,${formData.profileImgFile?.base64Data}` // Local base64
                    : "/assets/default-profile.png" // Fallback default image
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
              <Label className="text-sm" htmlFor="Performing Provider Admin ID">
                Performing Provider Admin ID
              </Label>
              <Input
                id="Performing Provider Admin ID"
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
            {(role?.type === "admin" || role?.type === "manager") && (
              <>
                <div className="self-start mt-2 w-full">
                  <div className="flex items-center justify-between gap-4 px-3 py-2 bg-muted shadow rounded-md">
                    <div>
                      <Label className="font-semibold text-base">
                        Wellthgreen Report Portal 10.10 Report Access
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Toggle to enable access
                      </p>
                    </div>
                    <Switch
                      id="qtAccess"
                      className="cursor-pointer"
                      checked={formData.refDDEaseQTReportAccess}
                      onCheckedChange={(checked: boolean) => {
                        setFormData((prev) => ({
                          ...prev,
                          refDDEaseQTReportAccess: checked,
                        }));
                      }}
                    />
                  </div>
                </div>

                <div className="self-start mt-2 w-full">
                  <div className="flex items-center justify-between gap-4 px-3 py-2 bg-muted shadow rounded-md">
                    <div>
                      <Label className="font-semibold text-base">
                        NA System Access
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Toggle to enable access
                      </p>
                    </div>
                    <Switch
                      id="qtAccess"
                      className="cursor-pointer"
                      checked={formData.refDDNAsystemReportAccess}
                      onCheckedChange={(checked: boolean) =>
                        setFormData((prev) => ({
                          ...prev,
                          refDDNAsystemReportAccess: checked,
                        }))
                      }
                    />
                  </div>
                </div>
              </>
            )}
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
            {/* <div className="flex flex-col gap-1.5">
              <Label className="text-sm" htmlFor="lastname">
                Last Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastname"
                type="text"
                placeholder="Enter Last Name"
                className="bg-white"
                value={formData.refUserLastName || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    refUserLastName: e.target.value,
                  }))
                }
                required
              />
            </div> */}
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
              <Label className="text-sm " htmlFor="social_security_no">
                Social Security Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="social_security_no"
                type="text"
                placeholder="Enter Social Security Number"
                className="bg-white"
                value={formData.refDDSocialSecurityNo}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    refDDSocialSecurityNo: e.target.value,
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
                  <SelectTrigger disabled className="bg-white">
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
            <div className="flex flex-col gap-1.5 w-full">
              <Label
                className="text-sm font-medium"
                htmlFor="drivers-license-upload"
              >
                Driving License <span className="text-red-500">*</span>
              </Label>

              <FileUploadButton
                id="drivers-license-upload"
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
                required
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
                formData.drivers_license && (
                  <div
                    className="mt-2 flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-all cursor-pointer"
                    onClick={() => {
                      if (formData.drivers_license.startsWith("https://")) {
                        window.open(formData.drivers_license, "_blank");
                      } else if (formData.driversLicenseFile?.base64Data) {
                        downloadFile(
                          formData.driversLicenseFile.base64Data,
                          formData.driversLicenseFile.contentType,
                          "drivers_license"
                        );
                      } else {
                        console.warn(
                          "No valid driver’s license file available for download."
                        );
                      }
                    }}
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
                NPI
                {/* <span className="text-red-500">*</span> */}
              </Label>
              <Input
                id="npi"
                type="text"
                placeholder="Enter NPI"
                className="bg-white"
                value={formData.refDDNPI}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, refDDNPI: e.target.value }))
                }
                // required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm" htmlFor="specialization">
                Specialization
                {/* <span className="text-red-500">*</span> */}
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
                // required
              />
            </div>
            <div className="flex flex-col gap-1.5 w-full">
              <Label className="text-sm font-medium" htmlFor="license-upload">
                License
              </Label>

              <FileUploadButton
                id="license-upload"
                label="Upload License Files"
                multiple
                // required={
                //   !(
                //     formData.licenseFiles?.length > 0 ||
                //     files.license_files.length > 0
                //   )
                // }
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
                        onClick={() => {
                          // ✅ Check if it's an S3 URL
                          if (file.refLFileName?.startsWith("https://")) {
                            // Open S3 file directly in new tab (browser handles download/view)
                            window.open(file.refLFileName, "_blank");
                          } else if (file.lFileData?.base64Data) {
                            // ✅ Fallback to base64 download
                            downloadFile(
                              file.lFileData.base64Data,
                              file.lFileData.contentType,
                              file.refLOldFileName
                            );
                          } else {
                            console.warn(
                              "No valid file data found for download."
                            );
                          }
                        }}
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
                Malpractice Insurance
                {/* <span className="text-red-500">*</span> */}
              </Label>

              <FileUploadButton
                id="malpractice-upload"
                label="Upload Malpractice Insurance"
                multiple
                // required={formData.malpracticeinsureance_files.length === 0}
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
                        onClick={() => {
                          if (file.refMPFileName?.startsWith("https://")) {
                            // ✅ File from S3 — open or download directly
                            window.open(file.refMPFileName, "_blank");
                          } else if (file.MPFileData?.base64Data) {
                            // ✅ File from base64 (local or DB)
                            downloadFile(
                              file.MPFileData.base64Data,
                              file.MPFileData.contentType,
                              file.refMPOldFileName
                            );
                          } else {
                            // ✅ Fallback (no data)
                            console.warn("No valid malpractice file found");
                          }
                        }}
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
                Digital Signature
                {/* <span className="text-red-500">*</span> */}
              </Label>

              <FileUploadButton
                id="digital-signature-upload"
                label="Upload Digital Signature"
                accept="image/png, image/jpeg, image/jpg"
                // required={
                //   !formData.digital_signature && !files.digital_signature
                // }
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
                    src={
                      files.digital_signature
                        ? URL.createObjectURL(files.digital_signature) // If new file uploaded
                        : formData.digital_signature &&
                          formData.digital_signature.startsWith("https")
                        ? formData.digital_signature // S3 URL from backend
                        : formData.digitalSignatureFile?.base64Data
                        ? `data:${formData.digitalSignatureFile?.contentType};base64,${formData.digitalSignatureFile?.base64Data}` // Local base64
                        : "/assets/default-signature.png" // Default fallback
                    }
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
              {formData.digital_signature && (
                <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between border border-gray-300 rounded-lg px-3 py-2 hover:shadow-sm transition bg-green-100 text-sm text-green-800 font-medium gap-2">
                  <img
                    src={
                      files.digital_signature
                        ? URL.createObjectURL(files.digital_signature) // ✅ Local uploaded file
                        : formData.digital_signature?.startsWith("https")
                        ? formData.digital_signature // ✅ S3 URL from backend
                        : formData.digitalSignatureFile?.base64Data
                        ? `data:${formData.digitalSignatureFile.contentType};base64,${formData.digitalSignatureFile.base64Data}` // ✅ Base64 file from DB
                        : "/assets/default-signature.png" // ✅ Default placeholder
                    }
                    alt="Digital Signature"
                    className="h-16 w-auto rounded border object-contain"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        digital_signature: "",
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

export default EditPerformingProvider;
