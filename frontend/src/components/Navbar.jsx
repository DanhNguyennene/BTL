import React, { useEffect, useState } from 'react';
import { Link, useNavigate,useLocation } from 'react-router-dom';
import { Menu, X, BookOpen, Search, ShoppingCart, User, LogOut  } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMenuUsers, setShowMenuUsers] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const {userInfo, isAuthenticated, logout, isEmployee, isCustomer} = useAuth();
  const location = useLocation();
  const navigate = useNavigate();


  const handleLogout  = () => {
    logout();
    navigate('/signin');
    setShowMenuUsers(false);
  };

  const fetchCartCount = async () => {
    if (isAuthenticated && isCustomer && userInfo?.username) {
      try {
        const response = await fetch(`http://localhost:5000/api/books/cart/${userInfo.username}`);
        const data = await response.json();
        setCartItemCount(data.length);
      } catch (error) {
        console.error('Failed to fetch cart count:', error);
        setCartItemCount(0);
      }
    }
  };
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetchCartCount();
  }, [isAuthenticated, isCustomer, userInfo?.username,location.pathname]);
  // Nav Items
  const navItems = [
    { link: "Home", path: isAuthenticated? `/${userInfo.username}/` : '/' },
    { link: "Shop", path: isAuthenticated?`/${userInfo.username}/shop` : '/shop' },
  ];

  const renderAuthenticatedMenu = () => {
    if (isCustomer){
      return (
        <div className='absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1'>
          <Link
            to={`/${userInfo.username}/customer-dashboard`}
            onClick={() => setShowMenuUsers(false)}
            className='block px-4 py-2 text-lg text-gray-600 hover:bg-gray-200 mx-px'
          >
            Dashboard
          </Link>
          <button
            onClick={handleLogout}
            className='w-full text-left px-4 py-2 text-lg text-gray-600 hover:bg-gray-200 mx-px'
          >
            LogOut
          </button>
        </div>
      )
    }


    if (isEmployee){
      return (
        <div className='absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1'>
          <Link
            to={`/${userInfo.username}/employee-dashboard`}
            onClick={() => setShowMenuUsers(false)}
            className='block px-4 py-2 text-lg text-gray-600 hover:bg-gray-200 mx-px'
          >
            Dashboard
          </Link>
          <button
            onClick={handleLogout}
            className='w-full text-left px-4 py-2 text-lg text-gray-600 hover:bg-gray-200 mx-px'
          >
            LogOut
          </button>
        </div>
      )
    }

    return(
      <div className='absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1'>
        <Link
          to='/signin'
          onClick={() => setShowMenuUsers(!showMenuUsers)}
        className='block px-4 py-2 text-lg text-gray-600 hover:bg-gray-200 mx-px'>
          Sign in 
        </Link>
        <Link 
          to='/signup'
          onClick={() => setShowMenuUsers(!showMenuUsers)}
        className='block px-4 py-2 text-lg text-gray-600 hover:bg-gray-200 mx-px'>
          Sign up
        </Link>
      </div>
    )
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  

  return (
    <header className="fixed w-full z-50">
      <nav className={`transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-lg backdrop-blur-sm bg-opacity-90' : 'bg-transparent'
      }`}>  
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to={isAuthenticated? `/${userInfo.username}/` : '/'} className="flex items-center space-x-2 text-blue-700 hover:text-blue-500 transition-colors">
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
              {isCustomer && (
                <Link 
                  to={`/${userInfo?.username}/cart`}
                  className="text-gray-600 hover:text-blue-600 transition-colors relative"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
              )}
              
              <div className='relative'>
                <button 
                  className="text-gray-600 hover:text-blue-600 transition-colors flex items-center space-x-2"
                  onClick={() => setShowMenuUsers(!showMenuUsers)}
                >
                  <User className="h-5 w-5" />
                  {isAuthenticated && (
                    <span className="text-sm font-medium">{userInfo?.username}</span>
                  )}
                </button>
                
                {showMenuUsers && renderAuthenticatedMenu()}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        }`}>
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
                  {isCustomer && (
                    <Link 
                      to={`/${userInfo?.username}/cart`}
                      className="text-gray-600 hover:text-blue-600 transition-colors relative"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <ShoppingCart className="h-5 w-5" />
                      {cartItemCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                          {cartItemCount}
                        </span>
                      )}
                    </Link>
                  )}
              {isAuthenticated ? (  
                <>
                  <Link 
                    to={`/${userInfo?.username}/${isCustomer ? 'customer' : 'employee'}-dashboard`}
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-5 w-5" />
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <Link 
                  to="/signin"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-5 w-5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;