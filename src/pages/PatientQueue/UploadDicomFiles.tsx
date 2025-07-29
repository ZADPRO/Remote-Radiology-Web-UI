import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { technicianService } from "@/services/technicianServices";
import { AxiosProgressEvent } from "axios";
import { ArrowLeft, CloudUpload, Trash2, Upload } from "lucide-react";
import React, { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import dicomFile from "../../assets/Patient-InTake Form/Dicomfile_img.png";
import LoadingOverlay from "@/components/ui/CustomComponents/loadingOverlay";

type Side = "Left" | "Right";

interface UploadedFile {
  name: string;
  size: number;
  status: "uploading" | "completed";
  uploadedSize: number;
  file: File;
  savedName?: string;
  side: Side;
}

interface DicomAppointmentdetails {
  userId: number;
  appointmentId: number;
}

export interface TechnicianIntakeFormNavigationState {
  name?: string;
  custId?: string;
  scancenterCustId?: string;
}

const UploadDicomFiles: React.FC = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const locationState =
    location.state as TechnicianIntakeFormNavigationState | null;

  const appointmentDetails: DicomAppointmentdetails = useLocation().state;
  console.log(appointmentDetails);

  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [error, setError] = useState<Record<Side, string>>({
    Left: "",
    Right: "",
  });

  const [finalError, setFinalError] = useState<string>("");

  console.log(files);

  const fileInputRefs = {
    Left: useRef<HTMLInputElement | null>(null),
    Right: useRef<HTMLInputElement | null>(null),
  };

  const errorRefs = {
    Left: useRef<HTMLInputElement | null>(null),
    Right: useRef<HTMLInputElement | null>(null),
  };

  const [loading, setLoading] = useState<boolean>(false);

  const scrollToError = (side: Side) => {
    setTimeout(
      () => errorRefs[side].current?.scrollIntoView({ behavior: "smooth" }),
      100
    );
  };

  const handleFileClick = (side: Side) => {
    fileInputRefs[side].current?.click();
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>, side: Side) => {
    const selectedFiles = Array.from(e.target.files || []);
    setError((prev) => ({ ...prev, [side]: "" }));

    selectedFiles.forEach((file) => {
      const isDuplicate = files.some(
        (f) => f.name === file.name && f.side === side
      );
      if (isDuplicate) {
        setError((prev) => ({
          ...prev,
          [side]: `File "${file.name}" is already uploaded.`,
        }));
        scrollToError(side);
        return;
      }

      const newFile: UploadedFile = {
        name: file.name,
        size: file.size,
        status: "uploading",
        uploadedSize: 0,
        file,
        side,
      };

      setFiles((prev) => [...prev, newFile]);

      const formData = new FormData();
      formData.append("file", file);

      technicianService
        .uploadDicom(
          { formFile: formData },
          (progressEvent: AxiosProgressEvent) => {
            const loaded = progressEvent.loaded ?? 0;
            setFiles((prev) =>
              prev.map((f) =>
                f.name === file.name && f.side === side
                  ? { ...f, uploadedSize: loaded }
                  : f
              )
            );
          }
        )
        .then((res) => {
          setFiles((prev) =>
            prev.map((f) =>
              f.name === file.name && f.side === side
                ? {
                    ...f,
                    uploadedSize: file.size,
                    status: "completed",
                    savedName: res?.fileName,
                  }
                : f
            )
          );
        })
        .catch(() => {
          setFiles((prev) =>
            prev.filter((f) => !(f.name === file.name && f.side === side))
          );
          setError((prev) => ({
            ...prev,
            [side]: `${file.name} failed to upload.`,
          }));
          scrollToError(side);
        });
    });

    e.target.value = "";
  };

  const handleDelete = (side: Side, name: string) => {
    setFiles((prev) =>
      prev.filter((f) => !(f.name === name && f.side === side))
    );
  };

  const handleSaveDicom = async () => {
    setLoading(true);
    setFinalError("");
    try {
      const payload = {
        patientId: appointmentDetails.userId,
        appointmentId: appointmentDetails.appointmentId,
        dicom_files: files
          .filter((file) => file.status === "completed" && file.savedName)
          .map((file) => ({
            file_name: file.savedName,
            old_file_name: file.name,
            side: file.side,
          })),
      };
      console.log(payload);
      const res = await technicianService.saveDicom(payload);

      if (res.status) {
        navigate(-1);
      } else {
        setFinalError(res.message);
      }
    } catch (error) {
      console.log(error);
      setFinalError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const renderUploadSection = (side: Side, label: string) => {
    const sideFiles = files.filter((f) => f.side === side);

    return (
      <div className="w-full lg:w-1/2 flex flex-col items-center mb-6 lg:mb-0">
        <h1 className="text-lg sm:text-xl font-semibold mb-4">{label}</h1>

        <div className="overflow-auto w-full p-3 sm:p-4 border rounded-md">
          <div className="flex gap-2 sm:gap-3 items-start">
            <div className="bg-[#ABB4A5] text-black p-2 sm:p-3 rounded-full flex-shrink-0">
              <CloudUpload className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="flex flex-col min-w-0">
              <h1 className="font-bold text-base sm:text-lg">Upload Files</h1>
              <span className="text-xs sm:text-sm text-muted-foreground">
                Select and upload the files of your choice
              </span>
            </div>
          </div>

          <Separator className="my-3 sm:my-4" />

          <div className="border-dashed border-2 border-gray-300 rounded-lg p-4 sm:p-6 text-center shadow-sm">
            <Upload className="mx-auto text-gray-500" size={28} />
            <p className="text-xs sm:text-sm text-gray-700 mt-2">
              Choose a file or drag & drop it here
            </p>
            {/* <p className="text-xs text-gray-500">ZIP files</p> */}
            <Button
              type="button"
              className="mt-3 sm:mt-4 bg-[#ABB4A5] hover:bg-[#8e9787] text-sm px-4 py-2"
              onClick={() => handleFileClick(side)}
            >
              Browse File
            </Button>
            <input
              ref={fileInputRefs[side]}
              type="file"
              multiple
              // accept=".zip,.dcm,.dicom"
              className="hidden"
              onChange={(e) => handleUpload(e, side)}
            />
          </div>

          {error[side] && (
            <div
              ref={errorRefs[side]}
              className="text-red-600 text-xs sm:text-sm mt-2 text-center"
            >
              {error[side]}
            </div>
          )}

          <div className="w-full mt-3 sm:mt-4 space-y-3 sm:space-y-4">
            {sideFiles.map((file, idx) => (
              <div key={idx} className="border rounded-lg p-2 sm:p-3 lg:p-4">
                <div className="flex justify-end mb-2">
                  <button onClick={() => handleDelete(side, file.name)}>
                    <Trash2
                      className="text-red-500 hover:text-red-700"
                      size={16}
                    />
                  </button>
                </div>

                <div className="flex gap-3 sm:gap-4 items-start">
                  <img
                    src={dicomFile}
                    className="w-12 sm:w-14 lg:w-16 h-auto mt-1 flex-shrink-0"
                    alt="DICOM file icon"
                  />
                  <div className="flex flex-col w-full min-w-0">
                    <p className="text-xs sm:text-sm font-medium truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {Math.round(file.uploadedSize / 1024)} KB of{" "}
                      {Math.round(file.size / 1024)} KB
                    </p>
                    {file.status === "completed" ? (
                      <span className="text-xs sm:text-sm text-green-500">
                        Completed
                      </span>
                    ) : (
                      <span className="text-xs sm:text-sm text-blue-500 animate-pulse">
                        Uploading...
                      </span>
                    )}
                    <Progress
                      value={(file.uploadedSize / file.size) * 100}
                      className="mt-2 transition-all h-1.5 sm:h-2"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-radial-greeting-02 mx-auto my-2 py-2 rounded w-[95%] sm:w-[90%] h-[95%] flex flex-col">
      {loading && <LoadingOverlay />}
      <div className="flex justify-between">
        <Button
          type="button"
          variant="link"
          className="self-start flex text-foreground font-semibold items-center gap-2 px-2 sm:px-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-base sm:text-lg font-semibold">Back</span>
        </Button>
        <div className="h-18 bg-[#fff] flex flex-col items-start justify-center w-70 rounded p-3 mr-3 text-xs sm:text-sm self-end">
          <div className="capitalize flex">
            <div className="flex w-[6rem]">Patient Name</div>{" "}
            <div>: {locationState?.name}</div>
          </div>
          <div className="capitalize flex">
            <div className="flex w-[6rem]">Patient ID</div>{" "}
            <div>: {locationState?.custId}</div>
          </div>
          <div className="capitalize flex">
            <div className="flex w-[6rem]">Scan Center</div>{" "}
            <div>: {locationState?.scancenterCustId}</div>
          </div>
          {/* <img src={logo} alt="logo" className="w-full h-full object-contain" /> */}
        </div>
      </div>

      <h1 className="text-center font-semibold text-xl sm:text-2xl px-4">
        Dicom
      </h1>

      {/* This wrapper scrolls */}
      <div className="flex-1 overflow-auto p-0 sm:p-5 m-1 sm:m-2 lg:shadow">
        <div className="flex flex-col lg:flex-row items-start gap-4 lg:gap-6 p-0 sm:p-5">
          {renderUploadSection("Left", "Left")}
          {renderUploadSection("Right", "Right")}
        </div>
      </div>

      <div className="mx-auto pb-4">
        <Button
          type="button"
          variant="pinkTheme"
          onClick={handleSaveDicom}
          className="w-full sm:w-auto mx-4 sm:mx-0"
        >
          Submit
        </Button>
      </div>

      {finalError && (
        <span className="text-red-500 text-center px-4 pb-2 text-sm">
          {finalError}
        </span>
      )}
    </div>
  );
};

export default UploadDicomFiles;
