import React, { useCallback, useEffect, useRef, useState } from "react";
import addRadiologist_Bg from "../../assets/Add Admins/Add Radiologist BG.png";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  CircleAlert,
  Pencil,
  X,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import DatePicker from "@/components/date-picker";import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UploadFile, uploadService } from "@/services/commonServices";
import { useLocation, useNavigate } from "react-router-dom";
import { NewTechnician, technicianService } from "@/services/technicianServices";
import { Checkbox } from "@/components/ui/checkbox";
import { ListSpecificScanCenter, scancenterService } from "@/services/scancenterService";
import LoadingOverlay from "@/components/ui/CustomComponents/loadingOverlay";
import FileUploadButton from "@/components/ui/CustomComponents/FileUploadButton";
import { parseLocalDate } from "@/lib/dateUtils";

interface TempFilesState {
  profile_img: File | null;
  license_files: File[];
  drivers_license: File | null;
  digital_signature: File | null;
}


const AddTechnician: React.FC = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const scanCenterId = location.state;

  console.log(scanCenterId)

  const [formData, setFormData] = useState<NewTechnician>({
    firstname: "",
    lastname: "", // Added lastname to formData initialization
    profile_img: "",
    dob: "",
    phoneCountryCode: "+1",
    phone: "",
    email: "",
    drivers_license: "",
    digital_signature: "",
    social_security_no: "",
    trained_ease_qt: false,
    scan_center_id: null,
    license_files: [],
    
  });

 useEffect(() => {
 setFormData((prev) => ({
 ...prev,
 scan_center_id: scanCenterId,
 }));
 }, [scanCenterId]);

  const [scanCenterData, setScanCenterData] =
      useState<ListSpecificScanCenter>();

  const getSpecificScanCenter = async () => {
      setLoading(true);
      try {
        const res = await scancenterService.getSpecificScanCenters(scanCenterId);
        console.log(res);
        if (res.status) {
          setScanCenterData(res.data[0]);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  console.log(formData);

  const [files, setFiles] = useState<TempFilesState>({
    profile_img: null,
    license_files: [],
    drivers_license: null,
    digital_signature: null,
  });

  const [loading, setLoading] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);

    const errorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      getSpecificScanCenter();
    }, []);

    useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [error]);

  // Functions moved from subcomponents
  const handleSingleFileUpload = useCallback(async ({
    file,
    fieldName, // e.g., "drivers_license"
    tempFileKey, // e.g., "drivers_license"
  }: {
    file: File;
    fieldName: keyof NewTechnician;
    tempFileKey: keyof TempFilesState;
  }) => {
    setError("");
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
  }, [setFormData, setFiles, setError]);

  const uploadAndStoreFile = useCallback(async (
    file: File,
    field: keyof NewTechnician,
    tempField: keyof TempFilesState,
    uploadFn = uploadService.uploadFile // optional, default upload function
  ): Promise<void> => {
    setError("");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await uploadFn({ formFile: formData });

      if (response.status) {
        const result: UploadFile = {
          file_name: response.fileName,
          old_file_name: file.name,
        };
        console.log(result);
        setFormData((prev) => ({
          ...prev,
          [field]: [...((prev[field] as UploadFile[]) || []), result],
        }));

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
  }, [setFormData, setFiles, setError]);

  const handleDigitalSignatureUpload = useCallback(async (
    file: File,
  ) => {
    setError("");
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
  }, [setFormData, setFiles, setError]);

  const handleRemoveSingleFile = useCallback((
    key: "profile_img" | "drivers_license" | "digital_signature"
  ) => {
    setFiles((prev) => ({
      ...prev,
      [key]: null,
    }));

    setFormData((prev) => ({
      ...prev,
      [key]: "",
    }));
  }, [setFormData, setFiles]);

  const handleRemoveMultiFile = useCallback((key: "license_files", index: number) => {
    setFiles((prev) => ({
      ...prev,
      [key]: (prev[key] as File[]).filter((_, i) => i !== index),
    }));

    const formKey = "license_files";

    setFormData((prev) => ({
      ...prev,
      [formKey]: (prev[formKey] as UploadFile[]).filter((_, i) => i !== index),
    }));
  }, [setFormData, setFiles]);

  const handleProfileImageUpload = useCallback(async (file: File) => {
    setError("");
    const formDataImg = new FormData();
    formDataImg.append("profileImage", file);

    try {
      const response = await uploadService.uploadImage({ formImg: formDataImg });

      if (response.status) {
        setFormData((prev) => ({
          ...prev,
          profile_img: response.fileName,
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
  }, [setFormData, setFiles, setError]);

  const renderStepForm = () => {
    return (
      <div className="flex flex-col gap-8">
        {/* Personal Details Section */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Personal Details</h1>
          <div className="flex flex-col lg:flex-row items-start justify-between gap-4 lg:gap-15">
            <div className="flex flex-col gap-4 2xl:gap-6 w-full lg:w-1/2">
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm " htmlFor="firstname">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstname"
                  type="text"
                  placeholder="Enter Full Name"
                  className="bg-white"
                  value={formData.firstname}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, firstname: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-sm " htmlFor="email">
                  E-Mail <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  className="bg-white"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  required
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
                  value={formData.social_security_no}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, social_security_no: e.target.value }))
                  }
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 2xl:gap-6 w-full lg:w-1/2">
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm " htmlFor="phone">
                  Contact Number <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-2 relative">
                  <Select
                    value={formData.phoneCountryCode}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        phoneCountryCode: value,
                      }))
                    }
                  >
                    <SelectTrigger disabled className="bg-white disabled:opacity-100 disabled:pointer-events-none">
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
                    value={formData.phone}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 10) {
                        setFormData((prev) => ({
                          ...prev,
                          phone: value,
                        }));
                      }
                    }}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 w-full">
                <Label className="text-sm " htmlFor="dob">
                  Date Of Birth <span className="text-red-500">*</span>
                </Label>
                <DatePicker
                  value={formData.dob ? parseLocalDate(formData.dob) : undefined}
                  onChange={(val) => {
                    setFormData((prev) => ({
                      ...prev,
                      dob: val?.toLocaleDateString("en-CA") || "",
                    }));
                  }}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5 w-full">
                <Label className="text-sm" htmlFor="drivers-license-upload">
                  Driver's License <span className="text-red-500">*</span>
                </Label>

                <FileUploadButton
                  id="drivers-license-upload"
                  label="Upload Driver's License"
                  isFilePresent={formData.drivers_license?.length > 0}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    const maxSize = 5 * 1024 * 1024;
                    if (file.size > maxSize) {
                      setError("Driver's license file must be less than 5MB.");
                      return;
                    }

                    handleSingleFileUpload({
                      file,
                      fieldName: "drivers_license",
                      tempFileKey: "drivers_license",
                    });
                  }}
                  required
                />

                {/* Uploaded Driver's License */}
                {files.drivers_license && (
                  <div className="mt-2 flex items-center justify-between border border-gray-300 rounded-lg px-3 py-2 hover:shadow-sm transition cursor-pointer bg-blue-100 text-sm text-gray-800 font-medium">
                    <span className="truncate">
                      {files.drivers_license.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSingleFile("drivers_license")}
                      className="text-red-500 hover:text-red-700 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Professional Details Section */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Professional Details</h1>
          <div className="flex flex-col lg:flex-row items-start justify-between gap-4 lg:gap-15">
            <div className="flex flex-col gap-4 2xl:gap-6 w-full lg:w-1/2">
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm " htmlFor="sc_name">
                  Scan Center Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="sc_name"
                  type="text"
                  placeholder="Enter Scan Center Name"
                  className="bg-white"
                  disabled
                  value={scanCenterData?.refSCName}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <Label className="text-sm" htmlFor="license-upload">
                  Upload License
                </Label>

                <FileUploadButton
                  id="license-upload"
                  label="Upload License Files"
                  multiple
                  // required={formData.license_files.length === 0}
                  isFilePresent={formData.license_files.length > 0}
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
                      await uploadAndStoreFile(
                        file,
                        "license_files",
                        "license_files"
                      );
                    }
                  }}
                />

                {files.license_files.length > 0 && (
                  <div className="mt-2 flex flex-col gap-2">
                    {files.license_files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between border border-gray-300 rounded-lg px-3 py-2 hover:shadow-sm transition cursor-pointer bg-blue-100 text-sm text-gray-800 font-medium"
                      >
                        <span className="truncate w-4/5" title={file.name}>
                          {file.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveMultiFile("license_files", index)}
                          className="text-red-500 hover:text-red-700"
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
                  Digital Signature
                </Label>

                <FileUploadButton
                  id="digital-signature-upload"
                  label="Upload Digital Signature"
                  accept="image/png, image/jpeg, image/jpg"
                  // required={formData.digital_signature?.length === 0}
                  isFilePresent={formData.digital_signature?.length > 0}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    const maxSize = 5 * 1024 * 1024; // 5MB
                    if (file.size > maxSize) {
                      setError(
                        "Digital signature image must be less than 5MB."
                      );
                      return;
                    }

                    handleDigitalSignatureUpload(file);
                  }}
                />

                {/* Uploaded Digital Signature Preview */}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    setError(null); // Clear previous errors

    // Basic validation before submission
    if (!formData.firstname || !formData.email || !formData.phone || !formData.dob || !formData.social_security_no || !formData.drivers_license || !formData.digital_signature || formData.license_files.length === 0) {
      setError("Please fill in all required fields and upload all necessary documents.");
      setLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    // Phone number validation (assuming 10 digits for +1 country code)
    if (formData.phoneCountryCode === "+1" && formData.phone.length !== 10) {
      setError("Phone number must be 10 digits for USA.");
      setLoading(false);
      return;
    }

    // Social Security Number validation (basic check, can be enhanced)
    if (formData.social_security_no.length < 9) { // Assuming a minimum length for SSN
      setError("Please enter a valid Social Security Number.");
      setLoading(false);
      return;
    }

    try {
      console.log("finalForm", formData);
      const res = await technicianService.createNewTechnician(formData);
      console.log(res);
      if (res.status) {
        toast.success(res.message);
        setTimeout(() => {
          navigate(-1);
        }, 1500);
      } else {
        setError(res.message);
      }

    } catch (error) {
      console.error("Submission error:", error);
      setError("An unexpected error occurred during submission.");
    }
    finally {
      setLoading(false);
    }
  };

  console.log(files);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleFinalSubmit();
      }}
      className="w-full h-full flex flex-col"
    >
      {loading && <LoadingOverlay />}
      {/* Fixed Header */}
      <div
        className="h-[8vh] shrink-0 flex items-center justify-center lg:justify-start bg-[#A3B1A1] lg:bg-[length:70%_100%] lg:bg-no-repeat lg:bg-right-top"
        style={{
          backgroundColor: "#A3B1A1",
          backgroundImage:
            window.innerWidth >= 1024 ? `url(${addRadiologist_Bg})` : undefined,
        }}
      >
        <h1 className="text-[#3F3F3D] uppercase font-[900] lg:pl-10 text-xl lg:text-3xl text-center lg:text-left tracking-widest">
          Add Technician
        </h1>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-auto flex flex-col lg:flex-row gap-6 lg:p-2 min-h-0">
        {/* Left: Profile Image Section */}
        <div className="w-full lg:w-1/5 2xl:w-1/8 flex flex-col items-center justify-center p-2 gap-6 rounded-xl">
          {formData.profile_img.length === 0 ? (
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
              <span className="text-sm font-medium text-foreground mt-2 absolute -bottom-6">
                Add Photo
              </span>
            </div>
          ) : (
            <div className="relative w-32 h-32 lg:w-45 lg:h-45">
              <img
                src={
                  files.profile_img
                    ? URL.createObjectURL(files.profile_img)
                    : formData.profile_img
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
        </div>

        {/* Right: Form Content */}
        <div
          className="flex-1 w-full lg:w-4/5 2xl:w-7/8 p-4 lg:pb-10 mx-auto my-0
        lg:overflow-auto min-h-0
        lg:shadow-md lg:rounded-2xl
        lg:[background:radial-gradient(100.97%_186.01%_at_50.94%_50%,_#F9F4EC_25.14%,_#EED8D6_100%)]
        grid lg:place-items-center"
        >
          <div className="w-full">
            {renderStepForm()}
            <div className="relative mt-3 flex items-center">
              <Checkbox
                className="bg-red-200 cursor-pointer"
                checked={formData.trained_ease_qt}
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    trained_ease_qt: !prev.trained_ease_qt,
                  }))
                }
              />{" "}
              <span className="ml-2 text-sm font- font-bold">
                Trained in QT protocol
              </span>
            </div>
            {error && (
               <Alert ref={errorRef} variant="destructive" className="mt-2">
                <CircleAlert />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="h-[4vh] shrink-0 flex items-center justify-between py-4 mt-2 lg:mt-0">
        <button
          type="button"
          className="flex items-center justify-center text-lg font-medium cursor-pointer px-4 max-w-[10rem] rounded-md"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </button>

        <button
          type="submit"
          className="flex items-center justify-center text-lg font-medium cursor-pointer px-4 max-w-[10rem] rounded-md"
        >
          Submit
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </form>
  );
};

export default AddTechnician;