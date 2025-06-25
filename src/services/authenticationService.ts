import { decrypt, encrypt } from "@/Helper";
import axios from "axios";

const token = localStorage.getItem("token");

export const authenticationService = {
  loginAuth: async (formdata: any) => {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL_AUTH}/authentication/login`,
      formdata
    );
    console.log(res);
    return res;
  },

  loginVerify: async (formdata: any) => {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL_AUTH}/authentication/verifyotp`,
      formdata
    );
    console.log(res);
    return res;
  },

  resetPassword: async (formdata: any) => {
    const payload = encrypt(formdata, token);
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL_AUTH}/authentication/changepassword`,
      { encryptedData: payload },
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
    // console.log(res);
    const decryptedData = decrypt(res.data.data, res.data.token);
    localStorage.setItem("token", res.data.token);
    return decryptedData;
  }
};

export const forgotPasswordService = {
  verifyUser: async (formdata: any) => {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL_AUTH}/forgetpassword/verifyuser`,
      formdata
    );
    console.log(res);
    return res;
  },

  verifyOtp: async (formdata: any) => {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL_AUTH}/forgetpassword/verifyotp`,
      formdata
    );
    console.log(res);
    return res;
  },

  resetPassword: async (formdata: any) => {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL_AUTH}/forgetpassword/changepassword`,
      formdata
    );
    console.log(res);
    return res;
  }
}


export const signupService = {
  signup: async (formdata: any) => {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL_AUTH}/patient/register`,
      formdata
    );
    console.log(res);
    return res;
  },

  getOtp: async (formdata: any) => {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL_AUTH}/patient/getOtp`,
      formdata
    );
    console.log(res);
    return res;
  },

  verifyOtp: async (formdata: any) => {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL_AUTH}/patient/verifyOtp`,
      formdata
    );
    console.log(res);
    return res;
  },

}