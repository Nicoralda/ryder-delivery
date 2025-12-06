import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleTheme = () => setIsDarkMode(prev => !prev);

    const theme = {
        isDarkMode,
        toggleTheme,
        colors: isDarkMode
            ? {
                primary: '#00A89C',
                danger: '#d9534f',
                background: '#2d3142',
                card: '#022b3a',
                text: '#ffffff',
                subText: '#cccccc',
            }
            : {
                primary: '#00A89C',
                danger: '#d9534f',
                background: '#f5f5f5',
                card: '#ffffff',
                text: '#333333',
                subText: '#666666',
            },
    };

    return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);