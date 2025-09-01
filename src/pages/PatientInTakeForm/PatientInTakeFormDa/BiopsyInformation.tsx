import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import FormHeader from "../FormHeader";
import TwoOptionRadioGroup from "@/components/ui/CustomComponents/TwoOptionRadioGroup";
import DatePicker from "@/components/date-picker";
import { IntakeOption } from "../PatientInTakeForm";
import { parseLocalDate } from "@/lib/dateUtils";
import TextEditor from "@/components/TextEditor";
import { PatientHistoryReportGenerator } from "@/pages/Report/GenerateReport/PatientHistoryReportGenerator";

interface QuestionIds {
  performed: number;
  datebio: number;
  typebiopsy: number;
  guidance: number;
  Biopsyresult: number;
  Benignother: number;
  Atypicalother: number;
  Highrisklesionother: number;
  Pathology: number;
}

interface Props {
  formData: IntakeOption[];
  handleInputChange: (questionId: number, value: string) => void;
  questionIds: QuestionIds;
  readOnly: boolean;
}

const BiopsyInformation: React.FC<Props> = ({
  formData,
  handleInputChange,
  questionIds,
  readOnly,
}) => {
  const getAnswer = (id: number) =>
    formData.find((q) => q.questionId === id)?.answer || "";

  return (
    <div className="flex flex-col h-full">
      <FormHeader
        FormTitle="BIOPSY INFORMATION (if applicable)"
        className="uppercase"
      />
      <div className="bg-[#fff]">
        {<TextEditor value={PatientHistoryReportGenerator(formData)} readOnly={true} />}
      </div>
      <div className={readOnly ? "pointer-events-none" : ""}>
        <div className="flex-grow overflow-y-auto px-5 py-10 lg:pt-0 lg:px-20 space-y-6 pb-10">
          {/* A. Biopsy performed? */}
          <TwoOptionRadioGroup
            label="A. Biopsy performed?"
            questionId={questionIds.performed}
            formData={formData}
            handleInputChange={handleInputChange}
            options={[
              { label: "No", value: "No" },
              { label: "Yes", value: "Yes" },
            ]}
          />

          {getAnswer(questionIds.performed) === "Yes" && (
            <>
              {/* B. If yes, date of biopsy */}
              <div className="flex flex-col lg:flex-row gap-3 lg:gap-5 mt-2">
                <Label className="font-semibold text-base">
                  B. If yes, date of biopsy{" "}
                  <span className="text-red-500">*</span>
                </Label>
                {/* <Input
                                    className="w-64"
                                    value={getAnswer(questionIds.datebio)}
                                    onChange={(e) =>
                                        handleInputChange(questionIds.datebio, e.target.value)
                                    }
                                /> */}
                <div className="w-45">
                  <DatePicker
                    value={
                      getAnswer(questionIds.datebio)
                        ? parseLocalDate(getAnswer(questionIds.datebio))
                        : undefined
                    }
                    onChange={(val) =>
                      handleInputChange(
                        questionIds.datebio,
                        val?.toLocaleDateString("en-CA") || ""
                      )
                    }
                    disabledDates={(date) => date > new Date()}
                    required
                  />
                </div>
              </div>

              {/* C. Type of biopsy */}
              <TwoOptionRadioGroup
                className="flex flex-col gap-3 mt-3 "
                label="C. Type of biopsy"
                questionId={questionIds.typebiopsy}
                formData={formData}
                handleInputChange={handleInputChange}
                options={[
                  {
                    label: "Fine needle aspiration (FNA)",
                    value: "Fine needle aspiration (FNA)",
                  },
                  { label: "Core needle biopsy", value: "Core needle biopsy" },
                  {
                    label: "Vacuum-assisted biopsy",
                    value: "Vacuum-assisted biopsy",
                  },
                  {
                    label: "Surgical/excisional biopsy ",
                    value: "Surgical/excisional biopsy ",
                  },
                  { label: "Unknown", value: "Unknown" },
                ]}
                required
              />

              {/* D. Guidance method */}
              <TwoOptionRadioGroup
                className="flex flex-col gap-3 mt-3 "
                label="D. Guidance method"
                questionId={questionIds.guidance}
                formData={formData}
                handleInputChange={handleInputChange}
                options={[
                  { label: "Ultrasound-guided", value: "Ultrasound-guided" },
                  { label: "Stereotactic", value: "Stereotactic" },
                  { label: "MRI-guided", value: "MRI-guided" },
                  { label: "Palpation-guided", value: "Palpation-guided" },
                  { label: "Unknown", value: "Unknown" },
                ]}
                required
              />

              {/*E. Biopsy results*/}
              <div className="flex -mt-2 flex-col gap-4">
                <Label className="font-bold text-base">
                  E. Biopsy results <span className="text-red-500">*</span>
                </Label>
                <div className="flex flex-col gap-2 lg:gap-0">
                  {[
                    "Benign",
                    "Atypical",
                    "High-risk lesion",
                    "Indeterminate",
                    "Inadequate sample",
                    "Unknown",
                  ].map((option) => (
                    <div
                      key={option}
                      className="ml-4 flex items-start gap-2 lg:items-center flex-col lg:flex-row h-[auto] lg:min-h-[40px]"
                    >
                      <div className="flex space-x-2 ">
                        <input
                          type="radio"
                          name="support"
                          value={option}
                          checked={
                            getAnswer(questionIds.Biopsyresult) === option
                          }
                          onChange={() =>
                            handleInputChange(questionIds.Biopsyresult, option)
                          }
                          className="custom-radio"
                          id={option === "Other" ? "SupportOther" : option}
                          required
                        />
                        <Label
                          htmlFor={option === "Other" ? "SupportOther" : option}
                          className="w-[230px]"
                        >
                          {option}
                        </Label>
                      </div>
                      {option === "Benign"
                        ? getAnswer(questionIds.Biopsyresult) === "Benign" && (
                            <Input
                              type="text"
                              value={getAnswer(questionIds.Benignother)}
                              onChange={(e) =>
                                handleInputChange(
                                  questionIds.Benignother,
                                  e.target.value
                                )
                              }
                              required
                              placeholder="Specify"
                              className="w-64 text-sm"
                            />
                          )
                        : option === "Atypical"
                        ? getAnswer(questionIds.Biopsyresult) ===
                            "Atypical" && (
                            <Input
                              type="text"
                              value={getAnswer(questionIds.Atypicalother)}
                              onChange={(e) =>
                                handleInputChange(
                                  questionIds.Atypicalother,
                                  e.target.value
                                )
                              }
                              required
                              placeholder="Specify"
                              className="w-64 text-sm"
                            />
                          )
                        : option === "High-risk lesion" &&
                          getAnswer(questionIds.Biopsyresult) ===
                            "High-risk lesion" && (
                            <Input
                              type="text"
                              value={getAnswer(questionIds.Highrisklesionother)}
                              onChange={(e) =>
                                handleInputChange(
                                  questionIds.Highrisklesionother,
                                  e.target.value
                                )
                              }
                              required
                              placeholder="Specify"
                              className="w-64 text-sm"
                            />
                          )}
                    </div>
                  ))}
                </div>
              </div>

              {/*F. Pathology recommendations:*/}
              <div className="flex flex-col lg:flex-row gap-2 lg:gap-5 mt-2">
                <Label className="font-semibold text-base">
                  F. Pathology recommendations:
                </Label>
                <Input
                  className="w-64"
                  value={getAnswer(questionIds.Pathology)}
                  onChange={(e) =>
                    handleInputChange(questionIds.Pathology, e.target.value)
                  }
                  placeholder="Specify"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BiopsyInformation;
