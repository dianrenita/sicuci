import React, { useState } from 'react';
import { SUBSCRIPTION_PLANS, VOUCHER_LIST } from '../data/pricingPlans';
import { SubscriptionPlan, Tenant, SaaSInvoice } from '../types/laundrycloud';
import { CheckCircle2, Ticket, CreditCard, Sparkles, AlertCircle, FileText, Download, Check } from 'lucide-react';
import { cn } from '../lib/utils';

interface SaaSPricingCardProps {
  onSubscribe: (plan: SubscriptionPlan, cycle: 'monthly' | 'yearly', totalAmount: number, code: string) => void;
  activePlanId: string;
}

export const SaaSPricingCard: React.FC<SaaSPricingCardProps> = ({ onSubscribe, activePlanId }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(SUBSCRIPTION_PLANS[2]); // Default professional
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [invoicePreview, setInvoicePreview] = useState<{
    invoiceNo: string;
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
  } | null>(null);

  const calculatePrice = (plan: SubscriptionPlan) => {
    const base = billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly;
    const discount = base * (discountPercent / 100);
    const afterDiscount = base - discount;
    const tax = afterDiscount * 0.11; // 11% PPN
    const total = afterDiscount + tax;

    return {
      subtotal: base,
      discount,
      tax,
      total: Math.round(total)
    };
  };

  const handleApplyPromo = () => {
    setPromoError('');
    setPromoSuccess('');
    const matched = VOUCHER_LIST.find(v => v.code.toUpperCase() === promoCode.trim().toUpperCase());
    if (matched) {
      setDiscountPercent(matched.discountPercent);
      setPromoSuccess(`Kupon '${matched.code}' aktif! Menghemat ${matched.discountPercent}%. ${matched.description}`);
    } else {
      setDiscountPercent(0);
      setPromoError('Kode promo tidak valid atau telah kedaluwarsa.');
    }
  };

  const handleCheckoutSubmit = () => {
    const calc = calculatePrice(selectedPlan);
    onSubscribe(selectedPlan, billingCycle, calc.total, promoCode.trim().toUpperCase() || 'NONE');
    setInvoicePreview({
      invoiceNo: `LC/INV/${Math.floor(100000 + Math.random() * 900000)}`,
      subtotal: calc.subtotal,
      discount: calc.discount,
      tax: calc.tax,
      total: calc.total
    });
  };

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title block */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 transform translate-x-4 -translate-y-4 opacity-10">
          <CreditCard size={320} />
        </div>
        
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="bg-yellow-400 text-slate-900 font-extrabold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm animate-pulse inline-block">
            SaaS Billing Simulator
          </span>
          <h2 className="text-3xl md:text-5xl font-black font-display leading-tight">
            Subscription Management & Billing Center
          </h2>
          <p className="text-blue-100/90 text-sm md:text-base font-medium leading-relaxed">
            Pilihlah lisensi bulanan/tahunan terbaik untuk bisnis laundry Anda. Simulasikan perubahan billing, aplikasikan kode promo beruntun, serta cetak invoice otomatis dalam sistem multi-tenant LaundryCloud.
          </p>
        </div>
      </div>

      {/* Cycle switcher and Promo code apply */}
      <div className="grid md:grid-cols-12 gap-6 items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="md:col-span-6 space-y-2">
          <label className="text-xs font-black uppercase tracking-wider text-slate-500 block">Siklus Penagihan</label>
          <div className="inline-flex bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            <button
              onClick={() => { setBillingCycle('monthly'); setPromoError(''); setPromoSuccess(''); }}
              className={cn(
                "px-5 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap",
                billingCycle === 'monthly' ? "bg-white text-blue-700 shadow-sm font-extrabold" : "text-slate-500 hover:text-slate-800"
              )}
            >
              Bulanan
            </button>
            <button
              onClick={() => { setBillingCycle('yearly'); setPromoError(''); setPromoSuccess(''); }}
              className={cn(
                "px-5 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5",
                billingCycle === 'yearly' ? "bg-white text-blue-700 shadow-sm font-extrabold" : "text-slate-500 hover:text-slate-800"
              )}
            >
              <span>Tahunan</span>
              <span className="bg-green-150 text-green-700 text-[9px] px-1.5 py-0.5 rounded-md font-bold">Hemat 20%</span>
            </button>
          </div>
        </div>

        <div className="md:col-span-6 space-y-2">
          <label className="text-xs font-black uppercase tracking-wider text-slate-500 block">Voucher Eksklusif SaaS</label>
          <div className="flex gap-2">
            <div className="relative flex-grow">
              <Ticket className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Contoh: MULAIAJA atau LAUNDRYMANTAP"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2.5 rounded-xl text-xs font-black uppercase focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
              />
            </div>
            <button
              onClick={handleApplyPromo}
              className="bg-slate-900 border border-slate-800 text-white font-bold px-4 py-2 text-xs rounded-xl hover:bg-slate-800 transition-all active:scale-95 whitespace-nowrap"
            >
              Terapkan
            </button>
          </div>
          {promoError && <p className="text-red-500 text-[10px] font-bold flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {promoError}</p>}
          {promoSuccess && <p className="text-green-600 text-[10px] font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> {promoSuccess}</p>}
        </div>
      </div>

      {/* Grid of pricing cards */}
      <div className="grid lg:grid-cols-4 gap-6">
        {SUBSCRIPTION_PLANS.map((plan) => {
          const isActive = activePlanId.toLowerCase() === plan.id.toLowerCase();
          const isSelected = selectedPlan.id === plan.id;
          const calc = calculatePrice(plan);

          return (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan)}
              className={cn(
                "border rounded-2xl p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between relative",
                isSelected 
                  ? "border-blue-500 ring-2 ring-blue-500/10 shadow-lg scale-102 bg-white" 
                  : "border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-350"
              )}
            >
              {/* Highlight Ribbon */}
              {plan.id === 'professional' && (
                <div className="absolute -top-3 right-4 bg-blue-600 text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-sm">
                  REKOMENDASI
                </div>
              )}

              {/* Header block */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className={cn("text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-md border", plan.badgeColor)}>
                    {plan.name}
                  </span>
                  {isActive && (
                    <span className="bg-green-100 text-green-700 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                      ✓ Aktif
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 font-medium line-clamp-2 h-10">{plan.description}</p>
                
                {/* Dynamically simulated price based on selected cycle and promo discounts */}
                <div className="pt-2">
                  {discountPercent > 0 ? (
                    <div className="space-y-1">
                      <span className="text-xs text-red-500 font-bold line-through">
                        {formatIDR(billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly)}
                      </span>
                      <div className="flex items-end gap-1">
                        <span className="text-2xl font-black text-slate-900 font-display">
                          {formatIDR(calc.subtotal * (1 - discountPercent / 100))}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold font-mono">
                          /{billingCycle === 'monthly' ? 'bln' : 'thn'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-end gap-1">
                      <span className="text-2xl font-black text-slate-900 font-display">
                        {formatIDR(billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly)}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold font-mono">
                        /{billingCycle === 'monthly' ? 'bln' : 'thn'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Plan Limits block */}
              <div className="my-6 py-4 border-y border-slate-100 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-semibold">Toko/Outlet:</span>
                  <strong className="text-slate-800 font-black">{plan.maxOutlets === 99 ? 'Unlimited' : `${plan.maxOutlets} Cabang`}</strong>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-semibold">Staff Karyawan:</span>
                  <strong className="text-slate-800 font-black">{plan.maxUsers === 99 ? 'Unlimited' : `${plan.maxUsers} Staff`}</strong>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-semibold">Kuota Transaksi:</span>
                  <strong className="text-slate-800 font-black">{plan.maxTransactionsPerMonth === 99999 ? 'Unlimited' : `${plan.maxTransactionsPerMonth} tx/bln`}</strong>
                </div>
              </div>

              {/* Feature Checklist */}
              <div className="space-y-2.5 flex-grow">
                {plan.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2 text-[11px] text-slate-600 font-medium">
                    <CheckCircle2 size={13} className="text-blue-500 mt-0.5 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPlan(plan);
                  handleCheckoutSubmit();
                }}
                className={cn(
                  "w-full py-3 rounded-xl text-xs font-black mt-6 transition-all transform active:scale-95 text-center flex items-center justify-center gap-1.5",
                  isSelected 
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-100" 
                    : "bg-white border border-slate-200 hover:border-slate-350 text-slate-700"
                )}
              >
                <span>{isActive ? 'Simulasikan Upgrade' : 'Pilih Paket Ini'}</span>
                <Sparkles size={13} className="text-amber-300 animate-pulse" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Bill summary and PDF simulator invoice section if generated */}
      {invoicePreview && (
        <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl space-y-6 max-w-2xl mx-auto border border-slate-800 animate-scale-up">
          <div className="flex justify-between items-start">
            <div>
              <span className="bg-green-500 text-slate-950 font-black text-[9px] uppercase px-2.5 py-1 rounded-md tracking-wider">
                TRANSAKSI SIMULASI BERHASIL
              </span>
              <h3 className="text-xl font-bold font-display mt-2">Detail Tagihan Invoice</h3>
              <p className="text-xs text-slate-450 font-mono mt-1">{invoicePreview.invoiceNo}</p>
            </div>
            <button 
              onClick={() => alert(`Mengunduh Invoice PDF Resmi untuk ${selectedPlan.name}... (Simulasi Berhasil)`)}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all flex items-center gap-1 text-[11px] font-bold"
            >
              <Download size={14} /> PDF
            </button>
          </div>

          <div className="space-y-3 text-xs border-y border-slate-800 py-4">
            <div className="flex justify-between">
              <span className="text-slate-400 font-semibold">Paket Terpilih:</span>
              <span className="font-bold">{selectedPlan.name} ({billingCycle === 'monthly' ? 'Bulanan' : 'Tahunan'})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-semibold">Subtotal:</span>
              <span className="font-mono">{formatIDR(invoicePreview.subtotal)}</span>
            </div>
            {invoicePreview.discount > 0 && (
              <div className="flex justify-between text-green-400 font-semibold">
                <span>Diskon Kupon ({discountPercent}%):</span>
                <span className="font-mono">-{formatIDR(invoicePreview.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-400 font-semibold">Pajak Negara (PPN 11%):</span>
              <span className="font-mono">{formatIDR(invoicePreview.tax)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-850 text-base font-extrabold text-yellow-300">
              <span>Total Bayar:</span>
              <span className="font-mono">{formatIDR(invoicePreview.total)}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400 bg-slate-850 p-4 rounded-xl border border-slate-800">
            <Check size={18} className="text-green-500 shrink-0" />
            <p className="leading-relaxed">
              Selamat! Tenant akun Anda telah berhasil terdaftar ke paket <strong>{selectedPlan.name}</strong>. Lisensi Anda diaktifkan hingga <strong>{billingCycle === 'monthly' ? 'sebulan' : 'setahun'} ke depan</strong>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
