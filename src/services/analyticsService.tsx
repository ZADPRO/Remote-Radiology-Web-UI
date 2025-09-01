import { decrypt, encrypt } from "@/Helper";
import { tokenService } from "@/lib/tokenService";
import axios from "axios";
import { ListScanCenter } from "./scancenterService";

export interface UserList {
  refUserCustId: string;
  refUserId: number;
  refRTId: number;
}

export interface AppointmentCases {
  month: string;
  month_name: string;
  total_appointments: number;
}

export interface ListScanAppointmentCount {
  refSCId: string;
  refSCName: string;
  total_appointments: number;
}

export interface IntakeFormAnalytics {
  DaForm: number;
  DbForm: number;
  DcForm: number;
  SForm: number;
  total_appointments: number;
}

export interface UserAccessTiming {
  total_hours: number;
  total_minutes: number;
}

export interface ImpressionModel {
  impression: string;
  count: number;
}

export interface TotalCorrectEdit {
  totalCorrect: number;
  totalEdit: number;
}

export interface TATStats {
  gt_10_days: number;
  le_1_day: number;
  le_3_days: number;
  le_7_days: number;
  le_10_days: number;
}

export interface TotalArtifacts {
  bothartifacts: number;
  leftartifacts: number;
  rightartifacts: number;
}

export interface OverAllAnalytics {
  refUserCustId: string;
  refUserId: number;
  reportartificatsleft: number;
  reportartificatsright: number;
  techartificatsleft: number;
  techartificatsright: number;
  totalcase: number;
  totaldaform: number;
  totaldbform: number;
  totaldcform: number;
  totalreportcorrect: number;
  totalreportedit: number;
  totalsform: number;
  totaltiming: number; // or float, but in TS just use number
}

export interface OverAllScanCenterAnalytics {
  refSCId: number;
  refSCCustId: string;
  reportartificatsleft: number;
  reportartificatsright: number;
  techartificatsleft: number;
  techartificatsright: number;
  totalcase: number;
  totaldaform: number;
  totaldbform: number;
  totaldcform: number;
}

export const analyticsService = {
  overallScanCenter: async (
    SCId: number,
    startDate: string,
    endDate: string
  ) => {
    const token = localStorage.getItem("token");
    const payload = encrypt(
      { SCId, startDate: startDate, endDate: endDate },
      token
    );
    const res = await axios.post(
      `${
        import.meta.env.VITE_API_URL_USERSERVICE
      }/analaytics/admin/overallonescancenter`,
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
      AdminOverallAnalaytics: AppointmentCases[];
      AdminOverallScanIndicatesAnalaytics: IntakeFormAnalytics[];
      UserListIds: UserList[];
      AllScaCenter: ListScanCenter[];
      ImpressionModel: ImpressionModel[];
      ReportArtificate: TotalArtifacts[];
      TechArtificate: TotalArtifacts[];
      OverAllAnalytics: OverAllScanCenterAnalytics[];
    } = decrypt(res.data.data, res.data.token);
    console.log(decryptedData);
    tokenService.setToken(res.data.token);
    return decryptedData;
  },

  analyticsPerUser: async (
    userId: number,
    roleId: number,
    startDate: string,
    endDate: string
  ) => {
    const token = localStorage.getItem("token");

    const payload = encrypt(
      { userId, roleId, startDate: startDate, endDate: endDate },
      token
    );

    console.log(userId, roleId, startDate, endDate);

    const res = await axios.post(
      `${import.meta.env.VITE_API_URL_USERSERVICE}/analaytics/oneuser`,
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
      AdminOverallAnalaytics: AppointmentCases[];
      AdminOverallScanIndicatesAnalaytics: IntakeFormAnalytics[];
      ListScanAppointmentCount: ListScanAppointmentCount[];
      UserAccessTiming: UserAccessTiming[];
      DurationBucketModel: TATStats[];
      ImpressionModel: ImpressionModel[];
      TotalCorrectEdit: TotalCorrectEdit[];
      ReportArtificate: TotalArtifacts[];
      TechArtificate: TotalArtifacts[];
      OverAllAnalytics: OverAllAnalytics[];
    } = decrypt(res.data.data, res.data.token);
    tokenService.setToken(res.data.token);
    return decryptedData;
  },
};
