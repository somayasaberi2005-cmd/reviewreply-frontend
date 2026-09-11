"use client";

import { useRef, useState } from "react";
import { importBusinessesFile } from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { ImportBusinessSummary } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";

export default function ImportBusinessesPage() {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportBusinessSummary | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    setFile(selected ?? null);
    setResult(null);
  }

  async function handleImport() {
    if (!file) return;
    setImporting(true);
    try {
      const summary = await importBusinessesFile(file);
      setResult(summary);
      showToast("Import complete");
    } finally {
      setImporting(false);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">Import Businesses</h1>
        <p className="page-subtitle">Bulk add multiple business locations to your account from a CSV file.</p>
      </div>

      <div className="card max-w-xl">
        <label
          htmlFor="business-file"
          className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-xl py-10 px-4 text-center cursor-pointer hover:bg-slate-50 transition-colors"
        >
          <UploadCloud size={28} className="text-slate-400" />
          {file ? (
            <p className="text-sm font-medium text-slate-900">{file.name}</p>
          ) : (
            <p className="text-sm font-medium text-slate-700">Click to select a file</p>
          )}
          <p className="text-xs text-slate-500">CSV file types are supported. Max size is 2MB.</p>
          <input id="business-file" ref={fileInputRef} type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
        </label>

        <div className="mt-5">
          <Button onClick={handleImport} disabled={!file || importing}>
            {importing ? "Importing..." : "Import Businesses"}
          </Button>
        </div>

        {result && (
          <div className="mt-5 bg-berry-50 border border-berry-200 rounded-lg p-4">
            <p className="text-sm font-medium text-berry-800 mb-1">Import complete</p>
            <p className="text-sm text-slate-700">
              {result.imported} of {result.totalRows} businesses imported
              {result.skipped > 0 ? `, ${result.skipped} skipped.` : "."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
