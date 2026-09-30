import { useEffect, useRef, useState } from 'react'

const simulators = {
  customer: {
    title: 'Customer Chat Simulator',
    label: 'Talk it out',
    description: 'Practice calm, clear support conversations with a customer simulator.',
    icon: '💬',
    url: 'https://copilotstudio.microsoft.com/environments/Default-b4c546a4-7dac-46a6-a7dd-ed822a11efd3/bots/crbac_test0_Nex4PA/webchat?__version__=2&enableFileAttachment=false&cliAgent=true',
  },
  quiz: {
    title: 'Quiz Gauntlet',
    label: 'Quick challenge',
    description: 'Build confidence across consumer Microsoft products with your quiz simulator.',
    icon: '⚡',
    url: 'https://copilotstudio.microsoft.com/environments/Default-b4c546a4-7dac-46a6-a7dd-ed822a11efd3/bots/crbac_betaquiz_2nN7-S/webchat?__version__=2&enableFileAttachment=false&cliAgent=true',
  },
}

const typingPrompts = [
  'Clear support starts with listening carefully, checking the details, and explaining the next step in simple language.',
  'Let’s confirm the exact error and when it appears before we choose the next step.',
  'A helpful answer is calm, specific, and easy for the customer to follow.',
  'We can check the account settings together and make one change at a time.',
]

function buildTypingPassage() {
  return shuffle([...typingPrompts, ...typingPrompts, ...typingPrompts, ...typingPrompts, ...typingPrompts, ...typingPrompts, ...typingPrompts, ...typingPrompts, ...typingPrompts, ...typingPrompts, ...typingPrompts, ...typingPrompts]).join(' ')
}

function pickRandom(items, exclude = null) {
  const available = items.filter((item) => item !== exclude)
  return available[Math.floor(Math.random() * available.length)]
}

function shuffle(items) {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[swap]] = [result[swap], result[index]]
  }
  return result
}

function makeRound(mode, previousPrompt = null) {
  const available = mode.rounds.filter((round) => round.prompt !== previousPrompt)
  const source = pickRandom(available.length ? available : mode.rounds)
  const answerText = source.options[source.answer]
  const options = shuffle(source.options)
  return { ...source, options, answer: options.indexOf(answerText) }
}

const replyChallenges = [
  { prompt: '“I’ve tried twice and I’m still locked out. I need this fixed today.” Pick the best opening reply.', options: ['“That sounds frustrating, especially with a deadline. I’ll help check this step by step.”', '“You probably entered the wrong password. Try again.”', '“Please read the help page before contacting support.”'], answer: 0, feedback: 'Empathy plus a clear next step makes a strong opening.' },
  { prompt: '“My photos are not syncing and I’m worried they’re gone.” Pick the best opening reply.', options: ['“I can see why that’s worrying. Let’s check sync status and whether the photos are still on the device.”', '“They are probably deleted.”', '“Turn everything off and try tomorrow.”'], answer: 0, feedback: 'Acknowledge the concern, then verify the current state before suggesting changes.' },
  { prompt: '“The update changed my settings and now I can’t find anything.” Pick the best opening reply.', options: ['“That’s disruptive. Which setting are you looking for? I’ll help you locate it.”', '“Updates always do that.”', '“You should have backed up your settings.”'], answer: 0, feedback: 'Keep the reply focused on their goal and offer a practical next step.' },
]
const replyScenarios = [
  ['“I cannot get into my account before my meeting.”', 'I can see the timing matters. Let’s check what happens when you sign in and what recovery options are available.'],
  ['“My files disappeared from OneDrive.”', 'That’s concerning. Let’s check the account, sync status, and Recycle Bin before changing anything.'],
  ['“The update changed how my laptop looks.”', 'That can be disorienting. What looks different? We can check the relevant display or personalization setting together.'],
  ['“I paid for Microsoft 365 but the app says I do not have a license.”', 'I understand why that is frustrating. Let’s confirm which account is signed in and what subscription it shows.'],
  ['“My Bluetooth headphones will not connect.”', 'Let’s check whether the headphones are in pairing mode and whether Windows can see them in Bluetooth settings.'],
  ['“I lost my photos after changing phones.”', 'I know those photos matter. Let’s check the account and backup or sync locations before assuming they are gone.'],
  ['“My screen is zoomed in and I cannot fix it.”', 'That makes it hard to use the device. I’ll help check display scaling and magnification one step at a time.'],
  ['“The printer worked yesterday and now it is offline.”', 'Let’s verify the printer connection and queue first, then check whether anything changed since yesterday.'],
  ['“I keep getting pop-ups while I work.”', 'That sounds disruptive. Are they notifications from a specific app or browser? We can identify the source first.'],
  ['“I forgot where my downloaded file went.”', 'We can track it down. Do you remember which browser or app downloaded it? Then we can check its download location.'],
  ['“My subscription renewed and I did not expect it.”', 'I can help you review the subscription and renewal details. Which account did you use to purchase it?'],
  ['“I cannot hear anything in my meeting.”', 'Let’s check the selected output device and the meeting app’s audio settings together.'],
  ['“My webcam is black in Teams.”', 'Let’s check whether another app is using the camera, then review Teams device selection and camera permissions.'],
  ['“I am worried this email is a scam.”', 'Good call checking first. Please do not open links or attachments; we can review the sender and message safely.'],
  ['“The app is asking me for a code. Can I send it to you?”', 'Please keep that code private. I will never need it; let’s use the app’s official sign-in steps instead.'],
  ['“I tried everything and nothing works.”', 'That sounds exhausting. Tell me the last step you tried and what changed, and we’ll narrow it down from there.'],
  ['“My laptop is suddenly running slowly.”', 'Let’s narrow down when it started and whether one app or the whole device feels slow.'],
  ['“I cannot find the setting you told me about.”', 'Thanks for telling me. What page are you on now? I’ll give you the next step using the labels you can see.'],
  ['“The instructions are too technical.”', 'I can make this simpler. I’ll give you one step at a time and explain what to look for.'],
  ['“I need this fixed right now.”', 'I hear the urgency. I’ll focus on the quickest safe checks first and keep you updated as we go.'],
  ['“I was charged twice.”', 'I understand why you want that checked. Let’s identify the account and the two transaction dates without sharing full payment details.'],
  ['“My document will not open.”', 'Let’s note the file type and exact message, then check whether it opens in the web version or another supported app.'],
  ['“I accidentally deleted a folder.”', 'Let’s check the Recycle Bin and the relevant cloud account before saving new files over it.'],
  ['“I cannot connect to Wi-Fi.”', 'Let’s see whether other devices connect and whether this device can see the network. That will help narrow the cause.'],
  ['“The error code makes no sense.”', 'We can work through it. What is the full code and message, and which app showed it?'],
  ['“I have already explained this to two people.”', 'I’m sorry you had to repeat yourself. I’ll summarize what I understand, then confirm only what is still missing.'],
  ['“Can you just reset everything?”', 'Before making a broad change, let’s identify the specific issue and try the least disruptive safe option first.'],
]
replyChallenges.push(...replyScenarios.map(([prompt, bestReply]) => ({
  prompt: `${prompt} Choose the strongest response.`,
  options: [bestReply, '“That is not my area. You will need to figure it out yourself.”', '“Just reset everything and see if it works.”'],
  answer: 0,
  feedback: 'A good support reply acknowledges the concern, protects the customer, and offers one clear next step.',
})))

function MicrosoftMark() {
  return <span className="microsoft-mark" aria-hidden="true"><i /><i /><i /><i /></span>
}

function Brand({ onHome = null }) {
  const content = <><MicrosoftMark /><span><strong>MLTS Consumer Simulator</strong><small>Microsoft learning, made practical</small></span></>
  return onHome ? <button className="brand" onClick={onHome}>{content}</button> : <a className="brand" href="#home">{content}</a>
}

function Header({ status = 'Ready', onHome = null, nav = false, theme = 'light', onToggleTheme }) {
  return <header className="topbar"><Brand onHome={onHome} />{!nav && <span className="status-pill"><span className="status-dot" />{status}</span>}<button className="theme-toggle" onClick={onToggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}><span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>{theme === 'dark' ? 'Light' : 'Dark'} mode</button></header>
}

function TypingSprint({ onBack }) {
  const [typingText, setTypingText] = useState(buildTypingPassage)
  const inputRef = useRef(null)
  const startedAtRef = useRef(0)
  const finishedAtRef = useRef(0)
  const [started, setStarted] = useState(false)
  const [duration, setDuration] = useState(60)
  const [seconds, setSeconds] = useState(60)
  const [typed, setTyped] = useState('')
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    if (!started || finished) return undefined
    const timer = window.setInterval(() => {
      setSeconds((value) => {
        if (value <= 1) {
          window.clearInterval(timer)
          finishedAtRef.current = Date.now()
          setFinished(true)
          return 0
        }
        return value - 1
      })
    }, 1000)
    return () => window.clearInterval(timer)
  }, [started, finished])
  useEffect(() => {
    if (started && !finished) inputRef.current?.focus()
  }, [started, finished])

  const correct = [...typed].filter((char, index) => char === typingText[index]).length
  const accuracy = typed.length ? Math.round((correct / typed.length) * 100) : 100
  const elapsed = startedAtRef.current ? Math.min(duration, Math.max(0, ((finishedAtRef.current || Date.now()) - startedAtRef.current) / 1000)) : 0
  const wpm = elapsed ? Math.round((correct / 5) / (elapsed / 60)) : 0
  const badge = accuracy >= 98 && wpm >= 80 ? 'Snow Leopard' : accuracy >= 96 && wpm >= 60 ? 'Falcon' : accuracy >= 92 && wpm >= 35 ? 'Red Panda' : accuracy >= 88 ? 'Koala' : 'First Flight'
  function beginTyping() { startedAtRef.current = Date.now(); finishedAtRef.current = 0; setStarted(true) }
  function reset(nextDuration = duration) { startedAtRef.current = 0; finishedAtRef.current = 0; setStarted(false); setFinished(false); setDuration(nextDuration); setSeconds(nextDuration); setTyped(''); setTypingText(buildTypingPassage()) }
  function updateTyped(value) {
    const next = value.slice(0, typingText.length)
    setTyped(next)
    if (next.length >= typingText.length) { finishedAtRef.current = Date.now(); setFinished(true) }
  }

  return <div className="activity-page"><button className="back-button" onClick={onBack}>← All activities</button><div className="page-heading"><span className="eyebrow">Typing lab · live word tracking</span><h1>Typing Master</h1><p>Type directly into the highlighted passage. Speed and accuracy update as you go.</p></div><section className="activity-panel typing-panel">
    <div className="typing-toolbar"><div className="typing-duration" aria-label="Test duration">{[60, 180, 300].map((time) => <button key={time} className={duration === time ? 'active' : ''} disabled={started} onClick={() => reset(time)}>{time / 60} min</button>)}</div><span className={`typing-clock ${seconds <= 10 && started ? 'urgent' : ''}`}>◷ {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}</span></div>
    <div className="typing-stats"><div><span>Speed</span><strong>{wpm} <small>WPM</small></strong></div><div><span>Accuracy</span><strong>{accuracy}<small>%</small></strong></div><div><span>Typed</span><strong>{typed.length}<small> chars</small></strong></div></div>
    <div className={`typing-stage ${started && !finished ? 'is-typing' : ''}`} onClick={() => started && inputRef.current?.focus()} role="group" aria-label="Typing passage; click here and type the highlighted text"><p className="typing-copy">{[...typingText].map((char, index) => { const state = index < typed.length ? (typed[index] === char ? 'correct-char' : 'wrong-char') : index === typed.length && started && !finished ? 'current-char' : ''; return <span key={index} className={state}>{char}</span> })}</p><textarea ref={inputRef} className="typing-capture" aria-label="Type the passage shown above" value={typed} onChange={(event) => updateTyped(event.target.value)} onPaste={(event) => event.preventDefault()} onKeyDown={(event) => { if (event.key === 'Tab') event.preventDefault() }} disabled={!started || finished} autoCapitalize="off" autoCorrect="off" spellCheck="false" />{!started && <button className="typing-start-overlay" onClick={beginTyping}>Start typing <span>↵</span></button>}</div>
    <div className="typing-actions"><span>{started && !finished ? 'Keep going — every character counts.' : 'Choose a test length, then start typing.'}</span><button className="button-secondary" onClick={() => reset(duration)}>↻ Restart</button></div>
    {finished && <div className="typing-result typing-finish" role="status"><strong>🏅 {badge} earned</strong><span>You typed <b>{wpm} WPM</b> with <b>{accuracy}% accuracy</b> in {Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, '0')}.</span></div>}
  </section></div>
}

function ReplyRemix({ onBack }) {
  const [choice, setChoice] = useState(null)
  const [round, setRound] = useState(1)
  const [score, setScore] = useState(0)
  const [challenge, setChallenge] = useState(() => makeRound({ rounds: replyChallenges }))
  function choose(index) { if (choice !== null) return; setChoice(index); if (index === challenge.answer) setScore((value) => value + 1) }
  function next() { setChallenge((current) => makeRound({ rounds: replyChallenges }, current.prompt)); setRound((value) => value + 1); setChoice(null) }
  return <div className="activity-page"><button className="back-button" onClick={onBack}>← All activities</button><div className="page-heading"><span className="eyebrow">Quick play · Customer care</span><h1>Reply Remix</h1><p>Choose a helpful reply. The scenario and answer order change each round.</p></div><section className="activity-panel challenge-panel"><div className="challenge-meta"><span>Round {round}</span><span>Good replies {score}</span></div><h2>{challenge.prompt}</h2><div className="answer-options">{challenge.options.map((option, index) => <button key={option} className={choice !== null && index === challenge.answer ? 'correct' : (choice === index ? 'incorrect' : '')} onClick={() => choose(index)} disabled={choice !== null}><span className="option-letter">{String.fromCharCode(65 + index)}</span>{option}</button>)}</div>{choice !== null && <div className={`answer-feedback ${choice === challenge.answer ? 'good' : 'try-again'}`} role="status"><strong>{choice === challenge.answer ? 'That lands well!' : 'Try a more supportive opener.'}</strong><span>{challenge.feedback}</span></div>}<button className="button-primary next-button" onClick={next}>Next round <span aria-hidden="true">→</span></button></section></div>
}

function SkyDropGame({ onBack }) {
  const canvasRef = useRef(null)
  const gameRef = useRef(null)
  const [status, setStatus] = useState('ready')
  const [score, setScore] = useState(0)

  function startGame() {
    const startX = 480
    gameRef.current = {
      running: true, playerX: startX, score: 0, elapsed: 0, flash: 0, landingWait: 0,
      target: { x: 480, y: 430, width: 150, height: 16, checked: false },
      hazards: [{ x: 245, y: 300, radius: 25 }, { x: 760, y: 80, radius: 22 }],
      keys: new Set(), reason: '',
    }
    setScore(0)
    setStatus('running')
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return undefined
    const width = canvas.width
    const height = canvas.height
    const playerY = 158
    const playerHeight = 34
    const playerFeet = playerY + playerHeight
    let animationId
    let previousTime = 0

    const keyDown = (event) => {
      const key = event.key.toLowerCase()
      if (['arrowleft', 'arrowright', 'a', 'd'].includes(key) && gameRef.current?.running) event.preventDefault()
      gameRef.current?.keys.add(key)
    }
    const keyUp = (event) => gameRef.current?.keys.delete(event.key.toLowerCase())
    const clearKeys = () => gameRef.current?.keys.clear()

    function finish(reason) {
      const game = gameRef.current
      if (!game?.running) return
      game.running = false
      game.reason = reason
      setStatus('over')
    }

    function update(dt) {
      const game = gameRef.current
      if (!game?.running) return
      game.elapsed += dt
      game.flash = Math.max(0, game.flash - dt)
      const speed = 112 + game.score * 5 + 150 * (1 - Math.exp(-game.score / 12))
      const moveSpeed = 300 + Math.min(game.score * 5, 120)
      if (game.keys.has('arrowleft') || game.keys.has('a')) game.playerX -= moveSpeed * dt
      if (game.keys.has('arrowright') || game.keys.has('d')) game.playerX += moveSpeed * dt
      game.playerX = Math.max(44, Math.min(width - 44, game.playerX))

      game.hazards.forEach((hazard) => { hazard.y -= speed * dt * 0.9; hazard.x += Math.sin(game.elapsed * 1.7 + hazard.y) * 10 * dt })
      game.hazards = game.hazards.filter((hazard) => hazard.y > -70)
      if (game.hazards.some((hazard) => Math.abs(hazard.y - (playerY + 6)) < hazard.radius + 14 && Math.abs(hazard.x - game.playerX) < hazard.radius + 12)) {
        finish('A storm cloud clipped your parachute.')
        return
      }

      const target = game.target
      if (target && game.landingWait <= 0) {
        const previousY = target.y
        target.y -= speed * dt
        if (!target.checked && previousY >= playerFeet && target.y <= playerFeet) {
          target.checked = true
          if (Math.abs(game.playerX - target.x) <= target.width / 2 + 17) {
            game.score += 1
            setScore(game.score)
            game.flash = 0.45
            game.landingWait = 0.52
          } else {
            finish('You missed the landing platform.')
            return
          }
        }
        if (!target.checked && target.y + target.height < playerFeet) {
          finish('You missed the landing platform.')
          return
        }
      } else if (game.landingWait > 0) {
        game.landingWait -= dt
        if (game.landingWait <= 0) {
          const nextY = height + 75
          const nextX = 100 + Math.random() * (width - 200)
          game.target = { x: nextX, y: nextY, width: Math.max(102, 150 - game.score), height: 16, checked: false }
          game.hazards.push({ x: 70 + Math.random() * (width - 140), y: nextY - 128, radius: 20 + Math.random() * 9 })
          if (game.score % 4 === 0) game.hazards.push({ x: 80 + Math.random() * (width - 160), y: nextY - 265, radius: 18 })
        }
      }
    }

    function drawCloud(x, y, scale = 1, color = '#eaf7ff') {
      context.fillStyle = color
      context.beginPath(); context.ellipse(x, y, 28 * scale, 12 * scale, 0, 0, Math.PI * 2); context.ellipse(x - 15 * scale, y - 5 * scale, 15 * scale, 14 * scale, 0, 0, Math.PI * 2); context.ellipse(x + 3 * scale, y - 10 * scale, 17 * scale, 18 * scale, 0, 0, Math.PI * 2); context.ellipse(x + 19 * scale, y - 4 * scale, 14 * scale, 13 * scale, 0, 0, Math.PI * 2); context.fill()
    }

    function draw() {
      const game = gameRef.current
      const sky = context.createLinearGradient(0, 0, 0, height)
      sky.addColorStop(0, '#63c6ef'); sky.addColorStop(.6, '#b5e4f4'); sky.addColorStop(1, '#f4dfa5')
      context.fillStyle = sky; context.fillRect(0, 0, width, height)
      context.fillStyle = 'rgba(255,255,255,.3)'
      for (let i = 0; i < 9; i++) {
        const cloudY = ((i * 91 + (game?.elapsed || 0) * 16) % (height + 90)) - 35
        drawCloud((i * 137 + 47) % width, cloudY, .56 + (i % 3) * .14)
      }
      context.fillStyle = 'rgba(255,255,255,.32)'
      context.beginPath(); context.ellipse(width - 110, 120, 75, 75, 0, 0, Math.PI * 2); context.fill()

      if (game) {
        game.hazards.forEach((hazard) => {
          drawCloud(hazard.x, hazard.y, .95, '#63748b')
          context.strokeStyle = '#ffd35f'; context.lineWidth = 5; context.lineCap = 'round'
          context.beginPath(); context.moveTo(hazard.x + 2, hazard.y - 2); context.lineTo(hazard.x - 5, hazard.y + 9); context.lineTo(hazard.x + 2, hazard.y + 9); context.lineTo(hazard.x - 2, hazard.y + 19); context.stroke()
        })
        const target = game.target
        if (target) {
          context.fillStyle = 'rgba(48,75,54,.2)'; context.fillRect(target.x - target.width / 2, target.y + 7, target.width, 13)
          context.fillStyle = game.flash > 0 ? '#fff4b5' : '#38a76b'; context.fillRect(target.x - target.width / 2, target.y, target.width, target.height)
          context.fillStyle = '#baf77a'; context.fillRect(target.x - target.width / 2, target.y, target.width, 5)
          context.fillStyle = '#217a52'; context.fillRect(target.x - target.width / 2, target.y + target.height - 4, target.width, 8)
          for (let i = 0; i < 5; i++) { context.fillStyle = 'rgba(255,255,255,.55)'; context.fillRect(target.x - target.width / 2 + 12 + i * 27, target.y + 7, 12, 2) }
        }
        // Parachute canopy, suspension lines, and a compact skydiver sprite.
        const x = game.playerX
        const canopyY = playerY - 33
        context.strokeStyle = 'rgba(37,60,82,.7)'; context.lineWidth = 2
        context.beginPath(); context.moveTo(x - 26, canopyY + 3); context.lineTo(x - 8, playerY + 2); context.moveTo(x + 26, canopyY + 3); context.lineTo(x + 8, playerY + 2); context.stroke()
        context.fillStyle = '#ff754d'; context.beginPath(); context.moveTo(x - 38, canopyY + 4); context.quadraticCurveTo(x - 31, canopyY - 38, x, canopyY - 36); context.quadraticCurveTo(x + 31, canopyY - 38, x + 38, canopyY + 4); context.quadraticCurveTo(x, canopyY + 16, x - 38, canopyY + 4); context.fill()
        context.fillStyle = '#ffd166'; context.beginPath(); context.moveTo(x - 5, canopyY - 34); context.quadraticCurveTo(x + 20, canopyY - 32, x + 37, canopyY + 4); context.quadraticCurveTo(x + 12, canopyY + 11, x - 5, canopyY + 7); context.fill()
        context.strokeStyle = '#fff4df'; context.lineWidth = 1.5; context.beginPath(); context.moveTo(x - 22, canopyY + 7); context.lineTo(x - 5, playerY + 2); context.moveTo(x + 22, canopyY + 7); context.lineTo(x + 5, playerY + 2); context.stroke()
        context.fillStyle = '#f6ba86'; context.beginPath(); context.arc(x, playerY + 8, 8, 0, Math.PI * 2); context.fill()
        context.fillStyle = '#36587a'; context.fillRect(x - 9, playerY + 15, 18, 19)
        context.strokeStyle = '#243b55'; context.lineWidth = 4; context.beginPath(); context.moveTo(x - 5, playerY + 31); context.lineTo(x - 10, playerY + 40); context.moveTo(x + 5, playerY + 31); context.lineTo(x + 10, playerY + 40); context.stroke()
        context.fillStyle = '#fff'; context.font = '700 15px Inter, sans-serif'; context.fillText(`LANDINGS  ${game.score}`, 24, 34)
        context.fillStyle = '#31546d'; context.font = '600 12px Inter, sans-serif'; context.fillText(`DESCENT SPEED  ${Math.round(112 + game.score * 5 + 150 * (1 - Math.exp(-game.score / 12)))}`, 24, 54)
      }
    }

    function frame(now) {
      const dt = previousTime ? Math.min((now - previousTime) / 1000, 0.04) : 0
      previousTime = now
      update(dt)
      draw()
      animationId = window.requestAnimationFrame(frame)
    }
    window.addEventListener('keydown', keyDown)
    window.addEventListener('keyup', keyUp)
    window.addEventListener('blur', clearKeys)
    animationId = window.requestAnimationFrame(frame)
    return () => { window.cancelAnimationFrame(animationId); window.removeEventListener('keydown', keyDown); window.removeEventListener('keyup', keyUp); window.removeEventListener('blur', clearKeys) }
  }, [])

  function holdDirection(direction, pressed) {
    const keys = gameRef.current?.keys
    if (!keys) return
    const key = direction === 'left' ? 'arrowleft' : 'arrowright'
    if (pressed) keys.add(key)
    else keys.delete(key)
  }

  return <div className="activity-page"><button className="back-button" onClick={onBack}>← All activities</button><div className="page-heading"><span className="eyebrow">Endless sky · land, dodge, repeat</span><h1>Skyfall</h1><p>Steer your parachutist onto each platform. Dodge storm clouds as the descent speeds up.</p></div><section className="skyfall-panel"><div className="skyfall-hud"><div><span>Landings</span><strong>{score}</strong></div><div><span>Run status</span><strong>{status === 'running' ? 'In the air' : status === 'over' ? 'Run over' : 'Ready to drop'}</strong></div><span className="skyfall-no-save">No scores saved</span></div><div className="skyfall-stage"><canvas ref={canvasRef} width="960" height="540" aria-label="A parachutist descending toward platforms and avoiding storm clouds" />{status !== 'running' && <div className="skyfall-overlay"><div className="skyfall-overlay-card"><span className="skyfall-emoji">{status === 'over' ? '💥' : '🪂'}</span><strong>{status === 'over' ? 'Drop complete' : 'Ready to drop?'}</strong><span>{status === 'over' ? `${gameRef.current?.reason || 'Run ended.'} Landings: ${score}.` : 'Use ← → or A / D. Tap the arrows on mobile.'}</span><button className="button-primary" onClick={startGame}>{status === 'over' ? 'Try again' : 'Start descent'} <span>→</span></button></div></div>}</div><div className="skyfall-mobile-controls"><button onPointerDown={(event) => { event.preventDefault(); holdDirection('left', true) }} onPointerUp={() => holdDirection('left', false)} onPointerCancel={() => holdDirection('left', false)} onPointerLeave={() => holdDirection('left', false)} aria-label="Steer left">←</button><span>STEER</span><button onPointerDown={(event) => { event.preventDefault(); holdDirection('right', true) }} onPointerUp={() => holdDirection('right', false)} onPointerCancel={() => holdDirection('right', false)} onPointerLeave={() => holdDirection('right', false)} aria-label="Steer right">→</button></div><p className="skyfall-caption">Land on every platform. Miss one or hit a storm cloud and the run ends.</p></section></div>
}

const fixTopics = [
  ['Windows', 'Home vs Pro: choosing the right edition', 'Edition', 'Match the customer’s needs to the edition they own before discussing an upgrade.', 'Windows editions have different capabilities. Confirm the exact edition in Settings → System → About; never promise a feature based only on the device name.', 'Edition determines which features are available; an upgrade is not automatically needed.', 'Ask what the customer is trying to do, then check the installed edition before recommending a path.', 'A customer wants to use Remote Desktop to connect into their PC and asks why the option is missing.', 4],
  ['Windows', 'Clean installation and setup', 'Clean install', 'Explain setup choices while protecting files and account access.', 'A clean install can remove apps and personal files. Confirm backups, installation media, edition, and the customer’s goal before proceeding.', 'A reset and a clean installation are different recovery paths.', 'Pause before any step that can erase data; confirm backup status in the customer’s own words.', 'A customer bought a laptop second-hand and wants a fresh setup but has photos on it.', 5],
  ['Windows', 'Out-of-box experience (OOBE)', 'OOBE', 'Help a customer move through first-run setup and understand required choices.', 'OOBE is the first setup flow after Windows installation. Network, region, account, privacy, and edition can affect the screens shown.', 'The setup screens can vary by device, edition, and updates.', 'Ask what exact screen they see; guide one screen at a time instead of guessing.', 'A customer is stuck at account setup and says the screen does not match the instructions they found.', 4],
  ['Windows', 'Microsoft account vs local account', 'Sign-in identity', 'Clarify which account is being used and how it connects to Windows services.', 'A Microsoft account connects sign-in and services such as Store and sync. A local account is specific to that device. Check the signed-in identity before troubleshooting missing content.', 'Similar email addresses can belong to different accounts or profiles.', 'Never ask for a password or verification code; ask the customer to confirm the account hint shown on their device.', 'A customer’s Microsoft 365 apps show no subscription, but they are signed in with a different email than the purchase account.', 4],
  ['Windows', 'Windows Update: quality vs feature updates', 'Quality update', 'Set expectations about update types and check update history before changing settings.', 'Quality updates mainly address security and reliability. Feature updates introduce a Windows version. Update history helps identify what installed and when.', 'A pending restart can delay completion even after download finishes.', 'Record the update name, status, and any code before retrying.', 'A customer thinks a monthly security update changed Windows into a new version.', 4],
  ['Windows', 'Defender, firewall, and security settings', 'Firewall', 'Guide safe checks without weakening device protection.', 'Microsoft Defender and Windows Firewall help protect the device. Diagnose the app or connection issue before changing protection settings.', 'Turning off protection is not a safe general troubleshooting step.', 'Do not ask the customer to disable security broadly; use the narrowest supported diagnostic.', 'An app cannot connect, and a customer found a post telling them to turn off the firewall permanently.', 4],
  ['Windows', 'BitLocker and recovery keys', 'Recovery key', 'Explain what a recovery key is and how to locate it without collecting it.', 'A BitLocker recovery key unlocks an encrypted drive after certain security or hardware changes. The customer should retrieve it from their own Microsoft account or organization.', 'Support should never ask the customer to share their recovery key in chat.', 'Keep the key private; help them find the official account or administrator path.', 'After a firmware update, a customer sees a recovery screen and offers to paste the key into chat.', 4],
  ['Windows', 'Backup, restore, and Reset this PC', 'Recovery option', 'Choose a recovery path based on the problem and backup status.', 'Windows offers different restore and reset options. Their effect on personal files and apps differs, so confirm what is backed up and what the customer wants to preserve.', 'Reset options are not interchangeable with restoring a known good backup.', 'Explain what will be kept or removed before the customer selects an option.', 'A customer wants to fix a slow PC and asks whether Reset this PC will keep their work files.', 5],
  ['Windows', 'Wi-Fi, Ethernet, and DNS basics', 'DNS', 'Narrow down whether a network issue affects one device, one network, or one service.', 'Compare another device and another network, then note whether the device connects to Wi-Fi and whether websites resolve. This separates connection from name-resolution clues.', 'A connected Wi-Fi icon does not prove internet access is working.', 'Ask when it started and whether other devices on the same network are affected.', 'A customer’s laptop says connected, but websites do not load; their phone works on the same Wi-Fi.', 4],
  ['Windows', 'Administrator vs standard user and UAC', 'User Account Control', 'Explain permissions prompts and use the least privilege needed.', 'Administrator accounts can make system-wide changes. Standard accounts reduce risk. UAC prompts signal that an action needs elevated permission.', 'A UAC prompt is not a reason to enter credentials without understanding the action.', 'Ask what app or change triggered the prompt before continuing.', 'A customer sees an administrator prompt while installing an app on a family PC.', 4],
  ['Windows', 'File Explorer and storage', 'Storage Sense', 'Find storage usage and explain safe ways to free space.', 'Storage settings can show what uses disk space. Temporary files and personal files have different consequences when removed.', 'Deleting a file and uninstalling an app are separate actions.', 'Review categories with the customer and confirm before deleting personal content.', 'A customer’s update cannot install because the device is low on storage.', 4],
  ['Windows', 'Microsoft Store apps and permissions', 'App permission', 'Troubleshoot an install or app access issue with its exact status.', 'Store downloads, app updates, and app permissions are separate checks. Capture the app name, signed-in account, and full error before retrying.', 'An app may be installed but still lack permission to use camera, microphone, or files.', 'Identify whether the issue is install, update, launch, or permission first.', 'A customer installed a video app but it cannot access the camera.', 4],
  ['Windows', 'Task Manager and slow PC triage', 'Resource usage', 'Use observable evidence to narrow a performance complaint.', 'Task Manager can show CPU, memory, and disk activity. Compare the resource use with the time the slowdown occurs.', 'A single high reading may be temporary; look for a repeatable pattern.', 'Ask what feels slow and when it happens before closing processes.', 'A customer says their PC is slow only when a video call and spreadsheet are open together.', 5],
  ['Windows', 'Windows Pro features: Sandbox, Hyper-V, Group Policy', 'Edition capability', 'Check edition and prerequisites before promising an advanced feature.', 'Some management and virtualization features depend on Windows edition, hardware support, and configuration.', 'Feature availability may depend on more than a Windows Pro label.', 'Verify the exact feature, edition, and device requirements before guiding setup.', 'A customer wants Windows Sandbox but cannot find it in optional features.', 5],
  ['Windows', 'Troubleshooting: identify, investigate, isolate, resolve, verify', 'Reproduction steps', 'Use a consistent diagnostic path and confirm the fix with the customer.', 'Capture symptoms, scope, timing, changes, exact errors, and reproduction steps. Change one thing at a time, then verify the original task.', 'A workaround is not confirmed resolution until the customer retests the affected task.', 'Summarize what changed and what was verified before closing.', 'A customer reports intermittent crashes but cannot remember which app was open.', 5],
  ['Microsoft 365', 'Basic, Personal, Family, and Premium plans', 'Entitlement', 'Match plan questions to current account entitlements instead of guessing from a plan name.', 'Plan benefits can differ by plan and may change. Check the customer’s active subscription and account benefits before confirming app or storage access.', 'A plan label alone does not prove which account is signed in or which benefits are active.', 'Confirm account, subscription status, and the specific benefit the customer expects.', 'A customer bought a plan but cannot tell whether it includes the desktop apps they need.', 5],
  ['Microsoft 365', 'Subscription status, renewal, and expiration', 'Renewal date', 'Explain where to confirm subscription status and renewal details.', 'The Microsoft account’s Services & subscriptions page shows plan status and billing dates for eligible purchases.', 'An app sign-in and a subscription renewal are separate states to verify.', 'Check the account that made the purchase before discussing renewal.', 'A customer says their apps stopped working even though they remember renewing.', 4],
  ['Word', 'Formatting and templates', 'Style', 'Help a customer identify whether formatting comes from text, a style, or a template.', 'Word styles apply consistent formatting. Templates can set document structure and appearance. Check selection and style before rebuilding content.', 'Direct formatting can override the chosen style.', 'Ask what should look different and test a change on one paragraph first.', 'A customer’s headings change when they paste text from another document.', 4],
  ['Excel', 'Formulas, functions, and calculation checks', 'Formula reference', 'Troubleshoot a formula by checking inputs, references, and expected output.', 'A formula result depends on cell values, references, and calculation settings. Inspect the formula bar and a small example before editing a full workbook.', 'A displayed number may be formatted differently from its stored value.', 'Ask for a small sample and expected result; avoid requesting sensitive workbook data.', 'A customer’s total is wrong after copying a formula down a column.', 5],
  ['PowerPoint', 'Sharing and collaboration', 'Co-authoring', 'Check file location, access, and sharing permissions for collaboration issues.', 'Real-time co-authoring depends on a supported file location and the collaborators’ access. Sharing a link does not always grant the intended permission.', 'The link type and permission level matter.', 'Confirm whether the file is in OneDrive or SharePoint and what access the collaborator needs.', 'A customer sent a presentation link, but a colleague can only view it.', 4],
  ['Outlook', 'Email, calendar, contacts, and sync', 'Sync status', 'Separate a mail send/receive issue from account setup or sync delay.', 'Outlook issues can be limited to sending, receiving, calendar, contacts, or synchronization. Capture the app, account type, and exact error.', 'An email missing from one view may still exist in another folder or on the web.', 'Check Outlook on the web when appropriate to compare service state with the client app.', 'A customer sees new mail on the web but not in the desktop Outlook app.', 5],
  ['OneDrive', 'Files On-Demand and sync', 'Files On-Demand', 'Explain local availability and diagnose sync without risking file loss.', 'Files On-Demand can show cloud files without storing full local copies. Sync status icons and available storage help explain access.', 'A cloud-only file needs connectivity to download; a sync pause can delay changes.', 'Check the sync app status and account before unlinking or resetting OneDrive.', 'A customer sees a cloud icon and thinks their document was deleted.', 5],
  ['OneNote', 'Notebooks, sections, and sync', 'Notebook location', 'Locate the notebook and confirm its sync state before recreating content.', 'OneNote content is organized into notebooks, sections, and pages. Sync status and notebook location help narrow missing-content concerns.', 'Creating a duplicate notebook can make the content harder to track.', 'Check the account and notebook list on the web before moving or recreating pages.', 'A customer’s notes appear on a tablet but not on their laptop.', 4],
  ['Microsoft Defender', 'Consumer protection, alerts, and identity', 'Security alert', 'Respond to alerts carefully and distinguish a real app notice from a suspicious prompt.', 'Security alerts should be checked through the installed app or the customer’s account directly, not through links in an unexpected message.', 'Never request passwords, one-time codes, or recovery codes.', 'Have the customer open the security app themselves and describe the alert.', 'A customer receives a pop-up claiming their device is infected and asks whether to call the displayed number.', 4],
  ['Microsoft Teams', 'Personal chat, calls, and meetings', 'Device selection', 'Check account, device selection, permissions, and app state for call issues.', 'Call quality depends on microphone, speaker, camera permission, and the device selected in the meeting.', 'The operating system and Teams can each have separate device selections.', 'Test one device setting at a time and ask the customer to confirm the result.', 'A customer can hear the meeting but other people cannot hear them.', 4],
  ['Family Safety', 'Screen time and family settings', 'Family group', 'Confirm the right family group and child account before changing a limit.', 'Family Safety controls depend on group membership, account identity, device connection, and the setting being changed.', 'A child may use a different account on the device than the one in the family group.', 'Verify the account and device shown before editing limits.', 'A parent set screen time but the child’s Windows device does not reflect it.', 5],
  ['Clipchamp', 'Editing, templates, and export', 'Export resolution', 'Check project, account entitlement, and export settings when a video export fails.', 'Export behavior can depend on the project, browser or app, available storage, and selected export option.', 'A project may still be available even if one export attempt fails.', 'Capture the export stage and exact message before rebuilding the project.', 'A customer’s Clipchamp video reaches the final step but will not export.', 4],
  ['Microsoft Designer', 'AI-assisted images and account access', 'Entitlement', 'Clarify the creation goal and verify account access and feature availability.', 'AI-assisted features may depend on account, availability, usage limits, and current product terms.', 'Do not promise a specific feature or quota without checking the current account experience.', 'Ask what they are trying to create and what options they can see.', 'A customer can open Designer but cannot find the image option they saw in a tutorial.', 4],
  ['Copilot', 'Consumer availability and responsible use', 'Grounding', 'Explain availability carefully and encourage verification of important answers.', 'Copilot experiences can vary by app, account, region, and plan. Generated output can be inaccurate and should be reviewed.', 'AI output is a draft, not a guarantee of correctness.', 'Ask which Copilot experience they use and verify important product details.', 'A customer received a confident answer from Copilot that conflicts with a setting on their PC.', 4],
  ['Microsoft 365 Web Apps', 'Browser app vs desktop app', 'Web app', 'Help choose the right app experience based on the task and available features.', 'Web apps run in a browser and can differ from desktop apps in features, file handling, and offline behavior.', 'A feature in a desktop app may not appear in the web version.', 'Confirm which version is open before troubleshooting a missing command.', 'A customer follows desktop Word instructions but cannot find the same button in Word for the web.', 4],
  ['Microsoft 365', 'Install, update, repair, and activate desktop apps', 'Activation state', 'Check account, installation, updates, and activation in a safe order.', 'App installation and license activation are related but distinct. Confirm the account and activation message before reinstalling.', 'Reinstalling is disruptive and may not fix a wrong-account issue.', 'Start with the exact activation message and signed-in account.', 'A customer’s Word opens in reduced functionality after a laptop replacement.', 5],
  ['Microsoft 365', 'Sharing links and permissions', 'Link permission', 'Choose a sharing permission that matches the customer’s intended audience.', 'A file link can allow viewing or editing and may be limited to named people or a wider audience.', 'A link that works for the owner may not work for a recipient with different access.', 'Confirm who needs access and whether they should view or edit.', 'A customer’s family member cannot open a shared document.', 4],
  ['OneDrive', 'Storage and capacity troubleshooting', 'Storage quota', 'Identify which storage category is full and avoid deleting files blindly.', 'Cloud storage use may include files and other account content. Check the account’s storage view to identify what consumes space.', 'Deleting a local shortcut does not always delete the cloud file, and vice versa.', 'Explain the location and effect before removing anything.', 'A customer cannot upload photos and sees a storage limit warning.', 4],
  ['Microsoft 365', 'Desktop app install, update, repair, and reinstall', 'Office installation', 'Choose the least disruptive app repair step and protect the customer’s documents.', 'Installation, app updates, online repair, and reinstall are different steps. Confirm the app version, device, and error before changing the installation.', 'Repairing or reinstalling an app should not be the first step for a sign-in or entitlement issue.', 'Check account and activation first; back up important work before a repair or reinstall.', 'A customer’s Word crashes at launch and asks whether they should uninstall the whole Microsoft 365 suite.', 5],
  ['Microsoft 365', 'Storage: OneDrive, mailbox, and storage warnings', 'Storage allocation', 'Identify which storage location is full before suggesting cleanup.', 'Microsoft 365 storage questions can involve OneDrive files or Outlook mailbox storage. Check the exact warning and account storage view to locate the limit.', 'OneDrive storage and mailbox storage are separate places to investigate.', 'Ask which app shows the warning and capture its full wording before deleting anything.', 'A customer cannot send email and also sees a OneDrive storage warning; they assume one cleanup will fix both.', 5],
  ['Microsoft 365', 'Wrong account, missing benefits, expired plan', 'Account mismatch', 'Investigate subscription problems by confirming identity and account status.', 'Benefits attach to the purchasing account. A different account in the app can make an active plan appear missing.', 'Do not ask the customer to share credentials or payment card details.', 'Have them verify the account shown in Services & subscriptions.', 'A customer sees an expired banner in an app but says a family member purchased a plan.', 5],
  ['Microsoft account', 'Personal account and sign-in identity', 'Personal Microsoft account', 'Identify the account type and sign-in address relevant to the service.', 'A Microsoft account is an identity used to access consumer services. One person may have more than one email or account.', 'An email address used as a username does not reveal all account details.', 'Ask which account is displayed in the affected service, not for the password.', 'A customer signed into Windows with one email but purchased an app using another.', 4],
  ['Microsoft account', 'Account creation and sign-in', 'Alias', 'Help distinguish username, alias, and sign-in method.', 'A Microsoft account can use an email alias as a sign-in name. Sign-in flows may offer several verification methods.', 'The username is not necessarily the mailbox where a customer expects every message.', 'Use the account recovery flow and the customer’s own verified contact methods.', 'A customer changed their email address and cannot tell which one is the account username.', 4],
  ['Microsoft account', 'Password reset and account recovery', 'Recovery information', 'Use the official recovery process while protecting account security.', 'Recovery forms use information known to the account owner to establish access. Support should not bypass verification.', 'A one-time code is private and should never be shared with support.', 'Direct the customer to start recovery themselves and keep codes confidential.', 'A customer lost access to their old phone and cannot receive a sign-in code.', 5],
  ['Microsoft account', 'Two-step verification and MFA', 'Two-step verification', 'Explain the second verification step and help identify safe recovery options.', 'Two-step verification adds proof beyond a password. Backup methods should be current and controlled by the account owner.', 'Support will never need the customer’s security code.', 'Ask what methods are offered on screen; never ask them to read out a code.', 'A caller claiming to be support asks a customer to share their Authenticator code.', 4],
  ['Microsoft account', 'Security dashboard and suspicious activity', 'Recent activity', 'Help review activity directly in the account and secure it safely.', 'Recent activity can help the account owner identify unfamiliar sign-ins. They can change credentials and review security methods themselves.', 'A location estimate can be imprecise; verify the event details.', 'Have the customer open account security directly rather than following an unsolicited link.', 'A customer sees an unfamiliar sign-in alert and is worried their account was taken over.', 4],
  ['Family Safety', 'Child accounts and permissions', 'Child account', 'Confirm the child account and family organizer before adjusting controls.', 'Child account settings are managed through the family group and may depend on the device’s signed-in identity.', 'Changing the wrong account’s settings will not affect the child’s device.', 'Verify the child profile shown in the family group before making changes.', 'A parent changed content filters, but the child still sees the old settings.', 4],
  ['Microsoft account', 'Device association across Microsoft services', 'Device association', 'Trace which account connects the device to Store, apps, and subscriptions.', 'A device can use one identity for Windows and another for Store or Microsoft 365. Check the account in the affected app.', 'Device registration and subscription ownership are not always the same thing.', 'Ask which app shows the issue and verify its account separately.', 'A customer can install a purchased game on one PC but not see it on another.', 4],
  ['Microsoft account', 'Privacy and personal information', 'Privacy controls', 'Find the correct account privacy control and explain its scope.', 'Privacy controls can be managed by service and account. Explain what a setting changes before the customer toggles it.', 'A privacy choice in one app may not control every Microsoft service.', 'Ask what information or experience the customer wants to manage.', 'A customer wants to remove a saved address but is unsure whether it affects billing or profile details.', 4],
  ['Microsoft billing', 'Orders, charges, and subscriptions', 'Order history', 'Locate the order and account before interpreting a charge.', 'Order history can identify purchases and subscriptions associated with the account. Compare date, amount, and product without collecting full card numbers.', 'A bank descriptor may not match the product’s display name exactly.', 'Use account order history and safe transaction details; never request complete payment credentials.', 'A customer sees a Microsoft charge but cannot remember which account made the purchase.', 4],
  ['Microsoft billing', 'Recurring billing, renewal, and cancellation', 'Recurring billing', 'Explain renewal state and cancellation effects using the customer’s subscription record.', 'Recurring billing controls whether a subscription renews. Cancellation timing and access can depend on the plan and purchase channel.', 'Turning off recurring billing and immediate cancellation may have different effects.', 'Confirm the exact plan and renewal date before explaining next steps.', 'A customer turned off renewal but still sees a future expiration date.', 4],
  ['Microsoft billing', 'Payment methods and failed payments', 'Payment method', 'Guide safe payment-method updates without exposing card information.', 'Payment status and payment method can be reviewed in the account’s billing area. A declined payment can have several causes.', 'Support should never ask for a full card number or security code.', 'Have the customer update payment details privately in their account.', 'A subscription renewal failed after the customer replaced their bank card.', 4],
  ['Microsoft billing', 'Refund eligibility and purchase history', 'Refund eligibility', 'Find the purchase and explain that refund options depend on product and policy.', 'Purchase history identifies the item and date. Available refund options can depend on the product, region, and purchase channel.', 'Do not promise a refund before the account shows the available options.', 'Start with order history and describe only the options presented there.', 'A customer wants to return a digital purchase made several weeks ago.', 4],
  ['Microsoft billing', 'Unknown or unexpected charges', 'Transaction investigation', 'Investigate a charge through safe account checks before assuming fraud or error.', 'Compare purchase history, subscriptions, account aliases, and shared family purchases. If still unfamiliar, follow the official billing support path.', 'Do not collect passwords, full card numbers, or one-time codes.', 'Ask for the date and amount only if needed; keep sensitive payment data private.', 'A customer finds a renewal charge and thinks they cancelled the subscription last month.', 5],
  ['Microsoft Store', 'Apps, games, and digital purchases', 'Purchase ownership', 'Confirm the purchasing account and library before troubleshooting missing content.', 'Digital purchases are associated with the account that bought them. Store history can distinguish an install issue from account mismatch.', 'A purchase may not transfer between accounts.', 'Check the Store account and order history before reinstalling.', 'A customer bought a game on a family member’s account and cannot find it in their own library.', 4],
  ['Support', 'Billing conversation: duplicate charge', 'Duplicate charge', 'Gather safe details and check whether entries represent separate orders or pending authorizations.', 'Two bank entries can include a pending authorization and a completed charge. Order history is the starting point for identifying a purchase.', 'A pending bank entry may change without becoming a completed charge.', 'Ask for dates and amounts, never complete card details.', 'A customer sees two identical pending entries and is worried they paid twice.', 4],
  ['Business licensing', 'Volume licensing fundamentals', 'Commercial agreement', 'Recognize when a licensing question is commercial rather than consumer support.', 'Commercial licensing is designed for organizations and has agreement-specific terms. Consumer Microsoft 365 plans are a different purchase model.', 'Consumer plan guidance should not be applied to an organization’s agreement.', 'Clarify whether the customer is an individual or representing an organization, then route within the approved support path.', 'A small business asks whether its consumer Family plan covers all employees.', 5],
  ['Business licensing', 'Commercial licensing programs and agreements', 'Agreement structure', 'Identify the agreement context before explaining a commercial license question.', 'Commercial licensing terms depend on the program and agreement. The agreement owner or licensing specialist can confirm the account-specific terms.', 'Program names and availability can change; avoid guessing from an old guide.', 'Capture the organization and program context, then escalate licensing interpretation when needed.', 'An administrator asks whether a license can be reassigned under their organization’s agreement.', 5],
  ['Business licensing', 'Licenses, subscriptions, and Software Assurance', 'Software Assurance', 'Distinguish license rights, subscription access, and included benefits.', 'A license grants defined use rights; subscriptions provide access for a term; Software Assurance is associated with specific commercial licensing benefits.', 'These terms are related but not interchangeable.', 'Use the agreement’s language and involve a licensing specialist for entitlement decisions.', 'A customer asks if an expired subscription means they own a perpetual license.', 5],
  ['Business licensing', 'Volume activation: MAK and KMS', 'MAK / KMS', 'Recognize activation model terminology and collect safe diagnostic context.', 'MAK and KMS are volume activation methods used in organizational environments. Their use depends on the organization’s licensing setup.', 'These are not consumer product keys or consumer activation instructions.', 'Confirm the device is organization-managed and route to the licensing or IT administrator.', 'A user on a company device asks why a consumer key will not activate their organization’s Windows installation.', 5],
  ['Business licensing', 'Volume licensing support and escalation', 'Escalation boundary', 'Route agreement-specific license questions with a clear summary.', 'Commercial license entitlement often depends on agreement details unavailable in consumer support.', 'Do not interpret contract terms without the correct support scope.', 'Summarize product, agreement context, and the customer’s exact question for the authorized team.', 'An organization asks whether a specific user assignment is compliant under its agreement.', 4],
  ['Remote Desktop Services', 'RDS fundamentals and use cases', 'Remote Desktop Services', 'Recognize an organization’s remote desktop scenario and clarify what is being accessed.', 'Remote Desktop Services provides centralized remote app or desktop experiences in managed environments.', 'Windows client Remote Desktop features and RDS deployment are different topics.', 'Ask whether the customer is connecting to a personal PC or an organization-hosted environment.', 'A user says Remote Desktop used to work at home but now their company session is unavailable.', 4],
  ['Remote Desktop Services', 'RDS CALs: user vs device', 'CAL', 'Identify the licensing question and distinguish user-based from device-based access concepts.', 'RDS Client Access Licenses are commercial licensing concepts. User and device CAL models assign access differently.', 'CAL entitlement is not determined by a Windows consumer edition alone.', 'Capture whether access is assigned to people or devices and escalate entitlement questions.', 'An administrator asks whether a shared workstation needs a user or device CAL.', 5],
  ['Remote Desktop Services', 'RDS licensing infrastructure', 'License server', 'Collect deployment clues for an RDS licensing issue without changing infrastructure.', 'RDS licensing depends on a configured license server and mode. Deployment-specific details belong with the organization’s administrator.', 'A client-side setting change may not fix a server-side licensing configuration.', 'Record the exact message, affected host, and recent deployment changes for escalation.', 'Several users see an RDS licensing warning after a server migration.', 5],
  ['Remote Desktop Services', 'RDS licensing scenarios and escalation', 'Deployment scope', 'Separate user impact from agreement or server configuration questions.', 'RDS licensing errors can involve server configuration, CAL availability, or agreement details.', 'Do not recommend unsupported workarounds to bypass licensing.', 'Capture scope and timing, then escalate to the organization’s authorized RDS team.', 'One department cannot start remote sessions after a licensing server was changed.', 4],
  ['Sales', 'Discovery: understand the customer’s need', 'Open question', 'Ask focused questions before recommending a product or plan.', 'Good discovery clarifies the customer’s goal, current setup, users, devices, and constraints.', 'The first product the customer mentions may not be the actual need.', 'Ask one open question, then summarize what you heard before recommending.', 'A customer asks for the most expensive plan but only needs shared family storage.', 4],
  ['Sales', 'Needs discovery and pain points', 'Pain point', 'Uncover the problem behind a request without leading the customer.', 'A pain point is the friction the customer wants to remove. Specific examples make a recommendation more accurate.', 'Do not turn discovery into a checklist that ignores the customer’s answer.', 'Ask what is difficult today and what a good outcome would look like.', 'A customer wants to buy a new laptop because their current one is “not working right.”', 4],
  ['Sales', 'Consumer vs business customer', 'Customer segment', 'Identify which licensing model and support context fits the customer.', 'Consumer and commercial offers differ in management, licensing, and support. Confirm intended use before discussing plans.', 'A personal subscription is not a substitute for an organization’s commercial agreement.', 'Ask whether the purchase is for personal/family use or an organization.', 'A sole trader asks whether Microsoft 365 Family is suitable for a managed team.', 4],
  ['Sales', 'Product knowledge: Windows, M365, OneDrive, Xbox', 'Product fit', 'Connect a product capability to a need using accurate, relevant language.', 'A recommendation should relate to a stated customer need and supported product capability.', 'Never promise a benefit you have not confirmed for their plan or region.', 'Name the need first, then explain one relevant capability and its limits.', 'A customer asks which service can keep family photos available on multiple devices.', 4],
  ['Sales', 'Position Microsoft 365 plans clearly', 'Plan comparison', 'Compare plans against needs instead of listing features without context.', 'Plan benefits can vary and change. Compare only the current official plan details relevant to the customer’s use.', 'More features do not automatically mean a better fit.', 'Ask about users, devices, storage, and apps before comparing plans.', 'A customer is unsure whether to choose Personal or Family for two people.', 5],
  ['Sales', 'Ethical upsell and cross-sell', 'Needs-based recommendation', 'Recommend an upgrade only when it clearly addresses a customer need.', 'Ethical selling uses accurate claims, transparent tradeoffs, and respect for the customer’s choice.', 'Do not create urgency or imply a required purchase without evidence.', 'Explain why an option fits and make it easy for the customer to decline.', 'A customer asks for help sharing files; an upgrade is not needed for the feature they want.', 4],
  ['Sales', 'Handle price objections with value and empathy', 'Value statement', 'Acknowledge budget concerns and explain options without pressure.', 'A price objection can signal a need to understand usage, value, or lower-cost alternatives.', 'The customer’s budget is a valid constraint.', 'Ask which benefit matters most and compare only relevant options.', 'A customer says the subscription costs more than they expected.', 4],
  ['Sales', 'Respect “I do not need it”', 'Customer choice', 'Respect a declined offer and keep support focused on the customer’s goal.', 'A customer can decline an offer. The interaction should remain helpful and pressure-free.', 'Repeatedly pitching after a clear no damages trust.', 'Acknowledge the decision and continue with the original support request.', 'A customer declines a plan recommendation and still needs help installing an app.', 3],
  ['Sales', 'Structure a sales conversation', 'Recommendation flow', 'Move from discovery to recommendation with clear customer agreement.', 'A strong conversation opens, discovers needs, recommends a fit, answers questions, and confirms next steps.', 'A recommendation should follow discovery, not replace it.', 'Summarize the need and ask whether your understanding is right before offering a fit.', 'A customer wants cloud backup but is unsure how much storage is needed.', 4],
]

const fixCards = fixTopics.map(([product, subject, keyTerm, objective, knowledge, knowThis, tip, scenario, minutes], index) => ({
  id: index + 1, product, subject, keyTerm, objective, knowledge, knowThis, tip, scenario, minutes,
}))

function dailyFixIndex() {
  const cycleStart = Date.UTC(2026, 8, 30)
  const today = new Date()
  const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
  const elapsedDays = Math.floor((todayUtc - cycleStart) / 86400000)
  return ((elapsedDays % fixCards.length) + fixCards.length) % fixCards.length
}

function ProductGlyph({ product }) {
  if (product === 'Windows') return <span className="fix-windows-mark" aria-label="Windows logo"><i /><i /><i /><i /></span>
  if (product === 'Word' || product === 'Excel' || product === 'PowerPoint' || product === 'Outlook') return <span className={`fix-app-mark fix-${product.toLowerCase()}`}>{product === 'PowerPoint' ? 'P' : product[0]}</span>
  if (product === 'OneDrive') return <span className="fix-cloud-mark">☁</span>
  return <span className="fix-ms-mark" aria-label="Microsoft logo"><i /><i /><i /><i /></span>
}

function FixOfTheDay() {
  const [dailyIndex, setDailyIndex] = useState(dailyFixIndex)
  const [cardIndex, setCardIndex] = useState(dailyFixIndex)
  const card = fixCards[cardIndex]
  const isToday = cardIndex === dailyIndex
  const accent = ({ Windows: '#1689e8', Word: '#185abd', Excel: '#107c41', PowerPoint: '#c43e1c', Outlook: '#0078d4', OneDrive: '#2b9bea', 'Microsoft 365': '#8764d8', 'Microsoft Defender': '#4b9b73', 'Microsoft Teams': '#6264a7', 'Microsoft account': '#1689e8', 'Microsoft billing': '#c9822b', 'Microsoft Store': '#43a77a', 'Family Safety': '#b76eac', 'Business licensing': '#687f98', 'Remote Desktop Services': '#7d70cb', Sales: '#29998d', Support: '#597a99' })[card.product] || '#6ba8e8'
  useEffect(() => {
    const timer = window.setInterval(() => setDailyIndex(dailyFixIndex()), 60000)
    return () => window.clearInterval(timer)
  }, [])
  useEffect(() => setCardIndex(dailyIndex), [dailyIndex])
  function moveCard(direction) { setCardIndex((current) => (current + direction + fixCards.length) % fixCards.length) }

  return <section className="fix-deck-section" id="fix-of-the-day" aria-labelledby="fix-deck-title">
    <div className="fix-deck-heading"><div><span className="eyebrow">One useful skill · every day</span><h2 id="fix-deck-title">Fix of the Day</h2><p>A collectible-style learning card for real support conversations.</p></div><div className="fix-cycle-badge"><span>DAILY CARD</span><strong>{String(card.id).padStart(2, '0')} <small>/ {fixCards.length}</small></strong></div></div>
    <article className="fix-card" key={card.id} style={{ '--card-accent': accent }}>
      <div className="fix-card-top"><div className="fix-product"><span className="fix-logo-tile"><ProductGlyph product={card.product} /></span><span><small>PRODUCT CARD</small><strong>{card.product}</strong></span></div><span className="fix-day-count">DAY {String(card.id).padStart(2, '0')} <i>✦</i></span></div>
      <div className="fix-card-title-row"><div><span className="fix-card-kicker">FIELD GUIDE · {card.product.toUpperCase()}</span><h3>{card.subject}</h3></div><span className="fix-read-time">◷ {card.minutes} min read</span></div>
      <div className="fix-learning-objective"><span>LEARNING OBJECTIVE</span><p>{card.objective}</p></div>
      <div className="fix-knowledge-grid">
        <section><span>THE KNOWLEDGE</span><p>{card.knowledge}</p></section>
        <section><span>KEY TERM</span><strong>{card.keyTerm}</strong></section>
        <section><span>KNOW THIS</span><p>{card.knowThis}</p></section>
        <section><span>PRO TIP</span><p>{card.tip}</p></section>
      </div>
      <div className="fix-scenario"><span>🎧 CUSTOMER SCENARIO</span><p>“{card.scenario}”</p></div>
      <div className="fix-card-bottom"><span>{isToday ? 'Today’s shared card' : 'Browse the learning deck'} · Card {card.id} of {fixCards.length}</span><div><button type="button" onClick={() => moveCard(-1)} aria-label="Previous learning card">←</button><button type="button" onClick={() => setCardIndex(dailyIndex)} disabled={isToday}>Today</button><button type="button" onClick={() => moveCard(1)} aria-label="Next learning card">→</button></div></div>
    </article>
    <p className="fix-deck-note">Everyone sees the same card each day. The deck advances daily and starts a fresh cycle after the final card.</p>
  </section>
}

function App() {
  const [activeSimulator, setActiveSimulator] = useState(null)
  const [activeGame, setActiveGame] = useState(null)
  const [theme, setTheme] = useState(() => window.localStorage.getItem('mlts-theme-v2') || 'light')
  const [spotlightIndex, setSpotlightIndex] = useState(0)
  const [spotlightPaused, setSpotlightPaused] = useState(false)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem('mlts-theme-v2', theme)
  }, [theme])

  useEffect(() => {
    const targets = document.querySelectorAll('.hero, .games-section, .learning-section, .support-radar, .game-card, .module-card, .activity-panel, .simulator-frame')
    if (!('IntersectionObserver' in window)) { targets.forEach((target) => target.classList.add('is-visible')); return undefined }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target) }
    }), { threshold: 0.12 })
    targets.forEach((target) => { target.classList.add('reveal'); observer.observe(target) })
    return () => observer.disconnect()
  }, [activeGame, activeSimulator])

  const toggleTheme = () => setTheme((current) => current === 'dark' ? 'light' : 'dark')
  const spotlights = [
    { eyebrow: 'Practice · customer care', title: 'Customer Chat Simulator', text: 'Build calm, clear customer conversations with a realistic simulator.', label: 'Start a conversation', action: () => setActiveSimulator('customer') },
    { eyebrow: 'Play · endless landing challenge', title: 'Skyfall', text: 'Steer your parachutist, land on each platform, and dodge storm clouds.', label: 'Start the descent', action: () => setActiveGame('skyfall') },
    { eyebrow: 'Practice · consumer Microsoft', title: 'Quiz Gauntlet', text: 'Explore everyday Microsoft products with your quiz simulator.', label: 'Start the quiz', action: () => setActiveSimulator('quiz') },
    { eyebrow: 'Practice · typing lab', title: 'Typing Master', text: 'Build speed and accuracy in a one, three, or five minute typing test.', label: 'Start typing', action: () => setActiveGame('typing') },
  ]
  const spotlight = spotlights[spotlightIndex]
  useEffect(() => {
    if (spotlightPaused || activeGame || activeSimulator) return undefined
    const timer = window.setInterval(() => setSpotlightIndex((index) => (index + 1) % spotlights.length), 5200)
    return () => window.clearInterval(timer)
  }, [spotlightPaused, activeGame, activeSimulator])

  if (activeSimulator) {
    const simulator = simulators[activeSimulator]
    return <div className="app-shell"><Header status="Practice mode" onHome={() => setActiveSimulator(null)} theme={theme} onToggleTheme={toggleTheme} /><main className="simulator-page"><button className="back-button" onClick={() => setActiveSimulator(null)}>← Learning hub</button><section className="simulator-intro"><span className="eyebrow">{simulator.label}</span><div className="simulator-icon">{simulator.icon}</div><h1>{simulator.title}</h1><p>{simulator.description}</p><span className="chat-compat-note">The chat is supplied by Copilot Studio and scrolls inside this responsive frame.</span></section><section className="simulator-frame"><iframe title={simulator.title} src={simulator.url} allow="microphone; clipboard-read; clipboard-write" /></section></main></div>
  }
  if (activeGame) {
    const Game = activeGame === 'typing' ? TypingSprint : activeGame === 'skyfall' ? SkyDropGame : ReplyRemix
    return <div className="app-shell"><Header status="Quick play" onHome={() => setActiveGame(null)} theme={theme} onToggleTheme={toggleTheme} /><main><Game onBack={() => setActiveGame(null)} /></main></div>
  }

  const simulatorsList = [
    { id: 'customer', icon: '💬', tag: 'Talk it out', title: 'Customer Chat Simulator', text: 'Practice listening, empathy, and clear next steps in a realistic chat.' },
    { id: 'quiz', icon: '✦', tag: 'Ask & learn', title: 'Quiz Gauntlet', text: 'Explore consumer Microsoft products with your Copilot Studio quiz.' },
  ]
  const games = [
    { id: 'typing', icon: '⌨️', tag: '1 / 3 / 5 min tests', title: 'Typing Master', text: 'Track words per minute and accuracy, then earn a skill badge.' },
    { id: 'skyfall', icon: '🪂', tag: 'Endless 2D game', title: 'Skyfall', text: 'Steer left and right, land on every platform, and dodge storm clouds as you descend.' },
    { id: 'reply', icon: '💌', tag: 'Customer care', title: 'Reply Remix', text: 'Pick a helpful, human response to a customer situation.' },
  ]

  return <div className="app-shell"><Header theme={theme} onToggleTheme={toggleTheme} /><main id="home"><section className="hero" onMouseEnter={() => setSpotlightPaused(true)} onMouseLeave={() => setSpotlightPaused(false)} onFocusCapture={() => setSpotlightPaused(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setSpotlightPaused(false) }}><div className="hero-copy" key={spotlightIndex}><span className="eyebrow light">{spotlight.eyebrow}</span><h1>{spotlight.title}</h1><p>{spotlight.text}</p><div className="hero-actions"><button className="button-primary" onClick={spotlight.action}>{spotlight.label} <span aria-hidden="true">→</span></button><span className="tiny-note">MLTS Consumer Simulator · Practice at your pace</span></div></div><div className="hero-sticker"><span className="sticker-spark">✦</span><strong>Explore the hub</strong><div><span>01</span> Practice</div><div><span>02</span> Play</div><div><span>03</span> Build skills</div><div className="spotlight-dots"><span>{spotlightIndex + 1} / {spotlights.length}</span>{spotlights.map((item, index) => <button key={item.title} aria-label={`Show ${item.title}`} aria-current={spotlightIndex === index ? 'true' : undefined} onClick={() => setSpotlightIndex(index)} />)}</div></div></section>
    <section className="games-section" id="activities"><div className="section-heading"><div><span className="eyebrow">Tiny games, real skills</span><h2>Quick play</h2></div><p>Build speed, confidence, and good support instincts in short rounds.</p></div><div className="game-grid">{games.map((item) => <article className="game-card" key={item.id}><div className="game-card-top"><span className="game-icon">{item.icon}</span><span className="card-tag">{item.tag}</span></div><h3>{item.title}</h3><p>{item.text}</p><button className="game-launch" onClick={() => setActiveGame(item.id)}>Play now <span aria-hidden="true">↗</span></button></article>)}</div></section>
    <section className="learning-section" id="simulators"><div className="section-heading"><div><span className="eyebrow">MLTS Consumer Simulator</span><h2>Practice with people skills</h2></div><p>Realistic conversations and product knowledge, at your pace.</p></div><div className="module-grid">{simulatorsList.map((item, index) => <article className={`module-card module-${index + 1}`} key={item.id}><div className="card-top"><span className="module-icon">{item.icon}</span><span className="card-tag">{item.tag}</span></div><h3>{item.title}</h3><p>{item.text}</p><button onClick={() => setActiveSimulator(item.id)}>{item.id === 'customer' ? 'Start simulator' : 'Start Quiz Gauntlet'} <span aria-hidden="true">→</span></button></article>)}</div></section>
    <FixOfTheDay />
    <footer><div><strong>MLTS Consumer Simulator</strong><span>Microsoft learning, made practical.</span></div><span>Practice at your pace.</span></footer>
  </main></div>
}

export default App
