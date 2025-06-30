import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import scancenterImg from "../../assets/Administration/Manage Scan Center.png";
import scribeImg from "../../assets/Administration/Manage Scribe.png";
import radiologistImg from "../../assets/Administration/Manage Radiologist.png";
import weelthGreenImg from "../../assets/Administration/Manage Weelth Green Manager.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Routes/AuthContext";

interface AdminCardProps {
  title: string;
  icon: React.ReactNode;
  bgColor?: string;
  onClick?: () => void;
}

const AdminCard: React.FC<AdminCardProps> = ({
  title,
  icon,
  bgColor,
  onClick,
}) => {
  return (
    <Card
      className={cn(
        "w-50 h-50 rounded-4xl shadow-xl border-2 border-white cursor-pointer hover:shadow-2xl",
        bgColor || "bg-[#E3E9E5]"
      )}
      onClick={onClick}
    >
      <CardContent className="flex flex-col justify-center items-center text-center h-full space-y-2">
        <div className="w-20 h-20">{icon}</div>
        <div className="text-base font-bold">{title}</div>
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
          <h2 className="text-xl font-extrabold mb-4 text-center">
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
              />
            )}

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
            />
            <AdminCard
              title="Manage Scribe"
              icon={
                <img src={scribeImg} alt="Scribe" className="w-full h-full" />
              }
              bgColor="bg-[#c3c8bc]"
              onClick={() => navigate(`/${role?.type}/manageScribe`)}
            />
          </div>
        </div>

        {/* Scan Centre Administration */}
        {role?.type == "admin" && (
        <div
          style={{
            background:
              "radial-gradient(100.97% 186.01% at 50.94% 50%, #F9F4EC 25.14%, #EED8D6 100%)",
          }}
          className="rounded-xl shadow-lg p-2 lg:p-6 w-full lg:w-1/2"
        >
          <h2 className="text-xl font-extrabold mb-4 text-center">
            SCAN CENTRE ADMINISTRATION
          </h2>
          <div className="flex justify-center">
            <AdminCard
              title="Manage Scan centre"
              icon={
                <img
                  src={scancenterImg}
                  alt="Scan centre"
                  className="w-full h-full"
                />
              }
              bgColor="bg-[#F4D9D9]"
              onClick={() => navigate(`/${role?.type}/manageScanCenter`)}
            />
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default Administration;
