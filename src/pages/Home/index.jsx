import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { accountOps, txOps } from '../../db/index.js'
import { formatAmount, CATEGORIES } from '../../db/models.js'
import './Home.css'

/* 手绘风格植物装饰 SVG */
const PlantDecoration = () => (
  <svg className="decoration" viewBox="0 0 140 110" fill="none">
    {/* 仙人掌 */}
    <path d="M100 110V55c0-6-5-11-11-11s-11 5-11 11v12c0 4-3 7-7 7s-7-3-7-7V40"
      stroke="#8ECCA5" strokeWidth="2.2" strokeLinecap="round"/>
    <ellipse cx="89" cy="42" rx="10" ry="14" fill="#B3DDC2" opacity="0.4"/>
    <ellipse cx="72" cy="52" rx="6" ry="9" fill="#B3DDC2" opacity="0.35"/>
    {/* 小花 */}
    <circle cx="115" cy="38" r="5" fill="#FDEEEE" stroke="#E86360" strokeWidth="1.2"/>
    <circle cx="125" cy="48" r="4" fill="#E8F5EE" stroke="#4DBB8A" strokeWidth="1"/>
    <circle cx="108" cy="25" r="3.5" fill="#FFF5D4" stroke="#F5A623" strokeWidth="1"/>
    {/* 叶子 */}
    <path d="M120 70c8-4 16-2 20 4" stroke="#B3DDC2" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M122 80c10-2 18 2 22 10" stroke="#8ECCA5" strokeWidth="1.5" strokeLinecap="round"/>
    {/* 地面线 */}
    <path d="M75 105c15-3 35-2 50 2" stroke="#B3DDC2" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
  </svg>
)

/* 空状态手绘插图 */
const EmptyIllustration = () => (
  <svg className="empty-illustration" viewBox="0 0 180 150">
    {/* 手/纸张 */}
    <path d="M45 95c0-18 30-28 50-24 8 2 14 8 16 16 1 4 0 8-2 12l-4 8c-2 4 0 8 3 10 3 2 7 2 10 0l18-12"
      stroke="#D8D9D8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    {/* 纸张上的线条 */}
    <rect x="78" y="62" width="36" height="46" rx="3" stroke="#D8D9D8" strokeWidth="1.8" fill="#FAFBFA"/>
    <line x1="85" y1="73" x2="107" y2="73" stroke="#EEEEEF" strokeWidth="2" strokeLinecap="round"/>
    <line x1="85" y1="82" x2="103" y2="82" stroke="#EEEEEF" strokeWidth="2" strokeLinecap="round"/>
    <line x1="85" y1="91" x2="99" y2="91" stroke="#EEEEEF" strokeWidth="2" strokeLinecap="round"/>
    {/* 装饰小星星 */}
    <path d="M128 58l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4z" fill="#E8F5EE" stroke="#4DBB8A" strokeWidth="0.8"/>
    <path d="M56 48l1.5 3h3l-2.5 2 .5 3-2.5-1.5-2.5 1.5.5-3-2.5-2h3z"
      fill="#FFF5D4" stroke="#F5A623" strokeWidth="0.8"/>
    <path d="M135 88l1 2h2l-1.5 1.5.5 2-2-1-2 1 .5-2-1.5-1.5h2z"
      fill="#FDEEEE" stroke="#E86360" strokeWidth="0.8"/>
  </svg>
)

export default function Home() {
  const nav = useNavigate()
  const [total, setTotal] = useState(0)
  const [monthStats, setMonthStats] = useState({ income: 0, expense: 0 })
  const [accounts, setAccounts] = useState([])
  const [recent, setRecent] = useState([])
  const [currentMonth] = useState(() => new Date().toISOString().slice(0, 7))

  const load = useCallback(async () => {
    const [bal, stats, accs, txs] = await Promise.all([
      accountOps.getTotalBalance(),
      txOps.getStats(currentMonth),
      accountOps.getAll(),
      txOps.getAll(),
    ])
    setTotal(bal)
    setMonthStats({ income: stats.income, expense: stats.expense })
    setAccounts(accs)
    setRecent(txs.slice(0, 10))
  }, [currentMonth])

  useEffect(() => { load() }, [load])

  const catMap = {}
  for (const type of ['expense', 'income']) {
    for (const c of CATEGORIES[type]) catMap[c.id] = c
  }

  return (
    <div className="home page">
      {/* --- 顶部栏：账本名 + 操作按钮 --- */}
      <header className="home-header">
        <div className="home-header-left">
          <svg className="book-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 2v20"/>
          </svg>
          <span className="book-name">日常账本</span>
        </div>
        <div style={{ display: 'flex', gap: '2px' }}>
          <button className="header-action" aria-label="搜索">
            <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </button>
          <button className="header-action" aria-label="更多">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
          </button>
        </div>
      </header>

      {/* --- 资产概览卡片（一木风格渐变+植物装饰）--- */}
      <section className="overview-card">
        <div className="overview-row">
          <div className="overview-item">
            <p className="overview-label">本月收入</p>
            <p className="overview-value numbers">{formatAmount(monthStats.income)}</p>
          </div>
          <div className="overview-item">
            <p className="overview-label">本月结余</p>
            <p className="overview-value numbers">{formatAmount(monthStats.income - monthStats.expense)}</p>
          </div>
          <div className="overview-item">
            <p className="overview-label">剩余预算</p>
            <p className="overview-value" style={{ color: varText('--text-secondary') }}>点击设置</p>
          </div>
        </div>

        <p className="expense-big-label">本月支出(元)</p>
        <p className="expense-big-value numbers">{formatAmount(monthStats.expense)}</p>

        <PlantDecoration />
      </section>

      {/* --- 添加一条新记账（绿色大按钮）--- */}
      <button className="add-btn-block" onClick={() => nav('/add')}>
        <span className="add-btn-text">
          <svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
          添加一条新记账
        </span>
      </button>

      {/* --- 空状态 / 最近记录 --- */}
      {recent.length === 0 ? (
        <div className="empty-state">
          <EmptyIllustration />
          <p className="empty-title">你还没有任何记账</p>
        <p className="empty-hint">
          想记点什么？<span className="highlight">点击右下角麦克风</span><br/>
          说出账目，自动识别记账
        </p>
        </div>
      ) : (
        <section style={{ padding: 'var(--space-5)' }}>
          {recent.map(t => {
            const cat = catMap[t.category] || { name: '其他', icon: '📦' }
            return (
              <div key={t.id} style={{
                display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                padding: 'var(--space-3) 0',
                borderBottom: '1px solid var(--gray-200)'
              }}>
                <span style={{ fontSize: '1.3rem' }}>{cat.icon}</span>
                <div style={{ flex: 1 }}>
                  <span style={{ fontWeight: 500 }}>{cat.name}</span>
                  {t.note && <span style={{ color: 'var(--text-tertiary)', marginLeft: 8, fontSize: 'var(--text-xs)' }}>{t.note}</span>}
                </div>
                <span className={`numbers`} style={{
                  fontWeight: 600,
                  color: t.type === 'income' ? 'var(--income)' : 'var(--text-primary)',
                }}>
                  {t.type === 'income' ? '+' : '-'}¥{formatAmount(t.amount)}
                </span>
              </div>
            )
          })}
        </section>
      )}

      {/* --- 语音输入 FAB 按钮（右下角麦克风）--- */}
      <button className="fab" onClick={() => nav('/voice')} aria-label="语音记账">
        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
          <line x1="12" y1="19" x2="12" y2="23"/>
          <line x1="8" y1="23" x2="16" y2="23"/>
        </svg>
      </button>
    </div>
  )
}

function varText(v) { return v; }
