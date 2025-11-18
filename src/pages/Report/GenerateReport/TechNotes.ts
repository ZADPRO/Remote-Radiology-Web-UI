import { ReportQuestion } from "../Report";

export function TechNotes(reportFormData: ReportQuestion[]): string {
  function formatBreastSymptoms(input: string): string {
    if (!input) return "";

    const values = input.split(",").map((v) => v.trim());

    // If only "0"
    if (values.length === 1 && values[0] === "0") {
      return "nipple";
    }

    return values
      .map((val) => {
        if (val === "0") return "nipple";
        return `${val} o'clock`;
      })
      .join(", ");
  }

  const getAnswer = (id: number) =>
    reportFormData.find((q) => q.questionId === id)?.answer || "";

  let reportText = [];

  const breastSymptoms = {
    deformity: getAnswer(19),
    deformityBig: getAnswer(20),
    deformityRight: getAnswer(21),
    deformityLeft: getAnswer(22),
    deformityDuration: getAnswer(23),
    deformityDurationRight: getAnswer(47),
    deformityComments: getAnswer(48),

    scar: getAnswer(24),
    scarRight: getAnswer(25),
    scarLeft: getAnswer(26),
    scarDuration: getAnswer(27),
    scarDurationRight: getAnswer(43),
    scarComments: getAnswer(54),

    sore: getAnswer(28),
    soreRight: getAnswer(29),
    soreLeft: getAnswer(30),
    soreDuration: getAnswer(31),
    soreDurationRight: getAnswer(44),
    soreComments: getAnswer(55),
    side: getAnswer(58),
  };

  if (
    (breastSymptoms.deformity === "true" &&
      (breastSymptoms.deformityRight === "true" ||
        breastSymptoms.deformityLeft === "true")) ||
    breastSymptoms.deformityComments.length > 0
  ) {
    const content = `<ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Deformity / Asymmetry: ${
      breastSymptoms.deformityRight === "true"
        ? `right${
            breastSymptoms.deformityBig === "Right" ? `, bigger side` : ``
          }${
            breastSymptoms.deformityDurationRight.length > 0
              ? `, ${breastSymptoms.deformityDurationRight}`
              : ``
          }`
        : ``
    }${
      breastSymptoms.deformityRight === "true" &&
      breastSymptoms.deformityLeft === "true"
        ? `, `
        : ``
    }${
      breastSymptoms.deformityLeft === "true"
        ? `left${
            breastSymptoms.deformityBig === "Left" ? `, bigger side` : ``
          }${
            breastSymptoms.deformityDuration.length > 0
              ? `, ${breastSymptoms.deformityDuration}`
              : ``
          }`
        : ``
    }${
      (breastSymptoms.deformityRight === "true" ||
        breastSymptoms.deformityLeft === "true") &&
      breastSymptoms.deformityComments.length > 0
        ? `, `
        : ``
    }${
      breastSymptoms.deformityComments.length > 0
        ? `${breastSymptoms.deformityComments}`
        : ``
    }.
    </li></ol>`;

    reportText.push(content);
  }

  if (
    breastSymptoms.scar === "true" &&
    (breastSymptoms.scarRight.length > 0 ||
      breastSymptoms.scarLeft.length > 0 ||
      breastSymptoms.scarComments.length > 0)
  ) {
    const content = `<ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Scar:${
      breastSymptoms.scarRight.length > 0
        ? ` right at ${formatBreastSymptoms(breastSymptoms.scarRight)}${
            breastSymptoms.scarDurationRight.length > 0
              ? `, ${breastSymptoms.scarDurationRight}`
              : ``
          }`
        : ``
    }${
      breastSymptoms.scarRight.length > 0 && breastSymptoms.scarLeft.length > 0
        ? `, `
        : ``
    }${
      breastSymptoms.scarLeft.length > 0
        ? ` left at ${formatBreastSymptoms(breastSymptoms.scarLeft)}${
            breastSymptoms.scarDuration.length > 0
              ? `, ${breastSymptoms.scarDuration}`
              : ``
          }`
        : ``
    }${
      (breastSymptoms.scarLeft.length > 0 ||
        breastSymptoms.scarRight.length > 0) &&
      breastSymptoms.scarComments.length > 0
        ? `, `
        : ` `
    }${
      breastSymptoms.scarComments.length > 0
        ? `${breastSymptoms.scarComments}`
        : ``
    }.</li></ol>`;
    reportText.push(content);
  }

  if (
    breastSymptoms.sore === "true" &&
    (breastSymptoms.soreRight.length > 0 ||
      breastSymptoms.soreLeft.length > 0 ||
      breastSymptoms.soreComments.length > 0)
  ) {
    const content = `<ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Pain on palpation:${
      breastSymptoms.soreRight.length > 0
        ? ` right at ${formatBreastSymptoms(breastSymptoms.soreRight)}${
            breastSymptoms.soreDurationRight.length > 0
              ? `, ${breastSymptoms.soreDurationRight}`
              : ``
          }`
        : ``
    }${
      breastSymptoms.soreRight.length > 0 && breastSymptoms.soreLeft.length > 0
        ? `, `
        : ``
    }${
      breastSymptoms.soreLeft.length > 0
        ? ` left at ${formatBreastSymptoms(breastSymptoms.soreLeft)}${
            breastSymptoms.soreDuration.length > 0
              ? `, ${breastSymptoms.soreDuration}`
              : ``
          }`
        : ``
    }${
      (breastSymptoms.soreLeft.length > 0 ||
        breastSymptoms.soreRight.length > 0) &&
      breastSymptoms.soreComments.length > 0
        ? `, `
        : ` `
    }${
      breastSymptoms.soreComments.length > 0
        ? `${breastSymptoms.soreComments}`
        : ``
    }.</li></ol>`;
    reportText.push(content);
  }

  if (breastSymptoms.side.length > 0) {
    const content = `<ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Side: ${
      breastSymptoms.side === "unilateralright"
        ? `Unilateral Right`
        : breastSymptoms.side === "unilateralleft"
        ? `Unilateral Left`
        : breastSymptoms.side === "bilateral" && `Bilateral`
    }.</li></ol>`;

    reportText.push(content);
  }

  return reportText.length > 0
    ? "<p><strong>Tech Notes</strong></p>" + reportText.join("")
    : "";
}
