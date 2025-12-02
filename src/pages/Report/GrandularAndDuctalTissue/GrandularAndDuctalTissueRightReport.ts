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
  grandularAndDuctalTissue: number;
  calcificationsPresent: number;
}

export function generateGrandularAndDuctalTissueReport(
  reportFormData: ReportQuestion[],
  questionIds: QuestionIds
): string {
  const getAnswer = (id: number) =>
    reportFormData.find((q) => q.questionId === id)?.answer || "";

  // const glandularandductal = getAnswer(questionIds.grandularAndDuctalTissue);

  const grandularAndDuctalTissue = getAnswer(
    questionIds.grandularAndDuctalTissue
  );
  const benignMicroCysts = getAnswer(questionIds.benignMicroCysts);
  const benignCapsular = getAnswer(questionIds.benignCapsular);
  const benignFibronodular = getAnswer(questionIds.benignFibronodular);
  const calcificationsPresent = getAnswer(questionIds.calcificationsPresent);
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

  // const clock =
  //   macroList[0]?.clock ||
  //   microList[0]?.clock ||
  //   scarList[0]?.clock ||
  //   ductalList[0]?.clock ||
  //   "";
  const level =
    macroList[0]?.level ||
    microList[0]?.level ||
    scarList[0]?.level ||
    ductalList[0]?.level ||
    "";

  //glandularandductal
  // const glandularandductaltext =
  //   glandularandductal === "Normal"
  //     ? "<p>Penetrating arteries, superficial veins and Cooper’s ligaments and breast fat distribution show normal architecture.</p>"
  //     : "";

  let benignText = "";
  // 1. Benign Findings
  // const benignFindings: string[] = [];
  if (benignMicroCysts === "Present")
    benignText += `There are multiple benign microcysts throughout the breast.`;
  if (benignCapsular === "Present")
    benignText += `${
      benignText.length > 0 ? " " : ""
    }There are multiple benign-appearing capsular microcalcifications.`;
  if (benignFibronodular === "Present")
    benignText += `${
      benignText.length > 0 ? " " : ""
    }There are multiple benign-appearing fibronodular densities in the breast.`;

  // benignFindings.map((data) => {
  //   benignText +=
  //     benignFindings.length > 0
  //       ? `There are multiple ${data} throughout the breast.`
  //       : "";
  // });

  // const benignText =
  //   benignFindings.length > 0
  //     ? `There are multiple ${benignFindings} throughout the breast.`
  //     : "";

  // 2. Macrocalcifications
  const macroText =
    macroList.length > 0
      ? generateCalcificationText(macroList, "macrocalcifications", true)
      : "";

  // 3. Microcalcifications
  const microText =
    microList.length > 0
      ? generateCalcificationText(microList, "microcalcifications", true)
      : "";

  // 4. Calcified Scar
  const scarText =
    calcifiedScar === "Present"
      ? generateCalcificationText(scarList, "calcified scar", false)
      : "";

  let ductalText = "";

  // 5. Ductal Prominence
  ductalList.map((data,index) => {
    ductalText +=
      ductalProminence === "Present" && ductalList.length > 0
        ? `${index === 0 ? '': " "}There is a ductal prominence ${data.type.toLowerCase()} ${
            data.clock
              ? ` noted at ${
                  data.clock === "0"
                    ? `retroareolar region`
                    : `${data.clock} o'clock`
                }`
              : ""
          }${
            data.position !== "Unknown" && data.position
              ? ` in the ${data.position.toLowerCase()}${
                  data.position
                    ? ` ${
                        data.position === "Coronal Level"
                          ? "P"
                          : data.position === "Axial"
                          ? "S"
                          : data.position === "Sagittal" && "M/L"
                      }${level}`
                    : ""
                }`
              : ""
          }.`
        : "";
  });

  if (
    benignMicroCysts === "Present" ||
    benignCapsular === "Present" ||
    benignFibronodular === "Present" ||
    ductalProminence === "Present" ||
    calcificationsPresent === "Present" ||
    calcifiedScar === "Present"
  ) {
    return `
    ${
      grandularAndDuctalTissue === "Present"
        ? `<p>Absent (post mastectomy status).</p><br/>`
        : ""
    }
    ${
      benignText.length > 0 &&
      (benignMicroCysts === "Present" ||
        benignCapsular === "Present" ||
        benignFibronodular === "Present")
        ? `<p>${benignText}</p><br/>`
        : ""
    }
    ${
      macroText.length > 0 && calcificationsPresent === "Present"
        ? `<p>${macroText}</p><br/>`
        : ""
    }
    ${
      microText.length > 0 && calcificationsPresent === "Present"
        ? `<p>${microText}</p><br/>`
        : ""
    }
    ${scarText && calcifiedScar === "Present" ? `<p>${scarText}</p><br/>` : ""}
    ${
      ductalText && ductalProminence === "Present"
        ? `<p>${ductalText}</p><br/>`
        : ""
    }
  `;
  } else {
    return ` ${
      grandularAndDuctalTissue === "Present"
        ? `<p>Absent (post mastectomy status).</p><br/>`
        : ""
    }<p>The rest of the breast tissue appears unremarkable.</p>`;
  }
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

      const base = `There ${label === "calcified scar" ? `is a` : "are"} ${
        type.toLowerCase() === "other" ? item.otherText : type.toLowerCase()
      } ${label} noted`;
      const distText =
        showDistribution && distribution
          ? ` in a ${distribution.toLowerCase()} distribution`
          : "";
      let location = clock
        ? ` at ${clock === "0" ? "retroareolar region" : clock + ` o'clock`}`
        : "";
      location += level
        ? ` ${
            item.position !== "Unknown" && item.position
              ? ` in the ${item.position.toLowerCase()}${
                  item.position
                    ? ` ${
                        item.position === "Coronal Level"
                          ? "P"
                          : item.position === "Axial"
                          ? "S"
                          : item.position === "Sagittal" && "M/L"
                      }${level}`
                    : ""
                }`
              : ""
          }`
        : "";

      return `${base}${distText}${location}.`;
    })
    .join("\n");
}
