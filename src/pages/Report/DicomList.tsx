import DownloadingOverlay from "@/components/ui/CustomComponents/DownloadingOverlay";
import { downloadAllDicom, downloadDicom } from "@/lib/commonUtlis";
import { reportService } from "@/services/reportService";
import { Download } from "lucide-react";
import React, { useEffect, useState } from "react";

export type DicomFile = {
  AppointmentId: number;
  CreatedAt: string; // ISO date string
  CreatedBy: number;
  DFId: number;
  FileName: string;
  Side: string;
  UserId: number;
  displayName: string;
};

type Props = {
  appointmentId: number;
  userId: number;
};

const DicomList: React.FC<Props> = ({ appointmentId, userId }) => {
  const [dicomFiles, setDicomFiles] = useState<DicomFile[]>([]);

  useEffect(() => {
    listDicoms();
  }, []);

  const listDicoms = async () => {
    try {
      const payload = { patientId: userId, appointmentId };
      const res = await reportService.listDicoms(payload);

      if (res.status && res.DicomData?.length > 0) {
        const filesWithDisplayName: DicomFile[] = res.DicomData.map(
          (file: any) => ({
            ...file,
            displayName: file.FileName.split("/").pop() || "unknown_file",
          })
        );
        setDicomFiles(filesWithDisplayName);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [progress, setProgress] = useState({
    downloadedMB: 0,
    percentage: 0,
    currentFile: "",
  });
  const [isDownloading, setIsDownloading] = useState(false);

  const renderDicomSide = (side: "Right" | "Left") => {
    const files = dicomFiles.filter((file) => file.Side === side);
    const zipSuffix = side === "Right" ? "_R.zip" : "_L.zip";

    return (
      <div className="w-1/2">
        <div className="relative rounded-t-xl bg-[#a3b1a0] px-4 py-3">
          <span className="block text-center w-full font-semibold text-base text-black uppercase">
            {side} DICOM
          </span>
          {files.length > 0 && (
            <Download
              onClick={() => {
                const firstFile = files[0];
                const zipName =
                  firstFile.displayName.split("_").slice(0, -2).join("_") +
                  zipSuffix;
                downloadAllDicom(
                  userId,
                  appointmentId,
                  side,
                  zipName,
                  setProgress,
                  setIsDownloading
                );
              }}
              size={18}
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-black"
            />
          )}
        </div>

        <div className="rounded-b-xl bg-white shadow-md min-h-[300px] overflow-hidden">
          {files.length === 0 ? (
            <div className="text-center text-sm text-gray-400 py-8">
              No files uploaded
            </div>
          ) : (
            files.map((file) => (
              <div
                key={file.DFId}
                className="flex justify-between items-center border-b px-4 py-3 hover:bg-gray-50 transition"
              >
                <div className="flex w-[20rem] flex-col text-sm">
                  <span className="text-gray-500 truncate">
                    {file.displayName}
                  </span>
                  <span className="font-medium text-gray-800">{file.Side}</span>
                </div>
                <Download
                  onClick={() =>
                    downloadDicom(
                      file.DFId,
                      file.FileName,
                      setProgress,
                      setIsDownloading
                    )
                  }
                  size={16}
                  className="text-gray-600"
                />
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex justify-center items-start gap-10 py-6 px-12 w-full h-[90vh] space-y-10 overflow-y-scroll">
      {isDownloading && (
        <DownloadingOverlay
          downloadedMB={progress.downloadedMB}
          percentage={progress.percentage}
          currentFile={progress.currentFile}
        />
      )}
      {dicomFiles && dicomFiles.length > 0 ? (
        <>
          {renderDicomSide("Right")}
          {renderDicomSide("Left")}
        </>
      ) : (
        <div className="text-center text-2xl py-8">No Dicom Files Uploaded</div>
      )}
    </div>
  );
};

export default DicomList;
