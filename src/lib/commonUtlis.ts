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
  filename: string,
  setProgress: React.Dispatch<React.SetStateAction<DownloadProgress>>,
  setIsDownloading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found in localStorage");
    return;
  }

  try {
    setIsDownloading(true);
    setProgress({ downloadedMB: 0, percentage: 0, currentFile: "" });

    const payload = encrypt({ userId, appointmentId, side }, token);

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL_PROFILESERVICE}/technicianintakeform/alldownloaddicom`,
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
      setIsDownloading(false);
      return;
    }

    const folders: DicomFolders = decrypted.folders || {};
    if (Object.keys(folders).length === 0) {
      alert("No DICOM files found for this appointment.");
      setIsDownloading(false);
      return;
    }

    const zip = new JSZip();

    const allFiles: DicomFile[] = [];
    for (const folderName of Object.keys(folders)) {
      allFiles.push(...folders[folderName]);
    }

    let totalDownloadedBytes = 0;
    const totalFiles = allFiles.length;
    let completedFiles = 0;

    for (const rawFolderName of Object.keys(folders)) {
      const folderNameParts = rawFolderName.split("/");
      const folderName = folderNameParts[folderNameParts.length - 1];
      const folder = zip.folder(folderName);
      if (!folder) continue;

      for (const file of folders[rawFolderName]) {
        let previousLoaded = 0;

        try {
          setProgress({
            downloadedMB: totalDownloadedBytes / (1024 * 1024),
            percentage: (completedFiles / totalFiles) * 100,
            currentFile: file.fileName.split("/").pop() || file.fileName,
          });

          const fileResponse = await axios.get(file.url, {
            responseType: "blob",
            onDownloadProgress: (progressEvent) => {
              if (progressEvent.loaded) {
                const incremental = progressEvent.loaded - previousLoaded;
                previousLoaded = progressEvent.loaded;

                totalDownloadedBytes += incremental;
                const downloadedMB = totalDownloadedBytes / (1024 * 1024);
                const percentage =
                  ((completedFiles +
                    (progressEvent.loaded / (progressEvent.total || 1))) /
                    totalFiles) *
                  100;

                setProgress({
                  downloadedMB,
                  percentage,
                  currentFile: file.fileName.split("/").pop() || file.fileName,
                });
              }
            },
          });

          const fileNameOnly = file.fileName.split("/").pop() || "file.dcm";
          folder.file(fileNameOnly, fileResponse.data);
          completedFiles++;
        } catch (err) {
          console.error(`Failed to fetch file ${file.fileName}:`, err);
        }
      }
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });

    // ✅ Filename logic remains unchanged
    const stripEpochSuffix = (name: string) =>
      name.replace(/[_-]\d{10,13}(\.\w+)?$/, "");

    const extractFromFilename = (raw: string | undefined): string | null => {
      if (!raw) return null;
      let s = raw;
      if (s.startsWith("https___") || s.startsWith("http___")) {
        const restored = s.replace(/^https?___/, "").replace(/_/g, "/");
        const parts = restored.split("/");
        const dicomIndex = parts.indexOf("dicom");
        if (dicomIndex !== -1 && dicomIndex + 1 < parts.length) {
          return parts[dicomIndex + 1];
        }
        return parts[parts.length - 1] || null;
      }
      if (s.includes("/dicom/")) {
        const parts = s.split("/dicom/");
        if (parts.length > 1) {
          const after = parts[1];
          const segs = after.split("/");
          return segs[0] || segs[segs.length - 1] || null;
        }
      }
      const tokenSplit = s.split(/_dicom_|dicom_/);
      if (tokenSplit.length > 1) {
        return tokenSplit[1].split(/[\/_]/)[0] || tokenSplit[1];
      }
      if (s.includes("/")) {
        const parts = s.split("/");
        return parts[parts.length - 1] || null;
      }
      if (s.includes("_")) {
        const parts = s.split("_");
        return parts.length > 4 ? parts.slice(-4).join("_") : s;
      }
      return s || null;
    };

    let cleanBaseNameCandidate = extractFromFilename(filename) || "";
    if (!cleanBaseNameCandidate) {
      const firstFolderKey = Object.keys(folders)[0];
      if (firstFolderKey) {
        const parts = firstFolderKey.split("/");
        cleanBaseNameCandidate = parts[parts.length - 1] || "";
      }
    }
    if (!cleanBaseNameCandidate) {
      cleanBaseNameCandidate = `DicomFiles_${appointmentId}`;
    }

    cleanBaseNameCandidate = stripEpochSuffix(cleanBaseNameCandidate);
    let cleanBaseName = cleanBaseNameCandidate.replace(/[^a-zA-Z0-9_\-]/g, "_");
    if (!cleanBaseName) cleanBaseName = `DicomFiles_${appointmentId}`;
    const dateSuffix = new Date().toISOString().slice(0, 10);
    const zipFilename = `${cleanBaseName}_${dateSuffix}.zip`;

    saveAs(zipBlob, zipFilename);

    setProgress({
      downloadedMB: totalDownloadedBytes / (1024 * 1024),
      percentage: 100,
      currentFile: "Completed",
    });

    setIsDownloading(false);
    console.log("✅ ZIP file downloaded:", zipFilename);
  } catch (error: any) {
    console.error("❌ DICOM download failed:", error);
    alert("Failed to download DICOM files. Please try again.");
    setIsDownloading(false);
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

interface DownloadProgress {
  downloadedMB: number;
  percentage: number;
  currentFile: string;
}

export const handleAllDownloadDicom = async (
  selectedRowIds: number[],
  setProgress: React.Dispatch<React.SetStateAction<DownloadProgress>>
): Promise<void> => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found in localStorage");
    return;
  }

  const payload = encrypt({ refAppointmentId: selectedRowIds }, token);

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL_PROFILESERVICE}/technicianintakeform/overalldownloaddicom`,
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
    const allFiles: DicomFile[] = [];
    for (const folderName of Object.keys(folders)) {
      allFiles.push(...folders[folderName]);
    }

    let totalDownloadedBytes = 0;
    let totalFiles = allFiles.length;
    let completedFiles = 0;

    // ✅ Start download
    for (const rawFolderName of Object.keys(folders)) {
      const folderName = rawFolderName.split("/").pop() || rawFolderName;
      const folder = zip.folder(folderName);
      if (!folder) continue;

      for (const file of folders[rawFolderName]) {
        try {
          setProgress({
            downloadedMB: totalDownloadedBytes / (1024 * 1024),
            percentage: (completedFiles / totalFiles) * 100,
            currentFile: file.fileName.split("/").pop() || file.fileName,
          });

          let previousLoaded = 0;
          const fileResponse = await axios.get(file.url, {
            responseType: "blob",
            onDownloadProgress: (progressEvent) => {
              if (progressEvent.loaded) {
                const incremental = progressEvent.loaded - previousLoaded;
                previousLoaded = progressEvent.loaded;

                totalDownloadedBytes += incremental;
                const downloadedMB = totalDownloadedBytes / (1024 * 1024);
                const percentage =
                  ((completedFiles + progressEvent.loaded / (progressEvent.total || 1)) /
                    totalFiles) *
                  100;

                setProgress({
                  downloadedMB,
                  percentage,
                  currentFile: file.fileName.split("/").pop() || file.fileName,
                });
              }
            },
          });

          const fileNameOnly = file.fileName.split("/").pop() || file.fileName;
          folder.file(fileNameOnly, fileResponse.data);
          completedFiles++;
        } catch (err) {
          console.error(`Failed to fetch file ${file.fileName}:`, err);
        }
      }
    }

    // ✅ Generate ZIP
    const zipBlob = await zip.generateAsync({ type: "blob" });
    const zipFilename = `DicomFiles_${new Date()
      .toISOString()
      .slice(0, 10)}.zip`;
    saveAs(zipBlob, zipFilename);

    console.log("✅ ZIP file generated and downloaded:", zipFilename);
    setProgress({
      downloadedMB: totalDownloadedBytes / (1024 * 1024),
      percentage: 100,
      currentFile: "Completed",
    });
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
