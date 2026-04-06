export type PresencaStatus = "Presente" | "Ausente" | "Não registrado" | "Justificado";
export type EngajamentoNivel = "Crítico" | "Regular" | "Bom" | "Excelente";

export interface RegistroFrequencia {
  id: string;
  nomeFilial: string;
  matricula: string;
  nome: string;
  turmaPDL: string;
  centroDeCusto: string;
  modulo: string;
  presenca: PresencaStatus;
  motivo?: string;
  dataRegistro?: string;
}

export interface Participante {
  id: string;
  matricula: string;
  nome: string;
  nomeFilial: string;
  turmaPDL: string;
  centroDeCusto: string;
  registros: RegistroFrequencia[];
  taxaPresenca: number;
  engajamento: EngajamentoNivel;
  ranking: number;
  rankingPorTurma: number;
  rankingPorUnidade: number;
}

export interface CentroCusto {
  nome: string;
  unidade: string;
  presentes: number;
  ausentes: number;
  naoRegistrados: number;
  total: number;
  taxaPresenca: number;
}

export interface UnidadeStats {
  nome: string;
  totalParticipantes: number;
  presentes: number;
  ausentes: number;
  naoRegistrados: number;
  taxaPresenca: number;
  centrosDeCusto: CentroCusto[];
}

export interface TurmaStats {
  nome: string;
  totalParticipantes: number;
  presentes: number;
  ausentes: number;
  naoRegistrados: number;
  taxaPresenca: number;
}

export interface ModuloStats {
  modulo: string;
  presentes: number;
  ausentes: number;
  naoRegistrados: number;
  total: number;
  taxaPresenca: number;
}

export interface EngajamentoDistribution {
  nivel: EngajamentoNivel;
  quantidade: number;
  percentual: number;
}

export interface DashboardKPIs {
  totalGestores: number;
  taxaMediaPresenca: number;
  coberturaPrograma: number;
  gestoresZonaCritica: number;
  presencaPorUnidade: UnidadeStats[];
  presencaPorTurma: TurmaStats[];
  presencaPorModulo: ModuloStats[];
  distribuicaoEngajamento: EngajamentoDistribution[];
  top5Gestores: Participante[];
  bottom5Gestores: Participante[];
}

export interface FiltrosState {
  turmas: string[];
  unidades: string[];
  centrosDeCusto: string[];
  statusEngajamento: EngajamentoNivel[];
}

export interface RegistroMotivo {
  registroId: string;
  participanteId: string;
  motivo: string;
  dataRegistro: string;
}

export interface AdminUser {
  isAdmin: boolean;
  username?: string;
}
