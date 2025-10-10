import { ReportQuestion } from "../Report";

interface QuestionIds {
  imageQuality: number;
  artifactsPresent: number;
  breastDensity: number;
  fibroglandularVolume: number;
  symmetry: number;
}

export function generateRightBreastReportText(
  reportFormData: ReportQuestion[],
  questionIds: QuestionIds,
  side: string
): string {
  const getAnswer = (id: number) =>
    reportFormData.find((q) => q.questionId === id)?.answer || "";

  const imageQuality = getAnswer(questionIds.imageQuality);

  if (imageQuality == "") return "";
  const breastDensity = getAnswer(questionIds.breastDensity);
  const fibroglandularVolume = getAnswer(questionIds.fibroglandularVolume);
  const symmetry = getAnswer(questionIds.symmetry);
  const artifactsPresent = getAnswer(questionIds.artifactsPresent);
  // const nippleRetraction = getAnswer(questionIds.nippleRetraction) === "Present"
  //   ? "Nipple retraction"
  //   : "";
  let reportText = "";

  const imageQualityText = () => {
    if (imageQuality == "Suboptimal") return "suboptimal";
    else if (imageQuality == "Acceptable") return "acceptable";
    else return "";
  };

  reportText += `<strong>Density: </strong>The ${side.toLocaleLowerCase()} breast tissue ${
    breastDensity === "S/P Mastectomy"
      ? `has no fibroglandular parenchyma (post mastectomy status)`
      : `is ${
          breastDensity.toLowerCase() ? `${breastDensity.toLowerCase()} ` : ``
        }${
          fibroglandularVolume.toLowerCase()
            ? ` with a fibroglandular ratio of  ${fibroglandularVolume.toLowerCase()}%`
            : ""
        }${
          symmetry.toLowerCase() !== "symmetry"
            ? ` and shows ${symmetry.toLowerCase()}`
            : ""
        }`
  }.\n`;
  reportText += `<br/><br/><strong>Image quality: </strong>The image quality is ${imageQualityText().toLowerCase()}${
    artifactsPresent == "Yes" ? " with artifacts present" : ""
  }.\n`;

  // if (nippleRetraction) {
  //   reportText += `${nippleRetraction.toLowerCase()
  // .replace(/\b\w/g, char => char.toUpperCase())} observed.\n`;
  // }

  return reportText.trim();
}
