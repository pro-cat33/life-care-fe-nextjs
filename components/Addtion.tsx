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
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/contexts/AppContext';
import { InitData } from '@/types/service';

interface AdditionProps {
  data: ServiceData[];
  isLoading: boolean;
  total: number;
  setTotal: (total: number) => void;
}

type ValueKey = 'eat_value' | 'nurse_value' | 'rehearsal_value' | 'pro_value1' | 'pro_value2' | 'pro_value3' | 'transport_value1' | 'transport_value2' | 'staff_value12';
type PriceKey = 'eat_price' | 'nurse_price' | 'rehearsal_price' | 'pro_price1' | 'pro_price2' | 'pro_price3' | 'transport_price1' | 'transport_price2' | 'staff_price12';

interface CategoryDef {
  label: string;
  priceKey: PriceKey;
  valueKey: ValueKey;
}

export function Addition({ data, isLoading, total, setTotal }: AdditionProps) {
  const { initData, setInitData } = useAppContext();
  const [tempData, setTempData] = useState<InitData>(initData);

  useEffect(() => {
    setTempData(initData);
  }, [initData]);

  const categories: CategoryDef[] = [
    { label: '食事提供加算', priceKey: 'eat_price', valueKey: 'eat_value' },
    { label: '常勤看護職員配置加算7', priceKey: 'nurse_price', valueKey: 'nurse_value' },
    { label: 'リハ加算2', priceKey: 'rehearsal_price', valueKey: 'rehearsal_value' },
    { label: '福祉専門職配置Ⅰ', priceKey: 'pro_price1', valueKey: 'pro_value1' },
    { label: '福祉専門職配置Ⅱ', priceKey: 'pro_price2', valueKey: 'pro_value2' },
    { label: '福祉専門職配置Ⅲ', priceKey: 'pro_price3', valueKey: 'pro_value3' },
    { label: '送迎加算Ⅰ', priceKey: 'transport_price1', valueKey: 'transport_value1' },
    { label: '送迎加算重度', priceKey: 'transport_price2', valueKey: 'transport_value2' },
    { label: '人員配置体制加算Ⅰ2', priceKey: 'staff_price12', valueKey: 'staff_value12' },
  ];

  const handleYearCountChange = (valueKey: ValueKey, value: string) => {
    const numeric = parseFloat(value) || 0;
    setInitData({ ...initData, [valueKey]: numeric });
  };

  const calculateServicePrice = (compositeUnit: number, yearCount: number): number => {
    const yearCountNum = Number(yearCount) || 0;
    return compositeUnit * yearCountNum;
  };

  const formatPrice = (price: number): string => {
    return price.toLocaleString('ja-JP');
  };

  const getTotalServicePrice = () => {
    return categories.reduce((sum, c) => {
      const price = Number(tempData[c.priceKey]) || 0;
      const count = Number(tempData[c.valueKey]) || 0;
      return sum + calculateServicePrice(price, count);
    }, 0);
  };

  useEffect(() => {
    const totalServicePrice = getTotalServicePrice();
    setTotal(totalServicePrice);
  }, [tempData, initData]);

  useEffect(() => {
    setTempData(initData);
  }, [initData]);

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
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">加  算</h2>
      </div>
      <div className="border border-gray-200 rounded-lg overflow-x-auto shadow-sm bg-white">
        <Table className='w-full'>
          <TableHeader className='bg-primary text-white'>
            <TableRow className='hover:bg-transparent'>
              <TableHead className='text-center font-semibold text-sm md:text-[14px] py-2 md:py-4 px-2 md:px-1'>区  分</TableHead>
              <TableHead className='text-center font-semibold text-sm md:text-[14px] py-2 md:py-4 px-2 md:px-1'>合成単位数</TableHead>
              <TableHead className='text-center font-semibold text-sm md:text-[14px] py-2 md:py-4 px-2 md:px-1'>年間のべ数</TableHead>
              <TableHead className='text-center font-semibold text-sm md:text-[14px] py-2 md:py-4 px-2 md:px-2'>サービス価格</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((c, index) => {
              const unit = Number(tempData[c.priceKey]) || 0;
              const count = Number(tempData[c.valueKey]) || 0;
              const servicePrice = calculateServicePrice(unit, count);
              return (
                <TableRow
                  key={index}
                  className='hover:bg-blue-50 transition-colors duration-150 cursor-pointer border-b border-gray-100'
                >
                  <TableCell className='font-medium text-gray-700 py-2 md:py-3 px-2 md:px-4 text-sm md:text-base'>{c.label}</TableCell>
                  <TableCell className='text-center text-gray-700 py-2 md:py-3 px-2 md:px-4'>
                    <span className='font-medium text-sm md:text-base'>{unit}</span>
                  </TableCell>
                  <TableCell className='py-2 md:py-3 px-2 md:px-4'>
                    <Input
                      type="number"
                      value={count}
                      onChange={(e) => handleYearCountChange(c.valueKey, e.target.value)}
                      className='w-full max-w-24 md:max-w-32 h-8 md:h-9 text-sm md:text-base text-right border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md transition-all'
                    />
                  </TableCell>
                  <TableCell className='text-right font-bold text-base md:text-lg color-main py-2 md:py-3 px-2 md:px-4'>
                    <span className="text-xs md:text-base">¥{formatPrice(servicePrice)}</span>
                  </TableCell>
                </TableRow>
              );
            })}
            <TableRow
              className='hover:bg-blue-50 transition-colors duration-150 cursor-pointer border-b border-gray-100'
            >
              <TableCell className='font-medium text-gray-700 py-2 md:py-3 px-2 md:px-4 font-bold'>合計：</TableCell>
              <TableCell className='text-center text-gray-700 py-2 md:py-3 px-2 md:px-4'>
              <span className="text-lg md:text-lg font-bold">{categories.reduce((sum, c) => sum + (Number(tempData[c.priceKey]) || 0), 0).toLocaleString('ja-JP')}</span>
              </TableCell>
              <TableCell className='py-2 md:py-3 px-2 md:px-4'>
                <span className="text-lg md:text-lg font-bold">{categories.reduce((sum, c) => sum + (Number(tempData[c.valueKey]) || 0), 0).toLocaleString('ja-JP')}</span>
              </TableCell>
              <TableCell className='text-right font-bold text-base md:text-lg color-main py-2 md:py-3 px-2 md:px-4'>
                <span className="text-lg md:text-lg font-bold">¥{getTotalServicePrice().toLocaleString()}</span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
