import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, CloudUpload, Trash2 } from "lucide-react";
import { technicianService } from "@/services/technicianServices";
import type { AxiosProgressEvent } from "axios";
import { Separator } from "@/components/ui/separator";
import { Checkbox2 } from "@/components/ui/CustomComponents/checkbox2";
import { Label } from "@/components/ui/label";
import dicomFile from "../../assets/Patient-InTake Form/Dicomfile_img.png";

interface UploadedFile {
  name: string; // old_file_name
  size: number;
  status: "uploading" | "completed";
  uploadedSize: number;
  file: File;
  savedName?: string; // file_name
}

interface IntakeOption {
  questionId: number;
  answer: string;
}

interface QuestionIds {
  confirmation: number;
}

interface Props {
  technicianFormData: IntakeOption[];
  handleInputChange: (questionId: number, value: string) => void;
  questionIds: QuestionIds;
  setDicomFiles: React.Dispatch<React.SetStateAction<{ file_name: string; old_file_name: string }[]>>;
}

const UploadDicoms: React.FC<Props> = ({
  technicianFormData,
  handleInputChange,
  questionIds,
  setDicomFiles
}) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const errorRef = useRef<HTMLDivElement | null>(null);

  const getAnswer = (id: number) =>
    technicianFormData.find((q) => q.questionId === id)?.answer || "";

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    setErrorMessage(""); // Clear any previous error

    selectedFiles.forEach((file) => {
      const isDuplicate = files.some((f) => f.name === file.name);
      if (isDuplicate) {
        setErrorMessage(`File "${file.name}" is already uploaded.`);
        setTimeout(() => {
          errorRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
        return;
      }

      const newFile: UploadedFile = {
        name: file.name,
        size: file.size,
        status: "uploading",
        uploadedSize: 0,
        file,
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
                f.name === file.name ? { ...f, uploadedSize: loaded } : f
              )
            );
          }
        )
        .then((res) => {
          const file_name = res?.fileName; // Adjust according to your API
          const old_file_name = res?.oldFilename;

          setFiles((prev) =>
            prev.map((f) =>
              f.name === file.name
                ? {
                    ...f,
                    uploadedSize: file.size,
                    status: "completed",
                    savedName: file_name,
                  }
                : f
            )
          );

          // Push to final result list
          setDicomFiles((prev) => [
            ...prev,
            {
              file_name,
              old_file_name,
            },
          ]);
        })

        .catch((error) => {
          console.error("Upload failed:", error);
          setFiles((prev) => prev.filter((f) => f.name !== file.name));
          setErrorMessage(`${file.name} failed to upload. Please try again.`);
          setTimeout(() => {
            errorRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 100);
        });
    });

    event.target.value = "";
  };

  const handleDelete = (name: string) => {
    setFiles((prev) => prev.filter((f) => f.name !== name));
  };

  return (
    <div className="mx-auto p-3 lg:p-6 space-y-6 h-full overflow-y-scroll relative">
      {/* Upload Area */}
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="w-full lg:w-1/2">
          <div className="flex gap-2">
            <div className="bg-[#ABB4A5] text-black p-3 rounded-full">
              <CloudUpload />
            </div>
            <div className="flex flex-col">
              <h1 className="font-bold text-lg">Upload Files</h1>
              <span className="text-sm text-muted-foreground">
                Select and upload the files of your choice
              </span>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="border-dashed border-2 border-gray-300 rounded-lg p-6 text-center shadow-sm">
            <Upload className="mx-auto text-gray-500" size={36} />
            <p className="text-sm text-gray-700 mt-2">
              Choose a file or drag & drop it here
            </p>
            <p className="text-xs text-gray-500">
               DICOM, DCM or ZIP file up to 50MB
            </p>
            <Button
              type="button"
              className="mt-4 bg-[#ABB4A5] hover:bg-[#8e9787]"
              onClick={handleFileClick}
            >
              Browse File
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".zip,.dcm,.dicom,.pdf"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        </div>

        {/* Upload List */}
        <div className="w-full lg:w-1/2 space-y-4">
          {files.map((file, idx) => (
            <div key={idx} className="border rounded-lg p-2 lg:p-4 ">
              <button
                className="w-full flex justify-end"
                onClick={() => handleDelete(file.name)}
              >
                <Trash2 className="text-red-500 hover:text-red-700" size={18} />
              </button>

              <div className="flex gap-4 items-start truncate max-w-full">
                <img src={dicomFile} className="w-16 h-auto mt-1" />
                <div className="flex flex-col w-full">
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {Math.round(file.uploadedSize / 1024)} KB of{" "}
                    {Math.round(file.size / 1024)} KB
                  </p>
                  {file.status === "completed" ? (
                    <span className="text-sm text-green-500">Completed</span>
                  ) : (
                    <span className="text-sm text-blue-500 animate-pulse">
                      Uploading...
                    </span>
                  )}
                  <Progress
                    value={(file.uploadedSize / file.size) * 100}
                    className="mt-2 transition-all"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Terms and Error */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Checkbox2
            checked={getAnswer(questionIds.confirmation) === "true"}
            onClick={() =>
              handleInputChange(
                questionIds.confirmation,
                getAnswer(questionIds.confirmation) === "true" ? "" : "true"
              )
            }
            required
          />
          <Label>
            Please check and confirm the scan quality before submission
          </Label>
        </div>

        {errorMessage && (
          <div ref={errorRef} className="text-sm text-red-600 mt-2 text-start">
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadDicoms;
