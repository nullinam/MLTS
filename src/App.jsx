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

const arcadeModes = [
  { id: 'myth', title: 'Myth or Fact', icon: '🧪', rounds: [
    { prompt: 'Windows + V opens clipboard history. You may need to turn it on the first time.', options: ['Fact', 'Myth'], answer: 0, explanation: 'Fact. Press Windows + V and choose Turn on if prompted.', source: 'https://support.microsoft.com/en-us/windows/apps/using-the-clipboard' },
    { prompt: 'Clipboard history automatically syncs across every device by default.', options: ['Fact', 'Myth'], answer: 1, explanation: 'Myth. Sync must be enabled, and it is tied to the same Microsoft or work account.', source: 'https://support.microsoft.com/en-us/windows/apps/using-the-clipboard' },
    { prompt: 'Windows + D can show or hide the desktop.', options: ['Fact', 'Myth'], answer: 0, explanation: 'Fact. This shortcut displays and hides the desktop.', source: 'https://support.microsoft.com/en-us/windows/keyboard-shortcuts-in-windows-dcc61a57-8ff0-cffe-9796-cb9706c75eec' },
  ] },
  { id: 'shortcut', title: 'Shortcut Showdown', icon: '⌨️', rounds: [
    { prompt: 'Which Windows shortcut opens Task Manager directly?', options: ['Ctrl + Shift + Esc', 'Ctrl + Alt + S', 'Windows + T'], answer: 0, explanation: 'Ctrl + Shift + Esc opens Task Manager.', source: 'https://support.microsoft.com/en-us/windows/keyboard-shortcuts-in-windows-dcc61a57-8ff0-cffe-9796-cb9706c75eec' },
    { prompt: 'Which shortcut opens File Explorer?', options: ['Windows + E', 'Windows + F', 'Ctrl + E'], answer: 0, explanation: 'Windows + E opens File Explorer.', source: 'https://support.microsoft.com/en-us/windows/keyboard-shortcuts-in-windows-dcc61a57-8ff0-cffe-9796-cb9706c75eec' },
    { prompt: 'Which shortcut locks a Windows PC?', options: ['Windows + L', 'Windows + K', 'Ctrl + L'], answer: 0, explanation: 'Windows + L locks the computer.', source: 'https://support.microsoft.com/en-us/windows/keyboard-shortcuts-in-windows-dcc61a57-8ff0-cffe-9796-cb9706c75eec' },
  ] },
  { id: 'settings', title: 'Settings Sprint', icon: '⚙️', rounds: [
    { prompt: 'A customer wants to quiet app notifications on Windows 11. Where do you guide them first?', options: ['Settings → System → Notifications', 'Settings → Personalization → Colors', 'Settings → Time & language → Date & time'], answer: 0, explanation: 'System → Notifications contains the controls for app notifications and Do Not Disturb.', source: 'https://support.microsoft.com/en-us/windows/experience/notifications-and-do-not-disturb-in-windows' },
    { prompt: 'A customer needs to toggle Bluetooth in Windows 11 Settings. Which section should they open?', options: ['Bluetooth & devices', 'Network & Internet', 'Personalization'], answer: 0, explanation: 'Bluetooth controls are under Settings → Bluetooth & devices.', source: 'https://support.microsoft.com/en-us/windows/hardware/bluetooth/turn-bluetooth-on-or-off-in-windows' },
    { prompt: 'Which shortcut opens Windows Settings?', options: ['Windows + I', 'Windows + S', 'Ctrl + I'], answer: 0, explanation: 'Windows + I opens the Settings app.', source: 'https://support.microsoft.com/en-us/windows/keyboard-shortcuts-in-windows-dcc61a57-8ff0-cffe-9796-cb9706c75eec' },
  ] },
  { id: 'error', title: 'Error Code Detective', icon: '🕵️', rounds: [
    { prompt: 'A customer shares an unfamiliar error code. What should you ask for first?', options: ['Exact code, full message, affected app, and when it appears', 'Their account password so you can reproduce it', 'Permission to reset every device setting'], answer: 0, explanation: 'Capture the exact context before diagnosing. Codes can vary by app and situation.' },
    { prompt: 'An install shows a code, but the customer can’t remember it. What is the best next step?', options: ['Ask them to reproduce it and capture the full message', 'Guess the code from memory', 'Tell them to disable security protections'], answer: 0, explanation: 'Use the precise message and the steps that trigger it to guide reliable troubleshooting.' },
    { prompt: 'A sign-in error appears only in one app. What detail helps narrow it down?', options: ['Whether sign-in works in another app or browser', 'The customer’s password', 'How many icons are on the desktop'], answer: 0, explanation: 'Compare where the issue occurs, while never asking for passwords or verification codes.' },
  ] },
]

const windowsKeys = 'https://support.microsoft.com/en-us/windows/keyboard-shortcuts-in-windows-dcc61a57-8ff0-cffe-9796-cb9706c75eec'
const factPairs = [
  ['Windows + V opens clipboard history; Windows may ask you to turn it on.', 'Clipboard history is always enabled and syncs automatically on every PC.'],
  ['Windows + D shows or hides the desktop.', 'Windows + D opens the Downloads folder.'],
  ['Windows + I opens Settings.', 'Windows + I opens the Internet browser.'],
  ['Windows + E opens File Explorer.', 'Windows + E opens the emoji panel.'],
  ['Windows + L locks the PC.', 'Windows + L signs the user out and closes all apps.'],
  ['Ctrl + Shift + Esc opens Task Manager.', 'Ctrl + Shift + Esc opens Windows Settings.'],
  ['Windows + Shift + S starts a screen snip.', 'Windows + Shift + S records the whole screen as a video.'],
  ['Alt + Tab switches between open apps.', 'Alt + Tab permanently closes the current app.'],
  ['Windows + P opens display projection options.', 'Windows + P changes the Windows password.'],
  ['Windows + Ctrl + D creates a virtual desktop.', 'Windows + Ctrl + D deletes every file on the desktop.'],
  ['Windows + Ctrl + Left or Right Arrow switches virtual desktops.', 'Windows + Ctrl + Left or Right Arrow changes screen brightness.'],
  ['Windows + X opens the Quick Link menu.', 'Windows + X opens Xbox Game Bar on every Windows PC.'],
  ['Windows + A opens Quick Settings on Windows 11.', 'Windows + A opens the Accounts page in Settings.'],
  ['Windows + N opens notifications and calendar on Windows 11.', 'Windows + N opens Notepad.'],
  ['Windows + Z opens Snap Layouts on supported Windows 11 devices.', 'Windows + Z immediately resets Windows to factory settings.'],
]
const mythBank = factPairs.flatMap(([fact, myth]) => [
  { prompt: fact, options: ['Fact', 'Myth'], answer: 0, explanation: fact, source: windowsKeys },
  { prompt: myth, options: ['Fact', 'Myth'], answer: 1, explanation: `Myth. ${fact}`, source: windowsKeys },
])

const shortcutFacts = [
  ['Windows + E', 'Open File Explorer'], ['Windows + I', 'Open Settings'], ['Windows + L', 'Lock the PC'],
  ['Windows + V', 'Open clipboard history'], ['Windows + D', 'Show or hide the desktop'], ['Alt + Tab', 'Switch between open apps'],
  ['Ctrl + Shift + Esc', 'Open Task Manager'], ['Windows + Shift + S', 'Start a screen snip'], ['Windows + A', 'Open Quick Settings'],
  ['Windows + N', 'Open notifications and calendar'], ['Windows + P', 'Choose a display projection mode'], ['Windows + X', 'Open the Quick Link menu'],
  ['Windows + Z', 'Open Snap Layouts'], ['Windows + Ctrl + D', 'Create a virtual desktop'], ['Windows + Tab', 'Open Task View'],
]
const shortcutBank = shortcutFacts.flatMap(([key, action], index) => {
  const wrongActions = shortcutFacts.filter((_, other) => other !== index).map(([, other]) => other)
  const wrongKeys = shortcutFacts.filter((_, other) => other !== index).map(([other]) => other)
  return [
    { prompt: `Which shortcut ${action.toLowerCase()}?`, options: [key, ...shuffle(wrongKeys).slice(0, 2)], answer: 0, explanation: `${key} ${action.toLowerCase()}.`, source: windowsKeys },
    { prompt: `What does ${key} do?`, options: [action, ...shuffle(wrongActions).slice(0, 2)], answer: 0, explanation: `${key} ${action.toLowerCase()}.`, source: windowsKeys },
  ]
})

const settingFacts = [
  ['notifications and Do Not Disturb', 'System → Notifications'], ['Bluetooth devices', 'Bluetooth & devices → Devices'],
  ['Wi-Fi networks', 'Network & internet → Wi-Fi'], ['display resolution and scaling', 'System → Display'],
  ['sound output and volume', 'System → Sound'], ['Windows updates', 'Windows Update'],
  ['installed apps and uninstall options', 'Apps → Installed apps'], ['sign-in options', 'Accounts → Sign-in options'],
  ['accessibility features', 'Accessibility'], ['privacy permissions', 'Privacy & security'],
  ['default apps', 'Apps → Default apps'], ['date, time, and time zone', 'Time & language → Date & time'],
  ['storage space', 'System → Storage'], ['personalization and themes', 'Personalization'],
  ['printers and scanners', 'Bluetooth & devices → Printers & scanners'],
]
const settingsBank = settingFacts.flatMap(([need, path], index) => {
  const wrongPaths = settingFacts.filter((_, other) => other !== index).map(([, option]) => option)
  const wrongNeeds = settingFacts.filter((_, other) => other !== index).map(([option]) => option)
  return [
    { prompt: `A customer wants to manage ${need}. Where would you guide them in Windows 11?`, options: [path, ...shuffle(wrongPaths).slice(0, 2)], answer: 0, explanation: `The related controls are under Settings → ${path}.` },
    { prompt: `Which Settings area contains ${path}?`, options: [need, ...shuffle(wrongNeeds).slice(0, 2)], answer: 0, explanation: `${path} is the path for ${need}.` },
  ]
})

const errorPrompts = [
  'A Windows update displays an unfamiliar code and then stops.', 'Microsoft Store shows a code while installing an app.',
  'OneDrive shows a sync error beside a file.', 'Outlook displays an error only when sending mail.',
  'A customer sees a sign-in code in one Microsoft app.', 'An error appears after the customer changed a setting.',
  'A setup wizard fails before showing its final screen.', 'A customer remembers the error began after an update.',
  'An app crashes and shows a short hexadecimal code.', 'A customer reports an error but has closed the message.',
  'The same code appears on two different devices.', 'The error happens only on the customer’s home Wi-Fi.',
  'An error appears only for one Windows user profile.', 'A customer says the warning disappears too quickly to read.',
  'An error occurs after the customer changes their password.', 'A file opens in one app but not another.',
  'A customer reports a code but is unsure which app showed it.', 'The issue started after a new device was connected.',
  'An installation fails with a code and a short description.', 'A customer has already tried several fixes but no notes.',
  'An error appears only when opening one document.', 'A customer shares a cropped screenshot without the title bar.',
  'The issue is intermittent and the exact steps are unclear.', 'A customer sees an account warning and offers their password.',
  'A pop-up asks the customer to share a verification code.', 'The error might involve a third-party add-in.',
  'A message appears after a security setting was changed.', 'A customer cannot tell whether the warning is from Windows or an app.',
  'A code appears during sign-in on a shared computer.', 'An error continues after the customer restarts the app.',
]
const errorBank = errorPrompts.map((prompt) => ({
  prompt: `${prompt} What is the safest first diagnostic move?`,
  options: ['Capture the exact code and full text, affected app, timing, and steps to reproduce', 'Ask for the account password or one-time verification code', 'Disable security protections and try random fixes'],
  answer: 0,
  explanation: 'Record the full message and context first. Never request a password or one-time code; then check the official support guidance for that exact product and error.',
  source: 'https://support.microsoft.com/',
}))

arcadeModes.find((mode) => mode.id === 'myth').rounds = mythBank
arcadeModes.find((mode) => mode.id === 'shortcut').rounds = shortcutBank
arcadeModes.find((mode) => mode.id === 'settings').rounds = settingsBank
arcadeModes.find((mode) => mode.id === 'error').rounds = errorBank

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
  const elapsed = duration - seconds
  const wpm = elapsed ? Math.round((correct / 5) / (elapsed / 60)) : 0
  const badge = accuracy >= 98 && wpm >= 70 ? 'Precision Ace' : accuracy >= 96 && wpm >= 50 ? 'Speed Pro' : accuracy >= 92 && wpm >= 35 ? 'Steady Operator' : accuracy >= 85 ? 'Accuracy Builder' : 'First Run'
  function reset(nextDuration = duration) { setStarted(false); setFinished(false); setDuration(nextDuration); setSeconds(nextDuration); setTyped(''); setTypingText(buildTypingPassage()) }

  return <div className="activity-page"><button className="back-button" onClick={onBack}>← All activities</button><div className="page-heading"><span className="eyebrow">Typing lab · choose your test</span><h1>Typing Master</h1><p>A focused typing test with live speed, accuracy, and a finish badge.</p></div><section className="activity-panel"><div className="typing-duration" aria-label="Test duration">{[60, 180, 300].map((time) => <button key={time} className={duration === time ? 'active' : ''} disabled={started} onClick={() => reset(time)}>{time / 60} min</button>)}</div><div className="typing-stats"><div><span>Time left</span><strong>{Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}</strong></div><div><span>Speed</span><strong>{wpm} WPM</strong></div><div><span>Accuracy</span><strong>{accuracy}%</strong></div></div><p className="typing-copy">{[...typingText].map((char, index) => <span key={index} className={index < typed.length ? (typed[index] === char ? 'correct-char' : 'wrong-char') : ''}>{char}</span>)}</p><textarea aria-label="Typing practice" value={typed} onChange={(event) => setTyped(event.target.value.slice(0, typingText.length))} disabled={!started || finished} placeholder={started ? 'Type the passage here…' : 'Choose a duration, then start the test'} /><div className="activity-actions"><button className="button-primary" onClick={() => setStarted(true)} disabled={started || finished}>{finished ? 'Test complete' : started ? 'Test running…' : 'Start test'}</button><button className="button-secondary" onClick={() => reset(duration)}>Start over</button></div>{finished && <div className="typing-result" role="status"><strong>🏅 {badge}</strong><span>{wpm} WPM · {accuracy}% accuracy · {Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, '0')} completed</span></div>}</section></div>
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

function SkillArcade({ onBack }) {
  const [modeOrder, setModeOrder] = useState(() => shuffle(arcadeModes))
  const [modeId, setModeId] = useState(() => pickRandom(arcadeModes).id)
  const [choice, setChoice] = useState(null)
  const [score, setScore] = useState(0)
  const [question, setQuestion] = useState(() => makeRound(arcadeModes.find((item) => item.id === modeId)))
  const mode = arcadeModes.find((item) => item.id === modeId)
  function changeMode(id) { const next = arcadeModes.find((item) => item.id === id); setModeId(id); setQuestion(makeRound(next)); setChoice(null) }
  function choose(index) { if (choice !== null) return; setChoice(index); if (index === question.answer) setScore((value) => value + 1) }
  function nextMode() {
    const next = pickRandom(arcadeModes.filter((item) => item.id !== modeId))
    setModeOrder((current) => shuffle(current))
    setModeId(next.id)
    setQuestion(makeRound(next, question.prompt))
    setChoice(null)
  }
  return <div className="activity-page"><button className="back-button" onClick={onBack}>← All activities</button><div className="page-heading"><span className="eyebrow">Four mini games · One arcade</span><h1>MLTS Skill Arcade</h1><p>Questions, answer order, and the next mode shuffle as you play.</p></div><div className="arcade-modes" role="tablist" aria-label="Choose a mini game">{modeOrder.map((item) => <button key={item.id} role="tab" aria-selected={modeId === item.id} className={modeId === item.id ? 'active' : ''} onClick={() => changeMode(item.id)}><span>{item.icon}</span>{item.title}</button>)}</div><section className="activity-panel challenge-panel"><div className="challenge-meta"><span>{mode.icon} {mode.title}</span><span>Skill points {score}</span></div><h2>{question.prompt}</h2><div className="answer-options">{question.options.map((option, index) => <button key={option} className={choice !== null && index === question.answer ? 'correct' : (choice === index ? 'incorrect' : '')} onClick={() => choose(index)} disabled={choice !== null}><span className="option-letter">{String.fromCharCode(65 + index)}</span>{option}</button>)}</div>{choice !== null && <div className={`answer-feedback ${choice === question.answer ? 'good' : 'try-again'}`} role="status"><strong>{choice === question.answer ? 'Nice one!' : 'Here’s the answer.'}</strong><span>{question.explanation}{question.source && <> <a href={question.source} target="_blank" rel="noreferrer">Check Microsoft’s guide ↗</a></>}</span></div>}<button className="button-primary next-button" onClick={nextMode} disabled={choice === null}>Surprise me <span aria-hidden="true">→</span></button></section></div>
}

function MicrosoftChangeRadar() {
  const [updates, setUpdates] = useState([])
  const [sources, setSources] = useState([])
  const [status, setStatus] = useState('loading')
  const [checkedAt, setCheckedAt] = useState(null)
  const [filter, setFilter] = useState('Consumer')
  const trackRef = useRef(null)
  const feedUrl = import.meta.env.VITE_PULSE_API_URL || '/api/microsoft-pulse'

  async function refresh(force = false) {
    setStatus('loading')
    try {
      const refreshParam = force ? `${feedUrl.includes('?') ? '&' : '?'}refresh=${Date.now()}` : ''
      const response = await fetch(`${feedUrl}${refreshParam}`, { cache: 'no-store' })
      if (!response.ok) throw new Error('Feed request failed')
      const payload = await response.json()
      setUpdates(Array.isArray(payload.updates) ? payload.updates : [])
      setSources(Array.isArray(payload.sources) ? payload.sources : [])
      setCheckedAt(payload.checkedAt || new Date().toISOString())
      setStatus(payload.updates?.length ? 'ready' : 'empty')
    } catch {
      setStatus('error')
    }
  }

  useEffect(() => {
    refresh()
    const timer = window.setInterval(refresh, 180000)
    return () => window.clearInterval(timer)
  }, [])

  const filtered = updates.filter((item) => item.channel === filter).slice(0, 30)
  const checkedLabel = checkedAt ? new Date(checkedAt).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : ''
  function scrollTrack(direction) { trackRef.current?.scrollBy({ left: direction * trackRef.current.clientWidth * 0.82, behavior: 'smooth' }) }

  return <section className="change-radar" aria-labelledby="change-radar-title">
    <div className="change-radar-heading"><div><span className="eyebrow">Official Microsoft sources · trainer-ready</span><h2 id="change-radar-title">Microsoft Change Radar</h2><p>Latest updates, who they affect, and what support teams should know.</p></div><div className="change-radar-status"><span className={`live-dot ${status}`} />{status === 'ready' ? `${sources.filter((source) => source.ok).length}/${sources.length} feeds · checked ${checkedLabel}` : status === 'error' ? 'Feed unavailable' : status === 'empty' ? 'No recent updates found' : 'Checking Microsoft feeds'}</div></div>
    <div className="change-radar-controls"><div className="change-radar-tabs" role="tablist" aria-label="Filter Microsoft updates">{['Consumer', 'Other Microsoft'].map((channel) => <button key={channel} role="tab" aria-selected={filter === channel} className={filter === channel ? 'active' : ''} onClick={() => setFilter(channel)}>{channel}</button>)}</div><div className="change-radar-scroll"><span>Scroll updates</span><button aria-label="Scroll cards left" onClick={() => scrollTrack(-1)}>←</button><button aria-label="Scroll cards right" onClick={() => scrollTrack(1)}>→</button></div></div>
    {status === 'loading' && <div className="change-radar-message" role="status">Checking official Microsoft feeds…</div>}
    {status === 'error' && <div className="change-radar-message" role="status"><strong>Couldn’t load the live updates.</strong><span>Try again, or open an official Microsoft source below.</span><button className="button-secondary" onClick={refresh}>Try again</button></div>}
    {status === 'empty' && <div className="change-radar-message" role="status">No recent updates were returned by the connected official feeds. Use the source links below or check again shortly.</div>}
    {status === 'ready' && filtered.length === 0 && <div className="change-radar-message" role="status">No updates are available in this channel right now.</div>}
    {status === 'ready' && filtered.length > 0 && <div className="change-radar-track" ref={trackRef} aria-label={`${filter} Microsoft update cards`}>{filtered.map((item) => <article className="change-card" key={item.url}><div className="change-card-meta"><span>{item.channel}</span><time dateTime={item.date}>{new Date(item.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}</time></div><h3>{item.title}</h3><p className="change-summary">{item.summary || 'Open the Microsoft article for the complete update.'}</p><div className="change-card-actions"><span>Official · {item.source}</span><a href={item.url} target="_blank" rel="noreferrer">Read Microsoft source ↗</a></div></article>)}</div>}
    <div className="change-radar-footer"><span>Cards link to Microsoft-published pages. Feed timing depends on when Microsoft publishes each update.</span><button className="button-secondary" onClick={() => refresh(true)} disabled={status === 'loading'}>{status === 'loading' ? 'Checking…' : '↻ Refresh updates'}</button></div>
    <div className="change-radar-sources"><strong>Official sources</strong><a href="https://blogs.windows.com/windowsexperience/" target="_blank" rel="noreferrer">Windows Experience Blog</a><a href="https://www.microsoft.com/en-us/microsoft-365/blog/" target="_blank" rel="noreferrer">Microsoft 365 Blog</a><a href="https://blogs.microsoft.com/" target="_blank" rel="noreferrer">Official Microsoft Blog</a><a href="https://www.microsoft.com/en-us/security/blog/" target="_blank" rel="noreferrer">Microsoft Security Blog</a></div>
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
    { eyebrow: 'Play · four quick modes', title: 'MLTS Skill Arcade', text: 'Myth or Fact, shortcuts, settings, and error code detection.', label: 'Open the arcade', action: () => setActiveGame('arcade') },
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
    const Game = activeGame === 'typing' ? TypingSprint : activeGame === 'arcade' ? SkillArcade : ReplyRemix
    return <div className="app-shell"><Header status="Quick play" onHome={() => setActiveGame(null)} theme={theme} onToggleTheme={toggleTheme} /><main><Game onBack={() => setActiveGame(null)} /></main></div>
  }

  const simulatorsList = [
    { id: 'customer', icon: '💬', tag: 'Talk it out', title: 'Customer Chat Simulator', text: 'Practice listening, empathy, and clear next steps in a realistic chat.' },
    { id: 'quiz', icon: '✦', tag: 'Ask & learn', title: 'Quiz Gauntlet', text: 'Explore consumer Microsoft products with your Copilot Studio quiz.' },
  ]
  const games = [
    { id: 'typing', icon: '⌨️', tag: '1 / 3 / 5 min tests', title: 'Typing Master', text: 'Track words per minute and accuracy, then earn a skill badge.' },
    { id: 'arcade', icon: '🎮', tag: '4 mini games', title: 'MLTS Skill Arcade', text: 'Myth or Fact, Shortcut Showdown, Settings Sprint, and Error Code Detective.' },
    { id: 'reply', icon: '💌', tag: 'Customer care', title: 'Reply Remix', text: 'Pick a helpful, human response to a customer situation.' },
  ]

  return <div className="app-shell"><Header theme={theme} onToggleTheme={toggleTheme} /><main id="home"><section className="hero" onMouseEnter={() => setSpotlightPaused(true)} onMouseLeave={() => setSpotlightPaused(false)} onFocusCapture={() => setSpotlightPaused(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setSpotlightPaused(false) }}><div className="hero-copy" key={spotlightIndex}><span className="eyebrow light">{spotlight.eyebrow}</span><h1>{spotlight.title}</h1><p>{spotlight.text}</p><div className="hero-actions"><button className="button-primary" onClick={spotlight.action}>{spotlight.label} <span aria-hidden="true">→</span></button><span className="tiny-note">MLTS Consumer Simulator · Practice at your pace</span></div></div><div className="hero-sticker"><span className="sticker-spark">✦</span><strong>Explore the hub</strong><div><span>01</span> Practice</div><div><span>02</span> Play</div><div><span>03</span> Build skills</div><div className="spotlight-dots"><span>{spotlightIndex + 1} / {spotlights.length}</span>{spotlights.map((item, index) => <button key={item.title} aria-label={`Show ${item.title}`} aria-current={spotlightIndex === index ? 'true' : undefined} onClick={() => setSpotlightIndex(index)} />)}</div></div></section>
    <section className="games-section" id="activities"><div className="section-heading"><div><span className="eyebrow">Tiny games, real skills</span><h2>Quick play</h2></div><p>Build speed, confidence, and good support instincts in short rounds.</p></div><div className="game-grid">{games.map((item) => <article className="game-card" key={item.id}><div className="game-card-top"><span className="game-icon">{item.icon}</span><span className="card-tag">{item.tag}</span></div><h3>{item.title}</h3><p>{item.text}</p><button className="game-launch" onClick={() => setActiveGame(item.id)}>Play now <span aria-hidden="true">↗</span></button></article>)}</div></section>
    <section className="learning-section" id="simulators"><div className="section-heading"><div><span className="eyebrow">MLTS Consumer Simulator</span><h2>Practice with people skills</h2></div><p>Realistic conversations and product knowledge, at your pace.</p></div><div className="module-grid">{simulatorsList.map((item, index) => <article className={`module-card module-${index + 1}`} key={item.id}><div className="card-top"><span className="module-icon">{item.icon}</span><span className="card-tag">{item.tag}</span></div><h3>{item.title}</h3><p>{item.text}</p><button onClick={() => setActiveSimulator(item.id)}>{item.id === 'customer' ? 'Start simulator' : 'Start Quiz Gauntlet'} <span aria-hidden="true">→</span></button></article>)}</div></section>
    <MicrosoftChangeRadar />
    <footer><div><strong>MLTS Consumer Simulator</strong><span>Microsoft learning, made practical.</span></div><span>Practice at your pace.</span></footer>
  </main></div>
}

export default App
