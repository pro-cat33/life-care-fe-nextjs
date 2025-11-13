"use client";
import { ServiceData } from '@/types/service';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ChangeEvent } from 'react';
import { Input } from './ui/input';

interface ServiceTableProps {
  data: ServiceData[];
  isLoading: boolean;
  modal: { flag: boolean, id: string };
  selectedServiceIds?: number[];
  onToggleService?: (service: ServiceData, selected: boolean) => void;
  wrapperClassName?: string;
  bodyMaxHeight?: string;
}

export function ServiceTable({
  data,
  isLoading,
  modal,
  selectedServiceIds = [],
  onToggleService,
  wrapperClassName,
  bodyMaxHeight,
}: ServiceTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-lg text-gray-500">読み込み中...</div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-lg text-gray-500">データがありません</div>
      </div>
    );
  }

  const isCheckboxMode = modal.id !== '';
  const isSelected = (serviceId: number) => selectedServiceIds.includes(serviceId);
  const handleCheckboxChange = (service: ServiceData) => (event: ChangeEvent<HTMLInputElement>) => {
    if (!onToggleService) {
      return;
    }
    onToggleService(service, event.target.checked);
  };

  const containerClass = ['border', 'rounded-lg', 'overflow-hidden', 'h-full', wrapperClassName]
    .filter(Boolean)
    .join(' ');

  const scrollClass = ['overflow-x-auto', 'overflow-y-auto', bodyMaxHeight ? 'h-full' : 'max-h-[calc(100vh-220px)]']
    .filter(Boolean)
    .join(' ');

  const scrollStyle = bodyMaxHeight ? { maxHeight: bodyMaxHeight } : undefined;

  return (
    <div className={containerClass}>
      <div className={scrollClass} style={scrollStyle}>
        <Table className="min-w-[800px]">
          <TableHeader className="sticky top-0 z-10">
            <TableRow className="bg-main">
            {isCheckboxMode && (
              <TableHead className="text-center text-xs md:text-sm"></TableHead>
            )}
            <TableHead className="text-center text-xs md:text-sm">種  類</TableHead>
            <TableHead className="text-center text-xs md:text-sm">項  目</TableHead>
            <TableHead className="text-xs md:text-sm">サービス内容略称</TableHead>
            <TableHead className="text-xs md:text-sm">勤 務 時 間</TableHead>
            <TableHead className="text-center text-xs md:text-sm">定 員 数</TableHead>
            <TableHead className="text-center text-xs md:text-sm">区  分</TableHead>
            <TableHead className="text-center text-xs md:text-sm">基  準</TableHead>
            <TableHead className="text-center text-xs md:text-sm">合  成<br />単位数</TableHead>
            <TableHead className="text-center text-xs md:text-sm">算定単位</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => {
              const checked = isSelected(item.id);
              return (
                <TableRow key={item.id || index} className="hover:bg-gray-50">
                {isCheckboxMode && (
                  <TableCell className="text-center text-xs md:text-sm">
                    <Input
                      type="checkbox"
                      id={item.id.toString()}
                      checked={checked}
                      onChange={handleCheckboxChange(item)}
                    />
                  </TableCell>
                )}
                <TableCell className="text-center text-xs md:text-sm">{item.service_kind}</TableCell>
                <TableCell className="text-center text-xs md:text-sm">
                  <span className="color-main">{item.service_id}</span>
                </TableCell>
                <TableCell className="text-xs md:text-sm">{item.short_content}</TableCell>
                <TableCell className="text-xs md:text-sm">{item.work_time}</TableCell>
                <TableCell className="text-center text-xs md:text-sm">
                  <span className="color-main">{item.member_num}</span>
                </TableCell>
                <TableCell className="text-center text-xs md:text-sm">{item.category}</TableCell>
                <TableCell className="text-center text-xs md:text-sm">{item.default_price}</TableCell>
                <TableCell className="text-center text-xs md:text-sm">{item.price}</TableCell>
                <TableCell className="text-center text-xs md:text-sm">{item.unit}</TableCell>
              </TableRow>
            )
          })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
