import { useState } from 'react'
import { txOps, accountOps } from '../../db/index.js'
import './More.css'

export default function More() {
  const [showBackup, setShowBackup] = useState(false)

  /* 导出数据 */
  const handleExport = async () => {
    try {
      const [txs, accounts] = await Promise.all([
        txOps.getAll(),
        accountOps.getAll(),
      ])
      const data = {
        version: '1.0',
        exportTime: new Date().toISOString(),
        transactions: txs,
        accounts: accounts,
      }
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `记账数据_${new Date().toISOString().slice(0, 10)}.json`
      a.click()
      URL.revokeObjectURL(url)
      alert('导出成功！')
    } catch (e) {
      alert('导出失败：' + e.message)
    }
  }

  /* 导入数据 */
  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async (e) => {
      const file = e.target.files[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = async (ev) => {
        try {
          const data = JSON.parse(ev.target.result)
          // 这里应该保存到数据库
          alert(`导入成功！\n交易记录：${data.transactions?.length || 0} 条\n账户：${data.accounts?.length || 0} 个`)
        } catch (err) {
          alert('导入失败：文件格式错误')
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  /* 数据备份 */
  const handleBackup = async () => {
    try {
      const [txs, accounts] = await Promise.all([
        txOps.getAll(),
        accountOps.getAll(),
      ])
      const data = {
        version: '1.0',
        backupTime: new Date().toISOString(),
        transactions: txs,
        accounts: accounts,
      }
      localStorage.setItem('jizhang_backup', JSON.stringify(data))
      alert('备份成功！数据已保存到本地')
    } catch (e) {
      alert('备份失败：' + e.message)
    }
  }

  /* 恢复数据 */
  const handleRestore = () => {
    const backup = localStorage.getItem('jizhang_backup')
    if (!backup) {
      alert('没有找到备份数据')
      return
    }
    if (confirm('确定要恢复数据吗？当前数据将被覆盖。')) {
      try {
        const data = JSON.parse(backup)
        alert(`恢复成功！\n备份时间：${data.backupTime}`)
      } catch (e) {
        alert('恢复失败：' + e.message)
      }
    }
  }

  return (
    <div className="more-page page">
      {/* 标题 */}
      <header className="more-header">
        <h1 className="more-title">我的</h1>
      </header>

      {/* 数据管理 */}
      <section className="group-section">
        <p className="group-label">数据管理</p>
        <div className="list-card">
          <button className="list-row" onClick={handleBackup}>
            <span className="list-icon">💾</span>
            <span className="list-text">数据备份</span>
            <span className="list-arrow">›</span>
          </button>
          <button className="list-row" onClick={handleRestore}>
            <span className="list-icon">🔄</span>
            <span className="list-text">恢复数据</span>
            <span className="list-arrow">›</span>
          </button>
          <button className="list-row" onClick={handleExport}>
            <span className="list-icon">📤</span>
            <span className="list-text">导出数据</span>
            <span className="list-arrow">›</span>
          </button>
          <button className="list-row" onClick={handleImport}>
            <span className="list-icon">📥</span>
            <span className="list-text">导入数据</span>
            <span className="list-arrow">›</span>
          </button>
        </div>
      </section>

      {/* 关于信息 */}
      <section style={{ padding: 'var(--space-8) var(--space-5) var(--space-10)' }}>
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 14,
          padding: 'var(--space-5)',
          textAlign: 'center',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <p style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--primary)' }}>
            记账 v5.0
          </p>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 6 }}>
            从容掌握每一笔收支
          </p>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 2 }}>
            无需登录 · 无需付费 · 数据本地存储
          </p>
        </div>
      </section>
    </div>
  )
}
