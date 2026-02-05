import { useCallback, useState } from "react";

export const useToggle = (initial = false) => {
  const [value, setValue] = useState(initial);
  const toggle = useCallback(() => setValue((current) => !current), []);
  return { value, toggle, setValue };
};
