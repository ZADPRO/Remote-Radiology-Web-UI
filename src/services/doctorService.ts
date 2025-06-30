import { decrypt, encrypt } from "@/Helper";
import { FileData, LicenseFileDetails, MalpracticeInsuranceFileDetails, UploadFile } from "./commonServices";
import axios from "axios";
import { GetMedicalLicenseSecurity } from "./radiologistService";

export interface MedicalLicenseSecurity {
  State: string;
  MedicalLicenseSecurityNo: string;
}

export interface NewPerformingProvider {
  firstname: string;
  lastname: string;
  profile_img: string;
  dob: string;
  phoneCountryCode: string;
  phone: string;
  email: string;
  social_security_no: string;
  drivers_license: string;
  npi: string;
  specialization: string;
  medical_license_security: MedicalLicenseSecurity[];
  license_files: UploadFile[];
  malpracticeinsureance_files: UploadFile[];
  digital_signature: string;
  refSCId: number
}

export interface NewCoReportingDoctor {
  firstname: string;
  lastname: string;
  profile_img: string;
  dob: string;
  phoneCountryCode: string;
  phone: string;
  email: string;
  social_security_no: string;
  drivers_license: string;
  npi: string;
  specialization: string;
  medical_license_security: MedicalLicenseSecurity[];
  license_files: UploadFile[];
  malpracticeinsureance_files: UploadFile[];
  digital_signature: string;
  refSCId: number
}

export interface ListAllPerformingProvider {
  refCODOEmail: string;
  refCODOPhoneNo1: string;
  refRTId: number;
  refUserCustId: string;
  refUserFirstName: string;
  refUserId: number;
  refUserLastName: string;
  refUserStatus: string;
}

export interface ListSpecificPerformingProvider {
  profileImgFile: FileData | null;
  digitalSignatureFile: FileData | null;
  driversLicenseFile: FileData;

  licenseFiles: LicenseFileDetails[];
  malpracticeinsureance_files: MalpracticeInsuranceFileDetails[];
  medicalLicenseSecurity: GetMedicalLicenseSecurity[];

  aadharFile: FileData; // Not shown in the latest data but keeping for completeness
  panFile: FileData;    // Not shown in the latest data but keeping for completeness

  refCODOEmail: string;
  refCODOPhoneNo1: string;
  refCODOPhoneNo1CountryCode: string;

  refDDNPI: string;
  refDDSocialSecurityNo: string;

  digital_signature: string;
  drivers_license: string;
  Specialization: string;

  refRTId: number;
  refUserCustId: string;
  refUserDOB: string;
  refUserFirstName: string;
  refUserLastName: string;
  refUserId: number;
  refUserProfileImg: string;
  refUserStatus: boolean;
}

export interface ListAllCoDoctor {
  refCODOEmail: string;
  refCODOPhoneNo1: string;
  refRTId: number;
  refUserCustId: string;
  refUserFirstName: string;
  refUserId: number;
  refUserLastName: string;
  refUserStatus: string;
}

export interface ListSpecificCoDoctor {
  profileImgFile: FileData | null;
  digitalSignatureFile: FileData | null;
  driversLicenseFile: FileData;

  licenseFiles: LicenseFileDetails[];
  malpracticeinsureance_files: MalpracticeInsuranceFileDetails[];
  medicalLicenseSecurity: GetMedicalLicenseSecurity[];

  aadharFile: FileData; // Not shown in the latest data but keeping for completeness
  panFile: FileData;    // Not shown in the latest data but keeping for completeness

  refCODOEmail: string;
  refCODOPhoneNo1: string;
  refCODOPhoneNo1CountryCode: string;

  refDDNPI: string;
  refDDSocialSecurityNo: string;

  digital_signature: string;
  drivers_license: string;
  Specialization: string;

  refRTId: number;
  refUserCustId: string;
  refUserDOB: string;
  refUserFirstName: string;
  refUserLastName: string;
  refUserId: number;
  refUserProfileImg: string;
  refUserStatus: boolean;
}

export const doctorService = {
  addPerformingProvider: async (formData: NewPerformingProvider) => {
    const token = localStorage.getItem("token");
    const payload = encrypt(formData, token);

    const res = await axios.post(
      `${import.meta.env.VITE_API_URL_PROFILESERVICE}/doctor/new`,
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

  addCoReportingDoctor: async (formData: NewCoReportingDoctor) => {
    const token = localStorage.getItem("token");
    const payload = encrypt(formData, token);

    const res = await axios.post(
      `${import.meta.env.VITE_API_URL_PROFILESERVICE}/codoctor/new`,
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

  getAllPerformingProvider: async (scanCenterId: number) => {
    const token = localStorage.getItem("token");
    const payload = encrypt({ refSCId: scanCenterId }, token);
    const res = await axios.post(
      `${
        import.meta.env.VITE_API_URL_PROFILESERVICE
      }/profile/doctor/list-alldoctor`,
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

  getSpecificPerformingProvider: async (scanCenterId: number, userId: number) => {
     const token = localStorage.getItem("token");
    const payload = encrypt({ refSCId: scanCenterId, refUserId: userId }, token);
    const res = await axios.post(
      `${
        import.meta.env.VITE_API_URL_PROFILESERVICE
      }/profile/doctor/list-doctor`,
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

  updatePerformingProvider: async ( formData: any ) => {
    const token = localStorage.getItem("token");
    const payload = encrypt(formData, token);
    const res = await axios.patch(
      `${import.meta.env.VITE_API_URL_USERSERVICE}/doctor/update`,
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

  getAllCoDoctor: async (scanCenterId: number) => {
    const token = localStorage.getItem("token");
    const payload = encrypt({ refSCId: scanCenterId }, token);
    const res = await axios.post(
      `${
        import.meta.env.VITE_API_URL_PROFILESERVICE
      }/profile/codoctor/list-allcodoctor`,
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

  getSpecificCoDoctor: async (scanCenterId: number, userId: number) => {
     const token = localStorage.getItem("token");
    const payload = encrypt({ refSCId: scanCenterId, refUserId: userId }, token);
    const res = await axios.post(
      `${
        import.meta.env.VITE_API_URL_PROFILESERVICE
      }/profile/codoctor/list-codoctor`,
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

  updateCoDoctor: async ( formData: any ) => {
    const token = localStorage.getItem("token");
    const payload = encrypt(formData, token);
    const res = await axios.patch(
      `${import.meta.env.VITE_API_URL_USERSERVICE}/codoctor/update`,
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
