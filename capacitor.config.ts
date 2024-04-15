import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'de.empathylink.app',
  appName: 'Empathy-Link',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;