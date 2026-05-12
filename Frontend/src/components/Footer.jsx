import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaArrowUp } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'

export default function Footer() {
const { t } = useTranslation()
const [showTopBtn, setShowTopBtn] = useState(false)


// Show button after scroll 300px
useEffect(() => {
const handleScroll = () => {
if (window.scrollY > 300) setShowTopBtn(true)
else setShowTopBtn(false)
}
window.addEventListener('scroll', handleScroll)
return () => window.removeEventListener('scroll', handleScroll)
}, [])


const scrollToTop = () => {
window.scrollTo({ top: 0, behavior: 'smooth' })
}


return (
<footer className="bg-saffron-600 text-white mt-10 relative">
<div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
{/* Column 1: Logo & About */}
<div>
<h2 className="text-xl font-bold mb-3 hover:text-white transition-colors">{t('siteTitle') || 'Satya Sanatan Charcha'}</h2>
<p className="text-sm text-white/80 hover:text-white transition-colors">
{t('footer.aboutText') || 'A cultural collaborative platform preserving Hindu wisdom and fostering community dialogue for all.'}
</p>
</div>


{/* Column 2: Quick Links */}
<div>
<h3 className="font-semibold mb-3">{t('footer.linksTitle') || 'Quick Links'}</h3>
<ul className="space-y-2 text-sm text-white/80">
<li><Link to="/" className="hover:text-white transition-colors">{t('nav.home') || 'Home'}</Link></li>
<li><Link to="/library" className="hover:text-white transition-colors">{t('nav.library') || 'Library'}</Link></li>
<li><Link to="/blog" className="hover:text-white transition-colors">{t('nav.blog') || 'Blog'}</Link></li>
<li><Link to="/charcha" className="hover:text-white transition-colors">{t('nav.discussion') || 'Charcha Sabha'}</Link></li>
<li><Link to="/about" className="hover:text-white transition-colors">{t('nav.about') || 'About'}</Link></li>
</ul>
</div>


{/* Column 3: Platform */}
<div>
<h3 className="font-semibold mb-3">{t('footer.resourcesTitle') || 'Platform'}</h3>
<ul className="space-y-2 text-sm text-white/80">
<li><Link to="/request" className="hover:text-white transition-colors">{t('nav.request') || 'Request Article'}</Link></li>
<li><Link to="/niyam" className="hover:text-white transition-colors">{t('nav.rules') || 'Community Rules'}</Link></li>
<li><Link to="/communication" className="hover:text-white transition-colors">{t('footer.links.contact') || 'Contact Us'}</Link></li>
<li><Link to="/communication" className="hover:text-white transition-colors">{t('footer.links.donate') || 'Donate'}</Link></li>
</ul>
</div>


{/* Column 4: Social Media */}
<div>
<h3 className="font-semibold mb-3">{t('footer.connectTitle') || 'Follow Us'}</h3>
<div className="flex gap-3">
<a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 transition-colors" aria-label="Facebook">
<FaFacebookF size={16}/>
</a>
<a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 transition-colors" aria-label="Twitter">
<FaTwitter size={16}/>
</a>
<a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 transition-colors" aria-label="Instagram">
<FaInstagram size={16}/>
</a>
<a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 transition-colors" aria-label="YouTube">
<FaYoutube size={16}/>
</a>
</div>
</div>
</div>


{/* Bottom bar */}
<div className="border-t border-white/20 mt-6 py-4 text-center text-sm text-white/80 hover:text-white transition-colors">
&copy; {new Date().getFullYear()} {t('footer.copyright') || 'Satya Sanatan Charcha. All rights reserved.'}
</div>

{/* Back to Top Button */}
{showTopBtn && (
<button onClick={scrollToTop} className="fixed bottom-5 right-5 w-12 h-12 bg-saffron-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-saffron-600 transition transform hover:-translate-y-1" aria-label="Back to top">
<FaArrowUp />
</button>
)}
</footer>
)
}