import React, { useState } from 'react';
import { Transaction, Customer, InventoryItem, Outlet } from '../types/laundrycloud';
import { cn } from '../lib/utils';
import { DollarSign, ShieldAlert, ShoppingBag, Eye, Store, Group, ArrowUpRight, TrendingUp, Sparkles, Check, RefreshCw } from 'lucide-react';
import { DashboardHeroSlider } from './DashboardHeroSlider';

interface DashboardOverviewProps {
  transactions: Transaction[];
  customers: Customer[];
  inventory: InventoryItem[];
  outlets: Outlet[];
  currentOutletId: string;
  onChangeOutlet: (id: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  transactions,
  customers,
  inventory,
  outlets,
  currentOutletId,
  onChangeOutlet
}) => {
  const [supplyReportSent, setSupplyReportSent] = useState(false);

  // Filter values based on active outlet selection to showcase multi-branch capabilities
  const outletTransactions = currentOutletId === 'all' 
    ? transactions 
    : transactions.filter(t => t.outletId === currentOutletId);

  const totalSales = outletTransactions.reduce((acc, t) => acc + (t.paymentStatus === 'paid' ? t.netAmount : 0), 0);
  const unpaidSales = outletTransactions.reduce((acc, t) => acc + (t.paymentStatus === 'unpaid' ? t.netAmount : 0), 0);
  
  const completedOrdersCount = outletTransactions.filter(t => t.status === 'selesai').length;
  const activeOrdersCount = outletTransactions.filter(t => t.status !== 'selesai').length;

  // Inventory Stock alerts
  const lowStockItems = inventory.filter(item => item.stock <= item.minStock);

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="space-y-8 animate-fade-in relative z-20">
      
      {/* Premium Laundry Slider Header */}
      <DashboardHeroSlider />
      
      {/* Branch Selector Banner */}
      <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black font-display text-slate-900 flex items-center gap-1.5">
            <Store className="text-blue-600" /> Multi-Branch Command Center
          </h3>
          <p className="text-xs text-slate-500 mt-1">Ganti cabang outlet di bawah untuk memisahkan data transaksi keuangan, status cucian, dan inventori secara independen.</p>
        </div>

        <div className="inline-flex items-center gap-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-wider whitespace-nowrap">PILIH CABANG:</label>
          <select
            value={currentOutletId}
            onChange={(e) => onChangeOutlet(e.target.value)}
            className="bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-black text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Semua Cabang (Lestari Group)</option>
            {outlets.map(o => (
              <option key={o.id} value={o.id}>{o.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        
        <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Penjualan Lunas (Revenue)</span>
            <span className="text-2xl font-black text-slate-950 font-display">{formatIDR(totalSales)}</span>
            <span className="text-[10px] text-green-500 font-bold block">▲ +8.1% Hari Ini</span>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <DollarSign size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Piutang Belum Lunas</span>
            <span className="text-2xl font-black text-red-650 font-display">{formatIDR(unpaidSales)}</span>
            <span className="text-[10px] text-slate-450 block font-medium">Tagihan Cucian Unpaid</span>
          </div>
          <div className="p-3 bg-red-50 text-red-600 rounded-xl">
            <ShieldAlert size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Cucian Sedang Berjalan</span>
            <span className="text-2xl font-black text-slate-950 font-display">{activeOrdersCount} Order</span>
            <span className="text-[10px] text-slate-450 block font-medium">Masuk antrean workflow</span>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <RefreshCw size={20} className="animate-spin-slow" />
          </div>
        </div>

        <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Cucian Selesai Diserah</span>
            <span className="text-2xl font-black text-green-700 font-display">{completedOrdersCount} Order</span>
            <span className="text-[10px] text-slate-450 block font-medium">Status rampung</span>
          </div>
          <div className="p-3 bg-green-50 text-green-600 rounded-xl">
            <ShoppingBag size={20} />
          </div>
        </div>

      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Visual pure SVG Line Chart representation */}
        <div className="lg:col-span-8 bg-white border border-slate-150 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-black font-display text-slate-950">Tren Omset Keuangan Mingguan</h3>
              <p className="text-xs text-slate-500">Estimasi pertambahan omset harian seluruh cabang laundry.</p>
            </div>
            <span className="bg-blue-50 text-blue-700 text-[10px] font-black px-2.5 py-1 rounded-md">Real-time (SGD Cloud Sync)</span>
          </div>

          {/* Simple Vector Graph using pure SVG to keep build ultra-stable! */}
          <div className="relative h-64 w-full bg-slate-50/50 rounded-2xl border p-4 flex flex-col justify-between">
            <svg viewBox="0 0 700 200" className="w-full h-full text-blue-500 shrink-0">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.2"/>
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0"/>
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="50" x2="700" y2="50" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="5,5" />
              <line x1="0" y1="100" x2="700" y2="100" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="5,5" />
              <line x1="0" y1="150" x2="700" y2="150" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="5,5" />

              {/* Spline Area */}
              <path
                d="M 10 160 Q 120 120 220 130 T 430 70 T 580 40 T 690 60 L 690 190 L 10 190 Z"
                fill="url(#chartGrad)"
              />

              {/* Spline Line */}
              <path
                d="M 10 160 Q 120 120 220 130 T 430 70 T 580 40 T 690 60"
                fill="none"
                stroke="#2563eb"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Data Node Points */}
              <circle cx="220" cy="130" r="5" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
              <circle cx="430" cy="70" r="5" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
              <circle cx="580" cy="40" r="5" fill="#eab308" stroke="#ffffff" strokeWidth="2" /> {/* Highlight high point */}
              <circle cx="690" cy="60" r="5" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
            </svg>

            {/* X Axis Labels */}
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold font-mono pt-2 border-t border-slate-100">
              <span>Senin (28/05)</span>
              <span>Selasa (29/05)</span>
              <span>Rabu (30/05)</span>
              <span>Kamis (31/05)</span>
              <span>Jumat (01/06)</span>
              <span>Sabtu (02/06)</span>
              <span>Hari Ini</span>
            </div>
          </div>
        </div>

        {/* Low Inventory Stock alerts and order supply CRM simulator */}
        <div className="lg:col-span-4 bg-white border border-slate-150 rounded-3xl p-6 shadow-sm space-y-6 flex flex-col justify-between">
          
          <div className="space-y-4">
            <h3 className="text-md font-black font-display text-slate-900 flex items-center gap-1.5">
              <ShieldAlert className="text-red-650" size={17} /> Peringatan Stok Bahan Baku
            </h3>
            <p className="text-xs text-slate-500">Mendeteksi stok deterjen, parfum laundry, atau hanger yang berada di bawah level aman minimum di outlet.</p>

            <div className="space-y-2.5">
              {lowStockItems.length > 0 ? (
                lowStockItems.map((item) => (
                  <div key={item.id} className="bg-red-50/50 border border-red-150 p-4 rounded-xl flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="font-bold text-xs text-red-950 block">{item.name}</span>
                      <span className="text-[10px] text-red-650 block font-semibold font-mono">
                        Stok Kritis: {item.stock} {item.unit} (Min: {item.minStock})
                      </span>
                    </div>
                    <span className="bg-red-200 text-red-800 text-[9px] px-2 py-0.5 rounded font-black uppercase">
                      Hampir Habis
                    </span>
                  </div>
                ))
              ) : (
                <div className="bg-green-50 text-green-800 p-4 rounded-xl text-xs font-semibold text-center">
                  ✓ Semua stok bahan baku berada pada tingkat aman.
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-6 md:mt-0 space-y-3">
            {supplyReportSent ? (
              <div className="bg-green-50 border border-green-200 p-3 rounded-xl flex items-center gap-2 text-xs text-green-850 font-bold">
                <Check size={16} className="text-green-600" />
                <span>Simulasi re-order supplier terkirim!</span>
              </div>
            ) : (
              <button
                onClick={() => setSupplyReportSent(true)}
                className="w-full bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white font-black py-3 rounded-xl text-xs uppercase tracking-wider transition-all text-center"
              >
                Kirim Laporan Pengadaan
              </button>
            )}
            <p className="text-[10px] text-slate-400 text-center leading-normal">
              Fitur ini mengirim daftar belanja bahan baku otomatis ke supplier terdaftar via WA/Email API.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
