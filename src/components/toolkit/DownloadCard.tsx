import React from 'react';
import { Download, FileText, ExternalLink } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface DownloadCardProps {
  title: string;
  description: string;
  fileType: string;
  fileSize: string;
  downloadUrl: string;
  externalUrl?: string;
  icon?: React.ReactNode;
  className?: string;
}

const DownloadCard: React.FC<DownloadCardProps> = ({
  title,
  description,
  fileType,
  fileSize,
  downloadUrl,
  externalUrl,
  icon = <FileText className="h-6 w-6" />,
  className = ''
}) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `${title}.${fileType}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className={`p-6 hover:shadow-lg transition-shadow ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {description}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center space-x-1">
            <FileText className="h-4 w-4" />
            <span>{fileType.toUpperCase()}</span>
          </span>
          <span>{fileSize}</span>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <Button
          onClick={handleDownload}
          className="flex-1"
          icon={<Download className="h-4 w-4" />}
        >
          Download
        </Button>
        {externalUrl && (
          <Button
            variant="outline"
            onClick={() => window.open(externalUrl, '_blank')}
            icon={<ExternalLink className="h-4 w-4" />}
          >
            View Online
          </Button>
        )}
      </div>
    </Card>
  );
};

export default DownloadCard;
