import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Voice.css'

export default function Voice() {
  const nav = useNavigate()
  const [isListening, setIsListening] = useState(false)
  const [recognizedText, setRecognizedText] = useState('')
  const [parsed, setParsed] = useState(null)

  // 模拟语音识别
  const handleVoiceInput = () => {
    setIsListening(true)
    setRecognizedText('')
    setParsed(null)

    // 模拟识别过程
    setTimeout(() => {
      const demoText = '午餐 35元'
      setRecognizedText(demoText)
      setIsListening(false)

      // 模拟解析
      setTimeout(() => {
        setParsed({
          type: 'expense',
          category: '餐饮',
          amount: 35,
          note: '午餐',
          account: '现金',
        })
      }, 800)
    }, 2000)
  }

  const handleConfirm = () => {
    // 这里应该保存到数据库
    alert('记账成功！（演示模式）')
    nav('/')
  }

  return (
    <div className="voice-page">
      {/* 顶部栏 */}
      <div className="voice-header">
        <button className="voice-back" onClick={() => nav('/')}>
          <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <span className="voice-title">语音记账</span>
        <div className="voice-header-right"></div>
      </div>

      {/* 语音动画区域 */}
      <div className="voice-animation">
        {isListening && (
          <>
            <div className="voice-ring"></div>
            <div className="voice-ring"></div>
            <div className="voice-ring"></div>
          </>
        )}
        <button
          className="voice-mic-btn"
          onClick={handleVoiceInput}
          style={{ background: isListening ? 'var(--expense)' : 'var(--primary)' }}
        >
          <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" fill="white" stroke="white"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="white"/>
            <line x1="12" y1="19" x2="12" y2="23" stroke="white"/>
            <line x1="8" y1="23" x2="16" y2="23" stroke="white"/>
          </svg>
        </button>
      </div>

      {/* 提示文字 */}
      <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-4)' }}>
        {isListening ? '正在聆听...' : '点击麦克风开始说话'}
      </p>

      {/* 识别结果 */}
      {recognizedText && !parsed && (
        <div className="voice-result">
          <p className="voice-result-text">{recognizedText}</p>
          <p className="voice-result-hint">正在解析...</p>
        </div>
      )}

      {/* 解析结果 */}
      {parsed && (
        <>
          <div className="voice-parsed">
            <div className="voice-parsed-row">
              <span className="voice-parsed-label">类型</span>
              <span className="voice-parsed-value">支出</span>
            </div>
            <div className="voice-parsed-row">
              <span className="voice-parsed-label">分类</span>
              <span className="voice-parsed-value">{parsed.category}</span>
            </div>
            <div className="voice-parsed-row">
              <span className="voice-parsed-label">金额</span>
              <span className="voice-parsed-value amount">¥{parsed.amount}</span>
            </div>
            <div className="voice-parsed-row">
              <span className="voice-parsed-label">备注</span>
              <span className="voice-parsed-value">{parsed.note}</span>
            </div>
            <div className="voice-parsed-row">
              <span className="voice-parsed-label">账户</span>
              <span className="voice-parsed-value">{parsed.account}</span>
            </div>
          </div>

          <button className="voice-confirm-btn" onClick={handleConfirm}>
            确认记账
          </button>
        </>
      )}

      {/* 使用提示 */}
      {!recognizedText && (
        <div className="voice-tips">
          <p className="voice-tips-title">试试这样说</p>
          <div className="voice-tips-list">
            <span className="voice-tip-tag">"午餐 35元"</span>
            <span className="voice-tip-tag">"打车 28块5"</span>
            <span className="voice-tip-tag">"工资 8000元"</span>
            <span className="voice-tip-tag">"买咖啡 32"</span>
          </div>
        </div>
      )}
    </div>
  )
}
