import { Link } from 'react-router-dom';


export const Footer = () => {
    return (
        <footer className="bg-primary-light text-text pt-16 mt-20">
            {/* Back to top (Optional, but amazon style usually has one. keeping it simple for now) */}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Column 1 */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg mb-2 text-text">Get to Know Us</h3>
                        <ul className="space-y-2 text-sm text-text-muted">
                            <li><Link to="#" className="hover:underline hover:text-text">About ElecStore</Link></li>
                            <li><Link to="#" className="hover:underline hover:text-text">Careers</Link></li>
                            <li><Link to="#" className="hover:underline hover:text-text">Press Releases</Link></li>
                            <li><Link to="#" className="hover:underline hover:text-text">ElecStore Science</Link></li>
                        </ul>
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg mb-2 text-text">Connect with Us</h3>
                        <ul className="space-y-2 text-sm text-text-muted">
                            <li><Link to="#" className="hover:underline hover:text-text">Facebook</Link></li>
                            <li><Link to="#" className="hover:underline hover:text-text">Twitter</Link></li>
                            <li><Link to="#" className="hover:underline hover:text-text">Instagram</Link></li>
                        </ul>
                    </div>

                    {/* Column 3 */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg mb-2 text-text">Let Us Help You</h3>
                        <ul className="space-y-2 text-sm text-text-muted">
                            <li><Link to="#" className="hover:underline hover:text-text">Your Account</Link></li>
                            <li><Link to="#" className="hover:underline hover:text-text">Returns Centre</Link></li>
                            <li><Link to="#" className="hover:underline hover:text-text">100% Purchase Protection</Link></li>
                            <li><Link to="#" className="hover:underline hover:text-text">ElecStore App Download</Link></li>
                            <li><Link to="#" className="hover:underline hover:text-text">Help</Link></li>
                        </ul>
                    </div>

                    {/* Column 4 */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg mb-2 text-text">Contact Us</h3>
                        <ul className="space-y-2 text-sm text-text-muted">
                            <li className="flex gap-2">
                                <span className="font-medium text-text">Location:</span>
                                <span>007, Beach rd, Visakhapatnam</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="font-medium text-text">Email:</span>
                                <a href="mailto:elecstore@gmail.com" className="hover:underline hover:text-text">elecstore@gmail.com</a>
                            </li>
                            <li className="flex gap-2">
                                <span className="font-medium text-text">Ph.no:</span>
                                <a href="tel:+919876543210" className="hover:underline hover:text-text">+91 98765 43210</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>



            {/* Copyright Area */}
            <div className="bg-primary-dark py-4 text-center text-xs text-white/90">
                <div className="max-w-7xl mx-auto px-4">
                    <p>© 2025 ElecStore. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};
