import { useState, useEffect } from 'react';
import Head from 'next/head';
import { StarIcon, ShieldIcon, SettingsIcon } from 'lucide-react';
import { Casino } from '../lib/types';

export default function HomePage() {
  const [casinos, setCasinos] = useState<Casino[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCasinos();
  }, []);

  const loadCasinos = async () => {
    try {
      const response = await fetch('/api/casinos');
      const result = await response.json();
      
      if (result.success) {
        // Sort by rank and display all casinos
        const sortedCasinos = result.data.sort((a: Casino, b: Casino) => a.rank - b.rank);
        setCasinos(sortedCasinos);
      }
    } catch (error) {
      console.error('Error loading casinos:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (stars: number) => {
    return Array(5).fill(0).map((_, i) => (
      <StarIcon 
        key={i} 
        className={`w-4 h-4 ${i < stars ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <Head>
          <title>Best Online Casinos 2024 button</title>
          <meta name="description" content="Discover the best online casinos with exclusive bonuses and top ratings" />
          <link rel="stylesheet" href="/styles/main.css" />
        </Head>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Best Casinos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Head>
        <title>Best Online Casinos 2024</title>
        <meta name="description" content="Discover the best online casinos with exclusive bonuses and top ratings" />
        <link rel="stylesheet" href="/styles/main.css" />
      </Head>

      <main className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
            Best Online Casinos 2024
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover top-rated online casinos with exclusive bonuses, fast withdrawals, and incredible gaming experiences
          </p>
        </div>

        {/* Casino Cards */}
        <div className="space-y-4 max-w-6xl mx-auto">
          {casinos.map((casino, index) => (
            <div key={casino.id} className="casino-card-container">
              {/* Rank Badge */}
              <div className={`casino-rank-badge rank-${casino.rank}`}>
                <span className="rank-number">{casino.rank}</span>
              </div>

              {/* Main Casino Card Content */}
              <div className="casino-card-content">
                {/* Left Section: Logo, Name, Rating */}
                <div className="casino-left-section">
                  <div className="casino-logo-container">
                    <img 
                      src={casino.logo} 
                      alt={casino.name}
                      className="casino-logo"
                    />
                    <div className="casino-badges">
                      {casino.isNew && (
                        <span className="badge-new">NEW</span>
                      )}
                      {casino.hasVPN && (
                        <div className="badge-vpn" title={casino.vpnTooltip}>
                          <ShieldIcon className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="casino-rating-container">
                    <div className="rating-display">
                      <span className="rating-number">{casino.rating}</span>
                      <div className="stars-display">
                        {renderStars(casino.stars)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Center Section: Bonus Information Grid */}
                <div className="casino-bonus-section">
                  <div className="bonus-grid">
                    <div className="bonus-item">
                      <span className="bonus-label">Bonus</span>
                      <span className="bonus-value">{casino.bonus.percentage}</span>
                    </div>
                    <div className="bonus-item">
                      <span className="bonus-label">Max Bonus</span>
                      <span className="bonus-value">{casino.bonus.maxAmount}</span>
                    </div>
                    <div className="bonus-item">
                      <span className="bonus-label">Promo Code</span>
                      <span className="bonus-value">{casino.bonus.promoCode}</span>
                    </div>
                    <div className="bonus-item">
                      <span className="bonus-label">Wager</span>
                      <span className="bonus-value">{casino.bonus.wager}</span>
                    </div>
                    <div className="bonus-item">
                      <span className="bonus-label">Free Spins</span>
                      <span className="bonus-value">{casino.bonus.freeSpins}</span>
                    </div>
                    <div className="bonus-item">
                      <span className="bonus-label">ΤΑΥΤΟΠΟΙΗΣΗ</span>
                      <span className="bonus-value">{casino.bonus.verification}</span>
                    </div>
                  </div>
                </div>

                {/* Right Section: Action Button */}
                <div className="casino-right-section">
                  <a 
                    href={casino.url}
                    className="claim-bonus-button"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {casino.buttonText || 'Claim Bonus'}
                  </a>
                  {casino.features.quickWithdrawals && (
                    <div className="quick-withdrawals-badge">
                      <span className="withdrawal-text">{casino.features.withdrawalText}</span>
                      <span className="withdrawal-icon">⚡</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="text-center mt-16 text-gray-400">
          <p className="text-sm">
            * Terms and conditions apply. Please gamble responsibly. 18+
          </p>
        </div>
      </main>

      {/* Floating Admin Button */}
      <a
        href="/admin"
        target="_blank"
        rel="noopener noreferrer"
        className="floating-admin-btn"
        title="Admin Panel"
      >
        <SettingsIcon className="admin-icon" />
      </a>
    </div>
  );
} 