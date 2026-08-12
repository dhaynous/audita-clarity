import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import AuditHeader from "@/components/audit/AuditHeader";
import AudioPlayer from "@/components/audit/AudioPlayer";
import AnamnesisComparison from "@/components/audit/AnamnesisComparison";
import EvaluationBlock from "@/components/audit/EvaluationBlock";
import CIDBlock from "@/components/audit/CIDBlock";
import HallucinationBlock from "@/components/audit/HallucinationBlock";
import AuditFooter from "@/components/audit/AuditFooter";
import AuditSummary from "@/components/audit/AuditSummary";
import { ScrollArea } from "@/components/ui/scroll-area";
import hapvidaLogo from "@/assets/hapvida-logo.png";

type Answer = "sim" | "parcial" | "nao" | null;
type AuditStatus = "pendente" | "em_analise" | "em_revisao" | "finalizada" | "nao_auditavel";

// Mock: auditorias já concluídas (em produção virá do backend)
const concluidas: Record<string, {
  status: "finalizada" | "nao_auditavel";
  auditor: string;
  dataAuditoria: string;
  horarioAuditoria: string;
  consulta: Answer; consultaJust: string;
  outputIA: Answer; outputIAJust: string;
  anamneseFinal: Answer; anamneseFinalJust: string;
  cidsCorrect: (boolean | null)[]; bestCID: number | null; manualCID: string;
  hasHallucination: boolean; hallucinationTypes: string[];
  statusJustificativa: string;
}> = {
  "ATD-2026-00120": {
    status: "finalizada", auditor: "Dra. Fernanda Lima", dataAuditoria: "13/03/2026", horarioAuditoria: "10:30",
    consulta: "sim", consultaJust: "",
    outputIA: "parcial", outputIAJust: "A anamnese da IA omitiu parte do histórico de medicações em uso relatado pelo paciente.",
    anamneseFinal: "sim", anamneseFinalJust: "",
    cidsCorrect: [true, false, true], bestCID: 0, manualCID: "",
    hasHallucination: false, hallucinationTypes: [],
    statusJustificativa: "",
  },
  "ATD-2026-00121": {
    status: "finalizada", auditor: "Dr. Paulo Henrique", dataAuditoria: "13/03/2026", horarioAuditoria: "15:45",
    consulta: "sim", consultaJust: "",
    outputIA: "sim", outputIAJust: "",
    anamneseFinal: "parcial", anamneseFinalJust: "Conduta descrita de forma genérica, sem detalhamento do plano terapêutico proposto.",
    cidsCorrect: [true, null, false], bestCID: 0, manualCID: "M54.5",
    hasHallucination: true, hallucinationTypes: ["Conduta", "Temporal"],
    statusJustificativa: "",
  },
  "ATD-2026-00110": {
    status: "nao_auditavel", auditor: "Dra. Fernanda Lima", dataAuditoria: "12/03/2026", horarioAuditoria: "09:00",
    consulta: "nao", consultaJust: "Áudio com ruído excessivo e cortes, impossibilitando a compreensão da consulta.",
    outputIA: null, outputIAJust: "",
    anamneseFinal: null, anamneseFinalJust: "",
    cidsCorrect: [null, null, null], bestCID: null, manualCID: "",
    hasHallucination: false, hallucinationTypes: [],
    statusJustificativa: "Áudio com ruído excessivo e cortes, impossibilitando a compreensão da consulta.",
  },
};

export default function Index() {
  const navigate = useNavigate();
  const { id } = useParams();
  const concluida = id ? concluidas[id] : undefined;

  const [status, setStatus] = useState<AuditStatus>(concluida?.status ?? "pendente");
  const [statusJustificativa, setStatusJustificativa] = useState(concluida?.statusJustificativa ?? "");
  const [motivoRevisao, setMotivoRevisao] = useState("");
  const [isFinalized, setIsFinalized] = useState(!!concluida);

  // Block 3 – Evaluations
  const [consulta, setConsulta] = useState<Answer>(concluida?.consulta ?? null);
  const [consultaJust, setConsultaJust] = useState(concluida?.consultaJust ?? "");
  const [outputIA, setOutputIA] = useState<Answer>(concluida?.outputIA ?? null);
  const [outputIAJust, setOutputIAJust] = useState(concluida?.outputIAJust ?? "");
  const [anamneseFinal, setAnamneseFinal] = useState<Answer>(concluida?.anamneseFinal ?? null);
  const [anamneseFinalJust, setAnamneseFinalJust] = useState(concluida?.anamneseFinalJust ?? "");

  // Block 4 – CIDs
  const [cids, setCids] = useState([
    { code: "G43.0", description: "Migrânea sem aura", correct: (concluida?.cidsCorrect[0] ?? null) as boolean | null },
    { code: "G43.9", description: "Migrânea não especificada", correct: (concluida?.cidsCorrect[1] ?? null) as boolean | null },
    { code: "R51", description: "Cefaleia", correct: (concluida?.cidsCorrect[2] ?? null) as boolean | null },
  ]);
  const [bestCID, setBestCID] = useState<number | null>(concluida?.bestCID ?? null);
  const [manualCID, setManualCID] = useState(concluida?.manualCID ?? "");

  // Block 5 – Hallucinations
  const [hasHallucination, setHasHallucination] = useState<boolean | null>(concluida?.hasHallucination ?? null);
  const [hallucinationTypes, setHallucinationTypes] = useState<string[]>(concluida?.hallucinationTypes ?? []);

  // Mock: tipo de atendimento baseado no ID (em produção virá do backend)
  // PA (pronto atendimento) = CID desabilitado pois já possui AutoCID
  const tipoAtendimento = id?.includes("00143") || id?.includes("00147") || id?.includes("00131") || id?.includes("00144")
    ? "pa" : "eletivo";
  const showCIDBlock = tipoAtendimento !== "pa";

  // Quando o áudio é avaliado como "Não", o atendimento é encaminhado diretamente a Não Auditável
  const isAudioNotAuditable = consulta === "nao";
  const isConcluida = isFinalized && (status === "finalizada" || status === "nao_auditavel");


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

  const handleNotAuditable = () => {
    if (isAudioNotAuditable && consultaJust.length < 15) {
      toast.error("Justificativa obrigatória com no mínimo 15 caracteres.");
      return;
    }
    setStatusJustificativa(consultaJust);
    setIsFinalized(true);
    setStatus("nao_auditavel");
    toast.success("Atendimento marcado como Não Auditável.");
  };

  const handleReportError = () => {
    toast.info("Funcionalidade de reporte de erro será implementada com o backend.");
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Top bar */}
      <div className="bg-primary px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={hapvidaLogo} alt="Hapvida" className="h-8" />
          <div className="h-6 w-px bg-primary-foreground/20" />
          <span className="text-sm font-semibold text-primary-foreground">Auditoria Médica STT</span>
        </div>
        <Button variant="ghost" size="sm" className="gap-1.5 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10" onClick={() => navigate("/")}>
          <ArrowLeft className="h-4 w-4" />
          Voltar à fila
        </Button>
      </div>
      {/* Block 1 – Header */}
      <AuditHeader
        status={status}
        onStatusChange={setStatus}
        justificativa={statusJustificativa}
        onJustificativaChange={setStatusJustificativa}
        motivoRevisao={motivoRevisao}
        onMotivoRevisaoChange={setMotivoRevisao}
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
          {isConcluida && (
            <AuditSummary
              status={status as "finalizada" | "nao_auditavel"}
              auditor={concluida?.auditor}
              dataAuditoria={concluida?.dataAuditoria}
              horarioAuditoria={concluida?.horarioAuditoria}
              items={[
                { title: "Consulta", value: consulta, justification: consultaJust },
                { title: "Output da IA", value: outputIA, justification: outputIAJust },
                { title: "Anamnese Médica Final", value: anamneseFinal, justification: anamneseFinalJust },
              ]}
              cids={cids}
              bestCID={bestCID}
              manualCID={manualCID}
              showCIDs={showCIDBlock && status === "finalizada"}
              hasHallucination={hasHallucination}
              hallucinationTypes={hallucinationTypes}
              motivoRevisao={motivoRevisao}
              statusJustificativa={statusJustificativa}
            />
          )}
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
              disabled={isFinalized || isAudioNotAuditable}
            />
            <EvaluationBlock
              title="Anamnese Médica Final"
              question="O texto médico permite uma definição adequada de diagnóstico e conduta?"
              value={anamneseFinal}
              onChange={setAnamneseFinal}
              justification={anamneseFinalJust}
              onJustificationChange={setAnamneseFinalJust}
              disabled={isFinalized || isAudioNotAuditable}
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
              disabled={isFinalized || isAudioNotAuditable}
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
              disabled={isFinalized || isAudioNotAuditable}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <AuditFooter
        onSaveDraft={handleSaveDraft}
        onFinalize={handleFinalize}
        onReportError={handleReportError}
        onNotAuditable={handleNotAuditable}
        isFinalized={isFinalized}
        isNotAuditableMode={isAudioNotAuditable}
      />
    </div>
  );
}
