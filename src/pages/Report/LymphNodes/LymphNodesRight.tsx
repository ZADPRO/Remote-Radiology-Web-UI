import React, { useEffect } from "react";
import { ReportQuestion } from "../Report";
import { Label } from "@/components/ui/label";
import { Checkbox2 } from "@/components/ui/CustomComponents/checkbox2";
import { Button } from "@/components/ui/button";
import { Trash, X } from "lucide-react";
import GridNumber200 from "@/components/ui/CustomComponents/GridNumber200";
import SingleBreastPositionPicker from "@/components/ui/CustomComponents/SingleBreastPositionPicker";

interface QuestionIds {
  Intramammaryr: number;
  IntramammaryDatar: number;
  axillarynodes: number;
  ClipsPresentStatus: number;
  ClipsPresentdata: number;
}

interface Props {
  reportFormData: ReportQuestion[];
  handleReportInputChange: (questionId: number, value: string) => void;
  questionIds: QuestionIds;
  label: string;
  axilaryLabel: string;
}

const LymphNodesRight: React.FC<Props> = ({
  questionIds,
  reportFormData,
  handleReportInputChange,
  label,
  axilaryLabel,
}) => {
  useEffect(() => {
    if (!reportFormData || reportFormData.length === 0) return;
    // getAnswer(questionIds.Intramammaryr) === "" &&
    //   handleReportInputChange(questionIds.Intramammaryr, "Present");
    getAnswer(questionIds.IntramammaryDatar) === "" &&
      handleReportInputChange(
        questionIds.IntramammaryDatar,
        JSON.stringify([
          {
            option: "",
            position: "",
            level: "",
            levelpercentage: "",
            locationLevel: "benign morphology",
          },
        ])
      );
    getAnswer(questionIds.axillarynodes) === "" &&
      handleReportInputChange(questionIds.axillarynodes, "benign morphology");
    getAnswer(questionIds.ClipsPresentStatus) === "" &&
      handleReportInputChange(questionIds.ClipsPresentStatus, "Present");
  }, []);

  const getAnswer = (id: number) =>
    reportFormData.find((q) => q.questionId === id)?.answer || "";

  return (
    <div className="w-full">
      {/* <h1 className="text-3xl font-[500]" style={{ wordSpacing: "0.2em" }}>
                F. LESIONS (Right)
            </h1> */}
      <div className="flex gap-4 items-center mb-4">
        <div>
          <Checkbox2
            checked={getAnswer(questionIds.Intramammaryr) === "Present"}
            onCheckedChange={(checked) =>
              handleReportInputChange(
                questionIds.Intramammaryr,
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

      {getAnswer(questionIds.Intramammaryr) === "Present" && (
        <div className="py-4 lg:px-10 space-y-4">
          <div>
            <div
              className={
                "flex gap-0 h-auto lg:h-[40px] items-center mb-5 lg:mb-0 lg:items-center"
              }
            >
              <Label className="font-semibold text-base w-full lg:w-50 flex flex-wrap lg:items-center">
                <span>Intramammary Nodes</span>
              </Label>
              <Button
                className="bg-[#a4b2a1] hover:bg-[#a4b2a1]"
                onClick={() => {
                  let data: {
                    option: string;
                    position: string;
                    level: string;
                  }[] = [];

                  try {
                    const existing = getAnswer(questionIds.IntramammaryDatar);
                    data = existing ? JSON.parse(existing) : [];
                  } catch (err) {
                    console.error("Invalid JSON:", err);
                    data = [];
                  }

                  const updated = [
                    ...data,
                    {
                      option: "",
                      position: "",
                      level: "",
                      levelpercentage: "",
                    },
                  ];
                  handleReportInputChange(
                    questionIds.IntramammaryDatar,
                    JSON.stringify(updated)
                  );
                }}
              >
                Add
              </Button>
            </div>
            {(() => {
              let dataArray: any[] = [];
              try {
                const raw = getAnswer(questionIds.IntramammaryDatar);
                dataArray = raw ? JSON.parse(raw) : [];
              } catch (err) {
                console.error("Invalid JSON:", err);
              }

              return dataArray.map((data, index) => (
                <>
                  <div>
                    <div className={"flex my-2 ml-4 gap-4 items-start"}>
                      <div className="ml-[1rem] flex justify-center items-start mt-0 lg:mt-2 w-[5%]">
                        {index + 1}.
                      </div>
                      <div className="w-[80%] flex flex-col gap-4">
                        <div className="flex flex-wrap gap-3 h-auto min-h-[40px] items-start lg:items-center">
                          {[
                            {
                              label: "Benign Morphology",
                              value: "benign morphology",
                            },
                            { label: "Enlarged", value: "enlarged" },
                            {
                              label: "Loss of Fatty Hilum",
                              value: "loss of fatty hilum",
                            },
                            {
                              label: "Suspicious Morphology",
                              value: "suspicious morphology",
                            },
                            {
                              label: "Not Visualized",
                              value: "not visualized",
                            },
                          ].map((item, indexVal) => (
                            <div
                              key={item.value}
                              className="flex items-center gap-2 h-auto min-h-[32px]"
                            >
                              <input
                                type="radio"
                                id={`option-${questionIds.IntramammaryDatar}-${index}-${indexVal}`}
                                name={`optionquestion-${questionIds.IntramammaryDatar}-${index}`}
                                value={item.value}
                                checked={data.locationLevel === item.value}
                                onChange={() => {
                                  const updated = [...dataArray];
                                  updated[index].locationLevel = item.value;
                                  handleReportInputChange(
                                    questionIds.IntramammaryDatar,
                                    JSON.stringify(updated)
                                  );
                                }}
                                required
                                className="custom-radio"
                              />
                              <Label
                                htmlFor={`option-${questionIds.IntramammaryDatar}-${index}-${indexVal}`}
                              >
                                {item.label}
                              </Label>
                            </div>
                          ))}
                        </div>

                        {/* Location - Clock Position */}
                        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center min-h-[40px]">
                          <Label className="font-semibold text-base w-auto lg:w-52 flex-shrink-0">
                            Location - Clock Position
                          </Label>
                          <div className="w-full flex gap-3 items-center">
                            <SingleBreastPositionPicker
                              value={data.position}
                              onChange={(e) => {
                                const updated = [...dataArray];
                                updated[index].position = e;
                                handleReportInputChange(
                                  questionIds.IntramammaryDatar,
                                  JSON.stringify(updated)
                                );
                              }}
                              singleSelect={true}
                            />
                            {data.position.length > 0 && (
                                  <X
                                    className="cursor-pointer"
                                    onClick={() => {
                                      const updated = [...dataArray];
                                      updated[index].position = "";
                                      handleReportInputChange(
                                        questionIds.IntramammaryDatar,
                                        JSON.stringify(updated)
                                      );
                                    }}
                                    width={13}
                                    height={13}
                                    color="red"
                                  />
                                )}
                          </div>
                        </div>

                        {/* Location - Level */}
                        <div className="flex flex-col gap-2 min-h-[40px]">
                          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center ">
                            <Label className="font-semibold text-base w-auto lg:w-52 flex-shrink-0">
                              Location - Level
                            </Label>

                            {/* Radios, side-by-side, wrapped on mobile */}
                            <div className="flex flex-wrap gap-3">
                              {[
                                {
                                  label: "Coronal Level",
                                  value: "Coronal Level",
                                },
                                { label: "Axial", value: "Axial" },
                                { label: "Sagital", value: "Sagital" },
                                { label: "Unknown", value: "unknown" },
                              ].map((item, indexVal) => (
                                <div
                                  key={item.value}
                                  className="flex items-center gap-2 min-h-[32px]"
                                >
                                  <input
                                    type="radio"
                                    id={`Level-${questionIds.IntramammaryDatar}-${index}-${indexVal}`}
                                    name={`levelquestion-${questionIds.IntramammaryDatar}-${index}`}
                                    value={item.value}
                                    checked={data.level === item.value}
                                    onChange={() => {
                                      const updated = [...dataArray];
                                      updated[index].level = item.value;
                                      handleReportInputChange(
                                        questionIds.IntramammaryDatar,
                                        JSON.stringify(updated)
                                      );
                                    }}
                                    required
                                    className="custom-radio"
                                  />
                                  <Label
                                    htmlFor={`Level-${questionIds.IntramammaryDatar}-${index}-${indexVal}`}
                                  >
                                    {item.label}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            {/* Conditional Level Percentage field */}
                            {["Sagital", "Axial", "Coronal Level"].includes(
                              data.level
                            ) && (
                              <div
                                className={
                                  "flex items-center gap-2" +
                                  (data.level === "Sagital"
                                    ? " lg:ml-[26.5rem]"
                                    : data.level === "Axial"
                                    ? " lg:ml-[22rem]"
                                    : " lg:ml-[14.5rem]")
                                }
                              >
                                <span>
                                  {data.level === "Sagital"
                                    ? "M -"
                                    : data.level === "Axial"
                                    ? "S -"
                                    : "P -"}
                                </span>
                                <GridNumber200
                                  value={data.levelpercentage}
                                  onChange={(e) => {
                                    const updated = [...dataArray];
                                    updated[index].levelpercentage = e;
                                    handleReportInputChange(
                                      questionIds.IntramammaryDatar,
                                      JSON.stringify(updated)
                                    );
                                  }}
                                />
                                {data.levelpercentage.length > 0 && (
                                  <X
                                    className="cursor-pointer"
                                    onClick={() => {
                                      const updated = [...dataArray];
                                      updated[index].levelpercentage = "";
                                      handleReportInputChange(
                                        questionIds.IntramammaryDatar,
                                        JSON.stringify(updated)
                                      );
                                    }}
                                    width={13}
                                    height={13}
                                    color="red"
                                  />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="w-[10%] flex justify-center items-start mt-0 lg:mt-2">
                        <Trash
                          className="text-[red] w-5 h-5 cursor-pointer"
                          onClick={() => {
                            const updated = dataArray.filter(
                              (_, i) => i !== index
                            );
                            handleReportInputChange(
                              questionIds.IntramammaryDatar,
                              JSON.stringify(updated)
                            );
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <hr />
                </>
              ));
            })()}
          </div>

          <div>
            <div className="flex flex-col gap-2 min-h-[40px]">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center ">
                <Label className="font-semibold text-base w-auto lg:w-52 flex-shrink-0">
                  {axilaryLabel}
                </Label>
                <div className="flex flex-wrap gap-3">
                  {[
                    {
                      label: "Benign Morphology",
                      value: "benign morphology",
                    },
                    { label: "Enlarged", value: "enlarged" },
                    {
                      label: "Loss of Fatty Hilum",
                      value: "loss of fatty hilum",
                    },
                    {
                      label: "Suspicious Morphology",
                      value: "suspicious morphology",
                    },
                    { label: "Not Visualized", value: "not visualized" },
                  ].map((item, indexVal) => (
                    <div
                      key={item.value}
                      className="flex items-center gap-2 min-h-[32px]"
                    >
                      <input
                        type="radio"
                        id={`Level-${questionIds.IntramammaryDatar}-${questionIds.axillarynodes}-${indexVal}`}
                        name={`levelquestion-${questionIds.IntramammaryDatar}-${questionIds.axillarynodes}`}
                        value={item.value}
                        checked={
                          getAnswer(questionIds.axillarynodes) === item.value
                        }
                        onChange={(e) =>
                          handleReportInputChange(
                            questionIds.axillarynodes,
                            e.target.value
                          )
                        }
                        required
                        className="custom-radio"
                      />
                      <Label
                        htmlFor={`Level-${questionIds.IntramammaryDatar}-${questionIds.axillarynodes}-${indexVal}`}
                      >
                        {item.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div
              className={
                "flex gap-3 h-auto lg:h-[40px] items-center mb-5 lg:mb-0 lg:items-center"
              }
            >
              <div>
                <Checkbox2
                  checked={
                    getAnswer(questionIds.ClipsPresentStatus) === "Present"
                  }
                  onCheckedChange={(checked) => {
                    handleReportInputChange(
                      questionIds.ClipsPresentStatus,
                      checked ? "Present" : ""
                    );
                    handleReportInputChange(questionIds.ClipsPresentdata, "");
                  }}
                />
              </div>
              <Label className="font-semibold text-base w-full lg:w-40 flex flex-wrap lg:items-center">
                <span>Clips Present</span>
              </Label>
              {getAnswer(questionIds.ClipsPresentStatus) === "Present" && (
                <Button
                  className="bg-[#a4b2a1] hover:bg-[#a4b2a1]"
                  onClick={() => {
                    let data: {
                      position: string;
                      level: string;
                      levelpercentage: string;
                    }[] = [];

                    try {
                      const existing = getAnswer(questionIds.ClipsPresentdata);
                      data = existing ? JSON.parse(existing) : [];
                    } catch (err) {
                      console.error("Invalid JSON:", err);
                      data = [];
                    }

                    const updated = [
                      ...data,
                      {
                        position: "",
                        level: "",
                        levelpercentage: "",
                      },
                    ];
                    handleReportInputChange(
                      questionIds.ClipsPresentdata,
                      JSON.stringify(updated)
                    );
                  }}
                >
                  Add
                </Button>
              )}
            </div>
            {(() => {
              let dataArray: any[] = [];
              try {
                const raw = getAnswer(questionIds.ClipsPresentdata);
                dataArray = raw ? JSON.parse(raw) : [];
              } catch (err) {
                console.error("Invalid JSON:", err);
              }

              return dataArray.map((data, index) => (
                <>
                  <div>
                    <div
                      className={
                        "flex my-2 ml-4 gap-4 items-start lg:items-center"
                      }
                    >
                      <div className="w-[5%]">{index + 1}</div>
                      <div className="w-[80%] flex flex-col gap-4">
                        {/* Location - Clock Position */}
                        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center min-h-[40px]">
                          <Label className="font-semibold text-base w-auto lg:w-52 flex-shrink-0">
                            Location - Clock Position
                          </Label>
                          <div className="w-full flex gap-3 items-center">
                            <SingleBreastPositionPicker
                              value={data.position}
                              onChange={(e) => {
                                const updated = [...dataArray];
                                updated[index].position = e;
                                handleReportInputChange(
                                  questionIds.ClipsPresentdata,
                                  JSON.stringify(updated)
                                );
                              }}
                              singleSelect={true}
                            />
                            {data.position.length > 0 && (
                              <X
                                className="cursor-pointer"
                                onClick={() => {
                                  const updated = [...dataArray];
                                  updated[index].position = "";
                                  handleReportInputChange(
                                    questionIds.ClipsPresentdata,
                                    JSON.stringify(updated)
                                  );
                                }}
                                width={13}
                                height={13}
                                color="red"
                              />
                            )}
                          </div>
                        </div>

                        {/* Location - Level */}
                        <div className="flex flex-col gap-2 min-h-[40px]">
                          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                            <Label className="font-semibold text-base w-auto lg:w-52 flex-shrink-0">
                              Location - Level
                            </Label>
                            <div className="flex flex-wrap gap-3">
                              {[
                                {
                                  label: "Coronal Level",
                                  value: "Coronal Level",
                                },
                                { label: "Axial", value: "Axial" },
                                { label: "Sagital", value: "Sagital" },
                                { label: "Unknown", value: "unknown" },
                              ].map((item, indexVal) => (
                                <div
                                  key={item.value}
                                  className="flex items-center gap-2 min-h-[32px]"
                                >
                                  <input
                                    type="radio"
                                    id={`Level-${questionIds.ClipsPresentdata}-${index}-${indexVal}`}
                                    name={`levelquestion-${questionIds.ClipsPresentdata}-${index}`}
                                    value={item.value}
                                    checked={data.level === item.value}
                                    onChange={() => {
                                      const updated = [...dataArray];
                                      updated[index].level = item.value;
                                      handleReportInputChange(
                                        questionIds.ClipsPresentdata,
                                        JSON.stringify(updated)
                                      );
                                    }}
                                    required
                                    className="custom-radio"
                                  />
                                  <Label
                                    htmlFor={`Level-${questionIds.ClipsPresentdata}-${index}-${indexVal}`}
                                  >
                                    {item.label}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            {/* Level Percentage, only if one of the radios is selected */}
                            {["Sagital", "Axial", "Coronal Level"].includes(
                              data.level
                            ) && (
                              <div
                                className={
                                  "flex items-center gap-2 mt-2 lg:mt-0" +
                                  (data.level === "Sagital"
                                    ? " lg:ml-[26.5rem]"
                                    : data.level === "Axial"
                                    ? " lg:ml-[22rem]"
                                    : " lg:ml-[14.5rem]")
                                }
                              >
                                <span>
                                  {data.level === "Sagital"
                                    ? "M -"
                                    : data.level === "Axial"
                                    ? "S -"
                                    : "P -"}
                                </span>
                                <GridNumber200
                                  value={data.levelpercentage}
                                  onChange={(e) => {
                                    const updated = [...dataArray];
                                    updated[index].levelpercentage = e;
                                    handleReportInputChange(
                                      questionIds.ClipsPresentdata,
                                      JSON.stringify(updated)
                                    );
                                  }}
                                />
                                {data.levelpercentage.length > 0 && (
                                  <X
                                    className="cursor-pointer"
                                    onClick={() => {
                                      const updated = [...dataArray];
                                      updated[index].levelpercentage = "";
                                      handleReportInputChange(
                                        questionIds.ClipsPresentdata,
                                        JSON.stringify(updated)
                                      );
                                    }}
                                    width={13}
                                    height={13}
                                    color="red"
                                  />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="w-[5%]">
                        <Trash
                          className="text-[red] w-5 h-5 cursor-pointer"
                          onClick={() => {
                            const updated = dataArray.filter(
                              (_, i) => i !== index
                            );
                            handleReportInputChange(
                              questionIds.ClipsPresentdata,
                              JSON.stringify(updated)
                            );
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <hr />
                </>
              ));
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default LymphNodesRight;
