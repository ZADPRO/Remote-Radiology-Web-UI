import React, { useEffect } from "react";
import { ReportQuestion } from "../Report";
import { Label } from "@/components/ui/label";
import { Checkbox2 } from "@/components/ui/CustomComponents/checkbox2";
import MultiRadioOptionalInputInline from "@/components/ui/CustomComponents/MultiRadioOptionalInputInline";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import SingleBreastPositionPicker from "@/components/ui/CustomComponents/SingleBreastPositionPicker";
import GridNumber200 from "@/components/ui/CustomComponents/GridNumber200";

interface QuestionIds {
  ComparisonPriorRight: number;
  FindingStatus: number;
  doubletimefrom: number;
  doubletimeto: number;
  LesionCompTable: number;
}

interface Props {
  reportFormData: ReportQuestion[];
  handleReportInputChange: (questionId: number, value: string) => void;
  questionIds: QuestionIds;
  label: string;
  side: string;
}

const ComparisonPriorRight: React.FC<Props> = ({
  questionIds,
  reportFormData,
  handleReportInputChange,
  label,
  side
}) => {
  const getAnswer = (id: number) =>
    reportFormData.find((q) => q.questionId === id)?.answer || "";

  useEffect(() => {
    if (!reportFormData || reportFormData.length === 0) return;

    getAnswer(questionIds.ComparisonPriorRight) === "" &&
      handleReportInputChange(questionIds.ComparisonPriorRight, "Present");
    getAnswer(questionIds.LesionCompTable) === "" &&
      handleReportInputChange(
        questionIds.LesionCompTable,
        JSON.stringify([
          {
            sizec: "",
            sizep: "",
            volumec: "",
            volumep: "",
            speedc: "",
            speedp: "",
            locationcclock: "",
            locationcposition: "",
            locationpclock: "",
            locationpposition: "",
          },
        ])
      );
  }, []);

  return (
    <div className="w-full">
      {/* <h1 className="text-3xl font-[500]" style={{ wordSpacing: "0.2em" }}>
                F. LESIONS (Right)
            </h1> */}
      <div className="flex gap-4 items-center mb-4">
        <div>
          <Checkbox2
            checked={getAnswer(questionIds.ComparisonPriorRight) === "Present"}
            onCheckedChange={(checked) =>
              handleReportInputChange(
                questionIds.ComparisonPriorRight,
                checked ? "Present" : ""
              )
            }
            className="w-5 h-5 mt-1"
          />
        </div>
        <Label
          className="font-semibold text-2xl flex flex-wrap lg:items-center"
          style={{ wordSpacing: "0.2em" }}
        >
          {label}
        </Label>
      </div>

      {getAnswer(questionIds.ComparisonPriorRight) === "Present" && (
        <div className="py-4 lg:px-10 space-y-4">
          <div>
            <div
              className={
                "flex flex-wrap gap-0 h-auto lg:h-[40px] items-start lg:items-center"
              }
            >
              <Label className="font-semibold text-base w-full lg:w-50 flex flex-wrap lg:items-center">
                <span>Lesion Comparision Table</span>
              </Label>
              <Button
                className="bg-[#a4b2a1] hover:bg-[#a4b2a1]"
                onClick={() => {
                  let data: {
                    sizec: string;
                    sizep: string;
                    volumec: string;
                    volumep: string;
                    speedc: string;
                    speedp: string;
                    locationcclock: string;
                    locationcposition: string;
                    locationpclock: string;
                    locationpposition: string;
                  }[] = [];

                  try {
                    const existing = getAnswer(questionIds.LesionCompTable);
                    data = existing ? JSON.parse(existing) : [];
                  } catch (err) {
                    console.error("Invalid JSON:", err);
                    data = [];
                  }

                  const updated = [
                    ...data,
                    {
                      sizec: "",
                      sizep: "",
                      volumec: "",
                      volumep: "",
                      speedc: "",
                      speedp: "",
                      locationcclock: "",
                      locationcposition: "",
                      locationpclock: "",
                      locationpposition: "",
                    },
                  ];
                  handleReportInputChange(
                    questionIds.LesionCompTable,
                    JSON.stringify(updated)
                  );
                }}
              >
                Add
              </Button>
            </div>
          </div>

          {(() => {
            let dataArray: any[] = [];
            try {
              const raw = getAnswer(questionIds.LesionCompTable);
              dataArray = raw ? JSON.parse(raw) : [];
            } catch (err) {
              console.error("Invalid JSON:", err);
            }

            return dataArray.map((data, index) => (
              <div className="flex gap-3 mb-5">
                <div className="w-[80%] flex flex-col space-y-3">
                  <div className="p-1 flex justify-center">
                    <div className="overflow-x-auto rounded-xl border border-[#f0eae6]">
                      <table className="table-auto border-collapse w-full text-center text-sm bg-[#fff9f6]">
                        <thead className="bg-[#f7f5f2] font-semibold text-gray-700">
                          <tr>
                            <th className="px-4 py-3 border">Lesion ID</th>
                            <th className="px-4 py-3 border">Findings</th>
                            <th className="px-4 py-3 border">Current</th>
                            <th className="px-4 py-3 border">Previous</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td
                              rowSpan={4}
                              className="px-4 py-2 border font-bold bg-[#fdf8f6]"
                            >
                              {side === "Right" ? "R" : "L"}{index + 1}
                            </td>
                            <td className="px-4 py-2 border">Size (Mm)</td>
                            <td className="px-4 py-2 border">
                              <div className="w-full flex justify-center items-center">
                                <Input
                                  type="number"
                                  className="w-12 h-8 text-sm text-center"
                                  value={data.sizec}
                                  onChange={(e) => {
                                    const updated = [...dataArray];
                                    updated[index].sizec = e.target.value;
                                    handleReportInputChange(
                                      questionIds.LesionCompTable,
                                      JSON.stringify(updated)
                                    );
                                  }}
                                />
                              </div>
                            </td>
                            <td className="px-4 py-2 border">
                              <div className="w-full flex justify-center items-center">
                                <Input
                                  type="number"
                                  className="w-12 h-8 text-sm text-center"
                                  value={data.sizep}
                                  onChange={(e) => {
                                    const updated = [...dataArray];
                                    updated[index].sizep = e.target.value;
                                    handleReportInputChange(
                                      questionIds.LesionCompTable,
                                      JSON.stringify(updated)
                                    );
                                  }}
                                />
                              </div>
                            </td>
                          </tr>
                          <tr className="bg-[#f6ede6]">
                            <td className="px-4 py-2 border">
                              Volume (Cubic Mm)
                            </td>
                            <td className="px-4 py-2 border">
                              <div className="w-full flex justify-center items-center">
                                <Input
                                  type="number"
                                  className="w-12 h-8 text-sm text-center"
                                  value={data.volumec}
                                  onChange={(e) => {
                                    const updated = [...dataArray];
                                    updated[index].volumec = e.target.value;
                                    handleReportInputChange(
                                      questionIds.LesionCompTable,
                                      JSON.stringify(updated)
                                    );
                                  }}
                                />
                              </div>
                            </td>
                            <td className="px-4 py-2 border">
                              <div className="w-full flex justify-center items-center">
                                <Input
                                  type="number"
                                  className="w-12 h-8 text-sm text-center"
                                  value={data.volumep}
                                  onChange={(e) => {
                                    const updated = [...dataArray];
                                    updated[index].volumep = e.target.value;
                                    handleReportInputChange(
                                      questionIds.LesionCompTable,
                                      JSON.stringify(updated)
                                    );
                                  }}
                                />
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 border">Speed (M/S)</td>
                            <td className="px-4 py-2 border">
                              <div className="w-full flex justify-center items-center">
                                <Input
                                  type="number"
                                  className="w-12 h-8 text-sm text-center"
                                  value={data.speedc}
                                  onChange={(e) => {
                                    const updated = [...dataArray];
                                    updated[index].speedc = e.target.value;
                                    handleReportInputChange(
                                      questionIds.LesionCompTable,
                                      JSON.stringify(updated)
                                    );
                                  }}
                                />
                              </div>
                            </td>
                            <td className="px-4 py-2 border">
                              <div className="w-full flex justify-center items-center">
                                <Input
                                  type="number"
                                  className="w-12 h-8 text-sm text-center"
                                  value={data.speedp}
                                  onChange={(e) => {
                                    const updated = [...dataArray];
                                    updated[index].speedp = e.target.value;
                                    handleReportInputChange(
                                      questionIds.LesionCompTable,
                                      JSON.stringify(updated)
                                    );
                                  }}
                                />
                              </div>
                            </td>
                          </tr>
                          <tr className="bg-[#f6ede6]">
                            <td className="px-4 py-2 border">Location</td>
                            <td className="px-4 py-2 border">
                              <div className="flex justify-center items-center gap-4 px-1">
                                <SingleBreastPositionPicker
                                  value={data.locationcclock}
                                  onChange={(e) => {
                                    const updated = [...dataArray];
                                    updated[index].locationcclock = e;
                                    handleReportInputChange(
                                      questionIds.LesionCompTable,
                                      JSON.stringify(updated)
                                    );
                                  }}
                                  singleSelect={true}
                                />
                                <div className="flex gap-2 justify-center items-center">
                                  <span>P</span>
                                  <GridNumber200
                                    value={data.locationcposition}
                                    onChange={(e) => {
                                      const updated = [...dataArray];
                                      updated[index].locationcposition = e;
                                      handleReportInputChange(
                                        questionIds.LesionCompTable,
                                        JSON.stringify(updated)
                                      );
                                    }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-2 border">
                              <div className="flex justify-center items-center gap-4 px-1">
                                <SingleBreastPositionPicker
                                  value={data.locationpclock}
                                  onChange={(e) => {
                                    const updated = [...dataArray];
                                    updated[index].locationpclock = e;
                                    handleReportInputChange(
                                      questionIds.LesionCompTable,
                                      JSON.stringify(updated)
                                    );
                                  }}
                                  singleSelect={true}
                                />
                                <div className="flex gap-2 justify-center items-center">
                                  <span>P</span>
                                  <GridNumber200
                                    value={data.locationpposition}
                                    onChange={(e) => {
                                      const updated = [...dataArray];
                                      updated[index].locationpposition = e;
                                      handleReportInputChange(
                                        questionIds.LesionCompTable,
                                        JSON.stringify(updated)
                                      );
                                    }}
                                  />
                                </div>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="w-[10%] flex justify-center items-center">
                  <Trash
                    className="text-[red] w-5 h-5 cursor-pointer"
                    onClick={() => {
                      const updated = dataArray.filter((_, i) => i !== index);
                      handleReportInputChange(
                        questionIds.LesionCompTable,
                        JSON.stringify(updated)
                      );
                    }}
                  />
                </div>
              </div>
            ));
          })()}


          <MultiRadioOptionalInputInline
            label="Findings Status"
            labelClassname="w-[12rem]"
            questionId={questionIds.FindingStatus}
            optionalInputQuestionId={questionIds.FindingStatus}
            showOptionalForValue="Other"
            optionalInputWidth="w-60" // 👈 Control width of input
            formData={reportFormData}
            handleInputChange={handleReportInputChange}
            options={[
              {
                label: "Stable",
                value: "stable",
              },
              { label: "Increased", value: "increased" },
              { label: "Decreased", value: "decreased" },
              { label: "Resolved", value: "resolved" },
              { label: "New", value: "new" },
            ]}
          />

          <div>
            <div
              className={
                "flex flex-wrap gap-0 h-auto lg:h-[40px] items-start lg:items-center"
              }
            >
              <Label className="font-semibold text-base w-full lg:w-50 flex flex-wrap lg:items-center">
                <span>Doubling Time Range</span>
              </Label>
              <div className="flex items-center">From</div>
              <Input
                type="number"
                className="w-15 ml-2"
                placeholder="day"
                value={getAnswer(questionIds.doubletimefrom)}
                onChange={(e) => {
                  handleReportInputChange(
                    questionIds.doubletimefrom,
                    e.target.value
                  );
                }}
              />
              <div className="flex items-center ml-4">To</div>
              <Input
                type="number"
                className="w-15 ml-2"
                placeholder="day"
                value={getAnswer(questionIds.doubletimeto)}
                onChange={(e) => {
                  handleReportInputChange(
                    questionIds.doubletimeto,
                    e.target.value
                  );
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparisonPriorRight;
