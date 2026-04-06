import { useMemo, useState, useCallback } from 'react';
import { 
  Participante, 
  DashboardKPIs, 
  FiltrosState, 
  RegistroFrequencia, 
  EngajamentoNivel, 
  UnidadeStats, 
  TurmaStats, 
  ModuloStats 
} from '../types';

export const usePdlData = (rawData: RegistroFrequencia[]) => {
  const [motivosAbsencia, setMotivosAbsencia] = useState<Record<string, string>>(() => {
    try {
      const stored = localStorage.getItem('motivosAbsencia');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const calculateEngajamento = (taxaPresenca: number): EngajamentoNivel => {
    if (taxaPresenca >= 76) return "Excelente";
    if (taxaPresenca >= 51) return "Bom";
    if (taxaPresenca >= 26) return "Regular";
    return "Crítico";
  };

  const participantes = useMemo<Participante[]>(() => {
    if (!rawData || rawData.length === 0) return [];

    const grouped: Record<string, RegistroFrequencia[]> = {};
    
    rawData.forEach(registro => {
      const key = `${registro.matricula}-${registro.nome}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(registro);
    });

    return Object.values(grouped).map((registros) => {
      const totalRegistros = registros.length;
      const presentes = registros.filter(r => r.presenca === "Presente").length;
      const taxaPresenca = totalRegistros > 0 ? (presentes / totalRegistros) * 100 : 0;

      return {
        id: registros[0].matricula,
        matricula: registros[0].matricula,
        nome: registros[0].nome,
        nomeFilial: registros[0].nomeFilial,
        turmaPDL: registros[0].turmaPDL,
        centroDeCusto: registros[0].centroDeCusto,
        registros,
        taxaPresenca: Math.round(taxaPresenca),
        engajamento: calculateEngajamento(taxaPresenca),
        ranking: 0,
        rankingPorTurma: 0,
        rankingPorUnidade: 0,
      };
    }).sort((a, b) => {
      if (b.taxaPresenca !== a.taxaPresenca) {
        return b.taxaPresenca - a.taxaPresenca;
      }
      return a.nome.localeCompare(b.nome, 'pt-BR');
    }).map((p, index) => ({ ...p, ranking: index + 1 }));
  }, [rawData]);

  const applyFilters = useCallback((filtros: FiltrosState): Participante[] => {
    let filtered = [...participantes];

    if (filtros.turmas.length > 0) {
      filtered = filtered.filter(p => filtros.turmas.includes(p.turmaPDL));
    }

    if (filtros.unidades.length > 0) {
      filtered = filtered.filter(p => filtros.unidades.includes(p.nomeFilial));
    }

    if (filtros.centrosDeCusto.length > 0) {
      filtered = filtered.filter(p => filtros.centrosDeCusto.includes(p.centroDeCusto));
    }

    if (filtros.statusEngajamento.length > 0) {
      filtered = filtered.filter(p => filtros.statusEngajamento.includes(p.engajamento));
    }

    return filtered;
  }, [participantes]);

  const calculateKPIs = useCallback((filtrados: Participante[]): DashboardKPIs => {
    const totalGestores = filtrados.length;
    
    const totalRegistros = filtrados.reduce((acc, p) => acc + p.registros.length, 0);
    const totalPresentes = filtrados.reduce((acc, p) => 
      acc + p.registros.filter(r => r.presenca === "Presente").length, 0);
    const taxaMediaPresenca = totalRegistros > 0 ? Math.round((totalPresentes / totalRegistros) * 100) : 0;
    
    const gestoresComRegistro = filtrados.filter(p => p.registros.length > 0).length;
    const coberturaPrograma = totalGestores > 0 ? Math.round((gestoresComRegistro / totalGestores) * 100) : 0;
    
    const gestoresZonaCritica = filtrados.filter(p => p.engajamento === "Crítico").length;

    // Presença por Unidade
    const unidadesMap: Record<string, UnidadeStats> = {};
    filtrados.forEach(p => {
      if (!unidadesMap[p.nomeFilial]) {
        unidadesMap[p.nomeFilial] = {
          nome: p.nomeFilial,
          totalParticipantes: 0,
          presentes: 0,
          ausentes: 0,
          naoRegistrados: 0,
          taxaPresenca: 0,
          centrosDeCusto: [],
        };
      }
      unidadesMap[p.nomeFilial].totalParticipantes++;
      
      const presentes = p.registros.filter(r => r.presenca === "Presente").length;
      const ausentes = p.registros.filter(r => r.presenca === "Ausente").length;
      const naoRegistrados = p.registros.filter(r => r.presenca === "Não registrado").length;
      
      unidadesMap[p.nomeFilial].presentes += presentes;
      unidadesMap[p.nomeFilial].ausentes += ausentes;
      unidadesMap[p.nomeFilial].naoRegistrados += naoRegistrados;
    });

    const presencaPorUnidade = Object.values(unidadesMap).map(u => {
      const total = u.presentes + u.ausentes + u.naoRegistrados;
      return {
        ...u,
        taxaPresenca: total > 0 ? Math.round((u.presentes / total) * 100) : 0,
      };
    }).sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));

    // Presença por Turma
    const turmasMap: Record<string, TurmaStats> = {};
    filtrados.forEach(p => {
      if (!turmasMap[p.turmaPDL]) {
        turmasMap[p.turmaPDL] = {
          nome: p.turmaPDL,
          totalParticipantes: 0,
          presentes: 0,
          ausentes: 0,
          naoRegistrados: 0,
          taxaPresenca: 0,
        };
      }
      turmasMap[p.turmaPDL].totalParticipantes++;
      turmasMap[p.turmaPDL].presentes += p.registros.filter(r => r.presenca === "Presente").length;
      turmasMap[p.turmaPDL].ausentes += p.registros.filter(r => r.presenca === "Ausente").length;
      turmasMap[p.turmaPDL].naoRegistrados += p.registros.filter(r => r.presenca === "Não registrado").length;
    });

    const presencaPorTurma = Object.values(turmasMap).map(t => {
      const total = t.presentes + t.ausentes + t.naoRegistrados;
      return {
        ...t,
        taxaPresenca: total > 0 ? Math.round((t.presentes / total) * 100) : 0,
      };
    }).sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));

    // Presença por Módulo
    const modulosMap: Record<string, ModuloStats> = {};
    filtrados.forEach(p => {
      p.registros.forEach(r => {
        if (!modulosMap[r.modulo]) {
          modulosMap[r.modulo] = {
            modulo: r.modulo,
            presentes: 0,
            ausentes: 0,
            naoRegistrados: 0,
            total: 0,
            taxaPresenca: 0,
          };
        }
        modulosMap[r.modulo].total++;
        if (r.presenca === "Presente") modulosMap[r.modulo].presentes++;
        if (r.presenca === "Ausente") modulosMap[r.modulo].ausentes++;
        if (r.presenca === "Não registrado") modulosMap[r.modulo].naoRegistrados++;
      });
    });

    const presencaPorModulo = Object.values(modulosMap)
      .map(m => ({
        ...m,
        taxaPresenca: m.total > 0 ? Math.round((m.presentes / m.total) * 100) : 0,
      }))
      .sort((a, b) => a.modulo.localeCompare(b.modulo, 'pt-BR'));

    // Distribuição de Engajamento
    const engajamentoCount = { Crítico: 0, Regular: 0, Bom: 0, Excelente: 0 };
    filtrados.forEach(p => {
      engajamentoCount[p.engajamento]++;
    });

    const distribuicaoEngajamento = Object.entries(engajamentoCount).map(([nivel, quantidade]) => ({
      nivel: nivel as EngajamentoNivel,
      quantidade,
      percentual: totalGestores > 0 ? Math.round((quantidade / totalGestores) * 100) : 0,
    }));

    // Top 5 e Bottom 5
    const top5Gestores = filtrados.slice(0, 5);
    const bottom5Gestores = [...filtrados].reverse().slice(0, 5).reverse();

    return {
      totalGestores,
      taxaMediaPresenca,
      coberturaPrograma,
      gestoresZonaCritica,
      presencaPorUnidade,
      presencaPorTurma,
      presencaPorModulo,
      distribuicaoEngajamento,
      top5Gestores,
      bottom5Gestores,
    };
  }, []);

  const getFilterOptions = useCallback(() => ({
    turmas: [...new Set(participantes.map(p => p.turmaPDL))].sort(),
    unidades: [...new Set(participantes.map(p => p.nomeFilial))].sort(),
    centrosDeCusto: [...new Set(participantes.map(p => p.centroDeCusto))].sort(),
  }), [participantes]);

  const saveMotivoAbsencia = useCallback((registroId: string, motivo: string) => {
    const updated = { ...motivosAbsencia, [registroId]: motivo };
    setMotivosAbsencia(updated);
    localStorage.setItem('motivosAbsencia', JSON.stringify(updated));
  }, [motivosAbsencia]);

  const getMotivoAbsencia = useCallback((registroId: string) => motivosAbsencia[registroId] || null, [motivosAbsencia]);

  return {
    participantes,
    applyFilters,
    calculateKPIs,
    getFilterOptions,
    saveMotivoAbsencia,
    getMotivoAbsencia,
  };
};

export default usePdlData;
