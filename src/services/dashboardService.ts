import { decrypt, encrypt } from "@/Helper";
import { tokenService } from "@/lib/tokenService";
import axios from "axios";
 
export interface TrainingMaterial {
  refTMFileName: string;
  refTMFilePath: string;
  refTMId: number;
  refTMStatus: boolean
}
 
export const dashboardService = {
  dashboardInfo: async () => {
    const token = localStorage.getItem("token");
 
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL_USERSERVICE}/profile/user/dashboard`,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(res);
    const decryptData = decrypt(res.data.data, res.data.token);
    tokenService.setToken(res.data.token);
    return decryptData;
  },
 
  uploadTrainingMaterial: async (formData: any) => {
    const token = localStorage.getItem("token");
    const payload = encrypt(formData, token);
 
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL_PROFILESERVICE}/trainingmaterial/add`,
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
    return decryptedData;
  },
  getAllTrainingMaterials: async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL_PROFILESERVICE}/trainingmaterial/list`,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(res);
    const decryptedData: {
      data: TrainingMaterial[];
      status: boolean;
    } = decrypt(res.data.data, res.data.token);
    tokenService.setToken(res.data.token);
 
    return decryptedData;
  },
 
  downloadTrainingMaterial: async (fileId: number) => {
    const token = localStorage.getItem("token");
    const payload = encrypt({ id: fileId }, token);
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL_PROFILESERVICE
      }/trainingmaterial/download`,
      { encryptedData: payload },
      {
        headers: {
          Authorization: `Bearer ${token}`, // <-- Add 'Bearer ' prefix
          "Content-Type": "application/json",
        },
        responseType: "blob", // <-- Important for binary data
      }
    );
    console.log(res);
    const blob = res.data;
 
    // // Create a URL for the blob and trigger download
    // const url = window.URL.createObjectURL(blob);
    // const a = document.createElement("a");
    // a.href = url;
    // a.download = filename;
    // document.body.appendChild(a);
    // a.click();
    // document.body.removeChild(a);
    // window.URL.revokeObjectURL(url);
 
    return blob
  },
 
  deleteTrainingMaterial: async (fileId: number) => {
    const token = localStorage.getItem("token");
    const payload = encrypt({ id: fileId }, token);
 
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL_PROFILESERVICE}/trainingmaterial/delete`,
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
    return decryptedData;
  },
};