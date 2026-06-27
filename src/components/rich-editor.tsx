"use client";

import { useRef, useCallback, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  RemoveFormatting,
  Undo,
  Redo,
} from "lucide-react";

interface RichEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

function ToolbarBtn({
  icon: Icon,
  label,
  onClick,
  active,
}: {
  icon: typeof Bold;
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      title={label}
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
        active
          ? "bg-gold/20 text-gold"
          : "text-body-text hover:bg-light-gray hover:text-navy"
      }`}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}

export function RichEditor({
  value,
  onChange,
  placeholder = "Start typing...",
  minHeight = "120px",
}: RichEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInternalChange = useRef(false);

  useEffect(() => {
    if (editorRef.current && !isInternalChange.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || "";
      }
    }
    isInternalChange.current = false;
  }, [value]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      isInternalChange.current = true;
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const exec = useCallback((command: string, val?: string) => {
    document.execCommand(command, false, val);
    editorRef.current?.focus();
    if (editorRef.current) {
      isInternalChange.current = true;
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white focus-within:border-gold transition-colors">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-gray-100 bg-light-gray/50 flex-wrap">
        <ToolbarBtn icon={Bold} label="Bold (Ctrl+B)" onClick={() => exec("bold")} />
        <ToolbarBtn icon={Italic} label="Italic (Ctrl+I)" onClick={() => exec("italic")} />
        <ToolbarBtn icon={Underline} label="Underline (Ctrl+U)" onClick={() => exec("underline")} />

        <div className="w-px h-5 bg-gray-200 mx-1" />

        <ToolbarBtn icon={List} label="Bullet List" onClick={() => exec("insertUnorderedList")} />
        <ToolbarBtn icon={ListOrdered} label="Numbered List" onClick={() => exec("insertOrderedList")} />

        <div className="w-px h-5 bg-gray-200 mx-1" />

        <ToolbarBtn icon={Undo} label="Undo" onClick={() => exec("undo")} />
        <ToolbarBtn icon={Redo} label="Redo" onClick={() => exec("redo")} />
        <ToolbarBtn icon={RemoveFormatting} label="Clear Formatting" onClick={() => exec("removeFormat")} />
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        data-placeholder={placeholder}
        className="px-4 py-3 text-sm text-dark-text outline-none [&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-gray-400 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-1 [&_li]:py-0.5 [&_b]:font-bold [&_i]:italic [&_u]:underline"
        style={{ minHeight }}
      />
    </div>
  );
}

/**
 * Convert rich HTML to plain text lines for CV export.
 * Strips tags but preserves line/bullet structure.
 */
export function richHtmlToLines(html: string): string[] {
  if (!html) return [];

  const lines: string[] = [];
  const div = document.createElement("div");
  div.innerHTML = html;

  function walk(node: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      if (text) lines.push(text);
      return;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const tag = el.tagName.toLowerCase();

      if (tag === "li") {
        const text = el.textContent?.trim();
        if (text) lines.push(text);
        return;
      }

      if (tag === "br") {
        return;
      }

      if (tag === "div" || tag === "p") {
        const text = el.textContent?.trim();
        if (text) lines.push(text);
        return;
      }

      for (const child of Array.from(node.childNodes)) {
        walk(child);
      }
    }
  }

  walk(div);
  return lines.filter(Boolean);
}

/**
 * Convert plain text (newline-separated) to HTML for the editor.
 */
export function linesToRichHtml(text: string): string {
  if (!text) return "";
  const lines = text.split("\n").filter(Boolean);
  if (lines.length <= 1) return text;
  return "<ul>" + lines.map((l) => `<li>${escapeHtml(l)}</li>`).join("") + "</ul>";
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
