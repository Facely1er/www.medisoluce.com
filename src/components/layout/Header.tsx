import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, Sun, Moon, ShieldCheck, Server, FileText, LifeBuoy, User } from 'lucide-react';
import LanguageSelector from '../language/LanguageSelector';
import NotificationCenter from '../notifications/NotificationCenter';
import { useTranslation } from 'react-i18next';
import { Home } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const location = useLocation();
  const { t } = useTranslation();

  const navigationItems = [
    { name: t('nav.home'), path: '/', icon: <Home className="w-5 h-5" /> },
    { name: t('nav.demo'), path: '/demo', icon: <FileText className="w-5 h-5" /> },
    { name: t('nav.hipaa_assessment'), path: '/hipaa-check', icon: <ShieldCheck className="w-5 h-5" /> },
    { name: t('nav.system_dependencies'), path: '/dependency-manager', icon: <Server className="w-5 h-5" /> },
    { name: t('nav.business_continuity'), path: '/continuity', icon: <LifeBuoy className="w-5 h-5" /> },
    { name: t('nav.resource_toolkit'), path: 'https://toolkit.medisoluce.com', icon: <FileText className="w-5 h-5" /> },
    { name: t('nav.dashboard'), path: '/dashboard', icon: <FileText className="w-5 h-5" /> },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };


  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white dark:bg-gray-800 shadow-md' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/medisoluce.png" 
              alt="MediSoluce Logo" 
              className="h-12 w-auto flex-shrink-0"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-lg font-heading font-bold text-primary-600 dark:text-primary-400">
                MediSoluce™
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                by ERMITS
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center justify-center flex-1">
            <div className="hidden lg:flex space-x-3">
              {navigationItems.map((item) => (
                item.path.startsWith('http') ? (
                  <a
                    key={item.path}
                    href={item.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center space-x-1 px-2 py-1 text-sm font-medium rounded transition hover:text-primary-600 dark:hover:text-primary-400 text-gray-600 dark:text-gray-300 text-center`}
                    data-analytics="external-navigation"
                    data-nav-item={item.name}
                    aria-label={`Navigate to ${item.name} (opens in new tab)`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </a>
                ) : (
                  <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-center space-x-1 px-2 py-1 text-sm font-medium rounded transition hover:text-primary-600 dark:hover:text-primary-400 text-center ${
                    location.pathname === item.path
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-600 dark:text-gray-300'
                  }`}
                  data-analytics="main-navigation"
                  data-nav-item={item.name}
                  aria-label={`Navigate to ${item.name}`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                  </Link>
                )
              ))}
            </div>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-3 flex-shrink-0">
              <LanguageSelector className="mr-2" />
              <NotificationCenter />
              
              {user && (
                <div className="flex items-center space-x-3">
                  <Link 
                    to="/profile"
                    className="text-sm text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 flex items-center"
                  >
                    <User className="h-4 w-4 mr-1" />
                    Profile
                  </Link>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {user.email}
                  </span>
                  <button
                    onClick={signOut}
                    className="text-sm text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    Sign Out
                  </button>
                </div>
              )}
              
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? (
                  <Moon className="h-5 w-5 text-gray-600" />
                ) : (
                  <Sun className="h-5 w-5 text-gray-300" />
                )}
              </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-3 md:hidden">
            <LanguageSelector className="mr-2" />
            <NotificationCenter />
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5 text-gray-600" />
              ) : (
                <Sun className="h-5 w-5 text-gray-300" />
              )}
            </button>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden ${
          isMenuOpen ? 'block' : 'hidden'
        } bg-white dark:bg-gray-800 shadow-lg`}
      >
        <div className="px-4 py-3 space-y-1">
          {navigationItems.map((item) => (
            item.path.startsWith('http') ? (
              <a
                key={item.path}
                href={item.path}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 px-4 py-3 rounded-md transition hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
              >
                {item.icon}
                <span>{item.name}</span>
              </a>
            ) : (
              <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-md transition ${
                location.pathname === item.path
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
              </Link>
            )
          ))}
          
          {user && (
            <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
              <Link 
                to="/profile"
                className="block px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md mb-2"
              >
                <User className="h-4 w-4 mr-2 inline" />
                Profile Settings
              </Link>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                Signed in as {user.email}
              </p>
              <button
                onClick={signOut}
                className="text-sm text-accent-600 dark:text-accent-400 hover:text-accent-700 dark:hover:text-accent-300"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;