
import { sdk } from 'https://esm.sh/@farcaster/miniapp-sdk';

window.addEventListener('load', () => {
  (async () => {
    try {
      const isMiniApp = await sdk.isInMiniApp();
      console.log('[LuckyDraw] isInMiniApp =', isMiniApp);

      const envLabel = document.getElementById('env-label');
      const footerModeEl = document.getElementById('footer-mode');
      if (envLabel) {
        envLabel.textContent = isMiniApp ? 'mini app' : 'web';
      }
      if (footerModeEl) {
        footerModeEl.textContent = 'Mode: ' + (isMiniApp ? 'mini app' : 'web');
      }

      if (isMiniApp) {
        await sdk.actions.ready();
        console.log('[LuckyDraw] ready() called, splash should be hidden');
      }
    } catch (error) {
      console.error('[LuckyDraw] SDK error or not in Mini App context:', error);
    }
  })();
});
