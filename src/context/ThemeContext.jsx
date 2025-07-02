import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const theme = {
    colors: {
      // Gold color palette
      primary: {
        50: isDarkMode ? '#fefdf8' : '#fefdf8',
        100: isDarkMode ? '#fef9e7' : '#fef9e7',
        200: isDarkMode ? '#fef3c7' : '#fef3c7',
        300: isDarkMode ? '#fde68a' : '#fde68a',
        400: isDarkMode ? '#fcd34d' : '#fcd34d',
        500: isDarkMode ? '#f59e0b' : '#d97706',
        600: isDarkMode ? '#d97706' : '#b45309',
        700: isDarkMode ? '#b45309' : '#92400e',
        800: isDarkMode ? '#92400e' : '#78350f',
        900: isDarkMode ? '#78350f' : '#451a03',
      },
      background: {
        primary: isDarkMode ? '#0f172a' : '#ffffff',
        secondary: isDarkMode ? '#1e293b' : '#f8fafc',
        tertiary: isDarkMode ? '#334155' : '#f1f5f9',
      },
      text: {
        primary: isDarkMode ? '#f8fafc' : '#0f172a',
        secondary: isDarkMode ? '#cbd5e1' : '#475569',
        tertiary: isDarkMode ? '#94a3b8' : '#64748b',
      },
      border: {
        primary: isDarkMode ? '#374151' : '#e2e8f0',
        secondary: isDarkMode ? '#4b5563' : '#cbd5e1',
      }
    },
    isDarkMode,
    toggleDarkMode
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};
