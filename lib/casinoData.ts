import { Casino, CasinoData } from './types';

export const initialCasinoData: Casino[] = [
  {
    id: 1,
    rank: 1,
    rankClass: '',
    name: 'Casino Stars',
    logo: '/Assets/casinostars.png',
    rating: 9.9,
    stars: 5,
    url: '#',
    isNew: true,
    hasVPN: true,
    vpnTooltip: 'Προτείνουμε VPN για όλους τους παροχους, το οποίο να ανοίγετε (προτείνουμε Νορβηγία) πριν ανοίξετε το καζίνο.',
    bonus: {
      percentage: '100%',
      maxAmount: '500$',
      promoCode: 'None',
      wager: '30x',
      freeSpins: 'No',
      verification: 'Χωρις'
    },
    features: {
      quickWithdrawals: true,
      withdrawalText: 'Quick Withdrawls'
    },
    buttonText: 'Claim Bonus'
  },
  {
    id: 2,
    rank: 2,
    rankClass: 'two',
    name: 'Nine Casino',
    logo: '/Assets/ninecasino.svg',
    rating: 9.9,
    stars: 5,
    url: '#',
    isNew: true,
    hasVPN: true,
    vpnTooltip: 'Προτείνουμε VPN για όλους τους παροχους, το οποίο να ανοίγετε (προτείνουμε Νορβηγία) πριν ανοίξετε το καζίνο.',
    bonus: {
      percentage: '100%',
      maxAmount: '500$',
      promoCode: 'None',
      wager: '30x',
      freeSpins: 'No',
      verification: 'Χωρις'
    },
    features: {
      quickWithdrawals: true,
      withdrawalText: 'Quick Withdrawls'
    },
    buttonText: 'Claim Bonus'
  },
  {
    id: 3,
    rank: 3,
    rankClass: 'three',
    name: 'Wintopia',
    logo: '/Assets/wintopia.svg',
    rating: 9.9,
    stars: 5,
    url: '#',
    isNew: true,
    hasVPN: true,
    vpnTooltip: 'Προτείνουμε VPN για όλους τους παροχους, το οποίο να ανοίγετε (προτείνουμε Νορβηγία) πριν ανοίξετε το καζίνο.',
    bonus: {
      percentage: '100%',
      maxAmount: '500$',
      promoCode: 'None',
      wager: '30x',
      freeSpins: 'No',
      verification: 'Χωρις'
    },
    features: {
      quickWithdrawals: true,
      withdrawalText: 'Quick Withdrawls'
    },
    buttonText: 'Claim Bonus'
  },
  {
    id: 4,
    rank: 4,
    rankClass: 'default',
    name: 'Bet Riot',
    logo: '/Assets/betriot.svg',
    rating: 9.9,
    stars: 5,
    url: '#',
    isNew: true,
    hasVPN: true,
    vpnTooltip: 'Προτείνουμε VPN για όλους τους παροχους, το οποίο να ανοίγετε (προτείνουμε Νορβηγία) πριν ανοίξετε το καζίνο.',
    bonus: {
      percentage: '100%',
      maxAmount: '500$',
      promoCode: 'None',
      wager: '30x',
      freeSpins: 'No',
      verification: 'Χωρις'
    },
    features: {
      quickWithdrawals: true,
      withdrawalText: 'Quick Withdrawls'
    },
    buttonText: 'Claim Bonus'
  },
  {
    id: 5,
    rank: 5,
    rankClass: 'default',
    name: 'Deposit Win',
    logo: '/Assets/Depositwin.svg',
    rating: 9.8,
    stars: 5,
    url: '#',
    isNew: true,
    hasVPN: true,
    vpnTooltip: 'Προτείνουμε VPN για όλους τους παροχους, το οποίο να ανοίγετε (προτείνουμε Νορβηγία) πριν ανοίξετε το καζίνο.',
    bonus: {
      percentage: '150%',
      maxAmount: '750$',
      promoCode: 'SLOTS150',
      wager: '35x',
      freeSpins: '100',
      verification: 'Απαιτειται'
    },
    features: {
      quickWithdrawals: true,
      withdrawalText: 'Fast Withdrawls'
    },
    buttonText: 'Get Bonus'
  },
  {
    id: 6,
    rank: 6,
    rankClass: 'default',
    name: 'Billy Casino',
    logo: '/Assets/Billy.png',
    rating: 9.7,
    stars: 4,
    url: '#',
    isNew: false,
    hasVPN: true,
    vpnTooltip: 'Προτείνουμε VPN για όλους τους παροχους, το οποίο να ανοίγετε (προτείνουμε Νορβηγία) πριν ανοίξετε το καζίνο.',
    bonus: {
      percentage: '200%',
      maxAmount: '1000$',
      promoCode: 'BILLY200',
      wager: '40x',
      freeSpins: '200',
      verification: 'Χωρις'
    },
    features: {
      quickWithdrawals: false,
      withdrawalText: 'Standard Withdrawls'
    },
    buttonText: 'Play Now'
  }
];

export const getRankClass = (rank: number): string => {
  if (rank === 1) return '';
  if (rank === 2) return 'two';
  if (rank === 3) return 'three';
  return 'default';
};

export const generateCasinoId = (): number => {
  return Date.now();
};

export const sortCasinosByRank = (casinos: Casino[]): Casino[] => {
  return [...casinos].sort((a, b) => a.rank - b.rank);
};

export const validateCasino = (casino: Partial<Casino>): string[] => {
  const errors: string[] = [];
  
  if (!casino.logo?.trim()) errors.push('Logo URL is required');
  if (!casino.url?.trim()) errors.push('Casino URL is required');
  if (typeof casino.rank !== 'number' || casino.rank < 1) errors.push('Valid rank is required');
  if (typeof casino.rating !== 'number' || casino.rating < 0 || casino.rating > 10) {
    errors.push('Rating must be between 0 and 10');
  }
  if (typeof casino.stars !== 'number' || casino.stars < 1 || casino.stars > 5) {
    errors.push('Stars must be between 1 and 5');
  }
  
  return errors;
}; 