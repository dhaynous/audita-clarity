import { CheckCircle2, Lock } from "lucide-react";

type Answer = "sim" | "parcial" | "nao" | null;

interface CID {
  code: string;
  description: string;
  correct: boolean | null;
}

interface AuditSummaryProps {
  status: "finalizada" | "nao_auditavel";
  auditor?: string;
  dataAuditoria?: string;
  horarioAuditoria?: string;
  items: { title: string; value: Answer; justification: string }[];
  cids?: CID[];
  bestCID?: number | null;
  manualCID?: string;
  showCIDs?: boolean;
  hasHallucination: boolean | null;
  hallucinationTypes: string[];
  motivoRevisao?: string;
  statusJustificativa?: string;
}

const answerLabel: Record<string, string> = {
  sim: "Sim",
  parcial: "Parcial",
  nao: "Não",
};

const answerClass: Record<string, string> = {
  sim: "bg-[hsl(var(--status-done))] text-[hsl(var(--success-foreground))]",
  parcial: "bg-[hsl(var(--status-review))] text-[hsl(var(--warning-foreground))]",
  nao: "bg-[hsl(var(--status-not-auditable))] text-[hsl(var(--danger-foreground))]",
};

export default function AuditSummary({
  status,
  auditor,
  dataAuditoria,
  horarioAuditoria,
  items,
  cids,
  bestCID,
  manualCID,
  showCIDs,
  hasHallucination,
  hallucinationTypes,
  motivoRevisao,
  statusJustificativa,
}: AuditSummaryProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-primary" />
          <h4 className="text-sm font-semibold">
            Resumo da auditoria — {status === "finalizada" ? "Finalizada" : "Não Auditável"}
          </h4>
        </div>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Lock className="h-3 w-3" /> Somente leitura
        </span>
      </div>

      {(auditor || dataAuditoria) && (
        <p className="text-xs text-muted-foreground">
          Auditado por <span className="font-medium text-foreground">{auditor ?? "—"}</span>
          {dataAuditoria ? ` em ${dataAuditoria}` : ""}
          {horarioAuditoria ? ` às ${horarioAuditoria}` : ""}
        </p>
      )}

      <div className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Avaliações e comentários
        </p>
        {items.map((item) => (
          <div key={item.title} className="border border-border rounded-md p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium">{item.title}</span>
              {item.value && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${answerClass[item.value]}`}>
                  {answerLabel[item.value]}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">
              {item.justification?.trim() ? item.justification : "Sem comentários registrados."}
            </p>
          </div>
        ))}
      </div>

      {showCIDs && cids && cids.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">CIDs validados</p>
          <ul className="space-y-1">
            {cids.map((c, i) => (
              <li key={c.code} className="text-sm flex items-center justify-between gap-2">
                <span>
                  <span className="font-medium">{c.code}</span> — {c.description}
                  {bestCID === i && <span className="ml-2 text-xs text-primary font-medium">(melhor CID)</span>}
                </span>
                <span className="text-xs text-muted-foreground">
                  {c.correct === null ? "Não avaliado" : c.correct ? "Correto" : "Incorreto"}
                </span>
              </li>
            ))}
          </ul>
          {manualCID?.trim() && (
            <p className="text-sm text-muted-foreground">CID informado manualmente: {manualCID}</p>
          )}
        </div>
      )}

      <div className="space-y-1">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Alucinações</p>
        <p className="text-sm text-muted-foreground">
          {hasHallucination === null
            ? "Não avaliado."
            : hasHallucination
            ? `Sim — ${hallucinationTypes.join(", ") || "sem tipos informados"}`
            : "Não houve alucinação identificada."}
        </p>
      </div>

      {motivoRevisao?.trim() && (
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Motivo da revisão</p>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{motivoRevisao}</p>
        </div>
      )}

      {status === "nao_auditavel" && statusJustificativa?.trim() && (
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Justificativa de não auditável
          </p>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{statusJustificativa}</p>
        </div>
      )}
    </div>
  );
}
