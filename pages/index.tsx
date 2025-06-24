import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { RiStarFill, RiShieldCheckLine, RiSettings4Line, RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/react';
import { Casino } from '../lib/types';
import Header from '../components/Header';

const BillboardCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<any[]>([]);

  // Load billboard data
  useEffect(() => {
    const loadBillboards = async () => {
      try {
        const response = await fetch('/api/billboards');
        const result = await response.json();
        
        if (result.success && result.data) {
          // Filter active billboards and sort by order
          const activeSlides = result.data
            .filter((billboard: any) => billboard.isActive)
            .sort((a: any, b: any) => a.order - b.order);
          setSlides(activeSlides);
        }
      } catch (error) {
        console.error('Failed to load billboards:', error);
        // Fallback to default slides
        setSlides([
          {
            id: 1,
            title: "Exclusive Welcome Bonus",
            subtitle: "Get up to €500 + 200 Free Spins",
            description: "Join now and claim your exclusive welcome package with amazing bonuses and free spins!",
            buttonText: "Claim Now",
            buttonUrl: "#",
            backgroundImage: "/Assets/place.svg"
          },
          {
            id: 2,
            title: "VIP Casino Experience",
            subtitle: "Premium Gaming at Its Finest",
            description: "Experience luxury gaming with our VIP program, exclusive games, and personal account managers.",
            buttonText: "Learn More",
            buttonUrl: "#",
            backgroundImage: "/Assets/place.svg"
          },
          {
            id: 3,
            title: "Weekly Tournaments",
            subtitle: "Compete for €10,000 Prize Pool",
            description: "Join our weekly casino tournaments and compete against players worldwide for massive prizes!",
            buttonText: "Join Tournament",
            buttonUrl: "#",
            backgroundImage: "/Assets/place.svg"
          }
        ]);
      }
    };

    loadBillboards();
  }, []);

  // Auto-slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  // Don't render if no slides
  if (slides.length === 0) {
    return null;
  }

  return (
    <div className="billboard-carousel">
      <div className="billboard-container">
        {/* Slides */}
        <div className="billboard-slides-wrapper">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`billboard-slide ${index === currentSlide ? 'active' : ''}`}
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.8)), url(${slide.backgroundImage})`,
              }}
            >
              <div className="billboard-content">
                <div className="billboard-text">
                  <h2 className="billboard-title">{slide.title}</h2>
                  <h3 className="billboard-subtitle">{slide.subtitle}</h3>
                  <p className="billboard-description">{slide.description}</p>
                  <a 
                    href={slide.buttonUrl}
                    className="billboard-button"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {slide.buttonText}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Controls */}
        <div className="billboard-controls">

          {/* Dot Indicators */}
          <div className="billboard-indicators">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`billboard-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

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
      <RiStarFill 
        key={i} 
        className={`w-4 h-4 ${i < stars ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
      />
    ));
  };

  if (loading) {
    return (
      <div>
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
    <>
      <Head>
        <title>Best Online Casinos 2024</title>
        <meta name="description" content="Discover the best online casinos with exclusive bonuses and top ratings" />
        <link rel="stylesheet" href="/styles/main.css" />
      </Head>

      <div className="main-layout">
        {/* Header Component */}
        <Header />

        {/* Main Content */}
        <div className="main-content">
          <main className="container mx-auto px-4 py-12">
        {/* Billboard Carousel Section */}
        <div className="max-w-6xl mx-auto mb-12">
          <BillboardCarousel />
        </div>

        {/* Placeholder Text Section */}
        <div className="max-w-6xl mx-auto mb-12 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Top Rated Online Casinos {new Date().getFullYear()}
          </h2>
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
                <div className="casino-badges">
                      {casino.isNew && (
                        <span className="badge-new">NEW</span>
                      )}
                      {casino.hasVPN && (
                        <span 
                          className="badge-vpn" 
                          data-tooltip="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore."
                        >
                          <RiShieldCheckLine className="w-4 h-4" />
                        </span>
                      )}
                    </div>
                  <div className="casino-logo-container">
                    <img 
                      src={casino.logo} 
                      alt={casino.name}
                      className="casino-logo"
                    />
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

            {/* Floating Admin Button - Only visible for admin/development */}
            <div className="floating-admin-btn">
              <Link href="/admin" className="admin-link">
                <RiSettings4Line className="admin-icon" />
              </Link>
            </div>
          </main>
        </div>
      </div>
    </>
  );
} 