import { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";
import translations from "../translations/translations";

const useTranslation = () => {
  const { lang } = useContext(LanguageContext);

  const t = (key) => {
    return translations[lang]?.[key] || key;
  };

  return { t };
};

export default useTranslation;
