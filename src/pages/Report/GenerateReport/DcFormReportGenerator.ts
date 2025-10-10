import { ResponsePatientForm } from "@/pages/TechnicianPatientIntakeForm/TechnicianPatientIntakeForm";

export function DcFormGeneration(
  patientInTakeForm: ResponsePatientForm[]
): string {
  const getPatientAnswer = (id: number) =>
    patientInTakeForm.find((q) => q.questionId === id)?.answer || "";

  let report = [];

  function formatBreastSymptoms(input: string): string {
    if (!input) return "";

    const values = input.split(",").map((v) => v.trim());

    // If only "0"
    if (values.length === 1 && values[0] === "0") {
      return "nipple";
    }

    return values
      .map((val) => {
        if (val === "0") return "nipple";
        return `${val} o'clock`;
      })
      .join(", ");
  }

  function capitalizeFirstLetter(str: string) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // const breastCancerSymptoms = {
  //   breastCancerSymptoms: getPatientAnswer(322),
  //   lumpOrThick: getPatientAnswer(323),
  //   lumpLeft: getPatientAnswer(324),
  //   lumpRight: getPatientAnswer(325),
  //   lumpResult: getPatientAnswer(326),
  //   lumpResultRight: getPatientAnswer(441),
  //   lumpDate: getPatientAnswer(327),
  //   lumpDateRight: getPatientAnswer(442),
  //   lumpSize: getPatientAnswer(328),
  //   lumpSizeRight: getPatientAnswer(443),
  //   skinChanges: getPatientAnswer(329),
  //   skinRight: getPatientAnswer(330),
  //   skinLeft: getPatientAnswer(331),
  //   skinDate: getPatientAnswer(332),
  //   skinDateRight: getPatientAnswer(444),
  //   skinResult: getPatientAnswer(333),
  //   skinResultRight: getPatientAnswer(445),
  //   nippleDischarge: getPatientAnswer(334),
  //   nippleRight: getPatientAnswer(335),
  //   nippleLeft: getPatientAnswer(336),
  //   nippleDate: getPatientAnswer(337),
  //   nippleDateRight: getPatientAnswer(449),
  //   nippleResult: getPatientAnswer(338),
  //   nippleResultRight: getPatientAnswer(450),
  //   breastPain: getPatientAnswer(339),
  //   breastPainRight: getPatientAnswer(340),
  //   breastPainLeft: getPatientAnswer(341),
  //   breastPainDate: getPatientAnswer(342),
  //   breastPainDateRight: getPatientAnswer(439),
  //   breastPainResult: getPatientAnswer(343),
  //   breastPainResultRight: getPatientAnswer(446),
  //   nipplePain: getPatientAnswer(344),
  //   nipplePainRight: getPatientAnswer(345),
  //   nipplePainLeft: getPatientAnswer(346),
  //   nipplePainDate: getPatientAnswer(347),
  //   nipplePainDateRight: getPatientAnswer(451),
  //   nipplePainResult: getPatientAnswer(348),
  //   nipplePainResultRight: getPatientAnswer(452),
  //   lymphNodes: getPatientAnswer(349),
  //   lymphNodesRight: getPatientAnswer(350),
  //   lymphNodesLeft: getPatientAnswer(351),
  //   lymphNodesDate: getPatientAnswer(352),
  //   lymphNodesDateRight: getPatientAnswer(447),
  //   lymphNodesResult: getPatientAnswer(353),
  //   lymphNodesResultRight: getPatientAnswer(448),
  //   others: getPatientAnswer(354),
  //   othersDetails: getPatientAnswer(355),
  //   additionalcomments: getPatientAnswer(523),
  // };

  const cancerhistoy = {
    cancerHistory: getPatientAnswer(356),
    historyPosition: getPatientAnswer(357),
    historyclockposition: getPatientAnswer(524),
    historyclockpositionLeft: getPatientAnswer(541),
    cancerDate: getPatientAnswer(358),
    cancerType: getPatientAnswer(359),
    cancerTreatmentChemotherapy: getPatientAnswer(542),
    cancerTreatmentRadiation: getPatientAnswer(543),
    cancerTreatmentSurgery: getPatientAnswer(544),
    cancerTreatmentCyroablation: getPatientAnswer(545),
    cancerTreatment: getPatientAnswer(360),
    cancerTreatmentOther: getPatientAnswer(526),
    cancerTreatmentdate: getPatientAnswer(525),
    cancerStatus: getPatientAnswer(361),
    cancerFolowupDate: getPatientAnswer(362),
    cancerDateStatus: getPatientAnswer(553),
    cancerTreatmentdateStatus: getPatientAnswer(554),
  };

  const IntervalImagingHistory = {
    noneCheckbox: getPatientAnswer(375),
    mammogramCheckbox: getPatientAnswer(376),
    mammogramDate: getPatientAnswer(377),
    mammogramResult: getPatientAnswer(378),
    ultrasoundCheckbox: getPatientAnswer(379),
    ultrasoundDate: getPatientAnswer(380),
    ultrasoundResult: getPatientAnswer(381),
    mriCheckbox: getPatientAnswer(382),
    mriDate: getPatientAnswer(383),
    mriResult: getPatientAnswer(384),
    otherCheckbox: getPatientAnswer(385),
    otherText: getPatientAnswer(386),
    otherDate: getPatientAnswer(387),
    otherResult: getPatientAnswer(388),
    intervalBiopsy: getPatientAnswer(389),
    intervalBiopsyType: getPatientAnswer(390),
    intervalBiopsyDate: getPatientAnswer(391),
    intervalBiopsyResult: getPatientAnswer(392),
  };

  const ChangesSincePreviousQTImaging = {
    changesFindings: getPatientAnswer(393),
    sizeChange: getPatientAnswer(394),
    currentSize: getPatientAnswer(395),
    currentSizeType: getPatientAnswer(396),
    morphologyChange: getPatientAnswer(397),
    morphologyChangeDetails: getPatientAnswer(398),
    newFindings: getPatientAnswer(399),
    newFindingsDeatils: getPatientAnswer(400),
    changeTreatment: getPatientAnswer(552),
  };

  const categoryId = getPatientAnswer(170);

  const clinicalStatus = getPatientAnswer(547);

  if (categoryId != "4") {
    return ``;
  }

  //Cancer History
  if (cancerhistoy.cancerHistory === "Yes") {
    report.push(
      `History of ${
        cancerhistoy.historyPosition.toLowerCase() === "both"
          ? `${
              cancerhistoy.historyPosition.length > 0
                ? `right breast cancer ${
                    cancerhistoy.historyclockposition.length > 0
                      ? ` ${formatBreastSymptoms(
                          cancerhistoy.historyclockposition
                        )}`
                      : ``
                  }${
                    cancerhistoy.historyclockpositionLeft.length > 0
                      ? `, left breast cancer ${formatBreastSymptoms(
                          cancerhistoy.historyclockpositionLeft
                        )}`
                      : ``
                  }`
                : ""
            }`
          : cancerhistoy.historyPosition.toLowerCase() +
            ` breast cancer ${
              cancerhistoy.historyclockposition.length > 0
                ? ` ${formatBreastSymptoms(cancerhistoy.historyclockposition)}`
                : ``
            }`
      }${
        cancerhistoy.cancerType.length > 0
          ? `, (${cancerhistoy.cancerType})`
          : ""
      }${
        cancerhistoy.cancerDate.length > 0 &&
        cancerhistoy.cancerDateStatus === "Known"
          ? `, diagnosed: ${cancerhistoy.cancerDate}`
          : cancerhistoy.cancerDateStatus === "Unknown"
          ? `, date of diagnose is unknown`
          : ""
      }.`
    );
  }

  let text = [];

  cancerhistoy.cancerTreatmentChemotherapy === "true" &&
    text.push("chemotherapy");
  cancerhistoy.cancerTreatmentRadiation === "true" && text.push("radiation");
  cancerhistoy.cancerTreatmentSurgery === "true" && text.push("surgery");
  cancerhistoy.cancerTreatmentCyroablation === "true" &&
    text.push("cyroablation");
  cancerhistoy.cancerTreatment === "true" &&
    text.push(`${cancerhistoy.cancerTreatmentOther}`);

  //Treatment Recieved
  if (cancerhistoy.cancerTreatmentdateStatus !== "") {
    report.push(
      `${
        text.length > 0
          ? `${capitalizeFirstLetter(text.join(", "))} treatment  was recieved`
          : ""
      }${
        cancerhistoy.cancerTreatmentdateStatus === "Known"
          ? `${
              text.length > 0
                ? `: ${cancerhistoy.cancerTreatmentdate}`
                : `Last date of treatment recevied: ${cancerhistoy.cancerTreatmentdate}`
            }`
          : `${
              text.length > 0
                ? `, date is unknown`
                : `Last date of treatment recevied is unknown`
            }`
      }.`
    );
  }

  //Current Status
  if (cancerhistoy.cancerStatus.length > 0) {
    report.push(`Currently ${cancerhistoy.cancerStatus.toLocaleLowerCase()}.`);
  }

  if (clinicalStatus.length > 0) {
    if (clinicalStatus === "Yes") {
      report.push("Changes in treatment since last QT scan: Present");
    } else if (clinicalStatus === "No") {
      report.push("Changes in treatment since last QT scan: None");
    }
  }

  //IntervalImagingHistory
  let IntervalImagingHistoryData = [];

  if (IntervalImagingHistory.noneCheckbox !== "true") {
    IntervalImagingHistory.mammogramCheckbox === "true" &&
      IntervalImagingHistoryData.push(`mammogram`);
    IntervalImagingHistory.ultrasoundCheckbox === "true" &&
      IntervalImagingHistoryData.push(`ultrasound`);
    IntervalImagingHistory.mriCheckbox === "true" &&
      IntervalImagingHistoryData.push(`MRI`);
    IntervalImagingHistory.otherText.length > 0 &&
      IntervalImagingHistoryData.push(`${IntervalImagingHistory.otherText}`);
  }

  if (IntervalImagingHistoryData.length > 0) {
    report.push(
      `Other breast imaging since last QT scan: ${IntervalImagingHistoryData.join(
        ", "
      )}.`
    );
  }

  //BiopsyResult
  if (IntervalImagingHistory.intervalBiopsy === "Yes") {
    report.push(
      `Interval Biopsy done${
        IntervalImagingHistory.intervalBiopsyResult.length > 0
          ? `, result: ${IntervalImagingHistory.intervalBiopsyResult}`
          : ""
      }${
        IntervalImagingHistory.intervalBiopsyDate.length > 0
          ? `, date: ${IntervalImagingHistory.intervalBiopsyDate}`
          : ""
      }.`
    );
  } else if (IntervalImagingHistory.intervalBiopsy === "No") {
    report.push(`Interval Biopsy not done.`);
  }

  //Changes Since Previous QT Imaging
  let ChangeReport = [];
  if (ChangesSincePreviousQTImaging.changesFindings === "Yes") {
    ChangeReport.push(`Changes in image findings since prior QT: Yes`);
  } else if (ChangesSincePreviousQTImaging.changesFindings === "No") {
    ChangeReport.push(`Changes in image findings since prior QT: No`);
  } else if (ChangesSincePreviousQTImaging.changesFindings === "Unknown") {
    ChangeReport.push(`Changes in image findings since prior QT: Unknown`);
  }
  if (
    ChangesSincePreviousQTImaging.changesFindings === "Yes" &&
    ChangesSincePreviousQTImaging.sizeChange.length > 0 &&
    ChangesSincePreviousQTImaging.sizeChange !== "Unknown"
  ) {
    ChangeReport.push(
      `, Size Change: ${ChangesSincePreviousQTImaging.sizeChange}`
    );
  }

  report.push(ChangeReport.join("") + `${ChangeReport.length > 0 ? "." : ""}`);

  //New Finding
  if (
    ChangesSincePreviousQTImaging.changesFindings === "Yes" &&
    ChangesSincePreviousQTImaging.newFindings.length > 0
  ) {
    report.push(
      `New findings: ${
        ChangesSincePreviousQTImaging.newFindings === "Yes"
          ? `${ChangesSincePreviousQTImaging.newFindingsDeatils}`
          : `${ChangesSincePreviousQTImaging.newFindings}`
      }.`
    );
  }

  //Change Treatment
  if (ChangesSincePreviousQTImaging.changeTreatment.length > 0) {
    report.push(
      `Changes in treatment since prior scan: ${ChangesSincePreviousQTImaging.changeTreatment.toLowerCase()}.`
    );
  }

  return report.join("<br/>");
}
