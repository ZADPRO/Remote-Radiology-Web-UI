import React from 'react';

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

interface Props {
    reportFormData: ReportQuestion[];
    questionIds: QuestionIds
}
const ComparisonPriorRight: React.FC<Props> = ({
    reportFormData,
    questionIds
}) => {

    const getAnswer = (id: number) =>
        reportFormData.find((q) => q.questionId === id)?.answer || "";


    return (
        <>
            There is a {getAnswer(questionIds.FindingStatus)} finding in the lesion identified as{" "}
            {(() => {
                let dataArray: any[] = [];
                try {
                    const raw = getAnswer(questionIds.LesionCompTable);
                    dataArray = raw ? JSON.parse(raw) : [];
                } catch (err) {
                    console.error("Invalid JSON:", err);
                }

                return dataArray.map((_, index) => (
                    <>
                        {
                            index === dataArray.length - 1 ? (
                                <span>{" "}and R{index + 1}</span>
                            ) : (
                                <span>R{index + 1}{index !== dataArray.length - 2 && ","}{" "}</span>
                            )
                        }
                    </>
                ));
            })()}. Doubling time is estimated to be in the range of {getAnswer(questionIds.doubletimefrom)}-{getAnswer(questionIds.doubletimeto)} days.
            Comparison of current and previous imaging shows the following for Lesion
            <br />
            <br />
            {(() => {
                let dataArray: any[] = [];
                try {
                    const raw = getAnswer(questionIds.LesionCompTable);
                    dataArray = raw ? JSON.parse(raw) : [];
                } catch (err) {
                    console.error("Invalid JSON:", err);
                }

                return dataArray.map((data, index) => (
                    <span>
                        <span>R{index + 1}:</span>
                        <br />
                        <span>Size: {data.sizec} mm (previously: {data.sizep} mm)</span>
                        <br />
                        <span>Volume: {data.volumec} mm³ (previously: {data.volumep} mm³)</span>
                        <br />
                        <span>Shear Wave Speed: {data.speedc} m/s (previously: {data.speedc} m/s)</span>
                        <br />
                        <span>Location: {data.locationcclock === "0" ? "Nipple" : data.locationcclock + "'o Clock"}, P{data.locationcposition} (previously: Location: {data.locationpclock === "0" ? "Nipple" : data.locationpclock + "'o Clock"}, P{data.locationpposition})</span>
                        <br />
                        <br />
                    </span>
                ));
            })()}
        </>
    );
};

export default ComparisonPriorRight;