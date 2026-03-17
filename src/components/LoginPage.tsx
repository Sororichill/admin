import { useState, useRef } from "react";
import { ENV_CONFIG, type EnvKey } from "../config";
import { apiFetch } from "../api";

interface LoginPageProps {
  currentEnv: EnvKey;
  onEnvChange: (env: EnvKey) => void;
  onLogin: (secret: string) => void;
}

export function LoginPage({ currentEnv, onEnvChange, onLogin }: LoginPageProps) {
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const cfg = ENV_CONFIG[currentEnv];
  const badgeClass = currentEnv === "prod" ? "prod" : "test";

  const handleLogin = async () => {
    const trimmed = secret.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setError("");

    try {
      const res = await apiFetch("GET", currentEnv, trimmed, "?status=pending");
      if (res.ok) {
        onLogin(trimmed);
      } else {
        setError("Invalid admin secret");
      }
    } catch {
      setError("Connection failed — check your network");
    } finally {
      setLoading(false);
    }
  };

  const handleEnvChange = (env: EnvKey) => {
    setSecret("");
    setError("");
    onEnvChange(env);
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <h2>🏡 Sororichill Admin</h2>
        <p>Enter the admin secret to review organizer applications</p>
        <div className="login-env-info">
          Connecting to:{" "}
          <span className={`env-badge ${badgeClass}`}>
            {cfg.icon} {cfg.label}
          </span>
        </div>
        <div className="input-group" style={{ marginBottom: 12 }}>
          <input
            ref={inputRef}
            type="password"
            placeholder="Admin secret"
            autoFocus
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
          <button className="btn btn-primary" onClick={handleLogin} disabled={loading}>
            {loading ? "…" : "Sign in"}
          </button>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            fontSize: 13,
            color: "var(--muted)",
          }}
        >
          <label htmlFor="login-env-select">Environment:</label>
          <div className="env-switcher">
            <select
              id="login-env-select"
              value={currentEnv}
              onChange={(e) => handleEnvChange(e.target.value as EnvKey)}
            >
              <option value="test">Test</option>
              <option value="prod">Production</option>
            </select>
          </div>
        </div>
        {error && (
          <div className="error-msg" style={{ display: "block" }}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
