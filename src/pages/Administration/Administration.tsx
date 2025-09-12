import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import wgPPImg from "../../assets/Administration/Manage WGPP.png";
import scribeImg from "../../assets/Administration/Manage Scribe.png";
import radiologistImg from "../../assets/Administration/Manage Radiologist.png";
import weelthGreenImg from "../../assets/Administration/Manage Weelth Green Manager.png";
import scanCenterImg from "../../assets/Administration/Manage Scan Center.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Routes/AuthContext";

interface AdminCardProps {
  title: string;
  icon: React.ReactNode;
  bgColor?: string;
  onClick?: () => void;
  textWidth?: string;
}

const AdminCard: React.FC<AdminCardProps> = ({
  title,
  icon,
  bgColor,
  onClick,
  textWidth
}) => {
  return (
    <Card
      className={cn(
        "w-48 h-48 2xl:w-64 2xl:h-64 rounded-[2rem] shadow-xl border border-white cursor-pointer hover:shadow-2xl hover:scale-105 transition-transform duration-200 ease-in-out",
        bgColor || "bg-[#E3E9E5]"
      )}
      onClick={onClick}
    >
      <CardContent className="flex flex-col justify-center items-center w-full h-full space-y-3 px-4">
        <div className="w-16 h-16 xl:w-20 xl:h-20">{icon}</div>
        <div className={`text-xs xl:text-sm 2xl:text-base font-semibold text-[#3f3f3f] text-center leading-tight ${textWidth}`}>
          {title}
        </div>
      </CardContent>
    </Card>
  );
};

const Administration: React.FC = () => {
  const navigate = useNavigate();
  const { role } = useAuth();

  return (
    <div className="p-4 lg:p-8 flex justify-center items-start gap-6">
      <div className="flex flex-col justify-center lg:flex-row w-full max-w-7xl gap-6">
        {/* Wellthgreen Administration */}
        <div
          style={{
            background:
              "radial-gradient(100.97% 186.01% at 50.94% 50%, #F9F4EC 25.14%, #EED8D6 100%)",
          }}
          className="rounded-xl shadow-lg p-2 lg:p-6 w-full lg:w-1/2"
        >
          <h2 className="text-xl 2xl:text-2xl font-extrabold mb-4 text-center">
            WELLTHGREEN ADMINISTRATION
          </h2>
          <div className="flex flex-wrap gap-4 justify-center">
            {role?.type == "admin" && (
              <AdminCard
                title="Manage Wellthgreen Manager"
                icon={
                  <img
                    src={weelthGreenImg}
                    alt="Wellthgreen Manager"
                    className="w-full h-full"
                  />
                }
                bgColor="bg-[#c3c8bc]"
                onClick={() =>
                  navigate(`/${role?.type}/manageWellthGreenManager`)
                }
                textWidth="w-full"
              />
            )}
            <AdminCard
              title="Manage Wellthgreen Performing Provider"
              icon={
                <img src={wgPPImg} alt="WGP Performing Provider" className="w-full h-full" />
              }
              bgColor="bg-[#c3c8bc]"
              onClick={() => navigate(`/${role?.type}/manageWgDoctor`)}
              textWidth="w-full"
            />

            <AdminCard
              title="Manage Radiologist"
              icon={
                <img
                  src={radiologistImg}
                  alt="Radiologist"
                  className="w-full h-full"
                />
              }
              bgColor="bg-[#c3c8bc]"
              onClick={() => navigate(`/${role?.type}/manageRadiologist`)}
              textWidth="w-1/2"
            />
            <AdminCard
              title="Manage Scribe"
              icon={
                <img src={scribeImg} alt="Scribe" className="w-full h-full" />
              }
              bgColor="bg-[#c3c8bc]"
              onClick={() => navigate(`/${role?.type}/manageScribe`)}
              textWidth="w-1/2"
            />
          </div>
        </div>

        {/* Scan Centre Administration */}
        {(role?.type == "admin") && (
        <div
          style={{
            background:
              "radial-gradient(100.97% 186.01% at 50.94% 50%, #F9F4EC 25.14%, #EED8D6 100%)",
          }}
          className="rounded-xl shadow-lg p-2 lg:p-6 w-full lg:w-1/2"
        >
          <h2 className="text-xl 2xl:text-2xl font-extrabold mb-4 text-center">
            SCAN CENTRE ADMINISTRATION
          </h2>
          <div className="flex justify-center">
            <AdminCard
              title="Manage Scan Centre"
              icon={
                <img
                  src={scanCenterImg}
                  alt="Scan centre"
                  className="w-full h-full"
                />
              }
              bgColor="bg-[#F4D9D9]"
              onClick={() => navigate(`/${role?.type}/manageScanCenter`)}
              textWidth="w-2/3"
            />
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default Administration;
