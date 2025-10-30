import React, { useState } from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import { reportService, ViewFileRes } from "@/services/reportService";
import LoadingOverlay from "../ui/CustomComponents/loadingOverlay";
import { ViewPDFHelper } from "./ViewPDFHelper";

type Props = {
  displayName: string;
  fileUrl: string;
};

const FileView: React.FC<Props> = ({ displayName, fileUrl }) => {
  const [fileData, setFileData] = useState<ViewFileRes>();
  const [loading, setLoading] = useState(false);
  const [viewModel, setViewModel] = useState(false);

  const HandleViewFile = async () => {
    setLoading(true);
    const response = await reportService.getFileView(fileUrl);
    setLoading(false);
    setFileData(response);
    console.log("response", response);
    setViewModel(true);
  };

  const isS3URL = (data: string | undefined) =>
    data?.startsWith("https://easeqt-health-archive.s3");

  return (
    <>
      {viewModel && fileData && (
        <Dialog open={viewModel} onOpenChange={setViewModel}>
          <DialogContent
            style={{ background: "#fff" }}
            className="w-[100vw] lg:w-[90vw] h-[90vh] overflow-y-auto p-0"
          >
            <p className="text-sm font-semibold pt-2 pl-2">{displayName}</p>

            {fileData.status ? (
              <>
                {isS3URL(fileData.data.base64Data) ? (
                  fileData.data.base64Data ? (
                    <iframe
                      src={fileData.data.base64Data}
                      title="Report Preview"
                      className="w-full h-[80vh] border rounded-md"
                    />
                  ) : (
                    <div className="w-full h-[80vh] flex items-center justify-center overflow-auto">
                      <img
                        src={fileData.data.base64Data}
                        alt="Report Preview"
                        className="w-full h-[80vh] object-contain border rounded-md"
                      />
                    </div>
                  )
                ) : // Local files → use Base64
                fileData.data.contentType === "application/pdf" ? (
                  <ViewPDFHelper base64Data={fileData.data.base64Data} />
                ) : (
                  <div className="w-full h-[80vh] flex items-center justify-center overflow-auto">
                    <img
                      src={`data:${fileData.data.contentType};base64,${fileData.data.base64Data}`}
                      alt="Report Preview"
                      className="w-full h-[80vh] object-contain border rounded-md"
                    />
                  </div>
                )}
              </>
            ) : (
              <>Invalid File Name</>
            )}
          </DialogContent>
        </Dialog>
      )}
      {loading && <LoadingOverlay />}
      <div
        onClick={() => HandleViewFile()}
        className="hover:underline cursor-pointer truncate"
      >
        {displayName}{" "}
      </div>
    </>
  );
};

export default FileView;
