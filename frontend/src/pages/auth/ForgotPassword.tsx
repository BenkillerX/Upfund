
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, LockKeyhole } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setMessage("Password reset functionality is coming soon. Stay tuned!");
  };

  return (
    <section className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-8">
      {/* Heading */}
      <div className="text-center mb-8">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
          <LockKeyhole size={26} className="text-slate-900" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900">
          Forgot Password?
        </h1>

        <p className="text-base sm:text-lg text-gray-500 mt-2">
          Don't worry, we'll help you get back into your account.
        </p>
      </div>

      {/* Forgot Password Card */}
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-sm p-5 sm:p-8">

        {/* Success Message */}
        {message && (
          <div
            role="status"
            className="mb-5 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700"
          >
            {message}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div
            role="alert"
            className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email Address
            </label>

            <div className="relative">
              <Mail
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                id="email"
                type="email"
                placeholder="you@gmail.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                  setMessage("");
                }}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 active:bg-gray-950 transition-colors"
          >
            Send Reset Password
          </button>
        </form>

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Login
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
