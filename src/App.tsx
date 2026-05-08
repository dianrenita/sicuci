/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { 
  WashingMachine, 
  Zap, 
  Crown, 
  Menu, 
  X, 
  Phone, 
  MapPin, 
  Clock, 
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Star
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";

// --- Constants ---

const HERO_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1545173153-5bad0058cafe?q=80&w=2070&auto=format&fit=crop",
    title: "Kebersihan Prioritas Kami",
    subtitle: "Pakaian bersih, wangi, dan rapi setiap hari bersama SiCuci."
  },
  {
    url: "https://images.unsplash.com/photo-1521566652839-697aa473761a?q=80&w=2071&auto=format&fit=crop",
    title: "Lembut di Serat Kain",
    subtitle: "Menggunakan deterjen ramah lingkungan yang menjaga kualitas pakaian Anda."
  },
  {
    url: "https://images.unsplash.com/photo-1489274495757-95c7c837b101?q=80&w=2030&auto=format&fit=crop",
    title: "Layanan Sultan, Harga Teman",
    subtitle: "Manjakan pakaian Anda dengan perawatan premium SiCuci Sultan."
  }
];

const PACKAGES = [
  {
    id: "reguler",
    name: "SiCuci Reguler",
    price: "150k",
    unit: "/bulan",
    description: "Solusi hemat untuk kebutuhan rutin bulanan Anda.",
    features: ["Maksimal 7kg / minggu", "Cuci + Kering", "Estimasi 3 Hari", "Deterjen Standar", "Self Pickup"],
    icon: <WashingMachine className="w-8 h-8" />,
    color: "bg-blue-100 text-blue-600",
    popular: false
  },
  {
    id: "begepeng",
    name: "SiCuci Begepeng",
    price: "350k",
    unit: "/bulan",
    description: "Cepat, rapi, dan praktis dengan fitur antar-jemput.",
    features: [
      "Maksimal 10kg / minggu",
      "Cuci + Kering + Setrika",
      "Pickup & Delivery ke Rumah",
      "Estimasi 1 Hari",
      "Deterjen Ekstra Wangi"
    ],
    icon: <Zap className="w-8 h-8" />,
    color: "bg-blue-600 text-white",
    popular: true
  },
  {
    id: "sultan",
    name: "SiCuci Sultan",
    price: "750k",
    unit: "/bulan",
    description: "Layanan eksklusif dengan kapasitas besar dan prioritas utama.",
    features: [
      "Maksimal 20kg / minggu",
      "Setrika Uap Premium",
      "Pickup & Delivery Express",
      "Parfum Signature",
      "Anti Bakteri & Tungau",
      "Estimasi 6 Jam"
    ],
    icon: <Crown className="w-8 h-8" />,
    color: "bg-amber-100 text-amber-600",
    popular: false
  }
];

const REVIEWS = [
  { name: "Andi Sutrisno", comment: "Layanan Sultan-nya beneran premium. Parfumnya wangi banget!", rating: 5 },
  { name: "Dewi Lestari", comment: "Paket Begepeng ngebantu banget buat yang sibuk. Rapi!", rating: 5 },
  { name: "Budi Santoso", comment: "Harganya terjangkau, kualias mantap. Recommended!", rating: 4 }
];

// --- Components ---

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Paket", href: "#paket" },
    { name: "Tentang", href: "#about" },
    { name: "Kontak", href: "#contact" }
  ];

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300 px-6 py-4",
      scrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent text-white"
    )}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white">
            <WashingMachine size={24} />
          </div>
          <span className={cn("text-xl font-bold tracking-tight", !scrolled && "text-white")}>
            SiCuci
          </span>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8 font-medium">
          {navLinks.map(link => (
            <a 
              key={link.name} 
              href={link.href} 
              className={cn(
                "hover:text-blue-500 transition-colors",
                !scrolled && "text-white/80 hover:text-white"
              )}
            >
              {link.name}
            </a>
          ))}
          <button className="bg-blue-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200">
            Order Sekarang
          </button>
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2 rounded-lg"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white text-gray-900 shadow-xl border-t md:hidden flex flex-col p-6 gap-4"
          >
            {navLinks.map(link => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-lg font-medium hover:text-blue-600"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <button className="bg-blue-600 text-white py-3 rounded-xl font-bold mt-2">
              Order Sekarang
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);

  return (
    <section id="home" className="relative h-screen min-h-[600px] w-full overflow-hidden flex items-center justify-center bg-gray-900">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <img 
            src={HERO_IMAGES[currentIndex].url} 
            alt="Hero Background"
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 text-center text-white px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="inline-block bg-blue-600 px-4 py-1.5 rounded-full text-sm font-bold tracking-widest uppercase mb-6">
            Laundry Terpercaya No. 1
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tighter">
            {HERO_IMAGES[currentIndex].title}
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto font-light">
            {HERO_IMAGES[currentIndex].subtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-xl hover:shadow-blue-500/20">
              Lihat Paket
            </button>
            <button className="w-full sm:w-auto bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/30 px-8 py-4 rounded-full font-bold text-lg transition-all">
              Hubungi Kami
            </button>
          </div>
        </motion.div>
      </div>

      {/* Navigation Buttons */}
      <button 
        onClick={prev}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-all hidden md:block"
      >
        <ChevronLeft size={24} />
      </button>
      <button 
        onClick={next}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-all hidden md:block"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {HERO_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all duration-300",
              currentIndex === i ? "bg-blue-500 w-8" : "bg-white/30"
            )}
          />
        ))}
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="paket" className="relative py-24 px-6 overflow-hidden">
      {/* Background Image with Bubbles/Clean Vibes */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1541339907198-e08759dfc3f3?q=80&w=2070&auto=format&fit=crop" 
          alt="Bubbles Background" 
          className="w-full h-full object-cover opacity-10"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/95 to-white" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Pilih Paket <span className="text-blue-600">Terbaik</span> Anda
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Berbagai pilihan paket laundry bulanan yang dirancang khusus untuk kemudahan dan kenyamanan hidup Anda.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {PACKAGES.map((pkg, i) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "relative flex flex-col p-8 rounded-3xl border transition-all duration-300",
                pkg.popular 
                  ? "border-blue-500 shadow-2xl shadow-blue-100 scale-105 z-10 bg-white" 
                  : "border-gray-100 hover:border-blue-200 bg-gray-50/50"
              )}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest shadow-md">
                  Paling Populer
                </div>
              )}

              <div className="flex items-center justify-between mb-6">
                <div className={cn("p-3 rounded-2xl", pkg.color)}>
                  {pkg.icon}
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">{pkg.price}</div>
                  <div className="text-sm text-gray-400 font-medium">{pkg.unit}</div>
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-2 text-gray-900">{pkg.name}</h3>
              <p className="text-gray-500 mb-8 text-sm leading-relaxed">
                {pkg.description}
              </p>

              <div className="space-y-4 mb-10 flex-grow">
                {pkg.features.map(feature => (
                  <div key={feature} className="flex items-center gap-3">
                    <CheckCircle2 size={18} className={cn(pkg.popular ? "text-blue-500" : "text-gray-400")} />
                    <span className="text-gray-700 text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <button className={cn(
                "w-full py-4 rounded-xl font-bold transition-all transform active:scale-95",
                pkg.popular 
                  ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200" 
                  : "bg-white border border-gray-200 text-gray-900 hover:border-blue-500 hover:text-blue-600"
              )}>
                Pilih Paket
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Benefits() {
  const benefits = [
    { title: "Proses Cepat", desc: "Sistem kerja terintegrasi menjamin ketepatan waktu.", icon: <Clock /> },
    { title: "Higienis", desc: "Deterjen anti-bakteri dan mesin yang selalu bersih.", icon: <ShieldCheck /> },
    { title: "Hemat Biaya", desc: "Harga bersaing dengan kualitas yang tak tertandingi.", icon: <TrendingUp /> },
  ];

  return (
    <section className="py-20 bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12">
          {benefits.map((benefit, i) => (
            <motion.div 
              key={i}
              className="flex flex-col items-center text-center p-6"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
            >
              <div className="bg-blue-500/20 p-4 rounded-full mb-6 border border-blue-400/30">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
              <p className="text-blue-100/70 leading-relaxed">
                {benefit.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="py-24 px-6 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Kata <span className="text-blue-600">Sultan</span> Kami</h2>
            <p className="text-gray-500">Kebahagiaan pelanggan adalah misi SiCuci.</p>
          </div>
          <div className="flex items-center gap-1 text-amber-500 font-bold bg-white px-4 py-2 rounded-full shadow-sm">
            <Star size={18} fill="currentColor" />
            <Star size={18} fill="currentColor" />
            <Star size={18} fill="currentColor" />
            <Star size={18} fill="currentColor" />
            <Star size={18} fill="currentColor" />
            <span className="ml-2 text-gray-900">4.9/5 Score</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {REVIEWS.map((review, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
            >
              <div className="flex gap-1 mb-4 text-amber-500">
                {[...Array(review.rating)].map((_, j) => <Star key={j} size={14} fill="currentColor" />)}
              </div>
              <p className="text-gray-600 italic mb-6 leading-loose">"{review.comment}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  {review.name[0]}
                </div>
                <div className="text-sm font-bold text-gray-900">{review.name}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="contact" className="bg-white border-t py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                <WashingMachine size={20} />
              </div>
              <span className="text-xl font-bold text-gray-900">SiCuci</span>
            </div>
            <p className="text-gray-500 max-w-sm leading-relaxed mb-8">
              Pilihan cerdas untuk pakaian bersih, wangi, dan rapi. SiCuci hadir memberikan layanan laundry profesional dengan teknologi terdepan.
            </p>
            <div className="flex gap-4">
              <div className="p-3 bg-gray-100 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer">
                <Phone size={20} />
              </div>
              <div className="p-3 bg-gray-100 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer">
                <MapPin size={20} />
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6">Paket Layanan</h4>
            <ul className="space-y-4 text-gray-500">
              <li><a href="#paket" className="hover:text-blue-600 transition-colors">SiCuci Reguler</a></li>
              <li><a href="#paket" className="hover:text-blue-600 transition-colors">SiCuci Begepeng</a></li>
              <li><a href="#paket" className="hover:text-blue-600 transition-colors">SiCuci Sultan</a></li>
              <li><a href="#paket" className="hover:text-blue-600 transition-colors">Paket Bulanan</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6">Jam Operasional</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li className="flex justify-between">
                <span>Senin - Sabtu:</span>
                <span className="text-gray-900 font-medium">07:00 - 21:00</span>
              </li>
              <li className="flex justify-between">
                <span>Minggu:</span>
                <span className="text-gray-900 font-medium">08:00 - 18:00</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p>© 2024 SiCuci Laundry. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-blue-600">Kebijakan Privasi</a>
            <a href="#" className="hover:text-blue-600">Syarat & Ketentuan</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 antialiased selection:bg-blue-100 selection:text-blue-700">
      <Navbar />
      <Hero />
      <div className="relative">
        {/* Background blobs for visual flavor */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-blue-100 rounded-full blur-[120px] opacity-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-blue-200 rounded-full blur-[120px] opacity-20 pointer-events-none" />
        
        <Pricing />
        <Benefits />
        <Testimonials />
      </div>
      <Footer />
      
      {/* Quick Order Floating Action */}
      <motion.button 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 z-[100] bg-blue-600 text-white p-4 rounded-3xl shadow-2xl shadow-blue-500/40 md:hidden"
      >
        <Phone size={24} />
      </motion.button>
    </div>
  );
}
