import { useState, useEffect, useMemo } from 'react'
import { txOps } from '../../db/index.js'
import { formatAmount } from '../../db/models.js'
import './Calendar.css'

/* 中国农历节日（简化版）*/
const LUNAR_FEST = {
  '1-1': '春节', '1-15': '元宵', '5-5': '端午',
  '8-15': '中秋', '9-9': '重阳', '12-30': '除夕',
}
const SOLAR_FEST = {
  '2-14': '情人', '3-8': '妇女', '3-12': '植树', '4-1': '愚人',
  '5-1': '劳动', '6-1': '儿童', '7-1': '建党', '8-1': '建军',
  '10-1': '国庆', '12-25': '圣诞',
}

export default function Calendar() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [records, setRecords] = useState([])   // 本月记录
  const [selectedDate, setSelectedDate] = useState(null)

  // 加载本月数据
  useEffect(() => {
    txOps.getAll().then(all => {
      const ym = `${year}-${String(month + 1).padStart(2, '0')}`
      const filtered = all.filter(t => t.date && t.date.startsWith(ym))
      setRecords(filtered)
    })
  }, [year, month])

  // 月度统计
  const monthStats = useMemo(() => {
    let inc = 0, exp = 0
    for (const r of records) {
      if (r.type === 'income') inc += r.amount
      else exp += r.amount
    }
    return { income: inc, expense: exp }
  }, [records])

  // 日历数据
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startWeekday = firstDay.getDay()
    const daysInMonth = lastDay.getDate()

    const days = []
    // 上月尾部
    const prevLast = new Date(year, month, 0).getDate()
    for (let i = startWeekday - 1; i >= 0; i--) {
      days.push({ d: prevLast - i, other: true })
    }
    // 本月
    for (let d = 1; d <= daysInMonth; d++) {
      days.push({ d, other: false })
    }
    // 下月头部
    const remaining = 42 - days.length
    for (let d = 1; d <= remaining; d++) {
      days.push({ d, other: true })
    }
    return days
  }, [year, month])

  // 检查某天是否有记录
  const hasRecord = (d) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    return records.some(t => t.date === dateStr)
  }

  const isToday = (d) =>
    year === now.getFullYear() && month === now.getMonth() && d === now.getDate()

  const getFestival = (d) => {
    const key = `${month + 1}-${d}`
    return LUNAR_FEST[key] || SOLAR_FEST[key] || null
  }

  const wdLabels = ['日','一','二','三','四','五','六']

  return (
    <div className="cal-page page">
      {/* 顶部栏 */}
      <header className="cal-header">
        <h1 className="cal-title">{year}年{month + 1}月</h1>
        <div className="cal-actions">
          <button className="cal-action-btn" aria-label="筛选">
            <svg viewBox="0 0 24 24"><polygon points="22 3 10 3 10 15"/><polyline points="13.5 9.5 20 3 13.5 9.5"/></svg>
          </button>
          <button className="cal-action-btn" aria-label="导出">
            <svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          </button>
          <button className="cal-action-btn" aria-label="更多">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
          </button>
        </div>
      </header>

      {/* 月度收支 */}
      <div className="month-stats-row">
        <div className="ms-item income">
          <p className="ms-label">收</p>
          <p className="ms-val numbers">{formatAmount(monthStats.income)}</p>
        </div>
        <div className="ms-item expense">
          <p className="ms-label">支</p>
          <p className="ms-val numbers">{formatAmount(monthStats.expense)}</p>
        </div>
        <div className="ms-item">
          <p className="ms-label">余</p>
          <p className="ms-val numbers">{formatAmount(monthStats.income - monthStats.expense)}</p>
        </div>
      </div>

      {/* 星期标题 */}
      <div className="cal-grid-wrap">
        <div className="weekdays">
          {wdLabels.map(w => <span key={w} className="wd-cell">{w}</span>)}
        </div>

        {/* 日期格子 */}
        <div className="days-grid">
          {calendarDays.map((cell, i) => (
            <div key={i} className={`day-cell ${cell.other ? 'other-month' : ''} ${isToday(cell.d) ? 'today' : ''} ${!cell.other && hasRecord(cell.d) ? 'has-record' : ''}`}
              onClick={() => !cell.other && setSelectedDate(`${year}-${String(month+1).padStart(2,'0')}-${String(cell.d).padStart(2,'0')}`)}>
              <span className="day-num">{cell.d}</span>
              {!cell.other && getFestival(cell.d) && (
                <span className="day-festival">{getFestival(cell.d)}</span>
              )}
              <span className="day-dot" />
            </div>
          ))}
        </div>
      </div>

      {/* 空状态 */}
      {records.length === 0 && (
        <div className="cal-empty">
          <EmptyIllustration />
          <p style={{ color: 'var(--text-secondary)', marginTop: 16 }}>这一天你还没有任何记账</p>
        </div>
      )}
    </div>
  )
}

/* 手绘风格日历空状态插图 */
function EmptyIllustration() {
  return (
    <svg width="160" height="130" viewBox="0 0 160 130" fill="none">
      {/* 手拿日历 */}
      <path d="M40 85c0-14 22-22 38-18 6 1.5 11 6 13 12 1 3 .5 6-1 9l-3 6c-1.5 3 0 6 2 8 2.5 1.5 5 1.5 7 0l14-9"
        stroke="#D8D9D8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {/* 日历本 */}
      <rect x="72" y="55" width="44" height="54" rx="4" stroke="#D8D9D8" strokeWidth="1.8" fill="#FAFBFA"/>
      <line x1="80" y1="67" x2="108" y2="67" stroke="#E8F5EE" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="80" y1="78" x2="104" y2="78" stroke="#E8F5EE" strokeWidth="2" strokeLinecap="round"/>
      <line x1="80" y1="89" x2="96" y2="89" stroke="#E8F5EE" strokeWidth="2" strokeLinecap="round"/>
      {/* 装饰星星/闪光 */}
      <path d="M122 50l1.5 3h3l-2.5 2 .5 3-2.5-1.5-2.5 1.5.5-3-2.5-2h3z"
        fill="#E8F5EE" stroke="#4DBB8A" strokeWidth="0.8"/>
      <path d="M52 45l1 2h2l-1.5 1.5.5 2-2-1-2 1 .5-2-1.5-1.5h2z"
        fill="#FFF5D4" stroke="#F5A623" strokeWidth="0.8"/>
      {/* 小线条装饰 */}
      <line x1="128" y1="75" x2="138" y2="70" stroke="#B3DDC2" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
      <line x1="132" y1="82" x2="140" y2="80" stroke="#B3DDC2" strokeWidth="1.2" strokeLinecap="round" opacity="0.4"/>
    </svg>
  )
}
