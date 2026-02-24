// PWA Registration
export function registerPWA() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered:', registration);
        })
        .catch((error) => {
          console.log('SW registration failed:', error);
        });
    });
  }
}

// Check if app is installed
export function isPWAInstalled(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true;
}

// Prompt for installation (iOS)
export function showInstallPrompt() {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);
  
  if (isPWAInstalled()) return null;
  
  if (isIOS) {
    return {
      title: 'Install Dr. Idrak',
      message: 'Tap the share button and then "Add to Home Screen" to install Dr. Idrak as an app.',
      platform: 'ios'
    };
  }
  
  if (isAndroid) {
    return {
      title: 'Install Dr. Idrak',
      message: 'Tap the menu button and then "Add to Home screen" to install Dr. Idrak as an app.',
      platform: 'android'
    };
  }
  
  return {
    title: 'Install Dr. Idrak',
    message: 'Install this app on your device for quick access.',
    platform: 'desktop'
  };
}