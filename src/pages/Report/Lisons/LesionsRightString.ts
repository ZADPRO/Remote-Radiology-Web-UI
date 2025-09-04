interface ReportQuestion {
  questionId: number;
  answer: string;
}

interface QuestionIds {
  lesionsr: number;
  simplecrstr: number;
  simplecrstDatar: number;
  complexcrstr: number;
  complexcrstDatar: number;
  Heterogeneousstr: number;
  HeterogeneousDatar: number;
  Hypertrophicstr: number;
  HypertrophicDatar: number;
  Otherstr: number;
  OtherDatar: number;
  fibronodulardensitystr: number;
  fibronodulardensityDatar: number;
  multipleCystsstr: number;
  multipleCystsDatar: number;
}

export type LesionKeys =
  | "simple cyst"
  | "complex cystic structure"
  | "heterogeneous tissue prominence"
  | "hypertrophic tissue with microcysts"
  | "fibronodular density"
  | "multiple simple cysts"
  | "others";

export type LesionsVal = Record<LesionKeys, string[]>;

export function LesionsRightString(
  reportFormData: ReportQuestion[],
  questionIds: QuestionIds,
  LesionsString: string
): string {
  const getAnswer = (id: number) =>
    reportFormData.find((q) => q.questionId === id)?.answer || "";

  let ActualData: LesionsVal = {} as LesionsVal;

  try {
    ActualData = JSON.parse(LesionsString) as LesionsVal;
  } catch (err) {
    console.log(err);
    ActualData = {} as LesionsVal;
  }

  if (getAnswer(questionIds.lesionsr) !== "Present") return "";

  const lesionsVal: LesionsVal = {
    "simple cyst": [],
    "complex cystic structure": [],
    "heterogeneous tissue prominence": [],
    "hypertrophic tissue with microcysts": [],
    "fibronodular density": [],
    "multiple simple cysts": [],
    others: [],
  };

  const createHTMLFromData = (
    label: LesionKeys,
    raw: string,
    isOther = false
  ) => {
    const htmlVal: string[] = [];
    let html = "";
    try {
      const dataArray = raw ? JSON.parse(raw) : [];
      dataArray.forEach((data: any, index: number) => {
        if (data.syncStatus) {
          // Name/label
          const namePart = isOther ? data.name?.toLowerCase() : label;

          // Location
          let locationText = "";
          if (
            data.locationclockposition &&
            data.locationclockposition !== "unknown"
          ) {
            locationText =
              data.locationclockposition === "0"
                ? "Nipple"
                : `${data.locationclockposition} o'clock`;
          }

          let locationTextto = "";
          if (
            data.locationclockpositionto &&
            data.locationclockpositionto !== "unknown"
          ) {
            locationTextto =
              data.locationclockpositionto === "0"
                ? "Nipple"
                : `${data.locationclockpositionto} o'clock`;
          }

          // Level
          let levelText = "";
          if (data.locationLevel && data.locationLevel !== "unknown") {
            levelText =
              data.locationLevel === "Coronal Level"
                ? "P"
                : data.locationLevel === "Axial"
                ? "S"
                : data.locationLevel === "Sagital"
                ? "M/L"
                : "";
          }

          let sentence = `<span>There ${
            namePart === "multiple simple cysts" ? "are" : "is"
          }${
            namePart === "complex cystic structure" ||
            namePart === "fibronodular density" ||
            namePart === "simple cyst" ||
            namePart === "heterogeneous tissue prominence" ||
            namePart === "hypertrophic tissue with microcysts"
              ? " a"
              : ""
          }${
            namePart === "heterogeneous tissue prominence" ||
            namePart === "hypertrophic tissue with microcysts"
              ? "n area of"
              : ""
          } ${namePart ?? "lesion"}${
            namePart === "multiple simple cysts" && data.atleast
              ? ` atleast ${data.atleast}`
              : ""
          }`;

          // Distance from nipple
          // if (data.distancenipple) {
          sentence += `${
            namePart !== "heterogeneous tissue prominence" &&
            namePart !== "hypertrophic tissue with microcysts"
              ? `, `
              : ``
          } ${namePart === "multiple simple cysts" ? "largest measuring" : ""}`;
          // }

          // Add location if available
          if (locationText) {
            if (
              (namePart === "heterogeneous tissue prominence" &&
                locationText &&
                locationTextto) ||
              (namePart === "hypertrophic tissue with microcysts" &&
                locationText &&
                locationTextto)
            ) {
              sentence += ` spanning in the range of ${locationText} to ${locationTextto}`;
            } else {
              sentence += ` present at ${locationText}`;
            }
          }

          // Add level/percentage if available and not unknown
          if (
            levelText &&
            data.locationLevelPercentage &&
            data.locationLevel !== "unknown"
          ) {
            if (
              (namePart === "heterogeneous tissue prominence" &&
                data.locationLevelPercentage &&
                data.locationLevelPercentageto) ||
              (namePart === "hypertrophic tissue with microcysts" &&
                data.locationLevelPercentage &&
                data.locationLevelPercentageto)
            ) {
              sentence += `, located in the range of ${levelText}${data.locationLevelPercentage} to ${levelText}${data.locationLevelPercentageto}`;
            } else {
              sentence += `, located at ${levelText}${data.locationLevelPercentage}`;
            }
          } else if (levelText && data.locationLevel !== "unknown") {
            sentence += `, located at ${levelText}`;
          } else if (data.locationLevelPercentage) {
            sentence += `, located at ${data.locationLevelPercentage}`;
          }

          if (data.sizew || data.sizel || data.sizeh) {
            sentence += `. The lesion is measuring `;
          }

          // width Size
          if (data.sizew) {
            sentence += ` ${data.sizew} mm (width)`;
          }

          // Length Size
          if (data.sizel) {
            sentence += ` ${data.sizew || data.sizeh ? "×" : ""} ${
              data.sizel
            } mm (length)`;
          }

          // Height Size
          if (data.sizeh) {
            sentence += ` ${data.sizew || data.sizel ? "×" : ""} ${
              data.sizeh
            } mm (height)`;
          }

          if (data.sizew || data.sizel || data.sizeh) {
            sentence += ` in size`;
          }

          // Shape
          if (data.Shape && data.Shape !== "unknown") {
            sentence += `, ${data.Shape.toLowerCase()} shaped`;
          }

          // Appearance
          if (data.Appearance && data.Appearance !== "unknown") {
            sentence += `, ${data.Appearance.toLowerCase()} appearance`;
          }

          // Margins
          if (data.Margins && data.Margins !== "unknown") {
            sentence += `, with ${data.Margins.toLowerCase()} margins`;
          }

          // Density/Echotexture
          if (data.density && data.density !== "unknown") {
            sentence += ` and ${data.density.toLowerCase()} echotexture`;
          }

          // Transmission speed
          if (data.Transmissionspped) {
            sentence += `. Transmission speed is measured at ${data.Transmissionspped} m/s`;
          }

          // Internal debris
          if (data.debris && data.debris !== "not present") {
            sentence += `. Internal debris is noted`;
          }

          // Volume
          if (data.Volumne) {
            sentence += `. Volume is approximately ${data.Volumne} cubic mm`;
          }

          if (data.distancenipple) {
            sentence += `. It is approximately ${data.distancenipple} mm from nipple`;
          }

          sentence += ".</span><br /><br />";

          htmlVal.push(sentence);
          html += sentence;
        } else {
          htmlVal.push(ActualData[label][index]);
        }
      });
    } catch (err) {
      console.error("Invalid JSON:", err);
    }
    return htmlVal;
  };

  const createHypertropictissue = (
    label: LesionKeys,
    raw: string,
    isOther = false
  ) => {
    const htmlVal: string[] = [];
    let html = "";
    try {
      const dataArray = raw ? JSON.parse(raw) : [];
      dataArray.forEach((data: any, index: number) => {
        if (data.syncStatus) {
          // Name/label
          const namePart = isOther ? data.name?.toLowerCase() : label;

          // Location

          // Level
          let levelText = "";
          if (data.locationLevel && data.locationLevel !== "unknown") {
            levelText =
              data.locationLevel === "Coronal Level"
                ? "P"
                : data.locationLevel === "Axial"
                ? "S"
                : data.locationLevel === "Sagital"
                ? "M/L"
                : "";
          }

          let sentence = `<span>There is an area of ${namePart ?? "lesion"}${
            data.Transmissionspped
              ? ` with a speed of ${data.Transmissionspped} m/s,`
              : ``
          }${
            data.locationclockposition.length > 0
              ? ` located ${
                  data.locationclockposition.length > 0 &&
                  data.locationclockpositionto.length > 0
                    ? `in the range of `
                    : `at`
                } ${
                  data.locationclockposition === "0"
                    ? "nipple"
                    : data.locationclockposition + "'o clock"
                }`
              : ``
          }${
            data.locationclockpositionto.length > 0
              ? `${data.locationclockposition.length > 0 ? " to " : ` `}${
                  data.locationclockpositionto === "0"
                    ? "nipple"
                    : data.locationclockpositionto + "'o clock"
                }`
              : ``
          }${
            data.locationLevel && data.locationLevel !== "Unknown"
              ? ` in ${data.locationLevel.toLowerCase()} ${levelText}${
                  data.locationLevelPercentage
                }${
                  data.locationLevelPercentage.length > 0 &&
                  data.locationLevelPercentageto.length > 0
                    ? `-${data.locationLevelPercentageto}`
                    : `${data.locationLevelPercentageto}`
                }`
              : ``
          }`;

          if (
            data.sizew ||
            data.sizel ||
            data.sizeh ||
            (data.Shape && data.Shape !== "unknown") ||
            (data.Appearance && data.Appearance !== "unknown") ||
            (data.Margins && data.Margins !== "unknown") ||
            (data.density && data.density !== "unknown") ||
            (data.debris && data.debris !== "not present") ||
            data.Volumne
          ) {
            sentence += `. It is noted to be ${
              data.sizew || data.sizel || data.sizeh ? "spanning around" : ""
            }`;
          }

          // width Size
          if (data.sizew) {
            sentence += ` ${data.sizew} mm (width)`;
          }

          // Length Size
          if (data.sizel) {
            sentence += ` ${data.sizew || data.sizeh ? "×" : ""} ${
              data.sizel
            } mm (length)`;
          }

          // Height Size
          if (data.sizeh) {
            sentence += ` ${data.sizew || data.sizel ? "×" : ""} ${
              data.sizeh
            } mm (height)`;
          }

          if (data.sizew || data.sizel || data.sizeh) {
            sentence += ` in size`;
          }

          // Shape
          if (data.Shape && data.Shape !== "unknown") {
            sentence += `, ${data.Shape.toLowerCase()} shaped`;
          }

          // Appearance
          if (data.Appearance && data.Appearance !== "unknown") {
            sentence += `, ${data.Appearance.toLowerCase()} in appearance`;
          }

          // Density/Echotexture
          if (data.density && data.density !== "unknown") {
            sentence += `, ${data.density.toLowerCase()} echotexture`;
          }

          // Margins
          if (data.Margins && data.Margins !== "unknown") {
            sentence += ` and with ${data.Margins.toLowerCase()} margins`;
          }

          // Internal debris
          if (data.debris && data.debris !== "not present") {
            sentence += `. Internal debris is noted`;
          }

          // Volume
          if (data.Volumne) {
            sentence += `. With an estimated volume of ${data.Volumne} cubic mm`;
          }

          if (data.distancenipple) {
            sentence += `. It is approximately ${data.distancenipple} mm from nipple`;
          }

          sentence += ".</span><br /><br />";

          htmlVal.push(sentence);
          html += sentence;
        } else {
          htmlVal.push(ActualData[label][index]);
        }
      });
    } catch (err) {
      console.error("Invalid JSON:", err);
    }
    return htmlVal;
  };

  const createMultipleCyst = (
    label: LesionKeys,
    raw: string,
    isOther = false
  ) => {
    const htmlVal: string[] = [];
    let html = "";
    try {
      const dataArray = raw ? JSON.parse(raw) : [];
      dataArray.forEach((data: any, index: number) => {
        if (data.syncStatus) {
          // Name/label
          const namePart = isOther ? data.name?.toLowerCase() : label;

          // // Location
          // let locationText = "";
          // if (
          //   data.locationclockposition &&
          //   data.locationclockposition !== "unknown"
          // ) {
          //   locationText =
          //     data.locationclockposition === "0"
          //       ? "Nipple"
          //       : `${data.locationclockposition} o'clock`;
          // }

          // Level
          let levelText = "";
          if (data.locationLevel && data.locationLevel !== "unknown") {
            levelText =
              data.locationLevel === "Coronal Level"
                ? "P"
                : data.locationLevel === "Axial"
                ? "S"
                : data.locationLevel === "Sagital"
                ? "M/L"
                : "";
          }

          let sentence = `<span>There are ${namePart ?? "lesion"}${
            data.atleast ? ` (atleast ${data.atleast})` : ``
          }${
            data.Transmissionspped
              ? `, with a speed of ${data.Transmissionspped} m/s,`
              : ``
          }${
            data.locationclockposition.length > 0
              ? ` located ${
                  data.locationclockposition.length > 0 &&
                  data.locationclockpositionto.length > 0
                    ? `in the range of `
                    : `at`
                } ${
                  data.locationclockposition === "0"
                    ? "nipple"
                    : data.locationclockposition + "'o clock"
                }`
              : ``
          }${
            data.locationclockpositionto.length > 0
              ? `${data.locationclockposition.length > 0 ? " to " : ` `}${
                  data.locationclockpositionto === "0"
                    ? "nipple"
                    : data.locationclockpositionto + "'o clock"
                }`
              : ``
          }${
            data.locationLevel && data.locationLevel !== "Unknown"
              ? ` in ${data.locationLevel.toLowerCase()} ${levelText}${
                  data.locationLevelPercentage
                }${
                  data.locationLevelPercentage.length > 0 &&
                  data.locationLevelPercentageto.length > 0
                    ? `-${data.locationLevelPercentageto}`
                    : `${data.locationLevelPercentageto}`
                }`
              : ``
          }`;

          if (
            data.sizew ||
            data.sizel ||
            data.sizeh ||
            (data.Shape && data.Shape !== "unknown") ||
            (data.Appearance && data.Appearance !== "unknown") ||
            (data.Margins && data.Margins !== "unknown") ||
            (data.density && data.density !== "unknown") ||
            (data.debris && data.debris !== "not present") ||
            data.Volumne
          ) {
            sentence += `. These are noted to be `;
          }

          // width Size
          if (data.sizew) {
            sentence += ` ${data.sizew} mm (width)`;
          }

          // Length Size
          if (data.sizel) {
            sentence += ` ${data.sizew || data.sizeh ? "×" : ""} ${
              data.sizel
            } mm (length)`;
          }

          // Height Size
          if (data.sizeh) {
            sentence += ` ${data.sizew || data.sizel ? "×" : ""} ${
              data.sizeh
            } mm (height)`;
          }

          if (data.sizew || data.sizel || data.sizeh) {
            sentence += ` in size`;
          }

          // Shape
          if (data.Shape && data.Shape !== "unknown") {
            sentence += `, ${data.Shape.toLowerCase()} shaped`;
          }

          // Appearance
          if (data.Appearance && data.Appearance !== "unknown") {
            sentence += `, ${data.Appearance.toLowerCase()} in appearance`;
          }

          // Density/Echotexture
          if (data.density && data.density !== "unknown") {
            sentence += `, ${data.density.toLowerCase()} echotexture`;
          }

          // Margins
          if (data.Margins && data.Margins !== "unknown") {
            sentence += ` and with ${data.Margins.toLowerCase()} margins`;
          }

          // Internal debris
          if (data.debris && data.debris !== "not present") {
            sentence += `. Internal debris is noted`;
          }

          // Volume
          if (data.Volumne) {
            sentence += `. It has an estimated volume of approximately ${data.Volumne} cubic mm`;
          }

          sentence += ".</span><br /><br />";

          htmlVal.push(sentence);
          html += sentence;
        } else {
          htmlVal.push(ActualData[label][index]);
        }
      });
    } catch (err) {
      console.error("Invalid JSON:", err);
    }
    return htmlVal;
  };

  let finalHTML = "";

  if (getAnswer(questionIds.simplecrstr) === "Present") {
    lesionsVal["simple cyst"] = createHTMLFromData(
      "simple cyst",
      getAnswer(questionIds.simplecrstDatar)
    );
    finalHTML += createHTMLFromData(
      "simple cyst",
      getAnswer(questionIds.simplecrstDatar)
    );
  }

  if (getAnswer(questionIds.complexcrstr) === "Present") {
    lesionsVal["complex cystic structure"] = createHTMLFromData(
      "complex cystic structure",
      getAnswer(questionIds.complexcrstDatar)
    );
    finalHTML += createHTMLFromData(
      "complex cystic structure",
      getAnswer(questionIds.complexcrstDatar)
    );
  }

  if (getAnswer(questionIds.Heterogeneousstr) === "Present") {
    lesionsVal["heterogeneous tissue prominence"] = createHypertropictissue(
      "heterogeneous tissue prominence",
      getAnswer(questionIds.HeterogeneousDatar)
    );
    finalHTML += createHTMLFromData(
      "heterogeneous tissue prominence",
      getAnswer(questionIds.HeterogeneousDatar)
    );
  }

  if (getAnswer(questionIds.Hypertrophicstr) === "Present") {
    lesionsVal["hypertrophic tissue with microcysts"] = createHypertropictissue(
      "hypertrophic tissue with microcysts",
      getAnswer(questionIds.HypertrophicDatar)
    );
    finalHTML += createHTMLFromData(
      "hypertrophic tissue with microcysts",
      getAnswer(questionIds.HypertrophicDatar)
    );
  }

  if (getAnswer(questionIds.fibronodulardensitystr) === "Present") {
    lesionsVal["fibronodular density"] = createHTMLFromData(
      "fibronodular density",
      getAnswer(questionIds.fibronodulardensityDatar)
    );
    finalHTML += createHTMLFromData(
      "fibronodular density",
      getAnswer(questionIds.fibronodulardensityDatar)
    );
  }

  if (getAnswer(questionIds.multipleCystsstr) === "Present") {
    lesionsVal["multiple simple cysts"] = createMultipleCyst(
      "multiple simple cysts",
      getAnswer(questionIds.multipleCystsDatar)
    );
    finalHTML += createHTMLFromData(
      "multiple simple cysts",
      getAnswer(questionIds.multipleCystsDatar)
    );
  }

  if (getAnswer(questionIds.Otherstr) === "Present") {
    lesionsVal["others"] = createHTMLFromData(
      "others",
      getAnswer(questionIds.OtherDatar),
      true
    );
    finalHTML += createHTMLFromData(
      "others",
      getAnswer(questionIds.OtherDatar),
      true
    );
  }

  return JSON.stringify(lesionsVal);
}
