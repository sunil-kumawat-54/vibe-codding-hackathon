import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, X, MessageSquare, Sparkles, Check, Plus, AlertCircle } from 'lucide-react';

export default function AIAssistant({ isOpen, onClose, onAddToCart, onBookTable, cart, menuItems }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'Benvenuto to Delizioso! I am your AI Culinary Guide. I can recommend dishes, suggest wine pairings, filter for dietary preferences (like vegan or gluten-free), and assist you in ordering or reserving a table.',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const response = generateAIResponse(inputText);
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        sender: 'ai',
        text: response.text,
        action: response.action,
        timestamp: new Date()
      }]);
      setIsTyping(false);
    }, 1200);
  };

  const generateAIResponse = (text) => {
    const input = text.toLowerCase();

    // Check dietary restrictions
    if (input.includes('vegan') || input.includes('vegetarian')) {
      return {
        text: "Delizioso offers excellent plant-based culinary delights! I highly recommend our *Tartufo e Funghi Risotto* (wild mushrooms, black truffle carpaccio) or our *Pomodoro Basilico Caprese*. Would you like me to add the Tartufo Risotto to your order?",
        action: { type: 'add_item', itemName: 'Risotto ai Funghi e Tartufo' }
      };
    }

    if (input.includes('gluten') || input.includes('gf') || input.includes('celiac')) {
      return {
        text: "Absolutely. Our *Pan-Seared Branzino* (Mediterranean sea bass with fennel salad) and our *Filetto di Manzo al Tartufo* are naturally gluten-free. For dessert, the *Torta al Cioccolato Fondente* (dark chocolate cake) is flourless and GF. Shall I add the Torta al Cioccolato to your order?",
        action: { type: 'add_item', itemName: 'Torta al Cioccolato Fondente' }
      };
    }

    // Check for wine pairings
    if (input.includes('wine') || input.includes('pair') || input.includes('drink')) {
      return {
        text: "An excellent choice! For our signature pasta dishes and red meats, we pair them with a robust Tuscan Red, *Tignanello Antinori*. For fish and seafood, we recommend the crisp *Gavi di Gavi DOCG*. Would you like to check out our wine list or add a glass of Gavi di Gavi?",
        action: { type: 'add_item', itemName: 'Gavi di Gavi Blanc' }
      };
    }

    // Check for reservation command
    if (input.includes('book') || input.includes('reserve') || input.includes('table')) {
      return {
        text: "I can help you reserve our premier tables! We have exclusive slots for tonight: Table 4 (Garden View) and Table 7 (Grand Piano Side). Would you like to book Table 4 for 8:00 PM?",
        action: { type: 'book_table', tableNumber: 4, timeSlot: '20:00' }
      };
    }

    // Recommendation keyword
    if (input.includes('recommend') || input.includes('special') || input.includes('best')) {
      return {
        text: "Our centerpiece chef specialty is the *Bistecca alla Fiorentina* (45-day dry-aged gold-crusted porterhouse steak) paired with rosemary potatoes. For pasta lovers, the *Handcrafted Lobster Ravioli* with saffron cream is supreme. Would you like to add the Lobster Ravioli to your order?",
        action: { type: 'add_item', itemName: 'Ravioli all\'Aragosta' }
      };
    }

    // Specific item check
    if (input.includes('pizza') || input.includes('margherita')) {
      return {
        text: "Yes, we make an artisanal Neapolitan Margherita pizza with buffalo mozzarella, fresh basil, and extra virgin olive oil. Shall I add it to your cart?",
        action: { type: 'add_item', itemName: 'Pizza Margherita DOC' }
      };
    }

    if (input.includes('tiramisu') || input.includes('dessert')) {
      return {
        text: "Ah, the *Delizioso Tiramisu* is legendary! Layers of espresso-soaked ladyfingers, rich mascarpone cream, and dark cocoa dust. It is a absolute must-try! Would you like me to add one to your cart?",
        action: { type: 'add_item', itemName: 'Delizioso Tiramisu' }
      };
    }

    // General query default
    return {
      text: "I want to make your dining experience perfect. You can ask me to suggest vegan options, recommend wine pairings, or say 'book Table 4' to reserve. How can I delight you today?",
    };
  };

  const handleActionClick = (action) => {
    if (action.type === 'add_item') {
      const item = menuItems.find(i => i.name === action.itemName);
      if (item) {
        onAddToCart(item);
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          sender: 'ai',
          text: `Added **${action.itemName}** to your order cart! 🛒`,
          timestamp: new Date()
        }]);
      } else {
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          sender: 'ai',
          text: `I couldn't find ${action.itemName} in the menu, but I can recommend something else!`,
          timestamp: new Date()
        }]);
      }
    } else if (action.type === 'book_table') {
      onBookTable(action.tableNumber, action.timeSlot);
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        sender: 'ai',
        text: `Splendido! I've reserved **Table ${action.tableNumber}** for you tonight at **${action.timeSlot}**! Check the Reservation tab to view details. 📅`,
        timestamp: new Date()
      }]);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => {
          // Open state handled in App
          onBookTable(null, null); // safe trigger
        }}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-[#D4AF37] text-[#0A0A0A] hover:bg-[#F4A460] shadow-lg transition-transform hover:scale-110 flex items-center gap-2 font-semibold"
        style={{ border: '2px solid rgba(255,255,255,0.2)' }}
      >
        <Bot size={24} />
        <span className="text-xs uppercase tracking-widest hidden md:inline">Delizioso AI</span>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-[380px] h-[500px] bg-[#141414] border border-[rgba(212,175,55,0.3)] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up">
      {/* Header */}
      <div className="p-4 bg-[#0A0A0A] border-b border-[rgba(212,175,55,0.15)] flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[rgba(212,175,55,0.1)] text-[#D4AF37]">
            <Bot size={20} className="animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-semibold tracking-wide text-white">AI Culinary Guide</h4>
            <p className="text-[10px] text-[#D4AF37] uppercase tracking-widest font-semibold flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-ping"></span>
              Online & Ready
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/5 text-white/60 hover:text-white">
          <X size={20} />
        </button>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar bg-[#0A0A0A]/50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className="max-w-[85%]">
              <div
                className={`p-3 rounded-2xl text-sm ${
                  msg.sender === 'user'
                    ? 'bg-[#D4AF37] text-[#0A0A0A] rounded-tr-sm font-medium'
                    : 'bg-[#1e1e1e] text-white/90 border border-white/5 rounded-tl-sm'
                }`}
              >
                {/* Parse basic markdown bolding */}
                {msg.text.split('**').map((chunk, i) => 
                  i % 2 === 1 ? <strong key={i} className={msg.sender === 'user' ? 'font-bold' : 'text-[#D4AF37] font-semibold'}>{chunk}</strong> : chunk
                )}

                {/* Inline Action Buttons inside chat bubble */}
                {msg.action && (
                  <div className="mt-3 pt-2 border-t border-white/5 flex gap-2">
                    <button
                      onClick={() => handleActionClick(msg.action)}
                      className={`text-xs px-3 py-1.5 rounded-full flex items-center gap-1 transition-all ${
                        msg.action.type === 'add_item'
                          ? 'bg-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0A0A0A]'
                          : 'bg-white/10 text-white hover:bg-white hover:text-[#0A0A0A]'
                      }`}
                    >
                      {msg.action.type === 'add_item' ? <Plus size={12} /> : <Sparkles size={12} />}
                      {msg.action.type === 'add_item' ? 'Add Item to Cart' : `Book Table ${msg.action.tableNumber}`}
                    </button>
                  </div>
                )}
              </div>
              <span className="text-[9px] text-white/30 block mt-1 px-1">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-[#1e1e1e] border border-white/5 p-3 rounded-2xl rounded-tl-sm flex items-center gap-1">
              <span className="h-2 w-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="h-2 w-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="h-2 w-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Input Chips */}
      <div className="px-4 py-2 bg-[#0A0A0A] border-t border-white/5 overflow-x-auto flex gap-2 no-scrollbar">
        {['Vegan options?', 'Suggest a wine', 'Chef specials', 'Reserve a table'].map((chip, idx) => (
          <button
            key={idx}
            onClick={() => setInputText(chip)}
            className="text-[10px] text-white/50 border border-white/10 hover:border-[#D4AF37] hover:text-[#D4AF37] px-2.5 py-1 rounded-full whitespace-nowrap transition-colors"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Form Input */}
      <form onSubmit={handleSend} className="p-3 bg-[#141414] border-t border-[rgba(212,175,55,0.15)] flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask our AI Culinary Guide..."
          className="flex-1 bg-[#0A0A0A] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37] placeholder-white/30"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2 rounded-xl bg-[#D4AF37] text-[#0A0A0A] hover:bg-[#F4A460] disabled:opacity-50 disabled:hover:bg-[#D4AF37] transition-all flex items-center justify-center"
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}
