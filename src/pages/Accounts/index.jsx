import { useEffect, useState, useCallback } from 'react'
import { accountOps } from '../../db/index.js'
import { formatAmount } from '../../db/models.js'
import './Accounts.css'

/* 资产卡片植物装饰 */
const AcPlantDeco = () => (
  <svg className="ac-deco" viewBox="0 0 120 90" fill="none">
    <path d="M80 88V45c0-5-4-9-9-9s-9 4-9 9v10c0 3.5-2.5 6-6 6s-6-2.5-6-6V35"
      stroke="#B3DDC2" strokeWidth="2" strokeLinecap="round"/>
    <ellipse cx="71" cy="34" rx="8" ry="11" fill="#D1EBD9" opacity="0.4"/>
    <ellipse cx="57" cy="43" rx="5" ry="7" fill="#D1EBD9" opacity="0.3"/>
    <circle cx="95" cy="30" r="4" fill="#FDEEEE" stroke="#E86360" strokeWidth="1"/>
    <circle cx="103" cy="40" r="3" fill="#E8F5EE" stroke="#4DBB8A" strokeWidth="0.9"/>
    <path d="M96 58c6-3 12-1.5 16 3" stroke="#B3DDC2" strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M65 85c10-2.5 24-1.5 36 1.5" stroke="#B3DDC2" strokeWidth="1.4" strokeLinecap="round" opacity="0.4"/>
  </svg>
)

export default function Accounts() {
  const [accounts, setAccounts] = useState([])
  const [totalAsset, setTotalAsset] = useState(0)
  const [totalDebt, setTotalDebt] = useState(0)
  const [showTip, setShowTip] = useState(true)

  const load = useCallback(async () => {
    const list = await accountOps.getAll()
    setAccounts(list)
    let asset = 0, debt = 0
    for (const a of list) {
      if (a.type === 'debt') debt += Math.abs(a.balance)
      else asset += a.balance
    }
    setTotalAsset(asset)
    setTotalDebt(debt)
  }, [])

  useEffect(() => { load() }, [load])

  return (
    <div className="accounts-page page">
      {/* 提示条 */}
      {showTip && (
        <div className="tip-bar">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          下拉可隐藏资产，右上角更多可按账本设置不同资产
          <span className="tip-close" onClick={() => setShowTip(false)}>×</span>
        </div>
      )}

      {/* 资产概览卡片 */}
      <section className="asset-card">
        <div className="ac-header">
          <div className="ac-header-left">
            净资产(元)
            <svg className="ac-eye-icon" viewBox="0 0 24 24" strokeLinecap="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </div>
          <button className="ac-more-btn" aria-label="更多">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
          </button>
        </div>

        <div className="ac-main-row">
          <span className="ac-label">总资产</span>
          <span className="ac-value numbers">{formatAmount(totalAsset)}</span>
        </div>
        <div className="ac-sub-row">
          <span>负债 {formatAmount(totalDebt)}</span>
        </div>

        <AcPlantDeco />
      </section>

      {/* 快捷入口：报销 / 债务 / 理财 */}
      <div className="quick-cards">
        {[
          { name: '报销', sub: [['可提','0.00'],['已提','0.00']] },
          { name: '债务', sub: [['应付','0.00'],['应收','0.00']] },
          { name: '理财', sub: [['总额','0.00'],['盈亏','0.00']] },
        ].map(q => (
          <div key={q.name} className="qc-item">
            <p className="qc-name">{q.name}</p>
            {q.sub.map(([l, v]) => (
              <div key={l} className="qc-row">
                <span>{l}</span><span>{v}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* 空状态 */}
      {accounts.length === 0 ? (
        <div className="empty-area">
          <EmptyIllustration />
          <p style={{ color: 'var(--text-secondary)', marginTop: 14 }}>你还没有任何账户</p>
          <p style={{ color: 'var(--primary)', fontSize: 'var(--text-sm)', marginTop: 6 }}>
            点击右下角新增按钮添加你的第一个账户
          </p>
        </div>
      ) : (
        <section style={{ padding: '0 var(--space-5)' }}>
          {accounts.map(a => (
            <div key={a.id} style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
              padding: 'var(--space-4) var(--space-3)',
              background: 'var(--surface)',
              borderRadius: 12,
              marginBottom: 'var(--space-2)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <span style={{ fontSize: '1.4rem' }}>{a.icon}</span>
              <span style={{ flex: 1, fontWeight: 500 }}>{a.name}</span>
              <span className={`numbers`} style={{ fontWeight: 600, color: a.balance < 0 ? 'var(--expense)' : 'var(--text-primary)' }}>
                ¥{formatAmount(Math.abs(a.balance))}
              </span>
            </div>
          ))}
        </section>
      )}
    </div>
  )
}

function EmptyIllustration() {
  return (
    <svg width="160" height="130" viewBox="0 0 160 130" fill="none">
      <path d="M42 82c0-13 20-20 36-17 5.5 1.5 10 5.5 11.5 11 .8 3 .3 6-.8 9l-3 7c-1.3 3 0 6 2 7.5 2.2 1.8 5 1.8 7.5-.5l16-10"
        stroke="#D8D9D8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="74" y="54" width="40" height="50" rx="3" stroke="#D8D9D8" strokeWidth="1.7" fill="#FAFBFA"/>
      <line x1="81" y1="65" x2="107" y2="65" stroke="#E8F5EE" strokeWidth="2.3" strokeLinecap="round"/>
      <line x1="81" y1="75" x2="103" y2="75" stroke="#E8F5EE" strokeWidth="2" strokeLinecap="round"/>
      <line x1="81" y1="84" x2="95" y2="84" stroke="#E8F5EE" strokeWidth="2" strokeLinecap="round"/>
      <path d="M120 48l1.5 3h3l-2.5 2 .5 3-2.5-1.5-2.5 1.5.5-3-2.5-2h3z"
        fill="#E8F5EE" stroke="#4DBB8A" strokeWidth="0.8"/>
    </svg>
  )
}
