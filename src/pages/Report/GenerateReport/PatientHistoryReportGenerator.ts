// import { ResponsePatientForm } from "@/pages/TechnicianPatientIntakeForm/TechnicianPatientIntakeForm";
import { SFormGeneration } from "./SFormReportGenerator";
import { DbFormReportGenerator } from "./DbFormReportGenerator";
import { DcFormGeneration } from "./DcFormReportGenerator";
import { DaFormReportGenerator } from "./DaFormReportGenerator";
import { TechNotes } from "./TechNotes";

export function PatientHistoryReportGenerator(
  // patientInTakeForm: ResponsePatientForm[]
  patientInTakeForm: any[],
  technicianFormData: any[]
): string {
  let report = [];

  let SForm = SFormGeneration(patientInTakeForm);

  if (SForm.length > 0) {
    report.push(SForm);
  }

  let DaForm = DaFormReportGenerator(patientInTakeForm);

  if (DaForm.length > 0) {
    report.push(DaForm);
  }

  let DbForm = DbFormReportGenerator(patientInTakeForm);
  if (DbForm.length > 0) {
    report.push(DbForm);
  }

  let DcForm = DcFormGeneration(patientInTakeForm);
  if (DcForm.length > 0) {
    report.push(DcForm);
  }

  let TechNotesData = TechNotes(technicianFormData);
  if(TechNotes.length > 0){
    report.push(TechNotesData);
  }

  if (report.length > 0) {
    return report.join("");
  } else {
    return "";
  }
}
