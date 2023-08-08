import React, { createContext, useState, ReactNode, useEffect, useContext } from 'react';

const darkModeContext = createContext(false);

interface Props {
    children?: ReactNode
};

export function DarkModeProvider({ children }: Props) {
    const [darkMode, setDarkMode] = useState(false);

    return (
        <darkModeContext.Provider value={darkMode}>
            { children }
        </darkModeContext.Provider>
    );
};

// Export a custom hook to consume the WindowSizeContext
export function useDarkModeContext() {
    return useContext(darkModeContext);
};
