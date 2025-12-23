// src/types/index.ts

export interface User {
  id: number;
  username: string;
  role: 'admin' | 'market_manager';
  manager_id: number | null;
}

export interface Market {
  id: number;
  name: string;
  created_at: string;
}

export interface MarketManager {
  id: number;
  name: string;
  email: string;
  market_id: number | null;
  created_at: string;
}

export interface Store {
  id: number;
  store_name: string;
  market_id: number | null;
  created_at: string;
}

export interface MarketManagerStore {
  id: number;
  manager_id: number;
  store_id: number;
  assigned_at: string;
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoggedIn: boolean;
  isAdmin: boolean;
  loading: boolean;
}
