import {
  Autocomplete,
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import api from '@/libs/data';

const allowedIntervals = [
  { label: '1 minute', value: 1 },
  { label: '5 minutes', value: 5 },
  { label: '15 minutes', value: 15 },
  { label: '30 minutes', value: 30 },
  { label: '1 hour', value: 60 },
  { label: '2 hours', value: 120 },
  { label: '6 hours', value: 360 },
  { label: '12 hours', value: 720 },
  { label: '1 day', value: 1440 },
  { label: '2 days', value: 2880 },
  { label: '3 days', value: 4320 },
  { label: '1 week', value: 10080 },
  { label: '2 weeks', value: 20160 },
];

export default function HomePage() {
  const [alerts, setAlerts] = useState<UserAlert[]>([]);
  const [stocks, setStock] = useState<Asset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<object>({});
  const [inferiorTunel, setInferiorTunel] = useState<number>(0);
  const [superiorTunel, setSuperiorTunel] = useState<number>(0);
  const [interval, setInterval] = useState(allowedIntervals[0]);

  const createAlarm = async () => {
    const response = await api.stocks.editCreateAlert(
      selectedAsset.id,
      inferiorTunel,
      superiorTunel,
      interval.value,
    );
  };

  const formattedStock = useMemo(
    () =>
      stocks.map((stock) => ({
        label: stock.symbol,
        id: stock.id,
      })),
    [stocks],
  );

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
      <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
        <Autocomplete
          value={selectedAsset}
          onChange={(_, newValue) => {
            setSelectedAsset(newValue!);
          }}
          clearIcon={null}
          disablePortal
          options={formattedStock}
          sx={{ width: '40%', m: '10px' }}
          renderInput={(params) => (
            <TextField {...params} label="Stock Symbol" />
          )}
        />
        <TextField
          sx={{ width: '40%', m: '10px' }}
          disabled={true}
          value={0}
          id="outlined-basic"
          label="current price"
          variant="standard"
        />

        <TextField
          sx={{ width: '40%', m: '10px' }}
          id="outlined-basic"
          label="Lowest Price"
          variant="outlined"
          value={inferiorTunel}
          onChange={(e) => setInferiorTunel(Number(e.target.value))}
        />
        <TextField
          sx={{ width: '40%', m: '10px' }}
          id="outlined-basic"
          label="Higher Price"
          variant="outlined"
          value={superiorTunel}
          onChange={(e) => setSuperiorTunel(Number(e.target.value))}
        />
        <Autocomplete
          value={interval}
          onChange={(_, newValue) => {
            setInterval(newValue!);
          }}
          clearIcon={null}
          id="combo-box-demo"
          options={allowedIntervals}
          sx={{ width: '65%', m: '10px' }}
          renderInput={(params) => (
            <TextField {...params} label="Checkin interval" />
          )}
        />
        <Button
          onClick={createAlarm}
          disabled={inferiorTunel === 0 && superiorTunel === 0}
          variant="contained"
          sx={{ width: '20%', m: '10px' }}
        >
          Create Alert
        </Button>
      </Box>
    </Container>
  );
}
