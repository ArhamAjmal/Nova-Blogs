"use client";

import { createContext, useCallback, useContext, useState } from "react";
import styles from "./dashboard.module.css";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((message, kind = "info") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className={styles.toastWrap}>
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`${styles.toast} ${t.kind === "success" ? styles.toastSuccess : ""} ${t.kind === "error" ? styles.toastError : ""}`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) return { push: () => {} };
  return ctx;
};
