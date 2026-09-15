import { createContext, useContext, useEffect, useState } from "react";

export const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(
    localStorage.getItem("language") || "English",
  );

  useEffect(() => {
    document.documentElement.dir = lang === "Arabic" ? "rtl" : "ltr";
  }, [lang]);

  const changeLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem("language", newLang);
  };

  return (
    <LanguageContext.Provider
      value={{
        lang,
        changeLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
};
