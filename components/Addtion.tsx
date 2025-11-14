"use client";
import { ChangeEvent, useEffect } from 'react';
import { SelectedService } from '@/types/service';
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

interface AdditionProps {
  selectedServices: SelectedService[];
  setTotal: (total: number) => void;
  setModal: (modal: { flag: boolean, id: string }) => void;
  onQuantityChange: (serviceId: number, quantity: number) => void;
  onRemoveService: (serviceId: number) => void;
}

export function Addition({
  selectedServices,
  setTotal,
  setModal,
  onQuantityChange,
  onRemoveService,
}: AdditionProps) {
  useEffect(() => {
    const totalPrice = selectedServices.reduce((sum, service) => {
      return sum + service.unitPrice * service.quantity;
    }, 0);
    setTotal(totalPrice);
  }, [selectedServices, setTotal]);

  const handleQuantityChange = (serviceId: number) => (event: ChangeEvent<HTMLInputElement>) => {
    const numeric = Math.max(0, Number(event.target.value) || 0);
    onQuantityChange(serviceId, numeric);
  };

  const formatCurrency = (value: number) => `¥${value.toLocaleString('ja-JP')}`;

  return (
    <div className='flex flex-col gap-4'>
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">加  算</h2>
        <Button onClick={() => setModal({ flag: true, id: "addition" })}>サービス選択</Button>
      </div>
      <div className="border border-gray-200 rounded-lg overflow-x-auto shadow-sm bg-white">
        <Table className='w-full'>
          <TableHeader className='bg-primary text-white'>
            <TableRow className='hover:bg-transparent'>
              <TableHead className='text-center font-semibold text-sm md:text-[14px] py-2 md:py-4 px-2 md:px-1'>サービス略称</TableHead>
              <TableHead className='text-center font-semibold text-sm md:text-[14px] py-2 md:py-4 px-2 md:px-1'>単  価</TableHead>
              <TableHead className='text-center font-semibold text-sm md:text-[14px] py-2 md:py-4 px-2 md:px-1'>数  量</TableHead>
              <TableHead className='text-center font-semibold text-sm md:text-[14px] py-2 md:py-4 px-2 md:px-1'>小  計</TableHead>
              <TableHead className='text-center font-semibold text-sm md:text-[14px] py-2 md:py-4 px-2 md:px-1 w-24'>削除</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedServices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500 py-6">
                  サービスが選択されていません
                </TableCell>
              </TableRow>
            ) : (
              selectedServices.map(service => {
                const subtotal = service.unitPrice * service.quantity;
                return (
                  <TableRow
                    key={service.id}
                    className='hover:bg-blue-50 transition-colors duration-150 border-b border-gray-100'
                  >
                    <TableCell className='text-gray-700 py-2 md:py-3 px-2 text-[8px] md:text-base'>
                      {service.short_content || service.service_name}
                    </TableCell>
                    <TableCell className='text-center text-gray-700 py-2 md:py-3 px-2 md:px-4 text-[10px] md:text-base'>
                      {formatCurrency(service.unitPrice)}
                    </TableCell>
                    <TableCell className='py-2 md:py-3 px-2'>
                      <Input
                        type="number"
                        min={0}
                        value={service.quantity}
                        onChange={handleQuantityChange(service.id)}
                        className='w-full h-8 md:h-9 text-sm md:text-base text-right border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md transition-all'
                      />
                    </TableCell>
                    <TableCell className='text-right font-bold text-base md:text-lg color-main py-2 md:py-3 px-1'>
                      <span className="text-xs md:text-base">{formatCurrency(subtotal)}</span>
                    </TableCell>
                    <TableCell className='text-center py-2 md:py-3 px-2'>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onRemoveService(service.id)}
                        className='text-red-500 hover:text-red-600'
                      >
                        削除
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
            <TableRow className='border-t border-gray-200'>
              <TableCell className='font-semibold text-gray-700 py-2 md:py-3 px-2 md:px-4'>合計</TableCell>
              <TableCell />
              <TableCell />
              <TableCell className='text-right font-bold text-base md:text-lg color-main py-2 md:py-3 px-2 md:px-4'>
                <span className="text-xl md:text-2xl font-bold">
                  {formatCurrency(
                    selectedServices.reduce((sum, service) => sum + service.unitPrice * service.quantity, 0)
                  )}
                </span>
              </TableCell>
              <TableCell />
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
