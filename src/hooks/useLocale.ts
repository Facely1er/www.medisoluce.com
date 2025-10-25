import { useContext } from 'react';
import { LocaleContext, LocaleContextType } from '../components/i18n/LocaleProvider';

export const useLocale = (): LocaleContextType => {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};
