import React, { useState, useEffect } from "react";
import { 
  CloudRain, 
  LayoutDashboard, 
  UserSquare2, 
  FolderSync, 
  FileTerminal, 
  Users, 
  Warehouse, 
  Settings, 
  Building, 
  DollarSign, 
  ShieldAlert, 
  Flame, 
  CheckCircle2, 
  X, 
  TrendingUp, 
  HelpCircle, 
  Smartphone, 
  ChevronRight, 
  PhoneCall, 
  Terminal, 
  Menu,
  Sparkles,
  Info
} from "lucide-react";
import { cn } from "./lib/utils";

// Data & Components imports
import { 
  INITIAL_TENANTS, 
  INITIAL_SAAS_INVOICES, 
  INITIAL_OUTLETS, 
  INITIAL_EMPLOYEES, 
  INITIAL_SERVICES, 
  INITIAL_CUSTOMERS, 
  INITIAL_INVENTORY, 
  INITIAL_TRANSACTIONS, 
  INITIAL_AUDIT_LOGS 
} from "./data/mockSaaSData";
import { SUBSCRIPTION_PLANS } from "./data/pricingPlans";
import { Tenant, SaaSInvoice, Outlet, Employee, InventoryItem, Customer, Transaction, OrderStatus } from "./types/laundrycloud";

import { DashboardOverview } from "./components/DashboardOverview";
import { SaaSAdminDashboard } from "./components/SaaSAdminDashboard";
import { SaaSPricingCard } from "./components/SaaSPricingCard";
import { POSSystem } from "./components/POSSystem";
import { WorkflowTracker } from "./components/WorkflowTracker";
import { TechnicalSpecs } from "./components/TechnicalSpecs";

export default function App() {
  // Global SaaS States
  const [tenants, setTenants] = useState<Tenant[]>(INITIAL_TENANTS);
  const [saasInvoices, setSaasInvoices] = useState<SaaSInvoice[]>(INITIAL_SAAS_INVOICES);
  const [outlets, setOutlets] = useState<Outlet[]>(INITIAL_OUTLETS);
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);

  // Active Context / Simulation controls
  const [currentRole, setCurrentRole] = useState<'super_admin' | 'owner' | 'manager' | 'kasir' | 'operator'>('owner');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [currentOutletId, setCurrentOutletId] = useState<string>('O-001');
  
  // Responsive sidebar mobile control
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Dynamic status updater helper
  const handleUpdateStatus = (txnId: string, newStatus: OrderStatus) => {
    setTransactions(prev => prev.map(t => {
      if (t.id === txnId) {
        // Log action to audit logs
        const newLog = {
          id: `L-${Math.floor(100 + Math.random() * 900)}`,
          timestamp: new Date().toISOString().replace('T', ' ').split('.')[0],
          userId: 'E-005',
          userName: 'Ahmad Fikri',
          role: 'Operator',
          action: 'UPDATE_WORKFLOW',
          details: `Mengubah status transaksi ${t.invoiceNo} ke ${newStatus.toUpperCase()}`
        };
        setAuditLogs(logs => [newLog, ...logs]);
        return { ...t, status: newStatus, updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' ') };
      }
      return t;
    }));
  };

  const handleUpdatePayment = (txnId: string, newPaymentStatus: 'paid' | 'unpaid') => {
    setTransactions(prev => prev.map(t => {
      if (t.id === txnId) {
        return { ...t, paymentStatus: newPaymentStatus, updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' ') };
      }
      return t;
    }));
  };

  // Toggle Tenant Account Suspension from SaaS panel simulation
  const handleToggleTenantStatus = (id: string) => {
    setTenants(prev => prev.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'active' ? 'suspended' : 'active';
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  // SaaS simulated subscribe update
  const handleTenantSubscribe = (planObj: any, cycle: 'monthly' | 'yearly', totalCost: number, voucherCode: string) => {
    // Generate new Invoice under the Owner tenant (Lestari Group - T-001)
    const activeTenantId = 'T-001';
    const newInvId = `LC/INV/${Math.floor(100000 + Math.random() * 900000)}`;
    const newSaasInvoice: SaaSInvoice = {
      id: `INV-S-${Math.floor(100 + Math.random() * 900)}`,
      invoiceNo: newInvId,
      tenantId: activeTenantId,
      businessName: 'Lestari Laundry Group',
      planName: planObj.name,
      billingCycle: cycle,
      amount: totalCost,
      paymentMethod: 'Simulasi QRIS / CC Sandbox',
      paymentStatus: 'paid',
      issuedAt: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1050).toISOString().split('T')[0]
    };

    setSaasInvoices(prev => [newSaasInvoice, ...prev]);

    // Update Owner plan level
    setTenants(prev => prev.map(t => {
      if (t.id === activeTenantId) {
        return { 
          ...t, 
          planId: planObj.id, 
          billingCycle: cycle,
          nextBillingDate: cycle === 'monthly' 
            ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        };
      }
      return t;
    }));
  };

  const handleAddTransaction = (newTxn: Transaction) => {
    setTransactions(prev => [newTxn, ...prev]);
    // Log Audit
    const logItem = {
      id: `L-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toISOString().replace('T', ' ').split('.')[0],
      userId: newTxn.operatorId || 'SYSTEM',
      userName: 'Agus Salim',
      role: 'Kasir',
      action: 'CREATE_TRANSACTION',
      details: `Membuat invoice laundry ${newTxn.invoiceNo} senilai ${newTxn.netAmount} IDR.`
    };
    setAuditLogs(logs => [logItem, ...logs]);
  };

  const handleAddTenant = (newT: Tenant) => {
    setTenants(prev => [...prev, newT]);
  };

  const handleAddCustomer = (newCustomer: Customer) => {
    setCustomers(prev => [newCustomer, ...prev]);
  };

  // Helper values
  const currentOutletName = outlets.find(o => o.id === currentOutletId)?.name || 'Semua Cabang';
  const activeOperator = employees.find(e => e.role === 'Kasir') || employees[0];

  useEffect(() => {
    // Automatically switch tabs depending on role change for UX friendliness
    if (currentRole === 'super_admin') {
      setActiveTab('super_admin_tab');
    } else {
      if (activeTab === 'super_admin_tab') {
        setActiveTab('dashboard');
      }
    }
  }, [currentRole]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex">
      
      {/* Dynamic Floating Sidebar */}
      <aside 
        className={cn(
          "w-72 bg-slate-900 text-slate-100 flex flex-col justify-between p-6 fixed inset-y-0 left-0 z-50 transform lg:transform-none transition-transform duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="space-y-8">
          
          {/* Brand header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-600 rounded-xl shadow-md text-white">
                <CloudRain className="animate-pulse" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-black font-display tracking-tight text-white">LaundryCloud</h1>
                <span className="text-[10px] text-blue-400 font-bold tracking-widest uppercase">Multi-Tenant SaaS</span>
              </div>
            </div>
            
            <button 
              onClick={() => setSidebarOpen(false)}
              className="p-1 px-1.5 lg:hidden text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* Quick simulation status indicator */}
          <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Tenant Terpilih</span>
            <div className="flex items-center justify-between">
              <strong className="text-xs text-white max-w-36 truncate">Lestari Laundry</strong>
              <span className="bg-emerald-950 text-emerald-400 text-[8px] font-black uppercase px-1.5 py-0.5 rounded border border-green-900">
                PRO ACTIVE
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono">Subdomain: <code>lestari.laundrycloud.id</code></p>
          </div>

          {/* Navigation link blocks filtered by Active Roles capability */}
          <nav className="space-y-1.5">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block px-2.5 mb-1.5">Dashboard Tenant</span>
            
            <button
              onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }}
              className={cn(
                "w-full px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5",
                activeTab === 'dashboard' ? "bg-slate-800 text-white font-extrabold" : "text-slate-400 hover:text-white"
              )}
            >
              <LayoutDashboard size={14} /> Analytics Business
            </button>

            <button
              onClick={() => { setActiveTab('pos'); setSidebarOpen(false); }}
              className={cn(
                "w-full px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5",
                activeTab === 'pos' ? "bg-slate-800 text-white font-extrabold" : "text-slate-400 hover:text-white"
              )}
            >
              <Smartphone size={14} /> POS Kasir Terminal
            </button>

            <button
              onClick={() => { setActiveTab('workflow'); setSidebarOpen(false); }}
              className={cn(
                "w-full px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5",
                activeTab === 'workflow' ? "bg-slate-800 text-white font-extrabold" : "text-slate-400 hover:text-white"
              )}
            >
              <FolderSync size={14} /> Alur Pipa Cucian
            </button>

            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block px-2.5 pt-4 mb-1.5">SaaS Platform</span>

            <button
              onClick={() => { setActiveTab('packages'); setSidebarOpen(false); }}
              className={cn(
                "w-full px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5",
                activeTab === 'packages' ? "bg-slate-800 text-white font-extrabold" : "text-slate-400 hover:text-white"
              )}
            >
              <DollarSign size={14} /> Paket & Billing
            </button>

            {currentRole === 'super_admin' && (
              <button
                onClick={() => { setActiveTab('super_admin_tab'); setSidebarOpen(false); }}
                className={cn(
                  "w-full px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 bg-indigo-950 border border-indigo-900 text-indigo-300",
                  activeTab === 'super_admin_tab' ? "bg-indigo-900 text-white font-extrabold" : "hover:text-white hover:bg-slate-850"
                )}
              >
                <UserSquare2 size={14} /> platform Super Admin
              </button>
            )}

            <button
              onClick={() => { setActiveTab('tech_specs'); setSidebarOpen(false); }}
              className={cn(
                "w-full px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5",
                activeTab === 'tech_specs' ? "bg-slate-800 text-white font-extrabold" : "text-slate-400 hover:text-white"
              )}
            >
              <FileTerminal size={14} /> Dev Blueprints
            </button>
          </nav>

        </div>

        {/* Developer Sandbox watermark */}
        <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
          <span className="text-[10px] font-extrabold text-white flex items-center gap-1">
            <Terminal size={12} className="text-blue-500" /> Sandboxed Sandbox
          </span>
          <p className="text-[10px] leading-relaxed text-slate-500">Integrations active. Mock levels automatically link back to global state metrics.</p>
        </div>
      </aside>

      {/* Main Panel Content Zone */}
      <main className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        
        {/* Dynamic Navigation Top bar */}
        <header className="bg-white border-b border-slate-100 p-4 md:p-6 flex items-center justify-between static z-30 shadow-sm">
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 lg:hidden"
            >
              <Menu size={20} />
            </button>
            
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block font-mono">Workspace: Lestari Laundry Solo</span>
              <h2 className="text-base md:text-xl font-bold font-display text-slate-900">
                {activeTab === 'dashboard' && 'Dashboard Operasional Bisnis'}
                {activeTab === 'pos' && 'Point of Sale Terminal Kasir'}
                {activeTab === 'workflow' && 'Workflow Real-time Cucian'}
                {activeTab === 'packages' && 'Akun Billing & Subscription Management'}
                {activeTab === 'super_admin_tab' && 'SaaS Super Admin Kontrol'}
                {activeTab === 'tech_specs' && 'Spesifikasi & Cetak Cetak Developer'}
              </h2>
            </div>
          </div>

          {/* Role Changer simulation bar */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <label className="text-[9px] font-black text-slate-400 px-2 uppercase tracking-wider hidden md:block">SIMULASI ROLE:</label>
            <select
              value={currentRole}
              onChange={(e: any) => setCurrentRole(e.target.value)}
              className="bg-white border text-[11px] font-black text-slate-700 px-3 py-1.5 rounded-lg outline-none cursor-pointer"
            >
              <option value="owner">Laundry Owner (BOS)</option>
              <option value="manager">Manager Outlet</option>
              <option value="kasir">Staff Kasir POS</option>
              <option value="operator">Operator Cucian</option>
              <option value="super_admin">⚡ Super Admin SaaS Platform</option>
            </select>
          </div>

        </header>

        {/* Dynamic page render layout router */}
        <div className="p-4 md:p-8 flex-grow space-y-8 max-w-7xl w-full mx-auto pb-16">
          
          {/* Filter views for role capabilities alerts */}
          {currentRole === 'operator' && activeTab === 'pos' && (
            <div className="bg-red-50 border border-red-200 text-red-900 px-5 py-4 rounded-2xl text-xs font-bold flex items-center justify-between gap-3 animate-slide-down">
              <div className="flex items-center gap-2">
                <ShieldAlert className="text-red-650 shrink-0" size={18} />
                <span>Pembatasan Otoritas Peran: Sebagai Operator Laundry, Anda tidak diizinkan membuka kasir POS kecuali level Manager menyetujui.</span>
              </div>
              <button onClick={() => setCurrentRole('kasir')} className="bg-red-150 border text-[10px] px-2.5 py-1 text-red-900 rounded-lg">Pindah ke Kasir</button>
            </div>
          )}

          {/* Overview Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <DashboardOverview 
              transactions={transactions}
              customers={customers}
              inventory={inventory}
              outlets={outlets}
              currentOutletId={currentOutletId}
              onChangeOutlet={(id) => setCurrentOutletId(id)}
            />
          )}

          {/* POS Terminal Tab */}
          {activeTab === 'pos' && (
            <POSSystem 
              currentOutletId={currentOutletId}
              currentOutletName={currentOutletName}
              activeOperator={activeOperator}
              customers={customers}
              onAddTransaction={handleAddTransaction}
              onAddCustomer={handleAddCustomer}
            />
          )}

          {/* Pipeline workflow pipeline Tab */}
          {activeTab === 'workflow' && (
            <WorkflowTracker 
              transactions={transactions}
              operators={employees.filter(e => e.role === 'Operator')}
              onUpdateStatus={handleUpdateStatus}
              onUpdatePayment={handleUpdatePayment}
            />
          )}

          {/* SaaS Membership Billing Tab */}
          {activeTab === 'packages' && (
            <SaaSPricingCard 
              onSubscribe={handleTenantSubscribe}
              activePlanId={tenants.find(t => t.id === 'T-001')?.planId || 'professional'}
            />
          )}

          {/* Super admin control Tab */}
          {activeTab === 'super_admin_tab' && currentRole === 'super_admin' && (
            <SaaSAdminDashboard 
              tenants={tenants}
              invoices={saasInvoices}
              onToggleStatus={handleToggleTenantStatus}
              onAddTenant={handleAddTenant}
            />
          )}

          {/* Technical Specs Tab */}
          {activeTab === 'tech_specs' && (
            <TechnicalSpecs />
          )}

        </div>

        {/* Global Footer */}
        <footer className="bg-white border-t border-slate-100 p-6 text-center text-xs text-slate-450 mt-auto font-medium">
          <p>© 2026 LaundryCloud Inc. Modern Row-Level Logic Tenant Isolation. All Rights Reserved.</p>
        </footer>

      </main>

    </div>
  );
}
