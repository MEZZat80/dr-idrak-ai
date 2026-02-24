import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Download, Smartphone } from 'lucide-react';
import { isPWAInstalled, showInstallPrompt } from '@/utils/pwa';

export default function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [installInfo, setInstallInfo] = useState<ReturnType<typeof showInstallPrompt>>(null);

  useEffect(() => {
    // Check if already dismissed
    const dismissed = localStorage.getItem('pwa_prompt_dismissed');
    if (dismissed) return;

    // Show after 30 seconds
    const timer = setTimeout(() => {
      const info = showInstallPrompt();
      if (info) {
        setInstallInfo(info);
        setShowPrompt(true);
      }
    }, 30000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  if (!showPrompt || !installInfo) return null;

  return (
    <Card className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto shadow-xl">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="bg-indigo-100 p-2 rounded-full shrink-0">
            <Smartphone className="w-5 h-5 text-indigo-600" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">{installInfo.title}</h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 -mr-2 -mt-2"
                onClick={handleDismiss}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <p className="text-sm text-slate-600 mt-1">
              {installInfo.message}
            </p>
            
            {installInfo.platform === 'ios' && (
              <div className="mt-3 p-2 bg-slate-50 rounded text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <span>1. Tap</span>
                  <div className="border border-slate-300 rounded px-2 py-0.5">⎋ Share</div>
                  <span>2. Scroll & tap</span>
                  <div className="border border-slate-300 rounded px-2 py-0.5">+ Add to Home Screen</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}