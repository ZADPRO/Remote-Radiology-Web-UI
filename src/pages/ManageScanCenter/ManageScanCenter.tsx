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
import { ListScanCenter, scancenterService } from "@/services/scancenterService";
import { Plus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// // 🧪 Sample data (18 mock scan centers)
// const sampleScanCenters: ListScanCenter[] = Array.from({ length: 18 }).map(
//   (_, index) => ({
//     profileImgFile: null,
//     refSCAddress: "123 Health Street",
//     refSCAppointments: true,
//     refSCCustId: `CUST${index}`,
//     refSCEmail: `scancenter${index}@mail.com`,
//     refSCId: index,
//     refSCName: `Sample Scan Centre ${index + 1}`,
//     refSCPhoneNo1: "9876543210",
//     refSCPhoneNo1CountryCode: "+91",
//     refSCPhoneNo2: "",
//     refSCProfile: "",
//     refSCWebsite: "www.example.com",
//   })
// );

const ITEMS_PER_PAGE = 10;

const ManageScanCenter: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [scanCenters, setScanCenters] = useState<ListScanCenter[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null); // State for error messages

  // useEffect(() => {
  //   // Simulate API call
  //   setTimeout(() => {
  //     setScanCenters(sampleScanCenters);
  //     setLoading(false);
  //   }, 1000);
  // }, []);
  
  const totalPages = Math.ceil(scanCenters.length / ITEMS_PER_PAGE);
  const paginatedCenters = scanCenters.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getScanCenters = async () => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      const res = await scancenterService.getAllScanCenters();
      console.log(res);
      if (res.status) {
        // Ensure that scanCenters is always an array to prevent crashes.
        // If res.data is null or undefined, it will default to an empty array.
        setScanCenters(res.data || []);
      } else {
        console.log(res.message);
        setError(res.message);
      }
    } catch (error) {
      console.log(error);
      setError("Failed to fetch scan centers");
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getScanCenters();
  }, []);


  return (
    <div className="w-full">
      {loading && <LoadingOverlay />}

      {/* Header */}
      <div
        className="p-4 bg-[#A3B1A1] lg:bg-[length:70%_100%] lg:bg-no-repeat lg:bg-right-top"
        style={{
          backgroundImage:
            window.innerWidth >= 1024 ? `url(${addRadiologist_Bg})` : undefined,
        }}
      >
        <h1 className="text-[#3F3F3D] uppercase font-[900] text-xl lg:text-2xl text-center lg:text-left tracking-widest">
          Manage Scan Centre
        </h1>
      </div>

      {/* Add Scan Center Button */}
      <div className="flex justify-end px-20 pt-6">
        <button
          className="bg-[#A3B1A1] text-white flex items-center gap-2 p-2 cursor-pointer rounded-full hover:bg-[#91a191]"
          onClick={() => navigate("../addScanCenter")}
        >
          <Plus size={40} />
        </button>
      </div>

      {/* Cards Grid */}
      <div className="px-20 py-4"> {/* Added py-4 for vertical spacing */}
        {scanCenters.length === 0 && !loading && !error ? (
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
                {center.profileImgFile?.base64Data ? (
                  <img
                    src={`data:${center.profileImgFile.contentType};base64,${center.profileImgFile.base64Data}`}
                    alt={center.refSCName}
                    className="w-full h-32 object-cover rounded-md"
                  />
                ) : (
                  <div className="w-full h-32 flex items-center justify-center bg-gray-200 text-gray-500 text-xs rounded-md">
                    No Image Available
                  </div>
                )}

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
                  <TooltipContent side="left" className="max-w-xs break-words">
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
    </div>
  );
};

export default ManageScanCenter;