import Link from "next/link";
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
        "inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-semibold transition",
        variant === "primary" &&
          "bg-stone-100 text-neutral-950 hover:bg-white",
        variant === "secondary" &&
          "border border-white/20 bg-white/5 text-white hover:bg-white/10",
        className
      )}
    >
      {children}
    </Link>
  );
}