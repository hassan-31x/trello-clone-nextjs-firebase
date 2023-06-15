import { useState, createContext, ReactNode } from 'react';
import { auth } from '../config/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
// import { auth, provider } from '../config/firebaseConfig';
// import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, signInWithPopup } from 'firebase/auth';

interface AuthContextValue {
  register: (inputs: { email: string; password: string }) => Promise<void>;
  login: (inputs: { email: string; password: string }) => Promise<void>;
}

export const AuthContext = createContext();

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
    const [user, setUser] = useState({})

    onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser)
    })

  const register = async (inputs: { email: string; password: string }) => {
    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        inputs.email,
        inputs.password
      );
      console.log(user);
    } catch (err: any) {
      console.log(err.message);
    }
  };

  const login = async (inputs: { email: string; password: string }) => {
    try {
      const user = await signInWithEmailAndPassword(
        auth,
        inputs.email,
        inputs.password
      );
      console.log(user);
    } catch (err: any) {
      console.log(err.message);
    }
  };
  


  const logout = async () => {
    await signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};