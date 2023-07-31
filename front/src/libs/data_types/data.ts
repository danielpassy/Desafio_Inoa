interface Asset {
  id: number;
  name: string | null;
  short_name: string | null;
  long_name: string | null;
  symbol: string;
}

interface UserAlert {
  id: number;
  asset: Asset;
  inferior_tunel: number;
  superior_tunel: number;
  user: number;
  interval: string;
}

enum Currency {
  REAL = 'BRL',
  AMERICAN_DOLLAR = 'US',
}

interface AssetRecord {
  id: number;
  asset: Asset;
  price: number;
  currency: Currency;
  measured_at: string;
}
