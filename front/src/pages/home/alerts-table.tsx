import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Delete, Edit, ShowChart } from '@mui/icons-material';
import time_svc from '@/libs/time_svc';

export function AlertsTable({
  alerts,
  editAlert,
  deleteAlert,
  viewAsset,
}: {
  alerts: UserAlert[];
  editAlert: (alert: UserAlert) => void;
  deleteAlert: (alert: UserAlert) => void;
  viewAsset: (asset: Asset) => void;
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
                    viewAsset(alert.asset);
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
