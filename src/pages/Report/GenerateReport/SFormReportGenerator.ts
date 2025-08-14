import { ResponsePatientForm } from "@/pages/TechnicianPatientIntakeForm/TechnicianPatientIntakeForm";

export function SFormGeneration(
  patientInTakeForm: ResponsePatientForm[]
): string {
  // console.log("SFORM", patientInTakeForm);
  const getPatientAnswer = (id: number) =>
    patientInTakeForm.find((q) => q.questionId === id)?.answer || "";
  let reportText = "";

  const age = getPatientAnswer(5);
  const pregnant = getPatientAnswer(9);
  const ibisScore = getPatientAnswer(14);
  const auriaResult = getPatientAnswer(16);
  const mutationSpecify = getPatientAnswer(20);

  const hormonRT = getPatientAnswer(32);

  const previousSurgery = {
  previousSurgeryYesNo: getPatientAnswer(66),

  mastectomy: getPatientAnswer(67),
  mastectomyPosition: getPatientAnswer(68),
  mastectomyDate: getPatientAnswer(506),

  lumpectomy: getPatientAnswer(69),
  lumpectomyPosition: getPatientAnswer(70),
  lumpectomyDate: getPatientAnswer(507),

  cystAspiration: getPatientAnswer(71),
  cystAspirationPosition: getPatientAnswer(72),
  cystAspirationDate: getPatientAnswer(508),

  breastReconstruction: getPatientAnswer(73),
  breastReconstructionPosition: getPatientAnswer(74),
  breastReconstructionDate: getPatientAnswer(509),

  augmentation: getPatientAnswer(75),
  augmentationPosition: getPatientAnswer(76),
  augmentationDate: getPatientAnswer(510),

  breastSurgeryOthers: getPatientAnswer(77),
  breastSurgeryOthersSpecify: getPatientAnswer(78),
  breastSurgeryOthersSpecifyDirection: getPatientAnswer(489),
  breastSurgeryOthersDate: getPatientAnswer(511),
};

  const previousBiopsy = {
    previousBiopsy: getPatientAnswer(160),
    previousBiopsyDate: getPatientAnswer(161),
    biopsyResults: getPatientAnswer(162),
    // biopsyResultsDetails: getPatientAnswer(163),
    biopsyRight: getPatientAnswer(434),
    biopsyLeft: getPatientAnswer(435),
    biopsyRightType: getPatientAnswer(436),
    biopsyLeftType: getPatientAnswer(437),
  };

  const breastSymptoms = {
    breastCancerSymptoms: getPatientAnswer(87),
    lumpOrThick: getPatientAnswer(88),
    lumpLeft: getPatientAnswer(89),
    lumpRight: getPatientAnswer(90),
    breastPain: getPatientAnswer(106),
    breastPainRight: getPatientAnswer(107),
    breastPainLeft: getPatientAnswer(108),
    nippleDischarge: getPatientAnswer(99),
    nippleRight: getPatientAnswer(100),
    nippleLeft: getPatientAnswer(101),
    nipplePain: getPatientAnswer(111),
    nipplePainRight: getPatientAnswer(112),
    nipplePainLeft: getPatientAnswer(113),
    nipplePosition: getPatientAnswer(104),
    nipplePositionRight: getPatientAnswer(431),
    nipplePositionDetails: getPatientAnswer(105),
    nipplePositionRightDetails: getPatientAnswer(117),
  }

  const getSurgeryText = () => {
  let surgeryText = "";
  const {
    previousSurgeryYesNo,

    mastectomy,
    mastectomyDate,

    lumpectomy,
    lumpectomyDate,

    cystAspiration,
    cystAspirationDate,

    breastReconstruction,
    breastReconstructionDate,

    augmentation,
    augmentationDate,

    breastSurgeryOthers,
    breastSurgeryOthersSpecify,
    breastSurgeryOthersDate,
  } = previousSurgery;

  if (previousSurgeryYesNo === "Yes") {
    const surgeries: string[] = [];

    if (mastectomy === "true") {
      surgeries.push(`mastectomy${mastectomyDate ? ` on ${mastectomyDate}` : ""}`);
    }

    if (lumpectomy === "true") {
      surgeries.push(`lumpectomy${lumpectomyDate ? ` on ${lumpectomyDate}` : ""}`);
    }

    if (cystAspiration === "true") {
      surgeries.push(`cyst aspiration${cystAspirationDate ? ` on ${cystAspirationDate}` : ""}`);
    }

    if (breastReconstruction === "true") {
      surgeries.push(`breast reconstruction${breastReconstructionDate ? ` on ${breastReconstructionDate}` : ""}`);
    }

    if (augmentation === "true") {
      surgeries.push(`augmentation${augmentationDate ? ` on ${augmentationDate}` : ""}`);
    }

    if (breastSurgeryOthers === "true" && breastSurgeryOthersSpecify) {
      surgeries.push(
        `${breastSurgeryOthersSpecify}${breastSurgeryOthersDate ? ` on ${breastSurgeryOthersDate}` : ""}`
      );
    }

    if (surgeries.length > 0) {
      surgeryText = surgeries.join(", ");
    }
  }

  return surgeryText;
};

  function formatClockLabels(input: string): string {
    if (!input.trim()) return "";

    return input
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "")
      .map(Number)
      .filter((n) => !isNaN(n))
      .map((num) => (num === 0 ? "nipple" : `${num}'o Clock`)) // ← added condition
      .join(", ");
  }

  const getSymptomText = () => {
    const {
      lumpOrThick,
      lumpLeft,
      lumpRight,
      breastPain,
      breastPainLeft,
      breastPainRight,
      nippleDischarge,
      nippleLeft,
      nippleRight,
      nipplePain,
      nipplePainLeft,
      nipplePainRight,
    } = breastSymptoms;

    const symptoms: string[] = [];

    // Lump/Thickening
    if (lumpOrThick === "true") {
      const lumpParts: string[] = [];
      if (lumpLeft?.trim()) lumpParts.push(`left at ${formatClockLabels(lumpLeft)}`);
      if (lumpRight?.trim()) lumpParts.push(`right at ${formatClockLabels(lumpRight)}`);
      symptoms.push(`Lump or thickening${lumpParts.length > 0 ? ` in ${lumpParts.join(" and ")}` : ""}`);
    }

    // Pain
    if (breastPain === "true") {
      const painParts: string[] = [];
      if (breastPainLeft?.trim()) painParts.push(`left at ${formatClockLabels(breastPainLeft)}`);
      if (breastPainRight?.trim()) painParts.push(`right at ${formatClockLabels(breastPainRight)}`);
      symptoms.push(`Pain${painParts.length > 0 ? ` in ${painParts.join(" and ")}` : ""}`);
    }

    // Nipple Changes
    if (nipplePain === "true") {
      const sides: string[] = [];
      if (nipplePainLeft === "true") sides.push("left " + (breastSymptoms.nipplePosition.toLocaleLowerCase() === "inverted" ? breastSymptoms.nipplePosition.toLocaleLowerCase() : breastSymptoms.nipplePositionDetails.toLocaleLowerCase()));
      if (nipplePainRight === "true") sides.push("right " + (breastSymptoms.nipplePositionRight.toLocaleLowerCase() === "inverted" ? breastSymptoms.nipplePositionRight.toLocaleLowerCase() : breastSymptoms.nipplePositionRightDetails.toLocaleLowerCase()));
      symptoms.push(
        `Nipple changes${sides.length > 0 ? ` in ${sides.join(" and ")}` : ""}`
      );
    }

    // Nipple Discharge
    if (nippleDischarge === "true") {
      const sides: string[] = [];
      if (nippleLeft === "true") sides.push("left");
      if (nippleRight === "true") sides.push("right");
      symptoms.push(
        `Nipple discharge${sides.length > 0 ? ` in ${sides.join(" and ")}` : ""}`
      );
    }

    return symptoms.length > 0 ? symptoms.join(": ") : "Asymptomatic";
  };


  reportText += `A ${age} year old ${pregnant == "Yes" ? "pregnant / lactating" : ""} woman${ibisScore ? ` with IBIS Tyrer-Cuzic risk score of ${ibisScore}% and ` : ``}${auriaResult.toLocaleLowerCase()}${mutationSpecify ? `AURIA breast cancer test having ${mutationSpecify}` : ""}${hormonRT == "Yes" ? " on hormonal replacement therapy" : ""}${previousSurgery.previousSurgeryYesNo === "Yes" ? ` who underwent ${getSurgeryText()} surgery` : ""}.`

  if (previousBiopsy.previousBiopsy) {
    const isAbnormal = previousBiopsy.biopsyResults === "Yes";
    reportText += `<br/>Biopsy - Result: ${isAbnormal ? "Abnormal" : "Normal"}`;

    if (isAbnormal) {
      reportText += `&nbsp;&nbsp;&nbspLeft: ${previousBiopsy.biopsyLeft === "true"
        ? previousBiopsy.biopsyLeftType
        : "-"
        }&nbsp;&nbsp;&nbspRight: ${previousBiopsy.biopsyRight === "true"
          ? previousBiopsy.biopsyRightType
          : "-"
        }`;
    }

    // reportText += `, `; // Only one trailing break after all
  }


  reportText += `<br/>Symptoms: ${getSymptomText()}<br/>`

  // reportText += `<p><strong>Previous Imaging:</strong></p>`
  if (getPatientAnswer(124) === "Yes") {
    reportText += `<p>Thermogram`
    if (getPatientAnswer(499) === "Known") {
      reportText += ` taken on ${getPatientAnswer(125)}`
    }
    reportText += ` shows ${getPatientAnswer(126).toLowerCase()} results. The report is ${getPatientAnswer(127).toLowerCase()}.</p>`
  }

  if (getPatientAnswer(129) === "Yes") {
    reportText += `<p>Mammogram`
    if (getPatientAnswer(500) === "Known") {
      reportText += ` taken on ${getPatientAnswer(130)}`
    }
    reportText += ` shows ${getPatientAnswer(131).toLowerCase()} results. The report is ${getPatientAnswer(132).toLowerCase()}.</p>`
  }

  function appendImagingReport(
  label: string,
  yesQId: number,
  dateKnownQId: number,
  dateQId: number,
  resultsQId: number,
  reportQId: number,
  getPatientAnswer: (id: number) => string | undefined
) {
  if (getPatientAnswer(yesQId) === "Yes") {
    let text = `<p>${label}`;

    if (getPatientAnswer(dateKnownQId) === "Known") {
      const date = getPatientAnswer(dateQId);
      if (date) text += ` taken on ${date}`;
    }

    const resultsAnswer = getPatientAnswer(resultsQId);
    if (resultsAnswer) {
      if (resultsAnswer.toLowerCase() === "unknown") {
        text += ` results are not known`;
      } else {
        text += ` shows ${resultsAnswer.toLowerCase()} results`;
      }
    }

    const reportStatus = getPatientAnswer(reportQId);
    if (reportStatus) {
      text += `. The report is ${reportStatus.toLowerCase()}`;
    }

    text += `.</p>`;
    return text;
  }
  return "";
}


// Usage
reportText += appendImagingReport("Breast ultrasound / HERscan", 134, 501, 135, 136, 137, getPatientAnswer);
reportText += appendImagingReport("Breast MRI", 139, 502, 140, 141, 142, getPatientAnswer);
reportText += appendImagingReport("PET/CT Scan", 144, 503, 145, 146, 147, getPatientAnswer);
reportText += appendImagingReport("QT Imaging", 149, 504, 150, 151, 152, getPatientAnswer);
reportText += appendImagingReport("Other imaging or scans (like bone scans, scintimammography, etc)", 154, 505, 155, 156, 157, getPatientAnswer);



  return reportText.trim();
}
