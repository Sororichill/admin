import { useState, useCallback } from "react";
import type { EnvKey } from "./config";
import { LoginPage } from "./components/LoginPage";
import { DashboardPage } from "./components/DashboardPage";
import { ToastContainer } from "./components/Toast";
import "./App.css";

function getStoredEnv(): EnvKey | null {
  return sessionStorage.getItem("admin_env") as EnvKey | null;
}

function getStoredSecret(): string {
  return sessionStorage.getItem("admin_secret") || "";
}

export default function App() {
  const [currentEnv, setCurrentEnv] = useState<EnvKey>(() => getStoredEnv() || "test");
  const [secret, setSecret] = useState(getStoredSecret);
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!getStoredSecret());

  const handleLogin = useCallback((env: EnvKey, newSecret: string) => {
    sessionStorage.setItem("admin_env", env);
    sessionStorage.setItem("admin_secret", newSecret);
    setCurrentEnv(env);
    setSecret(newSecret);
    setIsLoggedIn(true);
  }, []);

  const handleLogout = useCallback(() => {
    sessionStorage.removeItem("admin_env");
    sessionStorage.removeItem("admin_secret");
    setSecret("");
    setIsLoggedIn(false);
  }, []);

  return (
    <>
      {isLoggedIn ? (
        <DashboardPage
          currentEnv={currentEnv}
          secret={secret}
          onLogout={handleLogout}
        />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
      <ToastContainer />
    </>
  );
}
