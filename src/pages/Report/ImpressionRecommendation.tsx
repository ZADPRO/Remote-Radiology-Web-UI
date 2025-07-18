import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useEffect, useRef } from "react";

interface ImpressionProps {
    selectedImpressionId: string;
  setSelectedImpressionId: React.Dispatch<React.SetStateAction<string>>;
    selectedRecommendationId: string;
  setSelectedRecommendationId: React.Dispatch<React.SetStateAction<string>>;
  setRecommendationText: React.Dispatch<React.SetStateAction<string>>;
  setImpressionText: React.Dispatch<React.SetStateAction<string>>;
}

const ImpressionRecommendation: React.FC<ImpressionProps> = ({
  selectedImpressionId,
  setSelectedImpressionId,
  selectedRecommendationId,
  setSelectedRecommendationId,
  setImpressionText,
  setRecommendationText,
}) => {

  const impressionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const recommendationRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const impressionRecommendation = [
    {
      color: "#474747",
      data: [
        {
          id: "0",
          impression: "Incomplete/Indeterminate Study",
          impressionText:
            "The imaging study demonstrates insufficient signal clarity, artifacts, or technical limitations that prevent complete evaluation of the breast tissue. Suboptimal image quality limits diagnostic confidence.",
          recommendation: "Repeat QT Imaging",
          recommendationText:
            "Repeat QT imaging is recommended for improved image quality and better diagnostic clarity.",
        },
      ],
    },
    {
      color: "#741b47",
      data: [
        {
          id: "1",
          impression: "Likely Benign Findings",
          impressionText:
            "The examination demonstrates findings which are likely benign breast changes. While tissue variations are present, there is no evidence of suspicious/dominant masses, or architectural distortion to suggest malignancy.",
          recommendation: "Routine Annual Screening",
          recommendationText:
            "Return for routine annual breast imaging screening in 12 months to monitor breast tissue stability and detect any interval changes.",
        },
        {
          id: "1a",
          impression: "Likely Benign Findings + Architectural Distortion",
          impressionText:
            "The architectural distortion observed is attributed to post-operative or post-procedural changes. The examination demonstrates findings which are likely benign breast changes.",
          recommendation: "Routine Annual Screening",
          recommendationText:
            "Return for routine annual breast imaging screening in 12 months to monitor breast tissue stability and detect any interval changes.",
        },
        {
          id: "2",
          impression: "Low-Risk Characteristics",
          impressionText:
            "The examination shows tissue variations with low-risk features that are not definitively abnormal but require further follow up to ensure they are benign.",
          recommendation: "Short-Term Follow-Up 6 Months",
          recommendationText:
            "Return for follow-up imaging in 6 months to assess stability of current findings and ensure no interval progression.",
        },
        {
          id: "3",
          impression: "Indeterminate Findings",
          impressionText:
            "The examination demonstrates indeterminate tissue changes that are not definitively abnormal but also not clearly benign. Further clinical correlation and follow-up imaging are advised to assess stability and significance.",
          recommendation: "Growth Rate Assessment in 3 Months",
          recommendationText:
            "Follow-up examination in 3 months specifically recommended for rapid assessment of growth characteristics.",
        },
        {
          id: "3a",
          impression: "Indeterminate: Not Definitively Abnormal",
          impressionText:
            "The examination shows some architectural variations of ductal patterns, trabecular patterns, or connective components without clinical correlate. Further follow-up may be warranted.",
          recommendation: "Confirm Benign Nature with Targeted Ultrasound",
          recommendationText:
            "Additional imaging such as targeted ultrasound is recommended to confirm the benign nature of these findings.",
        },
        {
          id: "3b",
          impression: "Indeterminate: Calcifications",
          impressionText:
            "The examination demonstrates calcifications as described in the detailed findings. These calcium deposits require further evaluation and follow-up to determine their clinical significance.",
          recommendation:
            "Consultation with Health Care Provider or Breast Specialist",
          recommendationText:
            "Clinical consultation with your health care provider or a breast specialist is recommended for management of breast calcifications. Note that QT imaging may not detect all non-invasive or microinvasive lesions.",
        },
        {
          id: "3c",
          impression: "Indeterminate: Likely Cystic Changes",
          impressionText:
            "The examination shows changes in breast tissue that may represent cysts (fluid-filled spaces). While cysts are typically benign, further evaluation is needed to confirm this diagnosis.",
          recommendation: "Cystic Mass Evaluation with Targeted Ultrasound",
          recommendationText:
            "Due to palpable cystic masses, additional imaging such as targeted ultrasound is recommended. Clinical follow-up with your health care provider is advised.",
        },
        {
          id: "3d",
          impression: "Benign Post-Surgical Changes + Fluid/Seroma",
          impressionText:
            "The exam shows likely benign post-surgical findings of calcification, scarring and a possible seroma as described. There is no evidence of dominant masses or architectural distortion to suggest the presence of malignancy.",
          recommendation:
            "Consultation with Breast Specialist for Comprehensive Evaluation",
          recommendationText:
            "Clinical consultation with a breast specialist is recommended for comprehensive evaluation of the current findings and determination of appropriate management strategy.",
        },
        {
          id: "3e",
          impression: "Indeterminate: Post-Surgical vs. Recurrent",
          impressionText:
            "The examination shows tissue variations that may represent either post-operative fibrosis (tissue scarring) or recurrent disease. Further follow-up and evaluation are required for definitive characterization.",
          recommendation:
            "Clinical Consultation + Interval Imaging + Ongoing Surveillance",
          recommendationText:
            "Clinical consultation is recommended along with interval imaging and ongoing surveillance to monitor the stability of current findings and ensure appropriate management.",
        },
        {
          id: "3f",
          impression: "Indeterminate: Likely Fibrosis",
          impressionText:
            "The examination demonstrates tissue changes consistent with post-surgical fibrosis. While these findings are likely benign, follow-up is recommended to ensure stability and rule out recurrence.",
          recommendation: "Clinical Consultation + Surveillance",
          recommendationText:
            "Clinical consultation with appropriate healthcare provider is recommended for ongoing surveillance and monitoring of current findings.",
        },
        {
          id: "3g",
          impression: "Indeterminate: Long Standing Findings",
          impressionText:
            "The examination shows long-standing tissue variations that have been present in previous studies. While stability suggests benign nature, continued surveillance is recommended to monitor for any interval changes.",
          recommendation:
            "Ultrasound Correlation if Clinically Indicated or Area Not Previously Evaluated",
          recommendationText:
            "If the long-standing palpable area has not been previously evaluated or if clinical concern persists, correlation with targeted ultrasound may be warranted.",
        },
      ],
    },
    {
      color: "#38761d",
      data: [
        {
          id: "4",
          impression: "No Correlate for Symptoms (Non Lump)",
          impressionText:
            "No significant abnormality is identified in the region of reported symptoms. There is no evidence of dominant masses or architectural distortion to suggest malignancy.",
          recommendation: "Clinical Monitoring",
          recommendationText:
            "Clinical monitoring of the symptomatic area is recommended. If a palpable mass or new concern develops, targeted ultrasound evaluation should be performed.",
        },
        {
          id: "4a",
          impression:
            "Palpable Lump – No QT Finding or Abnormal Image Findings",
          impressionText:
            "No imaging findings are demonstrated in the region of the reported palpable concern.",
          recommendation: "Targeted Ultrasound Evaluation",
          recommendationText:
            "Targeted ultrasound evaluation is recommended for further assessment of the palpable finding. If benign features are confirmed, routine annual screening may resume.",
        },
        {
          id: "4b",
          impression: "Palpable Lump + QT Finding",
          impressionText:
            "The examination demonstrates a QT imaging finding that correlates with the site of the reported palpable concern.",
          recommendation: "Additional Imaging and Clinical Consultation",
          recommendationText:
            "Clinical consultation and additional imaging (with a targeted ultrasound) are recommended for further characterization and management planning.",
        },
        {
          id: "4c",
          impression: "Mammographic Calcifications + QT",
          impressionText:
            "QT imaging findings are also noted in the same region of calcifications as described on prior imaging.",
          recommendation: "Breast Specialist Evaluation",
          recommendationText:
            "Breast specialist evaluation is recommended for further assessment and management of the calcifications.",
        },
        {
          id: "4d",
          impression: "USG Solid Mass + QT",
          impressionText:
            "QT findings correspond to the solid mass identified on ultrasound.",
          recommendation: "Breast Specialist Evaluation",
          recommendationText:
            "Breast specialist evaluation is recommended for comprehensive assessment and further management planning.",
        },
        {
          id: "4e",
          impression: "USG BIRADS 3 Findings + QT",
          impressionText:
            "The examination shows tissue variations with low-risk features in the region of the BIRADS 3 lesion. These are not definitively abnormal but require further follow-up to ensure they are benign.",
          recommendation: "Breast Specialist Evaluation",
          recommendationText:
            "Breast specialist evaluation is recommended to determine appropriate follow-up, which may include short-term surveillance or further testing.",
        },
        {
          id: "4f",
          impression: "No QT Correlate for Abnormal Image Findings",
          impressionText:
            "An abnormality is identified on other imaging modalities; however, no corresponding findings are demonstrated on QT imaging.",
          recommendation: "Clinical Correlation and Imaging Review",
          recommendationText:
            "Clinical correlation is advised. Additional imaging or follow-up may be considered based on overall clinical context.",
        },
        {
          id: "4g",
          impression: "Palpable Lump + Abnormal Imaging + QT Finding",
          impressionText:
            "The reported palpable abnormality is confirmed on imaging and demonstrates concerning features on QT.",
          recommendation: "Image-Guided Biopsy",
          recommendationText:
            "Image-guided biopsy is recommended for histopathological evaluation and definitive diagnosis.",
        },
        {
          id: "5",
          impression: "Suspicious for Malignancy",
          impressionText:
            "The examination demonstrates findings of significant tissue abnormalities with suspicious features. Further evaluation is required to rule out malignancy.",
          recommendation: "Clinical Consultation + Biopsy",
          recommendationText:
            "Clinical consultation with your health care provider is recommended for further evaluation, which may include additional imaging and/or image-guided tissue sampling of the suspicious finding. Histopathological correlation is needed to determine the exact nature of the abnormality.",
        },
      ],
    },
    {
      color: "#1155cc",
      data: [
        {
          id: "6",
          impression: "Known Malignancy",
          impressionText:
            "The examination shows tissue variations in the location of the previously biopsy-proven lesion as described in the detailed findings. Imaging findings are consistent with biopsy-proven malignancy.",
          recommendation: "Oncologist Follow-Up + Advanced Imaging",
          recommendationText:
            "Clinical consultation with your health care provider is recommended for consideration of advanced imaging (such as MRI) and close clinical surveillance.",
        },
        {
          id: "6a",
          impression: "Post-Malignancy Surveillance (After Treatment)",
          impressionText:
            "The examination demonstrates changes / tissue prominence are identified in the setting of known malignancy with ongoing surveillance.",
          recommendation: "Breast Specialist Consultation",
          recommendationText:
            "Given the history of malignancy, breast specialist consultation is recommended with clinical examination and possible additional imaging (ultrasound or MRI) to characterize the described areas.",
        },
        {
          id: "6b",
          impression: "Known Malignancy - Before or Ongoing Treatment",
          impressionText:
            "The examination demonstrates changes in the setting of known malignancy.",
          recommendation: "Oncologist Consultation",
          recommendationText:
            "Oncologist consultation is recommended for further management planning based on current findings.",
        },
        {
          id: "6c",
          impression: "Known Malignancy - Biopsy Proven (Details Unknown)",
          impressionText:
            "The examination demonstrates changes in the setting of known malignancy.",
          recommendation: "Oncologist Consultation",
          recommendationText:
            "Oncologist consultation is recommended for further management planning based on current findings.",
        },
        {
          id: "6d",
          impression: "DCIS / LCIS - DCIS with Possible Microinvasion",
          impressionText:
            "Findings are consistent with known diagnosis of ductal carcinoma in situ (DCIS) and may represent microinvasive disease.",
          recommendation: "Breast Specialist Consultation",
          recommendationText:
            "Clinical consultation with a breast specialist is recommended for management of DCIS. Note that QT imaging may not detect all non-invasive or microinvasive lesions.",
        },
        {
          id: "6e",
          impression: "Known Malignancy - Equivocal / Indeterminate",
          impressionText:
            "Findings are equivocal and may represent either post-operative fibrosis or recurrent disease.",
          recommendation: "Histopathological Confirmation or Advanced Imaging",
          recommendationText:
            "Histopathological confirmation or advanced imaging like targeted ultrasound or MRI is recommended for definitive characterization.",
        },
        {
          id: "6f",
          impression: "Known Malignancy - First Scan for Cancer/DCIS Diagnosis",
          impressionText:
            "The examination demonstrates changes in the setting of known malignancy as described above.",
          recommendation: "Breast Specialist Consultation + Baseline Recording",
          recommendationText:
            "This is the first QT scan with no prior QT images available for comparison. The most accurate assessment is achieved by comparing the current QT scan to a prior QT scan. If no prior QT scan is available, this study serves as a baseline for future follow-ups. Subsequent QT scans can be utilized to assess segmentation quantification and evaluate changes over time, including doubling time, for treatment response assessment. Breast specialist consultation is recommended for further management planning based on current findings.",
        },
      ],
    },
    {
      color: "#bf9000",
      data: [
        {
          id: "7",
          impression: "No New Lesions / Likely Benign",
          impressionText:
            "The examination does not demonstrate any new lesions. Existing findings appear likely benign based on comparison with previous imaging.",
          recommendation: "Routine Annual Screening",
          recommendationText:
            "Return for routine annual breast imaging screening in 12 months to monitor breast tissue stability and detect any interval changes.",
        },
        {
          id: "7a",
          impression: "Interval Progression",
          impressionText:
            "Compared to the previous examination, there is an interval increase in the size of the lesion. Clinical consultation is recommended for further management planning.",
          recommendation: "Clinical Consultation and Surveillance",
          recommendationText:
            "Clinical consultation with your health care provider or a breast specialist is recommended for further evaluation, which may include additional imaging and/or image-guided tissue sampling of the abnormal findings as described in both breasts.",
        },
        {
          id: "7b",
          impression: "Interval Regression",
          impressionText:
            "Compared to the previous examination, there is an interval decrease in size/volume, suggestive of lesion regression or shrinkage.",
          recommendation: "Clinical Correlation and Surveillance",
          recommendationText:
            "In view of the shrinkage in the noted findings, clinical follow-up with a health care provider or a breast specialist, continued surveillance, and management planning based on current findings.",
        },
        {
          id: "7c",
          impression: "Stable Disease",
          impressionText:
            "Compared to the previous examination, no significant interval change is noted in lesion size, which therefore appears stable.",
          recommendation: "Clinical Correlation and Surveillance",
          recommendationText:
            "In view of the stability in the noted findings, clinical follow-up with a health care provider or a breast specialist, continued surveillance, and management planning based on current findings.",
        },
        {
          id: "7d",
          impression: "Technical Limitation for Comparison",
          impressionText:
            "Significant artifacts in the current transmission imaging limit accurate volume measurements and comparison with prior studies.",
          recommendation: "Clinical Correlation and Surveillance",
          recommendationText:
            "Clinical follow-up with a health care provider, continued surveillance, and management planning based on current findings.",
        },
        {
          id: "7e",
          impression: "Mixed Response",
          impressionText:
            "Compared to the previous examination, there is an interval increase in one of the lesions. The rest show interval decrease or resolution as described above. The examination shows tissue variations that are not definitively abnormal.",
          recommendation: "Multidisciplinary Follow-Up",
          recommendationText:
            "Clinical consultation with a breast specialist, surgeon, or oncologist is recommended for ongoing follow-up, continued surveillance, and management planning based on current findings.",
        },
      ],
    },
  ];

  const selectedImpression = impressionRecommendation
    .flatMap((group) => group.data)
    .find((impression) => impression.id === selectedImpressionId);

  useEffect(() => {
    const scrollToCenter = (el: HTMLDivElement | null) => {
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    };

    scrollToCenter(impressionRefs.current[selectedImpressionId]);
    scrollToCenter(recommendationRefs.current[selectedRecommendationId]);
  }, [selectedImpressionId, selectedRecommendationId]);

  return (
    <div className="flex justify-center items-start gap-10 py-6 px-12 w-full h-[90vh] space-y-10 overflow-y-scroll">
      <div className="flex items-start justify-center gap-4">
        <div className="w-1/2">
          {/* Header */}
          <div className="bg-[#a3b1a1] mx-4 p-2 rounded-t-lg text-xl text-center font-bold">
            Impression
          </div>

          {/* Scrollable container */}
          <div className="h-[65vh] overflow-y-auto bg-radial-greeting-02 rounded-lg">
            {impressionRecommendation.map((contentCategory, index) =>
              contentCategory.data.map((content, idx) => {
                const isFirst = index === 0 && idx === 0;
                const isLast =
                  index === impressionRecommendation.length - 1 &&
                  idx === contentCategory.data.length - 1;

                const isSelected = selectedImpressionId === content.id;

                return (
                  <div
                    key={`impression-${content.id}-${idx}`}
                    ref={(el) => {
                      impressionRefs.current[content.id] = el;
                    }}
                    onClick={() => {
                      setSelectedImpressionId(content.id),
                        setSelectedRecommendationId(content.id),
                        setImpressionText(content.impressionText),
                        setRecommendationText(content.recommendationText);
                    }}
                    className={`flex cursor-pointer border-b border-b-[#00000030] ${
                      isFirst ? "rounded-tl-lg" : ""
                    } ${isLast ? "rounded-bl-lg" : ""} ${
                      isSelected ? "bg-[#d9ead3]" : ""
                    }`}
                  >
                    <p
                      className="min-w-[6rem] text-xs text-black font-semibold text-center px-2 py-1 flex items-center justify-center"
                      style={{
                        backgroundColor: contentCategory.color,
                      }}
                    >
                      {content.id}
                    </p>
                    <p className="text-sm pl-2 flex items-center font-semibold">
                      {content.impression}
                    </p>
                  </div>
                );
              })
            )}
          </div>

          <div className="mt-4 flex flex-col gap-4">
            <Select
              value={selectedImpressionId}
              onValueChange={(val) => {
                setSelectedImpressionId(val);

                const matched = impressionRecommendation
                  .flatMap((cat) => cat.data)
                  .find((item) => item.id === val);

                setImpressionText(matched?.impressionText || ""); // fallback to empty string if not found
              }}
            >
              <SelectTrigger className="bg-[#a3b1a0] m-0 text-xs w-64 relative">
                <SelectValue placeholder="Select Impression" />
              </SelectTrigger>

              <SelectContent>
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
              </SelectContent>
            </Select>

            <div>{selectedImpression?.impressionText}</div>
          </div>
        </div>

        <div className="w-1/2">
          <div className="bg-[#a3b1a1] mx-4 p-2 rounded-t-lg text-xl text-center font-bold">
            Recommendation
          </div>
          <div className="h-[65vh] overflow-y-auto bg-radial-greeting-02 rounded-lg">
            {impressionRecommendation.map((category, index) =>
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
                    className={`flex border-b border-b-[#00000030] ${
                      isFirst ? "rounded-tl-lg" : ""
                    } ${isLast ? "rounded-bl-lg" : ""} ${
                      selectedRecommendationId === content.id
                        ? "bg-[#d9ead3]"
                        : ""
                    }`}
                  >
                    <p
                      className="min-w-[6rem] text-xs text-black font-semibold text-center px-2 py-1 flex items-center justify-center"
                      style={{ backgroundColor: category.color }}
                    >
                      {content.id}
                    </p>
                    <p className="text-sm pl-2 flex items-center font-semibold">
                      {content.recommendation}
                    </p>
                  </div>
                );
              })
            )}
          </div>

          <div className="mt-4 flex flex-col gap-4">
            <Select
              value={selectedRecommendationId}
              onValueChange={(val) => {
                setSelectedRecommendationId(val);

                const matched = impressionRecommendation
                  .flatMap((cat) => cat.data)
                  .find((item) => item.id === val);

                setRecommendationText(matched?.recommendationText || ""); // fallback to empty string if not found
              }}
            >
              <SelectTrigger className="bg-[#a3b1a0] m-0 text-xs w-64">
                <SelectValue placeholder="Select Impression" />
              </SelectTrigger>

              <SelectContent>
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
              </SelectContent>
            </Select>
            <div>{selectedImpression?.recommendationText}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpressionRecommendation;
