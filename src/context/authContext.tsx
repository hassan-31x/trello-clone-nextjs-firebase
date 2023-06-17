import React, { useState, createContext, ReactNode } from 'react';
import { auth } from '../config/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { db } from '../config/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { User, AuthContextValue } from '../interfaces/ContextsInterface';

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  register: async () => '',
  login: async () => '',
  logout: async () => {},
});

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  onAuthStateChanged(auth, (currentUser: any) => {
    setUser(currentUser);
  });

  const register = async (inputs: { email: string; password: string }): Promise<string> => {
    try {
      const newUser = await createUserWithEmailAndPassword(auth, inputs.email, inputs.password);
      await setDoc(doc(db, 'users', newUser.user.uid), {});
      return 'Success';
    } catch (err: any) {
      return err.message;
    }
  };

  const login = async (inputs: { email: string; password: string }): Promise<string> => {
    try {
      await signInWithEmailAndPassword(auth, inputs.email, inputs.password);
      return 'Success';
    } catch (err: any) {
      return err.message;
    }
  };

  const logout = async (): Promise<void> => {
    window.location.reload();
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};