// App.jsx — 一木风格浮动胶囊导航（5标签：首页/日历/资产/统计/我的）
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import Home from './pages/Home/index.jsx'
import Calendar from './pages/Calendar/index.jsx'
import Voice from './pages/Voice/index.jsx'
import Add from './pages/Add/index.jsx'
import Accounts from './pages/Accounts/index.jsx'
import Stats from './pages/Stats/index.jsx'
import More from './pages/More/index.jsx'
import './App.css'

/* SVG 线条图标 — 一木风格 */
const IcoHome = () => (
  <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/>
    <polyline points="9 21 9 13 15 13 15 21"/>
  </svg>
)

const IcoCalendar = () => (
  <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)

const IcoWallet = () => (
  <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2"/>
    <circle cx="17" cy="12" r="2"/>
    <path d="M2 9h18"/>
  </svg>
)

const IcoChart = () => (
  <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
)

const IcoUser = () => (
  <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4"/>
    <path d="M5 20a7 7 0 0 1 14 0"/>
  </svg>
)

const tabs = [
  { path: '/',        label: '首页',  icon: IcoHome },
  { path: '/calendar', label: '日历', icon: IcoCalendar },
  { path: '/accounts', label: '资产',  icon: IcoWallet },
  { path: '/stats',    label: '统计',  icon: IcoChart },
  { path: '/more',     label: '我的',  icon: IcoUser },
]

export default function App() {
  const loc = useLocation()
  const nav = useNavigate()
  const active = tabs.find(t => loc.pathname === t.path)?.path || '/'

  return (
    <>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/voice" element={<Voice />} />
          <Route path="/add" element={<Add />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/more" element={<More />} />
        </Routes>
      </main>

      {/* 一木风格浮动胶囊导航 */}
      <nav className="tab-bar">
        {tabs.map(t => {
          const Icon = t.icon
          return (
            <button key={t.path} className={`tab-item ${active === t.path ? 'active' : ''}`}
              onClick={() => nav(t.path)}>
              <span className="tab-icon"><Icon /></span>
              <span className="tab-label">{t.label}</span>
            </button>
          )
        })}
      </nav>
    </>
  )
}
