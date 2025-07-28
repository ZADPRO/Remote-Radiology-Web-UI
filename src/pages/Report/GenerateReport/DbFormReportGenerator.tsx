import { ResponsePatientForm } from "@/pages/TechnicianPatientIntakeForm/TechnicianPatientIntakeForm";
 
interface QuestionConfig {
    label: string;
    answer: string;
    dependsOn?: number;
}
 
interface QuestionConfigVal {
    label: string;
    answer: string;
    dependsOn?: number;
    anotherdependsOn?: number;
    mainQid: number;
}
 
 
export function DbFormReportGenerator(
    patientInTakeForm: ResponsePatientForm[]
): string {
 
    const getPatientAnswer = (id: number) =>
        patientInTakeForm.find((q) => q.questionId === id)?.answer || "";
 
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
                        results.push(`${config.label} (${depVal.trim().toLowerCase()})`);
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
 
    function buildReportSentenceWithGetterVal(
        configs: Record<number, QuestionConfigVal>,
        getAnswer: (id: number) => string
    ): string {
        const groupedByMainQid: Record<number, string[]> = {};
 
        for (const key in configs) {
            const id = Number(key);
            const config = configs[id];
            const ans = getAnswer(id);
 
            if (!config || ans !== config.answer) continue;
 
            const mainQid = config.mainQid ?? id;
 
            let labelText = config.label;
 
            if (config.dependsOn) {
                const depVal = getAnswer(config.dependsOn);
                if (!depVal?.trim()) continue;
                labelText += ` (${depVal.trim()} ${config.anotherdependsOn ? `, ${getAnswer(config.anotherdependsOn)}` : ``})`;
            }
 
            labelText += ` (done)`;
 
            groupedByMainQid[mainQid] ||= [];
            groupedByMainQid[mainQid].push(labelText);
        }
 
        const finalSentences: string[] = [];
 
        for (const mainQid in groupedByMainQid) {
            const labels = groupedByMainQid[mainQid];
 
            if (labels.length === 1) {
                finalSentences.push(labels[0].toLowerCase());
            } else {
                const sentence = `${labels.slice(0, -1).join(", ")} and ${labels.at(-1)}`;
                finalSentences.push(sentence.toLowerCase());
            }
        }
 
        return finalSentences.join(", ");
    }
 
 
    const rightQuadrantanswer = {
        470: { label: "upper outer", answer: "true" },
        471: { label: "upper inner", answer: "true" },
        472: { label: "lower outer", answer: "true" },
        473: { label: "lower inner", answer: "true" },
        474: { label: "central/nipple outer", answer: "true" },
        475: { label: "unknown", answer: "true" },
    };
    const leftQuadrantanswer = {
        261: { label: "upper outer", answer: "true" },
        262: { label: "upper inner", answer: "true" },
        263: { label: "lower outer", answer: "true" },
        264: { label: "lower inner", answer: "true" },
        265: { label: "central/nipple outer", answer: "true" },
        266: { label: "unknown", answer: "true" },
    };
 
    const rightQuadrant = buildReportSentenceWithGetter(rightQuadrantanswer, getPatientAnswer);
    const LeftQuadrant = buildReportSentenceWithGetter(leftQuadrantanswer, getPatientAnswer);
    const rightclockpostion = getPatientAnswer(476).toLowerCase() === "known" ? getPatientAnswer(477) + "'o clock" : "unknown"
    const Leftclockpostion = getPatientAnswer(268).toLowerCase() === "known" ? getPatientAnswer(267) + "'o clock" : "unknown"
    const rightdistancefromnipple = getPatientAnswer(478).toLowerCase() === "known" ? getPatientAnswer(479) + "cm" : "unknown"
    const leftdistancefromnipple = getPatientAnswer(269).toLowerCase() === "known" ? getPatientAnswer(270) + "cm" : "unknown"
    const rightlymphnode = `with ${getPatientAnswer(481)} lymph node ${(getPatientAnswer(480) === "Yes" && getPatientAnswer(483) === "Yes") && "involvement"}`;
    const rightmetastasis = `with metastasis in ${getPatientAnswer(484)}`;
    const leftlymphnode = `with ${getPatientAnswer(272)} lymph node ${(getPatientAnswer(271) === "Yes" && getPatientAnswer(273) === "Yes") && "involvement"}`;
    const lefttmetastasis = `with metastasis in ${getPatientAnswer(274)}`;
 
    //Right Form
    const rightForm = `
    <p>
    Diagnosis of ${getPatientAnswer(255).toLowerCase() === "other" ? getPatientAnswer(256) : getPatientAnswer(255).toLowerCase()}
    ${getPatientAnswer(257).toLowerCase() === "unknown" ? "unknown" : getPatientAnswer(257)} grade
    ${getPatientAnswer(258).toLowerCase() === "unknown" ? "unknown" : getPatientAnswer(258)} stage of
    ${getPatientAnswer(259)}cm size at right breast at ${rightQuadrant} quadrant at ${rightclockpostion} position
    ${rightdistancefromnipple} from nipple ${rightlymphnode} ${rightmetastasis}
    </p>
    `;
 
    //Left Form
    const leftForm = `
    <p>
    Diagnosis of ${getPatientAnswer(255).toLowerCase() === "other" ? getPatientAnswer(256) : getPatientAnswer(255).toLowerCase()}
    ${getPatientAnswer(257).toLowerCase() === "unknown" ? "unknown" : getPatientAnswer(257)} grade
    ${getPatientAnswer(258).toLowerCase() === "unknown" ? "unknown" : getPatientAnswer(258)} stage of
    ${getPatientAnswer(259)}cm size at left breast at ${LeftQuadrant} quadrant at ${Leftclockpostion} position
    ${leftdistancefromnipple} from nipple ${leftlymphnode} ${lefttmetastasis}
    </p>
    `
 
    //Receptor status
    const receptorstatus = `
    <p>Receptor Status:</p>
    ${getPatientAnswer(276) === "Positive" ? `<p>Estrogen Receptor (ER): ${getPatientAnswer(277)}%</p>` : ``}
    ${getPatientAnswer(278) === "Positive" ? `<p>Progesterone Receptor (PR): ${getPatientAnswer(279)}%</p>` : ``}
    ${getPatientAnswer(280) === "Positive" ? `<p>HER2/neu: ${getPatientAnswer(281)}%</p>` : ``}
    ${getPatientAnswer(282) === "Known" ? `<p>Ki-67: ${getPatientAnswer(420)}%</p>` : ``}
    ${getPatientAnswer(421) === "Yes" ? `<p>Oncotype DX or other genomic testing: ${getPatientAnswer(422)}%</p>` : ``}
    `
 
    const surgeryAnswer = {
        285: { label: "lumpectomy/breast-conserving surgery", answer: "true", mainQid: 284 },
        286: { label: "was the surgery successful in removing all of the tumor?", answer: "true", dependsOn: 287, mainQid: 284 },
        288: { label: "mastectomy (partial or segmental)", answer: "true", mainQid: 284 },
        289: { label: "bilateral mastectomy", answer: "true", mainQid: 284 },
        290: { label: "sentinel lymph node biopsy", answer: "true", mainQid: 284 },
        291: { label: "axillary lymph node dissection", answer: "true", mainQid: 284 },
        292: { label: "reconstruction", answer: "true", dependsOn: 293, mainQid: 284 },
    };
 
    const surgery = buildReportSentenceWithGetterVal(surgeryAnswer, getPatientAnswer) + ",";
 
    const NeoadjuvantAnswer = {
        297: { label: "chemotherapy (e.g., taxol, adriamycin, herceptin)", answer: "true", mainQid: 296 },
        298: { label: "hormonal therapy herceptin (for HER2-positive cancers), tamoxifen, aromatase inhibitors (e.g., anastrozole), or others", answer: "true", mainQid: 296 },
        299: { label: "if yes, for how long and what was the outcome of the treatment?", answer: "true", dependsOn: 300, anotherdependsOn: 301, mainQid: 296 },
        302: { label: "bilateral mastectomy", answer: "true", mainQid: 296 },
        303: { label: "sentinel lymph node biopsy", answer: "true", mainQid: 296 },
        304: { label: "axillary lymph node dissection", answer: "true", mainQid: 296 },
        305: { label: "reconstruction", answer: "true", dependsOn: 293, mainQid: 296 },
    };
 
    const Neoadjuvant = buildReportSentenceWithGetterVal(NeoadjuvantAnswer, getPatientAnswer) + ",";
 
    const adjuvantAnswer = {
        307: { label: "chemotherapy", answer: "true", mainQid: 306 },
        308: { label: "hormonal therapy", answer: "true", mainQid: 306 },
        309: { label: "targeted therapy", answer: "true", mainQid: 306 },
        310: { label: "immunotherapy", answer: "true", mainQid: 306 },
        311: { label: "radiation therapy", answer: "true", mainQid: 306 },
    };
 
    const adjuvant = buildReportSentenceWithGetterVal(adjuvantAnswer, getPatientAnswer);
 
    //Procedure
    const Procedure = `
    <br/>
    <p>
    Procedure ${surgery}
    ${Neoadjuvant}
    ${adjuvant}
    </p>
    `
 
    // Final Report
    let reportText = `
  ${getPatientAnswer(469) === "true" ? rightForm : ""}
  ${(getPatientAnswer(469) === "true" && getPatientAnswer(260) === "true") ? "<br/>" : ""}
  ${getPatientAnswer(260) === "true" ? leftForm : ""}
  <br/><p>Diagnosed on ${getPatientAnswer(254)}</p>
  ${getPatientAnswer(275) === "Yes" ? "<br/>" + receptorstatus : ""}
  ${getPatientAnswer(284) === "Not Applicable" &&
            getPatientAnswer(296) === "Not Applicable" &&
            getPatientAnswer(306) === "Not Applicable"
            ? ""
            : Procedure
        }
`;
 
 
    return reportText;
}