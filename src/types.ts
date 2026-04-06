// types.ts

// Interface for Gestor
export interface Gestor {
    id: number;
    nome: string;
    email: string;
    telefone?: string;
}

// Interface for Registro
export interface Registro {
    id: number;
    data: string; // YYYY-MM-DD format
    descricao: string;
    turmaId: number;
}

// Interface for Turma
export interface Turma {
    id: number;
    nome: string;
    gestorId: number;
    registros: Registro[];
}

// Interface for UnidadeStats
export interface UnidadeStats {
    turmaId: number;
    totalRegistros: number;
    dataInicio: string; // YYYY-MM-DD format
    dataFim: string; // YYYY-MM-DD format
}

// Any additional interfaces can be defined here
