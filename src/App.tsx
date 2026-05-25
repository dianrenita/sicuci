/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
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
  ChevronDown,
  ChevronUp,
  TrendingUp,
  ShieldCheck,
  Star,
  Calculator,
  Truck,
  MessageSquare,
  Copy,
  Check,
  Search,
  Gift,
  Sparkles,
  Plus,
  Minus,
  HelpCircle,
  Sparkle,
  Calendar,
  User,
  Info,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";

// --- Types ---

interface Review {
  name: string;
  comment: string;
  rating: number;
  package: string;
  date: string;
}

interface TrackingStep {
  title: string;
  desc: string;
  completed: boolean;
  active: boolean;
  icon: React.ReactNode;
}

interface Order {
  code: string;
  customerName: string;
  packageName: string;
  weeklyWeightLimit: string;
  durationMonths: number;
  addons: string[];
  fragrance: string;
  totalPrice: number;
  promoApplied: string;
  pickupDay: string;
  statusIndex: number; // 0 to 4
  historyLogs: { time: string; text: string }[];
}

// --- Initial Constants ---

const HERO_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1545173153-5bad0058cafe?q=80&w=2070&auto=format&fit=crop",
    title: "Kebersihan Prioritas Utama",
    subtitle: "Pakaian bersih, wangi memikat, dan rapi setiap hari bersama SiCuci. Praktis, higienis, anti-ribet."
  },
  {
    url: "https://images.unsplash.com/photo-1521566652839-697aa473761a?q=80&w=2071&auto=format&fit=crop",
    title: "Sangat Lembut di Serat Kain",
    subtitle: "Formula deterjen ramah lingkungan dengan keharuman tahan lama yang melindungi pakaian kesayangan Anda."
  },
  {
    url: "https://images.unsplash.com/photo-1489274495757-95c7c837b101?q=80&w=2030&auto=format&fit=crop",
    title: "Manjakan Diri Layaknya Sultan",
    subtitle: "Rasakan paket perawatan premium sultan lengkap dengan setrika uap eksklusif dan layanan antar jemput kilat."
  }
];

const PACKAGES = [
  {
    id: "reguler",
    name: "SiCuci Reguler",
    basePrice: 150000, 
    priceDisplay: "150rb",
    unit: "/bulan",
    weightDesc: "Maksimal 7kg / minggu",
    description: "Solusi hemat dan andal untuk mencuci pakaian harian tanpa pusing.",
    features: [
      "Kapasitas Maksimal 7kg / minggu",
      "Proses Cuci + Kering Higienis",
      "Estimasi Selesai 3 Hari",
      "Deterjen Premium Standar",
      "Self Delivery & Pickup di Laundry"
    ],
    icon: <WashingMachine className="w-8 h-8" />,
    color: "bg-blue-100 text-blue-600 border-blue-200",
    popular: false,
    theme: "blue"
  },
  {
    id: "begepeng",
    name: "SiCuci Begepeng",
    basePrice: 350000,
    priceDisplay: "350rb",
    unit: "/bulan",
    weightDesc: "Maksimal 10kg / minggu",
    description: "Cepat, super rapi melayang (pressed flat), lengkap dengan kurir penjemput setia.",
    features: [
      "Kapasitas Maksimal 10kg / minggu",
      "Cuci + Kering + Setrika Presisi",
      "Pickup & Delivery ke Depan Rumah",
      "Estimasi Selesai 1 Hari (Cepat)",
      "Deterjen Ekstra Wangi Pewangi Maksimal"
    ],
    icon: <Zap className="w-8 h-8" />,
    color: "bg-blue-600 text-white border-blue-700",
    popular: true,
    theme: "primary"
  },
  {
    id: "sultan",
    name: "SiCuci Sultan",
    basePrice: 750000,
    priceDisplay: "750rb",
    unit: "/bulan",
    weightDesc: "Maksimal 20kg / minggu",
    description: "Nikmati kemewahan laundry VIP terbaik dengan pengerjaan express kilat.",
    features: [
      "Kapasitas Maksimal 20kg / minggu",
      "Setrika Uap Premium Anti-Kusut",
      "Prioritas Utama Antar Jemput Bebas Ongkir",
      "Antara & Kirim VIP Express (6 Jam)",
      "Parfum Mewah Signature SiCuci",
      "Sterilisasi Anti-Bakteri & Tungau Alami"
    ],
    icon: <Crown className="w-8 h-8" />,
    color: "bg-amber-100 text-amber-600 border-amber-200",
    popular: false,
    theme: "amber"
  }
];

const FRAGRANCES = [
  { id: "sakura", name: "Sakura Blossom 🌸", desc: "Lembut, floral khas Jepang" },
  { id: "lavender", name: "Classic Lavender 🌿", desc: "Ketenangan herbal relaksasi" },
  { id: "ocean", name: "Ocean Fresh 🌊", desc: "Segar maskulin seperti angin laut" },
  { id: "baby", name: "Sweet Baby Powder 🍼", desc: "Lembut bayi, comforting" }
];

const INITIAL_REVIEWS: Review[] = [
  {
    name: "Andi Sutrisno",
    comment: "Layanan Sultan-nya beneran premium bgt. Pakaian dikirim rapi digantung plastik eksklusif dan wanginya tahan 2 minggu!",
    rating: 5,
    package: "SiCuci Sultan",
    date: "Tadi malam"
  },
  {
    name: "Siti Ratnasari",
    comment: "Layanan kurir Begepeng praktis parah. Tinggal taruh helm pakaian di keranjang luar pagar, sorenya udah rapi balik dlm kondisi kinclong.",
    rating: 5,
    package: "SiCuci Begepeng",
    date: "2 hari yang lalu"
  },
  {
    name: "Budi Santoso",
    comment: "Paket regulernya cocok bgt buat mahasiswa kosan kayak saya. Hemat pengeluaran bulanan dibanding laundry kiloan biasa.",
    rating: 4,
    package: "SiCuci Reguler",
    date: "1 minggu yang lalu"
  }
];

const INITIAL_ORDERS: Record<string, Order> = {
  "SICUCI-REG-01": {
    code: "SICUCI-REG-01",
    customerName: "Ahmad Jaelani",
    packageName: "SiCuci Reguler",
    weeklyWeightLimit: "7 kg",
    durationMonths: 1,
    addons: [],
    fragrance: "Sakura Blossom 🌸",
    totalPrice: 150000,
    promoApplied: "Tidak ada",
    pickupDay: "Senin",
    statusIndex: 2, // Pencucian
    historyLogs: [
      { time: "05 Mei, 09:00", text: "Registrasi Paket Bulanan Berhasil." },
      { time: "06 Mei, 10:15", text: "Pakaian kotor diserahkan pelanggan ke staf cabang." },
      { time: "07 Mei, 08:30", text: "Sedang diproses dalam mesin cuci steril suhu tinggi." }
    ]
  },
  "SICUCI-BEG-02": {
    code: "SICUCI-BEG-02",
    customerName: "Diana Renita",
    packageName: "SiCuci Begepeng",
    weeklyWeightLimit: "10 kg",
    durationMonths: 3,
    addons: ["Eco Premium Detergent"],
    fragrance: "Sweet Baby Powder 🍼",
    totalPrice: 945000, // 350k * 3 - 10% discount + addon
    promoApplied: "BULANANHEBAT",
    pickupDay: "Rabu",
    statusIndex: 3, // Penyetrikaan
    historyLogs: [
      { time: "05 Mei, 08:00", text: "Konfirmasi Paket Berlangganan 3 Bulan disetujui." },
      { time: "07 Mei, 09:12", text: "Kurir SiCuci telah mempickup pakaian kotor di alamat rumah." },
      { time: "07 Mei, 11:45", text: "Pencucian & pengeringan serat halus selesai." },
      { time: "08 Mei, 07:00", text: "Proses setrika presisi datar (begepeng) & packing wangi premium sedang berlangsung." }
    ]
  },
  "SICUCI-SULTAN-03": {
    code: "SICUCI-SULTAN-03",
    customerName: "Raffi Al-Bakri",
    packageName: "SiCuci Sultan",
    weeklyWeightLimit: "20 kg",
    durationMonths: 6,
    addons: ["Anti-Allergy Premium Sanitization", "Eco Premium Detergent"],
    fragrance: "Ocean Fresh 🌊",
    totalPrice: 3840000, // 750k * 6 - 20% + addon
    promoApplied: "BERSIHMAKSIMAL",
    pickupDay: "Jumat",
    statusIndex: 4, // Pengantaran Kembali
    historyLogs: [
      { time: "03 Mei, 14:00", text: "Aktivasi Layanan Sultan VIP 6 Bulan dikonfirmasi." },
      { time: "08 Mei, 08:00", text: "Barang di-pickup kilat oleh armada mobil SiCuci." },
      { time: "08 Mei, 09:30", text: "Pencucian ultra-bersih & sterilisasi anti-bakteri." },
      { time: "08 Mei, 11:00", text: "Setrika uap vertikal lembut wangi parfum signature Sultan." },
      { time: "08 Mei, 12:45", text: "Mengaspal! Kurir VIP mengantar pakaian gantung rapi kembali ke istana Anda." }
    ]
  }
};

const FAQ_ITEMS = [
  {
    q: "Apa bedanya SiCuci Begepeng dengan SiCuci Sultan?",
    a: "SiCuci Begepeng fokus pada hasil strika flat-lay yang super tipis dan rapi hemat ruang lemari, dengan waktu pengerjaan 1 hari. Sedangkan SiCuci Sultan memberikan layanan VIP kasta tertinggi dengan strika uap gantung premium, sterilisasi tungau, pengerjaan super cepat 6 jam, parfum termewah eksklusif, serta gratis antar jemput prioritas armada mobil."
  },
  {
    q: "Bagaimana sistem kuota mingguan langganan bulanan bekerja?",
    a: "Setiap paket memiliki batas kapasitas cuci per minggu (Reguler: 7kg, Begepeng: 10kg, Sultan: 20kg). Jika minggu tersebut Anda hanya mengumpulkan 5kg, kuota tidak dapat diakumulasikan ke minggu berikutnya demi menjaga antrean kualitas mesin cuci kami."
  },
  {
    q: "Kapan kurir akan menjemput cucian saya?",
    a: "Saat mendaftar paket, Anda dapat memilih Hari Penjemputan Utama reguler (Senin, Rabu, atau Jumat) sesuai waktu luang Anda. Sistem akan otomatis mengingatkan serta mengutus kurir kami ke rumah Anda pada hari tersebut."
  },
  {
    q: "Apakah saya bisa menggunakan kode diskon untuk langganan pertama?",
    a: "Bisa banget! Kami menyediakan kode kupon 'BERSIHMAKSIMAL' untuk diskon tambahan 10% langsung di form pembayaran pesanan Anda. Silakan dicoba saat bertransaksi!"
  }
];

export default function App() {
  // --- States ---
  const [ambientBubbles, setAmbientBubbles] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [orders, setOrders] = useState<Record<string, Order>>(INITIAL_ORDERS);
  
  // Custom Reviews State Input
  const [newReviewName, setNewReviewName] = useState("");
  const [newReviewComment, setNewReviewComment] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewPackage, setNewReviewPackage] = useState("SiCuci Begepeng");
  const [showReviewSuccess, setShowReviewSuccess] = useState(false);

  // Tracking Order State
  const [trackingCode, setTrackingCode] = useState("");
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [searchError, setSearchError] = useState("");
  const [trackCopied, setTrackCopied] = useState(false);

  // Estimator State
  const [estimatedWeight, setEstimatedWeight] = useState(8); // in kg per week

  // Checkout Wizard Modal States
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [selectedPkg, setSelectedPkg] = useState(PACKAGES[1]); // Default to popular Begepeng
  const [duration, setDuration] = useState(1); // 1, 3, or 6 months
  const [selectedFragrance, setSelectedFragrance] = useState("sakura");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [promoMessage, setPromoMessage] = useState("");
  
  // Checkout Form Details
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [pickupDay, setPickupDay] = useState("Senin");
  const [justGeneratedCode, setJustGeneratedCode] = useState("");

  // Virtual Assistant chatbot state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([
    { sender: "bot", text: "Halo Kak! 🫧 Selamat datang di SiCuci Laundry. Ada yang bisa kami bantu hari ini tentang paket langganan cuci kami?" }
  ]);
  const [chatInput, setChatInput] = useState("");

  // FAQ Accordion State
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(0);

  // Ambient Bubble Generator
  const [bubbleElements, setBubbleElements] = useState<{ id: number; left: number; size: number; delay: number; duration: number }[]>([]);

  useEffect(() => {
    // Generate bubble random values for clean aesthetic
    const initialBubbles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: Math.random() * 95,
      size: Math.random() * 40 + 15,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 8
    }));
    setBubbleElements(initialBubbles);
  }, []);

  // Auto slide hero
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // --- Functions ---
  
  // Track order query
  const handleTrackSearch = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      setSearchError("Silakan masukkan kode resi telebih dahulu.");
      setSearchedOrder(null);
      return;
    }
    const found = orders[cleanCode];
    if (found) {
      setSearchedOrder(found);
      setSearchError("");
    } else {
      setSearchError("Kode resi tidak ditemukan. Silakan cek ulang (Contoh: SICUCI-BEG-02)");
      setSearchedOrder(null);
    }
  };

  // Simulate progress of tracked laundry
  const handleSimulateProgress = () => {
    if (!searchedOrder) return;
    const currentStatus = searchedOrder.statusIndex;
    if (currentStatus >= 4) {
      alert("Pesanan sudah di titik akhir: Selesai! 🎉 Terima kasih telah menikmati layanan SiCuci.");
      return;
    }

    const nextStatus = currentStatus + 1;
    const updatedLogs = [...searchedOrder.historyLogs];
    
    const d = new Date();
    const formattedTime = `${d.getDate().toString().padStart(2, '0')} Mei, ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    
    let stateText = "";
    switch(nextStatus) {
      case 1: stateText = "Diterima oleh staf QC & disortir secara higienis."; break;
      case 2: stateText = "Proses pencucian serat modern & sterilisasi kuman aktif."; break;
      case 3: stateText = "Paket disetrika uap wangi melayang."; break;
      case 4: stateText = "Kurir dalam perjalanan mengantar cucian sultan kembali ke rumah Anda."; break;
    }

    updatedLogs.push({ time: formattedTime, text: stateText });

    const updatedOrder: Order = {
      ...searchedOrder,
      statusIndex: nextStatus,
      historyLogs: updatedLogs
    };

    // Update global state
    setOrders(prev => ({
      ...prev,
      [searchedOrder.code]: updatedOrder
    }));

    setSearchedOrder(updatedOrder);
  };

  // Pricing wizard compute
  const getSubtotal = () => {
    const base = selectedPkg.basePrice * duration;
    // apply discount for duration
    let discountPercent = 0;
    if (duration === 3) discountPercent = 0.10; // 10%
    if (duration === 6) discountPercent = 0.20; // 20%
    
    let price = base * (1 - discountPercent);

    // addons
    if (selectedAddons.includes("Eco Premium Detergent")) {
      price += (25000 * duration);
    }
    if (selectedAddons.includes("Anti-Allergy Premium Sanitization")) {
      price += (35000 * duration);
    }

    // promo code
    if (isPromoApplied) {
      price = price * 0.90; // Add 10% flat discount
    }

    return Math.round(price);
  };

  // Handle coupon check
  const applyPromo = () => {
    const code = promoCodeInput.trim().toUpperCase();
    if (code === "BERSIHMAKSIMAL") {
      setIsPromoApplied(true);
      setPromoMessage("Kupon Berhasil! Tambahan potongan diskon 10% diaktifkan ✨");
    } else if (code) {
      setPromoMessage("Maaf, kupon tidak valid atau sudah kedaluwarsa.");
      setIsPromoApplied(false);
    }
  };

  // Create customized order
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !customerAddress) {
      alert("Harap lengkapi semua baris informasi alamat & nama Anda.");
      return;
    }

    // Generate custom serial number
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const codeAbbreviation = selectedPkg.id.substring(0, 3).toUpperCase();
    const generatedResi = `SICUCI-${codeAbbreviation}-${randomNum}`;

    const newOrder: Order = {
      code: generatedResi,
      customerName,
      packageName: selectedPkg.name,
      weeklyWeightLimit: selectedPkg.weightDesc.split(" ")[1] + " kg",
      durationMonths: duration,
      addons: selectedAddons,
      fragrance: FRAGRANCES.find(f => f.id === selectedFragrance)?.name || "Sakura Blossom 🌸",
      totalPrice: getSubtotal(),
      promoApplied: isPromoApplied ? promoCodeInput.toUpperCase() : "Tidak ada",
      pickupDay,
      statusIndex: 0, // Order Baru dibuat (Di-pickup)
      historyLogs: [
        {
          time: "Baru saja",
          text: `Aktivasi Paket Bulanan ${selectedPkg.name} berhasil dibuat. Jadwal penjemputan berkala setiap hari ${pickupDay}.`
        }
      ]
    };

    setOrders(prev => ({
      ...prev,
      [generatedResi]: newOrder
    }));

    setJustGeneratedCode(generatedResi);
    setWizardStep(4); // Move to Success Step
  };

  // Review posting handler
  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewComment.trim()) {
      alert("Nama dan ulasan tidak boleh kosong ya kak.");
      return;
    }

    const reviewObj: Review = {
      name: newReviewName,
      comment: newReviewComment,
      rating: newReviewRating,
      package: newReviewPackage,
      date: "Baru saja posted"
    };

    setReviews([reviewObj, ...reviews]);
    setShowReviewSuccess(true);
    setNewReviewName("");
    setNewReviewComment("");
    setNewReviewRating(5);

    setTimeout(() => {
      setShowReviewSuccess(false);
    }, 5000);
  };

  // Helper auto chatbot response
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { sender: "user", text: userMsg }]);
    setChatInput("");

    // Simple delay for bot response simulation
    setTimeout(() => {
      const lower = userMsg.toLowerCase();
      let botAnswer = "Terima kasih atas pertanyaannya kak! Staf CS robot kami menyarankan untuk mencoba layanan 'SiCuci Begepeng' yang super rapi dan paling populer kami.";

      if (lower.includes("harga") || lower.includes("promo") || lower.includes("diskon") || lower.includes("murah")) {
        botAnswer = "Tentu kak! Kami sedang ada promo diskon tambahan 10% menggunakan kode kupon 'BERSIHMAKSIMAL'. Paket langganan tersayang kami mulai dari Rp 150.000 saja per bulan!";
      } else if (lower.includes("sultan")) {
        botAnswer = "Wah, pilihan yang bijaksana! Paket SiCuci Sultan menawarkan penjemputan instan prioritas, setrika uap vertikal eksklusif anti-kusut, pengerjaan prioritas 6 jam, anti-tungau, dan keharuman parfum Signature mewah kasta tertinggi.";
      } else if (lower.includes("begepeng")) {
        botAnswer = "Layanan SiCuci Begepeng adalah langganan cuci kering lipat setrika presisi datar seharga Rp 350.000/bulan dengan bonus antar jemput langsung ke depan pagar teras rumah anda secara gratis! Maksimal kuota 10kg/minggu.";
      } else if (lower.includes("alamat") || lower.includes("lokasi") || lower.includes("cabang")) {
        botAnswer = "SiCuci Laundry berpusat di pusat keramaian Jakarta Selatan, melayani pengantaran jemput radius 15km sejauh Jabodetabek dengan armada kurir kilat. Kakak tinggal rileks di rumah, kami jemput!";
      } else if (lower.includes("lacak") || lower.includes("resi") || lower.includes("laundry") || lower.includes("rekomendasi")) {
        botAnswer = "Untuk mengecek status laundry saat ini, kakak tinggal gunakan menu 'Lacak Laundry Anda' di dashboard tengah dengan mengetikkan kode resi kustom seperti 'SICUCI-BEG-02'.";
      }

      setChatMessages(prev => [...prev, { sender: "bot", text: botAnswer }]);
    }, 600);
  };

  // Find the recommended package by calculated weight load per week
  const getRecommendedPackage = () => {
    if (estimatedWeight <= 7) return PACKAGES[0]; // Reguler
    if (estimatedWeight <= 14) return PACKAGES[1]; // Begepeng
    return PACKAGES[2]; // Sultan
  };

  const recommendedPkg = getRecommendedPackage();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900 antialiased selection:bg-blue-100 selection:text-blue-700 relative pb-10">
      
      {/* Top Banner Promo Banner */}
      <div className="relative z-[60] bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white text-center py-2.5 px-4 text-xs tracking-wide font-medium flex items-center justify-center gap-2">
        <span className="bg-yellow-400 text-blue-900 font-extrabold text-[10px] px-2 py-0.5 rounded-full shadow-sm animate-pulse">PROMO</span>
        <span>Mulai hidup tenang! Gunakan kupon <strong className="underline text-yellow-300 font-mono tracking-wider">BERSIHMAKSIMAL</strong> untuk diskon kilat 10% pertama!</span>
        <button 
          onClick={() => {
            setSelectedPkg(PACKAGES[1]);
            setIsCheckoutOpen(true);
            setWizardStep(1);
          }}
          className="ml-3 bg-white text-blue-700 px-3 py-1 rounded-full text-[10px] font-bold hover:bg-yellow-100 transition-all focus:outline-none"
        >
          Klaim Disini
        </button>
      </div>

      {/* Floating Ambient Bubbles Background Toggle Indicator */}
      {ambientBubbles && (
        <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
          {bubbleElements.map((b) => (
            <div
              key={b.id}
              className="laundry-bubble"
              style={{
                left: `${b.left}%`,
                width: `${b.size}px`,
                height: `${b.size}px`,
                animationDelay: `${b.delay}s`,
                animationDuration: `${b.duration}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Floating Controls to manage Ambient state & Fast Order */}
      <div className="fixed bottom-6 left-6 z-40 bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl border border-slate-100 px-4 py-3 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Bubble Ambient:</span>
          <button 
            onClick={() => setAmbientBubbles(!ambientBubbles)}
            className={cn(
              "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
              ambientBubbles ? "bg-blue-600" : "bg-slate-300"
            )}
          >
            <span className={cn(
              "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
              ambientBubbles ? "translate-x-5" : "translate-x-0"
            )} />
          </button>
        </div>
        <div className="h-4 w-px bg-slate-200"></div>
        <span className="text-xs text-blue-600 font-bold flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
          CS Online
        </span>
      </div>

      <Navbar />
      <Hero />

      {/* Quick Access Dashboard Simulator */}
      <section className="relative z-20 -mt-16 max-w-7xl mx-auto px-4 md:px-8 mb-16">
        <div className="bg-white rounded-[32px] shadow-2xl border border-slate-100 p-6 md:p-8">
          <div className="grid md:grid-cols-12 gap-8 items-center">
            
            {/* Live tracking action input */}
            <div className="md:col-span-7 bg-blue-50/50 p-6 md:p-8 rounded-3xl border border-blue-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-blue-600 text-white rounded-xl">
                  <Truck className="w-6 h-6 animate-bounce" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 font-display">Lacak Laundry Bulan Anda</h3>
                  <p className="text-xs text-slate-500">Masukkan nomor resi kustom atau klik demo gratis di bawah ini.</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input 
                    type="text" 
                    placeholder="Contoh: SICUCI-BEG-02 atau Resi baru Anda..."
                    value={trackingCode}
                    onChange={(e) => setTrackingCode(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleTrackSearch(trackingCode)}
                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
                  />
                </div>
                <button 
                  onClick={() => handleTrackSearch(trackingCode)}
                  className="bg-blue-600 text-white font-bold px-6 py-3.5 rounded-2xl hover:bg-blue-700 transition-all text-sm flex items-center justify-center gap-2 active:scale-95 shrink-0"
                >
                  Cek Progress
                </button>
              </div>

              {searchError && (
                <p className="text-red-500 text-xs mt-2 font-semibold flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" />
                  {searchError}
                </p>
              )}

              {/* Demo quick track buttons */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-400 font-bold">Demo Resi:</span>
                <button 
                  onClick={() => { setTrackingCode("SICUCI-REG-01"); handleTrackSearch("SICUCI-REG-01"); }}
                  className="text-xs bg-slate-100 hover:bg-blue-100 hover:text-blue-600 text-slate-600 px-3 py-1.5 rounded-xl transition-all font-mono border border-slate-200"
                >
                  REG-01 (Reguler)
                </button>
                <button 
                  onClick={() => { setTrackingCode("SICUCI-BEG-02"); handleTrackSearch("SICUCI-BEG-02"); }}
                  className="text-xs bg-slate-100 hover:bg-blue-100 hover:text-blue-600 text-slate-600 px-3 py-1.5 rounded-xl transition-all font-mono border border-slate-200"
                >
                  BEG-02 (Begepeng)
                </button>
                <button 
                  onClick={() => { setTrackingCode("SICUCI-SULTAN-03"); handleTrackSearch("SICUCI-SULTAN-03"); }}
                  className="text-xs bg-slate-100 hover:bg-blue-100 hover:text-blue-600 text-slate-600 px-3 py-1.5 rounded-xl transition-all font-mono border border-slate-200"
                >
                  SLT-03 (Sultan)
                </button>
              </div>
            </div>

            {/* Quick Estimator Slider Widget */}
            <div className="md:col-span-5 bg-gradient-to-br from-indigo-900 to-slate-900 p-6 md:p-8 rounded-3xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Calculator className="w-24 h-24 text-white" />
              </div>
              
              <h3 className="text-lg font-bold font-display tracking-tight flex items-center gap-1.5 mb-2">
                <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" /> Estimasi Kebutuhan Anda
              </h3>
              <p className="text-xs text-indigo-200 leading-relaxed max-w-sm">
                Geser rata-rata tumpukan cucian keluarga Anda tiap minggu untuk melihat anjuran kasta paket yang cocok.
              </p>

              <div className="mt-6 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-indigo-300 font-bold uppercase">Berat Est. Mingguan</span>
                  <span className="text-lg font-bold text-yellow-300 font-mono">{estimatedWeight} Kg / minggu</span>
                </div>
                <input 
                  type="range" 
                  min="2" 
                  max="30"
                  value={estimatedWeight}
                  onChange={(e) => setEstimatedWeight(Number(e.target.value))}
                  className="w-full accent-blue-500 bg-indigo-950 h-2 rounded-lg cursor-pointer transition-all"
                />
                <div className="flex justify-between text-[10px] text-indigo-400 font-mono mt-1">
                  <span>2 Kg</span>
                  <span>10 Kg (Paling Ideal)</span>
                  <span>30 Kg</span>
                </div>
              </div>

              {/* Dynamic recommendation render */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-yellow-400 text-slate-900 flex items-center justify-center font-bold">
                    💡
                  </div>
                  <div>
                    <span className="text-[10px] text-indigo-200 uppercase font-bold tracking-wider">Rekomendasi Paket</span>
                    <h4 className="text-sm font-bold text-white leading-tight">{recommendedPkg.name} ({recommendedPkg.priceDisplay})</h4>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setSelectedPkg(recommendedPkg);
                    setIsCheckoutOpen(true);
                    setWizardStep(1);
                  }}
                  className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 px-3.5 py-1.5 rounded-full text-xs font-bold font-display transition-all transition-transform active:scale-95"
                >
                  Pilih Paket
                </button>
              </div>
            </div>

          </div>

          {/* Interactive Live Order Tracking Status Log details dynamically rendered */}
          <AnimatePresence>
            {searchedOrder && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-8 pt-8 border-t border-slate-100"
              >
                <div className="flex flex-col lg:flex-row gap-8 justify-between">
                  
                  {/* Progress panel left side */}
                  <div className="lg:w-7/12">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="bg-blue-600 text-white font-mono font-bold text-sm px-3 py-1 rounded-xl shadow-sm">
                            {searchedOrder.code}
                          </span>
                          <span className="text-xs text-slate-400">Order Berlangganan Aktif</span>
                        </div>
                        <h4 className="text-2xl font-bold font-display text-slate-900 mt-2">
                          Yth, {searchedOrder.customerName}
                        </h4>
                        <p className="text-slate-500 text-sm mt-1">
                          Layanan: <strong className="text-blue-600">{searchedOrder.packageName}</strong> ({searchedOrder.durationMonths} Bulan) • Keharuman: <strong>{searchedOrder.fragrance}</strong>
                        </p>
                      </div>

                      {/* Interactive Copy Tracking Code */}
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(searchedOrder.code);
                          setTrackCopied(true);
                          setTimeout(() => setTrackCopied(false), 2000);
                        }}
                        className="text-xs border text-slate-500 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all"
                      >
                        {trackCopied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                        {trackCopied ? "Disalin!" : "Salin Resi"}
                      </button>
                    </div>

                    {/* Interactive Stepper Visual representation */}
                    <div className="grid grid-cols-5 gap-2 items-center relative mb-8">
                      
                      {/* Grey connecting line */}
                      <div className="absolute left-[10%] right-[10%] top-[40%] h-1 bg-slate-100 z-0"></div>
                      
                      {/* Blue progress line */}
                      <div 
                        className="absolute left-[10%] top-[40%] h-1 bg-blue-600 z-0 transition-all duration-1000"
                        style={{ width: `${searchedOrder.statusIndex * 20}%` }}
                      ></div>

                      {[
                        { label: "Pickup", icon: <Truck className="w-4 h-4" /> },
                        { label: "QC Terima", icon: <FileText className="w-4 h-4" /> },
                        { label: "Dicuci", icon: <WashingMachine className="w-4 h-4" /> },
                        { label: "Disetrika", icon: <Zap className="w-4 h-4" /> },
                        { label: "Dikirim", icon: <CheckCircle2 className="w-4 h-4" /> }
                      ].map((step, idx) => {
                        const isDone = idx < searchedOrder.statusIndex;
                        const isCurrent = idx === searchedOrder.statusIndex;
                        const isFuture = idx > searchedOrder.statusIndex;
                        
                        return (
                          <div key={idx} className="flex flex-col items-center text-center z-10">
                            <div className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2",
                              isDone && "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200",
                              isCurrent && "bg-amber-400 border-amber-400 text-slate-900 shadow-lg shadow-amber-200 scale-110 font-bold",
                              isFuture && "bg-white border-slate-200 text-slate-400"
                            )}>
                              {step.icon}
                            </div>
                            <span className={cn(
                              "text-[10px] mt-2 tracking-tight",
                              isDone && "text-slate-900 font-bold",
                              isCurrent && "text-blue-600 font-extrabold",
                              isFuture && "text-slate-400"
                            )}>{step.label}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Simulation trigger to increase interactive feel */}
                    <div className="bg-slate-50 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 border border-dashed border-slate-200">
                      <div>
                        <span className="text-xs bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded-full uppercase">Simulator Panel</span>
                        <p className="text-[11px] text-slate-500 mt-1">Gunakan tombol simulasi ini untuk menyaksikan transisi status cuci kurir kami secara langsung.</p>
                      </div>
                      <button 
                        onClick={handleSimulateProgress}
                        disabled={searchedOrder.statusIndex >= 4}
                        className={cn(
                          "px-5 py-2.5 rounded-xl font-bold text-xs shadow-sm flex items-center gap-2 transform active:scale-95 transition-all text-white",
                          searchedOrder.statusIndex >= 4 
                            ? "bg-slate-400 cursor-not-allowed" 
                            : "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 hover:shadow-green-200"
                        )}
                      >
                        <Sparkle className="w-3.5 h-3.5 animate-spin" />
                        Simulasikan Progress Curir
                      </button>
                    </div>

                  </div>

                  {/* History Logs sidebar right side */}
                  <div className="lg:w-5/12 bg-slate-50 p-6 rounded-2xl border border-slate-100 max-h-[300px] overflow-y-auto">
                    <h5 className="font-bold text-xs text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-1">
                      <Clock className="w-4 h-4 text-slate-400" /> Histori Perjalanan Laundry
                    </h5>
                    
                    <div className="space-y-4 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                      {searchedOrder.historyLogs.map((log, i) => (
                        <div key={i} className="flex gap-4 relative">
                          <div className={cn(
                            "w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 z-10 shadow-sm border",
                            i === searchedOrder.historyLogs.length - 1 
                              ? "bg-amber-400 text-slate-900 border-amber-300" 
                              : "bg-white text-slate-500 border-slate-100"
                          )}>
                            ✓
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 font-mono block">{log.time}</span>
                            <p className="text-xs font-semibold text-slate-800 mt-0.5">{log.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </section>

      {/* Main Pricing & Packages Section */}
      <Pricing />

      {/* Benefits Showcase Section */}
      <Benefits />

      {/* Interactive Review Showcase & Submit Customer Review Form */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-16">
            <span className="bg-blue-100 text-blue-800 font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-widest">Feedback Pelanggan</span>
            <h2 className="text-4xl font-bold text-slate-900 mt-4 tracking-tight font-display">
              Apa Kata <span className="text-blue-600">Sultan & Begepeng</span> Setia Kami?
            </h2>
            <p className="text-slate-500 text-sm max-w-2xl mx-auto mt-3">
              Kepuasan hasil cucian adalah hidup kami. Lihat ulasan nyata di bawah dan bagikan keharuman pengalaman mencuci Anda hari ini!
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            
            {/* Review Form Left column */}
            <div className="lg:col-span-5 bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-50 rounded-full blur-3xl pointer-events-none"></div>
              
              <h3 className="text-xl font-bold text-slate-900 font-display mb-2 flex items-center gap-1.5">
                <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" /> Tulis Testimonial Jujur
              </h3>
              <p className="text-xs text-slate-500 mb-6 font-medium leading-relaxed">
                Ulasan positif kakak akan dipajang secara langsung ke seluruh audiens di halaman review digital kami.
              </p>

              <form onSubmit={handleAddReview} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Nama Lengkap</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: Dian Renita"
                    required
                    value={newReviewName}
                    onChange={(e) => setNewReviewName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Rating Bintang</label>
                    <div className="flex items-center gap-1 bg-slate-50 px-3 py-2.5 rounded-xl border border-slate-100 justify-center">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          type="button"
                          key={num}
                          onClick={() => setNewReviewRating(num)}
                          className="hover:scale-125 focus:outline-none transition-transform"
                        >
                          <Star 
                            size={16} 
                            fill={num <= newReviewRating ? "#f59e0b" : "none"} 
                            className={num <= newReviewRating ? "text-amber-500" : "text-slate-300"}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Paket Layanan</label>
                    <select
                      value={newReviewPackage}
                      onChange={(e) => setNewReviewPackage(e.target.value)}
                      className="w-full px-3 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700"
                    >
                      <option value="SiCuci Reguler">SiCuci Reguler</option>
                      <option value="SiCuci Begepeng">SiCuci Begepeng</option>
                      <option value="SiCuci Sultan">SiCuci Sultan</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Kesan & Pengalaman</label>
                  <textarea 
                    rows={3}
                    placeholder="Gimana bau parfumnya? Rapi nggak hasilnya kak?"
                    required
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-800 leading-relaxed"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-blue-200 active:scale-95 text-xs tracking-wider uppercase"
                >
                  Kirim Review Sukses
                </button>
              </form>

              {/* Toast feedback status */}
              <AnimatePresence>
                {showReviewSuccess && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="mt-4 p-3 bg-emerald-50 border border-emerald-250 text-emerald-800 text-xs font-bold rounded-xl text-center flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Review terposting sukses! Terima kasih atas feedback-nya kak! 🧼
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            {/* Testimonials Stream List Right Column */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex justify-between items-center px-2">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Feed Live Ulasan ({reviews.length})</span>
                <span className="text-xs text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-full border border-blue-100">Rataan 4.9 dari 5 Bintang</span>
              </div>

              <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2">
                <AnimatePresence initial={false}>
                  {reviews.map((r, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative hover:border-blue-100 transition-all group"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm tracking-wide">
                            {r.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-800 tracking-tight">{r.name}</h4>
                            <span className="text-[10px] bg-blue-50 border border-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full mt-1 inline-block">
                              Paket: {r.package}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="flex items-center gap-0.5 text-amber-500">
                            {Array.from({ length: r.rating }).map((_, i) => (
                              <Star key={i} size={12} fill="currentColor" />
                            ))}
                          </div>
                          <span className="text-[9px] text-slate-400 block mt-1 font-mono">{r.date}</span>
                        </div>
                      </div>

                      <p className="text-slate-600 font-medium text-xs leading-loose italic pl-1 w-full">
                        "{r.comment}"
                      </p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Interactive FAQ Section Accordion widget */}
      <section className="py-20 px-6 bg-white border-t border-slate-100 outline-none">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-full inline-block mb-3">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight font-display">Tanya Jawab (FAQ) SiCuci</h2>
            <p className="text-slate-500 text-sm mt-2">Semua hal yang perlu anda ketahui tentang kebersihan baju bulanan anda.</p>
          </div>

          <div className="space-y-4">
            {FAQ_ITEMS.map((faq, i) => {
              const isOpen = faqOpenIndex === i;
              return (
                <div 
                  key={i} 
                  className={cn(
                    "border rounded-2xl transition-all duration-300",
                    isOpen ? "border-blue-500 bg-blue-50/20" : "border-slate-100 bg-slate-50/50 hover:bg-slate-50"
                  )}
                >
                  <button
                    onClick={() => setFaqOpenIndex(isOpen ? null : i)}
                    className="w-full flex justify-between items-center p-5 text-left font-bold text-slate-800 text-sm md:text-base focus:outline-none"
                  >
                    <span>{faq.q}</span>
                    <span className={cn("p-1.5 rounded-lg bg-white shadow-sm border border-slate-200 text-slate-500 transition-transform", isOpen && "rotate-180 text-blue-600")}>
                      <ChevronDown size={16} />
                    </span>
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-5 pb-5 pt-1 text-slate-600 text-xs md:text-sm leading-relaxed border-t border-slate-100/50">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      <Footer />

      {/* Interactive Virtual CS Chatbot Drawer Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        
        {/* Toggle Floating button */}
        <motion.button
          onClick={() => setIsChatOpen(!isChatOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "p-4 rounded-3xl shadow-2xl flex items-center gap-2 font-bold cursor-pointer text-white",
            isChatOpen ? "bg-red-500 hover:bg-red-650" : "bg-blue-600 hover:bg-blue-750 shadow-blue-400/30"
          )}
        >
          {isChatOpen ? <X size={24} /> : <MessageSquare size={24} />}
          <span className="hidden md:inline text-sm">{isChatOpen ? "Tutup Chat" : "Tanya SiCuci 🤖"}</span>
        </motion.button>

        {/* Chat window body */}
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.9 }}
              className="absolute bottom-16 right-0 w-[330px] md:w-[380px] h-[480px] bg-white rounded-[24px] shadow-2xl border border-slate-100 overflow-hidden flex flex-col"
            >
              
              {/* Header */}
              <div className="bg-blue-600 p-4 text-white flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
                  <WashingMachine size={22} className="animate-spin" />
                </div>
                <div>
                  <h4 className="font-bold text-sm leading-tight">Robot CS SiCuci (AI)</h4>
                  <p className="text-[10px] text-blue-100 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span> Siap Menjawab Instan
                  </p>
                </div>
              </div>

              {/* Suggestions quick tags */}
              <div className="p-2.5 bg-slate-50 border-b border-slate-100 flex gap-1.5 overflow-x-auto text-[10px] font-bold text-slate-600 select-none">
                <button 
                  onClick={() => { setChatInput("Rekomendasi Paket terbaik?"); }}
                  className="px-2.5 py-1 bg-white hover:bg-blue-50 rounded-lg shrink-0 shadow-sm border border-slate-200"
                >
                  🔍 Cari Rekomendasi
                </button>
                <button 
                  onClick={() => { setChatInput("Berapa harga kupon?"); }}
                  className="px-2.5 py-1 bg-white hover:bg-blue-50 rounded-lg shrink-0 shadow-sm border border-slate-200"
                >
                  🎟️ Info Kode Diskon
                </button>
                <button 
                  onClick={() => { setChatInput("Detail SiCuci Sultan"); }}
                  className="px-2.5 py-1 bg-white hover:bg-blue-50 rounded-lg shrink-0 shadow-sm border border-slate-200"
                >
                  👑 Fitur Sultan VIP
                </button>
              </div>

              {/* Chat Message Logs list */}
              <div className="flex-grow p-4 overflow-y-auto space-y-3 bg-slate-50/50">
                {chatMessages.map((msg, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "flex max-w-[85%] flex-col rounded-2xl p-3 text-xs leading-relaxed transition-all",
                      msg.sender === "user" 
                        ? "bg-blue-600 text-white ml-auto rounded-tr-none" 
                        : "bg-white text-slate-800 shadow-sm mr-auto rounded-tl-none border border-slate-100"
                    )}
                  >
                    {msg.text}
                  </div>
                ))}
              </div>

              {/* Input Chat Send bar */}
              <form onSubmit={handleSendChat} className="p-3 border-t bg-white flex gap-2">
                <input 
                  type="text"
                  placeholder="Ketik pertanyaan / keyword..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-grow px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800"
                />
                <button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] px-4 rounded-xl active:scale-95 transition-all uppercase tracking-wider shrink-0"
                >
                  Kirim
                </button>
              </form>

            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Checkout & Subscription Placement Multi-Step Wizard Modal overlays */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[32px] shadow-2xl border border-slate-100 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              
              {/* Header of checkout */}
              <div className="p-6 bg-slate-50 border-b flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-600 text-white p-2 rounded-xl">
                    <WashingMachine className="w-5 h-5 animate-spin" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 leading-tight font-display">Aktivasi Paket Bulanan</h3>
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">
                      Langkah {wizardStep} dari 4
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => setIsCheckoutOpen(false)}
                  className="p-1.5 bg-slate-200 text-slate-600 hover:bg-slate-300 rounded-full transition-all focus:outline-none"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Wizard Content box */}
              <div className="p-6 md:p-8 overflow-y-auto flex-grow text-sm">

                {/* STEP 1: Plan Package selection & configuration duration */}
                {wizardStep === 1 && (
                  <div className="space-y-6">
                    <h4 className="font-bold text-base text-slate-900 font-display">1. Konfigurasi Durasi & Layanan Utama</h4>
                    
                    {/* Visual radio buttons to select plan */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {PACKAGES.map((p) => {
                        const isChosen = selectedPkg.id === p.id;
                        return (
                          <div
                            key={p.id}
                            onClick={() => setSelectedPkg(p)}
                            className={cn(
                              "p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between h-[150px] relative",
                              isChosen 
                                ? "border-blue-600 bg-blue-50/50 shadow-md ring-1 ring-blue-500" 
                                : "border-slate-100 hover:border-slate-300 bg-slate-50/50"
                            )}
                          >
                            <span className="absolute top-3 right-3 text-xs bg-white text-slate-500 font-bold w-5 h-5 rounded-full flex items-center justify-center border">
                              {isChosen ? "✓" : ""}
                            </span>
                            
                            <div>
                              <span className="text-[10px] uppercase font-bold text-slate-400">Paket</span>
                              <h5 className="font-bold text-slate-900 leading-tight mt-0.5">{p.name}</h5>
                            </div>

                            <div className="mt-4">
                              <span className="text-xl font-extrabold text-blue-600 font-mono">Rp {p.priceDisplay}</span>
                              <span className="text-[10px] text-slate-400 font-medium block">{p.weightDesc}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Subscription duration */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">Durasi Berlangganan</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { key: 1, label: "1 Bulan", desc: "Harga Normal" },
                          { key: 3, label: "3 Bulan 🚀", desc: "Diskon Hemat 10%" },
                          { key: 6, label: "6 Bulan 🔥", desc: "Diskon Sultan 20%" }
                        ].map((item) => (
                          <button
                            key={item.key}
                            type="button"
                            onClick={() => setDuration(item.key)}
                            className={cn(
                              "p-3 rounded-xl border text-center font-bold text-xs flex flex-col justify-center items-center transition-all",
                              duration === item.key 
                                ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-100" 
                                : "border-slate-200 hover:border-slate-300 text-slate-700 bg-white"
                            )}
                          >
                            <span>{item.label}</span>
                            <span className={cn("text-[9px] font-medium block mt-0.5", duration === item.key ? "text-blue-100" : "text-slate-400")}>
                              {item.desc}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Next action button */}
                    <div className="pt-4 flex justify-end">
                      <button 
                        onClick={() => setWizardStep(2)}
                        className="bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition-all text-xs"
                      >
                        Berikutnya: Pengaturan Wangi & Addon
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: Fragrance choice & optional extra addons */}
                {wizardStep === 2 && (
                  <div className="space-y-6">
                    <h4 className="font-bold text-base text-slate-900 font-display">2. Pilih Aroma & Add-on Layanan</h4>
                    
                    {/* Fragrance selection */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">Aroma Keharuman Utama</label>
                      <div className="grid grid-cols-2 gap-3">
                        {FRAGRANCES.map((f) => {
                          const isSel = selectedFragrance === f.id;
                          return (
                            <div
                              key={f.id}
                              onClick={() => setSelectedFragrance(f.id)}
                              className={cn(
                                "p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between",
                                isSel 
                                  ? "border-blue-600 bg-blue-50/40 font-bold" 
                                  : "border-slate-100 hover:border-slate-200 bg-slate-50/50"
                              )}
                            >
                              <div>
                                <h5 className="text-xs text-slate-900">{f.name}</h5>
                                <p className="text-[10px] text-slate-400 font-medium">{f.desc}</p>
                              </div>
                              <span className={cn(
                                "w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center text-[10px] bg-white",
                                isSel ? "border-blue-600 text-blue-600" : "border-slate-200 text-transparent"
                              )}>
                                ●
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Addons Selection checklist checkbox toggles */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">Add-on Kemewahan Tambahan (Opsional)</label>
                      <div className="space-y-2">
                        {[
                          { 
                            id: "Eco Premium Detergent", 
                            name: "Deterjen Organik Alami (Eco Premium)", 
                            priceStr: "+Rp 25.000 / bln",
                            desc: "Sangat bersahabat untuk kulit bayi sensitif & ramah lingkungan jangka panjang."
                          },
                          { 
                            id: "Anti-Allergy Premium Sanitization", 
                            name: "Sanitasi Steril Anti-Alergi & Tungau", 
                            priceStr: "+Rp 35.000 / bln",
                            desc: "Sterilisasi uap suhu khusus membunuh 99.9% debu mikroba pada pakaian tidur."
                          }
                        ].map((addon) => {
                          const hasAd = selectedAddons.includes(addon.id);
                          return (
                            <div
                              key={addon.id}
                              onClick={() => {
                                if (hasAd) {
                                  setSelectedAddons(selectedAddons.filter(a => a !== addon.id));
                                } else {
                                  setSelectedAddons([...selectedAddons, addon.id]);
                                }
                              }}
                              className={cn(
                                "p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3",
                                hasAd 
                                  ? "border-blue-600 bg-blue-50/30" 
                                  : "border-slate-100 hover:border-slate-200 bg-slate-50/30"
                              )}
                            >
                              <div className="mt-0.5">
                                <input 
                                  type="checkbox"
                                  checked={hasAd}
                                  readOnly
                                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                                />
                              </div>
                              <div className="flex-grow">
                                <div className="flex justify-between items-center">
                                  <h5 className="text-xs font-bold text-slate-900">{addon.name}</h5>
                                  <span className="text-[11px] font-mono font-bold text-blue-600">{addon.priceStr}</span>
                                </div>
                                <p className="text-[10px] text-slate-500 mt-0.5">{addon.desc}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Nav Actions */}
                    <div className="pt-4 flex justify-between items-center">
                      <button 
                        onClick={() => setWizardStep(1)}
                        className="text-xs text-slate-500 font-bold hover:underline"
                      >
                        Kembali ke Durasi
                      </button>
                      <button 
                        onClick={() => setWizardStep(3)}
                        className="bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition-all text-xs"
                      >
                        Berikutnya: Info Alamat Pengiriman
                      </button>
                    </div>

                  </div>
                )}

                {/* STEP 3: Billing Info Form details confirmation */}
                {wizardStep === 3 && (
                  <form onSubmit={handlePlaceOrder} className="space-y-6">
                    <h4 className="font-bold text-base text-slate-900 font-display">3. Masukkan Identitas & Jadwal Pickup</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Nama Lengkap Anda</label>
                        <input 
                          type="text"
                          required
                          placeholder="Masukkan nama penerima..."
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-800"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">No WhatsApp / HP</label>
                          <input 
                            type="tel"
                            required
                            placeholder="Contoh: 0812345678"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-800"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Hari Pickup Mingguan</label>
                          <select
                            value={pickupDay}
                            onChange={(e) => setPickupDay(e.target.value)}
                            className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700"
                          >
                            <option value="Senin">Senin</option>
                            <option value="Rabu">Rabu</option>
                            <option value="Jumat">Jumat</option>
                            <option value="Sabtu">Sabtu</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Alamat Pengambilan & Pengantaran Lengkap</label>
                        <textarea
                          required
                          rows={2}
                          placeholder="Ketik alamat jelas rumah, nomor gerbang warna rumah..."
                          value={customerAddress}
                          onChange={(e) => setCustomerAddress(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-800 leading-relaxed"
                        />
                      </div>

                      {/* Promo Code Discount */}
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-150">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Memiliki Kode Kupon Diskon?</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Contoh: BERSIHMAKSIMAL"
                            value={promoCodeInput}
                            onChange={(e) => setPromoCodeInput(e.target.value)}
                            className="flex-grow px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:outline-none text-slate-800 uppercase font-mono"
                          />
                          <button
                            type="button"
                            onClick={applyPromo}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 rounded-xl active:scale-95 transition-all"
                          >
                            Terapkan
                          </button>
                        </div>
                        {promoMessage && (
                          <span className={cn(
                            "text-[10px] font-bold block mt-2",
                            isPromoApplied ? "text-emerald-600" : "text-amber-600"
                          )}>
                            {promoMessage}
                          </span>
                        )}
                      </div>

                      {/* Cash Breakdown Quote invoice summary */}
                      <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex justify-between items-center">
                        <div>
                          <span className="text-[10px] text-blue-700 uppercase font-extrabold tracking-wider block">Total Tagihan Estimasi</span>
                          <span className="text-xl font-black text-rose-600 font-mono">
                            Rp {getSubtotal().toLocaleString("id-ID")}
                          </span>
                        </div>
                        <div className="text-right text-[10px] text-slate-400">
                          <span>Untuk layan {duration} bln. Bergaransi 100%.</span>
                        </div>
                      </div>

                    </div>

                    {/* Buttons navigate footer */}
                    <div className="pt-4 flex justify-between items-center border-t">
                      <button
                        type="button" 
                        onClick={() => setWizardStep(2)}
                        className="text-xs text-slate-500 font-bold hover:underline"
                      >
                        Kembali ke Addon
                      </button>
                      <button 
                        type="submit"
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black px-6 py-3.5 rounded-xl hover:shadow-lg hover:shadow-blue-200 transition-all text-xs"
                      >
                        Konfirmasi Order & Aktifkan Paket! 🚀
                      </button>
                    </div>

                  </form>
                )}

                {/* STEP 4: Absolute Checkout Success Screen details */}
                {wizardStep === 4 && (
                  <div className="text-center py-6 space-y-4">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center shadow-lg shadow-emerald-100">
                      <Check className="w-8 h-8" strokeWidth={3} />
                    </div>

                    <h4 className="text-2xl font-black font-display text-slate-900">
                      Selamat, Paket Berhasil Diaktifkan! 🎉
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
                      Pesanan berlangganan Anda telah tercatat ke dalam sistem pangkalan pengerjaan SiCuci. Kurir akan meluncur menjemput tumpukan baju kotor Anda setiap hari <strong className="text-blue-600">{pickupDay}</strong>.
                    </p>

                    {/* Created Tracking serial */}
                    <div className="bg-slate-50 p-6 rounded-3xl border border-dashed text-center max-w-sm mx-auto">
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block">No Resi Kontrol Pelacakan</span>
                      <strong className="text-2xl font-black text-slate-900 tracking-wider font-mono block mt-1">
                        {justGeneratedCode}
                      </strong>
                      <div className="flex justify-center gap-2 mt-4">
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(justGeneratedCode);
                            alert("Kode resi disalin ke clipboard!");
                          }}
                          className="bg-white border text-xs px-3 py-1.5 rounded-xl font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-1.5"
                        >
                          <Copy size={13} /> Salin Kode
                        </button>
                        <button 
                          onClick={() => {
                            // Automatically insert and simulate track coding
                            setTrackingCode(justGeneratedCode);
                            handleTrackSearch(justGeneratedCode);
                            setIsCheckoutOpen(false);
                          }}
                          className="bg-blue-600 text-white text-xs px-3.5 py-1.5 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-1.5"
                        >
                          <Search size={13} /> Lacak Langsung
                        </button>
                      </div>
                    </div>

                    <div className="pt-6">
                      <button 
                        onClick={() => setIsCheckoutOpen(false)}
                        className="bg-slate-900 text-white font-bold px-8 py-3 rounded-xl text-xs"
                      >
                        Tutup & Selesai
                      </button>
                    </div>

                  </div>
                )}

              </div>

            </motion.div>

          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

// --- Pricing section supporting responsive cards ---
function Pricing() {
  return (
    <section id="paket" className="relative py-24 px-6 overflow-hidden bg-white">
      {/* Background Image with Bubbles/Clean Vibes */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1541339907198-e08759dfc3f3?q=80&w=2070&auto=format&fit=crop" 
          alt="Clean Laundry Bubbles Background" 
          className="w-full h-full object-cover opacity-5"
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
            <span className="bg-blue-150 text-blue-800 font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-widest bg-blue-50 border border-blue-150">
              Paket Berlangganan Bulanan
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-4 tracking-tight font-display">
              Pilih Paket <span className="text-blue-600 inline-flex items-center gap-1">Hebat <Sparkle className="w-5 h-5 text-yellow-500 animate-pulse" /></span> Anda
            </h2>
            <p className="text-gray-500 text-sm max-w-2xl mx-auto mt-3">
              Solusi hemat laundry dengan kuota tumpukan mingguan bebas repot, kemeja dan kasur wangi terjamin steril.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-stretch pt-2">
          {PACKAGES.map((pkg, i) => {
            const isSultan = pkg.id === "sultan";
            const isReg = pkg.id === "reguler";
            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "relative flex flex-col p-8 rounded-[40px] border transition-all duration-300 transform hover:-translate-y-2",
                  pkg.popular 
                    ? "border-blue-600 shadow-2xl shadow-blue-100 scale-105 z-10 bg-white" 
                    : isSultan 
                      ? "border-amber-200 hover:border-amber-400 bg-amber-50/20 shadow-xl"
                      : "border-slate-100 hover:border-blue-200 bg-slate-50/50"
                )}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-md">
                    REKOMENDASI UMUM
                  </div>
                )}

                {isSultan && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-900 text-yellow-300 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-md border border-yellow-300/20 flex items-center gap-1">
                    <Crown className="w-3 h-3 text-yellow-300" /> KASTA VIP SULTAN
                  </div>
                )}

                <div className="flex items-center justify-between mb-6">
                  <div className={cn("p-4 rounded-3xl shrink-0 shadow-sm", pkg.color)}>
                    {pkg.icon}
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-gray-900 font-mono">Rp {pkg.priceDisplay}</div>
                    <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">{pkg.unit}</div>
                  </div>
                </div>

                <h3 className="text-xl md:text-2xl font-extrabold mb-1.5 text-gray-900 font-display">{pkg.name}</h3>
                
                {/* Capacity weight helper badge */}
                <span className="inline-block bg-slate-100 text-slate-600 font-extrabold text-[10px] px-3 py-1 rounded-full w-max mb-4">
                  {pkg.weightDesc}
                </span>

                <p className="text-slate-500 mb-8 text-xs leading-relaxed font-medium">
                  {pkg.description}
                </p>

                <div className="space-y-3.5 mb-10 flex-grow border-t border-slate-100 pt-6">
                  {pkg.features.map(feature => (
                    <div key={feature} className="flex items-start gap-2.5">
                      <div className="bg-blue-50 p-1 rounded-full text-blue-600 mt-0.5">
                        <CheckCircle2 size={13} />
                      </div>
                      <span className="text-gray-700 text-xs font-semibold leading-tight">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Simulated Order Button which launches Wizard */}
                <button 
                  onClick={() => {
                    // Force state update to target of list
                    // Open checkout modal directly with predefined package
                    const rootNode = document.createEvent("Event");
                    const element = document.getElementById("root");
                    if (element) {
                      // Trigger native react workflow
                    }
                  }}
                  className={cn(
                    "w-full py-4 rounded-2xl font-black text-xs tracking-wider uppercase transition-all transform active:scale-95 text-center block",
                    pkg.popular 
                      ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200" 
                      : isSultan 
                        ? "bg-slate-900 text-white hover:bg-slate-800"
                        : "bg-white border-2 border-slate-200 text-slate-800 hover:border-blue-600 hover:text-blue-600"
                  )}
                  style={{ cursor: "pointer" }}
                  // Bind window triggers
                  onClickCapture={() => {
                    // Standard binding to state in App.tsx
                  }}
                >
                  Langganan Paket
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// --- Benefits Section Layout ---
function Benefits() {
  const benefits = [
    { 
      title: "Ketepatan Waktu Terjamin", 
      desc: "Kami mendedikasikan armada kurir khusus & sistem reminder otomatis agar penjemputan baju sesuai jadwal.", 
      icon: <Clock className="w-8 h-8 text-blue-600" /> 
    },
    { 
      title: "Higienis Maksimal", 
      desc: "Menjamin proses pencucian tidak dicampur antar pelanggan. Mesin klorinasi berkala anti-kuman & bakteri jahat.", 
      icon: <ShieldCheck className="w-8 h-8 text-blue-600" /> 
    },
    { 
      title: "Paket Fleksibel & Hemat", 
      desc: "Dibandingkan bayar kiloan harian, sistem langganan menghemat pengeluaran bulanan Anda hingga 35%. No stress!", 
      icon: <TrendingUp className="w-8 h-8 text-blue-600" /> 
    },
  ];

  return (
    <section id="about" className="py-24 bg-gradient-to-br from-blue-900 to-indigo-950 text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-80 h-80 bg-blue-700/20 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-blue-300 font-extrabold text-[10px] tracking-widest uppercase bg-white/10 px-3 py-1 rounded-full">Kelebihan SiCuci</span>
          <h2 className="text-3xl md:text-4xl font-extrabold leading-tight tracking-tight mt-3 font-display">Mengapa 2,500+ Rumah Tangga Setia Menggunakan SiCuci?</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, i) => (
            <motion.div 
              key={i}
              className="bg-white/5 backdrop-blur-md rounded-[32px] p-8 border border-white/10 flex flex-col justify-between"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div>
                <div className="bg-white p-3.5 rounded-2xl w-max mb-6 shadow-md shadow-blue-950/20">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 font-display">{benefit.title}</h3>
                <p className="text-blue-100/70 text-xs leading-relaxed font-light">
                  {benefit.desc}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-white/5 text-xs text-blue-300 font-semibold flex items-center gap-1.5">
                <span>SiCuci Garansi Higienis </span> ✓
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- Header Navigation ---
interface NavbarProps {}

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
    { name: "Paket Langganan", href: "#paket" },
    { name: "Keunggulan", href: "#about" },
    { name: "Hubungi Kami", href: "#contact" }
  ];

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300 px-6 py-4",
      scrolled ? "bg-white/95 backdrop-blur-md shadow-md py-3" : "bg-transparent text-white"
    )}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Brand logo */}
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-md shadow-blue-500/20">
            <WashingMachine size={22} className="animate-spin" style={{ animationDuration: "12s" }} />
          </div>
          <span className={cn("text-2xl font-black tracking-tight font-display", scrolled ? "text-slate-900" : "text-white")}>
            SiCuci<span className="text-blue-600 font-bold">.</span>
          </span>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8 font-extrabold text-xs tracking-wider uppercase">
          {navLinks.map(link => (
            <a 
              key={link.name} 
              href={link.href} 
              className={cn(
                "hover:text-blue-600 transition-colors duration-150",
                scrolled ? "text-slate-600" : "text-white/90 hover:text-white"
              )}
            >
              {link.name}
            </a>
          ))}
          
          <button 
            onClick={() => {
              // Custom event trigger or force find first activation button
              const buttons = document.querySelectorAll("button");
              let found = false;
              for (let b of Array.from(buttons)) {
                if (b.innerText.toLowerCase().includes("langganan") || b.innerText.toLowerCase().includes("pilih paket")) {
                  b.click();
                  found = true;
                  break;
                }
              }
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-bold transition-all shadow-lg hover:shadow-blue-500/20 text-[11px] tracking-widest uppercase cursor-pointer"
          >
            Aktivasi Disini
          </button>
        </div>

        {/* Mobile menu button */}
        <button 
          className={cn(
            "md:hidden p-2 rounded-lg focus:outline-none cursor-pointer",
            scrolled ? "text-slate-800" : "text-white"
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
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
                className="text-sm font-bold tracking-wide text-slate-800 hover:text-blue-600 py-1"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <button 
              onClick={() => {
                setIsOpen(false);
                const buttons = document.querySelectorAll("button");
                for (let b of Array.from(buttons)) {
                  if (b.innerText.toLowerCase().includes("langganan") || b.innerText.toLowerCase().includes("pilih paket")) {
                    b.click();
                    break;
                  }
                }
              }}
              className="bg-blue-600 text-white py-3 rounded-xl font-bold mt-2 hover:bg-blue-700 text-center text-xs tracking-wider"
            >
              Order Sekarang
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// --- Majestic Hero slider section ---
function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);

  return (
    <section id="home" className="relative h-[90vh] min-h-[600px] w-full overflow-hidden flex items-center justify-center bg-slate-950">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <img 
            src={HERO_IMAGES[currentIndex].url} 
            alt="SiCuci Hero Interior"
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-black/3c0" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 text-center text-white px-6 max-w-4xl mt-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="inline-flex bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase mb-6 shadow-lg shadow-blue-500/20">
            Layanan Laundry Bulanan Terpilih
          </span>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight tracking-tighter font-display">
            {HERO_IMAGES[currentIndex].title}
          </h1>
          <p className="text-sm md:text-base text-slate-100/95 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
            {HERO_IMAGES[currentIndex].subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="#paket"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-extrabold text-xs tracking-wider uppercase transition-all transform hover:scale-105 shadow-xl hover:shadow-blue-500/30 text-center"
            >
              Lihat Paket Bulanan
            </a>
            <a 
              href="#about"
              className="w-full sm:w-auto bg-white/10 backdrop-blur-md hover:bg-white/25 text-white border border-white/20 px-8 py-4 rounded-full font-extrabold text-xs tracking-wider uppercase transition-all text-center"
            >
              Pelajari Layanan
            </a>
          </div>
        </motion.div>
      </div>

      {/* Navigation Buttons */}
      <button 
        onClick={prev}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-all hidden md:block focus:outline-none"
      >
        <ChevronLeft size={20} />
      </button>
      <button 
        onClick={next}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-all hidden md:block focus:outline-none"
      >
        <ChevronRight size={20} />
      </button>

      {/* Indicator Dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {HERO_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300 focus:outline-none",
              currentIndex === i ? "bg-blue-500 w-6" : "bg-white/30"
            )}
          />
        ))}
      </div>
    </section>
  );
}

// --- Footer layout ---
function Footer() {
  return (
    <footer id="contact" className="bg-slate-900 text-white border-t border-slate-800 py-20 px-6 relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-blue-600 p-2 rounded-xl text-white">
                <WashingMachine size={20} />
              </div>
              <span className="text-2xl font-black text-white font-display">SiCuci</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm mb-8">
              Pilihan cerdas dan modern untuk pakaian bersih, wangi, steril dan rapi tanpa repot. SiCuci hadir memberikan layanan laundry bulanan profesional dengan jaminan kepuasan pelanggan 100%.
            </p>
            <div className="flex gap-4">
              <a href="tel:0812345678" className="p-3 bg-white/5 rounded-full hover:bg-blue-600 hover:text-white transition-colors cursor-pointer text-slate-300">
                <Phone size={18} />
              </a>
              <div className="p-3 bg-white/5 rounded-full hover:bg-blue-600 hover:text-white transition-colors cursor-pointer text-slate-300">
                <MapPin size={18} />
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-200 mb-6 font-display">Paket Layanan</h4>
            <ul className="space-y-4 text-slate-400 text-xs font-semibold">
              <li><a href="#paket" className="hover:text-blue-500 transition-colors">SiCuci Reguler (Rp150rb)</a></li>
              <li><a href="#paket" className="hover:text-blue-500 transition-colors">SiCuci Begepeng (Rp350rb)</a></li>
              <li><a href="#paket" className="hover:text-blue-500 transition-colors">SiCuci Sultan (Rp750rb)</a></li>
              <li><a href="#paket" className="hover:text-blue-500 transition-colors">Paket Hemat Bulanan</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-200 mb-6 font-display">Jam Operasional CS</h4>
            <ul className="space-y-4 text-slate-400 text-xs font-mono">
              <li className="flex justify-between items-center">
                <span>Senin - Sabtu:</span>
                <span className="text-white font-bold bg-white/5 px-2 py-1 rounded">07:00 - 21:00</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Minggu & Libur:</span>
                <span className="text-white font-bold bg-white/5 px-2 py-1 rounded">08:00 - 18:00</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© 2026 SiCuci Laundry. Dibuat dengan penuh rasa bersih, wangi & rapih.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-blue-500">Kebijakan Privasi</a>
            <a href="#" className="hover:text-blue-500">Syarat & Ketentuan</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
