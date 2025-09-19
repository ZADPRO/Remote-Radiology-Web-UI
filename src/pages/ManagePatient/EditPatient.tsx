import React, { useEffect, useRef, useState } from "react";
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
import { Camera, Info, Mail, Pencil } from "lucide-react";
import { uploadService } from "@/services/commonServices";
import {
  dateDisablers,
  formatLocalDate,
  parseLocalDate,
} from "@/lib/dateUtils";
import { ListSpecificPatient, patientService } from "@/services/patientService";
import { toast } from "sonner";
import DatePicker from "@/components/date-picker";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatReadableDate } from "@/utlis/calculateAge";

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
}

const EditPatient: React.FC<EditPerformingProviderProps> = ({
  scanCenterId,
  scanCenterDoctorId,
  setIsEditDialogOpen,
  onUpdate,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null); // State for error messages

  console.log(error);
  const [newAppointment, setNewAppointment] = useState("");

  const [modelAppointent, setModelAppointment] = useState(false);
  const [mailoption, setMailOption] = useState("sendbywellthgreen");

  const [ScanCenter, setScanCenter] = useState({
    id: 0,
    name: "",
  });

  const [formData, setFormData] = useState<ListSpecificPatient>({
    profileImgFile: {
      base64Data: "",
      contentType: "",
    },

    refCODOEmail: "",
    refCODOPhoneNo1: "",
    refCODOPhoneNo1CountryCode: "",

    refRTId: 0,
    refUserCustId: "",
    refUserDOB: "",
    refUserFirstName: "",
    refUserLastName: "",
    refUserId: 0,
    refUserProfileImg: "",
    refUserStatus: false,
    refUserGender: "",
    appointments: [],
    refSCCustId: "",
    refSCId: 0,
  });

  function isDateValid(dateStr: string): boolean {
    // Input format: YYYY-MM-DD
    const inputDate = new Date(dateStr);
    const today = new Date();

    // Get tomorrow’s date (set to 00:00:00 for comparison)
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate());
    tomorrow.setHours(0, 0, 0, 0);

    // If the date is greater than tomorrow => false
    return inputDate <= tomorrow;
  }

  const [files, setFiles] = useState<TempFilesState>({
    profile_img: null,
  });

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

  const getSpecificCenterAdmin = async () => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      const res = await patientService.getSpecificPatient(
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

  const [mailPurpose, setMailPurpose] = useState("");

  console.log(formData);
  console.log(files);

  const handleProfileImageUpload = async (file: File) => {
    setError("");
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

  useEffect(() => {
    getSpecificCenterAdmin();
  }, [scanCenterDoctorId]); // Re-run effect if scanCenterAdminId changes

  const handleSubmit = async () => {
    setSaveLoading(true);
    setError("");

    try {
      const res = await patientService.updatePatient(formData);
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

  //   if (error) return <div className="text-red-500 mb-4 p-4">{error}</div>;
  if (loading) return <LoadingOverlay />;

  if (!formData) return <div className="p-4">No Patient data found.</div>;

  const handleFinalSubmit = async () => {
    setLoading(true);
    if (mailPurpose === "registerandsendMail") {
      const response = await patientService.createAppointmentPatient(
        formData,
        newAppointment,
        ScanCenter.id,
        ScanCenter.name,
        mailoption
      );

      if (response.status) {
        toast.success("Appointment Created");
        setModelAppointment(false);
        getSpecificCenterAdmin();
      }
    } else if (mailPurpose === "sendMail") {
      const response = await patientService.sendMailAppointmentPatient(
        formData,
        newAppointment,
        ScanCenter.id,
        ScanCenter.name,
        mailoption
      );

      if (response.Status) {
        toast.success("Appointment Mail Sended");
        setModelAppointment(false);
        getSpecificCenterAdmin();
      }
    }
    setLoading(false);
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
              <Label className="text-sm" htmlFor="Performing Provider Admin ID">
                Patient ID
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
          </div>
        </div>

        <h1 className="text-2xl font-bold my-4">Personal Details</h1>
        <div className="flex flex-col lg:flex-row items-start justify-between gap-4 lg:gap-15 w-full">
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
                value={formData.refUserFirstName}
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
              <Label className="text-sm " htmlFor="phone">
                Contact Number <span className="text-red-500">*</span>
              </Label>
              {/* Changed from grid to flex for better gap handling with percentage/flexible widths */}
              <div className="flex gap-2 relative">
                <Select
                  value={formData.refCODOPhoneNo1CountryCode}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      refCODOPhoneNo1CountryCode: value,
                    }))
                  }
                  disabled
                >
                  <SelectTrigger disabled className="bg-white">
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
                  value={formData.refCODOPhoneNo1}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= 10) {
                      setFormData((prev) => ({
                        ...prev,
                        refCODOPhoneNo1: value,
                      }));
                    }
                  }}
                  required
                  disabled
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 w-full">
              <Label className="text-sm " htmlFor="dob">
                Gender <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.refUserGender}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    refUserGender: value,
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
          </div>

          <div className="flex flex-col gap-4 2xl:gap-6 w-full lg:w-1/2">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm " htmlFor="email">
                E-Mail <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                className="bg-white"
                value={formData.refCODOEmail}
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

            <div className="flex flex-col gap-1.5 w-full relative">
              <Label className="text-sm " htmlFor="dob">
                Date Of Birth <span className="text-red-500">*</span>
              </Label>
              <DatePicker
                value={
                  formData.refUserDOB
                    ? parseLocalDate(formData.refUserDOB)
                    : undefined
                }
                className="pointer-events-auto"
                onChange={(val) => {
                  setFormData((prev) => ({
                    ...prev,
                    refUserDOB: val ? formatLocalDate(val) : "",
                  }));
                }}
                required
                disabledDates={dateDisablers.noFuture}
              />
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

        <Dialog open={modelAppointent} onOpenChange={setModelAppointment}>
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
                    value={mailoption}
                    onValueChange={(value) => {
                      setMailOption(value);
                    }}
                    required
                  >
                    <SelectTrigger id="status" className="bg-white w-full">
                      <SelectValue placeholder="Select Email Send Mail Option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sendbywellthgreen">
                        Send email by Wellthgreeen
                      </SelectItem>
                      <SelectItem value="sendbywon">
                        Send email by own
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {(mailPurpose !== "sendMail" || mailoption !== "sendbywon") && (
                  <div className="lg:w-[30%] w-full">
                    <Button onClick={handleFinalSubmit} variant="greenTheme">
                      Send Mail
                    </Button>
                  </div>
                )}
              </div>
              {mailoption === "sendbywon" ? (
                <>
                  <div className="my-5">
                    <div className="flex gap-2 text-sm items-center mt-2">
                      Subject
                    </div>
                    <div className="flex gap-2 text-sm items-center mt-2">
                      <div
                        ref={textRef}
                        className="w-full bg-[#fff] shadow-2xl rounded-lg p-2"
                      >
                        Welcome – Your Breast QT Scan Appointment at{" "}
                        {ScanCenter.name} Scan Centre
                      </div>
                      <Button variant="greenTheme" onClick={handleCopy}>
                        Copy
                      </Button>
                    </div>
                    <div className="flex gap-2 text-sm items-center mt-2">
                      Subject
                    </div>
                    <div className="flex gap-2 text-sm items-center mt-2">
                      <div
                        ref={textRefContent}
                        className="w-full bg-[#fff] shadow-2xl rounded-lg p-2"
                      >
                        Hi {formData.refUserFirstName},
                        <br />
                        <br />
                        Thank you for choosing {ScanCenter.name} Scan Centre for
                        your Breast QT (Quantitative Transmission) Imaging, also
                        known as Breast Acoustic CT. We’re looking forward to
                        supporting you with a smooth and comfortable experience
                        on your appointment date{" "}
                        {formatReadableDate(newAppointment)}
                        <br />
                        <br />
                        <b>
                          1. Log in:{" "}
                          <a href="https://easeqtremote.brightoncloudtech.com">
                            https://easeqtremote.brightoncloudtech.com
                          </a>
                        </b>
                        <br />
                        <br />
                        <b>2. Enter details: </b>
                        Once logged in with your email ID{" "}
                        <b>{formData.refCODOEmail}</b> using your password.
                        <br />
                        <br />
                        If you have any questions or need assistance, please
                        don’t hesitate to reach out to us. We’re here to make
                        this process as seamless as possible for you. Warm
                        regards, {ScanCenter.name} Scan Centre Team - Contact
                        Info
                      </div>
                      <Button variant="greenTheme" onClick={handleCopyContent}>
                        Copy
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                mailoption === "sendbywellthgreen" && (
                  <>
                    <div className="flex gap-2 text-sm items-center mt-2">
                      <Info size={15} /> Mail sent by admin@wellthgreen.com
                    </div>
                    <div className="w-full py-5">
                      <div className="bg-gray-100 font-sans min-h-screen py-10">
                        <div className="max-w-lg bg-[#EDD1CE] mx-auto p-8 rounded-lg shadow-md">
                          {/* Header */}
                          <div className="text-center pb-6">
                            <h1 className="text-gray-700 text-2xl font-bold">
                              Welcome, {formData.refUserFirstName}!
                            </h1>
                          </div>

                          {/* Content */}
                          <div className="text-center text-gray-700 text-base space-y-4">
                            <p>
                              You have successfully been onboarded as a{" "}
                              <strong>Patient</strong> at{" "}
                              <strong>Wellthgreen Theranostics</strong>.
                            </p>
                            <p>Your login credentials are as follows:</p>

                            {/* Credentials box */}
                            <div className="bg-white p-4 rounded-md border border-gray-300 w-fit mx-auto text-left font-mono">
                              <p>
                                <strong>Patient ID:</strong>{" "}
                                {formData.refUserCustId}
                              </p>
                              <p>
                                <strong>Email:</strong> {formData.refCODOEmail}
                              </p>
                              <p>
                                <strong>Password:</strong> Kindly use your
                                password
                              </p>
                            </div>

                            {/* Login button */}
                            <a
                              href="https://easeqtremote.brightoncloudtech.com/"
                              className="inline-block mt-4 px-6 py-3 bg-[#c6d4c0] text-white font-semibold rounded-md shadow hover:bg-[#b2c2ac] transition"
                            >
                              Login Now
                            </a>

                            <p className="pt-4">
                              If you did not request this registration, please
                              ignore this email.
                            </p>
                          </div>

                          {/* Footer */}
                          <div className="text-center text-xs text-gray-600 border-t border-gray-300 pt-4 mt-6">
                            &copy; {new Date().getFullYear()} Wellthgreen
                            Theranostics. All rights reserved.
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
      </form>

      <h1 className="text-2xl font-bold my-4">Appointment</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setScanCenter({
            id: formData.refSCId,
            name: formData.refSCCustId,
          });
          setModelAppointment(true);
          setMailPurpose("registerandsendMail");
        }}
      >
        <div className="flex gap-3 items-end relative">
          <div className="flex flex-col gap-1.5 w-full">
            <Label className="text-sm " htmlFor="dob">
              Date Of Appointment <span className="text-red-500">*</span>
            </Label>
            <DatePicker
              value={
                newAppointment ? parseLocalDate(newAppointment) : undefined
              }
              className="pointer-events-auto"
              onChange={(val) => {
                setNewAppointment(val ? formatLocalDate(val) : "");
              }}
              required
              disabledDates={dateDisablers.noPast}
            />
          </div>
          <Button type="submit" variant="greenTheme">
            Create Appointment
          </Button>
        </div>
      </form>
      <div className="p-4">
        <Table className="border rounded-lg">
          <TableHeader>
            <TableRow className="bg-[#81927f] rounded-t-lg">
              <TableHead className="font-bold">User ID</TableHead>
              <TableHead className="font-bold">Data</TableHead>
              <TableHead className="font-bold">Mail</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <>
              {formData.appointments && formData.appointments.length > 0 ? (
                <>
                  {formData.appointments.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell>{row.refSCCustId}</TableCell>
                      <TableCell>{row.refAppointmentDate}</TableCell>
                      <TableCell>
                        {!isDateValid(row.refAppointmentDate) ? (
                          <Mail
                            onClick={() => {
                              setScanCenter({
                                id: formData.refSCId,
                                name: formData.refSCCustId,
                              });
                              setModelAppointment(true);
                              setMailPurpose("sendMail");
                            }}
                            className="cursor-pointer"
                            size={18}
                          />
                        ) : (
                          `-`
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              ) : (
                <>No Reports</>
              )}
            </>
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default EditPatient;
