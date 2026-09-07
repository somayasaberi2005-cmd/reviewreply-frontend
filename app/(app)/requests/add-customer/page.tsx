"use client";

import { useState } from "react";
import { addCustomer, getStaffFormLink } from "@/lib/api";
import { useBusinessContext } from "@/lib/business-context";
import { useToast } from "@/lib/toast-context";
import { CommunicationPreference } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Copy, Check, Plus, X } from "lucide-react";

export default function AddCustomerPage() {
  const { selectedBusinessId } = useBusinessContext();
  const { showToast } = useToast();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [preference, setPreference] = useState<CommunicationPreference>("email");
  const [showCustomId, setShowCustomId] = useState(false);
  const [customId, setCustomId] = useState("");
  const [showTags, setShowTags] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [sendImmediately, setSendImmediately] = useState(false);
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const staffLink = selectedBusinessId ? getStaffFormLink(selectedBusinessId) : "";
  const canSubmit = firstName.trim() !== "" && consent && !submitting;

  function addTag() {
    const value = tagInput.trim();
    if (value && !tags.includes(value)) {
      setTags((prev) => [...prev, value]);
    }
    setTagInput("");
  }

  function removeTag(tag: string) {
    setTags((prev) => prev.filter((t) => t !== tag));
  }

  async function handleSubmit() {
    if (!selectedBusinessId || !canSubmit) return;
    setSubmitting(true);
    try {
      await addCustomer({
        businessId: selectedBusinessId,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        notes: notes.trim() || undefined,
        communicationPreference: preference,
        customId: customId.trim() || undefined,
        tags,
        sendImmediately,
      });
      showToast("Customer added");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setNotes("");
      setCustomId("");
      setTags([]);
      setSendImmediately(false);
      setConsent(false);
      setPreference("email");
      setShowCustomId(false);
      setShowTags(false);
    } catch {
      showToast("Something went wrong adding this customer");
    } finally {
      setSubmitting(false);
    }
  }

  async function copyLink() {
    await navigator.clipboard.writeText(staffLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">Add Customer</h1>
        <p className="page-subtitle">Add a customer to send them a review request.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full text-sm border border-border rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full text-sm border border-border rounded-md px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-sm border border-border rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Phone</label>
              <input
                type="tel"
                placeholder="(201) 555-0123"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-sm border border-border rounded-md px-3 py-2"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">Communication Preference</label>
            <div className="flex gap-4">
              {(["email", "sms", "both"] as CommunicationPreference[]).map((option) => (
                <label key={option} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="preference"
                    checked={preference === option}
                    onChange={() => setPreference(option)}
                    className="border-border"
                  />
                  {option === "sms" ? "SMS" : option === "both" ? "Both" : "Email"}
                </label>
              ))}
            </div>
          </div>

          <div className="mb-4 space-y-2">
            {showCustomId ? (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Custom ID or Job ID</label>
                <input
                  type="text"
                  value={customId}
                  onChange={(e) => setCustomId(e.target.value)}
                  className="w-full text-sm border border-border rounded-md px-3 py-2 sm:max-w-xs"
                />
              </div>
            ) : (
              <button
                onClick={() => setShowCustomId(true)}
                className="flex items-center gap-1 text-sm text-berry-600 hover:text-berry-800 font-medium"
              >
                <Plus size={14} /> Add a Custom ID or Job ID
              </button>
            )}

            {showTags ? (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-berry-50 text-berry-800"
                    >
                      {tag}
                      <button onClick={() => removeTag(tag)}>
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Type a tag and press Enter"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  className="w-full text-sm border border-border rounded-md px-3 py-2 sm:max-w-xs"
                />
              </div>
            ) : (
              <button
                onClick={() => setShowTags(true)}
                className="flex items-center gap-1 text-sm text-berry-600 hover:text-berry-800 font-medium"
              >
                <Plus size={14} /> Add Tags to this Customer
              </button>
            )}
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-700 mb-4 cursor-pointer">
            <input
              type="checkbox"
              checked={sendImmediately}
              onChange={(e) => setSendImmediately(e.target.checked)}
              className="rounded border-border"
            />
            Send feedback request immediately
          </label>

          <label className="flex items-start gap-2 text-xs text-slate-500 mb-5 cursor-pointer">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="rounded border-border mt-0.5"
            />
            By checking this box, you confirm you have consent to contact this customer and that
            you'll handle their information in accordance with your privacy policy and terms of use.
          </label>

          <Button onClick={handleSubmit} disabled={!canSubmit}>
            {submitting ? "Adding..." : "Add Customer"}
          </Button>
        </div>

        <div className="card h-fit">
          <h2 className="font-semibold text-slate-900 mb-1">Client Staff Form</h2>
          <p className="text-sm text-slate-500 mb-3">
            Share this link so staff can add customers without logging in.
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
  );
}