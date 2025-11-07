"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { ServiceData } from '@/types/service';
import { InitData } from '@/types/service';
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

export function useInitData (reg_date: string) {
  const [initData, setInitData] = useState<InitData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      if (reg_date === '') {
        setInitData(null);
        setIsLoading(false);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${SERVER_URL}/init`, {
          params: { reg_date },
          signal: controller.signal,
        });

        const result = response.data as unknown;

        // Handle different response structures
        let data: InitData;
        if (
          typeof result === 'object' &&
          result !== null &&
          'initData' in result &&
          (result as Record<string, unknown>).initData
        ) {
          data = (result as { initData: InitData }).initData;
        } else if (
          typeof result === 'object' &&
          result !== null &&
          'data' in result &&
          (result as Record<string, unknown>).data
        ) {
          data = (result as { data: InitData }).data;
        } else {
          // Assume the result itself is the InitData
          data = result as InitData;
        }
        
        setInitData(data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.code === 'ERR_CANCELED') {
            return;
          }
          const status = err.response?.status;
          if (status === 404) {
            setInitData(null);
            setError(null);
            return;
          }
          const message = status
            ? `HTTP error! status: ${status}`
            : err.message || 'Unknown error occurred';
          console.error('useInitData error:', err);
          setError(message);
        } else {
          const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
          console.error('useInitData error:', err);
          setError(errorMessage);
        }
        setInitData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    return () => {
      controller.abort();
    };
  }, [reg_date]);

  return { initData, isLoading, error };
}

export async function saveInitData(initData: InitData): Promise<{ success: boolean; error?: string }> {
  try {
    if (!initData.reg_date) {
      return { success: false, error: '登録日が必須です' };
    }

    await axios.post(`${SERVER_URL}/init`, initData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

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
