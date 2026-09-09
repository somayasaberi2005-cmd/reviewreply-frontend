"use client";

import { useEffect, useRef, useState } from "react";
import { getBrandSettings, updateBrandSettings } from "@/lib/api";
import { useBusinessContext } from "@/lib/business-context";
import { useToast } from "@/lib/toast-context";
import { BrandSettings } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const presetColors = ["#5E8C2E", "#1e293b", "#7c3aed", "#0891b2", "#dc2626", "#d97706"];

export default function BrandColorsPage() {
  const { selectedBusinessId } = useBusinessContext();
  const { showToast } = useToast();
  const [settings, setSettings] = useState<BrandSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!selectedBusinessId) return;
    setLoading(true);
    getBrandSettings(selectedBusinessId).then((data) => {
      setSettings(data);
      setLoading(false);
    });
  }, [selectedBusinessId]);

  if (loading || !settings) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="page-title">Brand &amp; Colors</h1>
          <p className="page-subtitle">Loading...</p>
        </div>
        <Skeleton className="h-72 w-full rounded-2xl" />
      </div>
    );
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>, field: "logoUrl" | "bannerUrl") {
    const file = e.target.files?.[0];
    if (!file || !settings) return;
    const url = URL.createObjectURL(file);
    setSettings({ ...settings, [field]: url });
  }

  async function handleSave() {
    if (!selectedBusinessId || !settings) return;
    setSaving(true);
    try {
      await updateBrandSettings(selectedBusinessId, settings);
      showToast("Brand settings saved");
    } finally {
      setSaving(false);
    }
  }

  const isValidHex = /^#([0-9A-Fa-f]{6})$/.test(settings.accentColor);

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">Brand &amp; Colors</h1>
        <p className="page-subtitle">Set the logo and colors for your account to customize email templates and landing pages.</p>
      </div>

      <div className="card mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
          <div>
            <p className="font-semibold text-slate-900 mb-1">Logo</p>
            <p className="text-sm text-slate-500">
              Used in the header of your feedback request email and feedback page. Max file size 2MB.
              Display width is 300 pixels.
            </p>
          </div>
          <div>
            <div
              onClick={() => logoInputRef.current?.click()}
              className="border-2 border-dashed border-border rounded-xl h-24 flex items-center justify-center cursor-pointer hover:bg-slate-50"
            >
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt="Logo" className="max-h-16 max-w-[80%] object-contain" />
              ) : (
                <span className="text-sm font-medium bg-slate-900 text-white px-3 py-1.5 rounded-md">
                  Choose Image
                </span>
              )}
            </div>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageChange(e, "logoUrl")}
            />
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
          <div>
            <p className="font-semibold text-slate-900 mb-1">Accent Color</p>
            <p className="text-sm text-slate-500">
              Used in email designs and landing page designs. Choose a base color or enter a hex code.
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-2">Selected color (or enter hex #)</p>
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-md border border-border flex-shrink-0"
                style={{ backgroundColor: isValidHex ? settings.accentColor : "#e2e8f0" }}
              />
              <input
                type="text"
                value={settings.accentColor}
                onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                className={`text-sm border rounded-md px-3 py-2 w-32 ${
                  isValidHex ? "border-border" : "border-red-400"
                }`}
              />
            </div>
            <div className="flex gap-2">
              {presetColors.map((c) => (
                <button
                  key={c}
                  onClick={() => setSettings({ ...settings, accentColor: c })}
                  className="w-6 h-6 rounded-full border border-border"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            {!isValidHex && <p className="text-xs text-red-500 mt-2">Enter a valid 6-digit hex color.</p>}
          </div>
        </div>
      </div>

      <div className="card mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
          <div>
            <p className="font-semibold text-slate-900 mb-1">Banner Image</p>
            <p className="text-sm text-slate-500">
              An optional banner image at the top of your feedback pages. Max file size 2MB. Minimum width is 760px.
            </p>
          </div>
          <div>
            <div
              onClick={() => bannerInputRef.current?.click()}
              className="border-2 border-dashed border-border rounded-xl h-24 flex items-center justify-center cursor-pointer hover:bg-slate-50"
            >
              {settings.bannerUrl ? (
                <img src={settings.bannerUrl} alt="Banner" className="max-h-16 max-w-[80%] object-contain" />
              ) : (
                <span className="text-sm font-medium bg-slate-900 text-white px-3 py-1.5 rounded-md">
                  Choose Image
                </span>
              )}
            </div>
            <input
              ref={bannerInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageChange(e, "bannerUrl")}
            />
          </div>
        </div>
      </div>

      <Button onClick={handleSave} disabled={saving || !isValidHex}>
        {saving ? "Saving..." : "Save Settings"}
      </Button>
    </div>
  );
}
