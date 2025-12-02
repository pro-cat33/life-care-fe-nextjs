"use client";
import { useState, useEffect } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface MemberNumSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function MemberNumSelector({ value, onChange }: MemberNumSelectorProps) {
  const [min_member, setMinMember] = useState<{ index: number, label: string }[]>([]);
  const [max_member, setMaxMember] = useState<{ index: number, label: string }[]>([]);
  const [min_val, setMinVal] = useState<number>(0);
  const [max_val, setMaxVal] = useState<number>(0);
  const [cur_max, setCurMax] = useState<number>(0);

  const options1 = [
    { index: 0, label: "・・・" },
    { index: 1, label: "定員１１人以上" },
    { index: 2, label: "定員２１人以上" },
    { index: 3, label: "定員３１人以上" },
    { index: 4, label: "定員４１人以上" },
    { index: 5, label: "定員５１人以上" },
    { index: 6, label: "定員６１人以上" },
    { index: 7, label: "定員７１人以上" },
    { index: 8, label: "定員８１人以上" }
  ];

  const options2 = [
    { index: 0, label: "・・・" },
    { index: 1, label: "定員１０人以下" },
    { index: 2, label: "定員２０人以下" },
    { index: 3, label: "定員３０人以下" },
    { index: 4, label: "定員４０人以下" },
    { index: 5, label: "定員５０人以下" },
    { index: 6, label: "定員６０人以下" },
    { index: 7, label: "定員７０人以下" },
    { index: 8, label: "定員８０人以下" },
  ];

  const onMinMemberChange = (value: number) => {
    setMinVal(value);
    setCurMax(0);
    setMaxVal(0);
  }

  const onMaxMemberChange = (value: number) => {
    setMaxVal(value);
    setCurMax(value);
  }

  useEffect(() => {
    if (min_val == 0 && max_val == 0) {
      setMinMember(options1);
      setMaxMember(options2);
    } else {
      setMaxMember(options2.slice(min_val + 1, options2.length));
    }
    onChange(`${min_val}_${cur_max}`);
  }, [min_val, max_val]);

  return (
    <div className="flex items-center gap-2">
      <Select
        value={min_val.toString()}
        onValueChange={(val) => onMinMemberChange(Number(val))}
      >
        <SelectTrigger className="w-40 md:w-60 text-xs md:text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {min_member.map((option) => (
            <SelectItem key={"member_min" + (option.index)} value={option.index.toString()}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={cur_max.toString()}
        onValueChange={(val) => onMaxMemberChange(Number(val))}
      >
        <SelectTrigger className="w-40 md:w-60 text-xs md:text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {max_member.map((option) => (
            <SelectItem key={"member_max" + option.index.toString()} value={option.index.toString()}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
