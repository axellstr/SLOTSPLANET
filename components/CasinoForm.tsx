import { useState, useEffect, useRef } from 'react';
import { 
  RiCloseLine,
  RiSaveLine,
  RiAddLine,
  RiStarFill,
  RiShieldCheckLine,
  RiLineChartLine,
  RiBankCardLine,
  RiSettings4Line,
  RiInformationLine,
  RiUploadLine,
  RiImageLine
} from '@remixicon/react';
import { Casino } from '../lib/types';
import { getRankClass } from '../lib/casinoData';

interface CasinoFormProps {
  casino?: Casino | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (casino: Casino) => void;
  existingCasinos: Casino[];
}

export default function CasinoForm({ casino, isOpen, onClose, onSave, existingCasinos }: CasinoFormProps) {
  const [formData, setFormData] = useState<Partial<Casino>>({
    id: 0,
    rank: 1,
    rankClass: '',
    name: '',
    logo: '',
    rating: 9.0,
    stars: 5,
    url: '',
    isNew: false,
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
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (casino) {
      setFormData(casino);
      setLogoPreview(casino.logo);
    } else {
      // Reset form for new casino
      const nextRank = Math.max(...existingCasinos.map(c => c.rank), 0) + 1;
      setFormData(prev => ({
        ...prev,
        id: Date.now(),
        rank: nextRank,
        rankClass: getRankClass(nextRank)
      }));
      setLogoPreview(null);
    }
  }, [casino, existingCasinos]);

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof Casino] as object || {}),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }

    // Update rank class when rank changes
    if (field === 'rank') {
      setFormData(prev => ({
        ...prev,
        rankClass: getRankClass(value)
      }));
    }
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        handleInputChange('logo', result.url);
        setLogoPreview(result.url);
      } else {
        setErrors(prev => [...prev, result.error || 'Upload failed']);
      }
    } catch (error) {
      setErrors(prev => [...prev, 'Upload failed: ' + (error as Error).message]);
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type and size
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => [...prev, 'Invalid file type. Only images are allowed.']);
        return;
      }

      if (file.size > maxSize) {
        setErrors(prev => [...prev, 'File too large. Maximum size is 5MB.']);
        return;
      }

      handleFileUpload(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const validateForm = (): boolean => {
    const newErrors: string[] = [];
    if (!formData.url?.trim()) newErrors.push('Casino URL is required');
    if (!formData.rank || formData.rank < 1) newErrors.push('Valid rank is required');
    if (!formData.rating || formData.rating < 0 || formData.rating > 10) {
      newErrors.push('Rating must be between 0 and 10');
    }
    if (!formData.stars || formData.stars < 1 || formData.stars > 5) {
      newErrors.push('Stars must be between 1 and 5');
    }

    // Check for duplicate ranks (excluding current casino if editing)
    const duplicateRank = existingCasinos.find(c => 
      c.rank === formData.rank && c.id !== formData.id
    );
    if (duplicateRank) {
      newErrors.push(`Rank ${formData.rank} is already taken by ${duplicateRank.name}`);
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData as Casino);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="casino-form-overlay">
      <div className="casino-form-modal">
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-section">
                      <div className="modal-icon">
            {casino ? <RiSettings4Line className="w-6 h-6" /> : <RiAddLine className="w-6 h-6" />}
          </div>
            <div>
              <h2 className="modal-title">
                {casino ? 'Edit Casino' : 'Add New Casino'}
              </h2>
              <p className="modal-subtitle">
                {casino ? 'Update casino information and settings' : 'Create a new casino listing with all details'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <RiCloseLine className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="modal-content">
          <form onSubmit={handleSubmit} className="casino-form">
            {/* Error Messages */}
            {errors.length > 0 && (
              <div className="error-container">
                <div className="error-icon">
                  <RiInformationLine className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="error-title">Please fix the following errors:</h3>
                  <ul className="error-list">
                    {errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Desktop Two-Column Layout */}
            <div className="form-layout-desktop">
              {/* Left Column */}
              <div className="form-column-left">
                {/* Basic Information Section */}
                <div className="form-section">
                  <div className="section-header">
                    <div className="section-icon">
                      <RiInformationLine className="w-5 h-5" />
                    </div>
                    <h3 className="section-title">Basic Information</h3>
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-group form-group-full">
                      <label className="form-label">
                        Casino Logo
                      </label>
                      
                      {/* Logo Preview */}
                      {logoPreview && (
                        <div className="logo-preview">
                          <img 
                            src={logoPreview} 
                            alt="Logo preview" 
                            className="logo-preview-img"
                          />
                        </div>
                      )}
                      
                      {/* Upload Interface */}
                      <div className="logo-upload-section">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden-file-input"
                        />
                        
                        <button
                          type="button"
                          onClick={triggerFileUpload}
                          disabled={uploading}
                          className="upload-btn"
                        >
                          {uploading ? (
                            <>
                              <div className="upload-spinner"></div>
                              Uploading...
                            </>
                          ) : (
                            <>
                              <RiUploadLine className="w-4 h-4 mr-2" />
                              Upload Logo
                            </>
                          )}
                        </button>
                      </div>
                      
                      <p className="upload-hint">
                        Upload an image file (max 5MB)
                      </p>
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Casino URL *
                      </label>
                      <input
                        type="url"
                        value={formData.url || ''}
                        onChange={(e) => handleInputChange('url', e.target.value)}
                        className="form-input"
                        placeholder="https://casino-website.com"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Rank *
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.rank || ''}
                        onChange={(e) => handleInputChange('rank', parseInt(e.target.value))}
                        className="form-input"
                        placeholder="1"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Rating (0-10) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={formData.rating || ''}
                        onChange={(e) => handleInputChange('rating', parseFloat(e.target.value))}
                        className="form-input"
                        placeholder="9.5"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Stars (1-5) *
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={formData.stars || ''}
                        onChange={(e) => handleInputChange('stars', parseInt(e.target.value))}
                        className="form-input"
                        placeholder="5"
                      />
                    </div>
                  </div>
                </div>

                {/* Status & Features Section */}
                <div className="form-section">
                  <div className="section-header">
                    <div className="section-icon">
                      <RiShieldCheckLine className="w-5 h-5" />
                    </div>
                    <h3 className="section-title">Status & Features</h3>
                  </div>
                  
                  <div className="checkbox-grid">
                    <div className="checkbox-item">
                      <input
                        type="checkbox"
                        id="isNew"
                        checked={formData.isNew || false}
                        onChange={(e) => handleInputChange('isNew', e.target.checked)}
                        className="form-checkbox"
                      />
                      <label htmlFor="isNew" className="checkbox-label">
                        <RiLineChartLine className="w-4 h-4" />
                        Mark as NEW
                      </label>
                    </div>

                    <div className="checkbox-item">
                      <input
                        type="checkbox"
                        id="hasVPN"
                        checked={formData.hasVPN || false}
                        onChange={(e) => handleInputChange('hasVPN', e.target.checked)}
                        className="form-checkbox"
                      />
                      <label htmlFor="hasVPN" className="checkbox-label">
                        <RiShieldCheckLine className="w-4 h-4" />
                        Requires VPN
                      </label>
                    </div>

                    <div className="checkbox-item">
                      <input
                        type="checkbox"
                        id="quickWithdrawals"
                        checked={formData.features?.quickWithdrawals || false}
                        onChange={(e) => handleInputChange('features.quickWithdrawals', e.target.checked)}
                        className="form-checkbox"
                      />
                      <label htmlFor="quickWithdrawals" className="checkbox-label">
                        <RiBankCardLine className="w-4 h-4" />
                        Quick Withdrawals
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="form-column-right">
                {/* Bonus Information Section */}
                <div className="form-section">
                  <div className="section-header">
                    <div className="section-icon">
                      <RiBankCardLine className="w-5 h-5" />
                    </div>
                    <h3 className="section-title">Bonus Information</h3>
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">
                        Bonus Percentage
                      </label>
                      <input
                        type="text"
                        value={formData.bonus?.percentage || ''}
                        onChange={(e) => handleInputChange('bonus.percentage', e.target.value)}
                        className="form-input"
                        placeholder="100%"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Max Amount
                      </label>
                      <input
                        type="text"
                        value={formData.bonus?.maxAmount || ''}
                        onChange={(e) => handleInputChange('bonus.maxAmount', e.target.value)}
                        className="form-input"
                        placeholder="500$"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Promo Code
                      </label>
                      <input
                        type="text"
                        value={formData.bonus?.promoCode || ''}
                        onChange={(e) => handleInputChange('bonus.promoCode', e.target.value)}
                        className="form-input"
                        placeholder="BONUS100"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Wager Requirement
                      </label>
                      <input
                        type="text"
                        value={formData.bonus?.wager || ''}
                        onChange={(e) => handleInputChange('bonus.wager', e.target.value)}
                        className="form-input"
                        placeholder="30x"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Free Spins
                      </label>
                      <input
                        type="text"
                        value={formData.bonus?.freeSpins || ''}
                        onChange={(e) => handleInputChange('bonus.freeSpins', e.target.value)}
                        className="form-input"
                        placeholder="100"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Verification
                      </label>
                      <select
                        value={formData.bonus?.verification || ''}
                        onChange={(e) => handleInputChange('bonus.verification', e.target.value)}
                        className="form-select"
                      >
                        <option value="Χωρις">Χωρις</option>
                        <option value="Απαιτειται">Απαιτειται</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Additional Settings Section */}
                <div className="form-section">
                  <div className="section-header">
                    <div className="section-icon">
                      <RiSettings4Line className="w-5 h-5" />
                    </div>
                    <h3 className="section-title">Additional Settings</h3>
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">
                        Button Text
                      </label>
                      <input
                        type="text"
                        value={formData.buttonText || ''}
                        onChange={(e) => handleInputChange('buttonText', e.target.value)}
                        className="form-input"
                        placeholder="Claim Bonus"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Withdrawal Text
                      </label>
                      <input
                        type="text"
                        value={formData.features?.withdrawalText || ''}
                        onChange={(e) => handleInputChange('features.withdrawalText', e.target.value)}
                        className="form-input"
                        placeholder="Quick Withdrawals"
                      />
                    </div>

                    <div className="form-group form-group-full">
                      <label className="form-label">
                        VPN Tooltip
                      </label>
                      <textarea
                        value={formData.vpnTooltip || ''}
                        onChange={(e) => handleInputChange('vpnTooltip', e.target.value)}
                        className="form-textarea"
                        placeholder="VPN recommendation text..."
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="form-actions">
              <button type="button" onClick={onClose} className="btn-cancel">
                Cancel
              </button>
              <button type="submit" className="btn-submit">
                <RiSaveLine className="w-4 h-4 mr-2" />
                {casino ? 'Update Casino' : 'Add Casino'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 