import React from 'react';
import ArQuran from "./pdfs/ar-quran.pdf";
import FrQuran from "./pdfs/fr-quran.pdf";
import './pdf.css'; // تأكد من إنشاء هذا الملف

function Pdf() {
  return (
    <>
      <div className="pdf-container">
        <embed 
          src={ArQuran} 
          type="application/pdf" 
          width="100%" 
          height="100%" 
          className="pdf-embed"
        />
      </div>
      <div className="pdf-container">
        <embed 
          src={FrQuran} 
          type="application/pdf" 
          width="100%" 
          height="100%" 
          className="pdf-embed"
        />
      </div>
    </>
  )
}

export default Pdf