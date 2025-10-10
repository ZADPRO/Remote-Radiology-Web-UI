import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface Entry {
  clock: string;
  level: string;
}

interface Props {
  title: string;
  data: Entry[];
  onChange: (index: number, field: keyof Entry, value: string) => void;
  onDelete: (index: number) => void;
  onAdd: () => void;
}

export const CalcificationInputGroup: React.FC<Props> = ({
  title,
  data,
  onChange,
  onDelete,
  onAdd,
}) => {
  return (
    <div className="space-y-2 bg-red-100 p-4 rounded">
      <label className="text-base font-semibold">{title}</label>
      {data.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <span className="text-sm font-medium">{index + 1}. {title} at</span>

          <Input
            className="w-16"
            value={entry.clock}
            onChange={(e) => onChange(index, "clock", e.target.value)}
            placeholder="12"
          />

          <span className="text-sm">o'clock, level</span>

          <Input
            className="w-16"
            value={entry.level}
            onChange={(e) => onChange(index, "level", e.target.value)}
            placeholder="179"
          />

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(index)}
            className="text-red-500 hover:bg-red-200"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={onAdd}>
        + Add Entry
      </Button>
    </div>
  );
};
