import {
  Autocomplete,
  Box,
  Button,
  Container,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';

import { useEffect, useMemo, useRef, useState } from 'react';
import api from '@api';
import useSnackbar from '@/hooks/snack-context';
import { useNavigate } from 'react-router-dom';
import { AlertsTable } from './alerts-table';
import time_svc from '@/libs/time_svc';
import { handleCurrencyInput } from '@/libs/decimal_svc';

const allowedIntervals = [
  { label: '5 minutes', value: 5 * 60 },
  { label: '15 minutes', value: 15 * 60 },
  { label: '30 minutes', value: 30 * 60 },
  { label: '1 hour', value: 60 * 60 },
  { label: '2 hours', value: 120 * 60 },
  { label: '6 hours', value: 360 * 60 },
  { label: '12 hours', value: 720 * 60 },
  { label: '1 day', value: 1440 * 60 },
  { label: '2 days', value: 2880 * 60 },
  { label: '3 days', value: 4320 * 60 },
  { label: '1 week', value: 10080 * 60 },
  { label: '2 weeks', value: 20160 * 60 },
];

type selectedAsset = { label: string; id: number };

export default function HomePage() {
  const [alerts, setAlerts] = useState<UserAlert[]>([]);
  const [stocks, setStock] = useState<Asset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<selectedAsset>(
    {} as selectedAsset,
  );
  const [inferiorTunel, setInferiorTunel] = useState<number>(0.0);
  const [superiorTunel, setSuperiorTunel] = useState<number>(0.0);
  const [interval, setInterval] = useState(allowedIntervals[0]);
  const [lastPrice, setLastPrice] = useState<number>(0.0);
  const lowestPriceRef = useRef<HTMLInputElement | null>(null);
  const snackbar = useSnackbar();
  const navigator = useNavigate();

  const editAlert = (alert: UserAlert) => {
    setSelectedAsset({
      label: alert.asset.symbol,
      id: alert.asset.id,
    });
    setInferiorTunel(alert.inferior_tunel);
    setSuperiorTunel(alert.superior_tunel);
    const AlertInterval = time_svc.duration(alert.interval);
    const totalSeconds = AlertInterval.asSeconds();
    setInterval(allowedIntervals.find((i) => i.value === totalSeconds)!);

    if (lowestPriceRef.current) {
      lowestPriceRef.current.focus();
    }
  };

  const deleteAlert = async (alert: UserAlert) => {
    try {
      await api.stocks.deleteAlert(alert.id);
      snackbar.displayMsg('Alert deleted successfully', 'success');
      fetchData();
    } catch {
      snackbar.displayMsg('Error deleting alert', 'error');
    }
  };

  const createAlert = async () => {
    try {
      await api.stocks.editCreateAlert(
        selectedAsset.id,
        inferiorTunel,
        superiorTunel,
        interval.value,
      );
      snackbar.displayMsg('Alert created successfully', 'success');
      fetchData();
    } catch {
      snackbar.displayMsg('Error creating alert');
    }
  };

  const viewAsset = async (asset: Asset) => {
    navigator(`/asset/${asset.id}`);
  };

  const formattedStock = useMemo(
    () =>
      stocks.map((stock) => ({
        label: stock.symbol,
        id: stock.id,
      })),
    [stocks],
  );

  const fetchData = async () => {
    const [stockData, alertData] = await Promise.all([
      api.stocks.listAssets(),
      api.stocks.listAlerts(),
    ]);
    setStock(stockData.assets);
    setAlerts(alertData.alerts);
    setSelectedAsset({
      label: stockData.assets[0].symbol,
      id: stockData.assets[0].id,
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const getStockPrice = async () => {
      if (!selectedAsset.id) return;

      const stockPrice = await api.stocks.getAsset(
        String(selectedAsset.id),
        time_svc().subtract(1, 'day').format(),
      );
      setLastPrice(stockPrice.records?.[0].price / 100 ?? 0); // centavo to reais
    };
    getStockPrice();
  }, [selectedAsset]);

  return (
    <Container>
      <Typography variant="h2">Your Alerts</Typography>

      <AlertsTable
        alerts={alerts}
        editAlert={editAlert}
        deleteAlert={deleteAlert}
        viewAsset={viewAsset}
      />

      <Box sx={{ m: 3 }} />

      <Typography variant="h2">Create Alert</Typography>

      <EditAlertsForm
        submitButtonText={
          alerts.map((a) => a.asset.id).includes(selectedAsset.id)
            ? 'Edit Alert'
            : 'Create Alert'
        }
        selectedAsset={selectedAsset}
        inferiorTunel={inferiorTunel}
        superiorTunel={superiorTunel}
        lastPrice={lastPrice}
        interval={interval}
        setSelectedAsset={setSelectedAsset}
        setInferiorTunel={setInferiorTunel}
        setSuperiorTunel={setSuperiorTunel}
        setInterval={setInterval}
        createAlarm={createAlert}
        lowestPriceRef={lowestPriceRef}
        formattedStock={formattedStock}
        submitFormDisabled={inferiorTunel === 0 && superiorTunel === 0}
      />
    </Container>
  );
}

function EditAlertsForm({
  submitButtonText,
  selectedAsset,
  inferiorTunel,
  setSelectedAsset,
  setInferiorTunel,
  setSuperiorTunel,
  setInterval,
  createAlarm,
  submitFormDisabled,
  superiorTunel,
  interval,
  lastPrice,
  lowestPriceRef,
  formattedStock,
}: {
  submitButtonText: string;
  selectedAsset: selectedAsset;
  setSelectedAsset: (selectedAsset: selectedAsset) => void;
  inferiorTunel: number;
  setInferiorTunel: (inferiorTunel: number) => void;
  submitFormDisabled: boolean;
  superiorTunel: number;
  setSuperiorTunel: (superiorTunel: number) => void;
  interval: (typeof allowedIntervals)[0];
  setInterval: (interval: (typeof allowedIntervals)[0]) => void;
  lastPrice: number;
  lowestPriceRef: React.MutableRefObject<HTMLInputElement | null>;
  createAlarm: () => void;
  formattedStock: selectedAsset;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
      }}
    >
      <Autocomplete
        value={selectedAsset}
        onChange={(_, newValue) => {
          setSelectedAsset(newValue!);
        }}
        clearIcon={null}
        disablePortal
        options={formattedStock}
        sx={{
          width: '40%',
          m: '10px',
        }}
        renderInput={(params) => <TextField {...params} label="Stock Symbol" />}
      />

      <TextField
        sx={{
          width: '40%',
          m: '10px',
        }}
        disabled={true}
        value={lastPrice}
        id="outlined-basic"
        label="current price"
        variant="standard"
        InputProps={{
          startAdornment: <InputAdornment position="start">R$</InputAdornment>,
        }}
      />

      <TextField
        sx={{
          width: '40%',
          m: '10px',
        }}
        id="outlined-basic"
        label="Lowest Price"
        variant="outlined"
        inputRef={lowestPriceRef}
        value={inferiorTunel}
        InputProps={{
          startAdornment: <InputAdornment position="start">R$</InputAdornment>,
        }}
        onKeyDown={(e) => {
          handleCurrencyInput(e, inferiorTunel, setInferiorTunel);
        }}
      />

      <TextField
        sx={{
          width: '40%',
          m: '10px',
        }}
        id="outlined-basic"
        label="Higher Price"
        variant="outlined"
        value={superiorTunel}
        InputProps={{
          startAdornment: <InputAdornment position="start">R$</InputAdornment>,
        }}
        onKeyDown={(e) => {
          handleCurrencyInput(e, superiorTunel, setSuperiorTunel);
        }}
      />

      <Autocomplete
        value={interval}
        onChange={(_, newValue) => {
          setInterval(newValue!);
        }}
        clearIcon={null}
        id="combo-box-demo"
        options={allowedIntervals}
        sx={{
          width: '65%',
          m: '10px',
        }}
        renderInput={(params) => (
          <TextField {...params} label="Checkin interval" />
        )}
      />

      <Button
        onClick={createAlarm}
        disabled={submitFormDisabled}
        variant="contained"
        sx={{
          width: '20%',
          m: '10px',
        }}
      >
        {submitButtonText}
      </Button>
    </Box>
  );
}
