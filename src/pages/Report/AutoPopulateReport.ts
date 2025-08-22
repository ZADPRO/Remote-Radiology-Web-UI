import {
  additionalOptions,
  impressionRecommendation,
} from "./ImpressionRecommendation";
import {
  breastDensityandImageRightQuestions,
  breastDensityandImageLeftQuestions,
  ComparisonPriorLeftQuestion,
  ComparisonPriorRightQuestion,
  grandularAndDuctalTissueLeftQuestions,
  grandularAndDuctalTissueRightQuestions,
  LymphNodesLeftQuestions,
  LymphNodesRightQuestions,
  nippleAreolaSkinLeftQuestions,
  nippleAreolaSkinRightQuestions,
  symmetryQuestions,
  breastImpantQuestions,
} from "./ReportQuestionsAssignment";

export function AutoPopulateReport(
  getPatientAnswer: (id: number) => string,
  getreportAnswer: (id: number) => string,
  getTechnicianAnswer: (id: number) => string,
  handleReportInputChange: (questionId: number, value: string) => void
) {
  //Right Breast Access Check
  getreportAnswer(130) === "" && handleReportInputChange(130, "Present");

  //Left Breast Access Check
  getreportAnswer(131) === "" && handleReportInputChange(131, "Present");

  //Right Recommendation
  getreportAnswer(132) === "" && handleReportInputChange(132, "Present");

  //Left Recommendation
  getreportAnswer(133) === "" && handleReportInputChange(133, "Present");

  getreportAnswer(breastImpantQuestions.breastImplants) === "" &&
    handleReportInputChange(breastImpantQuestions.breastImplants, "Present");

  // getPatientAnswer(questionIds.implantConfiguration) === "" &&
  //   handleReportInputChange(
  //     questionIds.implantConfiguration,
  //     "Bilateral Similar"
  //   );

  // getPatientAnswer(questionIds.implantPositon) === "" &&
  //   handleReportInputChange(questionIds.implantPositon, "Subpectoral");

  // getPatientAnswer(questionIds.implantMaterial) === "" &&
  //   handleReportInputChange(
  //     questionIds.implantMaterial,
  //     getPatientAnswer(80)
  //   );

  getreportAnswer(breastImpantQuestions.displacement) === "" &&
    handleReportInputChange(breastImpantQuestions.displacement, "None");

  getreportAnswer(breastImpantQuestions.contracture) === "" &&
    handleReportInputChange(breastImpantQuestions.contracture, "None");

  getreportAnswer(breastImpantQuestions.rupture) === "" &&
    handleReportInputChange(breastImpantQuestions.rupture, "Absent");

  getreportAnswer(breastImpantQuestions.implantMaterialOther) === "" &&
    getPatientAnswer(81).length > 0 &&
    handleReportInputChange(
      breastImpantQuestions.implantMaterialOther,
      getPatientAnswer(81)
    );

  getreportAnswer(breastImpantQuestions.implantPositon) === "" &&
    handleReportInputChange(
      breastImpantQuestions.implantPositon,
      "Subpectoral"
    );

  getreportAnswer(symmetryQuestions.symmetry) == "" &&
    handleReportInputChange(
      symmetryQuestions.symmetry,
      getTechnicianAnswer(19) == "true"
        ? "Asymmetry"
        : "Symmetrical size and shape"
    );
  getreportAnswer(symmetryQuestions.symmetryLeft) == "" &&
    getTechnicianAnswer(20).length > 0 &&
    handleReportInputChange(
      symmetryQuestions.symmetryLeft,
      getTechnicianAnswer(20) === "Right"
        ? "right breast bigger than left breast"
        : getTechnicianAnswer(20) === "Left"
        ? "left breast bigger than right breast"
        : ""
    );
  // getreportAnswer(symmetryQuestions.symmetryRight) == "" &&
  //   handleReportInputChange(
  //     symmetryQuestions.symmetryRight,
  //     getTechnicianAnswer(22)
  //   );

  // --------------------- Right ---------------------------- //

  // Breast Density and Image Quality Right
  breastDensityandImage(breastDensityandImageRightQuestions);

  // Nipple Areola Right
  nippleAreola(nippleAreolaSkinRightQuestions, "Right");

  // Glandular Ductal Right
  glandularAndDuctalTissue(grandularAndDuctalTissueRightQuestions);

  // Lymph Nodes Right
  lymphNodes(LymphNodesRightQuestions);

  // Comparison Prior Right
  comparisonPrior(ComparisonPriorRightQuestion);

  // --------------------- Left ---------------------------- //

  // Breast Density and Image Quality Left
  breastDensityandImage(breastDensityandImageLeftQuestions);

  // Nipple Areola Left
  nippleAreola(nippleAreolaSkinLeftQuestions, "Left");

  // Glandular Ductal Left
  glandularAndDuctalTissue(grandularAndDuctalTissueLeftQuestions);

  // Lymph Nodes Left
  lymphNodes(LymphNodesLeftQuestions);

  // Comparison Prior Left
  comparisonPrior(ComparisonPriorLeftQuestion);

  function breastDensityandImage(questionIds: { [key: string]: number }) {
    getreportAnswer(questionIds.breastSelect) === "" &&
      handleReportInputChange(questionIds.breastSelect, "Present");
    getreportAnswer(questionIds.imageQuality) === "" &&
      handleReportInputChange(questionIds.imageQuality, "Acceptable");
    getreportAnswer(questionIds.breastDensity) === "" &&
      handleReportInputChange(
        questionIds.breastDensity,
        "Heterogeneously Dense"
      );
    getreportAnswer(questionIds.symmetry) === "" &&
      handleReportInputChange(questionIds.symmetry, "Symmetry");
  }

  function nippleAreola(questionIds: { [key: string]: number }, side: string) {
    getreportAnswer(questionIds.nippleSelect) === "" &&
      handleReportInputChange(questionIds.nippleSelect, "Present");
    getreportAnswer(questionIds.skinChanges) === "" &&
      handleReportInputChange(questionIds.skinChanges, "Normal");
    getreportAnswer(questionIds.nippleDeformity) === "" &&
      handleReportInputChange(questionIds.nippleDeformity, "Absent");
    getreportAnswer(questionIds.architecture) === "" &&
      handleReportInputChange(questionIds.architecture, "Normal");
    if (getreportAnswer(questionIds.nippleRetraction) === "") {
      const answer = getPatientAnswer(side === "Right" ? 112 : 113) || "Absent";

      handleReportInputChange(questionIds.nippleRetraction, answer);
    }
  }

  function glandularAndDuctalTissue(questionIds: { [key: string]: number }) {
    getreportAnswer(questionIds.grandularSelect) === "" &&
      handleReportInputChange(questionIds.grandularSelect, "Present");
    getreportAnswer(questionIds.grandularAndDuctalTissue) === "" &&
      handleReportInputChange(questionIds.grandularAndDuctalTissue, "Abnormal");
    getreportAnswer(questionIds.benignMicroCysts) === "" &&
      handleReportInputChange(questionIds.benignMicroCysts, "Absent");
    getreportAnswer(questionIds.benignCapsular) === "" &&
      handleReportInputChange(questionIds.benignCapsular, "Absent");
    getreportAnswer(questionIds.benignFibronodular) === "" &&
      handleReportInputChange(questionIds.benignFibronodular, "Absent");
    getreportAnswer(questionIds.calcificationsPresent) === "" &&
      handleReportInputChange(questionIds.calcificationsPresent, "Absent");
    getreportAnswer(questionIds.calcifiedScar) === "" &&
      handleReportInputChange(questionIds.calcifiedScar, "Absent");
    getreportAnswer(questionIds.ductalProminence) === "" &&
      handleReportInputChange(questionIds.ductalProminence, "Absent");
  }

  function lymphNodes(questionIds: { [key: string]: number }) {
    getreportAnswer(questionIds.IntramammaryDatar) === "" &&
      handleReportInputChange(
        questionIds.IntramammaryDatar,
        JSON.stringify([
          {
            option: "",
            position: "",
            level: "",
            levelpercentage: "",
            locationLevel: "benign morphology",
          },
        ])
      );
    // getreportAnswer(questionIds.axillarynodes) === "" &&
    //   handleReportInputChange(questionIds.axillarynodes, "benign morphology");
    getreportAnswer(questionIds.ClipsPresentStatus) === "" &&
      handleReportInputChange(questionIds.ClipsPresentStatus, "Present");
  }

  function comparisonPrior(questionIds: { [key: string]: number }) {
    getreportAnswer(questionIds.LesionCompTable) === "" &&
      handleReportInputChange(
        questionIds.LesionCompTable,
        JSON.stringify([
          {
            sizec: "",
            sizep: "",
            volumec: "",
            volumep: "",
            speedc: "",
            speedp: "",
            locationcclock: "",
            locationcposition: "",
            locationpclock: "",
            locationpposition: "",
            previous: "",
            lesionStatus: "",
            doublingtimedate1: "+",
            doublingtimedate2: "",
            vol1: "",
            vol2: "",
          },
        ])
      );
  }
}

export function AutoPopulateReportImpressRecomm(
  mainImpressionRecommendation: any,
  setMainImpressionRecommendation: any,
  optionalImpressionRecommendation: any,
  setOptionalImpressionRecommendation: any,
  commonImpressRecomm: any,
  setCommonImpressRecomm: any
) {
  if (mainImpressionRecommendation.selectedImpressionId) {
    setMainImpressionRecommendation((prev: any) => ({
      ...prev,
      impressionText:
        impressionRecommendation
          .map((item) => item.data)
          .flat()
          .find(
            (item) =>
              item.id === mainImpressionRecommendation.selectedImpressionId
          )?.impressionText || "", // default to empty string
      recommendationText:
        impressionRecommendation
          .map((item) => item.data)
          .flat()
          .find(
            (item) =>
              item.id === mainImpressionRecommendation.selectedRecommendationId
          )?.recommendationText || "",
    }));
  }

  if (mainImpressionRecommendation.selectedImpressionIdRight) {
    setMainImpressionRecommendation((prev: any) => ({
      ...prev,
      impressionTextRight:
        impressionRecommendation
          .map((item) => item.data)
          .flat()
          .find(
            (item) =>
              item.id === mainImpressionRecommendation.selectedImpressionIdRight
          )?.impressionText || "",
      recommendationTextRight:
        impressionRecommendation
          .map((item) => item.data)
          .flat()
          .find(
            (item) =>
              item.id ===
              mainImpressionRecommendation.selectedRecommendationIdRight
          )?.recommendationText || "",
    }));
  }

  if (optionalImpressionRecommendation.selectedImpressionId) {
    setOptionalImpressionRecommendation((prev: any) => ({
      ...prev,
      impressionText:
        impressionRecommendation
          .map((item) => item.data)
          .flat()
          .find(
            (item) =>
              item.id === optionalImpressionRecommendation.selectedImpressionId
          )?.impressionText || "",
      recommendationText:
        impressionRecommendation
          .map((item) => item.data)
          .flat()
          .find(
            (item) =>
              item.id ===
              optionalImpressionRecommendation.selectedRecommendationId
          )?.recommendationText || "",
    }));
  }

  if (optionalImpressionRecommendation.selectedImpressionIdRight) {
    setOptionalImpressionRecommendation((prev: any) => ({
      ...prev,
      impressionTextRight:
        impressionRecommendation
          .map((item) => item.data)
          .flat()
          .find(
            (item) =>
              item.id ===
              optionalImpressionRecommendation.selectedImpressionIdRight
          )?.impressionText || "",
      recommendationTextRight:
        impressionRecommendation
          .map((item) => item.data)
          .flat()
          .find(
            (item) =>
              item.id ===
              optionalImpressionRecommendation.selectedRecommendationIdRight
          )?.recommendationText || "",
    }));
  }

  if (commonImpressRecomm.id) {
    setCommonImpressRecomm((prev: any) => ({
      ...prev,
      text:
        additionalOptions.find((item) => item.id === commonImpressRecomm.id)
          ?.text || "",
    }));
  }
  if (commonImpressRecomm.idRight) {
    setCommonImpressRecomm((prev: any) => ({
      ...prev,
      textRight:
        additionalOptions.find(
          (item) => item.id === commonImpressRecomm.idRight
        )?.text || "",
    }));
  }

  const additionalImpressionRight =
    optionalImpressionRecommendation.selectedImpressionIdRight.length > 0
      ? JSON.parse(optionalImpressionRecommendation.selectedImpressionIdRight)
      : [];

  const additionalRecommendationRight =
    optionalImpressionRecommendation.selectedRecommendationIdRight.length > 0
      ? JSON.parse(
          optionalImpressionRecommendation.selectedRecommendationIdRight
        )
      : [];

  const additionalImpression =
    optionalImpressionRecommendation.selectedImpressionId.length > 0
      ? JSON.parse(optionalImpressionRecommendation.selectedImpressionId)
      : [];

  const additionalRecommendation =
    optionalImpressionRecommendation.selectedRecommendationId.length > 0
      ? JSON.parse(optionalImpressionRecommendation.selectedRecommendationId)
      : [];

  setOptionalImpressionRecommendation((prev: any) => ({
    ...prev,
    // selectedImpressionIdRight: additionalImpressionRight,
    impressionTextRight: additionalImpressionRight
      .map((item: any) => item.text)
      .join("<br/>"),
  }));

  setOptionalImpressionRecommendation((prev: any) => ({
    ...prev,
    // selectedRecommendationIdRight: JSON.stringify(
    //   additionalRecommendationRight
    // ),
    recommendationTextRight: additionalRecommendationRight
      .map((item: any) => item.text)
      .join("<br/>"),
  }));

  setOptionalImpressionRecommendation((prev: any) => ({
    ...prev,
    // selectedImpressionId: JSON.stringify(additionalImpression),
    impressionText: additionalImpression
      .map((item: any) => item.text)
      .join("<br/>"),
  }));

  setOptionalImpressionRecommendation((prev: any) => ({
    ...prev,
    // selectedRecommendationId: JSON.stringify(additionalRecommendation),
    recommendationText: additionalRecommendation
      .map((item: any) => item.text)
      .join("<br/>"),
  }));
}
