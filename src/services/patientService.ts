import { decrypt, encrypt } from "@/Helper";
import { tokenService } from "@/lib/tokenService";
import axios from "axios";
import { FileData } from "./commonServices";

export interface ListAllPatient {
  refCODOEmail: string;
  refCODOPhoneNo1: string;
  refRTId: number;
  refUserCustId: string;
  refUserFirstName: string;
  refUserId: number;
  refUserLastName: string;
  refUserStatus: string;
}

export interface NewPatient {
  firstname: string;
  lastname: string;
  profile_img: string;
  dob: string;
  phoneCountryCode: string;
  phone: string;
  email: string;
  gender: string;
  dateofAppointment: string;
  custId: string;
  mailoption: string;
}

export interface ListSpecificPatient {
  profileImgFile: FileData | null;

  refCODOEmail: string;
  refCODOPhoneNo1: string;
  refCODOPhoneNo1CountryCode: string;

  refRTId: number;
  refUserCustId: string;
  refUserDOB: string;
  refUserFirstName: string;
  refUserLastName: string;
  refUserId: number;
  refUserProfileImg: string;
  refUserStatus: boolean;
  refUserGender: string;
  refSCCustId: string;
  refSCId: number;
  appointments: PatientAppointmentModel[];
}

export interface PatientAppointmentModel {
  refAppointmentId: number;
  refAppointmentDate: string;
  refSCId: number;
  refSCCustId: string;
  allowCancelResh: boolean;
}

export const patientService = {
  getAllPatient: async (scanCenterId: number) => {
    const token = localStorage.getItem("token");
    const payload = encrypt({ SCId: scanCenterId }, token);
    const res = await axios.post(
      `${
        import.meta.env.VITE_API_URL_PROFILESERVICE
      }/profile/patient/list-allpatient`,
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

  getSpecificPatient: async (scanCenterId: number, userId: number) => {
    const token = localStorage.getItem("token");
    const payload = encrypt(
      { refSCId: scanCenterId, refUserId: userId },
      token
    );
    const res = await axios.post(
      `${
        import.meta.env.VITE_API_URL_PROFILESERVICE
      }/profile/patient/list-patient`,
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

  checkPatient: async (email: string, phoneno: string, patientId: string) => {
    const token = localStorage.getItem("token");
    const payload = encrypt(
      { emailId: email, phoneNo: phoneno, patientId: patientId },
      token
    );
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL_PROFILESERVICE}/patient/check`,
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

  addPatient: async (
    formData: NewPatient,
    scanCenterId: number,
    SCustId: string
  ) => {
    const token = localStorage.getItem("token");
    const payload = encrypt(
      {
        firstname: formData.firstname,
        profile_img: formData.profile_img,
        dob: formData.dob,
        phoneCountryCode: formData.phoneCountryCode,
        phoneNo: formData.phone,
        emailId: formData.email,
        gender: formData.gender,
        dateofAppointment: formData.dateofAppointment,
        patientId: formData.custId,
        mailoption: formData.mailoption,
        refSCId: scanCenterId,
        refSCustId: SCustId,
      },
      token
    );
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL_PROFILESERVICE}/patient/new`,
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

  updatePatient: async (formData: ListSpecificPatient) => {
    const token = localStorage.getItem("token");
    const payload = encrypt(
      {
        refUserId: formData.refUserId,
        refUserCustId: formData.refUserCustId,
        refUserStatus: formData.refUserStatus,
        refUserFirstName: formData.refUserFirstName,
        refUserProfileImg: formData.refUserProfileImg,
        refUserDOB: formData.refUserDOB,
        refUserGender: formData.refUserGender,
        refCODOPhoneNo1CountryCode: formData.refCODOPhoneNo1CountryCode,
        refCODOPhoneNo1: formData.refCODOPhoneNo1,
        refCODOEmail: formData.refCODOEmail,
      },
      token
    );
    const res = await axios.patch(
      `${import.meta.env.VITE_API_URL_PROFILESERVICE}/patient/update`,
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

  createAppointmentPatient: async (
    formData: ListSpecificPatient,
    dateofAppointment: string,
    scanCenterId: number,
    SCustId: string,
    mailoption: string
  ) => {
    const token = localStorage.getItem("token");
    const payload = encrypt(
      {
        refUserId: formData.refUserId,
        firstname: formData.refUserFirstName,
        profile_img: formData.refUserProfileImg,
        dob: formData.refUserDOB,
        gender: formData.refUserGender,
        phoneCountryCode: formData.refCODOPhoneNo1CountryCode,
        phoneNo: formData.refCODOPhoneNo1,
        emailId: formData.refCODOEmail,
        dateofAppointment: dateofAppointment,
        mailoption: mailoption,
        refSCId: scanCenterId,
        refSCustId: SCustId,
      },
      token
    );
    const res = await axios.patch(
      `${
        import.meta.env.VITE_API_URL_PROFILESERVICE
      }/patient/createAppointment`,
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

  sendMailAppointmentPatient: async (
    formData: ListSpecificPatient,
    dateofAppointment: string,
    scanCenterId: number,
    SCustId: string,
    mailoption: string
  ) => {
    const token = localStorage.getItem("token");
    const payload = encrypt(
      {
        patientId: formData.refUserId,
        firstname: formData.refUserFirstName,
        profile_img: formData.refUserProfileImg,
        dob: formData.refUserDOB,
        gender: formData.refUserGender,
        phoneCountryCode: formData.refCODOPhoneNo1CountryCode,
        phoneNo: formData.refCODOPhoneNo1,
        emailId: formData.refCODOEmail,
        dateofAppointment: dateofAppointment,
        mailoption: mailoption,
        refSCId: scanCenterId,
        refSCustId: SCustId,
      },
      token
    );
    const res = await axios.patch(
      `${
        import.meta.env.VITE_API_URL_PROFILESERVICE
      }/patient/sendMailAppointment`,
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

  cancelRescheduleAppointment: async (
    appointmentId: number,
    appointmentDate: string,
    method: string
  ) => {
  
    const token = localStorage.getItem("token");
    const payload = encrypt(
      {
        appointmentId: appointmentId,
        appointmentDate: appointmentDate,
        accessMethod: method,
      },
      token
    );
    const res = await axios.post(
      `${
        import.meta.env.VITE_API_URL_PROFILESERVICE
      }/patient/cancelReschduleAppointment`,
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
