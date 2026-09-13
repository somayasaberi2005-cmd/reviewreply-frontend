"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MessageSquare } from "lucide-react";

const businessTypes = ["Restaurant", "Healthcare", "Legal", "Home Services", "Real Estate", "Retail", "Other"];

export default function SignUpPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [heardAboutUs, setHeardAboutUs] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <header className="flex items-center justify-between px-6 sm:px-12 py-5 border-b border-border relative z-10">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-berry-600 flex items-center justify-center">
            <MessageSquare size={16} className="text-white" />
          </div>
          <span className="font-bold text-lg text-slate-900">ReviewReply</span>
        </Link>
        <Link href="/signin" className="text-sm font-medium text-berry-600 hover:text-berry-800">
          Back to Sign In
        </Link>
      </header>

      <div
        className="pointer-events-none absolute top-0 right-0 w-1/3 h-full opacity-10"
        style={{
          backgroundImage:
            "repeating-conic-gradient(#5E8C2E 0% 25%, transparent 0% 50%)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-slate-900 text-center mb-1">Start Your Free 14 Day Trial</h1>
        <p className="text-sm text-slate-500 text-center mb-10">Step One: Create your account.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                First name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full text-sm border border-border rounded-lg px-3 py-2 outline-none focus:border-berry-400 focus:ring-2 focus:ring-berry-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Last name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full text-sm border border-border rounded-lg px-3 py-2 outline-none focus:border-berry-400 focus:ring-2 focus:ring-berry-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Work email<span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                autoCapitalize="none"
                autoCorrect="off"
                value={workEmail}
                onChange={(e) => setWorkEmail(e.target.value)}
                className="w-full text-sm border border-border rounded-lg px-3 py-2 outline-none focus:border-berry-400 focus:ring-2 focus:ring-berry-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Phone number<span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-sm border border-border rounded-lg px-3 py-2 outline-none focus:border-berry-400 focus:ring-2 focus:ring-berry-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Company name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full text-sm border border-border rounded-lg px-3 py-2 outline-none focus:border-berry-400 focus:ring-2 focus:ring-berry-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Business Type<span className="text-red-500">*</span>
              </label>
              <select
                required
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-full text-sm border border-border rounded-lg px-3 py-2 outline-none focus:border-berry-400 focus:ring-2 focus:ring-berry-100"
              >
                <option value="">Please Select</option>
                {businessTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Website URL<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className="w-full text-sm border border-border rounded-lg px-3 py-2 outline-none focus:border-berry-400 focus:ring-2 focus:ring-berry-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              How did you hear about us?<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={heardAboutUs}
              onChange={(e) => setHeardAboutUs(e.target.value)}
              className="w-full text-sm border border-border rounded-lg px-3 py-2 outline-none focus:border-berry-400 focus:ring-2 focus:ring-berry-100"
            />
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            By clicking &ldquo;Next&rdquo;, you agree to receive account-related messages from ReviewReply
            and agree to our Terms of Service and Privacy Policy.
          </p>

          <button
            type="submit"
            className="bg-berry-600 hover:bg-berry-800 text-white text-sm font-medium rounded-lg px-8 py-2.5 transition-colors active:translate-y-px mt-2"
          >
            Next
          </button>
        </form>
      </div>
    </div>
  );
}
