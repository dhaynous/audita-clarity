import { useState } from "react";
import { toast } from "sonner";
import AuditHeader from "@/components/audit/AuditHeader";
import AudioPlayer from "@/components/audit/AudioPlayer";
import AnamnesisComparison from "@/components/audit/AnamnesisComparison";
import EvaluationBlock from "@/components/audit/EvaluationBlock";
import CIDBlock from "@/components/audit/CIDBlock";
import HallucinationBlock from "@/components/audit/HallucinationBlock";
import AuditFooter from "@/components/audit/AuditFooter";
import { ScrollArea } from "@/components/ui/scroll-area";

type Answer = "sim" | "parcial" | "nao" | null;
type AuditStatus = "pendente" | "em_analise" | "em_revisao" | "finalizada" | "nao_auditavel";

export default function Index() {
  const [status, setStatus] = useState<AuditStatus>("pendente");
  const [statusJustificativa, setStatusJustificativa] = useState("");
  const [isFinalized, setIsFinalized] = useState(false);

  // Block 3 – Evaluations
  const [consulta, setConsulta] = useState<Answer>(null);
  const [consultaJust, setConsultaJust] = useState("");
  const [outputIA, setOutputIA] = useState<Answer>(null);
  const [outputIAJust, setOutputIAJust] = useState("");
  const [anamneseFinal, setAnamneseFinal] = useState<Answer>(null);
  const [anamneseFinalJust, setAnamneseFinalJust] = useState("");

  // Block 4 – CIDs
  const [cids, setCids] = useState([
    { code: "G43.0", description: "Migrânea sem aura", correct: null as boolean | null },
    { code: "G43.9", description: "Migrânea não especificada", correct: null as boolean | null },
    { code: "R51", description: "Cefaleia", correct: null as boolean | null },
  ]);
  const [bestCID, setBestCID] = useState<number | null>(null);
  const [manualCID, setManualCID] = useState("");

  // Block 5 – Hallucinations
  const [hasHallucination, setHasHallucination] = useState<boolean | null>(null);
  const [hallucinationTypes, setHallucinationTypes] = useState<string[]>([]);

  const showCIDBlock = true; // Telemedicina = sem AutoCID

  const toggleCID = (idx: number, val: boolean) => {
    setCids(cids.map((c, i) => (i === idx ? { ...c, correct: val } : c)));
  };

  const validate = () => {
    if (!consulta || !outputIA || !anamneseFinal) {
      toast.error("Preencha todas as avaliações do Bloco 3.");
      return false;
    }
    if ((consulta !== "sim" && consultaJust.length < 15) ||
        (outputIA !== "sim" && outputIAJust.length < 15) ||
        (anamneseFinal !== "sim" && anamneseFinalJust.length < 15)) {
      toast.error("Justificativas devem ter no mínimo 15 caracteres.");
      return false;
    }
    if (hasHallucination === null) {
      toast.error("Preencha a análise de alucinações.");
      return false;
    }
    if (hasHallucination && hallucinationTypes.length === 0) {
      toast.error("Selecione ao menos um tipo de alucinação.");
      return false;
    }
    return true;
  };

  const handleSaveDraft = () => {
    toast.success("Rascunho salvo com sucesso.");
  };

  const handleFinalize = () => {
    if (!validate()) return;
    setIsFinalized(true);
    setStatus("finalizada");
    toast.success("Auditoria finalizada com sucesso.");
  };

  const handleReportError = () => {
    toast.info("Funcionalidade de reporte de erro será implementada com o backend.");
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Block 1 – Header */}
      <AuditHeader
        status={status}
        onStatusChange={setStatus}
        justificativa={statusJustificativa}
        onJustificativaChange={setStatusJustificativa}
        isFinalized={isFinalized}
      />

      {/* Main content – split layout */}
      <div className="flex gap-4 p-4 max-w-[1800px] mx-auto">
        {/* Left column – Evidence */}
        <div className="w-1/2 space-y-4">
          <AudioPlayer />
          <AnamnesisComparison />
        </div>

        {/* Right column – Evaluation */}
        <div className="w-1/2 space-y-4">
          {/* Block 3 */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Bloco 3 – Avaliação</h3>
            <EvaluationBlock
              title="Consulta"
              question="A consulta a partir do áudio permite uma definição adequada?"
              value={consulta}
              onChange={setConsulta}
              justification={consultaJust}
              onJustificationChange={setConsultaJust}
              disabled={isFinalized}
            />
            <EvaluationBlock
              title="Output da IA"
              question="A história clínica da anamnese da IA reflete o áudio?"
              value={outputIA}
              onChange={setOutputIA}
              justification={outputIAJust}
              onJustificationChange={setOutputIAJust}
              disabled={isFinalized}
            />
            <EvaluationBlock
              title="Anamnese Médica Final"
              question="O texto médico permite uma definição adequada de diagnóstico e conduta?"
              value={anamneseFinal}
              onChange={setAnamneseFinal}
              justification={anamneseFinalJust}
              onJustificationChange={setAnamneseFinalJust}
              disabled={isFinalized}
            />
          </div>

          {/* Block 4 */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Bloco 4 – CIDs</h3>
            <CIDBlock
              cids={cids}
              onToggle={toggleCID}
              selectedBest={bestCID}
              onSelectBest={setBestCID}
              manualCID={manualCID}
              onManualCIDChange={setManualCID}
              disabled={isFinalized}
              visible={showCIDBlock}
            />
          </div>

          {/* Block 5 */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Bloco 5 – Alucinações</h3>
            <HallucinationBlock
              hasHallucination={hasHallucination}
              onHasChange={setHasHallucination}
              selectedTypes={hallucinationTypes}
              onTypesChange={setHallucinationTypes}
              disabled={isFinalized}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <AuditFooter
        onSaveDraft={handleSaveDraft}
        onFinalize={handleFinalize}
        onReportError={handleReportError}
        isFinalized={isFinalized}
      />
    </div>
  );
}
