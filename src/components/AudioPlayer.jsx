import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export const AudioPlayer = () => {
  const [audioUrl, setAudioUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(true);
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    // Fetch audio URL from Supabase storage
    const fetchAudio = async () => {
      const { data } = await supabase
        .from('config')
        .select('audio_url')
        .single();
      if (data) setAudioUrl(data.audio_url);
    };

    fetchAudio();
  }, []);

  useEffect(() => {
    if (!audioUrl) return;

    const audioObj = new Audio(audioUrl);
    setAudio(audioObj);

    if (isPlaying) {
      audioObj.play().catch(e => console.error("Audio play failed:", e));
    }

    return () => {
      if (audioObj) {
        audioObj.pause();
        audioObj.currentTime = 0;
      }
    };
  }, [audioUrl, isPlaying]);

  const togglePlay = () => {
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play().catch(e => console.error("Audio play failed:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="audio-player">
      <button onClick={togglePlay}>
        {isPlaying ? 'Pause Memorial Music' : 'Play Memorial Music'}
      </button>
    </div>
  );
};