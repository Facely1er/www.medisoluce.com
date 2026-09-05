/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUTH_PROVIDER?: string;
  readonly VITE_ENABLE_BILLING?: string;
  readonly VITE_APP_BASE_URL?: string;
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_STRIPE_PUBLISHABLE_KEY?: string;
  readonly VITE_STRIPE_PRICE_HIPAA_ESSENTIAL?: string;
  readonly VITE_STRIPE_PRICE_HIPAA_PROFESSIONAL?: string;
  readonly VITE_STRIPE_PRICE_RANSOMWARE_ESSENTIAL?: string;
  readonly VITE_STRIPE_PRICE_RANSOMWARE_PROFESSIONAL?: string;
  readonly VITE_STRIPE_PRICE_CONTINUITY_ESSENTIAL?: string;
  readonly VITE_STRIPE_PRICE_CONTINUITY_PROFESSIONAL?: string;
  readonly [key: string]: string | boolean | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
