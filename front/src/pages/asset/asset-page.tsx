import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '@api';
import time_svc from '@/pages/home/time_svc';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

export default function AssetPage() {
  const [assetRecords, setAssetRecords] = useState<AssetRecord[]>([]);
  const [asset, setAsset] = useState<Asset | null>(null);
  const { assetId } = useParams();

  useEffect(() => {
    const getAssetInfo = async () => {
      const response = await api.stocks.getAsset(
        assetId!,
        time_svc().subtract(90, 'day').format(),
      );
      setAssetRecords(response.records);
      setAsset(response.asset);
    };
    getAssetInfo();
  }, [assetId]);
  return (
    <Container>
      <Typography variant="h2">Records of {asset?.symbol}</Typography>
      <TableContainer component={Paper}>
        <Table
          sx={{
            minWidth: 650,
          }}
          aria-label="Record Table"
        >
          <TableHead>
            <TableRow>
              <TableCell>Measured at</TableCell>
              <TableCell>Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assetRecords.map((record) => (
              <TableRow
                key={record.id}
                sx={{
                  '&:last-child td, &:last-child th': {
                    border: 0,
                  },
                }}
              >
                <TableCell component="th" scope="row">
                  {time_svc(record.measured_at).format('HH:mm DD/MM/YYYY')}
                </TableCell>
                <TableCell component="th" scope="row">
                  {`${record.currency} ${record.price / 100}`}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
