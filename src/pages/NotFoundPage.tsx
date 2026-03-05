import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Home, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
            <ShieldCheck className="h-10 w-10 text-primary-500" />
          </div>
        </div>

        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button size="lg" icon={<Home className="h-4 w-4" />} iconPosition="left">
              Back to Home
            </Button>
          </Link>
          <Link to="/hipaa-check">
            <Button
              size="lg"
              variant="outline"
              icon={<ArrowLeft className="h-4 w-4" />}
              iconPosition="left"
            >
              Start HIPAA Assessment
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
