declare const require: any;

export const environment = {
  production: false,
  appName: 'Lumcal',
  public: "/",
  private: "/painel",
  api: 'http://localhost:8000/api',
  version: require('../../package.json').version
};

