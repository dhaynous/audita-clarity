import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Maximize2 } from "lucide-react";

const aiAnamnesis = `Paciente do sexo feminino, 45 anos, comparece à consulta relatando cefaleia frontal com intensidade moderada, de caráter pulsátil, iniciada há cerca de 3 dias. Refere piora com exposição à luz e melhora parcial com analgésicos comuns. Nega febre, náuseas ou alterações visuais. Relata episódios semelhantes nos últimos 6 meses, geralmente associados ao período menstrual. Nega uso de medicações contínuas. Sem antecedentes de HAS ou diabetes. Exame físico sem alterações significativas.`;

const medicalAnamnesis = `Paciente feminina, 45 anos. QP: cefaleia frontal pulsátil há 3 dias. HDA: dor de intensidade moderada, fotofobia associada, melhora parcial com dipirona. Episódios recorrentes catameniais nos últimos 6 meses. Nega febre, êmese, escotomas. AP: hígida, sem uso de medicações contínuas, nega HAS/DM. EF: BEG, corada, hidratada, BRNF 2T s/ sopros, MV+ bilateralmente, abdome indolor. HD: Migrânea sem aura (G43.0). Conduta: prescrição de sumatriptano e encaminhamento para neurologia.`;

const anamneses = [
  {
    id: "ia",
    icon: "🤖",
    title: "Anamnese IA",
    headerClass: "bg-primary/5",
    text: aiAnamnesis,
  },
  {
    id: "medica",
    icon: "👨‍⚕️",
    title: "Anamnese Médica Final",
    headerClass: "bg-success/5",
    text: medicalAnamnesis,
  },
];

export default function AnamnesisComparison() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const expandedAnamnesis = anamneses.find((a) => a.id === expandedId);

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        {anamneses.map((item) => (
          <div
            key={item.id}
            className="bg-card border border-border rounded-lg overflow-hidden flex flex-col"
          >
            <div className={`px-4 py-2.5 border-b border-border ${item.headerClass}`}>
              <h3 className="text-sm font-semibold flex items-center gap-2">
                {item.icon} {item.title}
              </h3>
            </div>
            <ScrollArea className="h-[260px] p-4">
              <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                {item.text}
              </p>
            </ScrollArea>
            <div className="px-3 py-2 border-t border-border flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => setExpandedId(item.id)}
                aria-label={`Expandir ${item.title}`}
              >
                <Maximize2 className="h-3.5 w-3.5" />
                Expandir
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!expandedId} onOpenChange={(open) => !open && setExpandedId(null)}>
        <DialogContent className="max-w-4xl w-[90vw] max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {expandedAnamnesis?.icon} {expandedAnamnesis?.title}
            </DialogTitle>
            <DialogDescription>
              Visualização ampliada do texto para leitura completa.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex-1 min-h-[300px] max-h-[60vh] mt-4 pr-2">
            <p className="text-base leading-relaxed text-foreground whitespace-pre-wrap">
              {expandedAnamnesis?.text}
            </p>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
