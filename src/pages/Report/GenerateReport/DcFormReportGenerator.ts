import { ResponsePatientForm } from "@/pages/TechnicianPatientIntakeForm/TechnicianPatientIntakeForm";

export function DcFormGeneration(patientInTakeForm: ResponsePatientForm[]): string {
  const getAnswer = (questionId: number) =>
    patientInTakeForm.find((q) => q.questionId === questionId)?.answer?.trim() || "";

  let reportText = "";

  const lumpMain = getAnswer(323); // lumpOrThick
  const lumpLeft = getAnswer(324);
  const lumpRight = getAnswer(325);

  const skinMain = getAnswer(329);
  const skinLeft = getAnswer(331);
  const skinRight = getAnswer(330);

  const nippleMain = getAnswer(334);
  const nippleLeft = getAnswer(336);
  const nippleRight = getAnswer(335);

  const painMain = getAnswer(339);
  const painLeft = getAnswer(341);
  const painRight = getAnswer(340);

  const sentenceParts: string[] = [];

  const formatSides = (left: string, right: string) => {
    if (left && right) return `left at ${left} and right at ${right}`;
    if (left) return `left at ${left}`;
    if (right) return `right at ${right}`;
    return "";
  };

  function formatClockLabels(input: string): string {
    if (!input.trim()) return "";
    return input
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "")
      .map(Number)
      .filter((n) => !isNaN(n))
      .map((num) => (num === 0 ? "Nipple" : `${num}'o Clock`))
      .join(", ");
  }

  // Lump or thickening
  if (lumpMain === "true") {
    const lumpText = formatSides(formatClockLabels(lumpLeft), formatClockLabels(lumpRight));
    if (lumpText) sentenceParts.push(`lump or thickening in ${lumpText}`);
  }

  // Skin changes
  if (skinMain === "true") {
    const skinText = formatSides(formatClockLabels(skinLeft), formatClockLabels(skinRight));
    if (skinText) sentenceParts.push(`skin changes in ${skinText}`);
  }

  // Nipple discharge (no clock position)
  if (nippleMain === "true") {
    const left = nippleLeft ? "left" : "";
    const right = nippleRight ? "right" : "";
    const sides = [left, right].filter(Boolean).join(" and ");
    if (sides) sentenceParts.push(`nipple discharge in ${sides} side`);
  }

  // Breast pain
  if (painMain === "true") {
    const painText = formatSides(formatClockLabels(painLeft), formatClockLabels(painRight));
    if (painText) sentenceParts.push(`breast pain in ${painText}`);
  }

  // Add symptom summary
  if (sentenceParts.length > 0) {
    reportText += `Patient states ${sentenceParts.join(", ")}.<br/>`;
  }

  // Cancer History Section
  const cancerMain = getAnswer(356);
  const historyPosition = getAnswer(357); // e.g., "left" or "right"
  const cancerTreatment = getAnswer(360);
  const cancerStatus = getAnswer(361);

  if (cancerMain === "Yes") {
    const type = getAnswer(359); // cancer type
    const treatment = cancerTreatment || "no treatment recorded";
    const status = cancerStatus || "status unknown";

    reportText += `History of ${type} breast cancer on ${historyPosition} side. `;
    reportText += `Treatment: ${treatment}. `;
    reportText += `Current status: ${status}.`;
  }

    const previousQTPurpose = getAnswer(371);
  const previousQTResult = getAnswer(372);
  const previousQTPosRight = getAnswer(373);
  const previousQTPosLeft = getAnswer(438);

 const formattedPrevQTPos = (() => {
  const left = previousQTPosLeft === "1" ? "left" : "";
  const right = previousQTPosRight === "1" ? "right" : "";

  if (left && right) return "Left and Right";
  if (left) return "Left";
  if (right) return "Right";
  return "";
})();


  if (previousQTPurpose || previousQTResult || formattedPrevQTPos) {
    let qtSentence = "<br/>Previous QT Exam Details:";

    if (previousQTPurpose) {
      qtSentence += ` Purpose: ${previousQTPurpose}`;
    }

    if (previousQTResult) {
      qtSentence += `${previousQTPurpose ? "," : ""} Findings: ${previousQTResult}`;
    }

    if (formattedPrevQTPos) {
      qtSentence += `${previousQTPurpose || previousQTResult ? "," : ""} Location: ${formattedPrevQTPos}`;
    }

    reportText += ` ${qtSentence.trim()}`;
  }

  const previousImaging = getAnswer(393);
const sizeChange = getAnswer(394);
const currentSize = getAnswer(395);
const currentSizeType = getAnswer(396);
const morphologyChange = getAnswer(397);
const morphologyChangeDetails = getAnswer(398);
const newFindings = getAnswer(399);
const newFindingsDetails = getAnswer(400);

let previousImagingText = "";
if (previousImaging?.toLowerCase() === "known") {
  previousImagingText = "Changes Since Previous QT Imaging";
} else if (previousImaging?.toLowerCase() === "unknown") {
  previousImagingText = "Changes Since Previous QT Imaging: Unknown";
}

// Build size change text
let sizeChangeText = "";
if (sizeChange && sizeChange !== "Unknown") {
  sizeChangeText = `<br/>&nbsp;&nbsp;&nbspSize change: ${sizeChange}`;
}

// Build current size text
let currentSizeText = "";
if (currentSize && currentSizeType) {
  currentSizeText = `<br/>&nbsp;&nbsp;&nbspCurrent size (if known): ${currentSize} ${currentSizeType}`;
}

// Build morphology change text
let morphologyText = "";
if (morphologyChange) {
  morphologyText = `<br/>&nbsp;&nbsp;&nbsp;Morphology change: ${morphologyChange}`;
  if (morphologyChange !== "No" && morphologyChange !== "Unknown" && morphologyChangeDetails) {
    morphologyText += ` - ${morphologyChangeDetails}`;
  }
}

let newFindingsText = "";
if (newFindings) {
  newFindingsText = `<br/>&nbsp;&nbsp;&nbsp;New findings: ${newFindings}`;
  if (newFindings !== "No" && newFindings !== "Unknown" && newFindingsDetails) {
    newFindingsText += ` - ${newFindingsDetails}`;
  }
}

let fullImagingText = [previousImagingText, sizeChangeText, currentSizeText, morphologyText, newFindingsText]
  .filter(Boolean)
  .join("\n");

// Append to reportText
reportText += `<br/>${fullImagingText}\n`;

  
  return reportText.trim();
}
