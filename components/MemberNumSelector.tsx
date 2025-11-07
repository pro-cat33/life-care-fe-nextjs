"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface MemberNumSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

export function MemberNumSelector({ value, onChange }: MemberNumSelectorProps) {
  const options = [
    { index: 0, label: "定員数"},
    { index: 1, label: ""},
    { index: 2, label: "定員５人以下" },
    { index: 3, label: "定員10人以下"},
    { index: 4, label: "定員６人以上１０人以下" },
    { index: 5, label: "定員11人以上20人以下"},
    { index: 6, label: "定員１１人以上２０人以下" },
    { index: 7, label: "定員21人以上" },
    { index: 8, label: "定員２１人以上３０人以下" },
    { index: 9, label: "定員２１人以上４０人以下" },
    { index: 10, label: "定員３１人以上４０人以下" },
    { index: 11, label: "定員４１人以上５０人以下" },
    { index: 12, label: "定員４１人以上６０人以下" },
    { index: 13, label: "定員５１人以上６０人以下" },
    { index: 14, label: "定員６１人以上７０人以下" },
    { index: 15, label: "定員６１人以上８０人以下" },
    { index: 16, label: "定員７１人以上８０人以下" },
    { index: 17, label: "定員８１人以上" }
  ];

  return (
    <div className="flex items-center gap-2">
      <Select
        value={value.toString()}
        onValueChange={(val) => onChange(Number(val))}
      >
        <SelectTrigger className="w-40 md:w-60 text-xs md:text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={"time"+option.index} value={option.index.toString()}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
