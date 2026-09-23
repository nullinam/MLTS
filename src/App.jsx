import { useEffect, useMemo, useState } from 'react'

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

const topics = ['All', 'Microsoft 365', 'Windows', 'Copilot', 'Surface', 'Xbox']

const questions = [
  {
    topic: 'Microsoft 365',
    prompt: 'A customer wants to edit a document with a teammate at the same time. What should you suggest?',
    options: ['Share the document for collaboration', 'Take a screenshot and send it', 'Create a second copy'],
    answer: 0,
    feedback: 'Sharing the document lets people work together on the same file.',
  },
  {
    topic: 'Windows',
    prompt: 'A customer needs help finding a setting on their PC. What is a useful first step?',
    options: ['Ask what they see and search Settings', 'Ask them to reinstall Windows', 'Change several settings at once'],
    answer: 0,
    feedback: 'Start with what they see, then guide them to the relevant Settings page.',
  },
  {
    topic: 'Copilot',
    prompt: 'A customer says an AI answer seems wrong. What is the best support response?',
    options: ['Ask them to verify important details', 'Tell them every answer is guaranteed', 'Ignore the concern'],
    answer: 0,
    feedback: 'Encourage checking important details and clarify what the answer needs to do.',
  },
  {
    topic: 'Surface',
    prompt: 'A customer reports a device issue. What should you learn before suggesting a fix?',
    options: ['Their device model and what happened', 'Their favorite color', 'Whether they can buy a new device'],
    answer: 0,
    feedback: 'The model and symptoms help narrow down relevant troubleshooting steps.',
  },
  {
    topic: 'Xbox',
    prompt: 'A player cannot join a multiplayer game. What is a helpful first question?',
    options: ['What error message do they see?', 'How long have they owned a TV?', 'Can they delete all their games?'],
    answer: 0,
    feedback: 'The exact error and when it happens help identify the right next step.',
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

function QuickChallenge({ mode, onBack }) {
  const isReply = mode === 'reply'
  const [topic, setTopic] = useState('All')
  const [index, setIndex] = useState(0)
  const [choice, setChoice] = useState(null)
  const [score, setScore] = useState(0)
  const pool = useMemo(() => isReply ? [replyChallenge] : questions.filter((question) => topic === 'All' || question.topic === topic), [isReply, topic])
  const question = pool[index % pool.length]
  const complete = choice !== null

  function selectOption(optionIndex) {
    if (complete) return
    setChoice(optionIndex)
    if (optionIndex === question.answer) setScore((value) => value + 1)
  }

  function nextQuestion() {
    setIndex((value) => value + 1)
    setChoice(null)
  }

  function changeTopic(nextTopic) {
    setTopic(nextTopic)
    setIndex(0)
    setChoice(null)
  }

  return (
    <div className="game-page">
      <button className="back-button" onClick={onBack}>← All activities</button>
      <div className="game-heading"><span className="eyebrow">Mini game · {isReply ? 'Customer care' : 'Product smarts'}</span><h1>{isReply ? 'Reply Remix' : 'Product Pop Quiz'}</h1><p>{isReply ? 'Choose a response that makes the customer feel heard and gives them a clear next step.' : 'Short customer support scenarios across the products people use every day.'}</p></div>
      {!isReply && <div className="topic-filters" aria-label="Filter questions by product">{topics.map((item) => <button key={item} className={topic === item ? 'active' : ''} onClick={() => changeTopic(item)}>{item}</button>)}</div>}
      <section className="game-panel challenge-panel">
        <div className="challenge-meta"><span>{isReply ? 'One-minute practice' : question.topic}</span><span>Score {score}</span></div>
        <h2>{question.prompt}</h2>
        <div className="answer-options">{question.options.map((option, optionIndex) => <button key={option} className={choice === optionIndex ? (optionIndex === question.answer ? 'chosen correct' : 'chosen incorrect') : (complete && optionIndex === question.answer ? 'correct' : '')} onClick={() => selectOption(optionIndex)} disabled={complete}><span className="option-letter">{String.fromCharCode(65 + optionIndex)}</span>{option}</button>)}</div>
        {complete && <div className={`answer-feedback ${choice === question.answer ? 'good' : 'try-again'}`} role="status"><strong>{choice === question.answer ? 'You got it!' : 'Good try!'}</strong><span>{isReply ? (choice === question.answer ? 'Empathy plus a clear next step makes a strong opening.' : 'Acknowledge the frustration, then offer a clear next step.') : question.feedback}</span></div>}
        <button className="button-primary next-button" onClick={nextQuestion} disabled={!complete}>{isReply ? 'Play again' : 'Next question'} <span aria-hidden="true">→</span></button>
      </section>
    </div>
  )
}

function App() {
  const [activeSimulator, setActiveSimulator] = useState(null)
  const [activeGame, setActiveGame] = useState(null)

  if (activeSimulator) {
    const simulator = simulators[activeSimulator]
    return <div className="app-shell"><header className="topbar"><button className="brand" onClick={() => setActiveSimulator(null)}><MicrosoftMark /><span><strong>MLTS</strong><small>Learn by doing</small></span></button><span className="status-pill"><span className="status-dot" />Practice mode</span></header><main className="simulator-page"><button className="back-button" onClick={() => setActiveSimulator(null)}>← Learning hub</button><section className="simulator-intro"><span className="eyebrow">{simulator.label}</span><div className="simulator-icon">{simulator.icon}</div><h1>{simulator.title}</h1><p>{simulator.description}</p></section><section className="simulator-frame"><iframe title={simulator.title} src={simulator.url} /></section></main></div>
  }

  if (activeGame === 'typing') return <div className="app-shell"><header className="topbar"><button className="brand" onClick={() => setActiveGame(null)}><MicrosoftMark /><span><strong>MLTS</strong><small>Learn by doing</small></span></button><span className="status-pill"><span className="status-dot" />Quick play</span></header><main><TypingSprint onBack={() => setActiveGame(null)} /></main></div>
  if (activeGame) return <div className="app-shell"><header className="topbar"><button className="brand" onClick={() => setActiveGame(null)}><MicrosoftMark /><span><strong>MLTS</strong><small>Learn by doing</small></span></button><span className="status-pill"><span className="status-dot" />Quick play</span></header><main><QuickChallenge mode={activeGame} onBack={() => setActiveGame(null)} /></main></div>

  const gameCards = [
    { id: 'typing', icon: '⌨️', tag: '30-second game', title: 'Typing Sprint', text: 'Race the clock, build accuracy, and see your words per minute.' },
    { id: 'product', icon: '🧠', tag: 'Product knowledge', title: 'Product Pop Quiz', text: 'Quick support scenarios for Microsoft 365, Windows, Copilot, Surface, and Xbox.' },
    { id: 'reply', icon: '💌', tag: 'Customer care', title: 'Reply Remix', text: 'Pick the most helpful, human response to a customer situation.' },
  ]
  const tracks = [
    { id: 'customer', icon: '💬', tag: 'Talk it out', title: 'Customer Conversation Lab', text: 'Practice listening, empathy, and clear next steps in a realistic chat.' },
    { id: 'quiz', icon: '⚡', tag: 'Ask & learn', title: 'Knowledge Sprint', text: 'Explore consumer Microsoft products with your Copilot Studio quiz.' },
  ]

  return <div className="app-shell"><header className="topbar"><a className="brand" href="#home"><MicrosoftMark /><span><strong>MLTS</strong><small>Microsoft learning, made practical</small></span></a><span className="topbar-note">Pick a path. Play a round. Level up.</span></header><main id="home">
    <section className="hero"><div className="hero-copy"><span className="eyebrow light">Your support skills arcade</span><h1>Learn the products.<br /><span>Win the conversation.</span></h1><p>Quick games and realistic practice for the Microsoft products customers use every day.</p><div className="hero-actions"><button className="button-primary" onClick={() => setActiveGame('typing')}>Play a quick game <span aria-hidden="true">→</span></button><span className="tiny-note">Short rounds · useful skills · zero pressure</span></div></div><div className="hero-sticker" aria-label="Three ways to practice"><span className="sticker-spark">✦</span><strong>Pick your<br />power-up</strong><div><span>01</span> Practice</div><div><span>02</span> Play</div><div><span>03</span> Progress</div></div></section>
    <section className="learning-section"><div className="section-heading"><div><span className="eyebrow">Choose your mode</span><h2>Practice with people skills</h2></div><p>Realistic conversations, no awkward role-play required.</p></div><div className="module-grid">{tracks.map((item, index) => <article className={`module-card module-${index + 1}`} key={item.id}><div className="card-top"><span className="module-icon">{item.icon}</span><span className="card-tag">{item.tag}</span></div><h3>{item.title}</h3><p>{item.text}</p><button onClick={() => setActiveSimulator(item.id)}>{item.id === 'customer' ? 'Start conversation' : 'Start knowledge sprint'} <span aria-hidden="true">→</span></button></article>)}</div></section>
    <section className="games-section"><div className="section-heading"><div><span className="eyebrow">Tiny games, real skills</span><h2>Quick play</h2></div><p>Jump into a 30-second challenge or a few fast questions.</p></div><p className="topic-note">Product quiz topics: Microsoft 365 · Windows · Copilot · Surface · Xbox</p><div className="game-grid">{gameCards.map((item) => <article className="game-card" key={item.id}><div className="game-card-top"><span className="game-icon">{item.icon}</span><span className="card-tag">{item.tag}</span></div><h3>{item.title}</h3><p>{item.text}</p><button className="game-launch" onClick={() => setActiveGame(item.id)}>Play now <span aria-hidden="true">↗</span></button></article>)}</div></section>
    <footer><div><strong>MLTS</strong><span>Microsoft learning, made practical.</span></div><span>Practice at your pace.</span></footer>
  </main></div>
}

export default App
