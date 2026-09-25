"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, Phone, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { business } from "@/data/business";
import { brandLogo } from "@/data/media";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Our Work" },
  { href: "/about", label: "About" },
  { href: "/reviews", label: "Reviews" },
  { href: "/faq", label: "FAQ" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      data-cinematic-recede=""
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || menuOpen
          ? "bg-ink-950/85 backdrop-blur-md shadow-[0_1px_0_rgba(255,255,255,0.08)]"
          : "bg-gradient-to-b from-black/50 to-transparent",
      )}
    >
      <Container className="flex h-18 items-center justify-between py-3 sm:h-20">
        <Link
          href="/"
          className="flex items-center"
          onClick={() => setMenuOpen(false)}
          aria-label={brandLogo.wordmarkFallback}
        >
          {brandLogo.mark ? (
            <Image
              src={brandLogo.mark}
              alt={brandLogo.wordmarkFallback}
              width={176}
              height={176}
              priority
              className="h-12 w-12 sm:h-14 sm:w-14"
            />
          ) : (
            <span className="font-display text-lg font-bold uppercase tracking-wide text-white sm:text-xl">
              {brandLogo.wordmarkFallback.split(" 941")[0]}
              <span className="text-lime-500"> 941</span>
            </span>
          )}
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-display text-sm font-medium uppercase tracking-wide text-steel-200 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <a
            href={`tel:${business.phone.e164}`}
            className="flex items-center gap-2 font-display text-sm font-semibold text-white transition-colors hover:text-lime-400"
          >
            <Phone className="h-4 w-4" />
            {business.phone.display}
          </a>
          <Button href="/contact" size="md">
            Get a Quote
          </Button>
        </div>

        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className="flex h-11 w-11 items-center justify-center rounded-full text-white lg:hidden"
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="border-t border-white/10 bg-ink-950 lg:hidden"
          >
            <Container className="flex flex-col gap-1 py-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-3 font-display text-base font-medium uppercase tracking-wide text-steel-100 hover:bg-white/5"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-3 flex flex-col gap-3 px-3">
                <a
                  href={`tel:${business.phone.e164}`}
                  className="flex items-center gap-2 font-display text-base font-semibold text-white"
                >
                  <Phone className="h-4 w-4" />
                  {business.phone.display}
                </a>
                <Button href="/contact" size="lg" className="w-full">
                  Get a Quote
                </Button>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
