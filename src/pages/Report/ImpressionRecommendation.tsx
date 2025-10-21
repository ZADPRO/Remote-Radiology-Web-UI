import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Checkbox2 } from "@/components/ui/CustomComponents/checkbox2";
import {
  AssignReportResponse,
  ChangedOneState,
  ReportQuestion,
} from "./Report";
import { Switch } from "@/components/ui/switch";

interface ImpressionProps {
  requestVersionRef: React.MutableRefObject<number>;
  additionalChangesChangeStatus: boolean;
  setChangedOne: React.Dispatch<React.SetStateAction<ChangedOneState>>;
  mainImpressionRecommendation: {
    selectedImpressionId: string;
    selectedRecommendationId: string;
    impressionText: string;
    recommendationText: string;
    selectedImpressionIdRight: string;
    selectedRecommendationIdRight: string;
    impressionTextRight: string;
    recommendationTextRight: string;
  };
  setMainImpressionRecommendation: React.Dispatch<
    React.SetStateAction<{
      selectedImpressionId: string;
      selectedRecommendationId: string;
      impressionText: string;
      recommendationText: string;
      selectedImpressionIdRight: string;
      selectedRecommendationIdRight: string;
      impressionTextRight: string;
      recommendationTextRight: string;
    }>
  >;

  optionalImpressionRecommendation: {
    selectedImpressionId: string;
    selectedRecommendationId: string;
    impressionText: string;
    recommendationText: string;
    selectedImpressionIdRight: string;
    selectedRecommendationIdRight: string;
    impressionTextRight: string;
    recommendationTextRight: string;
  };
  setOptionalImpressionRecommendation: React.Dispatch<
    React.SetStateAction<{
      selectedImpressionId: string;
      selectedRecommendationId: string;
      impressionText: string;
      recommendationText: string;
      selectedImpressionIdRight: string;
      selectedRecommendationIdRight: string;
      impressionTextRight: string;
      recommendationTextRight: string;
    }>
  >;
  assignData: AssignReportResponse | null;
  showOptional: {
    impression: boolean;
    recommendation: boolean;
    impressionRight: boolean;
    recommendationRight: boolean;
  };
  setShowOptional: React.Dispatch<
    React.SetStateAction<{
      impression: boolean;
      recommendation: boolean;
      impressionRight: boolean;
      recommendationRight: boolean;
    }>
  >;
  commonImpressRecomm: {
    id: string;
    text: string;
    idRight: string;
    textRight: string;
  };
  setCommonImpressRecomm: React.Dispatch<
    React.SetStateAction<{
      id: string;
      text: string;
      idRight: string;
      textRight: string;
    }>
  >;
  readOnly?: boolean;
  reportFormData: ReportQuestion[];
  handleReportInputChange: (questionId: number, value: string) => void;
}

interface Additional {
  id: string;
  text: string;
}

export const impressionRecommendation = [
  {
    impressionColor: "#a0a0a0",
    recommendationColor: "#6e6e6e",
    data: [
      {
        id: "0",
        impression: "Incomplete/Indeterminate Study",
        impressionText:
          "The imaging study demonstrates insufficient signal clarity, artifacts, or technical limitations that prevent complete evaluation of the breast tissue. Suboptimal image quality limits diagnostic confidence.",
        impressionTextColor: "#000000",
        impressionBackgroundColor: "transparent",
        recommendation: "Repeat QT Imaging",
        recommendationText:
          "Repeat QT imaging is recommended for improved image quality and better diagnostic clarity.",
        recommendationTextColor: "#000000",
        recommendationBackgroundColor: "#f3f3f3",
      },
    ],
  },
  {
    impressionColor: "#c47194",
    recommendationColor: "#9c3f6d",
    data: [
      {
        id: "1",
        impression: "Unremarkable",
        impressionText:
          "The exam is unremarkable. There is no evidence of suspicious calcifications, dominant masses or architectural distortions to suggest the presence of malignancy.",
        impressionTextColor: "#829c70",
        impressionBackgroundColor: "transparent",
        recommendation: "Return in 1 year",
        recommendationText:
          "Return in 1 year for annual examination as clinically warranted.",
        recommendationTextColor: "#000000",
        recommendationBackgroundColor: "#d9ead3",
      },
      {
        id: "1a",
        impression: "Likely Benign Findings + Architectural Distortion",
        impressionText:
          "The architectural distortion observed is attributed to post-operative or post-procedural changes. The examination demonstrates findings which are likely benign breast changes.",
        impressionTextColor: "#829c70",
        impressionBackgroundColor: "transparent",
        recommendation: "Routine Annual Screening",
        recommendationText:
          "Return for routine annual breast imaging screening in 12 months to monitor breast tissue stability and detect any interval changes.",
        recommendationTextColor: "#000000",
        recommendationBackgroundColor: "#d9ead3",
      },
      {
        id: "1b",
        impression: "Likely Benign Findings",
        impressionText:
          "The examination demonstrates findings which are likely benign breast changes. While tissue variations are present, there is no evidence of suspicious/dominant masses, or architectural distortion to suggest malignancy.",
        impressionTextColor: "#829c70",
        impressionBackgroundColor: "transparent",
        recommendation: "Routine Annual Screening",
        recommendationText:
          "Return for routine annual breast imaging screening in 12 months to monitor breast tissue stability and detect any interval changes.",
        recommendationTextColor: "#000000",
        recommendationBackgroundColor: "#d9ead3",
      },
      {
        id: "2",
        impression: "Low-Risk Characteristics",
        impressionText:
          "The examination shows tissue variations with low-risk features that are not definitively abnormal but require further follow up to ensure they are benign.",
        impressionTextColor: "#829c70",
        impressionBackgroundColor: "transparent",
        recommendation: "Short-Term Follow-Up 6m",
        recommendationText:
          "Return for follow-up imaging in 6 months to assess stability of current findings and ensure no interval progression.",
        recommendationTextColor: "#000000",
        recommendationBackgroundColor: "#fff2cc",
      },
      {
        id: "2a",
        impression: "Low risk - too small",
        impressionText:
          "There is a small mass/ lesion which is too small to characterize.",
        impressionTextColor: "#829c70",
        impressionBackgroundColor: "transparent",
        recommendation: "Short-term Follow-up 6m",
        recommendationText: "Short term follow up is recommended.",
        recommendationTextColor: "#000000",
        recommendationBackgroundColor: "#fff2cc",
      },
      {
        id: "3",
        impression: "Indeterminate Findings: Non palpable mass",
        impressionText:
          "The examination demonstrates indeterminate tissue changes that are not definitively abnormal but also not clearly benign. Further clinical correlation and follow-up imaging are advised to assess stability and significance.",
        impressionTextColor: "#829c70",
        impressionBackgroundColor: "transparent",
        recommendation: "Growth Rate Assessment 3m",
        recommendationText:
          "Follow-up examination in 3 months specifically recommended for assessment of growth characteristics.",
        recommendationTextColor: "#000000",
        recommendationBackgroundColor: "#fff2cc",
      },
      {
        id: "3a",
        impression: "Indeterminate: Not Definitively Abnormal",
        impressionText:
          "The examination shows some architectural variations The examination shows some tissue variations which are indeterminate in nature. Further follow-up may be warranted.",
        impressionTextColor: "#829c70",
        impressionBackgroundColor: "transparent",
        recommendation: "Confirm Benign Nature with Targ USG",
        recommendationText:
          "Additional imaging such as targeted ultrasound is recommended to confirm the benign nature of these findings.",
        recommendationTextColor: "#000000",
        recommendationBackgroundColor: "#ffd966",
      },
      {
        id: "3b",
        impression: "Indeterminate: Calcifications",
        impressionText:
          "The examination demonstrates calcifications as described in the detailed findings. These calcium deposits require further evaluation and follow-up to determine their clinical significance.",
        impressionTextColor: "#829c70",
        impressionBackgroundColor: "transparent",
        recommendation: "Targ USG for Cystic Mass Evaluation",
        recommendationText:
          "Clinical consultation with your health care provider or a breast specialist is recommended to determine management of breast calcifications. Note that QT imaging may not detect all non-invasive or microinvasive lesions.",
        recommendationTextColor: "#000000",
        recommendationBackgroundColor: "#ffd966",
      },
      {
        id: "3c",
        impression: "Indeterminate:  Cysts",
        impressionText:
          "The examination shows changes in breast tissue that may represent cysts (fluid-filled spaces). While cysts are typically benign, further evaluation is needed to confirm this diagnosis.",
        impressionTextColor: "#829c70",
        impressionBackgroundColor: "transparent",
        recommendation:
          "Clinical consulation with a breast specialist or health care provoider for Calcification Management ",
        recommendationText:
          "Additional imaging such as targeted ultrasound is recommended. Clinical follow-up with your health care provider is advised.If additional imaging demonstrates benign features, return for routine annual screening. Please communicate the findings of your outside evaluation with us so that we can correlate with what was seen on your QT.",
        recommendationTextColor: "#000000",
        recommendationBackgroundColor: "#cfe2f3",
      },
      {
        id: "3d",
        impression: "Indeterminate : Postop changes + fluid/ seroma",
        impressionText:
          "The exam shows likely benign post-surgical findings of calcification, scarring and a possible seroma as described. There is no evidence of dominant masses or architectural distortion to suggest the presence of malignancy.",
        impressionTextColor: "#e69138",
        impressionBackgroundColor: "transparent",
        recommendation: "Clinical Consultation",
        recommendationText:
          "Clinical consultation with a breast specialist is recommended for comprehensive evaluation of the current findings and determination of appropriate management strategy.",
        recommendationTextColor: "#000000",
        recommendationBackgroundColor: "#cfe2f3",
      },
      {
        id: "3e",
        impression: "Indeterminate: Post-surgical vs. Recurrence",
        impressionText:
          "The examination shows tissue variations that may represent either post-operative fibrosis (tissue scarring) or recurrent disease. Further follow-up and evaluation are required for definitive characterization.",
        impressionTextColor: "#e69138",
        impressionBackgroundColor: "transparent",
        recommendation: "Clinical consultation + Surveillance",
        recommendationText:
          "Clinical consultation is recommended along with interval imaging and ongoing surveillance to monitor the stability of current findings and ensure appropriate management.",
        recommendationTextColor: "#000000",
        recommendationBackgroundColor: "#cfe2f3",
      },
      {
        id: "3f",
        impression: "Indeterminate: Likely Fibrosis",
        impressionText:
          "The examination shows tissue variations that are likely to represent post-operative fibrosis (tissue scarring). Further follow-up and eval4buation are required for definitive characterization.",
        impressionTextColor: "#e69138",
        impressionBackgroundColor: "transparent",
        recommendation: "Clinical Consultation + Surveillance",
        recommendationText:
          "Clinical consultation is recommended along with interval imaging and ongoing surveillance to monitor the stability of current findings and ensure appropriate management.",
        recommendationTextColor: "#000000",
        recommendationBackgroundColor: "#cfe2f3",
      },
      {
        id: "3g",
        impression: "Indeterminate: Long Standing Findings",
        impressionText:
          "The examination shows long-standing tissue variations that have been present in previous studies. While stability suggests benign nature, continued surveillance is recommended to monitor for any interval changes.",
        impressionTextColor: "#e69138",
        impressionBackgroundColor: "transparent",
        recommendation: "If persists - Targ Usg",
        recommendationText:
          "If the long standing palpable area has not been previously evaluated completely or if clinical concern persists, correlation with targeted ultrasound may be warranted.",
        recommendationTextColor: "#000000",
        recommendationBackgroundColor: "#ffd966",
      },
    ],
  },
  {
    impressionColor: "#8fc97c",
    recommendationColor: "#5ea443",
    data: [
      {
        id: "4",
        impression: "Pain But No LUMP + QT Finding",
        impressionText: "QT findings correspond to the patient's symptoms.",
        impressionTextColor: "#e69138",
        impressionBackgroundColor: "transparent",
        recommendation: "Clinical Monitoring",
        recommendationText:
          "Clinical correlation is advised. Additional imaging or follow-up may be considered based on overall clinical context.",
        recommendationTextColor: "#000000",
        recommendationBackgroundColor: "#cfe2f3",
      },
      {
        id: "4a",
        impression: "Palp Lump - No QT Finding  or Ab/Normal image findings",
        impressionText:
          "No imaging findings are demonstrated in the region of the reported palpable concern. The examination demonstrates findings which are likely benign breast changes. While tissue variations are present, there is no evidence of suspicious / dominant masses, or architectural distortion to suggest malignancy.",
        impressionTextColor: "#e69138",
        impressionBackgroundColor: "transparent",
        recommendation:
          "Breat specialist Evaluation, neg never preclude/Targ USG.",
        recommendationText:
          "Breast specialist evaluation is recommended for further assessment as negative imaging should never preclude evaluation of a clinically suspicious lesion.Targeted ultrasound evaluation is recommended for further assessment of the palpable finding. If Benign - Return for routine annual breast imaging screening in 12 months to monitor breast tissue stability and detect any interval changes.",
        recommendationTextColor: "#000000",
        recommendationBackgroundColor: "#f4cccc",
      },
      {
        id: "4b",
        impression: "Palpable Lump + QT Finding",
        impressionText:
          "The examination demonstrates a QT imaging finding that correlates with the site of the reported palpable concern.",
        impressionTextColor: "#e69138",
        impressionBackgroundColor: "transparent",
        recommendation: "Clinical consultaion + Additional Imaging",
        recommendationText:
          "Clinical consultation and consider additional imaging is recommended for further characterization and management planning.",
        recommendationTextColor: "#000000",
        recommendationBackgroundColor: "#cfe2f3",
      },
      {
        id: "4c",
        impression: "Mammo Calcifications + QT",
        impressionText:
          "QT imaging findings are also noted in the same region of calcifications as described on prior imaging.",
        impressionTextColor: "#e69138",
        impressionBackgroundColor: "transparent",
        recommendation: "Breast Specialist Evaluation",
        recommendationText:
          "Breast specialist evaluation is recommended for further assessment and management of the calcifications.",
        recommendationTextColor: "#000000",
        recommendationBackgroundColor: "#f4cccc",
      },
      {
        id: "4d",
        impression: "USG Solid Mass + QT",
        impressionText:
          "QT findings correspond to the solid mass identified on ultrasound.",
        impressionTextColor: "#e69138",
        impressionBackgroundColor: "transparent",
        recommendation: "Breast Specialist Evaluation",
        recommendationText:
          "Breast specialist evaluation is recommended for comprehensive assessment and further management planning.",
        recommendationTextColor: "#000000",
        recommendationBackgroundColor: "#f4cccc",
      },
      {
        id: "4e",
        impression: "USG Birads 3 findings + QT",
        impressionText:
          "The examination shows tissue variations with low-risk features in the region of the BIRADS 3 lesion .These  are not definitively abnormal but require further follow up to ensure they are benign.",
        impressionTextColor: "#e69138",
        impressionBackgroundColor: "transparent",
        recommendation: "Breast Specialist Evaluation",
        recommendationText:
          "Breast specialist evaluation is recommended to determine appropriate follow-up, which may include short-term surveillance or further testing.",
        recommendationTextColor: "#000000",
        recommendationBackgroundColor: "#f4cccc",
      },
      {
        id: "4f",
        impression: "No QT Correlate for Abnormal Image Findings",
        impressionText:
          "The examination demonstrates findings which are likely benign breast changes. While tissue variations are present, there is no evidence of suspicious / dominant masses, or architectural distortion to suggest malignancy.",
        impressionTextColor: "#e69138",
        impressionBackgroundColor: "transparent",
        recommendation: "Clinical Correlation",
        recommendationText:
          "No corresponding abnormal findings are demonstrated on QT imaging. Clinical correlation is advised. Additional imaging or follow-up may be considered based on overall clinical context.",
        recommendationTextColor: "#000000",
        recommendationBackgroundColor: "#cfe2f3",
      },
      {
        id: "4g",
        impression: "Palp Lump +Abn Imaging + QT Finding",
        impressionText:
          "The reported palpable abnormality is confirmed on imaging and demonstrates concerning features on QT.",
        impressionTextColor: "#e69138",
        impressionBackgroundColor: "transparent",
        recommendation: "Image-Guided Biopsy",
        recommendationText:
          "Image-guided biopsy is recommended for histopathological evaluation and definitive diagnosis.",
        recommendationTextColor: "#ad0000",
        recommendationBackgroundColor: "#f4cccc",
      },
      {
        id: "4h",
        impression: "Palpable Lump + Indeterminate QT Finding",
        impressionText:
          "The examination shows tissue variations that are not definitively abnormal but require further evaluation and follow-up to determine clinical significance and stability over time.",
        impressionTextColor: "#e69138",
        impressionBackgroundColor: "transparent",
        recommendation: "Targ USG",
        recommendationText:
          "Clinical consultation is recommended for targeted breast ultrasound to further characterize imaging findings. If ultrasound demonstrates benign features, return for routine annual screening. Please communicate the findings of your outside evaluation with us so that we can correlate with what was seen on your QT.",
        recommendationTextColor: "#000000",
        recommendationBackgroundColor: "#ffd966",
      },
      {
        id: "4i1",
        impression: "Palpable Axillary Lump + No QT Finding",
        impressionText:
          "No imaging findings are demonstrated in the limited visible region of the reported palpable concern in axilla. The examination shows tissue variations with low-risk features that are not definitively abnormal but require further follow up to ensure they are benign in both breasts.",
        impressionTextColor: "#e69138",
        impressionBackgroundColor: "transparent",
        recommendation: "Targ USG",
        recommendationText:
          "Targeted ultrasound evaluation is recommended for further assessment of the palpable finding. If benign features are confirmed, routine annual screening may resume.",
        recommendationTextColor: "#000000",
        recommendationBackgroundColor: "#ffd966",
      },
      {
        id: "4i2",
        impression: "Palpable Axillary Lump + QT Finding",
        impressionText:
          "The examination demonstrates a QT imaging finding that correlates with the site of the reported palpable concern in the right upper outer quadrant/ axillary tail region of the breast / medial axillary region. USG / MRI correlation is recommended for exact location , since the armpit cannot be completely visualised on QT. ",
        impressionTextColor: "#e69138",
        impressionBackgroundColor: "transparent",
        recommendation: "USG/ MRI",
        recommendationText:
          "Clinical consultation and additional imaging (with a targeted ultrasound / MRI ) are recommended for further characterization and management planning.",
        recommendationTextColor: "#000000",
        recommendationBackgroundColor: "#ffd966",
      },
      {
        id: "4j",
        impression: "BIRADS 3+ Growing Mass. QT benign",
        impressionText:
          "The examination shows tissue variations with low-risk features in the region of the BIRADS 3 lesion. These are not definitively abnormal but require further follow up to ensure they are benign. Though it has benign features, it appears to have grown slightly since her last evaluation.",
        impressionTextColor: "#e69138",
        impressionBackgroundColor: "transparent",
        recommendation: "Breast specialist evaluation",
        recommendationText:
          "Breast specialist evaluation is recommended to determine appropriate follow-up, which may include short-term surveillance or further testing.Should the mass be determined to be benign, yearly follow up is recommended.",
        recommendationTextColor: "#000000",
        recommendationBackgroundColor: "#f4cccc",
      },
      {
        id: "4k",
        impression: "No Correlate For Symptoms (NON LUMP)",
        impressionText:
          "No significant abnormality is identified in the region of reported symptoms. There is no evidence of dominant masses or architectural distortion to suggest malignancy.",
        impressionTextColor: "#e69138",
        impressionBackgroundColor: "transparent",
        recommendation: "Targ USG",
        recommendationText:
          "Clinical monitoring of the symptomatic area is recommended. If a palpable mass or new concern develops, targeted ultrasound evaluation should be performed.",
        recommendationTextColor: "#000000",
        recommendationBackgroundColor: "#ffd966",
      },
      {
        id: "4l",
        impression: "Lumpy Breasts",
        impressionText:
          "There are no discrete masses seen in either breast. The examination demonstrates findings which are likely benign breast changes. While tissue variations are present, there is no evidence of suspicious/dominant masses, or architectural distortion to suggest malignancy.",
        impressionTextColor: "#e69138",
        impressionBackgroundColor: "transparent",
        recommendation: "Clinical consultaion + If Bn - 1yr FU",
        recommendationText:
          "If the patient feels masses, then clinical evaluation with her provider or a breast specialist is recommended. A negative QT scan should not preclude evaluation of a clinically suspicious mass.If Benign - Return for routine annual breast imaging screening in 12 months to monitor breast tissue stability and detect any interval changes.",
        recommendationTextColor: "#000000",
        recommendationBackgroundColor: "#cfe2f3",
      },
      {
        id: "4m",
        impression: "Multiple / Mixed Abnormal Imaging Correlates",
        impressionText:
          "No suspicious imaging findings are demonstrated in the region of the reported palpable concern. Tissue variations with low-risk (BIRADS 3) features are noted in this region. These findings are not definitively abnormal but warrant follow-up imaging to confirm benign stability. The lesion, while demonstrating benign characteristics, appears to have shown slight interval growth compared to the prior evaluation. QT imaging findings correlate with the solid mass previously identified on ultrasound. The examination shows tissue variations that are not definitively abnormal but require further evaluation and follow-up to determine clinical significance and stability over time. QT imaging findings are also noted in the same region of calcifications as described on prior imaging.",
        impressionTextColor: "#e69138",
        impressionBackgroundColor: "transparent",
        recommendation: "Clinical consult +/- AI",
        recommendationText:
          "Clinical consultation with your health care provider is recommended to determine the appropriate follow-up, which may include short-term imaging surveillance or targeted ultrasound for further characterization.If the findings are confirmed to be benign, return to routine annual breast imaging in 12 months is advised to monitor tissue stability and identify any interval changes.",
        recommendationTextColor: "#000000",
        recommendationBackgroundColor: "#cfe2f3",
      },
      {
        id: "4n",
        impression: "mutiple cysts+ AI=ABn QT",
        impressionText:
          "The examination demonstrates findings of tissue abnormalities with indeterminate features. Further evaluation is required.",
        impressionTextColor: "#e69138",
        impressionBackgroundColor: "transparent",
        recommendation: "Biopsy",
        recommendationText:
          "Clinical consultation with your health care provider is recommended for further evaluation, which may include additional imaging and/or image-guided tissue sampling ( biopsy) of the suspicious finding. Histopathological correlation is needed to determine the exact nature of the abnormality.",
        recommendationTextColor: "#ad0000",
        recommendationBackgroundColor: "#e6b8af",
      },
      {
        id: "5",
        impression: "R/o Malignany",
        impressionText:
          "The examination demonstrates findings of significant tissue abnormalities with indeterminate features. Further evaluation is required.",
        impressionTextColor: "#d32323",
        impressionBackgroundColor: "transparent",
        recommendation: "HHUS or Biospy ",
        recommendationText:
          "Clinical consultation with your health care provider is recommended for further evaluation, which may include additional imaging and/or image-guided tissue sampling (biopsy) of the suspicious finding. Histopathological correlation is needed to determine the exact nature of the abnormality.",
        recommendationTextColor: "#ad0000",
        recommendationBackgroundColor: "#e6b8af",
      },
      {
        id: "5a",
        impression: "Suspicious for Malignancy",
        impressionText:
          "The examination demonstrates findings of significant tissue abnormalities with suspicious features. Further evaluation is required to rule out malignancy.",
        impressionTextColor: "#d32323",
        impressionBackgroundColor: "transparent",
        recommendation: "Image-Guided Biopsy",
        recommendationText:
          "Clinical consultation with your health care provider is recommended for further evaluation, which may include additional imaging and/or image-guided tissue sampling (biopsy) of the suspicious finding. Histopathological correlation is needed to determine the exact nature of the abnormality.",
        recommendationTextColor: "#ad0000",
        recommendationBackgroundColor: "#e6b8af",
      },
    ],
  },
  {
    impressionColor: "#7aa5ec",
    recommendationColor: "#3f7fe0",
    data: [
      {
        id: "6",
        impression: "Known Malignancy",
        impressionText:
          "The examination shows tissue variations in the location of the previously biopsy-proven lesion as described in the detailed findings. Imaging findings are consistent with biopsy-proven malignancy.",
        impressionTextColor: "#a64d79",
        impressionBackgroundColor: "transparent",
        recommendation: "Clinical consultation + AI + Survillence",
        recommendationText:
          "Clinical consultation with your health care provider is recommended for consideration of advanced imaging (such as MRI) and close clinical surveillance.",
        recommendationTextColor: "#000000",
        recommendationBackgroundColor: "#cfe2f3",
      },
      {
        id: "6a",
        impression:
          "Known Malignancy Post-malignancy Surveillance (after complete treatment)",
        impressionText:
          "The examination demonstrates changes / tissue prominence are identified.in the setting of known malignancy with ongoing surveillance.",
        impressionTextColor: "#a64d79",
        impressionBackgroundColor: "transparent",
        recommendation: "Clinical consultation + MRI",
        recommendationText:
          "Given the history of malignancy, breast specialist consultation is recommended with clinical examination and possible additional imaging (ultrasound or MRI) to characterize the described areas.",
        recommendationTextColor: "#000000",
        recommendationBackgroundColor: "#cfe2f3",
      },
      {
        id: "6b",
        impression: "Known Malignancy cancer (before or ongoing treatment)",
        impressionText:
          "The examination demonstrates changes in the setting of known malignancy.",
        impressionTextColor: "#a64d79",
        impressionBackgroundColor: "transparent",
        recommendation: "Oncologist Consultation",
        recommendationText:
          "Oncology consultation is recommended for further management planning based on current findings.",
        recommendationTextColor: "#000000",
        recommendationBackgroundColor: "#d9d2e9",
      },
      {
        id: "6c",
        impression: "Known Malignancy biopsy proven cancer ( details unknown)",
        impressionText:
          "The examination demonstrates changes in the setting of known malignancy.",
        impressionTextColor: "#a64d79",
        impressionBackgroundColor: "transparent",
        recommendation: "Oncologist Consultation",
        recommendationText:
          "Oncology consultation is recommended for further management planning based on current findings.",
        recommendationTextColor: "#000000",
        recommendationBackgroundColor: "#d9d2e9",
      },
      {
        id: "6d",
        impression:
          "DCIS / LCIS with Possible Microinvasion +/- QT finding (OR)",
        impressionText:
          "Findings are consistent with known diagnosis of ductal carcinoma in situ (DCIS) and may represent microinvasive disease.",
        impressionTextColor: "#a64d79",
        impressionBackgroundColor: "transparent",
        recommendation: "Breast Specialist Evaluation(OR) ",
        recommendationText:
          "Clinical consultation with a breast specialist is recommended for management of DCIS. Note that QT imaging may not detect all non-invasive or microinvasive lesions.",
        recommendationTextColor: "#000000",
        recommendationBackgroundColor: "#f4cccc",
      },
      {
        id: "6e",
        impression:
          "Known Malignancy Equivocal / indetrminate - qt may not detect microinvasiver disease",
        impressionText:
          "Findings are equivocal and may represent either post-operative fibrosis or recurrent disease.",
        impressionTextColor: "#a64d79",
        impressionBackgroundColor: "transparent",
        recommendation: "AI or Biopsy",
        recommendationText:
          "Histopathological confirmation or advanced imaging like targeted ultrasound or MRI is recommended for definitive characterization.",
        recommendationTextColor: "#000000",
        recommendationBackgroundColor: "#f4cccc",
      },
      {
        id: "6f",
        impression: "Known Malignancy First scan for cancer / dcis diagnosis",
        impressionText:
          "The examination demonstrates changes in the setting of known malignancy as described above.",
        impressionTextColor: "#a64d79",
        impressionBackgroundColor: "transparent",
        recommendation: "F +  Breast Specialist Evaluation",
        recommendationText:
          "This is the first QT scan with No prior QT images available for comparison . The most accurate assessment is achieved by comparing the current QT scan to a prior QT scan. If no prior QT scan is available, this study serves as a baseline for future follow-ups. Subsequent QT scans can be utilized to assess segmentation quantification and evaluate changes over time, including doubling time, for treatment response assessment. Breast specialist consultation is recommended for further management planning based on current findings.",
        recommendationTextColor: "#000000",
        recommendationBackgroundColor: "#cfe2f3",
      },
      {
        id: "6g",
        impression: "Known Malignancy - No sympt -ve QT",
        impressionText:
          "The architectural distortion observed is attributed to post-operative or post-procedural changes. The examination demonstrates findings which are likely benign breast changes.",
        impressionTextColor: "#a64d79",
        impressionBackgroundColor: "transparent",
        recommendation: "Breast Specialist Evaluation",
        recommendationText:
          "Breast specialist evaluation is recommended to determine appropriate follow-up, which may include short-term surveillance or further testing.",
        recommendationTextColor: "#000000",
        recommendationBackgroundColor: "#f4cccc",
      },
      {
        id: "6h",
        impression: "Known Malignancy with Lump",
        impressionText:
          "The examination demonstrates changes in the setting of known malignancy.",
        impressionTextColor: "#a64d79",
        impressionBackgroundColor: "transparent",
        recommendation: "Clinical consult weith HCP",
        recommendationText:
          "Oncologist consultation is recommended for further management planning based on current findings.",
        recommendationTextColor: "#000000",
        recommendationBackgroundColor: "#cfe2f3",
      },
    ],
  },
  {
    impressionColor: "#f3d05f",
    recommendationColor: "#e6b820",
    data: [
      {
        id: "7",
        impression: "Previous Benign. Now also Benign",
        impressionText:
          "The examination demonstrates findings which are likely benign breast changes. While tissue variations are present, there is no evidence of suspicious/dominant masses, or architectural distortion to suggest malignancy. Compared to the previous examination, no significant interval change is noted.",
        impressionTextColor: "#3d85c6",
        impressionBackgroundColor: "transparent",
        recommendation: "Routine Annual Screening",
        recommendationText:
          "Return for routine annual breast imaging screening in 12 months to monitor breast tissue stability and detect any interval changes.",
        recommendationTextColor: "#000000",
        recommendationBackgroundColor: "#d9ead3",
      },
      {
        id: "7a",
        impression: "Interval Progression",
        impressionText:
          "Compared to the previous examination, there is an interval increase in the size of the lesion. Clinical consultation is recommended for further management planning.",
        impressionTextColor: "#3d85c6",
        impressionBackgroundColor: "transparent",
        recommendation: "Clinical Consultation and Surveillance",
        recommendationText:
          "Clinical consultation with your health care provider or a breast specialist is recommended for further evaluation, which may include additional imaging and/or image-guided tissue sampling of the abnormal findings as described.",
        recommendationTextColor: "#000000",
        recommendationBackgroundColor: "#cfe2f3",
      },
      {
        id: "7b",
        impression: "Interval Regression",
        impressionText:
          "Compared to the previous examination, there is an interval decrease in size/volume, suggestive of lesion regression or shrinkage.",
        impressionTextColor: "#3d85c6",
        impressionBackgroundColor: "transparent",
        recommendation: "Clinical Correlation and Surveillance",
        recommendationText:
          "Given the regression of this lesion, it is not believed to be clinically significant. We recommend continued monitoring of this area with self exam and repeat imaging in 12 months to ensure stability under the clinical supervision of a breast specialist.",
        recommendationTextColor: "#000000",
        recommendationBackgroundColor: "#cfe2f3",
      },
      {
        id: "7c",
        impression: "Stable Disease",
        impressionText:
          "Compared to the previous examination, no significant interval change is noted in lesion size, which therefore appears stable.",
        impressionTextColor: "#3d85c6",
        impressionBackgroundColor: "transparent",
        recommendation: "Clinical Consultation and Surveillance",
        recommendationText:
          "Despite the stability in the noted findings, clinical follow-up with a health care provider or a breast specialist, continued annual surveillance, and management planning based on current findings.",
        recommendationTextColor: "#000000",
        recommendationBackgroundColor: "#cfe2f3",
      },
      {
        id: "7d",
        impression: "Technical Limitation for Comparison",
        impressionText:
          "Significant artifacts in the current transmission imaging limit accurate volume measurements and comparison with prior studies.",
        impressionTextColor: "#3d85c6",
        impressionBackgroundColor: "transparent",
        recommendation: "Clinical Consultation and Surveillance",
        recommendationText:
          "Clinical follow-up with a health care provider, continued surveillance, and management planning based on current findings.",
        recommendationTextColor: "#000000",
        recommendationBackgroundColor: "#cfe2f3",
      },
      {
        id: "7e",
        impression: "Mixed Response",
        impressionText:
          "Compared to the previous examination, there is interval increase in one of the lesions. Rest of them show interval decrease or resolution as described above. The examination shows tissue variations that are not definitively abnormal.",
        impressionTextColor: "#3d85c6",
        impressionBackgroundColor: "transparent",
        recommendation: "Clinical Consultation and Surveillance",
        recommendationText:
          "Clinical consultation with a breast specialist or surgeon or oncologist is recommended for ongoing follow-up, continued surveillance, and management planning based on current findings.",
        recommendationTextColor: "#000000",
        recommendationBackgroundColor: "#cfe2f3",
      },
    ],
  },
  {
    impressionColor: "#a0a0a0",
    recommendationColor: "#6e6e6e",
    data: [
      {
        id: "8",
        impression: "Inflammatory - No Symptoms",
        impressionText:
          "The examination demonstrates findings which are likely inflammatory in nature. While tissue variations are present, there is no evidence of suspicious/dominant masses, or architectural distortion to suggest malignancy.",
        impressionTextColor: "#e69138",
        impressionBackgroundColor: "transparent",
        recommendation: "Clinical Consultation",
        recommendationText:
          "Clinical correlation is advised. Additional imaging or follow-up may be considered based on overall clinical context.",
        recommendationTextColor: "#000000",
        recommendationBackgroundColor: "#cfe2f3",
      },
      {
        id: "8a",
        impression: "Inflammatory - Symptoms",
        impressionText:
          "The examination demonstrates findings which are likely inflammatory in nature, which are likely to be causing the symptoms. While tissue variations are present, there is no evidence of suspicious/dominant masses, or architectural distortion to suggest malignancy.",
        impressionTextColor: "#e69138",
        impressionBackgroundColor: "transparent",
        recommendation: "Clinical Consultation",
        recommendationText:
          "Clinical correlation is advised. Additional imaging or follow-up may be considered based on overall clinical context.",
        recommendationTextColor: "#000000",
        recommendationBackgroundColor: "#cfe2f3",
      },
      {
        id: "9",
        impression: " ",
        impressionText: "",
        impressionTextColor: "#000000",
        impressionBackgroundColor: "transparent",
        recommendation: "",
        recommendationText: "",
        recommendationTextColor: "#000000",
        recommendationBackgroundColor: "transparent",
      },
    ],
  },
  {
    impressionColor: "#a0a0a0",
    recommendationColor: "#6e6e6e",
    data: [
      {
        id: "10",
        impression: "Benign with Implant findings - contracture / dispalcment",
        impressionText:
          "Implant findings as described above. Otherwise, there is no evidence of suspicious/dominant masses, or architectural distortion to suggest malignancy.",
        impressionTextColor: "#000000",
        impressionBackgroundColor: "transparent",
        recommendation: "Routine Annual Screening",
        recommendationText:
          "Return for routine annual breast imaging screening in 12 months to monitor breast tissue stability and detect any interval changes.",
        recommendationTextColor: "#000000",
        recommendationBackgroundColor: "#d9ead3",
      },
      {
        id: "10a",
        impression: "Benign with Implant Rupture",
        impressionText:
          "Implant rupture  is identified as described in the detailed findings. Otherwise, there is no evidence of suspicious/dominant masses, or architectural distortion to suggest malignancy.",
        impressionTextColor: "#000000",
        impressionBackgroundColor: "transparent",
        recommendation: "Breast surgeon consult",
        recommendationText:
          "Implant rupture has been identified as described in the detailed findings. Consultation with breast surgeon is recommended for appropriate management.",
        recommendationTextColor: "#000000",
        recommendationBackgroundColor: "#f4cccc",
      },
    ],
  },
];

export const NAimpressionRecommendation = [
  {
    impressionColor: "#a0a0a0",
    recommendationColor: "#6e6e6e",
    data: [
      {
        id: "0",
        impression: "Prior breast imaging is needed for interpretation",
        impressionText: "Prior breast imaging is needed for interpretation",
        impressionTextColor: "#000000",
        impressionBackgroundColor: "transparent",
        recommendation: "Prior breast imaging is needed for interpretation.",
        recommendationText:
          "Prior breast imaging is needed for interpretation.",
        recommendationTextColor: "#000000",
        recommendationBackgroundColor: "#fff",
      },
    ],
  },
  {
    impressionColor: "#a0a0a0",
    recommendationColor: "#6e6e6e",
    data: [
      {
        id: "N1",
        impression: "Unremarkable",
        impressionText:
          "The exam is unremarkable. There is no evidence of suspicious calcifications, dominant masses or architectural distortions to suggest the presence of malignancy.",
        impressionTextColor: "#000000",
        impressionBackgroundColor: "transparent",
        recommendation: "Return in 1 year",
        recommendationText:
          "Return in 1 year for annual examination as clinically warranted.",
        recommendationTextColor: "#000000",
        recommendationBackgroundColor: "#d9ead3",
      },
      {
        id: "N2",
        impression: "Unremarkable with benign finding",
        impressionText:
          "The exam is unremarkable with benign finding(s). There is no evidence of suspicious calcifications, dominant masses or architectural distortions to suggest the presence of malignancy.",
        impressionTextColor: "#000000",
        impressionBackgroundColor: "transparent",
        recommendation: "Return in 1 year",
        recommendationText:
          "Return in 1 year for annual examination as clinically warranted.",
        recommendationTextColor: "#000000",
        recommendationBackgroundColor: "#d9ead3",
      },
    ],
  },
  {
    impressionColor: "#a0a0a0",
    recommendationColor: "#6e6e6e",
    data: [
      {
        id: "A1",
        impression: "Indeterminate",
        impressionText:
          "The exam shows likely benign finding(s) as described. However, short-term interval follow-up is recommended.",
        impressionTextColor: "#000000",
        impressionBackgroundColor: "transparent",
        recommendation: "Return in _____weeks",
        recommendationText: "Return in ____ weeks for follow-up.",
        recommendationTextColor: "#000000",
        recommendationBackgroundColor: "#fff2cc",
      },
      {
        id: "A2",
        impression: "Possible malignancy",
        impressionText:
          "The exam shows finding(s) with characteristics suggesting possible malignancy.",
        impressionTextColor: "#000000",
        impressionBackgroundColor: "transparent",
        recommendation: "Consult with physician",
        recommendationText:
          "Consult with physician or healthcare provider regarding any additional testing that includes biopsy and/or additional imaging.",
        recommendationTextColor: "#000000",
        recommendationBackgroundColor: "#f4cccc",
      },
      {
        id: "A3",
        impression: "Most likely malignant",
        impressionText:
          "The exam shows finding(s) with characteristics that are most likely malignant.",
        impressionTextColor: "#000000",
        impressionBackgroundColor: "transparent",
        recommendation: "Consult with physician",
        recommendationText:
          "Consult with physician or healthcare provider regarding any additional testing that includes biopsy and/or additional imaging.",
        recommendationTextColor: "#000000",
        recommendationBackgroundColor: "#f4cccc",
      },
      {
        id: "A4",
        impression: "Known malignancy",
        impressionText: "The exam shows the previously known malignancy/ies.",
        impressionTextColor: "#000000",
        impressionBackgroundColor: "transparent",
        recommendation: "Management of the known malignancy",
        recommendationText:
          "Management of the known malignancy and any new finding(s) should be based on the clinical assessment.",
        recommendationTextColor: "#000000",
        recommendationBackgroundColor: "#f4cccc",
      },
      {
        id: "-",
        impression: "",
        impressionText: "",
        impressionTextColor: "#000000",
        impressionBackgroundColor: "transparent",
        recommendation: "",
        recommendationText: "",
        recommendationTextColor: "#000000",
        recommendationBackgroundColor: "#cfe2f3",
      },
    ],
  },
];

export const additionalOptions = [
  {
    id: "A",
    text: "The architectural distortion observed is attributed to post-operative or post-procedural changes.",
  },
  {
    id: "B",
    text: "Breast specialist evaluation with a clinical exam is recommended to determine appropriate follow-up, which may include short-term surveillance or further testing. Should the mass be determined to be benign, yearly follow up is recommended.",
  },
  {
    id: "C",
    text: "Clinical consultation and evaluation for a image-guided biopsy is recommended for histopathological evaluation and definitive diagnosis to ensure appropriate management.",
  },
  {
    id: "D",
    text: "We are happy to review the QT scan again if additional evaluation (imaging or biopsy) is performed after the QT scan, as recommended by us, and the results can be included in our report as a correlative addendum.",
  },
  {
    id: "E",
    text: "While tissue variations are present, The examination demonstrates no evidence of suspicious/dominant masses, or architectural distortion to suggest malignancy.",
  },
  {
    id: "F",
    text: "This is the first QT scan with No prior QT images available for comparison . The most accurate assessment is achieved by comparing the current QT scan to a prior QT scan. If no prior QT scan is available, this study serves as a baseline for future follow-ups. Subsequent QT scans can be utilized to assess segmentation quantification and evaluate changes over time, including doubling time, for treatment response assessment.",
  },
  {
    id: "G",
    text: "If the long standing palpable area has not been previously evaluated completely or if clinical concern persists, correlation with targeted ultrasound may be warranted.",
  },
  {
    id: "H",
    text: "Clinical consultation with your health care provider is recommended to determine the appropriate follow-up, which may include short-term imaging surveillance or targeted ultrasound for further characterization.",
  },
  {
    id: "I",
    text: "The examination demonstrates a QT imaging finding that correlates with the site of the reported concern. Though the examination shows tissue variations with low risk features but require further follow up to ensure they are benign and inflammatory innature.",
  },
  {
    id: "L",
    text: "The examination shows tissue variations with low-risk features that are not definitively abnormal but require further follow up to ensure they are benign.",
  },
  {
    id: "M",
    text: "Note that QT imaging may not detect all non-invasive or microinvasive lesions.",
  },
  {
    id: "N",
    text: "Breast specialist evaluation is recommended for further assessment as negative imaging should never preclude evaluation clinically.",
  },
  {
    id: "O",
    text: "Oncologist consultation is recommended for further management planning based on current findings.",
  },
  {
    id: "P",
    text: "There are no QT findings to explain her right breast pain. The patient should monitor the breast area of pain. If a lump or other palpable finding appears in this area, a targeted ultrasound of the area should be performed.",
  },
  {
    id: "Q",
    text: "Scars, dense breast tissue, and breast implants can obscure masses and other findings.",
  },
  {
    id: "R",
    text: "Images were reviewed again. In view with the given history/data, it is prudent to further evaluate the lesion with a targeted ultrasound of the area.",
  },
  {
    id: "S",
    text: "Clinical monitoring of the symptomatic area is recommended. If a palpable mass or new concern develops, targeted ultrasound evaluation should be performed.",
  },
  {
    id: "T",
    text: "Additional imaging such as targeted ultrasound is recommended to confirm the benign nature of these findings.",
  },
  {
    id: "U",
    text: "The findings are of an unclear etiology and need further evaluation and clinical correlation.",
  },
  {
    id: "V",
    text: "Further evaluation is recommended for a definitive diagnosis to ensure appropriate management.",
  },
  {
    id: "W",
    text: "Follow-up examination in 3 months specifically recommended for assessment of growth characteristics.",
  },
  {
    id: "X",
    text: "This is blind read. No pathology, no prior medical images, no clinical useful treatment history and no specific clinical symptoms were disclosed. Without this information, the QT imaging study may be of limited value to the patient.",
  },
  {
    id: "Y",
    text: "The examination shows changes in breast tissue that may represent cysts (fluid-filled spaces). While cysts are typically benign, further evaluation is needed to confirm this diagnosis.",
  },
  {
    id: "Z",
    text: "Image given location is for correlative location only.",
  },
];

export const NAadditionalOptions = [
  {
    id: "1",
    text: "Consult with physician or healthcare provider for management of any other clinical findings.",
  },
  {
    id: "2",
    text: "Results were discussed with ____ on [date and time of the discussion]",
  },
  {
    id: "3",
    text: "The written report was provided to [___] on [___].",
  },
];

const ImpressionRecommendation: React.FC<ImpressionProps> = ({
  requestVersionRef,
  additionalChangesChangeStatus,
  setChangedOne,
  mainImpressionRecommendation,
  setMainImpressionRecommendation,
  optionalImpressionRecommendation,
  setOptionalImpressionRecommendation,
  assignData,
  commonImpressRecomm,
  setCommonImpressRecomm,
  readOnly,
  reportFormData,
  handleReportInputChange,
}) => {
  const [additionalImpressionRight, setAdditionalImpressionRight] = useState<
    Additional[]
  >([]);
  const [additionalRecommendationRight, setAdditionalRecommendationRight] =
    useState<Additional[]>([]);
  const [additionalImpression, setAdditionalImpression] = useState<
    Additional[]
  >([]);
  const [additionalRecommendation, setAdditionalRecommendation] = useState<
    Additional[]
  >([]);

  const getAnswer = (id: number) =>
    reportFormData.find((q) => q.questionId === id)?.answer || "";

  const impressionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const impressionRefsRight = useRef<Record<string, HTMLDivElement | null>>({});
  const recommendationRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const recommendationRefsRight = useRef<Record<string, HTMLDivElement | null>>(
    {}
  );

  useEffect(() => {
    setOptionalImpressionRecommendation((prev) => ({
      ...prev,
      selectedImpressionIdRight: JSON.stringify(additionalImpressionRight),
      impressionTextRight: additionalImpressionRight
        .map((item) => item.text)
        .join("<br/>"),
    }));
  }, [additionalImpressionRight]);

  useEffect(() => {
    setOptionalImpressionRecommendation((prev) => ({
      ...prev,
      selectedRecommendationIdRight: JSON.stringify(
        additionalRecommendationRight
      ),
      recommendationTextRight: additionalRecommendationRight
        .map((item) => item.text)
        .join("<br/>"),
    }));
  }, [additionalRecommendationRight]);

  useEffect(() => {
    setOptionalImpressionRecommendation((prev) => ({
      ...prev,
      selectedImpressionId: JSON.stringify(additionalImpression),
      impressionText: additionalImpression
        .map((item) => item.text)
        .join("<br/>"),
    }));
  }, [additionalImpression]);

  useEffect(() => {
    setOptionalImpressionRecommendation((prev) => ({
      ...prev,
      selectedRecommendationId: JSON.stringify(additionalRecommendation),
      recommendationText: additionalRecommendation
        .map((item) => item.text)
        .join("<br/>"),
    }));
  }, [additionalRecommendation]);

  useEffect(() => {
    setAdditionalImpressionRight(
      optionalImpressionRecommendation.selectedImpressionIdRight.length > 0
        ? JSON.parse(optionalImpressionRecommendation.selectedImpressionIdRight)
        : []
    );

    setAdditionalRecommendationRight(
      optionalImpressionRecommendation.selectedRecommendationIdRight.length > 0
        ? JSON.parse(
            optionalImpressionRecommendation.selectedRecommendationIdRight
          )
        : []
    );

    setAdditionalImpression(
      optionalImpressionRecommendation.selectedImpressionId.length > 0
        ? JSON.parse(optionalImpressionRecommendation.selectedImpressionId)
        : []
    );

    setAdditionalRecommendation(
      optionalImpressionRecommendation.selectedRecommendationId.length > 0
        ? JSON.parse(optionalImpressionRecommendation.selectedRecommendationId)
        : []
    );
  }, [additionalChangesChangeStatus]);

  // useEffect(() => {
  //   setAdditionalImpressionRight(
  //     optionalImpressionRecommendation.selectedImpressionIdRight.length > 0
  //       ? JSON.parse(optionalImpressionRecommendation.selectedImpressionIdRight)
  //       : []
  //   );

  //   setAdditionalRecommendationRight(
  //     optionalImpressionRecommendation.selectedRecommendationIdRight.length > 0
  //       ? JSON.parse(
  //           optionalImpressionRecommendation.selectedRecommendationIdRight
  //         )
  //       : []
  //   );

  //   setAdditionalImpression(
  //     optionalImpressionRecommendation.selectedImpressionId.length > 0
  //       ? JSON.parse(optionalImpressionRecommendation.selectedImpressionId)
  //       : []
  //   );

  //   setAdditionalRecommendation(
  //     optionalImpressionRecommendation.selectedRecommendationId.length > 0
  //       ? JSON.parse(optionalImpressionRecommendation.selectedRecommendationId)
  //       : []
  //   );
  // }, []);

  let ImpressionOption = impressionRecommendation;

  if (assignData?.naSystemReportAccess && getAnswer(81) === "true") {
    ImpressionOption = NAimpressionRecommendation;
  }

  let MacroOption = additionalOptions;

  if (assignData?.naSystemReportAccess && getAnswer(81) === "true") {
    MacroOption = NAadditionalOptions;
  }

  const selectedMacro =
    MacroOption.find((opt) => opt.id === commonImpressRecomm.id)?.text || "";

  const selectedMacroRight =
    MacroOption.find((opt) => opt.id === commonImpressRecomm.idRight)?.text || "";

  const selectedImpression = ImpressionOption.flatMap(
    (group) => group.data
  ).find(
    (impression) =>
      impression.id === mainImpressionRecommendation.selectedImpressionId
  );

  const selectedImpressionRight = ImpressionOption.flatMap(
    (group) => group.data
  ).find(
    (impression) =>
      impression.id === mainImpressionRecommendation.selectedImpressionIdRight
  );

  useEffect(() => {
    const scrollToCenter = (el: HTMLDivElement | null) => {
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    };

    scrollToCenter(
      impressionRefs.current[mainImpressionRecommendation.selectedImpressionId]
    );
    scrollToCenter(
      recommendationRefs.current[
        mainImpressionRecommendation.selectedRecommendationId
      ]
    );
  }, [
    mainImpressionRecommendation.selectedImpressionId,
    mainImpressionRecommendation.selectedRecommendationId,
  ]);

  useEffect(() => {
    const scrollToCenter = (el: HTMLDivElement | null) => {
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    };

    scrollToCenter(
      impressionRefsRight.current[
        mainImpressionRecommendation.selectedImpressionIdRight
      ]
    );
    scrollToCenter(
      recommendationRefsRight.current[
        mainImpressionRecommendation.selectedRecommendationIdRight
      ]
    );
  }, [
    mainImpressionRecommendation.selectedImpressionIdRight,
    mainImpressionRecommendation.selectedRecommendationIdRight,
  ]);

  return (
    <div className="flex justify-center items-start gap-10 py-6 px-12 w-full h-[90vh] space-y-10 overflow-y-scroll">
      <div
        className={`flex flex-col w-full items-start justify-between gap-4 ${
          readOnly ? "pointer-events-none" : ""
        }`}
      >
        {(assignData?.naSystemReportAccess && assignData.easeQTReportAccess) && (
          <div
            className={`flex flex-col w-full items-start justify-between gap-4 ${
              readOnly ? "pointer-events-none" : ""
            }`}
          >
            <div className="self-end mt-2">
              <div className="flex items-center justify-between gap-4 px-3 py-2 bg-muted shadow rounded-md">
                <div>
                  <Label className="font-semibold text-base">Wellthgreen Report Portal 10.10 / NA system</Label>
                </div>
                <Switch
                  id="qtAccess"
                  className="cursor-pointer"
                  checked={
                    getAnswer(81).length > 0 && getAnswer(81) === "true"
                      ? true
                      : false
                  }
                  onCheckedChange={(checked: boolean) => {
                    if (!readOnly) {
                      handleReportInputChange(81, checked ? "true" : "false");
                    }
                  }}
                />
              </div>
            </div>
          </div>
        )}
        <div className={`flex gap-4 items-center mb-4 -ml-2`}>
          <div>
            <Checkbox2
              checked={getAnswer(132) === "Present"}
              onCheckedChange={(checked) => {
                handleReportInputChange(132, checked ? "Present" : "Absent");
                setChangedOne((prev) => ({
                  ...prev,
                  recommendationRight: true,
                  impressionRight: true,
                  impressionaddtionalRight: true,
                  recommendationaddtionalRight: true,
                  commonImpressionRecommendationRight: true,
                }));

                setMainImpressionRecommendation((prev) => ({
                  ...prev,
                  selectedImpressionIdRight: "",
                  selectedRecommendationIdRight: "",
                  impressionTextRight: "",
                  recommendationTextRight: "",
                }));

                setAdditionalImpressionRight([]);
                setAdditionalRecommendationRight([]);
                setCommonImpressRecomm((prev) => ({
                  ...prev,
                  idRight: "",
                  textRight: "",
                }));
              }}
              className="w-5 h-5 mt-1"
            />
          </div>
          <Label
            className="font-semibold text-2xl flex flex-wrap lg:items-center"
            style={{ wordSpacing: "0.2em" }}
          >
            Right Breast
          </Label>
        </div>

        {getAnswer(132) === "Present" && (
          <>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-[50%] max-w-[50%]">
                <div className="bg-[#a3b1a1] mx-4 p-2 rounded-t-lg text-xl text-center font-bold">
                  Impression
                </div>

                <div
                  className={`${
                    assignData?.naSystemReportAccess && getAnswer(81) === "true"
                      ? "h-[auto]"
                      : "h-[65vh]"
                  } overflow-y-auto bg-radial-greeting-02 rounded-lg pointer-events-auto`}
                >
                  {(() => {
                    let options = impressionRecommendation;
                    if (
                      assignData?.naSystemReportAccess &&
                      getAnswer(81) === "true"
                    ) {
                      options = NAimpressionRecommendation;
                    }

                    return options.map((contentCategory, index) =>
                      contentCategory.data.map((content, idx) => {
                        const isFirst = index === 0 && idx === 0;
                        const isLast =
                          index === options.length - 1 &&
                          idx === contentCategory.data.length - 1;
                        const isSelected =
                          mainImpressionRecommendation.selectedImpressionIdRight ===
                          content.id;

                        return (
                          <div
                            key={`impressionright-${content.id}-${idx}`}
                            ref={(el) => {
                              impressionRefsRight.current[content.id] = el;
                            }}
                            onClick={() => {
                              setChangedOne((prev) => ({
                                ...prev,
                                impressionRight: true,
                                recommendationRight: true,
                              }));
                              setMainImpressionRecommendation((prev) => ({
                                ...prev,
                                selectedImpressionIdRight: content.id,
                                selectedRecommendationIdRight: content.id,
                                impressionTextRight: content.impressionText,
                                recommendationTextRight:
                                  content.recommendationText,
                              }));
                              ++requestVersionRef.current;
                            }}
                            className={`flex cursor-pointer ${
                              isFirst ? "rounded-tl-lg" : ""
                            } ${isLast ? "rounded-bl-lg" : ""} ${
                              isSelected
                                ? "border-2 border-[#0000006d]"
                                : "border-b border-b-[#00000030]"
                            } ${readOnly ? "pointer-events-none" : ""}`}
                            style={{
                              backgroundColor:
                                content.impressionBackgroundColor,
                              color: content.impressionTextColor,
                            }}
                          >
                            <p className="min-w-[6rem] text-xs font-semibold text-center px-2 py-1 flex items-center justify-center">
                              {content.id}
                            </p>
                            <p className="text-sm pl-2 flex items-center font-semibold">
                              {content.impression}
                            </p>
                          </div>
                        );
                      })
                    );
                  })()}
                </div>

                <div className="mt-4 flex flex-col gap-2 border p-2 rounded-md">
                  <Select
                    value={
                      mainImpressionRecommendation.selectedImpressionIdRight
                    }
                    onValueChange={(val) => {
                      setChangedOne((prev) => ({
                        ...prev,
                        impressionRight: true,
                        recommendationRight: true,
                      }));
                      let options = impressionRecommendation;
                      if (
                        assignData?.naSystemReportAccess &&
                        getAnswer(81) === "true"
                      ) {
                        options = NAimpressionRecommendation;
                      }
                      const matched = options
                        .flatMap((cat) => cat.data)
                        .find((item) => item.id === val);

                      setMainImpressionRecommendation((prev) => ({
                        ...prev,
                        selectedImpressionIdRight: val,
                        selectedRecommendationIdRight: val,
                        impressionTextRight: matched?.impressionText || "",
                        recommendationTextRight:
                          matched?.recommendationText || "",
                      }));

                      ++requestVersionRef.current;
                    }}
                  >
                    <SelectTrigger className="bg-[#a3b1a0] m-0 text-xs w-full relative">
                      <SelectValue placeholder="Select Impression" />
                    </SelectTrigger>

                    <SelectContent>
                      {assignData?.naSystemReportAccess &&
                      getAnswer(81) === "true" ? (
                        <>
                          {NAimpressionRecommendation.map((contentCategory) =>
                            contentCategory.data.map((content, idx) => (
                              <SelectItem
                                key={`impressionright-${content.id}-${idx}`}
                                value={content.id}
                              >
                                {content.id + " - " + content.impression}
                              </SelectItem>
                            ))
                          )}
                        </>
                      ) : (
                        <>
                          {impressionRecommendation.map((contentCategory) =>
                            contentCategory.data.map((content, idx) => (
                              <SelectItem
                                key={`impressionright-${content.id}-${idx}`}
                                value={content.id}
                              >
                                {content.id + " - " + content.impression}
                              </SelectItem>
                            ))
                          )}
                        </>
                      )}
                    </SelectContent>
                  </Select>

                  <div className="w-full">
                    {selectedImpressionRight?.impressionText}
                  </div>
                </div>

                <div
                  className="flex justify-end mt-2 w-full"
                  // hidden={showOptional.impression}
                >
                  <Button
                    variant="greenTheme"
                    onClick={() => {
                      setChangedOne((prev) => ({
                        ...prev,
                        impressionaddtionalRight: true,
                      }));
                      // setShowOptional((prev) => ({ ...prev, impression: true }))
                      setAdditionalImpressionRight((prev) => [
                        ...prev,
                        { id: "", text: "" },
                      ]);
                    }}
                  >
                    <Plus />
                    <span>Add</span>
                  </Button>
                </div>

                {/* {showOptional.impression && ( */}
                {additionalImpressionRight.length > 0 &&
                  additionalImpressionRight.map((data, index) => (
                    <div className="mt-4 flex flex-col gap-2 border p-2 rounded-md">
                      <div className="flex justify-between items-center">
                        <h1>Add-On</h1>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            setChangedOne((prev) => ({
                              ...prev,
                              impressionaddtionalRight: true,
                            }));
                            setAdditionalImpressionRight((prev) =>
                              prev.filter((_, i) => i !== index)
                            );
                            ++requestVersionRef.current;
                          }}
                        >
                          <Trash />
                        </Button>
                      </div>
                      <Select
                        value={data.id}
                        onValueChange={(val) => {
                          setChangedOne((prev) => ({
                            ...prev,
                            impressionaddtionalRight: true,
                          }));

                          let options = impressionRecommendation;

                          if (
                            assignData?.naSystemReportAccess &&
                            getAnswer(81) === "true"
                          ) {
                            options = NAimpressionRecommendation;
                          }

                          const matched = options
                            .flatMap((cat) => cat.data)
                            .find((item) => item.id.toString() === val);

                          setAdditionalImpressionRight((prev) =>
                            prev.map((item, i) =>
                              i === index
                                ? {
                                    ...item,
                                    id: val,
                                    text: matched?.impressionText || "",
                                  }
                                : item
                            )
                          );
                          ++requestVersionRef.current;
                        }}
                      >
                        <SelectTrigger className="bg-[#a3b1a0] m-0 text-xs w-full">
                          <SelectValue placeholder="Select Impression" />
                        </SelectTrigger>

                        <SelectContent>
                          {assignData?.naSystemReportAccess &&
                          getAnswer(81) === "true" ? (
                            <>
                              {NAimpressionRecommendation.map(
                                (contentCategory) =>
                                  contentCategory.data.map((content, idx) => (
                                    <SelectItem
                                      key={`impression-${content.id}-${idx}`}
                                      value={content.id}
                                    >
                                      {content.id + " - " + content.impression}
                                    </SelectItem>
                                  ))
                              )}
                            </>
                          ) : (
                            <>
                              {impressionRecommendation.map((contentCategory) =>
                                contentCategory.data.map((content, idx) => (
                                  <SelectItem
                                    key={`impression-${content.id}-${idx}`}
                                    value={content.id}
                                  >
                                    {content.id + " - " + content.impression}
                                  </SelectItem>
                                ))
                              )}
                            </>
                          )}
                        </SelectContent>
                      </Select>

                      <div className="w-full">{data.text}</div>
                    </div>
                  ))}
                {/* )} */}
              </div>

              <div className="min-w-[50%] max-w-[50%]">
                <div className="bg-[#a3b1a1] mx-4 p-2 rounded-t-lg text-xl text-center font-bold">
                  Recommendation
                </div>

                <div
                  className={`${
                    assignData?.naSystemReportAccess && getAnswer(81) === "true"
                      ? "h-[auto]"
                      : "h-[65vh]"
                  } overflow-y-auto bg-radial-greeting-02 rounded-lg pointer-events-auto`}
                >
                  {(() => {
                    let options = impressionRecommendation;
                    if (
                      assignData?.naSystemReportAccess &&
                      getAnswer(81) === "true"
                    ) {
                      options = NAimpressionRecommendation;
                    }

                    return options.map((category, index) =>
                      category.data.map((content, idx) => {
                        const isFirst = index === 0 && idx === 0;
                        const isLast =
                          index === impressionRecommendation.length - 1 &&
                          idx === category.data.length - 1;

                        return (
                          <div
                            key={`rec-${content.id}`}
                            ref={(el) => {
                              recommendationRefsRight.current[content.id] = el;
                            }}
                            className={`flex ${
                              isFirst ? "rounded-tl-lg" : ""
                            } ${isLast ? "rounded-bl-lg" : ""} ${
                              mainImpressionRecommendation.selectedRecommendationIdRight ===
                              content.id
                                ? "border-2 border-[#0000006d]"
                                : "border-b border-b-[#00000030]"
                            } ${readOnly ? "pointer-events-none" : ""}`}
                            style={{
                              backgroundColor:
                                content.recommendationBackgroundColor,
                              color: content.recommendationTextColor,
                            }}
                          >
                            <p className="min-w-[6rem] text-xs font-semibold text-center px-2 py-1 flex items-center justify-center">
                              {content.id}
                            </p>
                            <p className="text-sm pl-2 flex items-center font-semibold">
                              {content.recommendation}
                            </p>
                          </div>
                        );
                      })
                    );
                  })()}
                </div>

                <div className="mt-4 flex flex-col gap-2 border p-2 rounded-md">
                  <Select
                    value={
                      mainImpressionRecommendation.selectedRecommendationIdRight
                    }
                    onValueChange={(val) => {
                      setChangedOne((prev) => ({
                        ...prev,
                        recommendationRight: true,
                      }));
                      let options = impressionRecommendation;
                      if (
                        assignData?.naSystemReportAccess &&
                        getAnswer(81) === "true"
                      ) {
                        options = NAimpressionRecommendation;
                      }
                      const matched = options
                        .flatMap((cat) => cat.data)
                        .find((item) => item.id === val);

                      setMainImpressionRecommendation((prev) => ({
                        ...prev,
                        selectedRecommendationIdRight: val,
                        recommendationTextRight:
                          matched?.recommendationText || "",
                      }));
                      ++requestVersionRef.current;
                    }}
                  >
                    <SelectTrigger className="bg-[#a3b1a0] m-0 text-xs w-full">
                      <SelectValue placeholder="Select Recommendation" />
                    </SelectTrigger>

                    <SelectContent>
                      {assignData?.naSystemReportAccess &&
                      getAnswer(81) === "true" ? (
                        <>
                          {NAimpressionRecommendation.map((contentCategory) =>
                            contentCategory.data.map((content, idx) => (
                              <SelectItem
                                key={`impressionright-${content.id}-${idx}`}
                                value={content.id}
                              >
                                {content.id + " - " + content.recommendation}
                              </SelectItem>
                            ))
                          )}
                        </>
                      ) : (
                        <>
                          {impressionRecommendation.map((contentCategory) =>
                            contentCategory.data.map((content, idx) => (
                              <SelectItem
                                key={`impressionright-${content.id}-${idx}`}
                                value={content.id}
                              >
                                {content.id + " - " + content.recommendation}
                              </SelectItem>
                            ))
                          )}
                        </>
                      )}
                    </SelectContent>
                  </Select>

                  <div className="w-full">
                    {selectedImpressionRight?.recommendationText}
                  </div>
                </div>

                <div
                  className="flex justify-end mt-2 w-full"
                  // hidden={showOptional.impression}
                >
                  <Button
                    variant="greenTheme"
                    onClick={() => {
                      setChangedOne((prev) => ({
                        ...prev,
                        recommendationaddtionalRight: true,
                      }));
                      // setShowOptional((prev) => ({ ...prev, impression: true }))
                      setAdditionalRecommendationRight((prev) => [
                        ...prev,
                        { id: "", text: "" },
                      ]);
                      ++requestVersionRef.current;
                    }}
                  >
                    <Plus />
                    <span>Add</span>
                  </Button>
                </div>

                {/* {showOptional.impression && ( */}
                {additionalRecommendationRight.length > 0 &&
                  additionalRecommendationRight.map((data, index) => (
                    <div className="mt-4 flex flex-col gap-2 border p-2 rounded-md">
                      <div className="flex justify-between items-center">
                        <h1>Add-On</h1>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            setChangedOne((prev) => ({
                              ...prev,
                              recommendationaddtionalRight: true,
                            }));
                            setAdditionalRecommendationRight((prev) =>
                              prev.filter((_, i) => i !== index)
                            );
                            ++requestVersionRef.current;
                          }}
                        >
                          <Trash />
                        </Button>
                      </div>
                      <Select
                        value={data.id}
                        onValueChange={(val) => {
                          setChangedOne((prev) => ({
                            ...prev,
                            recommendationaddtionalRight: true,
                          }));
                          let options = impressionRecommendation;

                          if (
                            assignData?.naSystemReportAccess &&
                            getAnswer(81) === "true"
                          ) {
                            options = NAimpressionRecommendation;
                          }
                          const matched = options
                            .flatMap((cat) => cat.data)
                            .find((item) => item.id.toString() === val);

                          setAdditionalRecommendationRight((prev) =>
                            prev.map((item, i) =>
                              i === index
                                ? {
                                    ...item,
                                    id: val,
                                    text: matched?.impressionText || "",
                                  }
                                : item
                            )
                          );
                          ++requestVersionRef.current;
                        }}
                      >
                        <SelectTrigger className="bg-[#a3b1a0] m-0 text-xs w-full">
                          <SelectValue placeholder="Select Impression" />
                        </SelectTrigger>

                        <SelectContent>
                          {assignData?.naSystemReportAccess &&
                          getAnswer(81) === "true" ? (
                            <>
                              {NAimpressionRecommendation.map(
                                (contentCategory) =>
                                  contentCategory.data.map((content, idx) => (
                                    <SelectItem
                                      key={`impression-${content.id}-${idx}`}
                                      value={content.id}
                                    >
                                      {content.id + " - " + content.impression}
                                    </SelectItem>
                                  ))
                              )}
                            </>
                          ) : (
                            <>
                              {impressionRecommendation.map((contentCategory) =>
                                contentCategory.data.map((content, idx) => (
                                  <SelectItem
                                    key={`impression-${content.id}-${idx}`}
                                    value={content.id}
                                  >
                                    {content.id + " - " + content.impression}
                                  </SelectItem>
                                ))
                              )}
                            </>
                          )}
                        </SelectContent>
                      </Select>

                      <div className="w-full">{data.text}</div>
                    </div>
                  ))}
                {/* )} */}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Macro Sentence</Label>
              <Select
                value={commonImpressRecomm.idRight}
                onValueChange={(value) => {
                  setChangedOne((prev) => ({
                    ...prev,
                    commonImpressionRecommendationRight: true,
                  }));
                  let options = additionalOptions;
                  if (
                    assignData?.naSystemReportAccess &&
                    getAnswer(81) === "true"
                  ) {
                    options = NAadditionalOptions;
                  }
                  const selected = options.find((opt) => opt.id === value);
                  if (selected) {
                    setCommonImpressRecomm({
                      ...commonImpressRecomm,
                      idRight: selected.id,
                      textRight: selected.text,
                    });
                  }
                  ++requestVersionRef.current;
                }}
              >
                <SelectTrigger className="bg-[#a3b1a0] m-0 text-xs w-1/2">
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  {assignData?.naSystemReportAccess &&
                  getAnswer(81) === "true" ? (
                    <>
                      {NAadditionalOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.id} -{" "}
                          {option.text.split(" ").slice(0, 10).join(" ")}
                          ...
                        </SelectItem>
                      ))}
                    </>
                  ) : (
                    <>
                      {additionalOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.id} -{" "}
                          {option.text.split(" ").slice(0, 10).join(" ")}
                          ...
                        </SelectItem>
                      ))}
                    </>
                  )}
                </SelectContent>
              </Select>

              {selectedMacroRight && (
                <div className="text-sm mt-2 p-2 rounded border whitespace-pre-wrap">
                  {selectedMacroRight}
                </div>
              )}
            </div>

            <Separator className="my-10" />
          </>
        )}

        <div className={`flex gap-4 items-center mb-4 -ml-2`}>
          <div>
            <Checkbox2
              checked={getAnswer(133) === "Present"}
              onCheckedChange={(checked) => {
                handleReportInputChange(133, checked ? "Present" : "Absent");

                setChangedOne((prev) => ({
                  ...prev,
                  recommendation: true,
                  impression: true,
                  impressionaddtional: true,
                  recommendationaddtional: true,
                  commonImpressionRecommendation: true,
                }));

                setMainImpressionRecommendation((prev) => ({
                  ...prev,
                  selectedImpressionId: "",
                  selectedRecommendationId: "",
                  impressionText: "",
                  recommendationText: "",
                }));

                setAdditionalImpression([]);
                setAdditionalRecommendation([]);
                setCommonImpressRecomm((prev) => ({
                  ...prev,
                  id: "",
                  text: "",
                }));
              }}
              className="w-5 h-5 mt-1"
            />
          </div>
          <Label
            className="font-semibold text-2xl flex flex-wrap lg:items-center"
            style={{ wordSpacing: "0.2em" }}
          >
            Left Breast
          </Label>
        </div>

        {getAnswer(133) === "Present" && (
          <>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-[50%] max-w-[50%]">
                <div className="bg-[#a3b1a1] mx-4 p-2 rounded-t-lg text-xl text-center font-bold">
                  Impression
                </div>

                <div
                  className={`${
                    assignData?.naSystemReportAccess && getAnswer(81) === "true"
                      ? "h-[auto]"
                      : "h-[65vh]"
                  } overflow-y-auto bg-radial-greeting-02 rounded-lg pointer-events-auto`}
                >
                  {(() => {
                    let options = impressionRecommendation;
                    if (
                      assignData?.naSystemReportAccess &&
                      getAnswer(81) === "true"
                    ) {
                      options = NAimpressionRecommendation;
                    }
                    return options.map((contentCategory, index) =>
                      contentCategory.data.map((content, idx) => {
                        const isFirst = index === 0 && idx === 0;
                        const isLast =
                          index === impressionRecommendation.length - 1 &&
                          idx === contentCategory.data.length - 1;
                        const isSelected =
                          mainImpressionRecommendation.selectedImpressionId ===
                          content.id;

                        return (
                          <div
                            key={`impression-${content.id}-${idx}`}
                            ref={(el) => {
                              impressionRefs.current[content.id] = el;
                            }}
                            onClick={() => {
                              setChangedOne((prev) => ({
                                ...prev,
                                impression: true,
                                recommendation: true,
                              }));
                              setMainImpressionRecommendation((prev) => ({
                                ...prev,
                                selectedImpressionId: content.id,
                                selectedRecommendationId: content.id,
                                impressionText: content.impressionText,
                                recommendationText: content.recommendationText,
                              }));
                              ++requestVersionRef.current;
                            }}
                            className={`flex cursor-pointer ${
                              isFirst ? "rounded-tl-lg" : ""
                            } ${isLast ? "rounded-bl-lg" : ""} ${
                              isSelected
                                ? "border-2 border-[#0000006d]"
                                : "border-b border-b-[#00000030]"
                            } ${readOnly ? "pointer-events-none" : ""}`}
                            style={{
                              backgroundColor:
                                content.impressionBackgroundColor,
                              color: content.impressionTextColor,
                            }}
                          >
                            <p className="min-w-[6rem] text-xs font-semibold text-center px-2 py-1 flex items-center justify-center">
                              {content.id}
                            </p>
                            <p className="text-sm pl-2 flex items-center font-semibold">
                              {content.impression}
                            </p>
                          </div>
                        );
                      })
                    );
                  })()}
                </div>

                <div className="mt-4 flex flex-col gap-2 border p-2 rounded-md">
                  <Select
                    value={mainImpressionRecommendation.selectedImpressionId}
                    onValueChange={(val) => {
                      setChangedOne((prev) => ({
                        ...prev,
                        impression: true,
                        recommendation: true,
                      }));
                      let options = impressionRecommendation;
                      if (
                        assignData?.naSystemReportAccess &&
                        getAnswer(81) === "true"
                      ) {
                        options = NAimpressionRecommendation;
                      }
                      const matched = options
                        .flatMap((cat) => cat.data)
                        .find((item) => item.id === val);

                      setMainImpressionRecommendation((prev) => ({
                        ...prev,
                        selectedImpressionId: val,
                        selectedRecommendationId: val,
                        impressionText: matched?.impressionText || "",
                        recommendationText: matched?.recommendationText || "",
                      }));
                      ++requestVersionRef.current;
                    }}
                  >
                    <SelectTrigger className="bg-[#a3b1a0] m-0 text-xs w-full relative">
                      <SelectValue placeholder="Select Impression" />
                    </SelectTrigger>

                    <SelectContent>
                      {assignData?.naSystemReportAccess &&
                      getAnswer(81) === "true" ? (
                        <>
                          {NAimpressionRecommendation.map((contentCategory) =>
                            contentCategory.data.map((content, idx) => (
                              <SelectItem
                                key={`impression-${content.id}-${idx}`}
                                value={content.id}
                              >
                                {content.id + " - " + content.impression}
                              </SelectItem>
                            ))
                          )}
                        </>
                      ) : (
                        <>
                          {impressionRecommendation.map((contentCategory) =>
                            contentCategory.data.map((content, idx) => (
                              <SelectItem
                                key={`impression-${content.id}-${idx}`}
                                value={content.id}
                              >
                                {content.id + " - " + content.impression}
                              </SelectItem>
                            ))
                          )}
                        </>
                      )}
                    </SelectContent>
                  </Select>

                  <div className="w-full">
                    {selectedImpression?.impressionText}
                  </div>
                </div>

                <div
                  className="flex justify-end mt-2 w-full"
                  // hidden={showOptional.impression}
                >
                  <Button
                    variant="greenTheme"
                    onClick={() => {
                      setChangedOne((prev) => ({
                        ...prev,
                        impressionaddtional: true,
                      }));
                      // setShowOptional((prev) => ({ ...prev, impression: true }))
                      setAdditionalImpression((prev) => [
                        ...prev,
                        { id: "", text: "" },
                      ]);
                      ++requestVersionRef.current;
                    }}
                  >
                    <Plus />
                    <span>Add</span>
                  </Button>
                </div>

                {/* {showOptional.impression && ( */}
                {additionalImpression.length > 0 &&
                  additionalImpression.map((data, index) => (
                    <div className="mt-4 flex flex-col gap-2 border p-2 rounded-md">
                      <div className="flex justify-between items-center">
                        <h1>Add-On</h1>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            setChangedOne((prev) => ({
                              ...prev,
                              impressionaddtional: true,
                            }));
                            setAdditionalImpression((prev) =>
                              prev.filter((_, i) => i !== index)
                            );
                            ++requestVersionRef.current;
                          }}
                        >
                          <Trash />
                        </Button>
                      </div>
                      <Select
                        value={data.id}
                        onValueChange={(val) => {
                          setChangedOne((prev) => ({
                            ...prev,
                            impressionaddtional: true,
                          }));

                          let options = impressionRecommendation;

                          if (
                            assignData?.naSystemReportAccess &&
                            getAnswer(81) === "true"
                          ) {
                            options = NAimpressionRecommendation;
                          }

                          const matched = options
                            .flatMap((cat) => cat.data)
                            .find((item) => item.id.toString() === val);

                          setAdditionalImpression((prev) =>
                            prev.map((item, i) =>
                              i === index
                                ? {
                                    ...item,
                                    id: val,
                                    text: matched?.impressionText || "",
                                  }
                                : item
                            )
                          );

                          ++requestVersionRef.current;
                        }}
                      >
                        <SelectTrigger className="bg-[#a3b1a0] m-0 text-xs w-full">
                          <SelectValue placeholder="Select Impression" />
                        </SelectTrigger>

                        <SelectContent>
                          {assignData?.naSystemReportAccess &&
                          getAnswer(81) === "true" ? (
                            <>
                              {NAimpressionRecommendation.map(
                                (contentCategory) =>
                                  contentCategory.data.map((content, idx) => (
                                    <SelectItem
                                      key={`impression-${content.id}-${idx}`}
                                      value={content.id}
                                    >
                                      {content.id + " - " + content.impression}
                                    </SelectItem>
                                  ))
                              )}
                            </>
                          ) : (
                            <>
                              {impressionRecommendation.map((contentCategory) =>
                                contentCategory.data.map((content, idx) => (
                                  <SelectItem
                                    key={`impression-${content.id}-${idx}`}
                                    value={content.id}
                                  >
                                    {content.id + " - " + content.impression}
                                  </SelectItem>
                                ))
                              )}
                            </>
                          )}
                        </SelectContent>
                      </Select>

                      <div className="w-full">{data.text}</div>
                    </div>
                  ))}
                {/* )} */}
              </div>

              <div className="min-w-[50%] max-w-[50%]">
                <div className="bg-[#a3b1a1] mx-4 p-2 rounded-t-lg text-xl text-center font-bold">
                  Recommendation
                </div>

                <div
                  className={`${
                    assignData?.naSystemReportAccess && getAnswer(81) === "true"
                      ? "h-[auto]"
                      : "h-[65vh]"
                  } overflow-y-auto bg-radial-greeting-02 rounded-lg pointer-events-auto`}
                >
                  {(() => {
                    let options = impressionRecommendation;
                    if (
                      assignData?.naSystemReportAccess &&
                      getAnswer(81) === "true"
                    ) {
                      options = NAimpressionRecommendation;
                    }

                    return options.map((category, index) =>
                      category.data.map((content, idx) => {
                        const isFirst = index === 0 && idx === 0;
                        const isLast =
                          index === impressionRecommendation.length - 1 &&
                          idx === category.data.length - 1;

                        return (
                          <div
                            key={`rec-${content.id}`}
                            ref={(el) => {
                              recommendationRefs.current[content.id] = el;
                            }}
                            className={`flex ${
                              isFirst ? "rounded-tl-lg" : ""
                            } ${isLast ? "rounded-bl-lg" : ""} ${
                              mainImpressionRecommendation.selectedRecommendationId ===
                              content.id
                                ? "border-2 border-[#0000006d]"
                                : "border-b border-b-[#00000030]"
                            } ${readOnly ? "pointer-events-none" : ""}`}
                            style={{
                              backgroundColor:
                                content.recommendationBackgroundColor,
                              color: content.recommendationTextColor,
                            }}
                          >
                            <p className="min-w-[6rem] text-xs font-semibold text-center px-2 py-1 flex items-center justify-center">
                              {content.id}
                            </p>
                            <p className="text-sm pl-2 flex items-center font-semibold">
                              {content.recommendation}
                            </p>
                          </div>
                        );
                      })
                    );
                  })()}
                </div>

                <div className="mt-4 flex flex-col gap-2 border p-2 rounded-md">
                  <Select
                    value={
                      mainImpressionRecommendation.selectedRecommendationId
                    }
                    onValueChange={(val) => {
                      setChangedOne((prev) => ({
                        ...prev,
                        recommendation: true,
                      }));

                      let options = impressionRecommendation;
                      if (
                        assignData?.naSystemReportAccess &&
                        getAnswer(81) === "true"
                      ) {
                        options = NAimpressionRecommendation;
                      }
                      const matched = options
                        .flatMap((cat) => cat.data)
                        .find((item) => item.id === val);

                      setMainImpressionRecommendation((prev) => ({
                        ...prev,
                        selectedRecommendationId: val,
                        recommendationText: matched?.recommendationText || "",
                      }));

                      ++requestVersionRef.current;
                    }}
                  >
                    <SelectTrigger className="bg-[#a3b1a0] m-0 text-xs w-full">
                      <SelectValue placeholder="Select Recommendation" />
                    </SelectTrigger>

                    <SelectContent>
                      {assignData?.naSystemReportAccess &&
                      getAnswer(81) === "true" ? (
                        <>
                          {NAimpressionRecommendation.map((contentCategory) =>
                            contentCategory.data.map((content, idx) => (
                              <SelectItem
                                key={`impression-${content.id}-${idx}`}
                                value={content.id}
                              >
                                {content.id + " - " + content.recommendation}
                              </SelectItem>
                            ))
                          )}
                        </>
                      ) : (
                        <>
                          {impressionRecommendation.map((contentCategory) =>
                            contentCategory.data.map((content, idx) => (
                              <SelectItem
                                key={`impression-${content.id}-${idx}`}
                                value={content.id}
                              >
                                {content.id + " - " + content.recommendation}
                              </SelectItem>
                            ))
                          )}
                        </>
                      )}
                    </SelectContent>
                  </Select>

                  <div className="w-full">
                    {selectedImpression?.recommendationText}
                  </div>
                </div>

                <div
                  className="flex justify-end mt-2 w-full"
                  // hidden={showOptional.impression}
                >
                  <Button
                    variant="greenTheme"
                    onClick={() => {
                      setChangedOne((prev) => ({
                        ...prev,
                        recommendationaddtional: true,
                      }));
                      // setShowOptional((prev) => ({ ...prev, impression: true }))
                      setAdditionalRecommendation((prev) => [
                        ...prev,
                        { id: "", text: "" },
                      ]);
                      ++requestVersionRef.current;
                    }}
                  >
                    <Plus />
                    <span>Add</span>
                  </Button>
                </div>

                {/* {showOptional.impression && ( */}
                {additionalRecommendation.length > 0 &&
                  additionalRecommendation.map((data, index) => (
                    <div className="mt-4 flex flex-col gap-2 border p-2 rounded-md">
                      <div className="flex justify-between items-center">
                        <h1>Add-On</h1>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            setChangedOne((prev) => ({
                              ...prev,
                              recommendationaddtional: true,
                            }));
                            setAdditionalRecommendation((prev) =>
                              prev.filter((_, i) => i !== index)
                            );
                            ++requestVersionRef.current;
                          }}
                        >
                          <Trash />
                        </Button>
                      </div>
                      <Select
                        value={data.id}
                        onValueChange={(val) => {
                          setChangedOne((prev) => ({
                            ...prev,
                            recommendationaddtional: true,
                          }));

                          let options = impressionRecommendation;

                          if (
                            assignData?.naSystemReportAccess &&
                            getAnswer(81) === "true"
                          ) {
                            options = NAimpressionRecommendation;
                          }

                          const matched = options
                            .flatMap((cat) => cat.data)
                            .find((item) => item.id.toString() === val);

                          setAdditionalRecommendation((prev) =>
                            prev.map((item, i) =>
                              i === index
                                ? {
                                    ...item,
                                    id: val,
                                    text: matched?.impressionText || "",
                                  }
                                : item
                            )
                          );
                          ++requestVersionRef.current;
                        }}
                      >
                        <SelectTrigger className="bg-[#a3b1a0] m-0 text-xs w-full">
                          <SelectValue placeholder="Select Impression" />
                        </SelectTrigger>

                        <SelectContent>
                          {assignData?.naSystemReportAccess &&
                          getAnswer(81) === "true" ? (
                            <>
                              {NAimpressionRecommendation.map(
                                (contentCategory) =>
                                  contentCategory.data.map((content, idx) => (
                                    <SelectItem
                                      key={`impression-${content.id}-${idx}`}
                                      value={content.id}
                                    >
                                      {content.id + " - " + content.impression}
                                    </SelectItem>
                                  ))
                              )}
                            </>
                          ) : (
                            <>
                              {impressionRecommendation.map((contentCategory) =>
                                contentCategory.data.map((content, idx) => (
                                  <SelectItem
                                    key={`impression-${content.id}-${idx}`}
                                    value={content.id}
                                  >
                                    {content.id + " - " + content.impression}
                                  </SelectItem>
                                ))
                              )}
                            </>
                          )}
                        </SelectContent>
                      </Select>

                      <div className="w-full">{data.text}</div>
                    </div>
                  ))}
                {/* )} */}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Macro Sentence</Label>
              <Select
                value={commonImpressRecomm.id}
                onValueChange={(value) => {
                  setChangedOne((prev) => ({
                    ...prev,
                    commonImpressionRecommendation: true,
                  }));
                  let options = additionalOptions;
                  if (
                    assignData?.naSystemReportAccess &&
                    getAnswer(81) === "true"
                  ) {
                    options = NAadditionalOptions;
                  }
                  const selected = options.find((opt) => opt.id === value);
                  if (selected) {
                    setCommonImpressRecomm({
                      ...commonImpressRecomm,
                      id: selected.id,
                      text: selected.text,
                    });
                  }
                  ++requestVersionRef.current;
                }}
              >
                <SelectTrigger className="bg-[#a3b1a0] m-0 text-xs w-1/2">
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  {assignData?.naSystemReportAccess &&
                  getAnswer(81) === "true" ? (
                    <>
                      {NAadditionalOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.id} -{" "}
                          {option.text.split(" ").slice(0, 10).join(" ")}
                          ...
                        </SelectItem>
                      ))}
                    </>
                  ) : (
                    <>
                      {additionalOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.id} -{" "}
                          {option.text.split(" ").slice(0, 10).join(" ")}
                          ...
                        </SelectItem>
                      ))}
                    </>
                  )}
                </SelectContent>
              </Select>

              {selectedMacro && (
                <div className="text-sm mt-2 p-2 rounded border whitespace-pre-wrap">
                  {selectedMacro}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ImpressionRecommendation;
