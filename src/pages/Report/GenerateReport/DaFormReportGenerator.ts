import { ResponsePatientForm } from "@/pages/TechnicianPatientIntakeForm/TechnicianPatientIntakeForm";
 
interface QuestionConfig {
  label: string;
  answer: string;
  dependsOn?: number;
}
 
interface FormSentenceOptions {
  values: string[];
  otherValue?: string; // What to replace "Other" with
}
 
export function DaFormReportGenerator(
  patientInTakeForm: ResponsePatientForm[]
): string {
 
  function buildReportSentenceWithGetter(
    configs: Record<number, QuestionConfig>,
    getAnswer: (id: number) => string
  ): string {
    const results: string[] = [];
 
    for (const key in configs) {
      const id = Number(key);
      const config = configs[id];
      const ans = getAnswer(id);
 
      if (!config || ans === "") continue;
 
      if (ans === config.answer) {
        if (config.dependsOn) {
          const depVal = getAnswer(config.dependsOn);
          if (depVal && depVal.trim()) {
            results.push(`${config.label} (${depVal.trim()})`);
          }
        } else {
          results.push(config.label);
        }
      }
    }
 
    if (results.length === 0) return "";
 
    if (results.length === 1) return results[0];
 
    return `${results.slice(0, -1).join(", ")} and ${results[results.length - 1]}`;
  }
 
  const formSentenceReplacingOther = ({
    values,
    otherValue,
  }: FormSentenceOptions): string => {
    // Replace "Other" with `otherValue` if provided
    const formattedValues = values
      .map((val) => {
        if (val === "Other" && otherValue) return otherValue.toLowerCase();
        return val;
      })
      .filter((v) => v && v.trim() !== "");
 
    if (formattedValues.length === 0) return "";
 
    if (formattedValues.length === 1) return formattedValues[0].toLowerCase();
 
    if (formattedValues.length === 2)
      return `${formattedValues[0].toLowerCase()} and ${formattedValues[1].toLowerCase()}`;
 
    const allButLast = formattedValues.slice(0, -1).join(", ").toLowerCase();
    const last = formattedValues.at(-1)?.toLowerCase();
    return `${allButLast} and ${last}`;
  };
 
  // console.log("SFORM", patientInTakeForm);
  const getPatientAnswer = (id: number) =>
    patientInTakeForm.find((q) => q.questionId === id)?.answer || "";
 
 
  const typeofabAnswer = {
    208: { label: "Mass/nodule", answer: "true" },
    209: { label: "architectural distortion", answer: "true" },
    210: { label: "calcifications", answer: "true" },
    211: { label: "asymmetry", answer: "true" },
    212: { label: "cyst", answer: "true" },
    213: { label: "fibrocystic changes", answer: "true" },
    214: { label: "mammogram", answer: "true" },
    215: { label: "fibroadenomas", answer: "true" },
    216: { label: "atypical Hyperplasia", answer: "true" },
    217: { label: "Other", answer: "true", dependsOn: 218 },
  };
 
  const methodofdetection = formSentenceReplacingOther({
    values: JSON.parse(getPatientAnswer(206)),
    otherValue: getPatientAnswer(207),
  });
 
  const typeofab = buildReportSentenceWithGetter(typeofabAnswer, getPatientAnswer);
 
  const rightsize = getPatientAnswer(464).toLowerCase() === "known" ? getPatientAnswer(465) + "" + (getPatientAnswer(466) || 'mm') : getPatientAnswer(464).toLowerCase() === "unknown" && "unknown"
 
  const rightQuadrantanswer = {
    454: { label: "upper outer", answer: "true" },
    455: { label: "upper inner", answer: "true" },
    456: { label: "lower outer", answer: "true" },
    457: { label: "lower inner", answer: "true" },
    458: { label: "central/nipple outer", answer: "true" },
    459: { label: "unknown", answer: "true" },
  };
  const leftQuadrantanswer = {
    220: { label: "upper outer", answer: "true" },
    221: { label: "upper inner", answer: "true" },
    222: { label: "lower outer", answer: "true" },
    223: { label: "lower inner", answer: "true" },
    224: { label: "central/nipple outer", answer: "true" },
    225: { label: "unknown", answer: "true" },
  };
 
  const rightQuadrant = buildReportSentenceWithGetter(rightQuadrantanswer, getPatientAnswer);
  const LeftQuadrant = buildReportSentenceWithGetter(leftQuadrantanswer, getPatientAnswer);
  const rightclockpostion = getPatientAnswer(460).toLowerCase() === "known" ? getPatientAnswer(461) + "'o clock" : "unknown"
  const Leftclockpostion = getPatientAnswer(226).toLowerCase() === "known" ? getPatientAnswer(227) + "'o clock" : "unknown"
  const rightdistancefromnipple = getPatientAnswer(462).toLowerCase() === "known" ? getPatientAnswer(463) + "cm" : "unknown"
  const leftdistancefromnipple = getPatientAnswer(228).toLowerCase() === "known" ? getPatientAnswer(229) + "cm" : "unknown"
  const rightbirads = getPatientAnswer(467).toLowerCase() === "other" ? getPatientAnswer(468) : getPatientAnswer(467)
  const leftbirads = getPatientAnswer(233).toLowerCase() === "other" ? getPatientAnswer(234) : getPatientAnswer(233)
 
  const clipmarker = getPatientAnswer(235).toLowerCase() === "yes" ? "clip marker " + getPatientAnswer(236) : "no clip marker"
  const MagneticImplants = getPatientAnswer(237).toLowerCase() === "yes" ? getPatientAnswer(238) : "no"
 
  const leftsize = getPatientAnswer(230).toLowerCase() === "known" ? getPatientAnswer(231) + "" + (getPatientAnswer(232) || 'mm') : getPatientAnswer(230).toLowerCase() === "unknown" && "unknown"
 
 
  //Right Da Form
  let rightForm = `
  ${typeofab} of ${rightsize} detected by ${methodofdetection} in right breast at ${rightQuadrant} in ${rightclockpostion}
  at ${rightdistancefromnipple} from nipple. BIRADS: ${rightbirads}, ${clipmarker} at ${rightQuadrant} in ${rightclockpostion}
  at ${rightdistancefromnipple} from nipple. Magenetic implants: ${MagneticImplants}
  `;
 
  // Left Da Form
  let LeftForm = `<p>
  ${typeofab} of ${leftsize} detected by ${methodofdetection} in left breast at ${LeftQuadrant} in ${Leftclockpostion}
  at ${leftdistancefromnipple} from nipple. BIRADS: ${leftbirads}, ${clipmarker} at ${LeftQuadrant} in ${Leftclockpostion}
  at ${leftdistancefromnipple} from nipple. Magenetic implants: ${MagneticImplants}
  <p/>
  `;
 
  // Final String
  let reportText = `
  ${getPatientAnswer(453) === "true" ? rightForm : ""}
  ${getPatientAnswer(453) === "true" && getPatientAnswer(219) === "true" ? "<br/>" : ""}
  ${getPatientAnswer(219) === "true" ? LeftForm : ""}
`;
 
  //Return Final String
  return reportText;
}