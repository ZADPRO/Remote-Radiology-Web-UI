import { decrypt, encrypt } from "@/Helper";
import axios from "axios";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { tokenService } from "./tokenService";

export function downloadDocumentFile(
  base64Data: string,
  contentType: string,
  filename: string
) {
  // Convert base64 to byte array
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length)
    .fill(0)
    .map((_, i) => byteCharacters.charCodeAt(i));
  const byteArray = new Uint8Array(byteNumbers);

  // Create blob and URL
  const blob = new Blob([byteArray], { type: contentType });
  const url = URL.createObjectURL(blob);

  // Create a temporary <a> and trigger click
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}`; // Desired filename
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // Optional: revoke URL after some delay
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export const downloadAllDicom = async (
  userId: number,
  appointmentId: number,
  side: string,
  filename: string
) => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No token found in localStorage");
    return;
  }

  const payload = encrypt(
    { userId: userId, appointmentId: appointmentId, side: side },
    token
  );

  const response = await axios.post(
    `${
      import.meta.env.VITE_API_URL_PROFILESERVICE
    }/technicianintakeform/alldownloaddicom`,
    { encryptedData: payload },
    {
      headers: {
        Authorization: `Bearer ${token}`, // <-- Add 'Bearer ' prefix
        "Content-Type": "application/json",
      },
      responseType: "blob", // <-- Important for binary data
    }
  );

  const blob = response.data;

  // Create a URL for the blob and trigger download
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

export const downloadDicom = async (fileId: number, filename: string) => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No token found in localStorage");
    return;
  }

  // Encrypt the payload with your token
  const payload = encrypt({ fileId: fileId }, token);

  try {
    const response = await axios.post(
      `${
        import.meta.env.VITE_API_URL_PROFILESERVICE
      }/technicianintakeform/downloaddicom`,
      { encryptedData: payload },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        responseType: "blob", // Important for file download
      }
    );

    const blob = response.data;

    // Create a download link and trigger click
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;

    // Sanitize filename (basic)
    const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    a.download = safeFilename;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download failed:", error);
    // Optionally show user notification here
  }
};

// export const handleAllDownloadDicom = async (selectedRowIds: number[]) => {
//   const token = localStorage.getItem("token");

//   if (!token) {
//     console.error("No token found in localStorage");
//     return;
//   }

//   console.log({ refAppointmentId: selectedRowIds });

//   // Fix: The payload structure should match what the backend expects
//   const payload = encrypt({ refAppointmentId: selectedRowIds }, token);

//   try {
//     const response = await axios.post(
//       `${
//         import.meta.env.VITE_API_URL_PROFILESERVICE
//       }/technicianintakeform/overalldownloaddicom`,
//       { encryptedData: payload },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         responseType: "blob",
//       }
//     );

//     const blob = response.data;

//     // Get filename from response headers if available
//     const contentDisposition = response.headers["content-disposition"];
//     let filename = "DicomFiles.zip";

//     if (contentDisposition) {
//       const filenameMatch = contentDisposition.match(/filename=(.+)/);
//       if (filenameMatch) {
//         filename = filenameMatch[1].replace(/"/g, "");
//       }
//     }

//     // Create download link
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = filename;

//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     window.URL.revokeObjectURL(url);
//   } catch (error: any) {
//     console.error("Download failed:", error);
//     // Handle error appropriately
//     if (error.response?.status === 404) {
//       alert("No DICOM files found for the selected appointments.");
//     } else {
//       alert("Failed to download DICOM files. Please try again.");
//     }
//   }
// };

interface DicomFile {
  fileName: string;
  url: string;
  side: string;
}

interface DicomFolders {
  [folderName: string]: DicomFile[];
}

export const handleAllDownloadDicom = async (
  selectedRowIds: number[]
): Promise<void> => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found in localStorage");
    return;
  }

  const payload = encrypt({ refAppointmentId: selectedRowIds }, token);

  try {
    const response = await axios.post(
      `${
        import.meta.env.VITE_API_URL_PROFILESERVICE
      }/technicianintakeform/overalldownloaddicom`,
      { encryptedData: payload },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const decrypted = decrypt(response.data.data, response.data.token);
    localStorage.setItem("token", response.data.token);

    if (!decrypted.status) {
      alert(decrypted.message || "Failed to fetch DICOM URLs.");
      return;
    }

    const folders: DicomFolders = decrypted.folders || {};
    if (Object.keys(folders).length === 0) {
      alert("No DICOM files found for the selected appointments.");
      return;
    }

    const zip = new JSZip();

    for (const rawFolderName of Object.keys(folders)) {
      const folderNameParts = rawFolderName.split("/");
      const folderName = folderNameParts[folderNameParts.length - 1];

      const folder = zip.folder(folderName);
      if (!folder) continue;

      for (const file of folders[rawFolderName]) {
        try {
          const fileResponse = await axios.get(file.url, {
            responseType: "blob",
          });

          // ✅ Use only the last segment of the file path as the filename
          const fileNameParts = file.fileName.split("/");
          const fileNameOnly = fileNameParts[fileNameParts.length - 1];

          folder.file(fileNameOnly, fileResponse.data);
        } catch (err) {
          console.error(`Failed to fetch file ${file.fileName}:`, err);
        }
      }
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });
    const zipFilename = `DicomFiles_${new Date()
      .toISOString()
      .slice(0, 10)}.zip`;
    saveAs(zipBlob, zipFilename);

    console.log("✅ ZIP file generated and downloaded:", zipFilename);
  } catch (error: any) {
    console.error("❌ Fetch failed:", error);
    alert("Failed to retrieve DICOM URLs. Please try again.");
  }
};

export const removeDicom = async (refDFId: number[]) => {
  const token = localStorage.getItem("token");
  console.log(refDFId);

  const payload = encrypt({ refDFId: refDFId }, token);

  const res = await axios.post(
    `${
      import.meta.env.VITE_API_URL_PROFILESERVICE
    }/technicianintakeform/deleteDicom`,
    { encryptedData: payload },
    {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    }
  );

  const decryptedData = decrypt(res.data.data, res.data.token);
  tokenService.setToken(res.data.token);
  console.log(decryptedData);
  return decryptedData;
};
