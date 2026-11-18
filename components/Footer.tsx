
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowRight,
  Heart,
} from "lucide-react";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Browse Menu", href: "/menu" },
  { name: "Sign In", href: "/signin" },
  { name: "Create Account", href: "/signup" },
];

const menuCategories = [
  { name: "Classic Pizzas", href: "/menu?category=classic" },
  { name: "Vegetarian Pizzas", href: "/menu?category=vegetarian" },
  { name: "Meat Lovers", href: "/menu?category=meat" },
  { name: "Specialty Pizzas", href: "/menu?category=specialty" },
  { name: "Sides & Drinks", href: "/menu?category=sides" },
];

const socialLinks = [
  { name: "Facebook", href: "https://www.facebook.com/" },
  { name: "Instagram", href: "https://www.instagram.com/" },
  { name: "X", href: "https://x.com/" },
];

export default function Footer() {
  return (
    <footer className="relative mt-20 overflow-hidden bg-[#211714] text-[#FFF7ED]">

      {/* Decorative top border */}
      <div className="h-1 w-full bg-linear-to-r from-[#C93627] via-[#F2A43A] to-[#C93627]" />

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-5 pb-10 pt-16 sm:px-8 lg:px-10">

        {/* Footer Grid */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">

          {/* Brand Section */}
          <div className="lg:col-span-4">

            <Link href="/" className="inline-flex items-center gap-3">

              <div>
                <h2 className="text-3xl font-black tracking-tight text-white">
                  PizzaHub<span className="text-[#F2A43A]">.</span>
                </h2>
                <p className="text-[10px] font-bold tracking-[2.5px] text-[#D7A77C]">
                  FRESH · HOT · DELICIOUS
                </p>
              </div>

            </Link>

            <p className="mt-6 max-w-sm text-sm leading-7 text-[#B9A69B]">
              Your next favorite pizza is just a few clicks away.
              Discover amazing local pizza shops, explore delicious
              menus, and get fresh pizza delivered right to your door.
            </p>

            {/* Social Links */}
            <div className="mt-7 flex items-center gap-3">

              <span className="mr-1 text-xs font-bold uppercase tracking-widest text-[#D7A77C]">
                Follow us
              </span>

              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#514039] text-sm font-bold text-[#FFF7ED] transition-all duration-200 hover:-translate-y-1 hover:border-[#F2A43A] hover:bg-[#C93627] hover:text-white"
                >
                  {social.name === "Facebook" && "f"}
                  {social.name === "Instagram" && "ig"}
                  {social.name === "X" && "𝕏"}
                </Link>
              ))}

            </div>

          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">

            <h3 className="mb-6 text-base font-bold text-white">
              Quick Links
            </h3>

            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-[#B9A69B] transition-colors hover:text-[#F2A43A]"
                  >
                    <ArrowRight
                      size={13}
                      className="text-[#C93627] transition-transform group-hover:translate-x-1"
                    />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

          </div>

          {/* Menu Categories */}
          <div className="lg:col-span-3">

            <h3 className="mb-6 text-base font-bold text-white">
              Explore Menu
            </h3>

            <ul className="space-y-4">
              {menuCategories.map((category) => (
                <li key={category.name}>
                  <Link
                    href={category.href}
                    className="group inline-flex items-center gap-2 text-sm text-[#B9A69B] transition-colors hover:text-[#F2A43A]"
                  >
                    <ArrowRight
                      size={13}
                      className="text-[#C93627] transition-transform group-hover:translate-x-1"
                    />
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>

          </div>

          {/* Contact Section */}
          <div className="lg:col-span-3">

            <h3 className="mb-6 text-base font-bold text-white">
              Get In Touch
            </h3>

            <div className="space-y-5">

              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#C93627]/15 text-[#F2A43A]">
                  <MapPin size={17} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#D7A77C]">
                    Our Location
                  </p>
                  <p className="mt-1 text-sm text-[#B9A69B]">
                    Dhaka, Bangladesh
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#C93627]/15 text-[#F2A43A]">
                  <Phone size={17} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#D7A77C]">
                    Call Us
                  </p>
                  <a
                    href="tel:+8801700000000"
                    className="mt-1 block text-sm text-[#B9A69B] transition hover:text-[#F2A43A]"
                  >
                    +880 1700-000000
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#C93627]/15 text-[#F2A43A]">
                  <Mail size={17} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#D7A77C]">
                    Email Us
                  </p>
                  <a
                    href="mailto:hello@pizzahub.com"
                    className="mt-1 block break-all text-sm text-[#B9A69B] transition hover:text-[#F2A43A]"
                  >
                    hello@pizzahub.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#C93627]/15 text-[#F2A43A]">
                  <Clock size={17} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#D7A77C]">
                    Working Hours
                  </p>
                  <p className="mt-1 text-sm text-[#B9A69B]">
                    Every day · 10 AM – 11 PM
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Bottom Footer */}
        <div className="mt-16 border-t border-[#49352D] pt-7">

          <div className="flex flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-left">

            <p className="text-xs text-[#A99386]">
              © {new Date().getFullYear()} PizzaHub. All rights reserved.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-[#A99386]">
              <Link
                href="/privacy"
                className="transition hover:text-[#F2A43A]"
              >
                Privacy Policy
              </Link>

              <Link
                href="/terms"
                className="transition hover:text-[#F2A43A]"
              >
                Terms & Conditions
              </Link>
            </div>

            <p className="flex items-center gap-1.5 text-xs text-[#A99386]">
              Made with
              <Heart size={13} className="fill-[#C93627] text-[#C93627]" />
              for pizza lovers
            </p>

          </div>

        </div>

      </div>

      {/* Decorative background text */}
      <div className="pointer-events-none absolute -bottom-8 right-5 select-none text-8xl font-black text-white/2.5 sm:text-9xl">
        PIZZA
      </div>

    </footer>
  );
}
