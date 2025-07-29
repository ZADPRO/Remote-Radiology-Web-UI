import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/LogoNew2.png";
import navbar_bg from "../../assets/navbar_bg.png";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import AllergiesMedications from "./AllergiesMedications";
import BreastBiopsy from "./BreastBiopsy";
import AddintionalNotes from "./AddintionalNotes";
import BreastSymptoms from "./BreastSymptoms";
import {
  appointmentService,
  patientInTakeService,
} from "@/services/patientInTakeFormService";
import PriorImaging from "./PriorImaging";
import { FileData } from "@/services/commonServices";
import { IntakeOption } from "../PatientInTakeForm/PatientInTakeForm";
import { technicianService } from "@/services/technicianServices";
import { Button } from "@/components/ui/button";
import LoadingOverlay from "@/components/ui/CustomComponents/loadingOverlay";

export interface ResponsePatientForm {
  refITFId: number;
  answer: string;
  questionId: number;
  verifyTechnician: boolean;
  file?: FileData;
}

export interface ResponseAudit {
  refTHActionBy: number;
  refTHData: string;
  refTHTime: string;
  refUserId: number;
  transTypeId: number;
  parsedTHData: {
    oldValue: string;
    newValue: string;
    label: number;
  }[];
}

export interface TechnicianIntakeFormNavigationState {
  fetchFormData?: boolean;
  fetchTechnicianForm?: boolean;
  appointmentId: number;
  userId: number;
  readOnly?: boolean;
  name?: string;
  custId?: string;
  scancenterCustId?: string;
}

interface TechnicianPatientIntakeFormProps
  extends Partial<TechnicianIntakeFormNavigationState> {}

const TechnicianPatientIntakeForm: React.FC<
  TechnicianPatientIntakeFormProps
> = (props) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const options = [
    "Allergies & Medications",
    "Breast Symptoms",
    "Prior Imaging",
    "Breast Biopsy",
    "Additional Notes",
    // "Upload Dicom",
  ];
  const [selectedSection, setSelectedSection] = useState<string>(options[0]);

  const [technicianFormData, setTechnicianFormData] = useState<IntakeOption[]>(
    Array.from({ length: 56 }, (_, index) => ({
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

  const [auditData, setAuditData] = useState<ResponseAudit[]>([]);

  const location = useLocation();
  const locationState =
    location.state as TechnicianIntakeFormNavigationState | null;

  const controlData: TechnicianIntakeFormNavigationState = {
    fetchFormData: props.fetchFormData ?? locationState?.fetchFormData ?? false,
    fetchTechnicianForm:
      props.fetchTechnicianForm ?? locationState?.fetchTechnicianForm ?? false,
    appointmentId: props.appointmentId ?? locationState?.appointmentId ?? 0,
    userId: props.userId ?? locationState?.userId ?? 0,
    readOnly: props.readOnly ?? locationState?.readOnly ?? false,
  };

  console.log(controlData);

  console.log(patientFormData);

  useEffect(() => {
    const stored = localStorage.getItem("formSession");
    if (stored) {
      setLoading(true);

      try {
        const parsed = JSON.parse(stored);

        console.log(parsed);

        // Check appointment match
        if (parsed.appointmentId == controlData.appointmentId) {
          // Load the saved session data
          if (parsed.patientFormData && parsed.technicianFormData) {
            setPatientFormData(parsed.patientFormData);
            setTechnicianFormData(parsed.technicianFormData);
          }
        }
      } catch (e) {
        console.error("Failed to parse stored session", e);
      } finally {
        setLoading(false);
      }
    }
  }, []); // Runs only once on mount

  // This effect will store changes to localStorage
  useEffect(() => {
    if (!controlData?.appointmentId || controlData?.readOnly) return;

    const dataToStore = {
      appointmentId: controlData.appointmentId,
      patientFormData,
      technicianFormData,
    };

    localStorage.setItem("formSession", JSON.stringify(dataToStore));
  }, [patientFormData, technicianFormData]);

  useEffect(() => {
    const fetchData = async () => {
      if (
        controlData.userId !== undefined &&
        controlData.appointmentId !== undefined
      ) {
        setLoading(true);

        try {
          if (controlData.fetchFormData) {
            await handleFetchPatientForm(
              controlData.userId,
              controlData.appointmentId
            );
          }

          if (controlData.fetchTechnicianForm) {
            await handleFetchTechnicianForm(
              controlData.userId,
              controlData.appointmentId
            );
          }
        } catch (error) {
          console.error("Error fetching form data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [location.state]);

  useEffect(() => {
    if (controlData?.readOnly === false) {
      handleAssignTechnicianForm(controlData.userId, controlData.appointmentId);
    }
  }, [controlData?.readOnly]);

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
        console.log(res.data.find((item: any) => item.questionId == 134));

        setPatientFormData(res.data);

        const parsedAuditData = res.auditdata.map((item: any) => {
          let parsedTHData = [];

          try {
            const parsed = JSON.parse(item.refTHData);

            if (Array.isArray(parsed)) {
              parsedTHData = parsed.map((entry: any) => ({
                ...entry,
                label: Number(entry.label), // 🔁 convert label to number
              }));
            }
          } catch (e) {
            parsedTHData = [];
          }

          return {
            ...item,
            parsedTHData,
          };
        });

        setAuditData(parsedAuditData);

        setAuditData(parsedAuditData); // ✅ update state properly
        console.log("auditData", parsedAuditData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFetchTechnicianForm = async (
    userID: number,
    appointmentId: number
  ) => {
    try {
      const res = await technicianService.listTechnicianForm(
        userID,
        appointmentId
      );
      console.log("res", res);

      if (res.TechIntakeData) {
        setTechnicianFormData(res.TechIntakeData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAssignTechnicianForm = async (
    userID: number,
    appointmentId: number
  ) => {
    try {
      const res = await technicianService.assignTechnicianForm(
        userID,
        appointmentId
      );
      console.log("res", res);

      // if (res.TechIntakeData) {
      //   // setTechnicianFormData(res.TechIntakeData);
      // }
    } catch (error) {
      console.log(error);
    }
  };

  const handleShift = (categoryId: number) => {
    navigate("/patientInTakeForm", {
      state: {
        categoryId: categoryId,
        fetchFormData: true,
        apiUpdate: true,
        appointmentId: controlData.appointmentId,
        userId: controlData.userId,
      },
    });
  };

  const handleAddTechnicianForm = async () => {
    setLoading(true);
    try {
      const categoryId = patientFormData.find((item) => item.questionId == 170);

      if (categoryId) {
        const payload = {
          patientId: controlData.userId,
          categoryId: parseInt(categoryId.answer),
          appointmentId: controlData.appointmentId,
          updatedAnswers: patientFormData,
          technicianAnswers: technicianFormData,
        };
        console.log("payload", payload);
        const res = await appointmentService.addTechnicianInTakeForm(payload);

        console.log(res);

        if (res.status) {
          localStorage.removeItem("formSession");
          navigate(-1);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
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
            readOnly={controlData.readOnly ? true : false}
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
              deformityDurationRight: 47,
              deformityComments: 48,
              lumporthickeningComments: 49,
              skinchangesComments: 50,
              nippledischargeComments: 51,
              painonpalpationComments: 52,
              nippleretractionComments: 53,
              scarComments: 54,
              soreComments: 55,
              lymphnodesComments: 56,
              scar: 24,
              scarRight: 25,
              scarLeft: 26,
              scarDuration: 27,
              sore: 28,
              soreRight: 29,
              soreLeft: 30,
              soreDuration: 31,
              additionalComments: 32,
              scarDurationRight: 43,
              soreDurationRight: 44,
            }}
            auditData={auditData}
            readOnly={controlData.readOnly ? true : false}
          />
        );

      case "Breast Biopsy":
        return (
          <BreastBiopsy
            technicianFormData={technicianFormData}
            patientFormData={patientFormData}
            auditData={auditData}
            handleInputChange={handleInputChange}
            handlePatientInputChange={handlePatientInputChange}
            setPatientFormData={setPatientFormData}
            questionIds={{
              breastBiopsy: 33,
              left: 34,
              right: 35,
              benign: 36,
              malignant: 37,
              reportsAttached: 38,
            }}
            readOnly={controlData.readOnly ? true : false}
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
              confirmation: 43,
            }}
            readOnly={controlData.readOnly ? true : false}
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
            auditData={auditData}
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
            readOnly={controlData.readOnly ? true : false}
          />
        );
      default:
        return null;
    }
  };

  return (
    <form
      noValidate={controlData.readOnly}
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
      {loading && <LoadingOverlay />}
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
        <img
          src={logo}
          className="h-[4vh] hidden sm:block lg:h-[8vh]"
          alt="logo"
        />
        <div className="uppercase w-[80%] text-center text-sm sm:text-2xl font-bold">
          Technologist Form
        </div>
        <div className="h-auto bg-[#fff] flex flex-col items-start justify-start w-70 rounded px-2 py-[2px] my-1 text-xs sm:text-xs">
          <div className="capitalize flex">
            <div className="flex w-[6rem]">Patient Name</div>{" "}
            <div>: {locationState?.name}</div>
          </div>
          <div className="capitalize flex">
            <div className="flex w-[6rem]">Patient ID</div>{" "}
            <div>: {locationState?.custId}</div>
          </div>
          <div className="capitalize flex">
            <div className="flex w-[6rem]">Scan Center</div>{" "}
            <div>: {locationState?.scancenterCustId}</div>
          </div>
          {/* <img src={logo} alt="logo" className="w-full h-full object-contain" /> */}
        </div>
      </div>

      <Button
        type="button"
        variant="link"
        className="self-start flex text-foreground font-semibold items-center gap-2"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft />
        <span className="text-lg font-semibold">Back</span>
      </Button>

      <div className="px-3 w-full py-2 lg:px-15 h-[80vh]">
        <div className="bg-[#f9f4ed] w-full h-[8vh] rounded-sm flex overflow-x-auto hide-scrollbar">
          {options.map((option, index) => {
            const selectedIndex = options.indexOf(selectedSection);
            const isCompleted = index < selectedIndex;

            return (
              <div
                key={option}
                ref={(el) => {
                  optionRefs.current[option] = el;
                }}
                onClick={() => setSelectedSection(option)}
                className={`cursor-pointer w-[200px] lg:w-[20%] flex h-[8vh] gap-3 px-3 justify-center items-center ${
                  index !== options.length - 1 ? "border-r-1" : "border-r-0"
                } border-r-[#BFB2B2] ${
                  selectedSection === option
                    ? "border-b-5 border-b-[#abb4a5]"
                    : "border-b-5 border-b-[#f9f4ed]"
                } ${
                  isCompleted
                    ? "bg-[#eae0d4] border-b-5 !border-b-[#cbbfb1]"
                    : ""
                }`} // ✅ light green background if completed
              >
                <div
                  className={`w-[30px] lg:w-8 h-[30px] lg:h-8 bg-[#abb4a5] text-sm lg:text-xl flex justify-center items-center rounded-full text-white`}
                >
                  {isCompleted ? <Check size={16} /> : index + 1}
                </div>
                <div className="w-[150px] text-sm lg:text-sm">{option}</div>
              </div>
            );
          })}
        </div>
        <div className="mt-[1vh] h-[71vh] bg-[#f9f4ed] rounded-b-2xl">
          <div
            className={`h-[65vh] px-5 lg:p-5
              `}
          >
            {renderSectionComponent()}
          </div>
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
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </button>

              {!(
                options.indexOf(selectedSection) === options.length - 1 &&
                controlData.readOnly
              ) && (
                <button
                  type="submit"
                  className="flex items-center justify-center text-lg font-medium cursor-pointer px-4 max-w-[10rem] rounded-md"
                  // disabled={isNextButtonDisabled}
                >
                  {options.indexOf(selectedSection) === options.length - 1
                    ? "Submit"
                    : "Next"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              )}
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
