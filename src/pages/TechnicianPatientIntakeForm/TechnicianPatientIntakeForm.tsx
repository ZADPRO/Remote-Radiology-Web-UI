import React, { useEffect, useRef, useState } from "react";
import { IntakeOption } from "../PatientInTakeForm/MainInTakeForm";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/LogoNew2.png";
import navbar_bg from "../../assets/navbar_bg.png";
import { ArrowLeft, ArrowRight } from "lucide-react";
import AllergiesMedications from "./AllergiesMedications";
import BreastBiopsy from "./BreastBiopsy";
import AddintionalNotes from "./AddintionalNotes";
import BreastSymptoms from "./BreastSymptoms";
import { appointmentService, patientInTakeService } from "@/services/patientInTakeFormService";
import PriorImaging from "./PriorImaging";
import { FileData } from "@/services/commonServices";
import UploadDicoms from "./UploadDicoms";
import { PatientInTakeFormNavigationState } from "../PatientInTakeForm/PatientInTakeFormS/PatientInTakeForm01";

export interface ResponsePatientForm {
  refITFId: number;
  answer: string;
  questionId: number;
  verifyTechnician: boolean;
  file?: FileData;
}

interface ResponseAudit {
  refTHActionBy: number;
  refTHData: string;
  refTHTime: string;
  refUserId: number;
  transTypeId: number;
}

const TechnicianPatientIntakeForm: React.FC = () => {
  const navigate = useNavigate();

  const options = [
    "Allergies & Medications",
    "Breast Symptoms",
    "Prior Imaging",
    "Breast Biopsy",
    "Additional Notes",
    "Upload Dicom",
  ];
  const [selectedSection, setSelectedSection] = useState<string>(options[0]);

  const [technicianFormData, setTechnicianFormData] = useState<IntakeOption[]>(
    Array.from({ length: 50 }, (_, index) => ({
      questionId: 1 + index,
      answer: "",
    }))
  );

  const [patientFormData, setPatientFormData] = useState<ResponsePatientForm[]>(
    Array.from({ length: 500 }, (_, index) => ({
      refITFId: 0,
      questionId: 1 + index,
      answer: "",
      verifyTechnician: false,
    }))
  );

  const [dicomFiles, setDicomFiles] = useState<
    { file_name: string; old_file_name: string }[]
  >([]);

  console.log(dicomFiles);

  const [auditData, setAuditData] = useState<ResponseAudit[]>();

  console.log(auditData);

  const fetchFormData: PatientInTakeFormNavigationState = useLocation().state;

  useEffect(() => {
    if (fetchFormData.fetchFormData) {
      console.log(fetchFormData)
      handleFetchPatientForm(fetchFormData.apiInfo.userId, fetchFormData.apiInfo.appointmentId);
    }
  }, []);

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
        setPatientFormData(res.data);
        setAuditData(res.auditdata);
        console.log(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleShift = (categoryId: number) => {
    navigate("/mainInTakeForm", {
      state: {
        categoryId: categoryId,
        fetchFormData: true,
        apiInfo: {
          userId: fetchFormData.apiInfo.userId,
          appointmentId: fetchFormData.apiInfo.appointmentId,
        },
      },
    });
  };

  const categoryMap: Record<number, number> = {
  167: 1,
  168: 2,
  169: 3,
  170: 4,
};

const selectedCategoryId =
  categoryMap[
    patientFormData.find(
      (q: any) => [167, 168, 169, 170].includes(q.questionId) && q.answer === "true"
    )?.questionId || 0
  ] || 0;


  const handleAddTechnicianForm = async () => {
    try {
      const payload = {
        patientId: fetchFormData.apiInfo.userId,
        categoryId: selectedCategoryId,
        appointmentId: fetchFormData.apiInfo.appointmentId,
        updatedAnswers: patientFormData,
        technicianAnswers: technicianFormData,
        dicom_files: dicomFiles,
      }
      console.log(payload);
      const res = await appointmentService.addTechnicianInTakeForm(payload);

      console.log(res);

      if(res.status) {
        navigate(-1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const getAnswer = (id: number) =>
  //   technicianFormData.find((q) => q.questionId === id)?.answer || "";

  // useEffect(() => {
  //     if (getAnswer(28) === "") {
  //         handleInputChange(28, "No")
  //     }
  //     if (getAnswer(32) === "") {
  //         handleInputChange(32, "No")
  //     }
  //     if (getAnswer(37) === "") {
  //         handleInputChange(37, "No")
  //     }
  //     if (getAnswer(42) === "") {
  //         handleInputChange(42, "No")
  //     }
  //     if (getAnswer(47) === "") {
  //         handleInputChange(47, "No")
  //     }
  // }, [])

  const handleInputChange = (questionId: number, value: string) => {
    setTechnicianFormData((prev) =>
      prev.map((item) =>
        item.questionId === questionId ? { ...item, answer: value } : item
      )
    );
  };

  const handlePatientInputChange = (questionId: number, value: string) => {
    setPatientFormData((prev) =>
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
      case "Allergies & Medications":
        return (
          <AllergiesMedications
            technicianFormData={technicianFormData}
            handleInputChange={handleInputChange}
            questionIds={{
              priority: 1,
              Adhesive: 2,
              Latex: 3,
              Chlorine: 4,
              Others: 5,
              OtherSpecify: 6,
              bhrt: 7,
              Oral: 8,
              Estrogen: 9,
              Chemo: 10,
              Progesterone: 11,
              Neoadjuvant: 12,
              Tamoxifen: 13,
              Supplements: 14,
              Aromatase: 15,
              MedicationOthers: 16,
              MedicationOtherSpecify: 17,
            }}
          />
        );

      case "Breast Symptoms":
        return (
          <BreastSymptoms
            technicianFormData={technicianFormData}
            patientFormData={patientFormData}
            handleInputChange={handleInputChange}
            setTechnicianFormData={setTechnicianFormData}
            setPatientFormData={setPatientFormData}
            questionIds={{
              clinicalExam: 18,
              deformity: 19,
              deformityBig: 20,
              deformityRight: 21,
              deformityLeft: 22,
              deformityDuration: 23,
              scar: 24,
              scarRight: 25,
              scarLeft: 26,
              scarDuration: 27,
              sore: 28,
              soreRight: 29,
              soreLeft: 30,
              soreDuration: 31,
              additionalComments: 32,
            }}
          />
        );

      case "Breast Biopsy":
        return (
          <BreastBiopsy
            technicianFormData={technicianFormData}
            handleInputChange={handleInputChange}
            questionIds={{
              breastBiopsy: 33,
              left: 34,
              right: 35,
              benign: 36,
              malignant: 37,
              reportsAttached: 38,
            }}
          />
        );

      case "Additional Notes":
        return (
          <AddintionalNotes
            technicianFormData={technicianFormData}
            handleInputChange={handleInputChange}
            patientFormData={patientFormData}
            setPatientFormData={setPatientFormData}
            handleShift={handleShift}
            questionIds={{
              postscan: 39,
              artifactsstaus: 40,
              artifactsother: 41,
              reprocessing: 42,
              confirmation: 43
            }}
          />
        );

      case "Prior Imaging":
        return (
          <PriorImaging
            formData={technicianFormData}
            patientFormData={patientFormData}
            handleInputChange={handleInputChange}
            handleInputChangePatient={handlePatientInputChange}
            setPatientFormData={setPatientFormData}
            questionIds={{
              //patientFormQuestions
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
      case "Upload Dicom":
        return (
          <UploadDicoms
            technicianFormData={technicianFormData}
            handleInputChange={handleInputChange}
            questionIds={{
              confirmation: 44,
            }}
            setDicomFiles={setDicomFiles}
          />
        );
      default:
        return null;
    }
  };
  

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const currentIndex = options.indexOf(selectedSection);
        const isLastSection = currentIndex === options.length - 1;
         if (isLastSection) {
          handleAddTechnicianForm();
        } else {
          setSelectedSection(options[currentIndex + 1]);
        }
      }}
      className="flex flex-col realtive h-dvh bg-gradient-to-b from-[#EED2CF] to-[#FEEEED]"
    >
      {/* Sidebar */}
      <div
        className="flex w-full h-[10vh] px-5 sm:px-10 bg-[#abb4a5] items-center"
        style={{
          backgroundImage: `url(${navbar_bg})`,
          boxShadow: "6px 4px 26.2px 5px #0000002B",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "top",
          backgroundBlendMode: "overlay", // optional, helps blend bg image + color
        }}
      >
        <img src={logo} className="h-[8vh]" alt="logo" />
        <div className="uppercase w-[80%] text-center text-sm sm:text-2xl font-bold">
          Technologist Form
        </div>
      </div>
      <div className="px-3 w-full lg:px-15 h-[80vh] mt-[3vh]">
        <div className="bg-[#f9f4ed] w-full h-[8vh] rounded-sm flex overflow-x-auto hide-scrollbar">
          {options.map((option, index) => (
            <div
              ref={(el) => {
                optionRefs.current[option] = el;
              }}
              onClick={() => setSelectedSection(option)}
              className={` cursor-pointer w-[200px] lg:w-[20%] flex h-[8vh] gap-3 px-3 justify-center items-center ${
                index !== option.length - 1 ? "border-r-1" : "border-r-0"
              } border-r-[#BFB2B2] ${
                selectedSection === option
                  ? "border-b-5 border-b-[#abb4a5]"
                  : "border-b-5 border-b-[#f9f4ed]"
              }`}
            >
              <div className="w-[30px] lg:w-8 h-[30px] lg:h-8 bg-[#abb4a5] text-sm lg:text-xl flex justify-center items-center rounded-full text-white">
                {index + 1}
              </div>
              <div className="w-[150px] text-sm lg:text-sm">{option}</div>
            </div>
          ))}
        </div>
        <div className="mt-[1vh] h-[71vh] bg-[#f9f4ed] rounded-b-2xl">
          <div className="h-[65vh] px-5 lg:p-5">{renderSectionComponent()}</div>
          <div className="h-[6vh] w-full">
            {/* Navigation Buttons */}
            <div className="h-[5vh] shrink-0 flex items-center justify-between py-4 mt-2 lg:mt-0">
              {/* Back Button */}
              <button
                type="button"
                className="flex items-center justify-center text-base font-medium cursor-pointer px-4 max-w-[10rem] rounded-md"
                onClick={() => {
                  const currentIndex = options.indexOf(selectedSection);
                  if (currentIndex === 0) {
                    navigate(-1);
                  } else {
                    setSelectedSection(options[currentIndex - 1]);
                  }
                }}
              >
                <ArrowLeft className="mr-2 h-3 w-3" />
                Back
              </button>

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
            </div>
          </div>
        </div>
      </div>
      <div className=" h-[8vh] flex items-end justify-center pb-1 text-sm">
        Copyright © Wellthgreen
      </div>
    </form>
  );
};

export default TechnicianPatientIntakeForm;
