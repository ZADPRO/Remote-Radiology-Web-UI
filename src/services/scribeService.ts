import { decrypt, encrypt } from "@/Helper";
import { tokenService } from "@/lib/tokenService";
import { EducationalFileDetails, FileData, UploadFile } from "./commonServices";
import axios from "axios";

export interface NewScribe {
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

export interface ListAllScribe {
  refCODOEmail: string;
  refCODOPhoneNo1: string;
  refRTId: number;
  refUserCustId: string;
  refUserFirstName: string;
  refUserId: number;
  refUserLastName: string;
  refUserStatus: string;
}

export interface ListSpecificScribe {
  aadharFile: FileData;
  drivingLicenseFile: FileData;
  educationCertificateFiles: EducationalFileDetails[];
  panFile: FileData;
  profileImgFile: FileData;

  refCODOEmail: string;
  refCODOPhoneNo1: string;
  refCODOPhoneNo1CountryCode: string;

  refRTId: number;
  refSDAadhar: string;
  refSDDrivingLicense: string;
  refSDPan: string;

  refUserAgreementStatus: boolean;
  refUserCustId: string;
  refUserDOB: string;
  refUserFirstName: string;
  refUserId: number;
  refUserLastName: string;
  refUserProfileImg: string;
  refUserStatus: boolean;
}

export const scribeService = {
  addScribe: async (formData: NewScribe) => {
    const token = localStorage.getItem("token");

    const payload = encrypt(formData, token);

    const res = await axios.post(
      `${import.meta.env.VITE_API_URL_PROFILESERVICE}/scribe/new`,
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

  listAllScribe: async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL_PROFILESERVICE}/profile/doctor/list-allScribe`,
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

  listSpecificScribe: async (scribeId: number) => {
    const token = localStorage.getItem("token");
    const payload = encrypt({id: scribeId}, token);
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL_PROFILESERVICE}/profile/doctor/list-scribe`,
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

  updateScribe: async (formData: any) => {
    const token = localStorage.getItem("token");
    const payload = encrypt(formData, token);

    const res = await axios.patch(
      `${import.meta.env.VITE_API_URL_PROFILESERVICE}/scribe/update`,
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
  }
};
