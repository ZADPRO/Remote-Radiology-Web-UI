import React, { useEffect, useRef, useState } from "react";
import RightReport from "./RightReport";
import GeneralReport from "./GeneralReport";
import LeftReport from "./LeftReport";
import NotesReport from "./NotesReport";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PatientInTakeForm from "../PatientInTakeForm/PatientInTakeForm";
import TechnicianPatientIntakeForm, {
  ResponsePatientForm,
} from "../TechnicianPatientIntakeForm/TechnicianPatientIntakeForm";
import { Button } from "@/components/ui/button";
import Mammoth from "mammoth";
import { Plus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AppointmentStatus,
  ReportHistoryData,
  reportService,
} from "@/services/reportService";
import { ArrowLeft, Loader } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  PopoverContentDialog,
  PopoverDialog,
  PopoverTriggerDialog,
} from "@/components/ui/CustomComponents/popoverdialog";
import DicomList from "./DicomList";
import { useAuth, UserRole } from "../Routes/AuthContext";
import TextEditor from "@/components/TextEditor";
import logo from "../../assets/LogoNew.png";
import LoadingOverlay from "@/components/ui/CustomComponents/loadingOverlay";
import Impression from "./ImpressionRecommendation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ResponseTechnicianForm } from "@/services/technicianServices";
import { generateRightBreastReportText } from "./BreastDensityandImageQuality/BreastDensityImageQuality";
import {
  breastDensityandImageLeftQuestions,
  breastDensityandImageRightQuestions,
  ComparisonPriorLeftQuestion,
  ComparisonPriorRightQuestion,
  grandularAndDuctalTissueLeftQuestions,
  grandularAndDuctalTissueRightQuestions,
  lesionsLeftQuestions,
  lesionsRightQuestions,
  LymphNodesLeftQuestions,
  LymphNodesRightQuestions,
  nippleAreolaSkinLeftQuestions,
  nippleAreolaSkinRightQuestions,
} from "./ReportQuestionsAssignment";
import { generateNippleAreolaBreastEditor } from "./NippleAreolaSkin/NippleAreolaEditor";
import { generateGrandularAndDuctalTissueReport } from "./GrandularAndDuctalTissue/GrandularAndDuctalTissueRightReport";
import { LesionsRightString } from "./Lisons/LesionsRightString";
import { ComparisonPriorRightString } from "./ComparisonPrior/ComparisonPriorRightString";
import { LymphNodesGenerateString } from "./GenerateReport/LymphNodes";
import { SFormGeneration } from "./GenerateReport/SFormReportGenerator";
import { DaFormReportGenerator } from "./GenerateReport/DaFormReportGenerator";
import { DcFormGeneration } from "./GenerateReport/DcFormReportGenerator";
import { DbFormReportGenerator } from "./GenerateReport/DbFormReportGenerator";

export interface ReportQuestion {
  refRITFId?: number;
  questionId: number;
  answer: string;
}

interface AssignReportResponse {
  appointmentStatus: AppointmentStatus[];
  reportHistoryData: ReportHistoryData[];
}

interface TextEditorContent {
  refRTCId: number;
  refRTCText: string;
  refRTSyncStatus: boolean;
}

interface ReportTemplate {
  refRFName: string;
  refRFId: number;
  refRFCreatedBy: number;
  refRFCreatedAt: string;
}

type ReportStageLabel =
  | "Predraft"
  | "Draft"
  | "Reviewed 1 Correct"
  | "Reviewed 1 Edit"
  | "Reviewed 2 Correct"
  | "Reviewed 2 Edit"
  | "Insert Signature"
  | "Sign Off";
// | "Addendum";

interface ReportStage {
  label: ReportStageLabel;
  editStatus: boolean;
  status: string;
}

const Report: React.FC = () => {
  const [tab, setTab] = useState<number>(4);

  const [subTab, setSubTab] = useState<number>(1);

  const [loading, setLoading] = useState(false);

  // const [selected, setSelected] = useState<"correct" | "edit">("correct");

  const { role } = useAuth();

  const navigate = useNavigate();
  const location = useLocation().state;

  // Use sessionStorage as fallback
  const stateData: {
    appointmentId: number;
    userId: number;
    readOnly: boolean;
  } = location ?? JSON.parse(sessionStorage.getItem("reportStateData") || "{}");

  const allowNavigationRef = useRef(false);
  const [showDialog, setShowDialog] = useState(false);
  const [changesDone, setChangesDone] = useState(false);

  useEffect(() => {
    if (location) {
      sessionStorage.setItem("reportStateData", JSON.stringify(location));
    }
  }, [location]);

  // Handle browser reload and back navigation
  useEffect(() => {
    if (stateData?.readOnly === false) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        if (changesDone && !allowNavigationRef.current) {
          e.preventDefault();
          e.returnValue = ""; // triggers confirmation dialog
        }
      };

      const handlePopState = () => {
        if (changesDone && !allowNavigationRef.current) {
          setShowDialog(true);
          history.replaceState({ fake: true }, "", window.location.href);
          history.pushState(null, "", window.location.href);
        }
      };

      if (changesDone) {
        window.addEventListener("beforeunload", handleBeforeUnload);
        window.addEventListener("popstate", handlePopState);
        history.replaceState({ fake: true }, "", window.location.href);
        history.pushState(null, "", window.location.href);
      }

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, [changesDone]);

  useEffect(() => {
    if (allowNavigationRef.current) {
      navigate(-1);
    }
  }, [allowNavigationRef.current]);

  const handleLeave = () => {
    allowNavigationRef.current = true;
    setShowDialog(false);
    navigate(-1);
  };
  const [reportFormData, setReportFormData] = useState<ReportQuestion[]>(
    Array.from({ length: 200 }, (_, index) => ({
      questionId: 1 + index,
      answer: "",
    }))
  ); //current higgest question id: 116


  useEffect(() => {
    if (syncStatus.breastDensityandImageRight) {
      setBreastDensityandImageRight(
        generateRightBreastReportText(
          reportFormData,
          breastDensityandImageRightQuestions
        )
      );
    }

    if (syncStatus.nippleAreolaSkinRight) {
      setNippleAreolaSkinRight(
        generateNippleAreolaBreastEditor(
          reportFormData,
          nippleAreolaSkinRightQuestions
        )
      );
    }

    if (syncStatus.grandularAndDuctalTissueRight) {
      setGrandularAndDuctalTissueRight(
        generateGrandularAndDuctalTissueReport(
          reportFormData,
          grandularAndDuctalTissueRightQuestions
        )
      );
    }

    if (syncStatus.LesionsRight) {
      setLesionsRight(
        LesionsRightString(reportFormData, lesionsRightQuestions)
      );
    }

    if (syncStatus.ComparisonPrior) {
      setComparisonPrior(
        ComparisonPriorRightString(
          reportFormData,
          ComparisonPriorRightQuestion,
          "Right"
        )
      );
    }

    if (syncStatus.LymphNodesRight) {
      setLymphNodesRight(
        LymphNodesGenerateString(
          reportFormData,
          LymphNodesRightQuestions,
          "Right"
        )
      );
    }

    if (syncStatus.breastDensityandImageLeft) {
      setBreastDensityandImageLeft(
        generateRightBreastReportText(
          reportFormData,
          breastDensityandImageLeftQuestions
        )
      );
    }

    if (syncStatus.nippleAreolaSkinLeft) {
      setNippleAreolaSkinLeft(
        generateNippleAreolaBreastEditor(
          reportFormData,
          nippleAreolaSkinLeftQuestions
        )
      );
    }

    if (syncStatus.grandularAndDuctalTissueLeft) {
      setGrandularAndDuctalTissueLeft(
        generateGrandularAndDuctalTissueReport(
          reportFormData,
          grandularAndDuctalTissueLeftQuestions
        )
      );
    }

    if (syncStatus.LesionsLeft) {
      setLesionsLeft(LesionsRightString(reportFormData, lesionsLeftQuestions));
    }

    if (syncStatus.ComparisonPriorLeft) {
      setComparisonPriorLeft(
        ComparisonPriorRightString(
          reportFormData,
          ComparisonPriorLeftQuestion,
          "Left"
        )
      );
    }

    if (syncStatus.LymphNodesLeft) {
      setLymphNodesLeft(
        LymphNodesGenerateString(
          reportFormData,
          LymphNodesLeftQuestions,
          "Left"
        )
      );
    }
  }, [reportFormData]);

  const handleReportInputChange = (questionId: number, value: string) => {
    !changesDone && setChangesDone(true);
    setReportFormData((prevData) =>
      prevData.map((q) =>
        q.questionId === questionId ? { ...q, answer: value } : q
      )
    );
  };

  const handlePatientInputChange = (questionId: number, value: string) => {
    setResponsePatientInTake((prevData) =>
      prevData.map((q) =>
        q.questionId === questionId ? { ...q, answer: value } : q
      )
    );
  };

  const stageRoleMap: Record<ReportStageLabel, UserRole[]> = {
    Predraft: ["scribe", "admin", "wgdoctor"],
    Draft: ["radiologist", "admin", "wgdoctor"],
    "Reviewed 1 Correct": ["admin", "wgdoctor"],
    "Reviewed 1 Edit": ["admin", "wgdoctor"],
    "Reviewed 2 Correct": ["codoctor"],
    "Reviewed 2 Edit": ["codoctor"],
    "Insert Signature": ["admin", "wgdoctor", "doctor"],
    "Sign Off": ["doctor", "admin", "wgdoctor"],
    // Addendum: ["doctor", "admin"], // assuming doctor can handle addendums
  };

  const reportStages: ReportStage[] = [
    { label: "Predraft", status: "Predraft", editStatus: false },
    { label: "Draft", status: "Draft", editStatus: false },
    { label: "Reviewed 1 Correct", status: "Reviewed 1", editStatus: false },
    { label: "Reviewed 1 Edit", status: "Reviewed 1", editStatus: true },
    { label: "Reviewed 2 Correct", status: "Reviewed 2", editStatus: false },
    { label: "Reviewed 2 Edit", status: "Reviewed 2", editStatus: true },
    { label: "Insert Signature", status: "", editStatus: false },
    { label: "Sign Off", status: "Signed Off", editStatus: false },
    // { label: "Addendum", editStatus: false },
  ];

  const [userDetails, setUserDetails]: any = useState([]);

  // const [dicomFiles, setDicomFiles] = useState<DicomFileList[]>([]);
  const [patientDetails, setPatintDetails]: any = useState([]);
  const [technicianForm, setTechnicianForm] = useState<
    ResponseTechnicianForm[]
  >([]);

  const [loadTemplateStatus, setLoadTemplateStatus] = useState(false);
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingStatus, setLoadingStatus] = useState(0);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [fileName, setFilename] = useState("");
  const [fileData, setFileData] = useState("");
  const [popoverLoading, setPopoverLoading] = useState(false);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file && file.name.endsWith(".docx")) {
      const reader = new FileReader();

      reader.onload = async (e: ProgressEvent<FileReader>) => {
        const arrayBuffer = e.target?.result;
        if (arrayBuffer && typeof arrayBuffer !== "string") {
          try {
            const result = await Mammoth.convertToHtml({ arrayBuffer });
            setFileData(result.value); // Set HTML to Quill
            console.log(result.value);
          } catch (error) {
            console.error("Error converting .docx:", error);
          }
        }
      };

      reader.readAsArrayBuffer(file);
    } else {
      alert("Please upload a valid .docx file.");
    }
  };

  const filteredTemplates = templates.filter((data: any) =>
    data.refRFName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [breastImplantRight, setBreastImplantRight] = useState("");
  const [breastDensityandImageRight, setBreastDensityandImageRight] =
    useState("");
  const [nippleAreolaSkinRight, setNippleAreolaSkinRight] = useState("");
  const [LesionsRight, setLesionsRight] = useState("");
  const [ComparisonPrior, setComparisonPrior] = useState("");
  const [grandularAndDuctalTissueRight, setGrandularAndDuctalTissueRight] =
    useState("");
  const [LymphNodesRight, setLymphNodesRight] = useState("");
  const [breastDensityandImageLeft, setBreastDensityandImageLeft] =
    useState("");
  const [nippleAreolaSkinLeft, setNippleAreolaSkinLeft] = useState("");
  const [LesionsLeft, setLesionsLeft] = useState("");
  const [ComparisonPriorLeft, setComparisonPriorLeft] = useState("");
  const [grandularAndDuctalTissueLeft, setGrandularAndDuctalTissueLeft] =
    useState("");
  const [LymphNodesLeft, setLymphNodesLeft] = useState("");

  const [Notes, setNotes] = useState("");

  const [patientHistory, setPatientHistory] = useState("");

  const [syncStatus, setsyncStatus] = useState({
    breastImplant: true,
    breastDensityandImageRight: true,
    nippleAreolaSkinRight: true,
    LesionsRight: true,
    ComparisonPrior: true,
    grandularAndDuctalTissueRight: true,
    LymphNodesRight: true,
    breastDensityandImageLeft: true,
    nippleAreolaSkinLeft: true,
    LesionsLeft: true,
    ComparisonPriorLeft: true,
    grandularAndDuctalTissueLeft: true,
    LymphNodesLeft: true,
    Notes: true,
    ImpressionsRecommendations: true,
  });

  const [assignData, setAssignData] = useState<AssignReportResponse | null>(
    null
  );
  const [responsePatientInTake, setResponsePatientInTake] = useState<
    ResponsePatientForm[]
  >([]);

  const [mainImpressionRecommendation, setMainImpressionRecommendation] =
    useState({
      selectedImpressionId: "",
      selectedRecommendationId: "",
      impressionText: "",
      recommendationText: "",
    });

  const [
    optionalImpressionRecommendation,
    setOptionalImpressionRecommendation,
  ] = useState({
    selectedImpressionId: "",
    selectedRecommendationId: "",
    impressionText: "",
    recommendationText: "",
  });

  const [showOptional, setShowOptional] = useState({
    impression: false,
    recommendation: false,
  });

  const [commonImpressRecomm, setCommonImpressRecomm] = useState<{
    id: string;
    text: string;
  }>({
    id: "",
    text: "",
  });

  const handleAssignUser = async () => {
    setLoading(true);
    try {
      const response: {
        appointmentStatus: AppointmentStatus[];
        reportHistoryData: ReportHistoryData[];
        intakeFormData: ResponsePatientForm[];
        reportIntakeFormData: ReportQuestion[];
        reportTextContentData: TextEditorContent[];
        technicianIntakeFormData: ResponseTechnicianForm[];
        reportFormateList: any;
        userDeatils: any;
        patientDetails: any;
        status: boolean;
      } = await reportService.assignReport(
        stateData.appointmentId,
        stateData.userId,
        stateData.readOnly
      );

      console.log(response);

      if (response.status) {
        setAssignData({
          appointmentStatus: response.appointmentStatus,
          reportHistoryData: response.reportHistoryData || [],
        });
        setMainImpressionRecommendation((prev) => ({
          ...prev,
          selectedImpressionId:
            response.appointmentStatus[0].refAppointmentImpression,
          selectedRecommendationId:
            response.appointmentStatus[0].refAppointmentRecommendation,
        }));
        setOptionalImpressionRecommendation((prev) => ({
          ...prev,
          selectedImpressionId:
            response.appointmentStatus[0].refAppointmentImpressionAdditional,
          selectedRecommendationId:
            response.appointmentStatus[0].refAppointmentRecommendationAdditional,
        }));
        setShowOptional(() => ({
          impression: response.appointmentStatus[0].refAppointmentImpressionAdditional != "",
          recommendation: response.appointmentStatus[0].refAppointmentRecommendationAdditional != ""
        }))
        
        setCommonImpressRecomm((prev) => ({
          ...prev,
          id: response.appointmentStatus[0].refAppointmentCommonImpressionRecommendation
        }))

        setTemplates(response.reportFormateList || []);
        setResponsePatientInTake(response.intakeFormData || []);
        setTechnicianForm(response.technicianIntakeFormData || []);
        if (response.reportIntakeFormData) {
          setReportFormData(response.reportIntakeFormData);
        }
        if (response.reportTextContentData) {
          setNotes(response.reportTextContentData[0]?.refRTCText);
          setsyncStatus({
            breastImplant: true,
            breastDensityandImageRight: true,
            nippleAreolaSkinRight: true,
            LesionsRight: true,
            ComparisonPrior: true,
            grandularAndDuctalTissueRight: true,
            LymphNodesRight: true,
            breastDensityandImageLeft: true,
            nippleAreolaSkinLeft: true,
            LesionsLeft: true,
            ComparisonPriorLeft: true,
            grandularAndDuctalTissueLeft: true,
            LymphNodesLeft: true,
            Notes: response.reportTextContentData[0]?.refRTSyncStatus || false,
            ImpressionsRecommendations: true,
          });
        }

        setUserDetails(response.userDeatils[0]);
        setPatintDetails(response.patientDetails[0]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
    if(!responsePatientInTake) return;

    if(assignData?.appointmentStatus[0].refCategoryId === 1) {
      setPatientHistory(SFormGeneration(responsePatientInTake))
    }else if(assignData?.appointmentStatus[0].refCategoryId === 2) {
      setPatientHistory(DaFormReportGenerator(responsePatientInTake))
    }  else if(assignData?.appointmentStatus[0].refCategoryId === 3) {
      setPatientHistory(DbFormReportGenerator(responsePatientInTake))
    } else if(assignData?.appointmentStatus[0].refCategoryId === 4) {
      setPatientHistory(DcFormGeneration(responsePatientInTake))
    }
  }, [responsePatientInTake]);

  // const listDicomFiles = async () => {
  //   try {
  //     const res = await technicianService.listDicom(
  //       stateData.appointmentId,
  //       stateData.userId
  //     );
  //     console.log(res);

  //     if (res.status) {
  //       setDicomFiles(res.message);
  //     } else {
  //       console.log(res.message);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const uploadReportFormate = async () => {
    setPopoverLoading(true);
    try {
      const response: {
        id: number;
        status: boolean;
      } = await reportService.uploadTemplate(fileName, fileData);

      console.log(response);

      if (response.status) {
        setTemplates((prev: any) => [
          ...prev,
          {
            refRFName: fileName,
            refRFId: response.id,
            refRFCreatedBy: 0,
            refRFCreatedAt: "",
          },
        ]);
        setPopoverOpen(false);
        setFileData("");
        setFilename("");
      }
    } catch (error) {
      console.log(error);
    }
    setPopoverLoading(false);
  };

  const getTemplate = async (id: number) => {
    setLoadingStatus(id);
    try {
      const response: {
        message: any;
        status: boolean;
      } = await reportService.getTemplate(id);

      console.log(response);

      if (response.status) {
        setNotes(
          `
           <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr>
                    <td style="border: 1px solid #000; padding: 4px;"><strong>NAME</strong></td>
                    <td style="border: 1px solid #000; padding: 4px;">${getAnswer(
                      1
                    )}</td>
                    <td style="border: 1px solid #000; padding: 4px;"><strong>STUDY</strong></td>
                    <td style="border: 1px solid #000; padding: 4px;">${new Date(
                      assignData?.reportHistoryData[
                        assignData?.reportHistoryData.length - 1
                      ].refRHHandleStartTime.toString() || ""
                    )
                      .toISOString()
                      .slice(0, 16)
                      .replace("T", " ")}</td>
                                </tr>
                                <tr>
                                    <td style="border: 1px solid #000; padding: 4px;"><strong>AGE/GENDER</strong></td>
                                    <td style="border: 1px solid #000; padding: 4px;">${getAnswer(
                                      5
                                    )} / ${
            getAnswer(6) === "female" ? "F" : getAnswer(5)
          }</td>
                                    <td style="border: 1px solid #000; padding: 4px;"><strong>SCAN CENTER</strong></td>
                    <td style="border: 1px solid #000; padding: 4px;">${
                      assignData?.appointmentStatus[0]?.refSCCustId
                    }</td>
                </tr>
                <tr>
                <td style="border: 1px solid #000; padding: 4px;"><strong>USERID</strong></td>
                    <td style="border: 1px solid #000; padding: 4px;">${
                      patientDetails.refUserCustId
                    }</td>
                    <td style="border: 1px solid #000; padding: 4px;"><strong>REPORT</strong></td>
                    <td style="border: 1px solid #000; padding: 4px;">${
                      assignData?.appointmentStatus[0]?.refAppointmentDate
                        ? assignData?.appointmentStatus[0]?.refAppointmentDate.toString()
                        : ""
                    }</td>
                    
                </tr>
            </table>
            <br/>
            ` + response.message[0].refRFText
        );
        setLoadTemplateStatus(false);
      }
    } catch (error) {
      console.log(error);
    }
    setLoadingStatus(0);
  };

  useEffect(() => {
    handleAssignUser();
    // listDicomFiles();
  }, []);

  const [showMailDialog, setShowMailDialog] = useState(false);
  const [mailOption, setMailOption] = useState("");

  const handleReportSubmit = async (
    movedStatus: string,
    editStatus: boolean
  ) => {
    setLoading(true);
    try {
      const payload = {
        reportIntakeForm: reportFormData,
        appointmentId: stateData.appointmentId,
        technicianIntakeForm: [],
        patientIntakeForm: [],
        reportTextContent: Notes,
        patientId: stateData.userId,
        movedStatus: movedStatus,
        currentStatus: assignData?.appointmentStatus[0]?.refAppointmentComplete,
        syncStatus: syncStatus.Notes,
        impression: mainImpressionRecommendation.selectedImpressionId,
        recommendation: mainImpressionRecommendation.selectedRecommendationId,
        impressionaddtional:
          optionalImpressionRecommendation.selectedImpressionId,
        recommendationaddtional:
          optionalImpressionRecommendation.selectedRecommendationId,
        commonImpressionRecommendation: commonImpressRecomm.id,
        editStatus: editStatus,
        patientMailStatus: mailOption === "patient" || mailOption === "both",
        managerMailStatus: mailOption === "scancenter" || mailOption === "both",
      };
      console.log("payload", payload);

      const res = await reportService.submitReport(payload);
      console.log(res);

      if (res.status) {
        setChangesDone(false);
        allowNavigationRef.current = true;
        navigate(-1);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getAnswer = (id: number) =>
    responsePatientInTake.find((q) => q.questionId === id)?.answer || "";

  return (
    <div className="h-dvh bg-[#edd1ce]">
      {loading && <LoadingOverlay />}
      <div className="w-full h-[10vh] bg-[#a3b1a0] flex shadow-sm">
        {/* Main Tabs */}
        <div className="flex w-3/5 h-full">
          <div className="w-auto">
            <img
              src={logo}
              alt="logo"
              className="w-full h-full object-contain object-center"
            />
          </div>
          {[
            { label: "Patient Form", value: 1 },
            { label: "Technician Form", value: 2 },
            { label: "Dicom", value: 3 },
            { label: "Report", value: 4 },
          ].map(({ label, value }) => (
            <div
              key={label}
              onClick={() => {
                setTab(value);
              }}
              className={`flex-1 flex items-center justify-center text-sm rounded-t-[2rem] border-t border-x font-semibold transition-all duration-150 relative ${
                tab === value
                  ? "bg-[#f8f4eb] rounded-t-[2rem] h-[90%] mt-auto shadow-md border-t"
                  : "hover:bg-[#b8c2b5] rounded-t-[2rem] border-t"
              }transition-colors duration-50 ease-in cursor-pointer`}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Report Sub-Tabs */}
        <div className="flex w-2/5 h-full items-center justify-around px-2">
          {tab === 4 &&
            [
              { label: "General", value: 1 },
              { label: "Right", value: 2 },
              { label: "Left", value: 3 },
              { label: "Impression", value: 5 },
              { label: "Final Report", value: 4 },
            ].map(({ label, value }) => (
              <div
                key={label}
                onClick={() => setSubTab(value)}
                className={`flex-1 text-xs text-center font-medium py-2 mx-1 rounded-md border cursor-pointer transition-all duration-200 ${
                  subTab === value
                    ? "bg-[#f8f4eb] border-[#3f3f3d] shadow-sm"
                    : "border-[#b4b4b4] hover:bg-[#d6d9d3]"
                }`}
              >
                {label}
              </div>
            ))}
        </div>
      </div>

      <div className="flex w-full">
        <div
          className={`w-[20%] ${
            tab == 1 || tab == 2 ? "h-[100vh]" : "h-[90vh]"
          } overflow-y-auto bg-[#f4e7e1] p-3`}
        >
          <Button
            type="button"
            variant="link"
            className="flex text-foreground font-semibold gap-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft />
            <span className="text-lg font-semibold">Back</span>
          </Button>
          {/* Details Content */}
          <div className="flex flex-col gap-1 mt-2 pb-5">
            <div className="text-sm">
              Name: <span className="font-semibold">{getAnswer(1)}</span>
            </div>

            <div className="text-sm">
              Gender & Age:{" "}
              <span className="font-semibold capitalize">{getAnswer(6)}</span> /{" "}
              <span className="font-semibold">{getAnswer(5)}</span>
            </div>

            <div className="text-sm">
              Date:{" "}
              <span className="font-semibold">
                {assignData?.appointmentStatus[0]?.refAppointmentDate
                  ? new Date(
                      assignData.appointmentStatus[0].refAppointmentDate
                    ).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "-"}
              </span>
            </div>

            <div className="text-sm">
              Scan Center:{" "}
              <span className="font-semibold">
                {assignData?.appointmentStatus[0]?.refSCName}
              </span>
            </div>
          </div>

          {/* Table Content */}
          {role?.type &&
            ["admin", "scribe", "radiologist", "wgdoctor"].includes(
              role?.type
            ) && (
              <div className="overflow-auto max-h-[40vh] rounded-md shadow border border-gray-200 w-full max-w-3xl mx-auto my-4">
                <table className="min-w-full divide-y divide-gray-200  text-left">
                  <thead className="bg-[#a3b1a0] text-white text-[12px] text-center 2xl:text-base sticky top-0 z-10">
                    <tr>
                      <th className="px-1 py-2 font-semibold">Created by</th>
                      <th className="px-1 py-2 font-semibold">Start</th>
                      <th className="px-1 py-2 font-semibold">End</th>
                      <th className="px-1 py-2 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignData?.reportHistoryData ? (
                      <>
                        {assignData?.reportHistoryData.map((item, idx) => (
                          <tr
                            key={idx}
                            className={
                              idx % 2 === 0 ? "bg-white" : "bg-[#f9f2ea]"
                            }
                          >
                            <td className="px-2 py-2 text-xs text-center">
                              {item.HandleUserName}
                            </td>
                            <td className="px-2 py-2 text-[10px] text-center">
                              <div className="space-y-1">
                                <span className="block">
                                  {new Date(
                                    item.refRHHandleStartTime
                                  ).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </span>
                                <span className="block">
                                  {new Date(
                                    item.refRHHandleStartTime
                                  ).toLocaleTimeString("en-GB", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                            </td>

                            <td className="px-2 py-2 text-[10px] text-center">
                              <div className="space-y-1">
                                {item.refRHHandleEndTime ? (
                                  <>
                                    <span className="block">
                                      {new Date(
                                        item.refRHHandleEndTime
                                      ).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                      })}
                                    </span>
                                    <span className="block">
                                      {new Date(
                                        item.refRHHandleEndTime
                                      ).toLocaleTimeString("en-GB", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </span>
                                  </>
                                ) : (
                                  <span className="block">-</span>
                                )}
                              </div>
                            </td>

                            <td className="px-2 py-2 text-[10px] text-center font-semibold">
                              <span
                                className={
                                  item.refRHHandleEndTime
                                    ? "text-green-600"
                                    : "text-gray-400"
                                }
                              >
                                {item.refRHHandleEndTime ? (
                                  <>
                                    <Dialog>
                                      <form>
                                        <DialogTrigger asChild>
                                          <div className="cursor-pointer">
                                            {item.refRHHandleStatus +
                                              " Completed"}
                                          </div>
                                        </DialogTrigger>
                                        <DialogContent className="">
                                          <DialogHeader>
                                            <DialogTitle>
                                              History Preview
                                            </DialogTitle>
                                          </DialogHeader>
                                          <div className="h-[70vh] overflow-y-auto w-[100%]">
                                            <TextEditor
                                              value={
                                                item.refRHHandleContentText
                                              }
                                              // onChange={setNotes}
                                              readOnly={syncStatus.Notes}
                                            />
                                          </div>
                                        </DialogContent>
                                      </form>
                                    </Dialog>
                                  </>
                                ) : (
                                  "-"
                                )}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </>
                    ) : (
                      <tr className="bg-[#f9f2ea]">
                        <td className="px-2 py-2 text-xs text-center">
                          No Data Found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

          {/* Buttons */}
          {tab === 4 && subTab === 4 && (
            <>
            <Button
            variant="greenTheme"
            className="text-xs w-full text-white px-3 py-2 mb-2 min-w-[48%]"
            onClick={() => setLoadTemplateStatus(true)}
            disabled={syncStatus.Notes}
          >
            Load Template
          </Button>

          <Dialog
                    onOpenChange={setLoadTemplateStatus}
                    open={loadTemplateStatus}
                  >
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Load Template</DialogTitle>
                      </DialogHeader>

                      <div className="flex gap-4">
                        <Input
                          type="text"
                          placeholder="Search template..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="mb-3 text-xs"
                        />
                        <PopoverDialog
                          open={popoverOpen}
                          onOpenChange={setPopoverOpen}
                        >
                          <div onClick={(e) => e.stopPropagation()}>
                            <PopoverTriggerDialog asChild>
                              <Button
                                variant="greenTheme"
                                className="text-xs text-white"
                                onClick={() => setPopoverOpen(true)}
                              >
                                <Plus size={16} />
                              </Button>
                            </PopoverTriggerDialog>
                            <PopoverContentDialog className="w-80">
                              <div className="grid gap-4">
                                <div className="space-y-2">
                                  <h4 className="leading-none font-medium">
                                    Upload New Template
                                  </h4>
                                </div>
                                <form
                                  onSubmit={(e) => {
                                    e.preventDefault();
                                    uploadReportFormate();
                                  }}
                                >
                                  <div className="grid gap-2">
                                    <div className="flex flex-col gap-2">
                                      <Label htmlFor="width">Name</Label>
                                      <Input
                                        id="name"
                                        className="col-span-2 h-8"
                                        value={fileName}
                                        onChange={(e) => {
                                          setFilename(e.target.value);
                                        }}
                                        required
                                      />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                      <Label htmlFor="width">Upload File</Label>
                                      <Input
                                        id="file"
                                        type="file"
                                        accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                        className="col-span-2 h-8"
                                        // value={fileName}
                                        onChange={handleFileChange}
                                        required
                                      />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                      <Button
                                        variant="greenTheme"
                                        className="text-xs text-white"
                                        type="submit"
                                      >
                                        {popoverLoading ? (
                                          <Loader className="animate-spin w-4 h-4" />
                                        ) : (
                                          "Upload Template"
                                        )}
                                      </Button>
                                    </div>
                                  </div>
                                </form>
                              </div>
                            </PopoverContentDialog>
                          </div>
                        </PopoverDialog>
                      </div>

                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {filteredTemplates.length > 0 ? (
                          filteredTemplates.map((data: any) => (
                            <div
                              key={data.refRFId}
                              className="text-xs px-3 py-2 rounded-sm border border-gray-200 flex justify-between items-center"
                            >
                              <div>{data.refRFName}</div>
                              <Button
                                variant="greenTheme"
                                className="text-xs text-white px-3 py-1 h-6"
                                onClick={() => {
                                  !loadingStatus && getTemplate(data.refRFId);
                                }}
                              >
                                {loadingStatus === data.refRFId ? (
                                  <Loader className="animate-spin w-4 h-4" />
                                ) : (
                                  "Load"
                                )}
                              </Button>
                            </div>
                          ))
                        ) : (
                          <div className="text-center text-sm text-gray-500">
                            No templates found.
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                  </>
          )
          
          }

          {role?.type && (
            <div
              className={`flex flex-wrap gap-2 ${
                location?.readOnly ? "pointer-events-none" : ""
              }`}
            >
              {reportStages.map(({ label, editStatus, status }, index) => {
                const isAllowed = stageRoleMap[label]?.includes(role?.type);

                const handleClick = () => {
                  if (!isAllowed) return;

                  if (label === "Sign Off") {
                    setShowMailDialog(true); // open dialog
                  } else if(status == "" && label == "Insert Signature") {
                    const date = new Date().toLocaleDateString();
                        console.log(userDetails);
                        const signatureRow = `
                    <br/>
                    <h3 class=\"ql-align-right\"><strong>Electronically signed by</strong></h3><h3 class=\"ql-align-right\"><strong>Dr. ${
                      userDetails.refUserFirstName
                    },</strong></h3>${
                          userDetails.specialization
                            ? '<h3 class="ql-align-right"><strong>' +
                              userDetails.specialization +
                              ",</strong></h3>"
                            : ""
                        }<h3 class=\"ql-align-right\"><strong><em>${date}</em></strong></h3>
                          
                      `;
                        const notesData = Notes + signatureRow;
                        setNotes(notesData);
                        setsyncStatus({
                          ...syncStatus,
                          Notes: false,
                        });
                  } else {
                    handleReportSubmit(status, editStatus); // directly call
                  }
                };

                return (
                  <Button
                    key={index}
                    variant="greenTheme"
                    className="text-xs text-white px-3 py-2 w-[48%] break-words whitespace-normal"
                    onClick={handleClick}
                    disabled={!isAllowed}
                    hidden={(label == "Insert Signature" &&  !(tab === 4 && subTab === 4))}
                  >
                    {label}
                  </Button>
                );
              })}
              <Dialog open={showMailDialog} onOpenChange={setShowMailDialog}>
                <DialogContent className="sm:max-w-[400px]">
                  <DialogHeader>
                    <DialogTitle>Select Email Recipients</DialogTitle>
                    <DialogDescription>
                      Select recipients to proceed with sending the email.
                    </DialogDescription>
                  </DialogHeader>

                  <div>
                    <Select value={mailOption} onValueChange={setMailOption}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose recipient" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="patient">Patient</SelectItem>
                        <SelectItem value="scancenter">
                          Scan Center Manager
                        </SelectItem>
                        <SelectItem value="both">
                          Patient and Scan Center Manager
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <DialogFooter>
                    <Button
                      variant="greenTheme"
                      disabled={!mailOption}
                      onClick={() => {
                        setShowMailDialog(false);
                        handleReportSubmit("Signed Off", false); // Pass what you need
                      }}
                    >
                      Submit
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
        <div className="w-[80%]">
          {tab === 1 && (
            <PatientInTakeForm
              fetchFormData={true}
              appointmentId={stateData.appointmentId}
              userId={stateData.userId}
              readOnly={true}
            />
          )}

          {tab === 2 && (
            <TechnicianPatientIntakeForm
              fetchFormData={true}
              fetchTechnicianForm={true}
              appointmentId={stateData.appointmentId}
              userId={stateData.userId}
              readOnly={true}
            />
          )}
          {tab === 3 && (
            <DicomList
              appointmentId={stateData.appointmentId}
              userId={stateData.userId}
            />
          )}
          {tab === 4 && (
            <>
              {subTab === 1 ? (
                <GeneralReport
                  reportFormData={reportFormData}
                  handleReportInputChange={handleReportInputChange}
                  patientFormData={responsePatientInTake}
                  handlePatientInputChange={handlePatientInputChange}
                  technicianFormData={technicianForm}
                  textEditor={{
                    breastImplant: {
                      value: breastImplantRight,
                      onChange: setBreastImplantRight,
                    },
                    patientHistory: {
                      value: patientHistory,
                      onChange: setPatientHistory,
                    }
                  }}
                  syncStatus={syncStatus}
                  setsyncStatus={setsyncStatus}
                  readOnly={location?.readOnly ? true : false}
                />
              ) : subTab === 2 ? (
                <RightReport
                  reportFormData={reportFormData}
                  handleReportInputChange={handleReportInputChange}
                  patientFormData={responsePatientInTake}
                  textEditor={{
                    breastDensityandImageRight: {
                      value: breastDensityandImageRight,
                      onChange: setBreastDensityandImageRight,
                    },
                    nippleAreolaSkinRight: {
                      value: nippleAreolaSkinRight,
                      onChange: setNippleAreolaSkinRight,
                    },
                    LesionsRight: {
                      value: LesionsRight,
                      onChange: setLesionsRight,
                    },
                    ComparisonPrior: {
                      value: ComparisonPrior,
                      onChange: setComparisonPrior,
                    },
                    grandularAndDuctalTissueRight: {
                      value: grandularAndDuctalTissueRight,
                      onChange: setGrandularAndDuctalTissueRight,
                    },
                    LymphNodesRight: {
                      value: LymphNodesRight,
                      onChange: setLymphNodesRight,
                    },
                  }}
                  syncStatus={syncStatus}
                  setsyncStatus={setsyncStatus}
                  readOnly={location?.readOnly ? true : false}
                />
              ) : subTab === 3 ? (
                <LeftReport
                  reportFormData={reportFormData}
                  handleReportInputChange={handleReportInputChange}
                  patientFormData={responsePatientInTake}
                  textEditor={{
                    breastDensityandImageLeft: {
                      value: breastDensityandImageLeft,
                      onChange: setBreastDensityandImageLeft,
                    },
                    nippleAreolaSkinLeft: {
                      value: nippleAreolaSkinLeft,
                      onChange: setNippleAreolaSkinLeft,
                    },
                    LesionsLeft: {
                      value: LesionsLeft,
                      onChange: setLesionsLeft,
                    },
                    ComparisonPriorLeft: {
                      value: ComparisonPriorLeft,
                      onChange: setComparisonPriorLeft,
                    },
                    grandularAndDuctalTissueLeft: {
                      value: grandularAndDuctalTissueLeft,
                      onChange: setGrandularAndDuctalTissueLeft,
                    },
                    LymphNodesLeft: {
                      value: LymphNodesLeft,
                      onChange: setLymphNodesLeft,
                    },
                  }}
                  syncStatus={syncStatus}
                  setsyncStatus={setsyncStatus}
                  readOnly={stateData.readOnly ? true : false}
                />
              ) : subTab === 4 ? (
                <NotesReport
                  reportFormData={reportFormData}
                  textEditor={{
                    breastImplant: {
                      value: breastImplantRight,
                      onChange: setBreastImplantRight,
                    },
                    breastDensityandImageRight: {
                      value: breastDensityandImageRight,
                      onChange: setBreastDensityandImageRight,
                    },
                    nippleAreolaSkinRight: {
                      value: nippleAreolaSkinRight,
                      onChange: setNippleAreolaSkinRight,
                    },
                    LesionsRight: {
                      value: LesionsRight,
                      onChange: setLesionsRight,
                    },
                    ComparisonPrior: {
                      value: ComparisonPrior,
                      onChange: setComparisonPrior,
                    },
                    grandularAndDuctalTissueRight: {
                      value: grandularAndDuctalTissueRight,
                      onChange: setGrandularAndDuctalTissueRight,
                    },
                    LymphNodesRight: {
                      value: LymphNodesRight,
                      onChange: setLymphNodesRight,
                    },
                    breastDensityandImageLeft: {
                      value: breastDensityandImageLeft,
                      onChange: setBreastDensityandImageLeft,
                    },
                    nippleAreolaSkinLeft: {
                      value: nippleAreolaSkinLeft,
                      onChange: setNippleAreolaSkinLeft,
                    },
                    LesionsLeft: {
                      value: LesionsLeft,
                      onChange: setLesionsLeft,
                    },
                    ComparisonPriorLeft: {
                      value: ComparisonPriorLeft,
                      onChange: setComparisonPriorLeft,
                    },
                    grandularAndDuctalTissueLeft: {
                      value: grandularAndDuctalTissueLeft,
                      onChange: setGrandularAndDuctalTissueLeft,
                    },
                    LymphNodesLeft: {
                      value: LymphNodesLeft,
                      onChange: setLymphNodesLeft,
                    },
                    ImpressionText: {
                      value: mainImpressionRecommendation.impressionText,
                      onChange: (text: string) =>
                        setMainImpressionRecommendation((prev) => ({
                          ...prev,
                          impressionText: text,
                        })),
                    },
                    OptionalImpressionText: {
                      value: optionalImpressionRecommendation.impressionText,
                      onChange: (text: string) =>
                        setOptionalImpressionRecommendation((prev) => ({
                          ...prev,
                          impressionText: text,
                        })),
                    },
                    RecommendationText: {
                      value: mainImpressionRecommendation.recommendationText,
                      onChange: (text: string) =>
                        setMainImpressionRecommendation((prev) => ({
                          ...prev,
                          recommendationText: text,
                        })),
                    },
                    OptionalRecommendationText: {
                      value:
                        optionalImpressionRecommendation.recommendationText,
                      onChange: (text: string) =>
                        setOptionalImpressionRecommendation((prev) => ({
                          ...prev,
                          recommendationText: text,
                        })),
                    },
                    CommonImpresRecommText: {
                      value: commonImpressRecomm.text,
                      onChange: (text: string) =>
                        setCommonImpressRecomm((prev) => ({
                          ...prev,
                          text: text,
                        })),
                    },
                  }}
                  syncStatus={syncStatus}
                  setsyncStatus={setsyncStatus}
                  Notes={Notes}
                  setNotes={setNotes}
                  name={getAnswer(1)}
                  gender={getAnswer(6) === "female" ? "F" : getAnswer(5)}
                  age={getAnswer(5)}
                  studyTime={
                    assignData?.reportHistoryData[
                      assignData?.reportHistoryData.length - 1
                    ].refRHHandleStartTime.toString() || ""
                  }
                  AppointmentDate={
                    assignData?.appointmentStatus[0]?.refAppointmentDate
                      ? assignData?.appointmentStatus[0]?.refAppointmentDate.toString()
                      : ""
                  }
                  ScancenterCode={
                    assignData?.appointmentStatus[0]?.refSCCustId || ""
                  }
                  patientDetails={patientDetails}
                  readOnly={stateData.readOnly ? true : false}
                />
              ) : (
                subTab === 5 && (
                  <Impression
                    mainImpressionRecommendation={mainImpressionRecommendation}
                    setMainImpressionRecommendation={
                      setMainImpressionRecommendation
                    }
                    optionalImpressionRecommendation={
                      optionalImpressionRecommendation
                    }
                    setOptionalImpressionRecommendation={
                      setOptionalImpressionRecommendation
                    }
                    showOptional={showOptional}
                    setShowOptional={setShowOptional}
                    commonImpressRecomm={commonImpressRecomm}
                    setCommonImpressRecomm={setCommonImpressRecomm}
                    readOnly={stateData.readOnly}
                  />
                )
              )}
            </>
          )}
        </div>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirm Navigation</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to leave this page? Changes you made may not
            be saved.
          </p>
          <DialogFooter className="mt-4">
            <Button variant="secondary" onClick={() => setShowDialog(false)}>
              Stay
            </Button>
            <Button variant="destructive" onClick={handleLeave}>
              Leave Anyway
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Report;
