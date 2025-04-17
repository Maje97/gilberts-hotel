import { createContext, useState, ReactNode, useEffect } from 'react';

type AuthContextType = {
    role: string | null;
    token: string | null;
    login: (role: string, token: string) => void;
    logout: () => void;
};

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        const storedRole = localStorage.getItem('authRole');
        if (storedToken) {
            setToken(storedToken);
        }
        if (storedRole) {
            setRole(storedRole);
        }
    }, []);

    const login = (newRole: string, newToken: string) => {
        setToken(newToken);
        setRole(newRole);
        localStorage.setItem('authToken', newToken);
        localStorage.setItem('authRole', newRole);
    };

    const logout = () => {
        setToken(null);
        setRole(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('authRole');
    };

    return (
        <AuthContext.Provider value={{ role, token, login, logout }}>
        {children}
        </AuthContext.Provider>
    );
};