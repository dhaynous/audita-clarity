import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface CIDItem {
  code: string;
  description: string;
  correct: boolean | null;
}

interface CIDBlockProps {
  cids: CIDItem[];
  onToggle: (idx: number, val: boolean) => void;
  selectedBest: number | null;
  onSelectBest: (idx: number) => void;
  manualCID: string;
  onManualCIDChange: (v: string) => void;
  disabled?: boolean;
  visible: boolean;
}

export default function CIDBlock({ cids, onToggle, selectedBest, onSelectBest, manualCID, onManualCIDChange, disabled, visible }: CIDBlockProps) {
  if (!visible) return null;

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h4 className="text-sm font-semibold mb-3">Avaliação dos CIDs Sugeridos pela IA</h4>
      <p className="text-xs text-muted-foreground mb-4">
        Disponível apenas para atendimentos sem IA AutoCID implementada.
      </p>

      {/* CID validation table */}
      <div className="space-y-2 mb-4">
        <div className="grid grid-cols-[1fr_80px_80px_50px] gap-2 text-xs font-semibold text-muted-foreground px-2">
          <span>CID Sugerido</span>
          <span className="text-center">Correto?</span>
          <span className="text-center">Incorreto?</span>
          <span className="text-center">Ideal</span>
        </div>
        {cids.map((cid, idx) => (
          <div key={idx} className="grid grid-cols-[1fr_80px_80px_50px] gap-2 items-center px-2 py-2 rounded bg-muted/50">
            <div>
              <span className="font-mono text-sm font-semibold">{cid.code}</span>
              <span className="text-xs text-muted-foreground ml-2">{cid.description}</span>
            </div>
            <div className="flex justify-center">
              <button
                className={`segment-btn text-xs py-1 px-3 ${cid.correct === true ? "segment-btn-yes" : ""}`}
                onClick={() => !disabled && onToggle(idx, true)}
                disabled={disabled}
              >
                Sim
              </button>
            </div>
            <div className="flex justify-center">
              <button
                className={`segment-btn text-xs py-1 px-3 ${cid.correct === false ? "segment-btn-no" : ""}`}
                onClick={() => !disabled && onToggle(idx, false)}
                disabled={disabled}
              >
                Não
              </button>
            </div>
            <div className="flex justify-center">
              <input
                type="radio"
                name="best-cid"
                checked={selectedBest === idx}
                onChange={() => !disabled && onSelectBest(idx)}
                disabled={disabled}
                className="h-4 w-4 accent-primary"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Manual CID */}
      <div>
        <Label className="text-sm font-medium">CID Ideal (manual)</Label>
        <Input
          className="mt-1 font-mono text-sm"
          placeholder="Ex: G43.0 – Migrânea sem aura"
          value={manualCID}
          onChange={(e) => onManualCIDChange(e.target.value)}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
