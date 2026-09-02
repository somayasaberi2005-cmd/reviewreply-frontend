"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function TopbarSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/reviews?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-slate-50 border border-border rounded-lg px-3 py-1.5 w-72 focus-within:border-berry-400 transition-colors">
      <Search size={14} className="text-slate-400" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search reviews, businesses..."
        className="text-sm text-slate-700 placeholder:text-slate-400 bg-transparent outline-none flex-1"
      />
    </form>
  );
}