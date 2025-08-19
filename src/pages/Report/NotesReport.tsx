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
import { FileData } from "./Report";
import { Switch } from "@/components/ui/switch";
import { ResponsePatientForm } from "../TechnicianPatientIntakeForm/TechnicianPatientIntakeForm";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Save } from "lucide-react";
import { FinalAddendumText, reportService } from "@/services/reportService";

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
}

interface ReportQuestion {
  questionId: number;
  answer: string;
}

type Props = {
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
  age: string;
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
  // readOnly,
  patientHistory,
  ScanCenterImg,
  ScancenterAddress,
  reportAccess,
  reportStatus,
  AppointmentId,
}) => {
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
  const comparisonLeft =
    getAnswer(ComparisonPriorLeftQuestion.ComparisonPriorRight) == "Present"
      ? true
      : false;

  useEffect(() => {
    if (syncStatus.Notes) {
      setNotes(`
       <div>
    ${
      ScanCenterImg?.base64Data
        ? `<img src="data:${ScanCenterImg.contentType};base64,${ScanCenterImg.base64Data}" alt="Logo" width="100" height="100"/>`
        : ""
    }
      </div>
    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
      <tbody>
        <tr>
          <td style="border: 1px solid #000; padding: 4px;"><strong>NAME</strong></td>
          <td style="border: 1px solid #000; padding: 4px;">${name}</td>
          <td style="border: 1px solid #000; padding: 4px;"><strong>DOB</strong></td>
          <td style="border: 1px solid #000; padding: 4px;">${studyTime}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; padding: 4px;"><strong>AGE/GENDER</strong></td>
          <td style="border: 1px solid #000; padding: 4px;">${age} / ${gender}</td>
          <td style="border: 1px solid #000; padding: 4px;"><strong>SCAN CENTER</strong></td>
          <td style="border: 1px solid #000; padding: 4px;">${ScancenterCode}, ${ScancenterAddress}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; padding: 4px;"><strong>USERID</strong></td>
          <td style="border: 1px solid #000; padding: 4px;">${
            patientDetails.refUserCustId
          }</td>
          <td style="border: 1px solid #000; padding: 4px;"><strong>DATE OF VISIT</strong></td>
          <td style="border: 1px solid #000; padding: 4px;">${AppointmentDate}</td>
        </tr>
      </tbody>
    </table>

  <br/>
  
  <h2><strong>QT ULTRASOUND BREAST IMAGING</strong></h2>
  
  <br/>
  

  ${patientHistory}

  <br />

  <p><strong>TECHNIQUE:</strong> Transmission and reflection multiplanar 3-dimensional ultrasound imaging of both breasts was performed using the QT Ultrasound Series 2000 Model-A scanner. Breast density was determined using the Quantitative Breast Density calculator. Images were reviewed in the QTviewer v2.6.2. The nipple-areolar complex, skin, Cooper's ligaments, breast fat distribution, penetrating arteries and veins, glandular and ductal tissues were evaluated. Images were reviewed in coronal, transaxial and sagittal planes.</p>

  <br />
  <div><strong>BREAST IMPLANTS:</strong><br />${
    textEditor.breastImplant.value
  }</div>

  ${
    textEditor.symmetry.value
      ? `
    <br />
  <div>${textEditor.symmetry.value}</div>
    `
      : ``
  }
  <br />

  ${
    getAnswer(130) === "Present"
      ? `
    <p><strong>RIGHT BREAST FINDINGS:</strong></p><br />

  ${
    breastDensityRight
      ? `<p><strong>BREAST DENSITY & IMAGE QUALITY:</strong><br />${textEditor.breastDensityandImageRight.value}</p><br />`
      : ``
  }
  ${
    nippleAreolaRight
      ? `<p><strong>NIPPLE, AREOLA & SKIN:</strong><br />${textEditor.nippleAreolaSkinRight.value}</p><br />`
      : ``
  }
  ${
    glandularRight
      ? `<p><strong>GLANDULAR AND DUCTAL TISSUE:</strong><br />${textEditor.grandularAndDuctalTissueRight.value}</p><br />`
      : ``
  }
  ${
    lessionsRight
      ? `<p><strong>LESIONS:</strong><br />${textEditor.LesionsRight.value}</p><br />`
      : ``
  }
  ${
    lymphRight
      ? `<p><strong>LYMPH NODES:</strong><br />${textEditor.LymphNodesRight.value}</p><br />`
      : ``
  }
  ${
    comparisonRight
      ? `<p><strong>COMPARISON TO PRIOR STUDIES:</strong><br />${textEditor.ComparisonPrior.value}</p><br />`
      : ``
  }
    `
      : ``
  }
  
  ${
    getAnswer(131) === "Present"
      ? `
    <p><strong>LEFT BREAST FINDINGS:</strong></p><br />

  ${
    breastDensityLeft
      ? `<p><strong>BREAST DENSITY & IMAGE QUALITY:</strong><br />${textEditor.breastDensityandImageLeft.value}</p><br />`
      : ``
  }
  ${
    nippleAreolaLeft
      ? `<p><strong>NIPPLE, AREOLA & SKIN:</strong><br />${textEditor.nippleAreolaSkinLeft.value}</p><br />`
      : ``
  }
  ${
    glandularLeft
      ? `<p><strong>GLANDULAR AND DUCTAL TISSUE:</strong><br />${textEditor.grandularAndDuctalTissueLeft.value}</p><br />`
      : ``
  }
  ${
    lessionsLeft
      ? `<p><strong>LESIONS:</strong><br />${textEditor.LesionsLeft.value}</p><br />`
      : ``
  }
  ${
    lymphLeft
      ? `<p><strong>LYMPH NODES:</strong><br />${textEditor.LymphNodesLeft.value}</p><br />`
      : ``
  }
  ${
    comparisonLeft
      ? `<p><strong>COMPARISON TO PRIOR STUDIES:</strong><br />${textEditor.ComparisonPriorLeft.value}</p><br />`
      : ``
  }
    `
      : ``
  }


  ${
    getAnswer(132) === "Present"
      ? `
    <h3><strong>RIGHT BREAST:</strong></h3>
  <p><strong>IMPRESSION:</strong></p>
  <p>${textEditor.ImpressionTextRight.value}</p>
 <p> ${textEditor.OptionalImpressionTextRight.value}</p>

 ${
   textEditor.CommonImpresRecommTextRightVal.value === "A" ||
   textEditor.CommonImpresRecommTextRightVal.value === "B" ||
   textEditor.CommonImpresRecommTextRightVal.value === "I" ||
   textEditor.CommonImpresRecommTextRightVal.value === "N" ||
   textEditor.CommonImpresRecommTextRightVal.value === "T"
     ? `<br/><p>${textEditor.CommonImpresRecommTextRight.value}</p>`
     : ``
 }

  <br/><p><strong>RECOMMENDATION:</strong></p>
 <p> ${textEditor.RecommendationTextRight.value}</p>
  <p>${textEditor.OptionalRecommendationTextRight.value}</p>

   ${
     textEditor.CommonImpresRecommTextRightVal.value !== "A" &&
     textEditor.CommonImpresRecommTextRightVal.value !== "B" &&
     textEditor.CommonImpresRecommTextRightVal.value !== "I" &&
     textEditor.CommonImpresRecommTextRightVal.value !== "N" &&
     textEditor.CommonImpresRecommTextRightVal.value !== "T"
       ? `<br/><p>${textEditor.CommonImpresRecommTextRight.value}</p><br/>`
       : ``
   }
<br/>
    `
      : ``
  }

  ${
    getAnswer(133) === "Present"
      ? `
        <h3><strong>LEFT BREAST:</strong></h3>
  <p><strong>IMPRESSION:</strong></p>
  <p>${textEditor.ImpressionText.value}</p>
 <p> ${textEditor.OptionalImpressionText.value}</p>
 ${
   textEditor.CommonImpresRecommTextVal.value === "A" ||
   textEditor.CommonImpresRecommTextVal.value === "B" ||
   textEditor.CommonImpresRecommTextVal.value === "I" ||
   textEditor.CommonImpresRecommTextVal.value === "N" ||
   textEditor.CommonImpresRecommTextVal.value === "T"
     ? `<p>${textEditor.CommonImpresRecommText.value}</p>`
     : ``
 }
  <br/><p><strong>RECOMMENDATION:</strong></p>
 <p> ${textEditor.RecommendationText.value}</p>
  <p>${textEditor.OptionalRecommendationText.value}</p>

  ${
    textEditor.CommonImpresRecommTextVal.value !== "A" &&
    textEditor.CommonImpresRecommTextVal.value !== "B" &&
    textEditor.CommonImpresRecommTextVal.value !== "I" &&
    textEditor.CommonImpresRecommTextVal.value !== "N" &&
    textEditor.CommonImpresRecommTextVal.value !== "T"
      ? `<br/><p>${textEditor.CommonImpresRecommText.value}</p><br/>`
      : ``
  }
 
    `
      : ``
  }


  <strong><i><p>Patients are encouraged to continue routine annual breast cancer screening as appropriate for their age and risk profile. In addition to imaging, monthly breast self-examinations are recommended. Patients should monitor for any new lumps, focal thickening, changes in breast size or shape, skin dimpling, nipple inversion or discharge, or any other unusual changes. If any new symptoms or palpable abnormalities are identified between scheduled screenings, patients should promptly consult their healthcare provider for further evaluation.</p></i></strong>
  <strong><i><p>It is important to recognize that even findings which appear benign may warrant periodic imaging follow-up to ensure stability over time. Early detection of changes plays a key role in maintaining long-term breast health.</p></i></strong>
  <i><p>Nothing in this report is intended to be – nor should it be construed to be – an order or referral or a direction to the treating physician to order any particular diagnostic testing. The treating physician will decide whether or not to order or initiate a consultation for such testing and which qualified facility performs such testing.</p></i>
  <i><p>Please note that the device may not detect some non-invasive, atypical, in situ carcinomas or low-grade malignant lesions. These could be represented by abnormalities such as masses, architectural distortion or calcifications. Scars, dense breast tissue, and breast implants can obscure masses and other findings. Every image from the device is evaluated by a doctor and should be considered in combination with pertinent clinical, imaging, and pathological findings for each patient. Other patient-specific findings that may be relevant include the presence of breast lumps, nipple discharge or nipple/skin inversion or retraction which should be shared with the QT Imaging Center where you receive your scan and discussed with your doctor. Even if the doctor reading the QT scan determines that a scan is negative, the doctor may recommend follow-up with your primary care doctor/healthcare provider for clinical evaluation, additional imaging, and/or breast biopsy based on your medical history or other significant clinical findings. Discuss with your doctor/healthcare provider if you have any questions about your QT scan findings. Consultation with the doctor reading your QT scan is also available if requested. </p></i>
  <i><p>The QT Ultrasound Breast Scanner is an ultrasonic imaging system that provides reflection-mode and transmission-mode images of a patient’s breast and calculates breast fibroglandular volume and total breast volume. The device is not a replacement for screening mammography.” FDA 510k K162372 and K220933 
  The QT Ultrasound Breast Scanner Model 2000A satisfies the requirements of the Certification Mark of the ECM [CE Mark Certification of the European Union] – No. 0P210730.QTUTQ02” and is ISO 90001 and ISO 13485 compliant. 
  </p></i>
  <i><p>QT’s first blinded trial: Malik B, Iuanow E, Klock J. An Exploratory Multi-reader, Multicase Study Comparing Transmission Ultrasound to Mammography on Recall Rates and Detection Rates for Breast Cancer Lesions. Academic Radiology February 2021. https://www.sciencedirect.com/science/article/pii/S1076633220306462 ; https://doi.org/10.1016/j.acra.2020.11.011 </p></i>
  <i><p>QT’s most recent second blinded trial against DBT: Jiang Y, Iuanow E, Malik B and Klock J. A Multireader Multicase (MRMC) Receiver Operating Characteristic (ROC) Study Evaluating Noninferiority of Quantitative Transmission (QT) Ultrasound to Digital Breast Tomosynthesis (DBT) on Detection and Recall of Breast Lesions. Academic Radiology 2024. https://authors.elsevier.com/sd/article/S1076-6332(23)00716-X </p></i>
`+ (textEditor.addendumText.value.length > 0 ? "<br/><h3><strong>ADDENDUM:</strong></h3>" + textEditor.addendumText.value : ""));
    }
  }, [
    reportFormData,
    syncStatus,
    patientHistory,
    textEditor.breastImplant.value,
    textEditor.addendumText.value
  ]);

  const [addButton, setAddButton] = useState<boolean>(false);

  const [addendumText, setAddendumText] = useState("");

  const handleAddAddendum = async () => {
    try {
      const response = await reportService.AddAddedum(
        addendumText,
        AppointmentId
      );

      console.log(response);
      
      setAddButton(false);
      setAddendumText("");

      if (response.status) {
        textEditor.addendumText.onChange(
          response.data.map(
            (data: FinalAddendumText) =>
              `${data.refADCreatedAt} - ${data.refUserCustId}<br/>${data.refADText}`
          ).join("<br/><br/>")
        );
      }
      // textEditor.addendumText.onChange("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Warning
            </DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <p className="text-sm text-center font-medium flex justify-center items-center gap-2">
              Do you wish to enable the EaseQT 10.10 template? Any changes made
              or templates uploaded will be lost, and the report will contain
              only the EaseQT 10.10 template.
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
      <div className="w-full lg:px-15 mx-auto rounded-2xl text-lg p-4 leading-7 h-[90vh] space-y-10 overflow-y-scroll">
        <div className="space-y-4">
          {reportAccess && (
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
                <div className="self-start mt-2">
                  <div className="flex items-center justify-between gap-4 px-3 py-2 bg-muted shadow rounded-md">
                    <div>
                      <Label className="font-semibold text-base">
                        Ease QT 10.10 Auto Report
                      </Label>
                    </div>
                    <Switch
                      id="qtAccess"
                      className="cursor-pointer"
                      checked={syncStatus.Notes}
                      onCheckedChange={(checked: boolean) => {
                        if (!checked) {
                          setsyncStatus({ ...syncStatus, Notes: checked });
                        } else {
                          setDialog(true);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
          <TextEditor
            value={Notes}
            onChange={setNotes}
            readOnly={syncStatus.Notes}
            height="60vh"
          />

          {reportStatus === "Signed Off" && (
            <div className="flex flex-col mb-4">
              <div className="flex items-center justify-between">
                <p className="text-2xl">Addendum</p>
                <Button
                  variant="default"
                  className="mt-3 mb-2"
                  onClick={() => {
                    if (addButton) {
                      handleAddAddendum();
                    } else {
                      setAddButton(true);
                    }
                  }}
                >
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
                <Textarea
                  placeholder="Add Addendum"
                  value={addendumText}
                  onChange={(e) => setAddendumText(e.target.value)}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NotesReport;
