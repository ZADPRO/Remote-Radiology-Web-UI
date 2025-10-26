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
// import Mammoth from "mammoth";
import { renderAsync } from "docx-preview";
import { Plus, Trash } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AppointmentStatus,
  FinalAddendumText,
  SignatureText,
  ReportHistoryData,
  reportService,
  GetOldReport,
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
import Impression, {
  additionalOptions,
  impressionRecommendation,
  NAadditionalOptions,
  NAimpressionRecommendation,
} from "./ImpressionRecommendation";
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
  grandularAndDuctalTissueLeftQuestions,
  grandularAndDuctalTissueRightQuestions,
  LymphNodesLeftQuestions,
  LymphNodesRightQuestions,
  nippleAreolaSkinLeftQuestions,
  nippleAreolaSkinRightQuestions,
  lesionsRightQuestions,
  symmetryQuestions,
  ComparisonPriorLeftQuestion,
  ComparisonPriorRightQuestion,
  lesionsLeftQuestions,
} from "./ReportQuestionsAssignment";
import { generateNippleAreolaBreastEditor } from "./NippleAreolaSkin/NippleAreolaEditor";
import { generateGrandularAndDuctalTissueReport } from "./GrandularAndDuctalTissue/GrandularAndDuctalTissueRightReport";
import { LymphNodesGenerateString } from "./GenerateReport/LymphNodes";
import { generateBreastImplantDetailsHTML } from "./BreastImplantDetails/BreastImplantDetailsEditor";
import { SymmentryGenerator } from "./GenerateReport/SymmetryGenerator";
import {
  AutoPopulateReport,
  AutoPopulateReportImpressRecomm,
} from "./AutoPopulateReport";
import { formatDateWithAge, formatReadableDate } from "@/utlis/calculateAge";
import { PatientHistoryReportGenerator } from "./GenerateReport/PatientHistoryReportGenerator";
import { useSpeechRecognition } from "react-speech-recognition";
import PreviewFile from "@/components/FileView/PreviewFile";
import { LesionsVal } from "./Lisons/LesionsRightString";
import axios from "axios";
import { generateReportsPdfBlob } from "@/utlis/downloadReportsPdf";

export interface ReportQuestion {
  refRITFId?: number;
  questionId: number;
  answer: string;
}

export interface AssignReportResponse {
  appointmentStatus: AppointmentStatus[];
  reportHistoryData: ReportHistoryData[];
  easeQTReportAccess: boolean;
  naSystemReportAccess: boolean;
}

interface TextEditorContent {
  refRTCId: number;
  refRTCText: string;
  refRTSyncStatus: boolean;
  refRTPatientHistorySyncStatus: boolean;
  refRTBreastImplantSyncStatus: boolean;
  refRTSymmetrySyncStatus: boolean;
  refRTBreastDensityandImageRightSyncStatus: boolean;
  refRTNippleAreolaSkinRightSyncStatus: boolean;
  refRTLesionsRightSyncStatus: boolean;
  refRTComparisonPriorSyncStatus: boolean;
  refRTGrandularAndDuctalTissueRightSyncStatus: boolean;
  refRTLymphNodesRightSyncStatus: boolean;
  refRTBreastDensityandImageLeftSyncStatus: boolean;
  refRTNippleAreolaSkinLeftSyncStatus: boolean;
  refRTLesionsLeftSyncStatus: boolean;
  refRTComparisonPriorLeftSyncStatus: boolean;
  refRTGrandularAndDuctalTissueLeftSyncStatus: boolean;
  refRTLymphNodesLeftSyncStatus: boolean;
  refRTBreastImplantReportText: string;
  refRTSymmetryReportText: string;
  refRTBreastDensityandImageRightReportText: string;
  refRTNippleAreolaSkinRightReportText: string;
  refRTLesionsRightReportText: string;
  refRTComparisonPriorReportText: string;
  refRTGrandularAndDuctalTissueRightReportText: string;
  refRTLymphNodesRightReportText: string;
  refRTBreastDensityandImageLeftReportText: string;
  refRTNippleAreolaSkinLeftReportText: string;
  refRTLesionsLeftReportText: string;
  refRTComparisonPriorLeftReportText: string;
  refRTGrandularAndDuctalTissueLeftReportText: string;
  refRTLymphNodesLeftReportText: string;
}

interface ReportTemplate {
  refRFName: string;
  refRFId: number;
  refRFCreatedBy: number;
  refRFCreatedAt: string;
  refUserCustId: string;
  refRFAccessStatus: string;
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

export type ChangedOneState = {
  reportQuestion: number[]; // or number[]
  reportTextContent: boolean;
  syncStatus: boolean;
  impression: boolean;
  recommendation: boolean;
  impressionaddtional: boolean;
  recommendationaddtional: boolean;
  commonImpressionRecommendation: boolean;
  impressionRight: boolean;
  recommendationRight: boolean;
  impressionaddtionalRight: boolean;
  recommendationaddtionalRight: boolean;
  commonImpressionRecommendationRight: boolean;
  artificatsLeft: boolean;
  artificatsRight: boolean;
  patienthistory: boolean;
  breastimplantImageText: boolean;
  symmetryImageText: boolean;
  breastdensityImageText: boolean;
  nippleareolaImageText: boolean;
  glandularImageText: boolean;
  lymphnodesImageText: boolean;
  breastdensityImageTextLeft: boolean;
  nippleareolaImageTextLeft: boolean;
  glandularImageTextLeft: boolean;
  lymphnodesImageTextLeft: boolean;
  breastImplantSyncStatus: boolean;
  symmetrySyncStatus: boolean;
  breastDensityandImageRightSyncStatus: boolean;
  nippleAreolaSkinRightSyncStatus: boolean;
  LesionsRightSyncStatus: boolean;
  ComparisonPriorSyncStatus: boolean;
  grandularAndDuctalTissueRightSyncStatus: boolean;
  LymphNodesRightSyncStatus: boolean;
  breastDensityandImageLeftSyncStatus: boolean;
  nippleAreolaSkinLeftSyncStatus: boolean;
  LesionsLeftSyncStatus: boolean;
  ComparisonPriorLeftSyncStatus: boolean;
  grandularAndDuctalTissueLeftSyncStatus: boolean;
  LymphNodesLeftSyncStatus: boolean;
  breastImplantReportText: boolean;
  symmetryReportText: boolean;
  breastDensityandImageRightReportText: boolean;
  nippleAreolaSkinRightReportText: boolean;
  LesionsRightReportText: boolean;
  ComparisonPriorReportText: boolean;
  grandularAndDuctalTissueRightReportText: boolean;
  LymphNodesRightReportText: boolean;
  breastDensityandImageLeftReportText: boolean;
  nippleAreolaSkinLeftReportText: boolean;
  LesionsLeftReportText: boolean;
  ComparisonPriorLeftReportText: boolean;
  grandularAndDuctalTissueLeftReportText: boolean;
  LymphNodesLeftReportText: boolean;
};

const Report: React.FC = () => {
  useEffect(() => {
    handleAssignUser();
    // listDicomFiles();
  }, []);

  const [tab, setTab] = useState<number>(4);

  const [subTab, setSubTab] = useState<number>(4);

  const [loading, setLoading] = useState(false);

  // const [selected, setSelected] = useState<"correct" | "edit">("correct");

  const { role, user } = useAuth();

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

  const [openReportPreview, setOpenReportPreview] = useState(false);
  const [openReportPreviewCurrent, setOpenReportPreviewCurrent] = useState(0);

  const [openReportPreviewData, setOpenReportPreviewData] = useState("");

  // Handle browser reload and back navigation
  useEffect(() => {
    if (stateData?.readOnly === false) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        //   if (changesDone && !allowNavigationRef.current) {
        //     e.preventDefault();
        //     e.returnValue = ""; // triggers confirmation dialog
        //   }
        // };

        if (!allowNavigationRef.current) {
          e.preventDefault();
          e.returnValue = ""; // triggers confirmation dialog
        }
      };

      // const handlePopState = () => {
      //   if (changesDone && !allowNavigationRef.current) {
      //     setShowDialog(true);
      //     history.replaceState({ fake: true }, "", window.location.href);
      //     history.pushState(null, "", window.location.href);
      //   }
      // };

      const handlePopState = () => {
        if (!allowNavigationRef.current) {
          setShowDialog(true);
          history.replaceState({ fake: true }, "", window.location.href);
          history.pushState(null, "", window.location.href);
        }
      };

      // if (changesDone) {
      window.addEventListener("beforeunload", handleBeforeUnload);
      window.addEventListener("popstate", handlePopState);
      history.replaceState({ fake: true }, "", window.location.href);
      history.pushState(null, "", window.location.href);
      // }

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, []);

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

  const [reportFormData, setReportFormData] = useState<ReportQuestion[]>([]); //current higgest question id: 133

  const [syncStatus, setsyncStatus] = useState({
    patientHistory: true,
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

  const [AutoReportAccess, setAutoReportAccess] = useState(false);
  const [AutoChangeAccess, setAutoChangeAccess] = useState(true);

  // const hasProcessedRef = useRef<{ hash: string | null }>({ hash: null });

  useEffect(() => {
    if (!reportFormData) return;

    // const currentHash = JSON.stringify({
    //   syncStatus,
    //   answers: reportFormData.map((q) => [q.questionId, q.answer]),
    // });

    // if (hasProcessedRef.current.hash === currentHash) return; // nothing new
    // hasProcessedRef.current.hash = currentHash; // memoise

    if (
      syncStatus.patientHistory &&
      patientHistory.length === 0 &&
      responsePatientInTake.length > 0
    ) {
      let reason = ``;
      // reason += `<p><strong>HISTORY : </strong></p>`;
      // reason += SFormGeneration(responsePatientInTake);

      const categoryId = assignData?.appointmentStatus[0]?.refCategoryId;

      if (categoryId === 1) {
        reason += `<div><strong>Indication:</strong> Screening : Routine Annual Checkup.<br/>
        <div><strong>History: </strong><br/>
          <div><strong>Reason for having this QT scan (Patient Stated): </strong>
          ${getPatientAnswer(11)}.</div>
        `;
        // reason += `<p><strong>Patient Form:</strong> S. Routine Breast Screening (For Routine Screening first-time or annual checkup with No Prior Abnormal Findings)</p>`;
      } else if (categoryId === 2) {
        // reason += "" + DaFormReportGenerator(responsePatientInTake);
        reason += `<div><strong>Indication:</strong> Diagnostic : For further evaluation of an Abnormal Symptom  or Image finding.<br/>
        <div><strong>History: </strong><br/>
          <div><strong>Reason for having this QT scan (Patient Stated): </strong>
          ${getPatientAnswer(11)}.</div>
        `;
        // reason += `<p><strong>Patient Form:</strong> Da. Diagnostic - Abnormal Symptom or Imaging (No Cancer Diagnosis Yet)</p>`;
      } else if (categoryId === 3) {
        // reason += DbFormReportGenerator(responsePatientInTake);
        reason += `<div><strong>Indication:</strong> Diagnostic : For further evaluation of a biopsy diagnosis.<br/>
        <div><strong>History: </strong><br/>
          <div><strong>Reason for having this QT scan (Patient Stated): </strong>
          ${getPatientAnswer(11)}.</div>
        `;
        // reason += `<p><strong>Patient Form:</strong> Db. Diagnostic - Biopsy Confirmed DCIS or Breast Cancer Diagnosis</p>`;
      } else if (categoryId === 4) {
        // reason += DcFormGeneration(responsePatientInTake);
        reason += `<div><strong>Indication:</strong> Comparative Study as follow up to a prior QT scan.<br/>
        <div><strong>History: </strong><br/>
          <div><strong>Reason for having this QT scan (Patient Stated): </strong>
          ${getPatientAnswer(11)}.</div>
        `;
        // reason += `<p><strong>Patient Form:</strong> Dc. Diagnostic - Comparison to a Prior QT Scan</p>`;
      }

      reason +=
        PatientHistoryReportGenerator(responsePatientInTake, technicianForm) +
        "<br/>";

      setPatientHistory(reason);
    }

    if (syncStatus.breastDensityandImageRight) {
      setBreastDensityandImageRight(
        generateRightBreastReportText(
          reportFormData,
          breastDensityandImageRightQuestions,
          "Right"
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

    // if (syncStatus.LesionsRight) {
    // setLesionsRight(
    //   LesionsRightString(reportFormData, lesionsRightQuestions, LesionsRight)
    // );
    // }

    // if (syncStatus.ComparisonPrior) {
    // setComparisonPrior(
    //   ComparisonPriorRightString(
    //     reportFormData,
    //     ComparisonPriorRightQuestion,
    //     "Right",
    //     ComparisonPrior
    //   )
    // );
    // }

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
          breastDensityandImageLeftQuestions,
          "Left"
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

    // if (syncStatus.LesionsLeft) {
    // setLesionsLeft(
    //   LesionsRightString(reportFormData, lesionsLeftQuestions, LesionsLeft)
    // );
    // }

    // if (syncStatus.ComparisonPriorLeft) {
    // setComparisonPriorLeft(
    //   ComparisonPriorRightString(
    //     reportFormData,
    //     ComparisonPriorLeftQuestion,
    //     "Left",
    //     ComparisonPriorLeft
    //   )
    // );
    // }

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

    console.log("^^^^", questionId, changedOne.reportQuestion);
    setChangedOne((prev) => ({
      ...prev,
      reportQuestion: prev.reportQuestion.includes(questionId)
        ? prev.reportQuestion
        : [...prev.reportQuestion, questionId],
      artificatsLeft: prev.artificatsLeft || questionId === 121,
      artificatsRight: prev.artificatsRight || questionId === 120,
    }));
    setReportFormData((prevData) =>
      prevData.map((q) =>
        q.questionId === questionId ? { ...q, answer: value } : q
      )
    );

    ++requestVersionRef.current;
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
    "Reviewed 1 Correct": ["admin", "wgdoctor", "doctor"],
    "Reviewed 1 Edit": ["admin", "wgdoctor", "doctor"],
    "Reviewed 2 Correct": ["codoctor", "doctor"],
    "Reviewed 2 Edit": ["codoctor", "doctor"],
    "Insert Signature": ["admin", "wgdoctor", "doctor", "codoctor"],
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

  const [performingProviderName, setPerformingProviderName] = useState("");
  const [verifyingProviderName, setVerifyingProviderName] = useState("");

  // const [dicomFiles, setDicomFiles] = useState<DicomFileList[]>([]);
  const [patientDetails, setPatintDetails]: any = useState([]);
  const [technicianForm, setTechnicianForm] = useState<
    ResponseTechnicianForm[]
  >([]);

  const [oldReport, setOldReport] = useState<GetOldReport[]>([]);

  const [loadTemplateStatus, setLoadTemplateStatus] = useState(false);
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingStatus, setLoadingStatus] = useState(0);
  const [deleteLoadingStatus, setDeleteLoadingStatus] = useState(0);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [fileName, setFilename] = useState("");
  const [accessStatus, setAccessStatus] = useState("private");
  const [fileData, setFileData] = useState("");
  const [popoverLoading, setPopoverLoading] = useState(false);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file && file.name.endsWith(".docx")) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;

        // Create a hidden temporary container
        const tempContainer = document.createElement("div");
        tempContainer.style.display = "none";
        document.body.appendChild(tempContainer);

        // Render DOCX into the hidden container
        await renderAsync(arrayBuffer, tempContainer);

        // Extract HTML string
        const htmlString = tempContainer.innerHTML;

        // Cleanup temp container
        document.body.removeChild(tempContainer);

        // Pass HTML string to your Quill editor
        setFileData(htmlString);
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
  const [breastImplantImage, setBreastImplantImage] = useState("");
  const [symmetry, setSymmetry] = useState("");
  const [symmentryImage, setSymmetryImage] = useState("");
  const [breastDensityandImageRight, setBreastDensityandImageRight] =
    useState("");
  const [breastDensityandImageRightImage, setBreastDensityandImageRightImage] =
    useState("");
  const [nippleAreolaSkinRight, setNippleAreolaSkinRight] = useState("");
  const [nippleAreolaSkinRightImage, setNippleAreolaSkinRightImage] =
    useState("");
  const [LesionsRight, setLesionsRight] = useState("");
  const [LesionsRightImage, setLesionsRightImage] = useState("");
  const [ComparisonPrior, setComparisonPrior] = useState("");
  const [grandularAndDuctalTissueRight, setGrandularAndDuctalTissueRight] =
    useState("");
  const [
    grandularAndDuctalTissueRightImage,
    setGrandularAndDuctalTissueRightImage,
  ] = useState("");
  const [LymphNodesRight, setLymphNodesRight] = useState("");
  const [LymphNodesRightImage, setLymphNodesRightImage] = useState("");
  const [breastDensityandImageLeft, setBreastDensityandImageLeft] =
    useState("");
  const [breastDensityandImageLeftImage, setBreastDensityandImageLeftImage] =
    useState("");
  const [nippleAreolaSkinLeft, setNippleAreolaSkinLeft] = useState("");
  const [nippleAreolaSkinLeftImage, setNippleAreolaSkinLeftImage] =
    useState("");
  const [LesionsLeft, setLesionsLeft] = useState("");
  const [ComparisonPriorLeft, setComparisonPriorLeft] = useState("");
  const [grandularAndDuctalTissueLeft, setGrandularAndDuctalTissueLeft] =
    useState("");
  const [
    grandularAndDuctalTissueLeftImage,
    setGrandularAndDuctalTissueLeftImage,
  ] = useState("");

  const [LymphNodesLeft, setLymphNodesLeft] = useState("");
  const [LymphNodesLeftImage, setLymphNodesLeftImage] = useState("");

  const [Notes, setNotes] = useState("");

  const [patientHistory, setPatientHistory] = useState("");

  const [addendumText, setAddendumText] = useState("");
  const [signatureText, setSignatureText] = useState("");

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
  const finalTab = [1, 2, 3, 4]; // Final Report is always accessible

  // Only check easeQTReportAccess for restricted roles

  const isTabAccessible = (value: number) => {
    return (
      finalTab.includes(value) ||
      (accessibleTabs.includes(value) &&
        (assignData?.easeQTReportAccess || assignData?.naSystemReportAccess))
    );
  };

  const [ScanCenterImg, setScanCenterImg] = useState<FileData | null>(null);
  const [ScanCenterAddress, setScanCenterAddress] = useState<string>("");

  const [changedOne, setChangedOne] = useState<ChangedOneState>({
    reportQuestion: [],
    reportTextContent: false,
    syncStatus: false,
    impression: false,
    recommendation: false,
    impressionaddtional: false,
    recommendationaddtional: false,
    commonImpressionRecommendation: false,
    impressionRight: false,
    recommendationRight: false,
    impressionaddtionalRight: false,
    recommendationaddtionalRight: false,
    commonImpressionRecommendationRight: false,
    artificatsLeft: false,
    artificatsRight: false,
    patienthistory: false,
    breastimplantImageText: false,
    symmetryImageText: false,
    breastdensityImageText: false,
    nippleareolaImageText: false,
    glandularImageText: false,
    lymphnodesImageText: false,
    breastdensityImageTextLeft: false,
    nippleareolaImageTextLeft: false,
    glandularImageTextLeft: false,
    lymphnodesImageTextLeft: false,
    breastImplantSyncStatus: false,
    symmetrySyncStatus: false,
    breastDensityandImageRightSyncStatus: false,
    nippleAreolaSkinRightSyncStatus: false,
    LesionsRightSyncStatus: false,
    ComparisonPriorSyncStatus: false,
    grandularAndDuctalTissueRightSyncStatus: false,
    LymphNodesRightSyncStatus: false,
    breastDensityandImageLeftSyncStatus: false,
    nippleAreolaSkinLeftSyncStatus: false,
    LesionsLeftSyncStatus: false,
    ComparisonPriorLeftSyncStatus: false,
    grandularAndDuctalTissueLeftSyncStatus: false,
    LymphNodesLeftSyncStatus: false,
    breastImplantReportText: false,
    symmetryReportText: false,
    breastDensityandImageRightReportText: false,
    nippleAreolaSkinRightReportText: false,
    LesionsRightReportText: false,
    ComparisonPriorReportText: false,
    grandularAndDuctalTissueRightReportText: false,
    LymphNodesRightReportText: false,
    breastDensityandImageLeftReportText: false,
    nippleAreolaSkinLeftReportText: false,
    LesionsLeftReportText: false,
    ComparisonPriorLeftReportText: false,
    grandularAndDuctalTissueLeftReportText: false,
    LymphNodesLeftReportText: false,
  });

  const patientReports = [
    {
      yesNocheckQId: 124,
      reportAvailableQId: 127,
      questionId: 128,
      label: "Thermogram",
    },
    {
      yesNocheckQId: 129,
      reportAvailableQId: 132,
      questionId: 133,
      label: "Mammogram",
    },
    {
      yesNocheckQId: 134,
      reportAvailableQId: 137,
      questionId: 138,
      label: "Breast Ultrasound",
    },
    {
      yesNocheckQId: 139,
      reportAvailableQId: 142,
      questionId: 143,
      label: "Breast MRI",
    },
    {
      yesNocheckQId: 144,
      reportAvailableQId: 147,
      questionId: 148,
      label: "PET/CT Scan",
    },
    {
      yesNocheckQId: 149,
      reportAvailableQId: 152,
      questionId: 153,
      label: "QT Imaging",
    },
    {
      yesNocheckQId: 154,
      reportAvailableQId: 157,
      questionId: 158,
      label: "Other Imaging",
    },
    {
      yesNocheckQId: 160,
      reportAvailableQId: 164,
      questionId: 165,
      label: "Biopsy",
    },
  ];

  const [patientpublicprivate, setPatientpublicprivate] = useState("");

  const HandleEmailRecepitent = () => {
    if (
      role?.type === "admin" ||
      role?.type === "technician" ||
      role?.type === "scadmin" ||
      role?.type === "doctor" ||
      role?.type === "codoctor"
    ) {
      return (
        <SelectContent>
          <SelectItem value="none">None</SelectItem>
          <SelectItem value="patient">Patient</SelectItem>
          <SelectItem value="scancenter">Scan Center Manager</SelectItem>
          <SelectItem value="both">Patient and Scan Center Manager</SelectItem>
        </SelectContent>
      );
    } else {
      return (
        <SelectContent>
          <SelectItem value="none">None</SelectItem>
          {patientpublicprivate !== "private" && (
            <SelectItem value="patient">Patient</SelectItem>
          )}
          <SelectItem value="scancenter">Scan Center Manager</SelectItem>
          {patientpublicprivate !== "private" && (
            <SelectItem value="both">
              Patient and Scan Center Manager
            </SelectItem>
          )}
        </SelectContent>
      );
    }
  };

  const handleAssignUser = async () => {
    setLoading(true);
    try {
      const response: {
        Addendum: FinalAddendumText[];
        appointmentStatus: AppointmentStatus[];
        reportHistoryData: ReportHistoryData[];
        intakeFormData: ResponsePatientForm[];
        reportIntakeFormData: ReportQuestion[];
        reportTextContentData: TextEditorContent[];
        technicianIntakeFormData: ResponseTechnicianForm[];
        easeQTReportAccess: boolean;
        naSystemReportAccess: boolean;
        reportFormateList: any;
        userDeatils: any;
        patientDetails: any;
        status: boolean;
        ScanCenterImg: FileData;
        ScancenterAddress: string;
        oldReport: GetOldReport[];
        patientpublicprivate: string;
        PerformingProviderName: string;
        VerifyingProviderName: string;
        ListAllSignature: SignatureText[];
      } = await reportService.assignReport(
        stateData.appointmentId,
        stateData.userId,
        stateData.readOnly
      );

      console.log("---------->", response);

      if (response.status) {
        setPerformingProviderName(response.PerformingProviderName);
        setVerifyingProviderName(response.VerifyingProviderName);
        setPatientpublicprivate(response.patientpublicprivate);
        setAutoReportAccess(true);
        setScanCenterImg(response.ScanCenterImg);
        setScanCenterAddress(response.ScancenterAddress);
        setScanCenterImg(response.ScanCenterImg);
        setOldReport(response.oldReport || []);

        if (response.ListAllSignature) {
          setSignatureText(
            response.ListAllSignature.map(
              (data: SignatureText) => `${data.refSText}`
            ).join("")
          );
        }

        if (
          response.appointmentStatus[0]
            .refAppointmentImpressionAdditionalRight !==
            optionalImpressionRecommendation.selectedImpressionIdRight ||
          response.appointmentStatus[0]
            .refAppointmentRecommendationAdditionalRight !==
            optionalImpressionRecommendation.selectedRecommendationIdRight ||
          response.appointmentStatus[0].refAppointmentImpressionAdditional !==
            optionalImpressionRecommendation.selectedImpressionId ||
          response.appointmentStatus[0]
            .refAppointmentRecommendationAdditional !==
            optionalImpressionRecommendation.selectedRecommendationId
        ) {
          setAdditionalChangesChangeStatus(!additionalChangesChangeStatus);
        }

        setAssignData({
          appointmentStatus: response.appointmentStatus,
          reportHistoryData: response.reportHistoryData || [],
          easeQTReportAccess: response.easeQTReportAccess || false,
          naSystemReportAccess: response.naSystemReportAccess || false,
        });

        let MainOptions = impressionRecommendation;
        if (
          (response.naSystemReportAccess || false) &&
          getReportAnswer(81) === "true"
        ) {
          MainOptions = NAimpressionRecommendation;
        }

        setMainImpressionRecommendation((prev) => ({
          ...prev,
          selectedImpressionId:
            response.appointmentStatus[0].refAppointmentImpression,
          impressionText:
            MainOptions.flatMap((cat) => cat.data).find(
              (item) =>
                item.id ===
                response.appointmentStatus[0].refAppointmentImpression
            )?.impressionText || "",
          selectedRecommendationId:
            response.appointmentStatus[0].refAppointmentRecommendation,
          recommendationText:
            MainOptions.flatMap((cat) => cat.data).find(
              (item) =>
                item.id ===
                response.appointmentStatus[0].refAppointmentImpression
            )?.recommendationText || "",
          selectedImpressionIdRight:
            response.appointmentStatus[0].refAppointmentImpressionRight,
          impressionTextRight:
            MainOptions.flatMap((cat) => cat.data).find(
              (item) =>
                item.id ===
                response.appointmentStatus[0].refAppointmentImpressionRight
            )?.impressionText || "",
          selectedRecommendationIdRight:
            response.appointmentStatus[0].refAppointmentRecommendationRight,
          recommendationTextRight:
            MainOptions.flatMap((cat) => cat.data).find(
              (item) =>
                item.id ===
                response.appointmentStatus[0].refAppointmentImpressionRight
            )?.recommendationText || "",
        }));

        setOptionalImpressionRecommendation((prev) => ({
          ...prev,
          selectedImpressionId:
            response.appointmentStatus[0].refAppointmentImpressionAdditional,
          impressionText: (response.appointmentStatus[0]
            .refAppointmentImpressionAdditional.length > 0
            ? JSON.parse(
                response.appointmentStatus[0].refAppointmentImpressionAdditional
              )
            : []
          )
            .map((item: any) => item.text)
            .join("<br/>"),
          selectedRecommendationId:
            response.appointmentStatus[0]
              .refAppointmentRecommendationAdditional,
          recommendationText: (response.appointmentStatus[0]
            .refAppointmentRecommendationAdditional.length > 0
            ? JSON.parse(
                response.appointmentStatus[0]
                  .refAppointmentRecommendationAdditional
              )
            : []
          )
            .map((item: any) => item.text)
            .join("<br/>"),
          selectedImpressionIdRight:
            response.appointmentStatus[0]
              .refAppointmentImpressionAdditionalRight,
          impressionTextRight: (response.appointmentStatus[0]
            .refAppointmentImpressionAdditionalRight.length > 0
            ? JSON.parse(
                response.appointmentStatus[0]
                  .refAppointmentImpressionAdditionalRight
              )
            : []
          )
            .map((item: any) => item.text)
            .join("<br/>"),
          selectedRecommendationIdRight:
            response.appointmentStatus[0]
              .refAppointmentRecommendationAdditionalRight,
          recommendationTextRight: (response.appointmentStatus[0]
            .refAppointmentRecommendationAdditionalRight.length > 0
            ? JSON.parse(
                response.appointmentStatus[0]
                  .refAppointmentRecommendationAdditionalRight
              )
            : []
          )
            .map((item: any) => item.text)
            .join("<br/>"),
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

        let Commonoptions = additionalOptions;
        if (
          (response.naSystemReportAccess || false) &&
          getReportAnswer(81) === "true"
        ) {
          Commonoptions = NAadditionalOptions;
        }

        setCommonImpressRecomm((prev) => ({
          ...prev,
          id: response.appointmentStatus[0]
            .refAppointmentCommonImpressionRecommendation,
          text:
            Commonoptions.find(
              (opt) =>
                opt.id ===
                response.appointmentStatus[0]
                  .refAppointmentCommonImpressionRecommendation
            )?.text || "",
          idRight:
            response.appointmentStatus[0]
              .refAppointmentCommonImpressionRecommendationRight,
          textRight:
            Commonoptions.find(
              (opt) =>
                opt.id ===
                response.appointmentStatus[0]
                  .refAppointmentCommonImpressionRecommendationRight
            )?.text || "",
        }));

        if (
          response.reportTextContentData[0].refRTPatientHistorySyncStatus ===
          false
        ) {
          setPatientHistory(
            response.appointmentStatus[0].refAppointmentPatietHistory
          );
        }

        if (
          response.appointmentStatus[0].refAppointmentBreastImplantImageText
        ) {
          setBreastImplantImage(
            response.appointmentStatus[0].refAppointmentBreastImplantImageText
          );
        }

        if (response.appointmentStatus[0].refAppointmentSymmetryImageText) {
          setSymmetryImage(
            response.appointmentStatus[0].refAppointmentSymmetryImageText
          );
        }

        if (
          response.appointmentStatus[0].refAppointmentBreastdensityImageText
        ) {
          setBreastDensityandImageRightImage(
            response.appointmentStatus[0].refAppointmentBreastdensityImageText
          );
        }

        if (response.appointmentStatus[0].refAppointmentNippleAreolaImageText) {
          setNippleAreolaSkinRightImage(
            response.appointmentStatus[0].refAppointmentNippleAreolaImageText
          );
        }

        if (response.appointmentStatus[0].refAppointmentGlandularImageText) {
          setGrandularAndDuctalTissueRightImage(
            response.appointmentStatus[0].refAppointmentGlandularImageText
          );
        }

        if (response.appointmentStatus[0].refAppointmentLymphnodeImageText) {
          setLymphNodesRightImage(
            response.appointmentStatus[0].refAppointmentLymphnodeImageText
          );
        }

        if (
          response.appointmentStatus[0].refAppointmentBreastdensityImageTextLeft
        ) {
          setBreastDensityandImageLeftImage(
            response.appointmentStatus[0]
              .refAppointmentBreastdensityImageTextLeft
          );
        }

        if (
          response.appointmentStatus[0].refAppointmentNippleAreolaImageTextLeft
        ) {
          setNippleAreolaSkinLeftImage(
            response.appointmentStatus[0]
              .refAppointmentNippleAreolaImageTextLeft
          );
        }

        if (
          response.appointmentStatus[0].refAppointmentGlandularImageTextLeft
        ) {
          setGrandularAndDuctalTissueLeftImage(
            response.appointmentStatus[0].refAppointmentGlandularImageTextLeft
          );
        }

        if (
          response.appointmentStatus[0].refAppointmentLymphnodeImageTextLeft
        ) {
          setLymphNodesLeftImage(
            response.appointmentStatus[0].refAppointmentLymphnodeImageTextLeft
          );
        }

        //Breast Implant
        if (!response.reportTextContentData[0].refRTBreastImplantSyncStatus) {
          setBreastImplantRight(
            response.reportTextContentData[0].refRTBreastImplantReportText
          );
        }

        //symmentry
        if (!response.reportTextContentData[0].refRTSymmetrySyncStatus) {
          setSymmetry(
            response.reportTextContentData[0].refRTSymmetryReportText
          );
        }

        //breastDensity Right
        if (
          !response.reportTextContentData[0]
            .refRTBreastDensityandImageRightSyncStatus
        ) {
          setBreastDensityandImageRight(
            response.reportTextContentData[0]
              .refRTBreastDensityandImageRightReportText
          );
        }

        //NippleAreola Right
        if (
          !response.reportTextContentData[0]
            .refRTNippleAreolaSkinRightSyncStatus
        ) {
          setNippleAreolaSkinRight(
            response.reportTextContentData[0]
              .refRTNippleAreolaSkinRightReportText
          );
        }

        //Glandular Right
        if (
          !response.reportTextContentData[0]
            .refRTGrandularAndDuctalTissueRightSyncStatus
        ) {
          setGrandularAndDuctalTissueRight(
            response.reportTextContentData[0]
              .refRTGrandularAndDuctalTissueRightReportText
          );
        }

        //Lymphnode Right
        if (!response.reportTextContentData[0].refRTLymphNodesRightSyncStatus) {
          setLymphNodesRight(
            response.reportTextContentData[0].refRTLymphNodesRightReportText
          );
        }

        // //Lesions Right
        // if (
        //   !(response.reportTextContentData[0].refRTLesionsRightS || false)
        // ) {
        setLesionsRight(
          response.reportTextContentData[0].refRTLesionsRightReportText
        );
        // }

        //ComparisonPrior Right
        setComparisonPrior(
          response.reportTextContentData[0].refRTComparisonPriorReportText
        );

        //breastDensity Left
        if (
          !response.reportTextContentData[0]
            .refRTBreastDensityandImageLeftSyncStatus
        ) {
          setBreastDensityandImageLeft(
            response.reportTextContentData[0]
              .refRTBreastDensityandImageLeftReportText
          );
        }

        //NippleAreola Left
        if (
          !response.reportTextContentData[0].refRTNippleAreolaSkinLeftSyncStatus
        ) {
          setNippleAreolaSkinLeft(
            response.reportTextContentData[0]
              .refRTNippleAreolaSkinLeftReportText
          );
        }

        //Glandular Left
        if (
          !response.reportTextContentData[0]
            .refRTGrandularAndDuctalTissueLeftSyncStatus
        ) {
          setGrandularAndDuctalTissueLeft(
            response.reportTextContentData[0]
              .refRTGrandularAndDuctalTissueLeftReportText
          );
        }

        //Lymphnode Left
        if (!response.reportTextContentData[0].refRTLymphNodesLeftSyncStatus) {
          setLymphNodesLeft(
            response.reportTextContentData[0].refRTLymphNodesLeftReportText
          );
        }

        // //Lesions Left
        // if (
        //   !(response.reportTextContentData[0].refRTLesionsRightS || false)
        // ) {
        setLesionsLeft(
          response.reportTextContentData[0].refRTLesionsLeftReportText
        );
        // }

        //ComparisonPrior Left
        setComparisonPriorLeft(
          response.reportTextContentData[0].refRTComparisonPriorLeftReportText
        );

        setTemplates(response.reportFormateList || []);
        setTechnicianForm(response.technicianIntakeFormData || []);
        if (response.reportIntakeFormData) {
          setReportFormData(response.reportIntakeFormData);
        } else {
          setReportFormData(
            Array.from({ length: 137 }, (_, index) => ({
              questionId: 1 + index,
              answer: "",
            }))
          );
        }

        setResponsePatientInTake(response.intakeFormData || []);
        if (response.reportTextContentData) {
          setNotes(response.reportTextContentData[0]?.refRTCText);
        }

        // let notesStatus = false;

        // if ((!stateData.readOnly) && (role?.id === 8)) {
        //   if (
        //     response.reportTextContentData[0]?.refRTSyncStatus === null ||
        //     response.reportTextContentData[0]?.refRTSyncStatus
        //   ) {
        //     notesStatus = true;
        //   }
        // }

        // console.log('Report.tsx -------------------------- >  1400  ',  response.reportTextContentData[0]?.refRTBreastImplantSyncStatus !==
        //             false);
        //             console.log('Report.tsx -------------------------- >  1401  ',  response.reportTextContentData[0]?.refRTBreastImplantReportText);

        setsyncStatus({
          patientHistory:
            response.reportTextContentData[0].refRTPatientHistorySyncStatus !==
            false,
          breastImplant:
            response.reportTextContentData[0]?.refRTBreastImplantSyncStatus !==
            false,
          breastDensityandImageRight:
            response.reportTextContentData[0]
              ?.refRTBreastDensityandImageRightSyncStatus !== false,
          nippleAreolaSkinRight:
            response.reportTextContentData[0]
              ?.refRTNippleAreolaSkinRightSyncStatus !== false,
          LesionsRight:
            response.reportTextContentData[0]?.refRTLesionsRightSyncStatus !==
            false,
          ComparisonPrior:
            response.reportTextContentData[0]
              ?.refRTComparisonPriorSyncStatus !== false,
          grandularAndDuctalTissueRight:
            response.reportTextContentData[0]
              ?.refRTGrandularAndDuctalTissueRightSyncStatus !== false,
          LymphNodesRight:
            response.reportTextContentData[0]
              ?.refRTLymphNodesRightSyncStatus !== false,
          breastDensityandImageLeft:
            response.reportTextContentData[0]
              ?.refRTBreastDensityandImageLeftSyncStatus !== false,
          nippleAreolaSkinLeft:
            response.reportTextContentData[0]
              ?.refRTNippleAreolaSkinLeftSyncStatus !== false,
          LesionsLeft:
            response.reportTextContentData[0]?.refRTLesionsLeftSyncStatus !==
            false,
          ComparisonPriorLeft:
            response.reportTextContentData[0]
              ?.refRTComparisonPriorLeftSyncStatus !== false,
          grandularAndDuctalTissueLeft:
            response.reportTextContentData[0]
              ?.refRTGrandularAndDuctalTissueLeftSyncStatus !== false,
          LymphNodesLeft:
            response.reportTextContentData[0]?.refRTLymphNodesLeftSyncStatus !==
            false,
          Notes:
            !stateData.readOnly && role?.id === 8
              ? false
              : response.reportTextContentData[0]?.refRTSyncStatus === null
              ? true
              : response.reportTextContentData[0]?.refRTSyncStatus,
          ImpressionsRecommendations: true,
          symmetry:
            response.reportTextContentData[0]?.refRTSymmetrySyncStatus !==
            false,
        });

        if (!stateData.readOnly && role?.id === 8) {
          setChangedOne((prev: any) => ({
            ...prev,
            syncStatus: true,
          }));
        }
        //  else {
        //   setsyncStatus({
        //     ...syncStatus,
        //     Notes:
        //       response.reportTextContentData[0]?.refRTSyncStatus === null
        //         ? true
        //         : response.reportTextContentData[0]?.refRTSyncStatus,
        //   });
        // }

        setUserDetails(response.userDeatils[0]);
        setPatintDetails(response.patientDetails[0]);
        // fecthautosave();

        response.Addendum &&
          setAddendumText(
            response.Addendum.map(
              (data: FinalAddendumText) =>
                `${data.refADCreatedAt} - ${data.refUserCustId}<br/>${data.refADText}`
            ).join("<br/><br/>") // extra line break between entries
          );

        // if (!response.easeQTReportAccess) {
        //   setsyncStatus({
        //     ...syncStatus,
        //     Notes: false,
        //     patientHistory: false,
        //   });
        // } else {
        // setsyncStatus({
        //   ...syncStatus,
        //   Notes:
        //     response.reportTextContentData[0]?.refRTSyncStatus === null
        //       ? true
        //       : response.reportTextContentData[0]?.refRTSyncStatus,
        // });
        // }

        if (!(response.easeQTReportAccess && response.naSystemReportAccess)) {
          if (response.easeQTReportAccess) {
            handleReportInputChange(81, "false");
          } else if (response.naSystemReportAccess) {
            handleReportInputChange(81, "true");
          }
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
    const previousAnswer1 = getReportAnswer(1); // ❗Grab before reset

    let newFormData = Array.from({ length: 137 }, (_, index) => ({
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
      //   getReportAnswer(2) === "" || "Bilateral Similar"
      //     ? "Bilateral Similar"
      //     : "",
      // 3: getReportAnswer(3) === "" || "Subpectoral (Retro-pectoral)" ? "Subpectoral (Retro-pectoral)" : "",
      // 4: getReportAnswer(4) === "" || getPatientAnswer(80) ? getPatientAnswer(80) : "",
      5: getReportAnswer(5) === "" || "None" ? "None" : "",
      6: getReportAnswer(6) === "" || "None" ? "None" : "",
      9: getReportAnswer(9) === "" || "Absent" ? "Absent" : "",
      116:
        getReportAnswer(116) === "" || getPatientAnswer(81)
          ? getPatientAnswer(81)
          : "",
      110: getReportAnswer(110) === "" || "Present" ? "Present" : "",
      14: getReportAnswer(14) === "" || "Acceptable" ? "Acceptable" : "",
      15:
        getReportAnswer(15) === "" || "Heterogeneously Dense"
          ? "Heterogeneously Dense"
          : "",
      17: getReportAnswer(17) === "" || "Symmetry" ? "Symmetry" : "",
      111: getReportAnswer(111) === "" || "Present" ? "Present" : "",
      19: getReportAnswer(19) === "" || "Normal" ? "Normal" : "",
      21: getReportAnswer(21) === "" || "Absent" ? "Absent" : "",
      23: getReportAnswer(23) === "" || "Normal" ? "Normal" : "",
      18:
        getReportAnswer(18) === "" ||
        getPatientAnswer("Right" === "Right" ? 112 : 113) ||
        "Absent"
          ? getPatientAnswer("Right" === "Right" ? 112 : 113) || "Absent"
          : "",
      112: getReportAnswer(112) === "" || "Present" ? "Present" : "",
      25: getReportAnswer(25) === "" || "Normal" ? "Normal" : "",
      26: getReportAnswer(26) === "" || "Absent" ? "Absent" : "",
      27: getReportAnswer(27) === "" || "Absent" ? "Absent" : "",
      28: getReportAnswer(28) === "" || "Absent" ? "Absent" : "",
      29: getReportAnswer(29) === "" || "Absent" ? "Absent" : "",
      32: getReportAnswer(32) === "" || "Absent" ? "Absent" : "",
      34: getReportAnswer(34) === "" || "Absent" ? "Absent" : "",

      113: getReportAnswer(113) === "" || "Present" ? "Present" : "",
      57: getReportAnswer(57) === "" || "Acceptable" ? "Acceptable" : "",
      58:
        getReportAnswer(58) === "" || "Heterogeneously Dense"
          ? "Heterogeneously Dense"
          : "",
      60: getReportAnswer(60) === "" || "Symmetry" ? "Symmetry" : "",
      114: getReportAnswer(114) === "" || "Present" ? "Present" : "",
      63: getReportAnswer(63) === "" || "Normal" ? "Normal" : "",
      65: getReportAnswer(65) === "" || "Absent" ? "Absent" : "",
      67: getReportAnswer(67) === "" || "Normal" ? "Normal" : "",
      61:
        getReportAnswer(61) === "" || getPatientAnswer(113) || "Absent"
          ? getPatientAnswer(113) || "Absent"
          : "",
      115: getReportAnswer(115) === "" || "Present" ? "Present" : "",
      69: getReportAnswer(69) === "" || "Normal" ? "Normal" : "",
      70: getReportAnswer(70) === "" || "Absent" ? "Absent" : "",
      71: getReportAnswer(71) === "" || "Absent" ? "Absent" : "",
      72: getReportAnswer(72) === "" || "Absent" ? "Absent" : "",
      73: getReportAnswer(73) === "" || "Absent" ? "Absent" : "",
      76: getReportAnswer(76) === "" || "Absent" ? "Absent" : "",
      78: getReportAnswer(78) === "" || "Absent" ? "Absent" : "",
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

    console.log(getReportAnswer(1));
  };

  // useEffect(() => {
  //   const generatePatientHistory = async () => {
  //     if (!responsePatientInTake) return;

  //     const getPatientAnswer = (id: number) =>
  //       responsePatientInTake.find((q) => q.questionId === id)?.answer || "";

  //     let reason = `<p><strong>HISTORY : </strong></p>`;
  //     reason += await SFormGeneration(responsePatientInTake);

  //     const categoryId = assignData?.appointmentStatus[0]?.refCategoryId;

  //     if (categoryId === 1) {
  //       reason += `<div><br/><strong>Indication:</strong> Screening<br/>
  //       <div><strong>Reason for having this QT scan: </strong>
  //       ${getPatientAnswer(11)}</div>
  //     `;
  //       // reason += `<p><strong>Patient Form:</strong> S. Routine Breast Screening (For Routine Screening first-time or annual checkup with No Prior Abnormal Findings)</p>`;
  //     } else if (categoryId === 2) {
  //       reason += "" + (await DaFormReportGenerator(responsePatientInTake));
  //       reason += `<div><br/><strong>Indication:</strong> Abnormal Symptom or Imaging<br/>
  //       <div><strong>Reason for having this QT scan: </strong>
  //       ${getPatientAnswer(11)}</div>
  //     `;
  //       // reason += `<p><strong>Patient Form:</strong> Da. Diagnostic - Abnormal Symptom or Imaging (No Cancer Diagnosis Yet)</p>`;
  //     } else if (categoryId === 3) {
  //       reason += await DbFormReportGenerator(responsePatientInTake);
  //       reason += `<div><br/><strong>Indication:</strong> Biopsy Proven Disease<br/>
  //       <div><strong>Reason for having this QT scan: </strong>
  //       ${getPatientAnswer(11)}</div>
  //     `;
  //       // reason += `<p><strong>Patient Form:</strong> Db. Diagnostic - Biopsy Confirmed DCIS or Breast Cancer Diagnosis</p>`;
  //     } else if (categoryId === 4) {
  //       reason += await DcFormGeneration(responsePatientInTake);
  //       reason += `<div><br/><strong>Indication:</strong> Comparison to Prior<br/>
  //       <div><strong>Reason for having this QT scan: </strong>
  //       ${getPatientAnswer(11)}</div>
  //     `;
  //       // reason += `<p><strong>Patient Form:</strong> Dc. Diagnostic - Comparison to a Prior QT Scan</p>`;
  //     }

  //     await setPatientHistory(reason);
  //   };

  //   if (syncStatus.patientHistory && responsePatientInTake.length > 0) {
  //     generatePatientHistory();
  //   }
  // }, [responsePatientInTake]);

  const uploadReportFormate = async () => {
    setPopoverLoading(true);
    try {
      const response: {
        id: number;
        status: boolean;
        refUserCustId: string;
      } = await reportService.uploadTemplate(fileName, fileData, accessStatus);

      console.log(response);

      if (response.status) {
        setTemplates((prev: any) => [
          {
            refRFName: fileName,
            refRFId: response.id,
            refRFCreatedBy: user?.refUserId,
            refRFCreatedAt: "",
            refUserCustId: response.refUserCustId,
            refRFAccessStatus: accessStatus,
          },
          ...prev,
        ]);
        setPopoverOpen(false);
        setFileData("");
        setFilename("");
        setAccessStatus("private");
      }
    } catch (error) {
      console.log(error);
    }
    setPopoverLoading(false);
  };

  const deleteTemplate = async (id: number) => {
    setDeleteLoadingStatus(id);
    try {
      const response: {
        status: boolean;
      } = await reportService.deleteTemplate(id);

      if (response.status) {
        setTemplates((prev: any) => prev.filter((t: any) => t.refRFId !== id));
      }
    } catch (error) {
      console.log(error);
    }
    setDeleteLoadingStatus(0);
  };

  const updateTemplate = async (id: number, accessStatus: string) => {
    try {
      const response: {
        status: boolean;
      } = await reportService.updateTemplate(id, accessStatus);

      if (response.status) {
        setTemplates((prevTemplates) =>
          prevTemplates.map((template) =>
            template.refRFId === id
              ? { ...template, refRFAccessStatus: accessStatus }
              : template
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
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
   <div style="text-align: left;">
  ${
    ScanCenterImg
      ? ScanCenterImg.contentType === "url"
        ? `<img src="${ScanCenterImg.base64Data.trim()}" alt="Logo" width="200px"/><br/><br/>`
        : `<img src="data:${ScanCenterImg.contentType};base64,${ScanCenterImg.base64Data}" alt="Logo" width="200px"/><br/><br/>`
      : ""
  }
</div>
      </div>
           <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
           <tbody>
                <tr>
                    <td style="border: 1px solid #000; padding: 4px;"><strong>NAME</strong></td>
                    <td style="border: 1px solid #000; padding: 4px;">${
                      patientDetails.refUserFirstName
                    }</td>
                    <td style="border: 1px solid #000; padding: 4px;"><strong>DOB</strong></td>
                    <td style="border: 1px solid #000; padding: 4px;">${
                      patientDetails.refUserDOB
                        ? formatDateWithAge(patientDetails.refUserDOB)
                        : ""
                    }</td>
                                </tr>
                                <tr>
                                    <td style="border: 1px solid #000; padding: 4px;"><strong>GENDER</strong></td>
                                    <td style="border: 1px solid #000; padding: 4px;"> ${
                                      patientDetails.refUserGender
                                        ? patientDetails.refUserGender ===
                                          "female"
                                          ? "F"
                                          : patientDetails.refUserGender.toUpperCase()
                                        : ``
                                    }</td>
                                    <td style="border: 1px solid #000; padding: 4px;"><strong>SCAN CENTER</strong></td>
                    <td style="border: 1px solid #000; padding: 4px;">${
                      assignData?.appointmentStatus[0]?.refSCCustId
                    }, ${ScanCenterAddress}</td>
                </tr>
                <tr>
                <td style="border: 1px solid #000; padding: 4px;"><strong>USER ID</strong></td>
                    <td style="border: 1px solid #000; padding: 4px;">${
                      patientDetails.refUserCustId
                    }</td>
                    <td style="border: 1px solid #000; padding: 4px;"><strong>DATE OF VISIT</strong></td>
                    <td style="border: 1px solid #000; padding: 4px;">${
                      assignData?.appointmentStatus[0]?.refAppointmentDate
                        ? formatReadableDate(
                            assignData?.appointmentStatus[0]?.refAppointmentDate
                          )
                        : ""
                    }</td>
                    
                </tr>
            </table>
           ${
             performingProviderName.length > 0 ||
             verifyingProviderName.length > 0
               ? `
      <br/>
  ${
    performingProviderName.length > 0
      ? `<p><strong>Performing Provider : ${performingProviderName}.</strong></p>`
      : ``
  }${
                   false // verifyingProviderName.length > 0
                     ? `<p><strong>Verifying Provider : ${verifyingProviderName}.</strong></p>`
                     : ``
                 }
      `
               : ``
           }

 <p><strong>QT ULTRASOUND BREAST IMAGING</strong></p>
  
  <br/>

  ${patientHistory}

  <br />

  <p><strong>TECHNIQUE:</strong> Transmission and reflection multiplanar 3-dimensional ultrasound breast imaging was performed using the QT Scanner. Images were reviewed with the QTviewer in coronal, axial, and sagittal planes.</p>

    <br />
    
            ` +
            response.message[0].refRFText +
            `
            <br/>
             <h3><strong>RIGHT BREAST:</strong></h3>
  <p><strong>IMPRESSION:</strong></p><br />

  <p><strong>RECOMMENDATION:</strong></p><br />

  <br/>
  <br/>

    <h3><strong>LEFT BREAST:</strong></h3>
  <p><strong>IMPRESSION:</strong></p><br />

  <p><strong>RECOMMENDATION:</strong></p><br />

  <strong><i><p>The QT Breast Acoustic CT<sup>TM</sup> Scanner is an ultrasonic imaging system that provides reflection-mode and transmission-mode images of a patient’s breast and calculates breast fibroglandular volume and total breast volume. The device is not a replacement for screening mammography. The images must be reviewed and interpreted by a licensed physician, such as a radiologist. </p></i></strong>
  <strong><i><p>Please note that the device may not detect some non-invasive, atypical, in situ carcinomas or low-grade malignant lesions. These could be represented by abnormalities such as masses, architectural distortion or calcifications. Every image from the device is evaluated by a doctor and should be considered in combination with pertinent clinical, imaging, and pathological findings for each patient. Other patient-specific findings that may be relevant include the presence of breast lumps, nipple discharge or nipple/skin inversion or retraction which should be shared with the medical center where you receive your scan and discussed with your doctor. Even if the doctor reading the QTscan determines that a scan is negative, the doctor may recommend follow-up with your primary care doctor/healthcare provider for clinical evaluation, additional imaging, and/or breast biopsy based on your medical history or other significant clinical findings. Discuss with your doctor/healthcare provider if you have any questions about your QTscan findings. Consultation with the doctor reading your QTscan is also available if requested.</p></i></strong>
            `
        );
        setChangedOne((prev) => ({
          ...prev,
          syncStatus: true,
          reportTextContent: true,
        }));
        setLoadTemplateStatus(false);
      }
    } catch (error) {
      console.log(error);
    }
    setLoadingStatus(0);
  };

  useEffect(() => {
    console.log(
      "###############",
      responsePatientInTake.length > 0 && technicianForm.length > 0
    );

    setMailOption(patientpublicprivate === "private" ? "none" : "both");
    if (responsePatientInTake.length > 0 && technicianForm.length > 0) {
      AutoPopulateReport(
        getPatientAnswer,
        getReportAnswer,
        getTechnicianAnswer,
        handleReportInputChange
      );
    } else {
      //Right Breast Access Check
      getReportAnswer(130) === "" && handleReportInputChange(130, "Present");

      //Left Breast Access Check
      getReportAnswer(131) === "" && handleReportInputChange(131, "Present");

      //Right Recommendation
      getReportAnswer(132) === "" && handleReportInputChange(132, "Present");

      //Left Recommendation
      getReportAnswer(133) === "" && handleReportInputChange(133, "Present");

      //BREAST DENSITY & IMAGE QUALITY (Right)
      getReportAnswer(113) === "" && handleReportInputChange(113, "Present");

      //BREAST DENSITY & IMAGE QUALITY (Left)
      getReportAnswer(110) === "" && handleReportInputChange(110, "Present");

      //NIPPLE, AREOLA & SKIN (Right)
      getReportAnswer(111) === "" && handleReportInputChange(111, "Present");

      //NIPPLE, AREOLA & SKIN (Left)
      getReportAnswer(114) === "" && handleReportInputChange(114, "Present");

      //GLANDULAR AND DUCTAL TISSUE (RIGHT)
      getReportAnswer(112) === "" && handleReportInputChange(112, "Present");

      //GLANDULAR AND DUCTAL TISSUE (LEFT)
      getReportAnswer(115) === "" && handleReportInputChange(115, "Present");

      //Breast Implant
      getReportAnswer(breastImpantQuestions.breastImplants) === "" &&
        handleReportInputChange(breastImpantQuestions.breastImplants, "Absent");

      // //Implant Configuration
      // getReportAnswer(breastImpantQuestions.implantConfiguration) === "" &&
      //   handleReportInputChange(
      //     breastImpantQuestions.implantConfiguration,
      //     "Bilateral Similar"
      //   );

      // // Implant Position
      // getReportAnswer(breastImpantQuestions.implantPositon) === "" &&
      //   handleReportInputChange(
      //     breastImpantQuestions.implantPositon,
      //     "Subpectoral (Retro-pectoral)"
      //   );

      //Displacement
      getReportAnswer(breastImpantQuestions.displacement) === "" &&
        handleReportInputChange(breastImpantQuestions.displacement, "None");

      // Contracture
      getReportAnswer(breastImpantQuestions.contracture) === "" &&
        handleReportInputChange(breastImpantQuestions.contracture, "None");

      //Rupture
      getReportAnswer(breastImpantQuestions.rupture) === "" &&
        handleReportInputChange(breastImpantQuestions.rupture, "Absent");

      // SYMMETRY
      getReportAnswer(symmetryQuestions.symmetry) === "" &&
        handleReportInputChange(
          symmetryQuestions.symmetry,
          "Symmetrical size and shape"
        );

      //Right
      // Breast Density
      getReportAnswer(breastDensityandImageRightQuestions.breastDensity) ===
        "" &&
        handleReportInputChange(
          breastDensityandImageRightQuestions.breastDensity,
          "Heterogeneously Dense"
        );

      // Symmetry
      getReportAnswer(breastDensityandImageRightQuestions.symmetry) === "" &&
        handleReportInputChange(
          breastDensityandImageRightQuestions.symmetry,
          "Symmetry"
        );

      // Image Quality
      getReportAnswer(breastDensityandImageRightQuestions.imageQuality) ===
        "" &&
        handleReportInputChange(
          breastDensityandImageRightQuestions.imageQuality,
          "Acceptable"
        );

      //Left
      // Breast Density
      getReportAnswer(breastDensityandImageLeftQuestions.breastDensity) ===
        "" &&
        handleReportInputChange(
          breastDensityandImageLeftQuestions.breastDensity,
          "Heterogeneously Dense"
        );

      // Symmetry
      getReportAnswer(breastDensityandImageLeftQuestions.symmetry) === "" &&
        handleReportInputChange(
          breastDensityandImageLeftQuestions.symmetry,
          "Symmetry"
        );

      // Image Quality
      getReportAnswer(breastDensityandImageLeftQuestions.imageQuality) === "" &&
        handleReportInputChange(
          breastDensityandImageLeftQuestions.imageQuality,
          "Acceptable"
        );

      //Right
      //NIPPLE, AREOLA & SKIN (Right)
      //Skin Changes
      getReportAnswer(nippleAreolaSkinRightQuestions.skinChanges) === "" &&
        handleReportInputChange(
          nippleAreolaSkinRightQuestions.skinChanges,
          "Normal"
        );

      // Nipple Deformity
      getReportAnswer(nippleAreolaSkinRightQuestions.nippleDeformity) === "" &&
        handleReportInputChange(
          nippleAreolaSkinRightQuestions.nippleDeformity,
          "Absent"
        );

      // Nipple Retraction
      getReportAnswer(nippleAreolaSkinRightQuestions.nippleRetraction) === "" &&
        handleReportInputChange(
          nippleAreolaSkinRightQuestions.nippleRetraction,
          "Absent"
        );

      // Architecture of Vascular and connective tissues
      getReportAnswer(nippleAreolaSkinRightQuestions.architecture) === "" &&
        handleReportInputChange(
          nippleAreolaSkinRightQuestions.architecture,
          "Normal"
        );

      //Left
      //NIPPLE, AREOLA & SKIN (left)
      //Skin Changes
      getReportAnswer(nippleAreolaSkinLeftQuestions.skinChanges) === "" &&
        handleReportInputChange(
          nippleAreolaSkinLeftQuestions.skinChanges,
          "Normal"
        );

      // Nipple Deformity
      getReportAnswer(nippleAreolaSkinLeftQuestions.nippleDeformity) === "" &&
        handleReportInputChange(
          nippleAreolaSkinLeftQuestions.nippleDeformity,
          "Absent"
        );

      // Nipple Retraction
      getReportAnswer(nippleAreolaSkinLeftQuestions.nippleRetraction) === "" &&
        handleReportInputChange(
          nippleAreolaSkinLeftQuestions.nippleRetraction,
          "Absent"
        );

      // Architecture of Vascular and connective tissues
      getReportAnswer(nippleAreolaSkinLeftQuestions.architecture) === "" &&
        handleReportInputChange(
          nippleAreolaSkinLeftQuestions.architecture,
          "Normal"
        );

      // Glandular And Ductal tissue (Right)
      getReportAnswer(
        grandularAndDuctalTissueRightQuestions.grandularSelect
      ) === "" &&
        handleReportInputChange(
          grandularAndDuctalTissueRightQuestions.grandularSelect,
          "Present"
        );

      // Benign Microcysts
      getReportAnswer(
        grandularAndDuctalTissueRightQuestions.benignMicroCysts
      ) === "" &&
        handleReportInputChange(
          grandularAndDuctalTissueRightQuestions.benignMicroCysts,
          "Absent"
        );

      // Benign Capsular Microcalcification
      getReportAnswer(grandularAndDuctalTissueRightQuestions.benignCapsular) ===
        "" &&
        handleReportInputChange(
          grandularAndDuctalTissueRightQuestions.benignCapsular,
          "Absent"
        );

      //Benign Fibronodular Density
      getReportAnswer(
        grandularAndDuctalTissueRightQuestions.benignFibronodular
      ) === "" &&
        handleReportInputChange(
          grandularAndDuctalTissueRightQuestions.benignFibronodular,
          "Absent"
        );

      //Ductal Prominence
      getReportAnswer(
        grandularAndDuctalTissueRightQuestions.ductalProminence
      ) === "" &&
        handleReportInputChange(
          grandularAndDuctalTissueRightQuestions.ductalProminence,
          "Absent"
        );

      //Calcifications Present
      getReportAnswer(
        grandularAndDuctalTissueRightQuestions.calcificationsPresent
      ) === "" &&
        handleReportInputChange(
          grandularAndDuctalTissueRightQuestions.calcificationsPresent,
          "Absent"
        );

      //Calcified Scar
      getReportAnswer(grandularAndDuctalTissueRightQuestions.calcifiedScar) ===
        "" &&
        handleReportInputChange(
          grandularAndDuctalTissueRightQuestions.calcifiedScar,
          "Absent"
        );

      // Glandular And Ductal tissue (Left)
      getReportAnswer(grandularAndDuctalTissueLeftQuestions.grandularSelect) ===
        "" &&
        handleReportInputChange(
          grandularAndDuctalTissueLeftQuestions.grandularSelect,
          "Present"
        );

      // Benign Microcysts
      getReportAnswer(
        grandularAndDuctalTissueLeftQuestions.benignMicroCysts
      ) === "" &&
        handleReportInputChange(
          grandularAndDuctalTissueLeftQuestions.benignMicroCysts,
          "Absent"
        );

      // Benign Capsular Microcalcification
      getReportAnswer(grandularAndDuctalTissueLeftQuestions.benignCapsular) ===
        "" &&
        handleReportInputChange(
          grandularAndDuctalTissueLeftQuestions.benignCapsular,
          "Absent"
        );

      //Benign Fibronodular Density
      getReportAnswer(
        grandularAndDuctalTissueLeftQuestions.benignFibronodular
      ) === "" &&
        handleReportInputChange(
          grandularAndDuctalTissueLeftQuestions.benignFibronodular,
          "Absent"
        );

      //Ductal Prominence
      getReportAnswer(
        grandularAndDuctalTissueLeftQuestions.ductalProminence
      ) === "" &&
        handleReportInputChange(
          grandularAndDuctalTissueLeftQuestions.ductalProminence,
          "Absent"
        );

      //Calcifications Present
      getReportAnswer(
        grandularAndDuctalTissueLeftQuestions.calcificationsPresent
      ) === "" &&
        handleReportInputChange(
          grandularAndDuctalTissueLeftQuestions.calcificationsPresent,
          "Absent"
        );

      //Calcified Scar
      getReportAnswer(grandularAndDuctalTissueLeftQuestions.calcifiedScar) ===
        "" &&
        handleReportInputChange(
          grandularAndDuctalTissueLeftQuestions.calcifiedScar,
          "Absent"
        );
    }
  }, [responsePatientInTake, technicianForm]);

  useEffect(() => {
    AutoPopulateReportImpressRecomm(
      mainImpressionRecommendation,
      setMainImpressionRecommendation,
      optionalImpressionRecommendation,
      setOptionalImpressionRecommendation,
      commonImpressRecomm,
      setCommonImpressRecomm,
      reportFormData,
      assignData
    );
  }, [assignData]);

  const [showMailDialog, setShowMailDialog] = useState(false);

  const [mailOption, setMailOption] = useState("");

  function quillWrapContent(html: string): string {
    if (!html) return "";

    let wrapped = html;

    // Replace <div> with <p> and </div> with </p>
    wrapped = wrapped.replace(/<div>/gi, "<p>").replace(/<\/div>/gi, "</p>");

    // // Optional: convert consecutive <br> to single <br> for cleaner Quill content
    // wrapped = wrapped.replace(/(<br\s*\/?>\s*){2,}/gi, "<br>");

    // Wrap content outside <p> with <p> (if any plain text exists)
    wrapped = wrapped.replace(/(^|>)([^<]+)(?=<|$)/g, (_, p1, p2) => {
      const text = p2.trim();
      return text ? `${p1}<p>${text}</p>` : p1;
    });

    return wrapped;
  }

  const handleSyncNotesReport = () => {
    let ReportNotes = "";

    if (syncStatus.Notes) {
      console.log(
        "Report.tsx -------------------------- >  2234  ",
        getReportAnswer(130) === "Present"
      );
      const FindAssessmentCategory = (val: string): string => {
        const O1 = ["0"];
        const N1 = ["1", "N1"];
        const N2 = ["1a", "1b", "7", "N2"];
        const A1 = [
          "2",
          "2a",
          "3",
          "3a",
          "3b",
          "3c",
          "3d",
          "3e",
          "3f",
          "3g",
          "4",
          "4a",
          "4b",
          "4c",
          "4d",
          "4e",
          "4f",
          "4g",
          "4h",
          "4i1",
          "4i2",
          "4j",
          "4k",
          "4l",
          "4m",
          "4n",
          "8",
          "8a",
          "10",
          "A1",
        ];
        const A2 = ["5", "6a", "A2"];
        const A3 = ["5a", "7b", "7c", "A3"];
        const A4 = ["6", "6b", "6c", "6d", "6e", "6f", "6h", "7e", "10a", "A4"];

        if (O1.includes(val))
          return "0 : Prior breast imaging is needed for interpretation";
        if (N1.includes(val)) return "N1 (Nomral 1)";
        if (N2.includes(val)) return "N2 (Nomral 2: Benign)";
        if (A1.includes(val)) return "A1 (Abnormal 1: Indeterminate)";
        if (A2.includes(val)) return "A2 (Abnormal 2: Possible malignancy)";
        if (A3.includes(val)) return "A3 (Abnormal 3: Most likely malignant)";
        if (A4.includes(val)) return "A4 (Abnormal 4: Known malignancy)";

        return ""; // fallback if no match
      };

      const breastDensityRight =
        getReportAnswer(breastDensityandImageRightQuestions.breastSelect) ==
        "Present"
          ? true
          : false;

      const nippleAreolaRight =
        getReportAnswer(nippleAreolaSkinRightQuestions.nippleSelect) ==
        "Present"
          ? true
          : false;
      const glandularRight =
        getReportAnswer(
          grandularAndDuctalTissueRightQuestions.grandularSelect
        ) == "Present"
          ? true
          : false;
      const lessionsRight =
        getReportAnswer(lesionsRightQuestions.lesionsr) == "Present"
          ? true
          : false;
      const lymphRight =
        getReportAnswer(LymphNodesRightQuestions.Intramammaryr) == "Present"
          ? true
          : false;
      const comparisonRight =
        getReportAnswer(ComparisonPriorRightQuestion.ComparisonPriorRight) ==
        "Present"
          ? true
          : false;
      const breastDensityLeft =
        getReportAnswer(breastDensityandImageRightQuestions.breastSelect) ==
        "Present"
          ? true
          : false;
      const nippleAreolaLeft =
        getReportAnswer(nippleAreolaSkinRightQuestions.nippleSelect) ==
        "Present"
          ? true
          : false;
      const glandularLeft =
        getReportAnswer(
          grandularAndDuctalTissueRightQuestions.grandularSelect
        ) == "Present"
          ? true
          : false;
      const lessionsLeft =
        getReportAnswer(lesionsLeftQuestions.lesionsr) == "Present"
          ? true
          : false;
      const lymphLeft =
        getReportAnswer(LymphNodesLeftQuestions.Intramammaryr) == "Present"
          ? true
          : false;
      const comparisonLeftVal =
        getReportAnswer(ComparisonPriorLeftQuestion.ComparisonPriorRight) ==
        "Present"
          ? true
          : false;

      let lesionsVal: LesionsVal = {} as LesionsVal;

      try {
        lesionsVal = JSON.parse(LesionsRight) as LesionsVal;
      } catch (err) {
        console.log(err);
        lesionsVal = {} as LesionsVal;
      }

      let lesionsValLeft: LesionsVal = {} as LesionsVal;

      try {
        lesionsValLeft = JSON.parse(LesionsLeft) as LesionsVal;
      } catch (err) {
        console.log(err);
        lesionsValLeft = {} as LesionsVal;
      }

      let comparison: string[] = [];

      try {
        comparison = JSON.parse(ComparisonPrior) as string[];
      } catch (err) {
        console.log(err);
        comparison = [] as string[];
      }

      let comparisonLeft: string[] = [];

      try {
        comparisonLeft = JSON.parse(ComparisonPriorLeft) as string[];
      } catch (err) {
        console.log(err);
        comparisonLeft = [] as string[];
      }

      ReportNotes =
        `
           <div>
           <div style="text-align: left;">
        ${
          ScanCenterImg
            ? ScanCenterImg.contentType === "url"
              ? `<img src="${ScanCenterImg.base64Data.trim()}" alt="Logo" width="200px"/><br/><br/>`
              : `<img src="data:${ScanCenterImg.contentType};base64,${ScanCenterImg.base64Data}" alt="Logo" width="200px"/><br/><br/>`
            : ""
        }
        </div>
          </div>
        <table width="100" border-collapse: collapse; font-size: 14px;">
          <tbody>
            <tr>
              <td style="border: 1px solid #000; padding: 4px;"><strong>NAME</strong></td>
              <td style="border: 1px solid #000; padding: 4px;">${
                patientDetails.refUserFirstName
              }</td>
              <td style="border: 1px solid #000; padding: 4px;"><strong>DOB</strong></td>
              <td style="border: 1px solid #000; padding: 4px;">${
                patientDetails.refUserDOB
                  ? formatDateWithAge(patientDetails.refUserDOB)
                  : ""
              }</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; padding: 4px;"><strong>GENDER</strong></td>
              <td style="border: 1px solid #000; padding: 4px;">${
                patientDetails.refUserGender
                  ? patientDetails.refUserGender === "female"
                    ? "F"
                    : patientDetails.refUserGender.toUpperCase()
                  : ``
              }</td>
              <td style="border: 1px solid #000; padding: 4px;"><strong>SCAN CENTER</strong></td>
              <td style="border: 1px solid #000; padding: 4px;">${
                assignData?.appointmentStatus[0]?.refSCCustId || ""
              }, ${ScanCenterAddress}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; padding: 4px;"><strong>USER ID</strong></td>
              <td style="border: 1px solid #000; padding: 4px;">${
                patientDetails.refUserCustId
              }</td>
              <td style="border: 1px solid #000; padding: 4px;"><strong>DATE OF VISIT</strong></td>
              <td style="border: 1px solid #000; padding: 4px;">${formatReadableDate(
                assignData?.appointmentStatus[0]?.refAppointmentDate
                  ? assignData?.appointmentStatus[0]?.refAppointmentDate.toString()
                  : ""
              )}</td>
            </tr>
          </tbody>
        </table>
    
        ${
          performingProviderName.length > 0 || verifyingProviderName.length > 0
            ? `
          <br/>
      ${
        performingProviderName.length > 0
          ? `<p><strong>Performing Provider : ${performingProviderName}.</strong></p>`
          : ``
      }${
                false // verifyingProviderName.length > 0
                  ? `<p><strong>Verifying Provider : ${verifyingProviderName}.</strong></p>`
                  : ``
              }
          `
            : ``
        }
    
      <br/>
      
      <p><strong>QT ULTRASOUND BREAST IMAGING</strong></p>
      
    
      ${patientHistory}
    
      <br />
    
      <p><strong>TECHNIQUE:</strong> Transmission and reflection multiplanar 3-dimensional ultrasound breast imaging was performed using the QT Scanner. Images were reviewed with the QTviewer in coronal, axial, and sagittal planes.</p>
    
      ${
        getReportAnswer(1) === "Present"
          ? `
        <br />
      <div><strong>BREAST IMPLANTS:</strong><br />${breastImplantRight}${
              breastImplantImage ? breastImplantImage : ""
            }</div>
        `
          : ``
      }
    
      ${
        symmetry
          ? `
        <br />
      <div>${symmetry}${symmentryImage ? symmentryImage : ""}</div>
        `
          : ``
      }
      <br />
    
      ${
        getReportAnswer(130) === "Present"
          ? `
        <p><strong>RIGHT BREAST FINDINGS:</strong></p>
    
      ${
        breastDensityRight
          ? `<span>${breastDensityandImageRight}</span>${
              breastDensityandImageRightImage.length > 7
                ? `<span>${breastDensityandImageRightImage}<br/></span>`
                : "<p><br/></p>"
            }`
          : ``
      }
      ${
        nippleAreolaRight
          ? `${nippleAreolaSkinRight}${
              nippleAreolaSkinRightImage.length > 7
                ? `<span>${nippleAreolaSkinRightImage}<br/></span>`
                : "<p><br/></p>"
            }`
          : ``
      }
      ${
        glandularRight
          ? `<p><strong>Glandular and ductal tissue: </strong></p>${grandularAndDuctalTissueRight}${
              grandularAndDuctalTissueRightImage.length > 7
                ? `<span>${grandularAndDuctalTissueRightImage}<br/></span>`
                : "<p><br/></p>"
            }`
          : ``
      }
      ${
        lessionsRight
          ? `${
              lesionsVal["simple cyst"] && lesionsVal["simple cyst"].length > 0
                ? lesionsVal["simple cyst"]
                    .map((data, index) => {
                      let dataArray: any[] = [];
                      const raw = getReportAnswer(
                        lesionsRightQuestions.simplecrstDatar
                      );
                      dataArray = raw ? JSON.parse(raw) : [];

                      return (
                        "" +
                        data +
                        (dataArray[index]?.ImageText
                          ? dataArray[index].ImageText
                          : "")
                      );
                    })
                    .join("")
                : ""
            }${
              lesionsVal["complex cystic structure"] &&
              lesionsVal["complex cystic structure"].length > 0
                ? lesionsVal["complex cystic structure"]
                    .map((data, index) => {
                      let dataArray: any[] = [];
                      const raw = getReportAnswer(
                        lesionsRightQuestions.complexcrstDatar
                      );
                      dataArray = raw ? JSON.parse(raw) : [];

                      return (
                        data +
                        (dataArray[index]?.ImageText
                          ? dataArray[index].ImageText
                          : "")
                      );
                    })
                    .join("")
                : ""
            }${
              lesionsVal["heterogeneous tissue prominence"] &&
              lesionsVal["heterogeneous tissue prominence"].length > 0
                ? lesionsVal["heterogeneous tissue prominence"]
                    .map((data, index) => {
                      let dataArray: any[] = [];
                      const raw = getReportAnswer(
                        lesionsRightQuestions.HeterogeneousDatar
                      );
                      dataArray = raw ? JSON.parse(raw) : [];

                      return (
                        data +
                        (dataArray[index]?.ImageText
                          ? dataArray[index].ImageText
                          : "")
                      );
                    })
                    .join("")
                : ""
            }${
              lesionsVal["hypertrophic tissue with microcysts"] &&
              lesionsVal["hypertrophic tissue with microcysts"].length > 0
                ? lesionsVal["hypertrophic tissue with microcysts"]
                    .map((data, index) => {
                      let dataArray: any[] = [];
                      const raw = getReportAnswer(
                        lesionsRightQuestions.HypertrophicDatar
                      );
                      dataArray = raw ? JSON.parse(raw) : [];

                      return (
                        data +
                        (dataArray[index]?.ImageText
                          ? dataArray[index].ImageText
                          : "")
                      );
                    })
                    .join("")
                : ""
            }${
              lesionsVal["fibronodular density"] &&
              lesionsVal["fibronodular density"].length > 0
                ? lesionsVal["fibronodular density"]
                    .map((data, index) => {
                      let dataArray: any[] = [];
                      const raw = getReportAnswer(
                        lesionsRightQuestions.fibronodulardensityDatar
                      );
                      dataArray = raw ? JSON.parse(raw) : [];

                      return (
                        data +
                        (dataArray[index]?.ImageText
                          ? dataArray[index].ImageText
                          : "")
                      );
                    })
                    .join("")
                : ""
            }${
              lesionsVal["multiple simple cysts"] &&
              lesionsVal["multiple simple cysts"].length > 0
                ? lesionsVal["multiple simple cysts"]
                    .map((data, index) => {
                      let dataArray: any[] = [];
                      const raw = getReportAnswer(
                        lesionsRightQuestions.multipleCystsDatar
                      );
                      dataArray = raw ? JSON.parse(raw) : [];

                      return (
                        data +
                        (dataArray[index]?.ImageText
                          ? dataArray[index].ImageText
                          : "")
                      );
                    })
                    .join("")
                : ""
            }${
              lesionsVal["solid mass / nodule"] &&
              lesionsVal["solid mass / nodule"].length > 0
                ? lesionsVal["solid mass / nodule"]
                    .map((data, index) => {
                      let dataArray: any[] = [];
                      const raw = getReportAnswer(
                        lesionsRightQuestions.solidmassDatar
                      );
                      dataArray = raw ? JSON.parse(raw) : [];

                      return (
                        data +
                        (dataArray[index]?.ImageText
                          ? dataArray[index].ImageText
                          : "")
                      );
                    })
                    .join("")
                : ""
            }${
              lesionsVal["others"] && lesionsVal["others"].length > 0
                ? lesionsVal["others"]
                    .map((data, index) => {
                      let dataArray: any[] = [];
                      const raw = getReportAnswer(
                        lesionsRightQuestions.OtherDatar
                      );
                      dataArray = raw ? JSON.parse(raw) : [];

                      return (
                        data +
                        (dataArray[index]?.ImageText
                          ? dataArray[index].ImageText
                          : "")
                      );
                    })
                    .join("")
                : ""
            }`
          : ``
      }
      ${
        lymphRight
          ? `<div><strong>Lymph Nodes: </strong>${LymphNodesRight}${
              LymphNodesRightImage.length > 7
                ? `<span>${LymphNodesRightImage}<br/></span>`
                : "<p><br/></p>"
            }<div>`
          : ``
      }
      ${
        comparisonRight
          ? `<p><strong>Comparison to Prior Studies:</strong><br />${comparison
              .map((data, index) => {
                let dataArray: any[] = [];
                const raw = getReportAnswer(
                  ComparisonPriorRightQuestion.LesionCompTable
                );
                dataArray = raw ? JSON.parse(raw) : [];

                return (
                  data + (dataArray[index]?.vol1 ? dataArray[index].vol1 : "")
                );
              })
              .join("<br/>")}</p><br/>`
          : ``
      }
        `
          : ``
      }
      
      ${
        getReportAnswer(131) === "Present"
          ? `
        <p><strong>LEFT BREAST FINDINGS:</strong></p>
    
      ${
        breastDensityLeft
          ? `<span>${breastDensityandImageLeft}</span>${
              breastDensityandImageLeftImage.length > 7
                ? `<span>${breastDensityandImageLeftImage}<br/></span>`
                : "<p><br/></p>"
            }`
          : ``
      }
      ${
        nippleAreolaLeft
          ? `${nippleAreolaSkinLeft}${
              nippleAreolaSkinLeftImage.length > 7
                ? `<span>${nippleAreolaSkinLeftImage}<br/><span>`
                : "<p><br/></p>"
            }`
          : ``
      }
      ${
        glandularLeft
          ? `<p><strong>Glandular and ductal tissue: </strong></p>${grandularAndDuctalTissueLeft}${
              grandularAndDuctalTissueLeftImage.length > 7
                ? `<span>${grandularAndDuctalTissueLeftImage}<br/></span>`
                : "<p><br/></p>"
            }`
          : ``
      }
        ${
          lessionsLeft
            ? `${
                lesionsValLeft["simple cyst"] &&
                lesionsValLeft["simple cyst"].length > 0
                  ? lesionsValLeft["simple cyst"]
                      .map((data, index) => {
                        let dataArray: any[] = [];
                        const raw = getReportAnswer(
                          lesionsLeftQuestions.simplecrstDatar
                        );
                        dataArray = raw ? JSON.parse(raw) : [];

                        return (
                          "" +
                          data +
                          (dataArray[index]?.ImageText
                            ? dataArray[index].ImageText
                            : "")
                        );
                      })
                      .join("")
                  : ""
              }${
                lesionsValLeft["complex cystic structure"] &&
                lesionsValLeft["complex cystic structure"].length > 0
                  ? lesionsValLeft["complex cystic structure"]
                      .map((data, index) => {
                        let dataArray: any[] = [];
                        const raw = getReportAnswer(
                          lesionsLeftQuestions.complexcrstDatar
                        );
                        dataArray = raw ? JSON.parse(raw) : [];

                        return (
                          data +
                          (dataArray[index]?.ImageText
                            ? dataArray[index].ImageText
                            : "")
                        );
                      })
                      .join("")
                  : ""
              }${
                lesionsValLeft["heterogeneous tissue prominence"] &&
                lesionsValLeft["heterogeneous tissue prominence"].length > 0
                  ? lesionsValLeft["heterogeneous tissue prominence"]
                      .map((data, index) => {
                        let dataArray: any[] = [];
                        const raw = getReportAnswer(
                          lesionsLeftQuestions.HeterogeneousDatar
                        );
                        dataArray = raw ? JSON.parse(raw) : [];

                        return (
                          data +
                          (dataArray[index]?.ImageText
                            ? dataArray[index].ImageText
                            : "")
                        );
                      })
                      .join("")
                  : ""
              }${
                lesionsValLeft["hypertrophic tissue with microcysts"] &&
                lesionsValLeft["hypertrophic tissue with microcysts"].length > 0
                  ? lesionsValLeft["hypertrophic tissue with microcysts"]
                      .map((data, index) => {
                        let dataArray: any[] = [];
                        const raw = getReportAnswer(
                          lesionsLeftQuestions.HypertrophicDatar
                        );
                        dataArray = raw ? JSON.parse(raw) : [];

                        return (
                          data +
                          (dataArray[index]?.ImageText
                            ? dataArray[index].ImageText
                            : "")
                        );
                      })
                      .join("")
                  : ""
              }${
                lesionsValLeft["fibronodular density"] &&
                lesionsValLeft["fibronodular density"].length > 0
                  ? lesionsValLeft["fibronodular density"]
                      .map((data, index) => {
                        let dataArray: any[] = [];
                        const raw = getReportAnswer(
                          lesionsLeftQuestions.fibronodulardensityDatar
                        );
                        dataArray = raw ? JSON.parse(raw) : [];

                        return (
                          data +
                          (dataArray[index]?.ImageText
                            ? dataArray[index].ImageText
                            : "")
                        );
                      })
                      .join("")
                  : ""
              }${
                lesionsValLeft["multiple simple cysts"] &&
                lesionsValLeft["multiple simple cysts"].length > 0
                  ? lesionsValLeft["multiple simple cysts"]
                      .map((data, index) => {
                        let dataArray: any[] = [];
                        const raw = getReportAnswer(
                          lesionsLeftQuestions.multipleCystsDatar
                        );
                        dataArray = raw ? JSON.parse(raw) : [];

                        return (
                          data +
                          (dataArray[index]?.ImageText
                            ? dataArray[index].ImageText
                            : "")
                        );
                      })
                      .join("")
                  : ""
              }${
                lesionsValLeft["solid mass / nodule"] &&
                lesionsValLeft["solid mass / nodule"].length > 0
                  ? lesionsValLeft["solid mass / nodule"]
                      .map((data, index) => {
                        let dataArray: any[] = [];
                        const raw = getReportAnswer(
                          lesionsLeftQuestions.solidmassDatar
                        );
                        dataArray = raw ? JSON.parse(raw) : [];

                        return (
                          data +
                          (dataArray[index]?.ImageText
                            ? dataArray[index].ImageText
                            : "")
                        );
                      })
                      .join("")
                  : ""
              }${
                lesionsValLeft["others"] && lesionsValLeft["others"].length > 0
                  ? lesionsValLeft["others"]
                      .map((data, index) => {
                        let dataArray: any[] = [];
                        const raw = getReportAnswer(
                          lesionsLeftQuestions.OtherDatar
                        );
                        dataArray = raw ? JSON.parse(raw) : [];

                        return (
                          data +
                          (dataArray[index]?.ImageText
                            ? dataArray[index].ImageText
                            : "")
                        );
                      })
                      .join("")
                  : ""
              }`
            : ``
        }
      ${
        lymphLeft
          ? `<div><strong>Lymph Nodes: </strong>${LymphNodesLeft}${
              LymphNodesLeftImage.length > 7
                ? `<span>${LymphNodesLeftImage}<br/></span>`
                : "<p><br/></p>"
            }</div>`
          : ``
      }
      ${
        comparisonLeftVal
          ? `<p><strong>Comparison to Prior Studies:</strong><br />${comparisonLeft
              .map((data, index) => {
                let dataArray: any[] = [];
                const raw = getReportAnswer(
                  ComparisonPriorLeftQuestion.LesionCompTable
                );
                dataArray = raw ? JSON.parse(raw) : [];

                return (
                  data + (dataArray[index]?.vol1 ? dataArray[index].vol1 : "")
                );
              })
              .join("<br/>")}</p>`
          : ``
      }
        `
          : ``
      }
    
    
      ${
        getReportAnswer(132) === "Present"
          ? `
      <p><strong>RIGHT BREAST:</strong></p>
      ${
        mainImpressionRecommendation.impressionTextRight &&
        getReportAnswer(81) === "true"
          ? `<p><strong>Assessment Category : </strong> ${FindAssessmentCategory(
              mainImpressionRecommendation.selectedImpressionIdRight
            )}</p>`
          : ``
      }
      <strong>Impression:</strong>
      ${
        mainImpressionRecommendation.impressionTextRight
          ? `<br/><p>${mainImpressionRecommendation.impressionTextRight}</p>`
          : "<p></p>"
      }
      ${
        optionalImpressionRecommendation.impressionTextRight.length > 7
          ? ` <p> ${optionalImpressionRecommendation.impressionTextRight}</p>`
          : ""
      }
    
     ${
       commonImpressRecomm.idRight === "A" ||
       commonImpressRecomm.idRight === "E" ||
       commonImpressRecomm.idRight === "I" ||
       commonImpressRecomm.idRight === "L" ||
       commonImpressRecomm.idRight === "M" ||
       commonImpressRecomm.idRight === "Q" ||
       commonImpressRecomm.idRight === "U" ||
       commonImpressRecomm.idRight === "Y" ||
       commonImpressRecomm.idRight === "2" ||
       commonImpressRecomm.idRight === "3"
         ? `<p>${commonImpressRecomm.textRight}</p>`
         : ``
     }
    
      <p><strong>Recommendation:</strong></p>
    ${
      mainImpressionRecommendation.recommendationTextRight
        ? `<p>${mainImpressionRecommendation.recommendationTextRight}</p>`
        : ""
    }
      ${
        optionalImpressionRecommendation.recommendationTextRight.length > 7
          ? `<p>${optionalImpressionRecommendation.recommendationTextRight}</p>`
          : ""
      }
    
       ${
         commonImpressRecomm.idRight !== "A" &&
         commonImpressRecomm.idRight !== "E" &&
         commonImpressRecomm.idRight !== "I" &&
         commonImpressRecomm.idRight !== "L" &&
         commonImpressRecomm.idRight !== "M" &&
         commonImpressRecomm.idRight !== "Q" &&
         commonImpressRecomm.idRight !== "U" &&
         commonImpressRecomm.idRight !== "Y" &&
         commonImpressRecomm.idRight !== "2" &&
         commonImpressRecomm.idRight !== "3"
           ? `<p>${commonImpressRecomm.textRight}</p>`
           : ``
       }
        `
          : ``
      }
    
      ${
        getReportAnswer(133) === "Present"
          ? `
            <br/><p><strong>LEFT BREAST:</strong></p>
            ${
              mainImpressionRecommendation.impressionTextRight &&
              getReportAnswer(81) === "true"
                ? `<p><strong>Assessment Category : </strong> ${FindAssessmentCategory(
                    mainImpressionRecommendation.selectedImpressionId
                  )}</p>`
                : ``
            }
      <strong>Impression:</strong>
      ${
        mainImpressionRecommendation.impressionText
          ? `<br/><p>${mainImpressionRecommendation.impressionText}</p>`
          : `<p></p>`
      }
      ${
        optionalImpressionRecommendation.impressionText.length > 7
          ? ` <p> ${optionalImpressionRecommendation.impressionText}</p>`
          : ""
      }
    
     ${
       commonImpressRecomm.id === "A" ||
       commonImpressRecomm.id === "E" ||
       commonImpressRecomm.id === "I" ||
       commonImpressRecomm.id === "L" ||
       commonImpressRecomm.id === "M" ||
       commonImpressRecomm.id === "Q" ||
       commonImpressRecomm.id === "U" ||
       commonImpressRecomm.id === "Y" ||
       commonImpressRecomm.id === "2NA" ||
       commonImpressRecomm.id === "3NA"
         ? `<p>${commonImpressRecomm.text}</p>`
         : ``
     }
      <p><strong>Recommendation:</strong></p>
      ${
        mainImpressionRecommendation.recommendationText
          ? `<p>${mainImpressionRecommendation.recommendationText}</p>`
          : ""
      }
     ${
       optionalImpressionRecommendation.impressionText.length > 7
         ? `<p>${optionalImpressionRecommendation.impressionText}</p>`
         : ""
     }
      
      ${
        commonImpressRecomm.id !== "A" &&
        commonImpressRecomm.id !== "E" &&
        commonImpressRecomm.id !== "I" &&
        commonImpressRecomm.id !== "L" &&
        commonImpressRecomm.id !== "M" &&
        commonImpressRecomm.id !== "Q" &&
        commonImpressRecomm.id !== "U" &&
        commonImpressRecomm.id !== "Y" &&
        commonImpressRecomm.id !== "2NA" &&
        commonImpressRecomm.id !== "3NA"
          ? `<p>${commonImpressRecomm.text}</p>`
          : ``
      }
        `
          : ``
      }
      <br/><strong><i><p>The QT Breast Acoustic CTTM Scanner is an ultrasonic imaging system that provides reflection-mode and transmission-mode images of a patient’s breast and calculates breast fibroglandular volume and total breast volume. The device is not a replacement for screening mammography. The images must be reviewed and interpreted by a licensed physician, such as a radiologist. </p></i></strong>
      <br/><strong><i><p>Please note that the device may not detect some non-invasive, atypical, in situ carcinomas or low-grade malignant lesions. These could be represented by abnormalities such as masses, architectural distortion or calcifications. Every image from the device is evaluated by a doctor and should be considered in combination with pertinent clinical, imaging, and pathological findings for each patient. Other patient-specific findings that may be relevant include the presence of breast lumps, nipple discharge or nipple/skin inversion or retraction which should be shared with the medical center where you receive your scan and discussed with your doctor. Even if the doctor reading the QTscan determines that a scan is negative, the doctor may recommend follow-up with your primary care doctor/healthcare provider for clinical evaluation, additional imaging, and/or breast biopsy based on your medical history or other significant clinical findings. Discuss with your doctor/healthcare provider if you have any questions about your QTscan findings. Consultation with the doctor reading your QTscan is also available if requested.</p></i></strong>
    ` +
        (signatureText.length > 0 ? "<br/>" + signatureText : "") +
        (addendumText.length > 0
          ? "<br/><p><strong>ADDENDUM:</strong></p>" + addendumText
          : "");

      ReportNotes = quillWrapContent(ReportNotes);
    } else {
      if (Notes.split("<p><strong>ADDENDUM:</strong></p>")[0]) {
        ReportNotes =
          Notes.split("<p><strong>ADDENDUM:</strong></p>")[0] +
          (addendumText.length > 0
            ? "<p><strong>ADDENDUM:</strong></p>" + addendumText
            : "");
      }
    }

    return ReportNotes;
  };

  const handleReportSubmit = async (
    movedStatus: string,
    editStatus: boolean,
    leaveStatus?: boolean
  ) => {
    setLoading(true);
    try {
      await fecthautosave();
      let notesVal = handleSyncNotesReport();

      const payload = {
        reportIntakeForm: reportFormData,
        appointmentId: stateData.appointmentId,
        technicianIntakeForm: [],
        patientIntakeForm: [],
        reportTextContent: notesVal,
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
        patientMailStatus: showMailDialog
          ? mailOption === "patient" || mailOption === "both"
          : false,
        managerMailStatus: showMailDialog
          ? mailOption === "scancenter" || mailOption === "both"
          : false,
        leaveStatus: leaveStatus,
        artificatsLeft:
          getReportAnswer(
            breastDensityandImageLeftQuestions.artifactsPresent
          ) == "Yes"
            ? true
            : false,
        artificatsRight:
          getReportAnswer(
            breastDensityandImageRightQuestions.artifactsPresent
          ) == "Yes"
            ? true
            : false,
        patienthistory: patientHistory,
        breastimplantImageText: breastImplantImage,
        symmetryImageText: symmentryImage,
        breastdensityImageText: breastDensityandImageRightImage,
        nippleareolaImageText: nippleAreolaSkinRightImage,
        glandularImageText: grandularAndDuctalTissueRightImage,
        lymphnodesImageText: LymphNodesRightImage,
        breastdensityImageTextLeft: breastDensityandImageLeftImage,
        nippleareolaImageTextLeft: nippleAreolaSkinLeftImage,
        glandularImageTextLeft: grandularAndDuctalTissueLeftImage,
        lymphnodesImageTextLeft: LymphNodesLeftImage,
      };
      console.log("payload", payload);

      if (movedStatus) {
        if (movedStatus === "Signed Off") {
          console.log("\n\nmovedStatus ===>", movedStatus);
          console.log(
            "\n\nPatient dataa -> ",
            patientDetails,
            "\n\n\n",
            assignData
          );

          try {
            const date = new Date();
            const formattedTimestamp = `${date.getFullYear()}-${(
              date.getMonth() + 1
            )
              .toString()
              .padStart(2, "0")}-${date
              .getDate()
              .toString()
              .padStart(2, "0")}_${date
              .getHours()
              .toString()
              .padStart(2, "0")}-${date
              .getMinutes()
              .toString()
              .padStart(2, "0")}-${date
              .getSeconds()
              .toString()
              .padStart(2, "0")}`;

            const filename = `${patientDetails.refUserCustId}_${assignData?.appointmentStatus[0]?.refAppointmentDate}_FinalReportPDF_${formattedTimestamp}.pdf`;
            console.log("patientDetails", patientDetails);

            // 1️⃣ Step 1: Request presigned PUT URL from backend
            const token = localStorage.getItem("token");

            const payloadS3 = {
              fileType: "finalReport", // or "consentForm"
              fileUrl: filename,
              appointmentId: payload.appointmentId,
              patientId: payload.patientId,
            };

            const uploadRes = await axios.post(
              `${
                import.meta.env.VITE_API_URL_AUTH
              }/storage/s3/final-report-upload`,
              payloadS3, // <-- this is the body
              {
                headers: {
                  Authorization: `Bearer ${token}`, // <-- actual HTTP header
                  "Content-Type": "application/json",
                },
              }
            );

            const uploadUrl = uploadRes.data.data.url;
            console.log("Generated Upload URL:", uploadUrl);

            // 2️⃣ Step 2: Generate PDF blob (instead of downloading)
            console.log("\n\n\n\n\npayload", payload.reportTextContent);
            const pdfBlob = await generateReportsPdfBlob(
              payload.reportTextContent
            );

            // 3️⃣ Step 3: Upload PDF to presigned S3 URL
            await axios.put(uploadUrl, pdfBlob, {
              headers: {
                "Content-Type": "application/pdf",
              },
            });

            console.log("✅ PDF successfully uploaded to S3");
          } catch (err) {
            console.error("❌ Error generating or uploading report:", err);
          }
        }
      }

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

  const getReportAnswer = (id: number) =>
    reportFormData.find((q) => q.questionId === id)?.answer || "";

  const patientForm = (categoryId: number) => {
    if (categoryId == 1) {
      return "S Form";
    } else if (categoryId == 2) {
      return "Da Form";
    } else if (categoryId == 3) {
      return "Db Form";
    } else if (categoryId == 4) {
      return "Dc Form";
    } else return "";
  };

  const getPatientReport = async (questionId: number) => {
    setOpenReportPreview(true);
    setOpenReportPreviewCurrent(1);
    setOpenReportPreviewData(getPatientAnswer(questionId));
  };

  const getOldReport = async (data: string) => {
    setOpenReportPreview(true);
    setOpenReportPreviewCurrent(1);
    setOpenReportPreviewData(data);
  };

  const [timeOut, setTimeOut] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimer = (delay = 5000) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setTimeOut((prev) => !prev); // toggle timeout
      startTimer(); // restart the loop
    }, delay);
  };

  const { listening, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      console.warn("Browser does not support speech recognition.");
      return;
    }

    // ✅ Only start timer if mic is OFF
    if (!listening) {
      startTimer();
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
    }

    const handleUserActivity = () => {
      // extend the timer by +1s (so 11s instead of 10s)
      if (!listening) {
        startTimer(5000);
        console.log("###################=============>");
      }
    };

    // listen for clicks & keypresses
    window.addEventListener("click", handleUserActivity);
    window.addEventListener("keydown", handleUserActivity);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      window.removeEventListener("click", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
    };
  }, [listening]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setTimeOut((prev) => !prev); // toggle value every 10s
  //   }, 10000);

  //   return () => clearInterval(interval); // cleanup on unmount
  // }, []);

  // let i = 0;

  const [additionalChangesChangeStatus, setAdditionalChangesChangeStatus] =
    useState(false);

  const requestVersionRef = useRef(0);

  const fecthautosave = async () => {
    const currentRequestVersion = ++requestVersionRef.current;
    console.log(
      "Report.tsx / requestVersionRef / 3275 -------------------  ",
      requestVersionRef.current
    );
    // i++

    setAutoChangeAccess(false);

    const tempChange = { ...changedOne };
    console.log(
      "Report.tsx / tempChange / 3277 -------------------  ",
      tempChange.symmetryReportText
    );

    const payload = {
      changedOne: changedOne,
      reportIntakeForm:
        changedOne.reportQuestion.length > 0
          ? reportFormData.filter((item) =>
              changedOne.reportQuestion.includes(item.questionId)
            )
          : [],
      reportTextContent: Notes,
      appointmentId: stateData.appointmentId,
      patientId: stateData.userId,
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
      artificatsLeft:
        getReportAnswer(breastDensityandImageLeftQuestions.artifactsPresent) ==
        "Yes"
          ? true
          : false,
      artificatsRight:
        getReportAnswer(breastDensityandImageRightQuestions.artifactsPresent) ==
        "Yes"
          ? true
          : false,
      patienthistory: patientHistory,
      breastimplantImageText: breastImplantImage,
      symmetryImageText: symmentryImage,
      breastdensityImageText: breastDensityandImageRightImage,
      nippleareolaImageText: nippleAreolaSkinRightImage,
      glandularImageText: grandularAndDuctalTissueRightImage,
      lymphnodesImageText: LymphNodesRightImage,
      breastdensityImageTextLeft: breastDensityandImageLeftImage,
      nippleareolaImageTextLeft: nippleAreolaSkinLeftImage,
      glandularImageTextLeft: grandularAndDuctalTissueLeftImage,
      lymphnodesImageTextLeft: LymphNodesLeftImage,
      reportSyncStatus: {
        breastImplantSyncStatus: syncStatus.breastImplant,
        SymmetrySyncStatus: syncStatus.symmetry,
        breastDensitySyncStatus: syncStatus.breastDensityandImageRight,
        nippleAreolaSyncStatus: syncStatus.nippleAreolaSkinRight,
        glandularSyncStatus: syncStatus.grandularAndDuctalTissueRight,
        lymphnodesSyncStatus: syncStatus.LymphNodesRight,
        lesionsSyncStatus: syncStatus.LesionsRight,
        comparisonPriorSyncStatus: syncStatus.ComparisonPrior,
        breastDensityLeftSyncStatus: syncStatus.breastDensityandImageLeft,
        nippleAreolaLeftSyncStatus: syncStatus.nippleAreolaSkinLeft,
        glandularLeftSyncStatus: syncStatus.grandularAndDuctalTissueLeft,
        lymphnodesLeftSyncStatus: syncStatus.LymphNodesLeft,
        lesionsLeftSyncStatus: syncStatus.LesionsLeft,
        comparisonPriorLeftSyncStatus: syncStatus.ComparisonPriorLeft,
      },
      autoReportText: {
        breastImplantReportText: breastImplantRight,
        symmetryReportText: symmetry,
        breastDensityReportText: breastDensityandImageRight,
        nippleAreolaReportText: nippleAreolaSkinRight,
        lesionsReportText: LesionsRight,
        comparisonPriorReportText: ComparisonPrior,
        grandularAndDuctalTissueReportText: grandularAndDuctalTissueRight,
        lymphnodesReportText: LymphNodesRight,
        breastDensityReportTextLeft: breastDensityandImageLeft,
        nippleAreolaReportTextLeft: nippleAreolaSkinLeft,
        lesionsReportTextLeft: LesionsLeft,
        comparisonPriorReportTextLeft: ComparisonPriorLeft,
        grandularAndDuctalTissueReportTextLeft: grandularAndDuctalTissueLeft,
        lymphnodesReportTextLeft: LymphNodesLeft,
      },
    };

    console.log(
      "Report.tsx /Payload/ -------------------------- >  3374  ",
      payload
    );

    const response: {
      appointmentStatus: AppointmentStatus[];
      intakeFormData: ResponsePatientForm[];
      reportIntakeFormData: ReportQuestion[];
      reportTextContentData: TextEditorContent[];
      status: boolean;
      easeQTReportAccess: boolean;
      naSystemReportAccess: boolean;
      PerformingProviderName: string;
      VerifyingProviderName: string;
      ListAllSignature: SignatureText[];
    } = await reportService.autosaveReport(payload);

    if (
      response.status &&
      currentRequestVersion === requestVersionRef.current
    ) {
      console.log(
        "Report.tsx / changedOne / 3277 -------------------  ",
        changedOne.symmetryReportText
      );
      if (response.ListAllSignature) {
        setSignatureText(
          response.ListAllSignature.map(
            (data: SignatureText) => `${data.refSText}`
          ).join("")
        );
      }
      setPerformingProviderName(response.PerformingProviderName);
      setVerifyingProviderName(response.VerifyingProviderName);
      if (
        response.appointmentStatus[0]
          .refAppointmentImpressionAdditionalRight !==
          optionalImpressionRecommendation.selectedImpressionIdRight ||
        response.appointmentStatus[0]
          .refAppointmentRecommendationAdditionalRight !==
          optionalImpressionRecommendation.selectedRecommendationIdRight ||
        response.appointmentStatus[0].refAppointmentImpressionAdditional !==
          optionalImpressionRecommendation.selectedImpressionId ||
        response.appointmentStatus[0].refAppointmentRecommendationAdditional !==
          optionalImpressionRecommendation.selectedRecommendationId
      ) {
        setAdditionalChangesChangeStatus(!additionalChangesChangeStatus);
      }

      setAssignData((prev) => ({
        ...prev!,
        easeQTReportAccess: response.easeQTReportAccess || false,
        naSystemReportAccess: response.naSystemReportAccess || false,
      }));

      console.log(
        "Report.tsx -------------------------- >  3406  ",
        tempChange.impressionRight === changedOne.impressionRight,
        response.appointmentStatus[0].refAppointmentImpressionRight
      );

      setMainImpressionRecommendation((prev) => ({
        ...prev,
        selectedImpressionId:
          response.appointmentStatus[0].refAppointmentImpression,
        // impressionText:
        //   MainOptions.flatMap((cat) => cat.data).find(
        //     (item) =>
        //       item.id ===
        //       response.appointmentStatus[0].refAppointmentImpression
        //   )?.impressionText || "",
        selectedRecommendationId:
          response.appointmentStatus[0].refAppointmentRecommendation,
        // recommendationText:
        //   MainOptions.flatMap((cat) => cat.data).find(
        //     (item) =>
        //       item.id ===
        //       response.appointmentStatus[0].refAppointmentImpression
        //   )?.recommendationText || "",
        selectedImpressionIdRight:
          response.appointmentStatus[0].refAppointmentImpressionRight,
        // impressionTextRight:
        //   MainOptions.flatMap((cat) => cat.data).find(
        //     (item) =>
        //       item.id ===
        //       response.appointmentStatus[0].refAppointmentImpression
        //   )?.impressionText || "",
        selectedRecommendationIdRight:
          response.appointmentStatus[0].refAppointmentRecommendationRight,
        // recommendationTextRight:
        //   MainOptions.flatMap((cat) => cat.data).find(
        //     (item) =>
        //       item.id ===
        //       response.appointmentStatus[0].refAppointmentImpression
        //   )?.recommendationText || "",
      }));

      setOptionalImpressionRecommendation((prev) => ({
        ...prev,
        selectedImpressionId:
          response.appointmentStatus[0].refAppointmentImpressionAdditional,
        //   impressionText:
        // MainOptions.map((item) => item.data)
        //   .flat()
        //   .find(
        //     (item) =>
        //       item.id === optionalImpressionRecommendation.selectedImpressionId
        //   )?.impressionText || "",
        selectedRecommendationId:
          response.appointmentStatus[0].refAppointmentRecommendationAdditional,
        //   recommendationText:
        // MainOptions.map((item) => item.data)
        //   .flat()
        //   .find(
        //     (item) =>
        //       item.id ===
        //       optionalImpressionRecommendation.selectedRecommendationId
        //   )?.recommendationText || "",
        selectedImpressionIdRight:
          response.appointmentStatus[0].refAppointmentImpressionAdditionalRight,
        //    impressionTextRight:
        // MainOptions.map((item) => item.data)
        //   .flat()
        //   .find(
        //     (item) =>
        //       item.id ===
        //       optionalImpressionRecommendation.selectedImpressionIdRight
        //   )?.impressionText || "",
        selectedRecommendationIdRight:
          response.appointmentStatus[0]
            .refAppointmentRecommendationAdditionalRight,
        //     recommendationTextRight:
        // MainOptions.map((item) => item.data)`
        //   .flat()
        //   .find(
        //     (item) =>
        //       item.id ===
        //       optionalImpressionRecommendation.selectedRecommendationIdRight
        //   )?.recommendationText || "",
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

      let Commonoptions = additionalOptions;
      if (assignData?.naSystemReportAccess && getReportAnswer(81) === "true") {
        Commonoptions = NAadditionalOptions;
      }

      setCommonImpressRecomm((prev) => {
        const updated = { ...prev };

        // Left side condition
        // if (
        //   tempChange.commonImpressionRecommendation ===
        //   changedOne.commonImpressionRecommendation
        // ) {
        const id =
          response.appointmentStatus[0]
            .refAppointmentCommonImpressionRecommendation;
        updated.id = id;
        updated.text = Commonoptions.find((opt) => opt.id === id)?.text || "";
        // }

        // Right side condition
        // if (
        //   tempChange.commonImpressionRecommendationRight ===
        //   changedOne.commonImpressionRecommendationRight
        // ) {
        const idRight =
          response.appointmentStatus[0]
            .refAppointmentCommonImpressionRecommendationRight;
        updated.idRight = idRight;
        updated.textRight =
          Commonoptions.find((opt) => opt.id === idRight)?.text || "";
        // }

        return updated;
      });

      if (
        response.reportTextContentData[0].refRTPatientHistorySyncStatus ===
        false
      ) {
        setPatientHistory(
          response.appointmentStatus[0].refAppointmentPatietHistory
        );
      }

      if (response.appointmentStatus[0].refAppointmentBreastImplantImageText) {
        setBreastImplantImage(
          response.appointmentStatus[0].refAppointmentBreastImplantImageText
        );
      }

      if (response.appointmentStatus[0].refAppointmentSymmetryImageText) {
        setSymmetryImage(
          response.appointmentStatus[0].refAppointmentSymmetryImageText
        );
      }

      if (response.appointmentStatus[0].refAppointmentBreastdensityImageText) {
        setBreastDensityandImageRightImage(
          response.appointmentStatus[0].refAppointmentBreastdensityImageText
        );
      }

      if (response.appointmentStatus[0].refAppointmentNippleAreolaImageText) {
        setNippleAreolaSkinRightImage(
          response.appointmentStatus[0].refAppointmentNippleAreolaImageText
        );
      }

      if (response.appointmentStatus[0].refAppointmentGlandularImageText) {
        setGrandularAndDuctalTissueRightImage(
          response.appointmentStatus[0].refAppointmentGlandularImageText
        );
      }

      if (response.appointmentStatus[0].refAppointmentLymphnodeImageText) {
        setLymphNodesRightImage(
          response.appointmentStatus[0].refAppointmentLymphnodeImageText
        );
      }

      if (
        response.appointmentStatus[0].refAppointmentBreastdensityImageTextLeft
      ) {
        setBreastDensityandImageLeftImage(
          response.appointmentStatus[0].refAppointmentBreastdensityImageTextLeft
        );
      }

      if (
        response.appointmentStatus[0].refAppointmentNippleAreolaImageTextLeft
      ) {
        setNippleAreolaSkinLeftImage(
          response.appointmentStatus[0].refAppointmentNippleAreolaImageTextLeft
        );
      }

      if (response.appointmentStatus[0].refAppointmentGlandularImageTextLeft) {
        setGrandularAndDuctalTissueLeftImage(
          response.appointmentStatus[0].refAppointmentGlandularImageTextLeft
        );
      }

      if (response.appointmentStatus[0].refAppointmentLymphnodeImageTextLeft) {
        setLymphNodesLeftImage(
          response.appointmentStatus[0].refAppointmentLymphnodeImageTextLeft
        );
      }

      if (response.reportTextContentData) {
        setNotes(response.reportTextContentData[0]?.refRTCText);
      }

      // let notesStatus = false;

      // if (response.easeQTReportAccess) {
      //   if (
      //     response.reportTextContentData[0]?.refRTSyncStatus === null ||
      //     response.reportTextContentData[0]?.refRTSyncStatus
      //   ) {
      //     notesStatus = true;
      //   }
      // }

      // console.log(
      //   "***",
      //   (response.reportTextContentData[0].refRTSymmetrySyncStatus || false)
      // );

      //Breast Implant
      if (
        !(
          response.reportTextContentData[0].refRTBreastImplantReportText ||
          false
        )
      ) {
        setBreastImplantRight(
          response.reportTextContentData[0].refRTBreastImplantReportText
        );
      }

      //symmentry
      if (!response.reportTextContentData[0].refRTSymmetrySyncStatus) {
        setSymmetry(response.reportTextContentData[0].refRTSymmetryReportText);
      }

      //breastDensity Right
      if (
        !response.reportTextContentData[0]
          .refRTBreastDensityandImageRightSyncStatus
      ) {
        setBreastDensityandImageRight(
          response.reportTextContentData[0]
            .refRTBreastDensityandImageRightReportText
        );
      }

      //NippleAreola Right
      if (
        !response.reportTextContentData[0].refRTNippleAreolaSkinRightSyncStatus
      ) {
        setNippleAreolaSkinRight(
          response.reportTextContentData[0].refRTNippleAreolaSkinRightReportText
        );
      }

      //Glandular Right
      if (
        !response.reportTextContentData[0]
          .refRTGrandularAndDuctalTissueRightSyncStatus
      ) {
        setGrandularAndDuctalTissueRight(
          response.reportTextContentData[0]
            .refRTGrandularAndDuctalTissueRightReportText
        );
      }

      //Lymphnode Right
      if (!response.reportTextContentData[0].refRTLymphNodesRightSyncStatus) {
        setLymphNodesRight(
          response.reportTextContentData[0].refRTLymphNodesRightReportText
        );
      }

      // //Lesions Right
      // if (
      //   !(response.reportTextContentData[0].refRTLesionsRightS || false)
      // ) {
      // if (
      //   tempChange.LesionsRightReportText === changedOne.LesionsRightReportText
      // ) {
      setLesionsRight(
        response.reportTextContentData[0].refRTLesionsRightReportText
      );
      // }
      // }

      //ComparisonPrior Right
      // if (
      //   tempChange.ComparisonPriorReportText ===
      //   changedOne.ComparisonPriorReportText
      // ) {
      setComparisonPrior(
        response.reportTextContentData[0].refRTComparisonPriorReportText
      );
      // }

      //breastDensity Left
      if (
        !response.reportTextContentData[0]
          .refRTBreastDensityandImageLeftSyncStatus
      ) {
        setBreastDensityandImageLeft(
          response.reportTextContentData[0]
            .refRTBreastDensityandImageLeftReportText
        );
      }

      //NippleAreola Left
      if (
        !response.reportTextContentData[0].refRTNippleAreolaSkinLeftSyncStatus
      ) {
        setNippleAreolaSkinLeft(
          response.reportTextContentData[0].refRTNippleAreolaSkinLeftReportText
        );
      }

      //Glandular Left
      if (
        !response.reportTextContentData[0]
          .refRTGrandularAndDuctalTissueLeftSyncStatus
      ) {
        setGrandularAndDuctalTissueLeft(
          response.reportTextContentData[0]
            .refRTGrandularAndDuctalTissueLeftReportText
        );
      }

      //Lymphnode Left
      if (!response.reportTextContentData[0].refRTLymphNodesLeftSyncStatus) {
        setLymphNodesLeft(
          response.reportTextContentData[0].refRTLymphNodesLeftReportText
        );
      }

      // //Lesions Left
      // if (
      //   !(response.reportTextContentData[0].refRTLesionsRightS || false)
      // ) {
      // if (
      //   tempChange.LesionsLeftReportText === changedOne.LesionsLeftReportText
      // ) {
      setLesionsLeft(
        response.reportTextContentData[0].refRTLesionsLeftReportText
      );
      // }
      // }

      //ComparisonPrior Left
      // if (
      //   tempChange.ComparisonPriorLeftReportText ===
      //   changedOne.ComparisonPriorLeftReportText
      // ) {
      setComparisonPriorLeft(
        response.reportTextContentData[0].refRTComparisonPriorLeftReportText
      );
      // }

      if (!response.reportTextContentData[0].refRTBreastImplantSyncStatus) {
        setBreastImplantRight(
          response.reportTextContentData[0].refRTBreastImplantReportText
        );
      }

      setsyncStatus({
        patientHistory:
          response.reportTextContentData[0].refRTPatientHistorySyncStatus !==
          false,
        breastImplant:
          response.reportTextContentData[0]?.refRTBreastImplantSyncStatus !==
          false,
        breastDensityandImageRight:
          response.reportTextContentData[0]
            ?.refRTBreastDensityandImageRightSyncStatus !== false,
        nippleAreolaSkinRight:
          response.reportTextContentData[0]
            ?.refRTNippleAreolaSkinRightSyncStatus !== false,
        LesionsRight:
          response.reportTextContentData[0]?.refRTLesionsRightSyncStatus !==
          false,
        ComparisonPrior:
          response.reportTextContentData[0]?.refRTComparisonPriorSyncStatus !==
          false,
        grandularAndDuctalTissueRight:
          response.reportTextContentData[0]
            ?.refRTGrandularAndDuctalTissueRightSyncStatus !== false,
        LymphNodesRight:
          response.reportTextContentData[0]?.refRTLymphNodesRightSyncStatus !==
          false,
        breastDensityandImageLeft:
          response.reportTextContentData[0]
            ?.refRTBreastDensityandImageLeftSyncStatus !== false,
        nippleAreolaSkinLeft:
          response.reportTextContentData[0]
            ?.refRTNippleAreolaSkinLeftSyncStatus !== false,
        LesionsLeft:
          response.reportTextContentData[0]?.refRTLesionsLeftSyncStatus !==
          false,
        ComparisonPriorLeft:
          response.reportTextContentData[0]
            ?.refRTComparisonPriorLeftSyncStatus !== false,
        grandularAndDuctalTissueLeft:
          response.reportTextContentData[0]
            ?.refRTGrandularAndDuctalTissueLeftSyncStatus !== false,
        LymphNodesLeft:
          response.reportTextContentData[0]?.refRTLymphNodesLeftSyncStatus !==
          false,
        Notes:
          response.reportTextContentData[0]?.refRTSyncStatus === null
            ? true
            : response.reportTextContentData[0]?.refRTSyncStatus,
        ImpressionsRecommendations: true,
        symmetry:
          response.reportTextContentData[0]?.refRTSymmetrySyncStatus !== false,
      });

      if (response.reportIntakeFormData) {
        setReportFormData(response.reportIntakeFormData);
      }

      // if (response.reportIntakeFormData) {
      //   setReportFormData((prev) => {
      //     // Map through current form data
      //     return prev.map((item) => {
      //       // Check if this question is in the changed lisFt
      //       if (tempChange.reportQuestion.includes(item.questionId)) {
      //         // Find the updated question data from response
      //         const updatedItem = response.reportIntakeFormData.find(
      //           (r) => r.questionId === item.questionId
      //         );
      //         // Replace if found
      //         return updatedItem ? { ...item, ...updatedItem } : item;
      //       }
      //       return item; // otherwise keep the old one
      //     });
      //   });
      // }

      // if (!response.easeQTReportAccess) {
      //   setsyncStatus({
      //     ...syncStatus,
      //     Notes: false,
      //   });
      // } else {
      // setsyncStatus({
      //   ...syncStatus,
      //   Notes:
      //     response.reportTextContentData[0]?.refRTSyncStatus === null
      //       ? true
      //       : response.reportTextContentData[0]?.refRTSyncStatus,
      // });
      // }

      setChangedOne({
        reportQuestion: [],
        reportTextContent: false,
        syncStatus: false,
        impression: false,
        recommendation: false,
        impressionaddtional: false,
        recommendationaddtional: false,
        commonImpressionRecommendation: false,
        impressionRight: false,
        recommendationRight: false,
        impressionaddtionalRight: false,
        recommendationaddtionalRight: false,
        commonImpressionRecommendationRight: false,
        artificatsLeft: false,
        artificatsRight: false,
        patienthistory: false,
        breastimplantImageText: false,
        symmetryImageText: false,
        breastdensityImageText: false,
        nippleareolaImageText: false,
        glandularImageText: false,
        lymphnodesImageText: false,
        breastdensityImageTextLeft: false,
        nippleareolaImageTextLeft: false,
        glandularImageTextLeft: false,
        lymphnodesImageTextLeft: false,
        breastImplantSyncStatus: false,
        symmetrySyncStatus: false,
        breastDensityandImageRightSyncStatus: false,
        nippleAreolaSkinRightSyncStatus: false,
        LesionsRightSyncStatus: false,
        ComparisonPriorSyncStatus: false,
        grandularAndDuctalTissueRightSyncStatus: false,
        LymphNodesRightSyncStatus: false,
        breastDensityandImageLeftSyncStatus: false,
        nippleAreolaSkinLeftSyncStatus: false,
        LesionsLeftSyncStatus: false,
        ComparisonPriorLeftSyncStatus: false,
        grandularAndDuctalTissueLeftSyncStatus: false,
        LymphNodesLeftSyncStatus: false,
        breastImplantReportText: false,
        symmetryReportText: false,
        breastDensityandImageRightReportText: false,
        nippleAreolaSkinRightReportText: false,
        LesionsRightReportText: false,
        ComparisonPriorReportText: false,
        grandularAndDuctalTissueRightReportText: false,
        LymphNodesRightReportText: false,
        breastDensityandImageLeftReportText: false,
        nippleAreolaSkinLeftReportText: false,
        LesionsLeftReportText: false,
        ComparisonPriorLeftReportText: false,
        grandularAndDuctalTissueLeftReportText: false,
        LymphNodesLeftReportText: false,
      });

      if (!(response.easeQTReportAccess && response.naSystemReportAccess)) {
        if (response.easeQTReportAccess) {
          handleReportInputChange(81, "false");
        } else if (response.naSystemReportAccess) {
          handleReportInputChange(81, "true");
        }
      }

      AutoPopulateReportImpressRecomm(
        mainImpressionRecommendation,
        setMainImpressionRecommendation,
        optionalImpressionRecommendation,
        setOptionalImpressionRecommendation,
        commonImpressRecomm,
        setCommonImpressRecomm,
        reportFormData,
        assignData
      );
    }
    setAutoChangeAccess(true);
    if (requestVersionRef.current >= 500) requestVersionRef.current = 0;
  };

  useEffect(() => {
    if (AutoReportAccess) {
      if (!loading) {
        if (AutoChangeAccess) {
          fecthautosave();
        }
      }
    }
  }, [timeOut]);

  const PatientStatusColor: React.FC<{ status: string }> = ({ status }) => {
    switch (status) {
      case "Patient Intake Form Fill":
        return (
          <span className="text-gray-400">
            Patient Intake Form Fill Completed
          </span>
        );
      case "Patient Intake Override Form Fill":
        return (
          <span className="text-gray-400">
            Patient Intake Override Form Fill
          </span>
        );
      case "Technologist Form Fill":
        return <span className="text-gray-400">Technologist Form Fill</span>;
      case "Predraft":
        return <span className="text-[#8e7cc3]">Predraft</span>;
      case "Draft":
        return <span className="text-[#3c78d8]">Draft</span>;
      case "Reviewed 1":
        return <span className="text-[#e69138]">Reviewed 1</span>;
      case "Reviewed 2":
        return <span className="text-[#bf9000]">Reviewed 2</span>;
      case "Signed Off":
        return <span className="text-[#38761d]">Signed Off</span>;
      case "Changes":
        return <span className="text-gray-400">Saved Changes</span>;
      default:
        return <span className="text-gray-400">Unknown Status</span>;
    }
  };

  const menuOptions = [
    {
      label: "Thermogram",
      indexVal: 1,
    },
    {
      label: "Mammogram",
      indexVal: 2,
    },
    {
      label: "Breast Ultrasound / HERscan",
      indexVal: 3,
    },
    {
      label: "Breast MRI",
      indexVal: 4,
    },
    {
      label: "PET/CT Scan",
      indexVal: 5,
    },
    {
      label: "QT Imaging",
      indexVal: 6,
    },
    {
      label: "Other Imaging or Scans",
      indexVal: 7,
    },
    {
      label: "Biopsy Report",
      indexVal: 8,
    },
    {
      label: "Other Report",
      indexVal: 9,
    },
  ];

  // useEffect(() => {
  //   console.log("syncStatus", syncStatus);
  // }, [syncStatus]);

  // useEffect(() => {
  //   console.log("changedOne", changedOne);
  // }, [changedOne]);

  return (
    <div className="h-dvh bg-[#edd1ce]">
      {/* <VoiceRecognition /> */}
      {true && (
        <Dialog open={openReportPreview} onOpenChange={setOpenReportPreview}>
          <DialogContent
            style={{ background: "#fff" }}
            className="w-[100vw] lg:w-[90vw] h-[90vh] overflow-y-auto p-0"
          >
            <div className="h-[8vh] flex w-[100%] items-center justify-around px-2 ">
              <Button
                variant="greenTheme"
                onClick={() => {
                  if (openReportPreviewCurrent > 1) {
                    const newIndex = openReportPreviewCurrent - 1;
                    setOpenReportPreviewCurrent(newIndex);
                  }
                }}
              >
                Back
              </Button>

              <div>
                {openReportPreviewCurrent}/
                {(() => {
                  try {
                    return JSON.parse(openReportPreviewData || "[]").length;
                  } catch {
                    return 0;
                  }
                })()}
              </div>

              <Button
                variant="greenTheme"
                onClick={() => {
                  const total = JSON.parse(
                    openReportPreviewData || "[]"
                  ).length;
                  if (openReportPreviewCurrent < total) {
                    const newIndex = openReportPreviewCurrent + 1;
                    setOpenReportPreviewCurrent(newIndex);
                  }
                }}
              >
                Next
              </Button>
            </div>
            <div className="w-[100%] h-[75vh]">
              <PreviewFile
                fileName={(() => {
                  try {
                    return JSON.parse(openReportPreviewData)[
                      openReportPreviewCurrent - 1
                    ];
                  } catch {
                    return "";
                  }
                })()}
              />
            </div>
            {/* {openReportPreviewData.contentType === "application/pdf" ? (
              <div>
                <iframe
                  src={`data:${openReportPreviewData.contentType};base64,${openReportPreviewData.base64Data}`}
                  title="Report Preview"
                  className="w-full mt-10 h-[80vh] border rounded-md"
                />
              </div>
            ) : (
              <div className="w-full mt-10 h-[80vh]  flex items-center justify-center overflow-auto">
                <img
                  src={`data:${openReportPreviewData.contentType};base64,${openReportPreviewData.base64Data}`}
                  alt="Report Preview"
                  className="w-full h-[80vh] object-contain border rounded-md"
                />
              </div>
            )} */}
          </DialogContent>
        </Dialog>
      )}
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
          {stateData.readOnly && (role?.id === 2 || role?.id === 3) ? (
            <>
              {tab === 4 &&
                [{ label: "Final Report", value: 4 }].map(
                  ({ label, value }) => {
                    const accessible = isTabAccessible(value);
                    return (
                      accessible && (
                        <div
                          key={label}
                          onClick={() => accessible && setSubTab(value)}
                          className={`flex-1 max-w-xl text-xs ${
                            label !== "Final Report"
                              ? "text-[#e06666]"
                              : "text-[#3f3f3d]"
                          }  2xl:text-lg text-center font-medium py-2 mx-1 rounded-md border cursor-pointer transition-all duration-200 ${
                            accessible
                              ? subTab === value
                                ? "bg-[#f8f4eb] border-[#3f3f3d] shadow-sm"
                                : "border-[#b4b4b4] hover:bg-[#d6d9d3]"
                              : "border-[#e0e0e0] text-[#e06666] cursor-not-allowed bg-gray-100"
                          }`}
                        >
                          {label}
                        </div>
                      )
                    );
                  }
                )}
            </>
          ) : role?.id === 8 ? (
            <>
              {tab === 4 &&
                [{ label: "Final Report", value: 4 }].map(
                  ({ label, value }) => {
                    const accessible = isTabAccessible(value);
                    return (
                      accessible && (
                        <div
                          key={label}
                          onClick={() => accessible && setSubTab(value)}
                          className={`flex-1 max-w-xl text-xs ${
                            label !== "Final Report"
                              ? "text-[#e06666]"
                              : "text-[#3f3f3d]"
                          }  2xl:text-lg text-center font-medium py-2 mx-1 rounded-md border cursor-pointer transition-all duration-200 ${
                            accessible
                              ? subTab === value
                                ? "bg-[#f8f4eb] border-[#3f3f3d] shadow-sm"
                                : "border-[#b4b4b4] hover:bg-[#d6d9d3]"
                              : "border-[#e0e0e0] text-[#e06666] cursor-not-allowed bg-gray-100"
                          }`}
                        >
                          {label}
                        </div>
                      )
                    );
                  }
                )}
            </>
          ) : (
            <>
              {tab === 4 &&
                [
                  { label: "General", value: 1 },
                  { label: "Right", value: 2 },
                  { label: "Left", value: 3 },
                  { label: "Impression + Reco", value: 5 },
                  { label: "Final Report", value: 4 },
                ].map(({ label, value }) => {
                  const accessible = isTabAccessible(value);
                  return (
                    accessible && (
                      <div
                        key={label}
                        onClick={() => accessible && setSubTab(value)}
                        className={`flex-1 max-w-xl text-xs ${
                          label !== "Final Report"
                            ? "text-[#e06666]"
                            : "text-[#3f3f3d]"
                        }  2xl:text-lg text-center font-medium py-2 mx-1 rounded-md border cursor-pointer transition-all duration-200 ${
                          accessible
                            ? subTab === value
                              ? "bg-[#f8f4eb] border-[#3f3f3d] shadow-sm"
                              : "border-[#b4b4b4] hover:bg-[#d6d9d3]"
                            : "border-[#e0e0e0] text-[#e06666] cursor-not-allowed bg-gray-100"
                        }`}
                      >
                        {label}
                      </div>
                    )
                  );
                })}
            </>
          )}
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
              Patient Name:{" "}
              <span className="font-semibold">
                {patientDetails.refUserFirstName}
              </span>
            </div>

            <div className="text-sm">
              Patient ID:{" "}
              <span className="font-semibold">
                {patientDetails.refUserCustId}
              </span>
            </div>

            <div className="text-sm">
              Gender:{" "}
              <span className="font-semibold capitalize">
                {patientDetails.refUserGender
                  ? patientDetails.refUserGender === "female"
                    ? "F"
                    : patientDetails.refUserGender.toUpperCase()
                  : ``}
              </span>
            </div>

            <div className="text-sm">
              DOB:{" "}
              <span className="font-semibold capitalize">
                {patientDetails.refUserDOB
                  ? formatDateWithAge(patientDetails.refUserDOB)
                  : ""}
              </span>
            </div>

            <div className="text-sm">
              Patient Form:{" "}
              <span className="font-semibold">
                {patientForm(
                  assignData?.appointmentStatus[0]?.refCategoryId || 0
                ) || "-"}
              </span>
            </div>
            <div className="text-sm">
              Date:{" "}
              <span className="font-semibold">
                {assignData?.appointmentStatus[0]?.refAppointmentDate
                  ? formatReadableDate(
                      assignData?.appointmentStatus[0]?.refAppointmentDate
                    )
                  : ""}
                {/* {assignData?.appointmentStatus[0]?.refAppointmentDate
                  ? new Date(
                      assignData.appointmentStatus[0].refAppointmentDate
                    ).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "-"} */}
              </span>
            </div>

            <div className="text-sm">
              Scan Center:{" "}
              <span className="font-semibold">
                {assignData?.appointmentStatus[0]?.refSCName}
              </span>
            </div>
          </div>

          <div className="text-sm text-center text-gray-500">Other reports</div>
          <div className="overflow-auto max-h-[40vh] rounded-md shadow border border-gray-200 w-full max-w-3xl mx-auto mt-1 mb-4">
            <table className="min-w-full divide-y divide-gray-200  text-left">
              <thead className="bg-[#a3b1a0] text-white text-[12px] text-center 2xl:text-base sticky top-0 z-10">
                <tr>
                  <th className="px-1 py-2 w-1/6 font-semibold">S.No</th>
                  <th className="px-1 py-2 w-3/6 font-semibold text-center">
                    Report Title
                  </th>
                  <th className="px-1 py-2 w-2/6 font-semibold">File</th>
                </tr>
              </thead>

              <tbody className="bg-white">
                {(() => {
                  const filteredReports = patientReports.filter((report) => {
                    const yesNoItem = responsePatientInTake.find(
                      (item) => item.questionId === report.yesNocheckQId
                    );
                    return yesNoItem?.answer === "Yes";
                  });

                  const availableReports = filteredReports.filter((report) => {
                    const availabilityItem = responsePatientInTake.find(
                      (item) => item.questionId === report.reportAvailableQId
                    );
                    const reportItem = responsePatientInTake.find(
                      (item) => item.questionId === report.questionId
                    );

                    return (
                      availabilityItem?.answer === "Available" &&
                      reportItem?.answer !== ""
                    );
                  });

                  if (availableReports.length === 0) {
                    return (
                      <tr className="bg-[#f9f2ea]">
                        <td
                          colSpan={3}
                          className="text-center py-2 text-xs text-gray-500"
                        >
                          No Reports Found
                        </td>
                      </tr>
                    );
                  }

                  return availableReports.map((report, idx) => {
                    // const reportItem = responsePatientInTake.find(
                    //   (item) => item.questionId === report.questionId
                    // );

                    return (
                      <tr key={report.questionId} className="text-xs">
                        <td className="px-1 py-2 text-center w-12">
                          {idx + 1}
                        </td>
                        <td className="px-1 py-2 text-left">{report.label}</td>
                        <td className="px-1 py-2 text-center">
                          <span
                            className="hover:underline cursor-pointer text-blue-500 text-xs"
                            onClick={() => getPatientReport(report.questionId)}
                          >
                            View
                          </span>
                        </td>
                      </tr>
                    );
                  });
                })()}
              </tbody>
            </table>
          </div>

          <div className="text-sm text-center text-gray-500">
            Other Old reports
          </div>
          <div className="overflow-auto max-h-[40vh] rounded-md shadow border border-gray-200 w-full max-w-3xl mx-auto mt-1 mb-4">
            <table className="min-w-full divide-y divide-gray-200  text-left">
              <thead className="bg-[#a3b1a0] text-white text-[12px] text-center 2xl:text-base sticky top-0 z-10">
                <tr>
                  <th className="px-1 py-2 w-1/6 font-semibold">S.No</th>
                  <th className="px-1 py-2 w-3/6 font-semibold text-center">
                    Report Title
                  </th>
                  <th className="px-1 py-2 w-2/6 font-semibold">File</th>
                </tr>
              </thead>

              <tbody className="bg-white">
                {(() => {
                  if (oldReport && oldReport.length === 0) {
                    return (
                      <tr className="bg-[#f9f2ea]">
                        <td
                          colSpan={3}
                          className="text-center py-2 text-xs text-gray-500"
                        >
                          No Reports Found
                        </td>
                      </tr>
                    );
                  }

                  return oldReport.map((report: GetOldReport, idx: number) => {
                    // const reportItem = responsePatientInTake.find(
                    //   (item) => item.questionId === report.questionId
                    // );

                    return (
                      <tr key={idx} className="text-xs">
                        <td className="px-1 py-2 text-center w-12">
                          {idx + 1}
                        </td>
                        <td className="px-1 py-2 text-left">
                          {" "}
                          {
                            menuOptions.find(
                              (option) =>
                                option.indexVal === report.refORCategoryId
                            )?.label
                          }
                        </td>
                        <td className="px-1 py-2 text-center">
                          <span
                            className="hover:underline cursor-pointer text-blue-500 text-xs"
                            onClick={() => getOldReport(report.files)}
                          >
                            View
                          </span>
                        </td>
                      </tr>
                    );
                  });
                })()}
              </tbody>
            </table>
          </div>

          {/* Table Content */}
          {/* {role?.type &&
            ["admin", "scribe", "radiologist", "wgdoctor", "manager"].includes(
              role?.type
            ) && ( */}
          <div className="text-sm text-center text-gray-500">Time stamp</div>
          <div className="overflow-auto max-h-[40vh] rounded-md shadow border border-gray-200 w-full max-w-3xl mx-auto mt-1 mb-4">
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
                        className={idx % 2 === 0 ? "bg-white" : "bg-[#f9f2ea]"}
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
                          // className={
                          //   item.refRHHandleEndTime &&
                          //   item.refRHHandleStatus !== "Changes"
                          //     ? "text-green-600"
                          //     : "text-gray-400"
                          // }
                          >
                            {item.refRHHandleEndTime ? (
                              <>
                                <Dialog>
                                  <form>
                                    <DialogTrigger asChild>
                                      <div className="cursor-pointer">
                                        {/* {item.refRHHandleStatus === "Changes"
                                          ? "Saved Changes"
                                          : item.refRHHandleStatus +
                                            " Completed"} */}
                                        {/* {item.refRHHandleStatus +
                                              " Completed"} */}
                                        <PatientStatusColor
                                          status={item.refRHHandleStatus}
                                        />
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
                                          value={item.refRHHandleContentText}
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
                    <td
                      colSpan={4}
                      className="px-2 py-2 text-xs text-center text-gray-500"
                    >
                      No Data Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* )} */}

          {role?.type && (
            <>
              <div className="text-sm text-center text-gray-500 mb-1">
                Status saver
              </div>
              <div
                className={`flex flex-wrap gap-2 ${
                  location?.readOnly ? "pointer-events-none" : ""
                }`}
              >
                {/* Buttons */}
                {/* {tab === 4 && subTab === 4 && ( */}
                <>
                  {role.id !== 8 && (
                    <>
                      <Button
                        variant="greenTheme"
                        className="text-xs w-[48%] text-white px-3 py-2 mb-2 min-w-[48%]"
                        onClick={() => setLoadTemplateStatus(true)}
                        disabled={tab !== 4 || subTab !== 4 || syncStatus.Notes}
                      >
                        Load Template
                      </Button>
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
                    </>
                  )}
                  <Dialog
                    onOpenChange={setLoadTemplateStatus}
                    open={loadTemplateStatus}
                  >
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Load template to server</DialogTitle>
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
                                      <Label htmlFor="width">
                                        Access Status
                                      </Label>
                                      <Select
                                        value={accessStatus}
                                        onValueChange={(value) =>
                                          setAccessStatus(value)
                                        }
                                      >
                                        <SelectTrigger className="w-full bg-white text-sm">
                                          <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="private">
                                            Private
                                          </SelectItem>
                                          <SelectItem value="public">
                                            Public
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
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
                          <>
                            {/* Personal Templates */}
                            <Label>Personal</Label>
                            {filteredTemplates.filter(
                              (data: any) =>
                                data.refRFCreatedBy.toString() ===
                                user?.refUserId.toString()
                            ).length > 0 ? (
                              filteredTemplates
                                .filter(
                                  (data: any) =>
                                    data.refRFCreatedBy.toString() ===
                                    user?.refUserId.toString()
                                )
                                .map((data: any) => (
                                  <div
                                    key={data.refRFId}
                                    className="text-xs px-3 py-2 rounded-sm border border-gray-200"
                                  >
                                    <div className="flex justify-between items-center">
                                      <div>{data.refRFName}</div>
                                      <div className="flex gap-2">
                                        <Select
                                          value={data.refRFAccessStatus}
                                          onValueChange={(value) =>
                                            updateTemplate(data.refRFId, value)
                                          }
                                        >
                                          <SelectTrigger className="w-full bg-white text-sm">
                                            <SelectValue placeholder="Status" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="private">
                                              Private
                                            </SelectItem>
                                            <SelectItem value="public">
                                              Public
                                            </SelectItem>
                                          </SelectContent>
                                        </Select>
                                        <Button
                                          variant="greenTheme"
                                          className="text-xs text-white px-3 py-1 h-6"
                                          onClick={() => {
                                            !loadingStatus &&
                                              getTemplate(data.refRFId);
                                          }}
                                        >
                                          {loadingStatus === data.refRFId ? (
                                            <Loader className="animate-spin w-4 h-4" />
                                          ) : (
                                            "Load as report"
                                          )}
                                        </Button>
                                        <Button
                                          variant="destructive"
                                          className="text-xs text-white px-3 py-1 h-6"
                                          onClick={() => {
                                            !deleteLoadingStatus &&
                                              deleteTemplate(data.refRFId);
                                          }}
                                        >
                                          {deleteLoadingStatus ===
                                          data.refRFId ? (
                                            <Loader className="animate-spin w-4 h-4" />
                                          ) : (
                                            <Trash />
                                          )}
                                        </Button>
                                      </div>
                                    </div>
                                    {role.id === 1 && (
                                      <div>
                                        Created By:{" "}
                                        <strong>{data.refUserCustId}</strong>
                                      </div>
                                    )}
                                  </div>
                                ))
                            ) : (
                              <div className="text-xs text-gray-500 px-3 py-2">
                                No personal templates available.
                              </div>
                            )}

                            {/* Public Templates */}
                            <Label>Public</Label>
                            {filteredTemplates.filter(
                              (data: any) =>
                                data.refRFCreatedBy.toString() !==
                                user?.refUserId.toString()
                            ).length > 0 ? (
                              filteredTemplates
                                .filter(
                                  (data: any) =>
                                    data.refRFCreatedBy.toString() !==
                                    user?.refUserId.toString()
                                )
                                .map((data: any) => (
                                  <div
                                    key={data.refRFId}
                                    className="text-xs px-3 py-2 rounded-sm border border-gray-200"
                                  >
                                    <div className="flex justify-between items-center">
                                      <div>{data.refRFName}</div>
                                      <div className="flex gap-2">
                                        {role.id === 1 && (
                                          <>
                                            <Select
                                              value={data.refRFAccessStatus}
                                              onValueChange={(value) =>
                                                updateTemplate(
                                                  data.refRFId,
                                                  value
                                                )
                                              }
                                            >
                                              <SelectTrigger className="w-full bg-white text-sm">
                                                <SelectValue placeholder="Status" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="private">
                                                  Private
                                                </SelectItem>
                                                <SelectItem value="public">
                                                  Public
                                                </SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </>
                                        )}
                                        <Button
                                          variant="greenTheme"
                                          className="text-xs text-white px-3 py-1 h-6"
                                          onClick={() => {
                                            !loadingStatus &&
                                              getTemplate(data.refRFId);
                                          }}
                                        >
                                          {loadingStatus === data.refRFId ? (
                                            <Loader className="animate-spin w-4 h-4" />
                                          ) : (
                                            "Load as report"
                                          )}
                                        </Button>
                                        {role.id === 1 && (
                                          <>
                                            <Button
                                              variant="destructive"
                                              className="text-xs text-white px-3 py-1 h-6"
                                              onClick={() => {
                                                !deleteLoadingStatus &&
                                                  deleteTemplate(data.refRFId);
                                              }}
                                            >
                                              {deleteLoadingStatus ===
                                              data.refRFId ? (
                                                <Loader className="animate-spin w-4 h-4" />
                                              ) : (
                                                <Trash />
                                              )}
                                            </Button>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                    <div>
                                      Created By:{" "}
                                      <strong>{data.refUserCustId}</strong>
                                    </div>
                                  </div>
                                ))
                            ) : (
                              <div className="text-xs text-gray-500 px-3 py-2">
                                No public templates available.
                              </div>
                            )}
                          </>
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

                {reportStages.map(({ label, editStatus, status }, index) => {
                  const isAllowed = stageRoleMap[label]?.includes(role?.type);

                  const handleClick = async () => {
                    if (!isAllowed) return;

                    if (label === "Sign Off") {
                      setShowMailDialog(true); // open dialog
                    } else if (status == "" && label == "Insert Signature") {
                      setLoading(true);
                      if (!syncStatus.Notes) {
                        const date = new Date().toLocaleDateString();
                        let signatureRow = `<br/><strong><p class="ql-align-right"><strong>Electronically signed by ${userDetails.refUserFirstName}, on <em>${date}</em></strong></p></strong>`;
                        if (role.id === 8) {
                          signatureRow = `<br/><strong><p class="ql-align-right"><strong>Verified by ${userDetails.refUserFirstName}, on <em>${date}</em></strong></p></strong>`;
                        }
                        const notesData = Notes + signatureRow;
                        setNotes(notesData);
                        setsyncStatus({
                          ...syncStatus,
                          Notes: false,
                        });
                        setChangedOne((prev) => ({
                          ...prev,
                          syncStatus: true,
                          reportTextContent: true,
                        }));
                        // await reportService.AddSignature(
                        //   signatureRow,
                        //   stateData.appointmentId,
                        //   stateData.userId
                        // );
                      } else {
                        const date = new Date().toLocaleDateString();
                        let signatureRow = `<strong><p class="ql-align-right"><strong>Electronically signed by ${userDetails.refUserFirstName}, on <em>${date}</em></strong></p></strong>`;
                        if (role.id === 8) {
                          signatureRow = `<br/><strong><p class="ql-align-right"><strong>Verified by ${userDetails.refUserFirstName}, on <em>${date}</em></strong></p></strong>`;
                        }
                        const response: {
                          status: boolean;
                          message: string;
                          data: SignatureText[];
                        } = await reportService.AddSignature(
                          signatureRow,
                          stateData.appointmentId,
                          stateData.userId
                        );
                        if (response.status && response.data) {
                          setSignatureText(
                            response.data
                              .map((data: SignatureText) => `${data.refSText}`)
                              .join("<br/>")
                          );
                        }
                      }

                      setLoading(false);
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
                      {label === "Insert Signature" && role.id === 8
                        ? `Verified`
                        : label}
                    </Button>
                  );
                })}

                {role?.id === 8 && (
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
                )}
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
                        <HandleEmailRecepitent />
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
            </>
          )}
        </div>
        <div className="w-[80%]">
          {tab === 1 && (
            <PatientInTakeForm
              fetchFormData={true}
              appointmentId={stateData.appointmentId}
              categoryId={location.categoryId}
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
                  requestVersionRef={requestVersionRef}
                  setChangedOne={setChangedOne}
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
                    breastImplantImage: {
                      value: breastImplantImage,
                      onChange: setBreastImplantImage,
                    },
                    patientHistory: {
                      value: patientHistory,
                      onChange: setPatientHistory,
                    },
                    symmetry: {
                      value: symmetry,
                      onChange: setSymmetry,
                    },
                    symmetryImage: {
                      value: symmentryImage,
                      onChange: setSymmetryImage,
                    },
                  }}
                  setsyncStatus={setsyncStatus}
                  readOnly={location?.readOnly ? true : false}
                />
              ) : subTab === 2 ? (
                <RightReport
                  requestVersionRef={requestVersionRef}
                  setChangedOne={setChangedOne}
                  reportFormData={reportFormData}
                  handleReportInputChange={handleReportInputChange}
                  patientFormData={responsePatientInTake}
                  textEditor={{
                    breastDensityandImageRight: {
                      value: breastDensityandImageRight,
                      onChange: setBreastDensityandImageRight,
                    },
                    breastDensityandImageRightImage: {
                      value: breastDensityandImageRightImage,
                      onChange: setBreastDensityandImageRightImage,
                    },
                    nippleAreolaSkinRight: {
                      value: nippleAreolaSkinRight,
                      onChange: setNippleAreolaSkinRight,
                    },
                    nippleAreolaSkinRightImage: {
                      value: nippleAreolaSkinRightImage,
                      onChange: setNippleAreolaSkinRightImage,
                    },
                    LesionsRight: {
                      value: LesionsRight,
                      onChange: setLesionsRight,
                    },
                    LesionsRightImage: {
                      value: LesionsRightImage,
                      onChange: setLesionsRightImage,
                    },
                    ComparisonPrior: {
                      value: ComparisonPrior,
                      onChange: setComparisonPrior,
                    },
                    grandularAndDuctalTissueRight: {
                      value: grandularAndDuctalTissueRight,
                      onChange: setGrandularAndDuctalTissueRight,
                    },
                    grandularAndDuctalTissueRightImage: {
                      value: grandularAndDuctalTissueRightImage,
                      onChange: setGrandularAndDuctalTissueRightImage,
                    },
                    LymphNodesRight: {
                      value: LymphNodesRight,
                      onChange: setLymphNodesRight,
                    },
                    LymphNodesRightImage: {
                      value: LymphNodesRightImage,
                      onChange: setLymphNodesRightImage,
                    },
                  }}
                  setsyncStatus={setsyncStatus}
                  readOnly={location?.readOnly ? true : false}
                />
              ) : subTab === 3 ? (
                <LeftReport
                  requestVersionRef={requestVersionRef}
                  setChangedOne={setChangedOne}
                  reportFormData={reportFormData}
                  handleReportInputChange={handleReportInputChange}
                  patientFormData={responsePatientInTake}
                  textEditor={{
                    breastDensityandImageLeft: {
                      value: breastDensityandImageLeft,
                      onChange: setBreastDensityandImageLeft,
                    },
                    breastDensityandImageLeftImage: {
                      value: breastDensityandImageLeftImage,
                      onChange: setBreastDensityandImageLeftImage,
                    },
                    nippleAreolaSkinLeft: {
                      value: nippleAreolaSkinLeft,
                      onChange: setNippleAreolaSkinLeft,
                    },
                    nippleAreolaSkinLeftImage: {
                      value: nippleAreolaSkinLeftImage,
                      onChange: setNippleAreolaSkinLeftImage,
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
                    grandularAndDuctalTissueLeftImage: {
                      value: grandularAndDuctalTissueLeftImage,
                      onChange: setGrandularAndDuctalTissueLeftImage,
                    },
                    LymphNodesLeft: {
                      value: LymphNodesLeft,
                      onChange: setLymphNodesLeft,
                    },
                    LymphNodesLeftImage: {
                      value: LymphNodesLeftImage,
                      onChange: setLymphNodesLeftImage,
                    },
                  }}
                  setsyncStatus={setsyncStatus}
                  readOnly={stateData.readOnly ? true : false}
                />
              ) : subTab === 4 ? (
                <>
                  <NotesReport
                    signatureText={signatureText}
                    performingProviderName={performingProviderName}
                    verifyingProviderName={verifyingProviderName}
                    loading={loading}
                    setLoading={setLoading}
                    patientId={stateData.userId}
                    patientpublicprivate={patientpublicprivate}
                    setChangedOne={setChangedOne}
                    reportFormData={reportFormData}
                    responsePatientInTake={responsePatientInTake}
                    textEditor={{
                      patientHistory: {
                        value: patientHistory,
                        onChange: setPatientHistory,
                      },
                      breastImplantImage: {
                        value: breastImplantImage,
                        onChange: setBreastImplantImage,
                      },
                      breastImplant: {
                        value: breastImplantRight,
                        onChange: setBreastImplantRight,
                      },
                      breastDensityandImageRight: {
                        value: breastDensityandImageRight,
                        onChange: setBreastDensityandImageRight,
                      },
                      breastDensityandImageRightImage: {
                        value: breastDensityandImageRightImage,
                        onChange: setBreastDensityandImageRightImage,
                      },
                      nippleAreolaSkinRight: {
                        value: nippleAreolaSkinRight,
                        onChange: setNippleAreolaSkinRight,
                      },
                      nippleAreolaSkinRightImage: {
                        value: nippleAreolaSkinRightImage,
                        onChange: setNippleAreolaSkinRightImage,
                      },
                      LesionsRight: {
                        value: LesionsRight,
                        onChange: setLesionsRight,
                      },
                      LesionsRightImage: {
                        value: LesionsRightImage,
                        onChange: setLesionsRightImage,
                      },
                      ComparisonPrior: {
                        value: ComparisonPrior,
                        onChange: setComparisonPrior,
                      },
                      grandularAndDuctalTissueRight: {
                        value: grandularAndDuctalTissueRight,
                        onChange: setGrandularAndDuctalTissueRight,
                      },
                      grandularAndDuctalTissueRightImage: {
                        value: grandularAndDuctalTissueRightImage,
                        onChange: setGrandularAndDuctalTissueRightImage,
                      },
                      LymphNodesRight: {
                        value: LymphNodesRight,
                        onChange: setLymphNodesRight,
                      },
                      LymphNodesRightImage: {
                        value: LymphNodesRightImage,
                        onChange: setLymphNodesRightImage,
                      },
                      breastDensityandImageLeft: {
                        value: breastDensityandImageLeft,
                        onChange: setBreastDensityandImageLeft,
                      },
                      breastDensityandImageLeftImage: {
                        value: breastDensityandImageLeftImage,
                        onChange: setBreastDensityandImageLeftImage,
                      },
                      nippleAreolaSkinLeft: {
                        value: nippleAreolaSkinLeft,
                        onChange: setNippleAreolaSkinLeft,
                      },
                      nippleAreolaSkinLeftImage: {
                        value: nippleAreolaSkinLeftImage,
                        onChange: setNippleAreolaSkinLeftImage,
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
                      grandularAndDuctalTissueLeftImage: {
                        value: grandularAndDuctalTissueLeftImage,
                        onChange: setGrandularAndDuctalTissueLeftImage,
                      },
                      LymphNodesLeft: {
                        value: LymphNodesLeft,
                        onChange: setLymphNodesLeft,
                      },
                      LymphNodesLeftImage: {
                        value: LymphNodesLeftImage,
                        onChange: setLymphNodesLeftImage,
                      },
                      selectedImpressionId: {
                        value:
                          mainImpressionRecommendation.selectedImpressionId,
                        onChange: (text: string) =>
                          setMainImpressionRecommendation((prev) => ({
                            ...prev,
                            selectedImpressionId: text,
                          })),
                      },
                      selectedImpressionIdRight: {
                        value:
                          mainImpressionRecommendation.selectedImpressionIdRight,
                        onChange: (text: string) =>
                          setMainImpressionRecommendation((prev) => ({
                            ...prev,
                            selectedImpressionId: text,
                          })),
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
                      symmetryImage: {
                        value: symmentryImage,
                        onChange: setSymmetryImage,
                      },
                      addendumText: {
                        value: addendumText,
                        onChange: setAddendumText,
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
                    reportStatus={
                      assignData?.appointmentStatus[0].refAppointmentComplete ||
                      ""
                    }
                    AppointmentId={
                      assignData?.appointmentStatus[0].refAppointmentId || 0
                    }
                  />
                </>
              ) : (
                subTab === 5 && (
                  <Impression
                    requestVersionRef={requestVersionRef}
                    additionalChangesChangeStatus={
                      additionalChangesChangeStatus
                    }
                    setChangedOne={setChangedOne}
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
                    assignData={assignData}
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
              Lock case
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
