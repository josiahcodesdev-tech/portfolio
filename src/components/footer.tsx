import Link from "next/link";
import { Link2, AtSign, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Contact", href: "/contact" },
];

const serviceLinks = [
  "Web Design",
  "Proposal Writing & Grants",
  "CV & Cover Letter Writing",
  "Data Entry",
  "Job Matching CVs",
  "Graphic Design",
];

const socialLinks = [
  { icon: Link2, href: "#", label: "LinkedIn" },
  { icon: AtSign, href: "#", label: "Twitter/X" },
  { icon: Mail, href: "mailto:josiah.mwangi@email.com", label: "Email" },
];

export function Footer() {
  return (
    <footer className="bg-navy pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <Link href="/" className="inline-block">
              <h3 className="font-display text-2xl font-bold text-white mb-2">
                Josiah <span className="text-gold">Mwangi</span>
              </h3>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              Professional consultant empowering businesses and individuals
              through expert services in web design, writing, and creative
              solutions.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 bg-white/5 flex items-center justify-center text-white/50 hover:bg-gold hover:text-navy rounded-lg transition-all"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/50 text-sm hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-5">Our Services</h4>
            <ul className="space-y-3">
              {serviceLinks.map((service) => (
                <li key={service}>
                  <Link
                    href="/services"
                    className="text-white/50 text-sm hover:text-gold transition-colors"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-5">Contact Info</h4>
            <div className="space-y-3 text-white/50 text-sm">
              <p>josiah.mwangi@email.com</p>
              <p>+254 700 000 000</p>
              <p>Nairobi, Kenya</p>
            </div>
          </div>
        </div>

        <Separator className="bg-white/10" />

        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 gap-4">
          <p className="text-white/40 text-sm">
            &copy; 2025 Josiah Mwangi. All Rights Reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-white/40 text-sm hover:text-gold transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-white/40 text-sm hover:text-gold transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
