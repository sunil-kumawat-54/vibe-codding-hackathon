import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const dataFilePath = path.resolve('data.json');

app.use(cors());
app.use(express.json());

// Helper function to read data from data.json
const readData = () => {
  try {
    const rawData = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error('Error reading data.json, returning empty structure:', error.message);
    return { menu: [], tables: [], orders: [], queue: [], notifications: [] };
  }
};

// Helper function to write data to data.json
const writeData = (data) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing to data.json:', error.message);
  }
};

// 1. GET MENU
app.get('/api/menu', (req, res) => {
  const data = readData();
  res.json(data.menu);
});

// 2. TOGGLE MENU AVAILABILITY
app.post('/api/menu/toggle', (req, res) => {
  const { id, available } = req.body;
  const data = readData();
  
  data.menu = data.menu.map(item => {
    if (item.id === parseInt(id)) {
      return { ...item, available: !!available };
    }
    return item;
  });

  writeData(data);
  res.json({ success: true, menu: data.menu });
});

// 3. GET ORDERS
app.get('/api/orders', (req, res) => {
  const data = readData();
  res.json(data.orders);
});

// 4. PLACE ORDER
app.post('/api/orders', (req, res) => {
  const { table_number, items } = req.body;
  const data = readData();

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Order must contain items' });
  }

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal * 1.15; // +15% mock tax/service charge

  const newOrder = {
    id: `ORD-${Math.floor(100 + Math.random() * 900)}`,
    table_number: parseInt(table_number) || null,
    items,
    total,
    status: 'Pending',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  data.orders.unshift(newOrder);

  // Auto-change table status if table is designated
  if (table_number) {
    data.tables = data.tables.map(t => {
      if (t.table_no === parseInt(table_number)) {
        return { ...t, status: 'Occupied' };
      }
      return t;
    });
  }

  // Push notifications
  data.notifications.unshift({
    id: Date.now(),
    message: `New order ${newOrder.id} received for Table ${table_number || 'Online'} (${items.length} items).`,
    type: 'order',
    created_at: new Date(),
    read: false
  });

  writeData(data);
  res.json(newOrder);
});

// 5. UPDATE ORDER STATUS
app.post('/api/orders/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // Pending, Cooking, Ready, Served, Completed
  const data = readData();

  data.orders = data.orders.map(order => {
    if (order.id === id) {
      return { ...order, status };
    }
    return order;
  });

  writeData(data);
  res.json({ success: true });
});

// 6. GET TABLES
app.get('/api/tables', (req, res) => {
  const data = readData();
  res.json(data.tables);
});

// 7. CYCLE TABLE STATUS & QUEUE AUTO-ADVANCE
app.post('/api/tables/:id/status', (req, res) => {
  const { id } = req.params; // table ID
  const { status } = req.body; // Available, Occupied, Reserved
  const data = readData();

  let autoSeatedMessage = null;

  data.tables = data.tables.map(table => {
    if (table.id === parseInt(id)) {
      // Logic: If table is set to 'Available' and someone is waiting in the queue, seat them automatically!
      if (status === 'Available' && data.queue.length > 0) {
        const nextGroup = data.queue[0]; // first group in queue
        
        // Remove from queue
        data.queue.shift();

        // Assign table status as Occupied
        autoSeatedMessage = `Table ${table.table_no} became Available. Auto-seated ${nextGroup.name} (Group of ${nextGroup.size}).`;
        
        // Create notification
        data.notifications.unshift({
          id: Date.now(),
          message: autoSeatedMessage,
          type: 'queue',
          created_at: new Date(),
          read: false
        });

        return { ...table, status: 'Occupied' };
      }
      return { ...table, status };
    }
    return table;
  });

  writeData(data);
  res.json({ success: true, tables: data.tables, autoSeatedMessage });
});

// 8. GET QUEUE
app.get('/api/queue', (req, res) => {
  const data = readData();
  res.json(data.queue);
});

// 9. JOIN WAITLIST QUEUE
app.post('/api/queue/join', (req, res) => {
  const { name, size } = req.body;
  const data = readData();

  if (!name || !size) {
    return res.status(400).json({ error: 'Name and group size are required' });
  }

  // Calculate estimated wait: 10 mins per party already waiting
  const estimatedWait = (data.queue.length + 1) * 10;

  const queueItem = {
    id: Date.now(),
    name,
    size: parseInt(size),
    waitTime: estimatedWait
  };

  data.queue.push(queueItem);

  data.notifications.unshift({
    id: Date.now(),
    message: `${name} (Group of ${size}) joined the waitlist. Est. wait: ${estimatedWait} mins.`,
    type: 'queue',
    created_at: new Date(),
    read: false
  });

  writeData(data);
  res.json(queueItem);
});

// 10. GET NOTIFICATIONS
app.get('/api/notifications', (req, res) => {
  const data = readData();
  res.json(data.notifications);
});

// 11. CLEAR NOTIFICATIONS
app.post('/api/notifications/clear', (req, res) => {
  const data = readData();
  data.notifications = [];
  writeData(data);
  res.json({ success: true });
});

// 12. GEMINI AI SMART SUGGESTION
app.post('/api/ai/suggest', async (req, res) => {
  const { cart } = req.body;
  const data = readData();

  // Get only available items
  const availableItems = data.menu.filter(i => i.available);
  
  if (availableItems.length === 0) {
    return res.json({
      recommendation: 'Sweet Mango Lassi',
      reason: 'Our beverage bar is open! Try a sweet refreshing Mango Lassi.'
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  // Fallback handler if API key is not present
  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY') {
    console.log('Gemini API key not configured or empty. Using fallback recommendation.');
    return res.json(getFallbackSuggestion(cart, availableItems));
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const availableList = availableItems.map(i => `${i.name} (Category: ${i.category}, Price: $${i.price}, Description: ${i.description})`).join(', ');
    const cartList = cart && cart.length > 0 
      ? cart.map(i => `${i.name} (x${i.quantity})`).join(', ') 
      : 'Nothing in cart yet';

    const prompt = `You are a virtual waiter at a premium Indian restaurant.
The following items are currently available on our menu:
[${availableList}]

The customer has these items in their cart:
[${cartList}]

Generate exactly ONE recommendation of another dish from the available menu that they should add to their order.
Return your response in strict JSON format matching this schema:
{
  "recommendation": "Name of the recommended item",
  "reason": "A highly appetizing, single-sentence reason (max 20 words) explaining why this item pairs perfectly with their current selection, or is an absolute must-try starter/dessert."
}
Do not write any other text outside the JSON code block.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Parse response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return res.json(parsed);
    }
    
    throw new Error('Could not parse JSON from Gemini response');
  } catch (error) {
    console.error('Gemini API request failed:', error.message);
    res.json(getFallbackSuggestion(cart, availableItems));
  }
});

// Helper for quick hardcoded suggestion if Gemini fails
const getFallbackSuggestion = (cart, availableItems) => {
  // If cart has Mains but no beverages
  const hasDrink = cart && cart.some(i => i.category === 'Beverages');
  const hasDessert = cart && cart.some(i => i.category === 'Desserts');
  
  if (cart && cart.length > 0 && !hasDrink) {
    const lassi = availableItems.find(i => i.id === 8);
    if (lassi) return { recommendation: lassi.name, reason: "A creamy Sweet Mango Lassi will cool down the spices and pair perfectly with your meal." };
  }
  
  if (cart && cart.length > 0 && !hasDessert) {
    const jamun = availableItems.find(i => i.id === 6);
    if (jamun) return { recommendation: jamun.name, reason: "Finish your meal on a sweet note with warm Gulab Jamuns soaked in cardamom syrup." };
  }

  // Default to garlic naan
  const naan = availableItems.find(i => i.id === 5);
  if (naan) {
    return {
      recommendation: naan.name,
      reason: "Try our hot Garlic Butter Naan—it is the perfect side to scoop up rich curries!"
    };
  }

  return {
    recommendation: availableItems[0].name,
    reason: "This is one of our best-rated dishes and is freshly prepared right now!"
  };
};

app.listen(PORT, () => {
  console.log(`TableSync backend server running on port ${PORT}`);
});
