/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  User, 
  Menu, 
  X, 
  ChevronRight, 
  Star, 
  Facebook, 
  Instagram, 
  Twitter,
  ArrowRight,
  Plus,
  Minus,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Types
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
}

interface CartItem extends Product {
  quantity: number;
}

const PRODUCTS: Product[] = [
  { id: 1, name: "Şimşek McQueen 'I'm Lightning' T-Shirt", price: 250, image: "https://m.media-amazon.com/images/I/61N8-8-8-8L._AC_UX679_.jpg", category: "T-Shirt", rating: 4.9 },
  { id: 2, name: "Canscos Nakışlı Baggy Eşofman", price: 300, image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=600&auto=format&fit=crop", category: "Eşofman", rating: 4.8 },
  { id: 3, name: "Canscos Düz Beyaz 6'lı Spor Çorap", price: 175, image: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?q=80&w=600&auto=format&fit=crop", category: "Aksesuar", rating: 4.7 },
  { id: 4, name: "Canscos Örme Detaylı Terlik", price: 275, image: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=600&auto=format&fit=crop", category: "Terlik", rating: 4.9 },
  { id: 5, name: "Canscos Örme Şehir Çantası", price: 450, image: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop", category: "Çanta", rating: 4.8 },
  { id: 6, name: "Canscos Erkek Çelik Kolye", price: 200, image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop", category: "Takı", rating: 4.5 },
  { id: 7, name: "Canscos Kadın Paslanmaz Takı", price: 350, image: "https://images.unsplash.com/photo-1535633302723-995f4141253b?q=80&w=600&auto=format&fit=crop", category: "Takı", rating: 4.9 },
  { id: 8, name: "Canscos Nakışlı Drill Şapka", price: 150, image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=600&auto=format&fit=crop", category: "Şapka", rating: 4.7 },
];

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-black selection:bg-red-600 selection:text-white">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black text-white py-3 shadow-lg' : 'bg-transparent text-black py-6'}`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button onClick={() => setIsMenuOpen(true)} className="lg:hidden">
              <Menu size={24} />
            </button>
            <a href="#" className="text-2xl font-black tracking-tighter flex items-center gap-1">
              CANSCOS<span className="text-red-600">.</span>
            </a>
            <div className="hidden lg:flex items-center gap-8 text-sm font-bold uppercase tracking-widest">
              <a href="#" className="hover:text-red-600 transition-colors">Yeni Gelenler</a>
              <a href="#" className="hover:text-red-600 transition-colors">Mağaza</a>
              <div className="relative group">
                <button 
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                  className="hover:text-red-600 transition-colors flex items-center gap-1 uppercase"
                >
                  Kategoriler
                </button>
                
                {/* Desktop Dropdown */}
                <AnimatePresence>
                  {isCategoriesOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 mt-4 w-64 bg-black text-white p-6 shadow-2xl border-t-2 border-red-600"
                    >
                      <ul className="space-y-4 text-xs font-bold tracking-widest">
                        <li><a href="#" className="hover:text-red-600 transition-colors block">T-Shirt Modelleri</a></li>
                        <li><a href="#" className="hover:text-red-600 transition-colors block">Eşofman Modelleri</a></li>
                        <li><a href="#" className="hover:text-red-600 transition-colors block">Terlik Modelleri</a></li>
                        <li><a href="#" className="hover:text-red-600 transition-colors block">Çanta Modelleri</a></li>
                        <li><a href="#" className="hover:text-red-600 transition-colors block">Aksesuar Modelleri</a></li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <a href="#" className="hover:text-red-600 transition-colors">İndirim</a>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="hover:text-red-600 transition-colors hidden sm:block">
              <Search size={20} />
            </button>
            <button className="hover:text-red-600 transition-colors hidden sm:flex items-center gap-2">
              <User size={20} />
              <span className="text-[10px] font-black uppercase tracking-widest">Giriş Yap</span>
            </button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative hover:text-red-600 transition-colors"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop" 
            alt="Canscos Streetwear" 
            className="w-full h-full object-cover opacity-70"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl text-white"
          >
            <h2 className="text-red-600 font-black uppercase tracking-[0.3em] text-sm mb-4">Canscos Streetwear 2026</h2>
            <h1 className="text-6xl md:text-8xl font-black leading-none mb-8 tracking-tighter">
              DRİLL <br /> <span className="text-red-600">TARZI</span> SOKAKTA
            </h1>
            <p className="text-lg text-gray-300 mb-10 max-w-lg leading-relaxed">
              Şimşek McQueen T-shirtler, bol baggy eşofmanlar ve drill şapkalarla tarzını konuştur. Canscos kalitesiyle sokak modasına yön ver.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-red-600 hover:bg-red-700 text-white px-10 py-4 font-bold uppercase tracking-widest transition-all transform hover:scale-105">
                Koleksiyonu Gör
              </button>
              <button className="border-2 border-white hover:bg-white hover:text-black text-white px-10 py-4 font-bold uppercase tracking-widest transition-all">
                Yeni Gelenler
              </button>
            </div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-white/50 text-[10px] uppercase tracking-[0.2em] font-bold">Kaydır</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-red-600 to-transparent"></div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl font-black tracking-tighter mb-2">KATEGORİLER</h2>
              <div className="h-1 w-20 bg-red-600"></div>
            </div>
            <a href="#" className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-red-600 transition-colors">
              Tümünü Gör <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'T-Shirt & Eşofman', img: 'https://m.media-amazon.com/images/I/61N8-8-8-8L._AC_UX679_.jpg' },
              { name: 'Terlik & Ayakkabı', img: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=1000&auto=format&fit=crop' },
              { name: 'Şapka & Takı', img: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=1000&auto=format&fit=crop' }
            ].map((cat, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="relative h-[500px] group overflow-hidden cursor-pointer"
              >
                <img 
                  src={cat.img} 
                  alt={cat.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <h3 className="text-white text-3xl font-black tracking-tighter mb-4">{cat.name}</h3>
                  <button 
                    onClick={() => {
                      // Find first product in this category or just open a generic one for demo
                      const prod = PRODUCTS.find(p => p.category.includes(cat.name.split(' ')[0])) || PRODUCTS[0];
                      setSelectedProduct(prod);
                    }}
                    className="bg-white text-black px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white transition-colors"
                  >
                    İncele
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black tracking-tighter mb-4 uppercase">Popüler Ürünler</h2>
            <p className="text-gray-500 max-w-xl mx-auto">En çok tercih edilen ve sezonun en hit parçalarını keşfedin.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {PRODUCTS.map((product) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-white mb-4">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  {/* CANSCOS Branding Overlay (Woven/Knitted Style) */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-white/60 text-2xl font-black tracking-[0.15em] bg-black/30 px-4 py-2 rounded-sm border border-white/20 backdrop-blur-[1px] select-none shadow-inner uppercase">
                      CANSCOS
                    </span>
                  </div>
                  <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
                    Yeni
                  </div>
                  <div className="absolute bottom-0 left-0 w-full flex translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <button 
                      onClick={() => setSelectedProduct(product)}
                      className="flex-1 bg-white text-black py-4 font-bold uppercase tracking-widest hover:bg-gray-100 border-r border-gray-100"
                    >
                      İncele
                    </button>
                    <button 
                      onClick={() => addToCart(product)}
                      className="flex-1 bg-black text-white py-4 font-bold uppercase tracking-widest hover:bg-red-600"
                    >
                      Sepete Ekle
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">{product.category}</p>
                    <h3 className="font-bold text-lg leading-tight group-hover:text-red-600 transition-colors">{product.name}</h3>
                    <div className="flex items-center gap-1 mt-1 text-yellow-500">
                      <Star size={12} fill="currentColor" />
                      <span className="text-xs font-bold text-black">{product.rating}</span>
                    </div>
                  </div>
                  <p className="font-black text-lg">₺{product.price}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-black text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 uppercase">Bültenimize Katılın</h2>
          <p className="text-gray-400 mb-10 max-w-2xl mx-auto">
            Yeni koleksiyonlardan, özel indirimlerden ve etkinliklerden ilk siz haberdar olun. 
            İlk alışverişinizde %15 indirim kazanın.
          </p>
          <form className="max-w-md mx-auto flex gap-2">
            <input 
              type="email" 
              placeholder="E-posta adresiniz" 
              className="flex-1 bg-white/10 border border-white/20 px-6 py-4 focus:outline-none focus:border-red-600 transition-colors"
            />
            <button className="bg-red-600 hover:bg-red-700 px-8 py-4 font-bold uppercase tracking-widest transition-colors">
              Kaydol
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white pt-24 pb-12 border-t border-gray-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div>
              <a href="#" className="text-3xl font-black tracking-tighter mb-6 block">
                CANSCOS<span className="text-red-600">.</span>
              </a>
              <p className="text-gray-500 mb-6 leading-relaxed">
                Teknolojinizi stilinizle buluşturuyoruz. En kaliteli telefon aksesuarları için doğru adrestesiniz.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white transition-all">
                  <Instagram size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white transition-all">
                  <Twitter size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white transition-all">
                  <Facebook size={18} />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-black uppercase tracking-widest text-sm mb-6">Alışveriş</h4>
              <ul className="space-y-4 text-gray-500 text-sm">
                <li><a href="#" className="hover:text-red-600 transition-colors">Yeni Gelenler</a></li>
                <li><a href="#" className="hover:text-red-600 transition-colors">En Çok Satanlar</a></li>
                <li><a href="#" className="hover:text-red-600 transition-colors">Mağaza</a></li>
                <li><a href="#" className="hover:text-red-600 transition-colors">İndirimli Ürünler</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-black uppercase tracking-widest text-sm mb-6">Destek</h4>
              <ul className="space-y-4 text-gray-500 text-sm">
                <li><a href="#" className="hover:text-red-600 transition-colors">Sipariş Takibi</a></li>
                <li><a href="#" className="hover:text-red-600 transition-colors">İade ve Değişim</a></li>
                <li><a href="#" className="hover:text-red-600 transition-colors">Kargo Bilgileri</a></li>
                <li><a href="#" className="hover:text-red-600 transition-colors">Sıkça Sorulan Sorular</a></li>
                <li><a href="#" className="hover:text-red-600 transition-colors">Bize Ulaşın</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-black uppercase tracking-widest text-sm mb-6">Mağaza</h4>
              <p className="text-gray-500 text-sm mb-4">
                Nişantaşı, Abdi İpekçi Cd. No:42<br />
                Şişli / İstanbul
              </p>
              <p className="text-gray-500 text-sm mb-4">
                +90 (212) 555 00 00<br />
                info@novastore.com
              </p>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">
            <p>© 2026 CANSCOS. TÜM HAKLARI SAKLIDIR.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-black">Gizlilik Politikası</a>
              <a href="#" className="hover:text-black">Kullanım Koşulları</a>
              <a href="#" className="hover:text-black">KVKK</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setSelectedProduct(null);
                setCustomImage(null);
              }}
              className="fixed inset-0 bg-black/80 z-[100] backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-4 md:inset-24 bg-white z-[110] shadow-2xl overflow-hidden flex flex-col md:flex-row rounded-lg"
            >
              <button 
                onClick={() => {
                  setSelectedProduct(null);
                  setCustomImage(null);
                }}
                className="absolute top-6 right-6 z-20 p-2 bg-black text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X size={24} />
              </button>

              {/* Image Section */}
              <div className="w-full md:w-1/2 h-64 md:h-auto bg-gray-100 relative group">
                <img 
                  src={customImage || selectedProduct.image} 
                  alt={selectedProduct.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {customImage && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
                    Özel Tasarım
                  </div>
                )}
                {/* Branding Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-white/40 text-4xl font-black tracking-[0.2em] bg-black/10 px-6 py-2 rounded-sm border border-white/10 backdrop-blur-[1px] select-none uppercase">
                    CANSCOS
                  </span>
                </div>
              </div>

              {/* Details Section */}
              <div className="flex-1 p-8 md:p-12 overflow-y-auto flex flex-col">
                <div className="mb-8">
                  <p className="text-red-600 font-bold uppercase tracking-widest text-xs mb-2">{selectedProduct.category}</p>
                  <h2 className="text-4xl font-black tracking-tighter leading-tight mb-4">{selectedProduct.name}</h2>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-3xl font-black">₺{selectedProduct.price}</span>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star size={16} fill="currentColor" />
                      <span className="text-sm font-bold text-black">{selectedProduct.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-500 leading-relaxed mb-8">
                    Canscos özel koleksiyonu. %100 pamuklu kumaş, yüksek kaliteli baskı ve modern kesim. 
                    Sokak stilinizi en üst seviyeye taşıyacak benzersiz bir parça.
                  </p>
                </div>

                {/* Customization Section */}
                <div className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-100">
                  <h4 className="font-black uppercase tracking-widest text-xs mb-4">Kendi Fotoğrafını Ekle</h4>
                  <p className="text-xs text-gray-400 mb-4">Ürünün üzerine kendi fotoğrafını veya tasarımını yerleştirerek nasıl duracağını gör.</p>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Plus className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Fotoğraf Seç</p>
                    </div>
                    <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                  </label>
                  {customImage && (
                    <button 
                      onClick={() => setCustomImage(null)}
                      className="mt-4 text-red-600 text-[10px] font-bold uppercase tracking-widest hover:underline"
                    >
                      Fotoğrafı Kaldır
                    </button>
                  )}
                </div>

                <div className="mt-auto flex gap-4">
                  <button 
                    onClick={() => {
                      addToCart(selectedProduct);
                      setSelectedProduct(null);
                      setCustomImage(null);
                    }}
                    className="flex-1 bg-black text-white py-5 font-bold uppercase tracking-widest hover:bg-red-600 transition-colors shadow-xl shadow-black/10"
                  >
                    Sepete Ekle
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-black tracking-tighter uppercase">Sepetim ({cartCount})</h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <ShoppingBag size={64} className="text-gray-200 mb-4" />
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Sepetiniz Boş</p>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="mt-6 text-red-600 font-black uppercase tracking-widest text-xs hover:underline"
                    >
                      Alışverişe Başla
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="w-24 h-32 bg-gray-100 flex-shrink-0 overflow-hidden">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start">
                              <h3 className="font-bold text-sm uppercase tracking-tight leading-tight">{item.name}</h3>
                              <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-600">
                                <Trash2 size={16} />
                              </button>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">{item.category}</p>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center border border-gray-200">
                              <button 
                                onClick={() => updateQuantity(item.id, -1)}
                                className="p-1 hover:bg-gray-100"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, 1)}
                                className="p-1 hover:bg-gray-100"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <p className="font-black text-sm">₺{item.price * item.quantity}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {cart.length > 0 && (
                <div className="p-6 border-t border-gray-100 bg-gray-50">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-gray-500 font-bold uppercase tracking-widest text-xs">Toplam</span>
                    <span className="text-2xl font-black tracking-tighter">₺{cartTotal}</span>
                  </div>
                  <button className="w-full bg-red-600 hover:bg-red-700 text-white py-4 font-bold uppercase tracking-widest transition-colors shadow-lg shadow-red-600/20">
                    Ödemeye Geç
                  </button>
                  <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-widest">
                    Ücretsiz Kargo & 30 Gün İade Garantisi
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/90 z-[80] backdrop-blur-md"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed top-0 left-0 h-full w-full max-w-xs bg-black text-white z-[90] p-8 flex flex-col"
            >
              <div className="flex justify-between items-center mb-12">
                <span className="text-2xl font-black tracking-tighter">CANSCOS<span className="text-red-600">.</span></span>
                <button onClick={() => setIsMenuOpen(false)}>
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex flex-col gap-8 text-2xl font-black tracking-tighter uppercase">
                <a href="#" className="hover:text-red-600 transition-colors">Yeni Gelenler</a>
                <a href="#" className="hover:text-red-600 transition-colors">Mağaza</a>
                <div>
                  <button 
                    onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                    className="hover:text-red-600 transition-colors w-full text-left flex justify-between items-center"
                  >
                    Kategoriler {isCategoriesOpen ? <Minus size={24} /> : <Plus size={24} />}
                  </button>
                  <AnimatePresence>
                    {isCategoriesOpen && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden pl-4 mt-4 space-y-4 text-lg text-gray-400"
                      >
                        <a href="#" className="block hover:text-white">T-Shirt Modelleri</a>
                        <a href="#" className="block hover:text-white">Eşofman Modelleri</a>
                        <a href="#" className="block hover:text-white">Terlik Modelleri</a>
                        <a href="#" className="block hover:text-white">Çanta Modelleri</a>
                        <a href="#" className="block hover:text-white">Aksesuar Modelleri</a>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <a href="#" className="hover:text-red-600 transition-colors">Aksesuar</a>
                <a href="#" className="hover:text-red-600 transition-colors text-red-600">İndirim</a>
                <a href="#" className="hover:text-red-600 transition-colors flex items-center gap-2">
                  <User size={24} /> Giriş Yap
                </a>
              </div>
              
              <div className="mt-auto pt-8 border-t border-white/10">
                <div className="flex flex-col gap-4 text-sm font-bold uppercase tracking-widest text-gray-400">
                  <a href="#" className="hover:text-white">Hesabım</a>
                  <a href="#" className="hover:text-white">Yardım</a>
                  <a href="#" className="hover:text-white">Mağazalar</a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
