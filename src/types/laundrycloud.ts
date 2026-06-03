export interface Tenant {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  planId: 'starter' | 'basic' | 'professional' | 'enterprise';
  billingCycle: 'monthly' | 'yearly';
  status: 'active' | 'suspended' | 'trial';
  createdAt: string;
  nextBillingDate: string;
  subDomain: string;
  logoUrl?: string;
  autoRenewal: boolean;
}

export interface SubscriptionPlan {
  id: 'starter' | 'basic' | 'professional' | 'enterprise';
  name: string;
  priceMonthly: number;
  priceYearly: number;
  maxOutlets: number;
  maxUsers: number;
  maxTransactionsPerMonth: number;
  features: string[];
  badgeColor: string;
  description: string;
}

export interface Outlet {
  id: string;
  name: string;
  address: string;
  phone: string;
  managerId: string;
  isActive: boolean;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Owner' | 'Manager' | 'Kasir' | 'Operator';
  outletId: string;
  isActive: boolean;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'deterjen' | 'pewangi' | 'plastik' | 'hanger' | 'gas_air' | 'spare_parts';
  stock: number;
  minStock: number;
  unit: string;
  outletId: string;
  costPerUnit: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  membershipType: 'regular' | 'silver' | 'gold' | 'platinum';
  loyaltyPoints: number;
  totalTransactionsCount: number;
  totalSpend: number;
}

export interface ServiceItem {
  id: string;
  name: string;
  category: 'kiloan' | 'satuan' | 'sepatu_tas' | 'karpet_gorden' | 'special_care';
  price: number;
  unit: 'kg' | 'pcs' | 'psg' | 'm2';
  estimatedHours: number;
}

export type OrderStatus = 'penerimaan' | 'pencucian' | 'pengeringan' | 'penyetrikaan' | 'quality_control' | 'siap_ambil' | 'selesai';

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  role: string;
  action: string;
  details: string;
}

export interface Transaction {
  id: string;
  invoiceNo: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  outletId: string;
  outletName: string;
  operatorId?: string;
  items: {
    serviceId: string;
    serviceName: string;
    price: number;
    qty: number;
    unit: string;
    subtotal: number;
  }[];
  weightKg?: number;
  totalAmount: number;
  discountAmount: number;
  taxAmount: number;
  netAmount: number;
  paymentMethod: 'cash' | 'qris' | 'bank_transfer' | 'credit';
  paymentStatus: 'unpaid' | 'paid';
  status: OrderStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  whatsappSent: boolean;
}

export interface SaaSInvoice {
  id: string;
  invoiceNo: string;
  tenantId: string;
  businessName: string;
  planName: string;
  billingCycle: 'monthly' | 'yearly';
  amount: number;
  paymentMethod: string;
  paymentStatus: 'paid' | 'unpaid' | 'expired';
  issuedAt: string;
  dueDate: string;
}
