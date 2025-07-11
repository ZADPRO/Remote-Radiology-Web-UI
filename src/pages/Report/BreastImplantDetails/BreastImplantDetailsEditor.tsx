import React from "react";
import { ReportQuestion } from "../Report";

interface QuestionIds {
  breastImplants: number;
  implantConfiguration: number;
  implantPositon: number;
  implantMaterial: number;
  displacement: number;
  contracture: number;
  contractureSev: number;
  contractureSide: number;
  rupture: number;
  ruptureLocation: number;
  ruptureSigns: number;
  ruptureSignsOther: number;
  ruptureType: number;
}

interface Props {
  reportFormData: ReportQuestion[];
  questionIds: QuestionIds;
}

const BreastImplantDetailsEditor: React.FC<Props> = ({
  reportFormData,
  questionIds,
}) => {
  const getAnswer = (id: number) =>
    reportFormData.find((q) => q.questionId === id)?.answer || "";

  const breastImplants = getAnswer(questionIds.breastImplants);

  if (breastImplants === "Absent") {
    return (
      <span>
        Absent: The QT scan shows no Breast Implants.
      </span>
    );
  }

  // Answers
  const config = getAnswer(questionIds.implantConfiguration);
  const position = getAnswer(questionIds.implantPositon);
  const material = getAnswer(questionIds.implantMaterial);
  const displacement = getAnswer(questionIds.displacement);
  const contracture = getAnswer(questionIds.contracture);
  const contractureSide = getAnswer(questionIds.contractureSide);
  const rupture = getAnswer(questionIds.rupture);
  const ruptureLocation = getAnswer(questionIds.ruptureLocation);
  const ruptureSigns = getAnswer(questionIds.ruptureSigns);
  const ruptureSignsOther = getAnswer(questionIds.ruptureSignsOther);
  const ruptureType = getAnswer(questionIds.ruptureType);

  // Combine rupture signs with optional input
  const fullRuptureSigns =
    ruptureSigns === "Other" && ruptureSignsOther
      ? `${ruptureSigns} - ${ruptureSignsOther}`
      : ruptureSigns;

  return (
      <span>
        Present: The QT scan shows{" "}
        <span className="font-semibold">{config}</span> implant/implants
        {["Bilateral Similar", "Bilateral Dissimilar"].includes(config) && "s"}{" "}
        with <span className="font-semibold">{position}</span> in position, with
        speed of sound consistent with{" "}
        <span className="font-semibold">{material}</span>.{" "}
        {displacement.length > 0 && (
        displacement != "None" ? (
          <>
            The displacement is noted in{" "}
            <span className="font-semibold">
              {displacement === "Both" ? "both sides" : `${displacement} side`}
            </span>
            .{" "}
          </>
        ) : (
            <>The displacement is not noted.</>
        )
    )}
        {contracture === "Present" && (
          <>
            There is contracture noted on{" "}
            <span className="font-semibold">{contractureSide}</span>.{" "}
          </>
        )}
        {rupture === "Present" && (
          <>
            There is a rupture in{" "}
            <span className="font-semibold">{ruptureLocation}</span> with{" "}
            <span className="font-semibold">{fullRuptureSigns}</span> of{" "}
            <span className="font-semibold">{ruptureType}</span> type.
          </>
        )}
      </span>
  );
};

export default BreastImplantDetailsEditor;