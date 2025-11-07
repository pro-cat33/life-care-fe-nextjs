"use client";
import { useState, useEffect } from 'react';
import { ServiceData } from '@/types/service';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { useAppContext } from '@/contexts/AppContext';
import { InitData } from '@/types/service';

interface BasicRemunerationProps {
  data: ServiceData[];
  isLoading: boolean;
  total: number;
  setTotal: (total: number) => void;
}

export function BasicRemuneration({ data, isLoading, total, setTotal }: BasicRemunerationProps) {
  const { initData, setInitData } = useAppContext();
  
  const [tempData, setTempData] = useState<InitData>(initData);

  type CategoryValueKey = 'cate_value6' | 'cate_value5' | 'cate_value4' | 'cate_value3' | 'cate_value2';
  interface CategoryDef {
    name: string;
    unitCount: number;
    id: CategoryValueKey;
  }

  // Define category data
  const categories: CategoryDef[] = [
    { name: '区分6', unitCount: initData.cate_price6, id: "cate_value6" },
    { name: '区分5', unitCount: initData.cate_price5, id: "cate_value5" },
    { name: '区分4', unitCount: initData.cate_price4, id: "cate_value4" },
    { name: '区分3', unitCount: initData.cate_price3, id: "cate_value3" },
    { name: '区分2', unitCount: initData.cate_price2, id: "cate_value2" },
  ];

  useEffect(() => {
    setTempData(initData);
  }, [initData]);

  const handleAnnualCountChange = (index: number, value: string, id: CategoryValueKey) => {
    const numeric = parseFloat(value) || 0;
    setInitData({ ...initData, [id]: numeric });
  };

  const calculateServicePrice = (unitCount: number, annualCount: number): number => {
    return unitCount * annualCount;
  };

  const getTotalServicePrice = () => {
    return categories.reduce((sum, category) => {
      return sum + calculateServicePrice(category.unitCount, Number(tempData[category.id]) || 0);
    }, 0);
  };

  useEffect(() => {
    const totalServicePrice = getTotalServicePrice();
    setTotal(totalServicePrice);
  }, [tempData, initData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-lg text-gray-500">読み込み中...</div>
      </div>
    );
  }

  // if (data.length === 0) {
  //   return (
  //     <div className="flex items-center justify-center py-12">
  //       <div className="text-lg text-gray-500">データがありません</div>
  //     </div>
  //   );
  // }

  return (
    <div className='flex flex-col gap-4'>
      <div className="flex items-center gap-2">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">基本報酬</h2>
      </div>
      <div className="border border-gray-200 rounded-lg overflow-x-auto shadow-sm bg-white">
        <Table className='w-full'>
          <TableHeader className='bg-primary text-white'>
            <TableRow className='hover:bg-transparent'>
              <TableHead className='text-center font-semibold text-sm md:text-[14px] py-2 md:py-4 px-2 md:px-2'>区  分</TableHead>
              <TableHead className='text-center font-semibold text-sm md:text-[14px] py-2 md:py-4 px-2 md:px-2'>合成単位数</TableHead>
              <TableHead className='text-center font-semibold text-sm md:text-[14px] py-2 md:py-4 px-2 md:px-2'>年間のべ数</TableHead>
              <TableHead className='text-center font-semibold text-sm md:text-[14px] py-2 md:py-4 px-2 md:px-2'>サービス価格</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category, index) => {
              const servicePrice = calculateServicePrice(category.unitCount, Number(tempData[category.id]) || 0);
              return (
                <TableRow
                  key={index}
                  className='hover:bg-blue-50 transition-colors duration-150 cursor-pointer border-b border-gray-100'
                >
                  <TableCell className='font-medium text-gray-700 py-2 md:py-3 px-2 md:px-4'>{category.name}</TableCell>
                  <TableCell className='text-right text-gray-700 py-2 md:py-3 px-2 md:px-4'>
                    <span className='font-medium text-sm md:text-base'>{category.unitCount.toLocaleString()}</span>
                  </TableCell>
                  <TableCell className='py-2 md:py-3 px-2 md:px-4'>
                  <Input
                      type="number"
                    value={tempData[category.id]}
                      onChange={(e) => handleAnnualCountChange(index, e.target.value, category.id)}
                      className='w-full max-w-24 md:max-w-32 h-8 md:h-9 text-sm md:text-base text-right border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md transition-all'
                    />
                  </TableCell>
                  <TableCell className='text-right font-bold text-base md:text-lg color-main py-2 md:py-3 px-2 md:px-4'>
                    <span className="text-xs md:text-base">¥{calculateServicePrice(category.unitCount, tempData[category.id]).toLocaleString()}</span>
                  </TableCell>
                </TableRow>
              );
            })}
            <TableRow
              className='hover:bg-blue-50 transition-colors duration-150 cursor-pointer border-b border-gray-100'
            >
              <TableCell className='font-medium text-gray-700 py-2 md:py-3 px-2 md:px-4'>合計：</TableCell>
              <TableCell className='text-right text-gray-700 py-2 md:py-3 px-2 md:px-4'></TableCell>
              <TableCell className='py-2 md:py-3 px-2 md:px-4'>
                <span className="text-lg md:text-xl">{
                  categories
                    .reduce((sum, c) => sum + (Number(tempData[c.id]) || 0), 0)
                    .toLocaleString('ja-JP')
                }</span>
              </TableCell>
              <TableCell className='text-right font-bold text-base md:text-lg color-main py-2 md:py-3 px-2 md:px-4'>
                <span className="text-xl md:text-xl font-bold">¥{getTotalServicePrice().toLocaleString()}</span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
