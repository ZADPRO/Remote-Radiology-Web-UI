import React, { useEffect, useRef, useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { managerService, NewManager } from "@/services/managerService";
import LoadingOverlay from "@/components/ui/CustomComponents/loadingOverlay";

interface TempFilesState {
  profile_img: File | null;
  education_certificate: File[];
  drivers_license: File | null;
  pan: File | null;
  aadhar: File | null;
}

const AddManager: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<NewManager>({
    firstname: "",
    lastname: "",
    profile_img: "",
    dob: "",
    phoneCountryCode: "+91",
    phone: "",
    email: "",
    drivers_license: "",
    pan: "",
    aadhar: "",
    education_certificate: [],
  });

  console.log(formData);

  const [files, setFiles] = useState<TempFilesState>({
    profile_img: null,
    education_certificate: [],
    drivers_license: null,
    pan: null,
    aadhar: null,
  });

  const [loading, setLoading] = useState<boolean>(false);

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
            tempFiles={files}
            setTempFiles={setFiles}
            setError={setError}
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
      const res = await managerService.addManager(formData);
      console.log(res);
      if (res.status) {
        toast.success(res.message);
        setTimeout(() => {
          navigate("../manageWellthGreenManager", { replace: true });
        }, 1500);
      } else {
        setError(res.message);
      }
    } catch (error) {
      console.log(error);
      setError("Error submitting form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileImageUpload = async (file: File) => {
    const formDataImg = new FormData();
    formDataImg.append("profileImage", file);

    try {
      const response = await uploadService.uploadImage({
        formImg: formDataImg,
      });

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
          Add Wellth Green Manager
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

export default AddManager;

interface PersonalDetailsFormProps {
  formData: NewManager;
  setFormData: React.Dispatch<React.SetStateAction<NewManager>>;
  tempFiles: TempFilesState;
  setTempFiles: React.Dispatch<React.SetStateAction<TempFilesState>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

interface ProfessionalDetailsFormProps {
  formData: NewManager;
  setFormData: React.Dispatch<React.SetStateAction<NewManager>>;
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
    fieldName,
    tempFileKey, // e.g., "aadhar" or "pan"
  }: {
    file: File;
    fieldName: keyof NewManager;
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
      [key === "profile_img" ? "profile_img" : key]:
        key === "profile_img" ? "" : null,
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

        <div className="flex flex-col gap-1.5 w-full">
          <Label className="text-sm" htmlFor="aadhar-upload">
            Aadhar <span className="text-red-500">*</span>
          </Label>

          <Input
            id="aadhar-upload"
            type="file"
            accept=".pdf"
            className="bg-[#a1b7c3]"
            value={""} // prevents controlled/uncontrolled warning
            required={formData.aadhar.length === 0}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              const maxSize = 5 * 1024 * 1024;
              if (file.size > maxSize) {
                setError("Aadhar file must be less than 5MB.");
                return;
              }

              handleSingleFileUpload({
                file,
                fieldName: "aadhar",
                tempFileKey: "aadhar",
              });
            }}
          />

          {/* Uploaded Aadhar File */}
          {tempFiles.aadhar && (
            <div className="mt-2 w-full flex flex-col sm:flex-row sm:items-center sm:justify-between border border-gray-300 rounded-lg px-3 py-2 hover:shadow-sm transition bg-blue-100 text-sm text-gray-800 font-medium gap-2">
              <span className="break-words">{tempFiles.aadhar.name}</span>

              <button
                type="button"
                onClick={() => handleRemoveSingleFile("aadhar")}
                className="text-red-500 hover:text-red-700 cursor-pointer self-start sm:self-auto"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1.5 w-full">
          <Label className="text-sm" htmlFor="drivers-license-upload">
            Driver's License <span className="text-red-500">*</span>
          </Label>

          <Input
            id="drivers-license-upload"
            type="file"
            accept=".pdf"
            className="bg-[#a1b7c3]"
            value={formData.drivers_license.length == 0 ? "" : ""}
            required={formData.drivers_license.length == 0}
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
              <SelectTrigger
                disabled
                className="bg-white disabled:opacity-100 disabled:pointer-events-none"
              >
                <SelectValue placeholder="Country Code" />
              </SelectTrigger>
              <SelectContent>
                {/* <SelectItem value="+1">USA (+1)</SelectItem> */}
                <SelectItem value="+91">IN (+91)</SelectItem>
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
            value={formData.dob ? new Date(formData.dob) : undefined}
            onChange={(val) => {
              setFormData((prev) => ({
                ...prev,
                dob: val?.toLocaleDateString("en-CA") || "",
              }));
            }}
          />
        </div>

        <div className="flex flex-col gap-1.5 w-full">
          <Label className="text-sm" htmlFor="pan-upload">
            PAN <span className="text-red-500">*</span>
          </Label>

          <Input
            id="pan-upload"
            type="file"
            accept=".pdf"
            className="bg-[#a1b7c3]"
            value={""} // avoids controlled/uncontrolled warning
            required={formData.pan.length === 0}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              const maxSize = 5 * 1024 * 1024;
              if (file.size > maxSize) {
                setError("PAN file must be less than 5MB.");
                return;
              }

              handleSingleFileUpload({
                file,
                fieldName: "pan",
                tempFileKey: "pan",
              });
            }}
          />

          {/* Uploaded PAN File */}
          {tempFiles.pan && (
            <div className="mt-2 w-full flex flex-col sm:flex-row sm:items-center sm:justify-between border border-gray-300 rounded-lg px-3 py-2 hover:shadow-sm transition bg-blue-100 text-sm text-gray-800 font-medium gap-2">
              <span className="break-words">{tempFiles.pan.name}</span>

              <button
                type="button"
                onClick={() => handleRemoveSingleFile("pan")}
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
    field: keyof NewManager,
    tempField: keyof TempFilesState,
    setFormData: React.Dispatch<React.SetStateAction<NewManager>>,
    uploadFn = uploadService.uploadFile // optional, default upload function
  ): Promise<void> => {
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

        setTempFiles((prev) => ({
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

  const handleRemoveMultiFile = (
    key: "education_certificate",
    index: number
  ) => {
    setTempFiles((prev) => ({
      ...prev,
      [key]: (prev[key] as File[]).filter((_, i) => i !== index),
    }));

    const formKey = key;

    setFormData((prev) => ({
      ...prev,
      [formKey]: (prev[formKey] as UploadFile[]).filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="flex flex-col lg:flex-row items-start justify-between gap-4 lg:gap-15">
      <div className="flex flex-col gap-4 2xl:gap-6 w-full lg:w-1/2">
        <div className="flex flex-col gap-1.5 w-full">
          <Label className="text-sm" htmlFor="edu-upload">
            Upload Educational Certificates{" "}
            <span className="text-red-500">*</span>
          </Label>

          <Input
            id="edu-upload"
            type="file"
            accept=".pdf"
            multiple
            className="bg-[#a1b7c3]"
            value={formData.education_certificate.length === 0 ? "" : ""}
            required={formData.education_certificate.length === 0}
            onChange={async (e) => {
              const filesSelected = e.target.files;
              if (!filesSelected) return;

              const selectedFiles = Array.from(filesSelected);
              const maxSize = 10 * 1024 * 1024;

              const filteredFiles = selectedFiles.filter(
                (file) =>
                  file.size <= maxSize &&
                  !tempFiles.education_certificate.some(
                    (existingFile) => existingFile.name === file.name
                  )
              );

              if (filteredFiles.length < selectedFiles.length) {
                setError(
                  "Some files were larger than 10MB or were duplicates and were not added."
                );
              }

              // Upload each file and store in formData
              for (const file of filteredFiles) {
                await uploadAndStoreFile(
                  file,
                  "education_certificate",
                  "education_certificate",
                  setFormData
                );
              }
            }}
          />

          {/* Show uploaded file names */}
          {tempFiles.education_certificate.length > 0 && (
            <div className="mt-2 flex flex-col gap-2">
              {tempFiles.education_certificate.map((file, index) => (
                <div
                  key={index}
                  className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between border border-gray-300 rounded-lg px-3 py-2 hover:shadow-sm transition bg-blue-100 text-sm text-gray-800 font-medium gap-2"
                >
                  <span className="break-words">{file.name}</span>

                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveMultiFile("education_certificate", index)
                    }
                    className="text-red-500 hover:text-red-700 cursor-pointer self-start sm:self-auto"
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
  );
};
