import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { clsx } from "clsx";

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
};

export function Button({
  href,
  children,
  variant = "primary",
  className,
}: ButtonProps) {
  return (
    <Link
      href={href}
      className={clsx(
        "group inline-flex h-12 items-center justify-center gap-3 rounded-full px-6 text-sm font-black uppercase tracking-[0.12em] transition duration-300",
        variant === "primary" &&
          "bg-[#f4efe4] text-neutral-950 shadow-[0_18px_60px_rgba(244,239,228,0.16)] hover:-translate-y-0.5 hover:bg-white",
        variant === "secondary" &&
          "border border-white/20 bg-white/[0.06] text-white backdrop-blur-xl hover:-translate-y-0.5 hover:border-white/35 hover:bg-white/12",
        className
      )}
    >
      <span>{children}</span>
      <ArrowUpRight
        size={15}
        className="transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      />
    </Link>
  );
}