import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-dark text-white">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">T</span>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold font-[var(--font-serif)] leading-tight">Times News</h2>

                            </div>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Your trusted source for breaking news, in-depth analysis, and comprehensive coverage of events shaping our world.
                        </p>
                        <div className="flex gap-3 mt-5">
                            {[
                                { Icon: FaFacebookF, label: 'Facebook' },
                                { Icon: FaTwitter, label: 'Twitter' },
                                { Icon: FaInstagram, label: 'Instagram' },
                                { Icon: FaYoutube, label: 'YouTube' }
                            ].map(({ Icon, label }) => (
                                <button key={label} aria-label={label} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary active:bg-primary transition-colors min-w-[44px] min-h-[44px]">
                                    <Icon size={14} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-primary">Quick Links</h3>
                        <ul className="space-y-2.5">
                            <li><Link to="/" className="text-gray-400 text-sm hover:text-primary transition-colors">Home</Link></li>
                            <li><Link to="/about-us" className="text-gray-400 text-sm hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link to="/contact" className="text-gray-400 text-sm hover:text-primary transition-colors">Contact</Link></li>
                            <li><Link to="/advertise" className="text-gray-400 text-sm hover:text-primary transition-colors">Advertise</Link></li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-primary">Categories</h3>
                        <ul className="space-y-2.5">
                            {['Politics', 'Sports', 'Technology', 'Entertainment', 'Business'].map((item) => (
                                <li key={item}>
                                    <Link to={`/category/${item.toLowerCase()}`} className="text-gray-400 text-sm hover:text-primary transition-colors">{item}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-primary">Stay Updated</h3>
                        <p className="text-gray-400 text-sm mb-4">Subscribe to our newsletter for the latest news delivered to your inbox.</p>
                        <div className="flex">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="flex-1 px-4 py-3 bg-white/10 border border-white/10 rounded-l-lg text-base text-white placeholder:text-gray-500 focus:outline-none focus:border-primary transition-colors"
                            />
                            <button className="px-5 py-3 bg-primary hover:bg-primary-dark active:bg-primary-dark text-white text-sm font-medium rounded-r-lg transition-colors min-h-[48px]">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-xs">© {new Date().getFullYear()} Times News. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link to="/privacy-policy" className="text-gray-500 text-xs hover:text-primary transition-colors">Privacy Policy</Link>
                        <Link to="/terms-of-service" className="text-gray-500 text-xs hover:text-primary transition-colors">Terms of Service</Link>
                        <a href="/cookie-policy" className="text-gray-500 text-xs hover:text-primary transition-colors">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
