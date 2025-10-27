import React, { useEffect, useRef, useState } from "react";
import addRadiologist_Bg from "../../assets/Add Admins/Add Radiologist BG.png";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  CircleAlert,
  Info,
  Pencil,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
// import DatePicker from "@/components/date-picker";
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
import LoadingOverlay from "@/components/ui/CustomComponents/loadingOverlay";
// import {
//   dateDisablers,
//   formatLocalDate,
//   parseLocalDate,
// } from "@/lib/dateUtils";
import { NewPatient, patientService } from "@/services/patientService";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatReadableDate } from "@/utlis/calculateAge";
import DefaultDatePicker from "@/components/DefaultDatePicker";

interface TempFilesState {
  profile_img: File | null;
}

const AddPatient: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<NewPatient>({
    firstname: "",
    lastname: "",
    profile_img: "",
    dob: "",
    phoneCountryCode: "+1",
    phone: "",
    email: "",
    gender: "",
    dateofAppointment: "",
    custId: "",
    mailoption: "sendbywellthgreen",
  });

  console.log(formData);

  const [files, setFiles] = useState<TempFilesState>({
    profile_img: null,
  });

  const [loading, setLoading] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);

  const errorRef = useRef<HTMLDivElement>(null);

  const location = useLocation();

  const { scanCenterId, SCName } = location.state || {};
  const id = Number(scanCenterId);

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
      </div>
    );
  };

  const [mailModel, setMailModel] = useState(false);

  const handleFinalSubmit = async () => {
    setError("");
    setLoading(true);
    setMailModel(false);
    try {
      console.log("finalForm", formData);
      const res = await patientService.addPatient(formData, id, SCName);
      console.log(res);
      if (res.status) {
        toast.success(res.message);
        setTimeout(() => {
          navigate("../managePatient", {
            replace: true,
            state: {
              scanCenterId: scanCenterId,
              SCName: SCName,
            },
          });
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

  const handleVerifyUserData = async () => {
    setError("");
    setLoading(true);
    try {
      if (formData.gender.length === 0) {
        setError("Select Gender");
        return;
      }

      const res = await patientService.checkPatient(
        formData.email,
        formData.phone,
        formData.custId
      );
      console.log(res);
      if (res.status) {
        setMailModel(true);
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

  const textRef = useRef<HTMLDivElement>(null);
  const textRefContent = useRef<HTMLDivElement>(null);

  const handleCopy = () => {
    if (textRef.current) {
      const text = textRef.current.innerText;
      toast.success("Text copied to clipboard");
      navigator.clipboard.writeText(text);
    }
  };

  const handleCopyContent = () => {
    if (textRefContent.current) {
      const text = textRefContent.current.innerText;
      toast.success("Text copied to clipboard");
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <>
      <Dialog open={mailModel} onOpenChange={setMailModel}>
        <DialogContent
          style={{ background: "#f9f4ec" }}
          className="w-[100vw] lg:w-[90vw] h-[90vh] overflow-y-auto p-5"
        >
          <DialogHeader>
            <DialogTitle>Send Mail Option</DialogTitle>
          </DialogHeader>
          <div className="w-full h-[75vh]">
            <div className="w-full flex gap-3 items-end">
              <div className="lg:w-[40%] w-full">
                <Label className="text-sm " htmlFor="dob">
                  Email Send Mail Option
                </Label>
                <Select
                  value={formData.mailoption}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      mailoption: value,
                    }))
                  }
                  required
                >
                  <SelectTrigger id="status" className="bg-white w-full">
                    <SelectValue placeholder="Select Email Send Mail Option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sendbywellthgreen">
                      Send email by Wellthgreen
                    </SelectItem>
                    <SelectItem value="sendbywon">Send email by own</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="lg:w-[30%] w-full">
                <Button onClick={handleFinalSubmit} variant="greenTheme">
                  Sign up Patient
                  {formData.mailoption === "sendbywellthgreen"
                    ? ` and Send Mail`
                    : ``}
                </Button>
              </div>
            </div>
            {formData.mailoption === "sendbywon" ? (
              <>
                <div className="mb-5 mt-3 pb-10">
                  <div className="flex gap-2 text-sm items-center mb-3">
                    <Info size={15} /> Kindly copy the email content and send it
                    to the patient.
                  </div>
                  <div className="flex gap-2 text-sm items-center mt-2">
                    Subject
                  </div>
                  <div className="flex gap-2 text-sm items-center mt-2">
                    <div
                      ref={textRef}
                      className="w-full bg-[#fff] shadow-2xl rounded-lg p-2"
                    >
                      Welcome – Your Appointment at {SCName} Scan Center
                    </div>
                    <Button variant="greenTheme" onClick={handleCopy}>
                      Copy
                    </Button>
                  </div>
                  <div className="flex gap-2 text-sm items-center mt-2">
                    Content
                  </div>
                  <div className="flex gap-2 text-sm items-center mt-2">
                    <div
                      ref={textRefContent}
                      className="w-full bg-[#fff] shadow-2xl rounded-lg p-2"
                    >
                      Hi {formData.firstname},
                      <br />
                      <br />
                      Thank you for choosing {SCName} Scan Center for your
                      Breast QT (Quantitative Transmission) Imaging, also known
                      as Breast Acoustic CT. We are delighted to assist you and
                      ensure a smooth, comfortable experience on your
                      appointment date:
                      {formatReadableDate(formData.dateofAppointment)}
                      <br />
                      <br />
                      <b>To get started, please follow these steps:</b>
                      <br />
                      <br />
                      <b>
                        Log in:{" "}
                        <a href="https://reportportal.wellthgreen.com">
                          https://reportportal.wellthgreen.com
                        </a>
                      </b>
                      <br />
                      <br />
                      <b>Access your account: </b>
                      Use your email ID <b>{formData.email}</b> and password{" "}
                      <b>{formData.dob}</b> to log in and complete your details.
                      <br />
                      <br />
                      If you have any questions or need any assistance, our team
                      is here to help. Please don’t hesitate to contact us—we’re
                      committed to making this process as easy and hassle-free
                      as possible.
                      <br />
                      <br />
                      Warm regards,
                      <br />
                      <strong>{SCName} Scan Center Team</strong>
                    </div>
                    <Button variant="greenTheme" onClick={handleCopyContent}>
                      Copy
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              formData.mailoption === "sendbywellthgreen" && (
                <>
                  <div className="flex gap-2 text-sm items-center mt-2">
                    <Info size={15} /> Mail sent by admin@wellthgreen.com
                  </div>
                  <div className="w-full py-5">
                    <div className=" font-sans min-h-screen py-10">
                      <div className="max-w-lg bg-[#EDD1CE] mx-auto p-8 rounded-lg shadow-md">
                        {/* Header */}
                        <div className="text-center pb-6">
                          <h1 className="text-gray-700 text-2xl font-bold">
                            Welcome, {formData.firstname}!
                          </h1>
                        </div>

                        {/* Content */}
                        <div className="text-center text-gray-700 text-base space-y-4">
                          <p>
                            You have successfully been onboarded as a{" "}
                            <strong>Patient</strong> on{" "}
                            <strong>Wellthgreen Report Portal</strong>.
                          </p>
                          <p>Your login credentials are as follows:</p>

                          {/* Credentials box */}
                          <div className="bg-white p-4 rounded-md border border-gray-300 w-fit mx-auto text-left font-mono">
                            <p>
                              <strong>Patient ID:</strong> {formData.custId}
                            </p>
                            <p>
                              <strong>Email:</strong> {formData.email}
                            </p>
                            <p>
                              <strong>Password:</strong> {formData.dob}
                            </p>
                          </div>

                          {/* Login button */}
                          <a
                            href="https://reportportal.wellthgreen.com/"
                            className="inline-block mt-4 px-6 py-3 bg-[#c6d4c0] text-white font-semibold rounded-md shadow hover:bg-[#b2c2ac] transition"
                          >
                            Login Now
                          </a>

                          <p className="pt-4">
                            If you did not request it, please ignore this email.
                          </p>
                        </div>

                        {/* Footer */}
                        <div className="text-center text-xs text-gray-600 border-t border-gray-300 pt-4 mt-6">
                          &copy; {new Date().getFullYear()} Wellthgreen. All
                          rights reserved.
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )
            )}
          </div>
        </DialogContent>
      </Dialog>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleVerifyUserData();
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
              window.innerWidth >= 1024
                ? `url(${addRadiologist_Bg})`
                : undefined,
          }}
        >
          <h1 className="text-[#3F3F3D] uppercase font-[900] lg:pl-10 text-xl lg:text-3xl text-center lg:text-left tracking-widest">
            Add Patient
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
    </>
  );
};

export default AddPatient;

interface PersonalDetailsFormProps {
  formData: NewPatient;
  setFormData: React.Dispatch<React.SetStateAction<NewPatient>>;
  tempFiles: TempFilesState;
  setTempFiles: React.Dispatch<React.SetStateAction<TempFilesState>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const PersonalDetailsForm: React.FC<PersonalDetailsFormProps> = ({
  formData,
  setFormData,
}) => {
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
          <Label className="text-sm " htmlFor="phone">
            Contact Number
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
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5 w-full">
          <Label className="text-sm " htmlFor="dob">
            Gender <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.gender}
            onValueChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                gender: value,
              }))
            }
            required
          >
            <SelectTrigger id="status" className="bg-white w-full">
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="transgender-born male">
                Transgender - Born Male
              </SelectItem>
              <SelectItem value="transgender-born female">
                Transgender - Born Female
              </SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5 w-full">
          <Label className="text-sm " htmlFor="dob">
            Date Of Appointment <span className="text-red-500">*</span>
          </Label>
          {/* <DatePicker
            value={
              formData.dateofAppointment
                ? parseLocalDate(formData.dateofAppointment)
                : undefined
            }
            onChange={(val) => {
              setFormData((prev) => ({
                ...prev,
                dateofAppointment: val ? formatLocalDate(val) : "",
              }));
            }}
            required
            disabledDates={dateDisablers.noPast}
          /> */}
          <DefaultDatePicker
            value={formData.dateofAppointment}
            onChange={(val) => {
              setFormData((prev) => ({
                ...prev,
                dateofAppointment: val.target.value,
              }));
            }}
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 2xl:gap-6 w-full lg:w-1/2">
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm " htmlFor="firstname">
            Patient ID
          </Label>
          <Input
            id="firstname"
            type="text"
            placeholder="Enter Patient ID"
            className="bg-white"
            value={formData.custId}
            onChange={(e) => {
              const value = e.target.value;
              // Allow only letters, numbers, and hyphen
              const sanitized = value.replace(/[^a-zA-Z0-9-]/g, "");
              setFormData((prev) => ({ ...prev, custId: sanitized }));
            }}
            // required
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

        {/* <div className="flex flex-col gap-1.5 w-full">
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
            disabledDates={dateDisablers.noFuture}
          />
        </div> */}

        <div className="flex flex-col gap-1.5 w-full">
          <Label className="text-sm " htmlFor="dob">
            Date Of Birth <span className="text-red-500">*</span>
          </Label>
          <DefaultDatePicker
            value={formData.dob}
            onChange={(val) => {
              setFormData((prev) => ({
                ...prev,
                dob: val.target.value,
              }));
            }}
            required
          />
        </div>
      </div>
    </div>
  );
};
