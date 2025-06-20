import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export const ProgramOutline = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPrintView, setShowPrintView] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('program_schedule')
        .select('*')
        .order('event_date', { ascending: true });

      if (error) throw error;

      // Group events by day
      const grouped = data.reduce((acc, event) => {
        const date = new Date(event.event_date).toLocaleDateString();
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(event);
        return acc;
      }, {});

      setEvents(grouped);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to load the program schedule.');
    } finally {
      setLoading(false);
    }
  };

  const togglePrintView = () => {
    setShowPrintView(!showPrintView);
    if (!showPrintView) {
      setTimeout(() => {
        window.print();
      }, 100);
    }
  };

  if (loading) {
    return <div className="loading-indicator">Loading program schedule...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className={`program-outline ${showPrintView ? 'print-view' : ''}`}>
      <div className="program-header">
        <h2>Program Schedule</h2>
        <button
          onClick={togglePrintView}
          className="print-button"
        >
          {showPrintView ? 'Exit Print View' : 'Print Schedule'}
        </button>
      </div>

      {Object.entries(events).map(([date, dayEvents]) => (
        <div key={date} className="program-day">
          <h3 className="day-header">{date}</h3>
          
          <div className="events-list">
            {dayEvents.map(event => (
              <div key={event.id} className="event-card">
                <div className="event-time">
                  {new Date(event.event_date).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>

                <div className="event-details">
                  <h4 className="event-title">{event.title}</h4>
                  
                  {event.description && (
                    <p className="event-description">{event.description}</p>
                  )}
                  
                  <p className="event-location">
                    <strong>Location: </strong>
                    {event.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {Object.keys(events).length === 0 && (
        <p className="no-events">
          No events have been scheduled yet.
        </p>
      )}

      <style jsx>{`
        @media print {
          .program-outline:not(.print-view) {
            display: none;
          }
          
          .print-button {
            display: none;
          }

          .program-outline.print-view {
            padding: 20px;
          }

          .event-card {
            break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
};
