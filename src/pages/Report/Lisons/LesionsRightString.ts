interface ReportQuestion {
    questionId: number;
    answer: string;
}

interface QuestionIds {
    lesionsr: number;
    simplecrstr: number;
    simplecrstDatar: number;
    complexcrstr: number;
    complexcrstDatar: number;
    Heterogeneousstr: number;
    HeterogeneousDatar: number;
    Hypertrophicstr: number;
    HypertrophicDatar: number;
    Otherstr: number;
    OtherDatar: number;
}

export function LesionsRightString(
    reportFormData: ReportQuestion[],
    questionIds: QuestionIds
): string {
    const getAnswer = (id: number) =>
        reportFormData.find((q) => q.questionId === id)?.answer || "";

    if (getAnswer(questionIds.lesionsr) !== "Present") return "";

    const createHTMLFromData = (label: string, raw: string, isOther = false) => {
        let html = "";
        try {
            const dataArray = raw ? JSON.parse(raw) : [];
            dataArray.forEach((data: any) => {
                const location =
                    data.locationclockposition === "0" ? "Nipple" : `${data.locationclockposition}o'clock`;
                const level =
                    data.locationLevel === "Coronal Level"
                        ? "P"
                        : data.locationLevel === "Axial"
                            ? "S"
                            : data.locationLevel === "Sagital"
                                ? "M"
                                : "";

                const namePart = isOther ? `other ( ${data.name} )` : label;

                html += `<span>There is a ${namePart} present at ${location}, located at ${level}${data.locationLevelPercentage}, 
                    approximately ${data.distancenipple} cm from the nipple. The lesion is ${data.sizew} mm (width) × ${data.sizel} mm (length) × ${data.sizeh} mm (height) in size, 
                    ${data.Shape} shaped, ${data.Appearance} apprearance, with ${data.Margins} margins and ${data.density} echotexture. 
                    Transmission speed is measured at ${data.Transmissionspped} m/s. 
                    Internal debris: ${data.debris}. Volume is ${data.Volumne} cubic mm.
                </span><br /><br />`;
            });
        } catch (err) {
            console.error("Invalid JSON:", err);
        }
        return html;
    };

    let finalHTML = "";

    if (getAnswer(questionIds.simplecrstr) === "Present") {
        finalHTML += createHTMLFromData("simple cyst", getAnswer(questionIds.simplecrstDatar));
    }

    if (getAnswer(questionIds.complexcrstr) === "Present") {
        finalHTML += createHTMLFromData("complex cystic structure", getAnswer(questionIds.complexcrstDatar));
    }

    if (getAnswer(questionIds.Heterogeneousstr) === "Present") {
        finalHTML += createHTMLFromData("heterogeneous tissue prominence", getAnswer(questionIds.HeterogeneousDatar));
    }

    if (getAnswer(questionIds.Hypertrophicstr) === "Present") {
        finalHTML += createHTMLFromData("hypertrophic tissue with microcysts", getAnswer(questionIds.HypertrophicDatar));
    }

    if (getAnswer(questionIds.Otherstr) === "Present") {
        finalHTML += createHTMLFromData("", getAnswer(questionIds.OtherDatar), true);
    }

    return finalHTML.trim();
}
