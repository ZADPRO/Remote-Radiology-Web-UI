import { Checkbox2 } from "@/components/ui/CustomComponents/checkbox2";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import LabeledRadioWithOptionalInput from "@/components/ui/CustomComponents/LabeledRadioWithOptionalInput";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  label: string;
  checkStatusQId: number;
  biggerSide?: number;
  RQID: number;
  LQID: number;
  SDate: any;
  SDateRight: any;
  data: any;
  setData: any;
  OtherInputQId?: number;
  nipplePosition?: number;
  nipplePositionDetails?: number;
  nipplePositionRight?: number;
  nipplePositionRightDetails?: number;
  technician?: boolean;
  editStatus?: boolean;
  patientData?: any;
  setPatientData?: any;
  nameLabelColor?: string;
  requiredStatus?: boolean;
};

const BreastInputWithout: React.FC<Props> = (Props) => {
  const getAnswerByQuestionId = (questionId: any) => {
    if (Props.editStatus) {
      const result = Props.patientData.find(
        (item: any) => item.questionId === questionId
      );
      return result?.answer ?? ""; // Return empty string if not found
    } else {
      const result = Props.data.find(
        (item: any) => item.questionId === questionId
      );
      return result?.answer ?? ""; // Return empty string if not found
    }
  };

  const updateAnswer = (questionId: number, newAnswer: any) => {
    if (Props.editStatus) {
      Props.setPatientData((prevData: any[]) =>
        prevData.map((item) =>
          item.questionId === questionId ? { ...item, answer: newAnswer } : item
        )
      );
    } else {
      Props.setData((prevData: any[]) =>
        prevData.map((item) =>
          item.questionId === questionId ? { ...item, answer: newAnswer } : item
        )
      );
    }
  };

  return (
    <>
      <div className="flex justify-center items-center flex-row lg:flex-col gap-6">
        <div className="w-full flex flex-col lg:flex-row items-center lg:space-x-2">
          <div className="flex flex-row w-[100%] lg:w-[25%] items-center space-x-2">
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
              required={!Props.requiredStatus}
            />
            <Label
              className={`font-semibold text-base ${
                Props.nameLabelColor ? `${Props.nameLabelColor}` : ""
              }`}
            >
              {Props.label}
            </Label>
          </div>
          {getAnswerByQuestionId(Props.checkStatusQId) === "true" && (
            <div className="h-full w-full space-y-2">
              <div className="flex items-center flex-wrap gap-x-4 gap-y-2">
                <div className="flex flex-col gap-2 space-x-2">
                  <div className="flex items-center space-x-2">
                    <div
                      onClick={() =>
                        getAnswerByQuestionId(Props.checkStatusQId) === "true"
                      }
                      className="flex justify-end items-center space-x-5"
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
                          getAnswerByQuestionId(Props.OtherInputQId) === "" &&
                          !["true"].includes(
                            getAnswerByQuestionId(Props.RQID)
                          ) &&
                          !["true"].includes(getAnswerByQuestionId(Props.LQID))
                        }
                      />

                      {Props.label == "Deformity / Asymmetry" && (
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="biggerRight"
                            value="Right"
                            className="custom-radio"
                            checked={
                              getAnswerByQuestionId(Props.biggerSide) ===
                              "Right"
                            }
                            onChange={() =>
                              Props.biggerSide &&
                              updateAnswer(Props.biggerSide, "Right")
                            }
                            disabled={
                              getAnswerByQuestionId(Props.RQID) != "true"
                            }
                          />
                          <Label>Bigger Side</Label>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-start gap-2">
                      {Props.label == "Nipple changes" &&
                        Props.nipplePositionRight &&
                        Props.nipplePositionRightDetails && (
                          <LabeledRadioWithOptionalInput
                            name="nipple-position"
                            questionId={Props.nipplePositionRight}
                            optionalInputQuestionId={
                              Props.nipplePositionRightDetails
                            }
                            formData={Props.data}
                            handleInputChange={updateAnswer}
                            options={[
                              { label: "Inverted", value: "Inverted" },
                              { label: "Other", value: "Other" },
                            ]}
                            showInputWhenValue="Other"
                            inputPlaceholder="Specify"
                            inputWidth="w-32"
                            className="ml-0 mt-0 flex-row items-center gap-x-4"
                            required
                            disabled={
                              getAnswerByQuestionId(Props.RQID) != "true"
                            }
                          />
                        )}
                    </div>

                    <div className="flex items-center w-48 space-x-2">
                      <Label htmlFor="date" className="">
                        Duration (Months)
                      </Label>
                      <Input
                        name="date"
                        type="number"
                        placeholder="Months"
                        value={getAnswerByQuestionId(Props.SDateRight)}
                        onChange={(e) => {
                          updateAnswer(Props.SDateRight, e.target.value);
                        }}
                        required={
                          Props.label !== "Deformity / Asymmetry" &&
                          getAnswerByQuestionId(Props.RQID) === "true" &&
                          getAnswerByQuestionId(Props.SDateRight) === ""
                        }
                        disabled={getAnswerByQuestionId(Props.RQID) != "true"}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div
                      onClick={() =>
                        getAnswerByQuestionId(Props.checkStatusQId) === "true"
                      }
                      className="flex justify-end items-end space-x-5"
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
                          getAnswerByQuestionId(Props.OtherInputQId) === "" &&
                          !["true"].includes(
                            getAnswerByQuestionId(Props.RQID)
                          ) &&
                          !["true"].includes(getAnswerByQuestionId(Props.LQID))
                        }
                      />
                      {Props.label == "Deformity / Asymmetry" && (
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="biggerLeft"
                            value="Left"
                            className="custom-radio"
                            checked={
                              getAnswerByQuestionId(Props.biggerSide) === "Left"
                            }
                            onChange={() =>
                              Props.biggerSide &&
                              updateAnswer(Props.biggerSide, "Left")
                            }
                            disabled={
                              getAnswerByQuestionId(Props.LQID) != "true"
                            }
                          />
                          <Label>Bigger Side</Label>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-start gap-2">
                      {Props.label == "Nipple changes" &&
                        Props.nipplePosition &&
                        Props.nipplePositionDetails && (
                          <LabeledRadioWithOptionalInput
                            name="nipple-position"
                            questionId={Props.nipplePosition}
                            optionalInputQuestionId={
                              Props.nipplePositionDetails
                            }
                            formData={Props.data}
                            handleInputChange={updateAnswer}
                            options={[
                              { label: "Inverted", value: "Inverted" },
                              { label: "Other", value: "Other" },
                            ]}
                            showInputWhenValue="Other"
                            inputPlaceholder="Specify"
                            inputWidth="w-32"
                            className="ml-0 mt-0 flex-row items-center gap-x-4"
                            required
                            disabled={
                              getAnswerByQuestionId(Props.LQID) != "true"
                            }
                          />
                        )}
                    </div>

                    <div className="flex items-center w-48 space-x-2">
                      <Label htmlFor="date" className="">
                        Duration (Months)
                      </Label>
                      <Input
                        name="date"
                        type="number"
                        placeholder="Months"
                        value={getAnswerByQuestionId(Props.SDate)}
                        onChange={(e) => {
                          updateAnswer(Props.SDate, e.target.value);
                        }}
                        required={
                          Props.label !== "Deformity / Asymmetry" &&
                          getAnswerByQuestionId(Props.LQID) == "true" &&
                          getAnswerByQuestionId(Props.SDate) == ""
                        }
                        disabled={getAnswerByQuestionId(Props.LQID) != "true"}
                      />
                    </div>
                  </div>
                </div>
                {/* <div className="px-4">
                  {Props.label === "Nipple changes" &&
                    Props.nipplePosition &&
                    Props.nipplePositionDetails && (
                      <div className="px-4 flex items-center">
                        <Label>
                          Nipple Position
                        </Label>

                        <div className="ml-2 flex flex-row gap-3">
                          {/* INVERTED */}{" "}
                {/*}
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              id="nipple-inverted"
                              name="nipple-position"
                              value="Inverted"
                              checked={
                                getAnswerByQuestionId(Props.nipplePosition)
                                  ?.answer === "Inverted"
                              }
                              onChange={() =>
                                Props.nipplePosition &&
                                updateAnswer(Props?.nipplePosition, "Inverted")
                              }
                              className="custom-radio"
                            />
                            <Label htmlFor="nipple-inverted">Inverted</Label>
                          </div>

                          {/* OTHER + input */}{" "}
                {/*}
                          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2">
                            <div className="flex items-center gap-2">
                              <input
                                type="radio"
                                id="nipple-other"
                                name="nipple-position"
                                value="Other"
                                checked={
                                  getAnswerByQuestionId(Props.nipplePosition)
                                    ?.answer === "Other"
                                }
                                onChange={() =>
                                  Props.nipplePosition &&
                                  updateAnswer(Props.nipplePosition, "Other")
                                }
                                className="custom-radio"
                              />
                              <Label htmlFor="nipple-other">Other</Label>
                            </div>

                            {/* Conditional input if OTHER is selected */}{" "}
                {/*}
                            {getAnswerByQuestionId(Props.nipplePosition)
                              ?.answer === "OTHER" && (
                              <Input
                                type="text"
                                placeholder="Details"
                                className="w-[250px] mt-1 lg:mt-0"
                                value={
                                  getAnswerByQuestionId(Props.nipplePosition)
                                    ?.answer
                                }
                                onChange={(e) =>
                                  Props.nipplePositionDetails &&
                                  updateAnswer(
                                    Props.nipplePositionDetails,
                                    e.target.value
                                  )
                                }
                                required
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                </div> */}
              </div>
              <div className="w-1/2">
                {/* Other Input */}
                {Props.OtherInputQId && !Props.technician && (
                  <div className="flex gap-1 w-full ">
                    <Textarea
                      placeholder="Additional Comments"
                      value={getAnswerByQuestionId(Props.OtherInputQId)}
                      onChange={(e) =>
                        updateAnswer(Props.OtherInputQId!, e.target.value)
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BreastInputWithout;
