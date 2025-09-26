import { decrypt, encrypt } from "@/Helper";
import { tokenService } from "@/lib/tokenService";
import axios from "axios";
import { FileData } from "./commonServices";

export interface NewScanCenter {
  name: string;
  cust_id: string;
  address: string;
  email: string;
  website: string;
  telephone: string;
  logo: string;
  appointments: boolean;
}

export interface ListScanCenter {
  profileImgFile: FileData;
  refSCAddress: string;
  refSCAppointments: boolean;
  refSCCustId: string;
  refSCEmail: string;
  refSCId: number;
  refSCName: string;
  refSCPhoneNo1: string;
  refSCPhoneNo1CountryCode: string;
  refSCPhoneNo2: string;
  refSCProfile: string;
  refSCWebsite: string;
  refSCStatus: boolean;
}

export interface ListSpecificScanCenter {
  profileImgFile: FileData | null;
  refSCAddress: string;
  refSCAppointments: boolean;
  refSCEmail: string;
  refSCId: number;
  refSCName: string;
  refSCPhoneNo1: string;
  refSCPhoneNo1CountryCode: string;
  refSCPhoneNo2: string;
  refSCCustId: string;
  refSCProfile: string; // This appears to be a filename or UUID for an image.
  refSCWebsite: string;
  refSCStatus: boolean;
  refSCConsultantStatus: boolean;
}

export const scancenterService = {
  getAllScanCenters: async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `${
        import.meta.env.VITE_API_URL_PROFILESERVICE
      }/profile/scancenter/list-allscan-center`,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(res);
    const decryptedData = decrypt(res.data.data, res.data.token);
    tokenService.setToken(res.data.token);

    return decryptedData;
  },

  getSpecificScanCenters: async (scanCenterId: number) => {
    const token = localStorage.getItem("token");

    const payload = encrypt({ id: scanCenterId }, token);

    const res = await axios.post(
      `${
        import.meta.env.VITE_API_URL_PROFILESERVICE
      }/profile/scancenter/list-scan-center`,
      { encryptedData: payload },
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("HEllo --->", decrypt(res.data.data, res.data.token));
    const decryptedData = decrypt(res.data.data, res.data.token);
    tokenService.setToken(res.data.token);
    return decryptedData;
  },

  addScanCenter: async (formData: NewScanCenter) => {
    const token = localStorage.getItem("token");
    const payload = encrypt(formData, token);

    const res = await axios.post(
      `${import.meta.env.VITE_API_URL_PROFILESERVICE}/scancenter/new`,
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

  updateScanCenter: async (formData: any) => {
    const token = localStorage.getItem("token");
    const payload = encrypt(formData, token);

    const res = await axios.patch(
      `${import.meta.env.VITE_API_URL_PROFILESERVICE}/scancenter/update`,
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

export interface NewScanCenterAdmin {
  firstname: string;
  lastname: string;
  profile_img: string;
  dob: string;
  phoneCountryCode: string;
  phone: string;
  email: string;
  social_security_no: string;
  drivers_license: string;
  refSCId: number | null; // Reference Scan Center ID
}

export interface ListScanCenterAdmin {
  refCODOEmail: string;
  refCODOPhoneNo1: string;
  refRTId: number;
  refUserCustId: string;
  refUserFirstName: string;
  refUserId: number;
  refUserLastName: string;
  refUserStatus: "true" | "false";
}

export interface ListSpecificScanCenterAdmin {
  profileImgFile: FileData | null;
  drivingLicenseFile: FileData;
  refCODOEmail: string;
  refCODOPhoneNo1: string;
  refCODOPhoneNo1CountryCode: string;
  refRDDrivingLicense: string;
  refRDSSId: string;
  refRTId: number;
  refUserAgreementStatus: boolean;
  refUserCustId: string;
  refUserDOB: string; // Consider using Date if parsed: `Date`
  refUserFirstName: string;
  refUserId: number;
  refUserLastName: string;
  refUserProfileImg: string;
  refUserStatus: string; // Use `boolean` if the value is not a string
}

export const scanCenterAdminService = {
  addScanCenterAdmin: async (formData: NewScanCenterAdmin) => {
    const token = localStorage.getItem("token");
    const payload = encrypt(formData, token);

    const res = await axios.post(
      `${import.meta.env.VITE_API_URL_PROFILESERVICE}/receptionist/new`,
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
  getAllScanCenterAdmin: async (scanCenterId: number) => {
    const token = localStorage.getItem("token");
    const payload = encrypt({ refSCId: scanCenterId }, token);
    const res = await axios.post(
      `${
        import.meta.env.VITE_API_URL_PROFILESERVICE
      }/profile/receptionist/list-allreceptionists`,
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
  getSpecificScanCenterAdmin: async (scanCenterId: number, userId: number) => {
    const token = localStorage.getItem("token");
    const payload = encrypt(
      { refSCId: scanCenterId, refUserId: userId },
      token
    );
    const res = await axios.post(
      `${
        import.meta.env.VITE_API_URL_PROFILESERVICE
      }/profile/receptionist/list-receptionists`,
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
  updateScanCenterAdmin: async (formData: any) => {
    const token = localStorage.getItem("token");
    const payload = encrypt(formData, token);

    const res = await axios.patch(
      `${import.meta.env.VITE_API_URL_PROFILESERVICE}/receptionist/update`,
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
