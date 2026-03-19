import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ExternalLink, Clock, User, Stethoscope, Building2, Calendar, CreditCard } from "lucide-react";

type AuditStatus = "pendente" | "em_analise" | "em_revisao" | "finalizada" | "nao_auditavel";

const statusConfig: Record<AuditStatus, { label: string; color: string }> = {
  pendente: { label: "Pendente", color: "bg-warning text-warning-foreground" },
  em_analise: { label: "Em Análise", color: "bg-primary text-primary-foreground" },
  em_revisao: { label: "Em Revisão", color: "bg-purple-500 text-primary-foreground" },
  finalizada: { label: "Finalizada", color: "bg-success text-success-foreground" },
  nao_auditavel: { label: "Não Auditável", color: "bg-danger text-danger-foreground" },
};

interface AuditHeaderProps {
  status: AuditStatus;
  onStatusChange: (s: AuditStatus) => void;
  justificativa: string;
  onJustificativaChange: (v: string) => void;
  motivoRevisao: string;
  onMotivoRevisaoChange: (v: string) => void;
  isFinalized: boolean;
}

export default function AuditHeader({ status, onStatusChange, justificativa, onJustificativaChange, motivoRevisao, onMotivoRevisaoChange, isFinalized }: AuditHeaderProps) {
  const cfg = statusConfig[status];

  return (
    <div className="bg-card border-b border-border px-6 py-3">
      <div className="flex items-center gap-6 flex-wrap">
        {/* IDs */}
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold text-muted-foreground">Atendimento</span>
          <span className="font-mono font-bold">#ATD-2026-00482</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <CreditCard className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">Carteirinha:</span>
          <span className="font-mono">0089-4412-3301-0021</span>
        </div>

        <div className="h-5 w-px bg-border" />

        {/* Type */}
        <div className="flex items-center gap-1.5 text-sm">
          <Stethoscope className="w-4 h-4 text-muted-foreground" />
          <Badge variant="outline" className="font-medium">Telemedicina – Eletivo</Badge>
        </div>

        {/* Specialty */}
        <div className="flex items-center gap-1.5 text-sm">
          <span className="text-muted-foreground">Especialidade:</span>
          <span className="font-medium">Clínica Geral</span>
        </div>

        <div className="h-5 w-px bg-border" />

        {/* Doctor */}
        <div className="flex items-center gap-1.5 text-sm">
          <User className="w-4 h-4 text-muted-foreground" />
          <span>Dr. Carlos Mendes</span>
        </div>

        {/* Date */}
        <div className="flex items-center gap-1.5 text-sm">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span>15/03/2026</span>
          <Clock className="w-4 h-4 text-muted-foreground ml-1" />
          <span>08:30 – 08:52</span>
        </div>

        {/* History link */}
        <a href="#" className="flex items-center gap-1 text-sm text-primary hover:underline ml-auto">
          <ExternalLink className="w-3.5 h-3.5" />
          Histórico / Prontuário
        </a>

        <div className="h-5 w-px bg-border" />

        {/* Status */}
        <div className="flex items-center gap-2">
          <Select value={status} onValueChange={(v) => onStatusChange(v as AuditStatus)} disabled={isFinalized}>
            <SelectTrigger className={`w-[220px] h-9 text-sm font-semibold ${cfg.color} border-transparent`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(statusConfig).map(([key, val]) => (
                <SelectItem key={key} value={key}>
                  {val.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {status === "em_revisao" && (
        <div className="mt-3">
          <Textarea
            placeholder="Informe o motivo para envio à revisão (obrigatório, mínimo 15 caracteres)..."
            value={motivoRevisao}
            onChange={(e) => onMotivoRevisaoChange(e.target.value)}
            disabled={isFinalized}
            className="text-sm min-h-[60px]"
          />
          {motivoRevisao.length > 0 && motivoRevisao.length < 15 && (
            <p className="text-xs text-destructive mt-1">Mínimo de 15 caracteres ({motivoRevisao.length}/15)</p>
          )}
        </div>
      )}

      {status === "nao_auditavel" && (
        <div className="mt-3">
          <Textarea
            placeholder="Justifique por que este atendimento não é auditável (áudio inconsistente, etc.)..."
            value={justificativa}
            onChange={(e) => onJustificativaChange(e.target.value)}
            disabled={isFinalized}
            className="text-sm min-h-[60px]"
          />
        </div>
      )}
    </div>
  );
}
