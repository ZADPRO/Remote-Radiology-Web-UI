import { decrypt, encrypt } from "@/Helper";
import { tokenService } from "@/lib/tokenService";
import axios from "axios";

export interface GetAllCategoryData {
  refIRCId: number;
  refIRCName: string;
  refIRCColor: string;
}

export interface GetImpressionRecommendationData {
  status: boolean;
  categoryData: GetAllCategoryData[];
  ImpressionRecommendation: ImpressionRecommendationValModel[];
}

export interface AddImpressionRecommendationResponse {
  status: boolean;
  message: string;
}

export interface ImpressionRecommendationFormData {
  categoryId: string;
  systemType: string;
  impressionRecommendationId: string;
  impressionTextColor: string;
  recommedationTextColor: string;
  impressionShortDescription: string;
  recommendationShortDescription: string;
  impressionLongDescription: string;
  recommendationLongDescription: string;
}

export interface EditImpressionRecommendationFormData {
  id: number;
  categoryId: number;
  systemType: string;
  impressionRecommendationId: string;
  impressionTextColor: string;
  recommedationTextColor: string;
  impressionShortDescription: string;
  recommendationShortDescription: string;
  impressionLongDescription: string;
  recommendationLongDescription: string;
}

export interface ImpressionRecommendationValModel {
  refIRVId: number;
  refIRCId: number;
  refIRVOrderId: number;
  refIRVSystemType: string;
  refIRVCustId: string;
  refIRVImpressionShortDesc: string;
  refIRVImpressionLongDesc: string;
  refIRVImpressionTextColor: string;
  refIRVRecommendationShortDesc: string;
  refIRVRecommendationLongDesc: string;
  refIRVRecommendationTextColor: string;
  refIRCName: string;
  refIRCColor: string;
}

export const impressionrecommendationService = {
  GetAllCategoryData: async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL_USERSERVICE}/impressionrecommendation/`,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
    const decryptedData: GetImpressionRecommendationData = decrypt(
      res.data.data,
      res.data.token
    );
    tokenService.setToken(res.data.token);
    return decryptedData;
  },

  AddImpressionRecommendation: async (
    formData: ImpressionRecommendationFormData
  ) => {
    const token = localStorage.getItem("token");
    const payload = encrypt(
      {
        ...formData,
        categoryId: parseInt(formData.categoryId),
      },
      token
    );
    const res = await axios.post(
      `${
        import.meta.env.VITE_API_URL_USERSERVICE
      }/impressionrecommendation/add`,
      { encryptedData: payload },
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
    const decryptedData: AddImpressionRecommendationResponse = decrypt(
      res.data.data,
      res.data.token
    );
    tokenService.setToken(res.data.token);
    return decryptedData;
  },

  UpdateImpressionRecommendation: async (
    formData: EditImpressionRecommendationFormData
  ) => {
    const token = localStorage.getItem("token");
    const payload = encrypt(
      {
        ...formData,
        categoryId: formData.categoryId,
      },
      token
    );
    const res = await axios.post(
      `${
        import.meta.env.VITE_API_URL_USERSERVICE
      }/impressionrecommendation/update`,
      { encryptedData: payload },
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
    const decryptedData: AddImpressionRecommendationResponse = decrypt(
      res.data.data,
      res.data.token
    );
    tokenService.setToken(res.data.token);
    return decryptedData;
  },

  DeleteImpressionRecommendation: async (
    formData: EditImpressionRecommendationFormData
  ) => {
    const token = localStorage.getItem("token");
    const payload = encrypt(
      {
        ...formData,
        categoryId: formData.categoryId,
      },
      token
    );
    const res = await axios.post(
      `${
        import.meta.env.VITE_API_URL_USERSERVICE
      }/impressionrecommendation/delete`,
      { encryptedData: payload },
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
    const decryptedData: AddImpressionRecommendationResponse = decrypt(
      res.data.data,
      res.data.token
    );
    tokenService.setToken(res.data.token);
    return decryptedData;
  },

  UpdateOrder: async (data: any) => {
    const token = localStorage.getItem("token");
    const payload = encrypt(
      {
        orderData: data,
      },
      token
    );
    const res = await axios.post(
      `${
        import.meta.env.VITE_API_URL_USERSERVICE
      }/impressionrecommendation/updateorder`,
      { encryptedData: payload },
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
    const decryptedData: AddImpressionRecommendationResponse = decrypt(
      res.data.data,
      res.data.token
    );
    tokenService.setToken(res.data.token);
    return decryptedData;
  },
};
