import { ResponsePatientForm } from "@/pages/TechnicianPatientIntakeForm/TechnicianPatientIntakeForm";
import { formatReadableDate } from "@/utlis/calculateAge";

export function SFormGeneration(
  patientInTakeForm: ResponsePatientForm[]
): string {
  const getPatientAnswer = (id: number) =>
    patientInTakeForm.find((q) => q.questionId === id)?.answer || "";

  const pregnant = getPatientAnswer(9);
  const ibisScore = getPatientAnswer(14);
  const auriaStatus = getPatientAnswer(15);
  const auriaResult = getPatientAnswer(16);
  const geneticTest = getPatientAnswer(17);
  const mutationFound = getPatientAnswer(18);
  const mutationType = getPatientAnswer(19);
  const mutationSpecify = getPatientAnswer(20);
  const relatives = getPatientAnswer(41);
  const addtionalCommentsRiskStratification = getPatientAnswer(23);

  const previousSurgery = {
    previousSurgeryYesNo: getPatientAnswer(66),

    mastectomy: getPatientAnswer(67),
    mastectomyPosition: getPatientAnswer(68),
    mastectomyDate: getPatientAnswer(506),
    mastectomyDateAnother: getPatientAnswer(533),

    lumpectomy: getPatientAnswer(69),
    lumpectomyPosition: getPatientAnswer(70),
    lumpectomyDate: getPatientAnswer(507),
    lumpectomyDateAnother: getPatientAnswer(534),

    cystAspiration: getPatientAnswer(71),
    cystAspirationPosition: getPatientAnswer(72),
    cystAspirationDate: getPatientAnswer(508),
    cystAspirationDateAnother: getPatientAnswer(535),

    breastReconstruction: getPatientAnswer(73),
    breastReconstructionPosition: getPatientAnswer(74),
    breastReconstructionDate: getPatientAnswer(509),
    breastReconstructionDateAnother: getPatientAnswer(536),

    augmentation: getPatientAnswer(75),
    augmentationPosition: getPatientAnswer(76),
    augmentationDate: getPatientAnswer(510),
    augmentationDateAnother: getPatientAnswer(537),

    breastSurgeryOthers: getPatientAnswer(77),
    breastSurgeryOthersSpecify: getPatientAnswer(78),
    breastSurgeryOthersSpecifyDirection: getPatientAnswer(489),
    breastSurgeryOthersDate: getPatientAnswer(511),
    breastSurgeryOthersDateAnother: getPatientAnswer(538),
  };

  const breastimplants = {
    breastimplantsyesno: getPatientAnswer(79),
    implantsSpecify: getPatientAnswer(80),
    implantsSpecifyBoth: getPatientAnswer(527),
    implantsOthersSpecify: getPatientAnswer(81),
    implantsOthersSpecifyBoth: getPatientAnswer(528),
    implantLeft: getPatientAnswer(423),
    implantDateLeft: getPatientAnswer(82),
    implantDateBoth: getPatientAnswer(529),
    implantRight: getPatientAnswer(167),
    implantDateRight: getPatientAnswer(424),
    implantsRightSpecify: getPatientAnswer(168),
    implantsRightOthersSpecify: getPatientAnswer(169),
    implantBothDirection: getPatientAnswer(518),
    explants: getPatientAnswer(83),
    explantsBoth: getPatientAnswer(530),
    explantsDate: getPatientAnswer(84),
    explantsDateBoth: getPatientAnswer(84),
    explantsDateKnown: getPatientAnswer(497),
    explantsDateKnownRight: getPatientAnswer(531),
    explantsDateKnownBoth: getPatientAnswer(532),
    denseBreasts: getPatientAnswer(85),
    additionalComments: getPatientAnswer(86),
    explantsRight: getPatientAnswer(294),
    explantsDateRight: getPatientAnswer(295),
    explantsDateRightKnown: getPatientAnswer(498),
  };

  const densbreast = getPatientAnswer(85);
  const Additionalcomments = getPatientAnswer(86);

  const breastSymptoms = {
    breastCancerSymptoms: getPatientAnswer(87),
    lumpOrThick: getPatientAnswer(88),
    lumpLeft: getPatientAnswer(90),
    lumpRight: getPatientAnswer(89),
    lumpDate: getPatientAnswer(91),
    lumpSize: getPatientAnswer(92),
    lumpDateRight: getPatientAnswer(425),
    lumpSizeRight: getPatientAnswer(426),
    lumpDetails: getPatientAnswer(93),
    skinChanges: getPatientAnswer(94),
    skinRight: getPatientAnswer(95),
    skinLeft: getPatientAnswer(96),
    skinDate: getPatientAnswer(97),
    skinDateRight: getPatientAnswer(427),
    skinDetails: getPatientAnswer(98),
    skinOther: getPatientAnswer(495),
    skinOtherRight: getPatientAnswer(488),
    skinChangesType: getPatientAnswer(486),
    skinChangesTypeRight: getPatientAnswer(487),
    nippleDischarge: getPatientAnswer(99),
    nippleRight: getPatientAnswer(100),
    nippleLeft: getPatientAnswer(101),
    nippleDate: getPatientAnswer(102),
    nippleDateRight: getPatientAnswer(429),
    nippleDetails: getPatientAnswer(103),
    breastPain: getPatientAnswer(106),
    breastPainRight: getPatientAnswer(107),
    breastPainLeft: getPatientAnswer(108),
    breastPainDate: getPatientAnswer(109),
    breastPainDateRight: getPatientAnswer(428),
    breastPainDetails: getPatientAnswer(110),
    nipplePain: getPatientAnswer(111),
    nipplePainRight: getPatientAnswer(112),
    nipplePainLeft: getPatientAnswer(113),
    nipplePainDate: getPatientAnswer(114),
    nipplePainDateRight: getPatientAnswer(430),
    nipplePainDetails: getPatientAnswer(115),
    nipplePosition: getPatientAnswer(104),
    nipplePositionDetails: getPatientAnswer(105),
    nipplePositionRight: getPatientAnswer(431),
    nipplePositionRightDetails: getPatientAnswer(519),
    lymphNodes: getPatientAnswer(116),
    lymphNodesRight: getPatientAnswer(117),
    lymphNodesLeft: getPatientAnswer(118),
    locationAxillary: getPatientAnswer(119),
    locationAxillaryDuration: getPatientAnswer(432),
    locationAxillarySize: getPatientAnswer(120),
    locationAxillaryDurationRight: getPatientAnswer(539),
    locationAxillarySizeRight: getPatientAnswer(540),
    locationInBetween: getPatientAnswer(433),
    locationInBetweenDuration: getPatientAnswer(121),
    locationInBetweenSize: getPatientAnswer(512),
    locationOther: getPatientAnswer(513),
    locationOtherSpecify: getPatientAnswer(514),
    locationOtherDuration: getPatientAnswer(515),
    locationOtherSize: getPatientAnswer(516),
    lymphNodesDetails: getPatientAnswer(517),
    others: getPatientAnswer(122),
    othersDetails: getPatientAnswer(123),

    categoryId: getPatientAnswer(170),
    cbreastCancerSymptoms: getPatientAnswer(322),
    lumpOrThickStatusCheck: getPatientAnswer(323),
    lumpOrThickStatus: getPatientAnswer(325),
    skinChangesStatusCheck: getPatientAnswer(329),
    skinChangesStatus: getPatientAnswer(331),
    nippleDischargeStatusCheck: getPatientAnswer(334),
    nippleDischargeStatus: getPatientAnswer(336),
    breastPainStatusCheck: getPatientAnswer(339),
    breastPainStatus: getPatientAnswer(341),
    nipplePainStatusCheck: getPatientAnswer(344),
    nipplePainStatus: getPatientAnswer(346),
    lymphNodesStatusCheck: getPatientAnswer(349),
    lymphNodesStatus: getPatientAnswer(351),
    othersStatusCheck: getPatientAnswer(354),
    othersStatus: getPatientAnswer(355),
  };

  const previousImaging = {
    thermogramYesNo: getPatientAnswer(124),
    thermogramDate: getPatientAnswer(125),
    thermogramDateKnown: getPatientAnswer(499),
    thermogramResult: getPatientAnswer(126),
    thermogramReportAvailable: getPatientAnswer(127),
    thermogramReportDetails: getPatientAnswer(128),

    mammogramYesNo: getPatientAnswer(129),
    mammogramDateKnown: getPatientAnswer(500),
    mammogramDate: getPatientAnswer(130),
    mammogramResult: getPatientAnswer(131),
    mammogramReportAvailable: getPatientAnswer(132),
    mammogramReportDetails: getPatientAnswer(133),

    breastUltrasoundYesNo: getPatientAnswer(134),
    breastUltrasoundDateKnown: getPatientAnswer(501),
    breastUltrasoundDate: getPatientAnswer(135),
    breastUltrasoundResult: getPatientAnswer(136),
    breastUltrasoundReportAvailable: getPatientAnswer(137),
    breastUltrasoundReportDetails: getPatientAnswer(138),

    breastMRIYesNo: getPatientAnswer(139),
    breastMRIDateKnown: getPatientAnswer(502),
    breastMRIDate: getPatientAnswer(140),
    breastMRIResult: getPatientAnswer(141),
    breastMRIReportAvailable: getPatientAnswer(142),
    breastMRIReportDetails: getPatientAnswer(143),

    petctYesNo: getPatientAnswer(144),
    petctDateKnown: getPatientAnswer(503),
    petctDate: getPatientAnswer(145),
    petctResult: getPatientAnswer(146),
    petctReportAvailable: getPatientAnswer(147),
    petctReportDetails: getPatientAnswer(148),

    qtImagingYesNo: getPatientAnswer(149),
    qtimageDateKnown: getPatientAnswer(504),
    qtimageDate: getPatientAnswer(150),
    qtimageResult: getPatientAnswer(151),
    qtimageReportAvailable: getPatientAnswer(152),
    qtimageReportDetails: getPatientAnswer(153),

    otherImagingYesNo: getPatientAnswer(154),
    otherImagingDateKnown: getPatientAnswer(505),
    otherImagingDate: getPatientAnswer(155),
    otherImagingResult: getPatientAnswer(156),
    otherImagingReportAvailable: getPatientAnswer(157),
    otherImagingReportDetails: getPatientAnswer(158),

    additionalComments: getPatientAnswer(159),
  };

  const biopsy = {
    previousBiopsy: getPatientAnswer(160),
    previousBiopsyDate: getPatientAnswer(161),
    biopsyResults: getPatientAnswer(162),
    biopsyResultsDetails: getPatientAnswer(163),
    reportAvailablity: getPatientAnswer(164),
    reportDetails: getPatientAnswer(165),
    additionalComments: getPatientAnswer(166),
    biopsyLeft: getPatientAnswer(434),
    biopsyRight: getPatientAnswer(435),
    biopsyRightType: getPatientAnswer(436),
    biopsyLeftType: getPatientAnswer(437),

    performed: getPatientAnswer(239),
    Biopsyresult: getPatientAnswer(243),
    Benignother: getPatientAnswer(244),
    Atypicalother: getPatientAnswer(245),
    Highrisklesionother: getPatientAnswer(246),
    Pathology: getPatientAnswer(247),
  };

  let report = [];

  //Personal History
  //Pregnant Lactating
  if (pregnant === "Yes") {
    report.push("The patient is currently pregnant/lactating.<br/>");
  }

  //Risk Stratification
  //IBIS/Tyrer
  if (ibisScore.length > 0) {
    report.push(`IBIS/Tyrer-Cuzick Breast Cancer Risk ${ibisScore}%.<br/>`);
  }

  //AURIA Breast Cancer
  if (auriaStatus === "Done") {
    report.push(
      `AURIA breast cancer tear test performed with ${auriaResult.toLocaleLowerCase()} result.<br/>`
    );
  }

  //Genetic Testing
  if (geneticTest === "Yes") {
    let text = "Genetic testing for breast cancer genes performed";

    if (mutationFound === "Yes" && mutationType !== "Unknown") {
      text += `, mutation found in ${
        mutationType !== "Other" ? mutationType : mutationSpecify
      }.`;
    } else if (mutationFound === "Yes" && mutationType === "Unknown") {
      text += ", mutation found.";
    } else {
      text += ".";
    }

    report.push(text + "<br/>");
  }

  //Addtional Comments
  if (addtionalCommentsRiskStratification.length > 0) {
    report.push(addtionalCommentsRiskStratification + ".<br/>");
  }

  //Family History
  if (relatives === "Yes") {
    report.push(`Family history of breast cancer is present.<br/>`);
  } else if (relatives === "No") {
    report.push(`No family history of breast cancer.<br/>`);
  }

  function formatSurgeryText({
    condition,
    type,
    position,
    date,
    dateAnother,
    customName,
  }: {
    condition: string;
    type: string; // "mastectomy", "lumpectomy", etc.
    position: string;
    date: string;
    dateAnother?: string;
    customName?: string; // used for "others"
  }): string | null {
    if (condition !== "true") return null;

    const surgeryName = customName
      ? customName.toLowerCase()
      : type.toLowerCase();

    if (position === "Both") {
      let parts: string[] = [];
      if (date?.length > 0) {
        parts.push(`right: ${formatReadableDate(date)}`);
      }
      if (dateAnother && dateAnother?.length > 0) {
        parts.push(`left: ${formatReadableDate(dateAnother)}`);
      }

      return parts.length
        ? `${position} ${surgeryName} done on ${parts.join(", ")}.`
        : `${position} ${surgeryName} done.`;
    }

    return `${position} ${surgeryName} done on ${formatReadableDate(date)}.`;
  }

  //Previous Breast Surgery
  if (previousSurgery.previousSurgeryYesNo === "Yes") {
    let text: string[] = [];

    const surgeries = [
      {
        condition: previousSurgery.mastectomy,
        type: "mastectomy",
        position: previousSurgery.mastectomyPosition,
        date: previousSurgery.mastectomyDate,
        dateAnother: previousSurgery.mastectomyDateAnother,
      },
      {
        condition: previousSurgery.lumpectomy,
        type: "lumpectomy",
        position: previousSurgery.lumpectomyPosition,
        date: previousSurgery.lumpectomyDate,
        dateAnother: previousSurgery.lumpectomyDateAnother,
      },
      {
        condition: previousSurgery.cystAspiration,
        type: "cyst aspiration",
        position: previousSurgery.cystAspirationPosition,
        date: previousSurgery.cystAspirationDate,
        dateAnother: previousSurgery.cystAspirationDateAnother,
      },
      {
        condition: previousSurgery.breastReconstruction,
        type: "breast reconstruction",
        position: previousSurgery.breastReconstructionPosition,
        date: previousSurgery.breastReconstructionDate,
        dateAnother: previousSurgery.breastReconstructionDateAnother,
      },
      {
        condition: previousSurgery.augmentation,
        type: "augmentation",
        position: previousSurgery.augmentationPosition,
        date: previousSurgery.augmentationDate,
        dateAnother: previousSurgery.augmentationDateAnother,
      },
      {
        condition: previousSurgery.breastSurgeryOthers,
        type: "others",
        position: previousSurgery.breastSurgeryOthersSpecifyDirection,
        date: previousSurgery.breastSurgeryOthersDate,
        dateAnother: previousSurgery.breastSurgeryOthersDateAnother,
        customName: previousSurgery.breastSurgeryOthersSpecify,
      },
    ];

    surgeries.forEach((s) => {
      const line = formatSurgeryText(s);
      if (line) text.push(line);
    });

    report.push(text.join(" ") + "<br/>");
  }

  //Breast Implants
  if (breastimplants.breastimplantsyesno === "Yes") {
    let text = "";
    // let side = "";
    // if (breastimplants.implantBothDirection === "true") side = "both";
    // if (breastimplants.implantleft === "true") side = "left";
    // if (breastimplants.implantright === "true") side = "right";

    // let type = "";
    // if (breastimplants.implantsSpecify !== "Other") {
    //   type = breastimplants.implantsSpecify;
    // } else {
    //   type = breastimplants.implantsOthersSpecify;
    // }

    // let text = `Breast implant present on the ${side}, ${type.toLowerCase()} type, since ${
    //   breastimplants.implantDateLeft
    // } year${breastimplants.implantDateLeft === "1" ? "" : "s"}${
    //   breastimplants.explants === "Yes"
    //     ? `;  explant done${
    //         breastimplants.explantsDateKnown === "Yes"
    //           ? ` ${breastimplants.explantsDate} year${
    //               breastimplants.explantsDate === "1" ? "" : "s"
    //             } ago`
    //           : ""
    //       }.`
    //     : "."
    // }`;

    if (breastimplants.implantBothDirection === "true") {
      text += `Breast implant present on the both, ${
        breastimplants.implantsSpecifyBoth.toLocaleLowerCase() !== "other"
          ? breastimplants.implantsSpecifyBoth.toLocaleLowerCase()
          : breastimplants.implantsOthersSpecifyBoth.toLocaleLowerCase()
      } type, since ${breastimplants.implantDateBoth} year${
        breastimplants.implantDateBoth === "1" ? "" : "s"
      }${
        breastimplants.explantsBoth === "Yes"
          ? `,  explant done${
              breastimplants.explantsDateKnownBoth === "Yes"
                ? ` ${breastimplants.explantsDateBoth} year${
                    breastimplants.explantsDateBoth === "1" ? "" : "s"
                  } ago`
                : ""
            }.`
          : "."
      }`;
    } else if (
      breastimplants.implantLeft === "true" ||
      breastimplants.implantRight === "true" ||
      (breastimplants.implantLeft === "true" &&
        breastimplants.implantRight === "true")
    ) {
      text += `Breast implant present on the`;

      if (breastimplants.implantLeft === "true") {
        text += ` left, ${
          breastimplants.implantsSpecify.toLocaleLowerCase() !== "other"
            ? breastimplants.implantsSpecify.toLocaleLowerCase()
            : breastimplants.implantsOthersSpecify.toLocaleLowerCase()
        } type, since ${breastimplants.implantDateLeft} year${
          breastimplants.implantDateLeft === "1" ? "" : "s"
        }${
          breastimplants.explants === "Yes"
            ? `,  explant done${
                breastimplants.explantsDateKnown === "Yes"
                  ? ` ${breastimplants.explantsDate} year${
                      breastimplants.explantsDate === "1" ? "" : "s"
                    } ago`
                  : ""
              }`
            : ""
        }`;
      }
      if (breastimplants.implantRight === "true") {
        text += `${breastimplants.implantLeft === "true" ? `,` : ""} right, ${
          breastimplants.implantsRightSpecify.toLocaleLowerCase() !== "other"
            ? breastimplants.implantsRightSpecify.toLocaleLowerCase()
            : breastimplants.implantsRightOthersSpecify.toLocaleLowerCase()
        } type, since ${breastimplants.implantDateRight} year${
          breastimplants.implantDateRight === "1" ? "" : "s"
        }${
          breastimplants.explantsRight === "Yes"
            ? `,  explant done${
                breastimplants.explantsDateKnownRight === "Yes"
                  ? ` ${breastimplants.explantsDateRight} year${
                      breastimplants.explantsDateRight === "1" ? "" : "s"
                    } ago`
                  : ""
              }`
            : ""
        }`;
      }

      text += `.`;
    }
    report.push(text + "<br/>");
  }

  //Dense breast
  if (densbreast === "Yes") {
    report.push(`The patient has dense breast(per previous imaging).<br/>`);
  }

  //Additional Comments
  if (Additionalcomments.length > 0) {
    report.push(`${Additionalcomments}.<br/>`);
  }

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

  //Current Breast Symptoms
  if (breastSymptoms.breastCancerSymptoms === "Yes") {
    let text = [];

    //Lump or thickening
    if (breastSymptoms.lumpOrThick === "true") {
      if (
        breastSymptoms.categoryId === "4" &&
        breastSymptoms.cbreastCancerSymptoms === "Yes" &&
        breastSymptoms.lumpOrThickStatusCheck === "true" &&
        breastSymptoms.lumpOrThickStatus === "Resolved"
      ) {
        text.push(
          `<ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Previous symptoms of lump or thickening now resolved.</li></ol>`
        );
      } else {
        text.push(
          `<ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Lump or thickening${
            breastSymptoms.lumpLeft.length > 0 ||
            breastSymptoms.lumpRight.length > 0 ||
            (breastSymptoms.lumpLeft.length > 0 &&
              breastSymptoms.lumpRight.length > 0)
              ? ` in the ${
                  breastSymptoms.lumpLeft.length > 0
                    ? `left breast at ${formatBreastSymptoms(
                        breastSymptoms.lumpLeft
                      )} since ${breastSymptoms.lumpDate} months,${
                        breastSymptoms.lumpSize.toLocaleLowerCase() ===
                        "bigger than a grape"
                          ? ` bigger than a grape`
                          : ` size of a ${breastSymptoms.lumpSize.toLocaleLowerCase()}`
                      }${breastSymptoms.lumpRight.length > 0 ? `, ` : ""}`
                    : ""
                }${
                  breastSymptoms.lumpRight.length > 0
                    ? `right breast at ${formatBreastSymptoms(
                        breastSymptoms.lumpRight
                      )} since ${breastSymptoms.lumpDateRight} months,${
                        breastSymptoms.lumpSizeRight.toLocaleLowerCase() ===
                        "bigger than a grape"
                          ? ` bigger than a grape`
                          : ` size of a ${breastSymptoms.lumpSizeRight.toLocaleLowerCase()}`
                      }`
                    : ""
                }${
                  breastSymptoms.lumpDetails.length > 0
                    ? `, ${breastSymptoms.lumpDetails}`
                    : ``
                }`
              : ""
          }${
            breastSymptoms.categoryId === "4" &&
            breastSymptoms.cbreastCancerSymptoms === "Yes" &&
            breastSymptoms.lumpOrThickStatusCheck === "true" &&
            breastSymptoms.lumpOrThickStatus !== "Resolved"
              ? `: ${breastSymptoms.lumpOrThickStatus.toLocaleLowerCase()}`
              : ``
          }.</li></ol>`
        );
      }
    }

    //Skin Changes
    if (breastSymptoms.skinChanges === "true") {
      if (
        breastSymptoms.categoryId === "4" &&
        breastSymptoms.cbreastCancerSymptoms === "Yes" &&
        breastSymptoms.skinChangesStatusCheck === "true" &&
        breastSymptoms.skinChangesStatus === "Resolved"
      ) {
        text.push(
          `<ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Previous symptoms of skin changes now resolved.</li></ol>`
        );
      } else {
        text.push(
          `<ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Skin changes${
            breastSymptoms.skinLeft.length > 0 ||
            breastSymptoms.skinRight.length > 0 ||
            (breastSymptoms.skinLeft.length > 0 &&
              breastSymptoms.skinRight.length > 0)
              ? ` in the ${
                  breastSymptoms.skinLeft.length > 0
                    ? `left breast at ${formatBreastSymptoms(
                        breastSymptoms.skinLeft
                      )} since ${breastSymptoms.skinDate} months, ${
                        breastSymptoms.skinChangesType === "Other"
                          ? breastSymptoms.skinOther.toLocaleLowerCase()
                          : breastSymptoms.skinChangesType.toLocaleLowerCase()
                      } is noted${
                        breastSymptoms.skinRight.length > 0 ? `, ` : ""
                      }`
                    : ""
                }${
                  breastSymptoms.skinRight.length > 0
                    ? `right breast at ${formatBreastSymptoms(
                        breastSymptoms.skinRight
                      )} since ${breastSymptoms.skinDateRight} months, ${
                        breastSymptoms.skinChangesTypeRight === "Other"
                          ? breastSymptoms.skinOtherRight.toLocaleLowerCase()
                          : breastSymptoms.skinChangesTypeRight.toLocaleLowerCase()
                      } is noted`
                    : ""
                }${
                  breastSymptoms.skinDetails.length > 0
                    ? `, ${breastSymptoms.skinDetails}`
                    : ``
                }`
              : ""
          }${
            breastSymptoms.categoryId === "4" &&
            breastSymptoms.cbreastCancerSymptoms === "Yes" &&
            breastSymptoms.skinChangesStatusCheck === "true" &&
            breastSymptoms.skinChangesStatus !== "Resolved"
              ? `: ${breastSymptoms.skinChangesStatus.toLocaleLowerCase()}`
              : ``
          }.</li></ol>`
        );
      }
    }

    //Nipple Discharge
    if (breastSymptoms.nippleDischarge === "true") {
      if (
        breastSymptoms.categoryId === "4" &&
        breastSymptoms.cbreastCancerSymptoms === "Yes" &&
        breastSymptoms.nippleDischargeStatusCheck === "true" &&
        breastSymptoms.nippleDischargeStatus === "Resolved"
      ) {
        text.push(
          `<ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Previous symptoms of nipple discharge now resolved.</li></ol>`
        );
      } else {
        text.push(
          `<ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Nipple discharge${
            breastSymptoms.nippleLeft.length > 0 ||
            breastSymptoms.nippleRight.length > 0 ||
            (breastSymptoms.nippleLeft.length > 0 &&
              breastSymptoms.nippleRight.length > 0)
              ? ` in the${
                  breastSymptoms.nippleLeft === "true"
                    ? ` left breast since ${breastSymptoms.nippleDate} months${
                        breastSymptoms.nippleRight === "true" ? "," : ""
                      }`
                    : ""
                }${
                  breastSymptoms.nippleRight === "true"
                    ? ` right breast since ${breastSymptoms.nippleDateRight} months`
                    : ""
                }${
                  breastSymptoms.nippleDetails.length > 0
                    ? `, ${breastSymptoms.nippleDetails}`
                    : ``
                }`
              : ""
          }${
            breastSymptoms.categoryId === "4" &&
            breastSymptoms.cbreastCancerSymptoms === "Yes" &&
            breastSymptoms.nippleDischargeStatusCheck === "true" &&
            breastSymptoms.nippleDischargeStatus !== "Resolved"
              ? `: ${breastSymptoms.nippleDischargeStatus.toLocaleLowerCase()}`
              : ``
          }.</li></ol>`
        );
      }
    }

    //Breast Pain
    if (breastSymptoms.breastPain === "true") {
      if (
        breastSymptoms.categoryId === "4" &&
        breastSymptoms.cbreastCancerSymptoms === "Yes" &&
        breastSymptoms.breastPainStatusCheck === "true" &&
        breastSymptoms.breastPainStatus === "Resolved"
      ) {
        text.push(
          `<ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Previous symptoms of breast pain now resolved.</li></ol>`
        );
      } else {
        text.push(
          `<ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Breast pain${
            breastSymptoms.breastPainLeft.length > 0 ||
            breastSymptoms.breastPainRight.length > 0 ||
            (breastSymptoms.breastPainLeft.length > 0 &&
              breastSymptoms.breastPainRight.length > 0)
              ? ` in the${
                  breastSymptoms.breastPainLeft.length > 0
                    ? ` left breast at ${formatBreastSymptoms(
                        breastSymptoms.breastPainLeft
                      )} since ${breastSymptoms.breastPainDate} months${
                        breastSymptoms.breastPainRight.length > 0 ? "," : ""
                      }`
                    : ""
                }${
                  breastSymptoms.breastPainRight.length > 0
                    ? ` right breast ${formatBreastSymptoms(
                        breastSymptoms.breastPainRight
                      )} since ${breastSymptoms.breastPainDateRight} months`
                    : ""
                }${
                  breastSymptoms.breastPainDetails.length > 0
                    ? `, ${breastSymptoms.breastPainDetails}`
                    : ``
                }`
              : ""
          }${
            breastSymptoms.categoryId === "4" &&
            breastSymptoms.cbreastCancerSymptoms === "Yes" &&
            breastSymptoms.breastPainStatusCheck === "true" &&
            breastSymptoms.breastPainStatus !== "Resolved"
              ? `: ${breastSymptoms.breastPainStatus.toLocaleLowerCase()}`
              : ``
          }.</li></ol>`
        );
      }
    }

    //Nipple Changes
    if (breastSymptoms.nipplePain === "true") {
      if (
        breastSymptoms.categoryId === "4" &&
        breastSymptoms.cbreastCancerSymptoms === "Yes" &&
        breastSymptoms.nipplePainStatusCheck === "true" &&
        breastSymptoms.nipplePainStatus === "Resolved"
      ) {
        text.push(
          `<ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Previous symptoms of nipple changes now resolved.</li></ol>`
        );
      } else {
        text.push(
          `<ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Nipple changes${
            breastSymptoms.nipplePainLeft.length > 0 ||
            breastSymptoms.nipplePainRight.length > 0 ||
            (breastSymptoms.nipplePainLeft.length > 0 &&
              breastSymptoms.nipplePainRight.length > 0)
              ? ` in the${
                  breastSymptoms.nipplePainLeft === "true"
                    ? ` left breast${
                        breastSymptoms.nipplePosition
                          ? `${
                              breastSymptoms.nipplePosition === "Other"
                                ? ` (${breastSymptoms.nipplePositionDetails.toLowerCase()})`
                                : ` (${breastSymptoms.nipplePosition.toLowerCase()})`
                            }`
                          : ``
                      } since ${breastSymptoms.nipplePainDate} months${
                        breastSymptoms.nipplePainRight === "true" ? "," : ""
                      }`
                    : ""
                }${
                  breastSymptoms.nipplePainRight === "true"
                    ? ` right breast${
                        breastSymptoms.nipplePositionRight
                          ? `${
                              breastSymptoms.nipplePositionRight === "Other"
                                ? ` (${breastSymptoms.nipplePositionRightDetails.toLowerCase()})`
                                : ` (${breastSymptoms.nipplePositionRight.toLowerCase()})`
                            }`
                          : ``
                      } since ${breastSymptoms.nipplePainDateRight} months`
                    : ""
                }${
                  breastSymptoms.nipplePainDetails.length > 0
                    ? `, ${breastSymptoms.nipplePainDetails}`
                    : ``
                }`
              : ""
          }${
            breastSymptoms.categoryId === "4" &&
            breastSymptoms.cbreastCancerSymptoms === "Yes" &&
            breastSymptoms.nipplePainStatusCheck === "true" &&
            breastSymptoms.nipplePainStatus !== "Resolved"
              ? `: ${breastSymptoms.nipplePainStatus.toLocaleLowerCase()}`
              : ``
          }.</li></ol>`
        );
      }
    }

    //Lymp node swelling
    if (breastSymptoms.lymphNodes === "true") {
      if (
        breastSymptoms.categoryId === "4" &&
        breastSymptoms.cbreastCancerSymptoms === "Yes" &&
        breastSymptoms.lymphNodesStatusCheck === "true" &&
        breastSymptoms.lymphNodesStatus === "Resolved"
      ) {
        text.push(
          `<ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Previous symptoms of lymph node swelling now resolved.</li></ol>`
        );
      } else {
        text.push(
          `<ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Swelling${
            (breastSymptoms.lymphNodesRight === "true" ||
            breastSymptoms.lymphNodesLeft === "true" ||
            (breastSymptoms.lymphNodesRight === "true" &&
              breastSymptoms.lymphNodesLeft === "true")) &&
              breastSymptoms.locationAxillary === "true"
              ? ` in axilla (armpit) on the
              ${
                breastSymptoms.lymphNodesLeft === "true"
                  ? ` left side${
                      breastSymptoms.lymphNodesLeft === "true" ? "," : ""
                    } since ${
                      breastSymptoms.locationAxillaryDurationRight
                    } months,${
                      breastSymptoms.locationAxillarySizeRight.toLocaleLowerCase() ===
                      "bigger than a grape"
                        ? ` bigger than a grape`
                        : ` size of a ${breastSymptoms.locationAxillarySizeRight.toLocaleLowerCase()}`
                    }${breastSymptoms.lymphNodesRight === "true" ? "," : ""}`
                  : ""
              }${
                  breastSymptoms.lymphNodesRight === "true"
                    ? ` right side${
                        breastSymptoms.lymphNodesRight === "true" ? "," : ""
                      } since ${
                        breastSymptoms.locationAxillaryDuration
                      } months,${
                        breastSymptoms.locationAxillarySize.toLocaleLowerCase() ===
                        "bigger than a grape"
                          ? ` bigger than a grape`
                          : ` size of a ${breastSymptoms.locationAxillarySize.toLocaleLowerCase()}`
                      }`
                    : ""
                }`
              : ``
          }${
            breastSymptoms.locationInBetween === "true"
              ? ` ${
                  (breastSymptoms.lymphNodesRight === "true" ||
            breastSymptoms.lymphNodesLeft === "true" ||
            (breastSymptoms.lymphNodesRight === "true" &&
              breastSymptoms.lymphNodesLeft === "true")) &&
              breastSymptoms.locationAxillary === "true"
                    ? `/ `
                    : ""
                }inbetween chest since ${
                  breastSymptoms.locationInBetweenDuration
                } months,${
                  breastSymptoms.locationInBetweenSize.toLocaleLowerCase() ===
                  "bigger than a grape"
                    ? ` bigger than a grape`
                    : ` size of a ${breastSymptoms.locationInBetweenSize.toLocaleLowerCase()}`
                }`
              : ``
          }${
            breastSymptoms.locationOther === "true"
              ? ` ${breastSymptoms.locationInBetween === "true" ? "/":"in" } ${breastSymptoms.locationOtherSpecify.toLocaleLowerCase()} since ${
                  breastSymptoms.locationOtherDuration
                } months,${
                  breastSymptoms.locationOtherSize.toLocaleLowerCase() ===
                  "bigger than a grape"
                    ? ` bigger than a grape`
                    : ` size of a ${breastSymptoms.locationOtherSize.toLocaleLowerCase()}`
                }`
              : ``
          }${
            breastSymptoms.lymphNodesDetails.length > 0
              ? `, ${breastSymptoms.lymphNodesDetails}`
              : ``
          }${
            breastSymptoms.categoryId === "4" &&
            breastSymptoms.cbreastCancerSymptoms === "Yes" &&
            breastSymptoms.lymphNodesStatusCheck === "true" &&
            breastSymptoms.lymphNodesStatus !== "Resolved"
              ? `: ${breastSymptoms.lymphNodesStatus.toLocaleLowerCase()}`
              : ``
          }.</li></ol>`
        );
      }
    }

    //Others
    if (breastSymptoms.others === "true") {
      if (
        breastSymptoms.categoryId === "4" &&
        breastSymptoms.cbreastCancerSymptoms === "Yes" &&
        breastSymptoms.othersStatusCheck === "true" &&
        breastSymptoms.othersStatus === "Resolved"
      ) {
        text.push(
          `<ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Previous symptoms of ${breastSymptoms.othersDetails} now resolved.</li></ol>`
        );
      } else {
        text.push(
          `<ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>${
            breastSymptoms.othersDetails
          }${
            breastSymptoms.categoryId === "4" &&
            breastSymptoms.cbreastCancerSymptoms === "Yes" &&
            breastSymptoms.othersStatusCheck === "true" &&
            breastSymptoms.othersStatus !== "Resolved"
              ? `: ${breastSymptoms.othersStatus.toLocaleLowerCase()}`
              : ``
          }.</li></ol>`
        );
      }
    }

    if (text.length > 0) {
      report.push(
        "<strong>Current breast symptoms:</strong><br/>" + text.join("")
      );
    }
  } else if (breastSymptoms.breastCancerSymptoms === "No") {
    report.push(`Patient is asymptomatic.<br/>`);
  }

  //Previous Imaging in past 3 years

  const generatepreviousImaging = (
    label: string,
    yesNo: string,
    dateknown: string,
    date: string,
    result: string,
    reportAvailable: string
  ) => {
    if (yesNo !== "Yes") {
      return ``;
    }

    return `<ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>${label}${
      dateknown === "Known" && date.length > 0
        ? ` performed on ${formatReadableDate(date)}`
        : dateknown === "Unknown"
        ? ` date unknown`
        : ""
    }, result ${result.toLocaleLowerCase()}.${
      reportAvailable === "Not Available" ? ` Report not available.` : ``
    }</li></ol>`;
  };

  let previousImagingReport = [];

  //Thermogram
  if (previousImaging.thermogramYesNo === "Yes") {
    previousImagingReport.push(
      generatepreviousImaging(
        "Thermogram",
        previousImaging.thermogramYesNo,
        previousImaging.thermogramDateKnown,
        previousImaging.thermogramDate,
        previousImaging.thermogramResult,
        previousImaging.thermogramReportAvailable
      )
    );
  }

  //Mammogram
  if (previousImaging.mammogramYesNo === "Yes")
    previousImagingReport.push(
      generatepreviousImaging(
        "Mammogram",
        previousImaging.mammogramYesNo,
        previousImaging.mammogramDateKnown,
        previousImaging.mammogramDate,
        previousImaging.mammogramResult,
        previousImaging.mammogramReportAvailable
      )
    );

  //Breast Ultrasound
  if (previousImaging.breastUltrasoundYesNo === "Yes")
    previousImagingReport.push(
      generatepreviousImaging(
        "Breast ultrasound / HERscan",
        previousImaging.breastUltrasoundYesNo,
        previousImaging.breastUltrasoundDateKnown,
        previousImaging.breastUltrasoundDate,
        previousImaging.breastUltrasoundResult,
        previousImaging.breastUltrasoundReportAvailable
      )
    );

  //Breast MRI
  if (previousImaging.breastMRIYesNo === "Yes")
    previousImagingReport.push(
      generatepreviousImaging(
        "Breast MRI",
        previousImaging.breastMRIYesNo,
        previousImaging.breastMRIDateKnown,
        previousImaging.breastMRIDate,
        previousImaging.breastMRIResult,
        previousImaging.breastMRIReportAvailable
      )
    );

  //PET/CT
  if (previousImaging.petctYesNo === "Yes")
    previousImagingReport.push(
      generatepreviousImaging(
        "PET/CT scan",
        previousImaging.petctYesNo,
        previousImaging.petctDateKnown,
        previousImaging.petctDate,
        previousImaging.petctResult,
        previousImaging.petctReportAvailable
      )
    );

  //QT Imaging
  if (previousImaging.qtImagingYesNo === "Yes")
    previousImagingReport.push(
      generatepreviousImaging(
        "QT imaging",
        previousImaging.qtImagingYesNo,
        previousImaging.qtimageDateKnown,
        previousImaging.qtimageDate,
        previousImaging.qtimageResult,
        previousImaging.qtimageReportAvailable
      )
    );

  //Other Imaging
  if (previousImaging.otherImagingYesNo === "Yes")
    previousImagingReport.push(
      generatepreviousImaging(
        "Other imaging",
        previousImaging.otherImagingYesNo,
        previousImaging.otherImagingDateKnown,
        previousImaging.otherImagingDate,
        previousImaging.otherImagingResult,
        previousImaging.otherImagingReportAvailable
      )
    );

  //Addtional Comments
  if (previousImaging.additionalComments.length > 0) {
    previousImagingReport.push(
      `<ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>${previousImaging.additionalComments}.</li></ol>`
    );
  }

  if (previousImagingReport.length > 0) {
    report.push(
      `<strong>Imaging:</strong><br/>${previousImagingReport.join("")}`
    );
  }

  //Biopsy
  if (biopsy.previousBiopsy === "Yes" || biopsy.previousBiopsy === "Unknown") {
    const biopsyReport = [];
    biopsyReport.push(
      `${
        biopsy.previousBiopsy === "Yes"
          ? ` Date: ${formatReadableDate(biopsy.previousBiopsyDate)}.`
          : biopsy.previousBiopsy === "Unknown"
          ? ` Date: unknown.`
          : ""
      }${
        biopsy.biopsyResults === "Yes" || biopsy.biopsyResults === "Unknown"
          ? ` Result: ${
              biopsy.biopsyResults === "Yes"
                ? `${biopsy.biopsyResultsDetails}.`
                : `${biopsy.biopsyResults.toLowerCase()}.`
            }`
          : ""
      }${
        biopsy.biopsyLeft === "true"
          ? ` Left ${biopsy.biopsyLeftType.toLocaleLowerCase()}.`
          : ""
      }${
        biopsy.biopsyRight === "true"
          ? ` Right ${biopsy.biopsyRightType.toLocaleLowerCase()}.`
          : ""
      }${
        biopsy.reportAvailablity === "Not Available"
          ? ` Report not available.`
          : ""
      }${
        biopsy.additionalComments.length > 0
          ? ` ${biopsy.additionalComments}.`
          : ""
      }`
    );

    if (
      biopsy.performed === "Yes" &&
      biopsy.Biopsyresult !== "Unknown" &&
      breastSymptoms.categoryId === "2"
    ) {
      biopsyReport.push(
        `Results: ${biopsy.Biopsyresult.toLocaleLowerCase()}${
          biopsy.Biopsyresult === "Benign" && biopsy.Benignother.length > 0
            ? ` (${biopsy.Benignother})`
            : ``
        }${
          biopsy.Biopsyresult === "Atypical" && biopsy.Atypicalother.length > 0
            ? ` (${biopsy.Atypicalother})`
            : ``
        }${
          biopsy.Biopsyresult === "High-risk lesion" &&
          biopsy.Highrisklesionother.length > 0
            ? ` (${biopsy.Highrisklesionother})`
            : ``
        }.`
      );
    }

    report.push(
      `<strong>Biopsy:</strong><br/><ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>` +
        biopsyReport.join(" ") +
        "</li></ol>"
    );
  } else if (biopsy.additionalComments.length > 0) {
    report.push(
      `<strong>Biopsy:</strong><br/><ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>${
        biopsy.additionalComments.length > 0
          ? ` ${biopsy.additionalComments}.`
          : ""
      }</li></ol>`
    );
  }

  return report.join("");
}
