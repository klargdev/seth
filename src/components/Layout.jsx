import React from 'react';
import { AudioPlayer } from './AudioPlayer';
import '../styles/global.css';

export const Layout = ({ children }) => {
  return (
    <div className="app-container">
      <AudioPlayer />
      <main>{children}</main>
    </div>
  );
};