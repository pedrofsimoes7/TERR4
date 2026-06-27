"use client";

import { useState } from "react";
import { ArrowUpRight, MapPin, Mail, Clock, Loader2 } from "lucide-react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit() {
    setError("");

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Preenche o nome, email e mensagem.");
      return;
    }
    if (!email.includes("@")) {
      setError("O email não parece válido.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name.trim(),
          customerEmail: email.trim(),
          vehicle: vehicle.trim(),
          message: message.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Não foi possível enviar a mensagem.");
      }

      setSent(true);
      // limpa os campos
      setName("");
      setEmail("");
      setVehicle("");
      setMessage("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[100dvh] bg-[#070706] px-6 pb-28 pt-40 text-white">
      <section className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-16 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.35em] text-[#a79d8d]">
              Contacto
            </p>
            <h1 className="mt-4 text-6xl font-black leading-[0.9] tracking-[-0.04em] md:text-8xl">
              Fala connosco.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#c8c4be]/60">
              Tens dúvidas sobre compatibilidade, stock, instalação ou encomendas?
              Envia-nos uma mensagem e ajudamos-te.
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Form */}
          <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.03] p-8 md:p-10">
            {sent ? (
              <div className="flex h-full flex-col items-center justify-center py-16 text-center">
                <div className="flex size-16 items-center justify-center rounded-full bg-[#2d4a2d] text-green-100">
                  <ArrowUpRight size={28} />
                </div>
                <h2 className="mt-6 text-3xl font-black">Mensagem enviada!</h2>
                <p className="mt-3 text-[#c8c4be]/60">Respondemos em menos de 24 horas.</p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-8 rounded-full border border-white/15 px-6 py-2 text-sm font-bold text-white/60 transition hover:text-white"
                >
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <div className="grid gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <ContactInput placeholder="Nome" value={name} onChange={setName} />
                  <ContactInput placeholder="Email" type="email" value={email} onChange={setEmail} />
                </div>
                <ContactInput
                  placeholder="Veículo (ex: Toyota Land Cruiser) — opcional"
                  value={vehicle}
                  onChange={setVehicle}
                />
                <ContactTextarea
                  placeholder="Como podemos ajudar?"
                  rows={5}
                  value={message}
                  onChange={setMessage}
                />

                {error && (
                  <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-3">
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="btn-wipe group mt-2 flex h-13 items-center justify-center gap-3 rounded-full bg-[#f4efe4] px-8 font-black uppercase tracking-[0.1em] text-neutral-950 transition duration-300 hover:-translate-y-0.5 hover:bg-white active:scale-[0.97] disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      A enviar...
                    </>
                  ) : (
                    <>
                      Enviar mensagem
                      <ArrowUpRight size={16} className="transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Info sidebar */}
          <div className="flex flex-col gap-4">
            <InfoCard
              icon={<Mail size={18} />}
              label="Email"
              value="terr4geral@gmail.com"
              href="mailto:terr4geral@gmail.com"
            />
            <InfoCard
              icon={<MapPin size={18} />}
              label="Localização"
              value="Portugal"
            />
            <InfoCard
              icon={<Clock size={18} />}
              label="Resposta"
              value="Menos de 24 horas"
            />

            <div className="mt-4 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-7">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#a79d8d]">
                Compatibilidade
              </p>
              <p className="mt-3 text-sm leading-7 text-[#c8c4be]/65">
                Antes de encomendar, diz-nos o modelo do teu veículo e o tipo
                de barras de tejadilho. Confirmamos a compatibilidade gratuitamente.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function ContactInput({
  placeholder,
  type = "text",
  value,
  onChange,
}: {
  placeholder: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      placeholder={placeholder}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-13 w-full rounded-full border border-white/10 bg-white/[0.04] px-5 text-white outline-none placeholder:text-white/30 transition-colors duration-200 focus:border-[#c46a2d]/60 focus:bg-white/[0.06]"
    />
  );
}

function ContactTextarea({
  placeholder,
  rows,
  value,
  onChange,
}: {
  placeholder: string;
  rows: number;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <textarea
      placeholder={placeholder}
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 text-white outline-none placeholder:text-white/30 transition-colors duration-200 focus:border-[#c46a2d]/60 focus:bg-white/[0.06] resize-none"
    />
  );
}

function InfoCard({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-center gap-4 rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-5 py-4 transition-colors duration-200 hover:border-white/20 hover:bg-white/[0.06]">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-[#a79d8d]">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/30">{label}</p>
        <p className="mt-0.5 text-sm font-bold text-white">{value}</p>
      </div>
    </div>
  );

  if (href) return <a href={href}>{content}</a>;
  return content;
}