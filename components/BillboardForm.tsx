import { useState, useEffect } from 'react';
import { Billboard } from '../lib/types';
import { RiCloseLine, RiSaveLine, RiImageLine, RiUploadLine } from '@remixicon/react';

interface BillboardFormProps {
  billboard: Billboard | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (billboard: Billboard) => void;
  existingBillboards: Billboard[];
}

export default function BillboardForm({
  billboard,
  isOpen,
  onClose,
  onSave,
  existingBillboards
}: BillboardFormProps) {
  const [formData, setFormData] = useState<Billboard>({
    id: 0,
    title: '',
    subtitle: '',
    description: '',
    buttonText: '',
    buttonUrl: '',
    backgroundImage: '',
    isActive: true,
    order: 1
  });
  const [imageUploading, setImageUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (billboard) {
      setFormData(billboard);
    } else {
      // Set default values for new billboard
      const maxOrder = Math.max(...existingBillboards.map(b => b.order), 0);
      const maxId = Math.max(...existingBillboards.map(b => b.id), 0);
      
      setFormData({
        id: maxId + 1,
        title: '',
        subtitle: '',
        description: '',
        buttonText: 'Learn More',
        buttonUrl: '#',
        backgroundImage: '/Assets/place.svg',
        isActive: true,
        order: maxOrder + 1
      });
    }
    setErrors({});
  }, [billboard, existingBillboards, isOpen]);

  const handleInputChange = (field: keyof Billboard, value: string | boolean | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleImageUpload = async (file: File) => {
    setImageUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('type', 'billboard');

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (result.success) {
        handleInputChange('backgroundImage', result.url);
      } else {
        console.error('Upload failed:', result.error);
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setImageUploading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.subtitle.trim()) {
      newErrors.subtitle = 'Subtitle is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.buttonText.trim()) {
      newErrors.buttonText = 'Button text is required';
    }

    if (!formData.buttonUrl.trim()) {
      newErrors.buttonUrl = 'Button URL is required';
    }

    if (!formData.backgroundImage.trim()) {
      newErrors.backgroundImage = 'Background image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSave(formData);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content billboard-form-modal">
        <div className="modal-header">
          <h2>{billboard ? 'Edit Billboard' : 'Add New Billboard'}</h2>
          <button onClick={onClose} className="btn btn-icon">
            <RiCloseLine className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="billboard-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={errors.title ? 'error' : ''}
                placeholder="e.g., Exclusive Welcome Bonus"
                maxLength={100}
              />
              {errors.title && <span className="error-message">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="subtitle">Subtitle *</label>
              <input
                type="text"
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) => handleInputChange('subtitle', e.target.value)}
                className={errors.subtitle ? 'error' : ''}
                placeholder="e.g., Get up to €500 + 200 Free Spins"
                maxLength={150}
              />
              {errors.subtitle && <span className="error-message">{errors.subtitle}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={errors.description ? 'error' : ''}
              placeholder="Detailed description of the offer or promotion..."
              rows={3}
              maxLength={300}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="buttonText">Button Text *</label>
              <input
                type="text"
                id="buttonText"
                value={formData.buttonText}
                onChange={(e) => handleInputChange('buttonText', e.target.value)}
                className={errors.buttonText ? 'error' : ''}
                placeholder="e.g., Claim Now"
                maxLength={50}
              />
              {errors.buttonText && <span className="error-message">{errors.buttonText}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="buttonUrl">Button URL *</label>
              <input
                type="url"
                id="buttonUrl"
                value={formData.buttonUrl}
                onChange={(e) => handleInputChange('buttonUrl', e.target.value)}
                className={errors.buttonUrl ? 'error' : ''}
                placeholder="https://example.com or #"
              />
              {errors.buttonUrl && <span className="error-message">{errors.buttonUrl}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Background Image *</label>
            <div className="image-upload-section">
              <div className="current-image">
                {formData.backgroundImage && (
                  <img 
                    src={formData.backgroundImage} 
                    alt="Background preview" 
                    className="image-preview"
                  />
                )}
              </div>
              
              <div className="image-upload-controls">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="file-input"
                  id="backgroundImage"
                  disabled={imageUploading}
                />
                <label htmlFor="backgroundImage" className="btn btn-secondary">
                  {imageUploading ? (
                    <>
                      <div className="upload-spinner"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <RiUploadLine className="w-4 h-4 mr-2" />
                      Upload New Image
                    </>
                  )}
                </label>
                
                <input
                  type="text"
                  value={formData.backgroundImage}
                  onChange={(e) => handleInputChange('backgroundImage', e.target.value)}
                  className={errors.backgroundImage ? 'error' : ''}
                  placeholder="Or enter image URL"
                />
              </div>
            </div>
            {errors.backgroundImage && <span className="error-message">{errors.backgroundImage}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="order">Display Order</label>
              <input
                type="number"
                id="order"
                value={formData.order}
                onChange={(e) => handleInputChange('order', parseInt(e.target.value) || 1)}
                min="1"
                max="10"
              />
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
                />
                <span className="checkbox-custom"></span>
                Active (visible on site)
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <RiSaveLine className="w-4 h-4 mr-2" />
              {billboard ? 'Update Billboard' : 'Create Billboard'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 