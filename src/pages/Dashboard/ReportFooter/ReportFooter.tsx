import { DialogContent } from "@/components/ui/dialog";
import React, { useEffect, useState } from "react";
import logoNew from "../../../assets/LogoNew.png";
import LoadingOverlay from "@/components/ui/CustomComponents/loadingOverlay";
import { impressionrecommendationService } from "../../../services/impressionRecommendationService";
import TextEditor from "@/components/TextEditor";
import { Button } from "@/components/ui/button";

type Props = {};

const ReportFooter: React.FC<Props> = () => {
  useEffect(() => {
    GetReportFooter();
  }, []);

  const [loading, setLoading] = useState(true);
  const [reportFooter, setReportFooter] = useState("");

  const GetReportFooter = async () => {
    try {
      setLoading(true);
      const res = await impressionrecommendationService.GetReportFooter();
      if (res.status) {
        setReportFooter(res.data);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const SaveReportFooter = async () => {
    try {
      const res = await impressionrecommendationService.SaveReportFooter(
        reportFooter
      );
      if (res.status) {
        GetReportFooter();
      }
    } catch (e) {
      console.log(e);
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
              Report Footer
            </h2>
          </div>

          {/* Spacer to balance alignment */}
          <div className="w-16 sm:w-20 lg:w-24" />
        </div>
        <div className="w-[100%] h-[68vh] mt-4 sm:h-[64vh] overflow-auto px-10">
          <TextEditor
            value={reportFooter}
            onChange={(val) => {
              setReportFooter(val);
            }}
          />
        </div>
        <div className="mt-5 mx-10 flex justify-end">
          <Button onClick={SaveReportFooter} variant="greenTheme">
            Save
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};

export default ReportFooter;
