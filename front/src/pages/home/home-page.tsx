import { Container, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import api from '@/libs/data';

export default function HomePage() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchStocks = async () => {
      const fetchedAlerts = await api.stocks.getAlerts();
      setAlerts(fetchedAlerts);
    };
    fetchStocks();
  }, []);

  return (
    <Container>
      <h1>Home Page</h1>
      <Typography variant="h1">Your stocks</Typography>
    </Container>
  );
}
