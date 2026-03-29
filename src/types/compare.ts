export type PhoneScores = {
  performance: number;
  camera: number;
  battery: number;
  overall: number;
};

export type CatalogPhone = {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  specs: { ram: string; camera: string; battery: string };
  scores: PhoneScores;
  tier?: string;
  year?: number;
  [key: string]: unknown;
};

export type CategoryBreakdown = {
  winner: string;
  winnerName: string;
  phoneAScore: number;
  phoneBScore: number;
  phoneADetail: string;
  phoneBDetail: string;
  summary: string;
};

export type CompareApiData = {
  phoneA: CatalogPhone;
  phoneB: CatalogPhone;
  winner: string;
  winnerId: string;
  margin: string;
  verdict: string;
  breakdown: {
    performance: CategoryBreakdown;
    camera: CategoryBreakdown;
    battery: CategoryBreakdown;
    overall: CategoryBreakdown;
  };
  priceDiff: {
    amount: number;
    cheaper: string;
  };
};
