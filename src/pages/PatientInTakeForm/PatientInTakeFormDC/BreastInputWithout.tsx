import { Checkbox2 } from "@/components/ui/CustomComponents/checkbox2";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import MultiOptionRadioGroup from "@/components/ui/CustomComponents/MultiOptionRadioGroup";

type Props = {
  label: string;
  checkStatusQId: number;
  RQID: number;
  LQID: number;
  SDate: any;
  SDateRight: any;
  data: any;
  setData: any;
  SResult: any;
  SResultRight: any;
};

const BreastInputWithout: React.FC<Props> = (Props) => {
  const getAnswerByQuestionId = (questionId: any) => {
    const result = Props.data.find(
      (item: any) => item.questionId === questionId
    );
    return result?.answer ?? "";
  };

  const updateAnswer = (questionId: number, newAnswer: any) => {
    Props.setData((prevData: any[]) =>
      prevData.map((item) =>
        item.questionId === questionId ? { ...item, answer: newAnswer } : item
      )
    );
  };

  return (
    <div className="flex justify-center items-center flex-row lg:flex-col gap-6">
      <div className="w-full flex flex-col lg:flex-row items-center gap-2 lg:gap-0 lg:space-x-10">
        {/* Master Toggle */}
        <div className="flex flex-row w-[100%] lg:w-[30%] items-center space-x-2">
          <Checkbox2
            checked={getAnswerByQuestionId(Props.checkStatusQId) === "true"}
            onClick={() => {
              const isChecked = getAnswerByQuestionId(Props.checkStatusQId) === "true";
              updateAnswer(Props.checkStatusQId, isChecked ? "false" : "true");
              if (isChecked) {
                updateAnswer(Props.LQID, "");
                updateAnswer(Props.RQID, "");
                updateAnswer(Props.SDate, "");
                updateAnswer(Props.SDateRight, "");
                updateAnswer(Props.SResult, "");
                updateAnswer(Props.SResultRight, "");
              }
            }}
          />
          <Label className="font-semibold text-base">{Props.label}</Label>
        </div>

        {getAnswerByQuestionId(Props.checkStatusQId) === "true" && (
          <div className="h-full w-full space-y-4 mt-2">
            {/* Right Section */}
            <div className="flex flex-col lg:flex-row items-start min-h-10 lg:items-center gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox2
                  checked={getAnswerByQuestionId(Props.RQID) === "true"}
                  onClick={() =>
                    updateAnswer(
                      Props.RQID,
                      getAnswerByQuestionId(Props.RQID) === "true" ? "false" : "true"
                    )
                  }
                />
                <Label>R</Label>
              </div>

              {getAnswerByQuestionId(Props.RQID) === "true" && (
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2">
                  <MultiOptionRadioGroup
                    questionId={Props.SResultRight}
                    handleInputChange={updateAnswer}
                    formData={Props.data}
                    options={[
                      { label: "Unchanged", value: "Unchanged" },
                      { label: "Resolved", value: "Resolved" },
                      { label: "New", value: "New" },
                    ]}
                    className="mt-0"
                  />

                  {getAnswerByQuestionId(Props.SResultRight) === "New" && (
                    <div className="flex flex-row items-center gap-2 w-full lg:w-auto">
                      <Label className="min-w-[70px]">Duration (Months)</Label>
                      <Input
                        placeholder="Months"
                        type="number"
                        className="w-full lg:w-32"
                        value={getAnswerByQuestionId(Props.SDateRight)}
                        onChange={(e) =>
                          updateAnswer(Props.SDateRight, e.target.value)
                        }
                        required
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Left Section */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center min-h-10 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox2
                  checked={getAnswerByQuestionId(Props.LQID) === "true"}
                  onClick={() =>
                    updateAnswer(
                      Props.LQID,
                      getAnswerByQuestionId(Props.LQID) === "true" ? "false" : "true"
                    )
                  }
                />
                <Label>L</Label>
              </div>

              {getAnswerByQuestionId(Props.LQID) === "true" && (
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2">
                  <MultiOptionRadioGroup
                    questionId={Props.SResult}
                    handleInputChange={updateAnswer}
                    formData={Props.data}
                    options={[
                      { label: "Unchanged", value: "Unchanged" },
                      { label: "Resolved", value: "Resolved" },
                      { label: "New", value: "New" },
                    ]}
                    className="mt-0"
                  />

                  {getAnswerByQuestionId(Props.SResult) === "New" && (
                    <div className="flex flex-row items-center gap-2 w-full lg:w-auto">
                      <Label className="min-w-[70px]">Duration (Months)</Label>
                      <Input
                        placeholder="Months"
                        type="number"
                        className="w-full lg:w-32"
                        value={getAnswerByQuestionId(Props.SDate)}
                        onChange={(e) =>
                          updateAnswer(Props.SDate, e.target.value)
                        }
                        required
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BreastInputWithout;