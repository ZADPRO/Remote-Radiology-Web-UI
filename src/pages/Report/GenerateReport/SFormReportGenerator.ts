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

  const previousSurgery = {
    previousSurgeryYesNo: getPatientAnswer(66),

    mastectomy: getPatientAnswer(67),
    mastectomyPosition: getPatientAnswer(68),
    mastectomyDate: getPatientAnswer(506),

    lumpectomy: getPatientAnswer(69),
    lumpectomyPosition: getPatientAnswer(70),
    lumpectomyDate: getPatientAnswer(507),

    cystAspiration: getPatientAnswer(71),
    cystAspirationPosition: getPatientAnswer(72),
    cystAspirationDate: getPatientAnswer(508),

    breastReconstruction: getPatientAnswer(73),
    breastReconstructionPosition: getPatientAnswer(74),
    breastReconstructionDate: getPatientAnswer(509),

    augmentation: getPatientAnswer(75),
    augmentationPosition: getPatientAnswer(76),
    augmentationDate: getPatientAnswer(510),

    breastSurgeryOthers: getPatientAnswer(77),
    breastSurgeryOthersSpecify: getPatientAnswer(78),
    breastSurgeryOthersSpecifyDirection: getPatientAnswer(489),
    breastSurgeryOthersDate: getPatientAnswer(511),
  };

  const breastimplants = {
    breastimplantsyesno: getPatientAnswer(79),
    implantBothDirection: getPatientAnswer(518),
    implantleft: getPatientAnswer(423),
    implantright: getPatientAnswer(167),
    implantsSpecify: getPatientAnswer(80),
    implantsOthersSpecify: getPatientAnswer(81),
    implantDateLeft: getPatientAnswer(82),
    explants: getPatientAnswer(83),
    explantsDateKnown: getPatientAnswer(497),
    explantsDate: getPatientAnswer(84),
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
  };

  let report = [];

  //Personal History
  //Pregnant Lactating
  if (pregnant === "Yes") {
    report.push("The patient is currently pregnant/lactating.");
  }

  //Risk Stratification
  //IBIS/Tyrer
  if (ibisScore.length > 0) {
    report.push(`IBIS/Tyrer-Cuzick Breast Cancer Risk ${ibisScore}%.`);
  }

  //AURIA Breast Cancer
  if (auriaStatus === "Done") {
    report.push(
      `AURIA breast cancer tear test performed with ${auriaResult.toLocaleLowerCase()} result.`
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

    report.push(text);
  }

  //Family History
  if (relatives === "Yes") {
    report.push(
      `Family history positive for breast cancer in first-/second-degree relatives.`
    );
  }

  //Previous Breast Surgery
  if (previousSurgery.previousSurgeryYesNo === "Yes") {
    let text = [];
    if (previousSurgery.mastectomy === "true") {
      text.push(
        `${
          previousSurgery.mastectomyPosition
        } mastectomy done on ${formatReadableDate(
          previousSurgery.mastectomyDate
        )}.`
      );
    }

    if (previousSurgery.lumpectomy === "true") {
      text.push(
        `${
          previousSurgery.lumpectomyPosition
        } lumpectomy done on ${formatReadableDate(
          previousSurgery.lumpectomyDate
        )}.`
      );
    }

    if (previousSurgery.cystAspiration === "true") {
      text.push(
        `${
          previousSurgery.cystAspirationPosition
        } cyst aspiration done on ${formatReadableDate(
          previousSurgery.cystAspirationDate
        )}.`
      );
    }

    if (previousSurgery.breastReconstruction === "true") {
      text.push(
        `${
          previousSurgery.breastReconstructionPosition
        } breast reconstruction done on ${formatReadableDate(
          previousSurgery.breastReconstructionDate
        )}.`
      );
    }

    if (previousSurgery.augmentation === "true") {
      text.push(
        `${
          previousSurgery.augmentationPosition
        } augmentation done on ${formatReadableDate(
          previousSurgery.augmentationDate
        )}.`
      );
    }

    if (previousSurgery.breastSurgeryOthers === "true") {
      text.push(
        `${
          previousSurgery.breastSurgeryOthersSpecifyDirection
        } ${previousSurgery.breastSurgeryOthersSpecify.toLocaleLowerCase()} done on ${formatReadableDate(
          previousSurgery.breastSurgeryOthersDate
        )}.`
      );
    }

    report.push(text.join(" "));
  }

  //Breast Implants
  if (breastimplants.breastimplantsyesno === "Yes") {
    let side = "";
    if (breastimplants.implantBothDirection === "true") side = "both";
    if (breastimplants.implantleft === "true") side = "left";
    if (breastimplants.implantright === "true") side = "right";

    let type = "";
    if (breastimplants.implantsSpecify !== "Other") {
      type = breastimplants.implantsSpecify;
    } else {
      type = breastimplants.implantsOthersSpecify;
    }

    let text = `Breast implant present on the ${side}, ${type.toLowerCase()} type, since ${
      breastimplants.implantDateLeft
    } year${breastimplants.implantDateLeft === "1" ? "" : "s"}${
      breastimplants.explants === "Yes"
        ? `;  explant done${
            breastimplants.explantsDateKnown === "Yes"
              ? ` ${breastimplants.explantsDate} year${
                  breastimplants.explantsDate === "1" ? "" : "s"
                } ago`
              : ""
          }.`
        : "."
    }`;

    report.push(text);
  }

  //Dense breast
  if (densbreast === "Yes") {
    report.push(`The patient has dense breast(per previous imaging).`);
  }

  //Additional Comments
  if (Additionalcomments.length > 0) {
    report.push(`Additional comments: ${Additionalcomments}.`);
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
        text.push(`Previous symptoms of lump or thickening now resolved`);
      } else {
        text.push(
          `Current breast symptoms${
            breastSymptoms.categoryId === "4" &&
            breastSymptoms.cbreastCancerSymptoms === "Yes" &&
            breastSymptoms.lumpOrThickStatusCheck === "true" &&
            breastSymptoms.lumpOrThickStatus !== "Resolved"
              ? ` are ${breastSymptoms.lumpOrThickStatus.toLocaleLowerCase()}`
              : ``
          }: Lump or thickening${
            breastSymptoms.lumpLeft.length > 0 ||
            breastSymptoms.lumpRight.length > 0 ||
            (breastSymptoms.lumpLeft.length > 0 &&
              breastSymptoms.lumpRight.length > 0)
              ? ` in the ${
                  breastSymptoms.lumpLeft.length > 0
                    ? `left breast at ${formatBreastSymptoms(
                        breastSymptoms.lumpLeft
                      )} since ${
                        breastSymptoms.lumpDate
                      } months, size ${breastSymptoms.lumpSize.toLocaleLowerCase()}${
                        breastSymptoms.lumpRight.length > 0 ? `, ` : ""
                      }`
                    : ""
                }${
                  breastSymptoms.lumpRight.length > 0
                    ? `right breast at ${formatBreastSymptoms(
                        breastSymptoms.lumpRight
                      )} since ${
                        breastSymptoms.lumpDateRight
                      } months, size ${breastSymptoms.lumpSizeRight.toLocaleLowerCase()}`
                    : ""
                }${
                  breastSymptoms.lumpDetails.length > 0
                    ? `, Additional comments: ${breastSymptoms.lumpDetails}.`
                    : `.`
                }`
              : ""
          }`
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
        text.push(`Previous symptoms of skin changes now resolved`);
      } else {
        text.push(
          `Current breast symptoms${
            breastSymptoms.categoryId === "4" &&
            breastSymptoms.cbreastCancerSymptoms === "Yes" &&
            breastSymptoms.skinChangesStatusCheck === "true" &&
            breastSymptoms.skinChangesStatus !== "Resolved"
              ? ` are ${breastSymptoms.skinChangesStatus.toLocaleLowerCase()}`
              : ``
          }: Skin changes${
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
                    ? `, Additional comments: ${breastSymptoms.skinDetails}.`
                    : `.`
                }`
              : ""
          }`
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
        text.push(`Previous symptoms of nipple discharge now resolved`);
      } else {
        text.push(
          `Current breast symptoms${
            breastSymptoms.categoryId === "4" &&
            breastSymptoms.cbreastCancerSymptoms === "Yes" &&
            breastSymptoms.nippleDischargeStatusCheck === "true" &&
            breastSymptoms.nippleDischargeStatus !== "Resolved"
              ? ` are ${breastSymptoms.nippleDischargeStatus.toLocaleLowerCase()}`
              : ``
          }: Nipple discharge${
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
                    ? `, Additional comments: ${breastSymptoms.nippleDetails}.`
                    : `.`
                }`
              : ""
          }`
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
        text.push(`Previous symptoms of breast pain now resolved`);
      } else {
        text.push(
          `Current breast symptoms${
            breastSymptoms.categoryId === "4" &&
            breastSymptoms.cbreastCancerSymptoms === "Yes" &&
            breastSymptoms.breastPainStatusCheck === "true" &&
            breastSymptoms.breastPainStatus !== "Resolved"
              ? ` are ${breastSymptoms.breastPainStatus.toLocaleLowerCase()}`
              : ``
          }: Breast pain${
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
                    ? `, Type of pain: ${breastSymptoms.breastPainDetails}.`
                    : `.`
                }`
              : ""
          }`
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
        text.push(`Previous symptoms of nipple changes now resolved`);
      } else {
        text.push(
          `Current breast symptoms${
            breastSymptoms.categoryId === "4" &&
            breastSymptoms.cbreastCancerSymptoms === "Yes" &&
            breastSymptoms.nipplePainStatusCheck === "true" &&
            breastSymptoms.nipplePainStatus !== "Resolved"
              ? ` are ${breastSymptoms.nipplePainStatus.toLocaleLowerCase()}`
              : ``
          }: Nipple changes${
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
                                ? ` ${breastSymptoms.nipplePositionDetails.toLowerCase()}`
                                : ` ${breastSymptoms.nipplePosition.toLowerCase()}`
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
                                ? ` ${breastSymptoms.nipplePositionRightDetails.toLowerCase()}`
                                : ` ${breastSymptoms.nipplePositionRight.toLowerCase()}`
                            }`
                          : ``
                      } since ${breastSymptoms.nipplePainDateRight} months`
                    : ""
                }${
                  breastSymptoms.nipplePainDetails.length > 0
                    ? `, Additional comments: ${breastSymptoms.nipplePainDetails}.`
                    : `.`
                }`
              : ""
          }`
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
        text.push(`Previous symptoms of lymph node swelling now resolved`);
      } else {
        text.push(
          `Current breast symptoms${
            breastSymptoms.categoryId === "4" &&
            breastSymptoms.cbreastCancerSymptoms === "Yes" &&
            breastSymptoms.lymphNodesStatusCheck === "true" &&
            breastSymptoms.lymphNodesStatus !== "Resolved"
              ? ` are ${breastSymptoms.lymphNodesStatus.toLocaleLowerCase()}`
              : ``
          }: Lymph node swelling${
            breastSymptoms.lymphNodesRight.length > 0 ||
            breastSymptoms.lymphNodesLeft.length > 0 ||
            (breastSymptoms.lymphNodesRight.length > 0 &&
              breastSymptoms.lymphNodesLeft.length > 0)
              ? ` in the
              ${
                breastSymptoms.lymphNodesLeft.length > 0
                  ? ` left breast at ${formatBreastSymptoms(
                      breastSymptoms.lymphNodesLeft
                    )}${breastSymptoms.lymphNodesRight.length > 0 ? "," : ""}`
                  : ""
              }${
                  breastSymptoms.lymphNodesRight.length > 0
                    ? ` right breast ${formatBreastSymptoms(
                        breastSymptoms.lymphNodesRight
                      )}`
                    : ""
                }`
              : ``
          }${
            breastSymptoms.locationAxillary === "true"
              ? `, axillary (armpit) since ${
                  breastSymptoms.locationAxillaryDuration
                } months, size ${breastSymptoms.locationAxillarySize.toLocaleLowerCase()}`
              : ``
          }${
            breastSymptoms.locationInBetween === "true"
              ? `, in-between (chest bone) since ${
                  breastSymptoms.locationInBetweenDuration
                } months, size ${breastSymptoms.locationInBetweenSize.toLocaleLowerCase()}`
              : ``
          }${
            breastSymptoms.locationOther === "true"
              ? `, ${breastSymptoms.locationOtherSpecify.toLocaleLowerCase()} since ${
                  breastSymptoms.locationOtherDuration
                } months, size ${breastSymptoms.locationOtherSize.toLocaleLowerCase()}`
              : ``
          }${
            breastSymptoms.lymphNodesDetails.length > 0
              ? `, Additional comments: ${breastSymptoms.lymphNodesDetails}.`
              : `.`
          }`
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
          `Previous symptoms of ${breastSymptoms.othersDetails} now resolved`
        );
      } else {
        text.push(
          `Others${
            breastSymptoms.categoryId === "4" &&
            breastSymptoms.cbreastCancerSymptoms === "Yes" &&
            breastSymptoms.othersStatusCheck === "true" &&
            breastSymptoms.othersStatus !== "Resolved"
              ? ` are ${breastSymptoms.othersStatus.toLocaleLowerCase()}`
              : ``
          }: ${breastSymptoms.othersDetails}.`
        );
      }
    }

    report.push(text.join("<br/>"));
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

    return `
   ${label}${
      dateknown === "Known" ? ` performed on ${formatReadableDate(date)}` : ""
    }, result ${result.toLocaleLowerCase()}.${
      reportAvailable === "Not Available" ? ` Report not available.` : ``
    }
   `;
  };

  //Thermogram
  if (previousImaging.thermogramYesNo === "Yes") {
    report.push(
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
    report.push(
      generatepreviousImaging(
        " Mammogram",
        previousImaging.mammogramYesNo,
        previousImaging.mammogramDateKnown,
        previousImaging.mammogramDate,
        previousImaging.mammogramResult,
        previousImaging.mammogramReportAvailable
      )
    );

  //Breast Ultrasound
  if (previousImaging.breastUltrasoundYesNo === "Yes")
    report.push(
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
    report.push(
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
    report.push(
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
    report.push(
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
    report.push(
      generatepreviousImaging(
        "Other imaging",
        previousImaging.otherImagingYesNo,
        previousImaging.otherImagingDateKnown,
        previousImaging.otherImagingDate,
        previousImaging.otherImagingResult,
        previousImaging.otherImagingReportAvailable
      )
    );

  //Biopsy
  if (biopsy.previousBiopsy === "Yes" || biopsy.previousBiopsy === "Unknown") {
    report.push(`
        Previous biopsy:${
          biopsy.previousBiopsy === "Yes"
            ? ` Date: ${formatReadableDate(biopsy.previousBiopsyDate)}.`
            : ""
        }${
      biopsy.biopsyResults === "Yes" ||
      biopsy.biopsyResults === "Unknown" ||
      biopsy.biopsyResults === "No"
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
        ? ` Additional comments: ${biopsy.additionalComments}.`
        : ""
    }`);
  }

  return report.join("<br/>");
}
