"use client";

import { FormEvent, useState } from "react";
import { Locale } from "@hlg/shared";
import { t } from "../lib/content";

export function ContactForm({ locale }: { locale: Locale }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    try {
      const response = await fetch("/api/public/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("Lead submit failed");
      form.reset();
      setState("sent");
    } catch {
      setState("error");
    }
  }

  return (
    <form className="form" method="post" onSubmit={onSubmit}>
      <div className="form-row">
        <label className="field">
          {t(locale, "name")}
          <input name="name" required autoComplete="name" />
        </label>
        <label className="field">
          {t(locale, "email")}
          <input name="email" type="email" required autoComplete="email" />
        </label>
      </div>
      <div className="form-row">
        <label className="field">
          {t(locale, "phone")}
          <input name="phone" autoComplete="tel" />
        </label>
        <label className="field">
          {t(locale, "company")}
          <input name="company" autoComplete="organization" />
        </label>
      </div>
      <label className="field">
        {t(locale, "message")}
        <textarea name="message" required />
      </label>
      <button className="button" type="submit" disabled={state === "sending"}>
        {state === "sending" ? "..." : t(locale, "submit")}
      </button>
      {state === "sent" ? <p>{locale === "vi" ? "Đã gửi liên hệ." : "Inquiry sent."}</p> : null}
      {state === "error" ? <p>{locale === "vi" ? "Chưa gửi được, vui lòng thử lại." : "Could not send. Please try again."}</p> : null}
    </form>
  );
}
