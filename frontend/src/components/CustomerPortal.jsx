import React, { useState } from 'react';
import { ShoppingBag, Calendar, BookOpen, Star, Sparkles, Plus, Minus, User, Heart, ChevronRight, Check } from 'lucide-react';

export default function CustomerPortal({ 
  menuItems, 
  cart, 
  onAddToCart, 
  onRemoveFromCart, 
  onUpdateCartQty, 
  onBookTable, 
  reservations, 
  activeTab, 
  setActiveTab 
}) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [bookingTableId, setBookingTableId] = useState(null);
  const [bookingTime, setBookingTime] = useState('19:00');
  const [bookingGuests, setBookingGuests] = useState('2');
  const [bookingDate, setBookingDate] = useState('2026-07-28');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const categories = ['All', 'Starters', 'Mains', 'Desserts', 'Beverages'];

  const filteredMenu = selectedCategory === 'All'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Sample tables layout (1 to 8)
  const tables = [
    { id: 1, name: 'Table 1', seats: 2, position: 'Window Nook', status: 'Available' },
    { id: 2, name: 'Table 2', seats: 4, position: 'Grand Piano', status: 'Available' },
    { id: 3, name: 'Table 3', seats: 2, position: 'Garden Courtyard', status: 'Reserved' },
    { id: 4, name: 'Table 4', seats: 6, position: 'VIP Lounge', status: 'Available' },
    { id: 5, name: 'Table 5', seats: 4, position: 'Main Dining Room', status: 'Available' },
    { id: 6, name: 'Table 6', seats: 2, position: 'Sommelier Counter', status: 'Available' },
    { id: 7, name: 'Table 7', seats: 8, position: 'Chef\'s Round Table', status: 'Reserved' },
    { id: 8, name: 'Table 8', seats: 4, position: 'Fireplace Hearth', status: 'Available' },
  ];

  const handleReserve = (e) => {
    e.preventDefault();
    if (!bookingTableId) return;
    onBookTable(bookingTableId, bookingTime, bookingGuests, bookingDate);
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setBookingTableId(null);
    }, 4000);
  };

  const handleCheckout = () => {
    setCheckoutSuccess(true);
    setTimeout(() => {
      setCheckoutSuccess(false);
      cart.forEach(item => onRemoveFromCart(item.id, true)); // Empty cart
    }, 4000);
  };

  return (
    <div className="relative pb-24">
      {/* 1. Header & Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden pt-12">
        <div className="gold-glow-radial" style={{ top: '10%', right: '5%' }}></div>
        <div className="gold-glow-radial" style={{ bottom: '15%', left: '5%', width: '450px', height: '450px' }}></div>
        
        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          {/* Left Column: Typography Content */}
          <div className="space-y-8">
            <div className="flex items-center gap-2">
              <span className="h-[1px] w-8 bg-[#D4AF37]"></span>
              <p className="uppercase-label text-xs">Ristorante Delizioso</p>
            </div>
            
            <h1 className="text-white font-bold leading-none">
              Delizioso — <br />
              <span className="text-[#D4AF37] italic">Italian Cuisine</span>
            </h1>
            
            <p className="text-white/60 max-w-[48ch] text-base leading-relaxed">
              Experience the pinnacle of culinary artistry. Staggering 3D flavors, curated Tuscan vintages, and a luxurious setting blending historic Italian heritage with modern sensory excellence.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <button 
                onClick={() => {
                  const menuSec = document.getElementById('menu-section');
                  menuSec?.scrollIntoView({ behavior: 'smooth' });
                }} 
                className="btn-gold"
              >
                Explore Menu
              </button>
              <button 
                onClick={() => {
                  const reserveSec = document.getElementById('reservation-section');
                  reserveSec?.scrollIntoView({ behavior: 'smooth' });
                }} 
                className="btn-secondary"
              >
                Reserve a Table
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/5">
              <div>
                <p className="text-2xl font-bold text-white serif-font">18+</p>
                <p className="text-xs text-white/40 uppercase tracking-wider">Michelin Stars Combined</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white serif-font">100%</p>
                <p className="text-xs text-white/40 uppercase tracking-wider">Organic Tuscan Sourcing</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white serif-font">4.9★</p>
                <p className="text-xs text-white/40 uppercase tracking-wider">Customer Experience</p>
              </div>
            </div>
          </div>

          {/* Right Column: 3D perspective Food Showcase */}
          <div className="perspective-container relative h-[500px] w-full flex justify-center items-center">
            {/* Ambient gold glow card background */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/5 to-transparent rounded-full filter blur-3xl opacity-60"></div>
            
            {/* The 3D Floating Plate */}
            <div className="tilt-element floating-food relative">
              {/* Outer Decorative Gold Ring */}
              <div className="absolute -inset-4 border border-[#D4AF37]/20 rounded-full animate-[spin_40s_linear_infinite]"></div>
              <div className="absolute -inset-8 border border-white/5 rounded-full animate-[spin_60s_linear_infinite]"></div>

              {/* Main Food Image (Modern Heritage styled Plate) */}
              <div className="h-[380px] w-[380px] md:h-[430px] md:w-[430px] rounded-full overflow-hidden border-4 border-[#D4AF37]/35 shadow-2xl relative bg-[#141414]">
                <img src="/images/risotto_plate.png" alt="Risotto ai Funghi e Tartufo" className="w-full h-full object-cover" />
              </div>

              {/* Float Badge 1: Best Rated */}
              <div 
                className="absolute top-12 -left-4 bg-[#141414]/90 border border-[#D4AF37]/30 px-4 py-2.5 rounded-2xl flex items-center gap-2 shadow-xl backdrop-blur-md"
                style={{ transform: 'rotate(-5deg)' }}
              >
                <div className="p-1 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">
                  <Star size={16} fill="#D4AF37" />
                </div>
                <div>
                  <p className="text-[10px] text-white/50 uppercase tracking-widest font-semibold">Best Rated</p>
                  <p className="text-xs text-white font-bold serif-font">Gold Risotto</p>
                </div>
              </div>

              {/* Float Badge 2: Signature Dish */}
              <div 
                className="absolute bottom-16 -right-6 bg-[#141414]/90 border border-[#D4AF37]/30 px-4 py-2.5 rounded-2xl flex items-center gap-2 shadow-xl backdrop-blur-md"
                style={{ transform: 'rotate(6deg)' }}
              >
                <div className="p-1 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">
                  <Sparkles size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-white/50 uppercase tracking-widest font-semibold">Chef Signature</p>
                  <p className="text-xs text-white font-bold serif-font">Black Truffle Sea Bass</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Digital Menu Section */}
      <section id="menu-section" className="py-24 border-t border-white/5 relative">
        <div className="container space-y-12">
          {/* Menu Title */}
          <div className="text-center max-w-xl mx-auto space-y-4">
            <p className="uppercase-label">Sinfonia dei Sapori</p>
            <h2 className="text-white font-bold">The Digital Menu</h2>
            <p className="text-white/60 text-sm">
              Discover dishes prepared with rare ingredients, freshly handmade pastas, and premium imports. Order directly for table service.
            </p>
          </div>

          {/* Categories Tab Selector */}
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full text-xs font-semibold uppercase tracking-widest transition-all ${
                  selectedCategory === category
                    ? 'bg-[#D4AF37] text-[#0A0A0A]'
                    : 'bg-[#141414] text-white/70 border border-white/5 hover:border-[#D4AF37]/40 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Staggered Dish Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-8">
            {filteredMenu.map((item) => (
              <div key={item.id} className="menu-card flex flex-col h-full group">
                {/* Food Image Container */}
                <div className="h-64 bg-[#0A0A0A] overflow-hidden relative border-b border-white/5 flex items-center justify-center">
                  {/* Outer glow background */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
                  
                  {/* Inline Dish Image or Fallback SVG */}
                  <div className="w-full h-full flex items-center justify-center transition-transform duration-700 group-hover:scale-110">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <svg viewBox="0 0 200 200" className="w-40 h-40">
                        <circle cx="100" cy="100" r="90" fill="#141414" stroke="#D4AF37" strokeWidth="1" strokeDasharray="3,6" opacity="0.3" />
                        <circle cx="100" cy="100" r="80" fill="#0c0c0c" stroke="#D4AF37" strokeWidth="1.5" opacity="0.5" />
                        <circle cx="100" cy="100" r="60" fill="none" stroke={item.price > 35 ? '#D4AF37' : '#F4A460'} strokeWidth="2.5" />
                        <path d="M70 100 Q100 80 130 100" fill="none" stroke="#D4AF37" strokeWidth="3" opacity="0.9" />
                        <path d="M75 110 Q100 95 125 110" fill="none" stroke="#F4A460" strokeWidth="2" opacity="0.8" />
                        <circle cx="100" cy="90" r="5" fill="#ef4444" />
                        <circle cx="85" cy="115" r="4.5" fill="#22c55e" />
                        <circle cx="115" cy="115" r="4" fill="#22c55e" />
                      </svg>
                    )}
                  </div>
                  
                  {/* Availability Badge */}
                  <span className={`absolute top-4 right-4 z-20 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full ${
                    item.available 
                      ? 'bg-green-500/10 text-green-400 border border-green-500/30' 
                      : 'bg-red-500/10 text-red-400 border border-red-500/30'
                  }`}>
                    {item.available ? 'Available' : 'Sold Out'}
                  </span>

                  {/* Category Tag */}
                  <span className="absolute bottom-4 left-4 z-20 text-[9px] uppercase font-semibold tracking-widest text-[#D4AF37] bg-[#0A0A0A]/80 border border-[#D4AF37]/20 px-2.5 py-0.5 rounded-md">
                    {item.category}
                  </span>
                </div>

                {/* Card Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-baseline gap-2">
                      <h3 className="text-lg text-white font-bold group-hover:text-[#D4AF37] transition-colors duration-300">
                        {item.name}
                      </h3>
                      <span className="text-lg font-semibold text-[#D4AF37] serif-font">${item.price.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-white/55 line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {/* Add to Order Button */}
                  <div className="pt-2">
                    <button
                      onClick={() => onAddToCart(item)}
                      disabled={!item.available}
                      className="w-full bg-white/5 border border-white/10 hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0A0A0A] disabled:opacity-30 disabled:hover:bg-white/5 disabled:hover:text-white/60 py-3 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-white/80 transition-all duration-300"
                    >
                      <Plus size={14} />
                      Add to order
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Table Reservation Section */}
      <section id="reservation-section" className="py-24 bg-[#141414] border-y border-white/5 relative">
        <div className="gold-glow-radial" style={{ top: '30%', left: '50%', transform: 'translateX(-50%)' }}></div>
        <div className="container space-y-12 relative z-10">
          <div className="text-center max-w-xl mx-auto space-y-4">
            <p className="uppercase-label">Prenotazione</p>
            <h2 className="text-white font-bold">Smart Reservations</h2>
            <p className="text-white/60 text-sm">
              Pre-book premier tables featuring grand piano proximity, scenic garden views, or the Sommelier service table.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Table Floor Map Selector (7 columns) */}
            <div className="lg:col-span-7 bg-[#0A0A0A]/60 border border-white/5 p-6 rounded-3xl space-y-6">
              <h3 className="text-lg text-white font-bold border-b border-white/5 pb-3">Select a Table</h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {tables.map((table) => {
                  const isUserReserved = reservations.some(r => r.tableId === table.id);
                  const isBusy = table.status === 'Reserved' || isUserReserved;
                  
                  return (
                    <button
                      key={table.id}
                      type="button"
                      disabled={isBusy}
                      onClick={() => setBookingTableId(table.id)}
                      className={`p-4 rounded-2xl flex flex-col items-center justify-center text-center transition-all min-h-[110px] ${
                        bookingTableId === table.id
                          ? 'bg-[#D4AF37] text-[#0A0A0A] scale-105 shadow-lg'
                          : isUserReserved
                          ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                          : isBusy
                          ? 'bg-white/5 border border-white/5 text-white/20 cursor-not-allowed'
                          : 'bg-[#141414] border border-white/10 text-white/80 hover:border-[#D4AF37] hover:scale-102'
                      }`}
                    >
                      <span className="text-xs uppercase tracking-widest font-bold block mb-1">
                        {table.name}
                      </span>
                      <span className="text-[10px] opacity-70 block mb-2">{table.seats} Seats</span>
                      <span className={`text-[9px] uppercase px-2 py-0.5 rounded-full ${
                        isUserReserved
                          ? 'bg-green-500/20 text-green-400 font-bold'
                          : isBusy
                          ? 'bg-white/5 text-white/30'
                          : 'bg-white/10 text-[#D4AF37] font-semibold'
                      }`}>
                        {isUserReserved ? 'Your Table' : table.status}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Map legend */}
              <div className="flex flex-wrap gap-6 pt-4 border-t border-white/5 justify-center text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 rounded-lg bg-[#141414] border border-white/10"></span>
                  <span className="text-white/60">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 rounded-lg bg-[#D4AF37]"></span>
                  <span className="text-white/60">Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 rounded-lg bg-white/5 border border-white/5"></span>
                  <span className="text-white/30">Already Reserved</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 rounded-lg bg-green-500/20 border border-green-500/30"></span>
                  <span className="text-green-400">Your Booking</span>
                </div>
              </div>
            </div>

            {/* Booking Details Form (5 columns) */}
            <div className="lg:col-span-5 bg-[#0A0A0A]/60 border border-white/5 p-6 rounded-3xl">
              <h3 className="text-lg text-white font-bold border-b border-white/5 pb-3">Reservation Details</h3>
              
              <form onSubmit={handleReserve} className="space-y-5 pt-4">
                {/* Table confirmation */}
                <div>
                  <label className="text-[10px] text-white/40 uppercase tracking-widest font-semibold block mb-1">Selected Table</label>
                  <div className="bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#D4AF37] font-bold">
                    {bookingTableId 
                      ? `Table ${bookingTableId} (${tables.find(t=>t.id===bookingTableId)?.position})` 
                      : 'Please select a table from the grid'}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-white/40 uppercase tracking-widest font-semibold block mb-1">Date</label>
                    <input 
                      type="date" 
                      value={bookingDate} 
                      onChange={e=>setBookingDate(e.target.value)}
                      className="w-full bg-[#141414] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-white/40 uppercase tracking-widest font-semibold block mb-1">Time</label>
                    <select 
                      value={bookingTime}
                      onChange={e=>setBookingTime(e.target.value)}
                      className="w-full bg-[#141414] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="17:00">5:00 PM</option>
                      <option value="18:00">6:00 PM</option>
                      <option value="19:00">7:00 PM</option>
                      <option value="20:00">8:00 PM</option>
                      <option value="21:00">9:00 PM</option>
                      <option value="22:00">10:00 PM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-white/40 uppercase tracking-widest font-semibold block mb-1">Number of Guests</label>
                  <select 
                    value={bookingGuests}
                    onChange={e=>setBookingGuests(e.target.value)}
                    className="w-full bg-[#141414] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="4">4 Guests</option>
                    <option value="6">6 Guests</option>
                    <option value="8">8 Guests</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={!bookingTableId || bookingSuccess}
                  className="w-full btn-gold py-3 text-xs font-bold uppercase tracking-widest rounded-xl transition-all"
                >
                  {bookingSuccess ? 'Booking Confirmed! ✓' : 'Reserve Table Now'}
                </button>

                {bookingSuccess && (
                  <div className="bg-green-500/10 text-green-400 border border-green-500/30 p-3 rounded-xl text-xs text-center">
                    Excellent choice. Your reservation request for Table {bookingTableId} has been registered!
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Bento-Style Chef / Story Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Mosaic Grid (5 cols) */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4 relative">
              {/* Mosaic image card 1 (Chef Marcelle Vivaldi) */}
              <div className="rounded-3xl overflow-hidden bg-[#141414] h-72 border border-white/5">
                <img src="/images/chef.png" alt="Chef Marcelle Vivaldi" className="w-full h-full object-cover" />
              </div>

              {/* Mosaic metric card in between */}
              <div className="rounded-3xl bg-gradient-to-br from-[#D4AF37] to-[#F4A460] p-6 text-[#0A0A0A] flex flex-col justify-between h-44 self-center relative z-10 shadow-xl" style={{ marginTop: '20px' }}>
                <p className="text-[10px] uppercase font-bold tracking-widest text-[#0A0A0A]/60">Est. Heritage</p>
                <div>
                  <h3 className="text-4xl font-extrabold serif-font leading-none">12+</h3>
                  <p className="text-xs font-semibold uppercase tracking-wider mt-1">Years of Craft</p>
                </div>
              </div>

              {/* Mosaic image card 2 (Brunello Wine Cellar) */}
              <div className="rounded-3xl overflow-hidden bg-[#141414] h-80 border border-white/5 col-span-2 md:col-span-1" style={{ marginTop: '-40px' }}>
                <img src="/images/wine.png" alt="Wine Cellar Selection" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Right Column: Editorial Text (7 cols) */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-4">
                <span className="uppercase-label">Our Visionary Chef</span>
                <h2 className="text-white font-bold leading-tight">Mastering Classic Secrets, Redefining 3D Textures</h2>
                <p className="text-white/70 italic text-lg border-l-2 border-[#D4AF37] pl-4 font-serif">
                  "Cooking is not just preparing food; it is an emotional performance. We capture the authentic essence of Tuscany and deliver it with premium visual depth."
                </p>
              </div>

              <p className="text-white/60 text-sm leading-relaxed">
                Chef Marcelle Vivaldi has trained across prestigious European kitchens, bringing a profound reverence for locally sourced olives, organic flour, and black truffles. Our custom 3D dining plate presentation ensures a breathtaking experience the moment your order arrives.
              </p>

              {/* SVG Signature */}
              <div className="pt-4 flex flex-col gap-1">
                <svg viewBox="0 0 200 60" className="w-44 h-12 text-white/60">
                  <path d="M20 40 Q40 10 60 30 T100 20 T140 40 T180 30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M40 25 L50 45" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M120 20 L130 40" fill="none" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                <p className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold mt-2">Marcelle Vivaldi</p>
                <p className="text-[10px] text-white/40 uppercase">Executive Chef & Owner</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Cart Drawer/Bar overlay */}
      {cart.length > 0 && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 bg-[#141414] border border-[#D4AF37]/35 rounded-full px-6 py-3.5 shadow-2xl flex items-center justify-between gap-8 w-[92%] max-w-[500px] animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] relative">
              <ShoppingBag size={18} />
              <span className="absolute -top-1.5 -right-1.5 bg-[#D4AF37] text-[#0A0A0A] text-[9px] font-extrabold h-4.5 w-4.5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </div>
            <div>
              <p className="text-[9px] text-white/40 uppercase tracking-widest">Order Subtotal</p>
              <p className="text-sm text-white font-bold serif-font">${cartTotal.toFixed(2)}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab('cart')}
              className="text-xs uppercase tracking-widest font-bold bg-white/10 hover:bg-white/15 text-white px-4 py-2.5 rounded-full transition-all"
            >
              View Order
            </button>
            <button 
              onClick={handleCheckout}
              className="text-xs uppercase tracking-widest font-bold bg-[#D4AF37] text-[#0A0A0A] hover:bg-[#F4A460] px-5 py-2.5 rounded-full transition-all"
            >
              Checkout
            </button>
          </div>
        </div>
      )}

      {/* Mobile Floating CTA Bottom Bar for quick navigation (per spec) */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-[#141414]/95 backdrop-blur-md border border-white/5 rounded-full px-2 py-1.5 shadow-2xl flex justify-between items-center w-[280px] md:hidden">
        <button
          onClick={() => {
            const menuSec = document.getElementById('menu-section');
            menuSec?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex-1 text-[10px] text-center font-bold uppercase tracking-widest py-2.5 rounded-full text-white bg-white/5 hover:bg-white/10 transition-all"
        >
          Menu
        </button>
        <button
          onClick={() => {
            const resSec = document.getElementById('reservation-section');
            resSec?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex-1 text-[10px] text-center font-bold uppercase tracking-widest py-2.5 rounded-full text-[#0A0A0A] bg-[#D4AF37] hover:bg-[#F4A460] transition-all ml-2"
        >
          Book Table
        </button>
      </div>

      {/* Cart Sheet modal view */}
      {activeTab === 'cart' && (
        <div className="fixed inset-0 bg-black/80 z-50 flex justify-end">
          <div className="w-full max-w-[450px] bg-[#141414] border-l border-[#D4AF37]/20 p-6 flex flex-col justify-between animate-slide-up h-full">
            
            {/* Header */}
            <div>
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={20} className="text-[#D4AF37]" />
                  <h3 className="text-lg text-white font-bold">Your Order Cart</h3>
                </div>
                <button 
                  onClick={() => setActiveTab('menu')}
                  className="text-xs uppercase tracking-widest text-white/50 hover:text-white"
                >
                  Close
                </button>
              </div>

              {/* Items List */}
              {cart.length === 0 ? (
                <div className="py-24 text-center space-y-4">
                  <p className="text-white/40 text-sm">Your order is currently empty</p>
                  <button 
                    onClick={() => setActiveTab('menu')}
                    className="btn-secondary text-xs"
                  >
                    Browse Dishes
                  </button>
                </div>
              ) : (
                <div className="space-y-4 overflow-y-auto max-h-[55vh] py-4 no-scrollbar">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-3 rounded-2xl bg-[#0A0A0A]/50 border border-white/5">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-white">{item.name}</p>
                        <p className="text-xs text-[#D4AF37]">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      
                      {/* Quantity Toggles */}
                      <div className="flex items-center gap-3 bg-[#141414] border border-white/10 rounded-xl px-2 py-1">
                        <button 
                          onClick={() => onUpdateCartQty(item.id, item.quantity - 1)}
                          className="p-1 hover:text-[#D4AF37] text-white/60"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-xs font-bold text-white w-4 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateCartQty(item.id, item.quantity + 1)}
                          className="p-1 hover:text-[#D4AF37] text-white/60"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Billing Actions Summary */}
            {cart.length > 0 && (
              <div className="border-t border-white/5 pt-6 space-y-6 bg-[#141414]">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-white/60">
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-white/60">
                    <span>Service Tax (5%)</span>
                    <span>${(cartTotal * 0.05).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-white/60">
                    <span>Restaurant Service Charge (10%)</span>
                    <span>${(cartTotal * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-white border-t border-white/5 pt-2">
                    <span className="serif-font text-[#D4AF37]">Grand Total</span>
                    <span className="serif-font text-[#D4AF37]">${(cartTotal * 1.15).toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleCheckout}
                    disabled={checkoutSuccess}
                    className="w-full btn-gold py-3.5 text-xs font-bold uppercase tracking-widest rounded-xl transition-all"
                  >
                    {checkoutSuccess ? 'Order Placed! Sending to Kitchen...' : 'Confirm Order & Send to Kitchen'}
                  </button>
                  <button 
                    onClick={() => setActiveTab('menu')}
                    className="w-full text-center text-xs uppercase tracking-widest text-white/40 hover:text-white/80 py-2 block font-bold"
                  >
                    Continue Adding Dishes
                  </button>
                </div>

                {checkoutSuccess && (
                  <div className="bg-green-500/10 text-green-400 border border-green-500/30 p-3 rounded-xl text-xs text-center animate-pulse">
                    Order confirmed! Live tracker updated. Please check the Dashboard or wait for your server.
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
