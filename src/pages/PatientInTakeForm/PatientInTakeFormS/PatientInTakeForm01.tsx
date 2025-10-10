import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import checkedImg from "../../../assets/checked.png";
import PersonalInformation from "./PersonalInformation"; // Path may vary
import PreviousImaging from "./PreviousImaging";
import MenstrualAndReproductive from "./MenstrualAndReproductive";
import FamilyHistory from "./FamilyHistory";
import LifeStyleFactors from "./LifeStyleFactors";
import CurrentBreastSymptoms from "./CurrentBreastSymptoms";
import PersonalMedicalHistory from "./PersonalMedicalHistory";
import sidebar_bg from "../../../assets/Mask_group.png";
import Biopsy from "./Biopsy";
import logo from "../../../assets/LogoNew.png";
import RiskStratification from "./RiskStratification";
import { IntakeOption } from "../PatientInTakeForm";
import { PatientContext } from "../PatientInTakeForm";
import { Button } from "@/components/ui/button";

interface Props {
  formData: IntakeOption[];
  setFormData: React.Dispatch<React.SetStateAction<IntakeOption[]>>;
  handleFormSwitch: (formNumber: number) => void;
  openSubmitDialog: () => void;
  readOnly: boolean;
  OverrideStatus: string;
  userId: number;
}

const PatientInTakeForm01: React.FC<Props> = ({
  formData,
  setFormData,
  handleFormSwitch,
  openSubmitDialog,
  readOnly,
  OverrideStatus,
  userId
}) => {
  const navigate = useNavigate();

  const options = [
    "Personal Information",
    "Risk Stratification",
    "Current Breast Symptoms",
    "Previous Imaging in past 3 years",
    "Biopsy",
    "Menstrual and Reproductive History",
    "Family History",
    "Lifestyle Factors",
    "Personal Medical History",
  ];

  const [selectedSection, setSelectedSection] = useState<string>(options[0]);

  const optionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const patientDetails = useContext(PatientContext);
  // const isMobile = useIsMobile();

  useEffect(() => {
    if (optionRefs.current[selectedSection]) {
      optionRefs.current[selectedSection]!.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [selectedSection]);

  const handleInputChange = (questionId: number, value: string) => {
    setFormData((prev) =>
      prev.map((item) =>
        item.questionId === questionId ? { ...item, answer: value } : item
      )
    );
  };

  useEffect(() => {
    // Set default for phoneCountryCode
    if (formData.find((item) => item.questionId === 13)?.answer === "") {
      handleInputChange(13, "+1");
    }
    // Set default for weightType
    if (formData.find((item) => item.questionId === 12)?.answer === "") {
      handleInputChange(12, "lbs");
    }
  }, [formData]);

  const renderSectionComponent = () => {
    switch (selectedSection) {
      case "Personal Information":
        return (
          <PersonalInformation
            formData={formData}
            handleInputChange={handleInputChange}
            readOnly={readOnly}
            questionIds={{
              fullName: 1,
              dob: 2,
              phone: 3,
              email: 4,
              age: 5,
              gender: 6,
              genderOther: 496,
              weight: 7,
              braSize: 8,
              pregnant: 9,
              eligible: 10,
              reason: 11,
              weightType: 12,
            }}
            OverrideStatus={OverrideStatus}
            userId={userId}
          />
        );
      case "Risk Stratification":
        return (
          <RiskStratification
            formData={formData}
            handleInputChange={handleInputChange}
            readOnly={readOnly}
            questionIds={{
              ibisScore: 14,
              auriaStatus: 15,
              auriaResult: 16,
              geneticTest: 17,
              mutationFound: 18,
              mutationType: 19,
              mutationOtherSpecify: 20,
              familyGeneticCondition: 21,
              familyGeneticConditionSpecify: 22,
              additionalComments: 23,
            }}
          />
        );
      case "Menstrual and Reproductive History":
        return (
          <MenstrualAndReproductive
            formData={formData}
            handleInputChange={handleInputChange}
            readOnly={readOnly}
            questionIds={{
              ageFirstMenstrualPeriod: 24,
              ageLiveBirth: 25,
              liveBirthApplicable: 26,
              childrenCount: 27,
              breastFeedingHistory: 28,
              breastFeedingDuration: 29,
              hormoneBirthControlUse: 30,
              hormoneBirthControlUseDuration: 31,
              hormoneTherapy: 32,
              hormoneTherapyDuration: 33,
              ageMenopause: 34,
              ageMenopauseApplicable: 35,
              lactating: 36,
              lactatingDuration: 37,
              pregnant: 38,
              pregnantDuration: 39,
              additionalComments: 40,
            }}
          />
        );
      case "Family History":
        return (
          <FamilyHistory
            formData={formData}
            handleInputChange={handleInputChange}
            readOnly={readOnly}
            questionIds={{
              relatives: 41,
              relativesDiagnoses: 42,
              familyHistory: 43,
              familyHistorySpecify: 44,
              familyHistorySpecifyAge: 45,
              historyOvarianCancer: 46,
              historyFamilySpecify: 47,
              historyFamilySpecifyAge: 48,

              historyRelativesCancer: 49,
              historyRelativesSpecify: 50,
              historyRelativesSpecifyAge: 51,

              maleRelativesCancer: 490,
              maleRelativesSpecify: 491,
              maleRelativesSpecifyAge: 492,

              otherCancers: 52,
              otherCancerSpecify: 53,
              otherCancerSpecifyAge: 54,
              additionalComments: 55,
            }}
          />
        );
      case "Lifestyle Factors":
        return (
          <LifeStyleFactors
            formData={formData}
            handleInputChange={handleInputChange}
            readOnly={readOnly}
            questionIds={{
              alcoholConsumption: 56,
              alcoholDrinks: 57,
              smokingStatus: 58,
              packsPerDay: 59,
              smokingYears: 60,
              exerciseFrequency: 61,
              dietDescription: 62,
              bmi: 63,
              weightGain: 64,
              additionalComments: 65,
              height: 493,
              heightType: 494,
            }}
          />
        );
      case "Personal Medical History":
        return (
          <PersonalMedicalHistory
            formData={formData}
            handleInputChange={handleInputChange}
            readOnly={readOnly}
            questionIds={{
              previousSurgiries: 66,
              mastectomy: 67,
              mastectomyPosition: 68,
              mastectomyDate: 506,
              mastectomyDateAnother: 533,
              lumpectomy: 69,
              lumpectomyPosition: 70,
              lumpectomyDate: 507,
              lumpectomyDateAnother: 534,
              cystAspiration: 71,
              cystAspirationPosition: 72,
              cystAspirationDate: 508,
              cystAspirationDateAnother: 535,
              breastReconstruction: 73,
              breastReconstructionPosition: 74,
              breastReconstructionDate: 509,
              breastReconstructionDateAnother: 536,
              augmentation: 75,
              augmentationposition: 76,
              augmentationDate: 510,
              augmentationDateAnother: 537,
              breastSurgeryOthers: 77,
              breastSurgeryOthersSpecify: 78,
              breastSurgeryOthersSpecifyDirection: 489,
              breastSurgeryOthersDate: 511,
              breastSurgeryOthersDateAnother: 538,
              implants: 79,
              implantsSpecify: 80,
              implantsSpecifyBoth: 527,
              implantsOthersSpecify: 81,
              implantsOthersSpecifyBoth: 528,
              implantLeft: 423,
              implantDateLeft: 82,
              implantDateBoth: 529,
              implantRight: 167,
              implantDateRight: 424,
              implantsRightSpecify: 168,
              implantsRightOthersSpecify: 169,
              implantBothDirection: 518,
              explants: 83,
              explantsBoth: 530,
              explantsDate: 84,
              explantsDateBoth: 84,
              explantsDateKnown: 497,
              explantsDateKnownRight: 531,
              explantsDateKnownBoth: 532,
              denseBreasts: 85,
              additionalComments: 86,
              explantsRight: 294,
              explantsDateRight: 295,
              explantsDateRightKnown: 498,
            }}
          />
        );
      case "Current Breast Symptoms":
        return (
          <CurrentBreastSymptoms
            data={formData}
            setData={setFormData}
            readOnly={readOnly}
            questionIds={{
              breastCancerSymptoms: 87,
              lumpOrThick: 88,
              lumpLeft: 89,
              lumpRight: 90,
              lumpDate: 91,
              lumpSize: 92,
              lumpDateRight: 425,
              lumpSizeRight: 426,
              lumpDetails: 93,
              skinChanges: 94,
              skinRight: 95,
              skinLeft: 96,
              skinDate: 97,
              skinDateRight: 427,
              skinDetails: 98,
              skinOther: 495,
              skinOtherRight: 488,
              skinChangesType: 486,
              skinChangesTypeRight: 487,
              nippleDischarge: 99,
              nippleRight: 100,
              nippleLeft: 101,
              nippleDate: 102,
              nippleDateRight: 429,
              nippleDetails: 103,
              breastPain: 106,
              breastPainRight: 107,
              breastPainLeft: 108,
              breastPainDate: 109,
              breastPainDateRight: 428,
              breastPainDetails: 110,
              nipplePain: 111,
              nipplePainRight: 112,
              nipplePainLeft: 113,
              nipplePainDate: 114,
              nipplePainDateRight: 430,
              nipplePainDetails: 115,
              nipplePosition: 104,
              nipplePositionDetails: 105,
              nipplePositionRight: 431,
              nipplePositionRightDetails: 519,
              lymphNodes: 116,
              lymphNodesRight: 117,
              lymphNodesLeft: 118,
              locationAxillary: 119,
              locationAxillaryDuration: 432,
              locationAxillarySize: 120,
              locationAxillaryDurationRight: 539,
              locationAxillarySizeRight: 540,
              locationInBetween: 433,
              locationInBetweenDuration: 121,
              locationInBetweenSize: 512,
              locationOther: 513,
              locationOtherSpecify: 514,
              locationOtherDuration: 515,
              locationOtherSize: 516,
              lymphNodesDetails: 517,
              others: 122,
              othersDetails: 123,
            }}
          />
        );
      case "Previous Imaging in past 3 years":
        return (
          <PreviousImaging
            formData={formData}
            handleInputChange={handleInputChange}
            readOnly={readOnly}
            questionIds={{
              thermogramYesNo: 124,
              thermogramDate: 125,
              thermogramDateKnown: 499,
              thermogramResult: 126,
              thermogramReportAvailable: 127,
              thermogramReportDetails: 128,

              mammogramYesNo: 129,
              mammogramDateKnown: 500,
              mammogramDate: 130,
              mammogramResult: 131,
              mammogramReportAvailable: 132,
              mammogramReportDetails: 133,

              breastUltrasoundYesNo: 134,
              breastUltrasoundDateKnown: 501,
              breastUltrasoundDate: 135,
              breastUltrasoundResult: 136,
              breastUltrasoundReportAvailable: 137,
              breastUltrasoundReportDetails: 138,

              breastMRIYesNo: 139,
              breastMRIDateKnown: 502,
              breastMRIDate: 140,
              breastMRIResult: 141,
              breastMRIReportAvailable: 142,
              breastMRIReportDetails: 143,

              petctYesNo: 144,
              petctDateKnown: 503,
              petctDate: 145,
              petctResult: 146,
              petctReportAvailable: 147,
              petctReportDetails: 148,

              qtImagingYesNo: 149,
              qtimageDateKnown: 504,
              qtimageDate: 150,
              qtimageResult: 151,
              qtimageReportAvailable: 152,
              qtimageReportDetails: 153,

              otherImagingYesNo: 154,
              otherImagingDateKnown: 505,
              otherImagingDate: 155,
              otherImagingResult: 156,
              otherImagingReportAvailable: 157,
              otherImagingReportDetails: 158,

              additionalComments: 159,
            }}
          />
        );

      case "Biopsy":
        return (
          <Biopsy
            formData={formData}
            handleInputChange={handleInputChange}
            readOnly={readOnly}
            questionIds={{
              previousBiopsy: 160,
              previousBiopsyDate: 161,
              biopsyResults: 162,
              biopsyResultsDetails: 163,
              reportAvailablity: 164,
              reportDetails: 165,
              additionalComments: 166,
              biopsyLeft: 434,
              biopsyRight: 435,
              biopsyRightType: 436,
              biopsyLeftType: 437,
            }}
          />
        );

      default:
        return null;
    }
  };

  const [buttonText, setButtonText] = useState("Next");

  useEffect(() => {
    // Find the 'eligible' question's answer
    const eligibleAnswer = formData.find(
      (item) => item.questionId === 10
    )?.answer;

    // Enable the button if 'eligibleAnswer' is not empty
    if (eligibleAnswer) {
      // If eligible is "YES", show "Next", otherwise show "Submit"
      if (eligibleAnswer.toUpperCase() === "YES") {
        setButtonText("Next");
      } else {
        if (OverrideStatus === "approved") {
          setButtonText("Next");
        } else {
          setButtonText("Submit");
        }
      }
    } else {
      setButtonText("Next"); // Default to "Next" when disabled
    }
  }, [formData]); // Re-run when formData changes

  const handleNext = () => {
    const currentIndex = options.indexOf(selectedSection);
    const isLastSection = currentIndex === options.length - 1;

    if (buttonText === "Submit" && selectedSection === "Personal Information") {
      console.log("Submitting formData:", formData);
      openSubmitDialog();
    } else if (isLastSection) {
      handleFormSwitch(5); //switch to mainIntakeForm
    } else {
      setSelectedSection(options[currentIndex + 1]);
    }
  };

  return (
    <form
      noValidate={readOnly}
      onSubmit={(e) => {
        e.preventDefault();
        handleNext();
      }}
      className="flex flex-col lg:flex-row h-dvh bg-gradient-to-b from-[#EED2CF] to-[#FEEEED]"
    >
      {/* Sidebar */}
      <div className="flex lg:hidden h-[10vh] items-center justify-between">
        <Button
          type="button"
          variant="link"
          className="flex text-foreground font-semibold items-center gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft />
          <span className="text-lg font-semibold">Back</span>
        </Button>

        {!patientDetails?.reportview && (
          <>
            <img
              src={logo}
              className="h-[6vh] hidden sm:block px-5"
              alt="logo"
            />

            <div className="h-14 bg-[#fff] flex flex-col items-start justify-center w-70 mr-1  rounded p-3 text-xs self-end">
              <div className="capitalize flex">
                <div className="flex w-[6rem]">Patient Name</div>{" "}
                <div>: {patientDetails?.name}</div>
              </div>
              <div className="capitalize flex">
                <div className="flex w-[6rem]">Patient ID</div>{" "}
                <div>: {patientDetails?.custId}</div>
              </div>
              <div className="capitalize flex">
                <div className="flex w-[6rem]">Scan Center</div>{" "}
                <div>: {patientDetails?.scancenterCustId}</div>
              </div>
              {/* <img src={logo} alt="logo" className="w-full h-full object-contain" /> */}
            </div>
          </>
        )}
      </div>
      <div
        className="w-full lg:w-4/12 pt-0 h-[10vh] lg:h-full bg-[#a3b1a1] lg:bg-[#A4B2A1] flex flex-row lg:flex-col justify-start overflow-y-auto hide-scrollbar"
        style={{
          backgroundImage: `url(${sidebar_bg})`,
          boxShadow: "6px 4px 26.2px 5px #0000002B",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "top",
          backgroundBlendMode: "overlay", // optional, helps blend bg image + color
        }}
      >
        <div className="relative hidden lg:flex flex-col justify-between py-2 pb-3">
          <div className="flex justify-between items-center px-1">
            <Button
              type="button"
              variant="link"
              className="text-foreground flex items-center justify-start gap-2 w-fit cursor-pointer hover:underline font-semibold"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft />
              <span className="text-lg">Back</span>
            </Button>
            {!patientDetails?.reportview && (
              <img src={logo} className="h-[6vh] my-2 pr-2" alt="logo" />
            )}
          </div>

          <p className="text-base mt-4 lg:text-lg text-center font-bold uppercase">
            Patient InTake Form
          </p>
        </div>

        <div className="px-0 lg:px-4 flex lg:block">
          {options.map((option) => (
            <div
              ref={(el) => {
                optionRefs.current[option] = el;
              }}
              key={option}
              onClick={() => {
                readOnly && setSelectedSection(option);
              }}
              className={`flex gap-2 items-center ${
                readOnly && "cursor-pointer"
              }`}
            >
              {options.indexOf(option) < options.indexOf(selectedSection) && (
                <div className="inline w-6 lg:w-6 text-white font-bold">
                  <span>
                    <img src={checkedImg} />
                  </span>
                </div>
              )}
              <div
                className={`flex-1 flex w-[180px] h-[10vh] lg:h-[8vh] text-sm px-3 lg:px-4 rounded-sm border-[#000] font-semibold
              ${
                selectedSection === option
                  ? "bg-[#f9f5ed] text-left lg:text-left lg:bg-[#F8F3EB] text-[#3F3F3D] underline lg:no-underline lg:text-[#A4B2A1]"
                  : "bg-transparent text-[#fff] lg:text-white"
              }
              justify-center lg:justify-start items-center  `}
              >
                <span className="w-full break-words">{option}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="w-full lg:w-8/12 flex flex-col h-[75vh] lg:h-full">
        <div className="flex-grow overflow-y-auto space-y-6 pb-5">
          {renderSectionComponent()}
        </div>

        {/* Navigation Buttons */}
        <div className="h-[4vh] shrink-0 flex items-center justify-between py-4 mt-2 lg:mt-0">
          {/* Back Button */}
          <button
            type="button"
            className="flex items-center bg-[#a4b2a1] justify-center text-sm 2xl:text-xl font-medium cursor-pointer px-2 ml-2 mb-[2px] max-w-[10rem] rounded-md"
            onClick={() => {
              const currentIndex = options.indexOf(selectedSection);
              if (currentIndex === 0) {
                navigate(-1);
              } else {
                setSelectedSection(options[currentIndex - 1]);
              }
            }}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back
          </button>

          {/* Submit / Next Button */}
          {/* {!isNextButtonDisabled && ( */}
          {OverrideStatus !== "pending" && (
            <button
              type="submit" // Changed to type="submit" to trigger form onSubmit
              className="flex items-center bg-[#a4b2a1] justify-center text-sm 2xl:text-xl font-medium cursor-pointer px-2 mr-2 mb-[2px] max-w-[10rem] rounded-md"
              // disabled={isNextButtonDisabled}
            >
              {buttonText}
              <ChevronRight className="ml-1 h-4 w-4" />
            </button>
          )}
          {/* )} */}
        </div>
      </div>

      {/* {dialogOpen && (
        <SubmitDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          formData={formData}
          appointmentId={fetchFormData.apiInfo.appointmentId}
        />
      )} */}
    </form>
  );
};

export default PatientInTakeForm01;
