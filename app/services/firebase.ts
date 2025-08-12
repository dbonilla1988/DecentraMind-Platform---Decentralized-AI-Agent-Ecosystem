import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, onAuthStateChanged, User } from 'firebase/auth';
import { getDatabase, ref, set, get, push, onValue, off, DatabaseReference } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app);

// Authentication functions
export const signInWithSolanaToken = async (customToken: string) => {
  try {
    const result = await signInWithCustomToken(auth, customToken);
    return result.user;
  } catch (error) {
    console.error('Error signing in with custom token:', error);
    throw error;
  }
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Database functions for agent/task/CO2 data
export interface AgentData {
  id: string;
  name: string;
  type: 'VisionSync' | 'DomainSync';
  level: number;
  xp: number;
  performance: number;
  tasks_completed: number;
  created_at: number;
  last_updated: number;
  owner: string;
}

export interface TaskData {
  id: string;
  agent_id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  xp_reward: number;
  dmt_reward: number;
  created_at: number;
  completed_at?: number;
  owner: string;
}

export interface CO2Data {
  id: string;
  user_id: string;
  category: string;
  amount: number;
  description: string;
  date: string;
  created_at: number;
}

// Agent management
export const saveAgentData = async (agentData: AgentData) => {
  try {
    const agentRef = ref(database, `agents/${agentData.owner}/${agentData.id}`);
    await set(agentRef, agentData);
    return true;
  } catch (error) {
    console.error('Error saving agent data:', error);
    throw error;
  }
};

export const getAgentData = async (userId: string, agentId: string): Promise<AgentData | null> => {
  try {
    const agentRef = ref(database, `agents/${userId}/${agentId}`);
    const snapshot = await get(agentRef);
    return snapshot.exists() ? snapshot.val() : null;
  } catch (error) {
    console.error('Error getting agent data:', error);
    throw error;
  }
};

export const getUserAgents = async (userId: string): Promise<AgentData[]> => {
  try {
    const agentsRef = ref(database, `agents/${userId}`);
    const snapshot = await get(agentsRef);
    if (snapshot.exists()) {
      return Object.values(snapshot.val());
    }
    return [];
  } catch (error) {
    console.error('Error getting user agents:', error);
    throw error;
  }
};

export const listenToAgentUpdates = (userId: string, agentId: string, callback: (agent: AgentData | null) => void) => {
  const agentRef = ref(database, `agents/${userId}/${agentId}`);
  onValue(agentRef, (snapshot) => {
    const agent = snapshot.exists() ? snapshot.val() : null;
    callback(agent);
  });
  
  return () => off(agentRef);
};

// Task management
export const saveTaskData = async (taskData: TaskData) => {
  try {
    const taskRef = ref(database, `tasks/${taskData.owner}/${taskData.id}`);
    await set(taskRef, taskData);
    return true;
  } catch (error) {
    console.error('Error saving task data:', error);
    throw error;
  }
};

export const getTaskData = async (userId: string, taskId: string): Promise<TaskData | null> => {
  try {
    const taskRef = ref(database, `tasks/${userId}/${taskId}`);
    const snapshot = await get(taskRef);
    return snapshot.exists() ? snapshot.val() : null;
  } catch (error) {
    console.error('Error getting task data:', error);
    throw error;
  }
};

export const getUserTasks = async (userId: string): Promise<TaskData[]> => {
  try {
    const tasksRef = ref(database, `tasks/${userId}`);
    const snapshot = await get(tasksRef);
    if (snapshot.exists()) {
      return Object.values(snapshot.val());
    }
    return [];
  } catch (error) {
    console.error('Error getting user tasks:', error);
    throw error;
  }
};

export const updateTaskStatus = async (userId: string, taskId: string, status: TaskData['status'], completedAt?: number) => {
  try {
    const taskRef = ref(database, `tasks/${userId}/${taskId}`);
    const updates: Partial<TaskData> = { status };
    if (completedAt) {
      updates.completed_at = completedAt;
    }
    await set(taskRef, updates);
    return true;
  } catch (error) {
    console.error('Error updating task status:', error);
    throw error;
  }
};

// CO2 tracking
export const saveCO2Data = async (co2Data: CO2Data) => {
  try {
    const co2Ref = ref(database, `co2_tracking/${co2Data.user_id}/${co2Data.id}`);
    await set(co2Ref, co2Data);
    return true;
  } catch (error) {
    console.error('Error saving CO2 data:', error);
    throw error;
  }
};

export const getUserCO2Data = async (userId: string): Promise<CO2Data[]> => {
  try {
    const co2Ref = ref(database, `co2_tracking/${userId}`);
    const snapshot = await get(co2Ref);
    if (snapshot.exists()) {
      return Object.values(snapshot.val());
    }
    return [];
  } catch (error) {
    console.error('Error getting user CO2 data:', error);
    throw error;
  }
};

export const getCO2Summary = async (userId: string) => {
  try {
    const co2Data = await getUserCO2Data(userId);
    const totalCO2 = co2Data.reduce((sum, entry) => sum + entry.amount, 0);
    const categoryBreakdown = co2Data.reduce((acc, entry) => {
      acc[entry.category] = (acc[entry.category] || 0) + entry.amount;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      totalCO2,
      categoryBreakdown,
      entryCount: co2Data.length,
    };
  } catch (error) {
    console.error('Error getting CO2 summary:', error);
    throw error;
  }
};

// Chat and messaging
export interface ChatMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  message_type: 'text' | 'image' | 'file';
  encrypted: boolean;
  created_at: number;
  read: boolean;
}

export const sendMessage = async (message: Omit<ChatMessage, 'id' | 'created_at' | 'read'>) => {
  try {
    const messageRef = push(ref(database, 'messages'));
    const messageData: ChatMessage = {
      ...message,
      id: messageRef.key!,
      created_at: Date.now(),
      read: false,
    };
    await set(messageRef, messageData);
    return messageData;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const getChatHistory = async (userId1: string, userId2: string): Promise<ChatMessage[]> => {
  try {
    const messagesRef = ref(database, 'messages');
    const snapshot = await get(messagesRef);
    if (snapshot.exists()) {
      const messages = Object.values(snapshot.val()) as ChatMessage[];
      return messages.filter(
        msg => 
          (msg.sender_id === userId1 && msg.receiver_id === userId2) ||
          (msg.sender_id === userId2 && msg.receiver_id === userId1)
      ).sort((a, b) => a.created_at - b.created_at);
    }
    return [];
  } catch (error) {
    console.error('Error getting chat history:', error);
    throw error;
  }
};

export const listenToMessages = (userId: string, callback: (messages: ChatMessage[]) => void) => {
  const messagesRef = ref(database, 'messages');
  onValue(messagesRef, (snapshot) => {
    if (snapshot.exists()) {
      const messages = Object.values(snapshot.val()) as ChatMessage[];
      const userMessages = messages.filter(
        msg => msg.sender_id === userId || msg.receiver_id === userId
      );
      callback(userMessages);
    } else {
      callback([]);
    }
  });
  
  return () => off(messagesRef);
};

// File storage
export const uploadFile = async (file: File, path: string): Promise<string> => {
  try {
    const fileRef = storageRef(storage, path);
    await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// Analytics and metrics
export interface UserMetrics {
  user_id: string;
  daily_life_score: number;
  focus_time_minutes: number;
  streak_days: number;
  active_agents: number;
  total_xp: number;
  total_dmt_earned: number;
  total_co2_reduced: number;
  last_updated: number;
}

export const saveUserMetrics = async (metrics: UserMetrics) => {
  try {
    const metricsRef = ref(database, `user_metrics/${metrics.user_id}`);
    await set(metricsRef, metrics);
    return true;
  } catch (error) {
    console.error('Error saving user metrics:', error);
    throw error;
  }
};

export const getUserMetrics = async (userId: string): Promise<UserMetrics | null> => {
  try {
    const metricsRef = ref(database, `user_metrics/${userId}`);
    const snapshot = await get(metricsRef);
    return snapshot.exists() ? snapshot.val() : null;
  } catch (error) {
    console.error('Error getting user metrics:', error);
    throw error;
  }
};

// Rewards tracking
export interface RewardRecord {
  id: string;
  user_id: string;
  type: 'task' | 'proposal' | 'co2_reduction' | 'staking';
  amount: number;
  description: string;
  created_at: number;
  claimed: boolean;
}

export const saveRewardRecord = async (reward: Omit<RewardRecord, 'id' | 'created_at' | 'claimed'>) => {
  try {
    const rewardRef = push(ref(database, 'rewards'));
    const rewardData: RewardRecord = {
      ...reward,
      id: rewardRef.key!,
      created_at: Date.now(),
      claimed: false,
    };
    await set(rewardRef, rewardData);
    return rewardData;
  } catch (error) {
    console.error('Error saving reward record:', error);
    throw error;
  }
};

export const getUserRewards = async (userId: string): Promise<RewardRecord[]> => {
  try {
    const rewardsRef = ref(database, 'rewards');
    const snapshot = await get(rewardsRef);
    if (snapshot.exists()) {
      const rewards = Object.values(snapshot.val()) as RewardRecord[];
      return rewards.filter(reward => reward.user_id === userId);
    }
    return [];
  } catch (error) {
    console.error('Error getting user rewards:', error);
    throw error;
  }
};

export default {
  auth,
  database,
  storage,
  signInWithSolanaToken,
  getCurrentUser,
  onAuthStateChange,
  saveAgentData,
  getAgentData,
  getUserAgents,
  listenToAgentUpdates,
  saveTaskData,
  getTaskData,
  getUserTasks,
  updateTaskStatus,
  saveCO2Data,
  getUserCO2Data,
  getCO2Summary,
  sendMessage,
  getChatHistory,
  listenToMessages,
  uploadFile,
  saveUserMetrics,
  getUserMetrics,
  saveRewardRecord,
  getUserRewards,
}; 