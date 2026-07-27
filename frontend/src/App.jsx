import React, { useState, useEffect } from 'react';
import { Bot, User, Utensils, LayoutDashboard, Bell, Check, Sparkles } from 'lucide-react';
import CustomerView from './components/CustomerView';
import StaffDashboard from './components/StaffDashboard';

const API_BASE_URL = 'http://localhost:5000/api';

export default function App() {
  const [activeView, setActiveView] = useState('customer'); // customer, dashboard
  const [activeDashboardTab, setActiveDashboardTab] = useState('orders'); // orders, menu, tables
  
  // Central synced states from backend
  const [menu, setMenu] = useState([]);
  const [tables, setTables] = useState([]);
  const [orders, setOrders] = useState([]);
  const [queue, setQueue] = useState([]);
  const [notifications, setNotifications] = useState([]);
  
  // Placed orders tracked by this client session
  const [placedOrdersTracker, setPlacedOrdersTracker] = useState([]);

  // AI Suggestion State
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Toast notifications state
  const [toastMessage, setToastMessage] = useState(null);

  // Polling function to synchronize states with backend
  const pollBackendData = async () => {
    try {
      // 1. Fetch Menu
      const menuRes = await fetch(`${API_BASE_URL}/menu`);
      if (menuRes.ok) {
        const menuData = await menuRes.json();
        setMenu(menuData);
      }

      // 2. Fetch Tables
      const tablesRes = await fetch(`${API_BASE_URL}/tables`);
      if (tablesRes.ok) {
        const tablesData = await tablesRes.json();
        setTables(tablesData);
      }

      // 3. Fetch Orders
      const ordersRes = await fetch(`${API_BASE_URL}/orders`);
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData);
        
        // Sync status of orders placed by this specific client tab
        if (placedOrdersTracker.length > 0) {
          setPlacedOrdersTracker(prev => 
            prev.map(trackedOrder => {
              const updated = ordersData.find(o => o.id === trackedOrder.id);
              return updated ? { ...trackedOrder, status: updated.status } : trackedOrder;
            })
          );
        }
      }

      // 4. Fetch Waitlist Queue
      const queueRes = await fetch(`${API_BASE_URL}/queue`);
      if (queueRes.ok) {
        const queueData = await queueRes.json();
        setQueue(queueData);
      }

      // 5. Fetch Notifications
      const notifRes = await fetch(`${API_BASE_URL}/notifications`);
      if (notifRes.ok) {
        const notifData = await notifRes.json();
        setNotifications(notifData);
      }
    } catch (err) {
      console.error('Connection error polling backend. Check if backend server is running on port 5000:', err.message);
    }
  };

  // Start polling cycle on component mount (runs every 3 seconds)
  useEffect(() => {
    pollBackendData(); // Initial load
    const interval = setInterval(pollBackendData, 3000);
    return () => clearInterval(interval);
  }, [placedOrdersTracker]);

  // Toast trigger utility
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // API Call: Placed Order
  const handlePlaceOrder = async (cartItems) => {
    try {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table_number: 1, // Defaulting table number to 1 for this client demonstration
          items: cartItems
        })
      });
      if (res.ok) {
        const newOrder = await res.json();
        setPlacedOrdersTracker(prev => [newOrder, ...prev]);
        showToast(`Order Placed Successfully! Ticket: ${newOrder.id}`);
        pollBackendData();
      }
    } catch (err) {
      console.error('Error placing order:', err.message);
      showToast('Connection failed. Could not place order.');
    }
  };

  // API Call: Join Waitlist
  const handleJoinWaitlist = async (name, size, callback) => {
    try {
      const res = await fetch(`${API_BASE_URL}/queue/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, size })
      });
      if (res.ok) {
        const queueItem = await res.json();
        if (callback) callback(queueItem);
        showToast(`${name}, you have successfully joined the waitlist!`);
        pollBackendData();
      }
    } catch (err) {
      console.error('Error joining waitlist:', err.message);
      showToast('Connection failed. Could not join waitlist.');
    }
  };

  // API Call: Toggle Menu Dish Availability (Staff side)
  const handleToggleAvailability = async (itemId, available) => {
    try {
      const res = await fetch(`${API_BASE_URL}/menu/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: itemId, available })
      });
      if (res.ok) {
        showToast(`Dish availability updated successfully!`);
        pollBackendData();
      }
    } catch (err) {
      console.error('Error toggling menu item:', err.message);
    }
  };

  // API Call: Progress Kitchen Status (Staff side)
  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        showToast(`Order ${orderId} updated to: ${status}`);
        pollBackendData();
      }
    } catch (err) {
      console.error('Error updating order status:', err.message);
    }
  };

  // API Call: Cycle Table state (Staff side)
  const handleToggleTableStatus = async (tableId, status) => {
    try {
      const res = await fetch(`${API_BASE_URL}/tables/${tableId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        const result = await res.json();
        if (result.autoSeatedMessage) {
          showToast(`Waitlist advanced! ${result.autoSeatedMessage}`);
        } else {
          showToast(`Table ${tableId} changed to: ${status}`);
        }
        pollBackendData();
      }
    } catch (err) {
      console.error('Error changing table status:', err.message);
    }
  };

  // API Call: Clear operational logs
  const handleClearNotifications = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/notifications/clear`, {
        method: 'POST'
      });
      if (res.ok) {
        pollBackendData();
      }
    } catch (err) {
      console.error('Error clearing operations feed:', err.message);
    }
  };

  // API Call: Gemini Smart Suggestion
  const handleCallAISuggestion = async (cart) => {
    setIsAiLoading(true);
    setAiSuggestion(null);
    try {
      const res = await fetch(`${API_BASE_URL}/ai/suggest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart })
      });
      if (res.ok) {
        const suggestion = await res.json();
        setAiSuggestion(suggestion);
      }
    } catch (err) {
      console.error('AI suggestion request failed:', err.message);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-charcoal flex flex-col relative pb-12">
      {/* 1. Header with navigation view switches */}
      <header className="bg-brand-charcoal-dark border-b border-white/5 py-5 sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Logo / Branding */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-orange/10 text-brand-orange rounded-xl border border-brand-orange/20">
              <Utensils size={20} className="animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white font-serif leading-none">TableSync</h1>
              <span className="text-[9px] uppercase tracking-widest text-[#D4AF37] font-bold">Operations SaaS</span>
            </div>
          </div>

          {/* Quick View Switches */}
          <div className="flex bg-brand-charcoal-light border border-white/10 rounded-full p-1">
            <button
              onClick={() => setActiveView('customer')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                activeView === 'customer'
                  ? 'bg-brand-orange text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <User size={13} />
              Customer View
            </button>
            <button
              onClick={() => setActiveView('dashboard')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                activeView === 'dashboard'
                  ? 'bg-brand-orange text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <LayoutDashboard size={13} />
              Staff Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Content Frame */}
      <main className="container mx-auto px-4 py-8 flex-1">
        {activeView === 'customer' ? (
          <CustomerView
            menu={menu}
            queue={queue}
            orders={orders}
            onPlaceOrder={handlePlaceOrder}
            onJoinWaitlist={handleJoinWaitlist}
            onCallAISuggestion={handleCallAISuggestion}
            aiSuggestion={aiSuggestion}
            isAiLoading={isAiLoading}
            placedOrdersTracker={placedOrdersTracker}
          />
        ) : (
          <StaffDashboard
            menu={menu}
            tables={tables}
            orders={orders}
            queue={queue}
            notifications={notifications}
            onToggleAvailability={handleToggleAvailability}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onToggleTableStatus={handleToggleTableStatus}
            onClearNotifications={handleClearNotifications}
            activeDashboardTab={activeDashboardTab}
            setActiveDashboardTab={setActiveDashboardTab}
          />
        )}
      </main>

      {/* 3. Toast Notifications Overlay */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-brand-charcoal-light border border-[#D4AF37]/30 px-5 py-3 rounded-2xl flex items-center gap-3 shadow-2xl animate-slide-up">
          <div className="p-1 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">
            <Bell size={16} />
          </div>
          <span className="text-xs text-white/90 font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
