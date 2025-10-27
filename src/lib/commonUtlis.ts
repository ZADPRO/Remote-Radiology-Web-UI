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

  try {
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

    const folders = decrypted.folders || {};
    console.log("decrypted", decrypted);
    if (Object.keys(folders).length === 0) {
      alert("No DICOM files found for this appointment.");
      return;
    }

    // ✅ Create ZIP and populate
    const zip = new JSZip();

    for (const rawFolderName of Object.keys(folders)) {
      console.log("rawFolderName", rawFolderName);
      const folderNameParts = rawFolderName.split("/");
      const folderName = folderNameParts[folderNameParts.length - 1];
      const folder = zip.folder(folderName);
      if (!folder) continue;

      for (const file of folders[rawFolderName]) {
        try {
          const fileResponse = await axios.get(file.url, {
            responseType: "blob",
          });

          const fileNameParts = file.fileName.split("/");
          const fileNameOnly =
            fileNameParts[fileNameParts.length - 1] || "file.dcm";

          folder.file(fileNameOnly, fileResponse.data);
        } catch (err) {
          console.error(`Failed to fetch file ${file.fileName}:`, err);
        }
      }
    }

    // ✅ Generate ZIP file
    const zipBlob = await zip.generateAsync({ type: "blob" });
    console.log("zipBlob", zipBlob);

    // -----------------------
    // Filename parsing logic
    // -----------------------

    // helper to remove epoch/timestamp suffixes like _1761397903080 or -1761397903080
    const stripEpochSuffix = (name: string) =>
      name.replace(/[_-]\d{10,13}(\.\w+)?$/, "");

    // try to extract a clean name from filename (various patterns)
    const extractFromFilename = (raw: string | undefined): string | null => {
      if (!raw) return null;
      let s = raw;

      // If looks like transformed URL starting with https___ or http___
      if (s.startsWith("https___") || s.startsWith("http___")) {
        // remove leading protocol marker and convert underscores to slashes to find "dicom/..."
        const restored = s.replace(/^https?___/, "").replace(/_/g, "/");
        const parts = restored.split("/");
        const dicomIndex = parts.indexOf("dicom");
        if (dicomIndex !== -1 && dicomIndex + 1 < parts.length) {
          return parts[dicomIndex + 1]; // take segment after dicom/
        }
        // fallback: last segment
        return parts[parts.length - 1] || null;
      }

      // If contains '/dicom/' as normal URL
      if (s.includes("/dicom/")) {
        const parts = s.split("/dicom/");
        if (parts.length > 1) {
          const after = parts[1];
          // if there are further slashes, take the first segment or last depending on form
          const segs = after.split("/");
          return segs[0] || segs[segs.length - 1] || null;
        }
      }

      // If it's like '..._dicom_<NAME>_...' or contains 'dicom_' token
      const tokenSplit = s.split(/_dicom_|dicom_/);
      if (tokenSplit.length > 1) {
        return tokenSplit[1].split(/[\/_]/)[0] || tokenSplit[1];
      }

      // If filename contains slashes (normal path), take last path segment
      if (s.includes("/")) {
        const parts = s.split("/");
        return parts[parts.length - 1] || null;
      }

      // Otherwise, if underscores separate meaningful pieces, try to take last 4 segments
      if (s.includes("_")) {
        const parts = s.split("_");
        // if long, take last 4; else return whole
        return parts.length > 4 ? parts.slice(-4).join("_") : s;
      }

      return s || null;
    };

    // Primary candidate: try from passed filename
    let cleanBaseNameCandidate = extractFromFilename(filename) || "";

    // Secondary fallback: use first folder key from API (prefer last path segment)
    if (!cleanBaseNameCandidate) {
      const firstFolderKey = Object.keys(folders)[0];
      if (firstFolderKey) {
        const parts = firstFolderKey.split("/");
        cleanBaseNameCandidate = parts[parts.length - 1] || "";
      }
    }

    // Additional fallback if still empty
    if (!cleanBaseNameCandidate) {
      cleanBaseNameCandidate = `DicomFiles_${appointmentId}`;
    }

    // Remove trailing epoch-like numbers if present
    cleanBaseNameCandidate = stripEpochSuffix(cleanBaseNameCandidate);

    // If the name contains words like "Right" or "Left", normalize them to R/L or keep as-is
    // (optional: convert "Right" -> "R" if you want shorter names)
    // e.g., keep `..._Right` as `_Right`. We'll keep as-is.

    // Final sanitize: allow letters, numbers, underscore, dash; replace rest with underscore
    let cleanBaseName = cleanBaseNameCandidate.replace(/[^a-zA-Z0-9_\-]/g, "_");

    // If after sanitization it's empty, fallback
    if (!cleanBaseName) cleanBaseName = `DicomFiles_${appointmentId}`;

    // Add date suffix
    const dateSuffix = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const zipFilename = `${cleanBaseName}_${dateSuffix}.zip`;

    console.log(
      "Chosen base name:",
      cleanBaseNameCandidate,
      "-> sanitized:",
      cleanBaseName
    );
    console.log("zipFilename", zipFilename);

    // ✅ Save ZIP locally
    saveAs(zipBlob, zipFilename);

    console.log("✅ ZIP file downloaded:", zipFilename);
  } catch (error: any) {
    console.error("❌ DICOM download failed:", error);
    alert("Failed to download DICOM files. Please try again.");
  }
};

// Utility to extract the file name from an S3 URL
const getFileNameFromS3Url = (url: string) => {
  try {
    const pathname = new URL(url).pathname;
    return pathname.substring(pathname.lastIndexOf("/") + 1);
  } catch {
    return "unknown_file";
  }
};

export const downloadDicom = async (fileId: number, filename: string) => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No token found in localStorage");
    return;
  }

  // Determine if filename is an S3 URL
  const isS3 =
    filename.startsWith("http") || filename.includes("amazonaws.com");
  let downloadName = filename;

  if (isS3) {
    // Extract actual file name from S3 URL
    downloadName = getFileNameFromS3Url(filename);
  }

  // Encrypt the payload
  const payload = encrypt({ fileId }, token);

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

    // Sanitize filename
    const safeFilename = downloadName.replace(/[^a-zA-Z0-9._-]/g, "_");
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
    console.log("decrypted", decrypted);
    localStorage.setItem("token", response.data.token);

    if (!decrypted.status) {
      alert(decrypted.message || "Failed to fetch DICOM URLs.");
      return;
    }

    const folders: DicomFolders = decrypted.folders || {};
    console.log("folders", folders);
    if (Object.keys(folders).length === 0) {
      alert("No DICOM files found for the selected appointments.");
      return;
    }

    const zip = new JSZip();

    for (const rawFolderName of Object.keys(folders)) {
      const folderNameParts = rawFolderName.split("/");
      const folderName = folderNameParts[folderNameParts.length - 1];
      console.log("folderName", folderName);

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
