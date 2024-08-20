import { createContext, useState } from "react";

const ThemeContext = createContext({
  mode: "light",
  toggleMode: () => {},
});

const ThemeProvider = ({ children }: { children: any }) => {
  const [mode, setMode] = useState("light"); // Default to light mode

  const toggleMode = () => {
    setMode(mode === "light" ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider };
