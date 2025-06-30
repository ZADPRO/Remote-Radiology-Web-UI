import { decrypt, encrypt } from "@/Helper";
import axios from "axios";

const token = localStorage.getItem("token");

export interface NewReceptionist {
  firstname: string;
  lastname: string;
  password: string;
  profile_img: string;
  dob: string;
  gender: string;
  phoneCountryCode: string;
  phone: string;
  email: string;
  emergency_phoneCountryCode: string;
  emergency_phone: string;
  door_no: string,
  street: string,
  city: string;
  state: string;
  country: string;
  code: string;
  designation: string;
  specialization: string;
  experience: Experience[];
  roleId: number;
  technicianMaps: TechnicianMap[];
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

export const receptionistService = {
  createNewReceptionist: async ( formData: NewReceptionist ): Promise<{ status: boolean; message: string }> => {

    const payload = encrypt(formData, token);
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL_USERSERVICE}/receptionist/new`,
      { encryptedData: payload },
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
    const decryptedData = decrypt(res.data.data, res.data.token);
    localStorage.setItem("token", res.data.token);
    return decryptedData;
  },
};