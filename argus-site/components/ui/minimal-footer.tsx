import type React from "react";
import Link from "next/link";

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function GmailIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M3.5 5.5A2.5 2.5 0 0 1 6 3h12a2.5 2.5 0 0 1 2.5 2.5v13A2.5 2.5 0 0 1 18 21H6a2.5 2.5 0 0 1-2.5-2.5v-13Zm2.16.77v10.98h2.28V9.62L12 12.67l4.06-3.05v7.63h2.28V6.27L12 11.03 5.66 6.27Z" />
    </svg>
  );
}

const footerLinks = [
  { title: "Waitlist", href: "#" },
  { title: "Home", href: "/" },
  { title: "Privacy", href: "/legal#privacy" },
  { title: "Terms", href: "/legal#terms" },
];

const socialLinks = [
  {
    label: "X profile",
    icon: <XIcon className="size-4" />,
    href: "https://x.com/VaraadDurgaay",
  },
  {
    label: "LinkedIn profile",
    icon: <LinkedInIcon className="size-4" />,
    href: "https://www.linkedin.com/in/varaddurge",
  },
  {
    label: "Email Varad Durge",
    icon: <GmailIcon className="size-4" />,
    href: "https://mail.google.com/mail/?view=cm&fs=1&to=varaddurge@gmail.com",
  },
];

export function MinimalFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/[0.04] bg-[#080808]">
      <div className="mx-auto max-w-5xl border-white/[0.04] bg-[radial-gradient(35%_80%_at_30%_0%,rgba(255,255,255,0.06),transparent)] md:border-x">
        <div className="grid grid-cols-6 gap-8 px-6 py-10 lg:px-12">
          <div className="col-span-6 flex flex-col gap-5 md:col-span-4">
            <Link href="/" aria-label="Varad Durge home" className="flex w-max items-center gap-3 text-white/45 transition-colors duration-300 hover:text-white/70">
              <span className="flex size-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-sm font-semibold text-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                V
              </span>
              <span className="text-sm font-medium tracking-[-0.01em] text-white/70">
                Varad Durge
              </span>
            </Link>
            <p className="max-w-sm font-mono text-sm font-medium leading-relaxed text-white/50 text-balance">
              Understand why your agents behave the way they do.
            </p>
            <div className="flex gap-2">
              {socialLinks.map((item) => (
                <a
                  key={item.label}
                  aria-label={item.label}
                  className="rounded-md border border-white/[0.06] p-1.5 text-white/45 transition-colors duration-300 hover:bg-white/[0.04] hover:text-white/70"
                  target="_blank"
                  rel="noreferrer"
                  href={item.href}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="col-span-6 grid grid-cols-2 gap-3 md:col-span-2">
            {footerLinks.map(({ href, title }) => (
              <Link
                key={title}
                className="flex min-h-[52px] items-center justify-center rounded-xl bg-white/[0.04] px-5 text-center text-[14px] font-normal text-white/70 transition-colors duration-300 hover:bg-white/[0.07] hover:text-white/90"
                href={href}
              >
                {title}
              </Link>
            ))}
          </div>
        </div>

        <div className="h-px w-full bg-white/[0.04]" />
        <div className="flex flex-col justify-between gap-2 px-6 py-5 lg:px-12">
          <p className="text-center text-sm font-thin text-white/35">
            © {year} Argus by Varad Durge. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
