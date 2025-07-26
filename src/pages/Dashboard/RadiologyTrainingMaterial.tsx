import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { EyeIcon, Trash2 } from "lucide-react";
import logoNew from "../../assets/LogoNew2.png";
import { uploadService } from "@/services/commonServices";
import { Button } from "@/components/ui/button";
import {
  dashboardService,
  TrainingMaterial,
} from "@/services/dashboardService";
import { useAuth } from "../Routes/AuthContext";
import PDFPreviewer from "./PDFPreviewer";
 
interface UploadedFile {
  fileName: string;
  filepath: string;
}
 
const RadiologyTrainingMaterial: React.FC = () => {
  const [documents, setDocuments] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
 
  const { user } = useAuth();
  const [trainingMaterial, setTrainingMaterial] = useState<TrainingMaterial[]>(
    []
  );
 
 
  const [pdfPreviewFile, setPdfPreviewFile] = useState<{ blob: Blob | null, name: string }>({ blob: null, name: '' });
  const [showPreview, setShowPreview] = useState(false);
 
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
 
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
 
        try {
          setUploading(true);
          const response = await uploadService.uploadFile({
            formFile: formData,
          });
 
          console.log(response);
 
          if (response.status) {
            const uploaded: UploadedFile = {
              fileName: response.oldFilename,
              filepath: response.fileName,
            };
            setDocuments((prev) => [...prev, uploaded]);
          }
        } catch (err) {
          console.error(`Upload failed for ${file.name}`, err);
        } finally {
          setUploading(false);
        }
      }
 
      // Clear the input value to allow re-upload of the same file
      e.target.value = "";
    }
  };
 
  const handleRemove = (index: number) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };
 
  const handleSave = async () => {
    try {
      const uploadPromises = documents.map((doc) =>
        dashboardService.uploadTrainingMaterial(doc)
      );
      const responses = await Promise.all(uploadPromises);
      console.log("All uploads completed:", responses);
      setDocuments([]);
      listTrainingMaterial();
    } catch (error) {
      console.error("One or more uploads failed:", error);
    }
  };
 
  const listTrainingMaterial = async () => {
    try {
      const res = await dashboardService.getAllTrainingMaterials();
      console.log(res);
      if (res.status) {
        setTrainingMaterial(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
 
  useEffect(() => {
    listTrainingMaterial();
  }, []);
 
  // const downloadMaterial = async (id: number, fileName: string) => {
  //   try {
  //     const res = await dashboardService.downloadTrainingMaterial(id, fileName);
  //     console.log(res);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
 
  const handleDeleteTrainingMaterial = async (id: number) => {
    try {
      const res = await dashboardService.deleteTrainingMaterial(id);
      console.log(res);
      if (res.status) {
        listTrainingMaterial();
      }
    } catch (error) {
      console.log(error);
    }
  };
 
  return (
    <DialogContent
      style={{
        background:
          "radial-gradient(100.97% 186.01% at 50.94% 50%, #F9F4EC 25.14%, #EED8D6 100%)",
      }}
      className="w-[100vw] lg:w-[70vw] h-[90vh] overflow-y-auto p-0"
    >
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent style={{
          background:
            "radial-gradient(100.97% 186.01% at 50.94% 50%, #F9F4EC 25.14%, #EED8D6 100%)",
        }} className="h-[90vh] w-[90%]">
          <PDFPreviewer
            blob={pdfPreviewFile.blob || null}
          // name={pdfPreviewFile.name}
          // onClose={() => setShowPreview(false)}
          />
        </DialogContent>
      </Dialog>
      {/* Header */}
      <DialogHeader className="bg-[#eac9c5] border-1 border-b-gray-400 flex flex-col lg:flex-row items-center justify-between px-4 py-2">
        {/* Logo (Left) */}
        <div className="h-12 w-24 sm:h-14 sm:w-28 flex-shrink-0">
          <img
            src={logoNew}
            alt="logo"
            className="w-full h-full object-contain"
          />
        </div>
 
        {/* Centered Content */}
        <div className="flex-1 text-center">
          <h2 className="text-2xl font-semibold">Radiology Training Materials</h2>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            EaseQT Platform
          </p>
        </div>
 
        {/* Spacer to balance logo width */}
        <div className="hidden lg:inline h-12 w-24 sm:h-14 sm:w-28 flex-shrink-0" />
      </DialogHeader>
 
      {/* Body */}
      {user?.refRTId == 1 && (
        <div className="px-6 space-y-6">
          {/* Upload Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Upload Training Documents
            </label>
            <Input
              type="file"
              multiple
              onChange={handleFileChange}
              className="bg-white"
              disabled={uploading}
            />
          </div>
 
          {/* Document List */}
          {documents.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700">
                Uploaded Documents
              </h3>
              <ul className="space-y-1">
                {documents.map((doc, index) => (
                  <li key={index} className="flex gap-2 items-center text-sm">
                    <span className="truncate max-w-[85%] text-gray-800">
                      {doc.fileName}
                    </span>
                    <button
                      onClick={() => handleRemove(index)}
                      className="text-gray-500 hover:text-red-500"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
 
          <Button variant="greenTheme" onClick={() => handleSave()}>
            Save
          </Button>
        </div>
      )}
 
      {/* Existing Training Materials */}
      {trainingMaterial?.length > 0 ? (
        <div className="space-y-2 px-6 py-6">
          <h3 className="text-sm font-semibold text-gray-700">
            Available Training Materials
          </h3>
          <ul className="space-y-1">
            {trainingMaterial.map((material) => (
              <li className="flex items-center justify-between border p-2 rounded-md bg-white shadow-sm">
                <div className="flex flex-col w-full">
                  <span className="font-medium text-gray-900 truncate">
                    {material.refTMFileName}
                  </span>
                </div>
 
                <div className="flex gap-4">
                  <span
                    className="text-sm text-blue-600 underline cursor-pointer"
                    onClick={async () => {
                      // Fetch the PDF blob
                      const blob = await dashboardService.downloadTrainingMaterial(material.refTMId);
                      setPdfPreviewFile({ blob, name: material.refTMFileName });
                      setShowPreview(true);
                    }}
                  >
                    <EyeIcon className="w-5 h-5" />
                  </span>
                  <button
                    onClick={() => handleDeleteTrainingMaterial(material.refTMId)}
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                    title="Delete"
                    hidden={user?.refRTId !== 1}
 
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
 
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="space-y-2 px-6 py-2">
          <h3 className="text-sm font-semibold text-gray-700">
            No Training Materials Available
          </h3>
        </div>
      )}
    </DialogContent>
  );
};
 
export default RadiologyTrainingMaterial;