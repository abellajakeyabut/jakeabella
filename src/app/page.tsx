import Nav from "@/components/Nav";
import PixelArt from "@/components/PixelArt";
import Typewriter from "@/components/Typewriter";
import Reveal from "@/components/Reveal";
import CoinField from "@/components/CoinField";
import { profile, journey, achievements, projects } from "@/data/profile";

function SectionHead({ stage, title, kicker }: { stage: string; title: string; kicker: string }) {
  return (
    <Reveal className="section-head">
      <span className="section-head__stage">STAGE {stage}</span>
      <h2>{title}</h2>
      <p>{kicker}</p>
    </Reveal>
  );
}

export default function Home() {
  const year = new Date().getFullYear();

  return (
    <>
      <Nav />

      <main>
        {/* ───────── HERO ───────── */}
        <section id="top" className="hero">
          <div className="sky" aria-hidden>
            <PixelArt name="cloud" scale={7} className="cloud cloud--1" />
            <PixelArt name="cloud" scale={5} className="cloud cloud--2" />
            <PixelArt name="cloud" scale={6} className="cloud cloud--3" />
            <div className="sun" />
          </div>
          <CoinField />

          <div className="container hero__inner">
            <div className="hero__text">
              <p className="eyebrow">
                <span className="blink">●</span> PLAYER 1 · READY
              </p>
              <h1 className="hero__name">
                JAKE
                <br />
                <span>ABELLA</span>
              </h1>
              <p className="hero__role">{profile.title}</p>
              <p className="hero__type">
                <Typewriter lines={profile.taglines} />
              </p>
              <div className="hero__cta">
                <a href="#about" className="btn btn--primary">
                  ▶ Press Start
                </a>
                <a href="#contact" className="btn">
                  Get in touch
                </a>
              </div>
            </div>

            <div className="hero__stage" aria-hidden>
              <div className="bubble">
                Hi! I&apos;m Jake.
                <br />
                Welcome to my world.
              </div>
              <PixelArt name="tree" scale={9} className="hero__tree" />
              <PixelArt name="hero" scale={11} className="hero__sprite" />
            </div>
          </div>

          <div className="ground" aria-hidden />
        </section>

        {/* ───────── ABOUT ───────── */}
        <section id="about" className="section">
          <div className="container">
            <SectionHead stage="01" title="About Me" kicker="Character select: a quick look at who I am." />

            <div className="about">
              <Reveal className="player-card px-box">
                <div className="player-card__portrait">
                  <PixelArt name="hero" scale={7} title="Pixel portrait of Jake" />
                </div>
                <h3>{profile.name}</h3>
                <dl className="player-card__attrs">
                  <div>
                    <dt>CLASS</dt>
                    <dd>Tech &amp; Functional Lead</dd>
                  </div>
                  <div>
                    <dt>GUILD</dt>
                    <dd>UOB · Global Markets</dd>
                  </div>
                  <div>
                    <dt>TEAM</dt>
                    <dd>E-Trading Development</dd>
                  </div>
                  <div>
                    <dt>BASE</dt>
                    <dd>{profile.location}</dd>
                  </div>
                </dl>
                <div className="hp">
                  <span>HP</span>
                  <div className="hp__bar">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <i key={i} />
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal delay={120} className="dialog px-box">
                <span className="dialog__name">JAKE</span>
                {profile.summary.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
                <span className="dialog__next blink" aria-hidden>
                  ▼
                </span>
              </Reveal>
            </div>

            <div className="stats">
              {profile.stats.map((s, i) => (
                <Reveal key={s.label} delay={i * 90} className="stat px-box">
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ───────── JOURNEY ───────── */}
        <section id="journey" className="section section--alt">
          <div className="container">
            <SectionHead
              stage="02"
              title="Career Journey"
              kicker="From the tutorial level to Global Markets, one world at a time."
            />

            <ol className="journey">
              {journey.map((stage, i) => (
                <li key={stage.world} className={`level level--${stage.color} ${i % 2 ? "level--right" : ""}`}>
                  <div className="level__node" aria-hidden>
                    <span>{stage.world}</span>
                  </div>
                  <Reveal className="level__card px-box">
                    <div className="level__meta">
                      <span className="level__world">WORLD {stage.world}</span>
                      <span className="level__period">{stage.period}</span>
                    </div>
                    <h3>{stage.role}</h3>
                    <p className="level__org">
                      {stage.org}
                      {stage.location ? ` · ${stage.location}` : ""}
                    </p>
                    <ul>
                      {stage.notes.map((n) => (
                        <li key={n}>{n}</li>
                      ))}
                    </ul>
                    <div className="level__foot">
                      <span className="chip">⏱ {stage.duration}</span>
                      {stage.current && <span className="chip chip--live blink-soft">★ Current level</span>}
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>

            <Reveal className="journey__end">
              <PixelArt name="flag" scale={6} />
              <span>To be continued…</span>
            </Reveal>
          </div>
        </section>

        {/* ───────── SKILLS ───────── */}
        <section id="skills" className="section">
          <div className="container">
            <SectionHead stage="03" title="Skills & Inventory" kicker="Abilities unlocked over two decades of building." />

            <div className="skills">
              <Reveal className="px-box abilities">
                <h3 className="box-title">Special Abilities</h3>
                <ul>
                  {profile.abilities.map((a) => (
                    <li key={a}>
                      <PixelArt name="star" scale={2} />
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
                <div className="top-skills">
                  {profile.topSkills.map((s) => (
                    <span key={s} className="chip chip--strong">
                      {s}
                    </span>
                  ))}
                </div>
              </Reveal>

              <Reveal delay={120} className="px-box inventory">
                <h3 className="box-title">Inventory</h3>
                <div className="inventory__grid">
                  {profile.inventory.map((item) => (
                    <div key={item.name} className="slot">
                      <span className="slot__tag">{item.tag}</span>
                      <span className="slot__name">{item.name}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            <h3 className="subhead">Achievements Unlocked</h3>
            <div className="achievements">
              {achievements.map((a, i) => (
                <Reveal key={a.title} delay={i * 100} className="achievement px-box">
                  <PixelArt name={a.sprite} scale={5} />
                  <div>
                    <span className="achievement__label">ACHIEVEMENT</span>
                    <strong>{a.title}</strong>
                    <span className="achievement__issuer">{a.issuer}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ───────── PORTFOLIO ───────── */}
        <section id="portfolio" className="section section--alt">
          <div className="container">
            <SectionHead stage="04" title="Portfolio" kicker="New game cartridges are on the way. Check back soon." />

            <div className="carts">
              {projects.map((p, i) => {
                const inner = (
                  <>
                    <div className="cart__label">
                      {p.locked ? <PixelArt name="lock" scale={6} /> : <PixelArt name="star" scale={6} />}
                      <span className="cart__no">No. {String(i + 1).padStart(2, "0")}</span>
                    </div>
                    <h3>{p.locked ? "Locked" : p.title}</h3>
                    <p>{p.locked ? "This level hasn't been released yet." : p.blurb}</p>
                    <div className="cart__tags">
                      {p.tags.map((t) => (
                        <span key={t} className="chip">
                          {t}
                        </span>
                      ))}
                    </div>
                  </>
                );
                return (
                  <Reveal key={p.title} delay={i * 100}>
                    {p.locked || !p.url ? (
                      <div className={`cart ${p.locked ? "cart--locked" : ""}`}>{inner}</div>
                    ) : (
                      <a className="cart" href={p.url} target="_blank" rel="noreferrer">
                        {inner}
                      </a>
                    )}
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ───────── CONTACT ───────── */}
        <section id="contact" className="section contact">
          <div className="container">
            <SectionHead stage="05" title="Contact" kicker="Player 2, ready to join?" />

            <Reveal className="contact__box px-box">
              <PixelArt name="heart" scale={12} className="contact__mail" />
              <div>
                <p className="contact__lead">
                  I&apos;m always happy to talk about e-trading, software delivery, architecture, or anything
                  related to code and cybersecurity.
                </p>
                <div className="contact__actions">
                  <a className="btn btn--blue" href={profile.linkedin} target="_blank" rel="noreferrer">
                    in · Connect on LinkedIn
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="ground ground--footer" aria-hidden />
        <div className="footer__inner container">
          <span>© {year} {profile.name}</span>
          <span className="footer__save">
            <PixelArt name="heart" scale={2} /> Thanks for playing
          </span>
          <a href="#top">▲ Back to top</a>
        </div>
      </footer>
    </>
  );
}
