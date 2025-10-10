import React, { useContext } from "react";
// import logo from "../../assets/LogoNew.png";
import { PatientContext } from "./PatientInTakeForm";

interface FormHeaderProps {
  FormTitle: string;
  className?: string;
  name?: string;
  custId?: string;
  scancenterCustId?: string;
  reportview?: boolean;
}

const FormHeader: React.FC<FormHeaderProps> = ({ FormTitle, className }) => {
  const patientDetails = useContext(PatientContext);
  return (
    <div
      className="w-full lg:px-10 justify-between items-center text-2xl font-semibold lg:flex hidden">
      <h1 className={className}>{FormTitle}</h1>
     
      {!patientDetails?.reportview ? (
        <>
      <div className="h-18 bg-[#fff] flex flex-col items-start justify-center w-70 rounded p-3 my-5 text-sm self-end">
          <div className="flex">
            <div className="flex w-[6rem]">Patient Name</div>{" "}
            <div>: {patientDetails?.name}</div>
          </div>
          <div className="capitalize flex">
            <div className="flex w-[6rem]">Patient ID</div>{" "}
            <div>: {patientDetails?.custId}</div>
          </div>
          <div className="capitalize flex">
            <div className="flex w-[6rem]">Scan Center</div>{" "}
            <div>: {patientDetails?.scancenterCustId}</div>
          </div>
        </div>
          {/* <img src={logo} alt="logo" className="w-full h-full object-contain" /> */}
          </>
        ) : (
           <div className="h-18 p-3 my-5"></div>
        )}
        </div>
  );
};

export default FormHeader;
