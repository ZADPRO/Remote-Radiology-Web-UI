import { decrypt, encrypt } from "@/Helper";
import { tokenService } from "@/lib/tokenService";
import axios from "axios";

export interface DailyListResponse {
  AppointmentDate: string;
  refUserCustId: string;
  refUserFirstName: string;
  refCategoryId: string;
  scanSide: string;
  handlerName: string;
  refAppointmentImpression: string;
  refAppointmentRecommendation: string;
  refAppointmentImpressionRight: string;
  refAppointmentRecommendationRight: string;
}

export const dailyListService = {
  GetDailyList: async (fromDate: string, toDate: string) => {
    
console.log('dailylistService.tsx -------------------------- >  20  ', fromDate, toDate);
    const token = localStorage.getItem("token");
    const payload = encrypt({ fromDate: fromDate, toDate: toDate }, token);
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL_USERSERVICE}/dailyList/`,
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
      data: DailyListResponse[];
    } = decrypt(res.data.data, res.data.token);
    console.log(decryptedData);
    tokenService.setToken(res.data.token);
    return decryptedData;
  },
};
