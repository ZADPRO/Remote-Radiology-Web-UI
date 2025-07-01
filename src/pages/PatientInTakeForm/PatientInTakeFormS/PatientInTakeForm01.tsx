import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { IntakeOption } from "../MainInTakeForm"; // Adjust path if needed
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
import { patientInTakeService } from "@/services/patientInTakeFormService";
import { SubmitDialog } from "../SubmitDialog";
import RiskStratification from "./RiskStratification";

export interface PatientInTakeFormNavigationState {
  categoryId?: number;
  fetchFormData: boolean;
  apiInfo: {
    userId: number;
    appointmentId: number;
  };
}

const PatientInTakeForm01: React.FC = () => {
  const navigate = useNavigate();

  const fetchFormData: PatientInTakeFormNavigationState = useLocation().state;

  useEffect(() => {
    if (fetchFormData) {
      if (fetchFormData.fetchFormData) handleFetchPatientForm(fetchFormData.apiInfo.userId, fetchFormData.apiInfo.appointmentId);
    }
  }, [fetchFormData]);

  console.log(fetchFormData);

  const handleFetchPatientForm = async (
    userID: number,
    appointmentId: number
  ) => {
    try {
      const res = await patientInTakeService.fetchPatientInTakeForm(
        userID,
        appointmentId
      );
      console.log(res);

      if (res.status) {
        setFormData(res.data);
        console.log(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const options = [
    "Personal Information",
    "Risk Stratification",
    "Menstrual and Reproductive History",
    "Family History",
    "Lifestyle Factors",
    "Personal Medical History",
    "Current Breast Symptoms",
    "Previous Imaging in past 3 years",
    "Biopsy",
  ];

  const [selectedSection, setSelectedSection] = useState<string>(options[0]);

  const [dialogOpen, setDialogOpen] = useState(false);

  const optionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (optionRefs.current[selectedSection]) {
      optionRefs.current[selectedSection]!.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [selectedSection]);

  const [formData, setFormData] = useState<IntakeOption[]>(
    Array.from({ length: 500 }, (_, index) => ({
      questionId: 1 + index,
      answer: "",
    }))
  );

  // const [finalFormData, setFinalFormData] = useState<FinalFormData>({
  //   categoryId: null,
  //   overriderequest: false,
  //   appointmentId: 1,
  //   answers: formData,
  // });

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
            questionIds={{
              fullName: 1,
              dob: 2,
              phone: 3,
              email: 4,
              age: 5,
              gender: 6,
              weight: 7,
              braSize: 8,
              pregnant: 9,
              eligible: 10,
              reason: 11,
              weightType: 12,
            }}
          />
        );
      case "Risk Stratification":
        return (
          <RiskStratification
            formData={formData}
            handleInputChange={handleInputChange}
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
            }}
          />
        );
      case "Personal Medical History":
        return (
          <PersonalMedicalHistory
            formData={formData}
            handleInputChange={handleInputChange}
            questionIds={{
              previousSurgiries: 66,
              mastectomy: 67,
              mastectomyPosition: 68,
              lumpectomy: 69,
              lumpectomyPosition: 70,
              cystAspiration: 71,
              cystAspirationPosition: 72,
              breastReconstruction: 73,
              breastReconstructionPosition: 74,
              augmentation: 75,
              augmentationposition: 76,
              breastSurgeryOthers: 77,
              breastSurgeryOthersSpecify: 78,
              implants: 79,
              implantsSpecify: 80,
              implantsOthersSpecify: 81,
              implantDate: 82,
              explants: 83,
              explantsDate: 84,
              denseBreasts: 85,
              additionalComments: 86,
            }}
          />
        );
      case "Current Breast Symptoms":
        return (
          <CurrentBreastSymptoms
            data={formData}
            setData={setFormData}
            questionIds={{
              breastCancerSymptoms: 87,
              lumpOrThick: 88,
              lumpLeft: 89,
              lumpRight: 90,
              lumpDate: 91,
              lumpSize: 92,
              lumpDetails: 93,
              skinChanges: 94,
              skinRight: 95,
              skinLeft: 96,
              skinDate: 97,
              skinDetails: 98,
              nippleDischarge: 99,
              nippleRight: 100,
              nippleLeft: 101,
              nippleDate: 102,
              nippleDetails: 103,
              breastPain: 106,
              breastPainRight: 107,
              breastPainLeft: 108,
              breastPainDate: 109,
              breastPainDetails: 110,
              nipplePain: 111,
              nipplePainRight: 112,
              nipplePainLeft: 113,
              nipplePainDate: 114,
              nipplePainDetails: 115,
              nipplePosition: 104,
              nipplePositionDetails: 105,
              lymphNodes: 116,
              lymphNodesRight: 117,
              lymphNodesLeft: 118,
              lymphNodesDate: 119,
              lymphNodesLocation: 120,
              lymphNodesDetails: 121,
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
            questionIds={{
              thermogramYesNo: 124,
              thermogramDate: 125,
              thermogramResult: 126,
              thermogramReportAvailable: 127,
              thermogramReportDetails: 128,

              mammogramYesNo: 129,
              mammogramDate: 130,
              mammogramResult: 131,
              mammogramReportAvailable: 132,
              mammogramReportDetails: 133,

              breastUltrasoundYesNo: 134,
              breastUltrasoundDate: 135,
              breastUltrasoundResult: 136,
              breastUltrasoundReportAvailable: 137,
              breastUltrasoundReportDetails: 138,

              breastMRIYesNo: 139,
              breastMRIDate: 140,
              breastMRIResult: 141,
              breastMRIReportAvailable: 142,
              breastMRIReportDetails: 143,

              petctYesNo: 144,
              petctDate: 145,
              petctResult: 146,
              petctReportAvailable: 147,
              petctReportDetails: 148,

              qtImagingYesNo: 149,
              qtimageDate: 150,
              qtimageResult: 151,
              qtimageReportAvailable: 152,
              qtimageReportDetails: 153,

              otherImagingYesNo: 154,
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
            questionIds={{
              previousBiopsy: 160,
              previousBiopsyDate: 161,
              biopsyResults: 162,
              biopsyResultsDetails: 163,
              reportAvailablity: 164,
              reportDetails: 165,
              additionalComments: 166,
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
        setButtonText("Submit");
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
      setDialogOpen(true);
    } else if (isLastSection) {
      console.log("Submitting formData:", fetchFormData);
      navigate("/mainInTakeForm", { state: {
        formData: formData,
        appointmentId: fetchFormData.apiInfo.appointmentId
      } });
    } else {
      setSelectedSection(options[currentIndex + 1]);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleNext();
      }}
      className="flex flex-col lg:flex-row h-dvh bg-gradient-to-b from-[#EED2CF] to-[#FEEEED]"
    >
      {/* Sidebar */}
      <div className="flex lg:hidden h-[10vh] items-center">
        <img src={logo} className="h-[6vh] px-5" alt="logo" />
      </div>
      <div
        className="w-full lg:w-4/12 pt-0 lg:pt-10 px-0 lg:px-4 h-[10vh] lg:h-full bg-[#a3b1a1] lg:bg-[#A4B2A1] flex flex-row lg:flex-col overflow-y-auto hide-scrollbar"
        style={{
          backgroundImage: `url(${sidebar_bg})`,
          boxShadow: "6px 4px 26.2px 5px #0000002B",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "top",
          backgroundBlendMode: "overlay", // optional, helps blend bg image + color
        }}
      >
        {options.map((option) => (
          <div
            ref={(el) => {
              optionRefs.current[option] = el;
            }}
            key={option}
            onClick={() => setSelectedSection(option)}
            className="flex gap-2 items-center cursor-pointer"
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
            className="flex items-center justify-center text-lg font-medium cursor-pointer px-4 max-w-[10rem] rounded-md"
            onClick={() => {
              const currentIndex = options.indexOf(selectedSection);
              if (currentIndex === 0) {
                navigate(-1);
              } else {
                setSelectedSection(options[currentIndex - 1]);
              }
            }}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </button>

          {/* Submit / Next Button */}
          {/* {!isNextButtonDisabled && ( */}
          <button
            type="submit" // Changed to type="submit" to trigger form onSubmit
            className="flex items-center justify-center text-lg font-medium cursor-pointer px-4 max-w-[10rem] rounded-md"
            // disabled={isNextButtonDisabled}
          >
            {buttonText}
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
          {/* )} */}
        </div>
      </div>

      {dialogOpen && (
        <SubmitDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          formData={formData}
          appointmentId={fetchFormData.apiInfo.appointmentId}
        />
      )}
    </form>
  );
};

export default PatientInTakeForm01;
