export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: 'user' | 'organization' | 'org' | 'admin';
  orgId?: string;
  orgName?: string;
  createdAt: string;
}

export interface Organization {
  id: string;
  name: string;
  logo: string;
  description: string;
  certification: string;
  contact: string;
  status: 'pending' | 'approved' | 'rejected';
}

export type ActivityStatus = 'upcoming' | 'ongoing' | 'ended';

export interface Activity {
  id: string;
  orgId: string;
  orgName: string;
  orgLogo: string;
  title: string;
  banner: string;
  description: string;
  projectName: string;
  projectDesc: string;
  targetAmount: number;
  currentAmount: number;
  participantCount: number;
  itemCount: number;
  status: ActivityStatus;
  startTime: string;
  endTime: string;
  createdAt: string;
}

export type ItemType = 'physical' | 'experience' | 'service';
export type ItemStatus = 'active' | 'sold' | 'ended';

export interface Item {
  id: string;
  activityId: string;
  donorId: string;
  donorName: string;
  donorAvatar: string;
  name: string;
  image: string;
  images: string[];
  description: string;
  type: ItemType;
  startPrice: number;
  currentPrice: number;
  buyNowPrice?: number;
  bidCount: number;
  viewerCount: number;
  status: ItemStatus;
  deliveryDesc: string;
  minIncrement: number;
  createdAt: string;
}

export interface Bid {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  itemId: string;
  activityId: string;
  amount: number;
  createdAt: string;
}

export type OrderStatus = 'pending_pay' | 'paid' | 'shipped' | 'completed' | 'cancelled';
export type OrderType = 'auction' | 'buynow';

export interface Order {
  id: string;
  userId: string;
  itemId: string;
  activityId: string;
  itemName: string;
  itemImage: string;
  itemType: ItemType;
  amount: number;
  type: OrderType;
  status: OrderStatus;
  addressId?: string;
  addressInfo?: Address;
  trackingNo?: string;
  payTime?: string;
  shipTime?: string;
  confirmTime?: string;
  donorName?: string;
  createdAt: string;
}

export interface Address {
  id: string;
  userId: string;
  recipient: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detail: string;
  isDefault: boolean;
}

export interface DonationReceipt {
  id: string;
  activityId: string;
  activityTitle: string;
  orgName: string;
  title: string;
  imageUrl: string;
  amount: number;
  project: string;
  donateTime: string;
  description: string;
}

export interface FundRecord {
  id: string;
  activityId: string;
  type: 'income' | 'expense';
  title: string;
  amount: number;
  description: string;
  createdAt: string;
}

export interface ActivityReport {
  activityId: string;
  activityTitle: string;
  totalIncome: number;
  operationCost: number;
  donationAmount: number;
  participantCount: number;
  itemCount: number;
  soldCount: number;
  bidCount: number;
  fundRecords: FundRecord[];
  receipts: DonationReceipt[];
  generatedAt: string;
}
