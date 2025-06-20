import React, { useState, useRef } from 'react';
import { supabase } from '../services/supabase';

const MAX_CHARS = 2000;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const MemoryPostForm = () => {
  const [formData, setFormData] = useState({
    content: '',
    author_name: '',
    image: null
  });
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const fileInputRef = useRef(null);

  const validateForm = () => {
    if (!formData.content.trim()) {
      setStatus({ type: 'error', message: 'Please share your memory' });
      return false;
    }
    if (!formData.author_name.trim()) {
      setStatus({ type: 'error', message: 'Please enter your name' });
      return false;
    }
    return true;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setStatus({
        type: 'error',
        message: 'Image must be less than 5MB'
      });
      fileInputRef.current.value = '';
      return;
    }

    if (!file.type.startsWith('image/')) {
      setStatus({
        type: 'error',
        message: 'Please select an image file'
      });
      fileInputRef.current.value = '';
      return;
    }

    setFormData(prev => ({ ...prev, image: file }));
    setStatus({ type: '', message: '' });
  };

  const uploadImage = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `memories/${fileName}`;

    const { data, error } = await supabase.storage
      .from('memories')
      .upload(filePath, file);

    if (error) throw error;

    return supabase.storage
      .from('memories')
      .getPublicUrl(filePath).data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      let imageUrl = null;
      if (formData.image) {
        imageUrl = await uploadImage(formData.image);
      }

      const { error } = await supabase
        .from('memories')
        .insert([{
          content: formData.content,
          author_name: formData.author_name,
          image_url: imageUrl
        }]);

      if (error) throw error;

      setStatus({
        type: 'success',
        message: 'Thank you for sharing your memory.'
      });
      setFormData({
        content: '',
        author_name: '',
        image: null
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setPreview(false);
    } catch (error) {
      console.error('Error:', error);
      setStatus({
        type: 'error',
        message: 'Failed to save your memory. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'content' && value.length > MAX_CHARS) return;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const togglePreview = () => {
    setPreview(!preview);
  };

  const remainingChars = MAX_CHARS - formData.content.length;

  return (
    <div className="memory-form-container">
      <form onSubmit={handleSubmit} className="memory-form">
        {!preview ? (
          <>
            <div className="form-group">
              <label htmlFor="author_name">Your Name *</label>
              <input
                type="text"
                id="author_name"
                name="author_name"
                value={formData.author_name}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="content">Your Memory *</label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows="6"
                disabled={loading}
                required
              />
              <div className="char-counter">
                {remainingChars} characters remaining
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="image">Add an Image (optional)</label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                disabled={loading}
                ref={fileInputRef}
              />
            </div>
          </>
        ) : (
          <div className="preview-container">
            <h3>Preview</h3>
            <div className="preview-content">
              <strong>{formData.author_name}</strong>
              <p>{formData.content}</p>
              {formData.image && (
                <img
                  src={URL.createObjectURL(formData.image)}
                  alt="Preview"
                  className="preview-image"
                />
              )}
            </div>
          </div>
        )}

        {status.message && (
          <div className={`status-message ${status.type}`}>
            {status.message}
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            onClick={togglePreview}
            disabled={loading}
          >
            {preview ? 'Edit' : 'Preview'}
          </button>
          <button
            type="submit"
            disabled={loading}
            className={loading ? 'loading' : ''}
          >
            {loading ? 'Saving...' : 'Share Memory'}
          </button>
        </div>
      </form>
    </div>
  );
};
