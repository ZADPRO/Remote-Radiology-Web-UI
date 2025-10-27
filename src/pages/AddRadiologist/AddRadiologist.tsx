import React, { useCallback, useEffect, useRef, useState } from "react";
import addRadiologist_Bg from "../../assets/Add Admins/Add Radiologist BG.png";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
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
import {
  NewRadiologist,
  radiologistService,
} from "@/services/radiologistService";
import { useNavigate } from "react-router-dom";
import { MedicalLicenseSecurity } from "@/services/doctorService";
import LoadingOverlay from "@/components/ui/CustomComponents/loadingOverlay";
import FileUploadButton from "@/components/ui/CustomComponents/FileUploadButton";
import { dateDisablers, parseLocalDate } from "@/lib/dateUtils";

interface TempFilesState {
  profile_img: File | null;
  cv_files: File[];
  license_files: File[];
  pan: File | null;
  aadhar: File | null;
  drivers_license: File | null;
  malpracticeinsureance_files: File[];
  digital_signature: File | null;
}

const AddRadiologist: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<NewRadiologist>({
    firstname: "",
    lastname: "", // Removed lastname
    profile_img: "",
    dob: "",
    phoneCountryCode: "+91",
    phone: "",
    email: "",
    mbbs_register_number: "",
    md_register_number: "",
    specialization: "",
    pan: "",
    aadhar: "",
    drivers_license: "",
    // experience: [],
    medical_license_security: [
      {
        State: "",
        MedicalLicenseSecurityNo: "",
      },
    ],
    malpracticeinsureance_files: [],
    cv_files: [],
    license_files: [],
    digital_signature: "",
  });

  console.log(formData);

  const [files, setFiles] = useState<TempFilesState>({
    profile_img: null,
    cv_files: [],
    license_files: [],
    pan: null,
    aadhar: null,
    drivers_license: null,
    malpracticeinsureance_files: [],
    digital_signature: null,
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [error]);

  // Functions moved from subcomponents
  const handleSingleFileUpload = useCallback(
    async ({
      file,
      fieldName, // e.g., "aadhar_file" or "pan_file"
      tempFileKey, // e.g., "aadhar" or "pan"
    }: {
      file: File;
      fieldName: keyof NewRadiologist;
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
    },
    [setFormData, setFiles, setError]
  );

  const uploadAndStoreFile = useCallback(
    async (
      file: File,
      field: keyof NewRadiologist,
      tempFileKey: keyof TempFilesState
    ): Promise<void> => {
      setError(null);
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
          setFiles((prev) => ({
            ...prev,
            [tempFileKey]: [...((prev[tempFileKey] as File[]) || []), file],
          }));
        } else {
          setError(`Upload failed for file: ${file.name}`);
        }
      } catch (err) {
        setError(`Error uploading file: ${file.name}`);
      }
    },
    [setFormData, setFiles, setError]
  );

  const handleRemoveMultiFile = useCallback(
    (
      key: "cv_files" | "license_files" | "malpracticeinsureance_files",
      index: number
    ) => {
      setError(null);
      setFiles((prev) => ({
        ...prev,
        [key]: (prev[key] as File[]).filter((_, i) => i !== index),
      }));

      setFormData((prev) => ({
        ...prev,
        [key]: (prev[key] as UploadFile[]).filter((_, i) => i !== index),
      }));
    },
    [setFormData, setFiles]
  );

  const handleAddMedicalLicense = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      medical_license_security: [
        ...prev.medical_license_security,
        { State: "", MedicalLicenseSecurityNo: "" },
      ],
    }));
  }, [setFormData]);

  const handleRemoveMedicalLicense = useCallback(
    (index: number) => {
      setFormData((prev) => ({
        ...prev,
        medical_license_security: prev.medical_license_security.filter(
          (_, i) => i !== index
        ),
      }));
    },
    [setFormData]
  );

  const handleMedicalLicenseChange = useCallback(
    (index: number, field: keyof MedicalLicenseSecurity, value: string) => {
      const updated = [...formData.medical_license_security];
      updated[index][field] = value;

      setFormData((prev) => ({
        ...prev,
        medical_license_security: updated,
      }));
    },
    [formData.medical_license_security, setFormData]
  );

  const handleRemoveSingleFile = useCallback(
    (
      key:
        | "profile_img"
        | "pan"
        | "aadhar"
        | "drivers_license"
        | "digital_signature"
    ) => {
      setFiles((prev) => ({
        ...prev,
        [key]: null,
      }));

      setFormData((prev) => ({
        ...prev,
        [key]: "", // Set to empty string for file paths
      }));
    },
    [setFormData, setFiles]
  );

  const handleDigitalSignatureUpload = useCallback(
    async (file: File) => {
      setError(null);
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
    },
    [setFormData, setFiles, setError]
  );

  const handleProfileImageUpload = useCallback(
    async (file: File) => {
      setError(null);
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
    },
    [setFormData, setFiles, setError]
  );

  const renderStepForm = () => {
    return (
      <div className="flex flex-col gap-8">
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
                    setFormData((prev) => ({
                      ...prev,
                      firstname: e.target.value,
                    }))
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
                  id="aadhar"
                  type="text"
                  placeholder="Enter Aadhar Number"
                  className="bg-white"
                  value={formData.aadhar}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, aadhar: e.target.value }))
                  }
                  required
                />

                {/* <FileUploadButton
                  id="aadhar-upload"
                  label="Upload Aadhar"
                  required={true}
                  isFilePresent={formData.aadhar?.length > 0}
                  maxSize={5 * 1024 * 1024} // 5MB
                  setError={setError}
                  onValidFile={(file) => {
                    handleSingleFileUpload({
                      file,
                      fieldName: "aadhar",
                      tempFileKey: "aadhar",
                    });
                  }}
                /> */}

                {/* Uploaded Aadhar */}
                {/* {files.aadhar && (
                  <div className="mt-2 w-full flex flex-col sm:flex-row sm:items-center sm:justify-between border border-gray-300 rounded-lg px-3 py-2 hover:shadow-sm transition bg-blue-100 text-sm text-gray-800 font-medium gap-2">
                    <span className="break-words">{files.aadhar.name}</span>

                    <button
                      type="button"
                      onClick={() => handleRemoveSingleFile("aadhar")}
                      className="text-red-500 hover:text-red-700 cursor-pointer self-start sm:self-auto"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )} */}
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
                      tempFileKey: "drivers_license",
                    });
                  }}
                />

                {/* Uploaded Driver's License */}
                {files.drivers_license && (
                  <div className="mt-2 w-full flex flex-col sm:flex-row sm:items-center sm:justify-between border border-gray-300 rounded-lg px-3 py-2 hover:shadow-sm transition bg-blue-100 text-sm text-gray-800 font-medium gap-2">
                    <span className="break-words">
                      {files.drivers_license.name}
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
                  value={
                    formData.dob ? parseLocalDate(formData.dob) : undefined
                  }
                  onChange={(val) => {
                    setFormData((prev) => ({
                      ...prev,
                      dob: val?.toLocaleDateString("en-CA") || "",
                    }));
                  }}
                  disabledDates={dateDisablers.noFuture}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5 w-full">
                <Label className="text-sm" htmlFor="pan-upload">
                  PAN <span className="text-red-500">*</span>
                </Label>

                <Input
                  id="pan"
                  type="text"
                  placeholder="Enter PAN"
                  className="bg-white"
                  value={formData.pan}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, pan: e.target.value }))
                  }
                  required
                />

                {/* <FileUploadButton
                  id="pan-upload"
                  label="Upload PAN"
                  required={true}
                  isFilePresent={formData.pan?.length > 0}
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
                /> */}

                {/* Uploaded PAN */}
                {/* {files.pan && (
                  <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between border border-gray-300 rounded-lg px-3 py-2 hover:shadow-sm transition bg-blue-100 text-sm text-gray-800 font-medium gap-2">
                    <span className="break-words">{files.pan.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSingleFile("pan")}
                      className="text-red-500 hover:text-red-700 cursor-pointer self-start sm:self-auto"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )} */}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Professional Details</h1>
          <div className="flex flex-col lg:flex-row items-start justify-between gap-4 lg:gap-15">
            <div className="flex flex-col gap-4 2xl:gap-6 w-full lg:w-1/2">
              <div className="flex flex-col gap-1.5 w-full">
                <Label className="text-sm " htmlFor="mbbs_register_number">
                  MBBS Registration Number
                </Label>
                <Input
                  id="mbbs_register_number"
                  type="text"
                  placeholder="Enter Registration Number"
                  className="bg-white"
                  value={formData.mbbs_register_number}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      mbbs_register_number: e.target.value,
                    }))
                  }
                  // required
                />
              </div>

              <div className="flex flex-col gap-1.5 w-full">
                <Label className="text-sm " htmlFor="specialization">
                  Specialization
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
                <Label className="text-sm" htmlFor="medical-license-upload">
                  Upload License
                </Label>

                <FileUploadButton
                  id="medical-license-upload"
                  label="Upload Licenses"
                  multiple
                  // required={formData.license_files.length === 0}
                  isFilePresent={formData.license_files.length > 0}
                  onChange={async (e) => {
                    const filesSelected = e.target.files;
                    if (!filesSelected) return;

                    const selectedFiles = Array.from(filesSelected);
                    const maxSize = 10 * 1024 * 1024;

                    const filteredFiles = selectedFiles.filter(
                      (file) =>
                        file.size <= maxSize &&
                        !files.license_files.some(
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
                        "license_files",
                        "license_files"
                      );
                    }
                  }}
                />

                {files.license_files.length > 0 && (
                  <ul className="mt-2 space-y-2 text-sm text-gray-800">
                    {files.license_files.map((file, index) => (
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
                        handleMedicalLicenseChange(
                          index,
                          "State",
                          e.target.value
                        )
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
            <div className="flex flex-col gap-4 2xl:gap-6 w-full lg:w-1/2">
              <div className="flex flex-col gap-1.5 w-full">
                <Label className="text-sm " htmlFor="md_register_number">
                  MD Registration Number
                </Label>
                <Input
                  id="md_register_number"
                  type="text"
                  placeholder="Enter MD Registration Number"
                  className="bg-white"
                  value={formData.md_register_number}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      md_register_number: e.target.value,
                    }))
                  }
                  // required
                />
              </div>

              <div className="flex flex-col gap-1.5 w-full">
                <Label className="text-sm" htmlFor="cv-upload">
                  Upload CV
                </Label>

                <FileUploadButton
                  id="cv-upload"
                  label="Upload CV Files"
                  multiple
                  // required={formData.cv_files.length === 0}
                  isFilePresent={formData.cv_files.length > 0}
                  onChange={async (e) => {
                    const filesSelected = e.target.files;
                    if (!filesSelected) return;

                    const selectedFiles = Array.from(filesSelected);
                    const maxSize = 10 * 1024 * 1024;

                    const filteredFiles = selectedFiles.filter(
                      (file) =>
                        file.size <= maxSize &&
                        !files.cv_files.some(
                          (existingFile) => existingFile.name === file.name
                        )
                    );

                    if (filteredFiles.length < selectedFiles.length) {
                      setError(
                        "Some files were larger than 10MB or were duplicates and were not added."
                      );
                    }

                    for (const file of filteredFiles) {
                      await uploadAndStoreFile(file, "cv_files", "cv_files");
                    }
                  }}
                />

                {files.cv_files.length > 0 && (
                  <ul className="mt-2 space-y-2 text-sm text-gray-800">
                    {files.cv_files.map((file, index) => (
                      <li
                        key={index}
                        className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border border-gray-300 rounded-lg px-3 py-2 hover:shadow-sm transition bg-blue-100 font-medium"
                      >
                        <span className="break-words">{file.name}</span>

                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveMultiFile("cv_files", index)
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
                <Label className="text-sm" htmlFor="malpractice-upload">
                  Upload Malpractice Insurance
                </Label>

                <FileUploadButton
                  id="malpractice-upload"
                  label="Upload Malpractice Insurance Files"
                  multiple
                  // required={formData.malpracticeinsureance_files.length === 0}
                  isFilePresent={
                    formData.malpracticeinsureance_files.length > 0
                  }
                  onChange={async (e) => {
                    const filesSelected = e.target.files;
                    if (!filesSelected) return;

                    const selectedFiles = Array.from(filesSelected);
                    const maxSize = 10 * 1024 * 1024;

                    const filteredFiles = selectedFiles.filter(
                      (file) =>
                        file.size <= maxSize &&
                        !files.malpracticeinsureance_files.some(
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

                {files.malpracticeinsureance_files.length > 0 && (
                  <ul className="mt-2 space-y-2 text-sm text-gray-800">
                    {files.malpracticeinsureance_files.map((file, index) => (
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
                      onClick={() =>
                        handleRemoveSingleFile("digital_signature")
                      }
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
    setError("");
    setLoading(true);
    try {
      // Basic validation before submission (removed lastname check)
      if (
        !formData.firstname ||
        !formData.email ||
        !formData.phone ||
        !formData.dob ||
        !formData.pan ||
        !formData.aadhar ||
        formData.medical_license_security.some(
          (lic) => !lic.State || !lic.MedicalLicenseSecurityNo
        )
      ) {
        setError(
          "Please fill in all required fields and upload all necessary documents."
        );
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

      // Phone number validation (assuming 10 digits for +91 country code)
      if (formData.phoneCountryCode === "+91" && formData.phone.length !== 10) {
        setError("Phone number must be 10 digits for India.");
        setLoading(false);
        return;
      }

      const res = await radiologistService.createNewRadiologist(formData);
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
      setError("");
    } finally {
      setLoading(false);
    }
  };

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
          Add Radiologist
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

export default AddRadiologist;
