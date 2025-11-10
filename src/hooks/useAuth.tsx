import { createContext, useContext, type ReactNode, useState, useEffect } from 'react';
import { useCookie } from './useCookie';
import { jwtDecode } from "jwt-decode";
import { useToast } from '@chakra-ui/react';

interface JwtPayload {
    id: string;
    email: string;
    full_name?: string;
    rank?: string;
    role?: string;
    iat: number;
    exp: number;
}

interface AuthData {
    id: string;
    full_name: string;
    email: string;
    role?: string;
    rank?: string;
    token?: string;
}

interface AuthContextType {
    user: AuthData | null;
    token: string | null;
    setUser: (data: AuthData | null) => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const toast = useToast();
    const { getAccessToken, removeAccessToken } = useCookie();
    const [user, setUser] = useState<AuthData | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const logout = () => {
        removeAccessToken();
        setUser(null);
        setToken(null);
        setLoading(false);
    };

    useEffect(() => {
        const currentToken = getAccessToken();
        if (!currentToken || !user) return;

        const decoded = jwtDecode<JwtPayload>(currentToken);
        const timeUntilExpiry = (decoded.exp * 1000) - Date.now();

        if (timeUntilExpiry > 0) {
            const timeout = setTimeout(() => {
                logout();
            }, timeUntilExpiry);

            return () => clearTimeout(timeout);
        }
    }, [user, getAccessToken]);

    const validateSession = async () => {
        setLoading(true);
        try {
            const currentToken = getAccessToken();

            if (!currentToken) {
                throw new Error("No token found");
            }

            const decoded = jwtDecode<JwtPayload>(currentToken);

            if (decoded.exp * 1000 < Date.now()) {
                throw new Error("Token expired");
            }

            const userData = {
                id: decoded.id,
                full_name: decoded.full_name || '',
                email: decoded.email,
                role: decoded.role,
                rank: decoded.rank
            };

            setUser(userData);
            setToken(currentToken);

            return { success: true };
        } catch (error) {
            toast({
                title: "Session expired",
                description: "Please log in again.",
                status: "warning"
            });
            logout();
            return { success: false, error };
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        validateSession();
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            token,
            setUser,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};