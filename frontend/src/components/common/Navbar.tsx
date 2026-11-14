import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

const navLinks = [
  { name: "Why Upfund", href: "#why-upfund" },
  { name: "How it works", href: "#how-it-works" },
  { name: "Deposit cycle", href: "#deposit-cycle" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#111b32]/95 text-white shadow-sm backdrop-blur">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8 lg:px-12"
      >
        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-3"
          aria-label="Upfund home"
        >
          <img
            src="/logo2.png"
            alt=""
            className="h-10 w-10 rounded-xl object-cover"
          />
          <span className="text-xl font-semibold tracking-tight">Upfund</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-300 transition hover:text-amber-200"
            >
              {link.name}
            </a>
          ))}
          <Link
            to="/login"
            className="text-sm font-semibold text-slate-200 transition hover:text-white"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="rounded-lg bg-amber-400 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-amber-300"
          >
            Get started
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className="grid h-10 w-10 place-items-center rounded-lg border border-white/15 text-xl text-white md:hidden"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </nav>

      {isOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-white/10 bg-[#111b32] px-5 pb-5 pt-3 md:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="rounded-lg px-3 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/5 hover:text-amber-200"
              >
                {link.name}
              </a>
            ))}
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Link
                to="/login"
                onClick={closeMenu}
                className="rounded-lg border border-white/20 px-4 py-3 text-center text-sm font-semibold text-white"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                onClick={closeMenu}
                className="rounded-lg bg-amber-400 px-4 py-3 text-center text-sm font-bold text-slate-950"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
