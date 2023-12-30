import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'rest-food',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
