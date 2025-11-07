"use client";

interface TotalCountProps {
  total: number;
}

export function TotalCount({ total }: TotalCountProps) {
  return (
    <div className="text-xs md:text-sm text-gray-600">
      総件数: <span className="font-semibold text-base md:text-lg text-gray-900">{total.toLocaleString()}</span>件
    </div>
  );
}
