import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pole.mapping',
  appName: 'pole-mapping-app',
  webDir: 'dist/pole-mapping-app/browser',
  // server: { androidScheme: 'https' }
  server: { url: 'http://192.168.0.7:4200', cleartext: true }
};

export default config;
