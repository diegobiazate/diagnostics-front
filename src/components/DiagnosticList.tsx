import React, { useEffect, useState } from 'react';
import { fetchDiagnostics, fetchResults } from '../api/api';

interface Diagnostic {
  id: string;
  target: string;
  type: string;
  interval: number;
}

const DiagnosticList: React.FC = () => {
  const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([]);
  const [selectedResults, setSelectedResults] = useState<any[]>([]);

  useEffect(() => {
    const loadDiagnostics = async () => {
      const data = await fetchDiagnostics();
      setDiagnostics(data);
    };
    loadDiagnostics();
  }, []);

  const handleViewResults = async (id: string) => {
    const results = await fetchResults(id);
    setSelectedResults(results);
  };

  return (
    <div>
      <h2>Diagnostics</h2>
      <ul>
        {diagnostics?.map((diag) => (
          <li key={diag.id}>
            {diag.target} ({diag.type})
            <button onClick={() => handleViewResults(diag.id)}>View Results</button>
          </li>
        ))}
      </ul>
      <div>
        <h3>Results</h3>
        <pre>{JSON.stringify(selectedResults, null, 2)}</pre>
      </div>
    </div>
  );
};

export default DiagnosticList;
