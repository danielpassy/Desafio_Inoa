import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '@api';
import time_svc from '@/pages/home/time_svc';

export default function AssetPage() {
  const [assetRecords, setAssetRecords] = useState<Asset[]>([]);
  const { assetId } = useParams();

  useEffect(() => {
    const getAssetInfo = async () => {
      const response = await api.stocks.getAsset(
        assetId!,
        time_svc().subtract(90, 'day'),
      );
      setAssetRecords(response.records);
    };
    getAssetInfo();
  });
  return <div>{JSON.stringify(assetRecords)}</div>;
}
