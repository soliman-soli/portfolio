import Reveal from "@/components/Reveal";
import { profile } from "@/data/profile";

const FACTS = [
  { label: "Based in", value: profile.basedIn },
  { label: "Focus", value: profile.focus },
  { label: "Currently", value: profile.currently },
];

export default function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="section-padding"
    >
      <div className="container-main">
        <div className="grid lg:grid-cols-[1fr_auto] gap-12 lg:gap-20 items-start">
          {/* Text column */}
          <div className="max-w-2xl">
            <Reveal>
              <p className="mono-label mb-4">{"About"}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2
                id="about-heading"
                className="
                  font-serif
                  text-[clamp(2rem,4vw,3.5rem)]
                  font-semibold leading-tight tracking-tight
                  text-[var(--text-primary)] mb-6
                "
              >
                Engineering student.
                <br />
                Systems thinker.
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="font-sans text-[var(--text-muted)] leading-relaxed space-y-4">
                {profile.bio
                  .split("\n")
                  .filter(Boolean)
                  .map((line, i) => (
                    <p key={i}>{line.trim()}</p>
                  ))}
              </div>
            </Reveal>
          </div>

          {/* Facts column */}
          <Reveal delay={0.3} className="shrink-0">
            <div
              className="
                bg-[var(--surface)] border border-[var(--brass-soft)]/40
                rounded-card p-6 min-w-[220px]
                shadow-card
              "
            >
              <p className="mono-label mb-5 text-[var(--brass)]">Quick facts</p>
              <dl className="space-y-4">
                {FACTS.map(({ label, value }) => (
                  <div key={label}>
                    <dt className="font-mono text-xs uppercase tracking-widest text-[var(--text-muted)] mb-0.5">
                      {label}
                    </dt>
                    <dd className="font-sans text-sm text-[var(--text-primary)] font-medium">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
