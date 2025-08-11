export interface Product {
  id?: number;
  title: string;
  image: string;
  amount: number;
  is_active: boolean;
  report: string;
  type: ProductType;
}

export enum ProductType{
  Main = "Main",
  Upsell = "Upsell",
  Bundle = "Bundle"
}
