import { useTranslation } from 'react-i18next';

export const useLanguage = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return {
    currentLanguage: i18n.language,
    t,
    changeLanguage,
  };
};

export default useLanguage;
