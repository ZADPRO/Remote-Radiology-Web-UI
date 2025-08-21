import TextEditor from "@/components/TextEditor";
import { Label } from "@/components/ui/label";
import React from "react";
import { ChangedOneState } from "./Report";

interface Props {
  changedOne: ChangedOneState;
  setChangedOne: React.Dispatch<React.SetStateAction<ChangedOneState>>;
  patientHistoryNotes: string;
  setPatientHistoryNotes: (value: string) => void;
}

const PatientHistory: React.FC<Props> = ({
  changedOne,
  setChangedOne,
  patientHistoryNotes,
  setPatientHistoryNotes,
}) => {
  return (
    <div className="w-full">
      <Label
        className="font-semibold text-2xl flex flex-wrap lg:items-center"
        style={{ wordSpacing: "0.2em" }}
      >
        A. PATIENT HISTORY
      </Label>

      <div className="w-full lg:w-[90%] mx-auto  rounded-2xl text-lg p-4 leading-7">
        <div className="flex justify-between mb-2">
          <span className="text-2xl">Report Preview</span>
        </div>
        <TextEditor
          value={patientHistoryNotes}
          onChange={setPatientHistoryNotes}
          readOnly={false}
          onManualEdit={() => {
            setChangedOne({
              ...changedOne,
              patienthistory: true,
            });
            // if (syncStatus.sForm) {
            //   setsyncStatus({
            //     ...syncStatus,
            //     sForm: false,
            //   });
            // }
          }}
        />
      </div>
    </div>
  );
};

export default PatientHistory;
