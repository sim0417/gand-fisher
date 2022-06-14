import { language, image } from './language';

const LANGUAGE_ENG = 'en';
const LANGUAGE_KR = 'ko';
let currentLanguage;

if (AOS) {
  AOS.init();
}

const loadLanguage = () => {
  const language = localStorage.getItem('site-lenguage');

  if (!language || ![LANGUAGE_ENG, LANGUAGE_KR].includes(language)) {
    localStorage.setItem('site-lenguage', LANGUAGE_ENG);
    currentLanguage = LANGUAGE_ENG;
    return LANGUAGE_ENG;
  }
  currentLanguage = language;
  return language;
};

const setLanguage = (siteLanguage) => {
  if (currentLanguage === siteLanguage) return;

  const languageElements = document.querySelectorAll('[data-lang]');
  languageElements?.forEach((element) => {
    const {
      dataset: { lang: datakey },
    } = element;
    element.textContent = language[siteLanguage][datakey] || '';
  });

  const languageImageElements = document.querySelectorAll('[data-img]');
  languageImageElements?.forEach((element) => {
    const {
      dataset: { img: datakey },
    } = element;

    element.src = `img/${siteLanguage}/${image[datakey]}`;
  });

  localStorage.setItem('site-lenguage', siteLanguage);
  currentLanguage = siteLanguage;
};

window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.language-change')?.forEach((element) => {
    element.addEventListener('click', (event) => {
      const { target } = event;
      if (target?.id === 'lan-ko') {
        setLanguage(LANGUAGE_KR);
      } else if (target?.id === 'lan-en') {
        setLanguage(LANGUAGE_ENG);
      }
    });
  });

  const siteLanguage = loadLanguage();
  setLanguage(siteLanguage);
});
