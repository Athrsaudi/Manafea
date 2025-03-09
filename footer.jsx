import './footer.css'

function Footer() {
    return (
        <footer>
      <div className="footer-content">
        <div className="footer-bottom">
          <div className="copyright">
            &copy; {new Date().getFullYear()} منصة منافع - جميع الحقوق محفوظة
          </div>
        </div>
      </div>
    </footer>
    )
}

export default Footer