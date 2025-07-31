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
    lumpectomy: getPatientAnswer(69),
    lumpectomyPosition: getPatientAnswer(70),
    cystAspiration: getPatientAnswer(71),
    cystAspirationPosition: getPatientAnswer(72),
    breastReconstruction: getPatientAnswer(73),
    breastReconstructionPosition: getPatientAnswer(74),
    augmentation: getPatientAnswer(75),
    augmentationPosition: getPatientAnswer(76),
    breastSurgeryOthers: getPatientAnswer(77),
    breastSurgeryOthersSpecify: getPatientAnswer(78),
    breastSurgeryOthersSpecifyDirection: getPatientAnswer(489),
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
  }

  const getSurgeryText = () => {
  let surgeryText = "";
  const {
    previousSurgeryYesNo,
    mastectomy,
    lumpectomy,
    cystAspiration,
    breastReconstruction,
    augmentation,
    breastSurgeryOthers,
    breastSurgeryOthersSpecify,
  } = previousSurgery;

  if (previousSurgeryYesNo === "Yes") {
    const surgeries: string[] = [];
    
    if (mastectomy === "true") surgeries.push("mastectomy");
    if (lumpectomy === "true") surgeries.push("lumpectomy");
    if (cystAspiration === "true") surgeries.push("cyst aspiration");
    if (breastReconstruction === "true") surgeries.push("breast reconstruction");
    if (augmentation === "true") surgeries.push("augmentation");
    if (breastSurgeryOthers === "true" && breastSurgeryOthersSpecify)
      surgeries.push(breastSurgeryOthersSpecify);

    if (surgeries.length > 0) {
      surgeryText = surgeries.join(", ");
    }
  }
  console.log(surgeryText);

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
      .map((num) => (num === 0 ? "Nipple" : `${num}'o Clock`)) // ← added condition
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
    symptoms.push(`&nbsp;&nbsp;&nbspLump or thickening${lumpParts.length > 0 ? ` in ${lumpParts.join(" and ")}` : ""}`);
  }

  // Pain
  if (breastPain === "true") {
    const painParts: string[] = [];
    if (breastPainLeft?.trim()) painParts.push(`left at ${formatClockLabels(breastPainLeft)}`);
    if (breastPainRight?.trim()) painParts.push(`right at ${formatClockLabels(breastPainRight)}`);
    symptoms.push(`&nbsp;&nbsp;&nbspPain${painParts.length > 0 ? ` in ${painParts.join(" and ")}` : ""}`);
  }

  // Nipple Changes
    if (nipplePain === "true") {
      const sides: string[] = [];
      if (nipplePainLeft === "true") sides.push("left");
      if (nipplePainRight === "true") sides.push("right");
      symptoms.push(
        `&nbsp;&nbsp;&nbspNipple changes${sides.length > 0 ? ` in ${sides.join(" and ")}` : ""}`
      );
    }

  // Nipple Discharge
  if (nippleDischarge === "true") {
      const sides: string[] = [];
      if (nippleLeft === "true") sides.push("left");
      if (nippleRight === "true") sides.push("right");
      symptoms.push(
        `&nbsp;&nbsp;&nbspNipple discharge${sides.length > 0 ? ` in ${sides.join(" and ")}` : ""}`
      );
    }

  return symptoms.length > 0 ? symptoms.join("<br/>") : "No breast symptoms reported";
};


  reportText += `A ${age} year old ${pregnant == "Yes" ? "pregnant / lactating" : ""} woman with IBIS Tyrer-Cuzic score of ${ibisScore} and ${auriaResult.toLocaleLowerCase()} AURIA breast cancer test${mutationSpecify ? ` having ${mutationSpecify}` : ""}${hormonRT == "Yes" ? "on hormonal replacement therapy" : ""}${previousSurgery.previousSurgeryYesNo == "Yes" ? ` with ${getSurgeryText()} surgery done` : ""}.<br/>`

  if (previousBiopsy.previousBiopsy) {
  const isAbnormal = previousBiopsy.biopsyResults === "Yes";
  reportText += `Biopsy: <br/>Result: ${isAbnormal ? "Abnormal" : "Normal"}`;

  if (isAbnormal) {
    reportText += `<br/>&nbsp;&nbsp;&nbspLeft: ${
      previousBiopsy.biopsyLeft === "true"
        ? previousBiopsy.biopsyLeftType
        : "-"
    }<br/>&nbsp;&nbsp;&nbspRight: ${
      previousBiopsy.biopsyRight === "true"
        ? previousBiopsy.biopsyRightType
        : "-"
    }`;
  }

  reportText += `<br/>`; // Only one trailing break after all
}


  reportText += `Symptoms:</br>${getSymptomText()}`

  return reportText.trim();
}
