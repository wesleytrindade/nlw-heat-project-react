import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";

interface User {
    id: string;
    name: string;
    login: string;
    avatar_url: string;
}

interface AuthResponse {
    token: string;
    user: {
        id: string,
        avatar_url: string,
        name: string,
        login: string
    }
}

interface AuthContextData {
    user: User | null;
    signInUrl: string;
    signOut: () => void;
}

export const AuthContext = createContext({} as AuthContextData);

interface AuthProviderProps {
    children: ReactNode;
}

const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=0f13478465465cc5977b`

export function AuthProvider(props: AuthProviderProps) {

    const [user, setUser] = useState<User | null>(null);

    async function signIn(gitHubCode: string) {
        const response = await api.post<AuthResponse>("authenticate", {
            code: gitHubCode
        });

        const { token, user } = response.data;

        localStorage.setItem('@dowhile:token', token);

        api.defaults.headers.common.authorization = `Bearer ${token}`;

        setUser(user);
    }

    function signOut() {
        setUser(null);
        localStorage.removeItem('@dowhile:token');
    }

    useEffect(() => {
        const token = localStorage.getItem('@dowhile:token');

        if (token) {

            api.defaults.headers.common.authorization = `Bearer ${token}`;
            api.get<User>('profile').then(response => {
                setUser(response.data);
            })
        }
    }, []);

    useEffect(() => {
        const url = window.location.href;
        const hasGithubCode = url.includes('?code=');

        if (hasGithubCode) {
            const [urlWithoutCode, code] = url.split('?code=')

            window.history.pushState({}, '', urlWithoutCode);
            signIn(code);
        }
    }, []);


    return (
        <AuthContext.Provider value={{ signInUrl, user, signOut }}>
            {props.children}
        </AuthContext.Provider>
    )
}