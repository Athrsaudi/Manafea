import React from 'react'
import Header from './header'
import Searcher from "./imgs/searcher.png";
import './apps.css' 
import Footer from './footer';

function Apps() {
  // قائمة بالتطبيقات (يمكنك إضافة المزيد حسب الحاجة)
  const apps = [
    { id: 1, name : "searcher" , image: Searcher, link: "https://play.google.com/store/apps/details?id=com.thedawah.furqan&hl=ar&pli=1" },
    { id: 2, name : "searcher" , image: Searcher, link: "https://play.google.com/store/apps/details?id=com.thedawah.furqan&hl=ar&pli=1" },
    { id: 3, name : "searcher" , image: Searcher, link: "https://play.google.com/store/apps/details?id=com.thedawah.furqan&hl=ar&pli=1" },
    // أضف المزيد من التطبيقات هنا
  ];

  return (
    <div className="page-container">
      <Header />

      <div class="videos-header">
            <h1>مكتبة الفيديوهات الإسلامية</h1>
            <p>مجموعة مميزة من المحاضرات والدروس في علوم الشريعة والسيرة النبوية</p>
            </div>

      <div className="content-wrap">
        <div className="apps-container">
          <div className="apps-categories">
            <ul>
              <li><a href="#" className="active">android</a></li>
              <li><a href="#">ios</a></li>
            </ul>
          </div>
          <div className="apps-grid">
            {apps.map(app => (
              <div key={app.id} className="app-item">
                <a href={app.link} target="_blank" rel="noopener noreferrer">
                  <img src={app.image} alt={app.name} />
                  <p>{app.name}</p>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Apps