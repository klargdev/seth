import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

const REACTION_TYPES = ['like', 'love', 'prayer', 'flower'];

export const ReactionButtons = ({ postId, initialReactions = {} }) => {
  const [reactions, setReactions] = useState(initialReactions);
  const [userReaction, setUserReaction] = useState(null);

  useEffect(() => {
    const fetchUserReaction = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data } = await supabase
        .from('reactions')
        .select('type')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .single();
      
      if (data) setUserReaction(data.type);
    };

    fetchUserReaction();
  }, [postId]);

  const handleReaction = async (type) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (userReaction === type) {
      // Remove reaction
      await supabase
        .from('reactions')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id);
      
      setReactions(prev => ({
        ...prev,
        [type]: (prev[type] || 1) - 1
      }));
      setUserReaction(null);
    } else {
      if (userReaction) {
        // Change existing reaction
        await supabase
          .from('reactions')
          .update({ type })
          .eq('post_id', postId)
          .eq('user_id', user.id);
        
        setReactions(prev => ({
          ...prev,
          [userReaction]: (prev[userReaction] || 1) - 1,
          [type]: (prev[type] || 0) + 1
        }));
      } else {
        // Add new reaction
        await supabase
          .from('reactions')
          .insert({ post_id: postId, user_id: user.id, type });
        
        setReactions(prev => ({
          ...prev,
          [type]: (prev[type] || 0) + 1
        }));
      }
      setUserReaction(type);
    }
  };

  return (
    <div className="reaction-buttons">
      {REACTION_TYPES.map(type => (
        <button
          key={type}
          onClick={() => handleReaction(type)}
          className={userReaction === type ? 'active' : ''}
        >
          {type} {reactions[type] || 0}
        </button>
      ))}
    </div>
  );
};