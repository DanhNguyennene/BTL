import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, BookOpen, Search, ShoppingCart, User } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Nav Items
  const navItems = [
    { link: "Home", path: '/' },
    { link: "About", path: "/about" },
    { link: "Shop", path: "/shop" },
    { link: "Blog", path: "/blog" },
    { link: "Sell Your Book", path: "/admin/dashboard" }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed w-full z-50">
      <nav
        className={`transition-all duration-300 ${
          isScrolled
            ? 'bg-white shadow-lg backdrop-blur-sm bg-opacity-90'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center space-x-2 text-blue-700 hover:text-blue-500 transition-colors"
            >
              <BookOpen className="h-6 w-6" />
              <span className="font-bold text-xl">BookStore</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map(({ link, path }) => (
                <Link
                  key={path}
                  to={path}
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors relative group"
                >
                  {link}
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                </Link>
              ))}
            </div>

            {/* Right side icons */}
            <div className="hidden md:flex items-center space-x-6">
              <button className="text-gray-600 hover:text-blue-600 transition-colors">
                <Search className="h-5 w-5" />
              </button>
              <button className="text-gray-600 hover:text-blue-600 transition-colors">
                <ShoppingCart className="h-5 w-5" />
              </button>
              <button className="text-gray-600 hover:text-blue-600 transition-colors">
                <User className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? 'max-h-screen opacity-100'
              : 'max-h-0 opacity-0 pointer-events-none'
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg">
            {navItems.map(({ link, path }) => (
              <Link
                key={path}
                to={path}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link}
              </Link>
            ))}
            <div className="flex items-center space-x-4 px-3 py-2">
              <button className="text-gray-600 hover:text-blue-600 transition-colors">
                <Search className="h-5 w-5" />
              </button>
              <button className="text-gray-600 hover:text-blue-600 transition-colors">
                <ShoppingCart className="h-5 w-5" />
              </button>
              <button className="text-gray-600 hover:text-blue-600 transition-colors">
                <User className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;