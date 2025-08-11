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
  side: string
): string {
  //   function parseDDMMYYYYToDate(dateStr: string): Date {
  //     const [day, month, year] = dateStr.split("-").map(Number);
  //     return new Date(year, month - 1, day);
  //   }

  //   function daysBetween(dateStr1: string, dateStr2: string): number {
  //     const date1 = parseDDMMYYYYToDate(dateStr1);
  //     const date2 = parseDDMMYYYYToDate(dateStr2);

  //     // Calculate difference in milliseconds
  //     const diffMs = date1.getTime() - date2.getTime();

  //     // Convert ms to days (1 day = 24*60*60*1000 ms)
  //     const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  //     return Math.abs(diffDays);
  //   }

  const getAnswer = (id: number) =>
    reportFormData.find((q) => q.questionId === id)?.answer || "";

  // ✅ Check if QuestionId 52 is "Present"
  const isComparisonPresent = getAnswer(52);
  if (isComparisonPresent !== "Present") {
    return ""; // 🛑 Skip rendering if not Present
  }

  let result = "";

  // const findingStatus = getAnswer(questionIds.FindingStatus);
  // const timeFrom = getAnswer(questionIds.doubletimefrom);
  // const timeTo = getAnswer(questionIds.doubletimeto);

  let dataArray: any[] = [];
  try {
    const raw = getAnswer(questionIds.LesionCompTable);
    dataArray = raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Invalid JSON:", err);
  }

  // function calculateFormula(F2: number, E2: number, D2: number): number {
  //     if (D2 === 0) throw new Error("D2 cannot be zero (division by zero).");
  //     if (E2 / D2 <= 0) throw new Error("E2/D2 must be positive for log10.");

  //     const numerator = F2 * Math.log10(2);
  //     const denominator = Math.log10(E2 / D2);
  //     const result = numerator / denominator;

  //     // If integer, return integer
  //     if (Number.isInteger(result)) {
  //         return Math.round(result);
  //     }
  //     // Otherwise, round to 2 decimal places
  //     return parseFloat(result.toFixed(2));
  // }

  // let lesionRefs = dataArray.map((_, index) => {
  //     const ref = `${side === "Right" ? "R" : "L"}${index + 1}`;
  //     if (index === dataArray.length - 1) {
  //         return `and ${ref}`;
  //     } else if (index === dataArray.length - 2) {
  //         return `${ref} `;
  //     } else {
  //         return `${ref}, `;
  //     }
  // }).join("");

  // result += `<span>There is a ${findingStatus} finding in the lesion identified as ${lesionRefs.trim()}. Doubling time is estimated to be in the range of ${timeFrom}-${timeTo} days. Comparison of current and previous imaging shows the following for Lesion</span><br /><br />`;

  dataArray.forEach((data: any, index: number) => {
    const currentLoc =
      data.locationcclock === "0" ? "Nipple" : `${data.locationcclock}'o Clock`;
    const prevLoc =
      data.locationpclock === "0" ? "Nipple" : `${data.locationpclock}'o Clock`;

    // let doubletimecalculation = 0;

    // if (data.doublingtimedate1 && data.doublingtimedate2 && data.vol1 && data.vol2) {
    //     const t = daysBetween(data.doublingtimedate2, data.doublingtimedate1)

    //     doubletimecalculation = calculateFormula(t, parseFloat(data.vol2), parseFloat(data.vol1))

    // }

    // result += `<span>There is a ${data.lesionStatus || ""} finding in the ${
    //   data.previous || ""
    // } identified as ${side === "Right" ? "R" : "L"}${
    //   index + 1
    // }. Doubling time is estimated to be in the range of ${doubletimecalculation} days. Comparison of current and previous imaging shows the following for ${
    //   data.previous || ""
    // }</span><br />`;

    result += `${
      data.previous ||
      data.lesionStatus ||
      (data.doublingtimedate1 && data.doublingtimedate2)
        ? `<p>${
            data.previous ? `Previous scan showed ${data.previous || ""}. ` : ``
          }${
            data.lesionStatus
              ? `
        Lesion status: ${data.lesionStatus || ""}. 
    `
              : ``
          }${
            data.doublingtimedate1 && data.doublingtimedate2
              ? `
        Doubling time is estimated to be ${data.doublingtimedate1}${data.doublingtimedate2} days.
        `
              : ``
          }</p>`
        : ``
    }`;

    result += `<span><span>${side === "Right" ? "R" : "L"}${
      index + 1
    }:</span><br />
<span>Size: ${data.sizec} mm (previously: ${data.sizep} mm)</span><br />
<span>Volume: ${data.volumec} mm³ (previously: ${data.volumep} mm³)</span><br />
<span>Speed of sound: ${data.speedc} m/s (previously: ${
      data.speedp
    } m/s)</span><br />
<span>Location: ${currentLoc}, P${
      data.locationcposition
    } (previously: ${prevLoc}, P${
      data.locationpposition
    })</span><br /><br /></span>`;
  });

  return result.trim();
}
