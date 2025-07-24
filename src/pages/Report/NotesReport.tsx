import TextEditor from "@/components/TextEditor";
import { Button } from "@/components/ui/button";
import React, { useEffect } from "react";
import { breastDensityandImageRightQuestions, ComparisonPriorLeftQuestion, ComparisonPriorRightQuestion, grandularAndDuctalTissueRightQuestions, lesionsLeftQuestions, lesionsRightQuestions, LymphNodesLeftQuestions, LymphNodesRightQuestions, nippleAreolaSkinRightQuestions } from "./ReportQuestionsAssignment";

interface TextEditorProps {
  breastImplant: {
    value: string;
    onChange: (value: string) => void;
  };
  breastDensityandImageRight: {
    value: string;
    onChange: (value: string) => void;
  };
  nippleAreolaSkinRight: {
    value: string;
    onChange: (value: string) => void;
  };
  LesionsRight: {
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
  LymphNodesRight: {
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
  LymphNodesLeft: {
    value: string;
    onChange: (value: string) => void;
  };
  ImpressionText: {
    value: string;
    onChange: (value: string) => void;
  };
  RecommendationText: {
    value: string;
    onChange: (value: string) => void;
  };
  OptionalImpressionText: {
    value: string;
    onChange: (value: string) => void;
  };
  OptionalRecommendationText: {
    value: string;
    onChange: (value: string) => void;
  };
  CommonImpresRecommText: {
    value: string;
    onChange: (value: string) => void;
  }
}

interface ReportQuestion {
  questionId: number;
  answer: string;
}

type Props = {
  reportFormData: ReportQuestion[];
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
  age: string;
  AppointmentDate: string;
  ScancenterCode: string;
  studyTime: string;
  patientDetails: any;
  readOnly?: boolean
};

const NotesReport: React.FC<Props> = ({
  textEditor,
  reportFormData,
  syncStatus,
  setsyncStatus,
  Notes,
  setNotes,
  name,
  gender,
  age,
  AppointmentDate,
  ScancenterCode,
  studyTime,
  patientDetails,
  readOnly
}) => {
    const getAnswer = (id: number) => reportFormData.find((q) => q.questionId === id)?.answer || "";
    const breastDensityRight = getAnswer(breastDensityandImageRightQuestions.breastSelect) == "Present" ? true : false;
    const nippleAreolaRight = getAnswer(nippleAreolaSkinRightQuestions.nippleSelect) == "Present" ? true : false;
    const glandularRight = getAnswer(grandularAndDuctalTissueRightQuestions.grandularSelect) == "Present" ? true : false;
    const lessionsRight = getAnswer(lesionsRightQuestions.lesionsr) == "Preent" ? true : false;
    const lymphRight = getAnswer(LymphNodesRightQuestions.Intramammaryr) == "Present" ? true : false;
    const comparisonRight = getAnswer(ComparisonPriorRightQuestion.ComparisonPriorRight) == "Present" ? true : false;
    const breastDensityLeft = getAnswer(breastDensityandImageRightQuestions.breastSelect) == "Present" ? true : false;
    const nippleAreolaLeft = getAnswer(nippleAreolaSkinRightQuestions.nippleSelect) == "Present" ? true : false;
    const glandularLeft = getAnswer(grandularAndDuctalTissueRightQuestions.grandularSelect) == "Present" ? true : false;
    const lessionsLeft = getAnswer(lesionsLeftQuestions.lesionsr) == "Preent" ? true : false;
    const lymphLeft = getAnswer(LymphNodesLeftQuestions.Intramammaryr) == "Present" ? true : false;
    const comparisonLeft = getAnswer(ComparisonPriorLeftQuestion.ComparisonPriorRight) == "Present" ? true : false;
    
    
  useEffect(() => {
    if (syncStatus.Notes) {
      setNotes(`
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr>
                    <td style="border: 1px solid #000; padding: 4px;"><strong>NAME</strong></td>
                    <td style="border: 1px solid #000; padding: 4px;">${name}</td>
                    <td style="border: 1px solid #000; padding: 4px;"><strong>STUDY</strong></td>
                    <td style="border: 1px solid #000; padding: 4px;">${new Date(
                      studyTime
                    )
                      .toISOString()
                      .slice(0, 16)
                      .replace("T", " ")}</td>
                                </tr>
                                <tr>
                                    <td style="border: 1px solid #000; padding: 4px;"><strong>AGE/GENDER</strong></td>
                                    <td style="border: 1px solid #000; padding: 4px;">${age} / ${gender}</td>
                                    <td style="border: 1px solid #000; padding: 4px;"><strong>SCAN CENTER</strong></td>
                    <td style="border: 1px solid #000; padding: 4px;">${ScancenterCode}</td>
                </tr>
                <tr>
                <td style="border: 1px solid #000; padding: 4px;"><strong>USERID</strong></td>
                    <td style="border: 1px solid #000; padding: 4px;">${
                      patientDetails.refUserCustId
                    }</td>
                    <td style="border: 1px solid #000; padding: 4px;"><strong>REPORT</strong></td>
                    <td style="border: 1px solid #000; padding: 4px;">${AppointmentDate}</td>
                    
                </tr>
            </table>
            <br/>
            <br/>
            <h2><strong>QT ULTRASOUND BILATERAL BREAST IMAGING</strong></h2>
            <br/>
            <p><b>TECHNIQUE</b>: Transmission and reflection multiplanar 3-dimensional ultrasound imaging of both breasts was performed using the QT Ultrasound Series 2000 Model-A scanner. Breast density was determined using the Quantitative Breast Density calculator. Images were reviewed in the QTviewer v2.6.2 . The nipple-areolar complex, skin, Cooper's ligaments, breast fat distribution, penetrating arteries and veins, glandular and ductal tissues were evaluated. Images were reviewed in coronal, transaxial and sagittal planes.</p>
            <br/>
            <div><b>BREAST IMPLANTS:</b><br/>${textEditor.breastImplant.value}</div>
            <br/>
            <p><b>RIGHT BREAST FINDINGS:</b></p>
            <br/>
            ${breastDensityRight ? `<p><b>BREAST DENSITY & IMAGE QUALITY:</b><br />
            ${textEditor.breastDensityandImageRight.value}</p><br/>` : ``}
            ${nippleAreolaRight ? `<p><b>NIPPLE, AREOLA & SKIN:</b><br/>${
              textEditor.nippleAreolaSkinRight.value
            }</p><br/>` : ``}
            ${glandularRight ? `<p><b>GLANDULAR AND DUCTAL TISSUE:</b></p>
            ${textEditor.grandularAndDuctalTissueRight.value}<br/>` : ``}
            ${lessionsRight ? `<p><b>LESIONS:</b></p>
            ${textEditor.LesionsRight.value}<br/>` : ``}
            ${lymphRight ? `<p><b>LYMPH NODES:</b></p>
            ${textEditor.LymphNodesRight.value}<br/><br/>` : ``}
            ${comparisonRight ? `<p><b>COMPARISON TO PRIOR STUDIES:</b></p>
            ${textEditor.ComparisonPrior.value}<br/>` : ``}
            <p><b>LEFT BREAST FINDINGS:</b></p><br>
            ${breastDensityLeft ? `<p><b>BREAST DENSITY & IMAGE QUALITY:</b><br/>${
              textEditor.breastDensityandImageLeft.value
            }</p><br/>` : ``}
            ${nippleAreolaLeft ? `<p><b>NIPPLE, AREOLA & SKIN:</b></br>${
              textEditor.nippleAreolaSkinLeft.value
            }</p><br/>` : ``}
            ${glandularLeft ? `<p><b>GLANDULAR AND DUCTAL TISSUE:</b></p>
            ${textEditor.grandularAndDuctalTissueLeft.value}<br/>` : ``}
            ${lessionsLeft ? `<p><b>LESIONS:</b></p>
            ${textEditor.LesionsLeft.value}<br/>` : ``}
            ${lymphLeft ? `<p><b>LYMPH NODES:</b></p>
            ${textEditor.LymphNodesLeft.value}<br/>` : ``}
            ${comparisonLeft ? `p><b>COMPARISON TO PRIOR STUDIES:</b></p><br/>
            ${textEditor.ComparisonPriorLeft.value}<br/>` : ``}
            <p><b>IMPRESSION:</b></p>
            ${textEditor.ImpressionText.value}<br/>${textEditor.OptionalImpressionText.value}<br/><br />
            <p><b>RECOMMENDATION:</b></p>
            ${textEditor.RecommendationText.value}<br/>${textEditor.OptionalRecommendationText.value}<br/></br/>
            <p><b>COMMON:</b></p>
            ${textEditor.CommonImpresRecommText.value}
            <br/>
            `);
    }
  }, [reportFormData, syncStatus]);

  return (
    <div className="w-full lg:w-[90%] mx-auto rounded-2xl text-lg p-4 leading-7 h-[90vh] space-y-10 overflow-y-scroll">
      <div className={`${readOnly ? "pointer-events-none" : ""}`}>

      
      <div className="flex items-center justify-between mb-2">
        {" "}
        <span className="text-2xl">Final Report Preview</span>
        {syncStatus.Notes ? (
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
        )}
      </div>
      <TextEditor
        value={Notes}
        onChange={setNotes}
        readOnly={syncStatus.Notes}
      />
      </div>
    </div>
  );
};

export default NotesReport;
