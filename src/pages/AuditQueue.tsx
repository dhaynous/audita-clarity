import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Clock, User, Stethoscope, Building2, CalendarDays, ArrowRight, ShieldAlert, Lock, Download,
} from "lucide-react";
import * as XLSX from "xlsx";
import hapvidaLogo from "@/assets/hapvida-logo.png";
import AuditFilters, { type AuditFiltersState, initialFilters } from "@/components/audit/AuditFilters";

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
  setor: string | null;
  regional: string;
  data: string;
  horario: string;
  duracao: string;
  status: AuditStatus;
  protocolo?: string | null;
  motivoRevisao?: string;
  auditor?: string;
  dataAuditoria?: string;
  horarioAuditoria?: string;
}

const MOCK_DATA: Consulta[] = [
  { id: "ATD-2026-00142", carteirinha: "0087456321", paciente: "Maria Silva Santos", tipo: "telemedicina_eletivo", especialidade: "Clínica Geral", medico: "Dr. João Almeida", unidade: null, setor: null, regional: "Fortaleza", data: "2026-03-15", horario: "08:30", duracao: "00:18:42", status: "pendente", protocolo: null },
  { id: "ATD-2026-00143", carteirinha: "0091234567", paciente: "Carlos Eduardo Lima", tipo: "presencial_pa", especialidade: "Ortopedia", medico: "Dra. Ana Beatriz", unidade: "Hospital São Lucas", setor: "Pronto Atendimento", regional: "São Paulo", data: "2026-03-15", horario: "09:15", duracao: "00:12:05", status: "pendente", protocolo: "Protocolo Dor Torácica" },
  { id: "ATD-2026-00144", carteirinha: "0076543210", paciente: "Fernanda Costa Oliveira", tipo: "telemedicina_pa", especialidade: "Pediatria", medico: "Dr. Ricardo Mendes", unidade: null, setor: null, regional: "Recife", data: "2026-03-15", horario: "10:00", duracao: "00:22:30", status: "pendente", protocolo: null },
  { id: "ATD-2026-00145", carteirinha: "0065432198", paciente: "José Roberto Pereira", tipo: "presencial_eletivo", especialidade: "Cardiologia", medico: "Dra. Mariana Souza", unidade: "Hospital Central", setor: "Ambulatório", regional: "Fortaleza", data: "2026-03-14", horario: "14:00", duracao: "00:25:10", status: "pendente", protocolo: null },
  { id: "ATD-2026-00146", carteirinha: "0054321987", paciente: "Ana Paula Rodrigues", tipo: "telemedicina_eletivo", especialidade: "Dermatologia", medico: "Dr. Felipe Castro", unidade: null, setor: null, regional: "Salvador", data: "2026-03-14", horario: "15:30", duracao: "00:15:45", status: "pendente", protocolo: null },
  { id: "ATD-2026-00147", carteirinha: "0043219876", paciente: "Lucas Gabriel Ferreira", tipo: "presencial_pa", especialidade: "Neurologia", medico: "Dra. Camila Torres", unidade: "Hospital São Lucas", setor: "Emergência", regional: "São Paulo", data: "2026-03-14", horario: "16:45", duracao: "00:20:00", status: "pendente", protocolo: "Protocolo AVC" },
  { id: "ATD-2026-00130", carteirinha: "0098765432", paciente: "Patricia Mendes Alves", tipo: "telemedicina_eletivo", especialidade: "Psiquiatria", medico: "Dr. Bruno Lima", unidade: null, setor: null, regional: "Recife", data: "2026-03-13", horario: "08:00", duracao: "00:30:15", status: "em_analise", protocolo: null },
  { id: "ATD-2026-00131", carteirinha: "0087654321", paciente: "Roberto Carlos Silva", tipo: "presencial_pa", especialidade: "Clínica Geral", medico: "Dra. Julia Santos", unidade: "UPA Centro", setor: "Pronto Atendimento", regional: "Fortaleza", data: "2026-03-13", horario: "11:20", duracao: "00:14:50", status: "em_revisao", protocolo: null, motivoRevisao: "Divergência entre áudio e output da IA" },
  { id: "ATD-2026-00120", carteirinha: "0076543219", paciente: "Mariana Dias Costa", tipo: "telemedicina_pa", especialidade: "Endocrinologia", medico: "Dr. André Oliveira", unidade: null, setor: null, regional: "Salvador", data: "2026-03-12", horario: "09:45", duracao: "00:19:30", status: "finalizada", auditor: "Dra. Fernanda Lima", dataAuditoria: "2026-03-13", horarioAuditoria: "10:30", protocolo: null },
  { id: "ATD-2026-00121", carteirinha: "0065432187", paciente: "Eduardo Nunes Pinto", tipo: "presencial_eletivo", especialidade: "Ortopedia", medico: "Dra. Renata Farias", unidade: "Hospital Central", setor: "Centro Cirúrgico", regional: "São Paulo", data: "2026-03-12", horario: "13:00", duracao: "00:16:20", status: "finalizada", auditor: "Dr. Paulo Henrique", dataAuditoria: "2026-03-13", horarioAuditoria: "15:45", protocolo: null },
  { id: "ATD-2026-00110", carteirinha: "0054321876", paciente: "Juliana Martins Ramos", tipo: "telemedicina_eletivo", especialidade: "Ginecologia", medico: "Dr. Marcos Vieira", unidade: null, setor: null, regional: "Fortaleza", data: "2026-03-11", horario: "10:30", duracao: "00:21:00", status: "nao_auditavel", auditor: "Dra. Fernanda Lima", dataAuditoria: "2026-03-12", horarioAuditoria: "09:00", protocolo: null },
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

// Admin users that can see "Em Revisão" tab
const ADMIN_USERS = ["Eduardo", "Aniele", "Luciana"];

// Simulated current user — in production this comes from auth
const CURRENT_USER = "Eduardo";

export default function AuditQueue() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<AuditFiltersState>(initialFilters);

  const isAdmin = ADMIN_USERS.includes(CURRENT_USER);

  const especialidades = useMemo(
    () => [...new Set(MOCK_DATA.map((c) => c.especialidade))].sort(),
    []
  );
  const unidades = useMemo(
    () => [...new Set(MOCK_DATA.map((c) => c.unidade).filter(Boolean) as string[])].sort(),
    []
  );
  const setores = useMemo(
    () => [...new Set(MOCK_DATA.map((c) => c.setor).filter(Boolean) as string[])].sort(),
    []
  );
  const medicos = useMemo(
    () => [...new Set(MOCK_DATA.map((c) => c.medico))].sort(),
    []
  );

  const filterConsultas = (statusList: AuditStatus[]) => {
    return MOCK_DATA.filter((c) => {
      if (!statusList.includes(c.status)) return false;
      if (filters.tipoFilter !== "todos" && c.tipo !== filters.tipoFilter) return false;
      if (filters.especialidadeFilter !== "todas" && c.especialidade !== filters.especialidadeFilter) return false;
      if (filters.unidadeFilter !== "todas" && c.unidade !== filters.unidadeFilter) return false;
      if (filters.setorFilter !== "todos" && c.setor !== filters.setorFilter) return false;
      if (filters.statusFilter !== "todos" && c.status !== filters.statusFilter) return false;
      if (filters.medicoFilter !== "todos" && c.medico !== filters.medicoFilter) return false;
      if (filters.protocoloFilter === "com_protocolo" && !c.protocolo) return false;
      if (filters.protocoloFilter === "sem_protocolo" && c.protocolo) return false;

      // Date range filter
      if (filters.dataInicio) {
        const d = new Date(c.data + "T12:00:00");
        if (d < filters.dataInicio) return false;
      }
      if (filters.dataFim) {
        const d = new Date(c.data + "T12:00:00");
        if (d > filters.dataFim) return false;
      }

      if (filters.search) {
        const q = filters.search.toLowerCase();
        return (
          c.id.toLowerCase().includes(q) ||
          c.paciente.toLowerCase().includes(q) ||
          c.carteirinha.includes(q) ||
          c.medico.toLowerCase().includes(q)
        );
      }
      return true;
    });
  };

  const pendentes = filterConsultas(["pendente", "em_analise"]);
  const emRevisao = filterConsultas(["em_revisao"]);
  const concluidas = filterConsultas(["finalizada", "nao_auditavel"]);

  const handleSelect = (id: string) => {
    navigate(`/auditoria/${id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="border-b bg-primary px-6 py-3">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={hapvidaLogo} alt="Hapvida" className="h-10" />
            <div className="h-8 w-px bg-primary-foreground/20" />
            <div>
              <h1 className="text-lg font-bold text-primary-foreground tracking-tight">
                Auditoria Médica STT
              </h1>
              <p className="text-xs text-primary-foreground/70 mt-0.5">
                Selecione um atendimento para iniciar a auditoria
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm text-primary-foreground/80">
            <div className="flex items-center gap-1.5 bg-primary-foreground/10 px-3 py-1.5 rounded-md">
              <User className="h-3.5 w-3.5" />
              <span className="font-medium">{CURRENT_USER}</span>
              {isAdmin && (
                <Badge variant="outline" className="ml-1 text-[10px] h-4 px-1 border-primary-foreground/30 text-primary-foreground/70">
                  Admin
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1.5 bg-primary-foreground/10 px-3 py-1.5 rounded-md">
              <Clock className="h-3.5 w-3.5" />
              <span className="font-medium">{pendentes.length}</span>
              <span>pendentes</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1800px] mx-auto p-6 space-y-4">
        {/* Filters */}
        <AuditFilters
          filters={filters}
          onFiltersChange={setFilters}
          especialidades={especialidades}
          unidades={unidades}
          setores={setores}
          medicos={medicos}
          statusLabels={STATUS_LABELS}
        />

        {/* Tabs */}
        <Tabs defaultValue="pendentes">
          <TabsList className="bg-muted">
            <TabsTrigger value="pendentes" className="gap-1.5">
              Pendentes
              <Badge variant="secondary" className="ml-1 text-xs h-5 px-1.5 rounded-full">
                {pendentes.length}
              </Badge>
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="em_revisao" className="gap-1.5">
                Em Revisão
                <Badge variant="secondary" className="ml-1 text-xs h-5 px-1.5 rounded-full">
                  {emRevisao.length}
                </Badge>
              </TabsTrigger>
            )}
            <TabsTrigger value="concluidas" className="gap-1.5">
              Concluídas / Não Auditáveis
              <Badge variant="secondary" className="ml-1 text-xs h-5 px-1.5 rounded-full">
                {concluidas.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pendentes">
            <ConsultaTable consultas={pendentes} onSelect={handleSelect} showAction />
          </TabsContent>

          {isAdmin && (
            <TabsContent value="em_revisao">
              <ConsultaTable consultas={emRevisao} onSelect={handleSelect} showAction showMotivo />
            </TabsContent>
          )}

          <TabsContent value="concluidas">
            <ConsultaTable consultas={concluidas} onSelect={handleSelect} showAuditor />
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
  showAuditor = false,
  showMotivo = false,
}: {
  consultas: Consulta[];
  onSelect: (id: string) => void;
  showAction?: boolean;
  showAuditor?: boolean;
  showMotivo?: boolean;
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
              {showMotivo && <TableHead>Motivo Revisão</TableHead>}
              {showAuditor && <TableHead>Auditor</TableHead>}
              {showAuditor && <TableHead>Data Auditoria</TableHead>}
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
                  <Badge className={cn("text-xs font-medium", STATUS_COLORS[c.status])}>
                    {STATUS_LABELS[c.status]}
                  </Badge>
                </TableCell>
                {showMotivo && (
                  <TableCell className="text-sm max-w-[200px]">
                    {c.motivoRevisao ? (
                      <span className="text-xs text-muted-foreground line-clamp-2">{c.motivoRevisao}</span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                )}
                {showAuditor && (
                  <TableCell className="text-sm">
                    {c.auditor ? (
                      <div className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                        {c.auditor}
                      </div>
                    ) : <span className="text-muted-foreground">—</span>}
                  </TableCell>
                )}
                {showAuditor && (
                  <TableCell>
                    {c.dataAuditoria ? (
                      <div className="flex items-center gap-1.5 text-sm">
                        <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                        <div>
                          <div>{new Date(c.dataAuditoria + "T12:00:00").toLocaleDateString("pt-BR")}</div>
                          <div className="text-xs text-muted-foreground">{c.horarioAuditoria}</div>
                        </div>
                      </div>
                    ) : <span className="text-muted-foreground">—</span>}
                  </TableCell>
                )}
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
