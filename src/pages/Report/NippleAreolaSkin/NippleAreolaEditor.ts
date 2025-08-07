import { ReportQuestion } from "../Report";

interface QuestionIds {
  skinChanges: number;
  skinChangesOther: number;
  nippleDeformity: number;
  nippleRetraction: number;
  subAreolarMass: number;
  architecture: number;
  architectureOther: number;
}

export function generateNippleAreolaBreastEditor(
  reportFormData: ReportQuestion[],
  questionIds: QuestionIds
): string {
  const getAnswer = (id: number) =>
    reportFormData.find((q) => q.questionId === id)?.answer || "";

  const skinChanges = getAnswer(questionIds.skinChanges);
  const skinChangesOther = getAnswer(questionIds.skinChangesOther);
  const nippleRetraction = getAnswer(questionIds.nippleRetraction) === "Present" ? "nipple retraction" : "no Nipple retraction";
  const nippleDeformity = getAnswer(questionIds.nippleDeformity) === "Present" ? "nipple deformity" : "no Nipple deformity";
  // const subAreolarMass = getAnswer(questionIds.subAreolarMass) === "Present" ? "Subareolar mass" : "no Subareolar mass";
  const architecture = getAnswer(questionIds.architecture);
  const architectureOther = getAnswer(questionIds.architectureOther);

  
  let result = "";

  // Skin + nipple section
  if (skinChanges === "Normal") {
    result += `The QT scan shows normal skin with ${nippleRetraction.toLowerCase()}. The QT scan shows normal skin with ${nippleDeformity.toLowerCase()}.`;
  } else {
    const skinText = skinChanges === "Other" ? skinChangesOther : skinChanges.toLocaleLowerCase();
    result += `The QT scan shows ${skinText} in skin with ${nippleRetraction.toLowerCase()}, ${nippleDeformity.toLowerCase()}.`;
  }

  // Architecture section
  result += " ";
  if (architecture === "Architectural Distortion") {
    result += `The architectural distortion observed is attributed to post-operative or post-procedural changes.`;
  } else if (architecture === "Normal") {
    result += `The architectural is normal.`;
  } else {
    result += `The architectural distortion observed is attributed to post-operative or post-procedural changes is ${architectureOther.toLowerCase()}.`;
  }

  return result.trim();
}