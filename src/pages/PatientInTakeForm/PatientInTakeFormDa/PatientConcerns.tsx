import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import FormHeader from "../FormHeader";
import TwoOptionRadioGroup from "@/components/ui/CustomComponents/TwoOptionRadioGroup";
import { IntakeOption } from "../PatientInTakeForm";

interface QuestionIds {
    anxiety: number;
    support: number;
    concerns: number;
}

interface Props {
    formData: IntakeOption[];
    handleInputChange: (questionId: number, value: string) => void;
    questionIds: QuestionIds;
}

const PatientConcerns: React.FC<Props> = ({
    formData,
    handleInputChange,
    questionIds,
}) => {
    const getAnswer = (id: number) =>
        formData.find((q) => q.questionId === id)?.answer || "";

    return (
        <div className="flex flex-col h-full">
            <FormHeader FormTitle="PATIENT CONCERNS" className="uppercase" />


            <div className="flex-grow overflow-y-auto px-5 py-10 lg:pt-0 lg:px-20 space-y-6 pb-10">

                {/* A. Level of anxiety about finding */}
                <TwoOptionRadioGroup
                    label="A. Level of anxiety about finding"
                    questionId={questionIds.anxiety}
                    formData={formData}
                    handleInputChange={handleInputChange}
                    className="flex flex-col lg:flex-row gap-3 mt-4"
                    options={[
                        { label: "None", value: "None" },
                        { label: "Low", value: "Low" },
                        { label: "Medium", value: "Medium" },
                        { label: "High", value: "High" },
                    ]}
                />

                {/* B. Interest in support resources */}
                <TwoOptionRadioGroup
                    label="B. Interest in support resources"
                    questionId={questionIds.support}
                    formData={formData}
                    handleInputChange={handleInputChange}
                    options={[
                        { label: "No", value: "No" },
                        { label: "Yes", value: "Yes" }
                    ]}
                />

                {/* C. Questions or concerns */}
                <div className="flex flex-col lg:flex-row gap-2 mt-2">
                    <Label className="font-semibold text-base">C. Questions or concerns</Label>
                    <Input
                        className="w-64 ml-4 lg:ml-0"
                        value={getAnswer(questionIds.concerns)}
                        onChange={(e) =>
                            handleInputChange(questionIds.concerns, e.target.value)
                        }
                        placeholder="Specify"
                    />
                </div>

            </div>

        </div>
    );
};

export default PatientConcerns;
