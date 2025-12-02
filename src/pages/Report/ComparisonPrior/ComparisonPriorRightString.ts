interface ReportQuestion {
  questionId: number;
  answer: string;
}

interface QuestionIds {
  ComparisonPriorRight: number;
  FindingStatus: number;
  doubletimefrom: number;
  doubletimeto: number;
  LesionCompTable: number;
}

export function ComparisonPriorRightString(
  reportFormData: ReportQuestion[],
  questionIds: QuestionIds,
  side: string,
  ComparisonPriorData: string
): string {
  const getAnswer = (id: number) =>
    reportFormData.find((q) => q.questionId === id)?.answer || "";

  let actualComparison: string[] = [];
  try {
    actualComparison = JSON.parse(ComparisonPriorData) as string[];
  } catch {
    actualComparison = [];
  }

  // ✅ Only render if comparison is marked Present
  const comparisonCheckId = side === "Right" ? 52 : 105;
  if (getAnswer(comparisonCheckId) !== "Present") return "";

  let dataArray: any[] = [];
  try {
    const raw = getAnswer(questionIds.LesionCompTable);
    dataArray = raw ? JSON.parse(raw) : [];
  } catch {
    dataArray = [];
  }

  // const formatLocation = (clock: string, pos: string, _ = "") =>
  //   `${clock === "0" ? "retroareolar region" : `${clock} o'clock`}, P${pos}`;

  const comparisonVal: string[] = dataArray.map((data, index) => {
    if (data.syncStatus) {
      const lesionId = `${side === "Right" ? "R" : "L"}${index + 1}`;
      // const PreviousLoc = formatLocation(
      //   data.locationpclock,
      //   data.locationpposition
      // );
      // const currLoc = formatLocation(
      //   data.locationcclock,
      //   data.locationcposition
      // );

      return `
        ${
          data.previous
            ? `<p>The Previous scan showed ${data.previous}${
                data.lesionspresent && data.previous === "lesions present"
                  ? ` ( ${data.lesionspresent} ).</p>`
                  : ".</p>"
              }`
            : ".</p>"
        }
        <p><b>${lesionId} ${data.vol2 ? data.vol2 : ``}</b></p>
        ${
          data.lesionStatus ? `<p>Lesion status: ${data.lesionStatus}.</p>` : ""
        }
        ${
          data.doublingtimedate1 && data.doublingtimedate2
            ? `<p>Doubling time is estimated to be ${data.doublingtimedate1}${data.doublingtimedate2} days.</p>`
            : ""
        }
        <span>
          ${
            (data.sizec || data.sizep) &&
            `<p>Size: ${data.sizec ? `${data.sizec} mm` : ""}${
              data.sizep ? ` (Previous: ${data.sizep} mm)` : ""
            }</p>`
          }
          ${
            (data.volumec || data.volumep) &&
            `<p>Volume: ${data.volumec ? `${data.volumec} mm³` : ""}${
              data.volumep ? ` (Previous: ${data.volumep} mm³)` : ""
            }</p>`
          }
          ${
            (data.speedc || data.speedp) &&
            `<p>Speed of sound: ${data.speedc ? `${data.speedc} m/s` : ""}${
              data.speedp ? ` (Previous: ${data.speedp} m/s)` : ""
            }<p/>`
          }
          ${
            data.locationcclock ||
            data.locationcposition ||
            data.locationpclock ||
            data.locationpposition
              ? `Location: ${
                  data.locationcclock
                    ? `${
                        data.locationcclock === "0"
                          ? "retroareolar region"
                          : `${data.locationcclock} o'clock`
                      }`
                    : ``
                }${
                  data.locationcposition
                    ? `${data.locationcclock ? ", " : ""}P${
                        data.locationcposition
                      }`
                    : ""
                }${
                  data.locationpclock ||
                  data.locationpposition ||
                  (data.locationpclock && data.locationpposition)
                    ? ` (Previous: ${
                        data.locationpclock
                          ? `${
                              data.locationpclock === "0"
                                ? "retroareolar region"
                                : `${data.locationpclock} o'clock`
                            }`
                          : ""
                      }${
                        data.locationpposition
                          ? `${data.locationpclock ? ", " : ""}P${
                              data.locationpposition
                            }`
                          : ""
                      })`
                    : ""
                }`
              : ``
          }
        </span>
      `;
    }
    return actualComparison[index] || "";
  });

  return JSON.stringify(comparisonVal);
}
