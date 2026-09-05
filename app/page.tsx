"use client";

import Link from "next/link";
import { MessageSquareText, Sparkles, ShieldCheck, TrendingUp } from "lucide-react";

const features = [
  { icon: Sparkles, text: "AI-drafted replies matched to your brand voice" },
  { icon: ShieldCheck, text: "Sensitive reviews always routed to a human" },
  { icon: TrendingUp, text: "Real-time sentiment and performance analytics" },
];

export default function Home() {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-b from-slate-900 to-stone-900 p-12 flex-col justify-between overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-berry-400 rounded-full blur-3xl opacity-15 -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-berry-300 rounded-full blur-3xl opacity-10 translate-y-1/3 -translate-x-1/3" />

        <div className="relative z-10 flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-white/15 backdrop-blur-sm flex items-center justify-center">
            <MessageSquareText size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white">ReviewReply</span>
        </div>

        <div className="relative z-10">
          <p className="text-3xl font-semibold text-white leading-tight mb-4">
            Every review answered.
            <br />
            Every voice, on brand.
          </p>
          <p className="text-stone-300 text-sm max-w-sm mb-10">
            ReviewReply drafts and posts on-brand replies to your Google reviews automatically, so nothing falls through the cracks.
          </p>

          <div className="space-y-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                    <Icon size={15} className="text-white" />
                  </div>
                  <p className="text-sm text-stone-200">{feature.text}</p>
                </div>
              );
            })}
          </div>
        </div>

        <p className="relative z-10 text-xs text-stone-400">&copy; 2026 ReviewReply</p>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center bg-slate-50 px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-9 h-9 rounded-lg bg-berry-600 flex items-center justify-center">
              <MessageSquareText size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">ReviewReply</span>
          </div>

          <p className="text-2xl font-bold text-slate-900 mb-1">Welcome back</p>
          <p className="text-sm text-slate-500 mb-8">Sign in to manage your reviews</p>

          <div className="space-y-4 mb-6">
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1.5">Email address</label>
              <input
                type="email"
                placeholder="you@company.com"
                className="w-full text-sm border border-border rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-berry-200 focus:border-berry-400 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1.5">Password</label>
              <input
                type="password"
                placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
                className="w-full text-sm border border-border rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-berry-200 focus:border-berry-400 transition-colors"
              />
            </div>
          </div>

          <Link
            href="/dashboard"
            className="block text-center text-sm font-medium px-4 py-3 rounded-lg bg-berry-600 text-white hover:bg-berry-800 transition-colors shadow-sm"
          >
            Sign in
          </Link>

          <p className="text-xs text-slate-400 text-center mt-5">
            Demo mode &mdash; any input signs you in to the dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}