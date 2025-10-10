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
      const payload = {
        patientId: userId,
        appointmentId: appointmentId,
      };
      console.log(payload);

      const res = await reportService.listDicoms(payload);
      console.log(res);

      if (res.status) {
        setDicomFiles(res.DicomData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-start gap-10 py-6 px-12 w-full h-[90vh] space-y-10 overflow-y-scroll">
      {dicomFiles !== null ? (
        <>
          <div className="w-1/2">
            {/* Header */}
            <div className="relative rounded-t-xl bg-[#a3b1a0] px-4 py-3">
              <span className="block text-center w-full font-semibold text-base text-black uppercase">
                RIGHT DICOM
              </span>
              {dicomFiles?.filter((file) => file.Side === "Right").length !==
                0 && (
                <Download
                  onClick={() => {
                    downloadAllDicom(
                      userId,
                      appointmentId,
                      "Right",
                      dicomFiles[0].FileName.split("_").slice(0, -2).join("_") +
                        "_R.zip"
                    );
                  }}
                  size={18}
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-black"
                />
              )}
            </div>

            {/* Body */}
            <div className="rounded-b-xl bg-white shadow-md min-h-[300px] overflow-hidden">
              {dicomFiles?.filter((file) => file.Side === "Right").length ===
              0 ? (
                <div className="text-center text-sm text-gray-400 py-8">
                  No files uploaded
                </div>
              ) : (
                dicomFiles?.map((file, index) => (
                  <>
                    {file.Side === "Right" && (
                      <div
                        key={index}
                        className="flex justify-between items-center border-b px-4 py-3 hover:bg-gray-50 transition"
                      >
                        <div className="flex flex-col text-sm">
                          <span className="text-gray-500">{file.FileName}</span>
                          <span className="font-medium text-gray-800">
                            {file.Side}
                          </span>
                        </div>
                        <Download
                          onClick={() => {
                            downloadDicom(file.DFId, file.FileName);
                          }}
                          size={16}
                          className="text-gray-600"
                        />
                      </div>
                    )}
                  </>
                ))
              )}
            </div>
          </div>
          <div className="w-1/2">
            {/* Header */}
            <div className="relative rounded-t-xl bg-[#a3b1a0] px-4 py-3">
              <span className="block text-center w-full font-semibold text-base text-black uppercase">
                LEFT DICOM
              </span>
              {dicomFiles?.filter((file) => file.Side === "Left").length !==
                0 && (
                <Download
                  onClick={() => {
                    downloadAllDicom(
                      userId,
                      appointmentId,
                      "Left",
                      dicomFiles[0].FileName.split("_").slice(0, -2).join("_") +
                        "_L.zip"
                    );
                  }}
                  size={18}
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-black"
                />
              )}
            </div>

            <div className="rounded-b-xl bg-white shadow-md min-h-[300px] overflow-hidden">
              {dicomFiles?.filter((file) => file.Side === "Left").length ===
              0 ? (
                <div className="text-center text-sm text-gray-400 py-8">
                  No files uploaded
                </div>
              ) : (
                dicomFiles?.map((file, index) => (
                  <>
                    {file.Side === "Left" && (
                      <div
                        key={index}
                        className="flex justify-between items-center border-b px-4 py-3 hover:bg-gray-50 transition"
                      >
                        <div className="flex flex-col text-sm">
                          <span className="text-gray-500">{file.FileName}</span>
                          <span className="font-medium text-gray-800">
                            {file.Side}
                          </span>
                        </div>
                        <Download
                          onClick={() => {
                            downloadDicom(file.DFId, file.FileName);
                          }}
                          size={16}
                          className="text-gray-600"
                        />
                      </div>
                    )}
                  </>
                ))
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center text-2xl py-8">No Dicom Files Uploaded</div>
      )}
    </div>
  );
};

export default DicomList;
