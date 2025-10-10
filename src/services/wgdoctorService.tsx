import { decrypt, encrypt } from "@/Helper";
import { tokenService } from "@/lib/tokenService";
import { UploadFile } from "./commonServices";
import { MedicalLicenseSecurity } from "./doctorService";
import axios from "axios";

export interface NewWGPerformingProvider {
  firstname: string;
  lastname: string;
  profile_img: string;
  dob: string;
  phoneCountryCode: string;
  phone: string;
  email: string;
  mbbs_register_number: string;
  md_register_number: string;
  specialization: string;
  pan: string;
  aadhar: string;
  // experience: Experience[];
  drivers_license: string;
  medical_license_security: MedicalLicenseSecurity[];
  malpracticeinsureance_files: UploadFile[];
  cv_files: UploadFile[];
  license_files: UploadFile[];
  digital_signature: string;
}

export const wgDoctorService = {
  createNewWgPerformingProvider: async (formData: NewWGPerformingProvider) => {
    const token = localStorage.getItem("token");
    const payload = encrypt(formData, token);
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL_USERSERVICE}/wellgreenperformingprovider/new`,
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
    console.log(decryptedData);
    return decryptedData;
  },
};
