import { Autocomplete, Container, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import api from '@/libs/data';

export default function HomePage() {
  const [alerts, setAlerts] = useState<UserAlert[]>([]);
  const [stocks, setStock] = useState<Asset[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [stockData, alertData] = await Promise.all([
        api.stocks.listAssets(),
        api.stocks.listAlerts(),
      ]);
      setStock(stockData.assets);
      setAlerts(alertData.alerts);
    };
    fetchData();
  }, []);

  return (
    <Container>
      <Typography variant="h1">Your stocks</Typography>
      {alerts.map((alert) => (
        <div key={alert.id}>
          <Typography variant="h2">{alert.symbol}</Typography>
          <Typography variant="h3">{alert.price}</Typography>
        </div>
      ))}
      <Typography variant="button">Create Alert</Typography>
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={stocks}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Stock Symbol" />}
      />
    </Container>
  );
}
