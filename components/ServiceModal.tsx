"use client";
import { useEffect, useMemo, useState } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { useServiceData } from "@/hooks/useServerData";
import { ServiceTable } from '@/components/ServiceTable';
import { PaginationControls } from '@/components/PaginationControls';
import { PerPageSelector } from "@/components/PerPageSelector";
import { TotalCount } from "@/components/TotalCount";
import Searchbar from "@/components/Searchbar";
import { Button } from "./ui/button";
import { ServiceData } from "@/types/service";

interface ServiceModalProps {
  modal: { flag: boolean; id: string };
  onClose: () => void;
  onSave: (modalId: string, services: ServiceData[]) => void;
  selectedServices: ServiceData[];
}

export default function ServiceModal({ modal, onClose, onSave, selectedServices }: ServiceModalProps) {
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

  const [selectedMap, setSelectedMap] = useState<Record<number, ServiceData>>({});

  useEffect(() => {
    if (!isLoading && currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [isLoading, currentPage, totalPages, setCurrentPage]);

  useEffect(() => {
    if (!modal.flag) {
      return;
    }
    const initialSelection = selectedServices.reduce<Record<number, ServiceData>>((acc, service) => {
      acc[service.id] = service;
      return acc;
    }, {});
    setSelectedMap(initialSelection);
  }, [modal.flag, modal.id, selectedServices]);

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

  const selectedIds = useMemo(
    () => Object.keys(selectedMap).map(id => Number(id)),
    [selectedMap],
  );

  const handleToggleService = (service: ServiceData, selected: boolean) => {
    setSelectedMap(prev => {
      const next = { ...prev };
      if (selected) {
        next[service.id] = service;
      } else {
        delete next[service.id];
      }
      return next;
    });
  };

  const handleSave = () => {
    onSave(modal.id, Object.values(selectedMap));
  };

  return (
    <div className="w-screen h-screen fixed top-0 left-0 bg-black/50 z-1">
      <div className="w-screen h-screen fixed top-0 left-0 bg-black/50 z-1" onClick={onClose}></div>
      <main className="w-[92vw] max-w-6xl h-[90vh] md:h-[85vh] px-0 md:px-2 py-6 md:py-8 z-2 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg flex flex-col overflow-hidden relative">
        <Button onClick={onClose} className="absolute top-3 right-4 bg-red-500 text-white hover:bg-red-600">X</Button>
        <div className="px-4 md:px-6 pb-4 shrink-0">
          <Searchbar />
        </div>
        <div className="flex-1 overflow-hidden px-4 md:px-6 pb-4">
          <ServiceTable
            data={data}
            isLoading={isLoading}
            modal={modal}
            selectedServiceIds={selectedIds}
            onToggleService={handleToggleService}
            wrapperClassName="h-full"
            bodyMaxHeight="100%"
          />
        </div>
        <section className="w-full px-4 md:px-6 pt-3 pb-2 border-t border-gray-200 bg-white/90 shrink-0 flex flex-col md:flex-row justify-between items-center gap-4">
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
          <Button onClick={handleSave} className="bg-main text-white hover:bg-main/90 w-full md:w-auto">保&nbsp;&nbsp;存</Button>
        </section>
      </main>
    </div>
  );
}
