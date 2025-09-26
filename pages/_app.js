// pages/_app.js
import { useEffect } from 'react';
import { Workbox } from 'workbox-window';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const wb = new Workbox('/sw.js');
      wb.addEventListener('waiting', () => {
        // show UI to user to reload and activate new SW
        if (confirm('New version available — reload to update?')) {
          wb.addEventListener('controlling', () => window.location.reload());
          wb.messageSkipWaiting();
        }
      });
      wb.register();
    }
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
