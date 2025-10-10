import { Label } from "@/components/ui/label";
import { CustomRadioGroupItem, RadioGroup } from "@/components/ui/radio-group";
import React, { useContext, useEffect, useState } from "react";
import logo from "../../assets/LogoNew.png";
import { Checkbox2 } from "@/components/ui/CustomComponents/checkbox2";
import {
  IntakeOption,
  PatientContext,
  PatientInTakeFormNavigationState,
} from "./PatientInTakeForm";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  formData: IntakeOption[];
  setFormData: React.Dispatch<React.SetStateAction<IntakeOption[]>>;
  handleFormSwitch: (formNumber: number) => void;
  controlData: PatientInTakeFormNavigationState;
  openSubmitDialog: () => void;
  readOnly: boolean;
}

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
    questionId: 170, // New ID
    radioLabel:
      "I'm here for a routine breast screening (first-time or annual checkup).",
    formTitle: "S. Breast QT Screening Form (No Abnormal Findings)",
    footerLabel: "S : Screening - First-time or Annual checkup",
    headerTitle:
      "S. Routine Breast Screening (For Routine Screening first-time or annual checkup with No Prior Abnormal Findings)",
    subHeaderTitle: "",
  },
  {
    id: "2",
    questionId: 170, // New ID
    radioLabel:
      "I'm following up after an abnormal symptom or result from a previous scan.",
    formTitle: "F. Follow-up Evaluation Form (Abnormal Symptoms or Results)",
    footerLabel: "F : Follow-up after abnormal findings",
    headerTitle:
      "Da. Diagnostic - Abnormal Symptom or Imaging (No Cancer Diagnosis Yet)",
    subHeaderTitle:
      "(For Abnormal Imaging or Clinical Findings - No Cancer Diagnosis Yet)",
  },
  {
    id: "3",
    questionId: 170, // New ID
    radioLabel:
      "I've been diagnosed with breast cancer or DCIS and need imaging.",
    formTitle: "D. Breast Cancer/ DCIS Assessment Form",
    footerLabel: "D : Diagnosed with Breast Cancer or DCIS",
    headerTitle:
      "Db. Diagnostic - Biopsy Confirmed DCIS or Breast Cancer Diagnosis",
    subHeaderTitle: "(For Biopsy Confirmed DCIS or Breast Cancer Diagnosis)",
  },
  {
    id: "4",
    questionId: 170, // New ID
    radioLabel: "I had a QT scan before and I'm back to compare my results.",
    formTitle: "C. QT Comparison Follow-up Form",
    footerLabel: "C : Comparison with prior QT scan",
    headerTitle: "Dc. Diagnostic - Comparison to a Prior QT Scan",
    subHeaderTitle:
      "(For Patients with Prior QT Exam Needing Follow-up or Doubling Time Assessment)",
  },
];

const MainInTakeForm: React.FC<Props> = ({
  formData,
  setFormData,
  handleFormSwitch,
  controlData,
  openSubmitDialog,
  readOnly,
}) => {
  const [selectedOption, setSelectedOption] = useState("");

  const [suggestedOption, _] = useState("");

  const patientDetails = useContext(PatientContext);

  useEffect(() => {
    if (controlData.apiUpdate || readOnly) {
      controlData.categoryId
        ? setSelectedOption(controlData.categoryId.toString())
        : setSelectedOption(
            formData.find((item) => item.questionId === 170)?.answer || ""
          );
    } else {
      controlData.categoryId
        ? setSelectedOption(controlData.categoryId.toString())
        : setSelectedOption(
            formData.find((item) => item.questionId === 170)?.answer || ""
          );
      // Suggestion logic
      // let suggestion = "";

      // if (
      //   formData.find((item) => item.questionId === 87)?.answer.toString() ===
      //   "Yes"
      // ) {
      //   suggestion = "2";
      // } else if (
      //   formData.find((item) => item.questionId === 126)?.answer.toString() ===
      //   "Abnormal"
      // ) {
      //   suggestion = "2";
      // } else if (
      //   formData.find((item) => item.questionId === 131)?.answer.toString() ===
      //   "Abnormal"
      // ) {
      //   suggestion = "2";
      // } else if (
      //   formData.find((item) => item.questionId === 136)?.answer.toString() ===
      //   "Abnormal"
      // ) {
      //   suggestion = "2";
      // } else if (
      //   formData.find((item) => item.questionId === 141)?.answer.toString() ===
      //   "Abnormal"
      // ) {
      //   suggestion = "2";
      // } else if (
      //   formData.find((item) => item.questionId === 146)?.answer.toString() ===
      //   "Abnormal"
      // ) {
      //   suggestion = "2";
      // } else if (
      //   formData.find((item) => item.questionId === 151)?.answer.toString() ===
      //   "Abnormal"
      // ) {
      //   suggestion = "4";
      // } else if (
      //   formData.find((item) => item.questionId === 162)?.answer.toString() ===
      //   "Yes"
      // ) {
      //   suggestion = "3";
      // }
      // setSuggestedOption(suggestion);
      // setSelectedOption(suggestion);
    }
  }, []);

  // Step 2: When selectedOption changes, add mapped values safely
  useEffect(() => {
    // if (!selectedOption || readOnly) return;
    // console.log("===============>")
    // console.log("===============>")
    // setFormData((prevFormData) => {
    //   const updatedFormData = [...prevFormData];
    //   const setOrUpdate = (qId: number, value: any) => {
    //     const index = updatedFormData.findIndex(
    //       (item) => item.questionId === qId
    //     );
    //     if (index !== -1) {
    //       updatedFormData[index] = { ...updatedFormData[index], answer: value };
    //     } else {
    //       updatedFormData.push({ questionId: qId, answer: value });
    //     }
    //   };
    //   // ✅ Set questionId: 170 with selectedOption
    //   setOrUpdate(170, selectedOption);
    //   // ✅ Set questionId: 485 with empty string
    //   setOrUpdate(485, "");
    //   // ✅ Reset all checkboxes to false
    //   Object.values(checkboxData)
    //     .flat()
    //     .forEach((cb) => {
    //       const cbId = parseInt(cb.id);
    //       const idx = updatedFormData.findIndex(
    //         (item) => item.questionId === cbId
    //       );
    //       if (idx !== -1) {
    //         updatedFormData[idx] = { ...updatedFormData[idx], answer: "false" };
    //       } else {
    //         updatedFormData.push({ questionId: cbId, answer: "false" });
    //       }
    //     });
    //   return updatedFormData;
    // });
  }, [selectedOption]);

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

  console.log(formData); // Debugging

  return (
    //  <div className={readOnly ? "pointer-events-none" : ""}>
    <div className="flex flex-col gap-3 h-dvh lg:flex-row w-full p-5 lg:p-0 bg-gradient-to-b from-[#EED2CF] to-[#FEEEED] overflow-y-auto">
      {/* Left Panel */}
      <div className="lg:bg-[#A4B2A1] w-full lg:w-1/2 lg:shadow-[6px_4px_26.2px_5px_#0000002B] flex flex-col lg:justify-between gap-2 h-auto lg:min-h-screen lg:overflow-y-auto">
        {/* Back Button at Top */}
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="link"
            className="flex text-foreground font-semibold items-center gap-2 p-4"
            onClick={() => handleFormSwitch(1)}
          >
            <ArrowLeft />
            <span className="text-lg font-semibold">Back</span>
          </Button>
          {!patientDetails?.reportview && (
            <>
              <img
                src={logo}
                alt="logo"
                className="hidden lg:block h-20 w-40 pr-2 object-contain"
              />
              <img
                src={logo}
                alt="logo"
                className="lg:hidden h-20 w-40 object-contain"
              />
            </>
          )}
        </div>

        {/* Content Centered Vertically */}
        <div className="flex-grow flexs-center lg:px-4">
          <div className="w-full h-full  lg:p-6">
            <h1 className="text-3xl lg:text-3xl font-semibold lg:mb-6 text-start lg:text-center">
              Please confirm the reason why you are having this QT scan
            </h1>

            <RadioGroup
              className={`flex flex-col w-full gap-2 lg:gap-5 ${
                readOnly ? "pointer-events-none" : ""
              }`}
              value={selectedOption}
              onValueChange={(e) => {
                setSelectedOption(e);
                setFormData((prev) =>
                  prev.map((item) =>
                    item.questionId === 170 ? { ...item, answer: e } : item
                  )
                );
              }}
            >
              {intakeOptions.map(({ id, radioLabel }) => (
                <div
                  key={id}
                  className="flex items-center bg-[#A3B1A1] lg:bg-transparent gap-3 p-3 lg:p-0 rounded-md"
                >
                  <CustomRadioGroupItem
                    className="text-black bg-white data-[state=checked]:ring-2"
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
              ))}
            </RadioGroup>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 lg:p-6 flex flex-col items-end lg:overflow-auto border lg:border-none border-gray-500 rounded-lg">
        {!patientDetails?.reportview && (
          <div className="hidden lg:inline h-20 w-70 mb-10 self-end">
            <div className="h-18 bg-[#fff] font-semibold flex flex-col items-start justify-center w-70 rounded p-3 my-5 text-sm self-end">
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
          </div>
        )}

        {selectedOption && (
          <div className="w-full">
            {selectedOption === suggestedOption && (
              <p className="text-muted-foreground text-center italic">
                (Please Proceed with the Current Selected Form)
              </p>
            )}
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
            <div
              className={`space-y-4 p-4 lg:pl-10 ${
                readOnly ? "pointer-events-none" : ""
              }`}
            >
              <p className="text-start text-foreground font-semibold">
                Kindly Check a Option to Proceed
              </p>

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
              <div className="flex items-center gap-3">
                <Label className="text-lg">Other</Label>
                <Input
                  value={
                    formData.find((item) => item.questionId === 485)?.answer ||
                    ""
                  }
                  onChange={(e) => {
                    setFormData((prev) =>
                      prev.map((item) =>
                        item.questionId === 485
                          ? { ...item, answer: e.target.value }
                          : item
                      )
                    );
                  }}
                />
              </div>
            </div>

            {(formData.some(
              (item) =>
                item.answer === "true" &&
                item.questionId >= 171 &&
                item.questionId <= 201
            ) ||
              (formData.find((item) => item.questionId === 485)?.answer
                ?.length ?? 0) > 0) && (
              <div className="hidden lg:inline">
                <div className="w-2/3 flex flex-col align-items justify-center mt-4 mx-auto gap-4">
                  {selectedOption === "1" ? (
                    <button
                      className="w-1/2 mx-auto bg-[#a4b2a1] text-white font-bold p-3 uppercase border-2 border-white rounded-lg cursor-pointer hover:bg-[#91a48d]"
                      onClick={openSubmitDialog}
                      hidden={readOnly}
                    >
                      Submit
                    </button>
                  ) : (
                    <button
                      className="w-1/2 mx-auto bg-[#a4b2a1] text-white font-bold p-3 uppercase border-2 border-white rounded-lg cursor-pointer hover:bg-[#91a48d] pointer-events-auto"
                      onClick={() => handleFormSwitch(parseInt(selectedOption))}
                    >
                      Proceed Form
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {(formData.some(
        (item) =>
          item.answer === "true" &&
          item.questionId >= 171 &&
          item.questionId <= 201
      ) ||
        (formData.find((item) => item.questionId === 485)?.answer?.length ??
          0) > 0) && (
        <div className="inline lg:hidden mt-4">
          <div className="flex flex-col gap-2 items-center ">
            {selectedOption === "1" ? (
              <button
                className="w- mx-auto bg-[#a4b2a1] rounded-2xl text-white p-3"
                onClick={openSubmitDialog}
                hidden={readOnly}
              >
                SUBMIT
              </button>
            ) : (
              <button
                className="w- mx-auto bg-[#a4b2a1] rounded-2xl text-white p-3 pointer-events-auto"
                onClick={() => handleFormSwitch(parseInt(selectedOption))}
              >
                PROCEED TO FORM
              </button>
            )}
          </div>
        </div>
      )}
    </div>
    // </div>
  );
};

export default MainInTakeForm;
