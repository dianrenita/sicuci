import React, { useState } from 'react';
import { Tenant, SaaSInvoice } from '../types/laundrycloud';
import { SUBSCRIPTION_PLANS, VOUCHER_LIST } from '../data/pricingPlans';
import { Users, CreditCard, TrendingUp, BellRing, AlertCircle, Search, ShieldCheck, Filter, UserX, UserPlus, Lock, Unlock } from 'lucide-react';
import { cn } from '../lib/utils';

interface SaaSAdminDashboardProps {
  tenants: Tenant[];
  invoices: SaaSInvoice[];
  onToggleStatus: (id: string) => void;
  onAddTenant: (newTenant: Tenant) => void;
}

export const SaaSAdminDashboard: React.FC<SaaSAdminDashboardProps> = ({ tenants, invoices, onToggleStatus, onAddTenant }) => {
  const [filterPlan, setFilterPlan] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form states for creating simulated new Tenant (multi-tenant sign up)
  const [newBizName, setNewBizName] = useState('');
  const [newOwner, setNewOwner] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newPlan, setNewPlan] = useState<'starter' | 'basic' | 'professional' | 'enterprise'>('basic');
  const [newSubdomain, setNewSubdomain] = useState('');
  const [newBillingCycle, setNewBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const handleSimulateSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBizName || !newOwner || !newEmail || !newPhone || !newSubdomain) {
      alert('Harap lengkapi semua isian pendaftaran tenant.');
      return;
    }

    const tId = `T-${Math.floor(100 + Math.random() * 900)}`;
    const tenantObj: Tenant = {
      id: tId,
      businessName: newBizName,
      ownerName: newOwner,
      email: newEmail,
      phone: newPhone,
      planId: newPlan,
      billingCycle: newBillingCycle,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      subDomain: newSubdomain.toLowerCase().replace(/\s+/g, ''),
      autoRenewal: true
    };

    onAddTenant(tenantObj);
    alert(`Sukses Mendaftarkan Tenant Baru: ${newBizName}! URL Link https://${tenantObj.subDomain}.laundrycloud.id sekarang aktif secara diisolasi.`);
    // Reset Form
    setNewBizName('');
    setNewOwner('');
    setNewEmail('');
    setNewPhone('');
    setNewSubdomain('');
  };

  // Calculations for SaaS metrics
  const activeTenantsCount = tenants.filter(t => t.status === 'active').length;
  const suspendedTenantsCount = tenants.filter(t => t.status === 'suspended').length;
  
  const mrr = tenants.reduce((acc, t) => {
    if (t.status !== 'active') return acc;
    const plan = SUBSCRIPTION_PLANS.find(p => p.id === t.planId);
    if (!plan) return acc;
    const itemCostPlan = t.billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly / 12;
    return acc + itemCostPlan;
  }, 0);

  const totalCollectedRevenue = invoices
    .filter(inv => inv.paymentStatus === 'paid')
    .reduce((acc, inv) => acc + inv.amount, 0);

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const filteredTenants = tenants.filter(t => {
    const matchesPlan = filterPlan === 'all' || t.planId === filterPlan;
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
    const matchesSearch = t.businessName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPlan && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fade-in relative z-20">
      
      {/* Alert Ribbon for Super Admin Notification */}
      <div className="bg-amber-50 border border-amber-250 rounded-2xl p-4 text-xs font-bold text-amber-900 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <BellRing className="text-amber-500 animate-swing shrink-0" size={18} />
          <span>SaaS System Administrator Alert: Terdeteksi 1 Tenant (Koin Koin Express) melewati batas jatuh tempo tagihan dan telah tersuspend secara otomatis oleh CRON Bill Engine.</span>
        </div>
        <span className="bg-amber-600 text-white text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">Urgent</span>
      </div>

      {/* Grid KPI Metrics */}
      <div className="grid md:grid-cols-4 gap-6">
        
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Monthly Recurring (MRR)</span>
            <span className="text-xl md:text-2xl font-black text-slate-900 font-display">{formatIDR(mrr)}</span>
            <span className="text-[10px] text-green-500 font-medium block">▲ +12.4% vs bulan lalu</span>
          </div>
          <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl">
            <TrendingUp size={24} />
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Total Pendapatan Terkumpul</span>
            <span className="text-xl md:text-2xl font-black text-slate-900 font-display">{formatIDR(totalCollectedRevenue)}</span>
            <span className="text-[10px] text-slate-450 font-medium block">Akumulasi Invoice Terbayar</span>
          </div>
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl">
            <CreditCard size={24} />
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Tenant Aktif / Total</span>
            <span className="text-xl md:text-2xl font-black text-slate-900 font-display">{activeTenantsCount} / {tenants.length} Tenant</span>
            <span className="text-[10px] text-amber-500 font-semibold block">{suspendedTenantsCount} tersuspend / belum bayar</span>
          </div>
          <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-2xl">
            <Users size={24} />
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">SaaS Health & Backup</span>
            <span className="text-xl md:text-2xl font-black text-green-600 font-display">99.98% OK</span>
            <span className="text-[10px] text-slate-450 font-medium block">Semua DB Cluster sinkron</span>
          </div>
          <div className="p-3.5 bg-green-50 text-green-600 rounded-2xl">
            <ShieldCheck size={24} />
          </div>
        </div>

      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Tenants List Grid Column */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Header & Filter Row */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-display">Manajemen Tenant Terdaftar</h3>
                <p className="text-xs text-slate-500">Kendalikan akses langganan, suspend akun penunggak, dan periksa subdomain tenant Anda.</p>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Cari Laundry, email, owner..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-800"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                <Filter size={13} /> Saring:
              </span>
              
              {/* Plan Filter */}
              <select
                value={filterPlan}
                onChange={(e) => setFilterPlan(e.target.value)}
                className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 focus:outline-none"
              >
                <option value="all">Semua Paket SaaS</option>
                <option value="starter">Starter Cloud</option>
                <option value="basic">Basic Cloud</option>
                <option value="professional">Professional Cloud</option>
                <option value="enterprise">Enterprise Cloud</option>
              </select>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 focus:outline-none"
              >
                <option value="all">Semua Status</option>
                <option value="active">Status Aktif</option>
                <option value="suspended">Status Suspended</option>
              </select>
            </div>
          </div>

          {/* Tenants Data Table */}
          <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 font-bold tracking-wider border-b border-slate-150">
                    <th className="p-4">Bisnis Laundry / Subdomain</th>
                    <th className="p-4">Pemilik & Kontak</th>
                    <th className="p-4">Paket & Billing</th>
                    <th className="p-4">Status Akun</th>
                    <th className="p-4 text-center">Tindakan Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredTenants.length > 0 ? (
                    filteredTenants.map((tenant) => {
                      const plan = SUBSCRIPTION_PLANS.find(p => p.id === tenant.planId);
                      return (
                        <tr key={tenant.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4">
                            <div className="space-y-0.5">
                              <span className="font-bold text-slate-900 block">{tenant.businessName}</span>
                              <span className="text-[10px] text-blue-600 font-mono block">https://{tenant.subDomain}.laundrycloud.id</span>
                              <span className="text-[9px] text-slate-400 block font-mono">Dibuat: {tenant.createdAt}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="space-y-0.5">
                              <span className="font-bold text-slate-800 block">{tenant.ownerName}</span>
                              <span className="text-slate-500 block text-[10px]">{tenant.email}</span>
                              <span className="text-[10px] text-slate-450 block font-mono">{tenant.phone}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="space-y-1">
                              <span className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded-md font-bold inline-block border">
                                {plan?.name || tenant.planId}
                              </span>
                              <span className="text-[10px] text-slate-500 block font-semibold font-mono">
                                Tempo: {tenant.nextBillingDate} ({tenant.billingCycle === 'monthly' ? 'Bulanan' : 'Tahunan'})
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={cn(
                              "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wide",
                              tenant.status === 'active' && "bg-green-100 text-green-700",
                              tenant.status === 'suspended' && "bg-red-100 text-red-700"
                            )}>
                              {tenant.status === 'active' ? 'AKTIF' : 'SUSPENDED'}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => onToggleStatus(tenant.id)}
                              className={cn(
                                "p-2 rounded-xl transition-all font-bold text-[10px] active:scale-95 inline-flex items-center gap-1.5 border",
                                tenant.status === 'active' 
                                  ? "bg-red-50 border-red-100 text-red-650 hover:bg-red-100" 
                                  : "bg-green-50 border-green-100 text-green-750 hover:bg-green-100"
                              )}
                              title={tenant.status === 'active' ? 'Suspend Akun ini' : 'Aktifkan Kembali'}
                            >
                              {tenant.status === 'active' ? (
                                <>
                                  <Lock size={12} /> Suspend
                                </>
                              ) : (
                                <>
                                  <Unlock size={12} /> Unsuspend
                                </>
                              )}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center p-8 text-slate-400 font-bold">
                        Tidak ada Tenant yang memenuhi filter Anda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Tenant Sign Up Form Column */}
        <div className="lg:col-span-4 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-bold font-display text-slate-800 flex items-center gap-2">
              <UserPlus className="text-blue-600" /> Registrasi Tenant Baru
            </h3>
            <p className="text-xs text-slate-500 mt-1">Simulasikan proses pendaftaran pemilik laundry baru ke dalam database multi-tenant.</p>
          </div>

          <form onSubmit={handleSimulateSignUp} className="space-y-4">
            
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Nama Bisnis Laundry</label>
              <input 
                type="text" 
                placeholder="Contoh: FreshClean Kebon Jeruk"
                required
                value={newBizName}
                onChange={(e) => setNewBizName(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Nama Owner / Pemilik</label>
              <input 
                type="text" 
                placeholder="Contoh: Budi Gunawan"
                required
                value={newOwner}
                onChange={(e) => setNewOwner(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Subdomain Unik</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="freshclean"
                    required
                    value={newSubdomain}
                    onChange={(e) => setNewSubdomain(e.target.value)}
                    className="w-full pl-3 pr-1 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold font-mono text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">No. WhatsApp</label>
                <input 
                  type="text" 
                  placeholder="0812..."
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Alamat Email Owner</label>
              <input 
                type="email" 
                placeholder="budi@freshclean.id"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Paket SaaS</label>
                <select
                  value={newPlan}
                  onChange={(e: any) => setNewPlan(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
                >
                  <option value="starter">Starter Cloud</option>
                  <option value="basic">Basic Cloud</option>
                  <option value="professional">Professional Cloud</option>
                  <option value="enterprise">Enterprise Cloud</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Siklus</label>
                <select
                  value={newBillingCycle}
                  onChange={(e: any) => setNewBillingCycle(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
                >
                  <option value="monthly">Bulanan</option>
                  <option value="yearly">Tahunan</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 border border-slate-800 text-white font-black py-3.5 rounded-xl text-xs uppercase tracking-wider hover:bg-slate-800 transition-all active:scale-95 text-center mt-3"
            >
              Simpan Tenant Cloud
            </button>
          </form>

        </div>

      </div>

    </div>
  );
};
