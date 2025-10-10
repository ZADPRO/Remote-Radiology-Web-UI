import React, { useState } from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import { reportService, ViewFileRes } from "@/services/reportService";
import LoadingOverlay from "../ui/CustomComponents/loadingOverlay";

type Props = {
  fileName: string;
};

const FileView: React.FC<Props> = (props) => {
  const [fileData, setFileData] = useState<ViewFileRes>();

  const [loading, setLoading] = useState(false);

  const [viewModel, setViewModel] = useState(false);

  const HandleViewFile = async (filename: string) => {
    setLoading(true);
    console.log(filename);
    const response = await reportService.getFileView(filename);
    setLoading(false);
    setFileData(response);
    setViewModel(true);
  };

  return (
    <>
      {viewModel && (
        <>
          <Dialog open={viewModel} onOpenChange={setViewModel}>
            <DialogContent
              style={{ background: "#fff" }}
              className="w-[100vw] lg:w-[90vw] h-[90vh] overflow-y-auto p-0"
            >
              <p className="text-sm font-semibold pt-2 pl-2">
                {props.fileName}
              </p>

              {fileData?.status ? (
                <>
                  {fileData?.data.contentType === "application/pdf" ? (
                    <div>
                      <iframe
                        src={`data:${fileData?.data.contentType};base64,${fileData?.data.base64Data}`}
                        title="Report Preview"
                        className="w-full h-[80vh] border rounded-md"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-[80vh]  flex items-center justify-center overflow-auto">
                      <img
                        src={`data:${fileData?.data.contentType};base64,${fileData?.data.base64Data}`}
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
        </>
      )}
      {loading && <LoadingOverlay />}
      <div
        onClick={() => HandleViewFile(props.fileName)}
        className="hover:underline cursor-pointer truncate"
      >
        {props.fileName}
      </div>
    </>
  );
};

export default FileView;
