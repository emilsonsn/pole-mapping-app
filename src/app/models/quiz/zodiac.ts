export interface ZodiacSignDetail {
  icon: string;
  short_description: string;
  description: string;
}

export interface ZodiacSignData {
  zodiacSign: string;
  zodiacSignDetail: ZodiacSignDetail;
}


export interface ZodiacData {
  day_birth: string|number;
  month_birth: string|number;
  year_birth: string|number;
  zodiacSign?: ZodiacSignData;
  address: any;
  birth_hour?: string;
  hour_birth?: string|number;
  minute_birth?: string|number;
  gender: string;
  email: string;
  ddi: string;
  phone: string;
  name: string;
}
