import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export const Gallery = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (!error) {
        setMedia(data || []);
      }
      setLoading(false);
    };

    fetchGallery();
  }, []);

  if (loading) return <div>Loading gallery...</div>;

  return (
    <div className="gallery-section">
      <h2>Gallery</h2>
      <div className="gallery-grid">
        {media.map((item) => (
          <div key={item.id} className="gallery-item">
            {item.type === 'image' ? (
              <img 
                src={item.url} 
                alt={item.caption || 'Memorial image'} 
                loading="lazy"
              />
            ) : (
              <video controls>
                <source src={item.url} type={`video/${item.format || 'mp4'}`} />
              </video>
            )}
            {item.caption && <p>{item.caption}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};