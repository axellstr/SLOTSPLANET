import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { isSupabaseConfigured } from '../../lib/supabase';
import { DragDropContext, Draggable, DroppableProvided } from 'react-beautiful-dnd';
import { StrictModeDroppable } from '../../components/StrictModeDroppable';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  ArrowUpIcon, 
  ArrowDownIcon,
  SaveIcon,
  DownloadIcon,
  BarChart3Icon,
  EyeIcon,
  GripVerticalIcon,
  TrendingUpIcon,
  StarIcon,
  AwardIcon,
  UsersIcon,
  ShieldCheckIcon,
  RefreshCwIcon
} from 'lucide-react';
import { Casino } from '../../lib/types';
import { getRankClass, sortCasinosByRank } from '../../lib/casinoData';
import CasinoForm from '../../components/CasinoForm';

interface Stats {
  totalCasinos: number;
  averageRating: number;
  topRated: number;
  newCasinos: number;
}

export default function AdminDashboard() {
  const [casinos, setCasinos] = useState<Casino[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<Stats>({
    totalCasinos: 0,
    averageRating: 0,
    topRated: 0,
    newCasinos: 0
  });
  const [showCasinoForm, setShowCasinoForm] = useState(false);
  const [editingCasino, setEditingCasino] = useState<Casino | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'warning';
  } | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

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
      setIsRefreshing(true);
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
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [updateStats, showNotification]);

  // Load casino data
  useEffect(() => {
    loadCasinos();
  }, [loadCasinos]);

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

  const exportData = () => {
    const dataStr = JSON.stringify({
      casinos,
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    }, null, 2);
    
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `casino-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Data exported successfully!', 'success');
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
          {casino.rank <= 3 && <AwardIcon className="w-4 h-4 ml-1" />}
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
              <StarIcon
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
          <PencilIcon className="w-4 h-4 mr-2" />
          Edit
        </button>
        <button
          onClick={() => deleteCasino(casino.id)}
          className="btn btn-danger btn-sm"
        >
          <TrashIcon className="w-4 h-4 mr-2" />
          Delete
        </button>
      </div>
    </div>
  );

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
                <BarChart3Icon className="logo-icon" />
                <div className="logo-text">
                  <h1>Casino CMS</h1>
                  <span>Admin Dashboard</span>
                </div>
              </div>
            </div>
            
            <div className="header-actions">
              <button
                onClick={() => loadCasinos()}
                className={`btn btn-secondary ${isRefreshing ? 'loading' : ''}`}
                disabled={isRefreshing}
              >
                <RefreshCwIcon className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              
              <button
                onClick={() => saveCasinos()}
                className="btn btn-success"
              >
                <SaveIcon className="w-4 h-4 mr-2" />
                Save Changes
              </button>
              
              <button
                onClick={exportData}
                className="btn btn-warning"
              >
                <DownloadIcon className="w-4 h-4 mr-2" />
                Export Data
              </button>
              
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <EyeIcon className="w-4 h-4 mr-2" />
                View Site
              </a>
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
                  icon={UsersIcon}
                  color="stat-blue"
                  subtitle="Active listings"
                />
                <StatCard
                  title="Average Rating"
                  value={stats.averageRating}
                  icon={StarIcon}
                  color="stat-green"
                  subtitle="Out of 10"
                />
                <StatCard
                  title="Top Rated"
                  value={stats.topRated}
                  icon={AwardIcon}
                  color="stat-yellow"
                  subtitle="9.5+ rating"
                />
                <StatCard
                  title="New Casinos"
                  value={stats.newCasinos}
                  icon={TrendingUpIcon}
                  color="stat-purple"
                  subtitle="Recently added"
                />
              </div>
            </section>


            {/* Navigation Tabs */}
            <nav className="tab-navigation">
              <button
                onClick={() => setActiveTab('overview')}
                className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
              >
                <BarChart3Icon className="w-5 h-5 mr-2" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab('manage')}
                className={`tab-button ${activeTab === 'manage' ? 'active' : ''}`}
              >
                <ShieldCheckIcon className="w-5 h-5 mr-2" />
                Manage Casinos
              </button>
              <button
                onClick={() => setActiveTab('reorder')}
                className={`tab-button ${activeTab === 'reorder' ? 'active' : ''}`}
              >
                <GripVerticalIcon className="w-5 h-5 mr-2" />
                Reorder Rankings
              </button>
            </nav>

            {/* Tab Content */}
            <section className="tab-content">
              {activeTab === 'overview' && (
                <div className="overview-tab">
                  <div className="section-header">
                    <h2>Casino Overview</h2>
                    <p>Quick overview of your casino listings and performance metrics</p>
                  </div>
                  
                  <div className="overview-grid">
                    <div className="overview-card">
                      <h3>Recent Activity</h3>
                      <div className="activity-list">
                        {casinos.slice(0, 5).map(casino => (
                          <div key={casino.id} className="activity-item">
                            <img src={casino.logo} alt={casino.name} className="activity-logo" />
                            <div>
                              <div className="activity-name">{casino.name}</div>
                              <div className="activity-meta">Rank #{casino.rank} • Rating {casino.rating}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="overview-card">
                      <h3>Top Performers</h3>
                      <div className="performers-list">
                        {casinos.filter(c => c.rating >= 9.0).slice(0, 5).map(casino => (
                          <div key={casino.id} className="performer-item">
                            <span className="performer-rank">#{casino.rank}</span>
                            <span className="performer-name">{casino.name}</span>
                            <span className="performer-rating">{casino.rating}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

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
                      <PlusIcon className="w-5 h-5 mr-2" />
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
                                    <GripVerticalIcon className="w-5 h-5" />
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
                                      <ArrowUpIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => moveDown(casino.id)}
                                      disabled={casino.rank === casinos.length}
                                      className="btn btn-icon"
                                      title="Move Down"
                                    >
                                      <ArrowDownIcon className="w-4 h-4" />
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
      </div>
    </>
  );
} 