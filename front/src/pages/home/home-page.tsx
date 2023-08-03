import {
  Autocomplete,
  Box,
  Button,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { Delete, Edit, ShowChart } from '@mui/icons-material';

import { useEffect, useMemo, useRef, useState } from 'react';
import api from '@api';
import useSnackbarContext from '@/context/snack-context';
import time_svc from '@/pages/home/time_svc';

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

export default function HomePage() {
  const [alerts, setAlerts] = useState<UserAlert[]>([]);
  const [stocks, setStock] = useState<Asset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<object>({});
  const [inferiorTunel, setInferiorTunel] = useState<number>(0);
  const [superiorTunel, setSuperiorTunel] = useState<number>(0);
  const [interval, setInterval] = useState(allowedIntervals[0]);
  const [lastPrice, setLastPrice] = useState<number>(0);
  const lowestPriceRef = useRef<HTMLInputElement | null>(null);
  const snackbar = useSnackbarContext();

  const editAlert = (alert: UserAlert) => {
    setSelectedAsset({
      label: alert.asset.symbol,
      id: alert.asset.id,
    });
    setInferiorTunel(alert.inferior_tunel);
    setSuperiorTunel(alert.superior_tunel);
    const durationObj = time_svc.duration(alert.interval);
    const totalSeconds = durationObj.asSeconds();
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

  const createAlarm = async () => {
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
    // javascript complains cause is a different object, but it works
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
        selectedAsset.id,
        time_svc().subtract(1, 'day').format(),
      );
      console.log(stockPrice.records);
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
      />

      <Box sx={{ m: 3 }} />

      <Typography variant="h2">Create Alert</Typography>
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
          value={lastPrice}
          id="outlined-basic"
          label="current price"
          variant="standard"
        />

        <TextField
          sx={{ width: '40%', m: '10px' }}
          id="outlined-basic"
          label="Lowest Price"
          variant="outlined"
          inputRef={lowestPriceRef}
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
          {alerts.map((a) => a.asset.id).includes(selectedAsset.id)
            ? 'Edit Alert'
            : 'Create Alert'}
        </Button>
      </Box>
    </Container>
  );
}

function AlertsTable({
  alerts,
  editAlert,
  deleteAlert,
}: {
  alerts: UserAlert[];
  editAlert: (alert: UserAlert) => void;
  deleteAlert: (alert: UserAlert) => void;
}) {
  return (
    <TableContainer component={Paper}>
      <Table
        sx={{
          minWidth: 650,
        }}
        aria-label="simple table"
      >
        <TableHead>
          <TableRow>
            <TableCell>Asset </TableCell>
            <TableCell>Interval</TableCell>
            <TableCell>Inferior Tunel</TableCell>
            <TableCell>Superior Tunel</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {alerts.map((alert) => (
            <TableRow
              key={alert.id}
              sx={{
                '&:last-child td, &:last-child th': {
                  border: 0,
                },
              }}
            >
              <TableCell component="th" scope="row">
                {alert.asset.symbol}
              </TableCell>
              <TableCell component="th" scope="row">
                {time_svc.duration(alert.interval).humanize()}
              </TableCell>
              <TableCell component="th" scope="row">
                {alert.inferior_tunel}
              </TableCell>
              <TableCell component="th" scope="row">
                {alert.superior_tunel}
              </TableCell>
              <TableCell component="th" scope="row">
                <IconButton
                  onClick={() => {
                    editAlert(alert);
                  }}
                  color="inherit"
                  aria-label="trips"
                  sx={{ mr: 0 }}
                >
                  <Edit />
                </IconButton>
                <IconButton
                  onClick={() => {
                    deleteAlert(alert);
                  }}
                  color="inherit"
                  aria-label="trips"
                  sx={{ mr: 0 }}
                >
                  <Delete />
                </IconButton>
                <IconButton
                  onClick={() => {
                    console.log('asdasd');
                  }}
                  color="inherit"
                  aria-label="trips"
                  sx={{ mr: 0 }}
                >
                  <ShowChart />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
