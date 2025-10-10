import { DialogContent, DialogHeader } from "@/components/ui/dialog";
import React from "react";
import UserConsent from "../Consent/UserConsent";
import logoNew from "../../assets/LogoNew.png";

interface UserConsentProps {
  setEditingDialogOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  viewOnly?: boolean;
  staticType?: string;
  onSubmit?: () => void;
}
const UserConsentWrapper: React.FC<UserConsentProps> = ({
  setEditingDialogOpen,
  viewOnly,
  staticType,
  onSubmit
}) => {
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
          <h2 className="text-2xl font-semibold">User Consent Form</h2>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            Wellthgreen Report Portal Platform
          </p>
        </div>

        {/* Spacer to balance logo width */}
        <div className="hidden lg:inline h-12 w-24 sm:h-14 sm:w-28 flex-shrink-0" />
      </DialogHeader>
      <UserConsent setEditingDialogOpen={setEditingDialogOpen} viewOnly={viewOnly} staticType={staticType} onSubmit={onSubmit}/>
    </DialogContent>
  );
};

export default UserConsentWrapper;
