import React, { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Award, Download, Share2 } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { useAuth } from '../../context/AuthContext';

const moduleInfoMap: Record<string, { title: string; certification: string; hours: string }> = {
  'hipaa-basics': {
    title: 'HIPAA Compliance Fundamentals',
    certification: 'HIPAA Compliance Specialist',
    hours: '2',
  },
  'dependency-management': {
    title: 'Technology Dependency Management',
    certification: 'Healthcare Technology Manager',
    hours: '1.5',
  },
  'business-continuity': {
    title: 'Business Continuity Planning',
    certification: 'Business Continuity Professional',
    hours: '2.5',
  },
  'ransomware-protection': {
    title: 'Ransomware Protection Strategies',
    certification: 'Cybersecurity Healthcare Professional',
    hours: '3',
  },
};

const Certificate: React.FC = () => {
  const { t } = useTranslation();
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const certificateRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const moduleInfo = moduleInfoMap[moduleId || 'hipaa-basics'] ?? moduleInfoMap['hipaa-basics'];
  const completionDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const displayName = user?.email
    ? user.email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    : 'Healthcare Professional';

  const certificateId = `${(moduleId || 'cert').toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

  const handleDownload = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${moduleInfo.certification} Certificate`,
        text: `I've completed ${moduleInfo.title} training and earned my ${moduleInfo.certification} certificate on MediSoluce!`,
      });
    }
  };

  return (
    <>
      <style>{`
        @media print {
          body > * { visibility: hidden !important; }
          #certificate-print-area,
          #certificate-print-area * { visibility: visible !important; }
          #certificate-print-area {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            padding: 40px !important;
          }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="py-8 min-w-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-full">
          <div className="max-w-5xl mx-auto min-w-0">

            {/* Actions */}
            <Card className="mb-6 p-4 sm:p-6 no-print">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-xl sm:text-2xl font-heading font-bold text-gray-900 dark:text-white mb-1 break-words">
                    {t('training.certificate.congratulations')}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 break-words">
                    {t('training.certificate.earned')} {moduleInfo.certification}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/training')}
                  >
                    {t('training.back_to_modules')}
                  </Button>
                  {navigator.share && (
                    <Button
                      variant="outline"
                      onClick={handleShare}
                      icon={<Share2 className="h-5 w-5" />}
                    >
                      {t('training.certificate.share')}
                    </Button>
                  )}
                  <Button
                    onClick={handleDownload}
                    icon={<Download className="h-5 w-5" />}
                    className="bg-gradient-to-r from-success-500 to-success-600"
                  >
                    {t('training.certificate.download')}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Certificate */}
            <div
              id="certificate-print-area"
              ref={certificateRef}
              className="bg-white p-4 sm:p-8 lg:p-12 rounded-lg shadow-2xl border-4 sm:border-8 border-double border-primary-600 min-w-0 max-w-full overflow-hidden"
            >
              <div className="text-center mb-6 sm:mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 mb-4 sm:mb-6">
                  <Award className="h-10 w-10 sm:h-16 sm:w-16 text-white" />
                </div>
                <h1 className="text-2xl sm:text-4xl font-heading font-bold text-gray-900 mb-2 break-words">
                  Certificate of Completion
                </h1>
                <p className="text-base sm:text-xl text-gray-600 break-words">
                  MediSoluce Healthcare Compliance Platform
                </p>
              </div>

              <div className="border-t-2 border-b-2 border-gray-300 py-6 sm:py-8 mb-6 sm:mb-8">
                <p className="text-center text-base sm:text-lg text-gray-700 mb-3 sm:mb-4">
                  This certifies that
                </p>
                <h2 className="text-center text-2xl sm:text-4xl font-heading font-bold text-primary-700 mb-3 sm:mb-4 break-words px-2">
                  {displayName}
                </h2>
                <p className="text-center text-base sm:text-lg text-gray-700 mb-2">
                  has successfully completed
                </p>
                <h3 className="text-center text-lg sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4 break-words px-2">
                  {moduleInfo.title}
                </h3>
                <p className="text-center text-sm sm:text-base text-gray-600 break-words">
                  {moduleInfo.hours} hours of comprehensive healthcare compliance training
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-4 sm:px-12 mb-6 sm:mb-8">
                <div className="text-center">
                  <div className="h-px w-32 sm:w-48 bg-gray-400 mb-2 mx-auto" />
                  <p className="text-sm font-medium text-gray-700">Date of Completion</p>
                  <p className="text-gray-600 text-sm break-words">{completionDate}</p>
                </div>
                <div className="text-center">
                  <div className="h-px w-32 sm:w-48 bg-gray-400 mb-2 mx-auto" />
                  <p className="text-sm font-medium text-gray-700">Authorized By</p>
                  <p className="text-gray-600 text-sm">MediSoluce Platform</p>
                </div>
              </div>

              <div className="text-center pt-4 sm:pt-6 border-t border-gray-300 min-w-0">
                <p className="text-sm text-gray-600 mb-2 break-words">
                  <strong>Certification:</strong> {moduleInfo.certification}
                </p>
                <p className="text-xs text-gray-500 max-w-xl mx-auto break-words px-2">
                  This certificate verifies completion of training requirements and demonstrates
                  understanding of healthcare compliance principles. Valid for one year from date of issue.
                </p>
              </div>

              <div className="mt-4 sm:mt-6 text-center min-w-0 overflow-x-auto">
                <p className="text-xs text-gray-400 font-mono break-all">
                  Certificate ID: {certificateId}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Certificate;
