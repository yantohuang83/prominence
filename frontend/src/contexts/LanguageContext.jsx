import { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";

const LanguageContext = createContext({
  lang: "en",
  setLang: () => {},
  toggle: () => {},
});

export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState(() => {
    if (typeof window === "undefined") return "en";
    const stored = window.localStorage?.getItem("prominence_lang");
    return stored === "id" ? "id" : "en";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage?.setItem("prominence_lang", lang);
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const setLang = useCallback((l) => setLangState(l === "id" ? "id" : "en"), []);
  const toggle = useCallback(() => setLangState((l) => (l === "en" ? "id" : "en")), []);

  const value = useMemo(() => ({ lang, setLang, toggle }), [lang, setLang, toggle]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLang = () => useContext(LanguageContext);

// Helper: returns t(en, id) -> selected string
export const useT = () => {
  const { lang } = useLang();
  return (en, id) => (lang === "id" ? id : en);
};

// Helper: pick localized field { en, id } from object
export const pick = (lang, obj) => (obj?.[lang] ?? obj?.en ?? obj);
