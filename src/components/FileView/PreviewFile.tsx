import { reportService, ViewFileRes } from "@/services/reportService";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { ViewPDFHelper } from "./ViewPDFHelper";

type Props = {
  fileName: string;
};

const PreviewFile: React.FC<Props> = (props) => {
  const [loading, setLoading] = useState(true);
  const [fileData, setFileData] = useState<ViewFileRes>();

  const HandleViewFile = async (filename: string) => {
    setLoading(true);
    try {
      console.log("📄 Fetching file:", filename);
      const response = await reportService.getFileView(filename);
      console.log("📥 File response:", response);
      setFileData(response);
    } catch (err) {
      console.error("Error fetching file:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (props.fileName) {
      HandleViewFile(props.fileName);
    }
  }, [props.fileName]);

  const isS3File =
    fileData?.data?.contentType === "url" &&
    typeof fileData?.data?.base64Data === "string" &&
    fileData.data.base64Data.startsWith("http");

  return (
    <>
      {loading ? (
        <div className="w-[100%] h-[75vh] flex justify-center items-center">
          <Loader2 className="animate-spin" size={20} />
        </div>
      ) : (
        <>
          {fileData?.status ? (
            <>
              {isS3File ? (
                <iframe
                  src={fileData.data.base64Data}
                  title="S3 File Preview"
                  className="w-full h-[75vh] border rounded-md"
                />
              ) : fileData?.data.contentType === "application/pdf" ? (
                // ✅ Base64 PDF
                // <iframe
                //   src={`data:${fileData?.data.contentType};base64,${fileData?.data.base64Data}`}
                //   title="Report Preview"
                //   className="w-full h-[75vh] border rounded-md"
                // />
                <ViewPDFHelper base64Data={fileData.data.base64Data} />
              ) : (
                // ✅ Base64 Image
                <div className="w-full h-[75vh] flex items-center justify-center overflow-auto">
                  <img
                    src={`data:${fileData?.data.contentType};base64,${fileData?.data.base64Data}`}
                    alt="Report Preview"
                    className="w-full h-[75vh] object-contain border rounded-md"
                  />
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-[75vh] flex justify-center items-center text-gray-500">
              Invalid File Name
            </div>
          )}
        </>
      )}
    </>
  );
};

export default PreviewFile;
