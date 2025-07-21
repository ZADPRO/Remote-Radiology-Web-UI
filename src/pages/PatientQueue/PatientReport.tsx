import { DialogContent, DialogHeader } from "@/components/ui/dialog";
import React, { useEffect, useState } from "react";
import logoNew from "../../assets/LogoNew2.png";
import { reportService } from "@/services/reportService";


interface PatientReportProps {
    userId: number,
    appointmentId: number,
    patientReportDialog: boolean
}

const PatientReport: React.FC<PatientReportProps> = ({userId, appointmentId, patientReportDialog}) => {
    const [patientReport, setPatientReport] = useState("");
    const [loading, setLoading] = useState(false);
    // const [downloading, setDownloading] = useState(false);

    const fetchPatientReport = async () => {
        try {
            setLoading(true);
            const res = await reportService.getPatientReport(userId, appointmentId);
            setPatientReport(res.RTCText);
            console.log(res);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

//     const handleDownloadPDF = async () => {
//     if (!patientReport) return;

//     try {
//         setDownloading(true);
        
//         const jsPDF = (await import('jspdf')).jsPDF;
//         const html2canvas = (await import('html2canvas')).default;
        
//         // Create a clean container without modern CSS
//         const element = document.createElement('div');
//         element.style.cssText = `
//             width: 794px;
//             padding: 40px;
//             font-family: Arial, sans-serif;
//             background-color: #ffffff;
//             color: #333333;
//             position: absolute;
//             left: -9999px;
//             top: 0;
//         `;
        
//         element.innerHTML = `
//             <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #eac9c5; padding-bottom: 20px;">
//                 <h1 style="color: #333333; font-size: 24px; margin-bottom: 10px; font-weight: bold;">Patient Report</h1>
//                 <p style="color: #666666; font-size: 14px; margin: 0;">EaseQT Platform</p>
//             </div>
//             <div style="line-height: 1.6; color: #333333; font-size: 14px;">
//                 ${patientReport}
//             </div>
//         `;

//         document.body.appendChild(element);

//         const canvas = await html2canvas(element, {
//             scale: 2,
//             useCORS: true,
//             allowTaint: true,
//             backgroundColor: '#ffffff',
//             removeContainer: true
//         } as any);

//         document.body.removeChild(element);

//         // Generate PDF
//         const imgWidth = 210;
//         const pageHeight = 295;
//         const imgHeight = (canvas.height * imgWidth) / canvas.width;
//         let heightLeft = imgHeight;

//         const pdf = new jsPDF('p', 'mm', 'a4');
//         let position = 0;

//         pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
//         heightLeft -= pageHeight;

//         while (heightLeft >= 0) {
//             position = heightLeft - imgHeight;
//             pdf.addPage();
//             pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
//             heightLeft -= pageHeight;
//         }

//         const filename = `patient-report-${userId}-${appointmentId}-${new Date().toISOString().split('T')[0]}.pdf`;
//         pdf.save(filename);
        
//     } catch (error) {
//         console.error('Error generating PDF:', error);
//         alert('Error downloading report. Please try again.');
//     } finally {
//         setDownloading(false);
//     }
// };


    useEffect(() => {
        patientReportDialog && fetchPatientReport();
    }, [patientReportDialog]);

    return (
        <DialogContent
            style={{
                background:
                    "radial-gradient(100.97% 186.01% at 50.94% 50%, #F9F4EC 25.14%, #EED8D6 100%)",
            }}
            className="w-[100vw] lg:w-[70vw] h-[90vh] overflow-y-auto p-0"
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
                    <h2 className="text-2xl font-semibold">Report</h2>
                    <p className="text-sm text-gray-600 max-w-md mx-auto">
                        EaseQT Platform
                    </p>
                </div>

                {/* Spacer to balance logo width */}
                <div className="hidden lg:inline h-12 w-24 sm:h-14 sm:w-28 flex-shrink-0" />
            </DialogHeader>

            <div className="w-full h-auto mx-auto px-5 lg:px-10 py-6">
                {loading ? (
                    <div className="flex justify-center items-center py-8">
                        <div className="text-gray-600">Loading report...</div>
                    </div>
                ) : patientReport ? (
                    <div className="flex flex-col">
                        {/* <div className="self-end mb-4">
                            <Button 
                                variant="greenTheme" 
                                onClick={handleDownloadPDF}
                                disabled={downloading}
                                className="flex items-center gap-2"
                            >
                                <Download size={16} />
                                {downloading ? "Generating PDF..." : "Download PDF"}
                            </Button>
                        </div> */}
                        <div
                            className="report-content prose prose-sm sm:prose lg:prose-lg max-w-none"
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
