import { decrypt, encrypt } from "@/Helper";
import axios from "axios";
import {
  CVFileDetails,
  FileData,
  LicenseFileDetails,
  MalpracticeInsuranceFileDetails,
  UploadFile,
} from "./commonServices";
import { MedicalLicenseSecurity } from "./doctorService";

export interface NewRadiologist {
  firstname: string;
  lastname: string;
  profile_img: string;
  dob: string;
  phoneCountryCode: string;
  phone: string;
  email: string;
  mbbs_register_number: string;
  md_register_number: string;
  // address: string;
  // city: string;
  // state: string;
  // country: string;
  // code: string;
  // designation: string;
  specialization: string;
  pan: string;
  aadhar: string;
  // experience: Experience[];
  drivers_license: string;
  medical_license_security: MedicalLicenseSecurity[];
  malpracticeinsureance_files: UploadFile[];
  cv_files: UploadFile[];
  license_files: UploadFile[];
  digital_signature: string;
}

export interface ListAllRadiologists {
  refCODOEmail: string;
  refCODOPhoneNo1: string;
  refRTId: number;
  refUserCustId: string;
  refUserFirstName: string;
  refUserId: number;
  refUserLastName: string;
  refUserStatus: "true" | "false";
}

export interface GetMedicalLicenseSecurity {
  refMLSId: number;
  refMLSNo: string;
  refMLSState: string;
  refMLStatus: string;
}

export interface ListSpecificRadiologist {
  aadharFile: FileData;
  panFile: FileData;
  profileImgFile: FileData | null;
  digitalSignatureFile: FileData | null;
  drivingLicenseFile: FileData;

  cvFiles: CVFileDetails[];
  licenseFiles: LicenseFileDetails[];
  malpracticeinsureance_files: MalpracticeInsuranceFileDetails[];
  medicalLicenseSecurity: GetMedicalLicenseSecurity[];

  refCODOEmail: string;
  refCODOPhoneNo1: string;
  refCODOPhoneNo1CountryCode: string;
  refCODOPhoneNo2: string;
  refCODOPhoneNo2CountryCode: string;

  refRAAadhar: string;
  refRADrivingLicense: string;
  refRADigitalSignature: string;
  refRAMBBSRegNo: string;
  refRAMDRegNo: string;
  refRAPan: string;
  refRASpecialization: string;

  refRTId: number;
  refUserCustId: string;
  refUserDOB: string;
  refUserFirstName: string;
  refUserLastName: string;
  refUserId: number;
  refUserProfileImg: string;
  refUserStatus: boolean;
}

export interface ListSpecificWGPerformingProvider {
  aadharFile: FileData;
  panFile: FileData;
  profileImgFile: FileData | null;
  digitalSignatureFile: FileData | null;
  drivingLicenseFile: FileData;

  cvFiles: CVFileDetails[];
  licenseFiles: LicenseFileDetails[];
  malpracticeinsureance_files: MalpracticeInsuranceFileDetails[];
  medicalLicenseSecurity: GetMedicalLicenseSecurity[];

  refCODOEmail: string;
  refCODOPhoneNo1: string;
  refCODOPhoneNo1CountryCode: string;
  refCODOPhoneNo2: string;
  refCODOPhoneNo2CountryCode: string;

  refWGPPAadhar: string;
  refWGPPDrivingLicense: string;
  refWGPPDigitalSignature: string;
  refWGPPMBBSRegNo: string;
  refWGPPMDRegNo: string;
  refWGPPPan: string;
  refWGPPSpecialization: string;

  refRTId: number;
  refUserCustId: string;
  refUserDOB: string;
  refUserFirstName: string;
  refUserLastName: string;
  refUserId: number;
  refUserProfileImg: string;
  refUserStatus: boolean;
}

export const radiologistService = {
  createNewRadiologist: async (formData: NewRadiologist) => {
    const token = localStorage.getItem("token");
    const payload = encrypt(formData, token);
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL_USERSERVICE}/radiologist/new`,
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
    console.log(decryptedData);
    return decryptedData;
  },

  listAllRadiologists: async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `${
        import.meta.env.VITE_API_URL_USERSERVICE
      }/profile/radiologist/list-allradiologist`,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
    const decryptedData = decrypt(res.data.data, res.data.token);
    localStorage.setItem("token", res.data.token);
    console.log(decryptedData);
    return decryptedData;
  },

  listAllWellgreenPP: async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `${
        import.meta.env.VITE_API_URL_USERSERVICE
      }/profile/wellthgreenperformingprovider/list-allperformingprovider`,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
    const decryptedData = decrypt(res.data.data, res.data.token);
    localStorage.setItem("token", res.data.token);
    console.log(decryptedData);
    return decryptedData;
  },

  listSpecificRadiologist: async (radiologistId: number) => {
    const token = localStorage.getItem("token");
    const payload = encrypt({ id: radiologistId }, token);
    const res = await axios.post(
      `${
        import.meta.env.VITE_API_URL_USERSERVICE
      }/profile/radiologist/list-radiologist`,
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
    console.log(decryptedData);
    return decryptedData;
  },

  listSpecificWGPerformingProvider: async (radiologistId: number) => {
    const token = localStorage.getItem("token");
    const payload = encrypt({ id: radiologistId }, token);
    const res = await axios.post(
      `${
        import.meta.env.VITE_API_URL_USERSERVICE
      }/profile/wellthgreenperformingprovider/list-performingprovider`,
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
    console.log(decryptedData);
    return decryptedData;
  },

  updateRadiologist: async (formData: any) => {
    const token = localStorage.getItem("token");
    const payload = encrypt(formData, token);
    const res = await axios.patch(
      `${import.meta.env.VITE_API_URL_USERSERVICE}/radiologist/update`,
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
    console.log(decryptedData);
    return decryptedData;
  },
  updateWGPerformingProvider: async (formData: any) => {
    const token = localStorage.getItem("token");
    const payload = encrypt(formData, token);
    const res = await axios.patch(
      `${
        import.meta.env.VITE_API_URL_USERSERVICE
      }/wellgreenperformingprovider/update`,
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
    console.log(decryptedData);
    return decryptedData;
  },
};
