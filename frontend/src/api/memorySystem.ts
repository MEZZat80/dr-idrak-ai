// Memory System for Dr. Idrak
// Stores and retrieves user context across sessions

const MEMORY_KEY = 'dr_idrak_user_memory';
const MAX_HISTORY_ITEMS = 50;

export interface UserMemory {
  userId: string;
  createdAt: string;
  lastUpdated: string;
  profile: {
    name?: string;
    age?: number;
    gender?: 'male' | 'female' | 'other';
    location?: string;
  };
  healthProfile: {
    conditions: string[];
    medications: string[];
    allergies: string[];
    supplements: string[];
    goals: string[];
  };
  conversationHistory: {
    date: string;
    summary: string;
    productsDiscussed: string[];
    concerns: string[];
  }[];
  preferences: {
    language: 'en' | 'ar' | 'es';
    communicationStyle: 'detailed' | 'concise';
    preferredProducts: string[];
    avoidedProducts: string[];
  };
  safetyFlags: {
    highRiskConditions: string[];
    drugInteractions: string[];
    requiresOversight: boolean;
  };
}

export function initializeMemory(userId: string = 'anonymous'): UserMemory {
  const existing = getMemory(userId);
  if (existing) return existing;

  const newMemory: UserMemory = {
    userId,
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    profile: {},
    healthProfile: {
      conditions: [],
      medications: [],
      allergies: [],
      supplements: [],
      goals: []
    },
    conversationHistory: [],
    preferences: {
      language: 'en',
      communicationStyle: 'concise',
      preferredProducts: [],
      avoidedProducts: []
    },
    safetyFlags: {
      highRiskConditions: [],
      drugInteractions: [],
      requiresOversight: false
    }
  };

  saveMemory(newMemory);
  return newMemory;
}

export function getMemory(userId: string = 'anonymous'): UserMemory | null {
  try {
    const data = localStorage.getItem(`${MEMORY_KEY}_${userId}`);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function saveMemory(memory: UserMemory): void {
  try {
    memory.lastUpdated = new Date().toISOString();
    localStorage.setItem(`${MEMORY_KEY}_${memory.userId}`, JSON.stringify(memory));
  } catch (error) {
    console.error('Failed to save memory:', error);
  }
}

export function updateHealthProfile(
  userId: string,
  updates: Partial<UserMemory['healthProfile']>
): UserMemory | null {
  const memory = getMemory(userId);
  if (!memory) return null;

  memory.healthProfile = {
    ...memory.healthProfile,
    ...updates
  };

  // Update safety flags based on new health info
  memory.safetyFlags = assessSafetyFlags(memory.healthProfile);
  
  saveMemory(memory);
  return memory;
}

export function addConversationSummary(
  userId: string,
  summary: string,
  productsDiscussed: string[],
  concerns: string[]
): UserMemory | null {
  const memory = getMemory(userId);
  if (!memory) return null;

  memory.conversationHistory.unshift({
    date: new Date().toISOString(),
    summary,
    productsDiscussed,
    concerns
  });

  // Keep only recent history
  if (memory.conversationHistory.length > MAX_HISTORY_ITEMS) {
    memory.conversationHistory = memory.conversationHistory.slice(0, MAX_HISTORY_ITEMS);
  }

  saveMemory(memory);
  return memory;
}

export function updatePreferences(
  userId: string,
  updates: Partial<UserMemory['preferences']>
): UserMemory | null {
  const memory = getMemory(userId);
  if (!memory) return null;

  memory.preferences = {
    ...memory.preferences,
    ...updates
  };

  saveMemory(memory);
  return memory;
}

function assessSafetyFlags(healthProfile: UserMemory['healthProfile']): UserMemory['safetyFlags'] {
  const highRiskConditions = [
    'pregnancy', 'pregnant', 'breastfeeding', 'nursing',
    'heart disease', 'cardiac', 'liver disease', 'kidney disease',
    'seizure', 'epilepsy', 'bipolar', 'schizophrenia'
  ];

  const foundHighRisk = healthProfile.conditions.filter(condition =>
    highRiskConditions.some(risk => condition.toLowerCase().includes(risk))
  );

  const drugInteractions: string[] = [];
  
  // Check for known interactions
  const medications = healthProfile.medications.map(m => m.toLowerCase());
  
  if (medications.some(m => ['ssri', 'fluoxetine', 'sertraline'].some(d => m.includes(d)))) {
    drugInteractions.push('Neuro-Blue (methylene blue)');
  }
  
  if (medications.some(m => ['warfarin', 'coumadin'].some(d => m.includes(d)))) {
    drugInteractions.push('AgeCore NAD+ (resveratrol)');
  }

  return {
    highRiskConditions: foundHighRisk,
    drugInteractions,
    requiresOversight: foundHighRisk.length > 0 || drugInteractions.length > 0
  };
}

export function extractHealthInfo(message: string): Partial<UserMemory['healthProfile']> {
  const info: Partial<UserMemory['healthProfile']> = {};
  const lowerMessage = message.toLowerCase();

  // Extract conditions
  const conditionKeywords = [
    'diabetes', 'hypertension', 'anxiety', 'depression', 'insomnia',
    'arthritis', 'migraine', 'asthma', 'allergies', 'pregnancy'
  ];
  
  info.conditions = conditionKeywords.filter(keyword => 
    lowerMessage.includes(keyword)
  );

  // Extract medications
  const medPatterns = [
    /taking\s+([\w\s]+)/gi,
    /on\s+([\w\s]+)\s+medication/gi,
    /medications?:?\s*([\w\s,]+)/gi
  ];

  info.medications = [];
  medPatterns.forEach(pattern => {
    const matches = message.matchAll(pattern);
    for (const match of matches) {
      if (match[1]) {
        info.medications.push(...match[1].split(/,\s*|and\s*/).map(m => m.trim()));
      }
    }
  });

  // Extract allergies
  if (lowerMessage.includes('allergic to')) {
    const allergyMatch = message.match(/allergic to\s+([\w\s,]+)/i);
    if (allergyMatch) {
      info.allergies = allergyMatch[1].split(/,\s*|and\s*/).map(a => a.trim());
    }
  }

  // Extract goals
  const goalKeywords = [
    'sleep better', 'lose weight', 'more energy', 'focus', 'memory',
    'reduce stress', 'anxiety relief', 'joint pain', 'skin health'
  ];
  
  info.goals = goalKeywords.filter(goal => 
    lowerMessage.includes(goal)
  );

  return info;
}

export function generateMemoryContext(userId: string = 'anonymous'): string {
  const memory = getMemory(userId);
  if (!memory) return '';

  const parts: string[] = [];

  // Health profile summary
  if (memory.healthProfile.conditions.length > 0) {
    parts.push(`Known conditions: ${memory.healthProfile.conditions.join(', ')}`);
  }
  
  if (memory.healthProfile.medications.length > 0) {
    parts.push(`Current medications: ${memory.healthProfile.medications.join(', ')}`);
  }
  
  if (memory.healthProfile.allergies.length > 0) {
    parts.push(`Allergies: ${memory.healthProfile.allergies.join(', ')}`);
  }

  // Recent conversation context
  if (memory.conversationHistory.length > 0) {
    const recent = memory.conversationHistory[0];
    parts.push(`Previous discussion: ${recent.summary}`);
    
    if (recent.productsDiscussed.length > 0) {
      parts.push(`Previously discussed products: ${recent.productsDiscussed.join(', ')}`);
    }
  }

  // Safety flags
  if (memory.safetyFlags.requiresOversight) {
    parts.push('⚠️ This user requires careful oversight due to medical complexity.');
  }

  return parts.join('\n');
}

export function clearMemory(userId: string = 'anonymous'): void {
  localStorage.removeItem(`${MEMORY_KEY}_${userId}`);
}