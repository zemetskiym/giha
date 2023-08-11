import React, { createContext, useState, ReactNode, useEffect, useContext } from 'react';

interface DarkModeContextType {
    darkMode: boolean;
    setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
};

const darkModeContext = createContext<DarkModeContextType | undefined>(undefined);

interface Props {
    children?: ReactNode;
};

export function DarkModeProvider({ children }: Props) {
    const [darkMode, setDarkMode] = useState(false);

    return (
        <darkModeContext.Provider value={{ darkMode, setDarkMode }}>
            {children}
        </darkModeContext.Provider>
    );
};

// Export a custom hook to consume the DarkModeContext
export function useDarkModeContext() {
    const context = useContext(darkModeContext);
    if (context === undefined) {
        throw new Error('useDarkModeContext must be used within a DarkModeProvider');
    };
    return context;
};
