import React, { useState } from 'react';
import { Button, TextField, Grid, Box, Typography, Card, CardContent, Snackbar, CircularProgress } from '@mui/material';
import axios from 'axios';

const App: React.FC = () => {
  const [target, setTarget] = useState<string>('');
  const [diagnosticResults, setDiagnosticResults] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Função para fazer o diagnóstico
  const fetchDiagnostic = async (type: string) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await axios.post(`http://localhost:3030/api/diagnostics/${type}`, { target });
      setDiagnosticResults([response.data, ...diagnosticResults]);
      setSuccess(`${type} completed successfully!`);
    } catch (error) {
      setError('An error occurred while fetching the diagnostic.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        Network Diagnostics Tool
      </Typography>
      <TextField
        label="Target"
        variant="outlined"
        fullWidth
        value={target}
        onChange={(e) => setTarget(e.target.value)}
        sx={{ marginBottom: 2 }}
      />

      <Grid container spacing={2} justifyContent="center">
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={() => fetchDiagnostic('ping')}
            disabled={loading || !target}
          >
            {loading ? <CircularProgress size={24} /> : 'Ping'}
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => fetchDiagnostic('traceroute')}
            disabled={loading || !target}
          >
            {loading ? <CircularProgress size={24} /> : 'Traceroute'}
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="success"
            onClick={() => fetchDiagnostic('nslookup')}
            disabled={loading || !target}
          >
            {loading ? <CircularProgress size={24} /> : 'NSLookup'}
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="info"
            onClick={() => fetchDiagnostic('http-check')}
            disabled={loading || !target}
          >
            {loading ? <CircularProgress size={24} /> : 'HTTP Check'}
          </Button>
        </Grid>
      </Grid>

      {success && (
        <Snackbar
          open={Boolean(success)}
          autoHideDuration={6000}
          onClose={() => setSuccess('')}
          message={success}
        />
      )}
      {error && (
        <Snackbar
          open={Boolean(error)}
          autoHideDuration={6000}
          onClose={() => setError('')}
          message={error}
        />
      )}

      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Diagnostic Results
        </Typography>
        {diagnosticResults.length > 0 ? (
          diagnosticResults.map((result, index) => (
            <Card key={index} sx={{ marginBottom: 2 }}>
              <CardContent>
                <Typography variant="h6">{result.type.toUpperCase()}</Typography>
                <Typography variant="body1">
                  <strong>Target:</strong> {result.target}
                </Typography>
                <Typography variant="body1">
                  <strong>Result:</strong> {JSON.stringify(result.result, null, 2)}
                </Typography>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="body1" color="textSecondary">
            No results yet.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default App;
