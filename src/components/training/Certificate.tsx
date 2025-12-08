import React, { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Award, Download, Share2 } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';

const Certificate: React.FC = () => {
  const { t } = useTranslation();
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const certificateRef = useRef<HTMLDivElement>(null);

  // Get module info and progress from localStorage
  const getModuleInfo = () => {
    const modules: Record<string, any> = {
      'hipaa-basics': {
        title: 'HIPAA Compliance Fundamentals',
        certification: 'HIPAA Compliance Specialist',
        hours: '2',
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      }
    };
    return modules[moduleId || 'hipaa-basics'];
  };

  const moduleInfo = getModuleInfo();
  const userName = 'Healthcare Professional'; // In production, get from user profile

  const handleDownload = () => {
    // In production, generate actual PDF
    // For now, use browser print dialog
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${moduleInfo.certification} Certificate`,
        text: `I've completed ${moduleInfo.title} training and earned my ${moduleInfo.certification} certificate!`,
      });
    }
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Actions */}
          <Card className="mb-6 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                  {t('training.certificate.congratulations')}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('training.certificate.earned')} {moduleInfo.certification}
                </p>
              </div>
              <div className="flex items-center gap-3">
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
          <div ref={certificateRef} className="bg-white p-12 rounded-lg shadow-2xl border-8 border-double border-primary-600 print:border-primary-800">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 mb-6">
                <Award className="h-16 w-16 text-white" />
              </div>
              <h1 className="text-4xl font-heading font-bold text-gray-900 mb-2">
                Certificate of Completion
              </h1>
              <p className="text-xl text-gray-600">
                MediSoluce Healthcare Compliance Platform
              </p>
            </div>

            <div className="border-t-2 border-b-2 border-gray-300 py-8 mb-8">
              <p className="text-center text-lg text-gray-700 mb-6">
                This certifies that
              </p>
              <h2 className="text-center text-4xl font-heading font-bold text-primary-700 mb-6">
                {userName}
              </h2>
              <p className="text-center text-lg text-gray-700 mb-2">
                has successfully completed
              </p>
              <h3 className="text-center text-2xl font-semibold text-gray-900 mb-6">
                {moduleInfo.title}
              </h3>
              <p className="text-center text-gray-600">
                {moduleInfo.hours} hours of comprehensive training
              </p>
            </div>

            <div className="flex items-center justify-between px-12 mb-8">
              <div className="text-center">
                <div className="h-px w-48 bg-gray-400 mb-2"></div>
                <p className="text-sm font-medium text-gray-700">
                  Date of Completion
                </p>
                <p className="text-gray-600">
                  {moduleInfo.date}
                </p>
              </div>
              <div className="text-center">
                <div className="h-px w-48 bg-gray-400 mb-2"></div>
                <p className="text-sm font-medium text-gray-700">
                  Authorized By
                </p>
                <p className="text-gray-600">
                  MediSoluce Platform
                </p>
              </div>
            </div>

            <div className="text-center pt-8 border-t border-gray-300">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Certification:</strong> {moduleInfo.certification}
              </p>
              <p className="text-xs text-gray-500">
                This certificate verifies completion of training requirements and demonstrates
                understanding of healthcare compliance principles. Valid for one year from date of issue.
              </p>
            </div>

            {/* Certificate ID */}
            <div className="mt-8 text-center">
              <p className="text-xs text-gray-400 font-mono">
                Certificate ID: {moduleId?.toUpperCase()}-{Date.now().toString(36).toUpperCase()}
              </p>
            </div>
          </div>

          {/* Print Styles */}
          <style>{`
            @media print {
              body * {
                visibility: hidden;
              }
              ${certificateRef.current && `
                [ref] * {
                  visibility: visible;
                }
              `}
              .print\\:border-primary-800 {
                border-color: #1e40af !important;
              }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
};

export default Certificate;

