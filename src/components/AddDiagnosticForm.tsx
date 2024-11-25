import React, { useState } from 'react';
import { executeDiagnostic } from '../api/api'; 

export type DiagnosticRequest =
  | { type: 'ping' | 'traceroute' | 'http-check'; target: string }
  | { type: 'nslookup'; target: string; dnsServers: string[] };


const DiagnosticTool: React.FC = () => {
  const [type, setType] = useState<'ping' | 'traceroute' | 'nslookup' | 'http-check'>('ping'); // Tipo de diagnóstico
  const [target, setTarget] = useState(''); // Alvo
  const [dnsServers, setDnsServers] = useState(''); // DNS servers para nslookup
  const [result, setResult] = useState<any>(null); // Resultado do diagnóstico
  const [error, setError] = useState<string | null>(null); // Erro

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    try {
      let data: DiagnosticRequest;

      if (type === 'nslookup') {
        data = {
          type,
          target,
          dnsServers: dnsServers.split(',').map((dns) => dns.trim()), // Transforma em array
        };
      } else {
        data = { type, target };
      }

      const diagnosticResult = await executeDiagnostic(type, data);
      setResult(diagnosticResult);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }
  };

  return (
    <div>
      <h1>Diagnostic Tool</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Type:</label>
          <select value={type} onChange={(e) => setType(e.target.value as typeof type)}>
            <option value="ping">Ping</option>
            <option value="traceroute">Traceroute</option>
            <option value="nslookup">NSLookup</option>
            <option value="http-check">HTTP Check</option>
          </select>
        </div>
        <div>
          <label>Target:</label>
          <input
            type="text"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            required
          />
        </div>
        {type === 'nslookup' && (
          <div>
            <label>DNS Servers (comma-separated):</label>
            <input
              type="text"
              value={dnsServers}
              onChange={(e) => setDnsServers(e.target.value)}
            />
          </div>
        )}
        <button type="submit">Run Diagnostic</button>
      </form>

      {result && (
        <div>
          <h2>Result</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}

      {error && (
        <div>
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default DiagnosticTool;
