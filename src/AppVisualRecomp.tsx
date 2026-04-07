const operatingStats = [
  {label: 'Volume Routed', value: '$19M+'},
  {label: 'Focus', value: 'Prediction Markets'},
  {label: 'Primary Mandate', value: 'Tighter Spreads'},
  {label: 'Engagement Model', value: 'Selective'},
];

const mandates = [
  {
    title: 'Launch Support',
    body: 'Seed new contracts with visible depth, credible price bands, and enough early activity to make the venue feel alive.',
  },
  {
    title: 'Continuous Quoting',
    body: 'Run steady, disciplined liquidity programs that narrow spreads and make live venues easier to trust.',
  },
  {
    title: 'Market Design',
    body: 'Shape listings, incentive design, and contract structure around how real traders actually discover and price event risk.',
  },
];

const intelligenceLayers = [
  {
    eyebrow: 'Sources',
    title: 'Inputs That Are Not Commoditized',
    body: 'The edge is not generic market-making coverage. It starts upstream, with proprietary information flows and differentiated context.',
  },
  {
    eyebrow: 'Workflows',
    title: 'Signals Structured For Action',
    body: 'Raw information only matters once it is organized into pricing logic, risk posture, and execution decisions.',
  },
  {
    eyebrow: 'Execution',
    title: 'Built For Event Risk, Not Generic Flow',
    body: 'Prediction markets reprice violently around openings, narratives, and resolution paths. The execution layer is built around that reality.',
  },
];

const processSteps = [
  {
    id: '01',
    title: 'Venue Review',
    body: 'Assess market structure, launch goals, API readiness, and where liquidity gaps are suppressing trader confidence.',
  },
  {
    id: '02',
    title: 'Program Design',
    body: 'Define which markets matter, how depth should appear, and where execution policy needs to be more disciplined.',
  },
  {
    id: '03',
    title: 'Active Deployment',
    body: 'Operate the strategy in market with feedback loops around spread quality, fill behavior, and venue-specific constraints.',
  },
];

const footerLinks = [
  {label: 'Program', href: '#mandates'},
  {label: 'Intelligence', href: '#intelligence'},
  {label: 'Process', href: '#process'},
  {label: 'Contact', href: '#contact'},
];

export default function AppVisualRecomp() {
  return (
    <div className="visual-shell">
      <a href="#main-content" className="visual-skip-link">
        Skip To Content
      </a>

      <header className="visual-header">
        <div className="visual-header__bar">
          <a href="#top" className="visual-brand" aria-label="Emetruth Capital home">
            Emetruth Capital
          </a>
          <nav aria-label="Primary navigation" className="visual-nav">
            <a href="#mandates">Mandates</a>
            <a href="#intelligence">Intelligence</a>
            <a href="#proof">Proof</a>
            <a href="#contact">Contact</a>
          </nav>
          <a href="mailto:partners@emetruth.capital?subject=Operator%20Inquiry" className="visual-pill">
            Book A Conversation
          </a>
        </div>

        <section id="top" className="visual-hero">
          <div className="visual-hero__grid" aria-hidden="true" />
          <div className="visual-hero__intro">
            <p className="visual-kicker">Institutional Liquidity Infrastructure</p>
            <h1 id="main-content" className="visual-hero__title text-balance">
              Make prediction markets feel deep, orderly, and worth trading.
            </h1>
            <p className="visual-hero__body">
              Emetruth Capital works with prediction venues that need sharper market quality,
              cleaner launches, and a more credible trading experience from day one.
            </p>
          </div>

          <div className="visual-hero__aside">
            <div className="visual-proof-card">
              <p className="visual-proof-card__label">Working Thesis</p>
              <p className="visual-proof-card__body">
                Liquidity is not a support function. In prediction markets, it is the product
                surface traders feel first.
              </p>
            </div>

            <div className="visual-actions">
              <a href="#proof" className="visual-cta visual-cta--primary">
                See Operating Proof
              </a>
              <a href="mailto:partners@emetruth.capital?subject=LP%20Inquiry" className="visual-cta visual-cta--secondary">
                LP Inquiries
              </a>
            </div>
          </div>
        </section>
      </header>

      <main>
        <section id="proof" className="visual-band" aria-labelledby="proof-title">
          <div className="visual-band__eyebrow">Operating Signal</div>
          <h2 id="proof-title" className="visual-band__title">
            A lean proof strip instead of decorative claims.
          </h2>
          <div className="visual-stats" role="list" aria-label="Operating proof points">
            {operatingStats.map((stat) => (
              <article key={stat.label} className="visual-stat" role="listitem">
                <p className="visual-stat__value">{stat.value}</p>
                <p className="visual-stat__label">{stat.label}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="mandates" className="visual-section visual-section--mandates" aria-labelledby="mandates-title">
          <div className="visual-section__lead">
            <p className="visual-kicker">Mandates</p>
            <h2 id="mandates-title" className="visual-section__title text-balance">
              Structured around the moments where thin markets fail.
            </h2>
            <p className="visual-section__body">
              The page no longer sells “innovation.” It spells out the operating jobs that
              actually change trader experience and venue perception.
            </p>
          </div>

          <div className="visual-mandates">
            {mandates.map((mandate) => (
              <article key={mandate.title} className="visual-mandate-card">
                <h3>{mandate.title}</h3>
                <p>{mandate.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="intelligence" className="visual-section visual-section--intelligence" aria-labelledby="intelligence-title">
          <div className="visual-section__lead visual-section__lead--split">
            <div>
              <p className="visual-kicker">Intelligence Stack</p>
              <h2 id="intelligence-title" className="visual-section__title text-balance">
                A calmer, denser way to explain the edge.
              </h2>
            </div>
            <p className="visual-section__body">
              This version shifts from glossy cards to an editorial rhythm: source, structure,
              execution. Each layer earns the next one.
            </p>
          </div>

          <div className="visual-intelligence-grid">
            {intelligenceLayers.map((layer) => (
              <article key={layer.title} className="visual-intelligence-card">
                <p className="visual-intelligence-card__eyebrow">{layer.eyebrow}</p>
                <h3>{layer.title}</h3>
                <p>{layer.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="process" className="visual-section visual-section--process" aria-labelledby="process-title">
          <div className="visual-section__lead">
            <p className="visual-kicker">Operating Model</p>
            <h2 id="process-title" className="visual-section__title text-balance">
              Clear sequence. Minimal ornament. Better hierarchy.
            </h2>
          </div>

          <ol className="visual-process">
            {processSteps.map((step) => (
              <li key={step.id} className="visual-process__step">
                <div className="visual-process__index" aria-hidden="true">
                  {step.id}
                </div>
                <div className="visual-process__content">
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section id="contact" className="visual-section visual-section--contact" aria-labelledby="contact-title">
          <div className="visual-contact-card">
            <p className="visual-kicker">Selective Engagement</p>
            <h2 id="contact-title" className="visual-contact-card__title text-balance">
              If the venue matters, the presentation should feel that way too.
            </h2>
            <p className="visual-contact-card__body">
              This alternate version aims to feel less like a speculative startup landing page
              and more like a precise institutional front door.
            </p>
            <div className="visual-actions visual-actions--contact">
              <a href="mailto:partners@emetruth.capital?subject=Operator%20Inquiry" className="visual-cta visual-cta--primary">
                Talk To Emetruth
              </a>
              <a href="mailto:partners@emetruth.capital?subject=Capital%20Partner%20Inquiry" className="visual-cta visual-cta--secondary">
                Capital Partner Inquiry
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="visual-footer">
        <div className="visual-footer__brand">Emetruth Capital</div>
        <nav aria-label="Footer navigation" className="visual-footer__links">
          {footerLinks.map((link) => (
            <a key={link.label} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className="visual-footer__meta">© 2026 Emetruth. Alternate Visual Direction.</div>
      </footer>
    </div>
  );
}
