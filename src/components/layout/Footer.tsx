import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import { business } from "@/data/business";
import { services } from "@/data/services";
import { Container } from "@/components/ui/Container";
import { FacebookIcon, InstagramIcon } from "@/components/ui/SocialIcons";

const explore = [
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Our Work" },
  { href: "/about", label: "About" },
  { href: "/reviews", label: "Reviews" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Get a Quote" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink-950 pt-16 pb-8">
      <Container>
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-xl font-bold uppercase tracking-wide text-white">
              Detail Kings<span className="text-ember-500"> 941</span>
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-steel-400">
              Southwest Florida auto detailing — hand-finished interior and
              exterior work for daily drivers, trucks, and SUVs across the
              941 area.
            </p>
            <div className="mt-5 flex gap-3">
              <a
                href={business.social.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Detail Kings 941 on Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-steel-300 transition-colors hover:border-ember-500 hover:text-ember-400"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href={business.social.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Detail Kings 941 on Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-steel-300 transition-colors hover:border-ember-500 hover:text-ember-400"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <p className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-steel-500">
              Explore
            </p>
            <ul className="mt-4 space-y-3">
              {explore.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-steel-300 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-steel-500">
              Services
            </p>
            <ul className="mt-4 space-y-3">
              {services.slice(0, 6).map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-sm text-steel-300 transition-colors hover:text-white"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-steel-500">
              Contact
            </p>
            <ul className="mt-4 space-y-4">
              <li>
                <a
                  href={`tel:${business.phone.e164}`}
                  className="flex items-start gap-3 text-sm text-steel-300 transition-colors hover:text-white"
                >
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-ember-500" />
                  {business.phone.display}
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-steel-300">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ember-500" />
                Serving Southwest Florida / the 941 area
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs text-steel-500">
            © {new Date().getFullYear()} {business.name}. All rights reserved.
          </p>
          <p className="text-xs text-steel-600">
            Site by{" "}
            <a
              href="https://wavvysites.com"
              target="_blank"
              rel="noreferrer"
              className="text-steel-400 hover:text-white"
            >
              Wavy Sites
            </a>
          </p>
        </div>
      </Container>
    </footer>
  );
}
