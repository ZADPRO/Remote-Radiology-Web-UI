import React, { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import FormHeader from "../FormHeader";
import MultiOptionRadioGroup from "@/components/ui/CustomComponents/MultiOptionRadioGroup";
import DatePicker from "@/components/date-picker";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ValidatedSelect from "../../../components/ui/CustomComponents/ValidatedSelect";
import { IntakeOption } from "../MainInTakeForm";

interface QuestionIds {
  fullName: number;
  dob: number;
  phone: number;
  email: number;
  age: number;
  gender: number;
  weight: number;
  weightType: number;
  braSize: number;
  pregnant: number;
  eligible: number;
  reason: number;
}

interface Props {
  formData: IntakeOption[];
  handleInputChange: (questionId: number, value: string) => void;
  questionIds: QuestionIds;
}

const PersonalInformation: React.FC<Props> = ({
  formData,
  handleInputChange,
  questionIds,
}) => {
  const getAnswer = (id: number) =>
    formData.find((q) => q.questionId === id)?.answer || "";

  const braSizeOptions = [
    { label: "A", value: "A" },
    { label: "B", value: "B" },
    { label: "C", value: "C" },
    { label: "D", value: "D" },
    { label: "DD", value: "DD" },
    { label: "DDD", value: "DDD" },
    { label: "F", value: "F" },
    { label: "G", value: "G" },
    { label: "H", value: "H" },
  ];

  useEffect(() => {
    const ageStr = getAnswer(questionIds.age);
    const weightStr = getAnswer(questionIds.weight);
    const weightType = getAnswer(questionIds.weightType); // e.g., 'kg' or 'lbs'
    const pregnantLactating = getAnswer(questionIds.pregnant);
    const currentEligibility = getAnswer(questionIds.eligible);

    // Early return if any required field is missing
    if (!ageStr || !weightStr || !pregnantLactating || !weightType) {
      return;
    }

    const age = parseInt(ageStr, 10);
    let weight = parseFloat(weightStr); // Use 'let' because we might convert it

    let isEligible = true;

    if (isNaN(age) || age < 18) {
      isEligible = false;
    }

    // Convert weight to pounds (lbs) if it's in kilograms
    if (weightType === "kg") {
      // If the input weight is in kilograms, convert it to lbs for consistent comparison
      weight = weight * 2.20462; // 1 kg = 2.20462 lbs
    }

    // Now compare the weight against the pounds (lbs) threshold
    const MAX_WEIGHT_LBS = 350; // The original threshold for lbs

    if (isNaN(weight) || weight >= MAX_WEIGHT_LBS) {
      isEligible = false;
    }

    if (pregnantLactating !== "No") {
      isEligible = false;
    }

    const braSizeCondition =
      braSizeOptions.findIndex(
        (option) => option.value === getAnswer(questionIds.braSize)
      ) >= braSizeOptions.findIndex((option) => option.value === "DDD");

    if (braSizeCondition) {
      isEligible = false;
    }

    const newEligibilityStatus = isEligible ? "YES" : "NO";
    if (currentEligibility !== newEligibilityStatus) {
      handleInputChange(questionIds.eligible, newEligibilityStatus);
    }
  }, [
    getAnswer(questionIds.age),
    getAnswer(questionIds.weight),
    getAnswer(questionIds.weightType), // Add weightType to dependencies
    getAnswer(questionIds.pregnant),
    getAnswer(questionIds.eligible),
    questionIds,
    handleInputChange,
  ]);

  console.log(formData);

  return (
    <div className="flex flex-col h-full relative">
      <FormHeader FormTitle="Personal Information" className="uppercase" />

      <div className="flex-grow overflow-y-auto px-5 py-10 lg:pt-0 lg:px-20 space-y-6 pb-10">
        {/* Row 1 */}
        <div className="flex flex-col sm:flex-row gap-5 sm:gap-40">
          <div className="w-full lg:w-1/3 flex flex-col gap-2">
            <Label
              htmlFor="full-name"
              className="font-semibold text-base flex flex-wrap gap-1"
            >
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="full-name"
              placeholder="Name"
              value={getAnswer(questionIds.fullName)}
              onChange={(e) =>
                handleInputChange(questionIds.fullName, e.target.value)
              }
              required
            />
          </div>

          <div className="w-full lg:w-1/3 flex flex-col gap-2">
            <Label
              htmlFor="dob"
              className="font-semibold text-base flex flex-wrap gap-1"
            >
              Date of Birth <span className="text-red-500">*</span>
            </Label>
            <DatePicker
              value={
                getAnswer(questionIds.dob)
                  ? new Date(getAnswer(questionIds.dob))
                  : undefined
              }
              onChange={(val) =>
                handleInputChange(
                  questionIds.dob,
                  val?.toLocaleDateString("en-CA") || ""
                )
              }
              required
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex flex-col sm:flex-row gap-5 sm:gap-40">
          <div className="w-full lg:w-1/3 flex flex-col gap-2">
            <Label
              htmlFor="phone"
              className="font-semibold text-base flex flex-wrap gap-1"
            >
              Phone Number <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-2">
              {/* <ValidatedSelect
  label="Country Code"
  questionId={questionIds.phoneCountryCode}
  formData={formData}
  handleInputChange={handleInputChange}
  options={[
    { label: "+1", value: "+1" },
  ]}
  required
  placeholder="Country Code"
/>
 */}

              <Input
                id="phone"
                placeholder="Phone Number"
                value={getAnswer(questionIds.phone)}
                onChange={(e) =>
                  handleInputChange(questionIds.phone, e.target.value)
                }
                required
              />
            </div>
          </div>

          <div className="w-full lg:w-1/3 flex flex-col">
            <Label
              htmlFor="email"
              className="font-semibold text-base flex flex-wrap gap-1"
            >
              Email ID <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              placeholder="Email ID"
              className="mt-2"
              value={getAnswer(questionIds.email)}
              onChange={(e) =>
                handleInputChange(questionIds.email, e.target.value)
              }
              required
            />
          </div>
        </div>

        {/* Row 3 */}
        <div className="flex flex-col sm:flex-row gap-5 sm:gap-40">
          <div className="w-full lg:w-1/3 flex flex-col">
            <Label
              htmlFor="age"
              className="font-semibold text-base flex flex-wrap gap-1"
            >
              Age <span className="text-red-500">*</span>
              <span className="text-xs text-muted-foreground font-normal">
                (If &lt; 18 yrs – Scan is contraindicated)
              </span>
            </Label>
            <Input
              id="age"
              placeholder="Age"
              className="mt-2"
              value={getAnswer(questionIds.age)}
              onChange={(e) =>
                handleInputChange(questionIds.age, e.target.value)
              }
              required
            />
          </div>

          <div className="w-full lg:w-1/3 flex flex-col">
            <MultiOptionRadioGroup
              label="Gender"
              required
              questionId={questionIds.gender}
              formData={formData}
              handleInputChange={handleInputChange}
              options={[{ label: "Female", value: "female" }]}
            />
          </div>
        </div>

        {/* Row 4 */}
        <div className="flex flex-col sm:flex-row gap-5 sm:gap-40">
          <div className="w-full lg:w-1/3 flex gap-2 flex-col">
            <Label
              htmlFor="weight"
              className="font-semibold text-base flex flex-col items-start gap-1"
            >
              <div className="flex items-center gap-1">
                Weight <span className="text-red-500">*</span>
              </div>
              <span className="text-xs text-muted-foreground font-normal">
                (If more than 350 lbs - Scan is contraindicated)
              </span>
            </Label>
            <div className="flex gap-2">
              <Input
                id="weight"
                placeholder="Weight"
                value={getAnswer(questionIds.weight)}
                onChange={(e) =>
                  handleInputChange(questionIds.weight, e.target.value)
                }
                required
              />
              <Select
                value={getAnswer(questionIds.weightType)}
                onValueChange={(value) =>
                  handleInputChange(questionIds.weightType, value)
                }
              >
                <SelectTrigger className="w-[80px] bg-white text-sm">
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="lbs">lbs</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="w-full lg:w-1/3 flex flex-col gap-2">
            <Label
              htmlFor="bra-size"
              className="font-semibold text-base flex flex-col items-start gap-1"
            >
              <div className="flex items-center gap-1">
                Bra Size <span className="text-red-500">*</span>
              </div>
              <span className="text-xs text-muted-foreground font-normal">
                (If &gt; DDD – Scan is contraindicated)
              </span>
            </Label>

            <ValidatedSelect
              questionId={questionIds.braSize}
              formData={formData}
              handleInputChange={handleInputChange}
              options={braSizeOptions}
              required
              placeholder="Cup Size"
            />
          </div>
        </div>

        {/* Row 5 */}
        <div className="flex flex-col sm:flex-row gap-5 sm:gap-40">
          <div className="w-full lg:w-1/3 flex flex-col">
            <MultiOptionRadioGroup
              label="Currently Pregnant/Lactating"
              required
              description="If Yes - Scan is contraindicated"
              questionId={questionIds.pregnant}
              formData={formData}
              handleInputChange={handleInputChange}
              options={[
                { label: "No", value: "No" },
                { label: "Yes", value: "Yes" },
              ]}
            />
          </div>

          <div className="w-full lg:w-1/3 flex flex-col">
            <Label htmlFor="reason" className="font-semibold text-base">
              Reason for Having This QT Scan
              <span className="text-red-500 ">*</span>
            </Label>
            <Textarea
              id="reason"
              placeholder="Reason..."
              className="mt-2"
              value={getAnswer(questionIds.reason)}
              onChange={(e) =>
                handleInputChange(questionIds.reason, e.target.value)
              }
              required
            />
          </div>
        </div>

        {/* Row 6 */}
        {getAnswer(questionIds.eligible) != "" && (
          <div className="flex flex-col">
            <Label className="text-base font-medium mb-2">
              Scan Eligibility
            </Label>
            <div
              className={`px-6 py-3 rounded-lg w-fit text-base font-semibold border shadow-sm ${
                getAnswer(questionIds.eligible) === "YES"
                  ? "border-green-500 text-green-700 bg-green-100"
                  : "border-red-500 text-red-700 bg-red-100"
              }`}
            >
              {getAnswer(questionIds.eligible) === "YES"
                ? "Eligible"
                : "Not Eligible"}
            </div>
          </div>
        )}
      </div>

      {/* Note */}
      {getAnswer(questionIds.eligible) === "NO" && (
        <div className="flex items-start justify-center mt-2 px-3 py-2 rounded-md">
          <p className="text-sm">
            <span className="font-semibold text-red-600">Note:</span>{" "}
            <span className="text-gray-800">
              Please contact Center Manager to evaluate your eligibility for the
              scan.
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default PersonalInformation;
