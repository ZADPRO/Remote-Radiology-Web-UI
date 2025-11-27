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
  type?: string;
}

export interface AdminOverallScanIndicatesAnalyticsModel {
  total_appointments: number;
  SForm: number;
  DaForm: number;
  DbForm: number;
  DcForm: number;
  xForm: number;
  editForm: number;
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
  refIHSFormquantity: number | null;
  refIHSFormamount: number | null;
  refIHDaFormquantity: number | null;
  refIHDaFormamount: number | null;
  refIHDbFormquantity: number | null;
  refIHDbFormamount: number | null;
  refIHDcFormquantity: number | null;
  refIHDcFormamount: number | null;
  refIHxFormquantity: number | null;
  refIHxFormamount: number | null;
  refIHEditquantity: number | null;
  refIHEditFormamount: number | null;
  refIHScribeTotalcasequantity: number | null;
  refIHScribeTotalcaseamount: number | null;
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
  refIHSFormquantity: number | null;
  refIHSFormamount: number | null;
  refIHDaFormquantity: number | null;
  refIHDaFormamount: number | null;
  refIHDbFormquantity: number | null;
  refIHDbFormamount: number | null;
  refIHDcFormquantity: number | null;
  refIHDcFormamount: number | null;
  refIHxFormquantity: number | null;
  refIHxFormamount: number | null;
  refIHEditquantity: number | null;
  refIHEditFormamount: number | null;
  refTADScribeTotalcasequantity: number | null;
  refTADScribeTotalcaseamount: number | null;
  refScanCenterTotalCase: number | null;
  refScancentercaseAmount: number | null;
  total: number;
  signature: string;
}

export interface TakenDate {
  refIHFromDate: string; // e.g., "2025-01-01"
}

export interface AmountModel {
  refTASform: string;
  refTADaform: string;
  refTADbform: string;
  refTADcform: string;
  refTAXform: string;
  refTAEditform: string;
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
        refTASform: AmountModel.refTASform,
        refTADaform: AmountModel.refTADaform,
        refTADbform: AmountModel.refTADbform,
        refTADcform: AmountModel.refTADcform,
        refTAXform: AmountModel.refTAXform,
        refTAEditform: AmountModel.refTAEditform,
        refTADScribeTotalcase: AmountModel.refTADScribeTotalcase,
      },
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
      refTASform: string;
      refTADaform: string;
      refTADbform: string;
      refTADcform: string;
      refTAXform: string;
      refTAEditform: string;
      refTADScribeTotalcase: string;
      ScancenterData: scancenterData[];
      ScanCenterCount: GetCountScanCenterMonthModel[];
      UserData: GetUserModel[];
      UserCount: AdminOverallScanIndicatesAnalyticsModel[];
    } = decrypt(res.data.data, res.data.token);
    tokenService.setToken(res.data.token);
    return decryptedData;
  },

  generateInvoice: async (
    formData: any,
    otherExpenses: OtherExpensesModel[],
    deductibleExpenses: OtherExpensesModel[]
  ) => {
    const n = (x: number | null | undefined) => Number(x || 0);
    const token = localStorage.getItem("token");
    const combinedData = {
      ...formData,
      otherExpenses: otherExpenses,
      deductibleExpenses: deductibleExpenses,
      otherExpensesAmount: otherExpenses.reduce(
        (sum, exp) => sum + n(exp.amount),
        0
      ),
      deductibleExpensesAmount: deductibleExpenses.reduce(
        (sum, exp) => sum + n(exp.amount),
        0
      ),
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
