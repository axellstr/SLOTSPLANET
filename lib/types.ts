export interface Casino {
  id: number;
  rank: number;
  rankClass: string;
  name: string;
  logo: string;
  rating: number;
  stars: number;
  url: string;
  isNew: boolean;
  hasVPN: boolean;
  vpnTooltip: string;
  bonus: {
    percentage: string;
    maxAmount: string;
    promoCode: string;
    wager: string;
    freeSpins: string;
    verification: string;
  };
  features: {
    quickWithdrawals: boolean;
    withdrawalText: string;
  };
  buttonText: string;
}

export interface Billboard {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  backgroundImage: string;
  isActive: boolean;
  order: number;
}

export interface CasinoData {
  casinos: Casino[];
  metadata: {
    lastUpdated: string;
    version: string;
    totalCasinos: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
} 