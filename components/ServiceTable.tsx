"use client";
import Link from 'next/link'
import { ServiceData } from '@/types/service';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useEffect } from 'react';

interface ServiceTableProps {
  data: ServiceData[];
  isLoading: boolean;
}

export function ServiceTable({ data, isLoading }: ServiceTableProps) {
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

  return (
    <div className="border rounded-lg overflow-x-auto">
      <Table className="min-w-[1200px]">
        <TableHeader>
          <TableRow className="bg-main">
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
            return (
              <TableRow key={item.id || index} className="hover:bg-gray-50">
                <TableCell className="text-center text-xs md:text-sm">{item.service_kind}</TableCell>
                <TableCell className="text-center text-xs md:text-sm">
                  <span className="color-main hover:underline cursor-pointer">
                    {item.service_id}
                  </span>
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
  );
}
