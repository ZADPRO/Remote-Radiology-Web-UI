import { decrypt, encrypt } from "@/Helper";
import { tokenService } from "@/lib/tokenService";
import axios, { AxiosProgressEvent } from "axios";
import {
  FileData,
  LicenseFileDetails,
  UploadFile,
  UploadFilePayload,
} from "./commonServices";

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
  refUserId?: number;
  refUserFirstName: string;
  refUserLastName: string;
  refUserDOB: string;
  refUserCustId: string;
  refUserAgreementStatus: boolean;
  refUserStatus: boolean;
  refRTId: number;
  refTDDigitalSignature?: string;
  refTDDrivingLicense: string;
  refTDSSNo?: string;
  refTDTrainedEaseQTStatus?: boolean;
  refCODOEmail: string;
  refCODOPhoneNo1: string;
  refCODOPhoneNo1CountryCode: string;
  refUserProfileImg: string;
  profileImgFile: FileData;
  digitalSignatureFile: FileData | null;
  drivingLicenseFile: FileData;
  licenseFiles: LicenseFileDetails[];
}

export interface DicomFiles {
  refDFId: number;
  refAppointmentId: number;
  refUserId: number;
  refDFFilename: string;
  refDFCreatedAt: string;
  refDFSide: "Left" | "Right";
}

export interface DicomFileList {
  DFId: number;
  AppointmentId: number;
  UserId: number;
  CreatedBy: number;
  CreatedAt: string; // ISO timestamp, or Date if parsed
  FileName: string;
  Side: "Left" | "Right";
}

export interface TechnicianPatientQueue {
  refAppointmentId: number;
  refUserCustId: string;
  refCategoryId: number;
  refSCCustId: string;
  refSCId: number;
  refAppointmentDate: string; // or Date, if you're parsing it
  refAppointmentComplete: string; // optionally narrow to "fillform" | "complete" | etc.
  refUserFirstName: string;
  refAppointmentAssignedUserId: number;
  refUserId: number;
  refAppointmentRemarks: string;
  refAppointmentMailSendStatus: string;
  dicomFiles: DicomFiles[];
  GetCorrectEditModel: {
    isHandleCorrect: boolean;
    isHandleEdited: boolean;
  };
  reportStatus: string;
  refOverrideStatus: string;
  OldReportCount: string;
  patientPrivatePublicStatus: string;
}

export interface ResponseTechnicianForm {
  refTITFId: number;
  answer: string;
  questionId: number;
  // file?: FileData;
}

export interface Remarks {
  refAppointmentId: number;
  refRCreatedAt: string;
  refRId: number;
  refRemarksMessage: string;
  refUserId: number;
  refUserCustId: string;
}

export interface GetOldReportRes {
  status: boolean;
  message: string;
  data: ListOldReportModel[];
}

export interface ListOldReportModel {
  refORId: number;
  refUserId: number;
  refAppointmentId: number;
  refORCategoryId: number;
  refORFilename: string;
  refORCreatedAt: string;
  refORCreatedBy: string;
}

export const technicianService = {
  createNewTechnician: async (formData: NewTechnician) => {
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
    tokenService.setToken(res.data.token);
    return decryptedData;
  },

  listAllRemarks: async (appointmentId: number) => {
    const token = localStorage.getItem("token");
    const payload = encrypt({ appointmentId }, token);
    const res = await axios.post(
      `${
        import.meta.env.VITE_API_URL_PROFILESERVICE
      }/reportintakeform/listremark`,
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

  UpdateRemark: async (
    appointmentId: number,
    patientId: number,
    remark: string
  ): Promise<any> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found in localStorage");

      const payload = encrypt(
        {
          appointmentId,
          patientId,
          remark,
        },
        token
      );

      const response = await axios.post(
        `${
          import.meta.env.VITE_API_URL_PROFILESERVICE
        }/reportintakeform/updateRemarks`,
        { encryptedData: payload },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      const { data } = response;
      const decryptedData = decrypt(data.data, data.token);
      tokenService.setToken(data.token);

      return decryptedData;
    } catch (error) {
      console.error("Error updating remark:", error);
      return { success: false, message: error };
    }
  },

  AssignUser: async (
    refAppointmentId: number,
    patientId: number,
    assingUserId: number,
    assingUsercustId: string
  ): Promise<any> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found in localStorage");

      const payload = encrypt(
        {
          refAppointmentId,
          patientId,
          assingUserId,
          assingUsercustId,
        },
        token
      );

      const response = await axios.post(
        `${
          import.meta.env.VITE_API_URL_PROFILESERVICE
        }/manageappointment/assignUser`,
        { encryptedData: payload },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      const { data } = response;
      const decryptedData = decrypt(data.data, data.token);
      tokenService.setToken(data.token);

      return decryptedData;
    } catch (error) {
      console.error("Error updating remark:", error);
      return { success: false, message: error };
    }
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
    tokenService.setToken(res.data.token);
    return decryptedData;
  },
  getSpecificTechnician: async (scanCenterId: number, userId: number) => {
    const token = localStorage.getItem("token");
    const payload = encrypt(
      { refSCId: scanCenterId, refUserId: userId },
      token
    );
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
    tokenService.setToken(res.data.token);
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
    tokenService.setToken(res.data.token);
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
    tokenService.setToken(res.data.token);
    return decryptedData;
  },

  listTechnicianForm: async (patientId: number, appointmentId: number) => {
    const token = localStorage.getItem("token");
    const payload = encrypt(
      { patientId: patientId, appointmentId: appointmentId },
      token
    );
    console.log({ patientId: patientId, appointmentId: appointmentId });
    const res = await axios.post(
      `${
        import.meta.env.VITE_API_URL_PROFILESERVICE
      }/technicianintakeform/view`,
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

  assignTechnicianForm: async (patientId: number, appointmentId: number) => {
    const token = localStorage.getItem("token");
    const payload = encrypt(
      { patientId: patientId, appointmentId: appointmentId },
      token
    );
    console.log({ patientId: patientId, appointmentId: appointmentId });
    const res = await axios.post(
      `${
        import.meta.env.VITE_API_URL_PROFILESERVICE
      }/technicianintakeform/assignTechnician`,
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

  uploadDicom: async (
    { formFile }: UploadFilePayload,
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
  ) => {
    const token = localStorage.getItem("token");

    const res = await axios.post(
      `${
        import.meta.env.VITE_API_URL_USERSERVICE
      }/technicianintakeform/dicomupload`,
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
    tokenService.setToken(res.data.token);
    console.log(decryptData);
    return decryptData;
  },

  uploadDicomToS3: async (
    uploadURL: string,
    file: File,
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
  ) => {
    await axios.put(uploadURL, file, {
      headers: {
        "Content-Type": file.type,
      },
      onUploadProgress,
    });
  },

  getDicomUploadUrl: async (fileName: string) => {
    const token = localStorage.getItem("token");

    const res = await axios.post(
      `${
        import.meta.env.VITE_API_URL_USERSERVICE
      }/technicianintakeform/dicomuploadurl`,
      { fileName },
      {
        headers: {
          Authorization: token,
        },
      }
    );

    const decryptData = decrypt(res.data.data, res.data.token);
    tokenService.setToken(res.data.token);
    console.log("🔗 Pre-signed URLs:", decryptData);
    return decryptData;
  },

  saveDicom: async (formData: any) => {
    const token = localStorage.getItem("token");
    const payload = encrypt(formData, token);

    const res = await axios.post(
      `${
        import.meta.env.VITE_API_URL_PROFILESERVICE
      }/technicianintakeform/savedicom`,
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
  downLoadDicom: async (fileId: number) => {
    const token = localStorage.getItem("token");
    const payload = encrypt({ fileId: fileId }, token);

    const res = await axios.post(
      `${
        import.meta.env.VITE_API_URL_PROFILESERVICE
      }/technicianintakeform/downloaddicom`,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const decryptedData = decrypt(res.data.data, res.data.token);
    tokenService.setToken(res.data.token);
    return decryptedData;
  },

  downloadAllDicom: async (
    UserId: number,
    AppointmentId: number,
    Side: string
  ) => {
    const token = localStorage.getItem("token");
    const payload = encrypt(
      { UserId: UserId, AppointmentId: AppointmentId, Side: Side },
      token
    );

    const res = await axios.post(
      `${
        import.meta.env.VITE_API_URL_PROFILESERVICE
      }/technicianintakeform/alldownloaddicom`,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    console.log(res);
    return res;
  },

  listDicom: async (appointmentId: number, patientId: number) => {
    const token = localStorage.getItem("token");
    const payload = encrypt(
      { patientId: patientId, appointmentId: appointmentId },
      token
    );
    const res = await axios.post(
      `${
        import.meta.env.VITE_API_URL_PROFILESERVICE
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
    return decryptedData;
  },

  listOldReport: async (
    appointmentId: number,
    patientId: number,
    categoryId: number
  ) => {
    const token = localStorage.getItem("token");
    const payload = encrypt(
      {
        patientId: patientId,
        appointmentId: appointmentId,
        categoryId: categoryId,
      },
      token
    );
    const res = await axios.post(
      `${
        import.meta.env.VITE_API_URL_PROFILESERVICE
      }/reportintakeform/listAllOldReport`,
      { encryptedData: payload },
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
    const decryptedData: GetOldReportRes = decrypt(
      res.data.data,
      res.data.token
    );
    tokenService.setToken(res.data.token);
    return decryptedData;
  },

  // uploadOldReportFile: async ({ formFile }: UploadFilePayload) => {
  //   const token = localStorage.getItem("token");

  //   const res = await axios.post(
  //     `${
  //       import.meta.env.VITE_API_URL_USERSERVICE
  //     }/reportintakeform/addOldReport`,
  //     formFile,
  //     {
  //       headers: {
  //         Authorization: token,
  //         "Content-Type": "multipart/form-data",
  //       },
  //     }
  //   );
  //   console.log(res);
  //   const decryptData = decrypt(res.data.data, res.data.token);
  //   tokenService.setToken(res.data.token);
  //   return decryptData;
  // },
  uploadOldReportFile: async ({
    file,
    patientId,
    categoryId,
    appointmentId,
  }: {
    file: File;
    patientId: number;
    categoryId: number;
    appointmentId: number;
  }) => {
    const token = localStorage.getItem("token");

    const res = await axios.post(
      `${
        import.meta.env.VITE_API_URL_USERSERVICE
      }/reportintakeform/oldreportuploadurl`,
      {
        fileName: file.name,
        patientId: patientId.toString(),
        categoryId: categoryId.toString(),
        appointmentId: appointmentId.toString(),
      },
      {
        headers: { Authorization: token },
      }
    );

    const decryptData = decrypt(res.data.data, res.data.token);
    console.log("decryptData", decryptData);
    tokenService.setToken(res.data.token);

    const { uploadURL, viewURL, s3Key, fileName } = decryptData;

    await axios.put(uploadURL, file, {
      headers: { "Content-Type": file.type },
      onUploadProgress: (progressEvent: any) => {
        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        console.log(`Uploading ${file.name}: ${percent}%`);
      },
    });

    return { uploadURL, viewURL, fileName, s3Key };
  },

  deleteOldReportFile: async (ORId: number) => {
    const token = localStorage.getItem("token");
    const payload = encrypt(
      {
        refORId: ORId,
      },
      token
    );
    const res = await axios.post(
      `${
        import.meta.env.VITE_API_URL_PROFILESERVICE
      }/reportintakeform/deleteOldReport`,
      { encryptedData: payload },
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
    const decryptedData: GetOldReportRes = decrypt(
      res.data.data,
      res.data.token
    );
    tokenService.setToken(res.data.token);
    return decryptedData;
  },
};
