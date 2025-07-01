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
  data: any;
  setData: any;
  SResult: any;
};

const BreastInputWithout: React.FC<Props> = (Props) => {
  const getAnswerByQuestionId = (questionId: any) => {
    const result = Props.data.find(
      (item: any) => item.questionId === questionId
    );
    return result?.answer ?? ""; // Return empty string if not found
  };

  const updateAnswer = (questionId: number, newAnswer: any) => {
    Props.setData((prevData: any[]) =>
      prevData.map((item) =>
        item.questionId === questionId ? { ...item, answer: newAnswer } : item
      )
    );
  };

  return (
    <>
      <div className="flex justify-center items-center flex-row lg:flex-col gap-6">
        <div className="w-full flex flex-col lg:flex-row items-center gap-2 lg:gap-0 lg:space-x-10">
          <div className="flex flex-row w-[100%] lg:w-[30%] items-center space-x-2">
            <Checkbox2
              checked={getAnswerByQuestionId(Props.checkStatusQId) === "true"}
              onClick={() => {
                updateAnswer(
                  Props.checkStatusQId,
                  getAnswerByQuestionId(Props.checkStatusQId) === "true"
                    ? "false"
                    : "true"
                );
                if (getAnswerByQuestionId(Props.checkStatusQId) === "true") {
                  updateAnswer(Props.LQID, "");
                  updateAnswer(Props.RQID, "");
                  updateAnswer(Props.SDate, "");
                  // setRightSelected('');
                  // setLeftSelected('');
                  // setDate(undefined);
                }
              }}
            />
            <Label className="font-semibold text-base">{Props.label}</Label>
          </div>
          {getAnswerByQuestionId(Props.checkStatusQId) === "true" && (
            <div className="h-full w-full space-y-2">
              <div className="flex items-center h-[40px] space-x-2">
                <div className="flex items-center space-x-2">
                  <div
                    onClick={() =>
                      getAnswerByQuestionId(Props.checkStatusQId) === "true"
                    }
                    className="flex w-[67px]  justify-end items-center space-x-5"
                  >
                    <Label>R</Label>

                    <Checkbox2
                      checked={getAnswerByQuestionId(Props.RQID) === "true"}
                      onClick={() => {
                        updateAnswer(
                          Props.RQID,
                          getAnswerByQuestionId(Props.RQID) === "true"
                            ? "false"
                            : "true"
                        );
                      }}
                      required={
                        !(
                          getAnswerByQuestionId(Props.LQID) ||
                          getAnswerByQuestionId(Props.RQID)
                        )
                      }
                    />
                  </div>
                  <div
                    onClick={() =>
                      getAnswerByQuestionId(Props.checkStatusQId) === "true"
                    }
                    className="flex w-[67px] justify-end items-end space-x-5"
                  >
                    <Label>L</Label>

                    <Checkbox2
                      checked={getAnswerByQuestionId(Props.LQID) === "true"}
                      onClick={() => {
                        updateAnswer(
                          Props.LQID,
                          getAnswerByQuestionId(Props.LQID) === "true"
                            ? "false"
                            : "true"
                        );
                      }}
                      required={
                        !(
                          getAnswerByQuestionId(Props.LQID) ||
                          getAnswerByQuestionId(Props.RQID)
                        )
                      }
                    />
                  </div>
                </div>
                      {/* Result */}
                <div className="flex items-center lg:ml-2 gap-2 lg:gap-2">
                  {/* <Label className="min-w-[50px]">Result</Label> */}
                  <MultiOptionRadioGroup
                    questionId={Props.SResult}
                    handleInputChange={updateAnswer}
                    formData={Props.data}
                    options={[
                      { label: "Unchanged", value: "Unchanged" },
                      { label: "Resolved", value: "Resolved" },
                      { label: "New", value: "New" },
                    ]}
                    className="mt-0 flex-nowrap"
                  />
                </div>

                 {
                  getAnswerByQuestionId(Props.SResult) === "New" && (
                    <>
                      {/* Since (Months) */}
                      <div className="flex flex-row items-center lg:ml-2 gap-2 lg:gap-2 w-full lg:w-auto">
                        <Label className="min-w-[50px]">Duration</Label>
                        <Input
                          placeholder="Months"
                          value={getAnswerByQuestionId(Props.SDate)}
                          onChange={(e) => updateAnswer(Props.SDate, e.target.value)}
                          className="w-full lg:w-32"
                          type="number"
                          required={getAnswerByQuestionId(Props.SDate) === ""}
                        />
                      </div>
                    </>
                  )
                }
              </div>

              <div className="flex flex-col gap-2">
                
                

               
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BreastInputWithout;