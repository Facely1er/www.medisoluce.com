import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, RefreshCw } from 'lucide-react';
import Button from './Button';
import { useToast } from './Toast';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const ServiceWorkerManager: React.FC = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    // VitePWA handles service worker registration automatically
    // We just need to listen for updates
    if ('serviceWorker' in navigator) {
      // Wait for service worker to be ready
      navigator.serviceWorker.ready.then((registration) => {
        console.log('Service Worker ready:', registration);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setUpdateAvailable(true);
              }
            });
          }
        });
      }).catch((error) => {
        console.error('Service Worker ready check failed:', error);
      });

      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setUpdateAvailable(true);
      });

      // Check for updates periodically
      setInterval(() => {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          registrations.forEach(registration => {
            registration.update();
          });
        });
      }, 60000); // Check every minute
    }

    // PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleUpdate = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => {
          registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
        });
      });
      window.location.reload();
    }
  };

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        showToast({
          type: 'success',
          title: 'App Installed',
          message: 'MediSoluce has been installed on your device.'
        });
      }
      
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {updateAvailable && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 left-4 z-50"
          >
            <div className="bg-primary-500 text-white p-4 rounded-lg shadow-lg max-w-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium mb-1">Update Available</h4>
                  <p className="text-sm text-primary-100 mb-3">
                    A new version of MediSoluce is ready to install.
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="!bg-white !text-primary-600 !border-white hover:!bg-primary-50 hover:!text-primary-700"
                    onClick={handleUpdate}
                    icon={<RefreshCw className="h-4 w-4" />}
                  >
                    Update Now
                  </Button>
                </div>
                <button
                  onClick={() => setUpdateAvailable(false)}
                  className="text-primary-100 hover:text-white ml-2"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isInstallable && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 left-4 z-50"
          >
            <div className="bg-secondary-500 text-white p-4 rounded-lg shadow-lg max-w-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium mb-1">Install App</h4>
                  <p className="text-sm text-secondary-100 mb-3">
                    Install MediSoluce for quick access and offline features.
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="!bg-white !text-secondary-600 !border-white hover:!bg-secondary-50 hover:!text-secondary-700"
                    onClick={handleInstall}
                    icon={<Download className="h-4 w-4" />}
                  >
                    Install
                  </Button>
                </div>
                <button 
                  onClick={() => setIsInstallable(false)}
                  className="text-secondary-100 hover:text-white ml-2"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ServiceWorkerManager; 