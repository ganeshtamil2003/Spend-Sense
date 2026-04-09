import { supabase } from './supabaseClient';
import { CATEGORIES, smartCategorize } from '../utils/categories';

export const api = {
  getCategories: async () => CATEGORIES,
  categorize: async (text) => smartCategorize(text),
  
  addExpense: async (data) => {
    // Determine category if not explicitly provided
    const finalCategory = data.category || smartCategorize(data.description);
    
    // User ID is enforced by RLS, we pass it manually
    const { data: userObj } = await supabase.auth.getUser();
    
    const { data: inserted, error } = await supabase
      .from('expenses')
      .insert({
        amount: parseFloat(data.amount),
        description: data.description || '',
        category: finalCategory,
        date: data.date || new Date().toISOString(),
        note: data.note || '',
        user_id: userObj.user.id
      })
      .select()
      .single();
      
    if (error) throw error;
    return inserted;
  },
  
  getExpenses: async (params = {}) => {
    let query = supabase.from('expenses').select('*');
    
    const now = new Date();
    
    if (params.period === 'today' || (params.date && !params.startDate)) {
      const filterDate = params.date ? new Date(params.date) : now;
      const dateStr = filterDate.toISOString().split('T')[0];
      query = query.gte('date', `${dateStr}T00:00:00.000Z`).lte('date', `${dateStr}T23:59:59.999Z`);
    } else if (params.period === 'week') {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      query = query.gte('date', startOfWeek.toISOString());
    } else if (params.period === 'month') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      query = query.gte('date', startOfMonth.toISOString()).lte('date', endOfMonth.toISOString());
    } else if (params.period === 'year') {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
      query = query.gte('date', startOfYear.toISOString()).lte('date', endOfYear.toISOString());
    } else if (params.startDate && params.endDate) {
      const start = new Date(params.startDate);
      const end = new Date(params.endDate);
      end.setHours(23, 59, 59, 999);
      query = query.gte('date', start.toISOString()).lte('date', end.toISOString());
    }
    
    if (params.category) {
      query = query.eq('category', params.category);
    }
    
    // Sort by date desc
    query = query.order('date', { ascending: false });
    
    const { data: expenses, error } = await query;
    if (error) throw error;
    return expenses;
  },
  
  deleteExpense: async (id) => {
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (error) throw error;
    return true;
  },
  
  updateExpense: async (id, data) => {
    const { data: updated, error } = await supabase
      .from('expenses')
      .update({
        amount: data.amount ? parseFloat(data.amount) : undefined,
        description: data.description,
        category: data.category,
        date: data.date,
        note: data.note
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return updated;
  },
  
  getAnalytics: async (params = {}) => {
    const expenses = await api.getExpenses(params);
    const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    
    const categoryMap = {};
    expenses.forEach(e => {
      if (!categoryMap[e.category]) categoryMap[e.category] = 0;
      categoryMap[e.category] += Number(e.amount);
    });
    
    const categoryBreakdown = Object.entries(categoryMap).map(([catId, amount]) => {
      const cat = CATEGORIES.find(c => c.id === catId) || { name: catId, icon: '📦', color: '#9E9E9E' };
      return {
        id: catId,
        name: cat.name,
        icon: cat.icon,
        color: cat.color,
        amount,
        percentage: total > 0 ? ((amount / total) * 100).toFixed(1) : 0
      };
    }).sort((a, b) => b.amount - a.amount);
    
    const now = new Date();
    const last30 = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      last30[d.toISOString().split('T')[0]] = 0;
    }
    expenses.forEach(e => {
       const [day] = e.date.split('T');
       if (last30[day] !== undefined) {
         last30[day] += Number(e.amount);
       }
    });
    const dailyTrend = Object.entries(last30).map(([date, amount]) => ({ date, amount }));
    
    return {
      total,
      count: expenses.length,
      categoryBreakdown,
      dailyTrend,
      topExpenses: [...expenses].sort((a, b) => b.amount - a.amount).slice(0, 5)
    };
  }
};
