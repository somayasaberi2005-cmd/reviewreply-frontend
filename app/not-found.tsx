import Link from "next/link";
import { MessageSquareText } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6 text-center">
      <div>
        <div className="w-12 h-12 rounded-lg bg-berry-600 flex items-center justify-center mx-auto mb-4">
          <MessageSquareText size={22} className="text-white" />
        </div>
        <p className="text-5xl font-bold text-slate-900 mb-2">404</p>
        <p className="text-slate-500 mb-6">This page doesn&apos;t exist.</p>
        <Link
          href="/dashboard"
          className="inline-block text-sm font-medium px-4 py-2 rounded-md bg-berry-600 text-white hover:bg-berry-800 transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}