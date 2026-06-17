import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { txOps, accountOps } from '../../db/index.js'
import { CATEGORIES, getCurrentDate } from '../../db/models.js'
import './Add.css'

const TODAY = getCurrentDate()

export default function Add() {
  const nav = useNavigate()
  const [type, setType] = useState('expense')       // expense | income | transfer | debt
  const [amountStr, setAmountStr] = useState('')
  const [catId, setCatId] = useState('')
  const [accountId, setAccountId] = useState('')
  const [note, setNote] = useState('')
  const [date, setDate] = useState(TODAY)
  const [accounts, setAccounts] = useState([])
  const [saving, setSaving] = useState(false)

  const loadAccounts = useCallback(async () => {
    const list = await accountOps.getAll()
    setAccounts(list)
    if (list.length > 0 && !accountId) setAccountId(list[0].id)
  }, [accountId])

  if (accounts.length === 0) loadAccounts()

  const cats = CATEGORIES[type] || []

  /* ---- 键盘输入逻辑 ---- */
  const handleKey = (key) => {
    if (key === 'del') {
      setAmountStr(s => s.slice(0, -1))
    } else if (key === '.') {
      if (!amountStr.includes('.')) {
        setAmountStr(s => s || '0.')
      }
    } else if (key === 'confirm') {
      handleSave()
    } else {
      // 数字
      setAmountStr(s => {
        if (s === '0') return key
        if (s.length >= 10) return s   // 限制长度
        return s + key
      })
    }
  }

  const handleSave = async () => {
    const amt = parseFloat(amountStr)
    if (!amountStr || isNaN(amt) || amt <= 0) return
    if (!catId && type !== 'transfer' && type !== 'debt') return
    setSaving(true)
    await txOps.add({ type, amount: amt, category: catId, accountId, note, date })
    setSaving(false)
    nav(-1)
  }

  /* ---- 渲染 ---- */
  return (
    <div className="add-page">
      {/* 顶部导航 */}
      <header className="add-topbar">
        <button className="add-back" onClick={() => nav(-1)} aria-label="返回">
          <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>

        <div className="type-tabs">
          {[
            { k: 'expense', label: '支出' },
            { k: 'income',  label: '收入' },
            { k: 'transfer', label: '转账' },
            { k: 'debt', label: '债务' },
          ].map(t => (
            <button key={t.k} className={`type-tab ${type === t.k ? 'active' : ''}`}
              onClick={() => { setType(t.k); setCatId('') }}>
              {t.label}
            </button>
          ))}
        </div>

        <span className="edit-btn">编辑</span>
      </header>

      {/* 分类选择区（可滚动） */}
      <div className="cat-area">
        <div className="cat-grid">
          {cats.map(c => (
            <button key={c.id}
              className={`cat-item ${catId === c.id ? 'active' : ''}`}
              onClick={() => setCatId(c.id)}>
              <span className="cat-dot" />
              <span className="cat-icon-wrap">{c.icon}</span>
              <span className="cat-name">{c.name}</span>
            </button>
          ))}
          {/* 新增按钮 */}
          <button className="cat-item cat-add" aria-label="新增分类">
            <span className="cat-icon-wrap" />
            <span className="cat-name">新增</span>
          </button>
        </div>
      </div>

      {/* 底部固定面板：备注+金额 | 工具栏 | 数字键盘 */}
      <div className="bottom-panel">
        {/* 备注行 + 金额显示 */}
        <div className="amount-row">
          <div className="note-area">
            <svg className="note-icon" viewBox="0 0 24 24" strokeLinecap="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/></svg>
            <input className="note-input"
              placeholder={type === 'expense' || type === 'income' ? '添加备注' :
                type === 'transfer' ? '添加备注' : '添加备注'}
              value={note} onChange={e => setNote(e.target.value)}
            />
          </div>
          <span className={`amount-display ${type}`}>
            {amountStr || '0.00'}
          </span>
        </div>

        {/* 工具栏快捷标签 */}
        <div className="toolbar">
          <button className={`tool-tag active`}>
            <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            今天
          </button>
          <button className="tool-tag">
            <svg viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="17" cy="12" r="2"/><path d="M2 9h18"/></svg>
            无账户
          </button>
          <button className="tool-tag">
            <svg viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
            不报销
          </button>
          <button className="tool-tag">附件</button>
          <button className="tool-tag">优惠</button>
          <button className="tool-tag">属性</button>
        </div>

        {/* 数字键盘 */}
        <div className="keypad">
          {['1','2','3'].map(k =>
            <button key={k} className="key-btn key-num" onClick={() => handleKey(k)}>{k}</button>
          )}
          <button className="key-btn key-action" onClick={() => handleKey('del')}>
            <svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round">
              <path d="M21 4H8l-7 8 7 8h13a2 2 0 002-2V6a2 2 0 00-2-2z"/><line x1="18" y1="9" x2="12" y2="15"/><line x1="12" y1="9" x2="18" y2="15"/>
            </svg>
          </button>

          {['4','5','6'].map(k =>
            <button key={k} className="key-btn key-num" onClick={() => handleKey(k)}>{k}</button>
          )}
          <button className="key-btn key-op" onClick={() => handleKey('+')}>+</button>
          <button className="key-btn key-op" onClick={() => handleKey('-')}>−</button>

          {['7','8','9'].map(k =>
            <button key={k} className="key-btn key-num" onClick={() => handleKey(k)}>{k}</button>
          )}
          <button className="key-btn key-op" onClick={() => handleKey('×')}>×</button>
          <button className="key-btn key-op" onClick={() => handleKey('÷')}>÷</button>

          <button className="key-btn key-num" style={{ fontSize: 'var(--text-base)' }}>再记</button>
          <button className="key-btn key-num" onClick={() => handleKey('0')}>0</button>
          <button className="key-btn key-num" onClick={() => handleKey('.')}>.</button>
          <button className="key-btn key-action" style={{ background: '#F0F0F0' }} onClick={() => nav('/')}>取消</button>

          {/* 确认/保存按钮 — 跨两行，绿色 */}
          <button className="key-btn key-confirm" onClick={handleSave}>
            {saving ? '...' : '\n再记'}
          </button>
        </div>
      </div>
    </div>
  )
}
