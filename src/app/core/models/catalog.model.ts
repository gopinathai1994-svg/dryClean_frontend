export interface ServiceItem {
  _id?: string;
  name: string;
  description: string;
  icon: string;
  active?: boolean;
}

export interface PricingItem {
  _id?: string;
  item: string;
  serviceType: string;
  price: number;
  active?: boolean;
}
