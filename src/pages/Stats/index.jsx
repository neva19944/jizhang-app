import { useState, useEffect, useCallback } from 'react'
import { txOps, accountOps } from '../../db/index.js'
import { formatAmount } from '../../db/models.js'
import './Stats.css'

export default function Stats() {
  const [period, setPeriod] = useState('month')
  const [txs, setTxs] = useState([])
  const [accounts, setAccounts] = useState([])
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })

  const load = useCallback(async () => {
    const [allTxs, allAccounts] = await Promise.all([
      txOps.getAll(),
      accountOps.getAll(),
    ])
    setTxs(allTxs.filter(t => t.date && t.date.startsWith(selectedMonth)))
    setAccounts(allAccounts)
  }, [selectedMonth])

  useEffect(() => { load() }, [load])

  /* 统计计算 */
  const stats = (() => {
    let income = 0, expense = 0
    for (const t of txs) {
      if (t.type === 'income') income += t.amount
      else expense += t.amount
    }
    return { income, expense, balance: income - expense }
  })()

  /* 按分类统计 */
  const catStats = (() => {
    const map = {}
    for (const t of txs) {
      if (t.type !== 'expense') continue
      const key = t.category || 'other'
      map[key] = (map[key] || 0) + t.amount
    }
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  })()

  const catNameMap = {
    food: '餐饮', transport: '交通', shopping: '购物', housing: '住房',
    entertain: '娱乐', medical: '医疗', education: '教育', other: '其他',
  }

  return (
    <div className="stats-page page">
      {/* 顶部 */}
      <header className="st-header">
        <h1 className="st-title">统计</h1>
      </header>

      {/* 月份选择器 */}
      <div className="month-selector">
        <button
          className="month-arrow"
          onClick={() => {
            const [y, m] = selectedMonth.split('-').map(Number)
            const d = new Date(y, m - 2, 1)
            setSelectedMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
          }}
        >‹</button>
        <span className="month-display">{selectedMonth.replace('-', '年')}月</span>
        <button
          className="month-arrow"
          onClick={() => {
            const [y, m] = selectedMonth.split('-').map(Number)
            const d = new Date(y, m, 1)
            setSelectedMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
          }}
        >›</button>
      </div>

      {/* 收支汇总卡片 */}
      <section className="summary-card">
        <div className="sc-row">
          <div className="sc-item">
            <p className="sc-label">支出</p>
            <p className="sc-val expense numbers">{formatAmount(stats.expense)}</p>
          </div>
          <div className="sc-item">
            <p className="sc-label">收入</p>
            <p className="sc-val income numbers">{formatAmount(stats.income)}</p>
          </div>
          <div className="sc-item">
            <p className="sc-label">结余</p>
            <p className="sc-val balance numbers">{formatAmount(stats.balance)}</p>
          </div>
        </div>
      </section>

      {/* 分类统计 */}
      <section className="cat-stats">
        <h3 className="section-title">支出分类</h3>
        {catStats.length === 0 ? (
          <div className="empty-cat">
            <p>暂无数据</p>
          </div>
        ) : (
          catStats.map(([catId, amount]) => (
            <div key={catId} className="cat-row">
              <div className="cat-info">
                <span className="cat-name">{catNameMap[catId] || catId}</span>
                <span className="cat-pct">{((amount / stats.expense) * 100).toFixed(1)}%</span>
              </div>
              <div className="cat-bar-wrap">
                <div
                  className="cat-bar"
                  style={{ width: `${(amount / stats.expense) * 100}%` }}
                />
              </div>
              <span className="cat-amount numbers">{formatAmount(amount)}</span>
            </div>
          ))
        )}
      </section>

      {/* 近期账单 */}
      <section className="recent-stats">
        <h3 className="section-title">近期账单</h3>
        {txs.length === 0 ? (
          <div className="empty-cat">
            <p>暂无账单</p>
          </div>
        ) : (
          txs.slice(0, 10).map(t => (
            <div key={t.id} className="tx-row">
              <div className="tx-info">
                <span className="tx-cat">{catNameMap[t.category] || t.category || '其他'}</span>
                <span className="tx-date">{t.date}</span>
              </div>
              <span className={`tx-amount numbers ${t.type === 'income' ? 'income' : 'expense'}`}>
                {t.type === 'income' ? '+' : '-'}{formatAmount(t.amount)}
              </span>
            </div>
          ))
        )}
      </section>
    </div>
  )
}
