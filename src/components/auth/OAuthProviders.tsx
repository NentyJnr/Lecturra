import React, { useState } from 'react';
import { Info, X } from 'lucide-react';

interface OAuthProvidersProps {
  actionLabel?: string;
  onProviderClick?: (provider: string) => void;
}

export const OAuthProviders: React.FC<OAuthProvidersProps> = ({
  actionLabel = 'continue with',
  onProviderClick,
}) => {
  const [providerNotice, setProviderNotice] = useState<string | null>(null);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const microsoftClientId = import.meta.env.VITE_MICROSOFT_CLIENT_ID;

  const handleGoogleAuth = () => {
    if (onProviderClick) {
      onProviderClick('Google OAuth');
      return;
    }

    if (googleClientId) {
      const redirectUri = `${window.location.origin}/auth/google/callback`;
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&response_type=code&scope=openid%20email%20profile`;
      window.location.href = googleAuthUrl;
    } else {
      setProviderNotice(
        'Google OAuth requires running the backend API (Lectura.Api) on port 5000 and setting VITE_GOOGLE_CLIENT_ID in .env'
      );
    }
  };

  const handleMicrosoftAuth = () => {
    if (onProviderClick) {
      onProviderClick('Microsoft Entra ID');
      return;
    }

    if (microsoftClientId) {
      const redirectUri = `${window.location.origin}/auth/microsoft/callback`;
      const msAuthUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${microsoftClientId}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&response_type=code&scope=openid%20email%20profile`;
      window.location.href = msAuthUrl;
    } else {
      setProviderNotice(
        'Microsoft Entra ID OAuth requires running the backend API (Lectura.Api) on port 5000 and setting VITE_MICROSOFT_CLIENT_ID in .env'
      );
    }
  };

  return (
    <div className="space-y-4 pt-2">
      {/* Provider Notice Alert */}
      {providerNotice && (
        <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-xs flex items-start justify-between gap-2 shadow-xs">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <span>{providerNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setProviderNotice(null)}
            className="text-blue-500 hover:text-blue-700 p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Divider */}
      <div className="relative flex items-center justify-center">
        <div className="border-t border-lectura-slate-200 w-full" />
        <span className="bg-white px-3 text-xs font-semibold text-lectura-slate-600 uppercase tracking-wider absolute">
          Or {actionLabel}
        </span>
      </div>

      {/* Social / Enterprise OAuth Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          className="flex items-center justify-center gap-2.5 px-4 py-3 bg-white border border-lectura-slate-200 rounded-xl hover:bg-lectura-slate-50 active:bg-lectura-slate-100 text-lectura-slate-800 font-semibold text-sm shadow-xs transition-all border-slate-200 hover:border-slate-300 cursor-pointer"
        >
          <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>Google</span>
        </button>

        {/* Microsoft Entra ID Button */}
        <button
          type="button"
          onClick={handleMicrosoftAuth}
          className="flex items-center justify-center gap-2.5 px-4 py-3 bg-white border border-lectura-slate-200 rounded-xl hover:bg-lectura-slate-50 active:bg-lectura-slate-100 text-lectura-slate-800 font-semibold text-sm shadow-xs transition-all border-slate-200 hover:border-slate-300 cursor-pointer"
        >
          <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 23 23">
            <path fill="#F25022" d="M1 1h10v10H1z" />
            <path fill="#7FBA00" d="M12 1h10v10H12z" />
            <path fill="#00A4EF" d="M1 12h10v10H1z" />
            <path fill="#FFB900" d="M12 12h10v10H12z" />
          </svg>
          <span>Microsoft</span>
        </button>
      </div>
    </div>
  );
};
