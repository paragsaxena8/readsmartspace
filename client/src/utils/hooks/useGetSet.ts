import { useState } from "react";

export const useGetSet = <T>(initialValue: T) => {
  const [value, setValue] = useState<T>(initialValue);
  const get = () => value;
  const set = (newValue: T) => setValue(newValue);
  return [get, set] as const;
};

// Usage
// import { useGetSet } from "src/utils/hooks/useGetSet";
//
// const [get, set] = useGetSet(0);
// console.log(get()); // 0
// set(2);
// console.log(get()); // 2
