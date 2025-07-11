import React, { useEffect } from "react";
import { ReportQuestion } from "../Report";
import MultiRadioOptionalInputInline from "@/components/ui/CustomComponents/MultiRadioOptionalInputInline";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import CustomSelect from "@/components/ui/CustomComponents/CustomSelect";
import SingleBreastPositionPicker from "@/components/ui/CustomComponents/SingleBreastPositionPicker";
import GridNumber200 from "@/components/ui/CustomComponents/GridNumber200";
import { Checkbox2 } from "@/components/ui/CustomComponents/checkbox2";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface QuestionIds {
  grandularAndDuctalTissue: number;
  benignMicroCysts: number;
  benignCapsular: number;
  benignFibronodular: number;
  calcificationsPresent: number;
  macroCalcificationsList: number;
  microCalcificationsList: number;
  calcifiedScar: number;
  calcifiedScarList: number;
  ductalProminence: number;
  ductalProminenceList: number;
  grandularSelect: number;
}

interface Props {
  reportFormData: ReportQuestion[];
  handleReportInputChange: (questionId: number, value: string) => void;
  questionIds: QuestionIds;
  label: string;
}

const GrandularAndDuctalTissueRight: React.FC<Props> = ({
  questionIds,
  reportFormData,
  handleReportInputChange,
  label,
}) => {
  const getAnswer = (id: number) =>
    reportFormData.find((q) => q.questionId === id)?.answer || "";

  useEffect(() => {
    if (!reportFormData || reportFormData.length === 0) return;
    getAnswer(questionIds.grandularSelect) === "" &&
      handleReportInputChange(questionIds.grandularSelect, "Present");
    getAnswer(questionIds.grandularAndDuctalTissue) === "" &&
      handleReportInputChange(questionIds.grandularAndDuctalTissue, "Normal");
    getAnswer(questionIds.benignMicroCysts) === "" &&
      handleReportInputChange(questionIds.benignMicroCysts, "Absent");
    getAnswer(questionIds.benignCapsular) === "" && handleReportInputChange(questionIds.benignCapsular, "Absent");
    getAnswer(questionIds.benignFibronodular) === "" && handleReportInputChange(questionIds.benignFibronodular, "Absent");
    getAnswer(questionIds.calcificationsPresent) === "" &&
      handleReportInputChange(questionIds.calcificationsPresent, "Absent");
    getAnswer(questionIds.calcifiedScar) === "" &&
      handleReportInputChange(questionIds.calcifiedScar, "Absent");
    getAnswer(questionIds.ductalProminence) === "" &&
      handleReportInputChange(questionIds.ductalProminence, "Absent");
  }, []);

  const renderCalcificationList = (
    label: string,
    listId: number,
    typeOptions: string[],
    showDistributions: boolean = false,
    enableOtherInput: boolean = false
  ) => {
    const parsedList = JSON.parse(
  getAnswer(listId) ||
    JSON.stringify([{ type: "", clock: "", level: "", distribution: "", otherText: "" }])
) as {
  type: string;
  clock: string;
  level: string;
  distribution?: string;
  otherText?: string; // <-- NEW
}[];

    const updateList = (
      updated: {
        type: string;
        clock: string;
        level: string;
        distribution?: string;
      }[]
    ) => {
      handleReportInputChange(listId, JSON.stringify(updated));
    };

    const distributionOptions: string[] = [
      "Diffuse",
      "Regional",
      "Grouped",
      "Linear",
      "Segmental",
    ];

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Label className="text-base font-semibold">{label}</Label>

          <Button
            variant="greenTheme"
            className="text-shite"
            onClick={() => {
              const newItem = {
                type: label === "Macrocalcifications" ? "Clumped" : "",
                clock: "",
                level: "",
                ...(showDistributions && { distribution: "" }),
              };
              updateList([...parsedList, newItem]);
            }}
          >
            Add
          </Button>
        </div>
        {parsedList.map((item, index) => (
          <div key={index} className="flex items-center gap-2 pl-4">
            <span className="text-sm font-medium">{index + 1}.</span>
            <CustomSelect
              value={item.type}
              onChange={(val) => {
                const updated = [...parsedList];
                updated[index].type = val;
                updateList(updated);
              }}
              options={typeOptions}
              required
            />
            {item.type === "Other" && enableOtherInput && (
              <Input
                className="w-[200px]"
                placeholder="Specify"
                value={item.otherText || ""}
                onChange={(e) => {
                  const updated = [...parsedList];
                  updated[index].otherText = e.target.value;
                  updateList(updated);
                }}
              />
            )}

            <SingleBreastPositionPicker
              value={item.clock}
              onChange={(val) => {
                const updated = [...parsedList];
                updated[index].clock = val;
                updateList(updated);
              }}
              singleSelect={true}
            />
            <span className="text-sm">o'clock, level</span>
            <GridNumber200
              value={item.level}
              onChange={(val) => {
                const updated = [...parsedList];
                updated[index].level = val;
                updateList(updated);
              }}
            />
            {showDistributions && (
              <>
                <span className="text-sm">, distribution</span>
                <CustomSelect
                  value={item.distribution || ""} // ✅ ensure it's always a string
                  onChange={(val) => {
                    const updated = [...parsedList];
                    updated[index].distribution = val;
                    updateList(updated);
                  }}
                  options={distributionOptions}
                />
              </>
            )}
            {parsedList.length > 1 && (
              <button
                className="text-red-500"
                onClick={() => {
                  const updated = parsedList.filter((_, i) => i !== index);
                  updateList(updated);
                }}
              >
                <Trash2 size={15} />
              </button>
            )}

            {/* {index === parsedList.length - 1 && (
              <span
                className="text-blue-500 cursor-pointer text-sm underline"
                onClick={() => {
                  const newItem = {
                    type: "",
                    clock: "",
                    level: "",
                    ...(showDistributions && { distribution: "" }), // ✅ only include if needed
                  };
                  updateList([...parsedList, newItem]);
                }}
              >
                Add
              </span>
            )} */}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="flex gap-4 items-center mb-4">
        <div>
          <Checkbox2
            checked={getAnswer(questionIds.grandularSelect) === "Present"}
            onCheckedChange={(checked) =>
              handleReportInputChange(
                questionIds.grandularSelect,
                checked ? "Present" : ""
              )
            }
            className="w-5 h-5 mt-1"
          />
        </div>
        <Label
          className="font-semibold text-2xl flex flex-wrap lg:items-center uppercase"
          style={{ wordSpacing: "0.2em" }}
        >
          {label}
        </Label>
      </div>

      {getAnswer(questionIds.grandularSelect) === "Present" && (
        <div className="py-4 lg:px-10 space-y-4">
          <MultiRadioOptionalInputInline
            label="Glandular And Ductal tissue"
            labelClassname="lg:w-[12rem]"
            questionId={questionIds.grandularAndDuctalTissue}
            formData={reportFormData}
            handleInputChange={handleReportInputChange}
            options={[
              { label: "Normal", value: "Normal" },
              { label: "Abnormal", value: "Abnormal" },
            ]}
          />

          <MultiRadioOptionalInputInline
            label="Benign Microcysts"
            labelClassname="lg:w-[12rem]"
            questionId={questionIds.benignMicroCysts}
            formData={reportFormData}
            handleInputChange={handleReportInputChange}
            options={[
              { label: "Absent", value: "Absent" },
              { label: "Present", value: "Present" },
            ]}
          />

          <MultiRadioOptionalInputInline
            label="Benign Capsular Microcalcification"
            labelClassname="lg:w-[12rem]"
            questionId={questionIds.benignCapsular}
            formData={reportFormData}
            handleInputChange={handleReportInputChange}
            options={[
              { label: "Absent", value: "Absent" },
              { label: "Present", value: "Present" },
            ]}
          />

          <MultiRadioOptionalInputInline
            label="Benign Fibronodular Density"
            labelClassname="lg:w-[12rem]"
            questionId={questionIds.benignFibronodular}
            formData={reportFormData}
            handleInputChange={handleReportInputChange}
            options={[
              { label: "Absent", value: "Absent" },
              { label: "Present", value: "Present" },
            ]}
          />

          <MultiRadioOptionalInputInline
            label="Ductal Prominence"
            labelClassname="w-[12rem]"
            questionId={questionIds.ductalProminence}
            formData={reportFormData}
            handleInputChange={handleReportInputChange}
            options={[
              { label: "Absent", value: "Absent" },
              { label: "Present", value: "Present" },
            ]}
          />

          {getAnswer(questionIds.ductalProminence) === "Present" && (
            <div className="pl-5 lg:pl-[12rem] space-y-6">
              {renderCalcificationList(
                "Ductal Prominence",
                questionIds.ductalProminenceList,
                ["No Mass Effect", "With Mass Effect"]
              )}
            </div>
          )}

          <MultiRadioOptionalInputInline
            label="Calcifications Present"
            labelClassname="w-[12rem]"
            questionId={questionIds.calcificationsPresent}
            formData={reportFormData}
            handleInputChange={handleReportInputChange}
            options={[
              { label: "Absent", value: "Absent" },
              { label: "Present", value: "Present" },
            ]}
          />

          {getAnswer(questionIds.calcificationsPresent) === "Present" && (
            <div className="pl-5 lg:pl-[12rem] space-y-6">
              {renderCalcificationList(
                "Macrocalcifications",
                questionIds.macroCalcificationsList,
                [
                  "Clumped",
                  "Coarse",
                  "Popcorn-like",
                  "Large Rod-Like",
                  "Round",
                  "Rim",
                  "Dystrophic",
                  "Suture",
                ],
                true
              )}

              {renderCalcificationList(
                "Microcalcifications",
                questionIds.microCalcificationsList,
                [
                  "Amorphous",
                  "Fine Linear",
                  "Fine Pleomorphic",
                  "Punctate",
                  "Coarse Heterogeneous",
                ],
                true
              )}
            </div>
          )}

          <MultiRadioOptionalInputInline
            label="Calcified Scar"
            labelClassname="w-[12rem]"
            questionId={questionIds.calcifiedScar}
            formData={reportFormData}
            handleInputChange={handleReportInputChange}
            options={[
              { label: "Absent", value: "Absent" },
              { label: "Present", value: "Present" },
            ]}
          />

          {getAnswer(questionIds.calcifiedScar) === "Present" && (
            <div className="pl-5 lg:pl-[12rem] space-y-6">
              {renderCalcificationList(
                "Calcified Scar Pattern",
                questionIds.calcifiedScarList,
                ["Linear", "Curved", "Patchy", "Other"],
                false,
  true
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GrandularAndDuctalTissueRight;
