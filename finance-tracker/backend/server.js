const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');

const app = express();
const PORT = 3001;

// Database setup
const adapter = new FileSync(path.join(__dirname, 'db.json'));
const db = low(adapter);

// Default DB schema
db.defaults({
  expenses: [],
  categories: [
    { id: 'fruits', name: 'Fruits', icon: '🍎', color: '#4CAF50' },
    { id: 'vegetables', name: 'Vegetables', icon: '🥦', color: '#8BC34A' },
    { id: 'breakfast', name: 'Breakfast', icon: '🍳', color: '#FF9800' },
    { id: 'lunch', name: 'Lunch', icon: '🍱', color: '#FF5722' },
    { id: 'dinner', name: 'Dinner', icon: '🍽️', color: '#E91E63' },
    { id: 'snacks', name: 'Snacks', icon: '🍿', color: '#9C27B0' },
    { id: 'beverages', name: 'Beverages', icon: '☕', color: '#795548' },
    { id: 'groceries', name: 'Groceries', icon: '🛒', color: '#009688' },
    { id: 'transport', name: 'Transport', icon: '🚌', color: '#2196F3' },
    { id: 'fuel', name: 'Fuel', icon: '⛽', color: '#607D8B' },
    { id: 'medical', name: 'Medical', icon: '💊', color: '#F44336' },
    { id: 'clothing', name: 'Clothing', icon: '👕', color: '#3F51B5' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#FF4081' },
    { id: 'utilities', name: 'Utilities', icon: '💡', color: '#FFC107' },
    { id: 'rent', name: 'Rent', icon: '🏠', color: '#673AB7' },
    { id: 'education', name: 'Education', icon: '📚', color: '#00BCD4' },
    { id: 'personal', name: 'Personal Care', icon: '🧴', color: '#CDDC39' },
    { id: 'shopping', name: 'Shopping', icon: '🛍️', color: '#FF6F00' },
    { id: 'recharge', name: 'Recharge/Bills', icon: '📱', color: '#00ACC1' },
    { id: 'savings', name: 'Savings', icon: '💰', color: '#43A047' },
    { id: 'other', name: 'Other', icon: '📦', color: '#9E9E9E' }
  ],
  // Keyword mapping for smart categorization
  keywordMap: [
    // Fruits
    { keywords: ['apple', 'banana', 'mango', 'orange', 'grapes', 'grape', 'guava', 'papaya', 'pineapple', 'strawberry', 'watermelon', 'pomegranate', 'kiwi', 'lemon', 'lime', 'peach', 'plum', 'cherry', 'blueberry', 'raspberry', 'fig', 'dates', 'coconut', 'jackfruit', 'sapota', 'chiku', 'custard apple', 'sitaphal', 'dragon fruit', 'avocado'], category: 'fruits' },
    // Vegetables
    { keywords: ['tomato', 'potato', 'onion', 'carrot', 'cabbage', 'brinjal', 'eggplant', 'spinach', 'lettuce', 'cucumber', 'capsicum', 'pepper', 'cauliflower', 'broccoli', 'beans', 'peas', 'corn', 'mushroom', 'garlic', 'ginger', 'radish', 'beetroot', 'pumpkin', 'zucchini', 'okra', 'ladies finger', 'drumstick', 'moringa', 'bitter gourd', 'ridge gourd', 'snake gourd', 'ash gourd', 'raw banana', 'raw mango', 'curry leaves', 'coriander', 'mint'], category: 'vegetables' },
    // Breakfast
    { keywords: ['idli', 'dosa', 'vada', 'pongal', 'upma', 'poha', 'paratha', 'parotta', 'omelette', 'bread', 'toast', 'cereal', 'oats', 'cornflakes', 'egg', 'eggs', 'pancake', 'waffle', 'sandwich', 'puttu', 'appam', 'iddiyappam', 'chapati', 'roti', 'bajji', 'bonda', 'samosa', 'poori', 'puri'], category: 'breakfast' },
    // Lunch / Dinner
    { keywords: ['rice', 'biryani', 'biriyani', 'kurma', 'dal', 'sambar', 'rasam', 'curd rice', 'variety rice', 'thali', 'meal', 'meals', 'lunch', 'dinner', 'fish', 'chicken', 'mutton', 'prawn', 'lamb', 'crab', 'paneer', 'curry', 'gravy', 'steak', 'noodles', 'pasta', 'pizza', 'burger', 'wrap', 'roll', 'shawarma', 'subway', 'kfc', 'mcdonalds', 'pizza hut', 'dominos'], category: 'lunch' },
    // Snacks
    { keywords: ['chips', 'biscuit', 'biscuits', 'cookies', 'chocolate', 'candy', 'sweet', 'sweets', 'ice cream', 'icecream', 'kulfi', 'snack', 'snacks', 'popcorn', 'peanuts', 'cashew', 'almond', 'nuts', 'murukku', 'mixture', 'halwa', 'ladoo', 'barfi', 'jalebi', 'gulab jamun', 'rasgulla', 'cake', 'pastry', 'donut', 'brownie'], category: 'snacks' },
    // Beverages
    { keywords: ['tea', 'coffee', 'chai', 'juice', 'milkshake', 'shake', 'smoothie', 'water', 'soda', 'cold drink', 'cola', 'pepsi', 'sprite', 'fanta', 'lassi', 'buttermilk', 'milk', 'boost', 'horlicks', 'bournvita', 'energy drink', 'red bull', 'beer', 'wine', 'soft drink'], category: 'beverages' },
    // Groceries
    { keywords: ['grocery', 'groceries', 'supermarket', 'big bazaar', 'dmart', 'reliance fresh', 'zepto', 'blinkit', 'swiggy instamart', 'dunzo', 'flour', 'wheat', 'maida', 'rava', 'semolina', 'oil', 'ghee', 'butter', 'salt', 'sugar', 'spices', 'masala','masalas','pulses', 'lentils', 'soap', 'shampoo', 'detergent', 'cleaning', 'household', 'rice bag', 'atta', 'toor dal', 'chana dal', 'moong dal'], category: 'groceries' },
    // Transport
    { keywords: ['bus', 'metro', 'train', 'auto', 'autorickshaw', 'rickshaw', 'cab', 'taxi', 'uber', 'ola', 'rapido', 'share auto', 'local train', 'ticket', 'pass', 'ferry', 'boat'], category: 'transport' },
    // Fuel
    { keywords: ['petrol', 'diesel', 'fuel', 'gas', 'cng', 'ev charging', 'electric charging', 'bunk', 'pump'], category: 'fuel' },
    // Medical
    { keywords: ['medicine', 'medicines', 'tablet', 'tablets', 'capsule', 'syrup', 'injection', 'doctor', 'hospital', 'clinic', 'lab', 'test', 'scan', 'xray', 'x-ray', 'pharmacy', 'medical', 'health', 'apollo', 'medplus', 'netmeds', 'pharmeasy', 'vitamin', 'supplement'], category: 'medical' },
    // Clothing
    { keywords: ['shirt', 'pant', 'jeans', 'dress', 'saree', 'kurti', 'tshirt', 't-shirt', 'shorts', 'shoes', 'footwear', 'sandals', 'chappal', 'socks', 'underwear', 'innerwear', 'jacket', 'hoodie', 'sweater', 'suit', 'blazer', 'clothes', 'clothing', 'fabric', 'tailor', 'zara', 'h&m', 'myntra', 'ajio', 'meesho', 'bewakoof'], category: 'clothing' },
    // Entertainment
    { keywords: ['movie', 'cinema', 'theatre', 'theater', 'pvr', 'inox', 'game', 'gaming', 'netflix', 'amazon prime', 'hotstar', 'disney', 'spotify', 'concert', 'event', 'show', 'amusement', 'park', 'zoo', 'bowling', 'arcade', 'play', 'sport', 'sports', 'gym', 'fitness'], category: 'entertainment' },
    // Utilities
    { keywords: ['electricity', 'electric bill', 'water bill', 'gas bill', 'wifi', 'internet', 'broadband', 'tneb', 'bescom', 'mseb', 'bills', 'utility'], category: 'utilities' },
    // Rent
    { keywords: ['rent', 'rental', 'house rent', 'room rent', 'pg', 'hostel', 'maintenance', 'society', 'apartment', 'flat rent'], category: 'rent' },
    // Education
    { keywords: ['book', 'books', 'stationery', 'pen', 'pencil', 'notebook', 'school', 'college', 'tuition', 'fees', 'course', 'udemy', 'coursera', 'training', 'exam', 'coaching'], category: 'education' },
    // Personal Care
    { keywords: ['haircut', 'salon', 'parlour', 'parlor', 'spa', 'facial', 'manicure', 'pedicure', 'wax', 'threading', 'razor', 'toothpaste', 'toothbrush', 'facewash', 'lotion', 'cream', 'perfume', 'deodorant', 'body wash', 'sunscreen','serum'], category: 'personal' },
    // Recharge
    { keywords: ['recharge', 'mobile recharge', 'sim', 'airtel', 'jio', 'vi', 'vodafone', 'bsnl', 'dth', 'tataplay', 'dish tv', 'sun direct', 'fasttag', 'postpaid', 'prepaid', 'phone bill'], category: 'recharge' },
    // Shopping
    { keywords: ['amazon', 'flipkart', 'snapdeal', 'nykaa', 'shopping', 'order', 'delivery', 'purchase', 'buy', 'online'], category: 'shopping' }
  ]
}).write();

app.use(cors());
app.use(bodyParser.json());

// ==================== CATEGORY ROUTES ====================

app.get('/api/categories', (req, res) => {
  const categories = db.get('categories').value();
  res.json({ success: true, data: categories });
});

// ==================== SMART CATEGORIZATION ====================

function smartCategorize(text) {
  if (!text) return 'other';
  const lower = text.toLowerCase().trim();
  const keywordMap = db.get('keywordMap').value();
  
  for (const mapping of keywordMap) {
    for (const keyword of mapping.keywords) {
      if (lower.includes(keyword)) {
        return mapping.category;
      }
    }
  }
  return 'other';
}

app.post('/api/categorize', (req, res) => {
  const { text } = req.body;
  const category = smartCategorize(text);
  res.json({ success: true, category });
});

// ==================== EXPENSE ROUTES ====================

// Add expense
app.post('/api/expenses', (req, res) => {
  try {
    const { amount, description, category, date, note } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Valid amount is required' });
    }

    // Smart categorize if not provided
    const finalCategory = category || smartCategorize(description);

    const expense = {
      id: uuidv4(),
      amount: parseFloat(amount),
      description: description || '',
      category: finalCategory,
      date: date || new Date().toISOString(),
      note: note || '',
      createdAt: new Date().toISOString()
    };

    db.get('expenses').push(expense).write();
    res.json({ success: true, data: expense });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get expenses with filters
app.get('/api/expenses', (req, res) => {
  try {
    const { period, date, startDate, endDate, category } = req.query;
    let expenses = db.get('expenses').value();

    const now = new Date();

    if (period === 'today' || (date && !startDate)) {
      const filterDate = date ? new Date(date) : now;
      const dateStr = filterDate.toISOString().split('T')[0];
      expenses = expenses.filter(e => e.date.split('T')[0] === dateStr);
    } else if (period === 'week') {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      expenses = expenses.filter(e => new Date(e.date) >= startOfWeek);
    } else if (period === 'month') {
      expenses = expenses.filter(e => {
        const d = new Date(e.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      });
    } else if (period === 'year') {
      expenses = expenses.filter(e => new Date(e.date).getFullYear() === now.getFullYear());
    } else if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      expenses = expenses.filter(e => {
        const d = new Date(e.date);
        return d >= start && d <= end;
      });
    }

    if (category) {
      expenses = expenses.filter(e => e.category === category);
    }

    // Sort by date desc
    expenses = expenses.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({ success: true, data: expenses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete expense
app.delete('/api/expenses/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.get('expenses').remove({ id }).write();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update expense
app.put('/api/expenses/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { amount, description, category, date, note } = req.body;
    const expense = db.get('expenses').find({ id }).value();
    if (!expense) return res.status(404).json({ success: false, message: 'Not found' });

    const updated = {
      ...expense,
      amount: parseFloat(amount) || expense.amount,
      description: description !== undefined ? description : expense.description,
      category: category || expense.category,
      date: date || expense.date,
      note: note !== undefined ? note : expense.note
    };
    db.get('expenses').find({ id }).assign(updated).write();
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==================== DASHBOARD / ANALYTICS ====================

app.get('/api/analytics', (req, res) => {
  try {
    const { period, startDate, endDate } = req.query;
    let expenses = db.get('expenses').value();
    const categories = db.get('categories').value();
    const now = new Date();

    // Filter
    if (period === 'today') {
      const todayStr = now.toISOString().split('T')[0];
      expenses = expenses.filter(e => e.date.split('T')[0] === todayStr);
    } else if (period === 'week') {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      expenses = expenses.filter(e => new Date(e.date) >= startOfWeek);
    } else if (period === 'month') {
      expenses = expenses.filter(e => {
        const d = new Date(e.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      });
    } else if (period === 'year') {
      expenses = expenses.filter(e => new Date(e.date).getFullYear() === now.getFullYear());
    } else if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      expenses = expenses.filter(e => {
        const d = new Date(e.date);
        return d >= start && d <= end;
      });
    }

    const total = expenses.reduce((sum, e) => sum + e.amount, 0);

    // Category breakdown
    const categoryMap = {};
    expenses.forEach(e => {
      if (!categoryMap[e.category]) categoryMap[e.category] = 0;
      categoryMap[e.category] += e.amount;
    });

    const categoryBreakdown = Object.entries(categoryMap).map(([catId, amount]) => {
      const cat = categories.find(c => c.id === catId) || { name: catId, icon: '📦', color: '#9E9E9E' };
      return {
        id: catId,
        name: cat.name,
        icon: cat.icon,
        color: cat.color,
        amount,
        percentage: total > 0 ? ((amount / total) * 100).toFixed(1) : 0
      };
    }).sort((a, b) => b.amount - a.amount);

    // Daily trend (last 30 days)
    const last30 = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      last30[d.toISOString().split('T')[0]] = 0;
    }
    expenses.forEach(e => {
      const day = e.date.split('T')[0];
      if (last30[day] !== undefined) last30[day] += e.amount;
    });
    const dailyTrend = Object.entries(last30).map(([date, amount]) => ({ date, amount }));

    res.json({
      success: true,
      data: {
        total,
        count: expenses.length,
        categoryBreakdown,
        dailyTrend,
        topExpenses: [...expenses].sort((a, b) => b.amount - a.amount).slice(0, 5)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Finance Tracker API running on http://localhost:${PORT}`);
});
