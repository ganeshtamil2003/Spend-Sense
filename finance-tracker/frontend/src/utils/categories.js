export const CATEGORIES = [
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
];

const KEYWORD_MAP = [
  { keywords: ['apple', 'banana', 'mango', 'orange', 'grapes', 'grape', 'guava', 'papaya', 'pineapple', 'strawberry', 'watermelon', 'pomegranate', 'kiwi', 'lemon', 'lime', 'peach', 'plum', 'cherry', 'blueberry', 'raspberry', 'fig', 'dates', 'coconut', 'jackfruit', 'sapota', 'chiku', 'custard apple', 'sitaphal', 'dragon fruit', 'avocado'], category: 'fruits' },
  { keywords: ['tomato', 'potato', 'onion', 'carrot', 'cabbage', 'brinjal', 'eggplant', 'spinach', 'lettuce', 'cucumber', 'capsicum', 'pepper', 'cauliflower', 'broccoli', 'beans', 'peas', 'corn', 'mushroom', 'garlic', 'ginger', 'radish', 'beetroot', 'pumpkin', 'zucchini', 'okra', 'ladies finger', 'drumstick', 'moringa', 'bitter gourd', 'ridge gourd', 'snake gourd', 'ash gourd', 'raw banana', 'raw mango', 'curry leaves', 'coriander', 'mint'], category: 'vegetables' },
  { keywords: ['idli', 'dosa', 'vada', 'pongal', 'upma', 'poha', 'paratha', 'parotta', 'omelette', 'bread', 'toast', 'cereal', 'oats', 'cornflakes', 'egg', 'eggs', 'pancake', 'waffle', 'sandwich', 'puttu', 'appam', 'iddiyappam', 'chapati', 'roti', 'bajji', 'bonda', 'samosa', 'poori', 'puri'], category: 'breakfast' },
  { keywords: ['rice', 'biryani', 'biriyani', 'kurma', 'dal', 'sambar', 'rasam', 'curd rice', 'variety rice', 'thali', 'meal', 'meals', 'lunch', 'dinner', 'fish', 'chicken', 'mutton', 'prawn', 'lamb', 'crab', 'paneer', 'curry', 'gravy', 'steak', 'noodles', 'pasta', 'pizza', 'burger', 'wrap', 'roll', 'shawarma', 'subway', 'kfc', 'mcdonalds', 'pizza hut', 'dominos'], category: 'lunch' },
  { keywords: ['chips', 'biscuit', 'biscuits', 'cookies', 'chocolate', 'candy', 'sweet', 'sweets', 'ice cream', 'icecream', 'kulfi', 'snack', 'snacks', 'popcorn', 'peanuts', 'cashew', 'almond', 'nuts', 'murukku', 'mixture', 'halwa', 'ladoo', 'barfi', 'jalebi', 'gulab jamun', 'rasgulla', 'cake', 'pastry', 'donut', 'brownie'], category: 'snacks' },
  { keywords: ['tea', 'coffee', 'chai', 'juice', 'milkshake', 'shake', 'smoothie', 'water', 'soda', 'cold drink', 'cola', 'pepsi', 'sprite', 'fanta', 'lassi', 'buttermilk', 'milk', 'boost', 'horlicks', 'bournvita', 'energy drink', 'red bull', 'beer', 'wine', 'soft drink'], category: 'beverages' },
  { keywords: ['grocery', 'groceries', 'supermarket', 'big bazaar', 'dmart', 'reliance fresh', 'zepto', 'blinkit', 'swiggy instamart', 'dunzo', 'flour', 'wheat', 'maida', 'rava', 'semolina', 'oil', 'ghee', 'butter', 'salt', 'sugar', 'spices', 'masala','masalas','pulses', 'lentils', 'soap', 'shampoo', 'detergent', 'cleaning', 'household', 'rice bag', 'atta', 'toor dal', 'chana dal', 'moong dal'], category: 'groceries' },
  { keywords: ['bus', 'metro', 'train', 'auto', 'autorickshaw', 'rickshaw', 'cab', 'taxi', 'uber', 'ola', 'rapido', 'share auto', 'local train', 'ticket', 'pass', 'ferry', 'boat'], category: 'transport' },
  { keywords: ['petrol', 'diesel', 'fuel', 'gas', 'cng', 'ev charging', 'electric charging', 'bunk', 'pump'], category: 'fuel' },
  { keywords: ['medicine', 'medicines', 'tablet', 'tablets', 'capsule', 'syrup', 'injection', 'doctor', 'hospital', 'clinic', 'lab', 'test', 'scan', 'xray', 'x-ray', 'pharmacy', 'medical', 'health', 'apollo', 'medplus', 'netmeds', 'pharmeasy', 'vitamin', 'supplement'], category: 'medical' },
  { keywords: ['shirt', 'pant', 'jeans', 'dress', 'saree', 'kurti', 'tshirt', 't-shirt', 'shorts', 'shoes', 'footwear', 'sandals', 'chappal', 'socks', 'underwear', 'innerwear', 'jacket', 'hoodie', 'sweater', 'suit', 'blazer', 'clothes', 'clothing', 'fabric', 'tailor', 'zara', 'h&m', 'myntra', 'ajio', 'meesho', 'bewakoof'], category: 'clothing' },
  { keywords: ['movie', 'cinema', 'theatre', 'theater', 'pvr', 'inox', 'game', 'gaming', 'netflix', 'amazon prime', 'hotstar', 'disney', 'spotify', 'concert', 'event', 'show', 'amusement', 'park', 'zoo', 'bowling', 'arcade', 'play', 'sport', 'sports', 'gym', 'fitness'], category: 'entertainment' },
  { keywords: ['electricity', 'electric bill', 'water bill', 'gas bill', 'wifi', 'internet', 'broadband', 'tneb', 'bescom', 'mseb', 'bills', 'utility'], category: 'utilities' },
  { keywords: ['rent', 'rental', 'house rent', 'room rent', 'pg', 'hostel', 'maintenance', 'society', 'apartment', 'flat rent'], category: 'rent' },
  { keywords: ['book', 'books', 'stationery', 'pen', 'pencil', 'notebook', 'school', 'college', 'tuition', 'fees', 'course', 'udemy', 'coursera', 'training', 'exam', 'coaching'], category: 'education' },
  { keywords: ['haircut', 'salon', 'parlour', 'parlor', 'spa', 'facial', 'manicure', 'pedicure', 'wax', 'threading', 'razor', 'toothpaste', 'toothbrush', 'facewash', 'lotion', 'cream', 'perfume', 'deodorant', 'body wash', 'sunscreen','serum'], category: 'personal' },
  { keywords: ['recharge', 'mobile recharge', 'sim', 'airtel', 'jio', 'vi', 'vodafone', 'bsnl', 'dth', 'tataplay', 'dish tv', 'sun direct', 'fasttag', 'postpaid', 'prepaid', 'phone bill'], category: 'recharge' },
  { keywords: ['amazon', 'flipkart', 'snapdeal', 'nykaa', 'shopping', 'order', 'delivery', 'purchase', 'buy', 'online'], category: 'shopping' }
];

export function smartCategorize(text) {
  if (!text) return 'other';
  const lower = text.toLowerCase().trim();
  for (const mapping of KEYWORD_MAP) {
    for (const keyword of mapping.keywords) {
      if (lower.includes(keyword)) {
        return mapping.category;
      }
    }
  }
  return 'other';
}
