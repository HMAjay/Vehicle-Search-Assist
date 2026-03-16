import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "../utils/api";

export default function HomePage() {
  const [vehicleCount, setVehicleCount] = useState("...");
  useEffect(() => {
    api
      .getVehicleCount()
      .then(({ count }) => setVehicleCount(count))
      .catch(() => setVehicleCount("—"));
  }, []);
  const navigate = useNavigate();

  return (
    <div className="home-shell">
      {/* ── NAV ── */}
      <nav className="home-nav">
        <div className="home-nav-brand">
          {/* LOGO PLACEHOLDER */}
          <img src="/logo.png" alt="logo" className="home-nav-logo" />
          VahanConnect
        </div>

        <div className="home-nav-links">
          <a href="#how">How it works</a>
          <a href="#about">About</a>
          <a href="#developer">Developer</a>
        </div>

        <button
          className="btn btn-primary home-nav-cta"
          onClick={() => navigate("/login")}
        >
          Get started →
        </button>
      </nav>

      {/* ── HERO ── */}
      <section className="home-hero">
        <div className="home-hero-bg" />
        <div className="home-hero-grid" />

        <div className="home-hero-badge fade-up">
          <span className="home-hero-dot" />
          Find. Connect. Solve
        </div>

        {/* HERO LOGO PLACEHOLDER */}
        <div className="home-hero-logo-wrap fade-up d1">
          <img
            src="/logo.png"
            alt="VahanConnect"
            className="home-hero-logo-img"
          />
        </div>

        <h1 className="home-hero-title fade-up d2">
          Find any vehicle owner <span className="home-accent">instantly.</span>
        </h1>

        <p className="home-hero-sub fade-up d3">
          VahanConnect bridges the gap between a plate number and a person.
          Search any registered vehicle and contact the owner in seconds.
        </p>

        <div className="home-hero-actions fade-up d4">
          <button
            className="btn btn-primary home-btn-lg"
            onClick={() => navigate("/register")}
          >
            Get started free →
          </button>
          <a href="#how" className="btn btn-ghost home-btn-lg">
            See how it works
          </a>
        </div>

        <div className="home-stats fade-up d5">
          {[
            ["3s", "Avg search time"],
            [vehicleCount, "Registered vehicles"],
            ["Free", "Always"],
          ].map(([num, label]) => (
            <div key={label} className="home-stat">
              <div className="home-stat-num">{num}</div>
              <div className="home-stat-label">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── USE CASES ── */}
      <section className="home-section home-section-alt" id="cases">
        <div className="home-section-inner">
          <div className="home-section-header">
            <span className="view-tag">Why VahanConnect</span>
            <h2 className="home-section-title">
              Real situations, real solutions
            </h2>
            <p className="home-section-sub">
              Every day, people face situations where they need to reach a
              vehicle owner — fast. VahanConnect makes that possible.
            </p>
          </div>

          <div className="home-cases-grid">
            {[
              {
                title: "Blocked parking",
                desc: "Your vehicle is obstructed and you're getting late. Search the plate, message the owner directly, and get it resolved without waiting for authorities.",
                icon: (
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--amber)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                ),
              },
              {
                title: "Accident or damage",
                desc: "If you've accidentally grazed another vehicle. Contact the owner immediately to handle it responsibly.",
                icon: (
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--amber)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                ),
              },
              {
                title: "Emergency contact",
                desc: "A vehicle is blocking a fire exit or ambulance route. Reach the owner immediately — because in emergencies, every second counts.",
                icon: (
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--amber)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.8 19.8 0 0 1 1.61 4.4 2 2 0 0 1 3.6 2.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 17z" />
                  </svg>
                ),
              },
              {
                title: "Return lost items",
                desc: "Found something left on or near a vehicle? Identify the owner and return it — the kind act that makes communities better.",
                icon: (
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--amber)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
                    <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                  </svg>
                ),
              },
              {
                title: "Lights left on",
                desc: "A vehicle's headlights have been left on. A quick search and a message saves someone from a dead battery.",
                icon: (
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--amber)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4l3 3" />
                  </svg>
                ),
              },
              {
                title: "Residential disputes",
                desc: "An unknown vehicle keeps parking in your spot. Contact the owner directly and resolve it neighbourly — no arguments needed.",
                icon: (
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--amber)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                ),
              },
            ].map(({ title, desc, icon }) => (
              <div key={title} className="home-case-card">
                <div className="home-case-icon">{icon}</div>
                <h3 className="home-case-title">{title}</h3>
                <p className="home-case-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="home-section" id="how">
        <div className="home-how-inner">
          <div className="home-section-header">
            <span className="view-tag">How it works</span>
            <h2 className="home-section-title">Three steps to contact</h2>
            <p className="home-section-sub">
              No complicated process. Register once, search anytime, message
              instantly.
            </p>
          </div>

          <div className="home-steps">
            <div className="home-steps-line" />
            {[
              [
                "01",
                "Register your vehicle",
                "Create a free account with your email, vehicle name, and plate number. Your details are secured and only shared when someone searches for your vehicle.",
              ],
              [
                "02",
                "Search any plate number",
                "Type the vehicle registration number from the dashboard. VahanConnect instantly finds the registered owner's profile in the database.",
              ],
              [
                "03",
                "Send a message",
                "Contact the owner directly through the built-in messaging system. No phone numbers exchanged — private, fast, and secure communication.",
              ],
            ].map(([num, title, desc]) => (
              <div key={num} className="home-step">
                <div className="home-step-num">{num}</div>
                <div className="home-step-content">
                  <h3 className="home-step-title">{title}</h3>
                  <p className="home-step-desc">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className="home-section home-section-alt" id="about">
        <div className="home-about-inner">
          <div className="home-about-text">
            <span className="view-tag">About VahanConnect</span>
            <h2 className="home-section-title" style={{ marginTop: 16 }}>
              Built for real-world moments
            </h2>
            <p className="home-section-sub" style={{ marginBottom: 28 }}>
              VahanConnect was built from a simple frustration — the inability
              to contact a vehicle owner in situations that demand immediate
              action. No middlemen, no waiting, no bureaucracy.
            </p>
            <ul className="home-about-list">
              {[
                "Secure messaging — no personal contact details ever exposed",
                "JWT-authenticated access — your data is protected at all times",
                "Real-time inbox with unread notifications",
                "Completely free — no subscriptions, no ads, no hidden fees",
                "Built on a modern MERN stack with MongoDB Atlas cloud database",
              ].map((item) => (
                <li key={item} className="home-about-item">
                  <span className="home-about-dot" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="home-stack-card">
            <p className="home-stack-tag">Tech stack</p>
            <div className="home-stack-list">
              {[
                ["Frontend", "React + Vite"],
                ["Backend", "Node.js + Express"],
                ["Database", "MongoDB Atlas"],
                ["Auth", "JWT + bcrypt"],
                ["Deployment", "Vercel + Render"],
                ["Security", "Rate limiting + CORS"],
              ].map(([label, val]) => (
                <div key={label} className="home-stack-item">
                  <span className="home-stack-label">{label}</span>
                  <span className="home-stack-val">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── DEVELOPER ── */}
      <section className="home-section" id="developer">
        <div className="home-dev-outer">
          <span className="view-tag">The developer</span>
          <h2 className="home-section-title" style={{ marginTop: 16 }}>
            Made by a developer,
            <br />
            for real people.
          </h2>
          <p className="home-section-sub" style={{ margin: "0 auto" }}>
            VahanConnect isn't a corporate product. It's a project built with
            care to solve everyday problems that people face with vehicles.
          </p>

          <div className="home-dev-card">
            <div className="home-dev-avatar">AJ</div>
            <h3 className="home-dev-name">Ajay</h3>
            <p className="home-dev-role">Full Stack Developer</p>
            <p className="home-dev-bio">
              Passionate about building tools that solve real problems.
              VahanConnect started as an idea to make vehicle-owner
              communication easier and evolved into a full-stack production
              application — with security, clean architecture, and a thoughtful
              user experience.
            </p>
            <div className="home-dev-links">
              <a
                href="https://github.com/HMAjay"
                target="_blank"
                rel="noopener noreferrer"
                className="home-dev-link"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                github.com/HMAjay
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="home-cta-section">
        <div className="home-cta-inner">
          <span
            className="view-tag"
            style={{ display: "inline-block", marginBottom: 20 }}
          >
            Ready?
          </span>
          <h2 className="home-cta-title">
            Start finding vehicle owners today.
          </h2>
          <p className="home-cta-sub">
            Free to use. Just register and search.
          </p>
          <div className="home-cta-actions">
            <button
              className="btn btn-primary home-btn-lg"
              onClick={() => navigate("/register")}
            >
              Create free account →
            </button>
            <button
              className="btn btn-ghost home-btn-lg"
              onClick={() => navigate("/login")}
            >
              Sign in
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="home-footer">
        <div className="home-footer-brand">
          {/* FOOTER LOGO PLACEHOLDER */}
          <img src="/logo.png" alt="logo" className="home-footer-logo" />
          VahanConnect
        </div>

        <span className="home-footer-copy">
          © 2026 VahanConnect. Built by Ajay.
        </span>

        <div className="home-footer-links">
          <a href="/register">Register</a>
          <a href="/login">Sign in</a>
          <a
            href="https://github.com/HMAjay"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
