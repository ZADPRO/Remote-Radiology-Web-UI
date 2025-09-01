import { Button } from "@/components/ui/button";
import { Checkbox2 } from "@/components/ui/CustomComponents/checkbox2";
import GridNumber200 from "@/components/ui/CustomComponents/GridNumber200";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash, X } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { ReportQuestion } from "../Report";
import SingleBreastPositionPicker from "@/components/ui/CustomComponents/SingleBreastPositionPicker";
import TextEditor from "@/components/TextEditor";
import { LesionsVal } from "./LesionsRightString";
import debounce from "lodash.debounce";

interface Props {
  reportFormData: ReportQuestion[];
  handleReportInputChange: (questionId: number, value: string) => void;
  LabelVal: string;
  mainQId: number;
  DataQId: number;
  other?: boolean;
  textEditorVal?: string;
  textEditorOnChange?: (value: string) => void;
}

const LesionsOptions: React.FC<Props> = ({
  reportFormData,
  handleReportInputChange,
  LabelVal,
  mainQId,
  DataQId,
  other,
  textEditorVal,
  textEditorOnChange,
}) => {
  const getAnswer = (id: number) =>
    reportFormData.find((q) => q.questionId === id)?.answer || "";

  const [sectionVal, setSectionVal] = useState<keyof LesionsVal | null>(null);
  const [editorVal, setEditorVal] = useState<LesionsVal>({
    "simple cyst": [],
    "complex cystic structure": [],
    "heterogeneous tissue prominence": [],
    "hypertrophic tissue with microcysts": [],
    "fibronodular density": [],
    "multiple simple cysts": [],
    others: [],
  });

  const debouncedUpdate = useCallback(
    debounce(
      (
        index: number,
        val: string,
        sectionVal: keyof LesionsVal,
        dataArray: any,
        DataQIdVal: number
      ) => {
        const updated = { ...editorVal };
        updated[sectionVal] = [...(updated[sectionVal] || [])];
        updated[sectionVal][index] = val;
        textEditorOnChange?.(JSON.stringify(updated));
        const updatedVal = [...dataArray];
        updatedVal[index].syncStatus = false;
        console.log(DataQIdVal);
        handleReportInputChange(DataQIdVal, JSON.stringify(updatedVal));
      },
      1300
    ),
    []
  );

  useEffect(() => {
    // Set sectionVal based on LabelVal
    setSectionVal(LabelVal.toLowerCase() as keyof LesionsVal);

    // Safely parse editor value or fallback to empty LesionsVal
    try {
      const parsed: LesionsVal = textEditorVal
        ? JSON.parse(textEditorVal)
        : {
            "simple cyst": [],
            "complex cystic structure": [],
            "heterogeneous tissue prominence": [],
            "hypertrophic tissue with microcysts": [],
            "fibronodular density": [],
            "multiple simple cysts": [],
            others: [],
          };
      setEditorVal(parsed);
    } catch (err) {
      console.error("Invalid JSON in textEditorVal:", err);
      setEditorVal({
        "simple cyst": [],
        "complex cystic structure": [],
        "heterogeneous tissue prominence": [],
        "hypertrophic tissue with microcysts": [],
        "fibronodular density": [],
        "multiple simple cysts": [],
        others: [],
      });
    }
  }, [LabelVal, textEditorVal, reportFormData]);

  return (
    <>
      <div>
        <div className="lg:px-10 space-y-4">
          <div className="flex h-[auto] lg:h-[40px] gap-4 items-center">
            <div>
              <Checkbox2
                checked={getAnswer(mainQId) === "Present"}
                onCheckedChange={(checked) =>
                  handleReportInputChange(mainQId, checked ? "Present" : "")
                }
              />
            </div>
            <Label className="font-bold text-base flex flex-wrap lg:items-center">
              {LabelVal}
            </Label>
            {getAnswer(mainQId) == "Present" && (
              <Button
                className="bg-[#a4b2a1] hover:bg-[#a4b2a1]"
                onClick={() => {
                  let data: {
                    name: string;
                    locationclockposition: string;
                    locationLevel: string;
                    locationLevelPercentage: string;
                    distancenipple: string;
                    sizew: string;
                    sizel: string;
                    sizeh: string;
                    Shape: string;
                    Appearance: string;
                    Margins: string;
                    density: string;
                    Transmissionspped: string;
                    Internal: string;
                    debris: string;
                    shadowing: string;
                    Volumne: string;
                    locationclockpositionto: string;
                    locationLevelPercentageto: string;
                    atleast: string;
                    ImageText: string;
                    syncStatus: boolean;
                  }[] = [];

                  try {
                    const existing = getAnswer(DataQId);
                    data = existing ? JSON.parse(existing) : [];
                  } catch (err) {
                    console.error("Invalid JSON:", err);
                    data = [];
                  }

                  const updated = [
                    ...data,
                    {
                      name: "",
                      locationclockposition: "",
                      locationLevel: "",
                      locationLevelPercentage: "",
                      distancenipple: "",
                      sizew: "",
                      sizel: "",
                      sizeh: "",
                      Shape:
                        LabelVal === "Simple Cyst" ||
                        LabelVal === "Multiple Simple Cysts"
                          ? "round"
                          : LabelVal === "Complex Cystic Structure" ||
                            LabelVal === "Fibronodular Density"
                          ? "oval"
                          : "",
                      Appearance:
                        LabelVal === "Simple Cyst" ||
                        LabelVal === "Multiple Simple Cysts" ||
                        LabelVal === "Fibronodular Density"
                          ? "homogenous"
                          : LabelVal === "Complex Cystic Structure" ||
                            LabelVal === "Heterogeneous Tissue Prominence" ||
                            LabelVal === "Hypertrophic Tissue with Microcysts"
                          ? "heterogenous"
                          : "",
                      Margins:
                        LabelVal === "Simple Cyst" ||
                        LabelVal === "Multiple Simple Cysts" ||
                        LabelVal === "Fibronodular Density"
                          ? "well circumscribed"
                          : LabelVal === "Complex Cystic Structure"
                          ? "indistinct"
                          : "",
                      density:
                        LabelVal === "Simple Cyst" ||
                        LabelVal === "Multiple Simple Cysts"
                          ? "hypoechoic"
                          : LabelVal === "Complex Cystic Structure" ||
                            LabelVal === "Heterogeneous Tissue Prominence" ||
                            LabelVal === "Hypertrophic Tissue with Microcysts"
                          ? "mixed"
                          : LabelVal === "Fibronodular Density"
                          ? "hyperechoic"
                          : "",
                      Transmissionspped: "",
                      debris:
                        LabelVal === "Complex Cystic Structure"
                          ? "present"
                          : "",
                      shadowing: "",
                      Volumne: "",
                      locationclockpositionto: "",
                      locationLevelPercentageto: "",
                      atleast: "",
                      ImageText: "",
                      syncStatus: true,
                    },
                  ];
                  handleReportInputChange(DataQId, JSON.stringify(updated));
                }}
              >
                Add
              </Button>
            )}
          </div>

          {getAnswer(mainQId) == "Present" && (
            <>
              {(() => {
                let dataArray: any[] = [];
                try {
                  const raw = getAnswer(DataQId);
                  const parsed = raw ? JSON.parse(raw) : [];
                  dataArray = Array.isArray(parsed) ? parsed : [];
                } catch (err) {
                  console.error("Invalid JSON:", err);
                  dataArray = [];
                }

                return (
                  Array.isArray(dataArray) &&
                  dataArray.map((data, index) => (
                    <div key={index}>
                      <div className="flex gap-3 mb-5">
                        <div className="ml-[1rem] flex justify-center items-start mt-0 lg:mt-2 w-[5%]">
                          {index + 1}.
                        </div>

                        <div className="w-[85%] flex flex-col space-y-6">
                          {other && (
                            <>
                              <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
                                <Label className="font-semibold text-base w-auto lg:w-52 flex-shrink-0">
                                  Name
                                </Label>
                                <div className="flex items-center gap-2 flex-grow">
                                  <Input
                                    type="text"
                                    className="w-40"
                                    placeholder="Specify"
                                    value={data.name}
                                    onChange={(e) => {
                                      const updated = [...dataArray];
                                      updated[index].name = e.target.value;
                                      updated[index].syncStatus = true;
                                      handleReportInputChange(
                                        DataQId,
                                        JSON.stringify(updated)
                                      );
                                    }}
                                  />
                                </div>
                              </div>
                            </>
                          )}

                          {/* 1. Location - Clock Position */}
                          <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
                            <Label className="font-semibold text-base w-auto lg:w-52 flex-shrink-0">
                              Location - Clock Position
                            </Label>
                            <div className="w-full flex gap-3 items-center">
                              <SingleBreastPositionPicker
                                value={data.locationclockposition}
                                onChange={(e) => {
                                  const updated = [...dataArray];
                                  updated[index].locationclockposition = e;
                                  updated[index].syncStatus = true;
                                  handleReportInputChange(
                                    DataQId,
                                    JSON.stringify(updated)
                                  );
                                }}
                                singleSelect={true}
                              />
                              {data.locationclockposition.length > 0 && (
                                <X
                                  className="cursor-pointer"
                                  onClick={() => {
                                    const updated = [...dataArray];
                                    updated[index].locationclockposition = "";
                                    updated[index].syncStatus = true;
                                    handleReportInputChange(
                                      DataQId,
                                      JSON.stringify(updated)
                                    );
                                  }}
                                  width={13}
                                  height={13}
                                  color="red"
                                />
                              )}

                              {(LabelVal ===
                                "Heterogeneous Tissue Prominence" ||
                                LabelVal ===
                                  "Hypertrophic Tissue with Microcysts") && (
                                <>
                                  <span>To </span>
                                  <SingleBreastPositionPicker
                                    value={data.locationclockpositionto}
                                    onChange={(e) => {
                                      const updated = [...dataArray];
                                      updated[index].locationclockpositionto =
                                        e;
                                      updated[index].syncStatus = true;
                                      handleReportInputChange(
                                        DataQId,
                                        JSON.stringify(updated)
                                      );
                                    }}
                                    singleSelect={true}
                                  />
                                  {data.locationclockpositionto.length > 0 && (
                                    <X
                                      className="cursor-pointer"
                                      onClick={() => {
                                        const updated = [...dataArray];
                                        updated[index].locationclockpositionto =
                                          "";
                                        updated[index].syncStatus = true;
                                        handleReportInputChange(
                                          DataQId,
                                          JSON.stringify(updated)
                                        );
                                      }}
                                      width={13}
                                      height={13}
                                      color="red"
                                    />
                                  )}
                                </>
                              )}
                            </div>
                          </div>

                          {/* 2. Location - Level */}
                          <div className="flex flex-col gap-2">
                            <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
                              <Label className="font-semibold text-base w-auto lg:w-52 flex-shrink-0">
                                Location - Level
                              </Label>
                              <div className="flex flex-wrap items-center gap-3">
                                {[
                                  "Coronal Level",
                                  "Axial",
                                  "Sagital",
                                  "Unknown",
                                ].map((level, i) => (
                                  <div
                                    key={level}
                                    className="flex items-center gap-2"
                                  >
                                    <input
                                      type="radio"
                                      id={`Level-${mainQId}-${index}-${i}`}
                                      name={`levelquestion-${mainQId}-${index}`}
                                      value={level}
                                      checked={data.locationLevel === level}
                                      onChange={() => {
                                        const updated = [...dataArray];
                                        updated[index].locationLevel = level;
                                        updated[index].syncStatus = true;
                                        handleReportInputChange(
                                          DataQId,
                                          JSON.stringify(updated)
                                        );
                                      }}
                                      required
                                      className="custom-radio"
                                    />
                                    <Label
                                      htmlFor={`Level-${mainQId}-${index}-${i}`}
                                    >
                                      {level}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                            {["Sagital", "Axial", "Coronal Level"].includes(
                              data.locationLevel
                            ) && (
                              <div
                                className={
                                  "flex items-center gap-2 mt-2 lg:mt-0" +
                                  (data.locationLevel === "Sagital"
                                    ? " lg:ml-[27rem]"
                                    : data.locationLevel === "Axial"
                                    ? " lg:ml-[22rem]"
                                    : " lg:ml-[14rem]")
                                }
                              >
                                <span>
                                  {data.locationLevel === "Sagital"
                                    ? "M/L -"
                                    : data.locationLevel === "Axial"
                                    ? "S -"
                                    : "P -"}
                                </span>
                                <GridNumber200
                                  className="w-20"
                                  value={data.locationLevelPercentage}
                                  onChange={(e) => {
                                    const updated = [...dataArray];
                                    updated[index].locationLevelPercentage = e;
                                    updated[index].syncStatus = true;
                                    handleReportInputChange(
                                      DataQId,
                                      JSON.stringify(updated)
                                    );
                                  }}
                                />
                                {data.locationLevelPercentage.length > 0 && (
                                  <X
                                    className="cursor-pointer"
                                    onClick={() => {
                                      const updated = [...dataArray];
                                      updated[index].locationLevelPercentage =
                                        "";
                                      updated[index].syncStatus = true;
                                      handleReportInputChange(
                                        DataQId,
                                        JSON.stringify(updated)
                                      );
                                    }}
                                    width={13}
                                    height={13}
                                    color="red"
                                  />
                                )}
                                {(LabelVal ===
                                  "Heterogeneous Tissue Prominence" ||
                                  LabelVal ===
                                    "Hypertrophic Tissue with Microcysts") && (
                                  <>
                                    <span>To </span>
                                    <GridNumber200
                                      className="w-20"
                                      value={data.locationLevelPercentageto}
                                      onChange={(e) => {
                                        const updated = [...dataArray];
                                        updated[
                                          index
                                        ].locationLevelPercentageto = e;
                                        updated[index].syncStatus = true;
                                        handleReportInputChange(
                                          DataQId,
                                          JSON.stringify(updated)
                                        );
                                      }}
                                    />
                                    {data.locationLevelPercentageto.length >
                                      0 && (
                                      <X
                                        className="cursor-pointer"
                                        onClick={() => {
                                          const updated = [...dataArray];
                                          updated[
                                            index
                                          ].locationLevelPercentageto = "";
                                          updated[index].syncStatus = true;
                                          handleReportInputChange(
                                            DataQId,
                                            JSON.stringify(updated)
                                          );
                                        }}
                                        width={13}
                                        height={13}
                                        color="red"
                                      />
                                    )}
                                  </>
                                )}
                              </div>
                            )}
                          </div>

                          {LabelVal === "Multiple Simple Cysts" && (
                            <>
                              {/* 3. Atleast */}
                              <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
                                <Label className="font-semibold text-base w-auto lg:w-52 flex-shrink-0">
                                  Number of Cysts
                                </Label>
                                <div className="flex items-center gap-2 flex-grow">
                                  <Input
                                    type="number"
                                    className="w-20"
                                    value={data.atleast}
                                    onChange={(e) => {
                                      const updated = [...dataArray];
                                      updated[index].atleast = e.target.value;
                                      updated[index].syncStatus = true;
                                      handleReportInputChange(
                                        DataQId,
                                        JSON.stringify(updated)
                                      );
                                    }}
                                  />
                                  {/* <span className="text-sm">mm</span> */}
                                </div>
                              </div>
                            </>
                          )}

                          {/* 3. Distance from Nipple */}
                          <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
                            <Label className="font-semibold text-base w-auto lg:w-52 flex-shrink-0">
                              Distance from Nipple
                            </Label>
                            <div className="flex items-center gap-2 flex-grow">
                              <Input
                                type="number"
                                className="w-20"
                                placeholder="mm"
                                value={data.distancenipple}
                                onChange={(e) => {
                                  const updated = [...dataArray];
                                  updated[index].distancenipple =
                                    e.target.value;
                                  updated[index].syncStatus = true;
                                  handleReportInputChange(
                                    DataQId,
                                    JSON.stringify(updated)
                                  );
                                }}
                              />
                              <span className="text-sm">mm</span>
                            </div>
                          </div>

                          {/* 4. Size */}
                          <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
                            <Label className="font-semibold text-base w-auto lg:w-52 flex-shrink-0">
                              Size
                            </Label>
                            <div className="flex flex-col sm:flex-row gap-4">
                              {[
                                { label: "W", key: "sizew" },
                                { label: "L", key: "sizel" },
                                { label: "H", key: "sizeh" },
                              ].map((dim, i) => (
                                <div
                                  key={dim.key}
                                  className="flex items-center gap-1"
                                >
                                  <span className="w-6 text-sm font-bold flex justify-center">
                                    {dim.label}
                                  </span>
                                  <Input
                                    type="number"
                                    className="w-20"
                                    placeholder="mm"
                                    value={data[dim.key] || ""}
                                    onChange={(e) => {
                                      const updated = [...dataArray];
                                      updated[index][dim.key] = e.target.value;
                                      updated[index].syncStatus = true;
                                      handleReportInputChange(
                                        DataQId,
                                        JSON.stringify(updated)
                                      );
                                    }}
                                  />
                                  {i < 2 && (
                                    <span className="w-6 text-sm font-bold flex justify-center">
                                      X
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* 5. Shape */}
                          <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
                            <Label className="font-semibold text-base w-auto lg:w-52 flex-shrink-0">
                              Shape
                            </Label>
                            <div className="flex flex-wrap gap-3">
                              {["Round", "Oval", "Irregular", "Unknown"].map(
                                (shape, i) => (
                                  <div
                                    key={shape}
                                    className="flex items-center gap-2"
                                  >
                                    <input
                                      type="radio"
                                      id={`Shape-${mainQId}-${index}-${i}`}
                                      name={`shapequestion-${mainQId}-${index}`}
                                      value={shape.toLowerCase()}
                                      checked={
                                        data.Shape === shape.toLowerCase()
                                      }
                                      onChange={() => {
                                        const updated = [...dataArray];
                                        updated[index].Shape =
                                          shape.toLowerCase();
                                        updated[index].syncStatus = true;
                                        handleReportInputChange(
                                          DataQId,
                                          JSON.stringify(updated)
                                        );
                                      }}
                                      required
                                      className="custom-radio"
                                    />
                                    <Label
                                      htmlFor={`Shape-${mainQId}-${index}-${i}`}
                                    >
                                      {shape}
                                    </Label>
                                  </div>
                                )
                              )}
                            </div>
                          </div>

                          {/* 6. Appearance */}
                          <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
                            <Label className="font-semibold text-base w-auto lg:w-52 flex-shrink-0">
                              Appearance
                            </Label>
                            <div className="flex flex-wrap gap-3">
                              {[
                                {
                                  label: "Heterogenous",
                                  value: "heterogenous",
                                },
                                { label: "Homogenous", value: "homogenous" },
                                { label: "Unknown", value: "unknown" },
                              ].map((item, i) => (
                                <div
                                  key={item.value}
                                  className="flex items-center gap-2"
                                >
                                  <input
                                    type="radio"
                                    id={`Appearance-${mainQId}-${index}-${i}`}
                                    name={`appearancequestion-${mainQId}-${index}`}
                                    value={item.value}
                                    checked={data.Appearance === item.value}
                                    onChange={() => {
                                      const updated = [...dataArray];
                                      updated[index].Appearance = item.value;
                                      updated[index].syncStatus = true;
                                      handleReportInputChange(
                                        DataQId,
                                        JSON.stringify(updated)
                                      );
                                    }}
                                    required
                                    className="custom-radio"
                                  />
                                  <Label
                                    htmlFor={`Appearance-${mainQId}-${index}-${i}`}
                                  >
                                    {item.label}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* 7. Margins */}
                          <div className="flex flex-col mt-3 mb-6 lg:flex-row gap-4 lg:items-center">
                            <Label className="font-semibold text-base w-auto lg:w-52 flex-shrink-0">
                              Margins
                            </Label>
                            <div className="flex flex-wrap gap-3">
                              {[
                                "Well Circumscribed",
                                "Microlobulated",
                                "Indistinct",
                                "Obscured",
                                "Spiculated",
                                "Angular",
                                "Irregular",
                                "Unknown",
                              ].map((m, i) => (
                                <div
                                  key={m}
                                  className="flex items-center gap-2"
                                >
                                  <input
                                    type="radio"
                                    id={`Margins-${mainQId}-${index}-${i}`}
                                    name={`marginsquestion-${mainQId}-${index}`}
                                    value={m.toLowerCase()}
                                    checked={data.Margins === m.toLowerCase()}
                                    onChange={() => {
                                      const updated = [...dataArray];
                                      updated[index].Margins = m.toLowerCase();
                                      updated[index].syncStatus = true;
                                      handleReportInputChange(
                                        DataQId,
                                        JSON.stringify(updated)
                                      );
                                    }}
                                    required
                                    className="custom-radio"
                                  />
                                  <Label
                                    htmlFor={`Margins-${mainQId}-${index}-${i}`}
                                  >
                                    {m}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* 8. Density/Echogenicity */}
                          <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
                            <Label className="font-semibold text-base w-auto lg:w-52 flex-shrink-0">
                              Density/Echogenicity
                            </Label>
                            <div className="flex flex-wrap gap-3">
                              {[
                                "Hypoechoic",
                                "Isoechoic",
                                "Anechoic",
                                "Mixed",
                                LabelVal !== "Simple Cyst" && "Hyperechoic",
                                // "Complex",
                                "Unknown",
                              ].map((d, i) => (
                                <>
                                  {d && (
                                    <div
                                      key={d}
                                      className="flex items-center gap-2"
                                    >
                                      <input
                                        type="radio"
                                        id={`Density-${mainQId}-${index}-${i}`}
                                        name={`densityquestion-${mainQId}-${index}`}
                                        value={d.toLowerCase()}
                                        checked={
                                          data.density === d.toLowerCase()
                                        }
                                        onChange={() => {
                                          const updated = [...dataArray];
                                          updated[index].density =
                                            d.toLowerCase();
                                          updated[index].syncStatus = true;
                                          handleReportInputChange(
                                            DataQId,
                                            JSON.stringify(updated)
                                          );
                                        }}
                                        required
                                        className="custom-radio"
                                      />
                                      <Label
                                        htmlFor={`Density-${mainQId}-${index}-${i}`}
                                      >
                                        {d}
                                      </Label>
                                    </div>
                                  )}
                                </>
                              ))}
                            </div>
                          </div>

                          {/* 9. Transmission Speed */}
                          <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
                            <Label className="font-semibold text-base w-auto lg:w-52 flex-shrink-0">
                              Transmission Speed
                            </Label>
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                className="w-25"
                                placeholder="m/s"
                                value={data.Transmissionspped}
                                onChange={(e) => {
                                  const updated = [...dataArray];
                                  updated[index].Transmissionspped =
                                    e.target.value;
                                  updated[index].syncStatus = true;
                                  handleReportInputChange(
                                    DataQId,
                                    JSON.stringify(updated)
                                  );
                                }}
                              />
                              <span className="text-sm">(m/s)</span>
                            </div>
                          </div>

                          {LabelVal === "Complex Cystic Structure" && (
                            <>
                              {/* 10. Internal debris / Shadowing */}
                              <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
                                <Label className="font-semibold text-base w-auto lg:w-52 flex-shrink-0">
                                  Internal debris / Shadowing
                                </Label>
                                <div className="flex flex-wrap gap-3">
                                  {[
                                    { label: "Present", value: "present" },
                                    {
                                      label: "Not present",
                                      value: "not present",
                                    },
                                  ].map((item, i) => (
                                    <div
                                      key={item.value}
                                      className="flex items-center gap-2"
                                    >
                                      <input
                                        type="radio"
                                        id={`Internal-${mainQId}-${index}-${i}`}
                                        name={`internalquestion-${mainQId}-${index}`}
                                        value={item.value}
                                        checked={data.debris === item.value}
                                        onChange={() => {
                                          const updated = [...dataArray];
                                          updated[index].debris = item.value;
                                          updated[index].syncStatus = true;
                                          handleReportInputChange(
                                            DataQId,
                                            JSON.stringify(updated)
                                          );
                                        }}
                                        required
                                        className="custom-radio"
                                      />
                                      <Label
                                        htmlFor={`Internal-${mainQId}-${index}-${i}`}
                                      >
                                        {item.label}
                                      </Label>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </>
                          )}

                          {/* 11. Volume */}
                          <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
                            <Label className="font-semibold text-base w-auto lg:w-52 flex-shrink-0">
                              Volume
                            </Label>
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                className="w-20"
                                placeholder=""
                                value={data.Volumne}
                                onChange={(e) => {
                                  const updated = [...dataArray];
                                  updated[index].Volumne = e.target.value;
                                  updated[index].syncStatus = true;
                                  handleReportInputChange(
                                    DataQId,
                                    JSON.stringify(updated)
                                  );
                                }}
                              />
                              <span className="text-sm">cubic mm</span>
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
                                DataQId,
                                JSON.stringify(updated)
                              );
                            }}
                          />
                        </div>
                      </div>
                      <div className="w-full lg:w-[90%] mx-auto  rounded-2xl text-lg p-4 leading-7">
                        <div className="flex items-center justify-between mb-2">
                          {" "}
                          <span className="text-2xl">Report Preview</span>
                        </div>
                        {sectionVal && (
                          <TextEditor
                            value={editorVal[sectionVal]?.[index] || ""}
                            // onChange={(val) => {
                            //   const updated = { ...editorVal };
                            //   updated[sectionVal] = [
                            //     ...(updated[sectionVal] || []),
                            //   ];
                            //   updated[sectionVal][index] = val;

                            //   textEditorOnChange?.(JSON.stringify(updated));
                            // }}
                            // onManualEdit={() => {
                            //   const updated = [...dataArray];
                            //   updated[index].syncStatus = false;
                            //   handleReportInputChange(
                            //     DataQId,
                            //     JSON.stringify(updated)
                            //   );
                            // }}
                            onChange={(val, _, source) => {
                              if (source === "user") {
                                debouncedUpdate(
                                  index,
                                  val,
                                  sectionVal,
                                  dataArray,
                                  DataQId
                                );
                              }
                            }}
                          />
                        )}
                      </div>
                      <div className="w-full lg:w-[90%] mx-auto  rounded-2xl text-lg p-4 leading-7">
                        <div className="flex items-center justify-between mb-2">
                          {" "}
                          <span className="text-2xl">Image Preview</span>
                        </div>
                        {sectionVal && (
                          <TextEditor
                            value={data.ImageText}
                            onChange={(e) => {
                              const updated = [...dataArray];
                              updated[index].ImageText = e;
                              handleReportInputChange(
                                DataQId,
                                JSON.stringify(updated)
                              );
                            }}
                            placeholder="📷 Paste image..."
                          />
                        )}
                      </div>
                      {index !== dataArray.length - 1 && <hr />}
                    </div>
                  ))
                );
              })()}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default LesionsOptions;
