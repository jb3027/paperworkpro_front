// Step 17: Create Auth Context for global auth state
import React, { createContext, useContext } from 'react';
import { useKindeAuth } from './hooks/useKindeAuth';

// Define the context type
type KindeAuthContextType = ReturnType<typeof useKindeAuth>;

const KindeAuthContext = createContext<KindeAuthContextType | null>(null);

// Provider component
export const KindeAuthProvider = ({ children }: { children: React.ReactNode }) => {
    const auth = useKindeAuth();
    
    return (
        <KindeAuthContext.Provider value={auth}>
            {children}
        </KindeAuthContext.Provider>
    );
};

// Hook to use the context
export const useKindeAuthContext = () => {
    const context = useContext(KindeAuthContext);
    if (!context) {
        throw new Error('useKindeAuthContext must be used within KindeAuthProvider');
    }
    return context;
};
