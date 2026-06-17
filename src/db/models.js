// 数据模型 — 简洁优先，每个字段都有存在价值

export const CATEGORIES = {
  expense: [
    { id: 'food',    name: '其他',     icon: '📦' },
    { id: 'shopping',name:'购物消费', icon: '🛒' },
    { id: 'food2',   name: '食品餐饮', icon: '🍱' },
    { id: 'transport',name:'出行交通',icon: '🚗' },
    { id: 'entertain',name:'休闲娱乐',icon: '🎮' },
    { id: 'fine',    name: '罚款赔偿', icon: '⚖️' },
    { id: 'invest_e', name: '理财支出', icon: '💹' },
    { id: 'donate',  name: '慈善捐助', icon: '💝' },
    { id: 'home',    name: '居家生活', icon: '🏠' },
    { id: 'edu',     name: '文化教育', icon: '📚' },
    { id: 'gift',    name: '送礼人情', icon: '🎁' },
    { id: 'health',  name: '健康医疗', icon: '💊' },
  ],
  income: [
    { id: 'other_i', name: '其他',      icon: '📦' },
    { id: 'lottery', name: '中奖',       icon: '⭐' },
    { id: 'invest_i',name: '理财盈利',   icon: '💰' },
    { id: 'gift_in', name: '礼金人情',   icon: '❤️' },
    { id: 'borrow',  name: '借入',       icon: '🤝' },
    { id: 'bonus',   name: '奖金',       icon: '🏆' },
    { id: 'parttime',name: '兼职外快',   icon: '💼' },
    { id: 'salary',  name: '工资',       icon: '💵' },
    { id: 'second',  name: '二手闲置',   icon: '♻️' },
    { id: 'subsidy', name: '补贴',       icon: '☀️' },
    { id: 'reimburse',name: '报销',      icon: '🧾' },
  ],
  transfer: [
    { id: 'tf_out', name: '转出', icon: '↗️' },
    { id: 'tf_in',  name: '转入', icon: '↙️' },
  ],
  debt: [
    { id: 'debt_lend', name: '借出', icon: '📤' },
    { id: 'debt_borrow',name: '借入', icon: '📥' },
  ],
}

export const ACCOUNT_TYPES = [
  { id: 'cash',    name: '现金',     icon: '💵', color: 'oklch(75% 0.14 85)' },
  { id: 'bank',    name: '储蓄卡',   icon: '🏦', color: 'var(--primary)' },
  { id: 'credit',  name: '信用卡',   icon: '💳', color: 'oklch(55% 0.20 300)' },
  { id: 'alipay',  name: '支付宝',   icon: '🔵', color: 'oklch(60% 0.18 250)' },
  { id: 'wechat',  name: '微信支付', icon: '🟢', color: 'oklch(62% 0.17 145)' },
]

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

export function getCurrentDate() {
  return new Date().toISOString().slice(0, 10)
}

export function formatAmount(n) {
  if (n == null || isNaN(n)) return '0.00'
  return Math.abs(Number(n)).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
