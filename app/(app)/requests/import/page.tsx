"use client";

import { useRef, useState } from "react";
import { importCustomersFile, downloadSampleCustomerCsv, getImportStaffFormLink } from "@/lib/api";
import { useBusinessContext } from "@/lib/business-context";
import { useToast } from "@/lib/toast-context";
import { ImportSummary } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { FileText, Copy, Check, UploadCloud } from "lucide-react";

const MAX_SIZE_BYTES = 2 * 1024 * 1024;
const ACCEPTED_EXTENSIONS = [".csv", ".xls", ".xlsx"];

type CsvPreview = {
  headers: string[];
  rows: string[][];
};

export default function ImportCustomersPage() {
  const { selectedBusinessId } = useBusinessContext();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [preview, setPreview] = useState<CsvPreview | null>(null);
  const [consent, setConsent] = useState(false);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportSummary | null>(null);
  const [copied, setCopied] = useState(false);

  const staffLink = selectedBusinessId ? getImportStaffFormLink(selectedBusinessId) : "";
  const canImport = !!file && consent && !importing;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    setResult(null);
    setPreview(null);
    setFileError(null);

    if (!selected) {
      setFile(null);
      return;
    }

    const ext = "." + selected.name.split(".").pop()?.toLowerCase();
    if (!ACCEPTED_EXTENSIONS.includes(ext)) {
      setFileError("Unsupported file type. CSV and XLS files are supported.");
      setFile(null);
      return;
    }

    if (selected.size > MAX_SIZE_BYTES) {
      setFileError("File is too large. Max size is 2MB.");
      setFile(null);
      return;
    }

    setFile(selected);

    if (ext === ".csv") {
      selected.text().then((text) => {
        const lines = text.split(/\r?\n/).filter((l) => l.trim() !== "");
        if (lines.length === 0) return;
        const headers = lines[0].split(",").map((h) => h.trim());
        const rows = lines.slice(1, 6).map((line) => line.split(",").map((c) => c.trim()));
        setPreview({ headers, rows });
      });
    }
  }

  async function handleImport() {
    if (!selectedBusinessId || !file) return;
    setImporting(true);
    try {
      const summary = await importCustomersFile(selectedBusinessId, file);
      setResult(summary);
      showToast("Import complete");
    } catch {
      showToast("Something went wrong importing this file");
    } finally {
      setImporting(false);
    }
  }

  function resetFile() {
    setFile(null);
    setPreview(null);
    setResult(null);
    setFileError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function copyLink() {
    await navigator.clipboard.writeText(staffLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">Import Customers</h1>
        <p className="page-subtitle">Upload a customer list to send review requests in bulk.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <label
            htmlFor="customer-file"
            className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-xl py-10 px-4 text-center cursor-pointer hover:bg-slate-50 transition-colors"
          >
            <UploadCloud size={28} className="text-slate-400" />
            {file ? (
              <p className="text-sm font-medium text-slate-900">{file.name}</p>
            ) : (
              <p className="text-sm font-medium text-slate-700">Click to select a file</p>
            )}
            <p className="text-xs text-slate-500">CSV and XLS file types are supported. Max size is 2MB.</p>
            <input
              id="customer-file"
              ref={fileInputRef}
              type="file"
              accept=".csv,.xls,.xlsx"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {fileError && <p className="text-sm text-red-600 mt-3">{fileError}</p>}

          {file && !fileError && (
            <button onClick={resetFile} className="text-xs text-slate-500 hover:text-slate-700 mt-3">
              Remove file
            </button>
          )}

          {preview && (
            <div className="mt-5 overflow-x-auto">
              <p className="text-xs font-medium text-slate-500 mb-2">Preview (first {preview.rows.length} rows)</p>
              <table className="w-full text-xs border border-border rounded-md overflow-hidden">
                <thead className="bg-slate-50">
                  <tr>
                    {preview.headers.map((h) => (
                      <th key={h} className="text-left px-2 py-1.5 font-medium text-slate-600 border-b border-border">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.rows.map((row, i) => (
                    <tr key={i} className="border-b border-border last:border-0">
                      {row.map((cell, j) => (
                        <td key={j} className="px-2 py-1.5 text-slate-700">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!file?.name.toLowerCase().endsWith(".csv") && file && (
            <p className="text-xs text-slate-500 mt-3">
              Preview isn't available for XLS files, the file will be parsed after import.
            </p>
          )}

          <label className="flex items-start gap-2 text-xs text-slate-500 mt-5 cursor-pointer">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="rounded border-border mt-0.5"
            />
            By checking this box, you confirm you have a privacy policy and terms in place governing
            the collection and use of this customer information, and that you have consent to share
            and use it in accordance with your privacy policy and terms of use.
          </label>

          <div className="mt-5">
            <Button onClick={handleImport} disabled={!canImport}>
              {importing ? "Importing..." : "Import Customers"}
            </Button>
          </div>

          {result && (
            <div className="mt-5 bg-berry-50 border border-berry-200 rounded-lg p-4">
              <p className="text-sm font-medium text-berry-800 mb-1">Import complete</p>
              <p className="text-sm text-slate-700">
                {result.imported} of {result.totalRows} customers imported
                {result.skipped > 0 ? `, ${result.skipped} skipped (missing or invalid contact info)` : ""}.
              </p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="card">
            <div className="flex items-start gap-2">
              <FileText size={18} className="text-berry-600 flex-shrink-0 mt-0.5" />
              <div>
                <button
                  onClick={downloadSampleCustomerCsv}
                  className="text-sm text-berry-600 hover:text-berry-800 font-medium underline"
                >
                  Download a sample file
                </button>
                <p className="text-sm text-slate-500 mt-1">
                  Use this template so your columns match up correctly.
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="font-semibold text-slate-900 mb-1">Client Staff Form</h2>
            <p className="text-sm text-slate-500 mb-3">
              Upload customers individually or in bulk without logging in.
            </p>
            <div className="flex items-center gap-2 bg-slate-50 border border-border rounded-md px-3 py-2 mb-2 overflow-hidden">
              <span className="text-xs text-slate-600 truncate flex-1">{staffLink}</span>
            </div>
            <Button variant="outline" size="sm" onClick={copyLink} className="w-full">
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copied" : "Copy Link"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
