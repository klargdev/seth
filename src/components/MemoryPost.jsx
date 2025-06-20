import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { ReactionButtons } from './ReactionButtons';

export const MemoryPost = ({ post, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);

  const handleUpdate = async () => {
    const { error } = await supabase
      .from('memories')
      .update({ content: editedContent })
      .eq('id', post.id);
    
    if (!error) {
      onUpdate();
      setIsEditing(false);
    }
  };

  return (
    <div className="memory-post">
      <div className="post-header">
        <span className="author">{post.author_name || 'Anonymous'}</span>
        <span className="date">
          {new Date(post.created_at).toLocaleString()}
        </span>
      </div>
      
      {isEditing ? (
        <div className="edit-form">
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div className="post-content">{post.content}</div>
      )}
      
      <ReactionButtons postId={post.id} initialReactions={post.reactions} />
      
      {post.is_owner && !isEditing && (
        <div className="post-actions">
          <button onClick={() => setIsEditing(true)}>Edit</button>
        </div>
      )}
    </div>
  );
};