"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Sparkles, Check, X, Loader2, Wand2 } from "lucide-react";

interface AiFieldAssistProps {
  field: string;
  currentValue: string;
  context?: Record<string, string>;
  onAccept: (value: string) => void;
  children: React.ReactNode;
}

export function AiFieldAssist({
  field,
  currentValue,
  context = {},
  onAccept,
  children,
}: AiFieldAssistProps) {
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchSuggestion = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "field-suggest",
          field,
          currentValue,
          context,
        }),
      });
      const json = await res.json();
      if (json.suggestion) {
        setSuggestion(json.suggestion);
        setVisible(true);
      }
    } catch {
      // Silently fail — AI assist is optional
    }
    setLoading(false);
  }, [field, currentValue, context]);

  const handleFocus = useCallback(() => {
    // Only auto-suggest if the field is empty or very short
    if (!currentValue || currentValue.length < 10) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(fetchSuggestion, 800);
    }
  }, [currentValue, fetchSuggestion]);

  const handleAccept = useCallback(() => {
    onAccept(suggestion);
    setVisible(false);
    setSuggestion("");
  }, [suggestion, onAccept]);

  const handleDismiss = useCallback(() => {
    setVisible(false);
    setSuggestion("");
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <div ref={containerRef} onFocus={handleFocus}>
      {children}

      {/* Suggest button — always visible */}
      <div className="flex items-center gap-2 mt-1.5">
        <button
          type="button"
          onClick={fetchSuggestion}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-gold/80 hover:text-gold hover:bg-gold-light rounded-lg transition-all cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Wand2 className="w-3 h-3" />
          )}
          {loading ? "Thinking..." : "AI Suggest"}
        </button>
      </div>

      {/* Suggestion panel */}
      {visible && suggestion && (
        <div className="mt-2 bg-gradient-to-r from-gold-light/60 to-gold-light/30 border border-gold/20 rounded-xl p-4 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex items-start gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-gold shrink-0 mt-0.5" />
            <p className="text-sm text-dark-text leading-relaxed whitespace-pre-line">
              {suggestion}
            </p>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <button
              type="button"
              onClick={handleAccept}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-navy bg-gold hover:bg-gold-hover rounded-full cursor-pointer transition-colors"
            >
              <Check className="w-3 h-3" /> Use This
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-body-text hover:text-navy rounded-full cursor-pointer transition-colors"
            >
              <X className="w-3 h-3" /> Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Floating AI quality monitor for the overall document.
 * Call with the full CV/letter data to get structural feedback.
 */
export function useAiReview() {
  const [review, setReview] = useState<{
    score: number;
    issues: { field: string; message: string; severity: string }[];
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const runReview = useCallback(async (data: Record<string, unknown>) => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "review-structure", context: data }),
      });
      const json = await res.json();
      if (json.review) setReview(json.review);
    } catch {
      // Silently fail
    }
    setLoading(false);
  }, []);

  return { review, loading, runReview };
}
