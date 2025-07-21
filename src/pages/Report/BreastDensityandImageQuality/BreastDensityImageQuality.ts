import { ReportQuestion } from "../Report"

interface QuestionIds {
  imageQuality: number;
  breastDensity: number;
  fibroglandularVolume: number;
  symmetry: number;
}

export function generateRightBreastReportText(
  reportFormData: ReportQuestion[],
  questionIds: QuestionIds
): string {
  const getAnswer = (id: number) =>
    reportFormData.find((q) => q.questionId === id)?.answer || "";

  const imageQuality = getAnswer(questionIds.imageQuality);

  if(imageQuality == "") return "";
  const breastDensity = getAnswer(questionIds.breastDensity);
  const fibroglandularVolume = getAnswer(questionIds.fibroglandularVolume);
  const symmetry = getAnswer(questionIds.symmetry);
  // const nippleRetraction = getAnswer(questionIds.nippleRetraction) === "Present"
  //   ? "Nipple retraction"
  //   : "";

  let reportText = `The image quality: ${imageQuality}.\n`;
  reportText += `The breast is ${breastDensity.toLowerCase()} with a fibroglandular ratio of ${fibroglandularVolume.toLowerCase()}% and ${symmetry.toLowerCase()} in symmetrical.\n`;

  // if (nippleRetraction) {
  //   reportText += `${nippleRetraction.toLowerCase()
  // .replace(/\b\w/g, char => char.toUpperCase())} observed.\n`;
  // }

  return reportText.trim();
}