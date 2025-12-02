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
  const nippleRetraction =
    getAnswer(questionIds.nippleRetraction) === "Present"
      ? "nipple retraction"
      : "no Nipple retraction";
  const nippleDeformity =
    getAnswer(questionIds.nippleDeformity) === "Present"
      ? "nipple deformity"
      : "no Nipple deformity";
  // const subAreolarMass = getAnswer(questionIds.subAreolarMass) === "Present" ? "Subareolar mass" : "no Subareolar mass";
  const architecture = getAnswer(questionIds.architecture);
  const architectureOther = getAnswer(questionIds.architectureOther);

  let result = "";

  // Skin + nipple section
  // if (skinChanges === "Normal") {
  //   result += `The QT scan shows normal skin with ${nippleRetraction.toLowerCase()}. The QT scan shows normal skin with ${nippleDeformity.toLowerCase()}.`;
  // } else {
  const skinText =
    skinChanges === "Other"
      ? skinChangesOther
      : skinChanges.toLocaleLowerCase();
  result += `The QT scan shows ${skinText}${
    skinText === "normal" ? "" : " in the"
  } skin with ${nippleRetraction.toLowerCase()} and ${nippleDeformity.toLowerCase()}.`;
  // }

  // Architecture section
  result += " ";
  if (architecture === "Architectural Distortion") {
    result += `<br/><br/><strong>Vascular and connective tissues: </strong>The architectural distortion observed is attributed to post-operative changes.`;
  } else if (architecture === "Normal") {
    result += `<br/><br/><strong>Vascular and connective tissues: </strong>Penetrating arteries, superficial veins, Cooper’s ligaments, and breast fat distribution show normal architecture.`;
  } else if (architecture === "S/P Mastectomy") {
    result += `<br/><br/><strong>Vascular and connective tissues: </strong>Absent (post mastectomy status).`;
  } else if (architecture.length === 0) {
    result += ``;
  } else {
    result += `<br/><br/><strong>Vascular and connective tissues: </strong>${architectureOther.toLowerCase()} is seen.`;
  }

  return "<strong>Nipple, areola, and skin: </strong>" + result.trim();
}
