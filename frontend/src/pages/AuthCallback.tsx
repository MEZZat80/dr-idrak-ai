import { useEffect } from 'react';
import { client } from '@/lib/api';

export default function AuthCallback() {
  useEffect(() => {
    const handleAuth = async () => {
      try {
        await client.auth.login();
        window.location.href = '/';
      } catch (error) {
        console.error('Authentication error:', error);
        window.location.href = '/';
      }
    };

    handleAuth();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-lg text-slate-700">Authenticating...</p>
      </div>
    </div>
  );
}