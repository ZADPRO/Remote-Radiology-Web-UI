import { Checkbox2 } from '@/components/ui/CustomComponents/checkbox2';
import { Label } from '@/components/ui/label';
import React from 'react';

interface IntakeOption {
    questionId: number;
    answer: string;
}

interface QuestionIds {
    breastBiopsy: number;
    left: number;
    right: number;
    benign: number;
    malignant: number;
    reportsAttached: number;
}

interface Props {
    technicianFormData: IntakeOption[];
    handleInputChange: (questionId: number, value: string) => void;
    questionIds: QuestionIds;
}

const BreastBiopsy: React.FC<Props> = ({
    technicianFormData,
    handleInputChange,
    questionIds,
}) => {
    const getAnswer = (id: number) =>
        technicianFormData.find((q) => q.questionId === id)?.answer || "";

    const renderRadioGroup = (
        name: string,
        questionId: number,
        options: string[]
    ) => (
        <div className="flex flex-wrap gap-4">
            {options.map((value) => (
                <div key={value} className="flex items-center space-x-2">
                    <input
                        type="radio"
                        id={`${name}-${value.toLowerCase()}`}
                        name={name}
                        value={value}
                        checked={getAnswer(questionId) === value}
                        onChange={(e) => handleInputChange(questionId, e.target.value)}
                        className="custom-radio"
                    />
                    <Label htmlFor={`${name}-${value.toLowerCase()}`}>{value}</Label>
                </div>
            ))}
        </div>
    );

    const renderCheckbox = (label: string, id: number) => (
        <div className="flex items-center gap-2 w-full sm:w-auto">
            <Checkbox2
                className="bg-white data-[state=checked]:text-[#f9f4ed]"
                checked={getAnswer(id) === "true"}
                onClick={() =>
                    handleInputChange(id, getAnswer(id) === "true" ? "" : "true")
                }
            />
            <div className="text-sm sm:text-base font-medium">{label}</div>
        </div>
    );

    return (
        <div className="flex h-full flex-col gap-6 p-4 sm:p-6 overflow-y-auto">
            <div className="flex flex-col lg:flex-row gap-10">
                {/* Title */}
                <Label className="text-base font-semibold">
                    Breast Biopsy
                </Label>

                {/* Question: Biopsy Yes/No */}
                {renderRadioGroup("breastbiopsy", questionIds.breastBiopsy, ["No", "Yes"])}

                {/* Checkboxes */}
                <div className="flex flex-wrap gap-4">
                    {renderCheckbox("L", questionIds.left)}
                    {renderCheckbox("R", questionIds.right)}
                </div>

                <div className="flex flex-wrap gap-4">
                    {renderCheckbox("Benign", questionIds.benign)}
                    {renderCheckbox("Malignant", questionIds.malignant)}
                </div>

                {/* Reports attached */}
                <div className="flex flex-row gap-2">
                    <Label className="text-base font-semibold">
                        Reports attached:
                    </Label>
                    {renderRadioGroup("reportsattached", questionIds.reportsAttached, ["No", "Yes"])}
                </div>
            </div>
        </div>
    );
};

export default BreastBiopsy;
