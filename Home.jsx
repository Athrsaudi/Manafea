import React, { useState, useEffect,  } from 'react';
import './home.css';
import { useTranslation } from 'react-i18next';
// import Logo from './imgs/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { IoStar } from "react-icons/io5";
import Header from './header'
import Footer from './footer'

const Home = () => {

  const { t } = useTranslation();
  // const { t, i18n } = useTranslation();
  // const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  // const languageRef = useRef(null);

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (languageRef.current && !languageRef.current.contains(event.target)) {
  //       setIsLanguageOpen(false);
  //     }
  //   };

  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, []);

  // const toggleLanguageMenu = () => {
  //   setIsLanguageOpen(!isLanguageOpen);
  // };

  // const changeLanguage = (lng) => {
  //   i18n.changeLanguage(lng);
  //   localStorage.setItem('language', lng);
  //   setIsLanguageOpen(false);
  // };

  const videos = [
    {
      id: 1,
      title: 'أصول الفقه للمبتدئين',
      description: 'شرح مبسط لأصول الفقه الإسلامي للمبتدئين مع الأمثلة التطبيقية',
      duration: '45 دقيقة',
      views: '1.2K'
    },
    {
      id: 2,
      title: 'علوم القرآن',
      description: 'مقدمة في علوم القرآن الكريم وأساليب التفسير المختلفة',
      duration: '60 دقيقة',
      views: '2.5K'
    },
    {
      id: 3,
      title: 'السيرة النبوية',
      description: 'دروس مستفادة من سيرة النبي محمد صلى الله عليه وسلم',
      duration: '50 دقيقة',
      views: '3.7K'
    },
  ];



  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      // إغلاق تلقائي بعد 3 ثواني
      const timer = setTimeout(() => {
        setIsModalOpen(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isModalOpen]);

  const handleStarClick = (index) => {
    setRating(index);
  };

  const handleStarHover = (index) => {
    setHoverRating(index);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // هنا يمكن إضافة كود لإرسال التقييم إلى الخادم
    setIsModalOpen(true);
    // إعادة تعيين النموذج بعد الإرسال
    setRating(0);
    setFeedback('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };


  return (
    <>
    <Header />
    <aside className="hero">
      <div className="hero-pattern"></div>
      <div className="hero-content">
        <h1>{t('منافع للعلوم الإسلامية')}</h1>
        <p>
          {t('منصة تعليمية إسلامية متكاملة تقدم دروساً ومحاضرات في العلوم الشرعية والتربوية بأسلوب عصري مُيسّر')}
        </p>
      </div>
      <div className="hero-shape">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
        </svg>
      </div>
    </aside>
    <div className="videos-section">
      <div className="section-title">
        <h4>{t('أحدث الدروس')}</h4>
        <div className="ornament">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      
      <div className="videos-grid">
        {videos.map(video => (
          <div className="video-card" key={video.id}>
            <div className="video-thumbnail">
              <div className="play-icon"></div>
            </div>
            <div className="video-info">
              <h3 className="video-title">{video.title}</h3>
              <p className="video-desc">{video.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="more-btn-container">
        <a href="#more-videos" className="more-btn">
          عرض المزيد من الدروس
          <FontAwesomeIcon icon={faArrowLeft} />
        </a>
      </div>
    </div>

    <main className="rating-section">
        <h2 className="rating-section-title">شاركنا رأيك</h2>
        <div className="stars-container">
          {[1, 2, 3, 4, 5].map((index) => (
            <IoStar
              key={index}
              icon={(hoverRating || rating) >= index  }
              className={`star ${(hoverRating || rating) >= index ? 'active' : ''}`}
              onClick={() => handleStarClick(index)}
              onMouseEnter={() => handleStarHover(index)}
              onMouseLeave={handleStarLeave}
            />
          ))}
        </div>
        <form className="feedback-form" onSubmit={handleSubmit}>
          <textarea
            placeholder="اكتب تعليقك هنا..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          ></textarea>
          <button type="submit" className="submit-btn">إرسال التقييم</button>
        </form>
      </main>

      {/* Modal مدمج داخل المكون */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="success-modal">
            <div className="success-icon">
                <FontAwesomeIcon icon={faCheckCircle} />
            </div>
            <h3 className="modal-title">تم بنجاح!</h3>
            <p className="modal-message">تم إرسال تقييمك بنجاح، شكراً لك!</p>
            <button className="modal-close-btn" onClick={closeModal}>
              إغلاق
            </button>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default Home;