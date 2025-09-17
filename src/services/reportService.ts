import { decrypt, encrypt } from "@/Helper";
import { tokenService } from "@/lib/tokenService";
import axios from "axios";
import { FileData } from "./commonServices";

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
  refSCAddress: string;
  refUserId: number;
  refAppointmentImpression: string;
  refAppointmentRecommendation: string;
  refAppointmentImpressionAdditional: string;
  refAppointmentRecommendationAdditional: string;
  refAppointmentCommonImpressionRecommendation: string;
  refAppointmentImpressionRight: string;
  refAppointmentRecommendationRight: string;
  refAppointmentImpressionAdditionalRight: string;
  refAppointmentRecommendationAdditionalRight: string;
  refAppointmentCommonImpressionRecommendationRight: string;
  refAppointmentPatietHistory: string;
  refAppointmentBreastImplantImageText: string;
  refAppointmentSymmetryImageText: string;
  refAppointmentBreastdensityImageText: string;
  refAppointmentNippleAreolaImageText: string;
  refAppointmentGlandularImageText: string;
  refAppointmentLymphnodeImageText: string;
  refAppointmentBreastdensityImageTextLeft: string;
  refAppointmentNippleAreolaImageTextLeft: string;
  refAppointmentGlandularImageTextLeft: string;
  refAppointmentLymphnodeImageTextLeft: string;
}

export interface GetOldReport {
  refORCategoryId: number;
  files: string;
}


export interface ReportHistoryData {
  HandleUserName: string;
  refRHHandleEndTime: string;
  refRHHandleStartTime: string;
  refRHHandledUserId: number;
  refRHId: number;
  refRHHandleContentText: string;
  refRHHandleStatus: string;
  HandlerRTId: number;
}

export interface FinalPatientReport {
  refAppointmentId: number;
  refRTCText: string;
}

export interface FinalAddendumText {
  refADCreatedAt: string;
  refADID: number;
  refADText: string;
  refAppointmentId: string;
  refUserId: number;
  refUserCustId: string;
}

export interface ViewFileRes {
  status: boolean;
  data: FileData;
}

export const reportService = {
  checkAccess: async (appointmentId: number) => {
    const token = localStorage.getItem("token");
    const payload = encrypt({ appointmentId: appointmentId }, token);

    const res = await axios.post(
      `${
        import.meta.env.VITE_API_URL_USERSERVICE
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
      `${
        import.meta.env.VITE_API_URL_USERSERVICE
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

  uploadTemplate: async (
    fileName: string,
    fileData: string,
    accessStatus: string
  ) => {
    const token = localStorage.getItem("token");
    const payload = encrypt(
      { name: fileName, formateTemplate: fileData, accessStatus: accessStatus },
      token
    );

    const res = await axios.post(
      `${
        import.meta.env.VITE_API_URL_USERSERVICE
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

  deleteTemplate: async (id: number) => {
    const token = localStorage.getItem("token");
    const payload = encrypt({ id: id }, token);

    const res = await axios.post(
      `${
        import.meta.env.VITE_API_URL_USERSERVICE
      }/reportintakeform/deleteReportFormate`,
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

  updateTemplate: async (id: number, accessStatus: string) => {
    const token = localStorage.getItem("token");
    const payload = encrypt({ id: id, accessStatus: accessStatus }, token);

    const res = await axios.post(
      `${
        import.meta.env.VITE_API_URL_USERSERVICE
      }/reportintakeform/updateReportFormate`,
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

  allowOverRide: async (appointmentId: number) => {
    const token = localStorage.getItem("token");
    const payload = encrypt({ appintmentId: appointmentId }, token);

    const res = await axios.post(
      `${import.meta.env.VITE_API_URL_USERSERVICE}/intakeform/allowoverride`,
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
    console.log(appointmentId, patientId, readOnly);
    const payload = encrypt(
      {
        appointmentId: appointmentId,
        patientId: patientId,
        readOnly: readOnly,
      },
      token
    );

    const res = await axios.post(
      `${
        import.meta.env.VITE_API_URL_USERSERVICE
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
    console.log(decryptedData + "________________________________???");
    return decryptedData;
  },

  submitReport: async (formData: any) => {
    const token = localStorage.getItem("token");
    const payload = encrypt(formData, token);

    const res = await axios.post(
      `${
        import.meta.env.VITE_API_URL_USERSERVICE
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

  autosaveReport: async (formData: any) => {
    const token = localStorage.getItem("token");
    const payload = encrypt(formData, token);

    const res = await axios.post(
      `${
        import.meta.env.VITE_API_URL_USERSERVICE
      }/reportintakeform/autosaveReport`,
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
      `${
        import.meta.env.VITE_API_URL_USERSERVICE
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

  getPatientReport: async (appintmentId: number[]) => {
    const token = localStorage.getItem("token");
    console.log(appintmentId);
    const payload = encrypt({ appintmentId }, token);

    const res = await axios.post(
      `${import.meta.env.VITE_API_URL_USERSERVICE}/intakeform/getReportData`,
      { encryptedData: payload },
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
    const decryptedData: {
      data: FinalPatientReport[];
      status: boolean;
    } = decrypt(res.data.data, res.data.token);
    tokenService.setToken(res.data.token);
    console.log(decryptedData);
    return decryptedData;
  },

  getPatientConsent: async (appintmentId: number[]) => {
    console.log(appintmentId);
    const token = localStorage.getItem("token");
    const payload = encrypt({ appintmentId: appintmentId }, token);

    const res = await axios.post(
      `${import.meta.env.VITE_API_URL_USERSERVICE}/intakeform/getConsentData`,
      { encryptedData: payload },
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
    const decryptedData: {
      data: { refAppointmentConsent: string; refAppointmentId: number }[];
      status: boolean;
    } = decrypt(res.data.data, res.data.token);
    tokenService.setToken(res.data.token);
    console.log(decryptedData);
    return decryptedData;
  },

  sendMailPatienteport: async (formData: any) => {
    const token = localStorage.getItem("token");
    const payload = encrypt(formData, token);

    const res = await axios.post(
      `${import.meta.env.VITE_API_URL_USERSERVICE}/reportintakeform/sendMail`,
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

  getPatientInTakeFormReport: async (fileId: number) => {
    console.log(fileId);
    const token = localStorage.getItem("token");
    const payload = encrypt({ id: fileId }, token);

    const res = await axios.post(
      `${
        import.meta.env.VITE_API_URL_USERSERVICE
      }/reportintakeform/downloadreport`,
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

  getFileView: async (fileName: string) => {
    const token = localStorage.getItem("token");
    const payload = encrypt({ filename: fileName }, token);

    const res = await axios.post(
      `${import.meta.env.VITE_API_URL_USERSERVICE}/reportintakeform/viewFiles`,
      { encryptedData: payload },
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
    const decryptedData: ViewFileRes = decrypt(res.data.data, res.data.token);
    tokenService.setToken(res.data.token);
    return decryptedData;
  },

  AddAddedum: async (addedumtext: string, appointmentId: number) => {
    const token = localStorage.getItem("token");
    const payload = encrypt(
      {
        addAddendumText: addedumtext,
        appointmentId: appointmentId,
      },
      token
    );

    const res = await axios.post(
      `${
        import.meta.env.VITE_API_URL_USERSERVICE
      }/reportintakeform/addAddendum`,
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
