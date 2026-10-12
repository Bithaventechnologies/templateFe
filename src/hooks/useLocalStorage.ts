import { useEffect, useState } from "react";

/** useState that remembers its value in localStorage (safe if storage is blocked) */
export function useLocalStorage(key: string, initial = ""): [string, (v: string) => void] {
  const [value, setValue] = useState<string>(() => {
    try {
      return localStorage.getItem(key) ?? initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* ignore */
    }
  }, [key, value]);

  return [value, setValue];
}
