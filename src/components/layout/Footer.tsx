import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ShieldCheck, 
  Server,
  BarChart,
  LifeBuoy,
  AlertTriangle,
  BookOpen,
  Download,
  FileText,
  MessageSquare,
  Lock,
  Cookie
} from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  const footerLinks = [
    {
      title: t('footer.product'),
      links: [
        { name: t('hipaa.title'), url: '/hipaa-check', icon: <ShieldCheck className="h-4 w-4" /> },
        { name: t('dependency.title'), url: '/dependency-manager', icon: <Server className="h-4 w-4" /> },
        { name: t('impact.title'), url: '/business-impact', icon: <BarChart className="h-4 w-4" /> },
        { name: t('continuity.title'), url: '/continuity', icon: <LifeBuoy className="h-4 w-4" /> },
        { name: t('training.title'), url: '/training', icon: <BookOpen className="h-4 w-4" /> },
      ],
    },
    {
      title: t('footer.resources'),
      links: [
        { name: t('toolkit.title'), url: '/toolkit', icon: <Download className="h-4 w-4" /> },
        { name: 'HIPAA Guidance', url: 'https://www.hhs.gov/hipaa/index.html', icon: <FileText className="h-4 w-4" /> },
        { name: 'Ransomware Protection', url: '/ransomware', icon: <AlertTriangle className="h-4 w-4" /> },
        { name: 'Security Resources', url: 'https://www.hhs.gov/sites/default/files/cybersecurity-newsletter-december-2021.pdf', icon: <BookOpen className="h-4 w-4" /> },
      ],
    },
    {
      title: t('footer.company'),
      links: [
        { name: t('contact.title'), url: '/contact', icon: <MessageSquare className="h-4 w-4" /> },
        { name: 'Privacy Policy', url: '/privacy', icon: <Lock className="h-4 w-4" /> },
        { name: 'Terms of Service', url: '/terms', icon: <FileText className="h-4 w-4" /> },
        { name: 'Cookie Policy', url: '/cookie-policy', icon: <Cookie className="h-4 w-4" /> },
      ],
    },
  ];

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/medisoluce.png" 
                alt="MediSoluce Logo" 
                className="h-12 w-12"
              />
              <div className="flex flex-col leading-none">
                <span className="text-base font-heading font-bold text-primary-600 dark:text-primary-400">
                  MediSoluce™
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  by ERMITS
                </span>
              </div>
            </Link>
            <p className="mt-2 text-xs text-gray-600 dark:text-gray-300 max-w-sm leading-relaxed">
              {t('footer.description')}
            </p>

          </div>

          {footerLinks.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                {section.title}
              </h3>
              <ul className="space-y-1">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link.url.startsWith('http') ? (
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-xs text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors py-1"
                      >
                        <span className="mr-1.5 text-primary-500 flex-shrink-0">{link.icon}</span>
                        {link.name}
                      </a>
                    ) : (
                      <Link
                        to={link.url}
                        className="flex items-center text-xs text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors py-1"
                      >
                        <span className="mr-1.5 text-primary-500 flex-shrink-0">{link.icon}</span>
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-xs text-gray-500 dark:text-gray-400">
            &copy; {currentYear} ERMITS LLC. {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;