import { decrypt, encrypt } from "@/Helper";
import { tokenService } from "@/lib/tokenService";
import axios from "axios";
import { FileData } from "./commonServices";

export interface scancenterData {
  refSCId: number;
  refSCCustId: string;
  refSCName: string;
  refSCAddress: string;
}

export interface userData {
  refUserId: number;
  refUserCustId: string;
}

export interface GetCountScanCenterMonthModel {
  refSCId: number;
  total_appointments: number;
}

export interface GetUserModel {
  refUserFirstName: string;
  refCODOPhoneNo1: string;
  refCODOEmail: string;
}

export interface AdminOverallScanIndicatesAnalyticsModel {
  total_appointments: number;
  SForm: number;
  DaForm: number;
  DbForm: number;
  DcForm: number;
}

export interface InvoiceHistory {
  refIHId: number;
  refSCId?: number | null;
  refUserId?: number | null;
  refIHFromId: number;
  refIHFromName: string;
  refIHFromPhoneNo: string;
  refIHFromEmail: string;
  refIHFromPan: string;
  refIHFromGST: string;
  refIHFromAddress: string;
  refIHToId: number;
  refIHToName: string;
  refIHFromDate: string; // e.g., "2025-07-01"
  refIHToDate: string; // e.g., "2025-07-31"
  refIHModePayment: string;
  refIHUPIId: string;
  refIHAccountHolderName: string;
  refIHAccountNo: string;
  refIHAccountBank: string;
  refIHAccountBranch: string;
  refIHAccountIFSC: string;
  refIHQuantity: number;
  refIHAmount: number;
  refIHTotal: number;
  refIHCreatedAt: string; // or Date if parsed
  refIHCreatedBy: number;
  refIHToAddress: string;
  refIHSignatureFile: FileData;
}

export interface TakenDate {
  refIHFromDate: string; // e.g., "2025-01-01"
}

export const invoiceServie = {
  getAmount: async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL_USERSERVICE}/invoice/getamount`,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
    const decryptedData: {
      status: boolean;
      ScancenterAmount: number;
      UserAmount: number;
      scancenterData: scancenterData[];
      userData: userData[];
    } = decrypt(res.data.data, res.data.token);
    tokenService.setToken(res.data.token);
    return decryptedData;
  },

  updateAmount: async (ScancenterAmount: number, UserAmount: number) => {
    const token = localStorage.getItem("token");
    console.log({
      refTAAmountScanCenter: ScancenterAmount,
      refTAAmountUser: UserAmount,
    });
    const payload = encrypt(
      { refTAAmountScanCenter: ScancenterAmount, refTAAmountUser: UserAmount },
      token
    );
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL_USERSERVICE}/invoice/updateamount`,
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
    return decryptedData;
  },

  getInvoiceData: async (type: number, id: number, Monthyear: string) => {
    const token = localStorage.getItem("token");
    console.log({ type: type, userId: id, monthnyear: Monthyear });
    const payload = encrypt(
      { type: type, userId: id, monthnyear: Monthyear },
      token
    );
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL_USERSERVICE}/invoice/getInvoiceData`,
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
      amount: number;
      ScancenterData: scancenterData[];
      ScanCenterCount: GetCountScanCenterMonthModel[];
      UserData: GetUserModel[];
      UserCount: AdminOverallScanIndicatesAnalyticsModel[];
    } = decrypt(res.data.data, res.data.token);
    tokenService.setToken(res.data.token);
    return decryptedData;
  },

  generateInvoice: async (formData: any) => {
    const token = localStorage.getItem("token");
    const payload = encrypt(formData, token);
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL_USERSERVICE}/invoice/generteInvoice`,
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
    return decryptedData;
  },

  getInvoiceHistory: async (type: number, id: number) => {
    const token = localStorage.getItem("token");
    const payload = encrypt({ type: type, id: id }, token);
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL_USERSERVICE}/invoice/getInvoiceHistory`,
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
      invoiceHistory: InvoiceHistory[];
      invoiceHistoryTakenDate: TakenDate[];
    } = decrypt(res.data.data, res.data.token);
    tokenService.setToken(res.data.token);
    return decryptedData;
  },
};
