import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import checkedImg from "../../../assets/checked.png";
import PatientConcerns from "./PatientConcerns";
import AbnormalFindings from "./AbnormalFindings";
import BiopsyInformation from "./BiopsyInformation";
import MonitoringFollow from "./MonitoringFollow";
import sidebar_bg from "../../../assets/Mask_group.png";
import logo from "../../../assets/LogoNew.png";
import { IntakeOption } from "../MainInTakeForm";
import { SubmitDialog } from "../SubmitDialog";

const PatientInTakeForm02: React.FC = () => {
  const previousFormData = useLocation().state?.formData || [];
  const previoousMainFormData = useLocation().state?.mainFormData || [];

  const navigate = useNavigate();

  const options = [
    "Patient Concerns",
    "Abnormal Findings",
    "Biopsy Information",
    "Monitoring and Follow-up Plan",
  ];

  const [selectedSection, setSelectedSection] = useState<string>(options[0]);

  // Initialize formData directly with previousFormData
  const [formData, setFormData] = useState<IntakeOption[]>(previousFormData);

  const [mainFormData, setMainFormData] = useState(previoousMainFormData);

  console.log("previousFormData", setMainFormData);

  const handleInputChange = (questionId: number, value: string) => {
    setFormData((prev) =>
      prev.map((item) =>
        item.questionId === questionId ? { ...item, answer: value } : item
      )
    );
  };

  const optionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (optionRefs.current[selectedSection]) {
      optionRefs.current[selectedSection]!.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [selectedSection]);

  const renderSectionComponent = () => {
    switch (selectedSection) {
      case "Patient Concerns":
        return (
          <PatientConcerns
            formData={formData}
            handleInputChange={handleInputChange}
            questionIds={{
              anxiety: 202,
              support: 203,
              concerns: 204,
            }}
          />
        );

      case "Abnormal Findings":
        return (
          <AbnormalFindings
            formData={formData}
            handleInputChange={handleInputChange}
            questionIds={{
              abnormality: 205,
              support: 206,
              supportother: 207,
              typeabnormalitymass: 208,
              typeabnormalityarchi: 209,
              typeabnormalitycal: 210,
              typeabnormalityasym: 211,
              typeabnormalitycyst: 212,
              typeabnormalityfiboc: 213,
              typeabnormalitymamo: 214,
              typeabnormalityfiboa: 215,
              typeabnormalityatyp: 216,
              typeabnormalitother: 217,
              typeabnormalitotherspe: 218,
              breast: 219,
              upperOuterQuadrant: 220,
              upperInnerQuadrant: 221,
              lowerOuterQuadrant: 222,
              lowerInnerQuadrant: 223,
              centralNippleOuterQuadrant: 224,
              unknownQuadrant: 225,
              clockpositionstatus: 226,
              clockposition: 227,
              distancenippleStatus: 228,
              distancenipple: 229,
              sizeStatus: 230,
              size: 231,
              sizeunit: 232,
              biradsCat: 233,
              biradsCatOther: 234,
              marker: 235,
              markerother: 236,
              magneticimplants: 237,
              magneticimplantsother: 238,
            }}
          />
        );

      case "Biopsy Information":
        return (
          <BiopsyInformation
            formData={formData}
            handleInputChange={handleInputChange}
            questionIds={{
              performed: 239,
              datebio: 240,
              typebiopsy: 241,
              guidance: 242,
              Biopsyresult: 243,
              Benignother: 244,
              Atypicalother: 245,
              Highrisklesionother: 246,
              Pathology: 247,
            }}
          />
        );

      case "Monitoring and Follow-up Plan":
        return (
          <MonitoringFollow
            formData={formData}
            handleInputChange={handleInputChange}
            questionIds={{
              currentRec: 248,
              Shorttermother: 249,
              otherother: 250,
              nextappointment: 251,
              additionalrec: 252,
              additionalRecOther: 253, // Now the highest ID
            }}
          />
        );

      default:
        return null;
    }
  };

  // const [isNextButtonDisabled, setIsNextButtonDisabled] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleNext = () => {
    const currentIndex = options.indexOf(selectedSection);

    if (options.indexOf(selectedSection) === options.length - 1) {
      console.log("Submitting formData:", formData);
      setDialogOpen(true);
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
            {options.indexOf(selectedSection) === options.length - 1
              ? "Submit"
              : "Next"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
          {/* )} */}
        </div>
      </div>
      <SubmitDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        formData={formData}
        mainFormData={mainFormData}
        appointmentId={mainFormData.appointmentId}
      />
    </form>
  );
};

export default PatientInTakeForm02;
