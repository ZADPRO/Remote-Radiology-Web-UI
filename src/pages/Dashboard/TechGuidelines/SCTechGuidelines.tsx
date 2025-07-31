import TextEditor from "@/components/TextEditor";
import { Button } from "@/components/ui/button";
import { Checkbox2 } from "@/components/ui/CustomComponents/checkbox2";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import React, { useEffect, useState } from "react";

interface Props {
  defaultCheck: boolean;
  setDefaultCheck: React.Dispatch<React.SetStateAction<boolean>>;
  techGuidelines: string;
  scTechGuidelines: string;
  setScTechGuidelines: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: () => void;
}

const SCTechGuidelines: React.FC<Props> = ({
  defaultCheck,
  setDefaultCheck,
  techGuidelines,
  scTechGuidelines,
  setScTechGuidelines,
  onSubmit,
}) => {
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    setPreview(defaultCheck);
  }, [defaultCheck]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between min-h-5">
        <div className="flex items-center gap-2 justify-end">
          <Checkbox2
            id="Default"
            checked={defaultCheck}
            onCheckedChange={(checked) => {
              setDefaultCheck(checked === true);
              setPreview(checked === true);
            }}
          />
          <Label htmlFor="Default">Default WellthGreen Technologist Guidelines</Label>
        </div>

        {!defaultCheck && (
          <div className="flex items-center gap-2 justify-end">
            <Switch
              id="preview"
              checked={preview}
              onCheckedChange={setPreview}
            />
            <Label htmlFor="preview">Preview</Label>
          </div>
        )}
      </div>

      {preview ? (
        <div className="space-y-2">
          <div className="h-[70vh]">
          <div
            className="ql-editor border-2 border-gray-300 rounded-2xl shadow-2xl p-5"
            dangerouslySetInnerHTML={{
              __html: defaultCheck ? techGuidelines : scTechGuidelines,
            }}
          />
          </div>
          <div className="flex justify-end">
            <Button
              variant="greenTheme"
              onClick={onSubmit}
              hidden={!defaultCheck}
            >
              Save
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <TextEditor
            value={scTechGuidelines}
            onChange={(value) => setScTechGuidelines(value)}
            height="55vh"
          />

          <div className="flex justify-end">
            <Button variant="greenTheme" onClick={onSubmit}>
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SCTechGuidelines;
