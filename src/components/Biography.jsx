import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export const Biography = () => {
  const [biography, setBiography] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBiography = async () => {
      const { data, error } = await supabase
        .from('biography')
        .select('content')
        .single();
      
      if (!error && data) {
        setBiography(data.content);
      }
      setLoading(false);
    };

    fetchBiography();
  }, []);

  if (loading) return <div>Loading biography...</div>;

  return (
    <div className="biography-section">
      <h2>Biography</h2>
      <div dangerouslySetInnerHTML={{ __html: biography }} />
    </div>
  );
};