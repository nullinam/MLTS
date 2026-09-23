import { useEffect, useState } from 'react'

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
    description: 'Build confidence across Microsoft products with a quick knowledge check.',
    icon: '⚡',
    url: 'https://copilotstudio.microsoft.com/environments/Default-b4c546a4-7dac-46a6-a7dd-ed822a11efd3/bots/crbac_betaquiz_2nN7-S/webchat?__version__=2&enableFileAttachment=false&cliAgent=true',
  },
}

const replyChallenge = {
  prompt: 'A customer says: “I’ve tried twice and I’m still locked out. I need this fixed today.” Pick the best opening reply.',
  options: [
    '“That sounds frustrating, especially with a deadline. I’ll help you check the sign-in issue step by step.”',
    '“You probably entered the wrong password. Try again.”',
    '“Please read the help page before contacting support.”',
  ],
  answer: 0,
}

const typingText = 'Clear support starts with listening carefully, checking the details, and explaining the next step in simple language.'

function MicrosoftMark() {
  return <span className="microsoft-mark" aria-hidden="true"><i /><i /><i /><i /></span>
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

  function reset() {
    setStarted(false)
    setFinished(false)
    setSeconds(30)
    setTyped('')
  }

  return (
    <div className="game-page">
      <button className="back-button" onClick={onBack}>← All activities</button>
      <div className="game-heading"><span className="eyebrow">Mini game · 30 seconds</span><h1>Typing Sprint</h1><p>Type the sentence accurately. Your speed and accuracy update as you go.</p></div>
      <section className="game-panel typing-panel">
        <div className="typing-stats"><div><span>Time</span><strong>{seconds}s</strong></div><div><span>Speed</span><strong>{wpm} WPM</strong></div><div><span>Accuracy</span><strong>{accuracy}%</strong></div></div>
        <p className="typing-copy">{[...typingText].map((char, index) => <span key={index} className={index < typed.length ? (typed[index] === char ? 'correct-char' : 'wrong-char') : ''}>{char}</span>)}</p>
        <textarea aria-label="Typing practice" value={typed} onChange={(event) => setTyped(event.target.value.slice(0, typingText.length))} disabled={!started || finished} placeholder={started ? 'Start typing here…' : 'Press Start when you’re ready'} />
        <div className="game-actions"><button className="button-primary" onClick={started && !finished ? () => setFinished(true) : () => setStarted(true)} disabled={started && !finished}>{finished ? 'Sprint complete' : started ? 'Typing…' : 'Start sprint'}</button><button className="button-quiet" onClick={reset}>Try again</button></div>
        {finished && <p className="result-note" role="status">Nice run: {wpm} WPM with {accuracy}% accuracy.</p>}
      </section>
    </div>
  )
}

function QuickChallenge({ onBack }) {
  const [choice, setChoice] = useState(null)
  const [round, setRound] = useState(1)
  const [score, setScore] = useState(0)
  const complete = choice !== null

  function selectOption(optionIndex) {
    if (complete) return
    setChoice(optionIndex)
    if (optionIndex === replyChallenge.answer) setScore((value) => value + 1)
  }

  function nextRound() {
    setRound((value) => value + 1)
    setChoice(null)
  }

  return (
    <div className="game-page">
      <button className="back-button" onClick={onBack}>← All activities</button>
      <div className="game-heading"><span className="eyebrow">Mini game · Customer care</span><h1>Reply Remix</h1><p>Choose a response that makes the customer feel heard and gives them a clear next step.</p></div>
      <section className="game-panel challenge-panel">
        <div className="challenge-meta"><span>Round {round}</span><span>Good replies {score}</span></div>
        <h2>{replyChallenge.prompt}</h2>
        <div className="answer-options">{replyChallenge.options.map((option, optionIndex) => <button key={option} className={complete && optionIndex === replyChallenge.answer ? 'correct' : (choice === optionIndex ? 'incorrect' : '')} onClick={() => selectOption(optionIndex)} disabled={complete}><span className="option-letter">{String.fromCharCode(65 + optionIndex)}</span>{option}</button>)}</div>
        {complete && <div className={`answer-feedback ${choice === replyChallenge.answer ? 'good' : 'try-again'}`} role="status"><strong>{choice === replyChallenge.answer ? 'That lands well!' : 'Try a more supportive opener.'}</strong><span>{choice === replyChallenge.answer ? 'Empathy plus a clear next step makes a strong opening.' : 'Acknowledge the frustration, then offer a clear next step.'}</span></div>}
        <button className="button-primary next-button" onClick={nextRound} disabled={!complete}>Next round <span aria-hidden="true">→</span></button>
      </section>
    </div>
  )
}

const triageRounds = [
  { prompt: 'Two support requests arrive at once. Which should you pick up first?', choices: ['A customer is locked out and cannot access their Microsoft account', 'A customer wants to change the color of an app theme', 'A customer asks where to find a product tip'], answer: 0, why: 'Being locked out blocks access, so start there and assess the account recovery path.' },
  { prompt: 'Which request needs the fastest first response?', choices: ['A customer asks for a feature recommendation next week', 'A customer reports a suspicious sign-in alert on their account', 'A customer wants help organizing their desktop'], answer: 1, why: 'A possible account security issue should be acknowledged and routed promptly.' },
  { prompt: 'A customer has a deadline in ten minutes. What should you do first?', choices: ['Ask what they need to finish and identify the blocker', 'Send a long list of unrelated tips', 'Ask them to check back tomorrow'], answer: 0, why: 'Clarify the immediate blocker so you can focus on the quickest useful next step.' },
]

function TriageDash({ onBack }) {
  const [round, setRound] = useState(0)
  const [choice, setChoice] = useState(null)
  const [score, setScore] = useState(0)
  const finished = round >= triageRounds.length
  const item = triageRounds[Math.min(round, triageRounds.length - 1)]

  function choose(index) {
    if (choice !== null || finished) return
    setChoice(index)
    if (index === item.answer) setScore((value) => value + 1)
  }

  function advance() {
    setRound((value) => value + 1)
    setChoice(null)
  }

  function restart() { setRound(0); setChoice(null); setScore(0) }

  return <div className="game-page"><button className="back-button" onClick={onBack}>← All activities</button><div className="game-heading"><span className="eyebrow">Mini game · 3 quick rounds</span><h1>Ticket Triage Dash</h1><p>Pick what to handle first, then see why that choice helps the customer.</p></div><section className="game-panel challenge-panel"><div className="challenge-meta"><span>{finished ? 'Run complete' : `Round ${round + 1} of ${triageRounds.length}`}</span><span>Score {score}/{triageRounds.length}</span></div>{finished ? <><h2>Dash complete!</h2><p className="triage-result">You prioritized {score} of {triageRounds.length} situations well.</p><button className="button-primary" onClick={restart}>Play again <span aria-hidden="true">↻</span></button></> : <><h2>{item.prompt}</h2><div className="answer-options">{item.choices.map((text, index) => <button key={text} className={choice !== null && index === item.answer ? 'correct' : (choice === index ? 'incorrect' : '')} onClick={() => choose(index)} disabled={choice !== null}><span className="option-letter">{String.fromCharCode(65 + index)}</span>{text}</button>)}</div>{choice !== null && <div className={`answer-feedback ${choice === item.answer ? 'good' : 'try-again'}`} role="status"><strong>{choice === item.answer ? 'Great call!' : 'Here’s the priority.'}</strong><span>{item.why}</span></div>}<button className="button-primary next-button" onClick={advance} disabled={choice === null}>Next ticket <span aria-hidden="true">→</span></button></>}</section></div>
}

function MicrosoftPulse() {
  const [updates, setUpdates] = useState([])
  const [status, setStatus] = useState('loading')
  const [updatedAt, setUpdatedAt] = useState(null)
  const [sources, setSources] = useState([])
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')

  async function loadUpdates() {
    setStatus('loading')
    try {
      const response = await fetch('/api/microsoft-pulse')
      if (!response.ok) throw new Error('Feed request failed')
      const payload = await response.json()
      setUpdates(Array.isArray(payload.updates) ? payload.updates : [])
      setUpdatedAt(payload.checkedAt || null)
      setSources(Array.isArray(payload.sources) ? payload.sources : [])
      setStatus(payload.updates?.length ? 'ready' : 'empty')
    } catch {
      setStatus('error')
    }
  }

  useEffect(() => { loadUpdates() }, [])

  const categories = ['All', ...new Set(updates.map((item) => item.category).filter(Boolean))]
  const visibleUpdates = updates.filter((item) => {
    const matchesCategory = filter === 'All' || item.category === filter
    const haystack = `${item.title} ${item.summary} ${item.source} ${item.category}`.toLowerCase()
    return matchesCategory && haystack.includes(search.toLowerCase())
  })
  const checkedLabel = updatedAt ? new Date(updatedAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : ''

  return <section className="pulse-section" id="pulse"><div className="pulse-heading"><div><span className="eyebrow">Official Microsoft updates</span><h2><span className="pulse-mark">●</span> Microsoft Pulse</h2><p>Product news with the source attached. No rumors, reposts, or anonymous tips.</p></div><div className="pulse-live"><span className={status === 'ready' ? 'live-dot' : 'live-dot checking'} />{status === 'ready' ? `Official sources ${sources.filter((source) => source.ok).length}/${sources.length}` : 'Checking official feeds'}</div></div><div className="pulse-toolbar"><div className="pulse-filters">{categories.map((category) => <button key={category} className={filter === category ? 'active' : ''} onClick={() => setFilter(category)}>{category}</button>)}</div><label className="pulse-search"><span aria-hidden="true">⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search updates" aria-label="Search Microsoft updates" /></label></div>
    {status === 'loading' && <div className="pulse-message" role="status">Checking Microsoft’s public update feeds…</div>}
    {status === 'error' && <div className="pulse-message" role="status"><strong>Couldn’t load the live feeds.</strong><span>Try again in a moment, or browse the official source pages below.</span><button className="button-quiet" onClick={loadUpdates}>Try again</button></div>}
    {status === 'empty' && <div className="pulse-message">No updates were returned by the official feeds just now. Check the source pages below.</div>}
    {status === 'ready' && visibleUpdates.length === 0 && <div className="pulse-message">No matching updates. Try another topic or search.</div>}
    {status === 'ready' && visibleUpdates.length > 0 && <div className="pulse-grid">{visibleUpdates.slice(0, 9).map((item) => <article className="pulse-card" key={item.url}><div className="pulse-card-meta"><span className="pulse-category">{item.category}</span><time dateTime={item.date}>{new Date(item.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}</time></div><h3>{item.title}</h3><p>{item.summary || 'Open the official Microsoft update for details.'}</p><div className="pulse-source"><span>Official source · {item.source}</span><a href={item.url} target="_blank" rel="noreferrer">Read at Microsoft <span aria-hidden="true">↗</span></a></div></article>)}</div>}
    <div className="pulse-footer"><span>{checkedLabel ? `Feeds checked ${checkedLabel}` : 'Stories link directly to Microsoft-published pages.'} · Results are limited to connected public Microsoft feeds; refreshed periodically.</span><button className="button-quiet" onClick={loadUpdates}>Refresh updates</button></div><div className="pulse-sources"><strong>Sources we use</strong><a href="https://www.microsoft.com/en-us/microsoft-365/blog/" target="_blank" rel="noreferrer">Microsoft 365 Blog</a><a href="https://blogs.windows.com/" target="_blank" rel="noreferrer">Windows Blog</a><a href="https://www.microsoft.com/en-us/security/blog/" target="_blank" rel="noreferrer">Microsoft Security Blog</a></div></section>
}

function App() {
  const [activeSimulator, setActiveSimulator] = useState(null)
  const [activeGame, setActiveGame] = useState(null)

  if (activeSimulator) {
    const simulator = simulators[activeSimulator]
    return <div className="app-shell"><header className="topbar"><button className="brand" onClick={() => setActiveSimulator(null)}><MicrosoftMark /><span><strong>MLTS</strong><small>Learn by doing</small></span></button><span className="status-pill"><span className="status-dot" />Practice mode</span></header><main className="simulator-page"><button className="back-button" onClick={() => setActiveSimulator(null)}>← Learning hub</button><section className="simulator-intro"><span className="eyebrow">{simulator.label}</span><div className="simulator-icon">{simulator.icon}</div><h1>{simulator.title}</h1><p>{simulator.description}</p></section><section className="simulator-frame"><iframe title={simulator.title} src={simulator.url} /></section></main></div>
  }

  if (activeGame === 'typing') return <div className="app-shell"><header className="topbar"><button className="brand" onClick={() => setActiveGame(null)}><MicrosoftMark /><span><strong>MLTS</strong><small>Learn by doing</small></span></button><span className="status-pill"><span className="status-dot" />Quick play</span></header><main><TypingSprint onBack={() => setActiveGame(null)} /></main></div>
  if (activeGame === 'reply') return <div className="app-shell"><header className="topbar"><button className="brand" onClick={() => setActiveGame(null)}><MicrosoftMark /><span><strong>MLTS</strong><small>Learn by doing</small></span></button><span className="status-pill"><span className="status-dot" />Quick play</span></header><main><QuickChallenge onBack={() => setActiveGame(null)} /></main></div>
  if (activeGame === 'triage') return <div className="app-shell"><header className="topbar"><button className="brand" onClick={() => setActiveGame(null)}><MicrosoftMark /><span><strong>MLTS</strong><small>Learn by doing</small></span></button><span className="status-pill"><span className="status-dot" />Quick play</span></header><main><TriageDash onBack={() => setActiveGame(null)} /></main></div>

  const gameCards = [
    { id: 'typing', icon: '⌨️', tag: '30-second game', title: 'Typing Sprint', text: 'Race the clock, build accuracy, and see your words per minute.' },
    { id: 'triage', icon: '🚦', tag: '3 quick rounds', title: 'Ticket Triage Dash', text: 'Sort support situations by urgency and choose the best first move.' },
    { id: 'reply', icon: '💌', tag: 'Customer care', title: 'Reply Remix', text: 'Pick the most helpful, human response to a customer situation.' },
  ]
  const tracks = [
    { id: 'customer', icon: '💬', tag: 'Talk it out', title: 'Customer Conversation Lab', text: 'Practice listening, empathy, and clear next steps in a realistic chat.' },
    { id: 'quiz', icon: '⚡', tag: 'Ask & learn', title: 'Knowledge Sprint', text: 'Explore consumer Microsoft products with your Copilot Studio quiz.' },
  ]

  return <div className="app-shell"><header className="topbar"><a className="brand" href="#home"><MicrosoftMark /><span><strong>MLTS</strong><small>Microsoft learning, made practical</small></span></a><a className="topbar-note" href="#pulse">Pulse <span aria-hidden="true">↘</span></a></header><main id="home">
    <section className="hero"><div className="hero-copy"><span className="eyebrow light">Your support skills arcade</span><h1>Learn the products.<br /><span>Win the conversation.</span></h1><p>Quick games and realistic practice for the Microsoft products customers use every day.</p><div className="hero-actions"><button className="button-primary" onClick={() => setActiveGame('typing')}>Play a quick game <span aria-hidden="true">→</span></button><span className="tiny-note">Short rounds · useful skills · zero pressure</span></div></div><div className="hero-sticker" aria-label="Three ways to practice"><span className="sticker-spark">✦</span><strong>Pick your<br />power-up</strong><div><span>01</span> Practice</div><div><span>02</span> Play</div><div><span>03</span> Progress</div></div></section>
    <section className="learning-section"><div className="section-heading"><div><span className="eyebrow">Choose your mode</span><h2>Practice with people skills</h2></div><p>Realistic conversations, no awkward role-play required.</p></div><div className="module-grid">{tracks.map((item, index) => <article className={`module-card module-${index + 1}`} key={item.id}><div className="card-top"><span className="module-icon">{item.icon}</span><span className="card-tag">{item.tag}</span></div><h3>{item.title}</h3><p>{item.text}</p><button onClick={() => setActiveSimulator(item.id)}>{item.id === 'customer' ? 'Start conversation' : 'Start knowledge sprint'} <span aria-hidden="true">→</span></button></article>)}</div></section>
    <section className="games-section"><div className="section-heading"><div><span className="eyebrow">Tiny games, real skills</span><h2>Quick play</h2></div><p>Build speed, empathy, and good support instincts in short rounds.</p></div><div className="game-grid">{gameCards.map((item) => <article className="game-card" key={item.id}><div className="game-card-top"><span className="game-icon">{item.icon}</span><span className="card-tag">{item.tag}</span></div><h3>{item.title}</h3><p>{item.text}</p><button className="game-launch" onClick={() => setActiveGame(item.id)}>Play now <span aria-hidden="true">↗</span></button></article>)}</div></section>
    <MicrosoftPulse />
    <footer><div><strong>MLTS</strong><span>Microsoft learning, made practical.</span></div><span>Practice at your pace.</span></footer>
  </main></div>
}

export default App
