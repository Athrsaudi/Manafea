import React, { useState, useEffect, useRef } from 'react';
import './header.css';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import Logo from './imgs/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faGlobe, 
  faChevronDown, 
  } from '@fortawesome/free-solid-svg-icons';

function Header() {
  const { t, i18n } = useTranslation();
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const languageRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
      const handleClickOutside = (event) => {
          if (languageRef.current && !languageRef.current.contains(event.target)) {
              setIsLanguageOpen(false);
          }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
          document.removeEventListener('mousedown', handleClickOutside);
      };
  }, []);

  const toggleLanguageMenu = () => {
      setIsLanguageOpen(!isLanguageOpen);
  };

  const changeLanguage = (lng) => {
      i18n.changeLanguage(lng);
      localStorage.setItem('language', lng);
      setIsLanguageOpen(false);
  };

  const navItems = [
      { path: "/", text: "الرئيسية" },
      { path: "/videos", text: "الفيديوهات" },
      { path: "/quran", text: "القرآن الكريم" },
      { path: "/library", text: "الملفات التفاعلية" },
      { path: "/apps", text: "تطبيقات إسلامية" },
      { path: "/anotherweb", text: "مواقع إسلامية أخرى" }
  ];
    
          
    return (
        <>
          <header>
              <div className="header-pattern"></div>
              <div className="top-nav">
                <div className="logo-container">
                  <div className='scrolling'>بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ</div>
                  <img src={Logo} alt="منافع" className="logo" />
                </div>
              </div>
              <nav className="main-nav">
              <ul className="nav-menu">
              {navItems.map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                      >
                        {t(item.text)}
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="language-dropdown" ref={languageRef}>
                  <button className="language-btn" onClick={toggleLanguageMenu}>
                    <FontAwesomeIcon icon={faGlobe} />
                    {t('العربية')}
                    <FontAwesomeIcon icon={faChevronDown} />
                  </button>
                  <div className={`language-content ${isLanguageOpen ? 'show' : ''}`}>
                    <a href="#" onClick={() => changeLanguage('ar')}>العربية</a>
                    <a href="#" onClick={() => changeLanguage('en')}>English</a>
                    <a href="#" onClick={() => changeLanguage('fr')}>Français</a>
                    <a href="#" onClick={() => changeLanguage('tr')}>Türkçe</a>
                    <a href="#" onClick={() => changeLanguage('id')}>Bahasa</a>
                    <a href="#" onClick={() => changeLanguage('ru')}>русский</a>
                    <a href="#" onClick={() => changeLanguage('hi')}>हिंदी</a>
                    <a href="#" onClick={() => changeLanguage('ur')}>اردو</a>
                    <a href="#" onClick={() => changeLanguage('bn')}>বাংলা</a>
                    <a href="#" onClick={() => changeLanguage('zh')}>中国人</a>
                    <a href="#" onClick={() => changeLanguage('fil')}>Pilipino</a>
                  </div>
                </div>
              </nav>
            </header>
        </>
    )
}

export default Header;