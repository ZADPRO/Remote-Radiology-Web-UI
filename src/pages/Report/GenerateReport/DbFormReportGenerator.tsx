import { ResponsePatientForm } from "@/pages/TechnicianPatientIntakeForm/TechnicianPatientIntakeForm";
import { formatReadableDate } from "@/utlis/calculateAge";
// interface QuestionConfig {
//     label: string;
//     answer: string;
//     dependsOn?: number;
// }

// interface QuestionConfigVal {
//     label: string;
//     answer: string;
//     dependsOn?: number;
//     anotherdependsOn?: number;
//     mainQid: number;
// }

export function DbFormReportGenerator(
  patientInTakeForm: ResponsePatientForm[]
): string {
  const getPatientAnswer = (id: number) =>
    patientInTakeForm.find((q) => q.questionId === id)?.answer || "";

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

  const biopsy = {
    datediagnosis: getPatientAnswer(254),
    typediagnosis: getPatientAnswer(255),
    typediagnosisother: getPatientAnswer(256),
    grade: getPatientAnswer(257),
    stage: getPatientAnswer(258),
    tumersize: getPatientAnswer(259),
    breast: getPatientAnswer(260),
    breastRight: getPatientAnswer(469),
    upperOuterQuadrant: getPatientAnswer(261),
    upperInnerQuadrant: getPatientAnswer(262),
    lowerOuterQuadrant: getPatientAnswer(263),
    lowerInnerQuadrant: getPatientAnswer(264),
    centralNippleOuterQuadrant: getPatientAnswer(265),
    unknownQuadrant: getPatientAnswer(266),
    clockposition: getPatientAnswer(267),
    clockpositionstatus: getPatientAnswer(268),
    distancenippleStatus: getPatientAnswer(269),
    distancenipple: getPatientAnswer(270),

    upperOuterQuadrantRight: getPatientAnswer(470),
    upperInnerQuadrantRight: getPatientAnswer(471),
    lowerOuterQuadrantRight: getPatientAnswer(472),
    lowerInnerQuadrantRight: getPatientAnswer(473),
    centralNippleOuterQuadrantRight: getPatientAnswer(474),
    unknownQuadrantRight: getPatientAnswer(475),
    clockpositionstatusRight: getPatientAnswer(476),
    clockpositionRight: getPatientAnswer(477),
    distancenippleStatusRight: getPatientAnswer(478),
    distancenippleRight: getPatientAnswer(479),

    Lymph: getPatientAnswer(271),
    positivenode: getPatientAnswer(272),
    Metastasis: getPatientAnswer(273),
    location: getPatientAnswer(274),

    LymphRight: getPatientAnswer(480),
    positivenodeRight: getPatientAnswer(481),
    MetastasisRight: getPatientAnswer(483),
    locationRight: getPatientAnswer(484),
  };

  const treatment = {
    treatmentstatus: getPatientAnswer(283),
    Surgical: getPatientAnswer(284),
    surgery: getPatientAnswer(285),
    Mastectomy: getPatientAnswer(288),
    Bilateral: getPatientAnswer(289),
    Sentinel: getPatientAnswer(290),
    Axillary: getPatientAnswer(291),
    Reconstruction: getPatientAnswer(292),
    ReconstructionType: getPatientAnswer(293),
    Neoadjuvant: getPatientAnswer(296),
    Chemotherapy: getPatientAnswer(297),
    Hormonal: getPatientAnswer(298),
    outcome: getPatientAnswer(299),
    outcomeDuration: getPatientAnswer(300),
    outcomeSpecify: getPatientAnswer(301),
    Targeted: getPatientAnswer(302),
    Immunotherapy: getPatientAnswer(303),
    NeoAxillary: getPatientAnswer(304),
    Radiation: getPatientAnswer(305),
    Adjuvant: getPatientAnswer(306),
    AdjChemotherapy: getPatientAnswer(307),
    AdjHormonal: getPatientAnswer(308),
    AdjTargeted: getPatientAnswer(309),
    AdjImmunotherapy: getPatientAnswer(310),
    AdjRadiation: getPatientAnswer(311),
    cryoblation: getPatientAnswer(520),
    other: getPatientAnswer(521),
    otherspecify: getPatientAnswer(522),
    Treatmenttimeline: getPatientAnswer(312),
    sideeffects: getPatientAnswer(313),
    approachDate: getPatientAnswer(546),
    neoadjuvantDate: getPatientAnswer(548),
    adjuvantDate: getPatientAnswer(549),
    cryoablationDate: getPatientAnswer(550),
    otherDate: getPatientAnswer(551),
  };

  let reportText = [];

  const categoryId = getPatientAnswer(170);

  if (categoryId != "3") {
    return ``;
  }

  //Biopsy or Cancer Diagnosis Details
  //Diahnosis
  let biopsyReport = [];

  if (biopsy.typediagnosis) {
    biopsyReport.push(
      `${
        biopsy.typediagnosis === "Other"
          ? `${biopsy.typediagnosisother}`
          : biopsy.typediagnosis === "Ductal Carcinoma in Situ (DCIS)"
          ? `ductal carcinoma in situ (DCIS)`
          : biopsy.typediagnosis === "Lobular Carcinoma in Situ (LCIS)"
          ? `lobular carcinoma in situ (LCIS)`
          : biopsy.typediagnosis === "Invasive Ductal Carcinoma (IDC)"
          ? `invasive ductal carcinoma (IDC)`
          : biopsy.typediagnosis === "Invasive Lobular Carcinoma (ILC)"
          ? `invasive lobular carcinoma (ILC)`
          : biopsy.typediagnosis === "Inflammatory Breast Cancer"
          ? `inflammatory breast cancer`
          : biopsy.typediagnosis === "Unknown"
          ? `unknown`
          : ``
      }`
    );
  }

  if (biopsy.datediagnosis !== "") {
    biopsyReport.push(`date: ${formatReadableDate(biopsy.datediagnosis)}`);
  }

  if (biopsy.grade !== "Unknown" && biopsy.grade !== "") {
    biopsyReport.push(`grade: ${biopsy.grade}`);
  }

  if (biopsy.stage !== "Unknown" && biopsy.stage !== "") {
    biopsyReport.push(`stage: ${biopsy.stage}`);
  }

  if (biopsy.tumersize.length > 0) {
    biopsyReport.push(`tumor size: ${biopsy.tumersize} mm`);
  }

  if (biopsyReport.length > 0) {
    reportText.push(`Biopsy diagnosis of ${biopsyReport.join(", ")}.`);
  }

  //Location of cancer
  //Right
  if (biopsy.breastRight === "true") {
    const sentence = [];

    sentence.push(`Located in the right breast`);

    biopsy.upperOuterQuadrantRight === "true" &&
      sentence.push(`upper outer quadrant`);
    biopsy.upperInnerQuadrantRight === "true" &&
      sentence.push(`upper inner quadrant`);
    biopsy.lowerOuterQuadrantRight === "true" &&
      sentence.push(`lower outer quadrant`);
    biopsy.lowerInnerQuadrantRight === "true" &&
      sentence.push(`lower inner quadrant`);
    biopsy.centralNippleOuterQuadrantRight === "true" &&
      sentence.push(`central/nipple outer quadrant`);
    biopsy.unknownQuadrantRight === "true" && sentence.push(`unknown quadrant`);

    biopsy.clockpositionstatusRight === "known" &&
      sentence.push(
        `clock position ${formatBreastSymptoms(biopsy.clockpositionRight)}`
      );

    biopsy.distancenippleStatusRight === "known" &&
      sentence.push(`${biopsy.distancenippleRight} cm from nipple`);

    biopsy.LymphRight === "Yes" &&
      sentence.push(`lymph node involvement present`);

    biopsy.MetastasisRight === "Yes" &&
      sentence.push(
        `metastasis present${
          biopsy.locationRight ? ` at ${biopsy.locationRight}` : ``
        }`
      );

    reportText.push(sentence.join(", ") + ".");
  }

  //Left
  if (biopsy.breast === "true") {
    const sentence = [];

    sentence.push(`Located in the left breast`);

    biopsy.upperOuterQuadrant === "true" &&
      sentence.push(`upper outer quadrant`);
    biopsy.upperInnerQuadrant === "true" &&
      sentence.push(`upper inner quadrant`);
    biopsy.lowerOuterQuadrant === "true" &&
      sentence.push(`lower outer quadrant`);
    biopsy.lowerInnerQuadrant === "true" &&
      sentence.push(`lower inner quadrant`);
    biopsy.centralNippleOuterQuadrant === "true" &&
      sentence.push(`central/nipple outer quadrant`);
    biopsy.unknownQuadrant === "true" && sentence.push(`unknown quadrant`);

    biopsy.clockpositionstatus === "known" &&
      sentence.push(
        `clock position ${formatBreastSymptoms(biopsy.clockposition)}`
      );

    biopsy.distancenippleStatus === "known" &&
      sentence.push(`${biopsy.distancenipple} cm from nipple`);

    biopsy.Lymph === "Yes" && sentence.push(`lymph node involvement present`);

    biopsy.Metastasis === "Yes" &&
      sentence.push(
        `metastasis present${biopsy.location ? ` at ${biopsy.location}` : ``}`
      );

    reportText.push(sentence.join(", ") + ".");
  }

  
  //Treatement
  if (treatment.treatmentstatus === "Yes") {
    let treatmentreport = [];
    reportText.push(
      `${
        (treatment.Surgical !== "Not Applicable" &&
          treatment.Surgical.length > 0) ||
        (treatment.Neoadjuvant !== "Not Applicable" &&
          treatment.Neoadjuvant.length > 0) ||
        (treatment.Adjuvant !== "Not Applicable" &&
          treatment.Adjuvant.length > 0) ||
        (treatment.cryoblation !== "Not Applicable" &&
          treatment.cryoblation.length > 0) ||
        (treatment.other !== "Not Applicable" && treatment.other.length > 0) ||
        treatment.Treatmenttimeline.length > 0 ? `<strong>Treatment:</strong>`:``
      }`
    );

    
    //Surgical approach
    if (
      treatment.Surgical !== "Not Applicable" &&
      treatment.Surgical.length > 0
    ) {
      const sentence = [];

      if (treatment.surgery === "true") {
        sentence.push(`lumpectomy/breast-conserving surgery`);
      }

      if (treatment.Mastectomy === "true") {
        sentence.push(`mastectomy (partial or segmental)`);
      }

      if (treatment.Bilateral === "true") {
        sentence.push(`bilateral mastectomy`);
      }

      if (treatment.Sentinel === "true") {
        sentence.push(`sentinel lymph node biopsy`);
      }

      if (treatment.Axillary === "true") {
        sentence.push(`axillary lymph node dissection`);
      }

      if (treatment.Reconstruction === "true") {
        sentence.push(
          `reconstruction${
            treatment.ReconstructionType.length > 0 &&
            treatment.ReconstructionType !== "None"
              ? ` (${treatment.ReconstructionType.toLocaleLowerCase()})`
              : ""
          }`
        );
      }

      if (sentence.length > 0) {
        let text = `${sentence.join(", ")} ${
          sentence.length === 1 ? "is" : "are"
        } being ${treatment.Surgical.toLowerCase()}${
          treatment.approachDate.length > 0
            ? ` on ${formatReadableDate(treatment.approachDate)}`
            : ""
        }.`;

        // Capitalize the first letter
        text = text.charAt(0).toUpperCase() + text.slice(1);

        treatmentreport.push(`<ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>`+text+`</li></ol>`);
      }
    }
    //Neoadjuvant treatment planned (before surgery)
    if (
      treatment.Neoadjuvant !== "Not Applicable" &&
      treatment.Neoadjuvant.length > 0
    ) {
      treatmentreport.push(
        `<ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Neoadjuvant therapy ${treatment.Neoadjuvant.toLocaleLowerCase()}${
          treatment.neoadjuvantDate.length > 0
            ? ` on ${formatReadableDate(treatment.neoadjuvantDate)}`
            : ""
        }.</li></ol>`
      );
    }
    //Adjuvant treatment planned (after surgery)
    if (
      treatment.Adjuvant !== "Not Applicable" &&
      treatment.Adjuvant.length > 0
    ) {
      treatmentreport.push(
        `<ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Adjuvant therapy ${treatment.Adjuvant.toLocaleLowerCase()}${
          treatment.adjuvantDate.length > 0
            ? ` on ${formatReadableDate(treatment.adjuvantDate)}`
            : ""
        }.</li></ol>`
      );
    }
    //Cryoablation
    if (
      treatment.cryoblation !== "Not Applicable" &&
      treatment.cryoblation.length > 0
    ) {
      treatmentreport.push(
        `<ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Cryoablation ${treatment.cryoblation.toLocaleLowerCase()}${
          treatment.cryoablationDate.length > 0
            ? ` on ${formatReadableDate(treatment.cryoablationDate)}`
            : ""
        }.</li></ol>`
      );
    }
    //Other
    if (treatment.other !== "Not Applicable" && treatment.other.length > 0) {
      treatmentreport.push(
        `<ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>${treatment.otherspecify} ${treatment.other.toLowerCase()}${
          treatment.otherDate.length > 0
            ? ` on ${formatReadableDate(treatment.otherDate)}`
            : ""
        }.</li></ol>`
      );
    }
    //Treatment timeline and details
    if (treatment.Treatmenttimeline.length > 0) {
      treatmentreport.push(
        `<ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Treatment timeline and details: ${treatment.Treatmenttimeline}.</li></ol>`
      );
    }
    
    reportText.push(treatmentreport.join(""))
  }


  return reportText.join("<br/>");
}
