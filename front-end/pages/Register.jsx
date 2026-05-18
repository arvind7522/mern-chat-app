import { useState } from "react";
import Api from "../services/api";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .reg-root {
    min-height: 100vh;
    display: flex; align-items: center; justify-content: center;
    background: #0a0a0f;
    font-family: 'Sora', sans-serif;
    position: relative; overflow: hidden;
  }

  .reg-root::before, .reg-root::after {
    content: ''; position: absolute; border-radius: 50%; pointer-events: none;
    animation: floatOrb 9s ease-in-out infinite alternate;
  }
  .reg-root::before {
    width: 600px; height: 600px; top: -100px; left: -100px;
    background: radial-gradient(circle, rgba(99,102,241,.15) 0%, transparent 70%);
  }
  .reg-root::after {
    width: 500px; height: 500px; bottom: -80px; right: -80px;
    background: radial-gradient(circle, rgba(236,72,153,.1) 0%, transparent 70%);
    animation-direction: alternate-reverse; animation-duration: 11s;
  }
  @keyframes floatOrb {
    from { transform: translate(0,0) scale(1); }
    to   { transform: translate(40px,30px) scale(1.1); }
  }

  .grid-overlay {
    position: absolute; inset: 0; pointer-events: none;
    background-image:
      linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px);
    background-size: 40px 40px;
  }

  .reg-card {
    position: relative; z-index: 10;
    width: 100%; max-width: 420px; margin: 1rem;
    background: rgba(255,255,255,.03);
    border: 1px solid rgba(255,255,255,.08);
    border-radius: 24px; padding: 44px 40px 40px;
    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    box-shadow: 0 0 0 1px rgba(255,255,255,.04), 0 32px 80px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.08);
    animation: cardReveal .7s cubic-bezier(.16,1,.3,1) both;
  }
  @keyframes cardReveal {
    from { opacity: 0; transform: translateY(28px) scale(.97); }
    to   { opacity: 1; transform: none; }
  }

  .brand { display: flex; align-items: center; gap: 10px; margin-bottom: 32px; }
  .brand-icon {
    width: 36px; height: 36px; border-radius: 10px;
    background: linear-gradient(135deg, #6366f1, #ec4899);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 16px rgba(99,102,241,.4);
  }
  .brand-icon svg { width: 18px; height: 18px; fill: none; stroke: white; stroke-width: 2.5; stroke-linecap: round; }
  .brand-name { font-size: 15px; font-weight: 600; color: rgba(255,255,255,.9); }

  .reg-title { font-size: 26px; font-weight: 700; color: #fff; letter-spacing: -.03em; }
  .reg-sub   { margin-top: 6px; font-size: 13.5px; color: rgba(255,255,255,.4); }

  .divider {
    height: 1px; margin: 24px 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.07), transparent);
  }

  .reg-form { display: flex; flex-direction: column; gap: 18px; }

  .field { display: flex; flex-direction: column; gap: 7px; }

  .field-label {
    font-size: 12px; font-weight: 600; text-transform: uppercase;
    letter-spacing: .08em; color: rgba(255,255,255,.5);
    font-family: 'JetBrains Mono', monospace;
    transition: color .25s;
  }
  .field:focus-within .field-label { color: #818cf8; }

  .input-wrap { position: relative; }
  .input-wrap svg {
    position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
    width: 16px; height: 16px; color: rgba(255,255,255,.25);
    pointer-events: none; transition: color .25s;
  }
  .field:focus-within .input-wrap svg { color: #818cf8; }

  /* gradient underline on focus */
  .input-wrap::after {
    content: ''; position: absolute; bottom: 0; left: 14px; right: 14px;
    height: 2px; border-radius: 0 0 12px 12px;
    background: linear-gradient(90deg, #6366f1, #ec4899);
    opacity: 0; transform: scaleX(0);
    transition: opacity .25s, transform .35s cubic-bezier(.16,1,.3,1);
    pointer-events: none;
  }
  .field:focus-within .input-wrap::after { opacity: 1; transform: scaleX(1); }

  .field-input {
    width: 100%; padding: 12px 14px 12px 42px;
    background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.08);
    border-radius: 12px; color: #fff; font-size: 14px;
    font-family: 'Sora', sans-serif; outline: none;
    transition: border-color .25s, background .25s, box-shadow .25s, transform .2s;
  }
  .field-input::placeholder { color: rgba(255,255,255,.2); }
  .field-input:hover  { background: rgba(255,255,255,.07); border-color: rgba(255,255,255,.15); }
  .field-input:focus  {
    background: rgba(99,102,241,.06); border-color: rgba(99,102,241,.6);
    box-shadow: 0 0 0 3px rgba(99,102,241,.12); transform: translateY(-1px);
  }

  .success {
    display: flex; align-items: center; gap: 8px;
    padding: 10px 14px; border-radius: 10px;
    background: rgba(52,211,153,.1); border: 1px solid rgba(52,211,153,.2);
    color: #6ee7b7; font-size: 13px; font-weight: 500;
  }
  .success svg { width: 15px; height: 15px; fill: none; stroke: #6ee7b7; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; flex-shrink: 0; }

  .submit-btn {
    margin-top: 4px; width: 100%; padding: 13px; border: none; border-radius: 12px;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
    color: #fff; font-size: 14px; font-family: 'Sora', sans-serif; font-weight: 600;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
    box-shadow: 0 4px 20px rgba(99,102,241,.35);
    transition: transform .2s cubic-bezier(.34,1.56,.64,1), box-shadow .25s;
  }
  .submit-btn:hover:not(:disabled) { transform: translateY(-2px) scale(1.01); box-shadow: 0 8px 30px rgba(99,102,241,.5); }
  .submit-btn:active:not(:disabled) { transform: scale(.99); }
  .submit-btn:disabled { opacity: .6; cursor: not-allowed; }

  .spinner {
    width: 16px; height: 16px; border-radius: 50%;
    border: 2px solid rgba(255,255,255,.3); border-top-color: white;
    animation: spin .7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .signin-link { text-align: center; margin-top: 20px; font-size: 13px; color: rgba(255,255,255,.35); }
  .signin-link a { color: #818cf8; font-weight: 500; text-decoration: none; transition: color .2s; }
  .signin-link a:hover { color: #a5b4fc; }
`;

export default function Register() {
  const [user, setUser]         = useState(null);
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (name && email && password) {
        const newUser = { name, email, password };
        await Api.post("/auth/register", newUser);
        setUser(newUser);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setName(""); setEmail(""); setPassword("");
    }
  };

  return (
    <>
      <style>{styles}</style>

      <div className="reg-root">
        <div className="grid-overlay" />

        <div className="reg-card">

          <div className="brand">
            <div className="brand-icon">
              <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
            </div>
            <span className="brand-name">ChatApp</span>
          </div>

          <h1 className="reg-title">Create account</h1>
          <p className="reg-sub">Start chatting in seconds</p>

          <div className="divider" />

          <form className="reg-form" onSubmit={handleSubmit}>

            <div className="field">
              <label className="field-label" htmlFor="name">Name</label>
              <div className="input-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                <input id="name" className="field-input" type="text" placeholder="Your full name"
                  value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
            </div>

            <div className="field">
              <label className="field-label" htmlFor="email">Email</label>
              <div className="input-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
                <input id="email" className="field-input" type="email" placeholder="you@example.com"
                  value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>

            <div className="field">
              <label className="field-label" htmlFor="password">Password</label>
              <div className="input-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input id="password" className="field-input" type="password" placeholder="Min. 8 characters"
                  value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
            </div>

            {user && (
              <div className="success">
                <svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                Account created! Welcome, {user.name}.
              </div>
            )}

            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? <><span className="spinner" /> Creating account…</> : "Create Account"}
            </button>

          </form>

          <p className="signin-link">
            Already have an account? <a href="/login">Sign in</a>
          </p>

        </div>
      </div>
    </>
  );
}