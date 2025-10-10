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

// interface UploadImagePayload {
//   formImg: FormData;
// }

export interface UploadFilePayload {
  formFile: FormData;
}

export const uploadService = {
  // uploadImage: async ({ formImg }: UploadImagePayload) => {
  //   const token = localStorage.getItem("token");

  //   const res = await axios.post(
  //     `${import.meta.env.VITE_API_URL_USERSERVICE}/upload-profile-image`,
  //     formImg,
  //     {
  //       headers: {
  //         Authorization: token,
  //         "Content-Type": "multipart/form-data",
  //       },
  //     }
  //   );
  //   console.log("\n\nres  file upload", res);
  //   const decryptData = decrypt(res.data.data, res.data.token);
  //   tokenService.setToken(res.data.token);
  //   console.log("\n\n\ndecryptData\n\n", decryptData);

  //   const { uploadURL, fileName, s3Key } = decryptData;

  //   const file = formImg.get("profileImage") as File;

  //   await axios.put(uploadURL, file, {
  //     headers: {
  //       "Content-Type": file.type,
  //     },
  //   });

  //   return {
  //     fileName,
  //     s3Key,
  //     message: "File uploaded successfully to S3",
  //     status: true,
  //   };

  //   // return decryptData;
  // },

  uploadImage: async (file: File) => {
    const token = localStorage.getItem("token");

    const res = await axios.post(
      `${import.meta.env.VITE_API_URL_USERSERVICE}/upload-public-profile-image`,
      { extension: file.name.slice(file.name.lastIndexOf(".")) },
      { headers: { Authorization: token } }
    );

    const decryptData = decrypt(res.data.data, res.data.token);
    tokenService.setToken(res.data.token);

    const { uploadURL, fileName, viewURL } = decryptData;
    console.log("\n\nuploadURL", uploadURL);

    // ✅ Upload file directly to S3
    console.log("\n\nfile", file);
    await axios.put(uploadURL, file, {
      headers: { "Content-Type": file.type },
    });

    return {
      fileName,
      viewURL,
      message: "Profile image uploaded successfully",
      status: true,
    };
  },

  uploadFile: async ( formFile: File) => {
    const token = localStorage.getItem("token");

    // 1️⃣ Ask backend to generate presigned URLs (PUT + GET)
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL_USERSERVICE}/upload-private-document`,
      { extension: formFile.name.slice(formFile.name.lastIndexOf(".")) },
      { headers: { Authorization: token } }
    );

    // 2️⃣ Decrypt and extract URLs
    const decryptData = decrypt(res.data.data, res.data.token);
    tokenService.setToken(res.data.token);

    const { uploadURL, fileName, viewURL } = decryptData;
    console.log("Presigned upload URL:", uploadURL);
    console.log("Temporary view/download URL (10 min):", viewURL);

    // 3️⃣ Upload the file to S3 using the presigned PUT URL
    await axios.put(uploadURL, formFile, {
      headers: { "Content-Type": formFile.type },
    });

    // 4️⃣ Return the details to the caller
    return {
      fileName,
      viewURL, // can be shown to the user as a download link
      uploaded: true,
      message: "Document uploaded successfully",
      status: true,
    };
  },
};
