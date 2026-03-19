import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Search, Filter, CalendarDays, ChevronDown, ChevronUp, X,
} from "lucide-react";

export interface AuditFiltersState {
  search: string;
  tipoFilter: string;
  especialidadeFilter: string;
  unidadeFilter: string;
  statusFilter: string;
  setorFilter: string;
  medicoFilter: string;
  dataInicio: Date | undefined;
  dataFim: Date | undefined;
  protocoloFilter: string;
}

interface AuditFiltersProps {
  filters: AuditFiltersState;
  onFiltersChange: (filters: AuditFiltersState) => void;
  especialidades: string[];
  unidades: string[];
  setores: string[];
  medicos: string[];
  statusLabels: Record<string, string>;
}

export const initialFilters: AuditFiltersState = {
  search: "",
  tipoFilter: "todos",
  especialidadeFilter: "todas",
  unidadeFilter: "todas",
  statusFilter: "todos",
  setorFilter: "todos",
  medicoFilter: "todos",
  dataInicio: undefined,
  dataFim: undefined,
  protocoloFilter: "todos",
};

export default function AuditFilters({
  filters, onFiltersChange, especialidades, unidades, setores, medicos, statusLabels,
}: AuditFiltersProps) {
  const [expanded, setExpanded] = useState(false);

  const update = (partial: Partial<AuditFiltersState>) =>
    onFiltersChange({ ...filters, ...partial });

  const hasActiveFilters = Object.entries(filters).some(([key, val]) => {
    if (key === "search") return !!val;
    if (key === "dataInicio" || key === "dataFim") return !!val;
    return val !== "todos" && val !== "todas";
  });

  const clearFilters = () => onFiltersChange(initialFilters);

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        {/* Row 1 — always visible */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Filter className="h-4 w-4" />
            Filtros
          </div>
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="ID, nº consulta, carteirinha ou paciente..."
              value={filters.search}
              onChange={(e) => update({ search: e.target.value })}
              className="pl-9 h-9"
            />
          </div>
          <Select value={filters.tipoFilter} onValueChange={(v) => update({ tipoFilter: v })}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Tipo Atendimento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Tipo Atendimento</SelectItem>
              <SelectItem value="telemedicina_eletivo">Telemed – Eletivo</SelectItem>
              <SelectItem value="telemedicina_pa">Telemed – PA</SelectItem>
              <SelectItem value="presencial_eletivo">Presencial – Eletivo</SelectItem>
              <SelectItem value="presencial_pa">Presencial – PA</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.especialidadeFilter} onValueChange={(v) => update({ especialidadeFilter: v })}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Especialidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas especialidades</SelectItem>
              {especialidades.map((e) => (
                <SelectItem key={e} value={e}>{e}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filters.statusFilter} onValueChange={(v) => update({ statusFilter: v })}>
            <SelectTrigger className="w-[160px] h-9">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              {Object.entries(statusLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="sm"
            className="h-9 gap-1 text-xs text-muted-foreground"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            {expanded ? "Menos filtros" : "Mais filtros"}
          </Button>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" className="h-9 gap-1 text-xs text-destructive" onClick={clearFilters}>
              <X className="h-3.5 w-3.5" />
              Limpar
            </Button>
          )}
        </div>

        {/* Row 2 — expandable */}
        {expanded && (
          <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-border">
            <Select value={filters.medicoFilter} onValueChange={(v) => update({ medicoFilter: v })}>
              <SelectTrigger className="w-[200px] h-9">
                <SelectValue placeholder="Médico" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os médicos</SelectItem>
                {medicos.map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filters.unidadeFilter} onValueChange={(v) => update({ unidadeFilter: v })}>
              <SelectTrigger className="w-[200px] h-9">
                <SelectValue placeholder="Unidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas unidades</SelectItem>
                {unidades.map((u) => (
                  <SelectItem key={u} value={u}>{u}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filters.setorFilter} onValueChange={(v) => update({ setorFilter: v })}>
              <SelectTrigger className="w-[180px] h-9">
                <SelectValue placeholder="Setor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os setores</SelectItem>
                {setores.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filters.protocoloFilter} onValueChange={(v) => update({ protocoloFilter: v })}>
              <SelectTrigger className="w-[180px] h-9">
                <SelectValue placeholder="Protocolo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos protocolos</SelectItem>
                <SelectItem value="com_protocolo">Com protocolo</SelectItem>
                <SelectItem value="sem_protocolo">Sem protocolo</SelectItem>
              </SelectContent>
            </Select>
            {/* Date range */}
            <div className="flex items-center gap-1.5">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className={cn("h-9 gap-1.5 text-xs font-normal", !filters.dataInicio && "text-muted-foreground")}>
                    <CalendarDays className="h-3.5 w-3.5" />
                    {filters.dataInicio ? format(filters.dataInicio, "dd/MM/yyyy", { locale: ptBR }) : "Data de"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.dataInicio}
                    onSelect={(d) => update({ dataInicio: d })}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
              <span className="text-xs text-muted-foreground">até</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className={cn("h-9 gap-1.5 text-xs font-normal", !filters.dataFim && "text-muted-foreground")}>
                    <CalendarDays className="h-3.5 w-3.5" />
                    {filters.dataFim ? format(filters.dataFim, "dd/MM/yyyy", { locale: ptBR }) : "Data até"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.dataFim}
                    onSelect={(d) => update({ dataFim: d })}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
