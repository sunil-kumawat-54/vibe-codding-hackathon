import React, { useState } from 'react';
import { ShoppingBag, Clock, Sparkles, Check, AlertCircle, Users, Trash2, Plus, Minus } from 'lucide-react';

export default function CustomerView({
  menu,
  queue,
  orders,
  onPlaceOrder,
  onJoinWaitlist,
  onCallAISuggestion,
  aiSuggestion,
  isAiLoading,
  placedOrdersTracker
}) {
  const [cart, setCart] = useState([]);
  const [waitlistForm, setWaitlistForm] = useState({ name: '', size: '2' });
  const [hasJoinedWaitlist, setHasJoinedWaitlist] = useState(false);
  const [joinedDetails, setJoinedDetails] = useState(null);
  const [showCartDrawer, setShowCartDrawer] = useState(false);

  // Cart Handlers
  const handleAddToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const handleUpdateQty = (itemId, change) => {
    setCart(prev => prev.map(item => {
      if (item.id === itemId) {
        const newQty = item.quantity + change;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    onPlaceOrder(cart);
    setCart([]);
    setShowCartDrawer(false);
  };

  const handleJoinQueue = (e) => {
    e.preventDefault();
    if (!waitlistForm.name.trim()) return;
    onJoinWaitlist(waitlistForm.name, waitlistForm.size, (data) => {
      setHasJoinedWaitlist(true);
      setJoinedDetails(data);
    });
  };

  const handleAddAISuggestion = () => {
    if (!aiSuggestion) return;
    const suggestedItem = menu.find(i => i.name === aiSuggestion.recommendation);
    if (suggestedItem) {
      handleAddToCart(suggestedItem);
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Check waitlist position
  const currentQueuePosition = joinedDetails && queue
    ? queue.findIndex(q => q.name === joinedDetails.name) + 1
    : 0;

  return (
    <div className="space-y-12">
      {/* Smart Suggestion banner */}
      <section className="bg-brand-charcoal-light border border-brand-orange/30 p-6 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-bl from-brand-orange/10 to-transparent rounded-bl-3xl"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <span className="text-[10px] uppercase font-bold tracking-widest text-brand-orange flex items-center gap-1.5">
              <Sparkles size={12} className="animate-pulse" /> Platinum AI Copilot
            </span>
            <h3 className="text-xl font-bold font-serif">What should you pair with your meal?</h3>
            <p className="text-xs text-white/60">
              Our Chef-AI scans current available ingredients, kitchen station loads, and popular combinations to recommend the perfect side dish.
            </p>
          </div>

          <button
            onClick={() => onCallAISuggestion(cart)}
            disabled={isAiLoading}
            className="bg-brand-orange hover:bg-brand-orange-light disabled:bg-brand-orange/30 text-white font-bold uppercase tracking-wider text-xs px-6 py-3 rounded-full transition-all shrink-0 shadow-lg shadow-brand-orange/20"
          >
            {isAiLoading ? 'Analyzing menu...' : 'Get AI Recommendation'}
          </button>
        </div>

        {/* Dynamic suggestion output */}
        {aiSuggestion && (
          <div className="mt-6 p-4 bg-brand-charcoal border-l-4 border-brand-orange rounded-r-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-slide-up">
            <div className="space-y-1">
              <p className="text-xs font-bold text-white/50 uppercase">Chef Suggestion</p>
              <h4 className="text-base font-bold text-brand-orange">{aiSuggestion.recommendation}</h4>
              <p className="text-xs text-white/80">{aiSuggestion.reason}</p>
            </div>
            
            {menu.find(i => i.name === aiSuggestion.recommendation)?.available && (
              <button
                onClick={handleAddAISuggestion}
                className="bg-white/10 hover:bg-white text-white hover:text-black font-bold uppercase tracking-wider text-[10px] px-4 py-2 rounded-xl transition-all flex items-center gap-1 shrink-0"
              >
                <Plus size={12} /> Add to Cart
              </button>
            )}
          </div>
        )}
      </section>

      {/* Main Grid: Menu and Operations Widget (Queue + Orders Tracker) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Digital Menu (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <h2 className="text-xl font-bold font-serif text-white flex items-center gap-2">
              <ShoppingBag className="text-brand-orange" size={20} /> Live Digital Menu
            </h2>
            <span className="text-[10px] text-white/40 uppercase tracking-widest font-semibold flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-ping"></span>
              Auto-Sync Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {menu.map((item) => (
              <div 
                key={item.id} 
                className={`bg-brand-charcoal-light border rounded-3xl overflow-hidden transition-all duration-300 ${
                  item.available 
                    ? 'border-white/5 hover:border-brand-orange/30 shadow-md hover:shadow-lg' 
                    : 'border-white/5 opacity-50'
                }`}
              >
                {/* Visual Placeholder */}
                <div className="h-32 bg-brand-charcoal relative flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-16 h-16 text-brand-orange/20">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" />
                    <path d="M30 50 Q50 30 70 50" fill="none" stroke="currentColor" strokeWidth="3" />
                  </svg>
                  
                  {/* Availability Badge */}
                  <span className={`absolute top-3 right-3 text-[9px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full ${
                    item.available 
                      ? 'bg-green-500/10 text-green-400 border border-green-500/30' 
                      : 'bg-red-500/10 text-red-400 border border-red-500/30'
                  }`}>
                    {item.available ? 'Available' : 'Sold Out'}
                  </span>

                  <span className="absolute bottom-3 left-3 text-[9px] uppercase font-semibold text-brand-orange/80 bg-brand-charcoal-light/80 px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                </div>

                {/* Details */}
                <div className="p-5 space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between items-baseline gap-2">
                      <h4 className="font-bold text-white text-base">{item.name}</h4>
                      <span className="font-bold text-brand-orange text-sm">${item.price.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-white/50 line-clamp-2">{item.description}</p>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-[10px] text-white/40 flex items-center gap-1">
                      <Clock size={12} /> Ready in {item.prep_time}m
                    </span>
                    
                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={!item.available}
                      className="bg-brand-orange hover:bg-brand-orange-light disabled:bg-white/5 text-white disabled:text-white/30 font-bold uppercase tracking-wider text-[10px] px-4 py-2 rounded-xl transition-all"
                    >
                      Add to order
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Waitlist & Order Status Tracker Side Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* 1. Smart Waitlist Queue */}
          <div className="bg-brand-charcoal-light border border-white/5 p-6 rounded-3xl space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#D4AF37] border-b border-white/5 pb-2 flex items-center gap-2">
              <Users size={16} /> Live Waitlist
            </h3>

            {!hasJoinedWaitlist ? (
              <form onSubmit={handleJoinQueue} className="space-y-3">
                <p className="text-xs text-white/60">No tables open? Join our smart queue to reserve the next available slot.</p>
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={waitlistForm.name}
                    onChange={e => setWaitlistForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-brand-charcoal border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-orange"
                  />
                </div>
                <div>
                  <select
                    value={waitlistForm.size}
                    onChange={e => setWaitlistForm(prev => ({ ...prev, size: e.target.value }))}
                    className="w-full bg-brand-charcoal border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-orange"
                  >
                    <option value="2">2 Guests</option>
                    <option value="4">4 Guests</option>
                    <option value="6">6 Guests</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-white/5 border border-white/10 hover:border-brand-orange hover:bg-brand-orange hover:text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
                >
                  Join Queue
                </button>
              </form>
            ) : (
              <div className="space-y-4 text-center py-2 animate-slide-up">
                <div className="p-3 bg-brand-orange/10 border border-brand-orange/20 rounded-2xl">
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">Queue Status</p>
                  <h4 className="text-2xl font-bold text-brand-orange serif-font mt-1">
                    {currentQueuePosition > 0 ? `Position #${currentQueuePosition}` : 'Seated!'}
                  </h4>
                  <p className="text-xs text-white/70 mt-1">
                    {currentQueuePosition > 0 
                      ? `Est. Wait: ${currentQueuePosition * 10} mins` 
                      : 'Please proceed to your table. Enjoy!'}
                  </p>
                </div>
                {currentQueuePosition > 0 && (
                  <p className="text-[10px] text-white/30">
                    Your position updates automatically. Waitlist auto-advances when a staff marks a table available.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* 2. Order Tracking Timeline */}
          {placedOrdersTracker.length > 0 && (
            <div className="bg-brand-charcoal-light border border-white/5 p-6 rounded-3xl space-y-4 animate-slide-up">
              <h3 className="text-sm font-bold uppercase tracking-widest text-brand-orange border-b border-white/5 pb-2">
                Your Placed Orders
              </h3>
              
              <div className="space-y-6">
                {placedOrdersTracker.map((ord) => {
                  const statusMap = {
                    'Pending': 1,
                    'Cooking': 2,
                    'Ready': 3,
                    'Served': 4,
                    'Completed': 4
                  };
                  const step = statusMap[ord.status] || 1;

                  return (
                    <div key={ord.id} className="space-y-3 p-3 bg-brand-charcoal/40 border border-white/5 rounded-2xl">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-white">{ord.id}</span>
                        <span className="text-[10px] text-[#D4AF37] uppercase font-bold tracking-widest">{ord.status}</span>
                      </div>

                      {/* Line timeline progress */}
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between text-[10px] text-white/40">
                          <span className={step >= 1 ? 'text-green-400 font-bold' : ''}>Received</span>
                          <span className={step >= 2 ? 'text-green-400 font-bold' : ''}>Cooking</span>
                          <span className={step >= 3 ? 'text-green-400 font-bold' : ''}>Ready</span>
                          <span className={step >= 4 ? 'text-green-400 font-bold' : ''}>Served</span>
                        </div>
                        <div className="overflow-hidden h-1.5 text-xs flex rounded bg-brand-charcoal">
                          <div 
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-brand-orange transition-all duration-500"
                            style={{ width: `${(step / 4) * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-[10px] text-white/50 text-right mt-2">
                          {ord.status === 'Pending' && 'Order received by the desk.'}
                          {ord.status === 'Cooking' && 'Chef is preparing your fresh meal.'}
                          {ord.status === 'Ready' && 'Meal is plated and ready for pickup!'}
                          {ord.status === 'Served' && 'Delivered! Bon appetit.'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Persistent Shopping Cart Bottom Bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-brand-charcoal border border-brand-orange/45 rounded-full px-6 py-3.5 shadow-2xl flex items-center justify-between gap-8 w-[92%] max-w-[450px] animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-brand-orange/10 text-brand-orange relative">
              <ShoppingBag size={18} />
              <span className="absolute -top-1.5 -right-1.5 bg-brand-orange text-white text-[9px] font-extrabold h-4.5 w-4.5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </div>
            <div>
              <p className="text-[9px] text-white/40 uppercase tracking-widest">Cart Total</p>
              <p className="text-sm text-white font-bold">${cartTotal.toFixed(2)}</p>
            </div>
          </div>

          <button 
            onClick={() => setShowCartDrawer(true)}
            className="text-xs uppercase tracking-widest font-bold bg-brand-orange hover:bg-brand-orange-light text-white px-5 py-2.5 rounded-full transition-all"
          >
            Checkout Order
          </button>
        </div>
      )}

      {/* Cart Drawer modal */}
      {showCartDrawer && (
        <div className="fixed inset-0 bg-black/80 z-50 flex justify-end">
          <div className="w-full max-w-[420px] bg-brand-charcoal-light border-l border-white/5 p-6 flex flex-col justify-between animate-slide-up h-full">
            
            <div>
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={18} className="text-brand-orange" />
                  <h3 className="text-base text-white font-bold">Your Order Cart</h3>
                </div>
                <button 
                  onClick={() => setShowCartDrawer(false)}
                  className="text-xs uppercase tracking-widest text-white/50 hover:text-white"
                >
                  Close
                </button>
              </div>

              {/* Cart Items List */}
              <div className="space-y-4 overflow-y-auto max-h-[60vh] py-4 no-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-3 rounded-2xl bg-brand-charcoal border border-white/5">
                    <div>
                      <p className="text-xs font-semibold text-white">{item.name}</p>
                      <p className="text-[10px] text-brand-orange mt-0.5">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>

                    <div className="flex items-center gap-3 bg-brand-charcoal-light border border-white/10 rounded-xl px-2 py-1">
                      <button 
                        onClick={() => handleUpdateQty(item.id, -1)}
                        className="p-1 hover:text-brand-orange text-white/60"
                      >
                        <Minus size={10} />
                      </button>
                      <span className="text-xs font-bold text-white w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => handleUpdateQty(item.id, 1)}
                        className="p-1 hover:text-brand-orange text-white/60"
                      >
                        <Plus size={10} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Checkout Form */}
            <div className="border-t border-white/5 pt-4 space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-white/60">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>CGST & SGST (5%)</span>
                  <span>${(cartTotal * 0.05).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Service Charge (10%)</span>
                  <span>${(cartTotal * 0.1).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-brand-orange pt-2 border-t border-white/5">
                  <span>Total Amount</span>
                  <span>${(cartTotal * 1.15).toFixed(2)}</span>
                </div>
              </div>

              <form onSubmit={handleCheckout} className="space-y-3">
                <div>
                  <label className="text-[9px] uppercase font-bold tracking-wider text-white/40 block mb-1">Select Table Number</label>
                  <select 
                    required 
                    className="w-full bg-brand-charcoal border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-orange"
                    defaultValue="1"
                    name="table_number"
                  >
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num}>Table {num}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-orange hover:bg-brand-orange-light text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
                >
                  Send Order to Kitchen
                </button>
              </form>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
