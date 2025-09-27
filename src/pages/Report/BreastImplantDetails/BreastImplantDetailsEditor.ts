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
  bilateraldissimilar: number;
  superior: number;
  inferior: number;
  lateral: number;
  medial: number;
  superiorRight: number;
  inferiorRight: number;
  lateralRight: number;
  medialRight: number;
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

  function buildDisplacementSentence(
    displacement: string,
    questionIds: QuestionIds
  ): string {
    const formatDirections = (dirs: string[]) => {
      if (dirs.length === 0) return "";
      if (dirs.length === 1) return dirs[0];
      return dirs.slice(0, -1).join(", ") + " and " + dirs.slice(-1);
    };

    const getSideDirections = (side: "Left" | "Right") => {
      const directions: string[] = [];

      if (side === "Left") {
        if (getAnswer(questionIds.superior) === "true")
          directions.push("superior");
        if (getAnswer(questionIds.inferior) === "true")
          directions.push("inferior");
        if (getAnswer(questionIds.lateral) === "true")
          directions.push("lateral");
        if (getAnswer(questionIds.medial) === "true") directions.push("medial");
      }

      if (side === "Right") {
        if (getAnswer(questionIds.superiorRight) === "true")
          directions.push("superior");
        if (getAnswer(questionIds.inferiorRight) === "true")
          directions.push("inferior");
        if (getAnswer(questionIds.lateralRight) === "true")
          directions.push("lateral");
        if (getAnswer(questionIds.medialRight) === "true")
          directions.push("medial");
      }

      return directions;
    };

    if (!displacement || displacement === "None") return "";

    if (displacement === "Both") {
      const leftDirs = getSideDirections("Left");
      const rightDirs = getSideDirections("Right");

      return `There is displacement noted in the left side${
        leftDirs.length ? ", " + formatDirections(leftDirs) : ""
      }, and in the right side${
        rightDirs.length ? ", " + formatDirections(rightDirs) : ""
      }. `;
    }

    const sideDirs = getSideDirections(displacement as "Left" | "Right");
    return `There is displacement noted in the ${displacement.toLowerCase()} side${
      sideDirs.length ? ", " + formatDirections(sideDirs) : ""
    }. `;
  }

  let html = `<span>The QT scan shows ${config.toLowerCase()}</span>`;

  if (["Bilateral Similar", "Bilateral Dissimilar"].includes(config)) {
    html += ` implants `;
  } else {
    html += ` implant `;
  }

  html += `which are ${position.toLowerCase()} in position, with speed of sound consistent with ${
    config === "Bilateral Dissimilar" || config === "Bilateral Similar"
      ? ` ${getAnswer(questionIds.bilateraldissimilar)}`
      : `${material == "Other" ? `${materialOther}` : material.toLowerCase()}`
  }. `;

  if (displacement.length > 0) {
    if (displacement !== "None") {
      // html += `The displacement is noted in ${
      //   displacement === "Both"
      //     ? "both sides"
      //     : `${displacement.toLowerCase()} side`
      // }. `;
      html += buildDisplacementSentence(displacement, questionIds);
    }
  }

  if (contracture !== "None") {
    html += `There is ${
      contractureSev ? contractureSev.toLocaleLowerCase() + " " : ""
    } contracture noted 
    on ${
      contracture.toLowerCase() == "both"
        ? `${contracture.toLowerCase()} sides`
        : `the ${contracture.toLowerCase()} side`
    }.`;
  }

  if (rupture === "Present") {
    html += `There is rupture in ${ruptureLocation.toLowerCase()} of ${ruptureType.toLowerCase()} type.`;
  }

  html += `</span>`;

  return html;
}
