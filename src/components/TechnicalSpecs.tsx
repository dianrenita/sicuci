import React, { useState } from 'react';
import { Database, Cpu, Network, Key, Layers, Code, ShieldCheck, CheckSquare, Server, Terminal } from 'lucide-react';
import { cn } from '../lib/utils';

export const TechnicalSpecs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'db' | 'arch' | 'api' | 'rbac'>('db');

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-8 animate-fade-in relative z-20">
      
      {/* Intro Header */}
      <div className="border-b border-slate-100 pb-5 space-y-2">
        <span className="bg-slate-900 text-white font-mono text-[9px] uppercase px-2 py-0.5 rounded-md tracking-wider">
          System Blueprints & Developer Documentation
        </span>
        <h3 className="text-2xl font-black font-display text-slate-800 leading-tight">
          Arsitektur Teknik LaundryCloud SaaS Platform
        </h3>
        <p className="text-xs text-slate-500 max-w-3xl leading-relaxed">
          Dokumentasi teknikal, struktur skema database PostgreSQL, topologi infrastruktur cloud AWS, REST API endpoint, dan Matriks Kontrol Peran (RBAC) lengkap untuk proses deployment nyata.
        </p>
      </div>

      {/* Docs inner tabs control */}
      <div className="flex border-b border-slate-100 pb-1.5 gap-2 flex-wrap">
        <button
          onClick={() => setActiveTab('db')}
          className={cn(
            "px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5",
            activeTab === 'db' ? "bg-slate-900 text-white font-extrabold" : "text-slate-500 hover:text-slate-800"
          )}
        >
          <Database size={13} /> PostgreSQL Database Schema
        </button>
        <button
          onClick={() => setActiveTab('arch')}
          className={cn(
            "px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5",
            activeTab === 'arch' ? "bg-slate-900 text-white font-extrabold" : "text-slate-500 hover:text-slate-800"
          )}
        >
          <Cpu size={13} /> System Cloud Architecture
        </button>
        <button
          onClick={() => setActiveTab('api')}
          className={cn(
            "px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5",
            activeTab === 'api' ? "bg-slate-900 text-white font-extrabold" : "text-slate-500 hover:text-slate-800"
          )}
        >
          <Code size={13} /> REST API Endpoints Specification
        </button>
        <button
          onClick={() => setActiveTab('rbac')}
          className={cn(
            "px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5",
            activeTab === 'rbac' ? "bg-slate-900 text-white font-extrabold" : "text-slate-550 hover:text-slate-800"
          )}
        >
          <ShieldCheck size={13} /> RBAC Matrix Control
        </button>
      </div>

      {/* Dynamic Tab Body content */}
      <div className="space-y-6 pt-3">
        
        {/* DB Schema View Tab */}
        {activeTab === 'db' && (
          <div className="space-y-6 animate-scale-up">
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-blue-900 text-xs font-semibold leading-relaxed">
              <strong>Skema Data Multi-Tenant (Shared Database - Discriminator Column Pattern)</strong><br />
              Skema menggunakan kolom <code>tenant_id</code> pada setiap tabel operasional untuk mengisolasi data antar pelanggan secara logical pada layer query aplikasi dengan indeks clustering berkinerja tinggi.
            </div>

            <div className="grid md:grid-cols-2 gap-6 text-xs text-slate-850">
              
              {/* Table tenants */}
              <div className="bg-slate-50 border p-5 rounded-2xl space-y-3.5">
                <span className="bg-slate-200 text-slate-800 font-mono text-[10px] px-2 py-0.5 rounded font-black font-mono">Tabel: tenants</span>
                <p className="text-[11px] text-slate-500">Menyimpan lisensi langganan organisasi laundry SaaS.</p>
                <div className="overflow-x-auto text-[10px]">
                  <table className="w-full text-left font-mono">
                    <thead>
                      <tr className="border-b text-slate-400 font-extrabold pb-1">
                        <th>Kolom</th>
                        <th>Tipe</th>
                        <th>Constraints</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      <tr><td className="py-1">id</td><td className="py-1">UUID</td><td className="py-1 text-blue-600">PK</td></tr>
                      <tr><td className="py-1">business_name</td><td className="py-1">VARCHAR(150)</td><td className="py-1">NOT NULL</td></tr>
                      <tr><td className="py-1">subdomain</td><td className="py-1">VARCHAR(50)</td><td className="py-1 text-purple-600 font-bold">UNIQUE Index</td></tr>
                      <tr><td className="py-1">owner_name</td><td className="py-1">VARCHAR(100)</td><td className="py-1">NOT NULL</td></tr>
                      <tr><td className="py-1">plan_id</td><td className="py-1">VARCHAR(20)</td><td className="py-1">('starter', 'basic', 'pro', 'enterprise')</td></tr>
                      <tr><td className="py-1">status</td><td className="py-1">VARCHAR(20)</td><td className="py-1">('active', 'suspended')</td></tr>
                      <tr><td className="py-1">next_billing</td><td className="py-1">TIMESTAMP</td><td className="py-1">NOT NULL</td></tr>
                      <tr><td className="py-1">created_at</td><td className="py-1">TIMESTAMP</td><td className="py-1">DEFAULT NOW()</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Table outlets */}
              <div className="bg-slate-50 border p-5 rounded-2xl space-y-3.5">
                <span className="bg-slate-200 text-slate-800 font-mono text-[10px] px-2 py-0.5 rounded font-black font-mono">Tabel: outlets</span>
                <p className="text-[11px] text-slate-500">Mendukung multi-cabang untuk satu akun tenant.</p>
                <div className="overflow-x-auto text-[10px]">
                  <table className="w-full text-left font-mono">
                    <thead>
                      <tr className="border-b text-slate-400 font-extrabold pb-1">
                        <th>Kolom</th>
                        <th>Tipe</th>
                        <th>Constraints</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      <tr><td className="py-1">id</td><td className="py-1">UUID</td><td className="py-1 text-blue-600">PK</td></tr>
                      <tr><td className="py-1">tenant_id</td><td className="py-1">UUID</td><td className="py-1 text-red-600 font-bold">FK (tenants.id)</td></tr>
                      <tr><td className="py-1">name</td><td className="py-1">VARCHAR(150)</td><td className="py-1">NOT NULL</td></tr>
                      <tr><td className="py-1">address</td><td className="py-1">TEXT</td><td className="py-1">NOT NULL</td></tr>
                      <tr><td className="py-1">phone</td><td className="py-1">VARCHAR(20)</td><td className="py-1">NULLABLE</td></tr>
                      <tr><td className="py-1">is_active</td><td className="py-1">BOOLEAN</td><td className="py-1">DEFAULT TRUE</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Table customers */}
              <div className="bg-slate-50 border p-5 rounded-2xl space-y-3.5">
                <span className="bg-slate-200 text-slate-800 font-mono text-[10px] px-2 py-0.5 rounded font-black font-mono">Tabel: customers</span>
                <p className="text-[11px] text-slate-500">CRM tenant, membership level, dan poin loyalitas.</p>
                <div className="overflow-x-auto text-[10px]">
                  <table className="w-full text-left font-mono">
                    <thead>
                      <tr className="border-b text-slate-400 font-extrabold pb-1">
                        <th>Kolom</th>
                        <th>Tipe</th>
                        <th>Constraints</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      <tr><td className="py-1">id</td><td className="py-1">UUID</td><td className="py-1 text-blue-600">PK</td></tr>
                      <tr><td className="py-1">tenant_id</td><td className="py-1">UUID</td><td className="py-1 text-red-600 font-bold">FK (tenants.id)</td></tr>
                      <tr><td className="py-1">name</td><td className="py-1">VARCHAR(120)</td><td className="py-1">NOT NULL</td></tr>
                      <tr><td className="py-1">phone</td><td className="py-1">VARCHAR(20)</td><td className="py-1">NOT NULL</td></tr>
                      <tr><td className="py-1">membership</td><td className="py-1">VARCHAR(20)</td><td className="py-1">('regular', 'silver', 'gold', 'platinum')</td></tr>
                      <tr><td className="py-1">loyalty_points</td><td className="py-1">INTEGER</td><td className="py-1">DEFAULT 0</td></tr>
                      <tr><td className="py-1">total_spend</td><td className="py-1">NUMERIC(15,2)</td><td className="py-1">DEFAULT 0.00</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Table transactions */}
              <div className="bg-slate-50 border p-5 rounded-2xl space-y-3.5">
                <span className="bg-slate-200 text-slate-800 font-mono text-[10px] px-2 py-0.5 rounded font-black font-mono">Tabel: transactions</span>
                <p className="text-[11px] text-slate-500">Transaksi POS, bobot, status alur cetak lunas.</p>
                <div className="overflow-x-auto text-[10px]">
                  <table className="w-full text-left font-mono">
                    <thead>
                      <tr className="border-b text-slate-400 font-extrabold pb-1">
                        <th>Kolom</th>
                        <th>Tipe</th>
                        <th>Constraints</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      <tr><td className="py-1">id</td><td className="py-1">UUID</td><td className="py-1 text-blue-600">PK</td></tr>
                      <tr><td className="py-1">tenant_id</td><td className="py-1">UUID</td><td className="py-1 text-red-600 font-bold">FK (tenants.id)</td></tr>
                      <tr><td className="py-1">outlet_id</td><td className="py-1">UUID</td><td className="py-1 text-red-600 font-bold">FK (outlets.id)</td></tr>
                      <tr><td className="py-1">invoice_no</td><td className="py-1">VARCHAR(50)</td><td className="py-1 text-purple-600 font-bold">UNIQUE Index</td></tr>
                      <tr><td className="py-1">net_amount</td><td className="py-1">NUMERIC(15,2)</td><td className="py-1">NOT NULL</td></tr>
                      <tr><td className="py-1">status</td><td className="py-1">VARCHAR(25)</td><td className="py-1">Workflow Pipeline constraint</td></tr>
                      <tr><td className="py-1">payment_status</td><td className="py-1">VARCHAR(15)</td><td className="py-1">('paid', 'unpaid')</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* System Arch Topology Diagram */}
        {activeTab === 'arch' && (
          <div className="space-y-6 animate-scale-up text-slate-800 text-xs">
            <p className="text-xs text-slate-500">Peta visual infrastruktur multi-tenant LaundryCloud yang mengandalkan redundansi tinggi, caching berkecepatan tinggi, dan isolasi media file.</p>
            
            <div className="bg-slate-950 text-emerald-400 p-6 rounded-2xl font-mono text-[10px] space-y-4 shadow-xl border border-slate-800">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <Terminal size={14} className="text-emerald-500" />
                <span className="font-extrabold text-white text-xs">AWS Topology Spec Blueprint</span>
              </div>
              
              <div className="space-y-1">
                <p className="text-white font-extrabold">[Client / Browser Multi-devices] --- Next.js SPA frontend (Vite & Tailwind CSS on Cloudflare CDN Edge)</p>
                <p className="pl-8">|</p>
                <p className="pl-8">v HTTPS Nginx Proxy & Rate-limit</p>
                <p className="pl-8 font-extrabold text-blue-400">[Laravel v11 API Gateway Gateway] (Binds to Private AWS ECS containers Dockerised Node v20)</p>
                <p className="pl-16">|--- Redis Cache v7 (JWT Tokens, Session rates throttles, POS temporary drafts)</p>
                <p className="pl-16">|--- AWS S3 Object Storage (Tenant media, Invoice PDF storage, Custom logo uploads)</p>
                <p className="pl-16">|</p>
                <p className="pl-16">v SSL Encrypted Tunnel</p>
                <p className="pl-16 font-extrabold text-yellow-300">[PostgreSQL Cluster RDS V15 Multi-AZ Replication]</p>
                <p className="pl-24">|--- schemas: public.tenants (Shared core platform schemas)</p>
                <p className="pl-24">|--- logical partition: tenant_id indexing B-Tree clusters for isolation</p>
              </div>

              <div className="pt-4 border-t border-slate-800 text-slate-500 flex justify-between">
                <span>Backup Schedule: CRON Daily pg_dump to S3 (Glacier tier retention 90d)</span>
                <span>Server Region: asia-southeast1 (Singapore)</span>
              </div>
            </div>

            <div className="bg-slate-55 p-5 rounded-2xl border space-y-3">
              <span className="text-xs font-black text-slate-80 block uppercase tracking-wider">Teknologi Pendukung Nyata</span>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="border bg-white rounded-xl p-3.5 space-y-1">
                  <strong className="text-slate-900 block font-bold">1. Multi-Tenant Isolasi</strong>
                  <p className="text-[11px] text-slate-500 leading-relaxed">Logical row-level security lewat query scoping framework ORM.</p>
                </div>
                <div className="border bg-white rounded-xl p-3.5 space-y-1">
                  <strong className="text-slate-900 block font-bold">2. Redis Caching</strong>
                  <p className="text-[11px] text-slate-500 leading-relaxed">Menyimpan invoice nomor counter & rate limits agar POS tidak lemot.</p>
                </div>
                <div className="border bg-white rounded-xl p-3.5 space-y-1">
                  <strong className="text-slate-900 block font-bold">3. AWS S3 Encrypted</strong>
                  <p className="text-[11px] text-slate-500 leading-relaxed">Upload logo laundry, tanda tangan operator, & PDF struk aman.</p>
                </div>
                <div className="border bg-white rounded-xl p-3.5 space-y-1">
                  <strong className="text-slate-900 block font-bold">4. Database PostgreSQL</strong>
                  <p className="text-[11px] text-slate-500 leading-relaxed">Transactional ACID compliance untuk keamanan pembukuan keuangan laundry.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* REST API Endpoints spec */}
        {activeTab === 'api' && (
          <div className="space-y-4 animate-scale-up text-xs font-mono">
            <p className="text-xs text-slate-500 font-sans">Spesifikasi API Gateway untuk autentikasi tenant, kustomisasi POS, dan pelaporan operasional terenkripsi JWT.</p>

            <div className="bg-slate-900 text-slate-100 rounded-2xl overflow-hidden border border-slate-850 shadow-md">
              <div className="bg-slate-850 p-4 border-b border-slate-800 flex justify-between font-sans">
                <span className="font-bold text-slate-200">REST API Reference (Laravel Controllers)</span>
                <span className="text-slate-450 text-[10px]">Version v1.2</span>
              </div>

              <div className="divide-y divide-slate-850">
                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-900/50 text-blue-400 border border-blue-800 text-[10px] px-2 py-0.5 rounded font-black font-mono">POST</span>
                    <span className="text-slate-200 font-bold font-mono">/api/v1/auth/tenant/register</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans">Mendaftarkan tenant laundry baru & membuat logical cluster isolasi.</p>
                  <p className="text-[10px] text-slate-500">Payload: <code>{`{ "business_name": "...", "owner_name": "...", "email": "...", "plan_id": "pro" }`}</code></p>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-900/50 text-green-400 border border-green-800 text-[10px] px-2 py-0.5 rounded font-black font-mono">GET</span>
                    <span className="text-slate-200 font-bold font-mono">/api/v1/tenant/pos/services</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans">Mengambil list layanan laundry sesuai dengan scope Tenant yang sedang login.</p>
                  <p className="text-[10px] text-slate-500">Headers: <code>Authorization: Bearer {'<JWT-TOKEN>'}</code></p>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-900/50 text-blue-400 border border-blue-800 text-[10px] px-2 py-0.5 rounded font-black font-mono">POST</span>
                    <span className="text-slate-200 font-bold font-mono">/api/v1/tenant/pos/transactions</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans">Mencatat transaksi kasir POS baru, hitung diskon membership otomatis, & picu SQS queue notifikasi WhatsApp.</p>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-orange-900/50 text-orange-400 border border-orange-850 text-[10px] px-2 py-0.5 rounded font-black font-mono">PATCH</span>
                    <span className="text-slate-200 font-bold font-mono">/api/v1/tenant/workflow/status</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans">Memajukan level status pengerjaan cucian (pencucian - pengeringan - QC - siap ambil).</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RBAC Matrices view tab */}
        {activeTab === 'rbac' && (
          <div className="space-y-4 animate-scale-up text-xs font-sans">
            <p className="text-xs text-slate-500">Matriks Hak Akses Peran Pengguna (Role-Based Access Control) dalam sistem LaundryCloud.</p>
            
            <div className="border rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold border-b">
                    <th className="p-3.5">Kemampuan / Hak Akses</th>
                    <th className="p-3.5 text-center bg-blue-50/50 text-blue-850">Owner Laundry</th>
                    <th className="p-3.5 text-center bg-purple-50/50 text-purple-850">Manager Outlet</th>
                    <th className="p-3.5 text-center bg-green-50/50 text-green-850">Kasir POS</th>
                    <th className="p-3.5 text-center bg-amber-50/50 text-amber-850">Operator Laundry</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  <tr>
                    <td className="p-3.5 font-bold">Membuka Laporan Keuangan Tahunan & Gaji</td>
                    <td className="p-3.5 text-center text-green-600 font-extrabold">✓ Ya (Penuh)</td>
                    <td className="p-3.5 text-center text-slate-400">✗ Tidak</td>
                    <td className="p-3.5 text-center text-slate-400">✗ Tidak</td>
                    <td className="p-3.5 text-center text-slate-400">✗ Tidak</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold">Menambah & Tutup Cabang Outlet Baru</td>
                    <td className="p-3.5 text-center text-green-600 font-extrabold">✓ Ya (Penuh)</td>
                    <td className="p-3.5 text-center text-slate-400">✗ Tidak</td>
                    <td className="p-3.5 text-center text-slate-400">✗ Tidak</td>
                    <td className="p-3.5 text-center text-slate-400">✗ Tidak</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold">Memasukkan Transaksi POS Baru & Edit Struk</td>
                    <td className="p-3.5 text-center text-green-600 font-extrabold">✓ Ya</td>
                    <td className="p-3.5 text-center text-green-600 font-extrabold">✓ Ya</td>
                    <td className="p-3.5 text-center text-green-600 font-extrabold">✓ Ya</td>
                    <td className="p-3.5 text-center text-slate-400">✗ Tidak</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold">Menyetujui Penyesuaian Stok Gudang</td>
                    <td className="p-3.5 text-center text-green-600 font-extrabold">✓ Ya</td>
                    <td className="p-3.5 text-center text-green-600 font-extrabold">✓ Ya</td>
                    <td className="p-3.5 text-center text-slate-400">✗ Tidak</td>
                    <td className="p-3.5 text-center text-slate-400">✗ Tidak</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold">Mengubah Status / Alur Pipa Cucian (Operator)</td>
                    <td className="p-3.5 text-center text-green-600 font-extrabold">✓ Ya</td>
                    <td className="p-3.5 text-center text-green-600 font-extrabold">✓ Ya</td>
                    <td className="p-3.5 text-center text-green-600 font-extrabold">✓ Ya</td>
                    <td className="p-3.5 text-center text-green-600 font-extrabold">✓ Ya</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
