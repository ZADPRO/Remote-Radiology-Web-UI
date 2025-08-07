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
    fibronodulardensitystr: number;
    fibronodulardensityDatar: number;
    multipleCystsstr: number;
    multipleCystsDatar: number;
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
                // Name/label
                const namePart = isOther ? data.name?.toLowerCase() : label;

                // Location
                let locationText = "";
                if (data.locationclockposition && data.locationclockposition !== "unknown") {
                    locationText = data.locationclockposition === "0"
                        ? "Nipple"
                        : `${data.locationclockposition} o'clock`;
                }

                // Level
                let levelText = "";
                if (data.locationLevel && data.locationLevel !== "unknown") {
                    levelText = data.locationLevel === "Coronal Level"
                        ? "P"
                        : data.locationLevel === "Axial"
                            ? "S"
                            : data.locationLevel === "Sagital"
                                ? "M"
                                : "";
                }

                let sentence = `<span>There is a ${namePart ?? "lesion"}`;

                // Add location if available
                if (locationText) {
                    sentence += ` present at ${locationText}`;
                }

                // Add level/percentage if available and not unknown
                if (levelText && data.locationLevelPercentage && data.locationLevel !== "unknown") {
                    sentence += `, located at ${levelText}${data.locationLevelPercentage}`;
                } else if (levelText && data.locationLevel !== "unknown") {
                    sentence += `, located at ${levelText}`;
                } else if (data.locationLevelPercentage) {
                    sentence += `, located at ${data.locationLevelPercentage}`;
                }

                // Distance from nipple
                if (data.distancenipple) {
                    sentence += `, approximately ${data.distancenipple} cm from the nipple`;
                }

                // Size
                if (data.sizew && data.sizel && data.sizeh) {
                    sentence += `. The lesion is ${data.sizew} mm (width) × ${data.sizel} mm (length) × ${data.sizeh} mm (height) in size`;
                }

                // Shape
                if (data.Shape && data.Shape !== "unknown") {
                    sentence += `, ${data.Shape.toLowerCase()} shaped`;
                }

                // Appearance
                if (data.Appearance && data.Appearance !== "unknown") {
                    sentence += `, ${data.Appearance.toLowerCase()} in appearance`;
                }

                // Margins
                if (data.Margins && data.Margins !== "unknown") {
                    sentence += `, with ${data.Margins.toLowerCase()} margins`;
                }

                // Density/Echotexture
                if (data.density && data.density !== "unknown") {
                    sentence += ` and ${data.density.toLowerCase()} echotexture`;
                }

                // Transmission speed
                if (data.Transmissionspped) {
                    sentence += `. Transmission speed is measured at ${data.Transmissionspped} m/s`;
                }

                // Internal debris
                if (data.debris && data.debris !== "not present") {
                    sentence += `. Internal debris: ${data.debris}`;
                }

                // Volume
                if (data.Volumne) {
                    sentence += `. Volume is ${data.Volumne} cubic mm`;
                }

                sentence += ".</span><br /><br />";
                html += sentence;
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

    if (getAnswer(questionIds.fibronodulardensitystr) === "Present") {
        finalHTML += createHTMLFromData("fibronodular density", getAnswer(questionIds.fibronodulardensityDatar));
    }

    if (getAnswer(questionIds.multipleCystsstr) === "Present") {
        finalHTML += createHTMLFromData("multiple cysts", getAnswer(questionIds.multipleCystsDatar));
    }

    if (getAnswer(questionIds.Otherstr) === "Present") {
        finalHTML += createHTMLFromData("", getAnswer(questionIds.OtherDatar), true);
    }

    return finalHTML.trim();
}
