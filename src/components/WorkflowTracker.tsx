import React, { useState } from 'react';
import { Transaction, OrderStatus, Employee } from '../types/laundrycloud';
import { ArrowLeftRight, CheckCircle2, RefreshCw, Send, Sparkles, User, HelpCircle, ArrowRight, Play, Check } from 'lucide-react';
import { cn } from '../lib/utils';

interface WorkflowTrackerProps {
  transactions: Transaction[];
  operators: Employee[];
  onUpdateStatus: (id: string, newStatus: OrderStatus) => void;
  onUpdatePayment: (id: string, newPaymentStatus: 'paid' | 'unpaid') => void;
}

const LANES: { key: OrderStatus; label: string; desc: string; color: string; icon: string }[] = [
  { key: 'penerimaan', label: 'Penerimaan', desc: 'Cucian ditimbang & disortir', color: 'border-slate-300 text-slate-800 bg-slate-50', icon: '📥' },
  { key: 'pencucian', label: 'Pencucian', desc: 'Proses mesin cuci utama', color: 'border-blue-300 text-blue-800 bg-blue-50/55', icon: '🧼' },
  { key: 'pengeringan', label: 'Pengeringan', desc: 'Proses dryer gas berputar', color: 'border-amber-300 text-amber-850 bg-amber-50/55', icon: '💨' },
  { key: 'penyetrikaan', label: 'Penyetrikaan', desc: 'Gosok uap detail rapi', color: 'border-purple-300 text-purple-800 bg-purple-50/55', icon: '💨' },
  { key: 'quality_control', label: 'Quality Control', desc: 'QC noda & packing plastik', color: 'border-orange-300 text-orange-850 bg-orange-50/55', icon: '🔍' },
  { key: 'siap_ambil', label: 'Siap Ambil', desc: 'Di rak siap dijemput', color: 'border-green-300 text-green-850 bg-green-50/55', icon: '📦' },
  { key: 'selesai', label: 'Selesai', desc: 'Diambil & Transaksi beres', color: 'border-teal-300 text-teal-800 bg-teal-50/30', icon: '✓' }
];

export const WorkflowTracker: React.FC<WorkflowTrackerProps> = ({
  transactions,
  operators,
  onUpdateStatus,
  onUpdatePayment
}) => {
  const [activeLaneIndex, setActiveLaneIndex] = useState<number>(0);
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);

  const getNextStatus = (current: OrderStatus): OrderStatus | null => {
    switch (current) {
      case 'penerimaan': return 'pencucian';
      case 'pencucian': return 'pengeringan';
      case 'pengeringan': return 'penyetrikaan';
      case 'penyetrikaan': return 'quality_control';
      case 'quality_control': return 'siap_ambil';
      case 'siap_ambil': return 'selesai';
      default: return null;
    }
  };

  const notifyWhatsappSim = (txn: Transaction, status: OrderStatus) => {
    if (status === 'siap_ambil') {
      alert(`[SIMULASI WHATSAPP] Notifikasi otomatis dikirim ke ${txn.customerName} (${txn.customerPhone}): Halo kak! Cucian rapi dengan No. Invoice ${txn.invoiceNo} sudah selesai QC & SIAP DIAMBIL di outlet. Terima kasih.`);
    } else if (status === 'selesai') {
      alert(`[SIMULASI WHATSAPP] Notifikasi otomatis dikirim ke ${txn.customerName} (${txn.customerPhone}): Terima kasih kak ${txn.customerName} telah menggunakan jasa laundry kami. Transaksi ${txn.invoiceNo} telah selesai & ditutup. Mohon ulasannya!`);
    } else {
      alert(`Alur kerja diperbarui ke: [${status.toUpperCase()}] untuk transaksi ${txn.invoiceNo}`);
    }
  };

  const handleAdvanceStatus = (txn: Transaction) => {
    const nextS = getNextStatus(txn.status);
    if (nextS) {
      onUpdateStatus(txn.id, nextS);
      notifyWhatsappSim(txn, nextS);
      // Update local diagnostic status detail modal to keep it fresh
      if (selectedTxn?.id === txn.id) {
        setSelectedTxn({ ...txn, status: nextS });
      }
    }
  };

  const handleCompletePaymentStatus = (txn: Transaction) => {
    onUpdatePayment(txn.id, 'paid');
    alert(`Pembayaran untuk Invoice ${txn.invoiceNo} diselesaikan via Kasir.`);
    if (selectedTxn?.id === txn.id) {
      setSelectedTxn({ ...txn, paymentStatus: 'paid' });
    }
  };

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="space-y-8 animate-fade-in relative z-20">
      
      {/* Tracker Intro and Header */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black font-display text-slate-900 flex items-center gap-2">
            <RefreshCw className="text-blue-600 animate-spin-slow" size={20} /> Operational Workflow Pipelines
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Simulasi pelacakan pipa operasional laundry multi-tenant secara real-time. Klik tanda panah untuk menaikkan level status pekerjaan cucian & picu notifikasi otomatis WhatsApp.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-blue-50 text-blue-700 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider">
            Total Transaksi Dilacak: {transactions.length}
          </span>
        </div>
      </div>

      {/* Grid of lanes (Operational board) */}
      <div className="grid md:grid-cols-7 gap-4">
        {LANES.map((lane) => {
          const laneTxns = transactions.filter(t => t.status === lane.key);

          return (
            <div key={lane.key} className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4 flex flex-col space-y-4">
              
              {/* Lane Header */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-display" title={lane.label}>{lane.icon}</span>
                  <span className="bg-slate-200 text-slate-800 text-[10px] px-2 py-0.5 rounded-full font-black font-mono">
                    {laneTxns.length}
                  </span>
                </div>
                <h4 className="text-xs font-black text-slate-800 leading-tight block">{lane.label}</h4>
                <p className="text-[10px] text-slate-450 font-medium leading-tight">{lane.desc}</p>
              </div>

              {/* Lane Cards List */}
              <div className="space-y-3 flex-grow max-h-[480px] overflow-y-auto pr-0.5">
                {laneTxns.length > 0 ? (
                  laneTxns.map((txn) => {
                    const operator = operators.find(o => o.id === txn.operatorId);
                    const isAdvanceable = getNextStatus(txn.status) !== null;

                    return (
                      <div
                        key={txn.id}
                        onClick={() => setSelectedTxn(txn)}
                        className={cn(
                          "bg-white border rounded-xl p-3.5 space-y-3 transition-all duration-300 hover:shadow-md cursor-pointer relative group",
                          selectedTxn?.id === txn.id ? "border-blue-500 ring-2 ring-blue-500/10 shadow-sm" : "border-slate-150"
                        )}
                      >
                        {/* Transaction ID & Name */}
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-mono text-slate-400 block">{txn.invoiceNo}</span>
                          <span className="font-extrabold text-[12px] text-slate-900 block group-hover:text-blue-600 truncate">{txn.customerName}</span>
                        </div>

                        {/* Order info details */}
                        <div className="space-y-1 text-[10px] text-slate-500 font-medium pt-2 border-t border-slate-50">
                          <div className="flex justify-between">
                            <span>Layanan / Unit:</span>
                            <span className="text-slate-800 font-bold truncate max-w-28">{txn.items[0]?.serviceName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Bobot / Qty:</span>
                            <span className="text-slate-800 font-bold font-mono">{txn.items[0]?.qty} {txn.items[0]?.unit}</span>
                          </div>
                        </div>

                        {/* Flow advance buttons and flags */}
                        <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-50">
                          <span className={cn(
                            "px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider",
                            txn.paymentStatus === 'paid' ? "bg-green-100 text-green-700" : "bg-red-105 text-red-700"
                          )}>
                            {txn.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                          </span>

                          {isAdvanceable && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAdvanceStatus(txn);
                              }}
                              className="p-1 px-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold active:scale-95 transition-all flex items-center gap-0.5"
                              title="Tingkatkan Status Cucian"
                            >
                              <span>Proses</span> <ArrowRight size={10} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center p-6 bg-slate-100/50 rounded-xl border border-dashed border-slate-200 text-[10px] text-slate-400 font-bold">
                    Kosong
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Selected Action Details Drawer Card below pipeline board */}
      {selectedTxn && (
        <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl max-w-3xl mx-auto border border-slate-800 grid md:grid-cols-12 gap-6 animate-scale-up">
          
          <div className="md:col-span-7 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="bg-blue-600 text-white font-black text-[9px] uppercase px-2 py-0.5 rounded-md tracking-wider">
                  Operational Workflow Auditor
                </span>
                <h4 className="text-lg font-bold font-display mt-2">{selectedTxn.customerName}</h4>
                <p className="text-xs text-slate-400 font-mono mt-0.5">ID: {selectedTxn.invoiceNo}</p>
              </div>
              <span className="bg-slate-800 text-slate-350 text-[10px] px-2.5 py-1 rounded-xl font-bold font-mono">
                Outlet: {selectedTxn.outletName}
              </span>
            </div>

            <div className="space-y-2 text-xs border-y border-slate-800 py-3 text-slate-300">
              <div className="flex justify-between">
                <span>Total Tagihan:</span>
                <strong className="text-yellow-300 font-bold font-mono">{formatIDR(selectedTxn.netAmount)}</strong>
              </div>
              <div className="flex justify-between">
                <span>Metode Pembayaran:</span>
                <strong className="text-white uppercase font-mono">{selectedTxn.paymentMethod}</strong>
              </div>
              <div className="flex justify-between">
                <span>Catatan Khusus Operator:</span>
                <span className="text-amber-400 italic max-w-xs truncate">{selectedTxn.notes || 'Tidak Ada Catatan.'}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Timeline Pipeline Alur Status</label>
              <div className="flex items-center gap-1.5 flex-wrap">
                {LANES.map((l, i) => {
                  const idxCurrent = LANES.findIndex(la => la.key === selectedTxn.status);
                  const isDone = LANES.findIndex(la => la.key === l.key) <= idxCurrent;
                  return (
                    <span
                      key={l.key}
                      className={cn(
                        "text-[9px] px-2 py-1 rounded-md font-bold tracking-tight inline-block",
                        isDone ? "bg-green-950 text-green-400 border border-green-900" : "bg-slate-800 text-slate-500"
                      )}
                    >
                      {l.label}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="md:col-span-5 bg-slate-850 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
            <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest">Tindakan Cepat Staf</h5>

            <div className="space-y-2.5">
              {/* Payment toggle handler */}
              {selectedTxn.paymentStatus === 'unpaid' && (
                <button
                  onClick={() => handleCompletePaymentStatus(selectedTxn)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition-all text-center"
                >
                  <CheckCircle2 size={13} /> Selesaikan Pembayaran
                </button>
              )}

              {/* Status advancement handler */}
              {getNextStatus(selectedTxn.status) !== null ? (
                <button
                  onClick={() => handleAdvanceStatus(selectedTxn)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition-all text-center"
                >
                  <ArrowRight size={13} /> Lanjutkan ke Alur Berikutnya
                </button>
              ) : (
                <div className="bg-slate-800 p-3 rounded-xl border border-dashed border-slate-700 text-slate-400 text-center font-bold text-[10px]">
                  Cucian ini sudah berstatus Selesai & ditarik Pelanggan.
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedTxn(null)}
              className="w-full text-center text-slate-400 hover:text-white text-[11px] font-bold"
            >
              Tutup Panel Kontrol
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
