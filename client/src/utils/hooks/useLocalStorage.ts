// custom hook for use local storage

import { useState } from "react";

export const useLocalStorage = () => {
  const [error, setError] = useState<string | null>(null);

  const setItem = (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch (error: any) {
      setError(error);
    }
  };

  const getItem = (key: string) => {
    try {
      return localStorage.getItem(key);
    } catch (error: any) {
      setError(error);
    }
  };

  const removeItem = (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (error: any) {
      setError(error);
    }
  };

  const clear = () => {
    try {
      localStorage.clear();
    } catch (error: any) {
      setError(error);
    }
  };

  return { setItem, getItem, removeItem, clear, error };
};
