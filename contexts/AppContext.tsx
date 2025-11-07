"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { InitData } from '@/types/service';

const REG_DATE_KEY = 'living_care_reg_date';

interface AppContextType {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (count: number) => void;
  keyword: string;
  setKeyword: (keyword: string) => void;
  service: number;
  setService: (service: number) => void;
  work_time: number;
  setWorkTime: (work_time: number) => void;
  member_num: number;
  setMemberNum: (member_num: number) => void;
  category: number;
  setCategory: (category: number) => void;
  initData: InitData;
  setInitData: (initData: InitData) => void;
  regDate: string;
  setRegDate: (date: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [keyword, setKeyword] = useState('');
  const [service, setService] = useState(0);
  const [work_time, setWorkTime] = useState(0);
  const [member_num, setMemberNum] = useState(0);
  const [category, setCategory] = useState(0);
  
  // Initialize regDate from localStorage or use today's date
  const getInitialRegDate = (): string => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(REG_DATE_KEY);
      if (stored) {
        return stored;
      }
    }
    return new Date().toISOString().split('T')[0];
  };
  
  const [regDate, setRegDateState] = useState<string>(getInitialRegDate);
  
  // Save to localStorage whenever regDate changes
  const setRegDate = (date: string) => {
    setRegDateState(date);
    if (typeof window !== 'undefined') {
      localStorage.setItem(REG_DATE_KEY, date);
    }
  };
  
  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(REG_DATE_KEY);
      if (stored) {
        setRegDateState(stored);
      }
    }
  }, []);
  const [initData, setInitData] = useState<InitData>({
    reg_date: '',
    cate_price6: 1049,
    cate_price5: 775,
    cate_price4: 533,
    cate_price3: 475,
    cate_price2: 429,
    eat_price: 30,
    nurse_price: 33,
    rehearsal_price: 20,
    pro_price1: 15,
    pro_price2: 0,
    pro_price3: 6,
    transport_price1: 21,
    transport_price2: 28,
    staff_price12: 263,
    transport_value1: 0,
    transport_value2: 0,
    staff_value12: 0,
    cate_value6: 0,
    cate_value5: 0,
    cate_value4: 0,
    cate_value3: 0,
    cate_value2: 0,
    eat_value: 0,
    nurse_value: 0,
    rehearsal_value: 0,
    pro_value1: 0,
    pro_value2: 0,
    pro_value3: 0,
    country_level: 11.22,
  });

  return (
    <AppContext.Provider
      value={{
        currentPage, setCurrentPage,
        itemsPerPage, setItemsPerPage,
        keyword, setKeyword,
        service, setService,
        work_time, setWorkTime,
        member_num, setMemberNum,
        category, setCategory,
        initData, setInitData,
        regDate, setRegDate
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
