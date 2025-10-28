import { DialogContent } from "@/components/ui/dialog";
import React, { useEffect, useState } from "react";
import { reportService } from "@/services/reportService";
import { Button } from "@/components/ui/button";
import { downloadReportsPdf } from "@/utlis/downloadReportsPdf";
import { Download } from "lucide-react";

interface PatientReportProps {
  appointmentIds: number[];
  patientConsentDialog: boolean;
  appointmentDate: string;
  patientCustId: string;
}

const PatientConsentDialog: React.FC<PatientReportProps> = ({
  appointmentIds,
  patientConsentDialog,
  appointmentDate,
  patientCustId,
}) => {
  const [patientReport, setPatientReport] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const fetchPatientReport = async () => {
    console.log(appointmentIds)
    try {
      setLoading(true);
      console.log(appointmentIds)
      const res = await reportService.getPatientConsent(appointmentIds);
      console.log(res)
      if(res?.data[0].refAppointmentConsent != "") {
        setPatientReport(res?.data[0].refAppointmentConsent);
      } else {
        setPatientReport("");
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  useEffect(() => {
    if (patientConsentDialog) fetchPatientReport();
  }, [patientConsentDialog]);


  return (
    <DialogContent
      style={{ background: "#fff" }}
      className="w-[100vw] lg:w-[70vw] h-[90vh] overflow-y-auto p-0"
    >
      <div className="w-full h-auto mx-auto px-5 lg:px-10 py-6">
        {loading ? (
          // || downloading
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-600">Loading report...</div>
          </div>
        ) : patientReport ? (
          <div className="flex flex-col">
            <div className="self-end mb-4">
              <Button
                variant="greenTheme"
                onClick={async () => {
                  setDownloading(true);
                  await downloadReportsPdf(
                    patientReport,
                    `${patientCustId}_${appointmentDate}_Consent`
                  );
                  setDownloading(false);
                }}
                disabled={downloading}
                className="flex items-center gap-2"
              >
                <Download size={16} />
                {downloading ? "Generating PDF..." : "Download PDF"}
              </Button>
            </div>
            <div
              className="ql-editor rounded-2xl shadow-2xl p-10"
              dangerouslySetInnerHTML={{ __html: patientReport }}
            />
          </div>
        ) : (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-500">No consent available</div>
          </div>
        )}
      </div>
    </DialogContent>
  );
};


export default PatientConsentDialog;