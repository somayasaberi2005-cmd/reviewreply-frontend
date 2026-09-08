"use client";

import { FileDown } from "lucide-react";

export function SavePdfButton() {
  return (
    <button
      onClick={() => window.print()}
      className="no-print text-sm font-medium px-3 py-1.5 rounded-md border border-border text-slate-600 hover:bg-slate-50 flex items-center gap-1.5"
    >
      <FileDown size={14} /> Save as PDF
    </button>
  );
}
