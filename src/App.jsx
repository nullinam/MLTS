import { useEffect, useRef, useState, useSyncExternalStore } from 'react'

const DESKTOP_MEDIA_QUERY = '(min-width: 768px) and (hover: hover) and (pointer: fine)'

function subscribeToDesktopMode(onChange) {
  const mediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY)
  mediaQuery.addEventListener('change', onChange)
  return () => mediaQuery.removeEventListener('change', onChange)
}

function getDesktopMode() {
  return window.matchMedia(DESKTOP_MEDIA_QUERY).matches
}

function DesktopOnlyNotice() {
  return <main className="desktop-only-page"><section className="desktop-only-card" aria-labelledby="desktop-only-title"><span className="desktop-only-icon" aria-hidden="true">▣</span><span className="eyebrow">MLTS Consumer Simulator</span><h1 id="desktop-only-title">Desktop browser required</h1><p>This learning hub is designed for desktop use. Open it on a laptop or desktop browser to continue.</p></section></main>
}

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
  ['“My laptop battery drains while it is asleep.”', 'Let’s compare the battery use and sleep settings, then check whether a connected accessory or app is keeping the device active.'],
  ['“I see a charge from Microsoft but do not recognize it.”', 'I can help you identify it safely. Let’s review the order history on the account without sharing card numbers or security codes.'],
  ['“My child cannot join a multiplayer game.”', 'Let’s check the child account’s privacy and family settings, then confirm the game and platform requirements.'],
  ['“The screen keeps rotating when I move the tablet.”', 'Let’s check rotation lock and the current display mode so we can match the screen to how you want to use the device.'],
  ['“My OneDrive says it is full, but I deleted files.”', 'Let’s review storage usage and the Recycle Bin first, since deleted items may still count until they are removed there.'],
  ['“I got a pop-up saying my PC is infected.”', 'Please do not call any number in the pop-up. Let’s identify whether it is a browser notification and close it safely.'],
  ['“My laptop will not connect to the hotel Wi-Fi.”', 'Let’s check whether the network sign-in page appears and whether another device can connect before changing saved network settings.'],
  ['“I cannot hear sound through my monitor.”', 'Let’s check the selected output device and whether the monitor supports audio over the connection you are using.'],
  ['“My Microsoft Store download is stuck.”', 'Let’s check the download status, available storage, and account first, then retry only after we know what is blocking it.'],
  ['“The family organizer cannot see my location.”', 'Let’s confirm the account, device permissions, and location-sharing settings with everyone’s consent.'],
  ['“I forgot my Microsoft account password.”', 'I can guide you to the official recovery page. Keep verification codes private and enter them only on that page.'],
  ['“A new app is asking for administrator access.”', 'Before approving it, let’s confirm where the app came from and what change it says it needs to make.'],
  ['“My laptop connects to Wi-Fi but says no internet.”', 'Let’s check whether other devices are online and whether a browser can open the network sign-in page.'],
  ['“I want to cancel a subscription before it renews.”', 'Let’s find the subscription under the purchasing account and review the renewal date and cancellation terms together.'],
  ['“My camera image is too dark during calls.”', 'Let’s check the app’s camera controls, room lighting, and selected camera before changing system settings.'],
  ['“I cannot open a shared family calendar.”', 'Let’s confirm which account received the sharing invitation and whether it is still active.'],
  ['“The Windows taskbar moved to the side.”', 'I can help restore the layout. Let’s check taskbar alignment and display orientation before changing other settings.'],
  ['“A support agent asked me for my one-time code.”', 'Do not share it. A verification code is private; let’s continue through the official support and account security steps.'],
  ['“My document formatting changed on another computer.”', 'Let’s compare the app version, fonts, and file format, and keep a copy of the original before changing it.'],
  ['“I cannot sign into my Xbox profile.”', 'Let’s note the exact sign-in message and check the account status through the official Xbox sign-in flow.'],
  ['“The PC restarted during an update.”', 'Let’s check update history and the current restart status before starting another update or recovery step.'],
  ['“My family sharing invite went to the wrong email.”', 'Let’s verify the recipient account and invitation status before sending a corrected invite.'],
  ['“My Bluetooth mouse keeps disconnecting.”', 'Let’s check its battery, connection status, and whether it disconnects from another device too.'],
  ['“I want to remove an old device from my account.”', 'Let’s identify the correct device in the official account page and review what removing it changes before confirming.'],
  ['“The customer wants a guaranteed fix today.”', 'I understand the urgency. I’ll explain what we can verify now and give a clear update if the next step needs more time.'],
  ['“My phone backup has not completed.”', 'Let’s check the backup status, available storage, power, and network before restarting the backup.'],
  ['“I cannot tell whether this email is really from Microsoft.”', 'Please avoid its links for now. Let’s review the sender and message safely, then open your account by typing its known address.'],
  ['“An app stopped working after I changed my password.”', 'Let’s confirm which account the app uses and sign in through its official prompt without sharing the password here.'],
  ['“My files are available online but not on this PC.”', 'Let’s check the sync client, signed-in account, and selected folders before moving or deleting any files.'],
  ['“My laptop gets hot when it is closed.”', 'Let’s check whether it is sleeping or staying awake, then review power and connected-device behavior before changing settings.'],
  ['“The verification email never arrived.”', 'Let’s confirm the account address, check junk mail and other inbox tabs, and use only the service’s official resend option.'],
  ['“My child’s screen-time limit did not apply.”', 'Let’s verify the child account, device connection, and schedule shown in Family Safety before adjusting the limit again.'],
  ['“The Microsoft Store asks me to buy an app I already own.”', 'Let’s check the account currently signed into Store and compare it with the purchase history before buying it again.'],
  ['“I cannot open a PDF from an email attachment.”', 'Let’s confirm the file downloaded safely and whether other PDFs open, then check the selected app and exact error.'],
  ['“My OneDrive folder is missing from File Explorer.”', 'Let’s check which account is signed in, whether sync is running, and if the folder is selected for this device.'],
  ['“The laptop does not wake when I open the lid.”', 'Let’s note whether power or keyboard lights respond and check the power state before trying a forced shutdown.'],
  ['“I accidentally shared a file with the wrong person.”', 'Let’s review the file’s access list and remove only the unintended recipient, then confirm who should retain access.'],
  ['“My Microsoft 365 apps show different accounts.”', 'Let’s identify the account in the affected app and the one that owns the subscription before signing out anywhere.'],
  ['“The customer cannot follow the instructions because the screen looks different.”', 'Let’s pause and ask what they see now, then match one instruction to the current screen before continuing.'],
  ['“My browser keeps opening the wrong home page.”', 'Let’s check the browser’s startup and home-page settings, then review extensions if the setting changes back.'],
  ['“The customer has limited time and wants the shortest path.”', 'Let’s agree on the immediate goal, try the least disruptive relevant check, and explain any longer follow-up clearly.'],
  ['“I changed my account email and now purchases are missing.”', 'Let’s confirm whether the new address is an alias on the same account or a separate account, then check order history.'],
  ['“My PC is asking for a recovery key after a restart.”', 'Please keep the recovery key private. Let’s identify the device and direct you to the official account or administrator path to retrieve it.'],
  ['“A family member cannot edit the document I shared.”', 'Let’s check whether the link grants edit access and whether they are signed in with the invited account.'],
  ['“A customer wants to change several settings at once.”', 'Let’s agree on the desired outcome and change one relevant setting at a time so we can tell what helped.'],
  ['“The device works on Wi-Fi but not through the wired dock.”', 'Let’s compare the network status with and without the dock and capture any adapter or connection message before changing drivers.'],
  ['“My subscription benefits disappeared from one device.”', 'Let’s check the signed-in account and subscription status, then compare whether the same benefit appears on another device.'],
  ['“I want to factory-reset my PC, but I am unsure about my files.”', 'Let’s stop before resetting and first confirm backup status, the intended reset option, and which files must be kept.'],
  ['“My Teams call keeps dropping, but my internet seems fine.”', 'Let’s note whether the issue affects other apps and check the call quality details before changing network settings.'],
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

const nuancedReplyDistractors = [
  'Let’s try a quick restart first; if it is still happening, we can check the exact details.',
  'It could be temporary. Wait a little and try again before we change anything.',
  'Let’s review the related settings and adjust the one that seems most likely.',
  'Could you repeat the same steps once more while I look up the usual fix?',
  'Let’s update the app or device, then check whether the issue goes away.',
  'I think this may be account-related. Try signing out and back in, and we can go from there.',
  'Let’s try the most common fix first, then gather more details if it persists.',
  'Could you apply the suggestion you found and tell me whether it works?',
  'Let’s make a couple of related changes and test the task again.',
  'I’ll give you the usual set of troubleshooting steps so we can cover the common causes.',
  'We can wait and monitor it for now, then investigate if it continues.',
  'Let’s reinstall the affected app and see whether that clears it.',
]
replyChallenges.forEach((challenge, index) => {
  const answer = challenge.options[challenge.answer]
  const firstDistractor = nuancedReplyDistractors[index % nuancedReplyDistractors.length]
  const secondDistractor = nuancedReplyDistractors[(index + 5) % nuancedReplyDistractors.length]
  challenge.options = [answer, firstDistractor, secondDistractor]
  challenge.answer = 0
})
replyChallenges.push({ prompt: '“I’m not sure which step is safe to try.” Choose the strongest response.', options: ['Let’s pause before changing anything. Tell me what you see, and we’ll choose one safe check together.', 'Most steps are safe, so try the first few suggestions and we can undo them if needed.', 'Start with a reset; it often fixes the problem and we can review the details afterward.'], answer: 0, feedback: 'Check the customer’s concern, explain the next step, and avoid broad changes before you understand the impact.' })
const replyChallengeCount = replyChallenges.length

function MicrosoftMark() {
  return <span className="microsoft-mark" aria-hidden="true"><i /><i /><i /><i /></span>
}

function Brand({ onHome = null }) {
  const content = <><MicrosoftMark /><span><strong>MLTS Consumer Simulator</strong><small>Microsoft learning, made practical</small></span></>
  return onHome ? <button className="brand" onClick={onHome}>{content}</button> : <a className="brand" href="#home">{content}</a>
}

const THEMES = [
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
  { id: 'anniversary', label: '50 Years' },
  { id: 'dev', label: 'Developer' },
  { id: 'support', label: 'Support' },
  { id: 'violet', label: 'Violet' },
  { id: 'ember', label: 'Ember' },
]

function ThemeGlyph({ theme }) {
  const common = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
  if (theme === 'dev') return <svg {...common}><path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14" /></svg>
  if (theme === 'support') return <svg {...common}><path d="M4 13v-2a8 8 0 0 1 16 0v2M4 13a2 2 0 0 0 2 2h1v-5H6a2 2 0 0 0-2 2Zm16 0a2 2 0 0 1-2 2h-1v-5h1a2 2 0 0 1 2 2ZM7 18h6" /><path d="M13 18a2 2 0 0 1-2 2H9" /></svg>
  if (theme === 'violet') return <svg {...common}><path d="m12 3 9 6-9 12L3 9l9-6Z" /><path d="M3 9h18M8 9l4 12m4-12-4 12" /></svg>
  if (theme === 'ember') return <svg {...common}><path d="M12 22c4.3 0 7-2.9 7-6.7 0-2.8-1.6-4.7-4.2-7.3.1 2.2-.8 3.4-1.8 4.1C13.2 8.2 11 5.2 8.2 3 8.7 7.8 5 9.8 5 15.2 5 19.2 7.7 22 12 22Z" /><path d="M10 18c0-1.5 1.2-2.4 2.3-3.5.2 1.2 1.7 1.7 1.7 3.5a2 2 0 1 1-4 0Z" /></svg>
  if (theme === 'anniversary') return <svg {...common}><path d="m12 3 2.2 5.5L20 11l-5.8 2.4L12 19l-2.3-5.6L4 11l5.7-2.5L12 3Z" /><path d="m19 16 .9 2.1L22 19l-2.1.9L19 22l-.9-2.1L16 19l2.1-.9L19 16Z" /></svg>
  if (theme === 'dark') return <svg {...common}><path d="M20 15.2A8.5 8.5 0 0 1 8.8 4 8.5 8.5 0 1 0 20 15.2Z" /></svg>
  return <svg {...common}><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
}

function ActivityIcon({ name }) {
  const common = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
  if (name === 'chat') return <svg {...common}><path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5 8 8 0 0 1-3.4-.8L4 20l1.6-4.1A7.4 7.4 0 0 1 5 12a7.5 7.5 0 1 1 15 0Z" /><path d="M8.5 12h.01M12 12h.01M15.5 12h.01" /></svg>
  if (name === 'spark') return <svg {...common}><path d="m12 3 2.1 5.8L20 11l-5.9 2.2L12 19l-2.1-5.8L4 11l5.9-2.2L12 3Z" /><path d="m19 16 .7 1.8 1.8.7-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7L19 16Z" /></svg>
  if (name === 'keyboard') return <svg {...common}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M7 9h.01M10 9h.01M13 9h.01M16 9h.01M7 12h.01M10 12h.01M13 12h.01M16 12h.01M8 15h8" /></svg>
  if (name === 'parachute') return <svg {...common}><path d="M3 10a9 9 0 0 1 18 0H3Z" /><path d="m3 10 7 4m11-4-7 4m-4-4 1 4m3-4-1 4m-2 0-2 4h7l-2-4m-1 0v-3" /></svg>
  return <svg {...common}><path d="M4 5h16v12H9l-5 3V5Z" /><path d="m8 9 2 2-2 2m4 0h4" /></svg>
}

function Header({ onHome = null, theme = 'light', onToggleTheme }) {
  const themeIndex = Math.max(0, THEMES.findIndex((item) => item.id === theme))
  const themeName = THEMES[themeIndex].label
  const nextTheme = THEMES[(themeIndex + 1) % THEMES.length]
  return <header className="topbar"><Brand onHome={onHome} /><button className="theme-toggle" onClick={onToggleTheme} aria-label={`Current theme: ${themeName}. Switch to ${nextTheme.label} theme`} title={`Switch to ${nextTheme.label} theme`}><span className={`theme-icon theme-icon-${theme}`}><ThemeGlyph theme={theme} /></span>{themeName}</button></header>
}

function InfoPage({ kind, onBack }) {
  if (kind === 'team') {
    const members = [
      { name: 'Mohammed Inam Ul Hassan', photo: '/team-inam.png', accent: '#8DA9C4', initials: 'MI' },
      { name: 'Mohammed Yasir Hasan', photo: '/team-yasir.png', accent: '#8DA9C4', initials: 'MY' },
      { name: 'Ganaraj Nayak', photo: '/team-ganaraj.png', accent: '#8DA9C4', initials: 'GN' },
    ]
    return <main className="info-page team-page"><button className="back-button" onClick={onBack}>← Learning hub</button><div className="page-heading"><span className="eyebrow">Microsoft · Consumer support</span><h1>Meet the Team</h1></div><section className="team-grid" aria-label="Team members">{members.map((member, index) => <article className="team-member-card" key={member.name} style={{ '--member-order': index, '--member-accent': member.accent }}><div className="team-portrait"><img src={member.photo} alt={member.name + ' profile portrait'} /><span className="team-initials" aria-hidden="true">{member.initials}</span><span className="team-card-spark" aria-hidden="true">✦</span></div><div className="team-member-copy"><h2>{member.name}</h2><p className="team-member-org">RFC Global Escalations Tier-3 for Consumers</p></div></article>)}</section></main>
  }

  const entries = [
    ['Customer simulators', 'Practice customer conversations and product knowledge. Use Open in new tab if Copilot is slow or blocked; these are simulations, not live support.', 'Best for rehearsing support conversations or reviewing consumer product knowledge.'],
    ['Typing Master', 'Type the displayed passage. The 90-second clock begins with your first keystroke; speed and accuracy update as you type. A compact results dialog appears when the run ends.', 'Best for short speed and accuracy practice.'],
    ['Skyfall', 'Steer with ← → or A / D, dodge hazards, collect shield rings, and land on each target. Choose a relaxed, standard, or challenge run before starting.', 'Best for a quick focus break and reflex challenge.'],
    ['Reply Remix', 'Read the customer scenario, choose a reply, review the feedback, and continue to the next scenario. The library keeps cycling through shuffled prompts.', 'Best for practicing empathy and clear next steps.'],
    ['Fix for the Day', 'Review the objective and customer scenario. Expand More product detail for key knowledge, terms, and a practical tip. A fresh card rotates every six minutes.', 'Best for a focused support skill refresher.'],
    ['Themes', 'Use the header control to cycle through seven palettes, including the new Violet and Ember themes. Your selection is saved for your next visit.', 'Best for choosing a comfortable visual style.'],
    ['Meet the Team', 'View the RFC Global Escalations Tier-3 for Consumers team and its shared focus.', 'Best for understanding who the learning hub represents.'],
    ['Microsoft 50 Years', 'This palette highlights Microsoft’s history alongside the products people use today.', 'Best for a warm anniversary-inspired appearance.'],
    ['Quiz Gauntlet', 'Explore consumer Microsoft products through quiz prompts that encourage recall and discussion.', 'Best for checking product knowledge.'],
  ]
  return <main className="info-page"><button className="back-button" onClick={onBack}>← Learning hub</button><div className="page-heading"><span className="eyebrow">A quick guide</span><h1>Website Manual</h1><p>What each feature is for and when it is most useful.</p></div><section className="manual-grid">{entries.map(([title, description, bestFor], index) => <article className="manual-card" key={title}><span>{String(index + 1).padStart(2, '0')}</span><div><h2>{title}</h2><p>{description}</p><p className="manual-best-for"><strong>Best for:</strong> {bestFor}</p></div></article>)}</section></main>
}

function TypingSprint({ onBack }) {
  const [typingText, setTypingText] = useState(buildTypingPassage)
  const inputRef = useRef(null)
  const resultDialogRef = useRef(null)
  const startedAtRef = useRef(0)
  const [started, setStarted] = useState(false)
  const duration = 90
  const [seconds, setSeconds] = useState(90)
  const [elapsed, setElapsed] = useState(0)
  const [typed, setTyped] = useState('')
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    if (!started || finished) return undefined
    const timer = window.setInterval(() => {
      const elapsedSeconds = Math.min(duration, Math.max(0, (Date.now() - startedAtRef.current) / 1000))
      setElapsed(elapsedSeconds)
      if (elapsedSeconds >= duration) {
        setSeconds(0)
        setFinished(true)
      } else {
        setSeconds(Math.ceil(duration - elapsedSeconds))
      }
    }, 1000)
    return () => window.clearInterval(timer)
  }, [started, finished, duration])
  useEffect(() => {
    if (started && !finished) inputRef.current?.focus()
  }, [started, finished])
  useEffect(() => {
    if (finished && resultDialogRef.current && !resultDialogRef.current.open) resultDialogRef.current.showModal()
  }, [finished])

  const correct = [...typed].filter((char, index) => char === typingText[index]).length
  const accuracy = typed.length ? Math.round((correct / typed.length) * 100) : 100
  const wpm = elapsed ? Math.round((correct / 5) / (elapsed / 60)) : 0
  const badge = accuracy >= 99 && wpm >= 100 ? 'Jetstream' : accuracy >= 98 && wpm >= 80 ? 'Snow Leopard' : accuracy >= 96 && wpm >= 60 ? 'Falcon' : accuracy >= 92 && wpm >= 35 ? 'Red Panda' : accuracy >= 88 && wpm >= 25 ? 'Koala' : accuracy >= 75 ? 'Wind Rider' : typed.length ? 'First Flight' : 'Ground Crew'
  function reset() { startedAtRef.current = 0; setStarted(false); setFinished(false); setSeconds(90); setElapsed(0); setTyped(''); setTypingText((current) => buildTypingPassage(current)) }
  function updateTyped(value) {
    const next = value.slice(0, typingText.length)
    if (!started && next.length > 0) { startedAtRef.current = Date.now(); setElapsed(0); setStarted(true) }
    setTyped(next)
    if (next.length >= typingText.length) {
      const elapsedSeconds = Math.min(duration, Math.max(0, (Date.now() - startedAtRef.current) / 1000))
      setElapsed(elapsedSeconds)
      setFinished(true)
    }
  }

  return <div className="activity-page"><button className="back-button" onClick={onBack}>← All activities</button><div className="page-heading"><span className="eyebrow">90-second typing test</span><h1>Typing Master</h1><p>Start typing when you’re ready. Speed and accuracy update live.</p></div><section className="activity-panel typing-panel">
    <div className="typing-toolbar"><span className="typing-session-label">ONE-MINUTE-THIRTY TEST</span><span className={`typing-clock ${seconds <= 10 && started ? 'urgent' : ''}`}>◷ {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}</span></div>
    <div className="typing-stats"><div><span>Speed</span><strong>{wpm} <small>WPM</small></strong></div><div><span>Accuracy</span><strong>{accuracy}<small>%</small></strong></div><div><span>Typed</span><strong>{typed.length}<small> chars</small></strong></div></div>
    <div className={`typing-stage ${started && !finished ? 'is-typing' : ''}`} onClick={() => inputRef.current?.focus()} role="group" aria-label="Typing passage; type the highlighted text to start the test"><p className="typing-copy">{[...typingText].map((char, index) => { const state = index < typed.length ? (typed[index] === char ? 'correct-char' : 'wrong-char') : index === typed.length && !finished ? 'current-char' : ''; return <span key={index} className={state}>{char}</span> })}</p><textarea ref={inputRef} className="typing-capture" aria-label="Type the passage shown above; the timer begins with your first keystroke" value={typed} onChange={(event) => updateTyped(event.target.value)} onPaste={(event) => event.preventDefault()} onKeyDown={(event) => { if (event.key === 'Tab') event.preventDefault() }} disabled={finished} autoCapitalize="off" autoCorrect="off" spellCheck="false" /></div>
    <div className="typing-actions"><span>{started && !finished ? 'Keep going — every character counts.' : 'The clock starts on your first keystroke.'}</span><button className="button-secondary" onClick={reset}>↻ Try another passage</button></div>
    <dialog ref={resultDialogRef} className="typing-result-dialog" aria-labelledby="typing-result-title"><span className="eyebrow">Run complete</span><h2 id="typing-result-title">{badge}</h2><p>You typed <b>{wpm} WPM</b> with <b>{accuracy}% accuracy</b> in {Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, '0')}.</p><div className="typing-result-actions"><button className="button-secondary" onClick={() => resultDialogRef.current?.close()}>Close</button><button className="button-primary" onClick={() => { resultDialogRef.current?.close(); reset() }}>Try another passage</button></div></dialog>
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
  return <div className="activity-page"><button className="back-button" onClick={onBack}>← All activities</button><div className="page-heading"><span className="eyebrow">{replyChallengeCount} randomized scenarios</span><h1>Reply Remix</h1><p>Choose the clearest, most helpful response.</p></div><section className="activity-panel challenge-panel"><div className="challenge-meta"><span>Scenario {round}</span><span>Good replies {score}</span></div><h2>{challenge.prompt}</h2><div className="answer-options">{challenge.options.map((option, index) => <button key={option} className={choice !== null && index === challenge.answer ? 'correct' : (choice === index ? 'incorrect' : '')} onClick={() => choose(index)} disabled={choice !== null}><span className="option-letter">{String.fromCharCode(65 + index)}</span>{option}</button>)}</div>{choice !== null && <div className={`answer-feedback ${choice === challenge.answer ? 'good' : 'try-again'}`} role="status"><strong>{choice === challenge.answer ? 'That lands well!' : 'That is not the strongest next step.'}</strong><span>{challenge.feedback}</span></div>}<button className="button-primary next-button" onClick={next}>Next scenario <span aria-hidden="true">→</span></button></section></div>
}

function SkyDropGame({ onBack }) {
  const canvasRef = useRef(null)
  const gameRef = useRef(null)
  const [status, setStatus] = useState('ready')
  const [score, setScore] = useState(0)
  const [shieldReady, setShieldReady] = useState(false)
  const [endReason, setEndReason] = useState('')
  const [difficulty, setDifficulty] = useState('standard')
  const [bestScore, setBestScore] = useState(() => {
    try { return Number(window.localStorage.getItem('mlts-skyfall-best')) || 0 } catch { return 0 }
  })
  const bestScoreRef = useRef(bestScore)

  function startGame() {
    const startX = 480
    const mode = { relaxed: { speed: .82, targetWidth: 174, shield: 1 }, standard: { speed: 1, targetWidth: 150, shield: 0 }, challenge: { speed: 1.14, targetWidth: 128, shield: 0 } }[difficulty]
    gameRef.current = {
      running: true, playerX: startX, score: 0, elapsed: 0, flash: 0, landingWait: 0, speedScale: mode.speed,
      target: { x: 480, y: 430, width: mode.targetWidth, height: 16, checked: false },
      hazards: [{ x: 245, y: 300, radius: 25, kind: 'storm' }, { x: 760, y: 80, radius: 19, kind: 'balloon' }],
      gusts: [{ x: 690, y: 355, width: 170, phase: 1.4 }],
      boosts: [{ x: 335, y: 250, phase: 0 }], shield: mode.shield,
      keys: new Set(),
    }
    setScore(0)
    setShieldReady(Boolean(mode.shield))
    setEndReason('')
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
      if (game.score > bestScoreRef.current) {
        bestScoreRef.current = game.score
        setBestScore(game.score)
        try { window.localStorage.setItem('mlts-skyfall-best', String(game.score)) } catch { /* Keep the best score for this visit if storage is unavailable. */ }
      }
      setEndReason(reason)
      setStatus('over')
    }

    function update(dt) {
      const game = gameRef.current
      if (!game?.running) return
      game.elapsed += dt
      game.flash = Math.max(0, game.flash - dt)
      const speed = (112 + game.score * 5 + 150 * (1 - Math.exp(-game.score / 12))) * game.speedScale
      const moveSpeed = (300 + Math.min(game.score * 5, 120)) * game.speedScale
      if (game.keys.has('arrowleft') || game.keys.has('a')) game.playerX -= moveSpeed * dt
      if (game.keys.has('arrowright') || game.keys.has('d')) game.playerX += moveSpeed * dt
      game.playerX = Math.max(44, Math.min(width - 44, game.playerX))

      game.hazards.forEach((hazard) => {
        hazard.y -= speed * dt * (hazard.kind === 'balloon' ? .66 : .9)
        hazard.x += Math.sin(game.elapsed * (hazard.kind === 'bird' ? 3 : 1.7) + hazard.y) * (hazard.kind === 'bird' ? 34 : 10) * dt
        hazard.x = Math.max(38, Math.min(width - 38, hazard.x))
      })
      game.hazards = game.hazards.filter((hazard) => hazard.y > -70)
      const hitHazard = game.hazards.findIndex((hazard) => Math.abs(hazard.y - (playerY + 6)) < hazard.radius + 14 && Math.abs(hazard.x - game.playerX) < hazard.radius + 12)
      if (hitHazard >= 0) {
        if (game.shield) { game.shield = 0; setShieldReady(false); game.hazards.splice(hitHazard, 1); game.flash = 0.8 }
        else {
          const names = { storm: 'storm cloud', bird: 'bird', balloon: 'hot-air balloon', drone: 'drone', rock: 'rocky outcrop' }
          finish(`You clipped a ${names[game.hazards[hitHazard].kind] || 'hazard'}.`)
          return
        }
      }

      game.gusts.forEach((gust) => { gust.y -= speed * dt * 0.8; gust.phase += dt * (1.2 + game.score * .025) })
      game.gusts = game.gusts.filter((gust) => gust.y > -90)
      game.gusts.forEach((gust) => {
        if (Math.abs(gust.y - playerY) < 32 && Math.abs(game.playerX - gust.x) < gust.width / 2) game.playerX += Math.sin(gust.phase) * (115 + game.score * 2) * dt
      })
      game.playerX = Math.max(44, Math.min(width - 44, game.playerX))
      game.boosts.forEach((boost) => { boost.y -= speed * dt * .88; boost.phase += dt * 3 })
      const boostHit = game.boosts.findIndex((boost) => Math.abs(boost.y - (playerY + 18)) < 35 && Math.abs(boost.x - game.playerX) < 36)
      if (boostHit >= 0) { game.shield = 1; setShieldReady(true); game.boosts.splice(boostHit, 1); game.flash = 0.65 }
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
          game.target = { x: nextX, y: nextY, width: Math.max(game.speedScale > 1 ? 98 : 112, game.target.width - (game.speedScale > 1 ? 3 : 1)), height: 16, checked: false }
          const awayFromTarget = nextX < width / 2 ? 1 : -1
          const hazardKinds = ['storm', 'bird', 'balloon', 'drone', 'rock']
          const firstKind = pickRandom(hazardKinds)
          game.hazards.push({ x: Math.max(48, Math.min(width - 48, nextX + awayFromTarget * (210 + Math.random() * 150))), y: nextY - 135, radius: firstKind === 'balloon' ? 18 : 20 + Math.random() * 9, kind: firstKind })
          if (game.score > 1) {
            const secondKind = pickRandom(hazardKinds, firstKind)
            game.hazards.push({ x: 70 + Math.random() * (width - 140), y: nextY - 295, radius: secondKind === 'bird' ? 14 : 17 + Math.random() * 8, kind: secondKind })
          }
          if (game.score % 2 === 0) game.gusts.push({ x: 100 + Math.random() * (width - 200), y: nextY - 205, width: 120 + Math.random() * 90, phase: Math.random() * Math.PI * 2 })
          if (game.score % 3 === 1) game.boosts.push({ x: 90 + Math.random() * (width - 180), y: nextY - 330, phase: Math.random() * 6 })
        }
      }
    }

    function drawCloud(x, y, scale = 1, shade = '#f5f7f4') {
      context.save()
      context.translate(x, y)
      context.scale(scale, scale)
      context.shadowColor = 'rgba(43,64,75,.15)'
      context.shadowBlur = 10
      context.fillStyle = shade
      context.beginPath()
      context.ellipse(0, 5, 33, 14, 0, 0, Math.PI * 2)
      context.ellipse(-19, 1, 18, 17, 0, 0, Math.PI * 2)
      context.ellipse(1, -8, 23, 23, 0, 0, Math.PI * 2)
      context.ellipse(22, 1, 17, 16, 0, 0, Math.PI * 2)
      context.fill()
      context.shadowBlur = 0
      context.globalAlpha = .12
      context.fillStyle = '#344955'
      context.beginPath()
      context.ellipse(1, 12, 26, 5, 0, 0, Math.PI * 2)
      context.fill()
      context.restore()
    }

    function draw() {
      const game = gameRef.current
      const elapsed = game?.elapsed || 0
      const sky = context.createLinearGradient(0, 0, 0, height)
      sky.addColorStop(0, '#5d9fbd')
      sky.addColorStop(.44, '#b5ced1')
      sky.addColorStop(.7, '#e1d9c3')
      sky.addColorStop(1, '#a8b99b')
      context.fillStyle = sky
      context.fillRect(0, 0, width, height)

      const sunlight = context.createRadialGradient(760, 90, 8, 760, 90, 210)
      sunlight.addColorStop(0, 'rgba(255,239,195,.62)')
      sunlight.addColorStop(1, 'rgba(255,239,195,0)')
      context.fillStyle = sunlight
      context.fillRect(535, 0, 425, 300)

      // Distant ridges use soft atmospheric color; nearer slopes have deeper, natural greens.
      context.fillStyle = '#829eaa'
      context.beginPath()
      context.moveTo(0, 290); context.lineTo(72, 208); context.lineTo(127, 248); context.lineTo(222, 169); context.lineTo(301, 247); context.lineTo(408, 186); context.lineTo(484, 242); context.lineTo(580, 157); context.lineTo(669, 242); context.lineTo(777, 183); context.lineTo(865, 245); context.lineTo(960, 190); context.lineTo(960, 420); context.lineTo(0, 420); context.closePath(); context.fill()
      context.fillStyle = 'rgba(237,241,231,.42)'
      context.beginPath()
      context.moveTo(182, 203); context.lineTo(222, 169); context.lineTo(261, 209); context.lineTo(238, 199); context.lineTo(222, 205); context.lineTo(207, 193); context.closePath(); context.fill()
      context.beginPath()
      context.moveTo(545, 188); context.lineTo(580, 157); context.lineTo(620, 196); context.lineTo(599, 187); context.lineTo(581, 195); context.lineTo(566, 181); context.closePath(); context.fill()
      context.fillStyle = '#718c79'
      context.beginPath()
      context.moveTo(0, 300); context.quadraticCurveTo(124, 250, 230, 302); context.quadraticCurveTo(360, 356, 483, 294); context.quadraticCurveTo(614, 242, 740, 303); context.quadraticCurveTo(850, 355, 960, 285); context.lineTo(960, 540); context.lineTo(0, 540); context.closePath(); context.fill()
      context.fillStyle = '#91a27c'
      context.beginPath()
      context.moveTo(0, 365); context.quadraticCurveTo(140, 309, 276, 371); context.quadraticCurveTo(428, 431, 570, 360); context.quadraticCurveTo(714, 306, 840, 367); context.quadraticCurveTo(913, 399, 960, 377); context.lineTo(960, 540); context.lineTo(0, 540); context.closePath(); context.fill()

      // Patchwork fields and tree lines give the landing area a readable ground plane.
      context.fillStyle = 'rgba(190,181,132,.42)'
      context.beginPath(); context.moveTo(82, 414); context.lineTo(257, 388); context.lineTo(319, 540); context.lineTo(142, 540); context.closePath(); context.fill()
      context.fillStyle = 'rgba(197,205,160,.38)'
      context.beginPath(); context.moveTo(610, 411); context.lineTo(817, 393); context.lineTo(910, 540); context.lineTo(690, 540); context.closePath(); context.fill()
      context.strokeStyle = 'rgba(229,229,195,.34)'
      context.lineWidth = 2
      for (let row = 0; row < 5; row += 1) {
        const y = 438 + row * 22
        context.beginPath(); context.moveTo(0, y); context.quadraticCurveTo(470, y - 20, width, y + 4); context.stroke()
      }
      context.strokeStyle = 'rgba(236,238,211,.2)'
      context.lineWidth = 1
      for (let track = 0; track <= 8; track += 1) {
        const groundX = track * (width / 8)
        context.beginPath(); context.moveTo(width / 2 + (groundX - width / 2) * .18, 352); context.lineTo(groundX, height); context.stroke()
      }
      for (let tree = 0; tree < 26; tree += 1) {
        const x = (tree * 113 + 38) % width
        const y = 324 + (tree * 47) % 142
        const size = 3 + (tree % 4)
        context.fillStyle = tree % 3 === 0 ? '#435f50' : '#526f59'
        context.beginPath(); context.arc(x, y, size, 0, Math.PI * 2); context.fill()
      }

      // High clouds drift slowly past the canopy; their soft shadows add depth without grid effects.
      for (let index = 0; index < 7; index += 1) {
        const x = (index * 177 + 76 + Math.sin(elapsed * .12 + index) * 18 + width) % width
        const y = 68 + (index * 61) % 176
        drawCloud(x, y, .48 + (index % 3) * .14)
      }
      context.fillStyle = 'rgba(248,250,244,.25)'
      context.fillRect(0, 270, width, 35)

      if (!game) return

      game.gusts.forEach((gust) => {
        const sway = Math.sin(gust.phase) * 15
        context.save()
        context.globalAlpha = .38
        context.strokeStyle = '#f3f5e9'
        context.lineWidth = 2
        for (let line = 0; line < 3; line += 1) {
          const y = gust.y + line * 12
          context.beginPath()
          context.moveTo(gust.x - gust.width / 2 + sway, y)
          context.bezierCurveTo(gust.x - 25, y - 12, gust.x + 20, y + 13, gust.x + gust.width / 2, y - 2)
          context.stroke()
        }
        context.restore()
      })

      game.boosts.forEach((boost) => {
        const bob = Math.sin(boost.phase) * 4
        context.save()
        context.translate(boost.x, boost.y + bob)
        context.shadowColor = 'rgba(234,190,99,.7)'
        context.shadowBlur = 12
        context.strokeStyle = '#d8a84e'
        context.lineWidth = 7
        context.beginPath(); context.ellipse(0, 0, 17, 22, Math.sin(boost.phase) * .12, 0, Math.PI * 2); context.stroke()
        context.shadowBlur = 0
        context.strokeStyle = 'rgba(255,249,214,.88)'
        context.lineWidth = 2
        context.beginPath(); context.ellipse(-2, -2, 11, 16, 0, -.7, 1.8); context.stroke()
        context.restore()
      })

      game.hazards.forEach((hazard) => {
        context.save()
        context.translate(hazard.x, hazard.y)
        if (hazard.kind === 'bird') {
          context.fillStyle = '#344c58'
          context.beginPath(); context.ellipse(0, 0, 14, 6, 0, 0, Math.PI * 2); context.fill()
          context.strokeStyle = '#344c58'; context.lineWidth = 4; context.lineCap = 'round'
          const wing = Math.sin(elapsed * 12 + hazard.y) * 7
          context.beginPath(); context.moveTo(-5, 0); context.quadraticCurveTo(-12, -12 + wing, -21, -9 + wing); context.moveTo(5, 0); context.quadraticCurveTo(12, -12 + wing, 21, -9 + wing); context.stroke()
          context.fillStyle = '#e0a35c'; context.beginPath(); context.moveTo(13, -1); context.lineTo(21, 2); context.lineTo(13, 4); context.fill()
        } else if (hazard.kind === 'balloon') {
          context.fillStyle = 'rgba(34,58,68,.17)'; context.beginPath(); context.ellipse(4, 28, 23, 6, 0, 0, Math.PI * 2); context.fill()
          const balloon = context.createLinearGradient(-18, -20, 18, 18); balloon.addColorStop(0, '#f0b66e'); balloon.addColorStop(1, '#c86f55')
          context.fillStyle = balloon; context.beginPath(); context.ellipse(0, 0, 18, 23, 0, 0, Math.PI * 2); context.fill()
          context.strokeStyle = '#795546'; context.lineWidth = 1.5; context.beginPath(); context.moveTo(-7, 18); context.lineTo(-3, 29); context.lineTo(4, 29); context.lineTo(7, 18); context.stroke()
          context.fillStyle = '#73513e'; context.fillRect(-5, 28, 11, 7)
        } else if (hazard.kind === 'drone') {
          context.fillStyle = 'rgba(34,58,68,.17)'; context.beginPath(); context.ellipse(0, 17, 24, 5, 0, 0, Math.PI * 2); context.fill()
          context.fillStyle = '#526b78'; context.beginPath(); context.roundRect(-13, -4, 26, 10, 5); context.fill()
          context.strokeStyle = '#526b78'; context.lineWidth = 3; context.beginPath(); context.moveTo(-9, 0); context.lineTo(-20, -7); context.moveTo(9, 0); context.lineTo(20, -7); context.stroke()
          context.strokeStyle = '#263d49'; context.lineWidth = 2; context.beginPath(); context.ellipse(-21, -8, 7, 2, 0, 0, Math.PI * 2); context.ellipse(21, -8, 7, 2, 0, 0, Math.PI * 2); context.stroke()
          context.fillStyle = '#d99564'; context.beginPath(); context.arc(0, 1, 2.5, 0, Math.PI * 2); context.fill()
        } else if (hazard.kind === 'rock') {
          context.fillStyle = 'rgba(35,50,61,.2)'; context.beginPath(); context.ellipse(2, 15, 25, 6, 0, 0, Math.PI * 2); context.fill()
          context.fillStyle = '#829398'; context.beginPath(); context.moveTo(-23, 8); context.lineTo(-17, -7); context.lineTo(-6, -15); context.lineTo(5, -12); context.lineTo(20, -4); context.lineTo(24, 9); context.closePath(); context.fill()
          context.fillStyle = 'rgba(255,255,255,.22)'; context.beginPath(); context.moveTo(-17, -6); context.lineTo(-6, -14); context.lineTo(-2, -4); context.closePath(); context.fill()
        } else {
          context.translate(0, 0)
          drawCloud(0, 0, .9, '#909da0')
          context.strokeStyle = 'rgba(75,91,101,.66)'; context.lineWidth = 2
          for (let drop = -1; drop <= 1; drop += 1) { const x = drop * 13; context.beginPath(); context.moveTo(x, 13); context.lineTo(x - 4, 22); context.stroke() }
        }
        context.restore()
      })

      const target = game.target
      if (target) {
        const left = target.x - target.width / 2
        const top = target.y
        context.save()
        context.shadowColor = 'rgba(37,55,42,.25)'
        context.shadowBlur = 12
        context.fillStyle = 'rgba(37,55,42,.2)'; context.beginPath(); context.ellipse(target.x + 6, top + 31, target.width * .58, 11, 0, 0, Math.PI * 2); context.fill()
        context.fillStyle = '#344d3d'; context.beginPath(); context.moveTo(left, top + 5); context.lineTo(left + target.width, top + 5); context.lineTo(left + target.width + 7, top + 31); context.lineTo(left + 7, top + 31); context.closePath(); context.fill()
        context.fillStyle = '#496847'
        context.beginPath(); context.roundRect(left, top, target.width, 25, 5); context.fill()
        context.shadowBlur = 0
        context.fillStyle = '#81936b'
        context.fillRect(left + 4, top + 4, target.width - 8, 16)
        context.strokeStyle = 'rgba(241,239,210,.86)'
        context.lineWidth = 2
        context.setLineDash([9, 6])
        context.beginPath(); context.moveTo(left + 8, top + 15); context.lineTo(left + target.width - 8, top + 15); context.stroke()
        context.setLineDash([])
        context.fillStyle = 'rgba(248,246,222,.82)'
        context.font = '700 9px Inter, sans-serif'
        context.textAlign = 'center'
        context.fillText('LANDING ZONE', target.x, top + 22)
        context.restore()
      }

      // A fabric canopy, suspension lines, harness, and bent legs make the skydiver read as a 2D figure.
      const x = game.playerX + Math.sin(elapsed * 2.1) * 2
      const canopyY = playerY - 37
      const canopyWidth = 82
      context.save()
      context.strokeStyle = 'rgba(42,54,61,.82)'
      context.lineWidth = 1.6
      context.beginPath()
      context.moveTo(x - 34, canopyY + 6); context.lineTo(x - 10, playerY + 13)
      context.moveTo(x - 14, canopyY - 1); context.lineTo(x - 5, playerY + 12)
      context.moveTo(x + 14, canopyY - 1); context.lineTo(x + 5, playerY + 12)
      context.moveTo(x + 34, canopyY + 6); context.lineTo(x + 10, playerY + 13)
      context.stroke()
      const canopy = context.createLinearGradient(x - 40, canopyY - 35, x + 40, canopyY + 12)
      canopy.addColorStop(0, '#a94c3e'); canopy.addColorStop(.48, '#df8060'); canopy.addColorStop(1, '#8d3f3a')
      context.fillStyle = canopy
      context.beginPath()
      context.moveTo(x - canopyWidth / 2, canopyY + 6)
      context.quadraticCurveTo(x - 32, canopyY - 37, x, canopyY - 39)
      context.quadraticCurveTo(x + 32, canopyY - 37, x + canopyWidth / 2, canopyY + 6)
      context.quadraticCurveTo(x, canopyY + 17, x - canopyWidth / 2, canopyY + 6)
      context.closePath(); context.fill()
      context.strokeStyle = 'rgba(255,225,202,.7)'
      context.lineWidth = 1
      context.beginPath()
      context.moveTo(x - 25, canopyY - 27); context.quadraticCurveTo(x - 20, canopyY - 4, x - 14, canopyY + 10)
      context.moveTo(x, canopyY - 38); context.lineTo(x, canopyY + 13)
      context.moveTo(x + 25, canopyY - 27); context.quadraticCurveTo(x + 20, canopyY - 4, x + 14, canopyY + 10)
      context.stroke()
      context.strokeStyle = '#f0d2bd'; context.lineWidth = 3; context.lineCap = 'round'
      context.beginPath(); context.moveTo(x - 7, playerY + 26); context.lineTo(x - 13, playerY + 36); context.lineTo(x - 10, playerY + 42); context.moveTo(x + 7, playerY + 26); context.lineTo(x + 13, playerY + 35); context.lineTo(x + 11, playerY + 42); context.stroke()
      context.strokeStyle = '#314959'; context.lineWidth = 5
      context.beginPath(); context.moveTo(x - 9, playerY + 18); context.lineTo(x - 17, playerY + 23); context.lineTo(x - 22, playerY + 17); context.moveTo(x + 9, playerY + 18); context.lineTo(x + 17, playerY + 23); context.lineTo(x + 22, playerY + 17); context.stroke()
      context.fillStyle = '#334f61'
      context.beginPath(); context.roundRect(x - 8, playerY + 12, 16, 19, 5); context.fill()
      context.fillStyle = '#b86645'
      context.beginPath(); context.roundRect(x - 6, playerY + 13, 12, 14, 4); context.fill()
      context.strokeStyle = '#d8c49c'; context.lineWidth = 2
      context.beginPath(); context.moveTo(x - 6, playerY + 15); context.lineTo(x + 6, playerY + 15); context.moveTo(x, playerY + 15); context.lineTo(x, playerY + 27); context.stroke()
      context.fillStyle = '#d4b08d'
      context.beginPath(); context.arc(x, playerY + 6, 6, 0, Math.PI * 2); context.fill()
      context.fillStyle = '#425460'
      context.beginPath(); context.ellipse(x, playerY + 3, 7, 4, 0, Math.PI, Math.PI * 2); context.fill()
      context.fillStyle = game.shield ? '#e9c574' : '#d8e1df'
      context.beginPath(); context.arc(x + 15, playerY + 22, 2.5, 0, Math.PI * 2); context.fill()
      context.restore()

      if (game.flash > 0) {
        context.fillStyle = 'rgba(246,230,176,' + Math.min(.18, game.flash * .2) + ')'
        context.fillRect(0, 0, width, height)
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

  return <div className="activity-page"><button className="back-button" onClick={onBack}>← All activities</button><div className="page-heading"><span className="eyebrow">2.5D endless landing run</span><h1>Skyfall</h1><p>Thread through storms, birds, drones, and balloons. Collect shield rings and land on target.</p></div><section className="skyfall-panel"><div className="skyfall-hud"><div><span>Landings</span><strong>{score}</strong></div><div><span>Personal best</span><strong>{bestScore}</strong></div><div><span>Run status</span><strong>{status === 'running' ? 'In the air' : status === 'over' ? 'Run over' : 'Ready to drop'}</strong></div><div><span>Shield</span><strong>{shieldReady ? 'Ready' : '—'}</strong></div></div>{status !== 'running' && <div className="skyfall-options" aria-label="Choose game difficulty"><span>Flight mode</span><div>{[['relaxed', 'Relaxed'], ['standard', 'Standard'], ['challenge', 'Challenge']].map(([id, label]) => <button key={id} className={difficulty === id ? 'active' : ''} aria-pressed={difficulty === id} onClick={() => setDifficulty(id)}>{label}</button>)}</div><small>{difficulty === 'relaxed' ? 'Slower descent, wide landing zones, and a starter shield.' : difficulty === 'challenge' ? 'Faster descent, narrow targets, and more hazards.' : 'Balanced speed, targets, and a growing obstacle field.'}</small></div>}<div className="skyfall-stage"><canvas ref={canvasRef} width="960" height="540" aria-label="2.5D parachute landing game. Use left and right arrow keys or A and D to steer around moving hazards and land on raised platforms." />{status !== 'running' && <div className="skyfall-overlay"><div className="skyfall-overlay-card"><span className="skyfall-emoji">{status === 'over' ? '💥' : '🪂'}</span><strong>{status === 'over' ? 'Drop complete' : 'Ready to drop?'}</strong><span>{status === 'over' ? `${endReason || 'Run ended.'} Landings: ${score}.` : 'Use ← → or A / D to steer. Grab a glowing ring for one shield hit.'}</span><button className="button-primary" onClick={startGame}>{status === 'over' ? 'Fly again' : 'Start descent'} <span>→</span></button></div></div>}</div><p className="skyfall-caption">Steer with ← → or A / D · Rings absorb one hit · Landings increase the pace</p></section></div>
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
  ['Windows', 'Bluetooth devices and pairing', 'Pairing mode', 'Separate pairing, connection, and driver clues before removing a device.', 'Bluetooth accessories must be discoverable and may be connected to another device already.', 'Removing a paired device can require setting it up again.', 'Check power, pairing mode, and nearby device connections before changing Windows settings.', 'A customer’s headphones appear in Bluetooth settings but will not connect.', 4],
  ['Windows', 'Display scale, resolution, and multiple screens', 'Display configuration', 'Identify which display setting causes a blurry or crowded screen.', 'Resolution, scaling, refresh rate, and monitor capability affect what the customer sees.', 'A cable or adapter may limit available display modes.', 'Check each display separately and change one setting at a time.', 'A customer’s external monitor looks stretched after connecting a new dock.', 4],
  ['Windows', 'Storage cleanup and temporary files', 'Available storage', 'Free space safely without removing customer documents or app data unexpectedly.', 'Storage settings can show temporary files, installed apps, and personal content separately.', 'A cleanup selection can remove downloads or previous installation files.', 'Review each category with the customer before choosing what to remove.', 'A Windows update cannot complete because the system drive is nearly full.', 4],
  ['Microsoft account', 'Aliases and sign-in names', 'Account alias', 'Clarify which sign-in name belongs to the account before changing it.', 'One account can have multiple aliases, but removing an alias may affect where the customer can sign in.', 'An email address used for sign-in may also be used by another service.', 'Confirm another working sign-in method before editing aliases.', 'A customer wants to remove an old email address but still uses it to sign in.', 4],
  ['OneDrive', 'Sync conflicts and version history', 'Version history', 'Protect the current file while checking which version contains the needed changes.', 'Sync conflicts and version history can help identify edits made on different devices.', 'A conflict copy may contain unique work; do not delete it before comparing.', 'Open both versions and confirm the correct content before replacing a file.', 'A customer sees two copies of a presentation after editing it offline.', 4],
  ['Microsoft 365', 'Outlook profile and mailbox checks', 'Mailbox profile', 'Distinguish a sign-in issue from a profile, sync, or mailbox problem.', 'The web mailbox and desktop app can help determine whether the issue is account-wide or app-specific.', 'Rebuilding a profile can take time and may require account setup again.', 'Check the web experience and exact error before recreating an Outlook profile.', 'Outlook on one PC is missing recent mail that appears on the web.', 5],
  ['Microsoft Teams', 'Audio and device selection', 'Selected device', 'Check meeting audio routes before changing system-wide sound settings.', 'A meeting app may select its own speaker and microphone independently from Windows.', 'Mute controls may exist in both the meeting and the device.', 'Verify the selected devices and test one change at a time.', 'A customer hears the meeting through laptop speakers instead of their headset.', 4],
  ['Microsoft Store', 'App update and download status', 'Download queue', 'Check the Store queue, account, network, and storage before reinstalling an app.', 'A queued or paused download can look like a failed install.', 'Reinstalling may not help when the account or queue is the cause.', 'Record the exact status and check whether other downloads are also waiting.', 'A customer’s game update is stuck while other apps download normally.', 4],
  ['Xbox', 'Profile, purchase, and content ownership', 'Signed-in profile', 'Confirm which profile owns the content before reinstalling or buying it again.', 'Digital purchases and subscriptions are associated with the account that acquired them.', 'Console profile and purchasing account can differ.', 'Check the signed-in profile and order history before changing the console setup.', 'A customer cannot find an add-on they bought on another family profile.', 4],
  ['Support', 'Close the loop and verify resolution', 'Verification', 'Confirm the original task works and summarize the agreed next step.', 'A symptom disappearing does not prove the customer’s task is working again.', 'A workaround may need follow-up even when the immediate symptom stops.', 'Ask the customer to repeat the original action and describe what happens.', 'A printer comes back online, but the customer has not tried printing the document they need.', 3],
]

const fixCards = fixTopics.map(([product, subject, keyTerm, objective, knowledge, knowThis, tip, scenario, minutes], index) => ({
  id: index + 1, product, subject, keyTerm, objective, knowledge, knowThis, tip, scenario, minutes,
}))

const FIX_CARD_EPOCH = Date.UTC(2026, 8, 30)
const FIX_CARD_INTERVAL = 360_000
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
  const elapsedSlots = Math.max(0, Math.floor((timestamp - FIX_CARD_EPOCH) / FIX_CARD_INTERVAL))
  const cycle = Math.floor(elapsedSlots / fixCards.length)
  const position = elapsedSlots % fixCards.length
  return {
    index: fixCardOrder(cycle)[position],
    changesAt: FIX_CARD_EPOCH + (elapsedSlots + 1) * FIX_CARD_INTERVAL,
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
  const [clock, setClock] = useState(() => Date.now())
  const card = fixCards[slot.index]
  const accent = ({ Windows: '#1689e8', Word: '#185abd', Excel: '#107c41', PowerPoint: '#c43e1c', Outlook: '#0078d4', OneDrive: '#2b9bea', 'Microsoft 365': '#8764d8', 'Microsoft Defender': '#4b9b73', 'Microsoft Teams': '#6264a7', 'Microsoft account': '#1689e8', 'Microsoft billing': '#c9822b', 'Microsoft Store': '#43a77a', 'Family Safety': '#b76eac', 'Business licensing': '#687f98', 'Remote Desktop Services': '#7d70cb', Sales: '#29998d', Support: '#597a99' })[card.product] || '#6ba8e8'
  useEffect(() => {
    const timer = window.setTimeout(() => setSlot(sharedFixSlotAt()), Math.max(0, slot.changesAt - Date.now()))
    return () => window.clearTimeout(timer)
  }, [slot.changesAt])
  useEffect(() => {
    const timer = window.setInterval(() => setClock(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])
  const secondsLeft = Math.max(0, Math.ceil((slot.changesAt - clock) / 1000))
  const countdown = `${String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:${String(secondsLeft % 60).padStart(2, '0')}`

  return <section className="fix-deck-section" id="fix-of-the-day" aria-labelledby="fix-deck-title">
    <div className="fix-deck-heading"><div><span className="eyebrow">Support skill</span><h2 id="fix-deck-title">Fix for the Day</h2><p>A fresh support card appears every 6 minutes · next in {countdown}</p></div></div>
    <article className="fix-card" key={`${card.id}-${slot.changesAt}`} style={{ '--card-accent': accent }}>
      <div className="fix-card-top"><div className="fix-product"><span className="fix-logo-tile"><ProductGlyph product={card.product} /></span><span><small>PRODUCT CARD</small><strong>{card.product}</strong></span></div></div>
      <div className="fix-card-title-row"><div><span className="fix-card-kicker">FIELD GUIDE · {card.product.toUpperCase()}</span><h3>{card.subject}</h3></div><span className="fix-read-time">◷ {card.minutes} min read</span></div>
      <div className="fix-learning-objective"><span>PRACTICE POINT</span><p>{card.objective}</p></div>
      <div className="fix-scenario"><span>🎧 CUSTOMER SCENARIO</span><p>“{card.scenario}”</p></div>
      <details className="fix-more-details"><summary>More product detail <span aria-hidden="true">＋</span></summary><div className="fix-knowledge-grid">
        <section><span>THE KNOWLEDGE</span><p>{card.knowledge}</p></section>
        <section><span>KEY TERM</span><strong>{card.keyTerm}</strong></section>
        <section><span>KNOW THIS</span><p>{card.knowThis}</p></section>
        <section><span>PRO TIP</span><p>{card.tip}</p></section>
      </div></details>
    </article>
  </section>
}

function App() {
  const isDesktop = useSyncExternalStore(subscribeToDesktopMode, getDesktopMode)
  const [activeSimulator, setActiveSimulator] = useState(null)
  const [activeGame, setActiveGame] = useState(null)
  const [infoPage, setInfoPage] = useState(null)
  const [theme, setTheme] = useState(() => {
    try {
      const saved = window.localStorage.getItem('mlts-theme-v2')
      return THEMES.some((item) => item.id === saved) ? saved : 'light'
    } catch { return 'light' }
  })
  const [simulatorLoad, setSimulatorLoad] = useState({ key: '', state: 'loading' })
  const [simulatorAttempt, setSimulatorAttempt] = useState(0)
  const simulatorRequestId = activeSimulator ? `${activeSimulator}-${simulatorAttempt}` : ''
  const simulatorLoadState = simulatorLoad.key === simulatorRequestId ? simulatorLoad.state : 'loading'
  const [showStartHere, setShowStartHere] = useState(() => {
    try { return window.localStorage.getItem('mlts-start-here-dismissed') !== 'yes' } catch { return true }
  })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { window.localStorage.setItem('mlts-theme-v2', theme) } catch { /* Theme still applies for this visit. */ }
  }, [theme])

  useEffect(() => {
    const targets = document.querySelectorAll('.hero, .games-section, .learning-section, .game-card, .module-card, .activity-panel, .simulator-frame')
    if (!('IntersectionObserver' in window)) { targets.forEach((target) => target.classList.add('is-visible')); return undefined }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target) }
    }), { threshold: 0.12 })
    targets.forEach((target) => { target.classList.add('reveal'); observer.observe(target) })
    return () => observer.disconnect()
  }, [activeGame, activeSimulator])

  const toggleTheme = () => setTheme((current) => {
    const currentIndex = THEMES.findIndex((item) => item.id === current)
    return THEMES[(currentIndex + 1 + THEMES.length) % THEMES.length].id
  })
  const dismissStartHere = () => {
    setShowStartHere(false)
    try { window.localStorage.setItem('mlts-start-here-dismissed', 'yes') } catch { /* Dismiss for this visit even if storage is disabled. */ }
  }

  useEffect(() => {
    if (!activeSimulator) return undefined
    const timer = window.setTimeout(() => setSimulatorLoad((current) => current.key === simulatorRequestId && current.state === 'loading' ? { key: simulatorRequestId, state: 'delayed' } : current), 12000)
    return () => window.clearTimeout(timer)
  }, [activeSimulator, simulatorAttempt, simulatorRequestId])

  if (!isDesktop) return <div className="app-shell"><DesktopOnlyNotice /></div>

  if (infoPage) return <div className="app-shell"><Header onHome={() => setInfoPage(null)} theme={theme} onToggleTheme={toggleTheme} /><InfoPage kind={infoPage} onBack={() => setInfoPage(null)} /><footer><div><strong>MLTS Consumer Simulator</strong><span>Microsoft learning, made practical.</span></div></footer></div>

  if (activeSimulator) {
    const simulator = simulators[activeSimulator]
    return <div className="app-shell"><Header onHome={() => setActiveSimulator(null)} theme={theme} onToggleTheme={toggleTheme} /><main className="simulator-page"><button className="back-button" onClick={() => setActiveSimulator(null)}>← Learning hub</button><section className="simulator-intro"><span className="eyebrow">{simulator.label}</span><div className="simulator-icon">{simulator.icon}</div><h1>{simulator.title}</h1><p>{simulator.description}</p><a className="simulator-open-link" href={simulator.url} target="_blank" rel="noopener noreferrer">Open in new tab <span aria-hidden="true">↗</span></a></section>{simulatorLoadState === 'delayed' && <div className="simulator-load-message" role="status"><span>This simulator is taking a while to load. If it is blocked, open it directly in a new tab.</span><button className="button-secondary" onClick={() => setSimulatorAttempt((value) => value + 1)}>Reload</button></div>}<section className="simulator-frame"><iframe key={simulatorRequestId} title={simulator.title} src={simulator.url} allow="microphone; clipboard-read; clipboard-write" onLoad={() => setSimulatorLoad({ key: simulatorRequestId, state: 'loaded' })} onError={() => setSimulatorLoad({ key: simulatorRequestId, state: 'delayed' })} /></section></main></div>
  }
  if (activeGame) {
    const Game = activeGame === 'typing' ? TypingSprint : activeGame === 'skyfall' ? SkyDropGame : ReplyRemix
    return <div className="app-shell"><Header onHome={() => setActiveGame(null)} theme={theme} onToggleTheme={toggleTheme} /><main><Game onBack={() => setActiveGame(null)} /></main></div>
  }

  const simulatorsList = [
    { id: 'customer', icon: 'chat', tag: 'Talk it out', title: 'Customer Chat Simulator', text: 'Practice calm, helpful customer conversations.', goal: 'Ask clear questions and guide the customer calmly.' },
    { id: 'quiz', icon: 'spark', tag: 'Ask & learn', title: 'Quiz Gauntlet', text: 'Recall consumer Microsoft product knowledge.', goal: 'Strengthen product recall and explain your reasoning.' },
  ]
  const games = [
    { id: 'typing', icon: 'keyboard', tag: '90 seconds', title: 'Typing Master', text: 'Test your speed and accuracy.', goal: 'Build typing speed while keeping accuracy high.' },
    { id: 'skyfall', icon: 'parachute', tag: 'Landing challenge', title: 'Skyfall', text: 'Steer, land, and collect shields.', goal: 'Practice timing, steering, and careful landings.' },
    { id: 'reply', icon: 'reply', tag: `${replyChallengeCount} scenarios`, title: 'Reply Remix', text: 'Choose calm, useful responses.', goal: 'Choose empathetic replies with a clear next step.' },
  ]

  return <div className="app-shell"><Header theme={theme} onToggleTheme={toggleTheme} /><main id="home"><section className="hero"><div className="hero-copy"><span className="eyebrow light">{showStartHere ? 'Start here · consumer support' : 'Consumer support practice'}</span><h1>Build confident support conversations.</h1><p>Practice customer chat, product knowledge, and support skills.</p><div className="hero-actions"><button className="button-primary" onClick={() => { dismissStartHere(); setActiveSimulator('customer') }}>Start customer chat <span aria-hidden="true">→</span></button><a className="button-secondary hero-secondary" href="#activities">Browse activities</a></div></div><div className="hero-sticker" aria-label="Practice, play, and build support skills"><span className="sticker-spark" aria-hidden="true">✦</span><strong>Inside the hub</strong><div><span>01</span> Practice</div><div><span>02</span> Play</div><div><span>03</span> Build skills</div></div></section>
    <section className="learning-section" id="simulators"><div className="section-heading"><div><span className="eyebrow">Practice</span><h2>Customer simulators</h2></div></div><div className="module-grid">{simulatorsList.map((item, index) => <article className={`module-card module-${index + 1}`} key={item.id}><div className="card-top"><span className="module-icon"><ActivityIcon name={item.icon} /></span><span className="card-tag">{item.tag}</span></div><h3>{item.title}</h3><p>{item.text}</p><p className="module-goal"><strong>Goal:</strong> {item.goal}</p><button onClick={() => setActiveSimulator(item.id)}>{item.id === 'customer' ? 'Start simulator' : 'Start quiz' } <span aria-hidden="true">→</span></button><a className="module-open-link" href={simulators[item.id].url} target="_blank" rel="noopener noreferrer">Open in new tab <span aria-hidden="true">↗</span></a></article>)}</div></section>
    <section className="games-section" id="activities"><div className="section-heading"><div><span className="eyebrow">Quick practice</span><h2>Activities</h2></div></div><div className="game-grid">{games.map((item) => <article className="game-card" key={item.id}><div className="game-card-top"><span className="game-icon"><ActivityIcon name={item.icon} /></span><span className="card-tag">{item.tag}</span></div><h3>{item.title}</h3><p>{item.text}</p><p className="module-goal"><strong>Goal:</strong> {item.goal}</p><button className="game-launch" onClick={() => setActiveGame(item.id)}>Start activity <span aria-hidden="true">→</span></button></article>)}</div></section>
    <FixOfTheDay />
    <footer><div><strong>MLTS Consumer Simulator</strong><span>Microsoft learning, made practical.</span></div><nav className="footer-links" aria-label="More information"><button onClick={() => setInfoPage('manual')}>Manual</button><button onClick={() => setInfoPage('team')}>Meet the Team</button></nav><span>Practice at your pace.</span></footer>
  </main></div>
}

export default App
