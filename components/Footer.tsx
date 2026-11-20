import Link from "next/link"
import { MapPin, Phone, Mail, Clock, Heart, ArrowUpRight } from "lucide-react"

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Explore Menu", href: "/menu" },
  { name: "My Profile", href: "/profile" },
  { name: "Checkout", href: "/checkout" },
];

const supportLinks = [
  { name: "Sign In", href: "/sign-in" },
  { name: "Sign Up", href: "/sign-up" },
];

const socialLinks = [
  { name: "Facebook", href: "https://www.facebook.com/", label: "f" },
  { name: "Instagram", href: "https://www.instagram.com/", label: "ig" },
  { name: "X", href: "https://x.com/", label: "𝕏" },
]
export default function Footer() {
  return (
    <footer className="relative mt-20 overflow-hidden bg-[#211714] text-[#FFF7ED]">
      {/* Decorative top border */}
      <div className="h-1 w-full bg-linear-to-r from-[#C93627] via-[#F2A43A] to-[#C93627]" />

      <div className="relative mx-auto max-w-7xl px-5 pt-14 pb-8 sm:px-8 lg:px-10">
        {/* Main Footer */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          {/* Brand Section */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex flex-col">
              <span className="text-3xl font-black tracking-tight text-white">
                PizzaHub<span className="text-[#F2A43A]">.</span>
              </span>

              <span className="mt-1 text-[10px] font-bold tracking-[3px] text-[#D7A77C]">
                FRESH · HOT · DELICIOUS
              </span>
            </Link>

            <p className="mt-6 max-w-sm text-sm leading-7 text-[#B9A69B]">
              Your next favorite pizza is just a few clicks away. Discover
              amazing local pizza shops, explore delicious menus, and enjoy
              fresh pizza delivered to your door.
            </p>

            {/* Social Links */}
            <div className="mt-7">
              <p className="mb-4 text-xs font-bold tracking-[2px] text-[#D7A77C] uppercase">
                Follow Us
              </p>

              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="flex size-10 items-center justify-center rounded-xl border border-[#514039] text-sm font-bold text-[#FFF7ED] transition-all duration-200 hover:-translate-y-1 hover:border-[#F2A43A] hover:bg-[#C93627] hover:text-white"
                  >
                    {social.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="lg:col-span-2">
            <h3 className="mb-6 text-base font-bold text-white">Quick Links</h3>

            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1 text-sm text-[#B9A69B] transition-colors hover:text-[#F2A43A]"
                  >
                    {link.name}
                    <ArrowUpRight
                      size={13}
                      className="opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Support */}
          <div className="lg:col-span-2">
            <h3 className="mb-6 text-base font-bold text-white">
              Customer Support
            </h3>

            <ul className="space-y-4">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1 text-sm text-[#B9A69B] transition-colors hover:text-[#F2A43A]"
                  >
                    {link.name}
                    <ArrowUpRight
                      size={13}
                      className="opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div className="lg:col-span-4">
            <h3 className="mb-6 text-base font-bold text-white">
              Get In Touch
            </h3>

            <div className="space-y-5">
              {/* Location */}
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#C93627]/15 text-[#F2A43A]">
                  <MapPin size={18} />
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

              {/* Phone */}
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#C93627]/15 text-[#F2A43A]">
                  <Phone size={18} />
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

              {/* Email */}
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#C93627]/15 text-[#F2A43A]">
                  <Mail size={18} />
                </div>

                <div>
                  <p className="text-xs font-semibold text-[#D7A77C]">
                    Email Us
                  </p>
                  <a
                    href="mailto:hello@pizzahub.com"
                    className="mt-1 block text-sm break-all text-[#B9A69B] transition hover:text-[#F2A43A]"
                  >
                    hello@pizzahub.com
                  </a>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#C93627]/15 text-[#F2A43A]">
                  <Clock size={18} />
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
        <div className="mt-14 border-t border-[#49352D] pt-7">
          <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <p className="text-xs text-[#A99386]">
              © {new Date().getFullYear()} PizzaHub. All rights reserved.
            </p>

            <p className="flex items-center gap-1.5 text-xs text-[#A99386]">
              Made with
              <Heart size={13} className="fill-[#C93627] text-[#C93627]" />
              for pizza lovers
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
