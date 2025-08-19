import TextEditor from "@/components/TextEditor";
import { Label } from "@/components/ui/label";
import React from "react";

interface Props {
    patientHistoryNotes: string;
    setPatientHistoryNotes: (value: string) => void;
}

const PatientHistory: React.FC<Props> = ({patientHistoryNotes, setPatientHistoryNotes}) => {
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
          {/* {syncStatus.breastImplantRight ? (
              <Button
                className="bg-[#a4b2a1] hover:bg-[#a4b2a1] h-[20px] w-[60px] text-sm"
                onClick={() => {
                  setsyncStatus({ ...syncStatus, breastImplantRight: false });
                }}
              >
                Unsync
              </Button>
            ) : (
              <Button
                className="bg-[#a4b2a1] hover:bg-[#a4b2a1] h-[20px] w-[60px] text-sm"
                onClick={() => {
                  setsyncStatus({ ...syncStatus, breastImplantRight: true });
                }}
              >
                Sync
              </Button>
            )} */}
        </div>
        <TextEditor
          value={patientHistoryNotes}
          onChange={setPatientHistoryNotes}
          // readOnly
          // onManualEdit={() => {
          //   if (syncStatus.sForm) {
          //     setsyncStatus({
          //       ...syncStatus,
          //       sForm: false,
          //     });
          //   }
          // }}
        />
      </div>
    </div>
  );
};

export default PatientHistory;
