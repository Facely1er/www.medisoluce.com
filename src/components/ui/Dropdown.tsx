import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

interface DropdownItem {
  name: string;
  path: string;
  icon?: React.ReactNode;
}

interface DropdownGroup {
  title: string;
  items: DropdownItem[];
}

interface DropdownProps {
  label: string;
  icon?: React.ReactNode;
  items?: DropdownItem[];
  groups?: DropdownGroup[];
}

const Dropdown: React.FC<DropdownProps> = ({ label, icon, items, groups }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Check if any dropdown item is active
  const allItems = groups ? groups.flatMap(group => group.items) : (items || []);
  const isActive = allItems.some(item => location.pathname === item.path);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative overflow-visible" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center space-x-1 px-2.5 py-1.5 text-xs font-medium rounded transition hover:text-primary-600 dark:hover:text-primary-400 ${
          isActive
            ? 'text-primary-600 dark:text-primary-400'
            : 'text-gray-600 dark:text-gray-300'
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {icon}
        <span>{label}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-[60] overflow-visible">
          {groups ? (
            groups.map((group, groupIndex) => (
              <div key={group.title}>
                {groupIndex > 0 && <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>}
                <div className="px-4 py-2">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {group.title}
                  </h3>
                </div>
                {group.items.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-2.5 text-sm transition ${
                      location.pathname === item.path
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
            ))
          ) : (
            items?.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-3 px-4 py-2.5 text-sm transition ${
                  location.pathname === item.path
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
