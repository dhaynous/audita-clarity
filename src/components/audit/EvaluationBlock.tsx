import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

type Answer = "sim" | "parcial" | "nao" | null;

interface EvaluationBlockProps {
  title: string;
  question: string;
  value: Answer;
  onChange: (v: Answer) => void;
  justification: string;
  onJustificationChange: (v: string) => void;
  disabled?: boolean;
}

export default function EvaluationBlock({
  title,
  question,
  value,
  onChange,
  justification,
  onJustificationChange,
  disabled,
}: EvaluationBlockProps) {
  const options: { key: Answer; label: string; activeClass: string }[] = [
    { key: "sim", label: "✓ Sim", activeClass: "segment-btn-yes" },
    { key: "parcial", label: "◐ Parcial", activeClass: "segment-btn-partial" },
    { key: "nao", label: "✗ Não", activeClass: "segment-btn-no" },
  ];

  const needsJustification = value === "parcial" || value === "nao";

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h4 className="text-sm font-semibold mb-1">{title}</h4>
      <p className="text-sm text-muted-foreground mb-3">{question}</p>

      <div className="flex gap-2">
        {options.map((opt) => (
          <button
            key={opt.key}
            className={`segment-btn ${value === opt.key ? opt.activeClass : "hover:bg-muted"}`}
            onClick={() => !disabled && onChange(opt.key)}
            disabled={disabled}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {needsJustification && (
        <Textarea
          className="mt-3 text-sm"
          placeholder="Justificativa obrigatória (mín. 15 caracteres)..."
          value={justification}
          onChange={(e) => onJustificationChange(e.target.value)}
          disabled={disabled}
          minLength={15}
        />
      )}
      {needsJustification && justification.length > 0 && justification.length < 15 && (
        <p className="text-xs text-danger mt-1">Mínimo de 15 caracteres ({justification.length}/15)</p>
      )}
    </div>
  );
}
