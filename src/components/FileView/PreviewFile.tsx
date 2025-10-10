import { reportService, ViewFileRes } from "@/services/reportService";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";

type Props = {
  fileName: string;
};

const PreviewFile: React.FC<Props> = (props) => {
  const [loading, setLoading] = useState(true);
  const [fileData, setFileData] = useState<ViewFileRes>();

  const HandleViewFile = async (filename: string) => {
    setLoading(true);
    console.log(filename);
    const response = await reportService.getFileView(filename);
    setLoading(false);
    setFileData(response);
  };

  useEffect(() => {
    if (props.fileName) {
      HandleViewFile(props.fileName);
    }
  }, [props.fileName]);

  return (
    <>
      {loading ? (
        <div className="w-[100%] h-[75vh] flex justify-center items-center">
          <Loader2 className=" animate-spin " size={20} />
        </div>
      ) : (
        <>
          {fileData?.status ? (
            <>
              {fileData?.data.contentType === "application/pdf" ? (
                <div>
                  <iframe
                    src={`data:${fileData?.data.contentType};base64,${fileData?.data.base64Data}`}
                    title="Report Preview"
                    className="w-full h-[75vh] border rounded-md"
                  />
                </div>
              ) : (
                <div className="w-full h-[75vh]  flex items-center justify-center overflow-auto">
                  <img
                    src={`data:${fileData?.data.contentType};base64,${fileData?.data.base64Data}`}
                    alt="Report Preview"
                    className="w-full h-[75vh] object-contain border rounded-md"
                  />
                </div>
              )}
            </>
          ) : (
            <>Invalid File Name</>
          )}
        </>
      )}
    </>
  );
};

export default PreviewFile;
