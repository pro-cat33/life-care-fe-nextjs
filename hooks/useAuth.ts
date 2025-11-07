"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { SERVER_URL } from "@/config";

const TOKEN_STORAGE_KEY = "authToken";

interface AuthenticatedUser {
  id: number;
  email: string;
  name: string | null;
  role: string;
}

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifyingToken, setIsVerifyingToken] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);

  const logout = useCallback((): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
    delete axios.defaults.headers.common["Authorization"];
    setIsAuthenticated(false);
    setUser(null);
    setError(null);
    setIsLoading(false);
    setIsVerifyingToken(false);
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
      setIsLoading(true);

      try {
        const response = await axios.post(`${SERVER_URL}/auth/login`, { email, password });
        const { token, user: authenticatedUser } = response.data ?? {};

        if (token) {
          if (typeof window !== "undefined") {
            localStorage.setItem(TOKEN_STORAGE_KEY, token);
          }
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }

        setIsAuthenticated(true);
        setUser(authenticatedUser ?? null);
        setError(null);
        return { success: true };
      } catch (err) {
        logout();

        const message = axios.isAxiosError(err)
          ? err.response?.data?.message ?? err.message ?? "ログインに失敗しました"
          : err instanceof Error
            ? err.message
            : "ログインに失敗しました";

        setError(message);
        return { success: false, message };
      } finally {
        setIsLoading(false);
      }
    },
    [logout]
  );

  useEffect(() => {
    const controller = new AbortController();

    const validateToken = async () => {
      setIsVerifyingToken(true);
      setError(null);

      if (typeof window === "undefined") {
        setIsAuthenticated(false);
        setUser(null);
        setIsVerifyingToken(false);
        return;
      }

      const token = localStorage.getItem(TOKEN_STORAGE_KEY);

      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        setIsVerifyingToken(false);
        return;
      }

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      try {
        const response = await axios.get(`${SERVER_URL}/auth/me`, {
          signal: controller.signal,
        });

        const fetchedUser = response.data?.user as AuthenticatedUser | undefined;
        setUser(fetchedUser ?? null);
        setIsAuthenticated(true);
        setError(null);
      } catch (err) {
        if (axios.isAxiosError(err) && err.code === "ERR_CANCELED") {
          return;
        }

        console.error("useAuth validation error:", err);

        if (axios.isAxiosError(err) && err.response?.status === 401) {
          logout();
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }

        let message = "認証に失敗しました";

        if (axios.isAxiosError(err)) {
          const responseData = err.response?.data;
          if (responseData && typeof responseData === "object" && "message" in responseData) {
            const dataMessage = (responseData as { message?: string }).message;
            message = dataMessage ?? err.message ?? message;
          } else {
            message = err.message ?? message;
          }
        } else if (err instanceof Error) {
          message = err.message;
        }

        setError(message);
      } finally {
        setIsVerifyingToken(false);
      }
    };

    void validateToken();

    return () => {
      controller.abort();
    };
  }, [logout, refreshToken]);

  const refreshAuth = useCallback(() => {
    setIsVerifyingToken(true);
    setRefreshToken((prev) => prev + 1);
  }, []);

  return { isAuthenticated, isLoading, isVerifyingToken, error, user, refreshAuth, login, logout };
};