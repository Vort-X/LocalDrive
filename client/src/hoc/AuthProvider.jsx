import { createContext, useState } from "react";

export const AuthContext = createContext(null); 

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const signin = (newUser, callbackfn) => {
        setUser(newUser);
        window.sessionStorage.setItem('token', newUser.access_token);
        callbackfn();
    }

    const signout = () => {
        setUser(null);
        window.sessionStorage.removeItem('token');
    }

    const value = {user, signin, signout};

    return <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
}