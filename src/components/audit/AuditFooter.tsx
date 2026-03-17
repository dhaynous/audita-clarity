import { Button } from "@/components/ui/button";
import { Save, CheckCircle, AlertTriangle } from "lucide-react";

interface AuditFooterProps {
  onSaveDraft: () => void;
  onFinalize: () => void;
  onReportError: () => void;
  isFinalized: boolean;
}

export default function AuditFooter({ onSaveDraft, onFinalize, onReportError, isFinalized }: AuditFooterProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-6 py-3 flex items-center justify-between z-50">
      <button
        onClick={onReportError}
        className="text-sm text-danger hover:underline flex items-center gap-1"
      >
        <AlertTriangle className="w-3.5 h-3.5" />
        Reportar Erro
      </button>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onSaveDraft} disabled={isFinalized}>
          <Save className="w-4 h-4 mr-2" />
          Salvar Rascunho
        </Button>
        <Button onClick={onFinalize} disabled={isFinalized}>
          <CheckCircle className="w-4 h-4 mr-2" />
          Finalizar Auditoria
        </Button>
      </div>
    </div>
  );
}
