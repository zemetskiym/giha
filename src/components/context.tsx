import React, { createContext, useState, ReactNode, useEffect, useContext } from 'react';

const windowSizeContext = createContext({height: 0, width: 0});

interface Props {
    children?: ReactNode
}

export function WindowSizeProvider({ children }: Props) {
    const [windowSize, setWindowSize] = useState({height: 0, width: 0});
    
    useEffect(() => {
        const handleResize = () => {
          setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
          });
        };
    
        window.addEventListener('resize', handleResize);

        handleResize();
    
        return () => {
          window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <windowSizeContext.Provider value={windowSize}>
            { children }
        </windowSizeContext.Provider>
    );
}

// Export a custom hook to consume the WindowSizeContext
export function useWindowSizeContext() {
    return useContext(windowSizeContext);
}