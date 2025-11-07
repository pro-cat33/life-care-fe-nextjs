"use client";

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationControlsProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const delta = 2;

    if (totalPages === 0) {
      return [1];
    }

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    pages.push(1);

    if (currentPage > delta + 2) {
      pages.push('...');
    }

    const rangeStart = Math.max(2, currentPage - delta);
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - delta - 1) {
      pages.push('...');
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1 py-4 overflow-x-auto">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1 || totalPages === 0}
        className="h-7 md:h-8 w-7 md:w-8 p-0"
        aria-label="First page"
      >
        <ChevronsLeft className="h-3 w-3 md:h-4 md:w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || totalPages === 0}
        className="h-7 md:h-8 w-7 md:w-8 p-0"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-3 w-3 md:h-4 md:w-4" />
      </Button>

      {getPageNumbers().map((page, index) => (
        <div key={index}>
          {page === '...' ? (
            <span className="px-1 md:px-2 text-xs md:text-sm text-gray-500">...</span>
          ) : (
            <Button
              variant={currentPage === page ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onPageChange(page as number)}
              className="h-7 md:h-8 min-w-7 md:min-w-8 px-2 md:px-3 text-xs md:text-sm"
            >
              {page}
            </Button>
          )}
        </div>
      ))}

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || totalPages === 0}
        className="h-7 md:h-8 w-7 md:w-8 p-0"
        aria-label="Next page"
      >
        <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages || totalPages === 0}
        className="h-7 md:h-8 w-7 md:w-8 p-0"
        aria-label="Last page"
      >
        <ChevronsRight className="h-3 w-3 md:h-4 md:w-4" />
      </Button>
    </div>
  );
}
