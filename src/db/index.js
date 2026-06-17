// 数据库层 — localForage (IndexedDB)，简洁优先
import localforage from 'localforage'
import { generateId, getCurrentDate, CATEGORIES, ACCOUNT_TYPES } from './models.js'

const db = localforage.createInstance({ name: 'jizhang-v3' })

// 初始化默认账户
async function ensureDefaultAccounts() {
  const accounts = await db.getItem('accounts') || []
  if (accounts.length === 0) {
    const defaults = [
      { id: generateId(), name: '现金', type: 'cash', balance: 0, icon: '💵', createdAt: getCurrentDate() },
      { id: generateId(), name: '储蓄卡', type: 'bank', balance: 0, icon: '🏦', createdAt: getCurrentDate() },
      { id: generateId(), name: '支付宝', type: 'alipay', balance: 0, icon: '🔵', createdAt: getCurrentDate() },
    ]
    await db.setItem('accounts', defaults)
    return defaults
  }
  return accounts
}

// 账户操作
export const accountOps = {
  async getAll() { return await db.getItem('accounts') || await ensureDefaultAccounts() },
  async add(account) {
    const list = await this.getAll()
    list.push({ ...account, id: generateId(), balance: Number(account.balance) || 0, createdAt: getCurrentDate() })
    await db.setItem('accounts', list)
    return list
  },
  async update(id, data) {
    const list = await this.getAll()
    const idx = list.findIndex(a => a.id === id)
    if (idx >= 0) { list[idx] = { ...list[idx], ...data }; await db.setItem('accounts', list) }
    return list
  },
  async remove(id) {
    const list = (await this.getAll()).filter(a => a.id !== id)
    await db.setItem('accounts', list)
    return list
  },
  async getTotalBalance() {
    const list = await this.getAll()
    return list.reduce((s, a) => s + (Number(a.balance) || 0), 0)
  }
}

// 交易操作
export const txOps = {
  async getAll() { return await db.getItem('transactions') || [] },
  async add(tx) {
    const list = await this.getAll()
    const record = {
      id: generateId(),
      type: tx.type || 'expense',
      amount: Math.abs(Number(tx.amount)) || 0,
      category: tx.category || 'other',
      accountId: tx.accountId || '',
      note: tx.note || '',
      date: tx.date || getCurrentDate(),
      time: tx.time || new Date().toTimeString().slice(0,5),
      createdAt: new Date().toISOString(),
    }
    list.unshift(record)
    await db.setItem('transactions', list)
    // 更新账户余额
    const accounts = await accountOps.getAll()
    const accIdx = accounts.findIndex(a => a.id === record.accountId)
    if (accIdx >= 0) {
      accounts[accIdx].balance += record.type === 'income' ? record.amount : -record.amount
      await db.setItem('accounts', accounts)
    }
    return list
  },
  async getByMonth(yearMonth) {
    const list = await this.getAll()
    return list.filter(t => t.date && t.date.startsWith(yearMonth))
  },
  async getStats(yearMonth) {
    const txs = await this.getByMonth(yearMonth)
    let income = 0, expense = 0
    const catMap = {}
    for (const t of txs) {
      if (t.type === 'income') income += t.amount
      else expense += t.amount
      const key = t.category || 'other'
      catMap[key] = (catMap[key] || 0) + t.amount
    }
    const catBreakdown = Object.entries(catMap).sort((a,b) => b[1] - a[1])
    return { income, expense, balance: income - expense, catBreakdown }
  }
}

// 初始化
ensureDefaultAccounts()
