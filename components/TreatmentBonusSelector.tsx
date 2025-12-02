"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from './ui/input';
import { bonus_data } from '@/config/constants';

interface TreatmentBonusSelectorProps {
  value: Array<number>;
  onChange: (value: Array<number>) => void;
}

export function TreatmentBonusSelector({ value, onChange }: TreatmentBonusSelectorProps) {
  const onChangeValue = (val: number) => {
    onChange([value[0], val]);
  }

  return (
    <div className='w-full flex gap-4 p-4 md:items-center flex-col md:flex-row items-start'>
      <h2 className="text-md md:text-lg font-bold text-gray-800 whitespace-nowrap">処遇改善加算率:</h2>
      <div className="flex w-full flex-col justify-start gap-2 md:flex-row md:gap-4 md:items-center">
        <Select
          value={bonus_data[value[0]][0].toString()}
          onValueChange={(val) => { onChange([Number(val), 1]) }}
        >
          <SelectTrigger className="w-full md:w-full text-xs md:text-sm border-gray-300 focus:border-blue-300 focus:ring-1 focus:ring-blue-300">
            <SelectValue>{bonus_data[value[0]][0]}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {bonus_data.map((bonus, index) => (
              <SelectItem key={"bonus" + index} value={index.toString()}>
                {bonus[0]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className='w-full flex gap-4 justify-center items-center'>
          <div className='flex gap-2 items-center'>
            <Input type='radio' id='bonus-val-1' name="bonus-val" onChange={() => onChangeValue(Number(bonus_data[value[0]][1]))} checked={value[1] ? value[1] === bonus_data[value[0]][1] : false} />
            <label htmlFor='bonus-val-1'>{bonus_data[value[0]][1]}</label>
          </div>
          <div className='flex gap-2 items-center'>
            <Input type='radio' id='bonus-val-2' name="bonus-val" onChange={() => onChangeValue(Number(bonus_data[value[0]][2]))} checked={value[1] ? value[1] === bonus_data[value[0]][2] : false} />
            <label htmlFor='bonus-val-2'>{bonus_data[value[0]][2] === 0 ? "-" : bonus_data[value[0]][2]}</label>
          </div>
          <div className='flex gap-2 items-center'>
            <Input type='radio' id='bonus-val-3' name="bonus-val" onChange={() => onChangeValue(Number(bonus_data[value[0]][3]))} checked={value[1] ? value[1] === bonus_data[value[0]][3] : false} />
            <label htmlFor='bonus-val-3'>{bonus_data[value[0]][3]}</label>
          </div>
          <div className='flex gap-2 items-center'>
            <Input type='radio' id='bonus-val-4' name="bonus-val" onChange={() => onChangeValue(Number(bonus_data[value[0]][4]))} checked={value[1] ? value[1] === bonus_data[value[0]][4] : false} />
            <label htmlFor='bonus-val-4'>{bonus_data[value[0]][4]}</label>
          </div>
        </div>
      </div>
    </div>
  );
}
