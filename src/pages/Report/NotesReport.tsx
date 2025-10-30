import TextEditor from "@/components/TextEditor";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import {
  breastDensityandImageRightQuestions,
  ComparisonPriorLeftQuestion,
  ComparisonPriorRightQuestion,
  grandularAndDuctalTissueRightQuestions,
  lesionsLeftQuestions,
  lesionsRightQuestions,
  LymphNodesLeftQuestions,
  LymphNodesRightQuestions,
  nippleAreolaSkinRightQuestions,
} from "./ReportQuestionsAssignment";
import { ChangedOneState, FileData } from "./Report";
import { Switch } from "@/components/ui/switch";
import { ResponsePatientForm } from "../TechnicianPatientIntakeForm/TechnicianPatientIntakeForm";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Save } from "lucide-react";
import { FinalAddendumText, reportService } from "@/services/reportService";
import { LesionsVal } from "./Lisons/LesionsRightString";
import { formatDateWithAge, formatReadableDate } from "@/utlis/calculateAge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "../Routes/AuthContext";
import LoadingOverlay from "@/components/ui/CustomComponents/loadingOverlay";
import { useNavigate } from "react-router-dom";

interface TextEditorProps {
  patientHistory: {
    value: string;
    onChange: (value: string) => void;
  };
  breastImplantImage: {
    value: string;
    onChange: (value: string) => void;
  };
  breastImplant: {
    value: string;
    onChange: (value: string) => void;
  };
  breastDensityandImageRight: {
    value: string;
    onChange: (value: string) => void;
  };
  breastDensityandImageRightImage: {
    value: string;
    onChange: (value: string) => void;
  };
  nippleAreolaSkinRight: {
    value: string;
    onChange: (value: string) => void;
  };
  nippleAreolaSkinRightImage: {
    value: string;
    onChange: (value: string) => void;
  };
  LesionsRight: {
    value: string;
    onChange: (value: string) => void;
  };
  LesionsRightImage: {
    value: string;
    onChange: (value: string) => void;
  };
  ComparisonPrior: {
    value: string;
    onChange: (value: string) => void;
  };
  grandularAndDuctalTissueRight: {
    value: string;
    onChange: (value: string) => void;
  };
  grandularAndDuctalTissueRightImage: {
    value: string;
    onChange: (value: string) => void;
  };
  LymphNodesRight: {
    value: string;
    onChange: (value: string) => void;
  };
  LymphNodesRightImage: {
    value: string;
    onChange: (value: string) => void;
  };
  breastDensityandImageLeft: {
    value: string;
    onChange: (value: string) => void;
  };
  nippleAreolaSkinLeft: {
    value: string;
    onChange: (value: string) => void;
  };
  LesionsLeft: {
    value: string;
    onChange: (value: string) => void;
  };
  ComparisonPriorLeft: {
    value: string;
    onChange: (value: string) => void;
  };
  grandularAndDuctalTissueLeft: {
    value: string;
    onChange: (value: string) => void;
  };
  breastDensityandImageLeftImage: {
    value: string;
    onChange: (value: string) => void;
  };
  LymphNodesLeft: {
    value: string;
    onChange: (value: string) => void;
  };
  ImpressionText: {
    value: string;
    onChange: (value: string) => void;
  };
  selectedImpressionId: {
    value: string;
    onChange: (value: string) => void;
  };
  selectedImpressionIdRight: {
    value: string;
    onChange: (value: string) => void;
  };
  ImpressionTextRight: {
    value: string;
    onChange: (value: string) => void;
  };
  RecommendationText: {
    value: string;
    onChange: (value: string) => void;
  };
  RecommendationTextRight: {
    value: string;
    onChange: (value: string) => void;
  };
  OptionalImpressionText: {
    value: string;
    onChange: (value: string) => void;
  };
  OptionalImpressionTextRight: {
    value: string;
    onChange: (value: string) => void;
  };
  OptionalRecommendationText: {
    value: string;
    onChange: (value: string) => void;
  };
  OptionalRecommendationTextRight: {
    value: string;
    onChange: (value: string) => void;
  };
  CommonImpresRecommText: {
    value: string;
    onChange: (value: string) => void;
  };
  CommonImpresRecommTextRight: {
    value: string;
    onChange: (value: string) => void;
  };
  CommonImpresRecommTextVal: {
    value: string;
    onChange: (value: string) => void;
  };
  CommonImpresRecommTextRightVal: {
    value: string;
    onChange: (value: string) => void;
  };
  symmetry: {
    value: string;
    onChange: (value: string) => void;
  };
  addendumText: {
    value: string;
    onChange: (value: string) => void;
  };
  nippleAreolaSkinLeftImage: {
    value: string;
    onChange: (value: string) => void;
  };
  grandularAndDuctalTissueLeftImage: {
    value: string;
    onChange: (value: string) => void;
  };
  LymphNodesLeftImage: {
    value: string;
    onChange: (value: string) => void;
  };
  symmetryImage: {
    value: string;
    onChange: (value: string) => void;
  };
}

interface ReportQuestion {
  questionId: number;
  answer: string;
}

type Props = {
  signatureText: string;
  performingProviderName: string;
  verifyingProviderName: string;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  patientId: number;
  patientpublicprivate: string;
  setChangedOne: React.Dispatch<React.SetStateAction<ChangedOneState>>;
  reportFormData: ReportQuestion[];
  responsePatientInTake: ResponsePatientForm[];
  textEditor: TextEditorProps;
  syncStatus: {
    Notes: boolean;
    ImpressionsRecommendations: boolean;
  };
  setsyncStatus: any;
  Notes: string;
  setNotes: any;
  name: string;
  gender: string;
  AppointmentDate: string;
  ScancenterCode: string;
  studyTime: string;
  patientDetails: any;
  readOnly?: boolean;
  patientHistory: string;
  ScanCenterImg: FileData | null;
  ScancenterAddress: string;
  reportAccess: boolean;
  reportStatus: string;
  AppointmentId: number;
};

const NotesReport: React.FC<Props> = ({
  signatureText,
  performingProviderName,
  verifyingProviderName,
  loading,
  setLoading,
  patientId,
  patientpublicprivate,
  setChangedOne,
  textEditor,
  reportFormData,
  syncStatus,
  setsyncStatus,
  Notes,
  setNotes,
  AppointmentDate,
  ScancenterCode,
  patientDetails,
  readOnly,
  patientHistory,
  ScanCenterImg,
  ScancenterAddress,
  reportAccess,
  reportStatus,
  AppointmentId,
}) => {
  console.log(reportAccess);

  const [dialog, setDialog] = useState(false);

  const getAnswer = (id: number) =>
    reportFormData.find((q) => q.questionId === id)?.answer || "";

  const breastDensityRight =
    getAnswer(breastDensityandImageRightQuestions.breastSelect) == "Present"
      ? true
      : false;
  const nippleAreolaRight =
    getAnswer(nippleAreolaSkinRightQuestions.nippleSelect) == "Present"
      ? true
      : false;
  const glandularRight =
    getAnswer(grandularAndDuctalTissueRightQuestions.grandularSelect) ==
    "Present"
      ? true
      : false;
  const lessionsRight =
    getAnswer(lesionsRightQuestions.lesionsr) == "Present" ? true : false;
  const lymphRight =
    getAnswer(LymphNodesRightQuestions.Intramammaryr) == "Present"
      ? true
      : false;
  const comparisonRight =
    getAnswer(ComparisonPriorRightQuestion.ComparisonPriorRight) == "Present"
      ? true
      : false;
  const breastDensityLeft =
    getAnswer(breastDensityandImageRightQuestions.breastSelect) == "Present"
      ? true
      : false;
  const nippleAreolaLeft =
    getAnswer(nippleAreolaSkinRightQuestions.nippleSelect) == "Present"
      ? true
      : false;
  const glandularLeft =
    getAnswer(grandularAndDuctalTissueRightQuestions.grandularSelect) ==
    "Present"
      ? true
      : false;
  const lessionsLeft =
    getAnswer(lesionsLeftQuestions.lesionsr) == "Present" ? true : false;
  const lymphLeft =
    getAnswer(LymphNodesLeftQuestions.Intramammaryr) == "Present"
      ? true
      : false;
  const comparisonLeftVal =
    getAnswer(ComparisonPriorLeftQuestion.ComparisonPriorRight) == "Present"
      ? true
      : false;

  const FindAssessmentCategory = (val: string): string => {
    const O1 = ["N0"];
    const N1 = ["N1"];
    const N2 = ["N2"];
    const A1 = ["A1"];
    const A2 = ["A2"];
    const A3 = ["A3"];
    const A4 = ["A4"];

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

  useEffect(() => {
    if (syncStatus.Notes) {
      let lesionsVal: LesionsVal = {} as LesionsVal;

      try {
        lesionsVal = JSON.parse(textEditor.LesionsRight.value) as LesionsVal;
      } catch (err) {
        console.log(err);
        lesionsVal = {} as LesionsVal;
      }

      let lesionsValLeft: LesionsVal = {} as LesionsVal;

      try {
        lesionsValLeft = JSON.parse(textEditor.LesionsLeft.value) as LesionsVal;
      } catch (err) {
        console.log(err);
        lesionsValLeft = {} as LesionsVal;
      }

      let comparison: string[] = [];

      try {
        comparison = JSON.parse(textEditor.ComparisonPrior.value) as string[];
      } catch (err) {
        console.log(err);
        comparison = [] as string[];
      }

      let comparisonLeft: string[] = [];

      try {
        comparisonLeft = JSON.parse(
          textEditor.ComparisonPriorLeft.value
        ) as string[];
      } catch (err) {
        console.log(err);
        comparisonLeft = [] as string[];
      }

      setNotes(
        `
       <div>
       ${
         ScanCenterImg
           ? ScanCenterImg.contentType === "url"
             ? `<img src="${ScanCenterImg.base64Data.trim()}" alt="Logo" width="200px"/><br/><br/>`
             : `<img src="data:${ScanCenterImg.contentType};base64,${ScanCenterImg.base64Data}" alt="Logo" width="200px"/><br/><br/>`
           : ""
       }
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
          <td style="border: 1px solid #000; padding: 4px;">${ScancenterCode}, ${ScancenterAddress}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; padding: 4px;"><strong>USER ID</strong></td>
          <td style="border: 1px solid #000; padding: 4px;">${
            patientDetails.refUserCustId
          }</td>
          <td style="border: 1px solid #000; padding: 4px;"><strong>DATE OF VISIT</strong></td>
          <td style="border: 1px solid #000; padding: 4px;">${formatReadableDate(
            AppointmentDate
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
    getAnswer(1) === "Present"
      ? `
    <br />
  <div><strong>BREAST IMPLANTS:</strong><br />${
    textEditor.breastImplant.value
  }${
          textEditor.breastImplantImage.value
            ? textEditor.breastImplantImage.value
            : ""
        }</div>
    `
      : ``
  }

  ${
    textEditor.symmetry.value
      ? `
    <br />
  <div>${textEditor.symmetry.value}${
          textEditor.symmetryImage.value ? textEditor.symmetryImage.value : ""
        }</div>
    `
      : ``
  }
  <br />

  ${
    getAnswer(130) === "Present"
      ? `
    <p><strong>RIGHT BREAST FINDINGS:</strong></p>

  ${
    breastDensityRight
      ? `<span>${textEditor.breastDensityandImageRight.value}</span>${
          textEditor.breastDensityandImageRightImage.value.length > 7
            ? `<span>${textEditor.breastDensityandImageRightImage.value}<br/></span>`
            : "<p><br/></p>"
        }`
      : ``
  }
  ${
    nippleAreolaRight
      ? `${textEditor.nippleAreolaSkinRight.value}${
          textEditor.nippleAreolaSkinRightImage.value.length > 7
            ? `<span>${textEditor.nippleAreolaSkinRightImage.value}<br/></span>`
            : "<p><br/></p>"
        }`
      : ``
  }
  ${
    glandularRight
      ? `<p><strong>Glandular and ductal tissue: </strong></p>${
          textEditor.grandularAndDuctalTissueRight.value
        }${
          textEditor.grandularAndDuctalTissueRightImage.value.length > 7
            ? `<span>${textEditor.grandularAndDuctalTissueRightImage.value}<br/></span>`
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
                  const raw = getAnswer(lesionsRightQuestions.simplecrstDatar);
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
                  const raw = getAnswer(lesionsRightQuestions.complexcrstDatar);
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
                  const raw = getAnswer(
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
                  const raw = getAnswer(
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
                  const raw = getAnswer(
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
                  const raw = getAnswer(
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
                  const raw = getAnswer(lesionsRightQuestions.solidmassDatar);
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
                  const raw = getAnswer(lesionsRightQuestions.OtherDatar);
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
      ? `<div><strong>Lymph Nodes: </strong>${
          textEditor.LymphNodesRight.value
        }${
          textEditor.LymphNodesRightImage.value.length > 7
            ? `<span>${textEditor.LymphNodesRightImage.value}<br/></span>`
            : "<p><br/></p>"
        }<div>`
      : ``
  }
  ${
    comparisonRight
      ? `<p><strong>Comparison to Prior Studies:</strong><br />${comparison
          .map((data, index) => {
            let dataArray: any[] = [];
            const raw = getAnswer(ComparisonPriorRightQuestion.LesionCompTable);
            dataArray = raw ? JSON.parse(raw) : [];

            return data + (dataArray[index]?.vol1 ? dataArray[index].vol1 : "");
          })
          .join("<br/>")}</p><br/>`
      : ``
  }
    `
      : ``
  }
  
  ${
    getAnswer(131) === "Present"
      ? `
    <p><strong>LEFT BREAST FINDINGS:</strong></p>

  ${
    breastDensityLeft
      ? `<span>${textEditor.breastDensityandImageLeft.value}</span>${
          textEditor.breastDensityandImageLeftImage.value.length > 7
            ? `<span>${textEditor.breastDensityandImageLeftImage.value}<br/></span>`
            : "<p><br/></p>"
        }`
      : ``
  }
  ${
    nippleAreolaLeft
      ? `${textEditor.nippleAreolaSkinLeft.value}${
          textEditor.nippleAreolaSkinLeftImage.value.length > 7
            ? `<span>${textEditor.nippleAreolaSkinLeftImage.value}<br/><span>`
            : "<p><br/></p>"
        }`
      : ``
  }
  ${
    glandularLeft
      ? `<p><strong>Glandular and ductal tissue: </strong></p>${
          textEditor.grandularAndDuctalTissueLeft.value
        }${
          textEditor.grandularAndDuctalTissueLeftImage.value.length > 7
            ? `<span>${textEditor.grandularAndDuctalTissueLeftImage.value}<br/></span>`
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
                    const raw = getAnswer(lesionsLeftQuestions.simplecrstDatar);
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
                    const raw = getAnswer(
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
                    const raw = getAnswer(
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
                    const raw = getAnswer(
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
                    const raw = getAnswer(
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
                    const raw = getAnswer(
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
                    const raw = getAnswer(lesionsLeftQuestions.solidmassDatar);
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
                    const raw = getAnswer(lesionsLeftQuestions.OtherDatar);
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
      ? `<div><strong>Lymph Nodes: </strong>${textEditor.LymphNodesLeft.value}${
          textEditor.LymphNodesLeftImage.value.length > 7
            ? `<span>${textEditor.LymphNodesLeftImage.value}<br/></span>`
            : "<p><br/></p>"
        }</div>`
      : ``
  }
  ${
    comparisonLeftVal
      ? `<p><strong>Comparison to Prior Studies:</strong><br />${comparisonLeft
          .map((data, index) => {
            let dataArray: any[] = [];
            const raw = getAnswer(ComparisonPriorLeftQuestion.LesionCompTable);
            dataArray = raw ? JSON.parse(raw) : [];

            return data + (dataArray[index]?.vol1 ? dataArray[index].vol1 : "");
          })
          .join("<br/>")}</p>`
      : ``
  }
    `
      : ``
  }


  ${
    getAnswer(132) === "Present"
      ? `
  <p><strong>RIGHT BREAST:</strong></p>
  ${
    textEditor.ImpressionTextRight.value && getAnswer(81) === "true"
      ? `<p><strong>Assessment Category : </strong> ${FindAssessmentCategory(
          textEditor.selectedImpressionIdRight.value
        )}</p>`
      : ``
  }
  <strong>Impression:</strong>
  ${
    textEditor.ImpressionTextRight.value
      ? `<br/><p>${textEditor.ImpressionTextRight.value}</p>`
      : "<p></p>"
  }
  ${
    textEditor.OptionalImpressionTextRight.value.length > 7
      ? ` <p> ${textEditor.OptionalImpressionTextRight.value}</p>`
      : ""
  }

 ${
   textEditor.CommonImpresRecommTextRightVal.value === "A" ||
   textEditor.CommonImpresRecommTextRightVal.value === "E" ||
   textEditor.CommonImpresRecommTextRightVal.value === "I" ||
   textEditor.CommonImpresRecommTextRightVal.value === "L" ||
   textEditor.CommonImpresRecommTextRightVal.value === "M" ||
   textEditor.CommonImpresRecommTextRightVal.value === "Q" ||
   textEditor.CommonImpresRecommTextRightVal.value === "U" ||
   textEditor.CommonImpresRecommTextRightVal.value === "Y" ||
   textEditor.CommonImpresRecommTextRightVal.value === "2" ||
   textEditor.CommonImpresRecommTextRightVal.value === "3"
     ? `<p>${textEditor.CommonImpresRecommTextRight.value}</p>`
     : ``
 }

  <p><strong>Recommendation:</strong></p>
${
  textEditor.RecommendationTextRight.value
    ? `<p>${textEditor.RecommendationTextRight.value}</p>`
    : ""
}
  ${
    textEditor.OptionalRecommendationTextRight.value.length > 7
      ? `<p>${textEditor.OptionalRecommendationTextRight.value}</p>`
      : ""
  }

   ${
     textEditor.CommonImpresRecommTextRightVal.value !== "A" &&
     textEditor.CommonImpresRecommTextRightVal.value !== "E" &&
     textEditor.CommonImpresRecommTextRightVal.value !== "I" &&
     textEditor.CommonImpresRecommTextRightVal.value !== "L" &&
     textEditor.CommonImpresRecommTextRightVal.value !== "M" &&
     textEditor.CommonImpresRecommTextRightVal.value !== "Q" &&
     textEditor.CommonImpresRecommTextRightVal.value !== "U" &&
     textEditor.CommonImpresRecommTextRightVal.value !== "Y" &&
     textEditor.CommonImpresRecommTextRightVal.value !== "2" &&
     textEditor.CommonImpresRecommTextRightVal.value !== "3"
       ? `<p>${textEditor.CommonImpresRecommTextRight.value}</p>`
       : ``
   }
    `
      : ``
  }

  ${
    getAnswer(133) === "Present"
      ? `
        <br/><p><strong>LEFT BREAST:</strong></p>
        ${
          textEditor.ImpressionText.value && getAnswer(81) === "true"
            ? `<p><strong>Assessment Category : </strong> ${FindAssessmentCategory(
                textEditor.selectedImpressionId.value
              )}</p>`
            : ``
        }
  <strong>Impression:</strong>
  ${
    textEditor.ImpressionText.value
      ? `<br/><p>${textEditor.ImpressionText.value}</p>`
      : `<p></p>`
  }
  ${
    textEditor.OptionalImpressionText.value.length > 7
      ? ` <p> ${textEditor.OptionalImpressionText.value}</p>`
      : ""
  }

 ${
   textEditor.CommonImpresRecommTextVal.value === "A" ||
   textEditor.CommonImpresRecommTextVal.value === "E" ||
   textEditor.CommonImpresRecommTextVal.value === "I" ||
   textEditor.CommonImpresRecommTextVal.value === "L" ||
   textEditor.CommonImpresRecommTextVal.value === "M" ||
   textEditor.CommonImpresRecommTextVal.value === "Q" ||
   textEditor.CommonImpresRecommTextVal.value === "U" ||
   textEditor.CommonImpresRecommTextVal.value === "Y" ||
   textEditor.CommonImpresRecommTextRightVal.value === "2NA" ||
   textEditor.CommonImpresRecommTextRightVal.value === "3NA"
     ? `<p>${textEditor.CommonImpresRecommText.value}</p>`
     : ``
 }
  <p><strong>Recommendation:</strong></p>
  ${
    textEditor.RecommendationText.value
      ? `<p>${textEditor.RecommendationText.value}</p>`
      : ""
  }
 ${
   textEditor.OptionalRecommendationText.value.length > 7
     ? `<p>${textEditor.OptionalRecommendationText.value}</p>`
     : ""
 }
  
  ${
    textEditor.CommonImpresRecommTextVal.value !== "A" &&
    textEditor.CommonImpresRecommTextVal.value !== "E" &&
    textEditor.CommonImpresRecommTextVal.value !== "I" &&
    textEditor.CommonImpresRecommTextVal.value !== "L" &&
    textEditor.CommonImpresRecommTextVal.value !== "M" &&
    textEditor.CommonImpresRecommTextVal.value !== "Q" &&
    textEditor.CommonImpresRecommTextVal.value !== "U" &&
    textEditor.CommonImpresRecommTextVal.value !== "Y" &&
    textEditor.CommonImpresRecommTextVal.value !== "2NA" &&
    textEditor.CommonImpresRecommTextVal.value !== "3NA"
      ? `<p>${textEditor.CommonImpresRecommText.value}</p>`
      : ``
  }
    `
      : ``
  }
  <br/><strong><i><p>The QT Breast Acoustic CT<sup>TM</sup> Scanner is an ultrasonic imaging system that provides reflection-mode and transmission-mode images of a patient’s breast and calculates breast fibroglandular volume and total breast volume. The device is not a replacement for screening mammography.</p></i></strong>
  <strong><i><p>Please note that the device may not detect some non-invasive, atypical, in situ carcinomas or low-grade malignant lesions. These could be represented by abnormalities such as masses, architectural distortion or calcifications. Every image from the device is evaluated by a doctor and should be considered in combination with pertinent clinical, imaging, and pathological findings for each patient. Other patient-specific findings that may be relevant include the presence of breast lumps, nipple discharge or nipple/skin inversion or retraction which should be shared with the medical center where you receive your scan and discussed with your doctor. Even if the doctor reading the QTscan determines that a scan is negative, the doctor may recommend follow-up with your primary care doctor/healthcare provider for clinical evaluation, additional imaging, and/or breast biopsy based on your medical history or other significant clinical findings. Discuss with your doctor/healthcare provider if you have any questions about your QTscan findings. Consultation with the doctor reading your QTscan is also available if requested.</p></i></strong>
` +
          (signatureText.length > 0 ? "<br/>" + signatureText : "") +
          (textEditor.addendumText.value.length > 0
            ? "<br/><p><strong>ADDENDUM:</strong></p>" +
              textEditor.addendumText.value
            : "")
      );
    } else {
      if (Notes.split("<p><strong>ADDENDUM:</strong></p>")[0]) {
        setNotes(
          Notes.split("<p><strong>ADDENDUM:</strong></p>")[0] +
            (textEditor.addendumText.value.length > 0
              ? "<p><strong>ADDENDUM:</strong></p>" +
                textEditor.addendumText.value
              : "")
        );
      }

      // if(Notes.split("<p style='text-align: right;' class='ql-align-right'><strong>SIGNATURE:</strong></p>")[0]){
      //   setNotes(
      //     Notes.split("<p style='text-align: right;' class='ql-align-right'><strong>SIGNATURE:</strong></p>")[0] +
      //       (signatureText.length > 0 ? "<br/>" + signatureText : "")
      //   );
      // }else{
      //   setNotes(
      //     Notes + (signatureText.length > 0 ? "<br/><p style='text-align: right;' class='ql-align-right'><strong>SIGNATURE:</strong></p>" + signatureText : "")
      //   );
      // }
    }

    setMailRecepient(patientpublicprivate !== "private" ? "both" : "none");
  }, [
    reportFormData,
    syncStatus,
    patientHistory,
    textEditor.patientHistory.value,
    textEditor.breastImplant.value,
    textEditor.breastImplantImage.value,
    textEditor.symmetry.value,
    textEditor.symmetryImage.value,
    textEditor.breastDensityandImageRight.value,
    textEditor.breastDensityandImageRightImage.value,
    textEditor.nippleAreolaSkinRight.value,
    textEditor.nippleAreolaSkinRightImage.value,
    textEditor.LesionsRight.value,
    textEditor.LesionsRightImage.value,
    textEditor.ComparisonPrior.value,
    textEditor.grandularAndDuctalTissueRight.value,
    textEditor.grandularAndDuctalTissueRightImage.value,
    textEditor.LymphNodesRight.value,
    textEditor.LymphNodesRightImage.value,
    textEditor.breastDensityandImageLeft.value,
    textEditor.breastDensityandImageLeftImage.value,
    textEditor.nippleAreolaSkinLeft.value,
    textEditor.nippleAreolaSkinLeftImage.value,
    textEditor.grandularAndDuctalTissueLeft.value,
    textEditor.grandularAndDuctalTissueLeftImage.value,
    textEditor.LesionsLeft.value,
    textEditor.LymphNodesLeft.value,
    textEditor.LymphNodesLeftImage.value,
    textEditor.ComparisonPriorLeft.value,
    textEditor.addendumText.value,
  ]);

  const [addButton, setAddButton] = useState<boolean>(false);

  const [addendumText, setAddendumText] = useState("");
  const [addendumMacro, setAddendumMacro] = useState("");
  const [addendumMacroChoose, setAddendumMacroChoose] = useState("");
  const addendumMacroOptions = [
    {
      label: "Results were discussed with ……………… on ………(date)",
      value: "Results were discussed with ……………… on ………(date)",
    },
    {
      label: "The written report was provided / email to ....... on …….(date)",
      value: "The written report was provided / email to ....... on …….(date)",
    },
    {
      label: "Both",
      value:
        "Results were discussed with ……………… on ………(date). The written report was provided / email to ....... on …….(date)",
    },
  ];

  const navigate = useNavigate();

  const [addendumDialog, setAddendumDialog] = useState(false);

  const [mailrecepient, setMailRecepient] = useState("none");

  const handleAddAddendum = async () => {
    try {
      let FinalText = "";
      if (addendumText) {
        FinalText += "<p>" + addendumText + "</p>";
      }

      if (addendumMacro) {
        FinalText += "<p>" + addendumMacro + "</p>";
      }

      setLoading(true);
      const response = await reportService.AddAddedum(
        FinalText,
        AppointmentId,
        mailrecepient === "patient" || mailrecepient === "both",
        mailrecepient === "scancenter" || mailrecepient === "both",
        patientId
      );

      if (response.status) {
        if (response.data && response.data.length > 0) {
          textEditor.addendumText.onChange(
            response.data
              .map(
                (data: FinalAddendumText) =>
                  `${data.refADCreatedAt} - ${data.refUserCustId}<br/>${data.refADText}`
              )
              .join("<br/><br/>")
          );
        }
        setAddButton(false);
        setAddendumText("");
        setAddendumMacro("");
        setAddendumMacroChoose("");
        setMailRecepient("none");
        navigate(-1);
        setLoading(false);
      }
      // textEditor.addendumText.onChange("");
    } catch (error) {
      console.log(error);
    }
  };

  const { role } = useAuth();

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

  return (
    <>
      {loading && <LoadingOverlay />}
      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Warning
            </DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <p className="text-sm text-center font-medium flex justify-center items-center gap-2">
              Do you wish to enable the Wellthgreen Report Portal Find Select?
              Any changes made or templates uploaded will be lost, and the
              report will contain only the Wellthgreen Report Portal Find
              Select.
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <>
                <Button
                  className="w-1/2 bg-[#abb4a5] hover:bg-[#abb4a5]"
                  onClick={() => setDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="w-1/2 bg-[#abb4a5] hover:bg-[#abb4a5]"
                  onClick={() => {
                    setsyncStatus({ ...syncStatus, Notes: true });
                    setDialog(false);
                  }}
                >
                  Ok
                </Button>
              </>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={addendumDialog} onOpenChange={setAddendumDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Select Email Recipients</DialogTitle>
            <DialogDescription>
              Select recipients to proceed with sending the email.
            </DialogDescription>
          </DialogHeader>

          <div>
            <Select value={mailrecepient} onValueChange={setMailRecepient}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose recipient" />
              </SelectTrigger>
              <HandleEmailRecepitent />
            </Select>
          </div>

          <DialogFooter>
            <Button
              variant="greenTheme"
              disabled={!addendumDialog}
              onClick={() => {
                setAddendumDialog(false);
                handleAddAddendum();
              }}
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="w-full lg:px-15 mx-auto rounded-2xl text-lg p-4 leading-7 h-[90vh] space-y-10 overflow-y-scroll relative">
        <div className="space-y-4">
          <>
            <div className="flex items-center justify-between mb-2">
              {" "}
              <span className="text-2xl">Final Report Preview</span>
              {/* {syncStatus.Notes ? (
            <Button
              className="bg-[#a4b2a1] hover:bg-[#a4b2a1] h-[20px] w-[60px] text-sm"
              onClick={() => {
                setsyncStatus({ ...syncStatus, Notes: false });
              }}
            >
              Unsync
            </Button>
          ) : (
            <Button
              className="bg-[#a4b2a1] hover:bg-[#a4b2a1] h-[20px] w-[60px] text-sm"
              onClick={() => {
                setsyncStatus({ ...syncStatus, Notes: true });
              }}
            >
              Sync
            </Button>
          )} */}
              {role?.id === 2 || role?.id === 3 || role?.id === 8 ? (
                <></>
              ) : (
                <div className="self-start mt-2">
                  <div className="flex items-center justify-between gap-4 px-3 py-2 bg-muted shadow rounded-md">
                    <div>
                      <Label className="font-semibold text-[#e06666] text-base">
                        Wellthgreen Report Portal Find Select / Load Template
                      </Label>
                    </div>
                    <Switch
                      id="qtAccess"
                      className="cursor-pointer"
                      checked={syncStatus.Notes}
                      onCheckedChange={(checked: boolean) => {
                        if (!readOnly) {
                          setChangedOne((prev) => ({
                            ...prev,
                            syncStatus: true,
                            reportTextContent: true,
                          }));
                          if (!checked) {
                            setsyncStatus({ ...syncStatus, Notes: checked });
                          } else {
                            setDialog(true);
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </>
          <TextEditor
            value={Notes}
            onChange={setNotes}
            readOnly={syncStatus.Notes || readOnly}
            onManualEdit={() => {
              setChangedOne((prev) => ({
                ...prev,
                reportTextContent: true,
              }));
            }}
            height="60vh"
          />

          {(reportStatus === "Signed Off" ||
            reportStatus === "Signed Off (A)") && (
            <form
              onSubmit={(e) => {
                e.preventDefault();

                if (addButton) {
                  setAddendumDialog(true);
                } else {
                  setAddButton(true);
                }
              }}
            >
              <div className="flex flex-col mb-4">
                <div className="flex items-center justify-between">
                  <p className="text-2xl">Addendum</p>
                  <Button variant="default" className="mt-3 mb-2" type="submit">
                    {addButton ? (
                      <>
                        <Save />
                        <span>Save</span>
                      </>
                    ) : (
                      <>
                        <Plus />
                        <span>Add</span>
                      </>
                    )}
                  </Button>
                </div>
                {addButton && (
                  <>
                    <Textarea
                      placeholder="Add Addendum"
                      value={addendumText}
                      onChange={(e) => setAddendumText(e.target.value)}
                      required
                    />
                    <Label className="mt-2">Macro</Label>
                    <div className="my-2">
                      <Select
                        value={addendumMacroChoose}
                        onValueChange={(val) => {
                          setAddendumMacro(val);
                          setAddendumMacroChoose(val);
                        }}
                      >
                        <SelectTrigger className="bg-[#fff] m-0 text-xs w-full relative">
                          <SelectValue placeholder="Select Impression" />
                        </SelectTrigger>

                        <SelectContent>
                          {addendumMacroOptions.map((option, index) => (
                            <>
                              <SelectItem
                                key={`addendumMacro-${index}`}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            </>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Textarea
                      placeholder="Add Macro Addendum"
                      value={addendumMacro}
                      onChange={(e) => setAddendumMacro(e.target.value)}
                    />
                  </>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default NotesReport;
