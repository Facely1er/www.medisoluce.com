import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  const footerLinks = [
    {
      title: t('footer.product'),
      links: [
        { name: t('hipaa.title'), url: '/hipaa-check' },
        { name: 'Comprehensive Assessment', url: '/comprehensive-assessment' },
        { name: 'Security Dashboard', url: '/security' },
        { name: t('dependency.title'), url: '/dependency-manager' },
        { name: t('impact.title'), url: '/business-impact' },
        { name: t('continuity.title'), url: '/continuity' },
        { name: t('training.title'), url: '/training' },
      ],
    },
    {
      title: t('footer.resources'),
      links: [
        { name: t('toolkit.title'), url: '/toolkit' },
        { name: 'HIPAA Guidance', url: 'https://www.hhs.gov/hipaa/index.html' },
        { name: 'Ransomware Protection', url: '/ransomware' },
        { name: 'Security Resources', url: 'https://www.hhs.gov/sites/default/files/cybersecurity-newsletter-december-2021.pdf' },
      ],
    },
    {
      title: t('footer.company'),
      links: [
        { name: t('contact.title'), url: '/contact' },
        { name: 'FAQ', url: '/faq' },
        { name: 'Privacy Policy', url: '/privacy' },
        { name: 'Terms of Service', url: '/terms' },
        { name: 'E-Commerce Policy', url: '/ecommerce-policy' },
        { name: 'Cookie Policy', url: '/cookie-policy' },
      ],
    },
  ];

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6">
          <div className="flex-shrink-0">
            <Link to="/" className="inline-flex items-center gap-1.5">
              <img src="/icons/icon-192x192.png" alt="MediSoluce Logo" className="h-8 w-8" />
              <span className="text-sm font-heading font-bold text-primary-600 dark:text-primary-400">MediSoluce™</span>
            </Link>
            <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400 max-w-[200px] leading-snug">
              {t('footer.description')}
            </p>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-3 sm:gap-x-8">
            {footerLinks.map((section, sectionIndex) => (
              <div key={sectionIndex} className="min-w-0">
                <h3 className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                  {section.title}
                </h3>
                <ul className="space-y-0.5">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      {link.url.startsWith('http') ? (
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                        >
                          {link.name}
                        </a>
                      ) : (
                        <Link
                          to={link.url}
                          className="text-[11px] text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                        >
                          {link.name}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-[11px] text-gray-400 dark:text-gray-500">
            &copy; {currentYear} ERMITS LLC. {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;