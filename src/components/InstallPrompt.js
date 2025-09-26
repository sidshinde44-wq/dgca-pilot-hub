// components/InstallPrompt.js
import { useEffect, useState } from 'react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handler(e) {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    }
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  async function install() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    setVisible(false);
    setDeferredPrompt(null);
    console.log('Install result:', result);
  }

  if (!visible) return null;
  return (
    <div className="install-prompt">
      <button onClick={install}>Install DGCA Pilot Hub</button>
    </div>
  );
}
