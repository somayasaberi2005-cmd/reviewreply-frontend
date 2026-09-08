"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, Star, Eye, EyeOff, Sparkles, ShieldCheck, TrendingUp } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="relative lg:w-[58%] bg-[#14231A] text-[#EAF1E1] flex flex-col justify-between px-8 sm:px-14 py-12 overflow-hidden">
        <div
          className="pointer-events-none absolute -top-32 -right-32 w-[26rem] h-[26rem] rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #8BC34A 0%, transparent 70%)" }}
        />

        <div className="relative flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-berry-400 flex items-center justify-center">
            <MessageSquare size={16} className="text-[#14231A]" />
          </div>
          <span className="font-bold text-lg">ReviewReply</span>
        </div>

        <div className="relative max-w-lg">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1] mb-5">
            Never leave a review
            <br />
            unanswered.
          </h1>
          <p className="text-[#B9C9AF] text-base leading-relaxed mb-10 max-w-md">
            ReviewReply drafts and posts on-brand replies to your Google reviews the moment they
            come in, so your team can focus on the ones that need a human touch.
          </p>

          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 backdrop-blur-sm max-w-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-berry-50 text-berry-800 flex items-center justify-center text-xs font-semibold">
                MT
              </div>
              <div>
                <p className="text-sm font-medium text-white">Maria T.</p>
                <div className="flex gap-0.5">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <span
                      key={i}
                      className="animate-star-pop"
                      style={{ animationDelay: `${i * 0.12}s` }}
                    >
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-sm text-[#D6E2CC] mb-3">
              &ldquo;Booked same day, staff were incredible. Will absolutely be back!&rdquo;
            </p>
            <div
              className="animate-reply-fade bg-berry-600/20 border-l-2 border-berry-400 rounded-lg p-3"
              style={{ animationDelay: "0.9s" }}
            >
              <p className="text-[10px] font-medium text-berry-300 mb-1 flex items-center gap-1">
                <Sparkles size={10} /> AI-drafted reply
              </p>
              <p className="text-xs text-[#D6E2CC]">
                Thank you so much, Maria! We&apos;re thrilled you had a great visit, see you again soon.
              </p>
            </div>
          </div>
        </div>

        <div className="relative space-y-3">
          <div className="flex items-center gap-3 text-sm text-[#B9C9AF]">
            <div className="w-7 h-7 rounded-md bg-white/5 flex items-center justify-center flex-shrink-0">
              <Sparkles size={13} className="text-berry-400" />
            </div>
            AI replies that sound like you, not a robot
          </div>
          <div className="flex items-center gap-3 text-sm text-[#B9C9AF]">
            <div className="w-7 h-7 rounded-md bg-white/5 flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={13} className="text-berry-400" />
            </div>
            Sensitive reviews always go to a real person first
          </div>
          <div className="flex items-center gap-3 text-sm text-[#B9C9AF]">
            <div className="w-7 h-7 rounded-md bg-white/5 flex items-center justify-center flex-shrink-0">
              <TrendingUp size={13} className="text-berry-400" />
            </div>
            See sentiment and response trends at a glance
          </div>
          <p className="text-xs text-[#5C6F55] pt-4">© 2026 ReviewReply</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-16 bg-white">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h2>
          <p className="text-sm text-slate-500 mb-8">Sign in to keep your reviews moving.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <input
                id="email"
                type="email"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="peer w-full border border-border rounded-lg px-3.5 pt-5 pb-2 text-sm outline-none focus:border-berry-400 focus:ring-2 focus:ring-berry-100 transition-colors"
              />
              <label
                htmlFor="email"
                className="absolute left-3.5 top-3.5 text-slate-400 text-sm transition-all pointer-events-none peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:text-berry-600 peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-[10px]"
              >
                Email address
              </label>
            </div>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="peer w-full border border-border rounded-lg px-3.5 pt-5 pb-2 pr-10 text-sm outline-none focus:border-berry-400 focus:ring-2 focus:ring-berry-100 transition-colors"
              />
              <label
                htmlFor="password"
                className="absolute left-3.5 top-3.5 text-slate-400 text-sm transition-all pointer-events-none peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:text-berry-600 peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-[10px]"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="flex justify-end">
              <a href="#" className="text-xs text-berry-600 hover:text-berry-800 font-medium">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-berry-600 hover:bg-berry-800 text-white text-sm font-medium rounded-lg py-2.5 transition-colors active:translate-y-px"
            >
              Sign in
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-slate-400">or continue with</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <button
            onClick={() => router.push("/dashboard")}
            className="w-full flex items-center justify-center gap-2 border border-border rounded-lg py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </button>

          <p className="text-xs text-slate-400 text-center mt-8">
            Preview build, sign in takes you straight to the dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
