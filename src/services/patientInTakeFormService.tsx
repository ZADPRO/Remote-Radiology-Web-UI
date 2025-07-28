import { decrypt, encrypt } from "@/Helper";
import { tokenService } from "@/lib/tokenService";
import axios from "axios";

export interface IntakeOption {
  questionId: number;
  answer: string; // "true" or "false"
}

export interface FinalFormData {
  categoryId: number | null;
  overriderequest: boolean;
  appointmentId: number;
  answers: IntakeOption[];
}

export const patientInTakeService = {
    addPatientInTakeForm: async ( formData: any ) => {
    const token = localStorage.getItem("token");
    const payload = encrypt(formData, token);
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL_USERSERVICE}/intakeform/add`,
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
  },

  fetchPatientInTakeForm: async (userId: number, AppointmentId: number) => {
    const token = localStorage.getItem("token");

    const payload = encrypt({ userId, AppointmentId }, token);
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL_USERSERVICE}/intakeform/view`,
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
  },
  updatePatientInTakeForm: async ( formData: any ) => {
    const token = localStorage.getItem("token");
    const payload = encrypt(formData, token);
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL_USERSERVICE}/intakeform/update`,
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
  },
};

export interface AppointmentAdd {
  refSCId: string;
  refAppointmentDate: string;
}

export interface AppointmentDetails {
  refAppointmentComplete: string; 
  refAppointmentDate: string; 
  refAppointmentId: number;
  refCategoryId: number;
  refSCCustId: string;
  refSCId: number;
}

export const appointmentService = {
  addAppointment: async (formData: AppointmentAdd) => {
    const token = localStorage.getItem("token");

     const payload = encrypt(formData, token);
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL_USERSERVICE}/manageappointment/add`,
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
  },

  listPatientMedicalHistory: async() => {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      `${import.meta.env.VITE_API_URL_USERSERVICE}/manageappointment/viewpatienthistory`,
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
  },

  addTechnicianInTakeForm: async (formData: any) => {
    const token = localStorage.getItem("token");
    const payload = encrypt(formData, token);
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL_USERSERVICE}/technicianintakeform/add`,
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
},

  
}