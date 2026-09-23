import { useState } from 'react'

const simulators = {
  customer: {
    title: 'Customer Conversation Lab',
    label: 'Scenario practice',
    description:
      'Build confidence through realistic support conversations, one response at a time.',
    icon: '💬',
    accent: 'blue',
    url: 'https://copilotstudio.microsoft.com/environments/Default-b4c546a4-7dac-46a6-a7dd-ed822a11efd3/bots/crbac_test0_Nex4PA/webchat?__version__=2&enableFileAttachment=false&cliAgent=true',
  },
  quiz: {
    title: 'Knowledge Sprint',
    label: 'Knowledge check',
    description:
      'Turn product knowledge into customer-ready confidence with quick challenges.',
    icon: '✦',
    accent: 'purple',
    url: 'https://copilotstudio.microsoft.com/environments/Default-b4c546a4-7dac-46a6-a7dd-ed822a11efd3/bots/crbac_betaquiz_2nN7-S/webchat?__version__=2&enableFileAttachment=false&cliAgent=true',
  },
}

function MicrosoftMark() {
  return (
    <span className="microsoft-mark" aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
    </span>
  )
}

function App() {
  const [activeSimulator, setActiveSimulator] = useState(null)

  if (activeSimulator) {
    const simulator = simulators[activeSimulator]

    return (
      <div className="app-shell">
        <header className="topbar">
          <button className="brand" onClick={() => setActiveSimulator(null)}>
            <MicrosoftMark />
            <span>
              <strong>Support Academy</strong>
              <small>Learn with confidence</small>
            </span>
          </button>

          <span className="status-pill">
            <span className="status-dot" />
            Practice mode
          </span>
        </header>

        <main className="simulator-page">
          <button className="back-button" onClick={() => setActiveSimulator(null)}>
            ← Back to your learning hub
          </button>

          <section className="simulator-intro">
            <span className="eyebrow">{simulator.label}</span>
            <div className={`simulator-icon ${simulator.accent}`}>
              {simulator.icon}
            </div>
            <h1>{simulator.title}</h1>
            <p>{simulator.description}</p>
          </section>

          <section className="simulator-frame">
            <iframe title={simulator.title} src={simulator.url} />
          </section>
        </main>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <MicrosoftMark />
          <span>
            <strong>Support Academy</strong>
            <small>Learn with confidence</small>
          </span>
        </div>

        <div className="topbar-right">
          <span className="office-pill">Freshers onboarding</span>
          <div className="avatar">SA</div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow light">Customer support training</span>
            <h1>Build confidence for your next customer conversation.</h1>
            <p>Practice real support scenarios and product knowledge in short, focused learning sessions.</p>
            <div className="hero-actions">
              <button className="primary-button" onClick={() => setActiveSimulator('customer')}>
                Start conversation practice <span aria-hidden="true">→</span>
              </button>
              <span className="tiny-note">Two practice modules available</span>
            </div>
          </div>
          <div className="hero-summary" aria-label="Your learning options">
            <span className="summary-label">Choose a module</span>
            <button onClick={() => setActiveSimulator('customer')}><span>01</span> Customer conversation <b>→</b></button>
            <button onClick={() => setActiveSimulator('quiz')}><span>02</span> Product knowledge <b>→</b></button>
          </div>
        </section>

        <section className="learning-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Your training path</span>
              <h2>Pick your next win.</h2>
            </div>
            <p>Short, focused practice with real-world impact.</p>
          </div>

          <div className="simulator-grid">
            <article className="learning-card customer-card">
              <div className="card-heading">
                <span className="card-orb" aria-hidden="true">💬</span>
                <span className="card-label">Module 01 · Scenario practice</span>
              </div>
              <h3>Customer conversation</h3>
              <p>Practice listening, showing empathy, and guiding a customer toward a clear next step.</p>
              <div className="card-details"><span>Practice focus</span><strong>Empathy · Clear communication · Problem solving</strong></div>
              <button onClick={() => setActiveSimulator('customer')}>Open conversation practice <span aria-hidden="true">→</span></button>
            </article>

            <article className="learning-card quiz-card">
              <div className="card-heading">
                <span className="card-orb" aria-hidden="true">✦</span>
                <span className="card-label">Module 02 · Knowledge check</span>
              </div>
              <h3>Product knowledge</h3>
              <p>Check what you know with quick questions and learn where to focus next.</p>
              <div className="card-details"><span>Practice focus</span><strong>Product knowledge · Recall · Confidence</strong></div>
              <button onClick={() => setActiveSimulator('quiz')}>Start knowledge check <span aria-hidden="true">→</span></button>
            </article>
          </div>
        </section>

      </main>

      <footer>
        <div>
          <strong>Microsoft Training Simulator</strong>
          <span>Independent customer-support training environment</span>
        </div>
        <span>Practice · Progress · Perform</span>
      </footer>
    </div>
  )
}

export default App