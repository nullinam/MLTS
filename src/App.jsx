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

const typingPassages = [
  'A customer calls because a new laptop feels slower than expected. Start by asking when the change began and which tasks are affected. A short delay after sign-in can have a different cause from a browser that freezes during video calls. Ask whether the issue happens on battery power, while connected to a dock, or after a recent update. Check one observable detail at a time, explain what each check can tell you, and avoid closing apps before the customer can save work. Once the device responds normally, ask them to repeat the original task so you can confirm the improvement.',
  'A family member cannot find photos on a replacement phone. A calm first step is to confirm which account appears in the photo app. Then ask whether the pictures are missing everywhere or only on this device. Sync can take time, especially when a large library is being restored over a slow connection. Keep the original phone unchanged until the backup status is clear. Do not promise that a file is recoverable before checking the account, recycle bin, and available backups. Describe each place in plain language, and let the customer decide before removing or moving anything.',
  'An update appears to have changed the desktop. The customer may be worried that personal files or familiar settings have disappeared. Ask what looks different and when they first noticed it. A changed taskbar, display scale, or default app can feel disruptive without indicating data loss. Compare the current setting with the customer’s goal, then guide one safe adjustment. If the screen shows an unfamiliar message, record its exact wording before choosing a path. Finish by asking the customer to open the app or page they originally needed.',
  'A sign-in prompt requests a security code, and the customer offers to read it aloud. Thank them for checking, then explain that the code must stay private. Support does not need a password, recovery key, or one-time code to troubleshoot an account. Ask which official Microsoft page or app displayed the prompt. Confirm that the web address is expected before the customer continues. If the request came from an unexpected message, stop and use the account’s trusted security page instead. A precise boundary protects the customer while keeping the conversation helpful.',
  'A document will not open before a scheduled presentation. Ask for the file type, the exact error, and whether other documents open normally. A damaged file, an unavailable cloud copy, and an app problem require different checks. If the file is stored online, confirm that the customer is signed into the account that owns it. Avoid asking them to overwrite the original with a test copy. Try a safe alternate view only after confirming the file is available. Keep the customer informed, and agree on a practical next step if recovery needs more time.',
  'A wireless printer worked yesterday but now appears offline. Find out whether the printer screen shows a warning and whether another device can print. Check that the computer and printer are connected to the intended network. A paused queue can look like a network failure, while a sleeping printer may simply need to wake. Avoid deleting every printer setting before checking the status and queue. If a restart is appropriate, explain which device will restart and why. Test with a small page and confirm the result before ending the session.',
  'The customer sees a renewal charge they did not expect. Acknowledge the surprise and clarify which account and purchase channel they used. Do not request a full card number, security code, or banking password. Ask them to open the official order history themselves and compare the date, product, and renewal status. A family member or second account can sometimes explain a charge that looks unfamiliar. If it remains unclear, summarize the safe details and route them to the billing team that can review the transaction.',
  'A video meeting has no sound, but the customer can hear music from another app. This clue suggests that the device output works and the meeting may use a different audio selection. Ask which speaker and microphone the meeting app currently shows. Check mute status at both the device and meeting level. Change one setting, then ask the customer to test again. Avoid switching several devices at once because it becomes difficult to identify what helped. Before closing, confirm that the customer can hear the people they need to meet.',
  'The customer cannot connect to a home network. First ask whether another device can use the same connection. If every device is offline, the issue may involve the router or provider; if only one is affected, focus on that device. Record the exact status and whether nearby networks appear. A connected icon does not always mean that websites can load. Avoid changing advanced network settings until simple checks narrow the cause. Explain any reset before using it, since a reset may remove saved network details.',
  'A subscription is active, but desktop apps report that no license is available. Confirm the account shown in the app and compare it with the account that owns the subscription. Personal and work accounts can both be present on one device. Check the subscription status through the customer’s official account page, without asking for credentials. If the product is managed by an organization, the administrator may need to confirm the assigned license. Separate account identity from installation status, then choose the next step that matches the evidence.',
  'A customer receives repeated browser pop-ups and worries that the computer is infected. Ask whether the alerts appear inside a browser tab or as Windows notifications. Do not tell them to call a number shown in an unexpected warning. Close the suspicious page without following its links, then review browser notification permissions using the browser’s own settings. If the customer entered payment or sign-in details, shift to the relevant account protection steps. Keep the explanation factual; dramatic warnings can increase risk rather than help.',
  'A screen reader user reports that a settings page is difficult to navigate. Ask which control they are trying to reach and what assistive technology they use. Provide keyboard steps and describe labels in the order they appear. Do not rely only on color, position, or an unlabeled icon. Pause after each action so the customer can confirm what they hear. Accessibility support works best when the customer stays in control of the pace and method. If a control has no clear label, document the issue for the product team.',
  'A customer wants to reset a PC because startup is slow. Before discussing recovery, ask whether the slowdown affects every sign-in and whether important files are backed up. A reset can remove applications and may change what is kept, depending on the option selected. Check startup impact and available storage before considering a disruptive recovery step. Explain the likely effects in direct terms and let the customer make an informed choice. After any change, repeat the original startup check and confirm that essential files remain available.',
  'A message claims that a payment failed and asks the customer to verify an account immediately. The customer has not opened the attachment yet. Reinforce that pausing was the right move. Ask whether the message is expected and inspect the sender details without opening links. A display name can be imitated, so it is not enough to prove who sent it. Direct the customer to type the known official address themselves. If credentials were already entered, use the approved account recovery and security process.',
  'A customer wants to share one folder with a colleague but is unsure which link option to choose. Ask who needs access, whether they need to edit, and how long the access should last. A link that works for anyone can expose more than intended. Prefer the narrowest access that supports the task. Confirm the recipient and permission before sharing, then show how access can be reviewed later. Use a harmless test file if the customer needs to understand the experience before sharing important documents.',
  'A feature is missing from a Windows device, and the customer believes every edition includes it. Ask which feature they want and how they plan to use it. Confirm the installed edition in Settings before discussing an upgrade. Feature availability may also depend on hardware, configuration, and organization policy. Avoid promising that a purchase alone will resolve the issue. Explain what the edition check shows, then verify the exact requirement from current product information.',
  'The customer says an app crashes only when a large spreadsheet is open. Ask whether a smaller file works and whether the crash began after a recent change. Record the app version, file location, and full error text. A file-specific issue differs from a general app launch failure. Before repairing or reinstalling anything, make sure the original file has a separate safe copy. Change one variable and retest with the same task so the result is useful.',
  'A laptop camera works in one app but not another. This suggests that the camera itself may be available while app permission or device selection differs. Ask the customer to check the selected camera inside the affected app. Then review Windows privacy permissions for that app. Close other calling tools if they may be using the camera, and test again. Avoid changing organization-managed policies or installing unknown camera utilities. Confirm the preview works before starting a real call.',
  'A customer sees a BitLocker recovery screen after a hardware change. Explain that the recovery key is sensitive and should never be pasted into chat. Ask whether the device is personal or organization-managed. The owner can retrieve the key from the appropriate Microsoft account or their organization’s administrator. Do not guess which account holds it. Keep the customer on the official recovery path and verify that the device starts normally after they enter the key privately.',
  'A cloud file appears to be missing from one computer. Ask whether it is visible on the service’s website and whether the same account is signed in on both devices. Check sync status before moving or deleting local copies. A paused sync or storage limit can explain why recent changes have not appeared. Do not assume a missing shortcut means the file is gone. Once the online copy is confirmed, help the customer restore access and verify that the correct folder updates.',
  'A customer asks for the fastest way to make a computer feel new again. Clarify the actual problem before recommending a reset or purchase. Ask which task is slow, how often it happens, and whether anything changed recently. Check safe, reversible options first, such as storage availability or a specific app’s behavior. Avoid promising a speed increase from a single setting. Explain the trade-offs of each option and let the customer choose the approach that fits their needs.',
  'A work account blocks an app installation on a personally owned device. Ask whether the device is enrolled in workplace management and whether the app is required for work. Some controls are set by an organization and cannot be changed by consumer support. Do not advise bypassing a policy or using an untrusted installer. Capture the exact message and the organization context, then direct the customer to their administrator. A clear handoff is safer than repeated changes that cannot resolve the restriction.',
  'A customer has two Microsoft accounts and cannot remember which one purchased a game. Avoid guessing from the gamer tag alone. Ask them to compare the order history and profile shown on the console or official account page. Keep passwords and verification codes private. If the purchase belongs to a different account, explain how to sign out safely before testing the other identity. Confirm that the customer understands which profile owns the content before making account changes.',
  'A browser downloads a file but the customer cannot find it afterward. Ask which browser they used and whether the download list shows a completed transfer. The file may be in a different folder from the desktop. Use the browser’s download history to open the saved location, then confirm the filename and file type. Do not open an unexpected executable just because it downloaded successfully. If the file came from an untrusted message, pause and verify the sender first.',
  'A customer reports a repeated error but cannot remember its full wording. Ask them to pause at the message and read the code exactly as shown. Note the app, action, and time it appeared. Similar-looking codes can point to different causes, so avoid interpreting an incomplete description. If a screenshot is needed, remind them to hide personal details first. Repeat the issue only when it is safe, then summarize the evidence before choosing a verified troubleshooting path.',
  'A family organizer cannot add a child to a group. Clarify which account is signed in and what message appears during the invitation. Age, region, existing group membership, and account settings may affect the steps. Avoid asking for a child’s password or private verification code. Use the organizer’s official family settings page and confirm the invitation status there. If an account is already linked elsewhere, explain the available support route instead of repeatedly sending invitations.',
  'An update is stuck, and the device is needed for a class soon. Acknowledge the deadline and ask how long the progress has remained unchanged. Check whether the device is still responsive and connected to power. Avoid forcing a shutdown if the update is actively installing. If a restart is clearly safe, explain the risk and the expected wait. Afterward, verify the update status and the customer’s ability to open the class application.',
  'A customer is upset because they have repeated the same story to several agents. Apologize for the repetition and summarize the details already provided. Ask them to correct only what is wrong or add what has changed. This respects their time and gives the next step a clear foundation. Do not claim access to notes that are not available. End the summary with one focused question, then explain what you will do with the answer.',
  'A device is being prepared for resale, and the owner wants to remove personal information. Clarify whether they have already backed up the files and signed out of services they use elsewhere. A reset can remove local content, so confirm the intended outcome before proceeding. Organization-managed devices may need an administrator to release them first. Explain each irreversible step in plain language. Before the owner hands over the device, confirm that setup returns to the expected first-run screen.',
  'A customer asks whether a new Microsoft 365 plan includes a particular feature. Plan names and included benefits can change over time and may vary by region. Ask which account, country, and feature they mean. Check the current official plan comparison rather than relying on memory or an old advertisement. Explain the relevant distinction briefly and avoid listing unrelated benefits. If the account page shows a different entitlement, use that information to guide the next step.',
]

function buildTypingPassage(previous = '') {
  return pickRandom(typingPassages, previous)
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

const advancedReplyScenarios = [
  ['“I’m locked out after changing phones.”', 'I know being locked out is stressful. Let’s use the official recovery options and keep any verification codes private.'],
  ['“My new PC cannot see the family printer.”', 'Let’s check whether both devices use the same network and whether the printer appears in Windows before reinstalling anything.'],
  ['“My files are duplicated in two OneDrive folders.”', 'Let’s compare the folder locations and sync status first. We should avoid deleting either copy until we know which is current.'],
  ['“I need to change the email on my Microsoft account.”', 'Let’s review the account alias options and make sure you have another verified sign-in method before changing anything.'],
  ['“My Xbox subscription benefits disappeared.”', 'Let’s check the signed-in profile, subscription status, and renewal date before you purchase it again.'],
  ['“The app says my trial ended, but I paid yesterday.”', 'I understand the timing is frustrating. Let’s confirm the purchase account and order status, then refresh the app license.'],
  ['“My family member cannot accept the sharing invitation.”', 'Let’s confirm the invited account and current family group, then check whether the invitation is still active.'],
  ['“Windows changed my default browser.”', 'Let’s check the default apps setting and set your preferred browser without changing unrelated file associations.'],
  ['“The laptop fan is loud after an update.”', 'Let’s check whether the update is still completing and which apps are using resources before changing power settings.'],
  ['“I cannot find the file I saved five minutes ago.”', 'Let’s check the app’s recent files and save location first. Do you remember the document name or folder?'],
  ['“My Microsoft account shows a sign-in from another country.”', 'Let’s review the sign-in activity through the official security page and secure the account if the activity is unfamiliar.'],
  ['“I got a text asking for my recovery code.”', 'Please do not reply or share the code. Let’s review account security using the official sign-in page.'],
  ['“My new monitor looks blurry.”', 'Let’s check the display resolution and scaling against the monitor’s recommended settings, then retest the text.'],
  ['“I cannot find the meeting recording.”', 'Let’s confirm who started the recording, which account hosted the meeting, and where that organization stores recordings.'],
  ['“My Word autosave is turned off.”', 'Let’s check whether the file is saved to a supported cloud location and confirm the account before enabling AutoSave.'],
  ['“Excel says the workbook is locked for editing.”', 'Let’s check whether it is open on another device or shared with a teammate before creating another copy.'],
  ['“I think I deleted an email by mistake.”', 'Let’s search the relevant folders and Deleted Items before changing mailbox settings.'],
  ['“My PC is asking for a PIN I do not remember.”', 'Let’s identify whether the prompt is Windows Hello or an app PIN, then use that service’s official reset option.'],
  ['“I cannot install an app because of my region.”', 'Let’s confirm the account region and the app’s availability before changing settings that could affect purchases.'],
  ['“My phone says OneDrive backup is paused.”', 'Let’s check the pause message, account, and connection, then resume only after confirming the customer’s preference.'],
  ['“The customer wants me to take control of their PC.”', 'We can use only the approved support method. I’ll explain what access it provides and continue only with the customer’s informed agreement.'],
  ['“The issue affects several computers at work.”', 'That scope may involve organization settings. Let’s capture affected devices and timing, then involve the customer’s IT administrator.'],
  ['“A refund has not appeared on my statement.”', 'I understand you want a clear update. Let’s check the order status and refund date, then explain the expected processing window shown there.'],
  ['“I was sent a link to verify my Microsoft password.”', 'Please do not use that link yet. Let’s open the account directly through its known official address and check security there.'],
]
const replyQuestionFrames = [
  (customer) => `${customer} Choose the strongest response.`,
  (customer) => `${customer} What should the agent say first?`,
  (customer) => `${customer} Pick the reply with one clear, safe next step.`,
]
replyChallenges.push(...advancedReplyScenarios.flatMap(([customer, bestReply]) => replyQuestionFrames.map((frame) => ({
  prompt: frame(customer),
  options: [bestReply, '“That is your fault. Please try harder.”', '“Delete the app and reset everything immediately.”'],
  answer: 0,
  feedback: 'A strong reply is calm, protects the customer, and gives a specific next step.',
}))))

function MicrosoftMark() {
  return <span className="microsoft-mark" aria-hidden="true"><i /><i /><i /><i /></span>
}

function Brand({ onHome = null }) {
  const content = <><MicrosoftMark /><span><strong>MLTS Consumer Simulator</strong><small>Microsoft learning, made practical</small></span></>
  return onHome ? <button className="brand" onClick={onHome}>{content}</button> : <a className="brand" href="#home">{content}</a>
}

function Header({ onHome = null, theme = 'light', onToggleTheme }) {
  const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? '50 years' : 'light'
  const themeName = theme === 'anniversary' ? '50 years' : theme
  const icon = theme === 'dark' ? '☀' : theme === 'anniversary' ? '✦' : '☾'
  return <header className="topbar"><Brand onHome={onHome} /><button className="theme-toggle" onClick={onToggleTheme} aria-label={`Theme: ${themeName}. Switch to ${nextTheme} mode`} title={`Switch to ${nextTheme} mode`}><span aria-hidden="true">{icon}</span>{themeName === '50 years' ? '50 Years' : `${themeName[0].toUpperCase()}${themeName.slice(1)} mode`}</button></header>
}

const INDIA_HOLIDAY_FALLBACK = {
  '2026-01-14': ['Makara Sankranthi / Pongal', 'festival'],
  '2026-01-26': ['Republic Day', 'national'],
  '2026-03-04': ['Holi', 'festival'],
  '2026-03-21': ['Id-ul-Fitr', 'festival'],
  '2026-03-26': ['Ram Navami', 'festival'],
  '2026-03-31': ['Mahavir Jayanti', 'festival'],
  '2026-04-03': ['Good Friday', 'festival'],
  '2026-05-01': ['Buddha Purnima', 'festival'],
  '2026-05-27': ['Id-ul-Zuha (Bakrid)', 'festival'],
  '2026-06-26': ['Muharram', 'festival'],
  '2026-08-15': ['Independence Day', 'national'],
  '2026-08-26': ['Milad-un-Nabi', 'festival'],
  '2026-09-04': ['Janmashtami', 'festival'],
  '2026-09-14': ['Ganesh Chaturthi', 'festival'],
  '2026-10-02': ['Gandhi Jayanti', 'national'],
  '2026-10-20': ['Dussehra', 'festival'],
  '2026-11-08': ['Diwali', 'festival'],
  '2026-11-24': ['Guru Nanak Jayanti', 'festival'],
  '2026-12-25': ['Christmas Day', 'festival'],
}

const MICROSOFT_MILESTONES = {
  '04-04': { name: 'Microsoft was founded · 1975', product: 'Microsoft', tone: 'anniversary' },
  '06-19': { name: 'Office for Mac launched · 1989', product: 'Office', tone: 'office' },
  '08-24': { name: 'Windows 95 launched · 1995', product: 'Windows', tone: 'windows' },
  '09-01': { name: 'Microsoft Research began · 1991', product: 'Research', tone: 'research' },
  '10-05': { name: 'Windows 11 became available · 2021', product: 'Windows', tone: 'windows' },
  '11-15': { name: 'Xbox launched · 2001', product: 'Xbox', tone: 'xbox' },
}

function dateKeyForIndia(epoch) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date(epoch))
  const value = Object.fromEntries(parts.map(({ type, value: part }) => [type, part]))
  return `${value.year}-${value.month}-${value.day}`
}

function IndiaDayBox() {
  const [clock, setClock] = useState(null)
  const [holidayResult, setHolidayResult] = useState(null)
  const [time, setTime] = useState(null)
  const [syncError, setSyncError] = useState(false)
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    let active = true
    async function syncFromInternet() {
      try {
        const response = await fetch('https://timeapi.io/api/Time/current/zone?timeZone=Asia%2FKolkata', { cache: 'no-store' })
        if (!response.ok) throw new Error('Clock request failed')
        const data = await response.json()
        const hasZone = /(?:Z|[+-]\d{2}:\d{2})$/i.test(data.dateTime || '')
        const instant = hasZone ? Date.parse(data.dateTime) : Date.UTC(data.year, data.month - 1, data.day, data.hour, data.minute, data.seconds || 0) - 330 * 60 * 1000
        if (!Number.isFinite(instant)) throw new Error('Clock response was incomplete')
        if (!active) return
        setClock({ instant })
        setTime(instant)
        setSyncError(false)
        const year = Number(new Intl.DateTimeFormat('en', { timeZone: 'Asia/Kolkata', year: 'numeric' }).format(new Date(instant)))
        try {
          const holidays = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/IN`, { cache: 'no-store' })
          if (!holidays.ok) throw new Error('Holiday lookup failed')
          const events = await holidays.json()
          if (active && Array.isArray(events)) setHolidayResult({ year, events })
        } catch {
          if (active) setHolidayResult({ year, events: [] })
        }
      } catch {
        if (active) setSyncError(true)
      }
    }
    syncFromInternet()
    const syncTimer = window.setInterval(syncFromInternet, 30 * 60 * 1000)
    const minuteTimer = window.setInterval(() => setTime((value) => value === null ? value : value + 60 * 1000), 60 * 1000)
    return () => { active = false; window.clearInterval(syncTimer); window.clearInterval(minuteTimer) }
  }, [retry])

  const now = clock ? time ?? clock.instant : null
  const dateKey = now ? dateKeyForIndia(now) : ''
  const holiday = holidayResult?.year === Number(dateKey.slice(0, 4))
    ? holidayResult.events.find((event) => event.date === dateKey)
    : null
  const fallback = INDIA_HOLIDAY_FALLBACK[dateKey]
  const milestone = dateKey ? MICROSOFT_MILESTONES[dateKey.slice(5)] : null
  const eventName = holiday?.localName || holiday?.name || fallback?.[0]
  const eventKey = (eventName || '').toLowerCase()
  const eventTone = eventName
    ? eventKey.includes('holi') ? 'holi'
      : eventKey.includes('diwali') || eventKey.includes('deepavali') ? 'diwali'
        : eventKey.includes('eid') || eventKey.includes('id-ul') || eventKey.includes('bakrid') || eventKey.includes('muharram') ? 'eid'
          : eventKey.includes('christmas') ? 'christmas'
            : eventKey.includes('republic') || eventKey.includes('independence') || eventKey.includes('gandhi') ? 'national'
              : 'festival'
    : milestone?.tone || 'quiet'
  const dateText = now ? new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(now)) : ''

  return <section className="india-day-box" data-vibe={eventTone} aria-label="India calendar and Microsoft milestones">
    <div className="india-date-face"><span className="india-date-label">TODAY · INDIA</span>{now ? <><strong>{new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit' }).format(new Date(now))}</strong><span>{new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', month: 'long', year: 'numeric' }).format(new Date(now))}</span></> : <strong className="india-date-loading">···</strong>}</div>
    <div className="india-day-copy"><span className="eyebrow">{syncError ? 'India calendar · offline' : 'India · live calendar'}</span><h2>{syncError ? 'Date sync unavailable' : eventName || milestone?.name || dateText || 'Syncing India time…'}</h2>
      {syncError && <button className="india-retry" onClick={() => setRetry((value) => value + 1)}>Retry sync</button>}
      {eventName && milestone && <p className="india-milestone">{milestone.name}</p>}
    </div>
    <div className="india-anniversary"><span aria-hidden="true">✦</span><strong>Microsoft</strong><small>50 Years</small></div>
  </section>
}

function InfoPage({ kind, onBack }) {
  if (kind === 'team') {
    const members = [
      { name: 'Mohammed Inam Ul Hassan', initials: 'IH', photo: '/team-inam.png' },
      { name: 'Mohammed Yasir Hasan', initials: 'YH', photo: '/team-yasir.png' },
      { name: 'Ganaraj Nayak', initials: 'GN', photo: '/team-ganaraj.png' },
    ]
    return <main className="info-page team-page"><button className="back-button" onClick={onBack}>← Learning hub</button><div className="page-heading"><span className="eyebrow">Microsoft · Consumer support</span><h1>Meet the Team</h1></div><section className="team-context"><MicrosoftMark /><div><strong>RFO Technical Tier 3</strong><span>Global Escalation Engineers for Consumer</span></div><span className="team-context-tag">MICROSOFT</span></section><section className="team-grid" aria-label="Team members">{members.map((member, index) => <article className="team-member-card" style={{ '--member-order': index }} key={member.name}><div className="team-portrait"><img src={member.photo} alt={`${member.name} profile portrait`} /><span className="team-initials">{member.initials}</span></div><div className="team-member-copy"><span className="team-member-label">Team Member {index + 1}</span><h2>{member.name}</h2><p>RFO Technical Tier 3</p><span className="team-member-org">Global Escalation Engineer · Consumer</span></div><span className="team-card-spark" aria-hidden="true">✦</span></article>)}</section></main>
  }

  const entries = [
    ['Microsoft 50 Years', 'Microsoft began in 1975 and celebrated 50 years in 2025. This theme highlights the company’s history and the products people use today.'],
    ['Typing Master', 'Build typing speed and accuracy with a fresh passage and a timed practice run.'],
    ['Fix for the Day', 'Learn one support concept at a time through a short, collectible-style scenario card.'],
    ['Skyfall', 'A quick game break that adds movement, focus, and a little challenge to the learning hub.'],
    ['Reply Remix', 'Practice choosing clear, empathetic replies and useful next steps for customer situations.'],
    ['Customer Chat Simulator', 'Use a Copilot Studio conversation to practise listening, clarifying, and guiding a customer. It is a training simulation, not a live support channel.'],
    ['Quiz Gauntlet', 'Explore consumer Microsoft products through quiz prompts that encourage recall and discussion.'],
  ]
  return <main className="info-page"><button className="back-button" onClick={onBack}>← Learning hub</button><div className="page-heading"><span className="eyebrow">A quick guide</span><h1>Website Manual</h1><p>What each feature is for and how to use it.</p></div><section className="manual-grid">{entries.map(([title, description], index) => <article className="manual-card" key={title}><span>{String(index + 1).padStart(2, '0')}</span><div><h2>{title}</h2><p>{description}</p></div></article>)}</section></main>
}

function TypingSprint({ onBack }) {
  const [typingText, setTypingText] = useState(buildTypingPassage)
  const inputRef = useRef(null)
  const startedAtRef = useRef(0)
  const finishedAtRef = useRef(0)
  const [started, setStarted] = useState(false)
  const duration = 90
  const [seconds, setSeconds] = useState(90)
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
  function reset() { startedAtRef.current = 0; finishedAtRef.current = 0; setStarted(false); setFinished(false); setSeconds(90); setTyped(''); setTypingText((current) => buildTypingPassage(current)) }
  function updateTyped(value) {
    const next = value.slice(0, typingText.length)
    if (!started && next.length > 0) { startedAtRef.current = Date.now(); finishedAtRef.current = 0; setStarted(true) }
    setTyped(next)
    if (next.length >= typingText.length) { finishedAtRef.current = Date.now(); setFinished(true) }
  }

  return <div className="activity-page"><button className="back-button" onClick={onBack}>← All activities</button><div className="page-heading"><span className="eyebrow">90-second typing test</span><h1>Typing Master</h1><p>Start typing when you’re ready. Speed and accuracy update live.</p></div><section className="activity-panel typing-panel">
    <div className="typing-toolbar"><span className="typing-session-label">ONE-MINUTE-THIRTY TEST</span><span className={`typing-clock ${seconds <= 10 && started ? 'urgent' : ''}`}>◷ {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}</span></div>
    <div className="typing-stats"><div><span>Speed</span><strong>{wpm} <small>WPM</small></strong></div><div><span>Accuracy</span><strong>{accuracy}<small>%</small></strong></div><div><span>Typed</span><strong>{typed.length}<small> chars</small></strong></div></div>
    <div className={`typing-stage ${started && !finished ? 'is-typing' : ''}`} onClick={() => inputRef.current?.focus()} role="group" aria-label="Typing passage; type the highlighted text to start the test"><p className="typing-copy">{[...typingText].map((char, index) => { const state = index < typed.length ? (typed[index] === char ? 'correct-char' : 'wrong-char') : index === typed.length && !finished ? 'current-char' : ''; return <span key={index} className={state}>{char}</span> })}</p><textarea ref={inputRef} className="typing-capture" aria-label="Type the passage shown above; the timer begins with your first keystroke" value={typed} onChange={(event) => updateTyped(event.target.value)} onPaste={(event) => event.preventDefault()} onKeyDown={(event) => { if (event.key === 'Tab') event.preventDefault() }} disabled={finished} autoCapitalize="off" autoCorrect="off" spellCheck="false" /></div>
    <div className="typing-actions"><span>{started && !finished ? 'Keep going — every character counts.' : 'The clock starts on your first keystroke.'}</span><button className="button-secondary" onClick={reset}>↻ New passage</button></div>
    {finished && <div className="typing-result typing-finish" role="status"><strong>🏅 {badge} earned</strong><span>You typed <b>{wpm} WPM</b> with <b>{accuracy}% accuracy</b> in {Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, '0')}.</span></div>}
  </section></div>
}

function ReplyRemix({ onBack }) {
  const [choice, setChoice] = useState(null)
  const [round, setRound] = useState(1)
  const [score, setScore] = useState(0)
  const [session, setSession] = useState(() => {
    const deck = shuffle(replyChallenges)
    return { deck, index: 0, challenge: makeRound({ rounds: [deck[0]] }) }
  })
  const challenge = session.challenge
  function choose(index) { if (choice !== null) return; setChoice(index); if (index === challenge.answer) setScore((value) => value + 1) }
  function next() {
    setSession((current) => {
      let deck = current.deck
      let index = current.index + 1
      if (index >= deck.length) { deck = shuffle(replyChallenges.filter((item) => item.prompt !== current.challenge.prompt)); index = 0 }
      return { deck, index, challenge: makeRound({ rounds: [deck[index]] }) }
    })
    setRound((value) => value + 1)
    setChoice(null)
  }
  return <div className="activity-page"><button className="back-button" onClick={onBack}>← All activities</button><div className="page-heading"><span className="eyebrow">100+ randomized scenarios</span><h1>Reply Remix</h1><p>Choose the clearest, most helpful response.</p></div><section className="activity-panel challenge-panel"><div className="challenge-meta"><span>Round {round} · {session.index + 1} of {session.deck.length}</span><span>Good replies {score}</span></div><h2>{challenge.prompt}</h2><div className="answer-options">{challenge.options.map((option, index) => <button key={option} className={choice !== null && index === challenge.answer ? 'correct' : (choice === index ? 'incorrect' : '')} onClick={() => choose(index)} disabled={choice !== null}><span className="option-letter">{String.fromCharCode(65 + index)}</span>{option}</button>)}</div>{choice !== null && <div className={`answer-feedback ${choice === challenge.answer ? 'good' : 'try-again'}`} role="status"><strong>{choice === challenge.answer ? 'That lands well!' : 'Try a more supportive opener.'}</strong><span>{challenge.feedback}</span></div>}<button className="button-primary next-button" onClick={next}>Next round <span aria-hidden="true">→</span></button></section></div>
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
      gusts: [{ x: 690, y: 355, width: 170, phase: 1.4 }],
      boosts: [{ x: 335, y: 250, phase: 0 }], shield: 0,
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
      const hitHazard = game.hazards.findIndex((hazard) => Math.abs(hazard.y - (playerY + 6)) < hazard.radius + 14 && Math.abs(hazard.x - game.playerX) < hazard.radius + 12)
      if (hitHazard >= 0) {
        if (game.shield) { game.shield = 0; game.hazards.splice(hitHazard, 1); game.flash = 0.8 }
        else { finish('A storm cloud clipped your parachute.'); return }
      }

      game.gusts.forEach((gust) => { gust.y -= speed * dt * 0.8; gust.phase += dt * (1.2 + game.score * .025) })
      game.gusts = game.gusts.filter((gust) => gust.y > -90)
      game.gusts.forEach((gust) => {
        if (Math.abs(gust.y - playerY) < 32 && Math.abs(game.playerX - gust.x) < gust.width / 2) game.playerX += Math.sin(gust.phase) * (115 + game.score * 2) * dt
      })
      game.playerX = Math.max(44, Math.min(width - 44, game.playerX))
      game.boosts.forEach((boost) => { boost.y -= speed * dt * .88; boost.phase += dt * 3 })
      const boostHit = game.boosts.findIndex((boost) => Math.abs(boost.y - (playerY + 18)) < 35 && Math.abs(boost.x - game.playerX) < 36)
      if (boostHit >= 0) { game.shield = 1; game.boosts.splice(boostHit, 1); game.flash = 0.65 }
      game.boosts = game.boosts.filter((boost) => boost.y > -45)

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
          if (game.score % 2 === 0) game.gusts.push({ x: 100 + Math.random() * (width - 200), y: nextY - 205, width: 120 + Math.random() * 90, phase: Math.random() * Math.PI * 2 })
          if (game.score % 3 === 1) game.boosts.push({ x: 90 + Math.random() * (width - 180), y: nextY - 330, phase: Math.random() * 6 })
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

      // Layered ridgelines and converging tracks create a perspective flight corridor.
      context.fillStyle = 'rgba(83,145,166,.24)'
      context.beginPath(); context.moveTo(0, 300); context.lineTo(135, 264); context.lineTo(245, 294); context.lineTo(378, 248); context.lineTo(520, 292); context.lineTo(682, 255); context.lineTo(828, 296); context.lineTo(960, 258); context.lineTo(960, 540); context.lineTo(0, 540); context.fill()
      context.fillStyle = 'rgba(255,255,255,.13)'
      context.beginPath(); context.moveTo(0, 335); context.lineTo(130, 303); context.lineTo(276, 327); context.lineTo(430, 295); context.lineTo(570, 330); context.lineTo(740, 296); context.lineTo(960, 332); context.lineTo(960, 540); context.lineTo(0, 540); context.fill()
      context.strokeStyle = 'rgba(255,255,255,.12)'; context.lineWidth = 1
      for (let lane = -4; lane <= 4; lane += 1) { context.beginPath(); context.moveTo(480 + lane * 8, 245); context.lineTo(480 + lane * 148, height); context.stroke() }
      for (let grid = 0; grid < 5; grid += 1) { const y = 285 + grid * grid * 16 + ((game?.elapsed || 0) * 34 % 72); context.beginPath(); context.moveTo(0, y); context.quadraticCurveTo(480, y - 25, width, y); context.stroke() }

      if (game) {
        game.gusts.forEach((gust) => {
          const wobble = Math.sin(gust.phase) * 18
          context.fillStyle = 'rgba(96,210,226,.14)'
          context.beginPath(); context.moveTo(gust.x - gust.width / 2, gust.y); context.lineTo(gust.x + gust.width / 2, gust.y - 12); context.lineTo(gust.x + gust.width / 2 - 24, gust.y + 62); context.lineTo(gust.x - gust.width / 2 - 24, gust.y + 74); context.closePath(); context.fill()
          context.strokeStyle = 'rgba(89,193,218,.72)'; context.lineWidth = 3; context.setLineDash([12, 8])
          context.beginPath(); context.moveTo(gust.x - gust.width / 2 + wobble, gust.y + 12); context.bezierCurveTo(gust.x - 25, gust.y + 42, gust.x + 35, gust.y + 4, gust.x + gust.width / 2 - 15, gust.y + 42); context.stroke(); context.setLineDash([])
        })
        game.boosts.forEach((boost) => {
          const bob = Math.sin(boost.phase) * 5
          context.save(); context.translate(boost.x, boost.y + bob); context.rotate(boost.phase * .4)
          context.shadowColor = '#ffe18a'; context.shadowBlur = 16; context.strokeStyle = '#ffe18a'; context.lineWidth = 6
          context.beginPath(); context.ellipse(0, 0, 18, 25, 0, 0, Math.PI * 2); context.stroke(); context.shadowBlur = 0
          context.fillStyle = '#fff4c6'; context.beginPath(); context.arc(0, 0, 4, 0, Math.PI * 2); context.fill(); context.restore()
        })
        game.hazards.forEach((hazard) => {
          drawCloud(hazard.x, hazard.y, .95, '#63748b')
          context.strokeStyle = '#ffd35f'; context.lineWidth = 5; context.lineCap = 'round'
          context.beginPath(); context.moveTo(hazard.x + 2, hazard.y - 2); context.lineTo(hazard.x - 5, hazard.y + 9); context.lineTo(hazard.x + 2, hazard.y + 9); context.lineTo(hazard.x - 2, hazard.y + 19); context.stroke()
        })
        const target = game.target
        if (target) {
          const left = target.x - target.width / 2; const right = target.x + target.width / 2; const depth = 22; const lip = 12
          context.fillStyle = 'rgba(21,45,52,.3)'; context.beginPath(); context.ellipse(target.x - 8, target.y + 22, target.width * .62, 18, 0, 0, Math.PI * 2); context.fill()
          context.fillStyle = '#176b58'; context.beginPath(); context.moveTo(left, target.y); context.lineTo(right, target.y); context.lineTo(right - depth, target.y + lip); context.lineTo(left - depth, target.y + lip); context.closePath(); context.fill()
          context.fillStyle = '#125044'; context.beginPath(); context.moveTo(left - depth, target.y + lip); context.lineTo(right - depth, target.y + lip); context.lineTo(right - depth, target.y + lip + target.height); context.lineTo(left - depth, target.y + lip + target.height); context.closePath(); context.fill()
          context.fillStyle = game.flash > 0 ? '#fff4b5' : '#38a76b'; context.beginPath(); context.moveTo(left, target.y); context.lineTo(right, target.y); context.lineTo(right - depth, target.y + lip); context.lineTo(left - depth, target.y + lip); context.closePath(); context.fill()
          context.strokeStyle = '#baf77a'; context.lineWidth = 3; context.beginPath(); context.moveTo(left + 5, target.y + 2); context.lineTo(right - 4, target.y + 2); context.stroke()
          for (let i = 0; i < 5; i++) { context.fillStyle = 'rgba(255,255,255,.55)'; context.fillRect(left - depth + 12 + i * 27, target.y + 6, 12, 2) }
        }
        // Parachute canopy, suspension lines, and a compact skydiver sprite.
        const x = game.playerX
        const canopyY = playerY - 33
        context.strokeStyle = 'rgba(37,60,82,.7)'; context.lineWidth = 2
        context.beginPath(); context.moveTo(x - 26, canopyY + 3); context.lineTo(x - 8, playerY + 2); context.moveTo(x + 26, canopyY + 3); context.lineTo(x + 8, playerY + 2); context.stroke()
        const canopy = context.createLinearGradient(x - 30, canopyY - 34, x + 25, canopyY + 8); canopy.addColorStop(0, '#ff9c63'); canopy.addColorStop(.55, '#ee6148'); canopy.addColorStop(1, '#b83c55')
        context.fillStyle = canopy; context.beginPath(); context.moveTo(x - 38, canopyY + 4); context.quadraticCurveTo(x - 31, canopyY - 38, x, canopyY - 36); context.quadraticCurveTo(x + 31, canopyY - 38, x + 38, canopyY + 4); context.quadraticCurveTo(x, canopyY + 16, x - 38, canopyY + 4); context.fill()
        context.fillStyle = '#ffd166'; context.beginPath(); context.moveTo(x - 5, canopyY - 34); context.quadraticCurveTo(x + 20, canopyY - 32, x + 37, canopyY + 4); context.quadraticCurveTo(x + 12, canopyY + 11, x - 5, canopyY + 7); context.fill()
        context.strokeStyle = '#fff4df'; context.lineWidth = 1.5; context.beginPath(); context.moveTo(x - 22, canopyY + 7); context.lineTo(x - 5, playerY + 2); context.moveTo(x + 22, canopyY + 7); context.lineTo(x + 5, playerY + 2); context.stroke()
        context.fillStyle = '#f6ba86'; context.beginPath(); context.arc(x, playerY + 8, 8, 0, Math.PI * 2); context.fill()
        context.fillStyle = '#36587a'; context.fillRect(x - 9, playerY + 15, 18, 19)
        context.strokeStyle = '#243b55'; context.lineWidth = 4; context.beginPath(); context.moveTo(x - 5, playerY + 31); context.lineTo(x - 10, playerY + 40); context.moveTo(x + 5, playerY + 31); context.lineTo(x + 10, playerY + 40); context.stroke()
        context.fillStyle = '#fff'; context.font = '700 15px Inter, sans-serif'; context.fillText(`LANDINGS  ${game.score}`, 24, 34)
        context.fillStyle = '#31546d'; context.font = '600 12px Inter, sans-serif'; context.fillText(`DESCENT SPEED  ${Math.round(112 + game.score * 5 + 150 * (1 - Math.exp(-game.score / 12)))}`, 24, 54)
        context.fillStyle = game.shield ? '#fff0a7' : 'rgba(255,255,255,.76)'; context.font = '700 11px Inter, sans-serif'; context.fillText(game.shield ? '✦ WIND SHIELD READY' : '✦ FIND A GOLD RING FOR A SHIELD', 24, 74)
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

  return <div className="activity-page"><button className="back-button" onClick={onBack}>← All activities</button><div className="page-heading"><span className="eyebrow">3D-style descent · endless run</span><h1>Skyfall</h1><p>Land, dodge wind and storms, and grab a gold ring for one shield.</p></div><section className="skyfall-panel"><div className="skyfall-hud"><div><span>Landings</span><strong>{score}</strong></div><div><span>Run status</span><strong>{status === 'running' ? 'In the air' : status === 'over' ? 'Run over' : 'Ready to drop'}</strong></div><span className="skyfall-no-save">No scores saved</span></div><div className="skyfall-stage"><canvas ref={canvasRef} width="960" height="540" aria-label="Perspective parachute game with raised platforms, wind gates, storm clouds, and shield rings" />{status !== 'running' && <div className="skyfall-overlay"><div className="skyfall-overlay-card"><span className="skyfall-emoji">{status === 'over' ? '💥' : '🪂'}</span><strong>{status === 'over' ? 'Drop complete' : 'Ready to drop?'}</strong><span>{status === 'over' ? `${gameRef.current?.reason || 'Run ended.'} Landings: ${score}.` : 'Use ← → or A / D. Touch arrows work on mobile.'}</span><button className="button-primary" onClick={startGame}>{status === 'over' ? 'Try again' : 'Start descent'} <span>→</span></button></div></div>}</div><div className="skyfall-mobile-controls"><button onPointerDown={(event) => { event.preventDefault(); holdDirection('left', true) }} onPointerUp={() => holdDirection('left', false)} onPointerCancel={() => holdDirection('left', false)} onPointerLeave={() => holdDirection('left', false)} aria-label="Steer left">←</button><span>STEER</span><button onPointerDown={(event) => { event.preventDefault(); holdDirection('right', true) }} onPointerUp={() => holdDirection('right', false)} onPointerCancel={() => holdDirection('right', false)} onPointerLeave={() => holdDirection('right', false)} aria-label="Steer right">→</button></div><p className="skyfall-caption">Miss a platform or hit a storm without a shield and the run ends.</p></section></div>
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

const FIX_CARD_EPOCH = Date.UTC(2026, 8, 30)
const FIX_CARD_SEED = 0x4d4c5453

function seededRandom(seed) {
  let value = seed >>> 0
  return () => {
    value += 0x6D2B79F5
    let mixed = value
    mixed = Math.imul(mixed ^ (mixed >>> 15), mixed | 1)
    mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61)
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296
  }
}

function fixCardOrder(cycle) {
  const random = seededRandom((FIX_CARD_SEED + Math.imul(cycle + 1, 0x9E3779B1)) >>> 0)
  const order = fixCards.map((_, index) => index)
  for (let index = order.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1))
    ;[order[index], order[swapIndex]] = [order[swapIndex], order[index]]
  }
  return order
}

function sharedFixSlotAt(timestamp = Date.now()) {
  const elapsed = Math.max(0, Math.floor((timestamp - FIX_CARD_EPOCH) / 1000))
  let interval = 0
  let elapsedInSchedule = 0
  let duration = 300 + Math.floor(seededRandom((FIX_CARD_SEED + Math.imul(interval + 1, 0x85EBCA6B)) >>> 0)() * 301)
  while (elapsedInSchedule + duration <= elapsed) {
    elapsedInSchedule += duration
    interval += 1
    duration = 300 + Math.floor(seededRandom((FIX_CARD_SEED + Math.imul(interval + 1, 0x85EBCA6B)) >>> 0)() * 301)
  }
  const cycle = Math.floor(interval / fixCards.length)
  const position = interval % fixCards.length
  return {
    index: fixCardOrder(cycle)[position],
    changesAt: FIX_CARD_EPOCH + (elapsedInSchedule + duration) * 1000,
  }
}

function ProductGlyph({ product }) {
  if (product === 'Windows') return <span className="fix-windows-mark" aria-label="Windows logo"><i /><i /><i /><i /></span>
  if (product === 'Word' || product === 'Excel' || product === 'PowerPoint' || product === 'Outlook') return <span className={`fix-app-mark fix-${product.toLowerCase()}`}>{product === 'PowerPoint' ? 'P' : product[0]}</span>
  if (product === 'OneDrive') return <span className="fix-cloud-mark">☁</span>
  return <span className="fix-ms-mark" aria-label="Microsoft logo"><i /><i /><i /><i /></span>
}

function FixOfTheDay() {
  const [slot, setSlot] = useState(() => sharedFixSlotAt())
  const card = fixCards[slot.index]
  const accent = ({ Windows: '#1689e8', Word: '#185abd', Excel: '#107c41', PowerPoint: '#c43e1c', Outlook: '#0078d4', OneDrive: '#2b9bea', 'Microsoft 365': '#8764d8', 'Microsoft Defender': '#4b9b73', 'Microsoft Teams': '#6264a7', 'Microsoft account': '#1689e8', 'Microsoft billing': '#c9822b', 'Microsoft Store': '#43a77a', 'Family Safety': '#b76eac', 'Business licensing': '#687f98', 'Remote Desktop Services': '#7d70cb', Sales: '#29998d', Support: '#597a99' })[card.product] || '#6ba8e8'
  useEffect(() => {
    const timer = window.setInterval(() => {
      const timestamp = Date.now()
      setSlot((current) => timestamp >= current.changesAt ? sharedFixSlotAt(timestamp) : current)
    }, 1000)
    return () => window.clearInterval(timer)
  }, [])

  return <section className="fix-deck-section" id="fix-of-the-day" aria-labelledby="fix-deck-title">
    <div className="fix-deck-heading"><div><span className="eyebrow">One useful skill · shuffled every 5–10 minutes</span><h2 id="fix-deck-title">Fix for the Day</h2><p>A collectible-style learning card for real support conversations.</p></div></div>
    <article className="fix-card" key={`${card.id}-${slot.changesAt}`} style={{ '--card-accent': accent }}>
      <div className="fix-card-top"><div className="fix-product"><span className="fix-logo-tile"><ProductGlyph product={card.product} /></span><span><small>PRODUCT CARD</small><strong>{card.product}</strong></span></div></div>
      <div className="fix-card-title-row"><div><span className="fix-card-kicker">FIELD GUIDE · {card.product.toUpperCase()}</span><h3>{card.subject}</h3></div><span className="fix-read-time">◷ {card.minutes} min read</span></div>
      <div className="fix-learning-objective"><span>LEARNING OBJECTIVE</span><p>{card.objective}</p></div>
      <div className="fix-knowledge-grid">
        <section><span>THE KNOWLEDGE</span><p>{card.knowledge}</p></section>
        <section><span>KEY TERM</span><strong>{card.keyTerm}</strong></section>
        <section><span>KNOW THIS</span><p>{card.knowThis}</p></section>
        <section><span>PRO TIP</span><p>{card.tip}</p></section>
      </div>
      <div className="fix-scenario"><span>🎧 CUSTOMER SCENARIO</span><p>“{card.scenario}”</p></div>
    </article>
    <p className="fix-deck-note">The card rotates automatically on a shared 5–10 minute schedule. The full deck reshuffles after each cycle.</p>
  </section>
}

function App() {
  const [activeSimulator, setActiveSimulator] = useState(null)
  const [activeGame, setActiveGame] = useState(null)
  const [infoPage, setInfoPage] = useState(null)
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

  const toggleTheme = () => setTheme((current) => current === 'light' ? 'dark' : current === 'dark' ? 'anniversary' : 'light')
  const spotlights = [
    { eyebrow: 'Practice · customer care', title: 'Customer Chat Simulator', text: 'Build calm, clear customer conversations with a realistic simulator.', label: 'Start a conversation', action: () => setActiveSimulator('customer') },
    { eyebrow: 'Play · endless landing challenge', title: 'Skyfall', text: 'Steer your parachutist, land on each platform, and dodge storm clouds.', label: 'Start the descent', action: () => setActiveGame('skyfall') },
    { eyebrow: 'Practice · consumer Microsoft', title: 'Quiz Gauntlet', text: 'Explore everyday Microsoft products with your quiz simulator.', label: 'Start the quiz', action: () => setActiveSimulator('quiz') },
    { eyebrow: 'Practice · typing lab', title: 'Typing Master', text: 'A 90-second typing test with live speed and accuracy.', label: 'Start typing', action: () => setActiveGame('typing') },
  ]
  const spotlight = spotlights[spotlightIndex]
  useEffect(() => {
    if (spotlightPaused || activeGame || activeSimulator || infoPage) return undefined
    const timer = window.setInterval(() => setSpotlightIndex((index) => (index + 1) % spotlights.length), 5200)
    return () => window.clearInterval(timer)
  }, [spotlightPaused, activeGame, activeSimulator, infoPage])

  if (infoPage) return <div className="app-shell"><Header onHome={() => setInfoPage(null)} theme={theme} onToggleTheme={toggleTheme} /><InfoPage kind={infoPage} onBack={() => setInfoPage(null)} /><footer><div><strong>MLTS Consumer Simulator</strong><span>Microsoft learning, made practical.</span></div></footer></div>

  if (activeSimulator) {
    const simulator = simulators[activeSimulator]
    return <div className="app-shell"><Header onHome={() => setActiveSimulator(null)} theme={theme} onToggleTheme={toggleTheme} /><main className="simulator-page"><button className="back-button" onClick={() => setActiveSimulator(null)}>← Learning hub</button><section className="simulator-intro"><span className="eyebrow">{simulator.label}</span><div className="simulator-icon">{simulator.icon}</div><h1>{simulator.title}</h1><p>{simulator.description}</p><span className="chat-compat-note">Copilot Studio chat.</span></section><section className="simulator-frame"><iframe title={simulator.title} src={simulator.url} allow="microphone; clipboard-read; clipboard-write" /></section></main></div>
  }
  if (activeGame) {
    const Game = activeGame === 'typing' ? TypingSprint : activeGame === 'skyfall' ? SkyDropGame : ReplyRemix
    return <div className="app-shell"><Header onHome={() => setActiveGame(null)} theme={theme} onToggleTheme={toggleTheme} /><main><Game onBack={() => setActiveGame(null)} /></main></div>
  }

  const simulatorsList = [
    { id: 'customer', icon: '💬', tag: 'Talk it out', title: 'Customer Chat Simulator', text: 'Practice listening, empathy, and clear next steps in a realistic chat.' },
    { id: 'quiz', icon: '✦', tag: 'Ask & learn', title: 'Quiz Gauntlet', text: 'Explore consumer Microsoft products with your Copilot Studio quiz.' },
  ]
  const games = [
    { id: 'typing', icon: '⌨️', tag: '90 seconds', title: 'Typing Master', text: 'Type a fresh passage. See your speed, accuracy, and badge.' },
    { id: 'skyfall', icon: '🪂', tag: '3D-style landing game', title: 'Skyfall', text: 'Land, collect shields, and dodge wind and storms.' },
    { id: 'reply', icon: '💌', tag: '100+ scenarios', title: 'Reply Remix', text: 'Choose a clear, customer-first response.' },
  ]

  return <div className="app-shell"><Header theme={theme} onToggleTheme={toggleTheme} /><main id="home"><IndiaDayBox /><section className="hero" onMouseEnter={() => setSpotlightPaused(true)} onMouseLeave={() => setSpotlightPaused(false)} onFocusCapture={() => setSpotlightPaused(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setSpotlightPaused(false) }}><div className="hero-copy" key={spotlightIndex}><span className="eyebrow light">{spotlight.eyebrow}</span><h1>{spotlight.title}</h1><p>{spotlight.text}</p><div className="hero-actions"><button className="button-primary" onClick={spotlight.action}>{spotlight.label} <span aria-hidden="true">→</span></button><span className="tiny-note">MLTS Consumer Simulator · Practice at your pace</span></div></div><div className="hero-sticker"><span className="sticker-spark">✦</span><strong>Explore the hub</strong><div><span>01</span> Practice</div><div><span>02</span> Play</div><div><span>03</span> Build skills</div><div className="spotlight-dots"><span>{spotlightIndex + 1} / {spotlights.length}</span>{spotlights.map((item, index) => <button key={item.title} aria-label={`Show ${item.title}`} aria-current={spotlightIndex === index ? 'true' : undefined} onClick={() => setSpotlightIndex(index)} />)}</div></div></section>
    <section className="games-section" id="activities"><div className="section-heading"><div><span className="eyebrow">Tiny games, real skills</span><h2>Quick play</h2></div><p>Build a skill in a few minutes.</p></div><div className="game-grid">{games.map((item) => <article className="game-card" key={item.id}><div className="game-card-top"><span className="game-icon">{item.icon}</span><span className="card-tag">{item.tag}</span></div><h3>{item.title}</h3><p>{item.text}</p><button className="game-launch" onClick={() => setActiveGame(item.id)}>Play now <span aria-hidden="true">↗</span></button></article>)}</div></section>
    <section className="learning-section" id="simulators"><div className="section-heading"><div><span className="eyebrow">MLTS Consumer Simulator</span><h2>Practice with people skills</h2></div><p>Realistic conversations and product knowledge, at your pace.</p></div><div className="module-grid">{simulatorsList.map((item, index) => <article className={`module-card module-${index + 1}`} key={item.id}><div className="card-top"><span className="module-icon">{item.icon}</span><span className="card-tag">{item.tag}</span></div><h3>{item.title}</h3><p>{item.text}</p><button onClick={() => setActiveSimulator(item.id)}>{item.id === 'customer' ? 'Start simulator' : 'Start Quiz Gauntlet'} <span aria-hidden="true">→</span></button></article>)}</div></section>
    <FixOfTheDay />
    <footer><div><strong>MLTS Consumer Simulator</strong><span>Microsoft learning, made practical.</span></div><nav className="footer-links" aria-label="More information"><button onClick={() => setInfoPage('manual')}>Manual</button><button onClick={() => setInfoPage('team')}>Meet the Team</button></nav><span>Practice at your pace.</span></footer>
  </main></div>
}

export default App
