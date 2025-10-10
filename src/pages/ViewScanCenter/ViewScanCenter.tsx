import React, { useEffect, useState } from "react";
import { ArrowLeft, Camera, Pencil } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ListSpecificScanCenter,
  scancenterService,
} from "@/services/scancenterService";
import { uploadService } from "@/services/commonServices";
import LoadingOverlay from "@/components/ui/CustomComponents/loadingOverlay";
import { useAuth } from "../Routes/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface files {
  profile_img: File | null;
}

const ViewScanCenter: React.FC = () => {
  const { id } = useParams();
  console.log(id);
  const navigate = useNavigate();
  const { user } = useAuth();
  const scanCenterId = id ? Number(id) : user?.refSCId;

  const { role } = useAuth();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  console.log(error);
  const [formData, setFormData] = useState<ListSpecificScanCenter>({
    profileImgFile: {
      base64Data: "",
      contentType: "",
    },
    refSCAddress: "",
    refSCAppointments: false,
    refSCEmail: "",
    refSCId: 0,
    refSCName: "",
    refSCPhoneNo1: "",
    refSCPhoneNo1CountryCode: "",
    refSCPhoneNo2: "",
    refSCCustId: "",
    refSCProfile: "",
    refSCWebsite: "",
    refSCStatus: false,
    refSCConsultantStatus: false,
  });

  const [files, setFiles] = useState<files>({
    profile_img: null,
  });

  const handleProfileImageUpload = async (file: File) => {
    setError("");
    const formDataImg = new FormData();
    formDataImg.append("profileImage", file);

    try {
      const response = await uploadService.uploadImage({
        formImg: formDataImg,
      });

      if (response.status) {
        setFormData((prev) => ({
          ...prev,
          refSCProfile: response.fileName,
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

  const getSpecificScanCenter = async () => {
    setLoading(true);
    try {
      if (!scanCenterId) return;
      console.log(scanCenterId);
      const res = await scancenterService.getSpecificScanCenters(scanCenterId);
      console.log(res);
      if (res.status) {
        setFormData(res.data[0]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        id: formData.refSCId,
        name: formData.refSCName,
        address: formData.refSCAddress,
        // contact_number_code: formData.refSCPhoneNo1CountryCode,
        // contact_number: formData.refSCPhoneNo1,
        website: formData.refSCWebsite,
        email: formData.refSCEmail,
        telephone: formData.refSCPhoneNo1,
        appointments: formData.refSCAppointments,
        logo: formData.refSCProfile,
        status: formData.refSCStatus,
        refSCConsultantStatus: formData.refSCConsultantStatus,
      };
      console.log('ViewScanCenter.tsx / payload / 108 -------------------  ', payload);
      const res = await scancenterService.updateScanCenter(payload);
      console.log(res);
      if (res.status) {
        navigate(-1);
      } else {
        setError(res.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSpecificScanCenter();
  }, []);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="lg:px-[2.5vh] flex flex-col"
    >
      {loading && <LoadingOverlay />}
      {/* Header */}
      <div className="h-[10vh] flex items-center justify-start text-xl font-bold">
        <div className="flex items-center gap-2">
          <ArrowLeft className="cursor-pointer" onClick={() => navigate(-1)} />
          <h1>SCAN CENTER</h1>
        </div>
      </div>

      {/* Content */}
      <div className="h-[70vh] flex justify-center items-center">
        <div className="bg-[#F9F4EC] overflow-scroll rounded-2xl shadow-md w-[95%] lg:w-[90%] max-w-screen-xl h-full p-4 lg:p-10 flex flex-col lg:flex-row gap-10 items-center justify-between">
          {/* Profile Image */}
          <div className="flex justify-center items-center lg:w-1/4">
            {formData.refSCProfile.length === 0 ? (
              <div className="relative w-32 h-32 lg:w-52 lg:h-52 flex flex-col items-center justify-center bg-[#A3B1A1] rounded-full text-white shadow-md hover:bg-[#81927f] cursor-pointer">
                <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                  <Camera className="w-16 h-16" />
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.svg"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (file.size > 5 * 1024 * 1024) {
                        setError("Image must be less than 5MB.");
                        return;
                      }
                      handleProfileImageUpload(file);
                    }}
                  />
                </label>
              </div>
            ) : (
              <div className="relative w-32 h-32 lg:w-52 lg:h-52">
                <img
                  src={
                    files.profile_img
                      ? URL.createObjectURL(files.profile_img)
                      : `data:${formData.profileImgFile?.contentType};base64,${formData.profileImgFile?.base64Data}`
                  }
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover border-4 border-[#A3B1A1] shadow"
                />
                <label className="absolute bottom-2 right-2 bg-[#A3B1A1] rounded-full p-2 shadow cursor-pointer hover:bg-[#728270]">
                  <Pencil className="w-5 h-5 text-white" />
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.svg"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (file.size > 5 * 1024 * 1024) {
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

          {/* Form and Buttons */}
          <div className="flex flex-col justify-between h-full w-full lg:w-3/4">
            {/* Appointment */}
            <h1 className="text-2xl font-bold">SCAN CENTER DETAILS</h1>
            {/* <div className="flex justify-start lg:justify-end items-center gap-2 mb-4">
              <Checkbox2
                id="appointment"
                checked={formData.refSCAppointments}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    refSCAppointments: Boolean(checked),
                  }))
                }
              />
              <label htmlFor="appointment" className="font-semibold text-sm">
                APPOINTMENT
              </label>
            </div> */}

            {/* Fields */}
            <div className="space-y-4">
              {[
                { label: "NAME", value: formData.refSCName, key: "refSCName" },
                {
                  label: "ADDRESS",
                  value: formData.refSCAddress,
                  key: "refSCAddress",
                },
                {
                  label: "TELEPHONE",
                  value: formData.refSCPhoneNo1,
                  key: "refSCPhoneNo1",
                },
                {
                  label: "WEBSITE",
                  value: formData.refSCWebsite,
                  key: "refSCWebsite",
                },
                {
                  label: "EMAIL",
                  value: formData.refSCEmail,
                  key: "refSCEmail",
                },
                {
                  label: "SCAN CENTER CODE",
                  value: formData.refSCCustId,
                  key: "refSCCustId",
                },
              ].map(({ label, value, key }, index) => (
                <div
                  key={index}
                  className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-4 "
                >
                  <label className="font-semibold text-sm w-1/5">
                    {label} :
                  </label>
                  <Input
                    value={value}
                    disabled={key === "refSCCustId"}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        [key]: e.target.value,
                      }))
                    }
                    required
                    className="w-full bg-white"
                  />
                </div>
              ))}
              {(role?.type === "admin" || role?.type === "manager") && (
                <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-4 ">
                  <label className="font-semibold text-sm w-1/5">
                    Active :
                  </label>
                  <div className="flex flex-col gap-1.5 w-full relative">
                    <Select
                      value={formData.refSCStatus ? "true" : "false"}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          refSCStatus: Boolean(value === "true"),
                        }))
                      }
                      required
                    >
                      <SelectTrigger id="gender" className="bg-white w-full">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Active</SelectItem>
                        <SelectItem value="false">InActive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-4 ">
                <label className="font-semibold text-sm w-1/5">
                  Consultant Link :
                </label>
                <div className="flex flex-col gap-1.5 w-full relative">
                  <Select
                    value={formData.refSCConsultantStatus ? "true" : "false"}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        refSCConsultantStatus: Boolean(value === "true"),
                      }))
                    }
                    required
                  >
                    <SelectTrigger id="gender" className="bg-white w-full">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Allow</SelectItem>
                      <SelectItem value="false">Do not allow</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col lg:flex-row justify-between items-center mt-6 w-full gap-4">
              <div className="flex flex-wrap gap-4">
                {user?.refRTId != 3 && (
                  <Button
                    type="button"
                    className="bg-[#A3B1A1] text-white hover:bg-[#91a191] w-full lg:w-auto"
                    onClick={() =>
                      navigate("../manageScanCenterAdmin", {
                        state: formData.refSCId,
                      })
                    }
                  >
                    Manage Center Manager
                  </Button>
                )}

                <Button
                  type="button"
                  className="bg-[#A3B1A1] text-white hover:bg-[#91a191] w-full lg:w-auto"
                  onClick={() =>
                    navigate("../manageTechnician", { state: formData.refSCId })
                  }
                >
                  Manage Technician
                </Button>

                <Button
                  type="button"
                  className="bg-[#A3B1A1] text-white hover:bg-[#91a191] w-full lg:w-auto"
                  onClick={() =>
                    navigate("../managePerformingProvider", {
                      state: formData.refSCId,
                    })
                  }
                >
                  Manage Performing Provider
                </Button>
                <Button
                  type="button"
                  className="bg-[#A3B1A1] text-white hover:bg-[#91a191] w-full lg:w-auto"
                  onClick={() =>
                    navigate("../manageCoReportingDoctor", {
                      state: formData.refSCId,
                    })
                  }
                >
                  Manage Reviewer
                </Button>
                <Button
                  type="button"
                  variant="pinkTheme"
                  className=" w-full lg:w-auto p-6 font-semibold"
                  onClick={() =>
                    navigate("../managePatient", {
                      state: {
                        scanCenterId: formData.refSCId,
                        SCName: formData.refSCCustId,
                      },
                    })
                  }
                >
                  MANAGE PATIENTS
                </Button>
              </div>
              <Button
                variant="link"
                className="text-[#0e7a00]  font-semibold text-lg"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ViewScanCenter;
