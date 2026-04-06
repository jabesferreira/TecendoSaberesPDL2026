import { useState } from 'react';
import { Popover } from '@shadcn/ui';
import { Checkbox } from '@shadcn/ui';

const Filters = ({ filterState, onFilterChange }) => {
  const [turma, setTurma] = useState(filterState.turma || []);
  const [unidade, setUnidade] = useState(filterState.unidade || []);
  const [centroDeCusto, setCentroDeCusto] = useState(filterState.centroDeCusto || []);
  const [statusEngajamento, setStatusEngajamento] = useState(filterState.statusEngajamento || []);

  const handleChange = (setter) => (value) => {
    setter((prev) => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
  };

  const applyFilters = () => {
    onFilterChange({ turma, unidade, centroDeCusto, statusEngajamento });
  };

  const resetFilters = () => {
    setTurma([]);
    setUnidade([]);
    setCentroDeCusto([]);
    setStatusEngajamento([]);
    onFilterChange({ turma: [], unidade: [], centroDeCusto: [], statusEngajamento: [] });
  };

  const activeFiltersCount = [turma, unidade, centroDeCusto, statusEngajamento].flat().length;

  return (
    <Popover>
      <div className="flex flex-col space-y-4 p-4">
        <div>
          <h4>Turma</h4>
          {['Turma 1', 'Turma 2', 'Turma 3'].map(t => (
            <Checkbox key={t} checked={turma.includes(t)} onChange={() => handleChange(setTurma)(t)}>{t}</Checkbox>
          ))}
        </div>
        <div>
          <h4>Unidade</h4>
          {['Unidade A', 'Unidade B', 'Unidade C'].map(u => (
            <Checkbox key={u} checked={unidade.includes(u)} onChange={() => handleChange(setUnidade)(u)}>{u}</Checkbox>
          ))}
        </div>
        <div>
          <h4>Centro de Custo</h4>
          {['Centro 1', 'Centro 2', 'Centro 3'].map(c => (
            <Checkbox key={c} checked={centroDeCusto.includes(c)} onChange={() => handleChange(setCentroDeCusto)(c)}>{c}</Checkbox>
          ))}
        </div>
        <div>
          <h4>Status Engajamento</h4>
          {['Crítico', 'Regular', 'Bom', 'Excelente'].map(s => (
            <Checkbox key={s} checked={statusEngajamento.includes(s)} onChange={() => handleChange(setStatusEngajamento)(s)}>{s}</Checkbox>
          ))}
        </div>
        <div>
          <div className="flex justify-between items-center">
            <button onClick={resetFilters} className="btn btn-reset">Reset</button>
            <button onClick={applyFilters} className="btn btn-apply">Apply</button>
          </div>
          <p>Active Filters: {activeFiltersCount}</p>
        </div>
      </div>
    </Popover>
  );
};

export default Filters;