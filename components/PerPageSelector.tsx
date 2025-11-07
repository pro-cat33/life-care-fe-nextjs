"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PerPageSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

export function PerPageSelector({ value, onChange }: PerPageSelectorProps) {
  const options = [10, 20, 30, 50, 100];

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs md:text-sm text-gray-600">表示件数:</span>
      <Select
        value={value.toString()}
        onValueChange={(val) => onChange(Number(val))}
      >
        <SelectTrigger className="w-20 md:w-[100px] text-xs md:text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option.toString()}>
              {option}件
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
