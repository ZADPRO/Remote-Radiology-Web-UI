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
import { Camera, FileText, Pencil } from "lucide-react";
import { uploadService } from "@/services/commonServices";
import { toast } from "sonner";
import { ListSpecificScanCenterAdmin, scanCenterAdminService } from "@/services/scancenterService";
import FileUploadButton from "@/components/ui/CustomComponents/FileUploadButton";

// Define the props interface for EditScanCenterAdmin
interface EditScanCenterAdminProps {
    scanCenterId: number;
  scanCenterAdminId: number;
  setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onUpdate: () => void;
}
// Interface for temporary file storage
interface files {
  profile_img: File | null;
  drivers_license: File | null;
}

const EditScanCenterAdmin: React.FC<EditScanCenterAdminProps> = ({
    scanCenterId,
  scanCenterAdminId,
  setIsEditDialogOpen,
  onUpdate,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null); // State for error messages

  const [formData, setFormData] = useState<ListSpecificScanCenterAdmin>({
  profileImgFile: {
    base64Data: "",
    contentType: "",
  },
  drivingLicenseFile: {
    base64Data: "",
    contentType: "",
  },
  refCODOEmail: "",
  refCODOPhoneNo1: "",
  refCODOPhoneNo1CountryCode: "",
  refRDDrivingLicense: "",
  refRDSSId: "",
  refRTId: 0,
  refUserAgreementStatus: false,
  refUserCustId: "",
  refUserDOB: "",
  refUserFirstName: "",
  refUserId: 0,
  refUserLastName: "",
  refUserProfileImg: "",
  refUserStatus: "",
});

  const [files, setFiles] = useState<files>({
    profile_img: null,
    drivers_license: null,
  });

  const getSpecificCenterAdmin = async () => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      const res = await scanCenterAdminService.getSpecificScanCenterAdmin(
        scanCenterId, scanCenterAdminId
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
    fieldName: keyof ListSpecificScanCenterAdmin;
    tempFileKey: keyof files;
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

  useEffect(() => {
    getSpecificCenterAdmin();
  }, [scanCenterAdminId]); // Re-run effect if scanCenterAdminId changes

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
        drivers_license_no: formData.refRDDrivingLicense,
        social_security_no: formData.refRDSSId,
        profile_img: formData.refUserProfileImg,
        status: formData.refUserStatus === "true",
      };
      console.log("payload",payload);
      const res = await scanCenterAdminService.updateScanCenterAdmin(payload);
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

  if (error) return <div className="text-red-500 mb-4 p-4">{error}</div>;
  if(loading) return (<LoadingOverlay />);

  if (!formData) return <div className="p-4">No Scan Center Admin data found.</div>;

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
              <Label className="text-sm" htmlFor="Scan Center Admin ID">
                Scan Center Admin ID
              </Label>
              <Input
                id="Scan Center Admin ID"
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
                    refUserStatus: value,
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
                value={formData.refRDSSId}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    social_security_no: e.target.value,
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
                  <SelectTrigger disabled
                className="bg-white">
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
              <Label className="text-sm font-medium" htmlFor="drivers-license-upload">
                Drivers License <span className="text-red-500">*</span>
              </Label>

               <FileUploadButton
              id="license-upload"
              label="Upload License"
              required={false} // Or true if this is mandatory and no file present
              isFilePresent={!!formData.refRDDrivingLicense}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (file.size > 5 * 1024 * 1024) {
                    setError("File must be less than 5MB.");
                    return;
                  }

                  handleSingleFileUpload({
                    file,
                    fieldName: "refRDDrivingLicense",
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
              formData.refRDDrivingLicense &&
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

export default EditScanCenterAdmin;
