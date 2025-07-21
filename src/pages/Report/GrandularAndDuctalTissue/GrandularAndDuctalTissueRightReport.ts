import { ReportQuestion } from "../Report";

interface QuestionIds {
  benignMicroCysts: number;
  benignCapsular: number;
  benignFibronodular: number;
  macroCalcificationsList: number;
  microCalcificationsList: number;
  calcifiedScar: number;
  calcifiedScarList: number;
  ductalProminence: number;
  ductalProminenceList: number;
}

export function generateGrandularAndDuctalTissueReport(
  reportFormData: ReportQuestion[],
  questionIds: QuestionIds
): string {
  const getAnswer = (id: number) =>
    reportFormData.find((q) => q.questionId === id)?.answer || "";

  const benignMicroCysts = getAnswer(questionIds.benignMicroCysts);
  const benignCapsular = getAnswer(questionIds.benignCapsular);
  const benignFibronodular = getAnswer(questionIds.benignFibronodular);

  const macroList = getParsedList(questionIds.macroCalcificationsList);
  const microList = getParsedList(questionIds.microCalcificationsList);
  const calcifiedScar = getAnswer(questionIds.calcifiedScar);
  const scarList = getParsedList(questionIds.calcifiedScarList);
  const ductalProminence = getAnswer(questionIds.ductalProminence);
  const ductalList = getParsedList(questionIds.ductalProminenceList);

  function getParsedList(questionId: number): any[] {
    const raw = getAnswer(questionId);
    try {
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  const clock =
    macroList[0]?.clock ||
    microList[0]?.clock ||
    scarList[0]?.clock ||
    ductalList[0]?.clock ||
    "";
  const level =
    macroList[0]?.level ||
    microList[0]?.level ||
    scarList[0]?.level ||
    ductalList[0]?.level ||
    "";

  // 1. Benign Findings
  const benignFindings: string[] = [];
  if (benignMicroCysts === "Present")
    benignFindings.push("benign microcysts");
  if (benignCapsular === "Present")
    benignFindings.push("benign capsular microcalcification");
  if (benignFibronodular === "Present")
    benignFindings.push("benign fibronodular density");

  const benignText =
    benignFindings.length > 0
      ? `There are multiple ${benignFindings
          .join(", ")
          .toLocaleLowerCase()} noted throughout the breast in ${clock} o'clock in coronal location P${level}. Otherwise, the breast tissue appears normal.`
      : "The breast tissue appears normal without benign findings.";

  // 2. Macrocalcifications
  const macroText = generateCalcificationText(
    macroList,
    "macrocalcification",
    true
  );

  // 3. Microcalcifications
  const microText = generateCalcificationText(
    microList,
    "microcalcification",
    true
  );

  // 4. Calcified Scar
  const scarText =
    calcifiedScar === "Present"
      ? generateCalcificationText(scarList, "calcified scar", false)
      : "";

  // 5. Ductal Prominence
  const ductalText =
    ductalProminence === "Present" && ductalList.length > 0
      ? `There is ductal prominence with ${ductalList
          .map((d) => d.type)
          .join(" and ")
          .toLocaleLowerCase()} noted. ${
          clock && level
            ? `${clock} o'clock in coronal location P${level}.`
            : ""
        }`
      : "";

  return `
    <p><b>Benign Findings</b></p>
    <p>${benignText}</p>
    <p><b>Calcifications</b></p>
    ${macroText}
${microText}
${scarText && `<p><b>Calcified Scar</b></p>${scarText.toLowerCase()}`}
${ductalText && `<p><b>Ductal Prominence</b></p>${ductalText.toLowerCase()}`}
  `;
}

function generateCalcificationText(
  list: any[],
  label: string,
  showDistribution: boolean
): string {
  if (!list.length) return "";

  return list
    .map((item) => {
      if (!item?.type) return "";

      const type = item.type;
      const distribution = item.distribution;
      const clock = item.clock;
      const level = item.level;

      const base = `There is ${type.toLowerCase()} ${label} noted `;
      const distText =
        showDistribution && distribution
          ? `${
              label[0].toUpperCase() + label.slice(1)
            } with ${distribution.toLowerCase()} distribution.`
          : "";
      const location =
        clock && level ? `at ${clock} o'clock in coronal location P${level}.` : "";

      return `<p>${base} ${distText} ${location}</p>`;
    })
    .join("\n");
}
