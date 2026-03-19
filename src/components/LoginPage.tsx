import { useState, useRef } from "react";
import { apiFetch } from "../api";

interface LoginPageProps {
  onLogin: (secret: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleLogin = async () => {
    const trimmed = password.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setError("");

    try {
      const res = await apiFetch("GET", trimmed, "?status=pending");
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

  return (
    <div className="login-screen">
      <div className="login-card">
        <h2>🏡 Sororichill Admin</h2>
        <p>Enter the admin secret to review organizer applications</p>
        <div className="input-group" style={{ marginBottom: 12 }}>
          <input
            ref={inputRef}
            type="password"
            placeholder="Admin secret"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
          <button className="btn btn-primary" onClick={handleLogin} disabled={loading}>
            {loading ? "…" : "Sign in"}
          </button>
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
