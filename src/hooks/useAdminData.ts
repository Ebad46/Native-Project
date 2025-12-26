import { useState, useEffect, useCallback } from 'react';
import { Market, MarketManager, Store } from '../types';
import { marketService, managerService, storeService } from '../lib/db';
import { showToast } from '../components/NotificationSystem';

interface UseAdminDataReturn {
  markets: Market[];
  managers: MarketManager[];
  stores: Store[];
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  addManager: (name: string, email: string, password: string, marketId?: number) => Promise<boolean>;
  editManager: (id: number, name: string, email: string, password?: string, marketId?: number) => Promise<boolean>;
  deleteManager: (id: number) => Promise<boolean>;
  addMarket: (name: string) => Promise<boolean>;
  editMarket: (id: number, name: string) => Promise<boolean>;
  deleteMarket: (id: number) => Promise<boolean>;
  addStore: (name: string, marketId?: number, storeId?: number, managerId?: number) => Promise<boolean>;
  editStore: (id: number, name: string, marketId?: number, managerId?: number) => Promise<boolean>;
  deleteStore: (id: number) => Promise<boolean>;
}

export const useAdminData = (): UseAdminDataReturn => {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [managers, setManagers] = useState<MarketManager[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [marketsData, managersData, storesData] = await Promise.all([
        marketService.getAll(),
        managerService.getAll(),
        storeService.getAll(),
      ]);

      setMarkets(marketsData);
      setManagers(managersData);
      setStores(storesData);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load data';
      console.error('Error loading admin data:', err);
      setError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const refreshData = useCallback(async () => {
    await loadData();
  }, [loadData]);

  const addManager = useCallback(
    async (name: string, email: string, password: string, marketId?: number) => {
      if (!name.trim() || !email.trim() || !password.trim()) {
        showToast('Please fill in all required fields', 'error');
        return false;
      }

      try {
        const result = await managerService.create(name, email, password, marketId !== undefined ? marketId : null);
        if (result) {
          showToast(`Manager "${name}" created successfully!`, 'success');
          await loadData();
          return true;
        }
        showToast('Failed to create manager', 'error');
        return false;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Error creating manager';
        console.error('Error adding manager:', err);
        showToast(errorMsg, 'error');
        return false;
      }
    },
    [loadData]
  );

  const editManager = useCallback(
    async (id: number, name: string, email: string, password?: string, marketId?: number) => {
      if (!name.trim() || !email.trim()) {
        showToast('Please fill in all required fields', 'error');
        return false;
      }

      try {
        const result = await managerService.update(id, name, email, password, marketId);
        if (result) {
          showToast('Manager updated successfully!', 'success');
          await loadData();
          return true;
        }
        showToast('Failed to update manager', 'error');
        return false;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Error updating manager';
        console.error('Error updating manager:', err);
        showToast(errorMsg, 'error');
        return false;
      }
    },
    [loadData]
  );

  const deleteManager = useCallback(
    async (id: number) => {
      try {
        const result = await managerService.delete(id);
        if (result) {
          showToast('Manager deleted successfully!', 'success');
          await loadData();
          return true;
        }
        showToast('Failed to delete manager', 'error');
        return false;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Error deleting manager';
        console.error('Error deleting manager:', err);
        showToast(errorMsg, 'error');
        return false;
      }
    },
    [loadData]
  );

  const addMarket = useCallback(
    async (name: string) => {
      if (!name.trim()) {
        showToast('Please enter a market name', 'error');
        return false;
      }

      try {
        const result = await marketService.create(name);
        if (result) {
          showToast('Market created successfully!', 'success');
          await loadData();
          return true;
        }
        showToast('Failed to create market', 'error');
        return false;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Error creating market';
        console.error('Error adding market:', err);
        showToast(errorMsg, 'error');
        return false;
      }
    },
    [loadData]
  );

  const editMarket = useCallback(
    async (id: number, name: string) => {
      if (!name.trim()) {
        showToast('Please enter a market name', 'error');
        return false;
      }

      try {
        const result = await marketService.update(id, name);
        if (result) {
          showToast('Market updated successfully!', 'success');
          await loadData();
          return true;
        }
        showToast('Failed to update market', 'error');
        return false;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Error updating market';
        console.error('Error updating market:', err);
        showToast(errorMsg, 'error');
        return false;
      }
    },
    [loadData]
  );

  const deleteMarket = useCallback(
    async (id: number) => {
      try {
        const result = await marketService.delete(id);
        if (result) {
          showToast('Market deleted successfully!', 'success');
          await loadData();
          return true;
        }
        showToast('Failed to delete market', 'error');
        return false;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Error deleting market';
        console.error('Error deleting market:', err);
        showToast(errorMsg, 'error');
        return false;
      }
    },
    [loadData]
  );

  const addStore = useCallback(
    async (name: string, marketId?: number, storeId?: number, managerId?: number) => {
      if (!name.trim()) {
        showToast('Please enter a store name', 'error');
        return false;
      }

      try {
        const result = await storeService.create(
          name,
          marketId !== undefined ? marketId : null,
          storeId !== undefined ? storeId : null
        );
        if (result && managerId) {
          // Manager assignment logic if needed
        }
        if (result) {
          showToast('Store created successfully!', 'success');
          await loadData();
          return true;
        }
        showToast('Failed to create store', 'error');
        return false;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Error creating store';
        console.error('Error adding store:', err);
        showToast(errorMsg, 'error');
        return false;
      }
    },
    [loadData]
  );

  const editStore = useCallback(
    async (id: number, name: string, marketId?: number, managerId?: number) => {
      if (!name.trim()) {
        showToast('Please enter a store name', 'error');
        return false;
      }

      try {
        const result = await storeService.updateWithManager(
          id,
          name,
          marketId !== undefined ? marketId : null,
          managerId !== undefined ? managerId : null
        );
        if (result) {
          showToast('Store updated successfully!', 'success');
          await loadData();
          return true;
        }
        showToast('Failed to update store', 'error');
        return false;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Error updating store';
        console.error('Error updating store:', err);
        showToast(errorMsg, 'error');
        return false;
      }
    },
    [loadData]
  );

  const deleteStore = useCallback(
    async (id: number) => {
      try {
        const result = await storeService.delete(id);
        if (result) {
          showToast('Store deleted successfully!', 'success');
          await loadData();
          return true;
        }
        showToast('Failed to delete store', 'error');
        return false;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Error deleting store';
        console.error('Error deleting store:', err);
        showToast(errorMsg, 'error');
        return false;
      }
    },
    [loadData]
  );

  return {
    markets,
    managers,
    stores,
    loading,
    error,
    refreshData,
    addManager,
    editManager,
    deleteManager,
    addMarket,
    editMarket,
    deleteMarket,
    addStore,
    editStore,
    deleteStore,
  };
};
