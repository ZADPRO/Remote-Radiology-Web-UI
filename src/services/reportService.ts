import { decrypt, encrypt } from "@/Helper";
import { tokenService } from "@/lib/tokenService";
import axios from "axios";

export interface AppointmentStatus {
  refAppointmentAccessId: number;
  refAppointmentAccessStatus: boolean;
  refAppointmentAssignedUserId: number;
  refAppointmentComplete: string;
  refAppointmentDate: string;
  refAppointmentId: number;
  refAppointmentPriority: string;
  refAppointmentRemarks: string;
  refCategoryId: number;
  refSCCustId: string;
  refSCId: number;
  refSCName: string;
  refUserId: number;
  refAppointmentImpression: string;
  refAppointmentRecommendation: string;
  refAppointmentImpressionAdditional: string;
  refAppointmentRecommendationAdditional: string;
  refAppointmentCommonImpressionRecommendation: string;
}

export interface ReportHistoryData {
  HandleUserName: string;
  refRHHandleEndTime: string;
  refRHHandleStartTime: string;
  refRHHandledUserId: number;
  refRHId: number;
  refRHHandleContentText: string;
  refRHHandleStatus: string;
}

export const reportService = {
  checkAccess: async (appointmentId: number) => {
    const token = localStorage.getItem("token");
    const payload = encrypt({ appointmentId: appointmentId }, token);

    const res = await axios.post(
      `${import.meta.env.VITE_API_URL_USERSERVICE
      }/reportintakeform/checkaccess`,
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

  getTemplate: async (id: number) => {
    const token = localStorage.getItem("token");
    const payload = encrypt({ id: id }, token);

    const res = await axios.post(
      `${import.meta.env.VITE_API_URL_USERSERVICE
      }/reportintakeform/getReportFormate`,
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

  uploadTemplate: async (fileName: string, fileData: string) => {
    const token = localStorage.getItem("token");
    const payload = encrypt(
      { name: fileName, formateTemplate: fileData },
      token
    );

    const res = await axios.post(
      `${import.meta.env.VITE_API_URL_USERSERVICE
      }/reportintakeform/uploadReportFormate`,
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

  assignReport: async (
    appointmentId: number,
    patientId: number,
    readOnly: boolean
  ) => {
    const token = localStorage.getItem("token");
    console.log(appointmentId, patientId, readOnly)
    const payload = encrypt(
      {
        appointmentId: appointmentId,
        patientId: patientId,
        readOnly: readOnly,
      },
      token
    );

    const res = await axios.post(
      `${import.meta.env.VITE_API_URL_USERSERVICE
      }/reportintakeform/assignreport`,
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

  submitReport: async (formData: any) => {
    const token = localStorage.getItem("token");
    const payload = encrypt(formData, token);

    const res = await axios.post(
      `${import.meta.env.VITE_API_URL_USERSERVICE
      }/reportintakeform/submitReport`,
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

  listDicoms: async (formData: any) => {
    const token = localStorage.getItem("token");
    const payload = encrypt(formData, token);

    const res = await axios.post(
      `${import.meta.env.VITE_API_URL_USERSERVICE
      }/technicianintakeform/viewDicom`,
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

   getPatientReport: async (id: number, appintmentId: number) => {
    const token = localStorage.getItem("token");
    const payload = encrypt({ id: id, appintmentId: appintmentId }, token);

    const res = await axios.post(
      `${import.meta.env.VITE_API_URL_USERSERVICE
      }/intakeform/getReportData`,
      { encryptedData: payload },
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
    const decryptedData: {
      RTCText: string;
      status: boolean;
    } = decrypt(res.data.data, res.data.token);
    tokenService.setToken(res.data.token);
    console.log(decryptedData);
    return decryptedData;
  },
};
