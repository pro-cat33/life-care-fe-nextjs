"use client";

interface PaginationInfoProps {
  currentPage: number;
  itemsPerPage: number;
  total: number;
}

export function PaginationInfo({ currentPage, itemsPerPage, total }: PaginationInfoProps) {
  if (total === 0) {
    return (
      <div className="text-sm text-gray-600 text-center py-2">
        表示するデータがありません
      </div>
    );
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, total);

  return (
    <div className="text-sm text-gray-600 text-center py-2">
      {startItem.toLocaleString()} - {endItem.toLocaleString()} 件目を表示 / 全 {total.toLocaleString()} 件
    </div>
  );
}
