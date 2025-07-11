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
): string {
    console.log("Value Hitting __________________________________________")
    const getAnswer = (id: number) =>
        reportFormData.find((q) => q.questionId === id)?.answer || "";

    // ✅ Check if QuestionId 52 is "Present"
    const isComparisonPresent = getAnswer(52);
    if (isComparisonPresent !== "Present") {
        return ""; // 🛑 Skip rendering if not Present
    }

    let result = "";

    const findingStatus = getAnswer(questionIds.FindingStatus);
    const timeFrom = getAnswer(questionIds.doubletimefrom);
    const timeTo = getAnswer(questionIds.doubletimeto);

    let dataArray: any[] = [];
    try {
        const raw = getAnswer(questionIds.LesionCompTable);
        dataArray = raw ? JSON.parse(raw) : [];
    } catch (err) {
        console.error("Invalid JSON:", err);
    }

    let lesionRefs = dataArray.map((_, index) => {
        const ref = `${side === "Right"? "R" : "L"}${index + 1}`;
        if (index === dataArray.length - 1) {
            return `and ${ref}`;
        } else if (index === dataArray.length - 2) {
            return `${ref} `;
        } else {
            return `${ref}, `;
        }
    }).join("");

    result += `<span>There is a ${findingStatus} finding in the lesion identified as ${lesionRefs.trim()}. Doubling time is estimated to be in the range of ${timeFrom}-${timeTo} days. Comparison of current and previous imaging shows the following for Lesion</span><br /><br />`;

    dataArray.forEach((data: any, index: number) => {
        const currentLoc = data.locationcclock === "0" ? "Nipple" : `${data.locationcclock}'o Clock`;
        const prevLoc = data.locationpclock === "0" ? "Nipple" : `${data.locationpclock}'o Clock`;

        result += `<span><span>${side === "Right"? "R" : "L"}${index + 1}:</span><br />
<span>Size: ${data.sizec} mm (previously: ${data.sizep} mm)</span><br />
<span>Volume: ${data.volumec} mm³ (previously: ${data.volumep} mm³)</span><br />
<span>Shear Wave Speed: ${data.speedc} m/s (previously: ${data.speedp} m/s)</span><br />
<span>Location: ${currentLoc}, P${data.locationcposition} (previously: ${prevLoc}, P${data.locationpposition})</span><br /><br /></span>`;
    });

    return result.trim();
}
