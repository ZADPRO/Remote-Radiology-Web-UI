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
  breastImpantQuestions,
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
import { generateBreastImplantDetailsHTML } from "./BreastImplantDetails/BreastImplantDetailsEditor";
import { SymmentryGenerator } from "./GenerateReport/SymmetryGenerator";
import { AutoPopulateReport } from "./AutoPopulateReport";

export interface ReportQuestion {
  refRITFId?: number;
  questionId: number;
  answer: string;
}

interface AssignReportResponse {
  appointmentStatus: AppointmentStatus[];
  reportHistoryData: ReportHistoryData[];
  easeQTReportAccess: boolean;
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

export interface FileData {
  base64Data: string;
  contentType: string;
}

const Report: React.FC = () => {
  const [tab, setTab] = useState<number>(4);

  const [subTab, setSubTab] = useState<number>(4);

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

  const handleLeave = async (saveStatus: boolean) => {
    allowNavigationRef.current = true;
    setShowDialog(false);

    if (saveStatus) {
      assignData?.appointmentStatus[0]?.refAppointmentComplete &&
        (await handleReportSubmit(
          assignData?.appointmentStatus[0]?.refAppointmentComplete,
          false,
          true
        ));
    } else navigate(-1);
  };

  const [reportFormData, setReportFormData] = useState<ReportQuestion[]>(
    Array.from({ length: 200 }, (_, index) => ({
      questionId: 1 + index,
      answer: "",
    }))
  ); //current higgest question id: 116

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
    symmetry: true,
  });

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

    if (syncStatus.breastImplant) {
      setBreastImplantRight(
        generateBreastImplantDetailsHTML(reportFormData, breastImpantQuestions)
      );
    }

    if (syncStatus.symmetry) {
      setSymmetry(SymmentryGenerator(reportFormData));
    }
  }, [reportFormData, syncStatus]);

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
  const [symmetry, setSymmetry] = useState("");
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
      selectedImpressionIdRight: "",
      selectedRecommendationIdRight: "",
      impressionTextRight: "",
      recommendationTextRight: "",
    });

  const [
    optionalImpressionRecommendation,
    setOptionalImpressionRecommendation,
  ] = useState({
    selectedImpressionId: "",
    selectedRecommendationId: "",
    impressionText: "",
    recommendationText: "",
    selectedImpressionIdRight: "",
    selectedRecommendationIdRight: "",
    impressionTextRight: "",
    recommendationTextRight: "",
  });

  const [showOptional, setShowOptional] = useState({
    impression: false,
    recommendation: false,
    impressionRight: false,
    recommendationRight: false,
  });

  const [commonImpressRecomm, setCommonImpressRecomm] = useState<{
    id: string;
    text: string;
    idRight: string;
    textRight: string;
  }>({
    id: "",
    text: "",
    idRight: "",
    textRight: "",
  });

  const accessibleTabs = [1, 2, 3, 5]; // Tabs requiring access
  const finalTab = 4; // Final Report is always accessible

  // Only check easeQTReportAccess for restricted roles

  const isTabAccessible = (value: number) => {
    return (
      value === finalTab ||
      (accessibleTabs.includes(value) && assignData?.easeQTReportAccess)
    );
  };

  const [ScanCenterImg, setScanCenterImg] = useState<FileData | null>(null);
  const [ScanCenterAddress, setScanCenterAddress] = useState<string>("");

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
        easeQTReportAccess: boolean;
        reportFormateList: any;
        userDeatils: any;
        patientDetails: any;
        status: boolean;
        ScanCenterImg: FileData;
        ScancenterAddress: string;
      } = await reportService.assignReport(
        stateData.appointmentId,
        stateData.userId,
        stateData.readOnly
      );

      console.log(response);

      if (response.status) {
        setScanCenterImg(response.ScanCenterImg);
        setScanCenterAddress(response.ScancenterAddress);
        // setScanCenterImg(response.ScanCenterImg);
        setAssignData({
          appointmentStatus: response.appointmentStatus,
          reportHistoryData: response.reportHistoryData || [],
          easeQTReportAccess: response.easeQTReportAccess,
        });

        setMainImpressionRecommendation((prev) => ({
          ...prev,
          selectedImpressionId:
            response.appointmentStatus[0].refAppointmentImpression,
          selectedRecommendationId:
            response.appointmentStatus[0].refAppointmentRecommendation,
          selectedImpressionIdRight:
            response.appointmentStatus[0].refAppointmentImpressionRight,
          selectedRecommendationIdRight:
            response.appointmentStatus[0].refAppointmentRecommendationRight,
        }));
        setOptionalImpressionRecommendation((prev) => ({
          ...prev,
          selectedImpressionId:
            response.appointmentStatus[0].refAppointmentImpressionAdditional,
          selectedRecommendationId:
            response.appointmentStatus[0]
              .refAppointmentRecommendationAdditional,
          selectedImpressionIdRight:
            response.appointmentStatus[0]
              .refAppointmentImpressionAdditionalRight,
          selectedRecommendationIdRight:
            response.appointmentStatus[0]
              .refAppointmentRecommendationAdditionalRight,
        }));
        setShowOptional(() => ({
          impression:
            response.appointmentStatus[0].refAppointmentImpressionAdditional !=
            "",
          recommendation:
            response.appointmentStatus[0]
              .refAppointmentRecommendationAdditional != "",
          impressionRight:
            response.appointmentStatus[0]
              .refAppointmentRecommendationAdditionalRight != "",
          recommendationRight:
            response.appointmentStatus[0]
              .refAppointmentRecommendationAdditionalRight != "",
        }));

        setCommonImpressRecomm((prev) => ({
          ...prev,
          id: response.appointmentStatus[0]
            .refAppointmentCommonImpressionRecommendation,
          idRight:
            response.appointmentStatus[0]
              .refAppointmentCommonImpressionRecommendationRight,
        }));

        setTemplates(response.reportFormateList || []);
        setTechnicianForm(response.technicianIntakeFormData || []);
        if (response.reportIntakeFormData) {
          setReportFormData(response.reportIntakeFormData);
        }
        setResponsePatientInTake(response.intakeFormData || []);
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
            symmetry: true,
          });
        }
        setUserDetails(response.userDeatils[0]);
        setPatintDetails(response.patientDetails[0]);

        if (!response.easeQTReportAccess) {
          setsyncStatus({
            ...syncStatus,
            Notes: false,
          });
        } else {
          setsyncStatus({
            ...syncStatus,
            Notes:
              response.reportTextContentData[0]?.refRTSyncStatus === null
                ? true
                : response.reportTextContentData[0]?.refRTSyncStatus,
          });
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getTechnicianAnswer = (id: number) =>
    technicianForm.find((q) => q.questionId === id)?.answer || "";

  const ReportResetAll = () => {
    const previousAnswer1 = getreportAnswer(1); // ❗Grab before reset

    let newFormData = Array.from({ length: 200 }, (_, index) => ({
      questionId: index + 1,
      answer: "",
    }));

    const specificAnswers: Record<number, string> = {
      117:
        getTechnicianAnswer(19) === "true"
          ? "Asymmetry"
          : "Symmetrical size and shape",
      118: getTechnicianAnswer(21),
      119: getTechnicianAnswer(22),
      1: previousAnswer1 === "" || "Present" ? "Present" : "",
      // 2:
      //   getreportAnswer(2) === "" || "Bilateral Similar"
      //     ? "Bilateral Similar"
      //     : "",
      // 3: getreportAnswer(3) === "" || "Subpectoral" ? "Subpectoral" : "",
      // 4: getreportAnswer(4) === "" || getPatientAnswer(80) ? getPatientAnswer(80) : "",
      5: getreportAnswer(5) === "" || "None" ? "None" : "",
      6: getreportAnswer(6) === "" || "None" ? "None" : "",
      9: getreportAnswer(9) === "" || "Absent" ? "Absent" : "",
      116:
        getreportAnswer(116) === "" || getPatientAnswer(81)
          ? getPatientAnswer(81)
          : "",
      110: getreportAnswer(110) === "" || "Present" ? "Present" : "",
      14: getreportAnswer(14) === "" || "Acceptable" ? "Acceptable" : "",
      15:
        getreportAnswer(15) === "" || "Heterogeneously Dense"
          ? "Heterogeneously Dense"
          : "",
      17: getreportAnswer(17) === "" || "Symmetry" ? "Symmetry" : "",
      111: getreportAnswer(111) === "" || "Present" ? "Present" : "",
      19: getreportAnswer(19) === "" || "Normal" ? "Normal" : "",
      21: getreportAnswer(21) === "" || "Absent" ? "Absent" : "",
      23: getreportAnswer(23) === "" || "Normal" ? "Normal" : "",
      18:
        getreportAnswer(18) === "" ||
        getPatientAnswer("Right" === "Right" ? 112 : 113) ||
        "Absent"
          ? getPatientAnswer("Right" === "Right" ? 112 : 113) || "Absent"
          : "",
      112: getreportAnswer(112) === "" || "Present" ? "Present" : "",
      25: getreportAnswer(25) === "" || "Normal" ? "Normal" : "",
      26: getreportAnswer(26) === "" || "Absent" ? "Absent" : "",
      27: getreportAnswer(27) === "" || "Absent" ? "Absent" : "",
      28: getreportAnswer(28) === "" || "Absent" ? "Absent" : "",
      29: getreportAnswer(29) === "" || "Absent" ? "Absent" : "",
      32: getreportAnswer(32) === "" || "Absent" ? "Absent" : "",
      34: getreportAnswer(34) === "" || "Absent" ? "Absent" : "",

      113: getreportAnswer(113) === "" || "Present" ? "Present" : "",
      57: getreportAnswer(57) === "" || "Acceptable" ? "Acceptable" : "",
      58:
        getreportAnswer(58) === "" || "Heterogeneously Dense"
          ? "Heterogeneously Dense"
          : "",
      60: getreportAnswer(60) === "" || "Symmetry" ? "Symmetry" : "",
      114: getreportAnswer(114) === "" || "Present" ? "Present" : "",
      63: getreportAnswer(63) === "" || "Normal" ? "Normal" : "",
      65: getreportAnswer(65) === "" || "Absent" ? "Absent" : "",
      67: getreportAnswer(67) === "" || "Normal" ? "Normal" : "",
      61:
        getreportAnswer(61) === "" || getPatientAnswer(113) || "Absent"
          ? getPatientAnswer(113) || "Absent"
          : "",
      115: getreportAnswer(115) === "" || "Present" ? "Present" : "",
      69: getreportAnswer(69) === "" || "Normal" ? "Normal" : "",
      70: getreportAnswer(70) === "" || "Absent" ? "Absent" : "",
      71: getreportAnswer(71) === "" || "Absent" ? "Absent" : "",
      72: getreportAnswer(72) === "" || "Absent" ? "Absent" : "",
      73: getreportAnswer(73) === "" || "Absent" ? "Absent" : "",
      76: getreportAnswer(76) === "" || "Absent" ? "Absent" : "",
      78: getreportAnswer(78) === "" || "Absent" ? "Absent" : "",
    };

    newFormData = newFormData.map((q) =>
      specificAnswers[q.questionId]
        ? { ...q, answer: specificAnswers[q.questionId] }
        : q
    );

    setMainImpressionRecommendation({
      selectedImpressionId: "",
      selectedRecommendationId: "",
      impressionText: "",
      recommendationText: "",
      selectedImpressionIdRight: "",
      selectedRecommendationIdRight: "",
      impressionTextRight: "",
      recommendationTextRight: "",
    });

    setOptionalImpressionRecommendation({
      selectedImpressionId: "",
      selectedRecommendationId: "",
      impressionText: "",
      recommendationText: "",
      selectedImpressionIdRight: "",
      selectedRecommendationIdRight: "",
      impressionTextRight: "",
      recommendationTextRight: "",
    });

    setShowOptional({
      impression: false,
      recommendation: false,
      impressionRight: false,
      recommendationRight: false,
    });

    setCommonImpressRecomm({
      id: "",
      text: "",
      idRight: "",
      textRight: "",
    });

    setReportFormData(newFormData);

    console.log(getreportAnswer(1));
  };

  useEffect(() => {
    const generatePatientHistory = async () => {
      if (!responsePatientInTake) return;

      const getPatientAnswer = (id: number) =>
        responsePatientInTake.find((q) => q.questionId === id)?.answer || "";

      let reason = `<p><strong>HISTORY : </strong></p>`;
      reason += await SFormGeneration(responsePatientInTake);

      const categoryId = assignData?.appointmentStatus[0]?.refCategoryId;

      if (categoryId === 1) {
        reason += `<div><h3><strong>Indications: </strong></h3>
        <div><strong>Reason for having this QT scan: </strong>
        ${getPatientAnswer(11)}</div>
      `;
        // reason += `<p><strong>Patient Form:</strong> S Form</p>`;
      } else if (categoryId === 2) {
        reason += "" + (await DaFormReportGenerator(responsePatientInTake));
        reason += ` <div><h3><strong>Indications: </strong></h3>
        <div><strong>Reason for having this QT scan: </strong>
        ${getPatientAnswer(11)}</div>
      `;
        // reason += `<p><strong>Patient Form:</strong> Da Form</p>`;
      } else if (categoryId === 3) {
        reason += await DbFormReportGenerator(responsePatientInTake);
        reason += `
        <div><h3><strong>Indications: </strong></h3>
        <div><strong>Reason for having this QT scan: </strong>
        ${getPatientAnswer(11)}</div>
      `;
        // reason += `<p><strong>Patient Form:</strong> Db Form</p>`;
      } else if (categoryId === 4) {
        reason += await DcFormGeneration(responsePatientInTake);
        reason += `
        <div><h3><strong>Indications: </strong></h3>
        <div><strong>Reason for having this QT scan: </strong>
        ${getPatientAnswer(11)}</div>
      `;
        // reason += `<p><strong>Patient Form:</strong> Dc Form</p>`;
      }

      await setPatientHistory(reason);
    };

    generatePatientHistory();
  }, [responsePatientInTake]);

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
          <div>
   <div style="text-align: right;">
  ${
    ScanCenterImg?.base64Data
      ? `<img src="data:${ScanCenterImg.contentType};base64,${ScanCenterImg.base64Data}" alt="Logo" width="100" height="100"/>`
      : ""
  }
</div>
      </div>
           <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
           <tbody>
                <tr>
                    <td style="border: 1px solid #000; padding: 4px;"><strong>NAME</strong></td>
                    <td style="border: 1px solid #000; padding: 4px;">${getPatientAnswer(
                      1
                    )}</td>
                    <td style="border: 1px solid #000; padding: 4px;"><strong>DOB</strong></td>
                    <td style="border: 1px solid #000; padding: 4px;">${getPatientAnswer(
                      2
                    )}</td>
                                </tr>
                                <tr>
                                    <td style="border: 1px solid #000; padding: 4px;"><strong>AGE / GENDER</strong></td>
                                    <td style="border: 1px solid #000; padding: 4px;">${getPatientAnswer(
                                      5
                                    )} / ${
            getPatientAnswer(6) === "female"
              ? "F"
              : getPatientAnswer(6).toUpperCase()
          }</td>
                                    <td style="border: 1px solid #000; padding: 4px;"><strong>SCAN CENTER</strong></td>
                    <td style="border: 1px solid #000; padding: 4px;">${
                      assignData?.appointmentStatus[0]?.refSCCustId
                    }, ${ScanCenterAddress}</td>
                </tr>
                <tr>
                <td style="border: 1px solid #000; padding: 4px;"><strong>USERID</strong></td>
                    <td style="border: 1px solid #000; padding: 4px;">${
                      patientDetails.refUserCustId
                    }</td>
                    <td style="border: 1px solid #000; padding: 4px;"><strong>DATE OF VISIT</strong></td>
                    <td style="border: 1px solid #000; padding: 4px;">${
                      assignData?.appointmentStatus[0]?.refAppointmentDate
                        ? assignData?.appointmentStatus[0]?.refAppointmentDate.toString()
                        : ""
                    }</td>
                    
                </tr>
            </table>
           <br/>
  
  <h2><strong>QT ULTRASOUND BREAST IMAGING</strong></h2>
  
  <br/>

  ${patientHistory}

  <br />

  <p><strong>TECHNIQUE:</strong> Transmission and reflection multiplanar 3-dimensional ultrasound imaging of both breasts was performed using the QT Ultrasound Series 2000 Model-A scanner. Breast density was determined using the Quantitative Breast Density calculator. Images were reviewed in the QTviewer v2.6.2. The nipple-areolar complex, skin, Cooper's ligaments, breast fat distribution, penetrating arteries and veins, glandular and ductal tissues were evaluated. Images were reviewed in coronal, transaxial and sagittal planes.</p>

    <br />
    
            ` +
            response.message[0].refRFText +
            `
            <br/>
             <h3><strong>RIGHT BREAST:</strong></h3>
  <p><strong>IMPRESSION:</strong></p>
  <p>${mainImpressionRecommendation.impressionTextRight}</p>
 <p> ${optionalImpressionRecommendation.impressionTextRight}</p><br />

  <p><strong>RECOMMENDATION:</strong></p>
 <p> ${mainImpressionRecommendation.recommendationTextRight}</p>
  <p>${optionalImpressionRecommendation.recommendationTextRight}</p>

  <br />
  <p><i>${commonImpressRecomm.textRight}</i></p>

  <br/>
  <br/>

    <h3><strong>LEFT BREAST:</strong></h3>
  <p><strong>IMPRESSION:</strong></p>
  <p>${mainImpressionRecommendation.impressionText}</p>
 <p> ${optionalImpressionRecommendation.impressionText}</p><br />

  <p><strong>RECOMMENDATION:</strong></p>
 <p> ${mainImpressionRecommendation.recommendationText}</p>
  <p>${optionalImpressionRecommendation.recommendationText}</p>

  <br />
  <p><i>${commonImpressRecomm.text}</i></p>
  <br/>
  <strong><i><p>Patients are encouraged to continue routine annual breast cancer screening as appropriate for their age and risk profile. In addition to imaging, monthly breast self-examinations are recommended. Patients should monitor for any new lumps, focal thickening, changes in breast size or shape, skin dimpling, nipple inversion or discharge, or any other unusual changes. If any new symptoms or palpable abnormalities are identified between scheduled screenings, patients should promptly consult their healthcare provider for further evaluation.</p></i></strong>
  <strong><i><p>It is important to recognize that even findings which appear benign may warrant periodic imaging follow-up to ensure stability over time. Early detection of changes plays a key role in maintaining long-term breast health.</p></i></strong>
  <i><p>Nothing in this report is intended to be – nor should it be construed to be – an order or referral or a direction to the treating physician to order any particular diagnostic testing. The treating physician will decide whether or not to order or initiate a consultation for such testing and which qualified facility performs such testing.</p></i>
  <i><p>Please note that the device may not detect some non-invasive, atypical, in situ carcinomas or low-grade malignant lesions. These could be represented by abnormalities such as masses, architectural distortion or calcifications. Scars, dense breast tissue, and breast implants can obscure masses and other findings. Every image from the device is evaluated by a doctor and should be considered in combination with pertinent clinical, imaging, and pathological findings for each patient. Other patient-specific findings that may be relevant include the presence of breast lumps, nipple discharge or nipple/skin inversion or retraction which should be shared with the QT Imaging Center where you receive your scan and discussed with your doctor. Even if the doctor reading the QT scan determines that a scan is negative, the doctor may recommend follow-up with your primary care doctor/healthcare provider for clinical evaluation, additional imaging, and/or breast biopsy based on your medical history or other significant clinical findings. Discuss with your doctor/healthcare provider if you have any questions about your QT scan findings. Consultation with the doctor reading your QT scan is also available if requested. </p></i>
  <i><p>The QT Ultrasound Breast Scanner is an ultrasonic imaging system that provides reflection-mode and transmission-mode images of a patient’s breast and calculates breast fibroglandular volume and total breast volume. The device is not a replacement for screening mammography.” FDA 510k K162372 and K220933 
  The QT Ultrasound Breast Scanner Model 2000A satisfies the requirements of the Certification Mark of the ECM [CE Mark Certification of the European Union] – No. 0P210730.QTUTQ02” and is ISO 90001 and ISO 13485 compliant. 
  </p></i>
  <i><p>QT’s first blinded trial: Malik B, Iuanow E, Klock J. An Exploratory Multi-reader, Multicase Study Comparing Transmission Ultrasound to Mammography on Recall Rates and Detection Rates for Breast Cancer Lesions. Academic Radiology February 2021. https://www.sciencedirect.com/science/article/pii/S1076633220306462 ; https://doi.org/10.1016/j.acra.2020.11.011 </p></i>
  <i><p>QT’s most recent second blinded trial against DBT: Jiang Y, Iuanow E, Malik B and Klock J. A Multireader Multicase (MRMC) Receiver Operating Characteristic (ROC) Study Evaluating Noninferiority of Quantitative Transmission (QT) Ultrasound to Digital Breast Tomosynthesis (DBT) on Detection and Recall of Breast Lesions. Academic Radiology 2024. https://authors.elsevier.com/sd/article/S1076-6332(23)00716-X </p></i>

            `
        );
        setLoadTemplateStatus(false);
      }
    } catch (error) {
      console.log(error);
    }
    setLoadingStatus(0);
  };

  useEffect(() => {
    if(responsePatientInTake.length > 0 && technicianForm.length > 0)
    AutoPopulateReport(
      getPatientAnswer,
      getreportAnswer,
      getTechnicianAnswer,
      handleReportInputChange
    );
    console.log("QQqqq", responsePatientInTake, technicianForm)
  }, [responsePatientInTake, technicianForm]);

  useEffect(() => {
    handleAssignUser();
    // listDicomFiles();
  }, []);

  const [showMailDialog, setShowMailDialog] = useState(false);
  const [mailOption, setMailOption] = useState("none");

  const handleReportSubmit = async (
    movedStatus: string,
    editStatus: boolean,
    leaveStatus?: boolean
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
        impressionRight: mainImpressionRecommendation.selectedImpressionIdRight,
        recommendationRight:
          mainImpressionRecommendation.selectedRecommendationIdRight,
        impressionaddtionalRight:
          optionalImpressionRecommendation.selectedImpressionIdRight,
        recommendationaddtionalRight:
          optionalImpressionRecommendation.selectedRecommendationIdRight,
        commonImpressionRecommendationRight: commonImpressRecomm.idRight,
        editStatus: editStatus,
        patientMailStatus: mailOption === "patient" || mailOption === "both",
        managerMailStatus: mailOption === "scancenter" || mailOption === "both",
        leaveStatus: leaveStatus,
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

  const getPatientAnswer = (id: number) =>
    responsePatientInTake.find((q) => q.questionId === id)?.answer || "";

  const getreportAnswer = (id: number) =>
    reportFormData.find((q) => q.questionId === id)?.answer || "";

  const patientForm = (categoryId: number) => {
    if(categoryId == 1) {
      return "S Form";
    } else if(categoryId == 2) {
      return "Da Form"
    } else if(categoryId == 3) {
      return "Db Form"
    } else if(categoryId == 4) {
      return "Dc Form"
    } else return ""
  }

  return (
    <div className="h-dvh bg-[#edd1ce]">
      {loading && <LoadingOverlay />}
      <div className="w-full h-[10vh] bg-[#a3b1a0] flex shadow-sm">
        {/* Main Tabs */}
        <div className="flex w-3/5 h-full">
          <div className="w-48 object-cover h-auto flex items-center justify-center px-2">
            <img
              src={logo}
              alt="logo"
              className="max-w-full max-h-full object-contain"
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
              className={`flex-1 flex items-center justify-center text-sm 2xl:text-lg rounded-t-[2rem] border-t border-x font-semibold transition-all duration-150 relative ${
                tab === value
                  ? "bg-[#f8f4eb] rounded-t-[2rem] h-[95%] mt-auto shadow-md border-t"
                  : "hover:bg-[#b8c2b5] rounded-t-[2rem] h-[85%] mt-auto border-t"
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
            ].map(({ label, value }) => {
              const accessible = isTabAccessible(value);
              console.log(isTabAccessible(value));
              return (
                accessible && (
                  <div
                    key={label}
                    onClick={() => accessible && setSubTab(value)}
                    className={`flex-1 max-w-xl text-xs 2xl:text-lg text-center font-medium py-2 mx-1 rounded-md border cursor-pointer transition-all duration-200 ${
                      accessible
                        ? subTab === value
                          ? "bg-[#f8f4eb] border-[#3f3f3d] shadow-sm"
                          : "border-[#b4b4b4] hover:bg-[#d6d9d3]"
                        : "border-[#e0e0e0] text-gray-400 cursor-not-allowed bg-gray-100"
                    }`}
                  >
                    {label}
                  </div>
                )
              );
            })}
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
              Patient Name: <span className="font-semibold">{getPatientAnswer(1)}</span>
            </div>

            <div className="text-sm">
              Patient ID: <span className="font-semibold">{patientDetails.refUserCustId}</span>
            </div>

            <div className="text-sm">
              Age & Gender:{" "}
              <span className="font-semibold">{getPatientAnswer(5)}</span> /{" "}
              <span className="font-semibold capitalize">
                {getPatientAnswer(6)}
              </span>
            </div>

            <div className="text-sm">
              Patient Form: <span className="font-semibold">{patientForm(assignData?.appointmentStatus[0]?.refCategoryId || 0)}</span>
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
                    {assignData?.reportHistoryData &&
                    assignData?.reportHistoryData.length > 0 ? (
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
                                  item.refRHHandleEndTime &&
                                  item.refRHHandleStatus !== "Changes"
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
                                            {item.refRHHandleStatus ===
                                            "Changes"
                                              ? "Saved Changes"
                                              : item.refRHHandleStatus +
                                                " Completed"}
                                            {/* {item.refRHHandleStatus +
                                              " Completed"} */}
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

          {role?.type && (
            <div
              className={`flex flex-wrap gap-2 ${
                location?.readOnly ? "pointer-events-none" : ""
              }`}
            >
              {/* Buttons */}
              {/* {tab === 4 && subTab === 4 && ( */}
                <>
                  <Button
                    variant="greenTheme"
                    className="text-xs w-[48%] text-white px-3 py-2 mb-2 min-w-[48%]"
                    onClick={() => setLoadTemplateStatus(true)}
                    disabled={(tab !== 4 || subTab !== 4) || syncStatus.Notes}
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
              {/* )} */}
              <Button
                // key={index}
                variant="greenTheme"
                className="text-xs text-white px-3 py-2 w-[48%] break-words whitespace-normal"
                onClick={ReportResetAll}
                // disabled={!isAllowed}
                // hidden={
                //   label == "Insert Signature" &&
                //   !(tab === 4 && subTab === 4)
                // }
              >
                Reset to Default
              </Button>

              {reportStages.map(({ label, editStatus, status }, index) => {
                const isAllowed = stageRoleMap[label]?.includes(role?.type);

                const handleClick = () => {
                  if (!isAllowed) return;

                  if (label === "Sign Off") {
                    setShowMailDialog(true); // open dialog
                  } else if (status == "" && label == "Insert Signature") {
                    const date = new Date().toLocaleDateString();
                    console.log(userDetails);
                    const signatureRow = `<br/><h3 class="ql-align-right"><strong>Electronically signed by Dr. ${
                      userDetails.refUserFirstName
                    },${
                      userDetails.specialization
                        ? "" + userDetails.specialization + ""
                        : ""
                    } on <em>${date}</em></strong></h3>`;

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
                    hidden={
                      label == "Insert Signature" &&
                      !(tab === 4 && subTab === 4)
                    }
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
              reportview={true}
            />
          )}

          {tab === 2 && (
            <TechnicianPatientIntakeForm
              fetchFormData={true}
              fetchTechnicianForm={true}
              appointmentId={stateData.appointmentId}
              userId={stateData.userId}
              readOnly={true}
              reportview={true}
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
                    },
                    symmetry: {
                      value: symmetry,
                      onChange: setSymmetry,
                    },
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
                <>
                  <NotesReport
                    reportFormData={reportFormData}
                    responsePatientInTake={responsePatientInTake}
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
                      ImpressionTextRight: {
                        value: mainImpressionRecommendation.impressionTextRight,
                        onChange: (text: string) =>
                          setMainImpressionRecommendation((prev) => ({
                            ...prev,
                            impressionTextRight: text,
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
                      OptionalImpressionTextRight: {
                        value:
                          optionalImpressionRecommendation.impressionTextRight,
                        onChange: (text: string) =>
                          setOptionalImpressionRecommendation((prev) => ({
                            ...prev,
                            impressionTextRight: text,
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
                      RecommendationTextRight: {
                        value:
                          mainImpressionRecommendation.recommendationTextRight,
                        onChange: (text: string) =>
                          setMainImpressionRecommendation((prev) => ({
                            ...prev,
                            recommendationTextRight: text,
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
                      OptionalRecommendationTextRight: {
                        value:
                          optionalImpressionRecommendation.recommendationTextRight,
                        onChange: (text: string) =>
                          setOptionalImpressionRecommendation((prev) => ({
                            ...prev,
                            recommendationTextRight: text,
                          })),
                      },
                      CommonImpresRecommTextVal: {
                        value: commonImpressRecomm.id,
                        onChange: (text: string) =>
                          setCommonImpressRecomm((prev) => ({
                            ...prev,
                            text: text,
                          })),
                      },
                      CommonImpresRecommTextRightVal: {
                        value: commonImpressRecomm.idRight,
                        onChange: (text: string) =>
                          setCommonImpressRecomm((prev) => ({
                            ...prev,
                            text: text,
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
                      CommonImpresRecommTextRight: {
                        value: commonImpressRecomm.textRight,
                        onChange: (text: string) =>
                          setCommonImpressRecomm((prev) => ({
                            ...prev,
                            text: text,
                          })),
                      },
                      symmetry: {
                        value: symmetry,
                        onChange: setSymmetry,
                      },
                    }}
                    syncStatus={syncStatus}
                    setsyncStatus={setsyncStatus}
                    Notes={Notes}
                    setNotes={setNotes}
                    name={getPatientAnswer(1)}
                    gender={
                      getPatientAnswer(6) === "female"
                        ? "F"
                        : getPatientAnswer(6).toUpperCase()
                    }
                    age={getPatientAnswer(5)}
                    studyTime={getPatientAnswer(2)}
                    ScancenterAddress={ScanCenterAddress}
                    AppointmentDate={
                      assignData?.appointmentStatus[0]?.refAppointmentDate
                        ? assignData?.appointmentStatus[0]?.refAppointmentDate.toString()
                        : ""
                    }
                    ScancenterCode={
                      assignData?.appointmentStatus[0]?.refSCCustId || ""
                    }
                    //  ScancenterAddress={
                    //   assignData?.appointmentStatus[0]?.refSCCustId || ""
                    // }
                    patientDetails={patientDetails}
                    readOnly={stateData.readOnly ? true : false}
                    patientHistory={patientHistory}
                    ScanCenterImg={ScanCenterImg}
                    reportAccess={assignData?.easeQTReportAccess ? true : false}
                  />
                </>
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
                    reportFormData={reportFormData}
                    handleReportInputChange={handleReportInputChange}
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
            <Button variant="destructive" onClick={() => handleLeave(false)}>
              Leave Anyway
            </Button>
            <Button variant="greenTheme" onClick={() => handleLeave(true)}>
              Save and Leave
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Report;
