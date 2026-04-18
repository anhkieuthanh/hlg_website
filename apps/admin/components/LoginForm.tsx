"use client";

import { FormEvent, useState } from "react";
import { login, Session } from "../lib/api";

export function LoginForm({ onLogin }: { onLogin: (session: Session) => void }) {
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const formData = new FormData(event.currentTarget);
    try {
      const session = await login({
        email: String(formData.get("email") || ""),
        password: String(formData.get("password") || ""),
        totpCode: String(formData.get("totpCode") || "")
      });
      localStorage.setItem("hlg_admin_session", JSON.stringify(session));
      onLogin(session);
    } catch {
      setError("Không đăng nhập được. Kiểm tra email, mật khẩu và mã 2FA.");
    }
  }

  return (
    <main className="login">
      <form method="post" onSubmit={submit}>
        <div className="login-brand">
          <img src="/assets/hoang-long-logo.svg" alt="Hoàng Long JSC" />
          <span>
            <small>CMS</small>
            <h1>Hoàng Long Group Admin</h1>
          </span>
        </div>
        <label className="field">
          Email
          <input name="email" type="email" required defaultValue="admin@hoanglong.local" />
        </label>
        <label className="field">
          Mật khẩu
          <input name="password" type="password" required />
        </label>
        <label className="field">
          Mã 2FA
          <input name="totpCode" inputMode="numeric" />
        </label>
        <button className="button" type="submit">
          Đăng nhập
        </button>
        {error ? <p className="notice">{error}</p> : null}
      </form>
    </main>
  );
}
