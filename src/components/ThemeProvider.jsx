import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState({
    primary: '#4a6fa5',
    secondary: '#166088',
    background: '#f8f9fa',
    text: '#333333',
    accent: '#d83367',
  });

  useEffect(() => {
    // Apply theme to CSS variables
    document.documentElement.style.setProperty('--primary', theme.primary);
    document.documentElement.style.setProperty('--secondary', theme.secondary);
    document.documentElement.style.setProperty('--background', theme.background);
    document.documentElement.style.setProperty('--text', theme.text);
    document.documentElement.style.setProperty('--accent', theme.accent);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};