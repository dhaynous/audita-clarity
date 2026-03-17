import { ScrollArea } from "@/components/ui/scroll-area";

const aiAnamnesis = `Paciente do sexo feminino, 45 anos, comparece à consulta relatando cefaleia frontal com intensidade moderada, de caráter pulsátil, iniciada há cerca de 3 dias. Refere piora com exposição à luz e melhora parcial com analgésicos comuns. Nega febre, náuseas ou alterações visuais. Relata episódios semelhantes nos últimos 6 meses, geralmente associados ao período menstrual. Nega uso de medicações contínuas. Sem antecedentes de HAS ou diabetes. Exame físico sem alterações significativas.`;

const medicalAnamnesis = `Paciente feminina, 45 anos. QP: cefaleia frontal pulsátil há 3 dias. HDA: dor de intensidade moderada, fotofobia associada, melhora parcial com dipirona. Episódios recorrentes catameniais nos últimos 6 meses. Nega febre, êmese, escotomas. AP: hígida, sem uso de medicações contínuas, nega HAS/DM. EF: BEG, corada, hidratada, BRNF 2T s/ sopros, MV+ bilateralmente, abdome indolor. HD: Migrânea sem aura (G43.0). Conduta: prescrição de sumatriptano e encaminhamento para neurologia.`;

export default function AnamnesisComparison() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="px-4 py-2.5 bg-primary/5 border-b border-border">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            🤖 Anamnese IA
          </h3>
        </div>
        <ScrollArea className="h-[260px] p-4">
          <p className="text-sm leading-relaxed text-foreground">{aiAnamnesis}</p>
        </ScrollArea>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="px-4 py-2.5 bg-success/5 border-b border-border">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            👨‍⚕️ Anamnese Médica Final
          </h3>
        </div>
        <ScrollArea className="h-[260px] p-4">
          <p className="text-sm leading-relaxed text-foreground">{medicalAnamnesis}</p>
        </ScrollArea>
      </div>
    </div>
  );
}
