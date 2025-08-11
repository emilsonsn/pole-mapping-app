import { ZodiacSignDetail } from "./quiz/zodiac";

export interface Client {
  id: number;
  name: string;
  email: string;
  whatsapp: number;
  zodiacSignDetail?: ZodiacSignDetail;
  sunText?: string;
  moonText?: string;
  mission?: string;
  luck?: string;
  relationships?: string
  singChartBs4?: string;
  created_at?: Date;
  updated_at?: Date;
}
