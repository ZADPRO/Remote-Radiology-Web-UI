import { decrypt, encrypt } from "@/Helper";
import { tokenService } from "@/lib/tokenService";
import axios from "axios";

export interface ListAllNotification {
  refAppointmentId: number;
  refNAssignedBy: number;
  refNCreatedAt: string;
  refNId: number;
  refNMessage: string;
  refNstatus: boolean;
  refNReadStatus: boolean;
  refUserId: number;
}

export const notificationService = {
  getAllNotification: async (offSet: number) => {
    const token = localStorage.getItem("token");
    const payload = encrypt({ offset: offSet }, token);

    const res = await axios.post(
      `${
        import.meta.env.VITE_API_URL_USERSERVICE
      }/notification/viewnotification`,
      { encryptedData: payload },
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
    const decryptedData: {
      status: boolean;
      message: string;
      totalcount: number;
      data: ListAllNotification[];
    } = decrypt(res.data.data, res.data.token);
    tokenService.setToken(res.data.token);
    console.log(decryptedData);
    return decryptedData;
  },

  notifiReadStatus: async (
    notificationId: number,
    notificationStatus: boolean
  ) => {
    const token = localStorage.getItem("token");
    const payload = encrypt(
      { id: notificationId, status: notificationStatus },
      token
    );

    const res = await axios.post(
      `${import.meta.env.VITE_API_URL_USERSERVICE}/notification/readStatus`,
      { encryptedData: payload },
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
    const decryptedData: {
        status: boolean;
        message: string;
    } = decrypt(res.data.data, res.data.token);
    tokenService.setToken(res.data.token);
    console.log(decryptedData);
    return decryptedData;
  },

  getUnreadNotificationCount: async () => {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      `${import.meta.env.VITE_API_URL_USERSERVICE}/notification/getUnreadCount`,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
    const decryptedData: {
        totalcount: number;
        status: boolean;
        message: string;
    } = decrypt(res.data.data, res.data.token);
    tokenService.setToken(res.data.token);
    return decryptedData;
  }
};
