import React, { useState } from 'react';
import { Customer, ServiceItem, Transaction, OrderStatus, Employee } from '../types/laundrycloud';
import { INITIAL_SERVICES, INITIAL_CUSTOMERS } from '../data/mockSaaSData';
import { ShoppingBag, ChevronRight, UserPlus, Receipt, Printer, Send, Sparkles, Filter, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface POSSystemProps {
  currentOutletId: string;
  currentOutletName: string;
  activeOperator: Employee;
  customers: Customer[];
  onAddTransaction: (txn: Transaction) => void;
  onAddCustomer: (customer: Customer) => void;
}

export const POSSystem: React.FC<POSSystemProps> = ({
  currentOutletValue = 'O-001',
  currentOutletId,
  currentOutletName,
  activeOperator,
  customers,
  onAddTransaction,
  onAddCustomer
}) => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer>(customers[0]);
  const [cart, setCart] = useState<{ service: ServiceItem; qty: number; weight?: number }[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qris' | 'bank_transfer' | 'credit'>('cash');
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'unpaid'>('paid');
  const [orderNotes, setOrderNotes] = useState('');
  const [srvCategory, setSrvCategory] = useState<string>('all');
  const [srvSearch, setSrvSearch] = useState('');

  // Customer Creation fields
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustAddress, setNewCustAddress] = useState('');
  const [newCustMember, setNewCustMember] = useState<'regular' | 'silver' | 'gold' | 'platinum'>('regular');
  const [showCustForm, setShowCustForm] = useState(false);

  // Latest Receipt modal state
  const [printedReceipt, setPrintedReceipt] = useState<Transaction | null>(null);

  const filteredServices = INITIAL_SERVICES.filter(s => {
    const matchesCat = srvCategory === 'all' || s.category === srvCategory;
    const matchesSearch = s.name.toLowerCase().includes(srvSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const addToCart = (srv: ServiceItem) => {
    const existing = cart.find(item => item.service.id === srv.id);
    if (existing) {
      setCart(cart.map(item => item.service.id === srv.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { service: srv, qty: 1 }]);
    }
  };

  const updateCartQty = (id: string, val: number) => {
    if (val <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(cart.map(item => item.service.id === id ? { ...item, qty: val } : item));
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.service.id !== id));
  };

  // Membership discount math
  const getDiscountPercent = (type: string) => {
    switch (type) {
      case 'platinum': return 15;
      case 'gold': return 10;
      case 'silver': return 5;
      default: return 0;
    }
  };

  const discountPercent = getDiscountPercent(selectedCustomer.membershipType);
  const subtotal = cart.reduce((acc, item) => acc + (item.service.price * item.qty), 0);
  const discountAmount = subtotal * (discountPercent / 100);
  const taxAmount = (subtotal - discountAmount) * 0.11; // 11% tax PPN
  const grandTotal = subtotal - discountAmount + taxAmount;

  const handleRegisterCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName || !newCustPhone) {
      alert('Nama dan No. WhatsApp wajib diisi.');
      return;
    }
    const customerObj: Customer = {
      id: `C-${Math.floor(100 + Math.random() * 900)}`,
      name: newCustName,
      phone: newCustPhone,
      email: `${newCustName.toLowerCase().replace(/\s+/g, '')}@example-customer.com`,
      address: newCustAddress,
      membershipType: newCustMember,
      loyaltyPoints: 10,
      totalTransactionsCount: 0,
      totalSpend: 0
    };

    onAddCustomer(customerObj);
    setSelectedCustomer(customerObj);
    // Reset fields
    setNewCustName('');
    setNewCustPhone('');
    setNewCustAddress('');
    setNewCustMember('regular');
    setShowCustForm(false);
  };

  const handleProcessOrder = () => {
    if (cart.length === 0) {
      alert('Keranjang belanja kosong! Tambahkan minimal 1 layanan laundry.');
      return;
    }

    const txId = `TX-${Math.floor(1000 + Math.random() * 9000)}`;
    const invoiceNumber = `TXN/${new Date().toISOString().slice(2,10).replace(/-/g,'')}/${Math.floor(10000 + Math.random() * 90000)}`;

    const newTx: Transaction = {
      id: txId,
      invoiceNo: invoiceNumber,
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      customerPhone: selectedCustomer.phone,
      outletId: currentOutletId,
      outletName: currentOutletName,
      operatorId: activeOperator.id,
      items: cart.map(item => ({
        serviceId: item.service.id,
        serviceName: item.service.name,
        price: item.service.price,
        qty: item.qty,
        unit: item.service.unit,
        subtotal: item.service.price * item.qty
      })),
      weightKg: cart.find(i => i.service.unit === 'kg')?.qty || 0,
      totalAmount: subtotal,
      discountAmount: discountAmount,
      taxAmount: taxAmount,
      netAmount: Math.round(grandTotal),
      paymentMethod,
      paymentStatus,
      status: 'penerimaan',
      notes: orderNotes,
      createdAt: new Date().toISOString().replace('T', ' ').split('.')[0],
      updatedAt: new Date().toISOString().replace('T', ' ').split('.')[0],
      whatsappSent: true // Automatically simulated WhatsApp SMS
    };

    onAddTransaction(newTx);
    setPrintedReceipt(newTx);
    setCart([]);
    setOrderNotes('');
  };

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="grid lg:grid-cols-12 gap-8 animate-fade-in relative z-20">
      
      {/* Services Grid Column (POS Catalog Selection) */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Filter bar for services */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-black font-display text-slate-900">Katalog POS LaundryCloud</h3>
              <p className="text-xs text-slate-500">Pilih cucian kiloan, cuci sepatu, bedcover, atau premium care satset langsung masuk keranjang.</p>
            </div>
            
            <input
              type="text"
              placeholder="Cari layanan laundry..."
              value={srvSearch}
              onChange={(e) => setSrvSearch(e.target.value)}
              className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-800 w-full md:max-w-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Filter size={11} /> Kategori:
            </span>
            <button
              onClick={() => setSrvCategory('all')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
                srvCategory === 'all' 
                  ? "bg-slate-900 border-slate-900 text-white shadow-sm font-extrabold" 
                  : "bg-slate-50 border-slate-200 hover:border-slate-350 text-slate-600"
              )}
            >
              Semua
            </button>
            <button
              onClick={() => setSrvCategory('kiloan')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
                srvCategory === 'kiloan' 
                  ? "bg-slate-900 border-slate-900 text-white shadow-sm font-extrabold" 
                  : "bg-slate-50 border-slate-200 hover:border-slate-350 text-slate-600"
              )}
            >
              Kiloan
            </button>
            <button
              onClick={() => setSrvCategory('satuan')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
                srvCategory === 'satuan' 
                  ? "bg-slate-900 border-slate-900 text-white shadow-sm font-extrabold" 
                  : "bg-slate-50 border-slate-200 hover:border-slate-350 text-slate-600"
              )}
            >
              Satuan / Pcs
            </button>
            <button
              onClick={() => setSrvCategory('sepatu_tas')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
                srvCategory === 'sepatu_tas' 
                  ? "bg-slate-900 border-slate-900 text-white shadow-sm font-extrabold" 
                  : "bg-slate-50 border-slate-200 hover:border-slate-350 text-slate-600"
              )}
            >
              Sepatu & Tas
            </button>
            <button
              onClick={() => setSrvCategory('karpet_gorden')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
                srvCategory === 'karpet_gorden' 
                  ? "bg-slate-900 border-slate-900 text-white shadow-sm font-extrabold" 
                  : "bg-slate-50 border-slate-200 hover:border-slate-350 text-slate-600"
              )}
            >
              Karpet & Gorden
            </button>
          </div>
        </div>

        {/* Services grid items */}
        <div className="grid md:grid-cols-2 gap-4">
          {filteredServices.map((srv) => (
            <div
              key={srv.id}
              onClick={() => addToCart(srv)}
              className="bg-white border border-slate-100 hover:border-blue-300 hover:shadow-md transition-all rounded-2xl p-5 cursor-pointer flex flex-col justify-between group active:scale-98"
            >
              <div className="space-y-1">
                <span className="bg-slate-100 text-slate-500 font-black text-[9px] uppercase px-1.5 py-0.5 rounded-md border inline-block">
                  {srv.category}
                </span>
                <h4 className="text-[13px] font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {srv.name}
                </h4>
                <p className="text-[11px] text-slate-450 font-medium">Estimasi Pekerjaan: ~{srv.estimatedHours} Jam</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-4">
                <span className="text-sm font-black text-slate-900 font-mono">
                  {formatIDR(srv.price)} <span className="text-[10px] text-slate-400">/{srv.unit}</span>
                </span>
                <span className="text-[11px] font-black text-blue-600 bg-blue-50/50 group-hover:bg-blue-600 group-hover:text-white px-2.5 py-1.5 rounded-xl transition-all">
                  + Keranjang
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Cart & Customer Drawer Column */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Active Cashier & Customer block */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Operator Aktif</span>
              <strong className="text-xs font-black text-slate-800">{activeOperator.name} ({activeOperator.role})</strong>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Cabang Outlet</span>
              <strong className="text-xs font-black text-blue-700">{currentOutletName}</strong>
            </div>
          </div>

          {/* Customer Lookup / Create section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">Pelanggan Aktif</label>
              <button
                onClick={() => setShowCustForm(!showCustForm)}
                className="text-blue-600 hover:text-blue-800 text-[11px] font-extrabold flex items-center gap-1 cursor-pointer"
              >
                <UserPlus size={12} /> {showCustForm ? 'Batal Tambah' : 'Tambah Baru'}
              </button>
            </div>

            {/* Simulated customer register form inline */}
            {showCustForm ? (
              <form onSubmit={handleRegisterCustomer} className="bg-slate-50 border p-4 rounded-2xl space-y-3 animate-slide-down">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 uppercase block">Nama Pelanggan</label>
                    <input 
                      type="text" 
                      placeholder="Agus Hermawan" 
                      required 
                      value={newCustName}
                      onChange={(e) => setNewCustName(e.target.value)}
                      className="w-full text-xs px-2.5 py-2 border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 uppercase block">No. WA Aktif</label>
                    <input 
                      type="tel" 
                      placeholder="081234567" 
                      required 
                      value={newCustPhone}
                      onChange={(e) => setNewCustPhone(e.target.value)}
                      className="w-full text-xs px-2.5 py-2 border rounded-xl font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block">Alamat Rumah</label>
                  <input 
                    type="text" 
                    placeholder="Jl. Mawar No. 12" 
                    value={newCustAddress}
                    onChange={(e) => setNewCustAddress(e.target.value)}
                    className="w-full text-xs px-2.5 py-2 border rounded-xl"
                  />
                </div>

                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-extrabold text-slate-500">Tingkat Member:</span>
                    <select
                      value={newCustMember}
                      onChange={(e: any) => setNewCustMember(e.target.value)}
                      className="text-xs font-bold border rounded-lg bg-white px-2 py-1"
                    >
                      <option value="regular">Regular</option>
                      <option value="silver">Silver Member (5% Off)</option>
                      <option value="gold">Gold Member (10% Off)</option>
                      <option value="platinum">Platinum Member (15% Off)</option>
                    </select>
                  </div>

                  <button 
                    type="submit"
                    className="bg-blue-600 border border-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-black"
                  >
                    Simpan Pelanggan
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex items-center gap-3">
                <select
                  value={selectedCustomer.id}
                  onChange={(e) => {
                    const found = customers.find(c => c.id === e.target.value);
                    if (found) setSelectedCustomer(found);
                  }}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
                >
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.membershipType.toUpperCase()} - {c.phone})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Cart Item Rows */}
          <div className="space-y-3.5">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
              <ShoppingBag size={13} /> Keranjang Cucian ({cart.length} item)
            </span>

            {cart.length > 0 ? (
              <div className="divide-y divide-slate-100 max-h-52 overflow-y-auto pr-1 space-y-2.5">
                {cart.map((item, i) => (
                  <div key={item.service.id} className="flex justify-between items-center pt-2.5 first:pt-0">
                    <div className="space-y-0.5">
                      <h5 className="font-bold text-xs text-slate-900">{item.service.name}</h5>
                      <span className="text-[10px] text-slate-450 block font-mono">
                        {formatIDR(item.service.price)} /{item.service.unit}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-slate-200 rounded-lg">
                        <button
                          onClick={() => updateCartQty(item.service.id, item.qty - 1)}
                          className="px-2 py-1 text-slate-500 hover:bg-slate-100 font-extrabold text-xs"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-black font-mono text-slate-800">{item.qty}</span>
                        <button
                          onClick={() => updateCartQty(item.service.id, item.qty + 1)}
                          className="px-2 py-1 text-slate-500 hover:bg-slate-100 font-extrabold text-xs"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.service.id)}
                        className="text-slate-400 hover:text-red-500"
                        title="Hapus"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-250 text-xs text-slate-450 font-bold">
                Keranjang kosong. Klik layanan laundry di sebelah kiri untuk memasukkan ke struk.
              </div>
            )}
          </div>

          {/* Payment method selection & processing options */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Metode Bayar</label>
                <select
                  value={paymentMethod}
                  onChange={(e: any) => setPaymentMethod(e.target.value)}
                  className="text-xs font-bold border rounded-xl bg-slate-50 border-slate-200 px-3 py-2 w-full focus:outline-none"
                >
                  <option value="cash">Uang Tunai (Cash)</option>
                  <option value="qris">E-Wallet QRIS Dinamis</option>
                  <option value="bank_transfer">Transfer Bank Mandiri</option>
                  <option value="credit">Kartu Kredit / Debit</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Status Bayar</label>
                <select
                  value={paymentStatus}
                  onChange={(e: any) => setPaymentStatus(e.target.value)}
                  className="text-xs font-bold border rounded-xl bg-slate-50 border-slate-200 px-3 py-2 w-full focus:outline-none"
                >
                  <option value="paid">LUNAS (Paid)</option>
                  <option value="unpaid">BELUM BAYAR (Unpaid)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Catatan / Keterangan Cucian</label>
              <input 
                type="text" 
                placeholder="Contoh: Kemeja dilarang campur pemutih, noda luntur kerah."
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          {/* Checkout pricing breakdown and Button */}
          <div className="bg-slate-50 border border-slate-150 p-5 rounded-2xl space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-450 font-semibold">Subtotal Keranjang:</span>
              <span className="font-mono text-slate-800">{formatIDR(subtotal)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-green-600 font-bold">
                <span>Diskon Member ({selectedCustomer.membershipType.toUpperCase()} {discountPercent}%):</span>
                <span className="font-mono">-{formatIDR(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-slate-450 font-semibold">PPN Pemerintah (11%):</span>
              <span className="font-mono text-slate-800">{formatIDR(taxAmount)}</span>
            </div>

            <div className="flex justify-between pt-2.5 border-t border-slate-180 text-sm font-black text-slate-900">
              <span>Total Tagihan Akhir:</span>
              <span className="font-mono text-blue-700">{formatIDR(grandTotal)}</span>
            </div>
          </div>

          <button
            onClick={handleProcessOrder}
            disabled={cart.length === 0}
            className={cn(
              "w-full py-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all transform active:scale-95 text-center flex items-center justify-center gap-1.5 shadow-sm",
              cart.length > 0 
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-150 cursor-pointer text-slate-300"
                : "bg-slate-150 text-slate-450 cursor-not-allowed"
            )}
          >
            <span>Proses Cucian & Kirim WhatsApp</span>
            <ChevronRight size={14} />
          </button>

        </div>

      </div>

      {/* Embedded Printed Receipt Modal / Section below POS if generated */}
      {printedReceipt && (
        <div className="lg:col-span-12 max-w-lg mx-auto bg-white border border-slate-300 p-8 rounded-2xl shadow-xl space-y-6 animate-scale-up font-sans relative">
          
          <button 
            onClick={() => setPrintedReceipt(null)}
            className="absolute top-4 right-4 p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-all"
            title="Tutup Bukti Cetak"
          >
            ✕
          </button>

          <div className="text-center space-y-1">
            <h4 className="text-xl font-black font-display tracking-tight text-blue-750">LAUNDRY CLOUD TERMINAL</h4>
            <p className="text-[10px] text-slate-500 font-mono">Invoice POS: {printedReceipt.invoiceNo}</p>
            <p className="text-[11px] text-slate-650 font-semibold">{currentOutletName}</p>
            <p className="text-[10px] text-slate-400">{printedReceipt.createdAt}</p>
          </div>

          <div className="border-t border-dashed border-slate-200 py-3 text-xs space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-450">Kasir/Staff:</span>
              <span className="font-bold">{activeOperator.name} ({activeOperator.role})</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-450">Pelanggan:</span>
              <span className="font-bold text-slate-800">{printedReceipt.customerName}</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-450">Kontak WA:</span>
              <span className="font-mono text-slate-650">{printedReceipt.customerPhone}</span>
            </div>
          </div>

          <div className="border-y border-dashed border-slate-200 py-4 space-y-2.5">
            {printedReceipt.items.map((item, index) => (
              <div key={index} className="flex justify-between text-xs items-center">
                <div>
                  <span className="font-bold text-slate-900 block">{item.serviceName}</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {item.qty} {item.unit} x {formatIDR(item.price)}
                  </span>
                </div>
                <span className="font-bold font-mono text-slate-800">{formatIDR(item.subtotal)}</span>
              </div>
            ))}
          </div>

          <div className="space-y-1.5 text-xs text-slate-700">
            <div className="flex justify-between text-[11px]">
              <span>Subtotal:</span>
              <span className="font-mono">{formatIDR(printedReceipt.totalAmount)}</span>
            </div>
            {printedReceipt.discountAmount > 0 && (
              <div className="flex justify-between text-green-600 font-semibold text-[11px]">
                <span>Diskon Kupon/Member:</span>
                <span className="font-mono">-{formatIDR(printedReceipt.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-[11px]">
              <span>Pajak PPN (11%):</span>
              <span className="font-mono">{formatIDR(printedReceipt.taxAmount)}</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-100">
              <span>Total Bersih:</span>
              <span className="font-mono text-blue-700">{formatIDR(printedReceipt.netAmount)}</span>
            </div>
          </div>

          <div className="text-xs bg-blue-50/50 p-4 rounded-xl border border-blue-100 space-y-1.5">
            <div className="flex items-center gap-1.5 text-blue-800 font-bold">
              <Send size={13} className="text-blue-500 shrink-0" />
              <span>Simulasi WhatsApp Sent!</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-normal">
              Notifikasi struk kasir otomatis terkirim aman ke nomor <strong>{printedReceipt.customerPhone}</strong>. Pelanggan dapat mengecek live link status pencucian mereka kapan saja.
            </p>
          </div>

          <div className="flex gap-3 justify-center">
            <button 
              onClick={() => alert(`Mengirim instruksi cetak ke printer kasir USB/Bluetooth... (Simulasi sukses)`)}
              className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs hover:bg-slate-800 transition-all active:scale-95"
            >
              <Printer size={13} /> Cetak Struk
            </button>
            <button 
              onClick={() => { setPrintedReceipt(null); }}
              className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 hover:bg-slate-50 transition-all font-bold"
            >
              Selesai & POS Baru
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
