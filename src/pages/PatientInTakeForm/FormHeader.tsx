import React from "react";
import logo from "../../assets/LogoNew.png";
import { cn } from "@/lib/utils";

interface FormHeaderProps {
  FormTitle: string;
  className?: string;
}

const FormHeader: React.FC<FormHeaderProps> = ({ FormTitle, className }) => {
  return (
    <div
      className={cn("w-full p-5 lg:px-10 justify-between items-center text-2xl font-semibold lg:flex hidden", className)}
    >
      <h1>{FormTitle}</h1>
      <div className="h-28 w-48 mb-4 self-end">
        <img src={logo} alt="logo" className="w-full h-full object-contain" />
      </div>
    </div>
  );
};

export default FormHeader;
