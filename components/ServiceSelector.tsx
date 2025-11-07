"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ServiceSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

export function ServiceSelector({ value, onChange }: ServiceSelectorProps) {
  const options = [
    { service: 0, label: "生活介護サービス(基本)" },
    { service: 1, label: "生活介護サービス(定超)" },
    { service: 2, label: "生活介護サービス(生活支援員等欠員)" },
    { service: 3, label: "生活介護サービス(サービス管理責任者欠員)" },

    { service: 4, label: "短期入所サービス(基本)" },
    { service: 5, label: "短期入所サービス(定超)" },
    { service: 6, label: "短期入所サービス(従業者)" },

    { service: 7, label: "施設入所支援サービス(基本)" },
    { service: 8, label: "施設入所支援サービス(定超)" },

    { service: 9, label: "就労移行支援サービス(基本)" },
    { service: 10, label: "就労移行支援サービス(定超)" },
    { service: 11, label: "就労移行支援サービス(職業指導員等欠員)" },
    { service: 12, label: "就労移行支援サービス(管理責任者欠員)" },

    { service: 13, label: "就労継続支援Ｂ型サービス(基本)" },
    { service: 14, label: "就労継続支援Ｂ型サービス(定超)" },
    { service: 15, label: "就労継続支援Ｂ型サービス(生活支援員等欠員)" },
    { service: 16, label: "就労継続支援Ｂ型サービス(管理責任者欠員)" },

    { service: 17, label: "放課後等デイサービス(基本)" },
    { service: 18, label: "放課後等デイサービス(定超)" },
    { service: 19, label: "放課後等デイサービス(人欠)" },
    { service: 20, label: "放課後等デイサービス(責欠)" },

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
            <SelectItem key={"service"+option.service} value={option.service.toString()}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
