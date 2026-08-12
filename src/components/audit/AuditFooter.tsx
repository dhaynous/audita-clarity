import { Button } from "@/components/ui/button";
import { Save, CheckCircle, AlertTriangle, Ban } from "lucide-react";

interface AuditFooterProps {
  onSaveDraft: () => void;
  onFinalize: () => void;
  onReportError: () => void;
  onNotAuditable: () => void;
  isFinalized: boolean;
  isNotAuditableMode?: boolean;
}

export default function AuditFooter({
  onSaveDraft,
  onFinalize,
  onReportError,
  onNotAuditable,
  isFinalized,
  isNotAuditableMode = false,
}: AuditFooterProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-6 py-3 flex items-center justify-between z-50">
      {!isNotAuditableMode && (
        <button
          onClick={onReportError}
          className="text-sm text-danger hover:underline flex items-center gap-1"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          Reportar Erro
        </button>
      )}

      <div className="flex gap-3 ml-auto">
        {!isNotAuditableMode && (
          <>
            <Button variant="outline" onClick={onSaveDraft} disabled={isFinalized}>
              <Save className="w-4 h-4 mr-2" />
              Salvar Rascunho
            </Button>
            <Button onClick={onFinalize} disabled={isFinalized}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Finalizar Auditoria
            </Button>
          </>
        )}
        {isNotAuditableMode && (
          <Button variant="destructive" onClick={onNotAuditable} disabled={isFinalized}>
            <Ban className="w-4 h-4 mr-2" />
            Marcar como Não Auditável
          </Button>
        )}
      </div>
    </div>
  );
}
