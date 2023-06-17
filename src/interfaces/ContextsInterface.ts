export interface User {
  uid: string;
  email: string;
}

export interface AuthContextValue {
  user: User | null;
  register: (inputs: { email: string; password: string }) => Promise<string>;
  login: (inputs: { email: string; password: string }) => Promise<string>;
  logout: () => Promise<void>;
}
