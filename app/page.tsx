"use client";

import Link from "next/link";
import { MessageSquare, Star, Sparkles, ShieldCheck, TrendingUp, Send, BarChart3, Megaphone } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="flex items-center justify-between px-6 sm:px-12 py-5 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-berry-600 flex items-center justify-center">
            <MessageSquare size={16} className="text-white" />
          </div>
          <span className="font-bold text-lg text-slate-900">ReviewReply</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/signin" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            Sign In
          </Link>
          <Link
            href="/signup"
            className="text-sm font-medium bg-berry-600 hover:bg-berry-800 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Start Free Trial
          </Link>
        </div>
      </header>

      <section
        className="relative text-white px-6 sm:px-12 py-20 overflow-hidden"
        style={{ background: "linear-gradient(160deg, #3D5A1C 0%, #5E8C2E 55%, #8BC34A 100%)" }}
      >
        <div
          className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #F1F8E3 0%, transparent 70%)" }}
        />
        <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1] mb-5">
              Reputation is Revenue.
              <br />
              Grow Both.
            </h1>
            <p className="text-berry-50/90 text-base leading-relaxed mb-8 max-w-md">
              ReviewReply helps local businesses build, manage, and defend their hard-earned reputation
              with AI-drafted replies, automated review requests, and reporting that shows what is
              actually working.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/signup"
                className="bg-white text-berry-800 font-medium px-5 py-2.5 rounded-lg text-sm hover:bg-berry-50 transition-colors"
              >
                Start Your Free Trial
              </Link>
              <Link
                href="/signin"
                className="border border-white/40 text-white font-medium px-5 py-2.5 rounded-lg text-sm hover:bg-white/10 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-lg max-w-sm justify-self-center lg:justify-self-end">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-berry-50 text-berry-800 flex items-center justify-center text-xs font-semibold">
                MT
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Maria T.</p>
                <div className="flex gap-0.5">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-3">
              &ldquo;Booked same day, staff were incredible. Will absolutely be back!&rdquo;
            </p>
            <div className="bg-berry-50 border-l-2 border-berry-400 rounded-lg p-3">
              <p className="text-[10px] font-medium text-berry-700 mb-1 flex items-center gap-1">
                <Sparkles size={10} /> AI-drafted reply
              </p>
              <p className="text-xs text-slate-600">
                Thank you so much, Maria! We&apos;re thrilled you had a great visit, see you again soon.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 sm:px-12 py-16 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-10">Everything you need to protect your reputation</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="border border-border rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-berry-50 flex items-center justify-center mb-4">
              <Send size={18} className="text-berry-600" />
            </div>
            <p className="font-semibold text-slate-900 mb-2">Automated Requests</p>
            <p className="text-sm text-slate-500">
              Ask for reviews by email, SMS, kiosk, or a self-service text keyword, all from one place.
            </p>
          </div>
          <div className="border border-border rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-berry-50 flex items-center justify-center mb-4">
              <Sparkles size={18} className="text-berry-600" />
            </div>
            <p className="font-semibold text-slate-900 mb-2">AI-Drafted Replies</p>
            <p className="text-sm text-slate-500">
              Every review gets a suggested reply in your voice, sensitive ones always go to a real person first.
            </p>
          </div>
          <div className="border border-border rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-berry-50 flex items-center justify-center mb-4">
              <BarChart3 size={18} className="text-berry-600" />
            </div>
            <p className="font-semibold text-slate-900 mb-2">Reporting That Matters</p>
            <p className="text-sm text-slate-500">
              NPS, sentiment, and performance reports that show what is working and what needs attention.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-6 sm:px-12 py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div>
            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center mx-auto mb-3">
              <ShieldCheck size={18} className="text-berry-600" />
            </div>
            <p className="font-semibold text-slate-900 mb-1">Review Defense</p>
            <p className="text-sm text-slate-500">Flags suspicious or fake reviews before they hurt your rating.</p>
          </div>
          <div>
            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center mx-auto mb-3">
              <Megaphone size={18} className="text-berry-600" />
            </div>
            <p className="font-semibold text-slate-900 mb-1">Publish Everywhere</p>
            <p className="text-sm text-slate-500">Review widgets, badges, and social sharing for your best feedback.</p>
          </div>
          <div>
            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center mx-auto mb-3">
              <TrendingUp size={18} className="text-berry-600" />
            </div>
            <p className="font-semibold text-slate-900 mb-1">See Trends At a Glance</p>
            <p className="text-sm text-slate-500">Sentiment and response trends across every location you manage.</p>
          </div>
        </div>
      </section>

      <footer className="px-6 sm:px-12 py-8 border-t border-border text-center text-xs text-slate-400">
        &copy; 2026 ReviewReply
      </footer>
    </div>
  );
}
