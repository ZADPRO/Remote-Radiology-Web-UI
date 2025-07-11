import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import checkedImg from "../../../assets/checked.png";
import CancerHistory from "./CancerHistory";
import CurrentClinicalStatus from "./CurrentClinicalStatus";
import PreviousQTExam from "./PreviousQTExam";
import PatientConcerns from "./PatientConcerns";
import MonitoringPlan from "./MonitoringPlan";
import RiskFactors from "./RiskFactors";
import ChangesFromPreviousImaging from "./ChangesFromPreviousImaging";
import IntervalImagingHistory from "./IntervalImagingHistory";
import CurrentBreastSymptoms from "./CurrentBreastSymptoms";
import sidebar_bg from "../../../assets/Mask_group.png";
import logo from "../../../assets/LogoNew.png";
import { IntakeOption } from "../PatientInTakeForm";
import { Button } from "@/components/ui/button";

interface Props{
  formData: IntakeOption[];
  setFormData: React.Dispatch<React.SetStateAction<IntakeOption[]>>;
  handleFormSwitch: (formNumber: number) => void;
   openSubmitDialog: () => void;
   readOnly: boolean;
}

const PatientInTakeForm04: React.FC<Props> = ({formData, setFormData, handleFormSwitch, openSubmitDialog, readOnly}) => {

  const navigate = useNavigate();

  const options = [
    "Current Breast Symptoms",
    "Cancer History",
    "Current Clinical Status",
    "Previous QT Exam Details",
    "Interval Imaging History",
    "Changes Since Previous QT Imaging",
    "Risk Factors and Health Changes",
    "Monitoring Plan",
    "Patient Concerns and Goals",
  ];

  const [selectedSection, setSelectedSection] = useState<string>(options[0]);

  const optionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (optionRefs.current[selectedSection]) {
      optionRefs.current[selectedSection]!.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [selectedSection]);

  console.log(readOnly);

  const handleInputChange = (questionId: number, value: string) => {
    setFormData((prev) =>
      prev.map((item) =>
        item.questionId === questionId ? { ...item, answer: value } : item
      )
    );
  };

  const renderSectionComponent = () => {
    switch (selectedSection) {
      case "Current Breast Symptoms":
        return (
          <CurrentBreastSymptoms
            data={formData}
            setData={setFormData}
            questionIds={{
              breastCancerSymptoms: 322,
              lumpOrThick: 323,
              lumpLeft: 324,
              lumpRight: 325,
              lumpResult: 326,
              lumpDate: 327,
              lumpSize: 328,
              skinChanges: 329,
              skinRight: 330,
              skinLeft: 331,
              skinDate: 332,
              skinResult: 333,
              nippleDischarge: 334,
              nippleRight: 335,
              nippleLeft: 336,
              nippleDate: 337,
              nippleResult: 338,
              breastPain: 339,
              breastPainRight: 340,
              breastPainLeft: 341,
              breastPainDate: 342,
              breastPainResult: 343,
              nipplePain: 344,
              nipplePainRight: 345,
              nipplePainLeft: 346,
              nipplePainDate: 347,
              nipplePainResult: 348,
              lymphNodes: 349,
              lymphNodesRight: 350,
              lymphNodesLeft: 351,
              lymphNodesDate: 352,
              lymphNodesResult: 353,
              others: 354,
              othersDetails: 355,
            }}
          />
        );

      case "Cancer History":
        return (
          <CancerHistory
            formData={formData}
            handleInputChange={handleInputChange}
            questionIds={{
              cancerHistory: 356,
              historyPosition: 357,
              cancerDate: 358,
              cancerType: 359,
              cancerTreatment: 360,
              cancerStatus: 361,
              cancerFolowupDate: 362,
            }}
          />
        );

      case "Current Clinical Status":
        return (
          <CurrentClinicalStatus
            formData={formData}
            handleInputChange={handleInputChange}
            questionIds={{
              newTreatment: 363,
              newTreatmentDetails: 364,
              treatmentDiscontnued: 365,
              treatmentDiscontinuedDetails: 366,
              changedDose: 367,
              changedDoseDetails: 368,
            }}
          />
        );

      case "Previous QT Exam Details":
        return (
          <PreviousQTExam
            formData={formData}
            handleInputChange={handleInputChange}
            questionIds={{
              previousQTImaging: 369,
              facilityQTImaging: 370,
              purposeQTImaging: 371,
              resultQTImaging: 372,
              positionQTImaging: 373,
              detailsQTImaging: 374,
            }}
          />
        );

      case "Interval Imaging History":
        return (
          <IntervalImagingHistory
            formData={formData}
            handleInputChange={handleInputChange}
            questionIds={{
              noneCheckbox: 375,
              mammogramCheckbox: 376,
              mammogramDate: 377,
              mammogramResult: 378,
              ultrasoundCheckbox: 379,
              ultrasoundDate: 380,
              ultrasoundResult: 381,
              mriCheckbox: 382,
              mriDate: 383,
              mriResult: 384,
              otherCheckbox: 385,
              otherText: 386,
              otherDate: 387,
              otherResult: 388,
              intervalBiopsy: 389,
              intervalBiopsyType: 390,
              intervalBiopsyDate: 391,
              intervalBiopsyResult: 392,
            }}
          />
        );

      case "Changes Since Previous QT Imaging":
        return (
          <ChangesFromPreviousImaging
            formData={formData}
            handleInputChange={handleInputChange}
            questionIds={{
              changesFindings: 393,
              sizeChange: 394,
              currentSize: 395,
              currentSizeType: 396,
              morphologyChange: 397,
              morphologyChangeDetails: 398,
              newFindings: 399,
              newFindingsDeatils: 400,
            }}
          />
        );

      case "Risk Factors and Health Changes":
        return (
          <RiskFactors
            formData={formData}
            handleInputChange={handleInputChange}
            questionIds={{
              weightDiff: 401,
              diffType: 402,
              changeHormonal: 403,
              changeHormonalDetails: 404,
              healthConditions: 405,
              healthConditionsDetails: 406,
              weightType: 407,
            }}
          />
        );

      case "Monitoring Plan":
        return (
          <MonitoringPlan
            formData={formData}
            handleInputChange={handleInputChange}
            questionIds={{
              followingRecommended: 408,
              benignFindings: 409,
              responseTreatment: 410,
              birads3: 411,
              otherMonitoring: 412,
              otherMonitoringDetails: 413,
              underSpecialist: 414,
              specialistType: 415,
              otherSpecialist: 416,
            }}
          />
        );

      case "Patient Concerns and Goals":
        return (
          <PatientConcerns
            formData={formData}
            handleInputChange={handleInputChange}
            questionIds={{
              currentConcerns: 417,
              secondOpinion: 418,
              infoRequested: 419,
            }}
          />
        );

      default:
        return null;
    }
  };

  const handleNext = () => {
    const currentIndex = options.indexOf(selectedSection);

    if (options.indexOf(selectedSection) === options.length - 1) {
      console.log("Submitting formData:", formData);
      openSubmitDialog();
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
     <div className="flex lg:hidden h-[10vh] items-center justify-between">
       <Button
                 type="button"
                 variant="link"
                 className="flex text-foreground font-semibold items-center gap-2"
                 onClick={() => handleFormSwitch(5)}
               >
                 <ArrowLeft />
                 <span className="text-lg font-semibold">Back</span>
               </Button>
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
        <Button
                  type="button"
                  variant="link"
                  className="pb-4 text-foreground hidden lg:flex items-center justify-start gap-2 w-fit cursor-pointer hover:underline font-semibold"
                  onClick={() => handleFormSwitch(5)}
                >
                  <ArrowLeft />
                  <span className="text-lg">Back</span>
                </Button>
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
            {options.indexOf(selectedSection) === options.length - 1
              ? "Submit"
              : "Next"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
          {/* )} */}
        </div>
      </div>

      {/* <SubmitDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        formData={formData}
        mainFormData={mainFormData}
        appointmentId={mainFormData.appointmentId}
        editStatus={editStatus}
        patientId={patientId}
      /> */}
    </form>
  );
};

export default PatientInTakeForm04;
