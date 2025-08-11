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
import { uploadService } from "@/services/commonServices";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ListSpecificScanCenter,
  scanCenterAdminService,
  scancenterService,
  type NewScanCenterAdmin,
} from "@/services/scancenterService";
import LoadingOverlay from "@/components/ui/CustomComponents/loadingOverlay";
import FileUploadButton from "@/components/ui/CustomComponents/FileUploadButton";

interface TempFilesState {
  profile_img: File | null;
  drivers_license: File | null;
}

const AddScanCenterAdmin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const scanCenterId = Number(location.state);

  const [formData, setFormData] = useState<NewScanCenterAdmin>({
    firstname: "",
    lastname: "",
    profile_img: "",
    dob: "",
    phoneCountryCode: "+1",
    phone: "",
    email: "",
    social_security_no: "",
    drivers_license: "",
    refSCId: null,
  });

  const [scanCenterData, setScanCenterData] =
    useState<ListSpecificScanCenter>();

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      refSCId: scanCenterId,
    }));
  }, []);

  console.log(formData);

  const [files, setFiles] = useState<TempFilesState>({
    profile_img: null,
    drivers_license: null,
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const errorRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    getSpecificScanCenter();
  }, []);

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
          <h1 className="text-2xl font-bold">Center Details</h1>
          <div className="flex flex-col items-start justify-start">
            {scanCenterData?.profileImgFile === null ? (
              <div className="relative w-32 h-32 lg:w-38 lg:h-38 flex flex-col items-center justify-center bg-gray-200 rounded-full text-gray-500 shadow-md">
                <span className="text-sm font-medium text-center">
                  No Image Available
                </span>
              </div>
            ) : (
              <div className="relative w-32 h-32 lg:w-38 lg:h-38">
                <img
                  src={`data:${scanCenterData?.profileImgFile.contentType};base64,${scanCenterData?.profileImgFile.base64Data}`}
                  alt="Preview"
                  className="w-full h-full rounded-full object-cover border-4 border-[#A3B1A1] shadow"
                />
              </div>
            )}
          </div>

          {scanCenterData && (
            <CenterDetailsForm
              formData={formData}
              setFormData={setFormData}
              scanCenterData={scanCenterData}
            />
          )}
        </div>

        {/* <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Professional Details</h1>
          <ProfessionalDetailsForm
            formData={formData}
            setFormData={setFormData}
            tempFiles={files}
            setTempFiles={setFiles}
            setError={setError}
          />
        </div> */}
      </div>
    );
  };

  const handleFinalSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      console.log("finalForm", formData);
      const res = await scanCenterAdminService.addScanCenterAdmin(formData);
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
      setError("Something went wrong");
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

  console.log(formData);

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
          Add Scan Center Manager
        </h1>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-auto flex flex-col lg:flex-row gap-6 lg:p-2 min-h-0">
        <div className="w-full lg:w-1/5 2xl:w-1/8 flex flex-col items-center justify-center p-2 gap-6 rounded-xl">
          {/* Profile Image */}
          <div className="flex flex-col items-center justify-center">
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
                    id="profile-img-upload"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      const maxSize = 5 * 1024 * 1024; // 5MB
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

          {/* Stepper */}
          {/* <div className="bg-[#A3B1A1] border-2 border-white rounded-xl p-4 w-full">
            <div className="space-y-4 font-medium">
              {steps.map((label, index) => (
                <div
                  key={index}
                  //   onClick={() => setActiveStep(index)}
                  className={`px-3 py-2 rounded-md cursor-pointer transition duration-200 ${
                    activeStep === index
                      ? "bg-[#F5F3EF] text-[#3F3F3D] shadow-sm"
                      : "text-white hover:opacity-80"
                  }`}
                >
                  {label}
                </div>
              ))}
            </div>
          </div> */}
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
      {/* <div className="flex items-center justify-center">
        <Button className="flex items-center justify-center bg-[#a3b1a1] hover:bg-[#81927f]">Submit</Button>
      </div> */}
    </form>
  );
};

export default AddScanCenterAdmin;

interface PersonalDetailsFormProps {
  formData: NewScanCenterAdmin;
  setFormData: React.Dispatch<React.SetStateAction<NewScanCenterAdmin>>;
  setTempFiles: React.Dispatch<React.SetStateAction<TempFilesState>>;
  tempFiles: TempFilesState;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

interface CenterDetailsFormProps {
  formData: NewScanCenterAdmin;
  setFormData: React.Dispatch<React.SetStateAction<NewScanCenterAdmin>>;
  scanCenterData: ListSpecificScanCenter;
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
    setFormData,
    setTempFiles,
    tempFileKey, // e.g., "aadhar" or "pan"
  }: {
    file: File;
    fieldName: keyof NewScanCenterAdmin;
    setFormData: React.Dispatch<React.SetStateAction<NewScanCenterAdmin>>;
    setTempFiles: React.Dispatch<React.SetStateAction<TempFilesState>>;
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
    key: "profile_img" | "pan" | "aadhar" | "drivers_license_no"
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
            placeholder="Enter Full Name"
            className="bg-white"
            value={formData.firstname}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, firstname: e.target.value }))
            }
            required
          />
        </div>
        {/* <div className="flex flex-col gap-1.5">
          <Label className="text-sm " htmlFor="lastname">
            Last Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="lastname"
            type="text"
            placeholder="Enter Last Name"
            className="bg-white"
            value={formData.lastname}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, lastname: e.target.value }))
            }
            required
          />
        </div> */}

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
          <Label className="text-sm " htmlFor="social_security_no">
            Social Security Number <span className="text-red-500">*</span>
          </Label>
          <Input
            id="social_security_no"
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
              <SelectTrigger
                disabled
                className="bg-white disabled:opacity-100 disabled:pointer-events-none"
              >
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
            value={formData.dob ? new Date(formData.dob) : undefined}
            onChange={(val) => {
              setFormData((prev) => ({
                ...prev,
                dob: val?.toLocaleDateString("en-CA") || "",
              }));
            }}
            required={formData.dob.length == 0}
          />
        </div>

        <div className="flex flex-col gap-1.5 w-full">
          <Label className="text-sm" htmlFor="drivers-license-upload">
            Driver's License
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
                      setFormData,
                      setTempFiles,
                      tempFileKey: "drivers_license",
                    });
            }}
                />

          {/* Uploaded Driver's License */}
          {tempFiles.drivers_license && (
            <div className="mt-2 flex items-center justify-between border border-gray-300 rounded-lg px-3 py-2 hover:shadow-sm transition cursor-pointer bg-blue-100 text-sm text-gray-800 font-medium">
              <span className="truncate">
                {tempFiles.drivers_license.name}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveSingleFile("drivers_license_no")}
                className="text-red-500 hover:text-red-700 cursor-pointer"
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

const CenterDetailsForm: React.FC<CenterDetailsFormProps> = ({
  scanCenterData,
}) => {
  return (
    <div className="flex flex-col lg:flex-row items-start justify-between gap-4 lg:gap-15">
      <div className="flex flex-col gap-4 2xl:gap-6 w-full lg:w-1/2">
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm " htmlFor="refSName">
            Scan Center Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="refSName"
            type="text"
            placeholder="Enter Scan Center Name"
            className="bg-white"
            disabled
            value={scanCenterData.refSCName}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-sm " htmlFor="email">
            Scan Center E-Mail <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            className="bg-white"
            disabled
            value={scanCenterData.refSCEmail}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-sm " htmlFor="refSCWebsite">
            Scan Center Website <span className="text-red-500">*</span>
          </Label>
          <Input
            id="refSCWebsite"
            type="text"
            placeholder="Enter Scan Center Website"
            className="bg-white"
            disabled
            value={scanCenterData.refSCWebsite}
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 2xl:gap-6 w-full lg:w-1/2">
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm " htmlFor="refSCId">
            Scan Center Code <span className="text-red-500">*</span>
          </Label>
          <Input
            id="refSCId"
            type="text"
            placeholder="Enter Center Code"
            className="bg-white"
            disabled
            value={scanCenterData.refSCCustId}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-sm " htmlFor="refSCAddress">
            Scan Center Address <span className="text-red-500">*</span>
          </Label>
          <Input
            id="refSCAddress"
            type="text"
            placeholder="Enter Scan Center Address"
            className="bg-white"
            disabled
            value={scanCenterData.refSCAddress}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-sm " htmlFor="refSCPhoneNo1">
            Scan Center Phone <span className="text-red-500">*</span>
          </Label>
          <Input
            id="refSCPhoneNo1"
            type="text"
            placeholder="Enter Scan Center Phone"
            className="bg-white"
            disabled
            value={scanCenterData.refSCPhoneNo1}
            required
          />
        </div>
      </div>
    </div>
  );
};
