import { useEffect, useRef, useState } from 'react'

const simulators = {
  customer: {
    title: 'Customer Conversation Lab',
    label: 'Talk it out',
    description: 'Practice calm, clear support conversations with a customer simulator.',
    icon: '💬',
    url: 'https://copilotstudio.microsoft.com/environments/Default-b4c546a4-7dac-46a6-a7dd-ed822a11efd3/bots/crbac_test0_Nex4PA/webchat?__version__=2&enableFileAttachment=false&cliAgent=true',
  },
  quiz: {
    title: 'Knowledge Sprint',
    label: 'Quick challenge',
    description: 'Build confidence across consumer Microsoft products with your quiz simulator.',
    icon: '⚡',
    url: 'https://copilotstudio.microsoft.com/environments/Default-b4c546a4-7dac-46a6-a7dd-ed822a11efd3/bots/crbac_betaquiz_2nN7-S/webchat?__version__=2&enableFileAttachment=false&cliAgent=true',
  },
}

const typingText = 'Clear support starts with listening carefully, checking the details, and explaining the next step in simple language.'

const arcadeModes = [
  {
    id: 'myth', title: 'Myth or Fact', icon: '🧪', prompt: 'In Windows, pressing Win + V opens clipboard history. You may need to turn clipboard history on first.', options: ['Fact', 'Myth'], answer: 0,
    explanation: 'Fact. Win + V opens clipboard history; Windows may prompt you to enable it the first time.', source: 'https://support.microsoft.com/en-US/Windows/Apps/using-the-clipboard',
  },
  {
    id: 'shortcut', title: 'Shortcut Showdown', icon: '⌨️', prompt: 'Which Windows shortcut opens Task Manager directly?', options: ['Ctrl + Shift + Esc', 'Ctrl + Alt + S', 'Win + T'], answer: 0,
    explanation: 'Ctrl + Shift + Esc opens Task Manager. See Microsoft’s Windows keyboard shortcut guide.', source: 'https://support.microsoft.com/en-us/windows/keyboard-shortcuts-in-windows-dcc61a57-8ff0-cffe-9796-cb9706c75eec',
  },
  {
    id: 'settings', title: 'Settings Sprint', icon: '⚙️', prompt: 'A customer wants to quiet app notifications on Windows 11. Where should you guide them first?', options: ['Settings → System → Notifications', 'Settings → Personalization → Colors', 'Settings → Time & language → Date & time'], answer: 0,
    explanation: 'Settings → System → Notifications is the starting point for Windows notification controls.',
  },
  {
    id: 'error', title: 'Error Code Detective', icon: '🕵️', prompt: 'A customer shares an unfamiliar error code. What is the best first move?', options: ['Get the exact code, full message, affected app, and when it appears', 'Guess what it means and ask them to reset everything', 'Ignore the code and reinstall Windows'], answer: 0,
    explanation: 'Capture the full details before diagnosing. Error codes can depend on the product and situation.',
  },
]

const replyChallenge = {
  prompt: 'A customer says: “I’ve tried twice and I’m still locked out. I need this fixed today.” Pick the best opening reply.',
  options: [
    '“That sounds frustrating, especially with a deadline. I’ll help you check the sign-in issue step by step.”',
    '“You probably entered the wrong password. Try again.”',
    '“Please read the help page before contacting support.”',
  ],
  answer: 0,
}

function MicrosoftMark() {
  return <span className="microsoft-mark" aria-hidden="true"><i /><i /><i /><i /></span>
}

function Brand({ onHome = null }) {
  const content = <><MicrosoftMark /><span><strong>MLTS Consumer Simulator</strong><small>Microsoft learning, made practical</small></span></>
  return onHome ? <button className="brand" onClick={onHome}>{content}</button> : <a className="brand" href="#home">{content}</a>
}

function Header({ status = 'Ready', onHome = null, nav = false }) {
  return <header className="topbar"><Brand onHome={onHome} />{nav ? <nav className="top-nav" aria-label="Main navigation"><a href="#activities">Activities</a><a href="#simulators">Simulators</a><a href="#pulse">Pulse</a></nav> : <span className="status-pill"><span className="status-dot" />{status}</span>}</header>
}

function TypingSprint({ onBack }) {
  const [started, setStarted] = useState(false)
  const [seconds, setSeconds] = useState(30)
  const [typed, setTyped] = useState('')
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    if (!started || finished) return undefined
    const timer = window.setInterval(() => {
      setSeconds((value) => {
        if (value <= 1) {
          window.clearInterval(timer)
          setFinished(true)
          return 0
        }
        return value - 1
      })
    }, 1000)
    return () => window.clearInterval(timer)
  }, [started, finished])

  const correct = [...typed].filter((char, index) => char === typingText[index]).length
  const accuracy = typed.length ? Math.round((correct / typed.length) * 100) : 100
  const elapsed = 30 - seconds
  const wpm = elapsed ? Math.round((correct / 5) / (elapsed / 60)) : 0
  function reset() { setStarted(false); setFinished(false); setSeconds(30); setTyped('') }

  return <div className="activity-page"><button className="back-button" onClick={onBack}>← All activities</button><div className="page-heading"><span className="eyebrow">Quick play · 30 seconds</span><h1>Typing Sprint</h1><p>Type the sentence accurately. Speed and accuracy update as you go.</p></div><section className="activity-panel"><div className="typing-stats"><div><span>Time</span><strong>{seconds}s</strong></div><div><span>Speed</span><strong>{wpm} WPM</strong></div><div><span>Accuracy</span><strong>{accuracy}%</strong></div></div><p className="typing-copy">{[...typingText].map((char, index) => <span key={index} className={index < typed.length ? (typed[index] === char ? 'correct-char' : 'wrong-char') : ''}>{char}</span>)}</p><textarea aria-label="Typing practice" value={typed} onChange={(event) => setTyped(event.target.value.slice(0, typingText.length))} disabled={!started || finished} placeholder={started ? 'Start typing here…' : 'Press Start when you’re ready'} /><div className="activity-actions"><button className="button-primary" onClick={() => setStarted(true)} disabled={started || finished}>{finished ? 'Sprint complete' : started ? 'Typing…' : 'Start sprint'}</button><button className="button-secondary" onClick={reset}>Try again</button></div>{finished && <p className="success-note" role="status">Nice run: {wpm} WPM with {accuracy}% accuracy.</p>}</section></div>
}

function ReplyRemix({ onBack }) {
  const [choice, setChoice] = useState(null)
  const [round, setRound] = useState(1)
  const [score, setScore] = useState(0)
  function choose(index) { if (choice !== null) return; setChoice(index); if (index === replyChallenge.answer) setScore((value) => value + 1) }
  function next() { setRound((value) => value + 1); setChoice(null) }
  return <div className="activity-page"><button className="back-button" onClick={onBack}>← All activities</button><div className="page-heading"><span className="eyebrow">Quick play · Customer care</span><h1>Reply Remix</h1><p>Choose a response that makes the customer feel heard and gives them a clear next step.</p></div><section className="activity-panel challenge-panel"><div className="challenge-meta"><span>Round {round}</span><span>Good replies {score}</span></div><h2>{replyChallenge.prompt}</h2><div className="answer-options">{replyChallenge.options.map((option, index) => <button key={option} className={choice !== null && index === replyChallenge.answer ? 'correct' : (choice === index ? 'incorrect' : '')} onClick={() => choose(index)} disabled={choice !== null}><span className="option-letter">{String.fromCharCode(65 + index)}</span>{option}</button>)}</div>{choice !== null && <div className={`answer-feedback ${choice === 0 ? 'good' : 'try-again'}`} role="status"><strong>{choice === 0 ? 'That lands well!' : 'Try a more supportive opener.'}</strong><span>{choice === 0 ? 'Empathy plus a clear next step makes a strong opening.' : 'Acknowledge the frustration, then offer a clear next step.'}</span></div>}<button className="button-primary next-button" onClick={next} disabled={choice === null}>Next round <span aria-hidden="true">→</span></button></section></div>
}

function SkillArcade({ onBack }) {
  const [modeId, setModeId] = useState('myth')
  const [choice, setChoice] = useState(null)
  const [score, setScore] = useState(0)
  const mode = arcadeModes.find((item) => item.id === modeId)
  function changeMode(id) { setModeId(id); setChoice(null) }
  function choose(index) { if (choice !== null) return; setChoice(index); if (index === mode.answer) setScore((value) => value + 1) }
  function nextMode() { const index = arcadeModes.findIndex((item) => item.id === modeId); changeMode(arcadeModes[(index + 1) % arcadeModes.length].id) }
  return <div className="activity-page"><button className="back-button" onClick={onBack}>← All activities</button><div className="page-heading"><span className="eyebrow">Four mini games · One arcade</span><h1>MLTS Skill Arcade</h1><p>Pick a mode, make your call, and collect a skill point.</p></div><div className="arcade-modes" role="tablist" aria-label="Choose a mini game">{arcadeModes.map((item) => <button key={item.id} role="tab" aria-selected={modeId === item.id} className={modeId === item.id ? 'active' : ''} onClick={() => changeMode(item.id)}><span>{item.icon}</span>{item.title}</button>)}</div><section className="activity-panel challenge-panel"><div className="challenge-meta"><span>{mode.icon} {mode.title}</span><span>Skill points {score}</span></div><h2>{mode.prompt}</h2><div className="answer-options">{mode.options.map((option, index) => <button key={option} className={choice !== null && index === mode.answer ? 'correct' : (choice === index ? 'incorrect' : '')} onClick={() => choose(index)} disabled={choice !== null}><span className="option-letter">{String.fromCharCode(65 + index)}</span>{option}</button>)}</div>{choice !== null && <div className={`answer-feedback ${choice === mode.answer ? 'good' : 'try-again'}`} role="status"><strong>{choice === mode.answer ? 'Nice one!' : 'Here’s the answer.'}</strong><span>{mode.explanation}{mode.source && <> <a href={mode.source} target="_blank" rel="noreferrer">Check Microsoft’s guide ↗</a></>}</span></div>}<button className="button-primary next-button" onClick={nextMode} disabled={choice === null}>Next mini game <span aria-hidden="true">→</span></button></section></div>
}

function MicrosoftPulse() {
  const [updates, setUpdates] = useState([])
  const [sources, setSources] = useState([])
  const [status, setStatus] = useState('loading')
  const [checkedAt, setCheckedAt] = useState(null)
  const [filter, setFilter] = useState('All')
  const trackRef = useRef(null)

  async function loadUpdates() {
    setStatus('loading')
    try {
      const response = await fetch('/api/microsoft-pulse')
      if (!response.ok) throw new Error('Feed request failed')
      const payload = await response.json()
      const items = Array.isArray(payload.updates) ? payload.updates : []
      setUpdates(items)
      setSources(Array.isArray(payload.sources) ? payload.sources : [])
      setCheckedAt(payload.checkedAt || null)
      setStatus(items.length ? 'ready' : 'empty')
    } catch {
      setStatus('error')
    }
  }

  useEffect(() => { loadUpdates() }, [])
  const categories = ['All', ...new Set(updates.map((item) => item.category).filter(Boolean))]
  const visibleUpdates = updates.filter((item) => filter === 'All' || item.category === filter)
  const checkedLabel = checkedAt ? new Date(checkedAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : ''
  function scrollTrack(direction) { trackRef.current?.scrollBy({ left: direction * trackRef.current.clientWidth * 0.84, behavior: 'smooth' }) }

  return <section className="pulse-section" id="pulse"><div className="pulse-heading"><div><span className="eyebrow">Official Microsoft updates</span><h2><span className="pulse-signal" aria-hidden="true">●</span> Microsoft Pulse</h2><p>What changed, who it affects, and the original Microsoft source.</p></div><div className={`pulse-live ${status}`}><span className="live-dot" />{status === 'ready' ? `Official feeds ${sources.filter((source) => source.ok).length}/${sources.length}` : status === 'error' ? 'Feed unavailable' : status === 'empty' ? 'No feed items' : 'Checking official feeds'}</div></div><div className="pulse-controls">{categories.length > 1 && <div className="pulse-filters" aria-label="Filter official updates">{categories.map((category) => <button key={category} className={filter === category ? 'active' : ''} onClick={() => setFilter(category)}>{category}</button>)}</div>}<div className="pulse-scroll-actions"><span>Scroll to explore</span><button aria-label="Scroll updates left" onClick={() => scrollTrack(-1)}>←</button><button aria-label="Scroll updates right" onClick={() => scrollTrack(1)}>→</button></div></div>
    {status === 'loading' && <div className="pulse-message" role="status">Checking Microsoft’s public update feeds…</div>}{status === 'error' && <div className="pulse-message" role="status"><strong>Couldn’t load the live feeds.</strong><span>Try again, or open one of the official Microsoft source pages below.</span><button className="button-secondary" onClick={loadUpdates}>Try again</button></div>}{status === 'empty' && <div className="pulse-message">No updates came back from the connected official feeds. Check the source pages below.</div>}{status === 'ready' && visibleUpdates.length === 0 && <div className="pulse-message">No updates in this category right now.</div>}
    {status === 'ready' && visibleUpdates.length > 0 && <div className="pulse-track" ref={trackRef} aria-label="Latest Microsoft updates">{visibleUpdates.map((item) => <article className="pulse-card" key={item.url}><div className="pulse-card-meta"><span className="pulse-category">{item.category}</span><time dateTime={item.date}>{new Date(item.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}</time></div><h3>{item.title}</h3><p>{item.summary || 'Open the official Microsoft update for details.'}</p><div className="pulse-source"><span>Official source · {item.source}</span><a href={item.url} target="_blank" rel="noreferrer">Read at Microsoft <span aria-hidden="true">↗</span></a></div></article>)}</div>}
    <div className="pulse-footer"><span>{checkedLabel ? `Feed checked ${checkedLabel}` : 'Stories link directly to Microsoft-published pages.'} · Results come from connected public feeds and refresh periodically.</span><button className="button-secondary" onClick={loadUpdates}>Refresh updates</button></div><div className="pulse-sources"><strong>Official feeds</strong><a href="https://www.microsoft.com/en-us/microsoft-365/blog/" target="_blank" rel="noreferrer">Microsoft 365 Blog</a><a href="https://blogs.windows.com/" target="_blank" rel="noreferrer">Windows Blog</a><a href="https://www.microsoft.com/en-us/security/blog/" target="_blank" rel="noreferrer">Microsoft Security Blog</a></div>
  </section>
}

function FeedbackSection({ open, onClose }) {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [message, setMessage] = useState('')
  const [challenge, setChallenge] = useState('')
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')

  async function requestCode(event) {
    event.preventDefault()
    setNotice('')
    setBusy(true)
    try {
      const response = await fetch('/api/feedback-code', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Could not send verification code.')
      setChallenge(result.challenge)
      setNotice('Check your work inbox for a verification code. It expires in 10 minutes.')
    } catch (error) { setNotice(error.message) } finally { setBusy(false) }
  }

  async function submitFeedback(event) {
    event.preventDefault()
    setNotice('')
    setBusy(true)
    try {
      const response = await fetch('/api/feedback-submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, code, challenge, message }) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Could not send feedback.')
      setNotice('Thanks! Your feedback was sent to the MLTS team.')
      setCode(''); setMessage(''); setChallenge('')
    } catch (error) { setNotice(error.message) } finally { setBusy(false) }
  }

  if (!open) return null
  return <div className="feedback-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}><section className="feedback-drawer" id="feedback" role="dialog" aria-modal="true" aria-labelledby="feedback-title"><div className="feedback-drawer-heading"><div><span className="eyebrow">Help shape the next update</span><h2 id="feedback-title">Send feedback</h2></div><button className="drawer-close" onClick={onClose} aria-label="Close feedback">×</button></div><p className="feedback-description">Share an idea or report an issue. Only verified @concentrix.com and @microsoft.com work email addresses can send.</p><form className="feedback-form" onSubmit={challenge ? submitFeedback : requestCode}><label>Work email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@concentrix.com or you@microsoft.com" required pattern="^[^\s@]+@(concentrix\.com|microsoft\.com)$" title="Use a @concentrix.com or @microsoft.com address." /></label>{challenge && <label>Email verification code<input inputMode="numeric" autoComplete="one-time-code" value={code} onChange={(event) => setCode(event.target.value)} placeholder="8-digit code" required /></label>}<label>Your feedback<textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="What should we improve?" required maxLength={3000} /></label>{challenge ? <button className="button-primary" disabled={busy || !code || !message}>{busy ? 'Sending…' : 'Verify & send feedback'} <span aria-hidden="true">→</span></button> : <button className="button-primary" disabled={busy}>{busy ? 'Sending code…' : 'Verify work email'} <span aria-hidden="true">→</span></button>}<p className="feedback-privacy">Verified feedback goes to the two MLTS recipients.</p>{notice && <p className="feedback-notice" role="status">{notice}</p>}</form><div className="feedback-recipients"><strong>mohammed.ulhasan@concentrix.com</strong><strong>v-moulhasan@microsoft.com</strong></div></section></div>
}

function App() {
  const [activeSimulator, setActiveSimulator] = useState(null)
  const [activeGame, setActiveGame] = useState(null)
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [spotlightIndex, setSpotlightIndex] = useState(0)
  const [spotlightPaused, setSpotlightPaused] = useState(false)
  const brand = <><MicrosoftMark /><span><strong>MLTS Consumer Simulator</strong><small>Microsoft learning, made practical</small></span></>

  const spotlights = [
    { eyebrow: 'Practice · customer care', title: 'Customer Conversation Lab', text: 'Build calm, clear customer conversations with a realistic simulator.', label: 'Start a conversation', action: () => setActiveSimulator('customer') },
    { eyebrow: 'Play · four quick modes', title: 'MLTS Skill Arcade', text: 'Myth or Fact, shortcuts, settings, and error code detection.', label: 'Open the arcade', action: () => setActiveGame('arcade') },
    { eyebrow: 'Practice · consumer Microsoft', title: 'Knowledge Sprint', text: 'Explore everyday Microsoft products with your quiz simulator.', label: 'Start the quiz', action: () => setActiveSimulator('quiz') },
    { eyebrow: 'Play · 30 seconds', title: 'Typing Sprint', text: 'Test your speed and accuracy in a quick support themed round.', label: 'Start typing', action: () => setActiveGame('typing') },
    { eyebrow: 'Read · official updates', title: 'Microsoft Pulse', text: 'Browse compact update cards linked to Microsoft published sources.', label: 'Browse Pulse', action: () => document.getElementById('pulse')?.scrollIntoView({ behavior: 'smooth' }) },
  ]
  const spotlight = spotlights[spotlightIndex]
  useEffect(() => {
    if (spotlightPaused || activeGame || activeSimulator) return undefined
    const timer = window.setInterval(() => setSpotlightIndex((index) => (index + 1) % spotlights.length), 5200)
    return () => window.clearInterval(timer)
  }, [spotlightPaused, activeGame, activeSimulator])

  if (activeSimulator) {
    const simulator = simulators[activeSimulator]
    return <div className="app-shell"><header className="topbar"><button className="brand" onClick={() => setActiveSimulator(null)}>{brand}</button><span className="status-pill"><span className="status-dot" />Practice mode</span></header><main className="simulator-page"><button className="back-button" onClick={() => setActiveSimulator(null)}>← Learning hub</button><section className="simulator-intro"><span className="eyebrow">{simulator.label}</span><div className="simulator-icon">{simulator.icon}</div><h1>{simulator.title}</h1><p>{simulator.description}</p><span className="chat-compat-note">The chat is supplied by Copilot Studio and scrolls inside this responsive frame.</span></section><section className="simulator-frame"><iframe title={simulator.title} src={simulator.url} allow="microphone; clipboard-read; clipboard-write" /></section></main></div>
  }
  if (activeGame) {
    const Game = activeGame === 'typing' ? TypingSprint : activeGame === 'arcade' ? SkillArcade : ReplyRemix
    return <div className="app-shell"><header className="topbar"><button className="brand" onClick={() => setActiveGame(null)}>{brand}</button><span className="status-pill"><span className="status-dot" />Quick play</span></header><main><Game onBack={() => setActiveGame(null)} /></main></div>
  }

  const simulatorsList = [
    { id: 'customer', icon: '💬', tag: 'Talk it out', title: 'Customer Conversation Lab', text: 'Practice listening, empathy, and clear next steps in a realistic chat.' },
    { id: 'quiz', icon: '⚡', tag: 'Ask & learn', title: 'Knowledge Sprint', text: 'Explore consumer Microsoft products with your Copilot Studio quiz.' },
  ]
  const games = [
    { id: 'typing', icon: '⌨️', tag: '30-second game', title: 'Typing Sprint', text: 'Race the clock, build accuracy, and see your words per minute.' },
    { id: 'arcade', icon: '🎮', tag: '4 mini games', title: 'MLTS Skill Arcade', text: 'Myth or Fact, Shortcut Showdown, Settings Sprint, and Error Code Detective.' },
    { id: 'reply', icon: '💌', tag: 'Customer care', title: 'Reply Remix', text: 'Pick a helpful, human response to a customer situation.' },
  ]

  return <div className="app-shell"><Header nav /><main id="home"><section className="hero" onMouseEnter={() => setSpotlightPaused(true)} onMouseLeave={() => setSpotlightPaused(false)} onFocusCapture={() => setSpotlightPaused(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setSpotlightPaused(false) }}><div className="hero-copy" key={spotlightIndex}><span className="eyebrow light">{spotlight.eyebrow}</span><h1>{spotlight.title}</h1><p>{spotlight.text}</p><div className="hero-actions"><button className="button-primary" onClick={spotlight.action}>{spotlight.label} <span aria-hidden="true">→</span></button><span className="tiny-note">MLTS Consumer Simulator · Practice at your pace</span></div></div><div className="hero-sticker"><span className="sticker-spark">✦</span><strong>Explore the hub</strong><div><span>01</span> Practice</div><div><span>02</span> Play</div><div><span>03</span> Stay current</div><div className="spotlight-dots"><span>{spotlightIndex + 1} / {spotlights.length}</span>{spotlights.map((item, index) => <button key={item.title} aria-label={`Show ${item.title}`} aria-current={spotlightIndex === index ? 'true' : undefined} onClick={() => setSpotlightIndex(index)} />)}</div></div></section>
    <section className="games-section" id="activities"><div className="section-heading"><div><span className="eyebrow">Tiny games, real skills</span><h2>Quick play</h2></div><p>Build speed, confidence, and good support instincts in short rounds.</p></div><div className="game-grid">{games.map((item) => <article className="game-card" key={item.id}><div className="game-card-top"><span className="game-icon">{item.icon}</span><span className="card-tag">{item.tag}</span></div><h3>{item.title}</h3><p>{item.text}</p><button className="game-launch" onClick={() => setActiveGame(item.id)}>Play now <span aria-hidden="true">↗</span></button></article>)}</div></section>
    <section className="learning-section" id="simulators"><div className="section-heading"><div><span className="eyebrow">MLTS Consumer Simulator</span><h2>Practice with people skills</h2></div><p>Realistic conversations and product knowledge, at your pace.</p></div><div className="module-grid">{simulatorsList.map((item, index) => <article className={`module-card module-${index + 1}`} key={item.id}><div className="card-top"><span className="module-icon">{item.icon}</span><span className="card-tag">{item.tag}</span></div><h3>{item.title}</h3><p>{item.text}</p><button onClick={() => setActiveSimulator(item.id)}>{item.id === 'customer' ? 'Start conversation' : 'Start knowledge sprint'} <span aria-hidden="true">→</span></button></article>)}</div></section>
    <MicrosoftPulse />
    <FeedbackSection open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    <footer><div><strong>MLTS Consumer Simulator</strong><span>Microsoft learning, made practical.</span></div><span>Practice at your pace.</span></footer>
  </main><button className="feedback-bubble" aria-label="Open feedback" onClick={() => setFeedbackOpen(true)}><span aria-hidden="true">✎</span><span>Feedback</span></button></div>
}

export default App
