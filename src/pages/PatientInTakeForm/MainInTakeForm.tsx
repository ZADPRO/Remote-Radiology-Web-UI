import { Label } from "@/components/ui/label";
import { CustomRadioGroupItem, RadioGroup } from "@/components/ui/radio-group";
import React, { useEffect, useState } from "react";
import logo from "../../assets/LogoNew.png";
import { Checkbox2 } from "@/components/ui/CustomComponents/checkbox2";
import { useLocation, useNavigate } from "react-router-dom";
import { SubmitDialog } from "./SubmitDialog";
import { patientInTakeService } from "@/services/patientInTakeFormService";
import { PatientInTakeFormNavigationState } from "./PatientInTakeFormS/PatientInTakeForm01";

export interface IntakeOption {
  questionId: number;
  answer: string; // "true" or "false"
}

// interface NavigateState {
//   formData: IntakeOption[];
//   appointmentId: number;
// }

const checkboxData: Record<string, { label: string; id: string }[]> = {
  "1": [
    {
      id: "171",
      label:
        "You have no current breast symptoms (lump, pain, discharge, etc.).",
    },
    { id: "172", label: "You are not diagnosed with breast cancer." },
    { id: "173", label: "You are undergoing routine screening." },
    { id: "174", label: "You have never had abnormal imaging findings." },
    { id: "175", label: "You want to assess your breast cancer risk." },
    { id: "176", label: "First-time breast scan." },
    { id: "177", label: "Regular screening due to age or family history." },
    {
      id: "178",
      label: "High-risk family background without personal diagnosis.",
    },
  ],
  "2": [
    {
      id: "179",
      label: "You have had an abnormal mammogram, ultrasound, or MRI.",
    },
    { id: "180", label: "Your doctor found a lump or other clinical finding." },
    {
      id: "181",
      label: "You were advised follow-up imaging for a suspicious area.",
    },
    {
      id: "182",
      label: "You are being assessed before biopsy or further evaluation.",
    },
    { id: "183", label: "You do not have a confirmed cancer diagnosis yet." },
    { id: "184", label: "BI-RADS 3, 4, or 5 mammogram." },
    { id: "185", label: "Lump found by physician." },
    {
      id: "186",
      label: "Suspicious changes in imaging without biopsy confirmation.",
    },
  ],
  "3": [
    { id: "187", label: "You have been diagnosed with breast cancer or DCIS." },
    {
      id: "188",
      label: "You are undergoing imaging to assess extent of disease.",
    },
    { id: "189", label: "You are in pre-surgical planning." },
    {
      id: "190",
      label:
        "You are starting, undergoing, or completing neoadjuvant therapy (chemo or hormonal).",
    },
    {
      id: "191",
      label:
        "You are seeking a second opinion on an existing cancer diagnosis.",
    },
    { id: "192", label: "Diagnosis of invasive ductal/lobular carcinoma." },
    { id: "193", label: "DCIS diagnosis requiring surgical planning." },
    { id: "194", label: "Undergoing treatment and monitoring response." },
  ],
  "4": [
    { id: "195", label: "You had a previous Breast QT scan." },
    { id: "196", label: "You are here for a scheduled follow-up." },
    {
      id: "197",
      label:
        "Your doctor advised a repeat scan for monitoring stability, progression, or doubling time.",
    },
    {
      id: "198",
      label: "You had a prior abnormality or lesion being tracked over time.",
    },
    { id: "199", label: "6-month or annual QT follow-up." },
    { id: "200", label: "Comparison to check lesion size or pattern." },
    { id: "201", label: "Follow-up after prior QT-guided surveillance." },
  ],
};

const intakeOptions = [
  {
    id: "1",
    questionId: 167, // New ID
    radioLabel:
      "I'm here for a routine breast screening (first-time or annual checkup).",
    formTitle: "S. Breast QT Screening Form (No Abnormal Findings)",
    footerLabel: "S : Screening - First-time or Annual checkup",
    headerTitle: "S. Routine Breast Screening (For Routine Screening first-time or annual checkup with No Prior Abnormal Findings)",
    subHeaderTitle: ""
  },
  {
    id: "2",
    questionId: 168, // New ID
    radioLabel:
      "I'm following up after an abnormal symptom or result from a previous scan.",
    formTitle: "F. Follow-up Evaluation Form (Abnormal Symptoms or Results)",
    footerLabel: "F : Follow-up after abnormal findings",
    headerTitle: "Da. Diagnostic - Abnormal Symptom or Imaging (No Cancer Diagnosis Yet)",
    subHeaderTitle: "(For Abnormal Imaging or Clinical Findings - No Cancer Diagnosis Yet)"
  },
  {
    id: "3",
    questionId: 169, // New ID
    radioLabel:
      "I've been diagnosed with breast cancer or DCIS and need imaging.",
    formTitle: "D. Breast Cancer/ DCIS Assessment Form",
    footerLabel: "D : Diagnosed with Breast Cancer or DCIS",
    headerTitle: "Db. Diagnostic - Biopsy Confirmed DCIS or Breast Cancer Diagnosis",
    subHeaderTitle: "(For Biopsy Confirmed DCIS or Breast Cancer Diagnosis)"
  },
  {
    id: "4",
    questionId: 170, // New ID
    radioLabel: "I had a QT scan before and I'm back to compare my results.",
    formTitle: "C. QT Comparison Follow-up Form",
    footerLabel: "C : Comparison with prior QT scan",
    headerTitle: "Dc. Diagnostic - Comparison to a Prior QT Scan",
    subHeaderTitle: "(For Patients with Prior QT Exam Needing Follow-up or Doubling Time Assessment)"
  },
];

const MainInTakeForm: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [formData, setFormData] = useState<IntakeOption[]>([]);

  const [mainFormData, setMainFormData] = useState({
    categoryId: 0,
    overriderequest: false,
    appointmentId: 0,
  });

  const [dialogOpen, setDialogOpen] = useState(false);

  const location = useLocation();

  const fetchFormData: PatientInTakeFormNavigationState = useLocation().state;

  useEffect(() => {
      if (fetchFormData.fetchFormData) {
        handleFetchPatientForm(fetchFormData.apiInfo.userId, fetchFormData.apiInfo.appointmentId);
        
      }
    }, []);
  
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
          if (fetchFormData.categoryId) {
            const selected = intakeOptions.find(
              (opt) => opt.questionId === fetchFormData.categoryId
            );
            if (selected) {
              setSelectedOption(selected.id);
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
  
  const previousFormData: IntakeOption[] = location.state.formData || [];
  const navigate = useNavigate();

  const [suggestedOption, setSuggestedOption] = useState("");

  useEffect(() => {
    console.log("eeeeeeeeeeee")
    let initialFormData: IntakeOption[] = location.state.formData || [];

    // Ensure main radio options are present in formData
    intakeOptions.forEach(option => {
        if (!initialFormData.some(item => item.questionId === option.questionId)) {
            initialFormData.push({ questionId: option.questionId, answer: "false" });
        }
    });

    // Ensure all checkboxes are present in formData with correct categoryId
    Object.keys(checkboxData).forEach(mainOptionId => {
        const mainOptionQId = intakeOptions.find(opt => opt.id === mainOptionId)?.questionId;
        if (mainOptionQId === undefined) return; // Should not happen

        checkboxData[mainOptionId].forEach(cb => {
            const qId = parseInt(cb.id);
            if (!initialFormData.some(item => item.questionId === qId)) {
                initialFormData.push({ questionId: qId, answer: "false"});
            }
        });
    });

    setFormData(initialFormData); // Set the initial formData

    setMainFormData((prev) => ({
      ...prev,
      appointmentId: location.state.appointmentId, // replace with your actual value
    }));


    // Suggestion logic
      let suggestion = "";

      if (previousFormData.find(item => item.questionId === 87)?.answer.toString() === "Yes") {
        suggestion = "2"
      } else if (previousFormData.find(item => item.questionId === 126)?.answer.toString() === "Abnormal") {
        suggestion = "2"
      } else if (previousFormData.find(item => item.questionId === 131)?.answer.toString() === "Abnormal") {
        suggestion = "2"
      } else if (previousFormData.find(item => item.questionId === 136)?.answer.toString() === "Abnormal") {
        suggestion = "2"
      } else if (previousFormData.find(item => item.questionId === 141)?.answer.toString() === "Abnormal") {
        suggestion = "2"
      } else if (previousFormData.find(item => item.questionId === 146)?.answer.toString() === "Abnormal") {
        suggestion = "2"
      } else if (previousFormData.find(item => item.questionId === 151)?.answer.toString() === "Abnormal") {
        suggestion = "4"
      } else if (previousFormData.find(item => item.questionId === 162)?.answer.toString() === "Yes") {
        suggestion = "3"
      }
      setSuggestedOption(suggestion)
      setSelectedOption(suggestion);
  }, [location.state]);

  // Step 2: When selectedOption changes, add mapped values safely
  useEffect(() => {
    if (!selectedOption) return;

    // Update categoryId in mainFormData based on selectedOption
    setMainFormData(prev => ({
      ...prev,
      categoryId: parseInt(selectedOption, 10) // Convert selectedOption to number
    }));

    setFormData(prevFormData => {
        const updatedFormData = [...prevFormData]; // Create a mutable copy

        // Update the answer for the selected main option and clear others
        intakeOptions.forEach(option => {
            const qId = option.questionId;
            const isSelected = option.id === selectedOption;
            const entryIndex = updatedFormData.findIndex(item => item.questionId === qId);
            if (entryIndex !== -1) {
                updatedFormData[entryIndex] = { ...updatedFormData[entryIndex], answer: isSelected ? "true" : "false" };
            } else {
                updatedFormData.push({ questionId: qId, answer: isSelected ? "true" : "false" });
            }
        });

        // Reset answers for ALL checkboxes in checkboxData to false
        Object.values(checkboxData).flat().forEach(cb => {
            const qId = parseInt(cb.id);
            const entryIndex = updatedFormData.findIndex(item => item.questionId === qId);
            if (entryIndex !== -1) {
                updatedFormData[entryIndex] = { ...updatedFormData[entryIndex], answer: "false" };
            } else {
                // This case should ideally not happen if formData is pre-filled correctly
                // Assign a default categoryId, e.g., 0 or the questionId of the main option it belongs to.
                updatedFormData.push({ questionId: qId, answer: "false" });
            }
        });

        return updatedFormData;
    });
  }, [selectedOption]); // Depend only on selectedOption

  const handleCheckboxChange = (id: string, checked: boolean) => {
    const questionId = parseInt(id);
    setFormData((prev) =>
      prev.map((item) =>
        item.questionId === questionId
          ? { ...item, answer: checked ? "true" : "false" }
          : item
      )
    );
  };
  const formRoutes: Record<string, string> = {
    "1": "/patientInTakeForm-01",
    "2": "/patientInTakeForm-02",
    "3": "/patientInTakeForm-03",
    "4": "/patientInTakeForm-04",
  };

  console.log(formData); // Debugging

  return (
    <div className="flex flex-col gap-3 h-dvh lg:flex-row w-full p-5 lg:p-0 bg-gradient-to-b from-[#EED2CF] to-[#FEEEED] overflow-y-auto">
      {/* Left Panel */}
      <div className="lg:bg-[#A4B2A1] w-full lg:w-1/2 lg:p-6 lg:shadow-[6px_4px_26.2px_5px_#0000002B] flex flex-col justify-center lg:items-center gap-2">
        <h1 className="text-3xl lg:text-3xl font-semibold lg:mb-6 text-start lg:text-center">
          Please confirm the reason why you are having this QT scan
        </h1>

        <RadioGroup
          className="flex flex-col gap-2 lg:gap-5"
          value={selectedOption}
          onValueChange={setSelectedOption}
        >
          {intakeOptions.map(({ id, radioLabel }) => (
            <>
              {id == suggestedOption && (
                <span className="text-muted-foreground italic">
                  (Please Proceed with the Current Selected Form)
                </span>
              )}
              <div
                key={id}
                className="flex items-start lg:items-center bg-[#A3B1A1] lg:bg-transparent gap-3 p-3 lg:p-0 rounded-md"
              >
                <CustomRadioGroupItem
                  className="text-black bg-white  data-[state=checked]:ring-2"
                  value={id}
                  id={`r${id}`}
                />
                <Label
                  htmlFor={`r${id}`}
                  className="text-black lg:text-white text-sm lg:text-2xl leading-snug"
                >
                  {radioLabel}
                </Label>
              </div>
            </>
          ))}
        </RadioGroup>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 lg:p-6 flex flex-col items-end lg:overflow-auto border lg:border-none border-gray-500 rounded-lg">
        <div className="hidden lg:inline h-20 w-40 mb-4 self-end">
          <img src={logo} alt="logo" className="w-full h-full object-contain" />
        </div>

        {selectedOption && (
          <div className="w-full">
            <h1 className="text-lg lg:text-2xl p-2 lg:p-0 text-start lg:text-center font-extrabold">
              {
                intakeOptions.find((opt) => opt.id === selectedOption)
                  ?.headerTitle
              }
            </h1>
            <p className="text-center text-muted-foreground">
              {
                intakeOptions.find((opt) => opt.id === selectedOption)
                  ?.subHeaderTitle
              }
            </p>
            <div className="space-y-4 p-4 lg:pl-10">
              {(checkboxData[selectedOption] || []).map((cb) => {
                const isChecked =
                  formData.find((f) => f.questionId === parseInt(cb.id))
                    ?.answer === "true";

                return (
                  <div key={cb.id} className="flex gap-3 items-center">
                    <Checkbox2
                      id={cb.id}
                      checked={isChecked}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(cb.id, !!checked)
                      }
                    />
                    <Label htmlFor={cb.id} className="text-base">
                      {cb.label}
                    </Label>
                  </div>
                );
              })}
            </div>

            {formData.some(
              (item) =>
                item.answer === "true" &&
                item.questionId >= 171 &&
                item.questionId <= 201
            ) && (
              <div className="hidden lg:inline">
                <div className="w-2/3 flex flex-col align-items justify-center mt-4 mx-auto gap-4">
                  {/* <h1 className="text-2xl text-center font-semibold">
                    {
                      intakeOptions.find((opt) => opt.id === selectedOption)
                        ?.formTitle
                    }
                  </h1> */}

                  {selectedOption === "1" ? (
                    <button
                      className="w-1/2 mx-auto bg-[#a4b2a1] text-white font-bold p-3 uppercase border-2 border-white rounded-lg cursor-pointer hover:bg-[#91a48d]"
                      onClick={() => setDialogOpen(true)}
                    >
                      Submit
                    </button>
                  ) : (
                    <button
                      className="w-1/2 mx-auto bg-[#a4b2a1] text-white font-bold p-3 uppercase border-2 border-white rounded-lg cursor-pointer hover:bg-[#91a48d]"
                      onClick={() =>
                        navigate(formRoutes[selectedOption], {
                          state: { formData, mainFormData },
                        })
                      }
                    >
                      Proceed Form
                    </button>
                  )}
                </div>

                {/* <div className="w-full text-center mt-2 font-semibold">
                  <span>
                    {
                      intakeOptions.find((opt) => opt.id === selectedOption)
                        ?.footerLabel
                    }
                  </span>
                </div> */}
              </div>
            )}
          </div>
        )}
      </div>
      {formData.some(
        (item) =>
          item.answer === "true" &&
          item.questionId >= 171 &&
          item.questionId <= 201
      ) && (
        <div className="inline lg:hidden mt-4">
          <div className="flex flex-col gap-2 items-center ">
            {/* <h1 className="text-base text-center font-bold">
              {
                intakeOptions.find((opt) => opt.id === selectedOption)
                  ?.formTitle
              }
            </h1> */}
            {selectedOption === "1" ? (
              <button
                className="w- mx-auto bg-[#a4b2a1] rounded-2xl text-white p-3"
                onClick={() => setDialogOpen(true)}
              >
                SUBMIT
              </button>
            ) : (
              <button
                className="w- mx-auto bg-[#a4b2a1] rounded-2xl text-white p-3"
                onClick={() =>
                  navigate(formRoutes[selectedOption], {
                    state: { formData, mainFormData },
                  })
                }
              >
                PROCEED TO FORM
              </button>
            )}

            {/* <div className="w-full text-sm text-center font-semibold">
              <span>
                {
                  intakeOptions.find((opt) => opt.id === selectedOption)
                    ?.footerLabel
                }
              </span>
            </div> */}
          </div>
        </div>
      )}
      <SubmitDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        formData={formData}
        mainFormData={mainFormData}
        appointmentId={mainFormData.appointmentId}
      />
    </div>
  );
};

export default MainInTakeForm;
