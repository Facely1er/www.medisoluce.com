import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, Sun, Moon, ShieldCheck, Server, FileText, LifeBuoy, User, AlertTriangle, Home, LayoutDashboard, Wrench, Lock, ChevronDown } from 'lucide-react';
import LanguageSelector from '../language/LanguageSelector';
import NotificationCenter from '../notifications/NotificationCenter';
import Dropdown from '../ui/Dropdown';
import { useTranslation } from 'react-i18next';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const location = useLocation();
  const { t } = useTranslation();

  // Top nav: 5 items — Home, Solutions (dropdown), Demo, Dashboard, Pricing
  const primaryNavItems = [
    { name: t('nav.home'), path: '/', icon: <Home className="w-4 h-4" /> },
    { name: t('nav.demo'), path: '/demo', icon: <FileText className="w-4 h-4" /> },
    { name: t('nav.dashboard'), path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: 'Pricing', path: '/pricing', icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  // Single Solutions dropdown — grouped for clarity
  const solutionsGroups = [
    {
      title: 'Privacy & Compliance',
      items: [
        { name: 'HIPAA Assessment', path: '/hipaa-check', icon: <ShieldCheck className="w-5 h-5" /> },
        { name: 'Comprehensive Assessment', path: '/comprehensive-assessment', icon: <ShieldCheck className="w-5 h-5" /> },
        { name: 'Security Dashboard', path: '/security', icon: <ShieldCheck className="w-5 h-5" /> },
      ],
    },
    {
      title: 'Risk & Resilience',
      items: [
        { name: 'System Dependencies', path: '/dependency-manager', icon: <Server className="w-5 h-5" /> },
        { name: 'Business Impact', path: '/business-impact', icon: <FileText className="w-5 h-5" /> },
        { name: 'Ransomware Assessment', path: '/ransomware-assessment', icon: <AlertTriangle className="w-5 h-5" /> },
      ],
    },
    {
      title: 'Continuity & Recovery',
      items: [
        { name: t('nav.business_continuity'), path: '/continuity', icon: <LifeBuoy className="w-5 h-5" /> },
        { name: t('nav.resource_toolkit'), path: '/toolkit', icon: <Wrench className="w-5 h-5" /> },
      ],
    },
  ];
  // Mobile: primary links + Solutions as expandable section
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const solutionsButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setMobileSolutionsOpen(false);
  }, [location]);

  // Set aria-expanded in DOM so Edge Tools static analysis sees valid values
  useEffect(() => {
    if (menuButtonRef.current) {
      menuButtonRef.current.setAttribute('aria-expanded', isMenuOpen ? 'true' : 'false');
    }
  }, [isMenuOpen]);
  useEffect(() => {
    if (solutionsButtonRef.current) {
      solutionsButtonRef.current.setAttribute('aria-expanded', mobileSolutionsOpen ? 'true' : 'false');
    }
  }, [mobileSolutionsOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full ${isScrolled ? 'bg-white dark:bg-gray-800 shadow-md' : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-full overflow-visible">
        <div className="flex items-center gap-4 lg:gap-6 py-4 min-w-0 overflow-visible">
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
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

          {/* Desktop Navigation — 5 items: Home, Solutions, Demo, Dashboard, Pricing */}
          <nav className="hidden md:flex items-center flex-1 min-w-0 overflow-visible">
            <div className="hidden lg:flex items-center gap-0.5 flex-nowrap whitespace-nowrap min-w-0 overflow-visible">
              <Link
                key={primaryNavItems[0].path}
                to={primaryNavItems[0].path}
                className={`flex items-center space-x-1 px-2.5 py-1.5 text-xs font-medium rounded transition hover:text-primary-600 dark:hover:text-primary-400 ${
                  location.pathname === primaryNavItems[0].path
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
                data-analytics="main-navigation"
                data-nav-item={primaryNavItems[0].name}
                aria-label={`Navigate to ${primaryNavItems[0].name}`}
              >
                {primaryNavItems[0].icon}
                <span>{primaryNavItems[0].name}</span>
              </Link>
              <Dropdown
                label={t('nav.solutions')}
                icon={<Lock className="w-4 h-4" />}
                groups={solutionsGroups}
              />
              {primaryNavItems.slice(1).map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-2.5 py-1.5 text-xs font-medium rounded transition hover:text-primary-600 dark:hover:text-primary-400 ${
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
              ))}
            </div>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-3 flex-shrink-0">
              <LanguageSelector />
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
              ref={menuButtonRef}
              onClick={toggleMenu}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              aria-expanded="false"
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

      {/* Mobile Navigation — primary links + Solutions dropdown */}
      <div
        className={`md:hidden fixed top-[80px] left-0 right-0 z-40 max-h-[calc(100vh-80px)] overflow-y-auto ${
          isMenuOpen ? 'block' : 'hidden'
        } bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700`}
      >
        <div className="px-4 py-3 space-y-1">
          {primaryNavItems.map((item) => (
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
          ))}
          <div>
            <button
              ref={solutionsButtonRef}
              type="button"
              onClick={() => setMobileSolutionsOpen(!mobileSolutionsOpen)}
              className="flex items-center justify-between w-full space-x-3 px-4 py-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
              aria-expanded="false"
            >
              <span className="flex items-center space-x-3">
                <Lock className="w-5 h-5" />
                <span>{t('nav.solutions')}</span>
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${mobileSolutionsOpen ? 'rotate-180' : ''}`} />
            </button>
            {mobileSolutionsOpen && (
              <div className="pl-4 pb-2 space-y-0.5 border-l-2 border-gray-200 dark:border-gray-600 ml-4">
                {solutionsGroups.map((group) => (
                  <div key={group.title} className="pt-2">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2 pb-1">
                      {group.title}
                    </p>
                    {group.items.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-md transition ${
                          location.pathname === item.path
                            ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                        }`}
                      >
                        {item.icon}
                        <span className="text-sm">{item.name}</span>
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
          
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