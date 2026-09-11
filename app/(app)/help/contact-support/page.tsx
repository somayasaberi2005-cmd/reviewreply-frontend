"use client";

import { useState } from "react";
import { useToast } from "@/lib/toast-context";
import { Button } from "@/components/ui/button";

export default function ContactSupportPage() {
  const { showToast } = useToast();
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSend() {
    if (!message.trim()) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 800));
    setSending(false);
    setSent(true);
    setMessage("");
    showToast("Message sent to support");
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">Contact Support Team</h1>
        <p className="page-subtitle">We usually respond within one business day.</p>
      </div>

      <div className="card max-w-lg">
        {sent ? (
          <p className="text-sm text-berry-700">Thanks, we received your message and will get back to you soon.</p>
        ) : (
          <>
            <label className="block text-sm font-medium text-slate-700 mb-1">How can we help?</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className="w-full text-sm border border-border rounded-md p-3 mb-3"
            />
            <Button onClick={handleSend} disabled={sending || !message.trim()}>
              {sending ? "Sending..." : "Send Message"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
