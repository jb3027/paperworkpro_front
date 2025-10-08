// Modern Kinde Authentication Hook
import { useKindeAuth as useKindeAuthSDK } from '@kinde-oss/kinde-auth-nextjs';

interface Kindeuser {
    id: string;
    email: string;
    given_name?: string;
    family_name?: string;
}

export const useKindeAuth = () => {
    const { 
        isAuthenticated, 
        user, 
        isLoading
    } = useKindeAuthSDK();

    return {
        kinde: null, // Not needed for modern SDK
        isAuthenticated,
        user: user as Kindeuser | null,
        loading: isLoading,
        error: null,
        // Note: For Next.js SDK, use LoginLink, RegisterLink, and LogoutLink components instead
        // of these functions. Import them from '@kinde-oss/kinde-auth-nextjs/components'
        login: () => {
            console.warn('Use LoginLink component from @kinde-oss/kinde-auth-nextjs/components instead of login function');
        },
        register: () => {
            console.warn('Use RegisterLink component from @kinde-oss/kinde-auth-nextjs/components instead of register function');
        },
        logout: () => {
            console.warn('Use LogoutLink component from @kinde-oss/kinde-auth-nextjs/components instead of logout function');
        },
        clearError: () => {} // Not needed for modern SDK
    };
};
