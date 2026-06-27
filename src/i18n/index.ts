import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// French and Spanish translations as a proof of concept
const resources = {
  en: {
    translation: {
      "greeting": "Hey",
      "currently_active": "Currently Active",
      "profile": "Profile",
      "type_breakdown": "Type Breakdown",
      "switch_theme": "Switch theme",
    }
  },
  fr: {
    translation: {
      "greeting": "Salut",
      "currently_active": "Actuellement Actif",
      "profile": "Profil",
      "type_breakdown": "Répartition par Type",
      "switch_theme": "Changer de thème",
    }
  },
  es: {
    translation: {
      "greeting": "Hola",
      "currently_active": "Actualmente Activo",
      "profile": "Perfil",
      "type_breakdown": "Desglose por Tipo",
      "switch_theme": "Cambiar tema",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
