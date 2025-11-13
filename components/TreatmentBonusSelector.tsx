"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from './ui/input';

interface TreatmentBonusSelectorProps {
  value: Array<number>;
  onChange: (value: Array<number>) => void;
}

export function TreatmentBonusSelector({ value, onChange }: TreatmentBonusSelectorProps) {
  const bonus_data = [
    ["療養介護", 41.7, 40.2, 34.7, 27.3],
    ["重度訪問介護", 34.3, 32.8, 27.3, 21.9],
    ["同行援護", 41.7, 40.2, 34.7, 27.3],
    ["行動援護", 38.2, 36.7, 31.2, 24.8],
    ["重度障害者等包括支援", 22.3, 0, 16.2, 13.8],
    ["生活介護", 8.1, 8.0, 6.7, 5.5],
    ["施設入所支援", 15.9, 0, 13.8, 11.5],
    ["短期入所", 15.9, 0, 13.8, 11.5],
    ["自立訓練(機能訓練)", 13.8, 13.4, 9.8, 8.0],
    ["自立訓練(生活訓練)", 13.8, 0, 13.4, 9.8, 8.0],
    ["宿泊型自立訓練", 13.8, 0, 13.4, 9.8, 8.0],
    ["就労選択支援", 10.3, 0, 10.1, 8.6, 6.9],
    ["就労移行支援", 10.3, 0, 10.1, 8.6, 6.9],
    ["就労移行支援(養成施設)", 10.3, 0, 10.1, 8.6, 6.9],
    ["就労継続支援A型", 9.6, 0, 9.4, 7.9, 6.3],
    ["就労継続支援B型", 9.3, 0, 9.1, 7.6, 6.2],
    ["就労定着支援", 10.3, 0, 8.6, 6.9],
    ["自立生活援助", 10.3, 0, 10.1, 8.6, 6.9],
    ["共同生活援助(介護サービス包括型)", 14.7, 0, 14.4, 12.8, 10.5],
    ["共同生活援助(日中サービス支援型)", 14.7, 0, 14.4, 12.8, 10.5],
    ["共同生活援助(外部サービス利用型)", 21.1, 0, 20.8, 19.2, 15.2],
    ["児童発達支援", 13.1, 0, 12.8, 11.8, 9.6],
    ["医療型児童発達支援(※)", 17.6, 0, 17.3, 16.3, 12.9],
    ["放課後等デイサービス", 13.4, 0, 13.1, 12.1, 9.8],
    ["居宅訪問型児童発達支援", 12.9, 0, 11.8, 9.6],
    ["保育所等訪問支援", 12.9, 0, 11.8, 9.6],
    ["福祉型障害児入所施設", 21.1, 0, 20.7, 16.8, 14.1],
    ["医療型障害児入所施設", 19.1, 18.7, 14.8, 12.7],
    ["障害者支援施設が行う生活介護", 10.1, 8.4, 6.7],
    ["障害者支援施設が行う自立訓練(機能訓練)", 12.5, 0, 9.9, 8.1],
    ["障害者支援施設が行う自立訓練(生活訓練)", 12.5, 0, 9.9, 8.1],
    ["障害者支援施設が行う就労移行支援", 10.7, 0, 8.9, 7.1],
    ["障害者支援施設が行う就労継続支援A型", 10.5, 0, 8.7, 6.9],
    ["障害者支援施設が行う就労継続支援B型", 10.4, 0, 8.6, 6.9]
  ];

  const onChangeValue = (val: number) => {
    onChange([value[0], val]);
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">処遇改善加算率</h2>
      </div>
      <div className="flex items-center gap-4">
        <Select
          value={bonus_data[value[0]][0].toString()}
          onValueChange={(val) => { onChange([Number(val), 1]) }}
        >
          <SelectTrigger className="w-full md:w-full text-xs md:text-sm">
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
