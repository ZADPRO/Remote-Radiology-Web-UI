import { decrypt, encrypt } from "@/Helper";
import axios from "axios";
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

export const handleAllDownloadDicom = async (selectedRowIds: number[]) => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No token found in localStorage");
    return;
  }

  console.log({ refAppointmentId: selectedRowIds });

  // Fix: The payload structure should match what the backend expects
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
        responseType: "blob",
      }
    );

    const blob = response.data;

    // Get filename from response headers if available
    const contentDisposition = response.headers["content-disposition"];
    let filename = "DicomFiles.zip";

    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename=(.+)/);
      if (filenameMatch) {
        filename = filenameMatch[1].replace(/"/g, "");
      }
    }

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (error: any) {
    console.error("Download failed:", error);
    // Handle error appropriately
    if (error.response?.status === 404) {
      alert("No DICOM files found for the selected appointments.");
    } else {
      alert("Failed to download DICOM files. Please try again.");
    }
  }
};

export const removeDicom = async (refDFId: number[]) => {
  const token = localStorage.getItem("token");
  console.log(refDFId);
  
    const payload = encrypt({ refDFId: refDFId }, token);
 
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL_PROFILESERVICE}/technicianintakeform/deleteDicom`,
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
}
