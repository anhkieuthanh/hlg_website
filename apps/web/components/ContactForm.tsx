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
          <span>{t(locale, "name")} <abbr title={locale === "vi" ? "Bắt buộc" : "Required"}>*</abbr></span>
          <input name="name" required autoComplete="name" placeholder={locale === "vi" ? "Nguyễn Văn A" : "Your full name"} />
        </label>
        <label className="field">
          <span>{t(locale, "email")} <abbr title={locale === "vi" ? "Bắt buộc" : "Required"}>*</abbr></span>
          <input name="email" type="email" required autoComplete="email" placeholder="email@company.com" />
        </label>
      </div>
      <div className="form-row">
        <label className="field">
          {t(locale, "phone")}
          <input name="phone" type="tel" autoComplete="tel" placeholder="+84 xxx xxx xxx" />
        </label>
        <label className="field">
          {t(locale, "company")}
          <input name="company" autoComplete="organization" placeholder={locale === "vi" ? "Tên công ty" : "Company name"} />
        </label>
      </div>
      <label className="field">
        <span>{t(locale, "message")} <abbr title={locale === "vi" ? "Bắt buộc" : "Required"}>*</abbr></span>
        <textarea name="message" required placeholder={locale === "vi" ? "Mô tả hạng mục, yêu cầu kỹ thuật hoặc nhu cầu phối hợp..." : "Describe your scope, technical requirements, or cooperation needs..."} />
      </label>
      <button className="button" type="submit" disabled={state === "sending"}>
        {state === "sending" ? (
          <span className="button-spinner" aria-label={locale === "vi" ? "Đang gửi" : "Sending"}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="2" strokeDasharray="32" strokeDashoffset="12" />
            </svg>
          </span>
        ) : t(locale, "submit")}
      </button>
      {state === "sent" ? (
        <p className="form-success" role="status">{locale === "vi" ? "Đã gửi liên hệ thành công. Đội ngũ sẽ phản hồi sớm nhất." : "Inquiry sent successfully. Our team will respond shortly."}</p>
      ) : null}
      {state === "error" ? (
        <p className="form-error" role="alert">{locale === "vi" ? "Chưa gửi được, vui lòng thử lại." : "Could not send. Please try again."}</p>
      ) : null}
    </form>
  );
}
