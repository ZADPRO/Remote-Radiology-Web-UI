import { ResponsePatientForm } from "@/pages/TechnicianPatientIntakeForm/TechnicianPatientIntakeForm";

// interface QuestionConfig {
//   label: string;
//   answer: string;
//   dependsOn?: number;
// }

// interface FormSentenceOptions {
//   values: string[];
//   otherValue?: string; // What to replace "Other" with
// }

export function DaFormReportGenerator(
  patientInTakeForm: ResponsePatientForm[]
): string {
  const getPatientAnswer = (id: number) =>
    patientInTakeForm.find((q) => q.questionId === id)?.answer || "";
  let report = [];

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

  const AbnormalFinding = {
    abnormality: getPatientAnswer(205),
    support: getPatientAnswer(206),
    supportother: getPatientAnswer(207),
    typeabnormalitymass: getPatientAnswer(208),
    typeabnormalityarchi: getPatientAnswer(209),
    typeabnormalitycal: getPatientAnswer(210),
    typeabnormalityasym: getPatientAnswer(211),
    typeabnormalitycyst: getPatientAnswer(212),
    typeabnormalityfiboc: getPatientAnswer(213),
    typeabnormalityfiboa: getPatientAnswer(215),
    typeabnormalityatyp: getPatientAnswer(216),
    typeabnormalitother: getPatientAnswer(217),
    typeabnormalitotherspe: getPatientAnswer(218),

    breast: getPatientAnswer(219),
    breastRight: getPatientAnswer(453),
    upperOuterQuadrant: getPatientAnswer(220),
    upperInnerQuadrant: getPatientAnswer(221),
    lowerOuterQuadrant: getPatientAnswer(222),
    lowerInnerQuadrant: getPatientAnswer(223),
    centralNippleOuterQuadrant: getPatientAnswer(224),
    unknownQuadrant: getPatientAnswer(225),
    clockpositionstatus: getPatientAnswer(226),
    clockposition: getPatientAnswer(227),
    distancenippleStatus: getPatientAnswer(228),
    distancenipple: getPatientAnswer(229),
    sizeStatus: getPatientAnswer(230),
    size: getPatientAnswer(231),
    sizeunit: getPatientAnswer(232),
    biradsCat: getPatientAnswer(233),
    biradsCatOther: getPatientAnswer(234),

    upperOuterQuadrantRight: getPatientAnswer(454),
    upperInnerQuadrantRight: getPatientAnswer(455),
    lowerOuterQuadrantRight: getPatientAnswer(456),
    lowerInnerQuadrantRight: getPatientAnswer(457),
    centralNippleOuterQuadrantRight: getPatientAnswer(458),
    unknownQuadrantRight: getPatientAnswer(459),
    clockpositionstatusRight: getPatientAnswer(460),
    clockpositionRight: getPatientAnswer(461),
    distancenippleStatusRight: getPatientAnswer(462),
    distancenippleRight: getPatientAnswer(463),
    sizeStatusRight: getPatientAnswer(464),
    sizeRight: getPatientAnswer(465),
    sizeunitRight: getPatientAnswer(466),
    biradsCatRight: getPatientAnswer(467),
    biradsCatOtherRight: getPatientAnswer(468),

    marker: getPatientAnswer(235),
    markerother: getPatientAnswer(236),
  };

  const biopsyinfo = {
    performed: getPatientAnswer(239),
    Biopsyresult: getPatientAnswer(243),
    Benignother: getPatientAnswer(244),
    Atypicalother: getPatientAnswer(245),
    Highrisklesionother: getPatientAnswer(246),
    Pathology: getPatientAnswer(247),
  };

  const categoryId = getPatientAnswer(170);

  if (categoryId != "2") {
    return ``;
  }

  //AbnormalFindings
  const AbnormalFindingsTexttype = [];

  AbnormalFinding.typeabnormalitymass === "true"
    ? AbnormalFindingsTexttype.push(`mass/nodule`)
    : "";
  AbnormalFinding.typeabnormalityarchi === "true"
    ? AbnormalFindingsTexttype.push(`architectural distortion`)
    : "";
  AbnormalFinding.typeabnormalitycal === "true"
    ? AbnormalFindingsTexttype.push(`calcifications`)
    : "";
  AbnormalFinding.typeabnormalityasym === "true"
    ? AbnormalFindingsTexttype.push(`asymmetry`)
    : "";
  AbnormalFinding.typeabnormalitycyst === "true"
    ? AbnormalFindingsTexttype.push(`cyst`)
    : "";
  AbnormalFinding.typeabnormalityfiboc === "true"
    ? AbnormalFindingsTexttype.push(`fibrocystic changes`)
    : "";
  AbnormalFinding.typeabnormalityfiboa === "true"
    ? AbnormalFindingsTexttype.push(`fibroadenomas`)
    : "";
  AbnormalFinding.typeabnormalityatyp === "true"
    ? AbnormalFindingsTexttype.push(`atypical hyperplasia`)
    : "";
  AbnormalFinding.typeabnormalitother === "true"
    ? AbnormalFindingsTexttype.push(`${AbnormalFinding.typeabnormalitotherspe}`)
    : "";

  const abnormalityOverAll = [];

  if (AbnormalFindingsTexttype.length > 0) {
    const sentence = `${AbnormalFindingsTexttype.join(", ")}`;
    abnormalityOverAll.push(
      `${sentence.charAt(0).toUpperCase() + sentence.slice(1)} was detected${
        AbnormalFinding.abnormality.length > 0
          ? `: ${AbnormalFinding.abnormality}`
          : ""
      }.`
    );
  }

  if (AbnormalFinding.support.length > 0) {
    const methodofdetection = JSON.parse(AbnormalFinding.support); // should be an array
    const methodofdetectionres: string[] = [];

    if (Array.isArray(methodofdetection) && methodofdetection.length > 0) {
      methodofdetection.forEach((data: string) => {
        if (data.toLowerCase() === "mri") {
          methodofdetectionres.push("MRI");
        } else if (data.toLowerCase() === "other") {
          if (AbnormalFinding.supportother) {
            methodofdetectionres.push(AbnormalFinding.supportother);
          }
        } else {
          methodofdetectionres.push(data.toLowerCase());
        }
      });
    }

    if (methodofdetectionres.length > 0) {
      abnormalityOverAll.push(
        `Method of detection: ${methodofdetectionres.join(", ")}.`
      );
    }
  }

  if (abnormalityOverAll.length > 0) {
    report.push(abnormalityOverAll.join(" "));
  }

  //Location of abnormality
  //Right
  if (AbnormalFinding.breastRight === "true") {
    const sentence = [];

    sentence.push(`Located in the right breast`);

    AbnormalFinding.upperOuterQuadrantRight === "true" &&
      sentence.push(`upper outer quadrant`);
    AbnormalFinding.upperInnerQuadrantRight === "true" &&
      sentence.push(`upper inner quadrant`);
    AbnormalFinding.lowerOuterQuadrantRight === "true" &&
      sentence.push(`lower outer quadrant`);
    AbnormalFinding.lowerInnerQuadrantRight === "true" &&
      sentence.push(`lower inner quadrant`);
    AbnormalFinding.centralNippleOuterQuadrantRight === "true" &&
      sentence.push(`central/nipple outer quadrant`);
    AbnormalFinding.unknownQuadrantRight === "true" &&
      sentence.push(`unknown quadrant`);

    AbnormalFinding.clockpositionstatusRight === "known" &&
      sentence.push(
        `clock position ${formatBreastSymptoms(
          AbnormalFinding.clockpositionRight
        )}`
      );

    AbnormalFinding.distancenippleStatusRight === "known" &&
      sentence.push(`${AbnormalFinding.distancenippleRight} cm from nipple`);

    AbnormalFinding.sizeStatusRight === "known" &&
      sentence.push(
        `size of abnormality ${AbnormalFinding.sizeRight} ${AbnormalFinding.sizeunitRight}`
      );

    if (AbnormalFinding.biradsCatRight.length > 0) {
      AbnormalFinding.biradsCatRight !== "Other"
        ? sentence.push(
            `BIRADS ${AbnormalFinding.biradsCatRight.toLowerCase()}`
          )
        : sentence.push(`BIRADS ${AbnormalFinding.biradsCatOtherRight}`);
    }

    report.push(sentence.join(", ") + ".");
  }

  //Left
  if (AbnormalFinding.breast === "true") {
    const sentence = [];

    sentence.push(`Located in the left breast`);

    AbnormalFinding.upperOuterQuadrant === "true" &&
      sentence.push(`upper outer quadrant`);
    AbnormalFinding.upperInnerQuadrant === "true" &&
      sentence.push(`upper inner quadrant`);
    AbnormalFinding.lowerOuterQuadrant === "true" &&
      sentence.push(`lower outer quadrant`);
    AbnormalFinding.lowerInnerQuadrant === "true" &&
      sentence.push(`lower inner quadrant`);
    AbnormalFinding.centralNippleOuterQuadrant === "true" &&
      sentence.push(`central/nipple outer quadrant`);
    AbnormalFinding.unknownQuadrant === "true" &&
      sentence.push(`unknown quadrant`);

    AbnormalFinding.clockpositionstatus === "known" &&
      sentence.push(
        `clock position ${formatBreastSymptoms(AbnormalFinding.clockposition)}`
      );

    AbnormalFinding.distancenippleStatus === "known" &&
      sentence.push(`${AbnormalFinding.distancenipple} cm from nipple`);

    AbnormalFinding.sizeStatus === "known" &&
      sentence.push(
        `size of abnormality ${AbnormalFinding.size} ${AbnormalFinding.sizeunit}`
      );

    if (AbnormalFinding.biradsCat.length > 0) {
      AbnormalFinding.biradsCat !== "Other"
        ? sentence.push(`BIRADS ${AbnormalFinding.biradsCat.toLowerCase()}`)
        : sentence.push(`BIRADS ${AbnormalFinding.biradsCatOther}`);
    }

    report.push(sentence.join(", ") + ".");
  }

  //Clips
  if (AbnormalFinding.marker === "Yes") {
    report.push(`Clips present ${AbnormalFinding.markerother}.`);
  }

  //Biopsy Information
  //Biopsy Result
  // if (biopsyinfo.performed === "Yes" && biopsyinfo.Biopsyresult !== "Unknown") {
  //   report.push(
  //     `Biospy results: ${biopsyinfo.Biopsyresult.toLocaleLowerCase()}${
  //       biopsyinfo.Biopsyresult === "Benign" &&
  //       biopsyinfo.Benignother.length > 0
  //         ? ` (${biopsyinfo.Benignother})`
  //         : ``
  //     }${
  //       biopsyinfo.Biopsyresult === "Atypical" &&
  //       biopsyinfo.Atypicalother.length > 0
  //         ? ` (${biopsyinfo.Atypicalother})`
  //         : ``
  //     }${
  //       biopsyinfo.Biopsyresult === "High-risk lesion" &&
  //       biopsyinfo.Highrisklesionother.length > 0
  //         ? ` (${biopsyinfo.Highrisklesionother})`
  //         : ``
  //     }.`
  //   );
  // }

  //Pathology
  if (biopsyinfo.Pathology.length > 0) {
    report.push(`Pathology recommendation was ${biopsyinfo.Pathology}.`);
  }

  return report.join("<br/>");
}
