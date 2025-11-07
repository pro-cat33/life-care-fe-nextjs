"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CategorySelectorProps {
  value: number;
  onChange: (value: number) => void;
}

export function CategorySelector({ value, onChange }: CategorySelectorProps) {
  const options = [
    { index: 0, label: "区  分"},
    { index: 1, label: ""},
    { index: 2, label: "（一）区分６" },
    { index: 3, label: "（二）区分５" },
    { index: 4, label: "（三）区分４" },
    { index: 5, label: "（四）区分３" },
    { index: 6, label: "（五）区分２以下" }
  ];

  return (
    <div className="flex items-center gap-2">
      <Select
        value={value.toString()}
        onValueChange={(val) => onChange(Number(val))}
      >
        <SelectTrigger className="w-28 md:w-40 text-xs md:text-sm">
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
