import React, { useEffect, useRef, useState } from "react";
import addRadiologist_Bg from "../../assets/Add Admins/Add Radiologist BG.png";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  CircleAlert,
  Pencil,
  PlusIcon,
  X,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import DatePicker from "@/components/date-picker";
import { toast } from "sonner";
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
import {
  doctorService,
  MedicalLicenseSecurity,
  NewPerformingProvider,
} from "@/services/doctorService";
import LoadingOverlay from "@/components/ui/CustomComponents/loadingOverlay";
import FileUploadButton from "@/components/ui/CustomComponents/FileUploadButton";
import { parseLocalDate } from "@/lib/dateUtils";

interface TempFilesState {
  profile_img: File | null;
  license_files: File[];
  drivers_license: File | null;
  malpracticeinsureance_files: File[];
  digital_signature: File | null;
}

const AddPerformingProvider: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const scanCenterId = location.state;

  const [formData, setFormData] = useState<NewPerformingProvider>({
    firstname: "",
    lastname: "",
    profile_img: "",
    dob: "",
    phoneCountryCode: "+1",
    phone: "",
    email: "",
    social_security_no: "",
    drivers_license: "",
    specialization: "",
    npi: "",
    medical_license_security: [
      {
        State: "",
        MedicalLicenseSecurityNo: "",
      },
    ],
    malpracticeinsureance_files: [],
    license_files: [],
    digital_signature: "",
    refSCId: 0,
  });

  console.log(formData);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      refSCId: scanCenterId,
    }));
  }, []);

  const [files, setFiles] = useState<TempFilesState>({
    profile_img: null,
    license_files: [],
    drivers_license: null,
    malpracticeinsureance_files: [],
    digital_signature: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [error]);

  const renderStepForm = () => {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Personal Details</h1>
          <PersonalDetailsForm
            formData={formData}
            setFormData={setFormData}
            setError={setError}
            tempFiles={files}
            setTempFiles={setFiles}
          />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Professional Details</h1>
          <ProfessionalDetailsForm
            formData={formData}
            setFormData={setFormData}
            tempFiles={files}
            setTempFiles={setFiles}
            setError={setError}
          />
        </div>
      </div>
    );
  };

  const handleFinalSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      console.log("finalForm", formData);
      const res = await doctorService.addPerformingProvider(formData);
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
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileImageUpload = async (file: File) => {
    const formDataImg = new FormData();
    formDataImg.append("profileImage", file);

    try {
      const response = await uploadService.uploadImage(file);

      if (response.status) {
        const cleanUrl = response.viewURL.includes("?")
          ? response.viewURL.split("?")[0]
          : response.viewURL;
        setFormData((prev) => ({
          ...prev,
          profile_img: cleanUrl,
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
          Add Performing Provider
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

export default AddPerformingProvider;

interface PersonalDetailsFormProps {
  formData: NewPerformingProvider;
  setFormData: React.Dispatch<React.SetStateAction<NewPerformingProvider>>;
  tempFiles: TempFilesState;
  setTempFiles: React.Dispatch<React.SetStateAction<TempFilesState>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

interface ProfessionalDetailsFormProps {
  formData: NewPerformingProvider;
  setFormData: React.Dispatch<React.SetStateAction<NewPerformingProvider>>;
  tempFiles: TempFilesState;
  setTempFiles: React.Dispatch<React.SetStateAction<TempFilesState>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const PersonalDetailsForm: React.FC<PersonalDetailsFormProps> = ({
  formData,
  setFormData,
  tempFiles,
  setTempFiles,
  setError,
}) => {
  const handleSingleFileUpload = async ({
    file,
    fieldName, // e.g., "aadhar_file" or "pan_file"
    tempFileKey, // e.g., "aadhar" or "pan"
  }: {
    file: File;
    fieldName: keyof NewPerformingProvider;
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

        setTempFiles((prev) => ({
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

  const handleRemoveSingleFile = (
    key: "profile_img" | "pan" | "aadhar" | "drivers_license"
  ) => {
    setTempFiles((prev) => ({
      ...prev,
      [key]: null,
    }));

    setFormData((prev) => ({
      ...prev,
      [key]: "",
    }));
  };
  return (
    <div className="flex flex-col lg:flex-row items-start justify-between gap-4 lg:gap-15">
      <div className="flex flex-col gap-4 2xl:gap-6 w-full lg:w-1/2">
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm " htmlFor="firstname">
            Full Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="firstname"
            type="text"
            placeholder="Enter First Name"
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
          <Label className="text-sm " htmlFor="phone">
            Contact Number <span className="text-red-500">*</span>
          </Label>
          {/* Changed from grid to flex for better gap handling with percentage/flexible widths */}
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
              <SelectTrigger className="bg-white ">
                <SelectValue placeholder="Country Code" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="+1">USA (+1)</SelectItem>
                {/* <SelectItem value="+91">IN (+91)</SelectItem> */}
              </SelectContent>
            </Select>
            <Input
              id="phone"
              type="number"
              placeholder="Enter Phone Number"
              className="bg-white flex-1" // Takes remaining space
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
          {tempFiles.drivers_license && (
            <div className="mt-2 w-full flex flex-col sm:flex-row sm:items-center sm:justify-between border border-gray-300 rounded-lg px-3 py-2 hover:shadow-sm transition bg-blue-100 text-sm text-gray-800 font-medium gap-2">
              <span className="break-words">
                {tempFiles.drivers_license.name}
              </span>

              <button
                type="button"
                onClick={() => handleRemoveSingleFile("drivers_license")}
                className="text-red-500 hover:text-red-700 cursor-pointer self-start sm:self-auto"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ProfessionalDetailsForm: React.FC<ProfessionalDetailsFormProps> = ({
  formData,
  setFormData,
  tempFiles,
  setTempFiles,
  setError,
}) => {
  const uploadAndStoreFile = async (
    file: File,
    field: keyof NewPerformingProvider,
    tempFileKey: keyof TempFilesState
  ): Promise<void> => {
    setError("");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await uploadService.uploadFile(file);

      if (response.status) {
        const cleanUrl = response.viewURL.includes("?")
          ? response.viewURL.split("?")[0]
          : response.viewURL;
        const result: UploadFile = {
          file_name: cleanUrl,
          old_file_name: file.name,
        };

        // Update formData
        setFormData((prev) => ({
          ...prev,
          [field]: [...((prev[field] as UploadFile[]) || []), result],
        }));

        // Update tempFiles
        setTempFiles((prev) => ({
          ...prev,
          [tempFileKey]: [...((prev[tempFileKey] as File[]) || []), file],
        }));
      } else {
        setError(`Upload failed for file: ${file.name}`);
      }
    } catch (err) {
      setError(`Error uploading file: ${file.name}`);
    }
  };

  const handleRemoveMultiFile = (
    key: "license_files" | "malpracticeinsureance_files",
    index: number
  ) => {
    setTempFiles((prev) => ({
      ...prev,
      [key]: (prev[key] as File[]).filter((_, i) => i !== index),
    }));

    setFormData((prev) => ({
      ...prev,
      [key]: (prev[key] as UploadFile[]).filter((_, i) => i !== index),
    }));
  };

  const handleAddMedicalLicense = () => {
    setFormData((prev) => ({
      ...prev,
      medical_license_security: [
        ...prev.medical_license_security,
        { State: "", MedicalLicenseSecurityNo: "" },
      ],
    }));
  };

  const handleRemoveMedicalLicense = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      medical_license_security: prev.medical_license_security.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const handleMedicalLicenseChange = (
    index: number,
    field: keyof MedicalLicenseSecurity,
    value: string
  ) => {
    const updated = [...formData.medical_license_security];
    updated[index][field] = value;

    setFormData((prev) => ({
      ...prev,
      medical_license_security: updated,
    }));
  };

  const handleRemoveSingleFile = (key: "digital_signature") => {
    setTempFiles((prev) => ({
      ...prev,
      [key]: null,
    }));

    setFormData((prev) => ({
      ...prev,
      [key]: "",
    }));
  };

  const handleDigitalSignatureUpload = async (file: File) => {
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
        }));

        setTempFiles((prev) => ({
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
    <div className="flex flex-col lg:flex-row items-start justify-between gap-4 lg:gap-15">
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
            value={formData.npi}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, npi: e.target.value }))
            }
            // required
          />
        </div>
        <div className="flex flex-col gap-1.5 w-full">
          <Label className="text-sm " htmlFor="specialization">
            Specialization
            {/* <span className="text-red-500">*</span> */}
          </Label>
          <Input
            id="specialization"
            type="text"
            placeholder="Enter Specialization"
            className="bg-white"
            value={formData.specialization}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                specialization: e.target.value,
              }))
            }
            // required
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
                  !tempFiles.license_files.some((f) => f.name === file.name)
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

          {tempFiles.license_files.length > 0 && (
            <ul className="mt-2 space-y-2 text-sm text-gray-800">
              {tempFiles.license_files.map((file, index) => (
                <li
                  key={index}
                  className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border border-gray-300 rounded-lg px-3 py-2 hover:shadow-sm transition bg-blue-100 font-medium"
                >
                  <span className="break-words">{file.name}</span>

                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveMultiFile("license_files", index)
                    }
                    className="text-red-500 hover:text-red-700 cursor-pointer self-start sm:self-auto"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 2xl:gap-6 w-full lg:w-1/2">
        <div className="flex flex-col gap-1.5 w-full">
          <Label className="text-sm" htmlFor="malpractice-upload">
            Upload Malpractice Insurance
            {/* <span className="text-red-500">*</span> */}
          </Label>

          <FileUploadButton
            id="malpractice-upload"
            label="Upload Malpractice Insurance Files"
            multiple
            // required={formData.malpracticeinsureance_files.length === 0}
            isFilePresent={formData.malpracticeinsureance_files.length > 0}
            onChange={async (e) => {
              const filesSelected = e.target.files;
              if (!filesSelected) return;

              const selectedFiles = Array.from(filesSelected);
              const maxSize = 10 * 1024 * 1024;

              const filteredFiles = selectedFiles.filter(
                (file) =>
                  file.size <= maxSize &&
                  !tempFiles.malpracticeinsureance_files.some(
                    (existingFile) => existingFile.name === file.name
                  )
              );

              if (filteredFiles.length < selectedFiles.length) {
                setError(
                  "Some files were larger than 10MB or were duplicates and were not added."
                );
              }

              for (const file of filteredFiles) {
                await uploadAndStoreFile(
                  file,
                  "malpracticeinsureance_files",
                  "malpracticeinsureance_files"
                );
              }
            }}
          />

          {tempFiles.malpracticeinsureance_files.length > 0 && (
            <ul className="mt-2 space-y-2 text-sm text-gray-800">
              {tempFiles.malpracticeinsureance_files.map((file, index) => (
                <li
                  key={index}
                  className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border border-gray-300 rounded-lg px-3 py-2 hover:shadow-sm transition bg-blue-100 font-medium"
                >
                  <span className="break-words">{file.name}</span>

                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveMultiFile(
                        "malpracticeinsureance_files",
                        index
                      )
                    }
                    className="text-red-500 hover:text-red-700 cursor-pointer self-start sm:self-auto"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
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
            // required={formData.digital_signature?.length === 0}
            isFilePresent={formData.digital_signature?.length > 0}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              const maxSize = 5 * 1024 * 1024; // 5MB
              if (file.size > maxSize) {
                setError("Digital signature image must be less than 5MB.");
                return;
              }

              handleDigitalSignatureUpload(file);
            }}
          />

          {/* Uploaded Digital Signature Preview */}
          {tempFiles.digital_signature && (
            <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between border border-gray-300 rounded-lg px-3 py-2 hover:shadow-sm transition bg-blue-100 text-sm text-gray-800 font-medium gap-2">
              <img
                src={URL.createObjectURL(tempFiles.digital_signature)}
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
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm">
            State & Medical License Number{" "}
            <span className="text-red-500">*</span>
          </Label>

          {formData.medical_license_security.map((license, index) => (
            <div key={index} className="flex gap-2 items-center mb-2">
              <Input
                type="text"
                placeholder="State"
                value={license.State}
                onChange={(e) =>
                  handleMedicalLicenseChange(index, "State", e.target.value)
                }
                className="bg-white w-1/2"
                required
              />
              <Input
                type="text"
                placeholder="Medical License Number"
                value={license.MedicalLicenseSecurityNo}
                onChange={(e) =>
                  handleMedicalLicenseChange(
                    index,
                    "MedicalLicenseSecurityNo",
                    e.target.value
                  )
                }
                className="bg-white w-1/2"
                required
              />
              {formData.medical_license_security.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveMedicalLicense(index)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  ✕
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddMedicalLicense}
            className="flex items-center justify-center gap-1 text-red-400 text-sm hover:underline w-fit cursor-pointer"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
