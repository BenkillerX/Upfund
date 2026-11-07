import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/useAuth";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get("ref");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();

  setError(null);

  if (!username || !email || !password) {
    setError("Please fill in all required fields.");
    return;
  }

  setLoading(true);

  const toastId = toast.loading("Creating account...");

  try {
    const user = await register( username, email, password, referralCode || undefined );
    toast.success("Registration successful!", {
      id: toastId,
    });

    if (user.role === "user") {
      navigate("/user/");
    } else if (user.role === "admin") {
      navigate("/admin/dashboard");
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        "Unable to create your account.";

      setError(message);

      toast.error(message, {
        id: toastId,
      });
    } else {
      const message = "Something went wrong. Please try again.";

      setError(message);
      console.log(message);
      
      toast.error(message, {
        id: toastId,
      });
    }
  } finally {
    setLoading(false);
  }
}

  return (
    <section className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-8">
      {/* Heading */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900">
          Welcome To Upfund
        </h1>

        <p className="text-base sm:text-lg text-gray-500 mt-2">
          Create an account to get started
        </p>
      </div>

      {/* Register Card */}
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-sm p-5 sm:p-8">

        {/* Error Message */}
        {error && (
          <div
            role="alert"
            className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <svg
              className="mt-0.5 h-5 w-5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M10.29 3.86l-7.1 12.27A2 2 0 004.92 19h14.16a2 2 0 001.73-2.87l-7.1-12.27a2 2 0 00-3.42 0z"
              />
            </svg>

            <p>{error}</p>
          </div>
        )}

        {/* Form */}
        <form className="space-y-5" onSubmit={handleRegister}>

          {/* username */}
         <div className="flex flex-col gap-2">
  <label
    htmlFor="username"
    className="text-sm font-medium text-gray-700"
  >
    Username
  </label>

  <input
    id="username"
    type="text"
    placeholder="Albert Einsine"
    value={username}
    onChange={(e) => setUsername(e.target.value)}
    className={`w-full px-4 py-3 border rounded-lg outline-none transition
      ${
        error
          ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
          : "border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
      }
      placeholder:text-gray-400`}
  />
</div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              placeholder="you@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg outline-none transition
                ${
                  error
                    ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
                    : "border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                }
                placeholder:text-gray-400`}
            />
          </div>

          {/* Password */}
          <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 placeholder:text-gray-400"
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff size={20} />
            ) : (
              <Eye size={20} />
            )}
          </button>
        </div>

          {/* Create Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 active:bg-gray-950 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {/* Register */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link
            to="/"
            className="font-medium text-slate-500 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Register;