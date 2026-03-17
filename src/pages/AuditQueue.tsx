import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Search, Filter, Clock, User, Stethoscope, Building2, CalendarDays, ArrowRight,
} from "lucide-react";

type AuditStatus = "pendente" | "em_analise" | "em_revisao" | "finalizada" | "nao_auditavel";
type TipoAtendimento = "telemedicina_eletivo" | "telemedicina_pa" | "presencial_eletivo" | "presencial_pa";

interface Consulta {
  id: string;
  carteirinha: string;
  paciente: string;
  tipo: TipoAtendimento;
  especialidade: string;
  medico: string;
  unidade: string | null;
  regional: string;
  data: string;
  horario: string;
  duracao: string;
  status: AuditStatus;
}

const MOCK_DATA: Consulta[] = [
  { id: "ATD-2026-00142", carteirinha: "0087456321", paciente: "Maria Silva Santos", tipo: "telemedicina_eletivo", especialidade: "Clínica Geral", medico: "Dr. João Almeida", unidade: null, data: "2026-03-15", horario: "08:30", duracao: "00:18:42", status: "pendente" },
  { id: "ATD-2026-00143", carteirinha: "0091234567", paciente: "Carlos Eduardo Lima", tipo: "presencial_pa", especialidade: "Ortopedia", medico: "Dra. Ana Beatriz", unidade: "Hospital São Lucas", data: "2026-03-15", horario: "09:15", duracao: "00:12:05", status: "pendente" },
  { id: "ATD-2026-00144", carteirinha: "0076543210", paciente: "Fernanda Costa Oliveira", tipo: "telemedicina_pa", especialidade: "Pediatria", medico: "Dr. Ricardo Mendes", unidade: null, data: "2026-03-15", horario: "10:00", duracao: "00:22:30", status: "pendente" },
  { id: "ATD-2026-00145", carteirinha: "0065432198", paciente: "José Roberto Pereira", tipo: "presencial_eletivo", especialidade: "Cardiologia", medico: "Dra. Mariana Souza", unidade: "Hospital Central", data: "2026-03-14", horario: "14:00", duracao: "00:25:10", status: "pendente" },
  { id: "ATD-2026-00146", carteirinha: "0054321987", paciente: "Ana Paula Rodrigues", tipo: "telemedicina_eletivo", especialidade: "Dermatologia", medico: "Dr. Felipe Castro", unidade: null, data: "2026-03-14", horario: "15:30", duracao: "00:15:45", status: "pendente" },
  { id: "ATD-2026-00147", carteirinha: "0043219876", paciente: "Lucas Gabriel Ferreira", tipo: "presencial_pa", especialidade: "Neurologia", medico: "Dra. Camila Torres", unidade: "Hospital São Lucas", data: "2026-03-14", horario: "16:45", duracao: "00:20:00", status: "pendente" },
  { id: "ATD-2026-00130", carteirinha: "0098765432", paciente: "Patricia Mendes Alves", tipo: "telemedicina_eletivo", especialidade: "Psiquiatria", medico: "Dr. Bruno Lima", unidade: null, data: "2026-03-13", horario: "08:00", duracao: "00:30:15", status: "em_analise" },
  { id: "ATD-2026-00131", carteirinha: "0087654321", paciente: "Roberto Carlos Silva", tipo: "presencial_pa", especialidade: "Clínica Geral", medico: "Dra. Julia Santos", unidade: "UPA Centro", data: "2026-03-13", horario: "11:20", duracao: "00:14:50", status: "em_revisao" },
  { id: "ATD-2026-00120", carteirinha: "0076543219", paciente: "Mariana Dias Costa", tipo: "telemedicina_pa", especialidade: "Endocrinologia", medico: "Dr. André Oliveira", unidade: null, data: "2026-03-12", horario: "09:45", duracao: "00:19:30", status: "finalizada" },
  { id: "ATD-2026-00121", carteirinha: "0065432187", paciente: "Eduardo Nunes Pinto", tipo: "presencial_eletivo", especialidade: "Ortopedia", medico: "Dra. Renata Farias", unidade: "Hospital Central", data: "2026-03-12", horario: "13:00", duracao: "00:16:20", status: "finalizada" },
  { id: "ATD-2026-00110", carteirinha: "0054321876", paciente: "Juliana Martins Ramos", tipo: "telemedicina_eletivo", especialidade: "Ginecologia", medico: "Dr. Marcos Vieira", unidade: null, data: "2026-03-11", horario: "10:30", duracao: "00:21:00", status: "nao_auditavel" },
];

const TIPO_LABELS: Record<TipoAtendimento, string> = {
  telemedicina_eletivo: "Telemed – Eletivo",
  telemedicina_pa: "Telemed – PA",
  presencial_eletivo: "Presencial – Eletivo",
  presencial_pa: "Presencial – PA",
};

const STATUS_LABELS: Record<AuditStatus, string> = {
  pendente: "Pendente",
  em_analise: "Em Análise",
  em_revisao: "Em Revisão",
  finalizada: "Finalizada",
  nao_auditavel: "Não Auditável",
};

const STATUS_COLORS: Record<AuditStatus, string> = {
  pendente: "bg-[hsl(var(--status-pending))] text-[hsl(var(--warning-foreground))]",
  em_analise: "bg-[hsl(var(--status-analyzing))] text-[hsl(var(--primary-foreground))]",
  em_revisao: "bg-[hsl(var(--status-review))] text-white",
  finalizada: "bg-[hsl(var(--status-done))] text-[hsl(var(--success-foreground))]",
  nao_auditavel: "bg-[hsl(var(--status-not-auditable))] text-[hsl(var(--danger-foreground))]",
};

export default function AuditQueue() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [tipoFilter, setTipoFilter] = useState<string>("todos");
  const [especialidadeFilter, setEspecialidadeFilter] = useState<string>("todas");

  const especialidades = useMemo(
    () => [...new Set(MOCK_DATA.map((c) => c.especialidade))].sort(),
    []
  );

  const filterConsultas = (statusList: AuditStatus[]) => {
    return MOCK_DATA.filter((c) => {
      if (!statusList.includes(c.status)) return false;
      if (tipoFilter !== "todos" && c.tipo !== tipoFilter) return false;
      if (especialidadeFilter !== "todas" && c.especialidade !== especialidadeFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          c.id.toLowerCase().includes(q) ||
          c.paciente.toLowerCase().includes(q) ||
          c.carteirinha.includes(q)
        );
      }
      return true;
    });
  };

  const pendentes = filterConsultas(["pendente"]);
  const outros = filterConsultas(["em_analise", "em_revisao", "finalizada", "nao_auditavel"]);

  const handleSelect = (id: string) => {
    navigate(`/auditoria/${id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="border-b bg-card px-6 py-4">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">
              Fila de Auditoria Médica
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Selecione um atendimento para iniciar a auditoria
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-md">
              <Clock className="h-3.5 w-3.5" />
              <span className="font-medium">{pendentes.length}</span>
              <span>pendentes</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1800px] mx-auto p-6 space-y-4">
        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Filter className="h-4 w-4" />
                Filtros
              </div>
              <div className="relative flex-1 min-w-[220px] max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por ID, paciente ou carteirinha..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
              <Select value={tipoFilter} onValueChange={setTipoFilter}>
                <SelectTrigger className="w-[200px] h-9">
                  <SelectValue placeholder="Tipo de atendimento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os tipos</SelectItem>
                  <SelectItem value="telemedicina_eletivo">Telemed – Eletivo</SelectItem>
                  <SelectItem value="telemedicina_pa">Telemed – PA</SelectItem>
                  <SelectItem value="presencial_eletivo">Presencial – Eletivo</SelectItem>
                  <SelectItem value="presencial_pa">Presencial – PA</SelectItem>
                </SelectContent>
              </Select>
              <Select value={especialidadeFilter} onValueChange={setEspecialidadeFilter}>
                <SelectTrigger className="w-[200px] h-9">
                  <SelectValue placeholder="Especialidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas especialidades</SelectItem>
                  {especialidades.map((e) => (
                    <SelectItem key={e} value={e}>{e}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="pendentes">
          <TabsList className="bg-muted">
            <TabsTrigger value="pendentes" className="gap-1.5">
              Pendentes
              <Badge variant="secondary" className="ml-1 text-xs h-5 px-1.5 rounded-full">
                {pendentes.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="outros" className="gap-1.5">
              Em andamento / Finalizadas
              <Badge variant="secondary" className="ml-1 text-xs h-5 px-1.5 rounded-full">
                {outros.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pendentes">
            <ConsultaTable consultas={pendentes} onSelect={handleSelect} showAction />
          </TabsContent>

          <TabsContent value="outros">
            <ConsultaTable consultas={outros} onSelect={handleSelect} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ConsultaTable({
  consultas,
  onSelect,
  showAction = false,
}: {
  consultas: Consulta[];
  onSelect: (id: string) => void;
  showAction?: boolean;
}) {
  if (consultas.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center text-muted-foreground">
          Nenhum atendimento encontrado com os filtros selecionados.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[140px]">ID</TableHead>
              <TableHead>Paciente</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Especialidade</TableHead>
              <TableHead>Médico</TableHead>
              <TableHead>Unidade</TableHead>
              <TableHead>Data / Hora</TableHead>
              <TableHead>Duração</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {consultas.map((c) => (
              <TableRow
                key={c.id}
                className="cursor-pointer group"
                onClick={() => onSelect(c.id)}
              >
                <TableCell className="font-mono text-xs font-semibold text-primary">
                  {c.id}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <div>
                      <div className="font-medium text-sm">{c.paciente}</div>
                      <div className="text-xs text-muted-foreground">{c.carteirinha}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs font-normal whitespace-nowrap">
                    {TIPO_LABELS[c.tipo]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-sm">
                    <Stethoscope className="h-3.5 w-3.5 text-muted-foreground" />
                    {c.especialidade}
                  </div>
                </TableCell>
                <TableCell className="text-sm">{c.medico}</TableCell>
                <TableCell className="text-sm">
                  {c.unidade ? (
                    <div className="flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                      {c.unidade}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-sm">
                    <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                    <div>
                      <div>{new Date(c.data + "T12:00:00").toLocaleDateString("pt-BR")}</div>
                      <div className="text-xs text-muted-foreground">{c.horario}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-sm">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    {c.duracao}
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_COLORS[c.status]}`}>
                    {STATUS_LABELS[c.status]}
                  </span>
                </TableCell>
                <TableCell>
                  {showAction ? (
                    <Button size="sm" variant="default" className="h-7 text-xs gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Auditar
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  ) : (
                    <Button size="sm" variant="ghost" className="h-7 text-xs gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Abrir
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
