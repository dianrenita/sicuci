import React, { useState, useEffect } from 'react';
import { SUBSCRIPTION_PLANS, VOUCHER_LIST } from '../data/pricingPlans';
import { SubscriptionPlan, Tenant } from '../types/laundrycloud';
import { 
  CheckCircle2, 
  Ticket, 
  CreditCard, 
  Sparkles, 
  AlertCircle, 
  Download, 
  Check, 
  X, 
  User, 
  Building, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Calendar,
  Gift,
  HelpCircle,
  HelpCircle as ScentIcon
} from 'lucide-react';
import { cn } from '../lib/utils';

interface SaaSPricingCardProps {
  onSubscribe: (
    plan: SubscriptionPlan, 
    cycle: 'monthly' | 'yearly', 
    totalAmount: number, 
    code: string,
    customDetails?: {
      businessName: string;
      ownerName: string;
      email: string;
      phone: string;
      subDomain: string;
    }
  ) => void;
  activePlanId: string;
  activeTenant?: Tenant;
}

export const SaaSPricingCard: React.FC<SaaSPricingCardProps> = ({ onSubscribe, activePlanId, activeTenant }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(SUBSCRIPTION_PLANS[2]); // Default professional
  
  // Promo code states
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  // Checkout modal states
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  
  // Form states for user credentials (Data Diri)
  const [formData, setFormData] = useState({
    ownerName: '',
    businessName: '',
    email: '',
    phone: '',
    subDomain: '',
    laundryAddress: 'Jl. Slamet Riyadi No. 45, Kartasura, Solo',
  });

  // Load active tenant data as pre-filled default values
  useEffect(() => {
    setFormData({
      ownerName: activeTenant?.ownerName || 'Budi Lestari',
      businessName: activeTenant?.businessName || 'Lestari Laundry',
      email: activeTenant?.email || 'lestari@laundrycloud.com',
      phone: activeTenant?.phone || '081234567890',
      subDomain: activeTenant?.subDomain || 'lestari',
      laundryAddress: 'Jl. Slamet Riyadi No. 45, Kartasura, Solo',
    });
  }, [activeTenant]);

  // Invoice output preview containing customized data diri
  const [invoicePreview, setInvoicePreview] = useState<{
    invoiceNo: string;
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    ownerName?: string;
    businessName?: string;
    email?: string;
    phone?: string;
    subDomain?: string;
    laundryAddress?: string;
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

  const handleOpenCheckoutModal = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setIsCheckoutModalOpen(true);
  };

  const handleConfirmOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessName || !formData.ownerName || !formData.email || !formData.phone || !formData.subDomain) {
      alert('Mohon lengkapi semua data diri Anda sebelum memesan paket.');
      return;
    }

    const calc = calculatePrice(selectedPlan);
    
    // Call app level subscribe handler to update system-wide tenant information
    onSubscribe(
      selectedPlan,
      billingCycle,
      calc.total,
      promoCode.trim().toUpperCase() || 'NONE',
      {
        businessName: formData.businessName,
        ownerName: formData.ownerName,
        email: formData.email,
        phone: formData.phone,
        subDomain: formData.subDomain.toLowerCase().replace(/\s+/g, '')
      }
    );

    // Save personalized invoice receipt info with user details
    setInvoicePreview({
      invoiceNo: `LC/INV/${Math.floor(100000 + Math.random() * 900000)}`,
      subtotal: calc.subtotal,
      discount: calc.discount,
      tax: calc.tax,
      total: calc.total,
      ownerName: formData.ownerName,
      businessName: formData.businessName,
      email: formData.email,
      phone: formData.phone,
      subDomain: formData.subDomain.toLowerCase().replace(/\s+/g, ''),
      laundryAddress: formData.laundryAddress
    });

    setIsCheckoutModalOpen(false);

    // Smooth scroll down to receipt
    setTimeout(() => {
      document.getElementById('invoice-receipt-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  };

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="space-y-8 animate-fade-in relative">
      {/* Title block */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 transform translate-x-4 -translate-y-4 opacity-10">
          <CreditCard size={320} />
        </div>
        
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="bg-yellow-400 text-slate-900 font-extrabold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm animate-pulse inline-block">
            SaaS Billing Simulator & checkout
          </span>
          <h2 className="text-3xl md:text-5xl font-black font-display leading-tight">
            Subscription Management & Checkout Center
          </h2>
          <p className="text-blue-100/90 text-sm md:text-base font-medium leading-relaxed">
            Klik tombol penawaran di bawah untuk membuka **Window Formulir Pemesanan Resmi**. Isi informasi data diri bisnis Anda secara manual untuk mengaktivasi isolasi tenant cloud secara instan.
          </p>
        </div>
      </div>

      {/* Cycle switcher and Promo code apply */}
      <div className="grid md:grid-cols-12 gap-6 items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="md:col-span-6 space-y-2">
          <label className="text-xs font-black uppercase tracking-wider text-slate-500 block">Siklus Penagihan Pilihan</label>
          <div className="inline-flex bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            <button
              onClick={() => { setBillingCycle('monthly'); }}
              className={cn(
                "px-5 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap",
                billingCycle === 'monthly' ? "bg-white text-blue-700 shadow-sm font-extrabold" : "text-slate-500 hover:text-slate-800"
              )}
            >
              Bulanan
            </button>
            <button
              onClick={() => { setBillingCycle('yearly'); }}
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
          <label className="text-xs font-black uppercase tracking-wider text-slate-500 block">Kupon Promo / Diskon Sandbox</label>
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
          {promoSuccess && <p className="text-green-600 text-[10px] font-bold flex items-center gap-1"><Check className="w-3.5 h-3.5" /> {promoSuccess}</p>}
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
                "border rounded-3xl p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between relative",
                isSelected 
                  ? "border-blue-500 ring-4 ring-blue-500/10 shadow-lg scale-102 bg-white" 
                  : "border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300"
              )}
            >
              {/* Highlight Ribbon */}
              {plan.id === 'professional' && (
                <div className="absolute -top-3 right-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-sm">
                  REKOMENDASI (POPULER)
                </div>
              )}

              {/* Header block */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className={cn("text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-md border", plan.badgeColor)}>
                    {plan.name}
                  </span>
                  {isActive && (
                    <span className="bg-green-150 text-green-700 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 border border-green-200">
                      ✓ Aktif Saat Ini
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 font-medium line-clamp-2 h-10">{plan.description}</p>
                
                {/* Price tag */}
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

              {/* Open Checkout Modal Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenCheckoutModal(plan);
                }}
                className={cn(
                  "w-full py-3.5 rounded-2xl text-xs font-black mt-6 transition-all transform active:scale-95 text-center flex items-center justify-center gap-1.5 shadow-sm",
                  isSelected 
                    ? "bg-blue-650 hover:bg-blue-750 text-white font-black" 
                    : "bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-bold"
                )}
                id={`btn-order-plan-${plan.id}`}
              >
                <span>{isActive ? 'Simulasikan Upgrade' : 'Pesan & Checkout Paket'}</span>
                <Sparkles size={13} className="text-amber-300 animate-pulse" />
              </button>
            </div>
          );
        })}
      </div>

      {/* RENDER BEAUTIFUL CUSTOM BILLING RECEIPT ONCE COMPLETED */}
      {invoicePreview && (
        <div 
          id="invoice-receipt-section"
          className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl space-y-6 max-w-2xl mx-auto border border-slate-800 animate-scale-up mt-8 relative"
        >
          {/* Decorative water background sign */}
          <div className="absolute right-6 bottom-6 text-slate-800/15 pointer-events-none select-none">
            <CheckCircle2 size={180} />
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <span className="bg-emerald-550 text-slate-950 font-black text-[9px] uppercase px-3 py-1.5 rounded-full tracking-wider inline-block">
                ✓ SIMULASI CHECKOUT AKTIF & BERHASIL
              </span>
              <h3 className="text-xl md:text-2xl font-extrabold font-display mt-2.5 text-white">
                Invoice Aktivasi Tenant Cloud
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-1">NO: {invoicePreview.invoiceNo}</p>
            </div>
            
            <button 
              onClick={() => alert(`Mengunduh Slip Invoice PDF Resmi atas nama ${invoicePreview.ownerName} dari ${invoicePreview.businessName}...`)}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-xs text-white rounded-xl transition-all flex items-center gap-1.5 font-bold shrink-0 self-start"
              id="btn-download-sim-pdf"
            >
              <Download size={14} /> Download PDF
            </button>
          </div>

          {/* Customer / Licensee Info Box */}
          <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 grid sm:grid-cols-2 gap-4 text-xs relative z-10">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Informasi Tenant Terdaftar</span>
              <div>
                <p className="font-extrabold text-white text-sm">{invoicePreview.businessName}</p>
                <p className="text-blue-400 font-semibold font-mono text-[11px] mt-0.5">
                  https://{invoicePreview.subDomain}.laundrycloud.id
                </p>
              </div>
              <div className="text-[11px] text-slate-450 leading-relaxed font-medium">
                <p className="flex items-center gap-1.5"><MapPin size={11} className="text-slate-400" /> {invoicePreview.laundryAddress}</p>
              </div>
            </div>

            <div className="space-y-2 border-t sm:border-t-0 sm:border-l border-slate-800 sm:pl-4 pt-3 sm:pt-0">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Identitas Kontak Owner</span>
              <div className="space-y-1 font-medium text-slate-300">
                <p className="font-bold text-white text-sm flex items-center gap-1.5">
                  <User size={12} className="text-blue-400" /> {invoicePreview.ownerName}
                </p>
                <p className="flex items-center gap-1.5"><Mail size={11} className="text-slate-400" /> {invoicePreview.email}</p>
                <p className="flex items-center gap-1.5"><Phone size={11} className="text-slate-400" /> {invoicePreview.phone}</p>
              </div>
            </div>
          </div>

          {/* Pricing detail calculation block */}
          <div className="space-y-3.5 text-xs border-y border-slate-800 py-5">
            <div className="flex justify-between">
              <span className="text-slate-450 font-semibold">Paket Software:</span>
              <span className="font-bold text-white text-sm bg-slate-800 px-2.5 py-0.5 rounded border border-slate-700">
                {selectedPlan.name} ({billingCycle === 'monthly' ? 'Bulanan' : 'Tahunan'})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-450 font-semibold">Subtotal Biaya Lisensi:</span>
              <span className="font-mono text-slate-200">{formatIDR(invoicePreview.subtotal)}</span>
            </div>
            {invoicePreview.discount > 0 && (
              <div className="flex justify-between text-green-400 font-semibold">
                <span>Diskon Kupon Promo ({discountPercent}%):</span>
                <span className="font-mono">-{formatIDR(invoicePreview.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-450 font-semibold">PPN Pemerintah (11%):</span>
              <span className="font-mono text-slate-200">{formatIDR(invoicePreview.tax)}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-slate-850 text-base font-black text-yellow-300">
              <span>Total Tagihan Dibayar:</span>
              <span className="font-mono text-lg">{formatIDR(invoicePreview.total)}</span>
            </div>
          </div>

          <div className="flex items-start gap-3 text-xs text-slate-350 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <Check size={18} className="text-green-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Pemesanan atas nama <strong>{invoicePreview.ownerName}</strong> berhasil dijalankan Sandbox. Lisensi terisolasi untuk <strong>{invoicePreview.businessName}</strong> pada subdomain <strong>{invoicePreview.subDomain}.laundrycloud.id</strong> otomatis sinkron ke seluruh pilar dashboard.
            </p>
          </div>
        </div>
      )}

      {/* CHECKOUT POPUP WINDOW MODAL (WINDOW FORM DATA DIRI) */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
          {/* Modal card wrapper */}
          <div 
            className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 text-white shadow-2xl space-y-6 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header modal */}
            <div className="flex justify-between items-start pb-4 border-b border-slate-800">
              <div>
                <span className="text-[9px] font-black bg-blue-600 text-white px-2.5 py-1 rounded-md uppercase tracking-wider">
                  Mendekati Aktivasi Layanan
                </span>
                <h3 className="text-xl font-extrabold font-display mt-2 flex items-center gap-2">
                  <CreditCard size={20} className="text-blue-500" /> Formulir Pemesanan SaaS
                </h3>
                <p className="text-xs text-slate-450 mt-1">
                  Harap masukkan data diri & detail bisnis Anda untuk setup database tenant.
                </p>
              </div>
              <button 
                onClick={() => setIsCheckoutModalOpen(false)}
                className="p-1.5 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition"
                title="Tutup Menu"
                id="btn-close-checkout-modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Selected Plan Summary Banner inside modal */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="font-mono text-[10px] text-slate-400 font-bold uppercase tracking-wider block">PAKET PILIHAN:</span>
                <strong className="text-sm font-black text-white">{selectedPlan.name}</strong>
              </div>
              <div className="text-right">
                <span className="text-xs text-blue-400 font-black font-mono">
                  {formatIDR(calculatePrice(selectedPlan).total)}
                </span>
                <span className="text-[9px] text-slate-400 block font-bold">
                  {billingCycle === 'monthly' ? '/bulan (Inc Tax)' : '/tahun (Inc Tax)'}
                </span>
              </div>
            </div>

            {/* Form Input for Data diri */}
            <form onSubmit={handleConfirmOrderSubmit} className="space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                {/* Owner Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest block font-bold flex items-center gap-1">
                    <User size={11} className="text-blue-400" /> Nama Lengkap Owner
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="Budi Gunawan"
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Laundry Business Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest block font-bold flex items-center gap-1">
                    <Building size={11} className="text-blue-400" /> Nama Bisnis Laundry
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="Lestari Group Laundry"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Subdomain Input with Live URL Hint */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-455 uppercase tracking-widest block font-bold flex items-center gap-1">
                  <Globe size={11} className="text-teal-400" /> Subdomain Pilihan Sistem
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    required
                    placeholder="lestarikiloan"
                    value={formData.subDomain}
                    onChange={(e) => setFormData({ ...formData, subDomain: e.target.value.toLowerCase().replace(/[^a-z0-str]/g, "") })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3 pr-28 py-2.5 text-xs text-blue-400 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-500 font-bold select-none">
                    .laundrycloud.id
                  </span>
                </div>
                <p className="text-[9px] text-slate-500 font-medium">Domain ini berfungsi mengisolasi cloud store antar tenant Anda.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Contact Email */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest block font-bold flex items-center gap-1">
                    <Mail size={11} className="text-blue-400" /> Alamat Email Kontak
                  </label>
                  <input 
                    type="email" 
                    required
                    placeholder="owner@lestari.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* WhatsApp Number */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest block font-bold flex items-center gap-1">
                    <Phone size={11} className="text-blue-400" /> No. WhatsApp Aktif
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="081234567890"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Physical Address of Major Laundry Store */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest block font-bold flex items-center gap-1">
                  <MapPin size={11} className="text-blue-400" /> Alamat Fisik Outlet Utama
                </label>
                <textarea 
                  required
                  rows={2}
                  placeholder="Jl. Slamet Riyadi No. 45, Solo, Jawa Tengah"
                  value={formData.laundryAddress}
                  onChange={(e) => setFormData({ ...formData, laundryAddress: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Billing Cycle Radio Toggle directly inside Modal as well */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 space-y-2">
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Pilih Durasi Tagihan Lisensi</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBillingCycle('monthly')}
                    className={cn(
                      "py-2 px-3 rounded-lg text-xs font-bold border transition-all text-center",
                      billingCycle === 'monthly'
                        ? "bg-blue-600/20 border-blue-500 text-blue-300"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                    )}
                  >
                    Bulan ke Bulan
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle('yearly')}
                    className={cn(
                      "py-2 px-3 rounded-lg text-xs font-bold border transition-all text-center flex items-center justify-center gap-1",
                      billingCycle === 'yearly'
                        ? "bg-green-600/20 border-green-500 text-green-300"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                    )}
                  >
                    Tahunan (Hemat 20%)
                  </button>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setIsCheckoutModalOpen(false)}
                  className="bg-transparent hover:bg-slate-800 py-3 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition"
                >
                  Batal / Kembali
                </button>
                
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-750 py-3 rounded-xl text-xs font-black uppercase tracking-wider text-white shadow-md shadow-blue-900/20 hover:scale-102 transition duration-200"
                  id="btn-submit-checkout-form"
                >
                  Konfirmasi & Aktivasi Paket
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};
