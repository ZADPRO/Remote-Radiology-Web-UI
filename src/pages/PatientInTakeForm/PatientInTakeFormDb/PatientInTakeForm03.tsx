import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import checkedImg from "../../../assets/checked.png";
import BiopsyorCancer from "./BiopsyorCancer";
import ReceptorStatus from "./ReceptorStatus";
import Treatment from "./Treatment";
import FutureMonitoring from "./FutureMonitoring";
import sidebar_bg from "../../../assets/Mask_group.png";
import logo from "../../../assets/LogoNew.png";
import { IntakeOption } from "../PatientInTakeForm";
import { Button } from "@/components/ui/button";

interface Props {
  formData: IntakeOption[];
  setFormData: React.Dispatch<React.SetStateAction<IntakeOption[]>>;
  handleFormSwitch: (formNumber: number) => void;
  openSubmitDialog: () => void;
  readOnly: boolean;
}

const PatientInTakeForm03: React.FC<Props> = ({
  formData,
  setFormData,
  handleFormSwitch,
  openSubmitDialog,
  readOnly,
}) => {
  const navigate = useNavigate();

  const options = [
    "Biopsy or Cancer Diagnosis Details",
    "Receptor Status",
    "Treatment",
    "Future Monitoring Plan",
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

  const handleInputChange = (questionId: number, value: string) => {
    setFormData((prev) =>
      prev.map((item) =>
        item.questionId === questionId ? { ...item, answer: value } : item
      )
    );
  };

  console.log(readOnly);

  useEffect(() => {
    // if (formData.find(item => item.questionId === 176)?.answer == "") {
    //     handleInputChange(176, "mm");
    // }
  }, [formData]);

  const renderSectionComponent = () => {
    switch (selectedSection) {
      case "Biopsy or Cancer Diagnosis Details":
        return (
          <BiopsyorCancer
            formData={formData}
            handleInputChange={handleInputChange}
            questionIds={{
              datediagnosis: 254,
              typediagnosis: 255,
              typediagnosisother: 256,
              grade: 257,
              stage: 258,
              tumersize: 259,
              breast: 260,
              breastRight: 469,
              upperOuterQuadrant: 261,
              upperInnerQuadrant: 262,
              lowerOuterQuadrant: 263,
              lowerInnerQuadrant: 264,
              centralNippleOuterQuadrant: 265,
              unknownQuadrant: 266,
              clockposition: 267,
              clockpositionstatus: 268,
              distancenippleStatus: 269,
              distancenipple: 270,

              upperOuterQuadrantRight: 470,
              upperInnerQuadrantRight: 471,
              lowerOuterQuadrantRight: 472,
              lowerInnerQuadrantRight: 473,
              centralNippleOuterQuadrantRight: 474,
              unknownQuadrantRight: 475,
              clockpositionstatusRight: 476,
              clockpositionRight: 477,
              distancenippleStatusRight: 478,
              distancenippleRight: 479,
              
              Lymph: 271,
              positivenode: 272,
              Metastasis: 273,
              location: 274,

              LymphRight: 480,
              positivenodeRight: 481,
              MetastasisRight: 483,
              locationRight: 484,
            }}
          />
        );

      case "Receptor Status":
        console.log(formData);
        return (
          <ReceptorStatus
            formData={formData}
            handleInputChange={handleInputChange}
            questionIds={{
              receptorStatus: 275,
              Estrogen: 276,
              EstrogenPer: 277,
              Progesterone: 278,
              ProgesteronePer: 279,
              HER2: 280,
              HER2Per: 281,
              Ki: 282,
              KiPer: 420,
              Oncotype: 421,
              Oncotyperesult: 422,
            }}
          />
        );

      case "Treatment":
        return (
          <Treatment
            formData={formData}
            handleInputChange={handleInputChange}
            questionIds={{
              treatmentstatus: 283,
              Surgical: 284,
              surgery: 285,
              successfulStatus: 286,
              successful: 287,
              Mastectomy: 288,
              Bilateral: 289,
              Sentinel: 290,
              Axillary: 291,
              Reconstruction: 292,
              ReconstructionType: 293,
              Neoadjuvant: 296,
              Chemotherapy: 297,
              Hormonal: 298,
              outcome: 299,
              outcomeDuration: 300,
              outcomeSpecify: 301,
              Targeted: 302,
              Immunotherapy: 303,
              NeoAxillary: 304,
              Radiation: 305,
              Adjuvant: 306,
              AdjChemotherapy: 307,
              AdjHormonal: 308,
              AdjTargeted: 309,
              AdjImmunotherapy: 310,
              AdjRadiation: 311,
              Treatmenttimeline: 312,
              sideeffects: 313,
            }}
          />
        );

      case "Future Monitoring Plan":
        return (
          <FutureMonitoring
            formData={formData}
            handleInputChange={handleInputChange}
            questionIds={{
              Current: 314,
              CurrentOther: 315,
              Undercare: 316,
              Breastsurgeon: 317,
              Oncologist: 318,
              Integrativeoncologist: 319,
              Other: 320,
              othertext: 321, // Now the highest ID
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
            // onClick={() => setSelectedSection(option)}
            className="flex gap-2 items-center"
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
      /> */}
    </form>
  );
};

export default PatientInTakeForm03;
