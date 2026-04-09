# 💸 SpendSense — Personal Finance Tracker

A full-stack personal finance tracker built for salary earners to quickly log and analyze daily expenses.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- npm

---

### Step 1: Start the Backend (API + Database)

```bash
cd backend
npm install
node server.js
```

The backend runs on **http://localhost:3001**

---

### Step 2: Start the Frontend (React App)

Open a **new terminal window**, then:

```bash
cd frontend
npm install
npm start
```

The app opens in your browser at **http://localhost:3000**

---

## 🌟 Features

### ➕ Quick Add Expense
- Enter **amount** first (most used field, auto-focused)
- Type the **item name** (e.g., "Apple", "Petrol", "Uber") — it **auto-detects the category**
- OR pick a category from the **quick-select pills**
- Quick amount buttons: ₹10, ₹20, ₹50, ₹100...
- Today's running total always visible

### 📊 Dashboard
- View by: **Today / This Week / This Month / This Year / Custom Range**
- Total spent, transaction count, average per transaction
- **Area chart** — spending trend
- **Category breakdown** with visual progress bars
- **Pie chart** — distribution by category
- Top 5 highest expenses

### 📋 Expense History
- Browse all expenses grouped by date
- **Search** by item name or note
- **Filter by category**
- Date range filtering
- **Delete** any expense
- Daily subtotals shown

---

## 🧠 Smart Auto-Categorization

Type any item name and the app intelligently categorizes it:

| You type | Category |
|----------|----------|
| Apple, Mango, Banana | 🍎 Fruits |
| Potato, Tomato, Onion | 🥦 Vegetables |
| Idli, Dosa, Oats | 🍳 Breakfast |
| Biryani, Rice, Chicken | 🍱 Lunch |
| Chips, Biscuits, Ice Cream | 🍿 Snacks |
| Tea, Coffee, Juice | ☕ Beverages |
| Uber, Auto, Bus | 🚌 Transport |
| Petrol, Diesel | ⛽ Fuel |
| Medicine, Tablet | 💊 Medical |
| Netflix, Movie | 🎬 Entertainment |
| Electricity, WiFi | 💡 Utilities |
| Jio, Airtel Recharge | 📱 Recharge |
| ... and 300+ more keywords | |

---

## 🗂️ Categories Supported

Fruits, Vegetables, Breakfast, Lunch, Dinner, Snacks, Beverages, Groceries, Transport, Fuel, Medical, Clothing, Entertainment, Utilities, Rent, Education, Personal Care, Shopping, Recharge/Bills, Savings, Other

---

## 🗄️ Data Storage

All data is stored locally in `backend/db.json` — no cloud, no accounts, fully private.

---

## 📁 Project Structure

```
finance-tracker/
├── backend/
│   ├── server.js       # Express API server
│   ├── db.json         # Local JSON database (auto-created)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.js              # Main app + navigation
│   │   ├── App.css             # All styles
│   │   ├── api.js              # API service layer
│   │   └── components/
│   │       ├── AddExpense.js   # Quick add form
│   │       ├── Dashboard.js    # Analytics & charts
│   │       └── ExpenseList.js  # History & filters
│   └── package.json
└── README.md
```

---

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/categories | All categories |
| POST | /api/categorize | Smart categorize text |
| POST | /api/expenses | Add expense |
| GET | /api/expenses | Get expenses (with filters) |
| PUT | /api/expenses/:id | Update expense |
| DELETE | /api/expenses/:id | Delete expense |
| GET | /api/analytics | Dashboard analytics |

---

## 💡 Tips

- The **amount field** is auto-focused — just open the app and start typing the amount
- Use **quick amount buttons** (₹10, ₹50, ₹100...) for common values
- The **green hint** appears when the app detects a category from your text
- All data is in `backend/db.json` — back it up anytime!
