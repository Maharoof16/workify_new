"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash, X } from "lucide-react";

export interface OptionItem {
  label: string;
  value: string;
}
interface OptionsEditorProps {
  value: OptionItem[];
  onChange: (value: OptionItem[]) => void;
  disabled:boolean;
}

export function OptionsEditor({ value, onChange,disabled }: OptionsEditorProps) {
  const addOption = () => {
     if (disabled) return;
    onChange([...value, { label: "", value: "" }]);
  };

  const updateOption = (index: number, label: string) => {
     if (disabled) return;
    onChange(
      value.map((opt, i) =>
        i === index ? { ...opt, label, value: label } : opt,
      ),
    );
  };

  const removeOption = (index: number) => {
     if (disabled) return;
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      {value.map((opt, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <Input
            placeholder="Label"
            value={opt.label}
            onChange={(e) => updateOption(idx, e.target.value)}
            disabled={disabled}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => removeOption(idx)}
            disabled={disabled}
          >
            <Trash className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline"  disabled={disabled} onClick={addOption}>
        <Plus />
        Add option
      </Button>
    </div>
  );
}
