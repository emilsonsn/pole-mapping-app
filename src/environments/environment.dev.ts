declare const require: any;

export const environment = {
  production: true,
  appName: 'Lumcal',
  public: "/",
  private: "/painel",
  api: 'https://app.aptaimport.com.br/api',
  version: require('../../package.json').version
};

