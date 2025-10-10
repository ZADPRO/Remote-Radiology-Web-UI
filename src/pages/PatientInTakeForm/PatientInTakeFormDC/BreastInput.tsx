import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Checkbox2 } from "@/components/ui/CustomComponents/checkbox2";
import { Label } from "@/components/ui/label";
import { DialogTitle } from "@/components/ui/dialog";
import bg from "../../../assets/Patient-InTake Form/breastOutline.png";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MultiOptionRadioGroup from "@/components/ui/CustomComponents/MultiOptionRadioGroup";

type Props = {
  label: string;
  checkStatusQId: number;
  RQID: number;
  LQID: number;
  SDate: any;
  SDateRight: any;
  SResult: any;
  SResultRight: any;
  data: any;
  setData: any;
  Size?: any;
  SizeRight?: any;
};

const BreastInput: React.FC<Props> = (Props) => {
  function formatClockLabels(input: string): string {
    if (!input.trim()) return "";

    return input
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "")
      .map(Number)
      .filter((n) => !isNaN(n))
      .map((num) => (num === 0 ? "Nipple" : `${num}'o Clock`)) // ← added condition
      .join(", ");
  }

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

  // const [leftSelected, setLeftSelected] = useState<string>('');
  // const [rightSelected, setRightSelected] = useState<string>('');

  // console.log(getAnswerByQuestionId(Props.checkStatusQId))

  // const [dateOpen, setDateOpen] = useState(false);
  // const [date, setDate] = useState<Date>();

  const [modal, setModal] = useState(false);

  // const [questionStatus, setQuestionStatus] = useState(false);

  const toggleSection = (side: "left" | "right", index: number) => {
    const selected =
      side === "left"
        ? getAnswerByQuestionId(Props.LQID)
        : getAnswerByQuestionId(Props.RQID);
    const values = selected ? selected.split(",").map(Number) : [];

    const exists = values.includes(index);
    let updated: number[];

    if (exists) {
      updated = values.filter((v: any) => v !== index);
    } else {
      updated = [...values, index];
    }

    updated.sort((a, b) => a - b);
    const result = updated.join(",");

    if (side === "left") updateAnswer(Props.LQID, result);
    else updateAnswer(Props.RQID, result);
  };


  const renderClock = (side: "left" | "right") => {
    const cx = 100;
    const cy = 100;
    const r = 90;
    const total = 12;

    const values = (side === "left"
      ? getAnswerByQuestionId(Props.LQID)
      : getAnswerByQuestionId(Props.RQID)
    )
      .split(",")
      .filter((val: any) => val !== "")
      .map(Number);

    const toggleNipple = () => {
      let updated: number[];

      if (values.includes(0)) {
        updated = values.filter((v: any) => v !== 0);
      } else {
        updated = [...values, 0];
      }

      updated.sort((a, b) => a - b);
      const result = updated.join(",");

      if (side === "left") updateAnswer(Props.LQID, result);
      else updateAnswer(Props.RQID, result);
    };

    const slices = Array.from({ length: total }, (_, i) => {
      const idx = i + 1;
      const startAngle = (i / total) * 2 * Math.PI;
      const endAngle = ((i + 1) / total) * 2 * Math.PI;

      const x1 = cx + r * Math.sin(startAngle);
      const y1 = cy - r * Math.cos(startAngle);
      const x2 = cx + r * Math.sin(endAngle);
      const y2 = cy - r * Math.cos(endAngle);

      const d = `
      M ${cx} ${cy}
      L ${x1} ${y1}
      A ${r} ${r} 0 0 1 ${x2} ${y2}
      Z
    `;

      return (
        <path
          key={`${side}-${idx}`}
          d={d}
          className={`cursor-pointer transition-all duration-200 stroke-black stroke-[2px] ${values.includes(idx) ? "fill-[#edd1ce]" : "fill-white"
            }`}
          onClick={() => toggleSection(side, idx)}
        />
      );
    });

    const labels = Array.from({ length: total }, (_, i) => {
      const angle = ((i + 0.5) / total) * 2 * Math.PI;
      const x = cx + (r - 20) * Math.sin(angle);
      const y = cy - (r - 20) * Math.cos(angle);

      return (
        <text
          key={`label-${i + 1}`}
          x={x}
          y={y + 4}
          textAnchor="middle"
          className="text-[12px] fill-black font-bold pointer-events-none"
        >
          {i + 1}
        </text>
      );
    });

    // Center nipple
    const nippleSelected = values.includes(0);

    return (
      <svg viewBox="0 0 200 200" className="w-[150px] h-[300px]">
        {slices}
        {labels}
        <circle
          cx={cx}
          cy={cy}
          r="20"
          className={`stroke-black stroke-[0.5] cursor-pointer transition-all duration-200 ${nippleSelected ? "fill-[#ff9b99]" : "fill-[#fce2da]"
            }`}
          onClick={toggleNipple}
        />
        <text
          x={cx}
          y={cy + 4}
          textAnchor="middle"
          className="text-[12px] fill-black font-semibold pointer-events-none"
        >
        </text>
      </svg>
    );
  };


  return (
    <>
      <Dialog open={modal} onOpenChange={() => setModal(false)}>
        <DialogContent className="flex w-auto flex-col justify-center items-center">
          <DialogHeader>
            <DialogTitle>{Props.label}</DialogTitle>
          </DialogHeader>

          <div className="w-full h-[320px] overflow-x-auto lg:overflow-x-hidden space-y-5">
            <Label className="text-muted-foreground w-[400px] text-center mx-auto">
              Select the affected areas by clicking on the corresponding clock
              positions or the center (nipple) in the diagram below.
            </Label>
            <div
              className="w-[480px] h-[200px] flex justify-center items-center"
              style={{
                backgroundImage: `url(${bg})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            >
              <div className="flex ml-[75px] w-[500px] h-[300px] gap-[30px]  pb-[20px] lg:pb-[0]">
                <div className="flex flex-col mt-[45px] items-center">
                  {renderClock("right")}
                  <span className="mt-2 font-semibold">Right</span>
                </div>
                <div className="flex flex-col mt-[45px] items-center">
                  {renderClock("left")}
                  <span className="mt-2 font-semibold">Left</span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="w-full">
            <DialogClose asChild>
              <Button
                className="w-full bg-[#f0d9d3] hover:bg-[#ebcbc2] text-[#3F3F3D] border-1 border-[#3F3F3D] rounded-lg px-6 py-2"
                type="button"
              >
                Done
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="flex items-center justify-center flex-row lg:flex-col gap-6">
        <div className="w-full flex flex-col lg:flex-row items-center lg:space-x-10">
          <div className="flex justify-start flex-row w-[100%] lg:w-[30%] items-center space-x-2">
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
                } else {
                  setModal(true);
                }
              }}
            />
            <Label className="font-semibold text-base">{Props.label}</Label>
          </div>
          {getAnswerByQuestionId(Props.checkStatusQId) === "true" && (
            <div className="h-full w-full space-y-2">
              <div className="flex flex-col lg:flex-row flex-wrap gap-4 w-full mt-2">
                <div className="flex flex-col lg:flex-row flex-wrap gap-4 w-full mt-2">
                  {/* R Clock Label Input */}
                  <div
                    onClick={() =>
                      getAnswerByQuestionId(Props.checkStatusQId) === "true" &&
                      setModal(true)
                    }
                    className="flex flex-row items-center gap-1 lg:gap-2 w-full lg:w-auto"
                  >
                    <Label className="min-w-[20px]">R</Label>
                    <Input
                      value={formatClockLabels(
                        getAnswerByQuestionId(Props.RQID)
                      )}
                      onChange={(e) => updateAnswer(Props.RQID, e.target.value)}
                      className="w-full lg:w-32"
                      disabled={
                        getAnswerByQuestionId(Props.checkStatusQId) !== "true"
                      }
                      required={
                        getAnswerByQuestionId(Props.RQID) === "" &&
                        getAnswerByQuestionId(Props.LQID) === ""
                      }
                    />
                  </div>

                  {/* Result */}
                  <div className="flex items-center gap-2 ml-2">
                    {/* <Label className="min-w-[50px]">Result</Label> */}
                    <MultiOptionRadioGroup
                      questionId={Props.SResultRight}
                      handleInputChange={updateAnswer}
                      formData={Props.data}
                      options={[
                        { label: "Unchanged", value: "Unchanged" },
                        { label: "Resolved", value: "Resolved" },
                        { label: "New", value: "New" },
                      ]}
                      className="mt-0 ml-0"
                      required={getAnswerByQuestionId(Props.RQID) != ""}
                      disabled={getAnswerByQuestionId(Props.RQID) == ""}
                    />
                  </div>

                  {/* Size (only for "Lump or thickening") */}
                  {Props.label === "Lump or thickening" && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 lg:gap-2 w-full lg:w-auto">
                      <Label>Size</Label>
                      <div className="w-full lg:w-32">
                        <Select
                          value={getAnswerByQuestionId(Props.SizeRight) || ""}
                          onValueChange={(value) =>
                            updateAnswer(Props.SizeRight, value)
                          }
                          required={getAnswerByQuestionId(Props.RQID) !== ""}
                          disabled={getAnswerByQuestionId(Props.RQID) == ""}
                        >
                          <SelectTrigger className="bg-white w-full">
                            <SelectValue placeholder="Select Size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pea">Pea</SelectItem>
                            <SelectItem value="Grape">Grape</SelectItem>
                            <SelectItem value="Bigger than a grape">Bigger</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                  {getAnswerByQuestionId(Props.SResultRight) === "New" && (
                    <>
                      {/* Since (Months) */}
                      <div className="flex flex-row items-center lg:ml-2 gap-2 lg:gap-2 w-full lg:w-auto">
                        <Label className="min-w-[50px]">Duration (Months)</Label>
                        <Input
                          placeholder="Months"
                          value={getAnswerByQuestionId(Props.SDateRight)}
                          onChange={(e) =>
                            updateAnswer(Props.SDateRight, e.target.value)
                          }
                          className="w-full lg:w-32"
                          type="number"
                          required={getAnswerByQuestionId(Props.SDateRight) === ""}
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="flex flex-col lg:flex-row flex-wrap gap-4 w-full mt-2">
                  {/* L Clock Label Input */}
                  <div
                    onClick={() =>
                      getAnswerByQuestionId(Props.checkStatusQId) === "true" &&
                      setModal(true)
                    }
                    className="flex flex-row items-center gap-1 lg:gap-2 w-full lg:w-auto"
                  >
                    <Label className="min-w-[20px]">L</Label>
                    <Input
                      value={formatClockLabels(getAnswerByQuestionId(Props.LQID))}
                      onChange={(e) => updateAnswer(Props.LQID, e.target.value)}
                      className="w-full lg:w-32"
                      disabled={
                        getAnswerByQuestionId(Props.checkStatusQId) !== "true"
                      }
                      required={
                        getAnswerByQuestionId(Props.RQID) === "" &&
                        getAnswerByQuestionId(Props.LQID) === ""
                      }
                    />
                  </div>

                  {/* Result */}
                  <div className="flex items-center gap-2 ml-2">
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
                      className="mt-0 ml-0"
                       required={getAnswerByQuestionId(Props.LQID) != ""}
                       disabled={getAnswerByQuestionId(Props.LQID) == ""}
                    />
                  </div>
                  {/* Size (only for "Lump or thickening") */}
                  {Props.label === "Lump or thickening" && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 lg:gap-2 w-full lg:w-auto">
                      <Label>Size</Label>
                      <div className="w-full lg:w-32">
                        <Select
                          value={getAnswerByQuestionId(Props.Size) || ""}
                          onValueChange={(value) =>
                            updateAnswer(Props.Size, value)
                          }
                          required={getAnswerByQuestionId(Props.LQID) !== ""}
                          disabled={getAnswerByQuestionId(Props.LQID) == ""}
                        >
                          <SelectTrigger className="bg-white w-full">
                            <SelectValue placeholder="Select Size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pea">Pea</SelectItem>
                            <SelectItem value="Grape">Grape</SelectItem>
                            <SelectItem value="Bigger than a grape">Bigger</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                  {getAnswerByQuestionId(Props.SResult) === "New" && (
                    <>
                      {/* Since (Months) */}
                      <div className="flex flex-row items-center lg:ml-2 gap-2 lg:gap-2 w-full lg:w-auto">
                        <Label className="min-w-[50px]">Duration (Months)</Label>
                        <Input
                          placeholder="Months"
                          value={getAnswerByQuestionId(Props.SDate)}
                          onChange={(e) =>
                            updateAnswer(Props.SDate, e.target.value)
                          }
                          className="w-full lg:w-32"
                          type="number"
                          required={getAnswerByQuestionId(Props.SDate) === ""}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>


              <div className="flex gap-2"></div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BreastInput;