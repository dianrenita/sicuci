import { Tenant, Outlet, Employee, InventoryItem, Customer, ServiceItem, Transaction, AuditLog, SaaSInvoice } from '../types/laundrycloud';

export const INITIAL_TENANTS: Tenant[] = [
  {
    id: 'T-001',
    businessName: 'Lestari Laundry Group',
    ownerName: 'Dian Renita',
    email: 'dianrenitaa@gmail.com',
    phone: '081234567890',
    planId: 'professional',
    billingCycle: 'monthly',
    status: 'active',
    createdAt: '2026-01-10',
    nextBillingDate: '2026-07-10',
    subDomain: 'lestari',
    autoRenewal: true
  },
  {
    id: 'T-002',
    businessName: 'Berkah Laundry Solo',
    ownerName: 'Hendra Wijaya',
    email: 'hendraw@gmail.com',
    phone: '085721345678',
    planId: 'basic',
    billingCycle: 'yearly',
    status: 'active',
    createdAt: '2025-11-20',
    nextBillingDate: '2026-11-20',
    subDomain: 'berkahsolo',
    autoRenewal: true
  },
  {
    id: 'T-003',
    businessName: 'Hotel Royal Cleaners',
    ownerName: 'Michael Tan',
    email: 'm.tan@hotels.com',
    phone: '081198887766',
    planId: 'enterprise',
    billingCycle: 'monthly',
    status: 'active',
    createdAt: '2026-03-01',
    nextBillingDate: '2026-07-01',
    subDomain: 'royalclean',
    autoRenewal: true
  },
  {
    id: 'T-004',
    businessName: 'Koin Koin Express',
    ownerName: 'Saskia Putri',
    email: 'saskia@koinkoin.com',
    phone: '089922233344',
    planId: 'starter',
    billingCycle: 'monthly',
    status: 'suspended',
    createdAt: '2026-02-15',
    nextBillingDate: '2026-05-15',
    subDomain: 'koinkoin',
    autoRenewal: false
  }
];

export const INITIAL_SAAS_INVOICES: SaaSInvoice[] = [
  {
    id: 'INV-S-001',
    invoiceNo: 'LC/2026/05/1029',
    tenantId: 'T-001',
    businessName: 'Lestari Laundry Group',
    planName: 'Professional Cloud',
    billingCycle: 'monthly',
    amount: 599000,
    paymentMethod: 'Midtrans QRIS',
    paymentStatus: 'paid',
    issuedAt: '2026-05-10',
    dueDate: '2026-05-15'
  },
  {
    id: 'INV-S-002',
    invoiceNo: 'LC/2025/11/0432',
    tenantId: 'T-002',
    businessName: 'Berkah Laundry Solo',
    planName: 'Basic Cloud',
    billingCycle: 'yearly',
    amount: 2990000,
    paymentMethod: 'Bank Transfer Mandiri',
    paymentStatus: 'paid',
    issuedAt: '2025-11-20',
    dueDate: '2025-11-25'
  },
  {
    id: 'INV-S-003',
    invoiceNo: 'LC/2026/05/1031',
    tenantId: 'T-003',
    businessName: 'Hotel Royal Cleaners',
    planName: 'Enterprise Cloud',
    billingCycle: 'monthly',
    amount: 1299000,
    paymentMethod: 'Automatic Credit Card Charge',
    paymentStatus: 'paid',
    issuedAt: '2026-05-01',
    dueDate: '2026-05-05'
  },
  {
    id: 'INV-S-004',
    invoiceNo: 'LC/2026/05/1020',
    tenantId: 'T-004',
    businessName: 'Koin Koin Express',
    planName: 'Starter Cloud',
    billingCycle: 'monthly',
    amount: 149000,
    paymentMethod: 'E-Wallet OVO',
    paymentStatus: 'expired',
    issuedAt: '2026-05-15',
    dueDate: '2026-05-20'
  }
];

export const INITIAL_OUTLETS: Outlet[] = [
  { id: 'O-001', name: 'Lestari Pusat - Tebet', address: 'Jl. Tebet Raya No. 12, Jakarta Selatan', phone: '081211112222', managerId: 'E-002', isActive: true },
  { id: 'O-002', name: 'Lestari Cabang - Kemang', address: 'Jl. Kemang Selatan III No. 8A, Jakarta Selatan', phone: '081233334444', managerId: 'E-003', isActive: true },
  { id: 'O-003', name: 'Lestari Express - Depok', address: 'Jl. Margonda Raya No. 45, Kecamatan Beji, Depok', phone: '081255556666', managerId: 'E-003', isActive: true }
];

export const INITIAL_EMPLOYEES: Employee[] = [
  { id: 'E-001', name: 'Dian Renita', email: 'dianrenitaa@gmail.com', phone: '081211119999', role: 'Owner', outletId: 'O-001', isActive: true },
  { id: 'E-002', name: 'Rahmat Subagyo', email: 'rahmats@laundry.com', phone: '081222229999', role: 'Manager', outletId: 'O-001', isActive: true },
  { id: 'E-003', name: 'Siti Sarah', email: 'sitisarah@laundry.com', phone: '081233339999', role: 'Manager', outletId: 'O-002', isActive: true },
  { id: 'E-004', name: 'Agus Salim', email: 'aguss@laundry.com', phone: '081244449999', role: 'Kasir', outletId: 'O-001', isActive: true },
  { id: 'E-005', name: 'Ahmad Fikri', email: 'ahmadf@laundry.com', phone: '081255559999', role: 'Operator', outletId: 'O-001', isActive: true },
  { id: 'E-006', name: 'Doni Pratama', email: 'donip@laundry.com', phone: '081266669999', role: 'Operator', outletId: 'O-002', isActive: true }
];

export const INITIAL_SERVICES: ServiceItem[] = [
  { id: 'S-001', name: 'Cuci Kering Setrika Reguler', category: 'kiloan', price: 9000, unit: 'kg', estimatedHours: 72 },
  { id: 'S-002', name: 'Cuci Kering Setrika Express', category: 'kiloan', price: 15000, unit: 'kg', estimatedHours: 24 },
  { id: 'S-003', name: 'Setrika Saja (Lipat Rapi)', category: 'kiloan', price: 6000, unit: 'kg', estimatedHours: 48 },
  { id: 'S-004', name: 'Kemeja / Blazer (Satuan)', category: 'satuan', price: 20000, unit: 'pcs', estimatedHours: 48 },
  { id: 'S-005', name: 'Bed Cover Large (Satuan)', category: 'satuan', price: 35000, unit: 'pcs', estimatedHours: 72 },
  { id: 'S-006', name: 'Sepatu Sneaker Canvas', category: 'sepatu_tas', price: 50000, unit: 'psg', estimatedHours: 96 },
  { id: 'S-007', name: 'Karpet Bulu Domba (Premium)', category: 'karpet_gorden', price: 25000, unit: 'm2', estimatedHours: 120 }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  { id: 'C-001', name: 'Ahmad Sudjatmiko', phone: '081245678901', email: 'ahmad.sud@gmail.com', address: 'Apartemen Kebagusan City No. 120', membershipType: 'gold', loyaltyPoints: 450, totalTransactionsCount: 18, totalSpend: 820000 },
  { id: 'C-002', name: 'Citra Kirana', phone: '081577778888', email: 'citrakrn@yahoo.com', address: 'Cluster Alam Hijau No. B5, Bintaro', membershipType: 'platinum', loyaltyPoints: 920, totalTransactionsCount: 34, totalSpend: 1540000 },
  { id: 'C-003', name: 'Rendy Pangalila', phone: '087855554444', email: 'rendyp@outlook.com', address: 'Jl. Kramat No. 14, Jakarta Pusat', membershipType: 'silver', loyaltyPoints: 120, totalTransactionsCount: 6, totalSpend: 240000 },
  { id: 'C-004', name: 'Lala Karmela', phone: '081299990000', email: 'lala.k@gmail.com', address: 'Townhouse Kemang Regency No. 4', membershipType: 'regular', loyaltyPoints: 30, totalTransactionsCount: 2, totalSpend: 75000 }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'I-001', name: 'Deterjen Cair Scented Lavender (5L)', category: 'deterjen', stock: 12, minStock: 5, unit: 'jerigen', outletId: 'O-001', costPerUnit: 120000 },
  { id: 'I-002', name: 'Pewangi Sakura Premium (5L)', category: 'pewangi', stock: 4, minStock: 5, unit: 'jerigen', outletId: 'O-001', costPerUnit: 145000 }, // Warning low stock!
  { id: 'I-003', name: 'Plastik Packing Jumbo (Pack of 100)', category: 'plastik', stock: 25, minStock: 10, unit: 'pack', outletId: 'O-001', costPerUnit: 35000 },
  { id: 'I-004', name: 'Hanger Kawat Baja (Pack of 50)', category: 'hanger', stock: 18, minStock: 10, unit: 'pack', outletId: 'O-001', costPerUnit: 40000 },
  { id: 'I-005', name: 'Gas LPG Pertamina (12Kg)', category: 'gas_air', stock: 8, minStock: 3, unit: 'tabung', outletId: 'O-001', costPerUnit: 160000 }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'TX-1001',
    invoiceNo: 'TXN/260531/12301',
    customerId: 'C-001',
    customerName: 'Ahmad Sudjatmiko',
    customerPhone: '081245678901',
    outletId: 'O-001',
    outletName: 'Lestari Pusat - Tebet',
    operatorId: 'E-005',
    items: [
      { serviceId: 'S-001', serviceName: 'Cuci Kering Setrika Reguler', price: 9000, qty: 5, unit: 'kg', subtotal: 45000 }
    ],
    weightKg: 5,
    totalAmount: 45000,
    discountAmount: 0,
    taxAmount: 4500, // 10%
    netAmount: 49500,
    paymentMethod: 'cash',
    paymentStatus: 'paid',
    status: 'selesai',
    createdAt: '2026-05-31 10:24:00',
    updatedAt: '2026-06-03 14:00:00',
    whatsappSent: true
  },
  {
    id: 'TX-1002',
    invoiceNo: 'TXN/260601/12302',
    customerId: 'C-002',
    customerName: 'Citra Kirana',
    customerPhone: '081577778888',
    outletId: 'O-001',
    outletName: 'Lestari Pusat - Tebet',
    operatorId: 'E-005',
    items: [
      { serviceId: 'S-002', serviceName: 'Cuci Kering Setrika Express', price: 15000, qty: 8, unit: 'kg', subtotal: 120000 },
      { serviceId: 'S-005', serviceName: 'Bed Cover Large (Satuan)', price: 35000, qty: 1, unit: 'pcs', subtotal: 35000 }
    ],
    weightKg: 8,
    totalAmount: 155000,
    discountAmount: 15500, // Silver Coupon
    taxAmount: 13950,
    netAmount: 153450,
    paymentMethod: 'qris',
    paymentStatus: 'paid',
    status: 'quality_control',
    notes: 'Kemeja sutra jangan dicampur deterjen keras. Gunakan pewangi sakura.',
    createdAt: '2026-06-01 14:15:00',
    updatedAt: '2026-06-02 16:30:00',
    whatsappSent: true
  },
  {
    id: 'TX-1003',
    invoiceNo: 'TXN/260602/12303',
    customerId: 'C-003',
    customerName: 'Rendy Pangalila',
    customerPhone: '087855554444',
    outletId: 'O-001',
    outletName: 'Lestari Pusat - Tebet',
    items: [
      { serviceId: 'S-006', serviceName: 'Sepatu Sneaker Canvas', price: 50000, qty: 2, unit: 'psg', subtotal: 100000 }
    ],
    totalAmount: 100000,
    discountAmount: 0,
    taxAmount: 10000,
    netAmount: 110000,
    paymentMethod: 'bank_transfer',
    paymentStatus: 'unpaid',
    status: 'pencucian',
    notes: 'Ada noda lumpur membandel di sol bawah.',
    createdAt: '2026-06-02 09:00:00',
    updatedAt: '2026-06-02 10:15:00',
    whatsappSent: false
  },
  {
    id: 'TX-1004',
    invoiceNo: 'TXN/260603/12304',
    customerId: 'C-004',
    customerName: 'Lala Karmela',
    customerPhone: '081299990000',
    outletId: 'O-002',
    outletName: 'Lestari Cabang - Kemang',
    items: [
      { serviceId: 'S-004', serviceName: 'Kemeja / Blazer (Satuan)', price: 20000, qty: 3, unit: 'pcs', subtotal: 60000 }
    ],
    totalAmount: 60000,
    discountAmount: 5000,
    taxAmount: 5500,
    netAmount: 60500,
    paymentMethod: 'cash',
    paymentStatus: 'paid',
    status: 'penerimaan',
    createdAt: '2026-06-03 08:30:00',
    updatedAt: '2026-06-03 08:35:00',
    whatsappSent: true
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  { id: 'L-001', timestamp: '2026-06-03 08:30:00', userId: 'E-004', userName: 'Agus Salim', role: 'Kasir', action: 'CREATE_TRANSACTION', details: 'Membuat invoice baru TXN/260603/12304 untuk pelanggan Lala Karmela.' },
  { id: 'L-002', timestamp: '2026-06-03 08:15:30', userId: 'E-002', userName: 'Rahmat Subagyo', role: 'Manager', action: 'ADJUST_INVENTORY', details: 'Menyesuaikan stok unit Deterjen Cair Scented Lavender (5L) dari 14 ke 12.' },
  { id: 'L-003', timestamp: '2026-06-02 16:30:00', userId: 'E-005', userName: 'Ahmad Fikri', role: 'Operator', action: 'UPDATE_WORKFLOW', details: 'Mengubah status transaksi Citra Kirana (TX-1002) menjadi Quality Control.' },
  { id: 'L-004', timestamp: '2026-06-01 22:00:15', userId: 'SYSTEM', userName: 'Audit Engine', role: 'System', action: 'AUTO_BACKUP', details: 'Sistem berhasil mencadangkan database tenant secara cloud ke region AWS RDS (Sg).' }
];
