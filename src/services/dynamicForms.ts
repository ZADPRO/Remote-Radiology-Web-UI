import { decrypt, encrypt } from "@/Helper";
import { tokenService } from "@/lib/tokenService";
import axios from "axios";

export const dynamicBrochure = {
  listBrochure: async (scancenterId: number) => {
    const token = localStorage.getItem("token");
    const payload = encrypt({ scancenterId }, token);
    const res = await axios.post(
      `${
        import.meta.env.VITE_API_URL_PROFILESERVICE
      }/wellgreenforms/patientBrochure/list`,
      { encryptedData: payload },
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
    const decryptedData:{
        SCBrochureAccessStatus: boolean,
        SCPatientBrochure: string,
        WGPatientBrochure: string,
        status: boolean
    } = decrypt(res.data.data, res.data.token);
    tokenService.setToken(res.data.token);
    return decryptedData;
  },

  updateBrochure: async (
    data: string,
    scancenterId: number,
    accessStatus: boolean
  ) => {
    const token = localStorage.getItem("token");
    console.log({ data, scancenterId, accessStatus });
    const payload = encrypt({ data, scancenterId, accessStatus }, token);
    const res = await axios.patch(
      `${
        import.meta.env.VITE_API_URL_PROFILESERVICE
      }/wellgreenforms/patientBrochure/update`,
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
};

export const dynamicConsents = {
    listConsent: async (scancenterId: number) => {
    const token = localStorage.getItem("token");

    const payload = encrypt({ scancenterId }, token);
    const res = await axios.post(
      `${
        import.meta.env.VITE_API_URL_PROFILESERVICE
      }/wellgreenforms/patientconsent/list`,
      { encryptedData: payload },
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
    const decryptedData:{
        SCBrochureAccessStatus: boolean,
        SCPatientBrochure: string,
        WGPatientBrochure: string,
        status: boolean
    } = decrypt(res.data.data, res.data.token);
    tokenService.setToken(res.data.token);
    return decryptedData;
  },

  updateConsent: async (
    data: string,
    scancenterId: number,
    accessStatus: boolean
  ) => {
    const token = localStorage.getItem("token");
    console.log({ data, scancenterId, accessStatus });
    const payload = encrypt({ data, scancenterId, accessStatus }, token);
    const res = await axios.patch(
      `${
        import.meta.env.VITE_API_URL_PROFILESERVICE
      }/wellgreenforms/patientconsent/update`,
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
}

export const dynamicTechGuidelines = {
    listTechGuidelines: async (scancenterId: number) => {
    const token = localStorage.getItem("token");

    const payload = encrypt({ scancenterId }, token);
    const res = await axios.post(
      `${
        import.meta.env.VITE_API_URL_PROFILESERVICE
      }/wellgreenforms/trainingmaterialguide/list`,
      { encryptedData: payload },
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
    const decryptedData:{
        SCBrochureAccessStatus: boolean,
        SCPatientBrochure: string,
        WGPatientBrochure: string,
        status: boolean
    } = decrypt(res.data.data, res.data.token);
    tokenService.setToken(res.data.token);
    return decryptedData;
  },

  updateTechGuidelines: async (
    data: string,
    scancenterId: number,
    accessStatus: boolean
  ) => {
    const token = localStorage.getItem("token");
    console.log({ data, scancenterId, accessStatus });
    const payload = encrypt({ data, scancenterId, accessStatus }, token);
    const res = await axios.patch(
      `${
        import.meta.env.VITE_API_URL_PROFILESERVICE
      }/wellgreenforms/trainingmaterialguide/update`,
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
}

export const dynamicTechConsent = {
    listTechConsent: async (scancenterId: number) => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("resetToken");
      console.log(scancenterId)
    const payload = encrypt({ scancenterId }, token);
    const res = await axios.post(
      `${
        import.meta.env.VITE_API_URL_PROFILESERVICE
      }/wellgreenforms/technicianconsent/list`,
      { encryptedData: payload },
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
    const decryptedData:{
        SCBrochureAccessStatus: boolean,
        SCPatientBrochure: string,
        WGPatientBrochure: string,
        status: boolean
    } = decrypt(res.data.data, res.data.token);
    tokenService.setToken(res.data.token);
    return decryptedData;
  },

  updateTechConsent: async (
    data: string,
    scancenterId: number,
    accessStatus: boolean
  ) => {
    const token = localStorage.getItem("token");
    console.log({ data, scancenterId, accessStatus });
    const payload = encrypt({ data, scancenterId, accessStatus }, token);
    const res = await axios.patch(
      `${
        import.meta.env.VITE_API_URL_PROFILESERVICE
      }/wellgreenforms/technicianconsent/update`,
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
}