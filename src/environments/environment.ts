declare const require: any;

export const environment = {
  production: true,
  appName: 'Lumcal',
  public: "/",
  private: "/painel",
  api: 'https://app.aptaimport.com.br/api',
  // api: 'http://192.168.0.8:8000/api',
  version: require('../../package.json').version
};
