import React, { useEffect, useRef, useState } from "react";
import addRadiologist_Bg from "../../assets/Add Admins/Add Radiologist BG.png";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  CircleAlert,
  Pencil,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { uploadService } from "@/services/commonServices";
import { useNavigate } from "react-router-dom";
import { scancenterService, type NewScanCenter } from "@/services/scancenterService";
import LoadingOverlay from "@/components/ui/CustomComponents/loadingOverlay";

interface TempFilesState {
  logo: File | null;
}

const AddScanCenter: React.FC = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState<NewScanCenter>({
    name: "",
    logo: "",
    email: "",
    cust_id: "",
    website: "",
    telephone: "",
    address: "",
    appointments: false,
  });

  console.log(formData);

  const [files, setFiles] = useState<TempFilesState>({
    logo: null,
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

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
          <h1 className="text-2xl font-bold">Center Details</h1>
          <CenterDetailsForm formData={formData} setFormData={setFormData} />
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
    setError("");
    setLoading(true);
    try {
      console.log("finalForm",formData);
      const res = await scancenterService.addScanCenter(formData);
      console.log(res);
      if(res.status) {
        toast.success("Scan Center Added Successfully");
        setTimeout(() => {
          navigate("../manageScanCenter");
        }, 1500);
      } else {
        setError(res.message);
      }
      
    } catch (error) {
      console.log(error);
    }
    finally{
      setLoading(false);
    }
  };

  const handleProfileImageUpload = async (file: File) => {
  const formDataImg = new FormData();
  formDataImg.append("profileImage", file);

  try {
    const response = await uploadService.uploadImage({ formImg: formDataImg });

    if (response.status) {
      setFormData((prev) => ({
        ...prev,
        logo: response.fileName,
      }));

      setFiles((prev) => ({
        ...prev,
        logo: file,
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
          Add Scan Center
        </h1>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-auto flex flex-col lg:flex-row gap-6 lg:p-2 min-h-0">
        <div className="w-full lg:w-1/5 2xl:w-1/8 flex flex-col items-center justify-center p-2 gap-6 rounded-xl">
          {/* Profile Image */}
          <div className="flex flex-col items-center justify-center">
            {formData.logo.length === 0 ? (
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
                    files.logo ? URL.createObjectURL(files.logo) : formData.logo
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
            {/* <div className="relative mt-3 flex items-center">
            <Checkbox
              className="bg-red-200 cursor-pointer"
              value={String(formData.appointments)}
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  appointments: (!formData.appointments),
                }))
              }
            />{" "}
            <span className="ml-2 text-sm font-medium">
              Appointments Available
            </span>
          </div> */}
            {error && (
               <Alert ref={errorRef} variant="destructive" className="mt-2">
                <CircleAlert/>
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

export default AddScanCenter;

interface CenterDetailsFormProps {
  formData: NewScanCenter;
  setFormData: React.Dispatch<React.SetStateAction<NewScanCenter>>;
}


const CenterDetailsForm: React.FC<CenterDetailsFormProps> = ({
  formData,
  setFormData,
}) => {
  return (
    <div className="flex flex-col lg:flex-row items-start justify-between gap-4 lg:gap-15">
      <div className="flex flex-col gap-4 2xl:gap-6 w-full lg:w-1/2">
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm " htmlFor="name">
            Scan Center Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter Scan Center Name"
            className="bg-white"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
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
          <Label className="text-sm " htmlFor="website">
            Website <span className="text-red-500">*</span>
          </Label>
          <Input
            id="website"
            type="text"
            placeholder="Enter Website"
            className="bg-white"
            value={formData.website}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, website: e.target.value }))
            }
            required
          />
        </div>
        {/*<div className="flex flex-col gap-1.5 w-full">
          <Label className="text-sm " htmlFor="code">
            Pincode
          </Label>
          <Input
            id="code"
            type="number"
            placeholder="Enter code"
            className="bg-white"
            value={formData.code}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                code: e.target.value,
              }))
            }
          />
        </div>

        <div className="flex flex-col gap-1.5 w-full">
          <Label className="text-sm " htmlFor="country">
            Country
          </Label>
          <Input
            id="country"
            type="text"
            placeholder="Enter Country"
            className="bg-white"
            value={formData.country}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, country: e.target.value }))
            }
          />
        </div> */}
      </div>

      <div className="flex flex-col gap-4 2xl:gap-6 w-full lg:w-1/2">
      <div className="flex flex-col gap-1.5">
          <Label className="text-sm " htmlFor="centercode">
            Scan Center Code <span className="text-red-500">*</span>
          </Label>
          <Input
            id="centercode"
            type="text"
            placeholder="Enter Center Code"
            className="bg-white"
            value={formData.cust_id}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, cust_id: e.target.value }))
            }
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-sm " htmlFor="address">
            Center Address <span className="text-red-500">*</span>
          </Label>
          <Input
            id="address"
            type="text"
            placeholder="Enter Address"
            className="bg-white"
            value={formData.address}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, address: e.target.value }))
            }
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-sm " htmlFor="telephone">
            Telephone <span className="text-red-500">*</span>
          </Label>
          <Input
            id="telephone"
            type="number"
            placeholder="Enter Telephone Number"
            className="bg-white"
            value={formData.telephone}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length <= 10) {
                setFormData((prev) => ({
                  ...prev,
                  telephone: value,
                }));
              }
            }}
            required
          />
        </div>

        {/* <div className="flex flex-col gap-1.5 w-full">
          <Label className="text-sm " htmlFor="city">
            City
          </Label>
          <Input
            id="city"
            type="text"
            placeholder="Enter City"
            className="bg-white"
            value={formData.city}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, city: e.target.value }))
            }
          />
        </div>

        <div className="flex flex-col gap-1.5 w-full">
          <Label
            className="text-sm "
            htmlFor="state"
          >
            State
          </Label>
          <Input
            id="state"
            type="text"
            placeholder="Enter State"
            className="bg-white"
            value={formData.state}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, state: e.target.value }))
            }
          />
        </div> */}
      </div>
    </div>
  );
};