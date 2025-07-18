import { ResponsePatientForm } from "@/pages/TechnicianPatientIntakeForm/TechnicianPatientIntakeForm";

export function SFormGeneration(
  patientInTakeForm: ResponsePatientForm[]
): string {
    console.log("SFORM", patientInTakeForm);
  const getPatientAnswer = (id: number) =>
    patientInTakeForm.find((q) => q.questionId === id)?.answer || "";
  let reportText = "";

  console.log(getPatientAnswer(5))
  return reportText;
}
