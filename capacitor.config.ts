import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pole.mapping',
  appName: 'pole-mapping-app',
  webDir: 'dist/pole-mapping-app/browser',
  // bundledWebRuntime: false
  server: {
    url: 'http://192.168.0.11:4200',
    cleartext: true
  }
};

export default config;
