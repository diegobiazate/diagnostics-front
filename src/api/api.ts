import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3030/api',
});

// Mapeamento de tipos de diagnóstico para rotas
export const diagnosticRoutes = {
  ping: '/ping',
  traceroute: '/traceroute',
  nslookup: '/nslookup',
  'http-check': '/http-check',
};

export const executeDiagnostic = async (type: keyof typeof diagnosticRoutes, data: any) => {
  try {
    const route = diagnosticRoutes[type];
    if (!route) {
      throw new Error(`Unsupported diagnostic type: ${type}`);
    }

    const response = await api.post('/diagnostics' + route, data);
    return response.data;
  } catch (error) {
    console.error(`Error executing ${type}:`, error);
    throw error;
  }
};


// Criar diagnóstico
export const createDiagnostic = async (data: {
  target: string;
  type: string;
  interval: number;
}) => {
  try{
    const response = await api.post('/diagnostics/ping', data);
    return response.data;
  }catch(error: any){
    console.log(error)
  }
};

// Listar diagnósticos
export const fetchDiagnostics = async () => {
  try{
    const response = await api.get('/diagnostics/');
    return response.data;
  }catch(error: any){
    console.log(error)
  }
};

// Obter resultados
export const fetchResults = async (id: string) => {
  try{
    const response = await api.get(`/diagnostics/${id}/results`);
    return response.data;
  }catch(error: any){
    console.log(error)
  }
};
