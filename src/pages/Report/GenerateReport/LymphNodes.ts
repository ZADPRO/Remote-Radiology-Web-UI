import { ReportQuestion } from "../Report";

interface QuestionIds {
  Intramammaryr: number;
  IntramammaryDatar: number;
  axillarynodes: number;
  ClipsPresentStatus: number;
  ClipsPresentdata: number;
}

export function LymphNodesGenerateString(
  reportFormData: ReportQuestion[],
  questionIds: QuestionIds,
  directionText: string
): string {
  const getAnswer = (id: number) =>
    reportFormData.find((q) => q.questionId === id)?.answer || "";

  let result = "";

  const intramammaryDatar = getAnswer(questionIds.IntramammaryDatar);
  const axillarynodes = getAnswer(questionIds.axillarynodes);
  const clips = getAnswer(questionIds.ClipsPresentStatus);
  const clipsDataRaw = getAnswer(questionIds.ClipsPresentdata);

  function levelState(level: string) {
    if(level == "Axial") {
        return "S"
    }
    else if(level == "Coronal Level") {
        return "p"
    }
    else if(level == "Sagital") {
        return "M"
    }
  };

  // --- Intramammary Nodes
  if (intramammaryDatar) {
    try {
      const intramammaryList = JSON.parse(intramammaryDatar) as {
        position: string;
        level: string;
        levelpercentage?: string;
        locationLevel?: string;
      }[];

      const sentences = intramammaryList.map((entry) =>
        `There is ${entry.locationLevel} intramammary lymph node identified located ${entry.position}'o clock at ${entry.level.toLocaleLowerCase()} ${levelState(entry.level)}-${entry.levelpercentage}.`
      );

      result += sentences.join(" ") + " ";
    } catch (e) {
      console.error("Invalid JSON for IntramammaryDatar", e);
    }
  }

  // --- Axillary Nodes
  result += `The ${directionText.toLowerCase()} axillary nodes appear ${axillarynodes.toLowerCase()}. `;

  // --- Clips
  if (clips.length > 0) {
    try {
      const clipsList = JSON.parse(clipsDataRaw) as {
        position: string;
        level: string;
        levelpercentage?: string;
      }[];

      const clipSentences = clipsList.map((clip) =>
        `Clips are ${clips.toLowerCase()} within the examined breast tissue ${clip.position}'o clock located at ${clip.level} ${levelState(clip.level)}-${clip.levelpercentage}.`
      );

      result += clipSentences.join(" ");
    } catch (e) {
      console.error("Invalid JSON for ClipsPresentdata", e);
    }
  }

  console.log("Eee", clipsDataRaw)

  return result.trim();
}

