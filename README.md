# TableSync — Restaurant Operations Platform & Digital Twin

### **Team Details**
- **Team Name**: S square
- **Developer**: Sunil Kumar
- **Event**: VibeCoding Hackathon (VibeAthon 6.0) – 2K26

---

## 🍽️ Problem Statement (Hackathon Brief)
Traditional restaurants struggle with operational reactiveness rather than proactiveness. Major challenges include:
- Lack of live visibility into menu item availability, leading to customer disappointment when ordered items are sold out.
- Manual table assignments, chaotic waitlist queues, and high wait times for seating.
- Inefficient coordination between floor staff, kitchen crews, and administrators.
- Lack of predictive insights regarding inventory shortages and customer demand patterns.

Judges explicitly requested **not** to build a standard food-ordering clone, but instead a technology-driven SaaS platform that resolves core operational inefficiencies from end to end.

---

## 🚀 The Solution: TableSync
**TableSync** is an AI-powered "Digital Twin" operations platform that digitizes workflows to optimize restaurant speed, table turnover, and inventory tracking. It provides a real-time bridge between the customer ordering experience and the kitchen's preparation status.

### **Core Innovation Beats**:
1. **Live Menu State Syncing**: When staff marks a dish "Sold Out" on the dashboard, the customer's digital menu disables adding that dish within 3 seconds via automatic state polling.
2. **Smart Table Seating & Queue Auto-Advance**: Marking a table "Available" checks the waitlist queue. If customers are waiting, it automatically assigns the table to the next group, changes the table status to "Occupied," and alerts the staff.
3. **Operations Digital Twin**: A real-time KPI overview showing Kitchen Workload %, Table Occupancy %, Average wait time, and a dynamic Restaurant Health Score.

---

## 🛠️ Tech Stack
- **Frontend**: React.js, Vite, Tailwind CSS, Lucide Icons.
- **Backend**: Node.js, Express.
- **Data Storage**: Local JSON file storage (`data.json`) simulating a real-time database state.
- **AI Integration**: Google Gemini API (`gemini-1.5-flash` model via `@google/generative-ai` SDK) generating context-aware menu pairing suggestions.

---

## 📱 Features & Screen Details

### **1. Customer View**
- **Live Digital Menu**: Interactive cards showcasing available dishes, pricing, and active statuses. Tapping adds to the cart.
- **Smart Queue & Waitlist**: Simple input form to join the waitlist, calculating real-time queue position and estimated wait times.
- **Order Tracking Timeline**: Real-time progress bar tracking orders from *Pending* → *Preparing* → *Ready* → *Served*.
- **Gemini AI Smart Suggestion**: A banner analyzing cart selections and prompting Gemini for an appetizing side dish recommendation.

### **2. Staff / Manager Dashboard**
- **Digital Twin Health KPI Strip**: Renders restaurant performance metrics in real time.
- **Kitchen Tickets Board**: Tracks status columns. Staff can progress tickets (*Cook*, *Ready*, *Serve*).
- **Menu Controller Tab**: Toggle switches to modify item availability live.
- **Interactive Floor Map**: 6 grid blocks representing tables. Colors match status: Available (gray), Occupied (orange), Reserved (yellow).

---

## 💻 Setup and Installation

### **Prerequisites**
- Node.js installed (v18+ recommended)
- Google Gemini API Key (Optional, get one from [Google AI Studio](https://aistudio.google.com/))

### **Step 1: Backend Server Setup**
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install packages:
   ```bash
   npm install
   ```
3. *(Optional)* Add your Gemini API key in `backend/.env`:
   ```env
   GEMINI_API_KEY=YOUR_ACTUAL_API_KEY
   ```
4. Start the backend:
   ```bash
   npm start
   ```
   *The backend will run on `http://localhost:5000`.*

### **Step 2: Frontend Setup**
1. Open a new terminal window/tab and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install packages:
   ```bash
   npm install
   ```
3. Launch the React development server:
   ```bash
   npm run dev
   ```
4. Open the displayed local link (usually `http://localhost:3000`) in your browser.
