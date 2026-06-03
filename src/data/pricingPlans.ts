import { SubscriptionPlan } from '../types/laundrycloud';

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Starter Cloud',
    priceMonthly: 149000,
    priceYearly: 1490000,
    maxOutlets: 1,
    maxUsers: 2,
    maxTransactionsPerMonth: 100,
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-200',
    description: 'Sangat cocok untuk laundry rumahan atau rintisan yang baru memulai digitalisasi usaha.',
    features: [
      '1 Outlet Aktif',
      'Maksimal 2 Pengguna/Role',
      'Hingga 100 Transaksi / Bulan',
      'Sistem Kasir Utama (POS)',
      'Lacak Cucian Real-time basik',
      'Laporan Keuangan Harian',
      'Notifikasi WA Manual'
    ]
  },
  {
    id: 'basic',
    name: 'Basic Cloud',
    priceMonthly: 299000,
    priceYearly: 2990000,
    maxOutlets: 2,
    maxUsers: 5,
    maxTransactionsPerMonth: 500,
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    description: 'Pilihan terbaik untuk usaha laundry kiloan berkembang dengan kebutuhan manajemen teratur.',
    features: [
      'Hingga 2 Outlet Aktif',
      'Maksimal 5 Pengguna/Staff',
      'Hingga 500 Transaksi / Bulan',
      'Sistem Kasir Utama (POS)',
      'Simulasi Alur Kerja (Workflow)',
      'Manajemen Pelanggan & CRM',
      'Notifikasi WhatsApp Otomatis (Simulasi)',
      'Laporan Keuangan & Operasional',
      'Manajemen Inventaris Dasar'
    ]
  },
  {
    id: 'professional',
    name: 'Professional Cloud',
    priceMonthly: 599000,
    priceYearly: 5990000,
    maxOutlets: 5,
    maxUsers: 15,
    maxTransactionsPerMonth: 2000,
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    description: 'Sempurna untuk laundry profesional multi-cabang dengan volume transaksi harian tinggi.',
    features: [
      'Hingga 5 Outlet Aktif',
      'Maksimal 15 Staff / Operator',
      'Hingga 2000 Transaksi / Bulan',
      'POS Kasir Premium (QRIS Ready)',
      'Sistem Loyalty Point & Membership',
      'Promosi, Voucher & WhatsApp Otomatis',
      'Manajemen Karyawan (Fleksibel)',
      'Manajemen Inventaris Multi-gudang',
      'Laporan Pajak & Dashboard Analitik',
      'Backup Data Harian Otomatis'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise Cloud',
    priceMonthly: 1299000,
    priceYearly: 12990000,
    maxOutlets: 99,
    maxUsers: 99,
    maxTransactionsPerMonth: 99999,
    badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    description: 'Solusi terlengkap skala korporasi, franchise multi-nasional, hotel, dan laundry premium kelas atas.',
    features: [
      'Outlet Tidak Terbatas',
      'Pengguna & Staff Tidak Terbatas',
      'Transaksi Bulanan Tanpa Batas',
      'Semua Fitur Professional Cloud+',
      'Autentikasi Dua Faktor (2FA)',
      'Dedicated Cloud Database Server',
      'Integrasi Custom API Keuangan',
      'Prioritas SLA Support 24/7',
      'Manajer Akun Pendamping Khusus',
      'Backup Data Real-time Multi-region'
    ]
  }
];

export const VOUCHER_LIST = [
  { code: 'MULAIAJA', discountPercent: 15, description: 'Potongan 15% untuk langganan pertama Anda!' },
  { code: 'LAUNDRYMANTAP', discountPercent: 20, description: 'Hemat 20% khusus aktivasi paket tahunan.' },
  { code: 'SUPERADMINNEW', discountPercent: 50, description: 'Diskon admin 50% untuk uji coba internal tenant.' }
];
