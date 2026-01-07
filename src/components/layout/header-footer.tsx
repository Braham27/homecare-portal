"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Instagram, Menu, X } from "lucide-react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/about", label: "About Us" },
    { href: "/careers", label: "Careers" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground py-2">
        <div className="container mx-auto px-4 flex flex-wrap justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <a href="tel:1-800-HOMECARE" className="flex items-center gap-1 hover:underline">
              <Phone className="h-4 w-4" />
              1-800-HOMECARE
            </a>
            <a href="mailto:info@homecare.com" className="flex items-center gap-1 hover:underline hidden sm:flex">
              <Mail className="h-4 w-4" />
              info@homecare.com
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hover:underline">
              Client Portal
            </Link>
            <Link href="/login" className="hover:underline">
              Employee Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-gray-900">HomeCare</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/get-started"
              className="hidden sm:inline-flex bg-primary text-primary-foreground px-6 py-2 rounded-full hover:bg-primary/90 transition-colors font-medium"
            >
              Get Started
            </Link>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-primary transition-colors"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t pt-4">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-primary transition-colors py-2"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/get-started"
                onClick={() => setMobileMenuOpen(false)}
                className="bg-primary text-primary-foreground px-6 py-3 rounded-full hover:bg-primary/90 transition-colors font-medium text-center mt-2"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Heart className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-white">HomeCare</span>
            </Link>
            <p className="text-sm mb-4">
              Providing compassionate, high-quality home care services for your loved ones. 
              Licensed, bonded, and insured for your peace of mind.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/services/personal-care" className="hover:text-primary transition-colors">Personal Care</Link></li>
              <li><Link href="/services/companion-care" className="hover:text-primary transition-colors">Companion Care</Link></li>
              <li><Link href="/services/skilled-nursing" className="hover:text-primary transition-colors">Skilled Nursing</Link></li>
              <li><Link href="/services/dementia-care" className="hover:text-primary transition-colors">Dementia Care</Link></li>
              <li><Link href="/services/respite-care" className="hover:text-primary transition-colors">Respite Care</Link></li>
              <li><Link href="/services/24-hour-care" className="hover:text-primary transition-colors">24-Hour Care</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="/testimonials" className="hover:text-primary transition-colors">Testimonials</Link></li>
              <li><Link href="/service-areas" className="hover:text-primary transition-colors">Service Areas</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-1" />
                <div>
                  <p>1-800-HOMECARE</p>
                  <p className="text-xs text-gray-400">24/7 Support Available</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-1" />
                <a href="mailto:info@homecare.com" className="hover:text-primary transition-colors">
                  info@homecare.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-1" />
                <div>
                  <p>123 Care Street</p>
                  <p>Suite 100</p>
                  <p>Your City, State 12345</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} HomeCare Agency. All rights reserved.</p>
          <p className="mt-2 text-xs text-gray-500">
            Licensed Home Care Agency • State License #HC-12345 • HIPAA Compliant
          </p>
        </div>
      </div>
    </footer>
  );
}
