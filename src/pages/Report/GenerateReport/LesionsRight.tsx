import React from 'react';

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

interface Props {
    reportFormData: ReportQuestion[];
    questionIds: QuestionIds
}
const LesionsRight: React.FC<Props> = ({
    reportFormData,
    questionIds
}) => {

    const getAnswer = (id: number) =>
        reportFormData.find((q) => q.questionId === id)?.answer || "";


    return (
        <>
            {getAnswer(questionIds.lesionsr) === "Present" &&
                (
                    <>
                        {
                            getAnswer(questionIds.simplecrstr) === "Present" &&
                            (() => {
                                let dataArray: any[] = [];
                                try {
                                    const raw = getAnswer(questionIds.simplecrstDatar);
                                    dataArray = raw ? JSON.parse(raw) : [];
                                } catch (err) {
                                    console.error("Invalid JSON:", err);
                                }

                                return dataArray.map((data) => (
                                    <>
                                        <span>
                                            There is a {getAnswer(questionIds.simplecrstr) === "Present" && "simple cyst"} present at
                                            {" "}{data.locationclockposition === "0" ? "Nipple" : data.locationclockposition + "o'clock"}
                                            , located at {data.locationLevel === "Coronal Level" ? "P" : data.locationLevel === "Axial" ? "S" : data.locationLevel === "Sagital" && "M"}{data.locationLevelPercentage}
                                            , approximately {data.distancenipple}
                                            {" "}mm from the nipple. The lesion is {data.size} mm in size
                                            , {data.Shape} shaped, with {data.Margins}
                                            {" "}margins and {data.density} echotexture. Transmission speed is measured at
                                            {" "}{data.Transmissionspped} m/s. Internal debris: {data.debris}. Shadowing: {data.shadowing}.
                                        </span>
                                        <br />
                                        <br />
                                    </>
                                ))
                            })()
                        }

                        {
                            getAnswer(questionIds.complexcrstr) === "Present" &&
                            (() => {
                                let dataArray: any[] = [];
                                try {
                                    const raw = getAnswer(questionIds.complexcrstDatar);
                                    dataArray = raw ? JSON.parse(raw) : [];
                                } catch (err) {
                                    console.error("Invalid JSON:", err);
                                }

                                return dataArray.map((data) => (
                                    <>
                                        <span>
                                            There is a {getAnswer(questionIds.complexcrstr) === "Present" && "complex cystic structure"} present at
                                            {" "}{data.locationclockposition === "0" ? "Nipple" : data.locationclockposition + "o'clock"}
                                            , located at {data.locationLevel === "Coronal Level" ? "P" : data.locationLevel === "Axial" ? "S" : data.locationLevel === "Sagital" && "M"}{data.locationLevelPercentage}
                                            , approximately {data.distancenipple}
                                            {" "}cm from the nipple. The lesion is {data.size} mm in size
                                            , {data.Shape} shaped, with {data.Margins}
                                            {" "}margins and {data.density} echotexture. Transmission speed is measured at
                                            {" "}{data.Transmissionspped} m/s. Internal debris: {data.debris}. Shadowing: {data.shadowing}.
                                        </span>
                                        <br />
                                        <br />
                                    </>
                                ))
                            })()
                        }

                        {
                            getAnswer(questionIds.Heterogeneousstr) === "Present" &&
                            (() => {
                                let dataArray: any[] = [];
                                try {
                                    const raw = getAnswer(questionIds.HeterogeneousDatar);
                                    dataArray = raw ? JSON.parse(raw) : [];
                                } catch (err) {
                                    console.error("Invalid JSON:", err);
                                }

                                return dataArray.map((data) => (
                                    <>
                                        <span>
                                            There is a {getAnswer(questionIds.Heterogeneousstr) === "Present" && "heterogeneous tissue prominence"} present at
                                            {" "}{data.locationclockposition === "0" ? "Nipple" : data.locationclockposition + "o'clock"}
                                            , located at {data.locationLevel === "Coronal Level" ? "P" : data.locationLevel === "Axial" ? "S" : data.locationLevel === "Sagital" && "M"}{data.locationLevelPercentage}
                                            , approximately {data.distancenipple}
                                            {" "}cm from the nipple. The lesion is {data.size} mm in size
                                            , {data.Shape} shaped, with {data.Margins}
                                            {" "}margins and {data.density} echotexture. Transmission speed is measured at
                                            {" "}{data.Transmissionspped} m/s. Internal debris: {data.debris}. Shadowing: {data.shadowing}.
                                        </span>
                                        <br />
                                        <br />
                                    </>
                                ))
                            })()
                        }

                        {
                            getAnswer(questionIds.Hypertrophicstr) === "Present" &&
                            (() => {
                                let dataArray: any[] = [];
                                try {
                                    const raw = getAnswer(questionIds.HypertrophicDatar);
                                    dataArray = raw ? JSON.parse(raw) : [];
                                } catch (err) {
                                    console.error("Invalid JSON:", err);
                                }

                                return dataArray.map((data) => (
                                    <>
                                        <span>
                                            There is a {getAnswer(questionIds.Hypertrophicstr) === "Present" && "hypertrophic tissue with microcysts"} present at
                                            {" "}{data.locationclockposition === "0" ? "Nipple" : data.locationclockposition + "o'clock"}
                                            , located at {data.locationLevel === "Coronal Level" ? "P" : data.locationLevel === "Axial" ? "S" : data.locationLevel === "Sagital" && "M"}{data.locationLevelPercentage}
                                            , approximately {data.distancenipple}
                                            {" "}cm from the nipple. The lesion is {data.size} mm in size
                                            , {data.Shape} shaped, with {data.Margins}
                                            {" "}margins and {data.density} echotexture. Transmission speed is measured at
                                            {" "}{data.Transmissionspped} m/s. Internal debris: {data.debris}. Shadowing: {data.shadowing}.
                                        </span>
                                        <br />
                                        <br />
                                    </>
                                ))
                            })()
                        }

                        {
                            getAnswer(questionIds.Otherstr) === "Present" &&
                            (() => {
                                let dataArray: any[] = [];
                                try {
                                    const raw = getAnswer(questionIds.OtherDatar);
                                    dataArray = raw ? JSON.parse(raw) : [];
                                } catch (err) {
                                    console.error("Invalid JSON:", err);
                                }

                                return dataArray.map((data) => (
                                    <>
                                        <span>
                                            There is a other ( {data.name} ) present at
                                            {" "}{data.locationclockposition === "0" ? "Nipple" : data.locationclockposition + "o'clock"}
                                            , located at {data.locationLevel === "Coronal Level" ? "P" : data.locationLevel === "Axial" ? "S" : data.locationLevel === "Sagital" && "M"}{data.locationLevelPercentage}
                                            , approximately {data.distancenipple}
                                            {" "}cm from the nipple. The lesion is {data.size} mm in size
                                            , {data.Shape} shaped, with {data.Margins}
                                            {" "}margins and {data.density} echotexture. Transmission speed is measured at
                                            {" "}{data.Transmissionspped} m/s. Internal debris: {data.debris}. Shadowing: {data.shadowing}.
                                        </span>
                                        <br />
                                        <br />
                                    </>
                                ))
                            })()
                        }
                    </>
                )
            }
        </>
    );
};

export default LesionsRight;