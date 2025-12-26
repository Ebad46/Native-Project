// src/lib/db.ts

import { supabase } from './supabase';
import { User, Market, MarketManager, Store, MarketManagerStore } from '../types';

// Users / Authentication
export const authService = {
  async login(username: string, password: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, username, role, manager_id')
        .eq('username', username)
        .eq('password', password)
        .single();

      if (error || !data) return null;
      return data as User;
    } catch {
      return null;
    }
  },
};

// Markets
export const marketService = {
  async getAll(): Promise<Market[]> {
    try {
      const { data, error } = await supabase.from('markets').select('*');
      if (error) {
        console.error('Error fetching markets:', error);
        return [];
      }
      return (data as Market[]) || [];
    } catch (err) {
      console.error('Markets fetch error:', err);
      return [];
    }
  },

  async create(name: string): Promise<Market | null> {
    try {
      const { data, error } = await supabase
        .from('markets')
        .insert([{ name }])
        .select()
        .single();

      if (error) {
        console.error('Error creating market:', error);
        return null;
      }
      return (data as Market) || null;
    } catch (err) {
      console.error('Market create error:', err);
      return null;
    }
  },

  async update(id: number, name: string): Promise<Market | null> {
    try {
      const { data, error } = await supabase
        .from('markets')
        .update({ name })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating market:', error);
        return null;
      }
      return (data as Market) || null;
    } catch (err) {
      console.error('Market update error:', err);
      return null;
    }
  },

  async delete(id: number): Promise<boolean> {
    try {
      console.log('Deleting market:', id);
      const { error } = await supabase
        .from('markets')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting market:', error);
        return false;
      }
      console.log('Market deleted successfully');
      return true;
    } catch (err) {
      console.error('Market delete error:', err);
      return false;
    }
  },
};

// Stores
export const storeService = {
  // In storeService - ADD THIS NEW FUNCTION:

async updateWithManager(
  id: number,
  store_name: string,
  market_id: number | null,
  manager_id: number | null
): Promise<Store | null> {
  try {
    console.log('📝 Updating store:', { id, store_name, market_id, manager_id });
    
    const { data, error } = await supabase
      .from('stores')
      .update({ 
        store_name, 
        market_id,
        manager_id
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating store:', error);
      return null;
    }
    
    console.log('✅ Store updated:', data);
    return (data as Store) || null;
  } catch (err) {
    console.error('❌ Store update error:', err);
    return null;
  }
},
  async getAll(): Promise<Store[]> {
    try {
      const { data, error } = await supabase.from('stores').select('*');
      if (error) {
        console.error('Error fetching stores:', error);
        return [];
      }
      return (data as Store[]) || [];
    } catch (err) {
      console.error('Stores fetch error:', err);
      return [];
    }
  },

  async create(
    store_name: string,
    market_id: number | null,
    id?: number | null
  ): Promise<Store | null> {
    try {
      const insertData: any = { store_name, market_id };

      // Only add ID if provided
      if (id) {
        insertData.id = id;
      }

      const { data, error } = await supabase
        .from('stores')
        .insert([insertData])
        .select()
        .single();

      if (error) {
        console.error('Error creating store:', error);
        return null;
      }
      return (data as Store) || null;
    } catch (err) {
      console.error('Store create error:', err);
      return null;
    }
  },

  async update(id: number, market_id: number | null): Promise<Store | null> {
    try {
      const { data, error } = await supabase
        .from('stores')
        .update({ market_id })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating store:', error);
        return null;
      }
      return (data as Store) || null;
    } catch (err) {
      console.error('Store update error:', err);
      return null;
    }
  },

  async delete(id: number): Promise<boolean> {
    try {
      console.log('Starting store delete for ID:', id);

      // First, remove all assignments
      const { error: assignError } = await supabase
        .from('market_manager_stores')
        .delete()
        .eq('store_id', id);

      if (assignError) {
        console.error('Error deleting assignments:', assignError);
      } else {
        console.log('Assignments deleted successfully');
      }

      // Then delete the store
      console.log('Deleting store with ID:', id);
      const { error: deleteError, data } = await supabase
        .from('stores')
        .delete()
        .eq('id', id)
        .select();

      if (deleteError) {
        console.error('❌ Error deleting store:', deleteError);
        console.error('Error message:', deleteError.message);
        console.error('Error code:', deleteError.code);
        return false;
      }

      console.log('✅ Store deleted successfully. Response:', data);
      return true;
    } catch (err) {
      console.error('❌ Store delete exception:', err);
      return false;
    }
  },
};

// Market Managers
export const managerService = {
  async getAll(): Promise<MarketManager[]> {
    try {
      const { data, error } = await supabase.from('market_managers').select('*');
      if (error) {
        console.error('Error fetching managers:', error);
        return [];
      }
      return (data as MarketManager[]) || [];
    } catch (err) {
      console.error('Managers fetch error:', err);
      return [];
    }
  },

  async create(
    name: string,
    email: string,
    password: string,
    market_id: number | null
  ): Promise<MarketManager | null> {
    try {
      const { data, error } = await supabase
        .from('market_managers')
        .insert([{ name, email, password, market_id }])
        .select()
        .single();

      if (error) {
        console.error('Error creating manager:', error);
        return null;
      }
      return (data as MarketManager) || null;
    } catch (err) {
      console.error('Manager create error:', err);
      return null;
    }
  },

  async update(
    id: number,
    name: string,
    email: string,
    password?: string,
    market_id?: number | null
  ): Promise<MarketManager | null> {
    try {
      const updateData: any = { name, email, market_id };

      // Only include password if provided
      if (password) {
        updateData.password = password;
      }

      const { data, error } = await supabase
        .from('market_managers')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating manager:', error);
        return null;
      }
      return (data as MarketManager) || null;
    } catch (err) {
      console.error('Manager update error:', err);
      return null;
    }
  },

  async delete(id: number): Promise<boolean> {
    try {
      console.log('Deleting manager:', id);

      // First remove assignments
      const { error: assignError } = await supabase
        .from('market_manager_stores')
        .delete()
        .eq('manager_id', id);

      if (assignError) {
        console.error('Error deleting manager assignments:', assignError);
      }

      // Then delete manager
      const { error } = await supabase
        .from('market_managers')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting manager:', error);
        return false;
      }

      console.log('Manager deleted successfully');
      return true;
    } catch (err) {
      console.error('Manager delete error:', err);
      return false;
    }
  },

  async getManagerStores(managerId: number): Promise<Store[]> {
    try {
      const { data, error } = await supabase
        .from('market_manager_stores')
        .select('store_id')
        .eq('manager_id', managerId);

      if (error || !data) return [];

      const storeIds = (data as any[]).map((d) => d.store_id);
      if (storeIds.length === 0) return [];

      const { data: stores } = await supabase
        .from('stores')
        .select('*')
        .in('id', storeIds);

      return (stores as Store[]) || [];
    } catch {
      return [];
    }
  },
};

// Market Manager Stores (Assignments)
export const assignmentService = {
  async getAll(): Promise<MarketManagerStore[]> {
    try {
      const { data, error } = await supabase.from('market_manager_stores').select('*');
      if (error) {
        console.error('Error fetching assignments:', error);
        return [];
      }
      return (data as MarketManagerStore[]) || [];
    } catch (err) {
      console.error('Assignments fetch error:', err);
      return [];
    }
  },

  async assign(manager_id: number, store_id: number): Promise<MarketManagerStore | null> {
    try {
      const { data, error } = await supabase
        .from('market_manager_stores')
        .insert([{ manager_id, store_id }])
        .select()
        .single();

      if (error) {
        console.error('Error assigning manager:', error);
        return null;
      }
      return (data as MarketManagerStore) || null;
    } catch (err) {
      console.error('Assign error:', err);
      return null;
    }
  },
  
  async unassign(manager_id: number, store_id: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('market_manager_stores')
        .delete()
        .eq('manager_id', manager_id)
        .eq('store_id', store_id);

      if (error) {
        console.error('Error unassigning manager:', error);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Unassign error:', err);
      return false;
    }
  },

  async getStoreAssignments(store_id: number): Promise<number[]> {
    try {
      const { data, error } = await supabase
        .from('market_manager_stores')
        .select('manager_id')
        .eq('store_id', store_id);

      if (error) {
        console.error('Error fetching assignments:', error);
        return [];
      }
      return (data as any[]).map((d) => d.manager_id) || [];
    } catch {
      return [];
    }
  },
};