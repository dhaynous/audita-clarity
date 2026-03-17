import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const hallucinationTypes = [
  "Conduta",
  "Dados Pessoais",
  "Diagnóstico",
  "Histórico Médico",
  "Sem Impacto",
  "Temporal",
  "Sem Dados",
];

interface HallucinationBlockProps {
  hasHallucination: boolean | null;
  onHasChange: (v: boolean) => void;
  selectedTypes: string[];
  onTypesChange: (types: string[]) => void;
  disabled?: boolean;
}

export default function HallucinationBlock({
  hasHallucination,
  onHasChange,
  selectedTypes,
  onTypesChange,
  disabled,
}: HallucinationBlockProps) {
  const toggleType = (type: string) => {
    if (selectedTypes.includes(type)) {
      onTypesChange(selectedTypes.filter((t) => t !== type));
    } else {
      onTypesChange([...selectedTypes, type]);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h4 className="text-sm font-semibold mb-3">Análise de Alucinações da IA</h4>
      <p className="text-sm text-muted-foreground mb-3">Houve alucinação no output da IA?</p>

      <div className="flex gap-2 mb-4">
        <button
          className={`segment-btn ${hasHallucination === true ? "segment-btn-no" : "hover:bg-muted"}`}
          onClick={() => !disabled && onHasChange(true)}
          disabled={disabled}
        >
          ⚠ Sim
        </button>
        <button
          className={`segment-btn ${hasHallucination === false ? "segment-btn-yes" : "hover:bg-muted"}`}
          onClick={() => !disabled && onHasChange(false)}
          disabled={disabled}
        >
          ✓ Não
        </button>
      </div>

      {hasHallucination === true && (
        <div>
          <p className="text-sm font-medium mb-2">Tipo(s) de alucinação identificada:</p>
          <div className="grid grid-cols-2 gap-2">
            {hallucinationTypes.map((type) => (
              <label
                key={type}
                className={`flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer transition-colors text-sm ${
                  selectedTypes.includes(type)
                    ? "border-danger bg-danger/10 text-foreground"
                    : "border-border hover:bg-muted"
                }`}
              >
                <Checkbox
                  checked={selectedTypes.includes(type)}
                  onCheckedChange={() => !disabled && toggleType(type)}
                  disabled={disabled}
                />
                {type}
              </label>
            ))}
          </div>
        </div>
      )}

      {hasHallucination === false && (
        <p className="text-xs text-success italic">Output da IA considerado sem alucinação.</p>
      )}
    </div>
  );
}
