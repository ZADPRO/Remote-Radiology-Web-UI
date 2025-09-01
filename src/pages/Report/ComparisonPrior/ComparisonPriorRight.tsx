import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { ReportQuestion } from "../Report";
import { Label } from "@/components/ui/label";
import { Checkbox2 } from "@/components/ui/CustomComponents/checkbox2";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash, X } from "lucide-react";
import SingleBreastPositionPicker from "@/components/ui/CustomComponents/SingleBreastPositionPicker";
import GridNumber200 from "@/components/ui/CustomComponents/GridNumber200";
import CustomSelect from "@/components/ui/CustomComponents/CustomSelect";
import TextEditor from "@/components/TextEditor";
import { ComparisonPriorRightString } from "./ComparisonPriorRightString";
import debounce from "lodash.debounce";

interface QuestionIds {
  ComparisonPriorRight: number;
  FindingStatus: number;
  doubletimefrom: number;
  doubletimeto: number;
  LesionCompTable: number;
}

interface LesionData {
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
  previous: string;
  lesionStatus: string;
  doublingtimedate1: string;
  doublingtimedate2: string;
  vol1: string;
  vol2: string;
  lesionspresent: string;
  syncStatus: boolean;
}

interface Props {
  reportFormData: ReportQuestion[];
  handleReportInputChange: (questionId: number, value: string) => void;
  questionIds: QuestionIds;
  label: string;
  side: string;
  textEditorVal: string;
  textEditorOnChange: (value: string) => void;
}

// 🔹 Constants
const POSITIVE_NEGATIVE = ["+", "-"];
const PREVIOUS_SCAN_OPTIONS = ["benign findings", "lesions present"];
const LESION_STATUS_OPTIONS = [
  "Interval increase",
  "Interval decrease",
  "Stable",
  "Resolved",
  "Not well visualised in current study",
];
const TABLE_HEADERS = ["Lesion ID", "Findings", "Current", "Previous"];
const TABLE_ROWS = [
  { label: "Size (Mm)", key: "size" },
  { label: "Volume (Cubic Mm)", key: "volume" },
  { label: "Speed (M/S)", key: "speed" },
  { label: "Location", key: "location" },
];
const DEFAULT_LESION_DATA: LesionData = {
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
  previous: "",
  lesionStatus: "",
  doublingtimedate1: "+",
  doublingtimedate2: "",
  vol1: "",
  vol2: "",
  lesionspresent: "",
  syncStatus: true,
};

const ComparisonPriorRight: React.FC<Props> = ({
  questionIds,
  reportFormData,
  handleReportInputChange,
  label,
  side,
  textEditorVal,
  textEditorOnChange,
}) => {
  const getAnswer = useCallback(
    (id: number) =>
      reportFormData.find((q) => q.questionId === id)?.answer || "",
    [reportFormData]
  );

  // 🔹 Editor values - local state for immediate UI updates
  const [editorVal, setEditorVal] = useState<string[]>([]);

  // 🔹 Debounced function for parent updates - using useRef to prevent recreation
  const debouncedUpdateParent = useRef(
    debounce((newEditorVal: string[]) => {
      textEditorOnChange(JSON.stringify(newEditorVal));
    }, 500)
  ).current;

  // Initialize editor values from props
  useEffect(() => {
    try {
      const parsed = JSON.parse(textEditorVal || "[]");
      setEditorVal(parsed);
    } catch {
      setEditorVal([]);
    }
  }, [textEditorVal]);

  // Update parent when local editorVal changes (debounced)
  useEffect(() => {
    debouncedUpdateParent(editorVal);
  }, [editorVal, debouncedUpdateParent]);

  // 🔹 Parse lesion data
  const lesionData: LesionData[] = useMemo(() => {
    try {
      return JSON.parse(getAnswer(questionIds.LesionCompTable) || "[]");
    } catch {
      return [];
    }
  }, [getAnswer, questionIds.LesionCompTable]);

  // 🔹 Memoize relevant answers to prevent unnecessary re-renders
  const relevantAnswers = useMemo(
    () => ({
      comparisonPrior: getAnswer(questionIds.ComparisonPriorRight),
      findingStatus: getAnswer(questionIds.FindingStatus),
      doubleTimeFrom: getAnswer(questionIds.doubletimefrom),
      doubleTimeTo: getAnswer(questionIds.doubletimeto),
      lesionCompTable: getAnswer(questionIds.LesionCompTable),
    }),
    [getAnswer, questionIds]
  );

  // 🔹 Sync string generation - optimized to prevent conflicts
  useEffect(() => {
    if (!reportFormData?.length) return;

    const generatedString = ComparisonPriorRightString(
      reportFormData,
      questionIds,
      side,
      textEditorVal
    );

    // Only update if the generated string is actually different
    if (generatedString !== textEditorVal) {
      textEditorOnChange(generatedString);
    }
  }, [relevantAnswers, side, questionIds]);

  // 🔹 Lesion data helpers
  const updateLesionData = useCallback(
    (data: LesionData[]) =>
      handleReportInputChange(
        questionIds.LesionCompTable,
        JSON.stringify(data)
      ),
    [handleReportInputChange, questionIds.LesionCompTable]
  );

  const updateLesionField = useCallback(
    (i: number, field: keyof LesionData, value: string | boolean) => {
      const updated = [...lesionData];
      if (field === "syncStatus") {
        updated[i] = { ...updated[i], syncStatus: false };
      } else {
        updated[i] = { ...updated[i], [field]: value, syncStatus: true };
      }
      updateLesionData(updated);
    },
    [lesionData, updateLesionData]
  );

  const addLesion = useCallback(
    () => updateLesionData([...lesionData, { ...DEFAULT_LESION_DATA }]),
    [lesionData, updateLesionData]
  );

  const removeLesion = useCallback(
    (i: number) => updateLesionData(lesionData.filter((_, idx) => idx !== i)),
    [lesionData, updateLesionData]
  );

  // 🔹 Text editor update function
  const updateTextEditorValue = useCallback(
    (i: number, value: string) => {
      setEditorVal((prev) => {
        const updated = [...prev];
        updated[i] = value;
        return updated;
      });
      updateLesionField(i, "syncStatus", false);
    },
    [updateLesionField]
  );

  const isPresent = getAnswer(questionIds.ComparisonPriorRight) === "Present";

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex gap-4 items-center mb-4">
        <Checkbox2
          checked={isPresent}
          onCheckedChange={(checked) =>
            handleReportInputChange(
              questionIds.ComparisonPriorRight,
              checked ? "Present" : ""
            )
          }
          className="w-5 h-5 mt-1"
        />
        <Label className="font-semibold text-2xl">{label}</Label>
      </div>

      {isPresent && (
        <div className="py-4 lg:px-10 space-y-6">
          {/* Add button */}
          <div className="flex items-center gap-4">
            <Label className="font-semibold text-base">Comparison Table</Label>
            <Button
              className="bg-[#a4b2a1] hover:bg-[#a4b2a1]"
              onClick={addLesion}
            >
              Add
            </Button>
          </div>

          {/* Lesion entries */}
          {lesionData.map((data, i) => (
            <div key={i} className="space-y-6">
              {/* Table */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <div className="overflow-x-auto rounded-xl border border-[#f0eae6]">
                    <table className="table-auto w-full text-sm bg-[#fff9f6]">
                      <thead className="bg-[#f7f5f2] font-semibold">
                        <tr>
                          {TABLE_HEADERS.map((h) => (
                            <th key={h} className="px-4 py-3 border">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {TABLE_ROWS.map((row, rowIdx) => (
                          <tr
                            key={row.key}
                            className={rowIdx % 2 ? "bg-[#f6ede6]" : ""}
                          >
                            {rowIdx === 0 && (
                              <td
                                rowSpan={4}
                                className="px-4 py-2 border font-bold bg-[#fdf8f6]"
                              >
                                {side === "Right" ? "R" : "L"}
                                {i + 1}
                              </td>
                            )}
                            <td className="px-4 border">{row.label}</td>
                            {row.key === "location" ? (
                              <>
                                {/* Current loc */}
                                <td className="px-2 border">
                                  <div className="flex gap-2 items-center">
                                    <SingleBreastPositionPicker
                                      value={data.locationcclock}
                                      onChange={(e) =>
                                        updateLesionField(
                                          i,
                                          "locationcclock",
                                          e
                                        )
                                      }
                                      singleSelect
                                    />
                                    {data.locationcclock && (
                                      <X
                                        className="text-[red] w-5 h-5 cursor-pointer"
                                        onClick={() => {
                                          updateLesionField(
                                            i,
                                            "locationcclock",
                                            ""
                                          );
                                        }}
                                      />
                                    )}
                                    <GridNumber200
                                      value={data.locationcposition}
                                      onChange={(e) =>
                                        updateLesionField(
                                          i,
                                          "locationcposition",
                                          e
                                        )
                                      }
                                    />
                                    {data.locationcposition && (
                                      <X
                                        className="text-[red] w-5 h-5 cursor-pointer"
                                        onClick={() => {
                                          updateLesionField(
                                            i,
                                            "locationcposition",
                                            ""
                                          );
                                        }}
                                      />
                                    )}
                                  </div>
                                </td>
                                {/* Previous loc */}
                                <td className="px-4 py-2 border">
                                  <div className="flex gap-2 items-center">
                                    <SingleBreastPositionPicker
                                      value={data.locationpclock}
                                      onChange={(e) =>
                                        updateLesionField(
                                          i,
                                          "locationpclock",
                                          e
                                        )
                                      }
                                      singleSelect
                                    />
                                    {data.locationpclock && (
                                      <X
                                        className="text-[red] w-5 h-5 cursor-pointer"
                                        onClick={() => {
                                          updateLesionField(
                                            i,
                                            "locationpclock",
                                            ""
                                          );
                                        }}
                                      />
                                    )}
                                    <GridNumber200
                                      value={data.locationpposition}
                                      onChange={(e) =>
                                        updateLesionField(
                                          i,
                                          "locationpposition",
                                          e
                                        )
                                      }
                                    />
                                    {data.locationpposition && (
                                      <X
                                        className="text-[red] w-5 h-5 cursor-pointer"
                                        onClick={() => {
                                          updateLesionField(
                                            i,
                                            "locationpposition",
                                            ""
                                          );
                                        }}
                                      />
                                    )}
                                  </div>
                                </td>
                              </>
                            ) : (
                              <>
                                <td className="px-4 py-2 border">
                                  <Input
                                    value={
                                      data[
                                        `${row.key}c` as keyof LesionData
                                      ] as string
                                    }
                                    onChange={(e) =>
                                      updateLesionField(
                                        i,
                                        `${row.key}c` as keyof LesionData,
                                        e.target.value
                                      )
                                    }
                                    className="w-20 h-8 text-sm text-center"
                                    type="number"
                                  />
                                </td>
                                <td className="px-4 py-2 border">
                                  <Input
                                    value={
                                      data[
                                        `${row.key}p` as keyof LesionData
                                      ] as string
                                    }
                                    onChange={(e) =>
                                      updateLesionField(
                                        i,
                                        `${row.key}p` as keyof LesionData,
                                        e.target.value
                                      )
                                    }
                                    className="w-20 h-8 text-sm text-center"
                                    type="number"
                                  />
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Radio groups */}
                  <div className="flex w-full mt-4 gap-3 items-center">
                    <Label className="w-60 font-semibold">
                      {side === "Right" ? "R" : "L"}
                      {i + 1}
                    </Label>
                    <div className="w-full">
                      <Input
                        type="text"
                        className="w-60"
                        value={data.vol2}
                        onChange={(e) =>
                          updateLesionField(i, "vol2", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  {/* Radio groups */}
                  <div className="flex w-full mt-3  gap-3 items-center">
                    <Label className="w-60 font-semibold">Previous Scan</Label>
                    <div className="flex w-full gap-2 flex-wrap">
                      {PREVIOUS_SCAN_OPTIONS.map((opt) => (
                        <label
                          key={opt}
                          className="flex items-center gap-2 min-h-10"
                        >
                          <input
                            type="radio"
                            checked={data.previous === opt}
                            className="custom-radio"
                            value={opt}
                            onChange={() =>
                              updateLesionField(i, "previous", opt)
                            }
                          />
                          {opt}
                        </label>
                      ))}
                      {data.previous === "lesions present" && (
                        <Input
                          type="text"
                          className="w-60"
                          value={data.lesionspresent}
                          onChange={(e) =>
                            updateLesionField(
                              i,
                              "lesionspresent",
                              e.target.value
                            )
                          }
                        />
                      )}
                    </div>
                  </div>

                  <div className="flex w-full mt-3 gap-3 items-center">
                    <Label className="w-60 font-semibold">Lesion Status</Label>
                    <div className="flex w-full gap-2 flex-wrap">
                      {LESION_STATUS_OPTIONS.map((opt) => (
                        <label
                          key={opt}
                          className="flex items-center gap-2 min-h-10"
                        >
                          <input
                            type="radio"
                            checked={data.lesionStatus === opt}
                            className="custom-radio"
                            value={opt}
                            onChange={() =>
                              updateLesionField(i, "lesionStatus", opt)
                            }
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Doubling time */}
                  <div className="flex mt-3 flex-row h-10 items-center w-full gap-2">
                    <Label className="font-semibold w-60 text-sm">
                      Doubling Time
                    </Label>
                    <div className="flex flex-row gap-4 w-full">
                      <CustomSelect
                        value={data.doublingtimedate1}
                        onChange={(v) =>
                          updateLesionField(i, "doublingtimedate1", v)
                        }
                        className="min-w-10"
                        options={POSITIVE_NEGATIVE}
                      />
                      <Input
                        type="number"
                        className="w-30"
                        value={data.doublingtimedate2}
                        onChange={(e) =>
                          updateLesionField(
                            i,
                            "doublingtimedate2",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                </div>

                <Trash
                  className="text-red-600 w-5 h-5 cursor-pointer"
                  onClick={() => removeLesion(i)}
                />
              </div>

              {/* Report & Image Previews */}
              <div className="space-y-4">
                <div>
                  <Label className="text-xl">Report Preview</Label>
                  <TextEditor
                    value={editorVal[i] || ""}
                    onChange={(val, _, source) => {
                      if (source === "user") {
                        updateTextEditorValue(i, val);
                      }
                    }}
                  />
                </div>
                <div>
                  <Label className="text-xl">Image Preview</Label>
                  <TextEditor
                    value={data.vol1}
                    placeholder="📷 Paste image..."
                    onChange={(val) => updateLesionField(i, "vol1", val)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComparisonPriorRight;
