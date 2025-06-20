import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

const ITEMS_PER_PAGE = 10;

export const TributeList = () => {
  const [tributes, setTributes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchTributes();
    fetchTotalCount();
  }, [page, sortBy]);

  const fetchTotalCount = async () => {
    const { count, error } = await supabase
      .from('tributes')
      .select('*', { count: 'exact', head: true });

    if (!error) {
      setTotalCount(count);
    }
  };

  const fetchTributes = async () => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('tributes')
        .select('*')
        .range(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE - 1);

      if (sortBy === 'newest') {
        query = query.order('created_at', { ascending: false });
      } else if (sortBy === 'oldest') {
        query = query.order('created_at', { ascending: true });
      }

      const { data, error } = await query;

      if (error) throw error;

      setTributes(prev => page === 0 ? data : [...prev, ...data]);
      setHasMore(data.length === ITEMS_PER_PAGE);
    } catch (error) {
      console.error('Error fetching tributes:', error);
      setError('Failed to load tributes. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(0);
    setTributes([]);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="tribute-list-container">
      <div className="tribute-header">
        <h2>Tributes ({totalCount})</h2>
        <select
          value={sortBy}
          onChange={handleSortChange}
          className="sort-select"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      <div className="tributes-grid">
        {tributes.map(tribute => (
          <article key={tribute.id} className="tribute-card">
            <header className="tribute-card-header">
              <h3>{tribute.author_name}</h3>
              <time>
                {new Date(tribute.created_at).toLocaleDateString()}
              </time>
            </header>

            {tribute.image_url && (
              <div className="tribute-image">
                <img
                  src={tribute.image_url}
                  alt={`Tribute from ${tribute.author_name}`}
                  loading="lazy"
                />
              </div>
            )}

            <div className="tribute-content">
              {tribute.content}
            </div>
          </article>
        ))}
      </div>

      {loading && (
        <div className="loading-indicator">Loading tributes...</div>
      )}

      {!loading && hasMore && (
        <button
          onClick={loadMore}
          className="load-more-button"
        >
          Load More Tributes
        </button>
      )}

      {!loading && !hasMore && tributes.length > 0 && (
        <p className="no-more-tributes">
          No more tributes to load.
        </p>
      )}

      {!loading && tributes.length === 0 && (
        <p className="no-tributes">
          No tributes have been shared yet.
        </p>
      )}
    </div>
  );
};
