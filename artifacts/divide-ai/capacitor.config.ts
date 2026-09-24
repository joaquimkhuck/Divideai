import type { CapacitorConfig } from '@capacitor/cli';

// Casca Capacitor do front atual (React + Vite). O front continua sendo a
// fonte de verdade — este arquivo só empacota o build (`dist/public`) pro
// iOS. Ver docs/plano-lancamento-apple.md.
const config: CapacitorConfig = {
  appId: 'net.divideai.app',
  appName: 'Divide Aí',
  webDir: 'dist/public',
  ios: {
    contentInset: 'automatic',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 300,
      backgroundColor: '#F6F5F2',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
};

export default config;
