import { DialogContent } from "@/components/ui/dialog";
import React, { useEffect, useState } from "react";
import { reportService } from "@/services/reportService";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { downloadReportsPdf } from "@/utlis/downloadReportsPdf";
import { useAuth } from "../Routes/AuthContext";

interface PatientReportProps {
  appointmentDate: string;
  appointmentId: number;
  patientReportDialog: boolean;
}

const PatientReport: React.FC<PatientReportProps> = ({
  appointmentDate,
  appointmentId,
  patientReportDialog,
}) => {
  const [patientReport, setPatientReport] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const {user} = useAuth();

  const fetchPatientReport = async () => {
    try {
      setLoading(true);
      const res = await reportService.getPatientReport([appointmentId]);
      setPatientReport(res.data[0].refRTCText);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!patientReport) return;

    try {
      setDownloading(true);

      downloadReportsPdf(
        patientReport,
        `${user?.refUserCustId}_${appointmentDate}_Consent`
      );

      //   const jsPDF = (await import("jspdf")).jsPDF;
      //   const html2canvas = (await import("html2canvas")).default;

      //   const container = document.createElement("div");
      //   container.style.cssText = `
      //   position: absolute;
      //   top: -9999px;
      //   left: -9999px;
      //   width: 794px;
      //    padding: 40px 40px 60px 40px;
      //   font-family: Arial, sans-serif;
      //   font-size: 14px;
      //   line-height: 1.6;
      //   background-color: #ffffff;
      //   color: #000000;
      //   box-sizing: border-box;
      // `;

      //   const cleanHtml = patientReport
      //     .replace(/oklch\([^)]+\)/gi, "#000000")
      //     .replace(/rgb\([^)]+\)/gi, "#000000")
      //     .replace(/rgba\([^)]+\)/gi, "#000000")
      //     .replace(/hsl\([^)]+\)/gi, "#000000");

      //   container.innerHTML = `
      //   <style>
      //     * {
      //       color: #000000 !important;
      //       background-color: transparent !important;
      //       border-color: #000000 !important;
      //     }
      //     body, html {
      //       background-color: #ffffff !important;
      //       margin: 0;
      //       padding: 0;
      //     }
      //     img {
      //       max-width: 100% !important;
      //       height: auto !important;
      //     }
      //     table {
      //       border-collapse: collapse !important;
      //       width: 100% !important;
      //     }
      //     th, td {
      //       border: 1px solid #000000 !important;
      //       padding: 8px !important;
      //     }
      //   </style>
      //   ${cleanHtml}
      // `;

      //   document.body.appendChild(container);

      //   const images = container.querySelectorAll("img");
      //   await Promise.all(
      //     Array.from(images).map((img) => {
      //       return new Promise((resolve) => {
      //         if (img.complete) {
      //           resolve(true);
      //         } else {
      //           img.onload = () => resolve(true);
      //           img.onerror = () => resolve(true);
      //           setTimeout(() => resolve(true), 5000);
      //         }
      //       });
      //     })
      //   );

      //   const canvas = await html2canvas(container, {
      //     useCORS: true,
      //     allowTaint: false,
      //     backgroundColor: "#ffffff",
      //     scale: 2,
      //     logging: false,
      //     width: container.scrollWidth,
      //     height: container.scrollHeight,
      //     onclone: (clonedDoc: any) => {
      //       const clonedContainer = clonedDoc.querySelector("div");
      //       if (clonedContainer) {
      //         clonedContainer.style.position = "static";
      //         clonedContainer.style.top = "auto";
      //         clonedContainer.style.left = "auto";
      //       }
      //     },
      //   } as any);

      //   document.body.removeChild(container);

      //   if (!canvas || canvas.width === 0 || canvas.height === 0) {
      //     throw new Error("Failed to generate canvas from HTML content");
      //   }

      //   const imgData = canvas.toDataURL("image/png", 1.0);
      //   const pdf = new jsPDF("p", "mm", "a4");

      //   const pdfWidth = pdf.internal.pageSize.getWidth();
      //   const pdfHeight = pdf.internal.pageSize.getHeight();
      //   const imgWidth = pdfWidth;
      //   const imgHeight = (canvas.height * imgWidth) / canvas.width;

      //   let heightLeft = imgHeight;
      //   let position = 0;

      //   // First page
      //   pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      //   heightLeft -= pdfHeight;

      //   while (heightLeft > 0) {
      //     position = heightLeft - imgHeight;
      //     pdf.addPage();
      //     pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      //     heightLeft -= pdfHeight;
      //   }

      //   // // ➕ Add page numbers
      //   // const totalPages = pdf.getNumberOfPages();
      //   // for (let i = 1; i <= totalPages; i++) {
      //   //   pdf.setPage(i);
      //   //   pdf.setFontSize(10);
      //   //   pdf.text(`Page ${i} of ${totalPages}`, pdfWidth / 2, pdfHeight - 10, {
      //   //     align: "center",
      //   //   });
      //   // }

      //   const filename = `patient-report-${userId}-${appointmentId}-${new Date()
      //     .toISOString()
      //     .split("T")[0]}.pdf`;

      //   pdf.save(filename);
    } catch (error: any) {
      console.error("PDF Download Error:", error);

      let errorMessage = "Failed to generate PDF. ";
      if (error.message?.includes("canvas")) {
        errorMessage += "Unable to render content to canvas.";
      } else if (error.message?.includes("jsPDF")) {
        errorMessage += "PDF generation library error.";
      } else {
        errorMessage += "Please try again.";
      }

      alert(errorMessage);
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    if (patientReportDialog) fetchPatientReport();
  }, [patientReportDialog]);

  return (
    <DialogContent
      style={{ background: "#fff" }}
      className="w-[100vw] lg:w-[70vw] h-[90vh] overflow-y-auto p-0"
    >
      <div className="w-full h-auto mx-auto px-5 lg:px-10 py-6">
        {loading || downloading ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-600">Loading report...</div>
          </div>
        ) : patientReport ? (
          <div className="flex flex-col">
            <div className="self-end mb-4">
              <Button
                variant="greenTheme"
                onClick={handleDownloadPDF}
                disabled={downloading}
                className="flex items-center gap-2"
              >
                <Download size={16} />
                {downloading ? "Generating PDF..." : "Download PDF"}
              </Button>
            </div>
            <div
              className="report-content-view prose prose-sm sm:prose lg:prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: patientReport }}
            />
          </div>
        ) : (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-500">No report available</div>
          </div>
        )}
      </div>
    </DialogContent>
  );
};

export default PatientReport;
