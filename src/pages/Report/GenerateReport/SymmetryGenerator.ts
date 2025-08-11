import { ReportQuestion } from "../Report";
import { symmetryQuestions } from "../ReportQuestionsAssignment";

export function SymmentryGenerator(reportFormData: ReportQuestion[]): string {
  const getAnswer = (id: number) =>
    reportFormData.find((q) => q.questionId === id)?.answer || "";

  const symmentry = getAnswer(symmetryQuestions.symmetry);
  const side = getAnswer(symmetryQuestions.symmetryLeft);

  let reportsymmentry = `${
    symmentry
      ? `<div><strong>SYMMETRY:</strong></div>The breast examination indicates ${symmentry.toLowerCase()}${
          symmentry !== "Asymmetry" ? `.` : ``
        }`
      : ``
  }`;
  let reportsymmentryside = `${
    side && symmentry === "Asymmetry" ? `, with ${side}.` : ``
  }`;

  let reportText = `${reportsymmentry}${reportsymmentryside}`;

  return reportText;
}
