import './index.css';
import {legalPages, LegalPageKey} from './legalContent';

type LegalPageProps = {
  page: LegalPageKey;
};

export default function LegalPage({page}: LegalPageProps) {
  const content = legalPages[page];

  return (
    <div className="legal-page font-body selection:bg-gold selection:text-primary">
      <header className="glass-nav sticky top-0 z-20 border-b border-black/5 bg-surface/90 px-6 py-5 backdrop-blur-xl md:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6">
          <a href="/" className="flex items-center gap-3 font-headline text-lg font-extrabold uppercase tracking-tighter">
            <img src="/emetruth-mark.png" alt="" className="h-9 w-9 rounded-lg object-cover" />
            <span>EmeTruth</span>
          </a>
          <nav className="flex flex-wrap items-center justify-end gap-5 text-[11px] font-bold uppercase tracking-[0.18em] text-muted">
            <a href="/" className="nav-link">Home</a>
            <a href="/privacy.html" className="nav-link">Privacy</a>
            <a href="/terms.html" className="nav-link">Terms</a>
            <a href="/disclosures.html" className="nav-link">Disclosures</a>
          </nav>
        </div>
      </header>

      <main className="px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-4xl">
          <p className="mb-5 font-headline text-xs font-bold uppercase tracking-[0.2em] text-gold">
            EmeTruth
          </p>
          <h1 className="mb-5 font-headline text-4xl font-extrabold uppercase tracking-tighter md:text-6xl">
            {content.title}
          </h1>
          <p className="max-w-3xl text-lg leading-relaxed text-muted">
            {content.description}
          </p>
          <p className="mt-4 text-sm uppercase tracking-[0.14em] text-muted/70">
            Last updated {content.lastUpdated}
          </p>

          <div className="mt-14 space-y-8">
            {content.sections.map((section) => (
              <section key={section.heading} className="legal-card">
                <h2 className="font-headline text-2xl font-extrabold uppercase tracking-tight">
                  {section.heading}
                </h2>
                <div className="mt-4 space-y-4 text-base leading-relaxed text-muted">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
