// LOGIN AUTHORISATION AND HANDLING

import { useState, useEffect, useCallback } from 'react';

// Declare global Kinde client function
declare global {
    function createKindeClient(config: any): Promise<any>;
}

interface Kindeuser {
    id: string;
    email: string;
    given_name?: string;
    family_name?: string;
    // ADD OTHER PROPERTIES NEEDED
}

interface KindeAuthState {
    kinde: any; //might need more
    isAuthenticated: boolean;
    user: Kindeuser | null;
    loading: boolean;
    error: string | null;
}

export const useKindeAuth = () => {
    const [kinde, setKinde] = useState<any>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<Kindeuser | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const getStoredAuthState = () => {
        const storedAuth = sessionStorage.getItem('isKindeLoggedIn');
        const storedUser = sessionStorage.getItem('kindeUser');

        return {
            isAuthenticated: storedAuth === 'true',
            user: storedUser ? JSON.parse(storedUser) : null
        };
    };

    const updateStoredAuthState = (isAuth: boolean, userData: Kindeuser | null) => {
        sessionStorage.setItem('isKindeLoggedIn', isAuth.toString());
        if(userData) {
            sessionStorage.setItem('kindeUser', JSON.stringify(userData));
        } else {
            sessionStorage.removeItem('kindeUser');
        }
    };

    const getUrlParams = () => {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            code: urlParams.get('code'),
            state: urlParams.get('state')
        };
    };

    // Step 8: Convert handleAuthRedirect Function
    const handleAuthRedirect = useCallback(async () => {
        const { code, state } = getUrlParams();
        
        if (code && state) {
            // Clear URL parameters
            window.history.replaceState({}, document.title, window.location.pathname);
            
            // Wait for Kinde to process
            await new Promise(resolve => setTimeout(resolve, 100));
            
            try {
                if (kinde) {
                    const isAuth = await kinde.isAuthenticated();
                    if (isAuth) {
                        const userData = await kinde.getUser();
                        if (userData) {
                            handleAuthentication(userData);
                            return true;
                        }
                    }
                }
            } catch (error) {
                console.error('Error handling auth redirect:', error);
                setError('Authentication redirect failed');
            }
        }
        return false;
    }, [kinde]);

    // Step 9: Convert handleAuthentication Function
    const handleAuthentication = useCallback((userData: Kindeuser) => {
        setUser(userData);
        setIsAuthenticated(true);
        setError(null);
        updateStoredAuthState(true, userData);
    }, []);

    // Step 10: Convert Login Function
    const login = useCallback(async () => {
        try {
            if (!kinde) {
                setError('Kinde client not initialized');
                return;
            }
            await kinde.login();
        } catch (error) {
            console.error('Login error:', error);
            setError('Login failed');
        }
    }, [kinde]);

    // Step 11: Convert Register Function
    const register = useCallback(async () => {
        try {
            if (!kinde) {
                setError('Kinde client not initialized');
                return;
            }
            await kinde.register();
        } catch (error) {
            console.error('Register error:', error);
            setError('Registration failed');
        }
    }, [kinde]);

    // Step 12: Convert Logout Function
    const logout = useCallback(async () => {
        try {
            if (kinde) {
                await kinde.logout();
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Always clear state
            setUser(null);
            setIsAuthenticated(false);
            updateStoredAuthState(false, null);
        }
    }, [kinde]);

    // Step 13: Create Initialization Function
    const initializeKinde = useCallback(async () => {
        try {
            if (typeof createKindeClient === 'undefined') {
                setError('Kinde SDK not loaded');
                setLoading(false);
                return;
            }

            const kindeClient = await createKindeClient({
                client_id: "059f84ab1651486382d0b77e79fb01d3",
                domain: "https://gaialith.kinde.com",
                redirect_uri: window.location.origin,
                on_redirect_callback: (user: Kindeuser, appState: any) => {
                    if (user) {
                        handleAuthentication(user);
                    }
                }
            });

            setKinde(kindeClient);
        } catch (error) {
            console.error('Error initializing Kinde client:', error);
            setError('Failed to initialize authentication');
        }
    }, [handleAuthentication]);

    // Step 14: Create Auth Check Function
    const checkAuthentication = useCallback(async () => {
        if (!kinde) return;

        try {
            const isAuth = await kinde.isAuthenticated();
            if (isAuth) {
                const userData = await kinde.getUser();
                if (userData) {
                    handleAuthentication(userData);
                    return;
                }
            }
        } catch (error) {
            console.warn('Kinde authentication check failed:', error);
        }

        // Fallback to stored state
        const stored = getStoredAuthState();
        if (stored.isAuthenticated && stored.user) {
            setUser(stored.user);
            setIsAuthenticated(true);
        }
    }, [kinde, handleAuthentication]);

    // Step 15: Create Main Initialization Effect
    useEffect(() => {
        const initialize = async () => {
            await initializeKinde();
            const redirectHandled = await handleAuthRedirect();
            
            if (!redirectHandled) {
                await checkAuthentication();
            }
            
            setLoading(false);
        };

        initialize();
    }, [initializeKinde, handleAuthRedirect, checkAuthentication]);

    // Step 16: Return Hook Interface
    return {
        kinde,
        isAuthenticated,
        user,
        loading,
        error,
        login,
        register,
        logout,
        clearError: () => setError(null)
    };
};
