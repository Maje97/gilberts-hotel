import { createContext, useState, ReactNode, useEffect } from 'react';

type User = {
    id: number;
    username: string;
    role: string;
    token: string;
};

type AuthContextType = {
    user: User | null;
    login: (newUser: User) => void;
    logout: () => void;
};

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('authUser');
        if (storedUser) {
            const userInfoParsed = JSON.parse(storedUser);
            setUser(userInfoParsed);
        }
    }, []);

    const login = (newUser: User) => {
        setUser(newUser);
        const userInfoStringified = JSON.stringify(newUser);
        localStorage.setItem('authUser', userInfoStringified);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('authUser');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
        {children}
        </AuthContext.Provider>
    );
};