import { decrypt, encrypt } from "@/Helper";
import { EducationalFileDetails, FileData, UploadFile } from "./commonServices";
import axios from "axios";

export interface NewManager {
  firstname: string;
  lastname: string;
  profile_img: string;
  dob: string;
  phoneCountryCode: string;
  phone: string;
  email: string;
  drivers_license: string;
  pan: string;
  aadhar: string;
  education_certificate: UploadFile[];
}

export interface ListAllManager {
  refCODOEmail: string;
  refCODOPhoneNo1: string;
  refRTId: number;
  refUserCustId: string;
  refUserFirstName: string;
  refUserId: number;
  refUserLastName: string;
  refUserStatus: string;
}

export interface ListSpecificManager {
  refUserId: number;
  refUserCustId: string; // Manager's display ID
  refUserFirstName: string;
  refUserLastName: string;
  refUserProfileImg: string; // Path to image
  profileImgFile?: FileData; // Base64 data for existing image

  refUserDOB: string;
  refCODOPhoneNo1CountryCode: string;
  refCODOPhoneNo1: string;
  refCODOEmail: string;

  refMDDrivingLicense: string; // Path to file
  drivingLicenseFile?: FileData;

  refMDPan: string; // Path to file
  panFile?: FileData;

  refMDAadhar: string; // Path to file
  aadharFile?: FileData;

  refRTId?: number; // Added based on response
  refUserAgreementStatus?: boolean;

  educationCertificateFiles: EducationalFileDetails[];
  refUserStatus: boolean; // Active/Inactive status
}

export const managerService = {
  addManager: async (formData: NewManager) => {
    const token = localStorage.getItem("token");
    const payload = encrypt(formData, token);

    const res = await axios.post(
      `${import.meta.env.VITE_API_URL_PROFILESERVICE}/manager/new`,
      { encryptedData: payload },
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
    const decryptedData = decrypt(res.data.data, res.data.token);
    localStorage.setItem("token", res.data.token);
    return decryptedData;
  },
  listAllWellthGreenManager: async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL_PROFILESERVICE}/profile/manager/list-allmanager`,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
    const decryptedData = decrypt(res.data.data, res.data.token);
    localStorage.setItem("token", res.data.token);
    return decryptedData;
  },
  listSpecificWellthGreenManager: async (managerId: number) => {
    const token = localStorage.getItem("token");
    const payload = encrypt({id: managerId}, token);
    const res = await axios.post(
       `${import.meta.env.VITE_API_URL_PROFILESERVICE}/profile/manager/list-manager`,
       { encryptedData: payload },
        {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
    const decryptedData = decrypt(res.data.data, res.data.token);
    localStorage.setItem("token", res.data.token);
    return decryptedData;
  },
  updateWellthGreenAdmin: async (formData: any) => {
    const token = localStorage.getItem("token");
    const payload = encrypt(formData, token);

    const res = await axios.patch(
      `${import.meta.env.VITE_API_URL_PROFILESERVICE}/manager/update`,
      { encryptedData: payload },
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );

    const decryptedData = decrypt(res.data.data, res.data.token);
    localStorage.setItem("token", res.data.token);
    return decryptedData;
  }
};
