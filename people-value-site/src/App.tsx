import { useState, useCallback, useEffect } from "react";
import {
  TOKEN_MINT,
  PUMP_FUN_URL,
  FOOTER_X_URL,
  CA_DISPLAY,
  PUMP_LOGOMARK_URL,
  dexScreenerChartUrl,
  dexScreenerIframeSrc,
} from "./config";

const year = new Date().getFullYear();

const copyIconPath =
  "M8 2a1 1 0 0 1 1-1h2.586a1 1 0 0 1 .707.293l3.414 3.414a1 1 0 0 1 .293.707V14a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V2zm-2 0a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7.414A2 2 0 0 0 15.414 6L12 2.586A2 2 0 0 0 10.586 2H6z";

const xPath =
  "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z";

const HOW_TO_BUY_STEPS = [
  {
    step: 1,
    title: "Get a Phantom wallet",
    text: "Install Phantom and create a wallet.",
  },
  {
    step: 2,
    title: "Buy SOL",
    text: "Buy SOL and send it to Phantom.",
  },
  {
    step: 3,
    title: "Go to Pump.fun",
    text: "Open Pump.fun and find PEOPLE.",
  },
  {
    step: 4,
    title: "Swap SOL for PEOPLE",
    text: "Swap SOL → PEOPLE and confirm.",
  },
] as const;

function PumpLogomark({ className }: { className?: string }) {
  return (
    <img
      src={PUMP_LOGOMARK_URL}
      alt=""
      className={className}
      width={120}
      height={40}
      loading="lazy"
      decoding="async"
    />
  );
}

export function App() {
  const mint = TOKEN_MINT;
  const chartPageUrl = dexScreenerChartUrl(mint);
  const iframeSrc = dexScreenerIframeSrc(mint);
  const caIsTbd = CA_DISPLAY.toUpperCase() === "TBD";
  const [caCopied, setCaCopied] = useState(false);
  const [peopleDots, setPeopleDots] = useState(1);

  useEffect(() => {
    const REG = "people_value_site_registered_v1";
    let cancelled = false;

    async function syncPeopleCount() {
      let isNewVisitor = false;
      try {
        isNewVisitor = !localStorage.getItem(REG);
      } catch {
        isNewVisitor = true;
      }

      const mode = isNewVisitor ? "hit" : "get";
      try {
        const r = await fetch(`/api/people-visit?mode=${mode}`);
        const j = (await r.json()) as { count?: number };
        const count = Math.min(48, Math.max(1, Number(j.count) || 1));
        if (isNewVisitor) {
          try {
            localStorage.setItem(REG, "1");
          } catch {
            /* private mode — may re-count on next visit */
          }
        }
        if (!cancelled) setPeopleDots(count);
      } catch {
        try {
          const key = "people_value_site_logins";
          const current = Number(localStorage.getItem(key) || "0") || 0;
          const next = current < 1 ? 1 : current + 1;
          localStorage.setItem(key, String(next));
          if (!cancelled) setPeopleDots(Math.min(48, Math.max(1, next)));
        } catch {
          if (!cancelled) setPeopleDots(1);
        }
      }
    }

    void syncPeopleCount();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleCopyCa = useCallback(() => {
    navigator.clipboard.writeText(CA_DISPLAY).then(() => {
      setCaCopied(true);
      setTimeout(() => setCaCopied(false), 2000);
    });
  }, [CA_DISPLAY]);

  // Keep other effects (login dots) only.

  return (
    <div className="page">
      <div className="page__glow page__glow--1" aria-hidden />
      <div className="page__glow page__glow--2" aria-hidden />

      <main>
        <section className="hero">
          <div className="hero__bg" aria-hidden>
            <video
              className="hero__video"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            >
              <source src="/assets/hero-video.mp4" type="video/mp4" />
            </video>
            <div className="hero__blend" />
            <div className="hero__blend-bottom" aria-hidden />
          </div>
          <header className="site-header hero__nav">
            <a href="#" className="logo">
              People
            </a>
            <nav className="nav">
              <a href="#people">Our people</a>
              <a href="#vision">Vision</a>
              <a href="#chart">Chart</a>
              <a href="#how-to-buy">How to buy</a>
            </nav>
          </header>
          <div className="hero__inner">
            <div className="hero__content">
              <h1 className="hero__word">People</h1>
              <div className="hero__actions">
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--icon btn--hover"
                  aria-label="X (formerly Twitter)"
                >
                  <svg
                    className="icon-x"
                    viewBox="0 0 24 24"
                    aria-hidden
                    width={22}
                    height={22}
                  >
                    <path fill="currentColor" d={xPath} />
                  </svg>
                </a>
                <button
                  type="button"
                  onClick={handleCopyCa}
                  className={`btn btn--ca btn--hover ${caIsTbd ? "" : "btn--ca--address"} ${caCopied ? "btn--ca--copied" : ""}`}
                  title={caIsTbd ? "Copy (TBD for now)" : "Copy contract address"}
                >
                  <span className="btn--ca__label">CA:</span>
                  <span className="btn--ca__value">{caCopied ? "Copied!" : CA_DISPLAY}</span>
                  <svg
                    className="btn--ca__copy"
                    viewBox="0 0 20 20"
                    width={16}
                    height={16}
                    aria-hidden
                  >
                    <path fill="currentColor" d={copyIconPath} />
                  </svg>
                </button>
                <a
                  href={PUMP_FUN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--pump btn--hover"
                  aria-label="Pump.fun"
                >
                  <PumpLogomark className="btn--pump__logo" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="people" className="section section--people">
          <div className="container">
            <h2 className="people-title">Our people</h2>
            <p className="people-subtitle">
              One glow per browser — everyone who visits adds to the total
              (up to 48 on screen).
            </p>
            <div className="people-frame-wrap">
              <div className="people-frame" role="img" aria-label="Our people dots">
              {Array.from({ length: peopleDots }).map((_, i) => (
                <span
                  // eslint-disable-next-line react/no-array-index-key
                  key={i}
                  className="people-dot"
                  style={{
                    left:
                      i === 0
                        ? "50%"
                        : `${((i * 37) % 88) + 6}%`,
                    top:
                      i === 0
                        ? "50%"
                        : `${((i * 53) % 64) + 18}%`,
                    animationDelay: `${(i % 9) * 120}ms`,
                  }}
                />
              ))}
              </div>
            </div>
          </div>
        </section>

        <section id="vision" className="section section--vision">
          <div className="container">
            <h2 className="vision-title">The vision</h2>
            <div className="vision-grid">
              <article className="vision-card btn--hover">
                <h3>People are the asset</h3>
                <p>
                  More valuable than anything AI can produce—because only
                  people create meaning, trust, and real connection.
                </p>
              </article>
              <article className="vision-card btn--hover">
                <h3>Connection changes lives</h3>
                <p>
                  One meeting. One relationship. One introduction. That’s how
                  opportunities appear—and how everything can shift overnight.
                </p>
              </article>
              <article className="vision-card btn--hover">
                <h3>The human future</h3>
                <p>
                  As the world automates, people don’t lose value—they become
                  the only thing that truly matters.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section id="chart" className="section section--chart">
          <div className="container container--wide">
            <h2 className="chart-title">Live chart</h2>
            <div className="chart-shell chart-shell--hover">
              <iframe
                title="DexScreener"
                src={iframeSrc}
                className="chart-shell__iframe"
                allow="clipboard-write"
                loading="lazy"
              />
            </div>
            <div className="chart-actions">
              <a
                href={chartPageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--outline chart-actions__btn btn--hover"
              >
                Open full chart on DexScreener
              </a>
            </div>
          </div>
        </section>

        <section id="how-to-buy" className="section section--buy">
          <div className="container">
            <h2 className="section__title section__title--buy">How to buy</h2>
            <div className="steps-grid">
              {HOW_TO_BUY_STEPS.map((item) => (
                <div key={item.step} className="step-card btn--hover">
                  <span className="step-card__step">Step {item.step}</span>
                  <p className="step-card__title">{item.title}</p>
                  <p className="step-card__text">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer__row">
          <div className="footer__socials">
            <a
              href={FOOTER_X_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="footer__logo-link btn--hover"
              aria-label="X"
            >
              <svg
                viewBox="0 0 24 24"
                width={32}
                height={32}
                fill="currentColor"
                aria-hidden
              >
                <path d={xPath} />
              </svg>
            </a>
            <a
              href={PUMP_FUN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="footer__logo-link footer__logo-link--pump btn--hover"
              aria-label="Pump.fun"
            >
              <PumpLogomark className="footer-pump-img" />
            </a>
          </div>
          <span className="footer__copy">© {year} People First</span>
        </div>
      </footer>
    </div>
  );
}
