import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#0d162a] px-5 py-12 text-slate-300 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 border-b border-white/10 pb-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.7fr_0.7fr]">
          <div className="max-w-md">
            <Link to="/" className="inline-flex items-center gap-3">
              <img
                src="/logo2.png"
                alt=""
                className="h-10 w-10 rounded-xl object-cover"
              />
              <span className="text-lg font-semibold text-white">Upfund</span>
            </Link>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              Forex expertise and AI-assisted market analysis, alongside tools
              to follow your deposits, wallet balance, and referrals.
            </p>
            <p className="mt-4 text-xs leading-5 text-slate-500">
              Forex trading involves risk, including the possible loss of your
              deposit. AI analysis and daily credits do not guarantee a profit.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-white">Explore</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a className="transition hover:text-amber-200" href="#why-upfund">
                  Why Upfund
                </a>
              </li>
              <li>
                <a className="transition hover:text-amber-200" href="#how-it-works">
                  How it works
                </a>
              </li>
              <li>
                <a className="transition hover:text-amber-200" href="#deposit-cycle">
                  Deposit cycle
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-white">Your account</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link className="transition hover:text-amber-200" to="/login">
                  Sign in
                </Link>
              </li>
              <li>
                <Link className="transition hover:text-amber-200" to="/register">
                  Create an account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Upfund. All rights reserved.</p>
          <p>Make informed decisions. Trading involves risk.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
