import { decrypt } from "@/Helper";
import { tokenService } from "@/lib/tokenService";
import axios from "axios";

export interface UploadFile {
  file_name: string;
  old_file_name: string;
}

// Interface for generic file data (used for Aadhar, PAN, Profile Image)
export interface FileData {
  base64Data: string;
  contentType: string;
}

// Interface for CV file data, extending FileData with CV-specific metadata
export interface CVFileDetails extends FileData {
  cvFileData: FileData;
  refCVFileName: string;
  refCVID: number;
  refCVOldFileName: string;
}

// Interface for License file data, extending FileData with License-specific metadata
// Corrected to use refLFileName, refLId, and refLOldFileName
export interface LicenseFileDetails extends FileData {
  lFileData: FileData;
  refLFileName: string;
  refLId: number;
  refLOldFileName: string;
}

export interface MalpracticeInsuranceFileDetails extends FileData {
  MPFileData: FileData;
  refMPFileName: string;
  refMPId: number;
  refMPOldFileName: string;
}

export interface EducationalFileDetails extends FileData {
  educationCertificateFile: FileData;
  refECFileName: string;
  refECId: number;
  refECOldFileName: string;
}

interface UploadImagePayload {
  formImg: FormData;
}

export interface UploadFilePayload {
  formFile: FormData;
}


export const uploadService = {
  uploadImage: async ({ formImg }: UploadImagePayload) => {
    const token = localStorage.getItem("token");

    const res = await axios.post(
      `${
        import.meta.env.VITE_API_URL_USERSERVICE
      }/upload-profile-image`,
      formImg,
      {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(res);
    const decryptData = decrypt(res.data.data, res.data.token);
    tokenService.setToken(res.data.token);
    return decryptData;
  },

  uploadFile: async ({ formFile }: UploadFilePayload) => {
    const token = localStorage.getItem("token");

    const res = await axios.post(
      `${
        import.meta.env.VITE_API_URL_USERSERVICE
      }/upload-file`,
      formFile,
      {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(res);
    const decryptData = decrypt(res.data.data, res.data.token);
    tokenService.setToken(res.data.token);
    return decryptData;
  }
};
