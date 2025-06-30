import { decrypt, encrypt } from "@/Helper";
import axios, { AxiosProgressEvent } from "axios";
import { FileData, LicenseFileDetails, UploadFile, UploadFilePayload } from "./commonServices";

export interface NewTechnician {
  firstname: string;
  lastname: string;
  profile_img: string;
  dob: string;
  phoneCountryCode: string;
  phone: string;
  email: string;
  social_security_no: string;
  drivers_license: string;
  trained_ease_qt: boolean;
  digital_signature: string;
  scan_center_id: number | null;
  license_files: UploadFile[];
}

export type Experience = {
  from_date: string;
  to_date: string;
  hospital_name: string;
  specialization: string;
  designation: string;
  address: string;
};

export interface TechnicianMap {
  refSCId: number;
  refRTId: number;
  status: boolean;
}

export interface ListAllTechnician {
  refCODOEmail: string;
  refCODOPhoneNo1: string;
  refRTId: number;
  refUserCustId: string;
  refUserFirstName: string;
  refUserId: number;
  refUserLastName: string;
  refUserStatus: string;
}

export interface ListSpecificTechnician {
  refUserId?: number
  refUserFirstName: string
  refUserLastName: string
  refUserDOB: string
  refUserCustId: string
  refUserAgreementStatus: boolean
  refUserStatus: boolean
  refRTId: number
  refTDDigitalSignature?: string
  refTDDrivingLicense: string
  refTDSSNo?: string
  refTDTrainedEaseQTStatus?: boolean
  refCODOEmail: string
  refCODOPhoneNo1: string
  refCODOPhoneNo1CountryCode: string
  refUserProfileImg: string
  profileImgFile: FileData
  digitalSignatureFile: FileData | null
  drivingLicenseFile: FileData
  licenseFiles: LicenseFileDetails[]
}

export interface TechnicianPatientQueue {
  refAppointmentId: number;
  refUserCustId: string;
  refCategoryId: number;
  refAppointmentDate: string; // or Date, if you're parsing it
  refAppointmentComplete: string; // optionally narrow to "fillform" | "complete" | etc.
  refUserFirstName: string
}


export const technicianService = {
  createNewTechnician: async ( formData: NewTechnician ) => {
    const token = localStorage.getItem("token");

    const payload = encrypt(formData, token);
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL_USERSERVICE}/technician/new`,
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
  getAllTechnician: async (scanCenterId: number) => {
    const token = localStorage.getItem("token");
    const payload = encrypt({ refSCId: scanCenterId }, token);
    const res = await axios.post(
      `${
        import.meta.env.VITE_API_URL_PROFILESERVICE
      }/profile/technician/list-alltechnician`,
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
  getSpecificTechnician: async (scanCenterId: number, userId: number) => {
     const token = localStorage.getItem("token");
    const payload = encrypt({ refSCId: scanCenterId, refUserId: userId }, token);
    const res = await axios.post(
      `${
        import.meta.env.VITE_API_URL_PROFILESERVICE
      }/profile/technician/list-technician`,
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
  updateTechnician: async (formData: any) => {
    const token = localStorage.getItem("token");
    const payload = encrypt(formData, token);

    const res = await axios.patch(
      `${import.meta.env.VITE_API_URL_PROFILESERVICE}/technician/update`,
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

  listPatientQueue: async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `${
        import.meta.env.VITE_API_URL_PROFILESERVICE
      }/manageappointment/viewtechnicianpatientqueue`,
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

  uploadDicom: async (
    { formFile }: UploadFilePayload,
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
  ) => {
    const token = localStorage.getItem("token");

    const res = await axios.post(
      `${import.meta.env.VITE_API_URL_USERSERVICE}/technicianintakeform/dicomupload`,
      formFile,
      {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress,
      }
    );

    const decryptData = decrypt(res.data.data, res.data.token);
    localStorage.setItem("token", res.data.token);
    console.log(decryptData)
    return decryptData;
  },
};