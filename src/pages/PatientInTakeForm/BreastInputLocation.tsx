
import { Checkbox2 } from "@/components/ui/CustomComponents/checkbox2";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import LabeledRadioWithOptionalInput from "@/components/ui/CustomComponents/LabeledRadioWithOptionalInput";


type Props = {
  label: string;
  checkStatusQId: number;
  RQID: number;
  LQID: number;
  SDate: any;
  SDateRight: any;
  data: any;
  setData: any;
  Location: any;
  LocationRight: any;
  OtherInputQId?: number;
  // Adding Size to props for consistency, even if not directly used by default in BreastInputLocation
  Size?: any;
  patientData?: any;
  setPatientData?: any;
  technician?: boolean;
  editStatus?: boolean;
};

const BreastInputLocation: React.FC<Props> = (Props) => {

  const getAnswerByQuestionId = (questionId: any) => {
    if(Props.editStatus) {
      const result = Props.patientData.find(
      (item: any) => item.questionId === questionId
    );
    return result?.answer ?? ""; // Return empty string if not found
    }
    else {
      const result = Props.data.find(
      (item: any) => item.questionId === questionId
    );
    return result?.answer ?? ""; // Return empty string if not found
    }
    
  };
 
  const updateAnswer = (questionId: number, newAnswer: string) => {
    if(Props.editStatus) {
      Props.setPatientData((prevData: any[]) =>
      prevData.map((item) =>
        item.questionId === questionId ? { ...item, answer: newAnswer } : item
      )
    );
    }
    else {
       Props.setData((prevData: any[]) =>
      prevData.map((item) =>
        item.questionId === questionId ? { ...item, answer: newAnswer } : item
      )
    );
    }
  };

  return (
    <div className="flex items-center justify-center flex-row lg:flex-col gap-6">
      <div className="w-full flex flex-col lg:flex-row items-center lg:space-x-2">
        <div className="flex justify-start flex-row w-[100%] lg:w-[25%] items-center space-x-2">
          <Checkbox2
            checked={getAnswerByQuestionId(Props.checkStatusQId) === "true"}
            onClick={() => {
              updateAnswer(
                Props.checkStatusQId,
                getAnswerByQuestionId(Props.checkStatusQId) === "true"
                  ? "false"
                  : "true"
              );
              if (getAnswerByQuestionId(Props.checkStatusQId) === "true") {
                updateAnswer(Props.LQID, "");
                updateAnswer(Props.RQID, "");
                updateAnswer(Props.SDate, "");
                updateAnswer(Props.Location, ""); // Clear Location as well
                if (Props.OtherInputQId) {
                  updateAnswer(Props.OtherInputQId, ""); // Clear OtherInput if it exists
                }
              }
            }}
          />
          <Label className="font-semibold text-base">{Props.label}</Label>
        </div>
        {getAnswerByQuestionId(Props.checkStatusQId) === "true" && (
          <div className="h-full w-full space-y-2">
            <div>
              <LabeledRadioWithOptionalInput
              name="wwwww"
                label="Location"
                questionId={Props.Location}
                formData={Props.data}
                handleInputChange={updateAnswer}
                options={[
                  { label: "Axillary(Armpit)", value: "Axillary(Armpit)" },
                  {
                    label: "In-Between(Chest Bone)",
                    value: "In-Between(Chest Bone)",
                  },
                  {
                    label: "Other",
                    value: "Other",
                  }
                ]}
                optionalInputQuestionId={Props.LocationRight}
                showInputWhenValue="Other"
              />
            </div>

            {/* Other Input */}
            {!Props.technician && Props.OtherInputQId && (
              <div className="flex gap-2 mt-4 w-1/2">
                <Textarea
                  placeholder="Additional Comments"
                  value={getAnswerByQuestionId(Props.OtherInputQId)}
                  onChange={(e) =>
                    updateAnswer(Props.OtherInputQId!, e.target.value)
                  }
                  className="w-full"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BreastInputLocation;