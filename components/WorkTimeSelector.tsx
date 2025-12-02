"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface WorkTimeSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

export function WorkTimeSelector({ value, onChange }: WorkTimeSelectorProps) {
  const options = [
    { index: 0, label: "営業時間"},
    { index: 1, label: ""},
    { index: 2, label: "3時間以上4時間未満" },
    { index: 3, label: "4時間以上5時間未満" },
    { index: 4, label: "5時間以上6時間未満" },
    { index: 5, label: "6時間以上7時間未満" },
    { index: 6, label: "7時間以上8時間未満" },
    { index: 7, label: "8時間以上9時間未満" },
    { index: 8, label: "9時間以上10時間未満" },
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
