import { createContext, useContext, useState } from "react";

export const AuthContext = createContext<any>(undefined);
const AuthProvider = (props: any) => {
  const [user, setUser] = useState(null);

  const value = { user, setUser };

  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
