"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { InitData, SelectedService, SelectedServicesState } from '@/types/service';

const REG_DATE_KEY = 'living_care_reg_date';
const INIT_DATA_KEY = 'living_care_init_data';

const sanitizeTreatmentBonus = (
  value: unknown,
  fallback: [number, number]
): [number, number] => {
  if (Array.isArray(value)) {
    const first = typeof value[0] === 'number' ? value[0] : fallback[0];
    const second = typeof value[1] === 'number' ? value[1] : fallback[1];
    return [first, second];
  }
  return fallback;
};

const DEFAULT_SELECTED_SERVICES: SelectedServicesState = {
  basic_remuneration: [],
  addition: [],
};

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

const sanitizeSelectedServiceList = (value: unknown): SelectedService[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!item || typeof item !== 'object') {
        return null;
      }
      const candidate = item as Partial<SelectedService>;
      if (!isFiniteNumber(candidate.id)) {
        return null;
      }

      const unitPrice = isFiniteNumber(candidate.unitPrice) ? candidate.unitPrice : 0;
      const quantity = isFiniteNumber(candidate.quantity) ? candidate.quantity : 1;

      return {
        ...(candidate as Omit<SelectedService, 'unitPrice' | 'quantity'>),
        unitPrice,
        quantity,
      } as SelectedService;
    })
    .filter((item): item is SelectedService => item !== null);
};

const sanitizeSelectedServices = (
  value: unknown,
  fallback: SelectedServicesState = DEFAULT_SELECTED_SERVICES
): SelectedServicesState => {
  if (!value || typeof value !== 'object') {
    return {
      basic_remuneration: [...fallback.basic_remuneration],
      addition: [...fallback.addition],
    };
  }

  const record = value as Record<string, unknown>;
  return {
    basic_remuneration: sanitizeSelectedServiceList(record.basic_remuneration),
    addition: sanitizeSelectedServiceList(record.addition),
  };
};

const createDefaultInitData = (regDate: string): InitData => ({
  reg_date: regDate,
  country_level: 11.22,
  treatment_bonus: [0, 1],
  selected_services: {
    basic_remuneration: [],
    addition: [],
  },
});

const getInitialRegDate = (): string => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(REG_DATE_KEY);
    if (stored) {
      return stored;
    }
  }
  return new Date().toISOString().split('T')[0];
};

const getInitialInitData = (regDate: string): InitData => {
  const defaultData = createDefaultInitData(regDate);

  if (typeof window === 'undefined') {
    return defaultData;
  }

  const stored = localStorage.getItem(INIT_DATA_KEY);
  if (!stored) {
    return defaultData;
  }

  try {
    const parsed = JSON.parse(stored) as Partial<InitData>;
    return {
      ...defaultData,
      ...parsed,
      reg_date:
        typeof parsed.reg_date === 'string' && parsed.reg_date.trim().length > 0
          ? parsed.reg_date
          : defaultData.reg_date,
      treatment_bonus: sanitizeTreatmentBonus(
        parsed?.treatment_bonus,
        defaultData.treatment_bonus
      ),
      selected_services: sanitizeSelectedServices(
        parsed?.selected_services,
        defaultData.selected_services
      ),
    };
  } catch (error) {
    console.warn('Failed to parse initData from localStorage, falling back to defaults.', error);
    localStorage.removeItem(INIT_DATA_KEY);
    return defaultData;
  }
};

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
  
  const [regDate, setRegDateState] = useState<string>(() => getInitialRegDate());
  const [initData, setInitDataState] = useState<InitData>(() => getInitialInitData(getInitialRegDate()));

  const setRegDate = (date: string) => {
    setRegDateState(date);
    setInitDataState(prev => {
      if (prev.reg_date === date) {
        return prev;
      }
      const updated = { ...prev, reg_date: date };
      return updated;
    });
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
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const stored = localStorage.getItem(INIT_DATA_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<InitData>;
        setInitDataState(prev => ({
          ...prev,
          ...parsed,
          reg_date:
            typeof parsed.reg_date === 'string' && parsed.reg_date.trim().length > 0
              ? parsed.reg_date
              : prev.reg_date,
          treatment_bonus: sanitizeTreatmentBonus(
            parsed?.treatment_bonus,
            prev.treatment_bonus
          ),
          selected_services: sanitizeSelectedServices(
            parsed?.selected_services,
            prev.selected_services
          ),
        }));
        if (
          typeof parsed.reg_date === 'string' &&
          parsed.reg_date.trim().length > 0 &&
          !localStorage.getItem(REG_DATE_KEY)
        ) {
          setRegDateState(parsed.reg_date);
        }
      }
    } catch (error) {
      console.warn('Failed to hydrate initData from localStorage.', error);
      localStorage.removeItem(INIT_DATA_KEY);
    }
  }, []);

  const updateInitData = (data: InitData) => {
    const nextData: InitData = {
      ...data,
      reg_date: data.reg_date && data.reg_date.trim().length > 0 ? data.reg_date : regDate,
      treatment_bonus: sanitizeTreatmentBonus(
        data.treatment_bonus,
        initData.treatment_bonus
      ),
      selected_services: sanitizeSelectedServices(
        data.selected_services,
        initData.selected_services
      ),
    };

    setInitDataState(nextData);

    if (nextData.reg_date && nextData.reg_date !== regDate) {
      setRegDate(nextData.reg_date);
    }
  };

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
        initData, setInitData: updateInitData,
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
