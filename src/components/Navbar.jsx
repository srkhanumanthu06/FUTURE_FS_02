import { useState } from 'react';
import { ShoppingBag, Menu, X, Search, User, HelpCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Button } from './ui/Button';

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { cartCount, setIsCartOpen } = useCart();
    const navigate = useNavigate();

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Shop', path: '/shop' },
        { name: 'Mobiles', path: '/shop?category=mobiles' },
        { name: 'Laptops', path: '/shop?category=laptops' },
        { name: 'Tablets', path: '/shop?category=tablets' },
        { name: 'Audio', path: '/shop?category=audio' },
        { name: 'Wearables', path: '/shop?category=wearables' },
    ];

    return (
        <header className="fixed w-full z-50">


            {/* Main Navbar */}
            <nav className="bg-surface/95 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Left Section: Logo + Nav Links */}
                        <div className="flex items-center gap-12">
                            {/* Logo */}
                            <Link to="/" className="text-2xl font-serif font-bold text-primary tracking-tight flex items-center gap-2">
                                <img src="/logo.png" alt="ElecStore" className="h-8 w-auto" />
                                ElecStore
                            </Link>

                            {/* Desktop Navigation */}
                            <div className="hidden lg:flex items-center gap-6">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        className="text-sm font-medium text-text hover:text-primary transition-colors hover:bg-black/5 px-3 py-2 rounded-md"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Right Icons */}
                        <div className="hidden md:flex items-center gap-4">
                            {/* Search Pill */}
                            <div className="relative hidden xl:block">
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    const query = e.target.search.value.trim();
                                    if (query) {
                                        navigate(`/shop?search=${encodeURIComponent(query)}`);
                                    }
                                }}>
                                    <input
                                        name="search"
                                        type="text"
                                        placeholder="Search"
                                        className="bg-transparent border border-transparent hover:border-text-muted focus:border-text-muted transition-colors rounded-full py-1.5 px-4 pl-10 w-48 text-sm outline-none placeholder:text-text-muted text-text"
                                    />
                                    <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary">
                                        <Search size={18} />
                                    </button>
                                </form>
                            </div>
                            {/* Mobile/Tablet Search Icon */}
                            <button className="xl:hidden text-text hover:text-primary transition-colors p-2">
                                <Search size={20} />
                            </button>

                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="relative text-text hover:text-primary transition-colors p-2"
                            >
                                <ShoppingBag size={20} />
                                {cartCount > 0 && (
                                    <span className="absolute top-0 right-0 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                        {cartCount}
                                    </span>
                                )}
                            </button>

                            {/* Login/User */}
                            <div className="group relative">
                                <button className="text-text hover:text-primary transition-colors p-2">
                                    <User size={20} />
                                </button>
                                {/* Simple Dropdown Preview */}
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-xl rounded-lg p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100 transform origin-top-right z-50">
                                    <p className="font-serif font-bold text-lg mb-2">My Account</p>
                                    <Link to="/login">
                                        <Button className="w-full text-xs py-2 mb-2">Log in / Sign up</Button>
                                    </Link>
                                    <Link to="/orders" className="block text-sm text-text-muted hover:text-primary py-1">Orders</Link>
                                    <Link to="/wishlist" className="block text-sm text-text-muted hover:text-primary py-1">Wishlist</Link>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="lg:hidden flex items-center">
                            <button onClick={() => setIsOpen(!isOpen)} className="text-text p-2">
                                {isOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="lg:hidden bg-surface border-b border-gray-100 shadow-xl">
                    <div className="px-4 pt-2 pb-6 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="block text-text font-medium hover:text-primary py-3 px-2 border-b border-gray-50"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <button
                            onClick={() => { setIsCartOpen(true); setIsOpen(false); }}
                            className="flex w-full items-center space-x-4 py-3 px-2"
                        >
                            <ShoppingBag size={20} className="text-text" />
                            <span className="text-text font-medium">Cart ({cartCount})</span>
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
};
