/**
 * Unlock Persistence Service
 * Handles saving and retrieving sub-agent unlock data
 * Supports both localStorage (mock) and database (production) adapters
 */

export interface UnlockRecord {
  id: string;
  userId: string;
  agentId: string;
  subAgentId: string;
  unlockMethod: 'NFT' | 'Subscription' | 'TokenUnlock';
  unlockedAt: Date;
  transactionHash?: string;
  tokenId?: string;
  subscriptionId?: string;
  metadata?: any;
}

export interface UnlockPersistenceAdapter {
  saveUnlock(userId: string, agentId: string, subAgentId: string, payload: Partial<UnlockRecord>): Promise<boolean>;
  getUnlocks(userId: string): Promise<UnlockRecord[]>;
  isUnlocked(userId: string, agentId: string, subAgentId: string): Promise<boolean>;
}

// LocalStorage Adapter (Mock)
class LocalStorageAdapter implements UnlockPersistenceAdapter {
  private readonly STORAGE_KEY = 'subAgentUnlocks';

  async saveUnlock(userId: string, agentId: string, subAgentId: string, payload: Partial<UnlockRecord>): Promise<boolean> {
    try {
      const unlocks = this.getAllUnlocks();
      const unlockRecord: UnlockRecord = {
        id: `${userId}-${agentId}-${subAgentId}`,
        userId,
        agentId,
        subAgentId,
        unlockMethod: payload.unlockMethod || 'TokenUnlock',
        unlockedAt: new Date(),
        transactionHash: payload.transactionHash,
        tokenId: payload.tokenId,
        subscriptionId: payload.subscriptionId,
        metadata: payload.metadata
      };

      // Remove existing unlock for this user/agent/subAgent combination
      const filteredUnlocks = unlocks.filter(
        unlock => !(unlock.userId === userId && unlock.agentId === agentId && unlock.subAgentId === subAgentId)
      );

      // Add new unlock
      filteredUnlocks.push(unlockRecord);

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredUnlocks));
      return true;
    } catch (error) {
      console.error('Error saving unlock to localStorage:', error);
      return false;
    }
  }

  async getUnlocks(userId: string): Promise<UnlockRecord[]> {
    try {
      const unlocks = this.getAllUnlocks();
      return unlocks.filter(unlock => unlock.userId === userId);
    } catch (error) {
      console.error('Error getting unlocks from localStorage:', error);
      return [];
    }
  }

  async isUnlocked(userId: string, agentId: string, subAgentId: string): Promise<boolean> {
    try {
      const unlocks = this.getAllUnlocks();
      return unlocks.some(
        unlock => unlock.userId === userId && unlock.agentId === agentId && unlock.subAgentId === subAgentId
      );
    } catch (error) {
      console.error('Error checking unlock status:', error);
      return false;
    }
  }

  private getAllUnlocks(): UnlockRecord[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) return [];
      
      const unlocks = JSON.parse(data);
      // Convert date strings back to Date objects
      return unlocks.map((unlock: any) => ({
        ...unlock,
        unlockedAt: new Date(unlock.unlockedAt)
      }));
    } catch (error) {
      console.error('Error parsing unlocks from localStorage:', error);
      return [];
    }
  }
}

// Firebase Adapter (Production)
class FirebaseAdapter implements UnlockPersistenceAdapter {
  async saveUnlock(userId: string, agentId: string, subAgentId: string, payload: Partial<UnlockRecord>): Promise<boolean> {
    try {
      // TODO: Implement Firebase integration
      // const db = getFirestore();
      // const docRef = doc(db, 'users', userId, 'unlocks', `${agentId}-${subAgentId}`);
      // await setDoc(docRef, {
      //   ...payload,
      //   userId,
      //   agentId,
      //   subAgentId,
      //   unlockedAt: serverTimestamp()
      // });
      
      console.log('Firebase adapter not implemented yet, using localStorage fallback');
      const localStorageAdapter = new LocalStorageAdapter();
      return localStorageAdapter.saveUnlock(userId, agentId, subAgentId, payload);
    } catch (error) {
      console.error('Error saving unlock to Firebase:', error);
      return false;
    }
  }

  async getUnlocks(userId: string): Promise<UnlockRecord[]> {
    try {
      // TODO: Implement Firebase integration
      // const db = getFirestore();
      // const unlocksRef = collection(db, 'users', userId, 'unlocks');
      // const snapshot = await getDocs(unlocksRef);
      // return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UnlockRecord));
      
      console.log('Firebase adapter not implemented yet, using localStorage fallback');
      const localStorageAdapter = new LocalStorageAdapter();
      return localStorageAdapter.getUnlocks(userId);
    } catch (error) {
      console.error('Error getting unlocks from Firebase:', error);
      return [];
    }
  }

  async isUnlocked(userId: string, agentId: string, subAgentId: string): Promise<boolean> {
    try {
      // TODO: Implement Firebase integration
      // const db = getFirestore();
      // const docRef = doc(db, 'users', userId, 'unlocks', `${agentId}-${subAgentId}`);
      // const docSnap = await getDoc(docRef);
      // return docSnap.exists();
      
      console.log('Firebase adapter not implemented yet, using localStorage fallback');
      const localStorageAdapter = new LocalStorageAdapter();
      return localStorageAdapter.isUnlocked(userId, agentId, subAgentId);
    } catch (error) {
      console.error('Error checking unlock status in Firebase:', error);
      return false;
    }
  }
}

// Supabase Adapter (Alternative Production)
class SupabaseAdapter implements UnlockPersistenceAdapter {
  async saveUnlock(userId: string, agentId: string, subAgentId: string, payload: Partial<UnlockRecord>): Promise<boolean> {
    try {
      // TODO: Implement Supabase integration
      // const { data, error } = await supabase
      //   .from('sub_agent_unlocks')
      //   .upsert({
      //     user_id: userId,
      //     agent_id: agentId,
      //     sub_agent_id: subAgentId,
      //     unlock_method: payload.unlockMethod,
      //     transaction_hash: payload.transactionHash,
      //     token_id: payload.tokenId,
      //     subscription_id: payload.subscriptionId,
      //     metadata: payload.metadata
      //   });
      
      console.log('Supabase adapter not implemented yet, using localStorage fallback');
      const localStorageAdapter = new LocalStorageAdapter();
      return localStorageAdapter.saveUnlock(userId, agentId, subAgentId, payload);
    } catch (error) {
      console.error('Error saving unlock to Supabase:', error);
      return false;
    }
  }

  async getUnlocks(userId: string): Promise<UnlockRecord[]> {
    try {
      // TODO: Implement Supabase integration
      // const { data, error } = await supabase
      //   .from('sub_agent_unlocks')
      //   .select('*')
      //   .eq('user_id', userId);
      
      console.log('Supabase adapter not implemented yet, using localStorage fallback');
      const localStorageAdapter = new LocalStorageAdapter();
      return localStorageAdapter.getUnlocks(userId);
    } catch (error) {
      console.error('Error getting unlocks from Supabase:', error);
      return [];
    }
  }

  async isUnlocked(userId: string, agentId: string, subAgentId: string): Promise<boolean> {
    try {
      // TODO: Implement Supabase integration
      // const { data, error } = await supabase
      //   .from('sub_agent_unlocks')
      //   .select('id')
      //   .eq('user_id', userId)
      //   .eq('agent_id', agentId)
      //   .eq('sub_agent_id', subAgentId)
      //   .single();
      
      console.log('Supabase adapter not implemented yet, using localStorage fallback');
      const localStorageAdapter = new LocalStorageAdapter();
      return localStorageAdapter.isUnlocked(userId, agentId, subAgentId);
    } catch (error) {
      console.error('Error checking unlock status in Supabase:', error);
      return false;
    }
  }
}

// Factory function to get the appropriate adapter
export const getUnlockPersistenceAdapter = (): UnlockPersistenceAdapter => {
  const useMocks = process.env.NODE_ENV === 'development' || process.env.MOCK_DB === 'true';
  
  if (useMocks) {
    return new LocalStorageAdapter();
  }
  
  // In production, you can choose between Firebase or Supabase
  const dbProvider = process.env.DB_PROVIDER || 'firebase';
  
  switch (dbProvider) {
    case 'supabase':
      return new SupabaseAdapter();
    case 'firebase':
    default:
      return new FirebaseAdapter();
  }
};

// Main service functions
export const unlockPersistence = {
  async saveUnlock(userId: string, agentId: string, subAgentId: string, payload: Partial<UnlockRecord>): Promise<boolean> {
    const adapter = getUnlockPersistenceAdapter();
    return adapter.saveUnlock(userId, agentId, subAgentId, payload);
  },

  async getUnlocks(userId: string): Promise<UnlockRecord[]> {
    const adapter = getUnlockPersistenceAdapter();
    return adapter.getUnlocks(userId);
  },

  async isUnlocked(userId: string, agentId: string, subAgentId: string): Promise<boolean> {
    const adapter = getUnlockPersistenceAdapter();
    return adapter.isUnlocked(userId, agentId, subAgentId);
  }
};
