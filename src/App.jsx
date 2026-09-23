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
          <div className="hero-glow glow-one" />
          <div className="hero-glow glow-two" />

          <div className="hero-copy">
            <span className="eyebrow light">Customer support training</span>
            <h1>
              Learn the skills.
              <span> Love the progress.</span>
            </h1>
            <p>
              A calm, practical space for new support professionals to build
              confidence before their first real customer conversation.
            </p>

            <div className="hero-actions">
              <button
                className="primary-button"
                onClick={() => setActiveSimulator('customer')}
              >
                Start practicing <span>→</span>
              </button>

              <span className="tiny-note">
                <span>✦</span> Two learning modules ready
              </span>
            </div>
          </div>

          <aside className="hero-card">
            <div className="hero-card-top">
              <span>Today’s momentum</span>
              <span className="sparkle">✦</span>
            </div>

            <div className="circle-progress">
              <strong>01</strong>
              <span>of 02</span>
            </div>

            <h2>You’re ready to grow.</h2>
            <p>Start small. Practice often. Show up confidently.</p>

            <div className="mini-progress">
              <span />
            </div>
          </aside>
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
              <div className="card-orb">💬</div>
              <span className="card-label">Module 01 · Scenario practice</span>
              <h3>Customer Simulator</h3>
              <p>
                Practice empathy, clarity, and confident responses through
                realistic customer-support conversations.
              </p>

              <div className="skill-tags">
                <span>Communication</span>
                <span>Empathy</span>
                <span>Problem solving</span>
              </div>

              <button onClick={() => setActiveSimulator('customer')}>
                Open conversation lab <span>→</span>
              </button>
            </article>

            <article className="learning-card quiz-card">
              <div className="card-orb">✦</div>
              <span className="card-label">Module 02 · Knowledge check</span>
              <h3>Quiz Simulator</h3>
              <p>
                Reinforce product knowledge with quick questions that make
                learning feel focused, useful, and rewarding.
              </p>

              <div className="skill-tags">
                <span>Product knowledge</span>
                <span>Confidence</span>
                <span>Growth</span>
              </div>

              <button onClick={() => setActiveSimulator('quiz')}>
                Start knowledge sprint <span>→</span>
              </button>
            </article>
          </div>
        </section>

        <section className="promise-strip">
          <span className="promise-icon">✦</span>
          <p>
            Every great support experience starts with a confident first
            conversation.
          </p>
          <span className="promise-icon">✦</span>
        </section>
      </main>

      <footer>
        <div>
          <strong>Support Academy</strong>
          <span>Independent customer-support training environment</span>
        </div>
        <span>Practice · Progress · Perform</span>
      </footer>
    </div>
  )
}

export default App