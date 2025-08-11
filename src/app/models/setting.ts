export interface Setting {
  id: number,
  company_name: string,
  company_url: string,
  company_email: string,
  company_phone: string,
  company_bio: string,
  tema: string,
  logo: string,
  footer_text: string,
  api_key: string,
  bearer_token: string
}

export enum SettingThemes {
  LIGHT = 'light',
  DARK = 'dark',
}
