"use client";

import { useState } from "react";

export function CopyCustomerEmailsButton({ emails }: { emails: string[] }) {
  const [copied, setCopied] = useState(false);

  async function copyEmails() {
    if (emails.length === 0) return;

    await navigator.clipboard.writeText(emails.join("; "));

    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 1800);
  }

  return (
    <button
      type="button"
      onClick={copyEmails}
      disabled={emails.length === 0}
      className="inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-black text-neutral-950 transition hover:bg-stone-200 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {copied ? "Emails copiados" : "Copiar emails"}
    </button>
  );
}