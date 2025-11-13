"use client";
import { useEffect, useState } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { useServiceData } from "@/hooks/useServerData";
import Header from "@/components/Header";
import { ServiceTable } from '@/components/ServiceTable';
import { PaginationControls } from '@/components/PaginationControls';
import { PerPageSelector } from "@/components/PerPageSelector";
import { TotalCount } from "@/components/TotalCount";
import Searchbar from "@/components/Searchbar";

export default function Home() {
  const {
    currentPage, setCurrentPage,
    itemsPerPage, setItemsPerPage,
    keyword, service, category, work_time, member_num,
  } = useAppContext();

  const { data, total, isLoading } = useServiceData(
    currentPage,
    itemsPerPage,
    keyword,
    service, member_num, work_time, category,
  );

  const totalPages = total > 0 ? Math.ceil(total / itemsPerPage) : 1;

  useEffect(() => {
    if (!isLoading && currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [isLoading, currentPage, totalPages, setCurrentPage]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (count: number) => {
    if (count === itemsPerPage) return;
    setItemsPerPage(count);
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };  

  return (
    <>
      <Header />
      <main className="w-full px-2 md:px-4">
        <Searchbar />
        <ServiceTable data={data} isLoading={isLoading} modal={{ flag: true, id: "" }} />
        <section className="w-full px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="w-full md:w-auto">
            <TotalCount total={total} />
          </div>
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4 justify-end">
            <PerPageSelector
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
            />
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </section>
      </main>
    </>
  );
}
