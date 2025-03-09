import React, {useState} from 'react';
import './video.css';
import Header from './header'
import Footer from './footer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';



function Videos(){
    const [activeCategory, setActiveCategory] = useState('all');
    const categories = [
        { id: 'all', name: 'جميع الفيديوهات' },
        { id: 'aqeedah', name: 'العقيدة' },
        { id: 'fiqh', name: 'الفقه' },
        { id: 'tafseer', name: 'تفسير القرآن' },
        { id: 'seerah', name: 'السيرة النبوية' },
        { id: 'hadith', name: 'الحديث' },
        { id: 'akhlaq', name: 'الأخلاق' },
        { id: 'education', name: 'العلوم التربوية' },
    ]

    
    const allVideos = {
        all: [
            {
                id: 1,
                title: 'أساسيات العقيدة الإسلامية',
                description: 'شرح لأهم أصول العقيدة الإسلامية للمبتدئين ومجمل أركان الإيمان',
                link: 'https://www.youtube.com/embed/FsDrBKQy7gM?si=h414kkga6ycM4r5o'
            },
            {
                id: 2,
                title: 'فضائل شهر رمضان',
                description: 'محاضرة عن فضائل شهر رمضان وأهميته في الإسلام',
                link: 'https://www.youtube.com/embed/ZINjuzYQxX4?si=LIMh4FGyhj_5goO6'
            },
            {
                id: 3,
                title: 'السيرة النبوية',
                description: 'دروس من حياة النبي محمد صلى الله عليه وسلم',
                link: 'https://www.youtube.com/embed/tjp7wiUaPZk?si=QTrBLZ8nzMYXSliB'
            },
        ],
        aqeedah: [
            {
                id: 4,
                title: 'شرح العقيدة الطحاوية',
                description: 'دروس مفصلة في شرح العقيدة الطحاوية',
                link: 'https://www.youtube.com/embed/example1'
            },
        ],
        fiqh: [
            {
                id: 5,
                title: 'أحكام الصلاة',
                description: 'شرح مفصل لأحكام الصلاة في الإسلام',
                link: 'https://www.youtube.com/embed/example2'
            },
        ],
    }
    
    const handleCategoryClick = (categoryId) => {
        setActiveCategory(categoryId);
    };

    const filteredVideos = allVideos[activeCategory] || allVideos.all;
    return (
        <>
            <Header/>
            <div class="videos-header">
            <h1>مكتبة الفيديوهات الإسلامية</h1>
            <p>مجموعة مميزة من المحاضرات والدروس في علوم الشريعة والسيرة النبوية</p>
            </div>

            <div className="video-categories">
                <ul>
                    {categories.map(category => (
                        <li key={category.id}>
                            <a 
                                href="#" 
                                className={activeCategory === category.id ? 'active' : ''}
                                onClick={() => handleCategoryClick(category.id)}
                            >
                                {category.name}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>

    <section class="videos-section">
        <div class="section-title">
            <h2>فيديوهات مختارة</h2>
        </div>

        <div className="videos-grid">
                {filteredVideos.map(video => (
                    <div key={video.id} className="video-card">
                        <div className="video-thumbnail">
                            <iframe src={video.link} title={video.title} allowFullScreen></iframe>
                        </div>
                        <div className="video-info">
                            <h3 className="video-title">{video.title}</h3>
                            <p className="video-description">{video.description}</p>
                            <div className="video-meta">
                        </div>
                    </div>
                </div>
            ))}
        </div>


        <div class="pagination">
            <ul>
                <li><a href="#"><FontAwesomeIcon icon={faChevronRight} /></a></li>
                <li><a href="#" class="active">1</a></li>
                <li><a href="#">2</a></li>
                <li><a href="#">3</a></li>
                <li><a href="#">4</a></li>
                <li><a href="#"><FontAwesomeIcon icon={faChevronLeft} /></a></li>
            </ul>
        </div>
    </section>
    <Footer />
        </>
    )
}

export default Videos;