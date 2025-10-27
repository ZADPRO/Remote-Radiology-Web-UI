import { DialogContent } from "@/components/ui/dialog";
import React, { useEffect, useState } from "react";
import logoNew from "../../../assets/LogoNew.png";
import LoadingOverlay from "@/components/ui/CustomComponents/loadingOverlay";
import WellthgreenReportPortal from "./WellthgreenReportPortal";
import NASystem from "./NASystem";
import {
  GetAllCategoryData,
  impressionrecommendationService,
  ImpressionRecommendationValModel,
} from "../../../services/impressionRecommendationService";

type Props = {};

const ImpressionandRecommendationEdit: React.FC<Props> = () => {
  useEffect(() => {
    GetImpressionRecommendation();
  }, []);

  const [loading, setLoading] = useState(true);
  const [type, setType] = useState("1");
  const [categoryData, setCategoryData] = useState<GetAllCategoryData[]>([]);
  const [WRImpressionRecommendationData, setWRImpressionRecommendation] =
    useState<ImpressionRecommendationValModel[]>([]);
  const [NAImpressionRecommendationData, setNAImpressionRecommendation] =
    useState<ImpressionRecommendationValModel[]>([]);

  const GetImpressionRecommendation = async () => {
    try {
      setLoading(true);
      const res = await impressionrecommendationService.GetAllCategoryData();
      if (res.status) {
        setCategoryData(res.categoryData);
        setWRImpressionRecommendation(
          res?.ImpressionRecommendation
            ? res.ImpressionRecommendation.filter(
                (item) => item.refIRVSystemType === "WR"
              )
            : []
        );

        setNAImpressionRecommendation(
          res?.ImpressionRecommendation
            ? res.ImpressionRecommendation.filter(
                (item) => item.refIRVSystemType === "NA"
              )
            : []
        );
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent
      style={{
        background:
          "radial-gradient(100.97% 186.01% at 50.94% 50%, #F9F4EC 25.14%, #EED8D6 100%)",
      }}
      className="h-[95vh] w-[95vw] sm:w-[90vw] lg:w-[95vw] overflow-y-auto p-0"
    >
      {loading && <LoadingOverlay />}
      <div className="w-full">
        {/* Header */}
        <div className="h-[12vh] sm:h-[15vh] bg-[#efd4d1] flex items-center justify-between px-3 sm:px-4 lg:px-6">
          {/* Logo (Left) */}
          <img
            src={logoNew}
            alt="logoNew"
            className="h-8 sm:h-10 lg:h-12 xl:h-14 object-contain"
          />

          {/* Title (Center) */}
          <div className="flex-1 text-center">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold">
              Impression and Recommendation
            </h2>
          </div>

          {/* Spacer to balance alignment */}
          <div className="w-16 sm:w-20 lg:w-24" />
        </div>
        <div className="flex items-center justify-center px-4 sm:px-6 lg:px-10 py-3 sm:py-4 lg:py-5">
          <div className="flex gap-2 sm:gap-3 lg:gap-4 flex-wrap justify-center">
            <div
              onClick={() => {
                setType("1");
              }}
              className={`text-xs sm:text-sm w-[80px] sm:w-[120px] lg:w-[160px] text-center h-11 font-semibold flex justify-center items-center px-1 sm:px-2 rounded-sm cursor-pointer transition-colors ${
                type === "1"
                  ? "bg-[#a3b1a0] text-white"
                  : "bg-[#f6ede7] border-2 border-[#a3b1a0]"
              }`}
            >
              Wellthgreen Report Portal 10.10
            </div>
            <div
              onClick={() => {
                setType("2");
              }}
              className={`text-xs sm:text-sm w-[80px] sm:w-[120px] lg:w-[160px] text-center h-11 font-semibold flex justify-center items-center px-1 sm:px-2 rounded-sm cursor-pointer transition-colors ${
                type === "2"
                  ? "bg-[#a3b1a0] text-white"
                  : "bg-[#f6ede7] border-2 border-[#a3b1a0]"
              }`}
            >
              NA system
            </div>
          </div>
        </div>
        <div className="w-[100%] h-[68vh] sm:h-[64vh] overflow-auto px-10">
          {type === "1" ? (
            <WellthgreenReportPortal
              categoryData={categoryData}
              ImpressionRecommendationData={WRImpressionRecommendationData}
              GetImpressionRecommendation={GetImpressionRecommendation}
              setLoading={setLoading}
            />
          ) : (
            type === "2" && (
              <NASystem
                categoryData={categoryData}
                ImpressionRecommendationData={NAImpressionRecommendationData}
                GetImpressionRecommendation={GetImpressionRecommendation}
                setLoading={setLoading}
              />
            )
          )}
        </div>
      </div>
    </DialogContent>
  );
};

export default ImpressionandRecommendationEdit;
