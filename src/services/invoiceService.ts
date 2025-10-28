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
  refRTId: number;
  refUserFirstName: string;
  refCODOPhoneNo1: string;
  refCODOEmail: string;
  refPan: string;
}

export interface OtherExpensesModel {
  name: string;
  amount: number;
}

export interface AdminOverallScanIndicatesAnalyticsModel {
  total_appointments: number;
  SFormEdit: number;
  SFormCorrect: number;
  DaFormEdit: number;
  DaFormCorrect: number;
  DbFormEdit: number;
  DbFormCorrect: number;
  DcFormEdit: number;
  DcFormCorrect: number;
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
  refSCCustId?: string;
  refUserCustId?: string;
  refTASformEditquantity: number | null;
  refTASformEditamount: number | null;
  refTASformCorrectquantity: number | null;
  refTASformCorrectamount: number | null;
  refTADaformEditquantity: number | null;
  refTADaformEditamount: number | null;
  refTADaformCorrectquantity: number | null;
  refTADaformCorrectamount: number | null;
  refTADbformEditquantity: number | null;
  refTADbformEditamount: number | null;
  refTADbformCorrectquantity: number | null;
  refTADbformCorrectamount: number | null;
  refTADcformEditquantity: number | null;
  refTADcformEditamount: number | null;
  refTADcformCorrectquantity: number | null;
  refTADcformCorrectamount: number | null;
  refTADScribeTotalcasequantity: number | null;
  refTADScribeTotalcaseamount: number | null;
  otherExpensiveName: string;
  otherAmount: number | null;
  refScanCenterTotalCase: number | null;
  refScancentercaseAmount: number | null;
  total: number;
}

export interface InvoiceHistoryInvoice {
  refIHId: number;
  refSCId?: number | null;
  refUserId?: number | null;
  refRTId?: number | null;
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
  refSCCustId?: string;
  refUserCustId?: string;
  refIHSformEditquantity: number | null;
  refIHSformEditamount: number | null;
  refIHSformCorrectquantity: number | null;
  refIHSformCorrectamount: number | null;
  refIHDaformEditquantity: number | null;
  refIHDaformEditamount: number | null;
  refIHDaformCorrectquantity: number | null;
  refIHDaformCorrectamount: number | null;
  refIHDbformEditquantity: number | null;
  refIHDbformEditamount: number | null;
  refIHDbformCorrectquantity: number | null;
  refIHDbformCorrectamount: number | null;
  refIHDcformEditquantity: number | null;
  refIHDcformEditamount: number | null;
  refIHDcformCorrectquantity: number | null;
  refIHDcformCorrectamount: number | null;
  refIHScribeTotalcasequantity: number | null;
  refIHScribeTotalcaseamount: number | null;
  refIHOtherExpensiveName: string;
  refIHOtherAmount: number | null;
  refIHScanCenterTotalCase: number | null;
  refIHScancentercaseAmount: number | null;
  total: number;
  otherExpenses: OtherExpensesModel[];
  refIHSignature: string;
}

export interface InvoiceInput {
  refSCId: number;
  refUserId: number;
  fromId: number;
  fromName: string;
  fromPhone: string;
  fromEmail: string;
  fromPan: string;
  fromGst: string;
  fromAddress: string;
  toId: number;
  toName: string;
  toAddress: string;
  billingfrom: string;
  billingto: string;
  modeofpayment: string;
  upiId: string;
  accountHolderName: string;
  accountNumber: string;
  bank: string;
  branch: string;
  ifsc: string;
  refTASformEditquantity: number | null;
  refTASformEditamount: number | null;
  refTASformCorrectquantity: number | null;
  refTASformCorrectamount: number | null;
  refTADaformEditquantity: number | null;
  refTADaformEditamount: number | null;
  refTADaformCorrectquantity: number | null;
  refTADaformCorrectamount: number | null;
  refTADbformEditquantity: number | null;
  refTADbformEditamount: number | null;
  refTADbformCorrectquantity: number | null;
  refTADbformCorrectamount: number | null;
  refTADcformEditquantity: number | null;
  refTADcformEditamount: number | null;
  refTADcformCorrectquantity: number | null;
  refTADcformCorrectamount: number | null;
  refTADScribeTotalcasequantity: number | null;
  refTADScribeTotalcaseamount: number | null;
  otherExpensiveName: string;
  otherAmount: number | null;
  refScanCenterTotalCase: number | null;
  refScancentercaseAmount: number | null;
  total: number;
  signature: string;
}

export interface TakenDate {
  refIHFromDate: string; // e.g., "2025-01-01"
}

export interface AmountModel {
  refTASformEdit: string;
  refTASformCorrect: string;
  refTADaformEdit: string;
  refTADaformCorrect: string;
  refTADbformEdit: string;
  refTADbformCorrect: string;
  refTADcformEdit: string;
  refTADcformCorrect: string;
  refTADScribeTotalcase: string;
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
      AmountModel: AmountModel[];
      scancenterData: scancenterData[];
      userData: userData[];
    } = decrypt(res.data.data, res.data.token);
    tokenService.setToken(res.data.token);
    return decryptedData;
  },

  updateAmount: async (AmountModel: AmountModel) => {
    const token = localStorage.getItem("token");
    const payload = encrypt(
      {
        refTASformEdit: AmountModel.refTASformEdit,
        refTASformCorrect: AmountModel.refTASformCorrect,
        refTADaformEdit: AmountModel.refTADaformEdit,
        refTADaformCorrect: AmountModel.refTADaformCorrect,
        refTADbformEdit: AmountModel.refTADbformEdit,
        refTADbformCorrect: AmountModel.refTADbformCorrect,
        refTADcformEdit: AmountModel.refTADcformEdit,
        refTADcformCorrect: AmountModel.refTADcformCorrect,
        refTADScribeTotalcase: AmountModel.refTADScribeTotalcase,
      },
      token
    );
    console.log(
      "invoiceService.ts / AmountModel / 110 -------------------  ",
      AmountModel
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
      ScancenterData: scancenterData[];
      ScanCenterCount: GetCountScanCenterMonthModel[];
      UserData: GetUserModel[];
      UserCount: AdminOverallScanIndicatesAnalyticsModel[];
      refTADScribeTotalcase: string;
      refTADaformCorrect: string;
      refTADaformEdit: string;
      refTADbformCorrect: string;
      refTADbformEdit: string;
      refTADcformCorrect: string;
      refTADcformEdit: string;
      refTASformCorrect: string;
      refTASformEdit: string;
    } = decrypt(res.data.data, res.data.token);
    tokenService.setToken(res.data.token);
    return decryptedData;
  },

  generateInvoice: async (
    formData: any,
    otherExpenses: OtherExpensesModel[]
  ) => {
    const token = localStorage.getItem("token");
    const combinedData = {
      ...formData,
      otherExpenses: otherExpenses, // include the full array
    };

    // ✅ Encrypt the combined data
    const payload = encrypt(combinedData, token);
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
      invoiceHistory: InvoiceHistoryInvoice[];
      invoiceHistoryTakenDate: TakenDate[];
    } = decrypt(res.data.data, res.data.token);
    tokenService.setToken(res.data.token);
    return decryptedData;
  },

  getOverallInvoiceHistory: async () => {
    const token = localStorage.getItem("token");
    const payload = encrypt({ fromDate: "", toDate: "" }, token);
    const res = await axios.post(
      `${
        import.meta.env.VITE_API_URL_USERSERVICE
      }/invoice/getOverallInvoiceHistory`,
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
      invoiceHistory: InvoiceHistoryInvoice[];
      invoiceHistoryTakenDate: TakenDate[];
    } = decrypt(res.data.data, res.data.token);
    tokenService.setToken(res.data.token);
    return decryptedData;
  },
};
