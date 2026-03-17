import { useState, useCallback } from "react";
import type { EnvKey } from "./config";
import { LoginPage } from "./components/LoginPage";
import { DashboardPage } from "./components/DashboardPage";
import { ToastContainer } from "./components/Toast";
import "./App.css";

const isLocalAccess = ["localhost", "127.0.0.1", ""].includes(location.hostname);
const defaultEnv: EnvKey = isLocalAccess ? "test" : "prod";

function getInitialEnv(): EnvKey {
  return (sessionStorage.getItem("admin_env") as EnvKey) || defaultEnv;
}

function getSecretForEnv(env: EnvKey): string {
  return sessionStorage.getItem(`admin_secret_${env}`) || "";
}

export default function App() {
  const [currentEnv, setCurrentEnv] = useState<EnvKey>(getInitialEnv);
  const [secret, setSecret] = useState(() => getSecretForEnv(getInitialEnv()));
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!getSecretForEnv(getInitialEnv()));

  const handleEnvChange = useCallback((env: EnvKey) => {
    setCurrentEnv(env);
    sessionStorage.setItem("admin_env", env);
    const stored = getSecretForEnv(env);
    setSecret(stored);
    if (!stored) {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogin = useCallback(
    (newSecret: string) => {
      sessionStorage.setItem(`admin_secret_${currentEnv}`, newSecret);
      setSecret(newSecret);
      setIsLoggedIn(true);
    },
    [currentEnv]
  );

  const handleLogout = useCallback(() => {
    sessionStorage.removeItem(`admin_secret_${currentEnv}`);
    setSecret("");
    setIsLoggedIn(false);
  }, [currentEnv]);

  return (
    <>
      {isLoggedIn ? (
        <DashboardPage
          currentEnv={currentEnv}
          secret={secret}
          onEnvChange={(env) => {
            const stored = getSecretForEnv(env);
            setCurrentEnv(env);
            sessionStorage.setItem("admin_env", env);
            setSecret(stored);
            if (!stored) setIsLoggedIn(false);
          }}
          onLogout={handleLogout}
          onNeedLogin={() => setIsLoggedIn(false)}
        />
      ) : (
        <LoginPage
          currentEnv={currentEnv}
          onEnvChange={handleEnvChange}
          onLogin={handleLogin}
        />
      )}
      <ToastContainer />
    </>
  );
}
