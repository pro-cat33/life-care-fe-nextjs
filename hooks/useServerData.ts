"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { ServiceData } from '@/types/service';
import { InitData, SelectedService, SelectedServicesState } from '@/types/service';
import { SERVER_URL } from '@/config';

interface UseServiceDataResult {
  data: ServiceData[];
  total: number;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useServiceData(
  page: number,
  count: number,
  keyword: string,
  service: number,
  member_num: number,
  work_time: number,
  category: number,
): UseServiceDataResult {
  const [data, setData] = useState<ServiceData[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      if (page < 1 || count < 1) {
        setData([]);
        setTotal(0);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${SERVER_URL}/code`, {
          params: {
            page,
            count,
            keyword,
            service,
            member: member_num,
            time: work_time,
            category,
          },
          signal: controller.signal,
        });

        const { total, data } = response.data as { total: number; data: ServiceData[] };

        setData(data);
        setTotal(total);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.code === 'ERR_CANCELED') {
            return;
          }

          const status = err.response?.status;
          const message = status
            ? `HTTP error! status: ${status}`
            : err.message || 'Unknown network error';
          setError(new Error(message));
        } else {
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
        setData([]);
        setTotal(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    return () => {
      controller.abort();
    };
  }, [page, count, keyword, refetchTrigger, service, work_time, member_num, category]);

  const refetch = () => {
    setRefetchTrigger(prev => prev + 1);
  };

  return { data, total, isLoading, error, refetch };
}

const INIT_DATA_KEY = 'living_care_init_data';
const REG_DATE_KEY = 'living_care_reg_date';

const sanitizeTreatmentBonus = (
  value: unknown,
  fallback: [number, number] = [0, 1]
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

export function useInitData (reg_date: string) {
  const [initData, setInitData] = useState<InitData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const getStoredInitData = (): InitData | null => {
      if (typeof window === 'undefined') {
        return null;
      }
      const stored = localStorage.getItem(INIT_DATA_KEY);
      if (!stored) {
        return null;
      }
      try {
        const parsed = JSON.parse(stored) as Partial<InitData>;
        if (parsed && typeof parsed === 'object') {
          const treatment_bonus = sanitizeTreatmentBonus(
            (parsed as Record<string, unknown>).treatment_bonus,
            [0, 1]
          );
          return {
            ...(parsed as InitData),
            treatment_bonus,
            selected_services: sanitizeSelectedServices(
              (parsed as Record<string, unknown>).selected_services,
              DEFAULT_SELECTED_SERVICES
            ),
          };
        }
      } catch (storageError) {
        console.warn('Failed to parse initData from localStorage in useInitData.', storageError);
        localStorage.removeItem(INIT_DATA_KEY);
      }
      return null;
    };

    const hydrateFromStorage = () => {
      if (isCancelled) {
        return;
      }

      if (reg_date === '') {
        setInitData(null);
        setIsLoading(false);
      } else {
        const storedData = getStoredInitData();
        if (storedData) {
          const dataWithRegDate: InitData = {
            ...storedData,
            reg_date:
              storedData.reg_date && storedData.reg_date.trim().length > 0
                ? storedData.reg_date
                : reg_date,
            treatment_bonus: sanitizeTreatmentBonus(storedData.treatment_bonus),
            selected_services: sanitizeSelectedServices(
              storedData.selected_services,
              DEFAULT_SELECTED_SERVICES
            ),
          };
          setInitData(dataWithRegDate);
        } else {
          setInitData(null);
        }
        setIsLoading(false);
      }
      setError(null);
    };

    hydrateFromStorage();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === INIT_DATA_KEY) {
        hydrateFromStorage();
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
    }

    return () => {
      isCancelled = true;
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handleStorageChange);
      }
    };
  }, [reg_date]);

  return { initData, isLoading, error };
}

export async function saveInitData(initData: InitData): Promise<{ success: boolean; error?: string }> {
  try {
    if (!initData.reg_date) {
      return { success: false, error: '登録日が必須です' };
    }
    if (typeof window !== 'undefined') {
      const payload: InitData = {
        ...initData,
        treatment_bonus: sanitizeTreatmentBonus(initData.treatment_bonus),
        selected_services: sanitizeSelectedServices(
          initData.selected_services,
          DEFAULT_SELECTED_SERVICES
        ),
      };
      localStorage.setItem(INIT_DATA_KEY, JSON.stringify(payload));
      if (payload.reg_date && payload.reg_date.trim().length > 0) {
        localStorage.setItem(REG_DATE_KEY, payload.reg_date);
      }
    }

    return { success: true };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      const errorText = err.response?.data;
      const message = status
        ? `保存に失敗しました: ${status} ${typeof errorText === 'string' ? errorText.slice(0, 200) : ''}`
        : err.message || '保存中にエラーが発生しました';
      console.error('saveInitData error:', err);
      return { success: false, error: message };
    }

    const errorMessage = err instanceof Error ? err.message : '保存中にエラーが発生しました';
    console.error('saveInitData error:', err);
    return { success: false, error: errorMessage };
  }
}
