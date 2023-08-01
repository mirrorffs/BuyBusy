import { createContext, useContext } from "react";
import { useCookies } from "react-cookie";

const CookieContext = createContext();

export function useCookieContext() {
  const value = useContext(CookieContext);
  return value;
}

export default function CustomCookieContext({ children }) {
  const [cookie, setCookie, removeCookie] = useCookies(["user"]);

  return (
    <CookieContext.Provider
      value={{
        cookie,
        setCookie,
        removeCookie,
      }}
    >
      {children}
    </CookieContext.Provider>
  );
}
