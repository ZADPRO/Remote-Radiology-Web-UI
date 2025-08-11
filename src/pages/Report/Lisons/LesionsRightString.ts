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

export function LesionsRightString(
  reportFormData: ReportQuestion[],
  questionIds: QuestionIds
): string {
  const getAnswer = (id: number) =>
    reportFormData.find((q) => q.questionId === id)?.answer || "";

  if (getAnswer(questionIds.lesionsr) !== "Present") return "";

  const createHTMLFromData = (label: string, raw: string, isOther = false) => {
    let html = "";
    try {
      const dataArray = raw ? JSON.parse(raw) : [];
      dataArray.forEach((data: any) => {
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
              ? "M"
              : "";
        }

        let sentence = `<span>There ${
          namePart === "multiple simple cysts" ? "are" : "is"
        } ${
          namePart === "multiple simple cysts" && data.atleast
            ? ` atleast ${data.atleast} `
            : ""
        }${namePart ?? "lesion"}`;

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
            sentence += ` present in the range of ${locationText} to ${locationTextto}`;
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

        // Distance from nipple
        if (data.distancenipple) {
          sentence += `, approximately ${
            namePart === "multiple simple cysts" ? "largest measuring" : ""
          }${
            namePart === "heterogeneous tissue prominence" ||
            namePart === "hypertrophic tissue with microcysts"
              ? `spanning`
              : ``
          } ${data.distancenipple} mm from the nipple`;
        }

        if (data.sizew || data.sizel || data.sizeh) {
          sentence += `. The lesion is`;
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

        sentence += ".</span><br /><br />";
        html += sentence;
      });
    } catch (err) {
      console.error("Invalid JSON:", err);
    }
    return html;
  };

  let finalHTML = "";

  if (getAnswer(questionIds.simplecrstr) === "Present") {
    finalHTML += createHTMLFromData(
      "simple cyst",
      getAnswer(questionIds.simplecrstDatar)
    );
  }

  if (getAnswer(questionIds.complexcrstr) === "Present") {
    finalHTML += createHTMLFromData(
      "complex cystic structure",
      getAnswer(questionIds.complexcrstDatar)
    );
  }

  if (getAnswer(questionIds.Heterogeneousstr) === "Present") {
    finalHTML += createHTMLFromData(
      "heterogeneous tissue prominence",
      getAnswer(questionIds.HeterogeneousDatar)
    );
  }

  if (getAnswer(questionIds.Hypertrophicstr) === "Present") {
    finalHTML += createHTMLFromData(
      "hypertrophic tissue with microcysts",
      getAnswer(questionIds.HypertrophicDatar)
    );
  }

  if (getAnswer(questionIds.fibronodulardensitystr) === "Present") {
    finalHTML += createHTMLFromData(
      "fibronodular density",
      getAnswer(questionIds.fibronodulardensityDatar)
    );
  }

  if (getAnswer(questionIds.multipleCystsstr) === "Present") {
    finalHTML += createHTMLFromData(
      "multiple simple cysts",
      getAnswer(questionIds.multipleCystsDatar)
    );
  }

  if (getAnswer(questionIds.Otherstr) === "Present") {
    finalHTML += createHTMLFromData(
      "",
      getAnswer(questionIds.OtherDatar),
      true
    );
  }

  return finalHTML.trim();
}
