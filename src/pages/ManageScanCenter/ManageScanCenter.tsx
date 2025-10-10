import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationLink,
} from "@/components/ui/pagination";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LoadingOverlay from "@/components/ui/CustomComponents/loadingOverlay";
import addRadiologist_Bg from "../../assets/Add Admins/Add Radiologist BG.png";
import {
  ListScanCenter,
  scancenterService,
} from "@/services/scancenterService";
import { Plus, ArrowLeft } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "../Routes/AuthContext";

const ITEMS_PER_PAGE = 10;

const ManageScanCenter: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [scanCenters, setScanCenters] = useState<ListScanCenter[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [seletedTab, setSelectedTab] = useState(true); // true = Active, false = Inactive

  const getScanCenters = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await scancenterService.getAllScanCenters();
      if (res.status) {
        setScanCenters(res.data || []);
      } else {
        setError(res.message);
      }
    } catch (error) {
      console.error(error);
      setError("Failed to fetch scan centers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getScanCenters();
  }, []);

  // 🔍 Normalize and filter by status
  const filteredCenters = scanCenters.filter((center) => {
    const status = String(center.refSCStatus).toLowerCase(); // normalize
    if (seletedTab) {
      return status === "active" || status === "1" || status === "true";
    } else {
      return status === "inactive" || status === "0" || status === "false";
    }
  });

  // 🔢 Pagination
  const totalPages = Math.ceil(filteredCenters.length / ITEMS_PER_PAGE);
  const paginatedCenters = filteredCenters.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  console.log("paginatedCenters", paginatedCenters);

  const { role } = useAuth();

  return (
    <div className="w-full">
      {loading && <LoadingOverlay />}

      {/* Header */}
      <div
        className="p-4 flex gap-5 items-center bg-[#A3B1A1] lg:bg-[length:70%_100%] lg:bg-no-repeat lg:bg-right-top"
        style={{
          backgroundImage:
            window.innerWidth >= 1024 ? `url(${addRadiologist_Bg})` : undefined,
        }}
      >
        <ArrowLeft className="cursor-pointer" onClick={() => navigate(-1)} />
        <h1 className="text-[#3F3F3D] uppercase font-[900] text-xl lg:text-2xl text-center lg:text-left tracking-widest">
          Manage Scan Centre
        </h1>
      </div>

      {/* Tabs + Add Button */}
      <div className="flex justify-between px-20 pt-6">
        {(role?.type === "admin" || role?.type === "manager") && (
          <div className="flex gap-2">
            <div
              onClick={() => {
                setSelectedTab(true);
                setCurrentPage(1);
              }}
              className={`text-xs sm:text-sm w-[80px] sm:w-[120px] lg:w-[120px] text-center h-8 font-bold flex justify-center items-center px-1 sm:px-2 rounded-lg cursor-pointer transition-colors ${
                seletedTab
                  ? "bg-[#a3b1a0] text-white"
                  : "bg-[#f6ede7] border-1 border-[#a3b1a0]"
              }`}
            >
              Active
            </div>
            <div
              onClick={() => {
                setSelectedTab(false);
                setCurrentPage(1);
              }}
              className={`text-xs sm:text-sm w-[80px] sm:w-[120px] lg:w-[120px] text-center h-8 font-bold flex justify-center items-center px-1 sm:px-2 rounded-lg cursor-pointer transition-colors ${
                !seletedTab
                  ? "bg-[#a3b1a0] text-white"
                  : "bg-[#f6ede7] border-1 border-[#a3b1a0]"
              }`}
            >
              Inactive
            </div>
          </div>
        )}
        <button
          className="bg-[#A3B1A1] text-white flex items-center gap-2 p-2 cursor-pointer rounded-full hover:bg-[#91a191]"
          onClick={() => navigate("../addScanCenter")}
        >
          <Plus size={40} />
        </button>
      </div>

      {/* Cards Grid */}
      <div className="px-20 py-4">
        {filteredCenters.length === 0 && !loading && !error ? (
          <div className="text-center text-gray-500 text-lg py-10">
            No scan centers found.
          </div>
        ) : (
          <div className="flex flex-wrap gap-10 justify-center">
            {paginatedCenters.map((center) => (
              <Card
                key={center.refSCId}
                className="w-50 px-1 py-2 m-0 gap-2 shadow-md rounded-md"
              >
                {(() => {
                  const isUrl =
                    center.refSCProfile &&
                    /^https?:\/\/[^\s]+$/i.test(center.refSCProfile);

                  if (isUrl) {
                    return (
                      <img
                        src={center.refSCProfile}
                        alt={center.refSCName}
                        className="w-full h-32 object-cover rounded-md"
                      />
                    );
                  } else if (center.profileImgFile?.base64Data) {
                    return (
                      <img
                        src={`data:${center.profileImgFile.contentType};base64,${center.profileImgFile.base64Data}`}
                        alt={center.refSCName}
                        className="w-full h-32 object-cover rounded-md"
                      />
                    );
                  } else {
                    return (
                      <div className="w-full h-32 flex items-center justify-center bg-gray-200 text-gray-500 text-xs rounded-md">
                        No Image Available
                      </div>
                    );
                  }
                })()}

                <CardContent className="text-start px-2 py-2">
                  <p className="font-bold text-sm mt-1 uppercase">
                    {center.refSCName}
                  </p>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p className="text-xs text-gray-400 font-semibold mt-1 line-clamp-2 cursor-pointer">
                          {center.refSCAddress}
                        </p>
                      </TooltipTrigger>
                      <TooltipContent
                        side="left"
                        className="max-w-xs break-words"
                      >
                        {center.refSCAddress}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <Button
                    variant="link"
                    className="p-0 text-sm"
                    onClick={() =>
                      navigate(`../viewScanCenter/${center.refSCId}`)
                    }
                  >
                    VIEW
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {error && <div className="text-center text-red-500">{error}</div>}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="justify-center mt-4 mb-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>

            {Array.from({ length: totalPages }).map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  isActive={currentPage === index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default ManageScanCenter;
