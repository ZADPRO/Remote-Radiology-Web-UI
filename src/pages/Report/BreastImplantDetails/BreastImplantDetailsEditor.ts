import { ReportQuestion } from "../Report";

interface QuestionIds {
  breastImplants: number;
  implantConfiguration: number;
  implantPositon: number;
  implantMaterial: number;
  implantMaterialOther: number;
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
    return ``;
  }

  const config = getAnswer(questionIds.implantConfiguration);
  const position = getAnswer(questionIds.implantPositon);
  const material = getAnswer(questionIds.implantMaterial);
  const materialOther = getAnswer(questionIds.implantMaterialOther);
  const displacement = getAnswer(questionIds.displacement);
  const contracture = getAnswer(questionIds.contracture);
  const contractureSev = getAnswer(questionIds.contractureSev);
  // const contractureSide = getAnswer(questionIds.contractureSide);
  const rupture = getAnswer(questionIds.rupture);
  const ruptureLocation = getAnswer(questionIds.ruptureLocation);
  // const ruptureSigns = getAnswer(questionIds.ruptureSigns);
  // const ruptureSignsOther = getAnswer(questionIds.ruptureSignsOther);
  const ruptureType = getAnswer(questionIds.ruptureType);

  let html = `<span>The QT scan shows ${config.toLowerCase()}</span>`;

  if (["Bilateral Similar", "Bilateral Dissimilar"].includes(config)) {
    html += ` implants`;
  }else{
     html += ` implant`;
  }

  html += ` which are ${position.toLowerCase()} in position, with speed of sound consistent with ${material == "Other"? `${materialOther}` : material.toLowerCase()}. `;

  if (displacement.length > 0) {
    if (displacement !== "None") {
      html += `The displacement is noted in ${
        displacement === "Both" ? "both sides" : `${displacement.toLowerCase()} side`
      }. `;
    } 
  }

  if (contracture !== "None") {
    html += `There is ${contractureSev ? contractureSev.toLocaleLowerCase()+" " : ""} contracture noted 
    on ${contracture.toLowerCase() == "both" ? `${contracture.toLowerCase()} sides` : `the ${contracture.toLowerCase()} side`}.`;
  }

  if (rupture === "Present") {
    html += `There is rupture in ${ruptureLocation.toLowerCase()} of ${ruptureType.toLowerCase()} type.`;
  }

  html += `</span>`;

  return html;
}
