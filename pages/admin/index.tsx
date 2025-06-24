import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { isSupabaseConfigured } from '../../lib/supabase';
import Header from '../../components/Header';
import { DragDropContext, Draggable, DroppableProvided } from 'react-beautiful-dnd';
import { StrictModeDroppable } from '../../components/StrictModeDroppable';
import { 
  RiAddLine, 
  RiPencilLine, 
  RiDeleteBinLine, 
  RiArrowUpLine, 
  RiArrowDownLine,
  RiSaveLine,
  RiDownloadLine,
  RiBarChartLine,
  RiEyeLine,
  RiDragMoveLine,
  RiLineChartLine,
  RiStarFill,
  RiAwardLine,
  RiGroupLine,
  RiShieldCheckLine,
  RiRefreshLine,
  RiLogoutBoxLine,
  RiImageLine,
  RiPlayCircleLine
} from '@remixicon/react';
import { Casino, Billboard } from '../../lib/types';
import { getRankClass, sortCasinosByRank } from '../../lib/casinoData';
import CasinoForm from '../../components/CasinoForm';
import LoginForm from '../../components/LoginForm';
import BillboardForm from '../../components/BillboardForm';

interface Stats {
  totalCasinos: number;
  averageRating: number;
  topRated: number;
  newCasinos: number;
}

export default function AdminDashboard() {
  const [casinos, setCasinos] = useState<Casino[]>([]);
  const [billboards, setBillboards] = useState<Billboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('manage');
  const [stats, setStats] = useState<Stats>({
    totalCasinos: 0,
    averageRating: 0,
    topRated: 0,
    newCasinos: 0
  });
  const [showCasinoForm, setShowCasinoForm] = useState(false);
  const [showBillboardForm, setShowBillboardForm] = useState(false);
  const [editingCasino, setEditingCasino] = useState<Casino | null>(null);
  const [editingBillboard, setEditingBillboard] = useState<Billboard | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'warning';
  } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const updateStats = useCallback((casinoData: Casino[]) => {
    const total = casinoData.length;
    const avgRating = total > 0 
      ? Number((casinoData.reduce((sum, c) => sum + c.rating, 0) / total).toFixed(1))
      : 0;
    
    setStats({
      totalCasinos: total,
      averageRating: avgRating,
      topRated: casinoData.filter(c => c.rating >= 9.5).length,
      newCasinos: casinoData.filter(c => c.isNew).length
    });
  }, []);

  const showNotification = useCallback((message: string, type: 'success' | 'error' | 'warning') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  }, []);

  const loadCasinos = useCallback(async () => {
    try {
      const response = await fetch('/api/casinos');
      const result = await response.json();
      
      if (result.success) {
        setCasinos(sortCasinosByRank(result.data));
        updateStats(result.data);
      } else {
        showNotification('Failed to load casinos', 'error');
      }
    } catch (error) {
      showNotification('Error loading casinos', 'error');
      console.error('Load error:', error);
    }
  }, [updateStats, showNotification]);

  const loadBillboards = useCallback(async () => {
    try {
      const response = await fetch('/api/billboards');
      const result = await response.json();
      
      if (result.success) {
        setBillboards(result.data.sort((a: Billboard, b: Billboard) => a.order - b.order));
      } else {
        showNotification('Failed to load billboards', 'error');
      }
    } catch (error) {
      showNotification('Error loading billboards', 'error');
      console.error('Billboard load error:', error);
    }
  }, [showNotification]);

  const loadData = useCallback(async () => {
    try {
      await Promise.all([loadCasinos(), loadBillboards()]);
    } finally {
      setLoading(false);
    }
  }, [loadCasinos, loadBillboards]);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        setAuthLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'verify',
            token: token,
          }),
        });

        const result = await response.json();
        if (result.success && result.valid) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('admin_token');
        }
      } catch (error) {
        localStorage.removeItem('admin_token');
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, loadData]);

  const saveCasinos = async (updatedCasinos?: Casino[]) => {
    const dataToSave = updatedCasinos || casinos;
    
    try {
      const response = await fetch('/api/casinos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ casinos: dataToSave }),
      });

      const result = await response.json();
      
      if (result.success) {
        setCasinos(sortCasinosByRank(dataToSave));
        updateStats(dataToSave);
        showNotification('Changes saved successfully!', 'success');
      } else {
        showNotification(result.error || 'Failed to save casinos', 'error');
      }
    } catch (error) {
      showNotification('Error saving casinos', 'error');
      console.error('Save error:', error);
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(casinos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update ranks
    const updatedCasinos = items.map((casino, index) => ({
      ...casino,
      rank: index + 1,
      rankClass: getRankClass(index + 1)
    }));

    setCasinos(updatedCasinos);
    saveCasinos(updatedCasinos);
  };

  const moveUp = (id: number) => {
    const casino = casinos.find(c => c.id === id);
    if (!casino || casino.rank === 1) return;

    const swapCasino = casinos.find(c => c.rank === casino.rank - 1);
    if (!swapCasino) return;

    const updatedCasinos = casinos.map(c => {
      if (c.id === casino.id) {
        return { ...c, rank: c.rank - 1, rankClass: getRankClass(c.rank - 1) };
      }
      if (c.id === swapCasino.id) {
        return { ...c, rank: c.rank + 1, rankClass: getRankClass(c.rank + 1) };
      }
      return c;
    });

    setCasinos(sortCasinosByRank(updatedCasinos));
    saveCasinos(updatedCasinos);
  };

  const moveDown = (id: number) => {
    const casino = casinos.find(c => c.id === id);
    if (!casino || casino.rank === casinos.length) return;

    const swapCasino = casinos.find(c => c.rank === casino.rank + 1);
    if (!swapCasino) return;

    const updatedCasinos = casinos.map(c => {
      if (c.id === casino.id) {
        return { ...c, rank: c.rank + 1, rankClass: getRankClass(c.rank + 1) };
      }
      if (c.id === swapCasino.id) {
        return { ...c, rank: c.rank - 1, rankClass: getRankClass(c.rank - 1) };
      }
      return c;
    });

    setCasinos(sortCasinosByRank(updatedCasinos));
    saveCasinos(updatedCasinos);
  };

  const deleteCasino = (id: number) => {
    if (!confirm('Are you sure you want to delete this casino?')) return;
    
    const updatedCasinos = casinos
      .filter(c => c.id !== id)
      .map((casino, index) => ({
        ...casino,
        rank: index + 1,
        rankClass: getRankClass(index + 1)
      }));

    setCasinos(updatedCasinos);
    saveCasinos(updatedCasinos);
    showNotification('Casino deleted successfully!', 'success');
  };

  const saveBillboards = async (updatedBillboards?: Billboard[]) => {
    const dataToSave = updatedBillboards || billboards;
    
    try {
      const response = await fetch('/api/billboards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ billboards: dataToSave }),
      });

      const result = await response.json();
      
      if (result.success) {
        setBillboards(dataToSave.sort((a, b) => a.order - b.order));
        showNotification('Billboards saved successfully!', 'success');
      } else {
        showNotification(result.error || 'Failed to save billboards', 'error');
      }
    } catch (error) {
      showNotification('Error saving billboards', 'error');
      console.error('Billboard save error:', error);
    }
  };

  const handleSaveCasino = (casino: Casino) => {
    let updatedCasinos: Casino[];
    
    if (editingCasino) {
      // Editing existing casino
      updatedCasinos = casinos.map(c => c.id === casino.id ? casino : c);
    } else {
      // Adding new casino
      updatedCasinos = [...casinos, casino];
    }
    
    // Sort by rank and update
    updatedCasinos = sortCasinosByRank(updatedCasinos);
    saveCasinos(updatedCasinos);
    setShowCasinoForm(false);
    setEditingCasino(null);
  };

  const handleSaveBillboard = (billboard: Billboard) => {
    let updatedBillboards: Billboard[];
    
    if (editingBillboard) {
      // Editing existing billboard
      updatedBillboards = billboards.map(b => b.id === billboard.id ? billboard : b);
    } else {
      // Adding new billboard
      updatedBillboards = [...billboards, billboard];
    }
    
    // Sort by order and update
    updatedBillboards = updatedBillboards.sort((a, b) => a.order - b.order);
    saveBillboards(updatedBillboards);
    setShowBillboardForm(false);
    setEditingBillboard(null);
  };

  const deleteBillboard = (id: number) => {
    if (!confirm('Are you sure you want to delete this billboard?')) return;
    
    const updatedBillboards = billboards
      .filter(b => b.id !== id)
      .map((billboard, index) => ({
        ...billboard,
        order: index + 1
      }));

    setBillboards(updatedBillboards);
    saveBillboards(updatedBillboards);
    showNotification('Billboard deleted successfully!', 'success');
  };

  const handleLogin = (token: string) => {
    setIsAuthenticated(true);
    showNotification('Welcome back! Login successful.', 'success');
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('admin_token');
    
    try {
      await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'logout',
          token: token,
        }),
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    setCasinos([]);
    showNotification('Logged out successfully', 'success');
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle }: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
    subtitle?: string;
  }) => (
    <div className="stat-card">
      <div className="stat-content">
        <div className={`stat-icon ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="stat-details">
          <div className="stat-value">{value}</div>
          <div className="stat-title">{title}</div>
          {subtitle && <div className="stat-subtitle">{subtitle}</div>}
        </div>
      </div>
    </div>
  );

  const CasinoCard = ({ casino }: { casino: Casino }) => (
    <div className="casino-card">
      <div className="casino-card-header">
        <div className="casino-rank-badge">
          <span className="rank-number">#{casino.rank}</span>
          {casino.rank <= 3 && <RiAwardLine className="w-4 h-4 ml-1" />}
        </div>
        <div className="casino-status-badges">
          {casino.isNew && <span className="badge badge-new">NEW</span>}
          {casino.hasVPN && <span className="badge badge-vpn">VPN</span>}
        </div>
      </div>
      
      <div className="casino-logo">
        <img src={casino.logo} alt={casino.name} className="logo-image" />
      </div>
      
      <div className="casino-info">
        <div className="casino-rating">
          <div className="rating-stars">
            {[...Array(5)].map((_, i) => (
              <RiStarFill
                key={i}
                className={`w-4 h-4 ${i < casino.stars ? 'star-filled' : 'star-empty'}`}
              />
            ))}
          </div>
          <span className="rating-value">{casino.rating}/10</span>
        </div>
        
        <div className="casino-bonus">
          <div className="bonus-main">{casino.bonus.percentage} up to {casino.bonus.maxAmount}</div>
          <div className="bonus-details">
            <span>Code: {casino.bonus.promoCode}</span>
            <span>Wager: {casino.bonus.wager}</span>
          </div>
        </div>
      </div>
      
      <div className="casino-actions">
        <button
          onClick={() => {
            setEditingCasino(casino);
            setShowCasinoForm(true);
          }}
          className="btn btn-primary btn-sm"
        >
          <RiPencilLine className="w-4 h-4 mr-2" />
          Edit
        </button>
        <button
          onClick={() => deleteCasino(casino.id)}
          className="btn btn-danger btn-sm"
        >
          <RiDeleteBinLine className="w-4 h-4 mr-2" />
          Delete
        </button>
      </div>
    </div>
  );

  // Show loading screen while checking auth
  if (authLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <div className="loading-text">
            <h2>Casino CMS</h2>
            <p>Verifying authentication...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <Head>
          <title>Login - Casino CMS</title>
          <meta name="description" content="Casino CMS Admin Login" />
          <link rel="stylesheet" href="/styles/admin.css" />
        </Head>
        <LoginForm onLogin={handleLogin} />
      </>
    );
  }

  // Show loading screen while loading casino data
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <div className="loading-text">
            <h2>Loading Casino CMS</h2>
            <p>Preparing your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Casino CMS - Admin Dashboard</title>
        <meta name="description" content="Professional casino management system" />
        <link rel="stylesheet" href="/styles/admin.css" />
      </Head>

      <div className="admin-dashboard">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-content">
            <div className="header-left">
              <div className="logo-section">
                <div className="logo-icon">
                  <RiShieldCheckLine className="w-6 h-6" />
                </div>
                <div className="logo-text">
                  <h1>Casino CMS</h1>
                  <span>Admin Dashboard</span>
                </div>
              </div>
            </div>
            <div className="header-actions">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <RiEyeLine className="w-4 h-4 mr-2" />
                View Site
              </a>
              <button
                onClick={handleLogout}
                className="btn btn-danger"
              >
                <RiLogoutBoxLine className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="dashboard-main">
          <div className="dashboard-container">
            {/* Statistics */}
            <section className="stats-section">
              <div className="stats-grid">
                <StatCard
                  title="Total Casinos"
                  value={stats.totalCasinos}
                  icon={RiGroupLine}
                  color="stat-blue"
                  subtitle="Active listings"
                />
                <StatCard
                  title="Average Rating"
                  value={stats.averageRating}
                  icon={RiStarFill}
                  color="stat-green"
                  subtitle="Out of 10"
                />
                <StatCard
                  title="Top Rated"
                  value={stats.topRated}
                  icon={RiAwardLine}
                  color="stat-yellow"
                  subtitle="9.5+ rating"
                />
                <StatCard 
                  title="New Casinos"
                  value={stats.newCasinos}
                  icon={RiLineChartLine}
                  color="stat-purple"
                  subtitle="Recently added"
                />
              </div>
            </section>

            {/* Dashboard Tabs */}
            <div className="dashboard-tabs">
              <button
                onClick={() => setActiveTab('manage')}
                className={`dashboard-tab ${activeTab === 'manage' ? 'active' : ''}`}
              >
                <RiShieldCheckLine className="w-5 h-5 mr-2" />
                Manage Casinos
              </button>
              <button
                onClick={() => setActiveTab('billboards')}
                className={`dashboard-tab ${activeTab === 'billboards' ? 'active' : ''}`}
              >
                <RiImageLine className="w-5 h-5 mr-2" />
                Billboard Carousel
              </button>
              <button
                onClick={() => setActiveTab('reorder')}
                className={`dashboard-tab ${activeTab === 'reorder' ? 'active' : ''}`}
              >
                <RiDragMoveLine className="w-5 h-5 mr-2" />
                Reorder Rankings
              </button>
            </div>

            {/* Tab Content */}
            <section className="tab-content">
              {activeTab === 'manage' && (
                <div className="manage-tab">
                  <div className="section-header">
                    <div>
                      <h2>Manage Casinos</h2>
                      <p>Add, edit, or remove casino listings</p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingCasino(null);
                        setShowCasinoForm(true);
                      }}
                      className="btn btn-primary btn-lg"
                    >
                      <RiAddLine className="w-5 h-5 mr-2" />
                      Add New Casino
                    </button>
                  </div>

                  <div className="casinos-grid">
                    {casinos.map((casino) => (
                      <CasinoCard key={casino.id} casino={casino} />
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'billboards' && (
                <div className="billboards-tab">
                  <div className="section-header">
                    <div>
                      <h2>Billboard Carousel</h2>
                      <p>Manage promotional slides for the homepage carousel</p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingBillboard(null);
                        setShowBillboardForm(true);
                      }}
                      className="btn btn-primary btn-lg"
                    >
                      <RiAddLine className="w-5 h-5 mr-2" />
                      Add New Billboard
                    </button>
                  </div>

                  <div className="billboards-grid">
                    {billboards.map((billboard) => (
                      <div key={billboard.id} className="billboard-card">
                        <div className="billboard-card-header">
                          <div className="billboard-order">
                            Order #{billboard.order}
                          </div>
                          <div className="billboard-status">
                            {billboard.isActive ? (
                              <span className="status-active">Active</span>
                            ) : (
                              <span className="status-inactive">Inactive</span>
                            )}
                          </div>
                        </div>

                        <div className="billboard-preview">
                          <div 
                            className="billboard-background"
                            style={{
                              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7)), url(${billboard.backgroundImage})`
                            }}
                          >
                            <div className="billboard-content-preview">
                              <h3>{billboard.title}</h3>
                              <h4>{billboard.subtitle}</h4>
                              <p>{billboard.description}</p>
                              <span className="billboard-button-preview">
                                {billboard.buttonText}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="billboard-card-actions">
                          <button
                            onClick={() => {
                              setEditingBillboard(billboard);
                              setShowBillboardForm(true);
                            }}
                            className="btn btn-primary btn-sm"
                          >
                            <RiPencilLine className="w-4 h-4 mr-2" />
                            Edit
                          </button>
                          <button
                            onClick={() => deleteBillboard(billboard.id)}
                            className="btn btn-danger btn-sm"
                          >
                            <RiDeleteBinLine className="w-4 h-4 mr-2" />
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {billboards.length === 0 && (
                    <div className="empty-state">
                      <div className="empty-state-icon">
                        <RiImageLine className="w-12 h-12" />
                      </div>
                      <h3>No billboards created yet</h3>
                      <p>Create your first promotional billboard to display on the homepage carousel.</p>
                      <button
                        onClick={() => {
                          setEditingBillboard(null);
                          setShowBillboardForm(true);
                        }}
                        className="btn btn-primary"
                      >
                        <RiAddLine className="w-4 h-4 mr-2" />
                        Create Billboard
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'reorder' && (
                <div className="reorder-tab">
                  <div className="section-header">
                    <h2>Reorder Casino Rankings</h2>
                    <p>Drag and drop or use the arrow buttons to change casino rankings</p>
                  </div>
                  
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <StrictModeDroppable droppableId="casinos">
                      {(provided: DroppableProvided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="reorder-list">
                          {casinos.map((casino, index) => (
                            <Draggable key={casino.id} draggableId={casino.id.toString()} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className={`reorder-item ${snapshot.isDragging ? 'dragging' : ''}`}
                                >
                                  <div className="reorder-drag-handle" {...provided.dragHandleProps}>
                                    <RiDragMoveLine className="w-5 h-5" />
                                  </div>
                                  
                                  <div className="reorder-rank">#{casino.rank}</div>
                                  
                                  <img src={casino.logo} alt={casino.name} className="reorder-logo" />
                                  
                                  <div className="reorder-info">
                                    <h3>{casino.name}</h3>
                                    <p>Rating: {casino.rating}/10 • Bonus: {casino.bonus.percentage}</p>
                                  </div>
                                  
                                  <div className="reorder-actions">
                                    <button
                                      onClick={() => moveUp(casino.id)}
                                      disabled={casino.rank === 1}
                                      className="btn btn-icon"
                                      title="Move Up"
                                    >
                                      <RiArrowUpLine className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => moveDown(casino.id)}
                                      disabled={casino.rank === casinos.length}
                                      className="btn btn-icon"
                                      title="Move Down"
                                    >
                                      <RiArrowDownLine className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </StrictModeDroppable>
                  </DragDropContext>
                </div>
              )}
            </section>
          </div>
        </main>

        {/* Notification */}
        {notification && (
          <div className={`notification notification-${notification.type}`}>
            <div className="notification-content">
              {notification.message}
            </div>
          </div>
        )}

        {/* Casino Form Modal */}
        <CasinoForm
          casino={editingCasino}
          isOpen={showCasinoForm}
          onClose={() => {
            setShowCasinoForm(false);
            setEditingCasino(null);
          }}
          onSave={handleSaveCasino}
          existingCasinos={casinos}
        />

        {/* Billboard Form Modal */}
        <BillboardForm
          billboard={editingBillboard}
          isOpen={showBillboardForm}
          onClose={() => {
            setShowBillboardForm(false);
            setEditingBillboard(null);
          }}
          onSave={handleSaveBillboard}
          existingBillboards={billboards}
        />
      </div>
    </>
  );
}