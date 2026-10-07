export type OrderStatus = 'RECEIVED' | 'WASHING' | 'IRONING' | 'READY' | 'DELIVERED' | 'CANCELLED';

export interface Order {
  _id?: string;
  customerName: string;
  mobile: string;
  address: string;
  serviceType: string;
  clothCount: number;
  pickupDate: string;
  pickupTime: string;
  status: OrderStatus;
  totalAmount: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}
