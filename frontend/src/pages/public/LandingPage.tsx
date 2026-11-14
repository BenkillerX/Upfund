import { FiActivity, FiArrowRight, FiArrowUpRight, FiCpu, FiShield, FiUsers, } from "react-icons/fi";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <main className="overflow-hidden bg-[#f7f8fb] text-slate-900">
      <section className="relative overflow-hidden bg-[#111b32] text-white">
        <div className="pointer-events-none absolute -right-36 -top-40 h-[28rem] w-[28rem] rounded-full bg-amber-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-48 left-1/4 h-[28rem] w-[28rem] rounded-full bg-blue-400/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 pb-24 pt-16 sm:px-8 sm:pb-28 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-12 lg:py-28">
          <div className="max-w-2xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-amber-200/20 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
              <FiActivity className="text-sm" />
              Forex insight, made more accessible
            </div>

            <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              A clearer way to
              <span className="block text-amber-300">approach forex.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
              Upfund brings experienced forex traders and AI-assisted market
              analysis together to help inform financial decisions. Manage your
              deposits, wallet balance, daily credits, and referrals in one
              place.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-amber-950/20 transition hover:bg-amber-300"
              >
                Create your account
                <FiArrowUpRight />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/5"
              >
                Explore how it works
                <FiArrowRight />
              </a>
            </div>

            <p className="mt-6 max-w-lg text-xs leading-5 text-slate-400">
              Forex trading involves risk. AI-assisted analysis is not a
              guarantee of results. Review the program terms before depositing.
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
            <div className="absolute -inset-8 rounded-[2.5rem] bg-amber-300/10 blur-3xl" />
            <div className="relative rounded-[1.75rem] border border-white/10 bg-[#192640]/90 p-5 shadow-2xl shadow-black/30 backdrop-blur sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-white">
                    Market insight
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Trader-informed · AI-assisted
                  </p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-xs font-medium text-emerald-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                  Analysis preview
                </span>
              </div>

              <div className="mt-7 rounded-2xl border border-white/5 bg-[#111b32] p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400">Forex market view</p>
                    <p className="mt-1 text-lg font-semibold text-white">
                      Trends at a glance
                    </p>
                  </div>
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-300/10 text-amber-200">
                    <FiCpu className="text-lg" />
                  </div>
                </div>

                <svg
                  viewBox="0 0 560 190"
                  role="img"
                  aria-label="Illustrative market trend visualization"
                  className="mt-5 h-40 w-full"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#fbbf24" stopOpacity=".25" />
                      <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0 150 C35 144 47 127 78 132 S125 145 153 115 S197 104 222 113 S263 91 292 100 S337 82 361 91 S404 71 432 78 S481 54 510 62 S540 37 560 42 V190 H0 Z"
                    fill="url(#chartFill)"
                  />
                  <path
                    d="M0 150 C35 144 47 127 78 132 S125 145 153 115 S197 104 222 113 S263 91 292 100 S337 82 361 91 S404 71 432 78 S481 54 510 62 S540 37 560 42"
                    fill="none"
                    stroke="#fbbf24"
                    strokeLinecap="round"
                    strokeWidth="3"
                  />
                  <path
                    d="M0 175 H560 M0 130 H560 M0 85 H560 M0 40 H560"
                    fill="none"
                    stroke="#ffffff"
                    strokeOpacity=".08"
                    strokeDasharray="4 8"
                  />
                </svg>

                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Illustrative visualization</span>
                  <span>Not live market data</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs text-slate-400">Daily wallet credit</p>
                  <p className="mt-1 text-2xl font-semibold text-amber-300">
                    10%
                  </p>
                  <p className="mt-1 text-[11px] leading-4 text-slate-400">
                    Of the qualifying initial deposit
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs text-slate-400">Account tools</p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    Wallet · Referrals
                  </p>
                  <p className="mt-1 text-[11px] leading-4 text-slate-400">
                    See activity in one place
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="why-upfund" className="scroll-mt-24 px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700">
              Why Upfund
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Tools and guidance for a more informed approach.
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              Get a straightforward view of your account, with forex expertise
              and AI-assisted analysis as part of the experience.
            </p>
          </div>

          <div className="mt-11 grid gap-5 md:grid-cols-3">
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#111b32] text-amber-300">
                <FiCpu className="text-xl" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-slate-900">
                AI-assisted analysis
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Market analysis supported by AI and informed by experienced
                forex traders—designed to help guide, not guarantee, decisions.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-amber-100 text-amber-700">
                <FiActivity className="text-xl" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-slate-900">
                A defined deposit cycle
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Eligible active cycles receive daily wallet credits equal to
                10% of the cycle’s qualifying initial deposit.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-blue-700">
                <FiUsers className="text-xl" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-slate-900">
                Wallet and referrals
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Keep track of deposits, balance activity, referral progress,
                and account details from one dashboard.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-24 bg-white px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700">
              How it works
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Start with a clear view of your account.
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              Follow each step from registration through your active deposit
              cycle. Check the terms and understand the risks before you begin.
            </p>
            <Link
              to="/register"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#111b32] px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Get started
              <FiArrowRight />
            </Link>
          </div>

          <div className="space-y-4">
            {[
              {
                number: "01",
                title: "Create your account",
                description:
                  "Sign up to access your Upfund wallet and account dashboard.",
              },
              {
                number: "02",
                title: "Make a successful deposit",
                description:
                  "Your first successful deposit in a cycle sets the amount used to calculate daily credits.",
              },
              {
                number: "03",
                title: "Follow your balance",
                description:
                  "Review your balance, deposit activity, and referral progress in your dashboard.",
              },
              {
                number: "04",
                title: "Withdraw and begin another cycle",
                description:
                  "Withdraw your full wallet balance in one request. A new successful deposit starts another cycle and sets its qualifying initial deposit.",
              },
            ].map((step) => (
              <article
                key={step.number}
                className="flex gap-4 rounded-2xl border border-slate-200 bg-[#f7f8fb] p-5 sm:gap-6 sm:p-6"
              >
                <span className="pt-1 text-sm font-bold tracking-widest text-amber-700">
                  {step.number}
                </span>
                <div>
                  <h3 className="font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-slate-600">
                    {step.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="deposit-cycle" className="scroll-mt-24 px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-8 overflow-hidden rounded-[2rem] bg-[#111b32] p-7 text-white sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center lg:p-14">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
              Know the cycle
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Understand how daily credits and withdrawals work.
            </h2>
            <p className="mt-4 max-w-2xl leading-7 text-slate-300">
              Daily credits are calculated from the qualifying initial deposit
              for an active cycle—not from a compounded balance. You can make
              one full-balance withdrawal per cycle. A new successful deposit
              begins the next cycle.
            </p>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              Forex trading involves substantial risk, including the possible
              loss of your deposit. AI analysis and daily credits do not
              guarantee a profit. Please review all applicable terms.
            </p>
          </div>
          <div className="flex h-36 w-36 shrink-0 flex-col items-center justify-center rounded-full border border-amber-200/20 bg-amber-300/10 text-center sm:h-44 sm:w-44">
            <FiShield className="mb-2 text-2xl text-amber-200" />
            <span className="text-3xl font-semibold text-amber-200">10%</span>
            <span className="mt-1 text-xs text-slate-300">daily credit basis</span>
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-8 lg:px-12 lg:pb-24">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-7 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700">
              Take the next step
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Explore Upfund for yourself.
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Create an account to see the wallet, deposit, and referral tools.
            </p>
          </div>
          <Link
            to="/register"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-amber-400 px-6 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-amber-300"
          >
            Create an account
            <FiArrowUpRight />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default LandingPage;
