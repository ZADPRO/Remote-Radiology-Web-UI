import { DialogContent, DialogHeader } from "@/components/ui/dialog";
import React from "react";
import logoNew from "../../assets/LogoNew.png";
import Brochure from "./Brochure";
import GeneralGuidelines from "./GeneralGuidelines";
import Disclaimer from "./Disclaimer";

const PatientInformation: React.FC = () => {
  return (
    <DialogContent
      style={{
        background:
          "radial-gradient(100.97% 186.01% at 50.94% 50%, #F9F4EC 25.14%, #EED8D6 100%)",
      }}
      className="h-11/12 w-[90vw] lg:w-[70vw] overflow-y-auto p-0"
    >
      <DialogHeader className="bg-[#eac9c5] border-1 border-b-gray-400 flex flex-col lg:flex-row items-center justify-between px-4 py-2">
        {/* Logo (Left) */}
        <div className="h-12 w-24 sm:h-14 sm:w-28 flex-shrink-0">
          <img
            src={logoNew}
            alt="logo"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Centered Content */}
        <div className="flex-1 text-center">
          <h2 className="text-2xl font-semibold">Brochure</h2>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            EaseQT Platform
          </p>
        </div>

        {/* Spacer to balance logo width */}
        <div className="hidden lg:inline h-12 w-24 sm:h-14 sm:w-28 flex-shrink-0" />
      </DialogHeader>
      <Brochure />
      <h2 className="text-2xl text-center my-3 font-semibold">
        General Guidelines
      </h2>
      <GeneralGuidelines />
      <h2 className="text-2xl text-center my-3 font-semibold">Disclaimer</h2>
      <Disclaimer />
    </DialogContent>
  );
};

export default PatientInformation;
