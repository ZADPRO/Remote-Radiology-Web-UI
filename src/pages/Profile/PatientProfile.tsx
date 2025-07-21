import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label"; // Fixed import
import { useAuth } from "../Routes/AuthContext";

export interface ListSpecificUser {
  refRTId: number;
  refUserCustId: string;
  refUserFirstName: string;
  refUserLastName: string;
  refUserId: number;
  refUserStatus: boolean;
  refCODOEmail: string;
  refCODOPhoneNo1: string;
}

const PatientProfile: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<ListSpecificUser>({
    refRTId: 0,
    refUserCustId: "",
    refUserFirstName: "",
    refUserLastName: "",
    refUserId: 0,
    refUserStatus: true,
    refCODOEmail: "",
    refCODOPhoneNo1: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        refRTId: user.refRTId || 0,
        refUserCustId: user.refUserCustId || "",
        refUserFirstName: user.refUserFirstName || "",
        refUserLastName: user.refUserLastName || "",
        refUserId: user.refUserId || 0,
        refUserStatus: true,
        refCODOEmail: user.refCODOEmail || "",
        refCODOPhoneNo1: user.refCODOPhoneNo1 || "",
      });
    }
  }, [user]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Profile Header Section */}
      <div className="w-ful rounded-xl mb-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
          Profile Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {/* Radiologist ID */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-gray-700">User ID</Label>
            <Input
              id="radiologist-id"
              type="text"
              className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              value={formData.refUserCustId || "N/A"}
              readOnly
            />
          </div>

          {/* Status */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-gray-700">Status</Label>
            <Select disabled value={String(formData.refUserStatus)}>
              <SelectTrigger className="bg-white border-gray-200">
                <SelectValue placeholder="N/A" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Personal Details Section */}
      <div className="w-full">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
          Personal Details
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Full Name */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-gray-700">
                Full Name
              </Label>
              <Input
                id="full-name"
                type="text"
                placeholder="N/A"
                className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                value={
                  formData.refUserFirstName && formData.refUserLastName
                    ? `${formData.refUserFirstName} ${formData.refUserLastName}`
                    : formData.refUserFirstName || "N/A"
                }
                readOnly
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-gray-700">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="N/A"
                className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                value={formData.refCODOEmail || "N/A"}
                readOnly
              />
            </div>
          </div>

          {/* Right Column - You can add more fields here */}
          <div className="space-y-6">
            {/* RT ID */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm" htmlFor="phone-display">
                Contact Number
              </Label>
              <div className="flex gap-2 relative">
                <Input
                  id="phone-display"
                  type="text"
                  placeholder="N/A"
                  className="bg-white flex-1"
                  value={formData.refCODOPhoneNo1 || ""}
                  readOnly
                />
              </div>
            </div>

            {/* Placeholder for additional fields */}
            {/* <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-gray-700">
                Department
              </Label>
              <Input
                id="department"
                type="text"
                placeholder="N/A"
                className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                value="Radiology" // You can add this to your interface if needed
                readOnly
              />
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
