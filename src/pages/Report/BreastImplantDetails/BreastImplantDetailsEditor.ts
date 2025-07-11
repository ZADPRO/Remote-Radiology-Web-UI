import { ReportQuestion } from "../Report";

interface QuestionIds {
  breastImplants: number;
  implantConfiguration: number;
  implantPositon: number;
  implantMaterial: number;
  displacement: number;
  contracture: number;
  contractureSev: number;
  contractureSide: number;
  rupture: number;
  ruptureLocation: number;
  ruptureSigns: number;
  ruptureSignsOther: number;
  ruptureType: number;
}

export function generateBreastImplantDetailsHTML(
  reportFormData: ReportQuestion[],
  questionIds: QuestionIds
): string {
  const getAnswer = (id: number) =>
    reportFormData.find((q) => q.questionId === id)?.answer || "";

  const breastImplants = getAnswer(questionIds.breastImplants);

  if (breastImplants == "") return "";
  if (breastImplants === "Absent") {
    return `<span>Absent: The QT scan shows no breast implants.</span>`;
  }

  const config = getAnswer(questionIds.implantConfiguration);
  const position = getAnswer(questionIds.implantPositon);
  const material = getAnswer(questionIds.implantMaterial);
  const displacement = getAnswer(questionIds.displacement);
  const contracture = getAnswer(questionIds.contracture);
  // const contractureSev = getAnswer(questionIds.contractureSev);
  // const contractureSide = getAnswer(questionIds.contractureSide);
  const rupture = getAnswer(questionIds.rupture);
  const ruptureLocation = getAnswer(questionIds.ruptureLocation);
  // const ruptureSigns = getAnswer(questionIds.ruptureSigns);
  // const ruptureSignsOther = getAnswer(questionIds.ruptureSignsOther);
  const ruptureType = getAnswer(questionIds.ruptureType);

  let html = `<span>Present: The QT scan shows ${config.toLowerCase()}</span>`;

  if (["Bilateral Similar", "Bilateral Dissimilar"].includes(config)) {
    html += ` implants`;
  }else{
     html += ` implant`;
  }

  html += ` with ${position.toLowerCase()} in position, with speed of sound consistent with ${material.toLowerCase()}. `;

  if (displacement.length > 0) {
    if (displacement !== "None") {
      html += `The displacement is noted in ${
        displacement === "both" ? "both sides" : `${displacement.toLowerCase()} side`
      }. `;
    } else {
      html += `The displacement is not noted. `;
    }
  }

  if (contracture !== "None") {
    html += `There is a ${contracture.toLowerCase()} contracture noted. `;
  }

  if (rupture === "Present") {
    html += `There is a rupture in ${ruptureLocation.toLowerCase()} of ${ruptureType.toLowerCase()} type.`;
  }

  html += `</span>`;

  return html;
}
