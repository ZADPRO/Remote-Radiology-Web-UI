import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import TextEditor from "@/components/TextEditor";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface Props {
  patientConsent: string;
  setPatientConsent: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: () => void;
}

const WGConsentForm: React.FC<Props> = ({ patientConsent, setPatientConsent, onSubmit }) => {
  const [preview, setPreview] = useState(false);

  console.log(patientConsent)
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 justify-end">
        <Switch id="preview" checked={preview} onCheckedChange={setPreview} />
        <Label htmlFor="preview">Preview</Label>
      </div>

      {preview ? (
        <div className="h-[70vh]">
        <div
          className="ql-editor border-2 border-gray-300 rounded-2xl shadow-2xl p-5"
          dangerouslySetInnerHTML={{ __html: patientConsent }}
        />
        </div>
      ) : (
        <div className="space-y-2">
          <TextEditor
            value={patientConsent}
            onChange={(value) => setPatientConsent(value)}
            height="55vh"
          />

          <div className="flex justify-end">
            <Button variant="greenTheme" onClick={onSubmit}>Save</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WGConsentForm;