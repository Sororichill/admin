import { useState, useCallback } from "react";
import { LoginPage } from "./components/LoginPage";
import { DashboardPage } from "./components/DashboardPage";
import { ToastContainer } from "./components/Toast";
import "./App.css";

function getStoredSecret(): string {
  return sessionStorage.getItem("admin_secret") || "";
}

export default function App() {
  const [secret, setSecret] = useState(getStoredSecret);
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!getStoredSecret());

  const handleLogin = useCallback((newSecret: string) => {
    sessionStorage.setItem("admin_secret", newSecret);
    setSecret(newSecret);
    setIsLoggedIn(true);
  }, []);

  const handleLogout = useCallback(() => {
    sessionStorage.removeItem("admin_secret");
    setSecret("");
    setIsLoggedIn(false);
  }, []);

  return (
    <>
      {isLoggedIn ? (
        <DashboardPage secret={secret} onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
      <ToastContainer />
    </>
  );
}
