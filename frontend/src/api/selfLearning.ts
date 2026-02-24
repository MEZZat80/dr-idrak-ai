// Self-Learning System for Dr. Idrak
// Analyzes conversation patterns and improves recommendations over time

const LEARNING_KEY = 'dr_idrak_learning_data';
const INSIGHTS_KEY = 'dr_idrak_insights';

export interface ProductFeedback {
  productName: string;
  recommended: number;
  clicked: number;
  purchased: number;
  positiveFeedback: number;
  negativeFeedback: number;
  commonConcerns: string[];
  effectivenessRating: number;
}

export interface ConversationPattern {
  queryType: string;
  keywords: string[];
  successfulProducts: string[];
  unsuccessfulProducts: string[];
  userSatisfaction: number;
  followUpQuestions: string[];
}

export interface MedicalInsight {
  condition: string;
  effectiveProducts: string[];
  commonMedications: string[];
  contraindications: string[];
  evidenceStrength: 'strong' | 'moderate' | 'emerging';
  lastUpdated: string;
}

export interface LearningData {
  productFeedback: Record<string, ProductFeedback>;
  conversationPatterns: ConversationPattern[];
  medicalInsights: Record<string, MedicalInsight>;
  userOutcomes: {
    date: string;
    goal: string;
    recommendedProducts: string[];
    userReportedOutcome: 'improved' | 'no_change' | 'worsened' | 'unknown';
    followUpNeeded: boolean;
  }[];
  lastAnalysis: string;
}

export function initializeLearning(): LearningData {
  const existing = getLearningData();
  if (existing) return existing;

  const newData: LearningData = {
    productFeedback: {},
    conversationPatterns: [],
    medicalInsights: {},
    userOutcomes: [],
    lastAnalysis: new Date().toISOString()
  };

  saveLearningData(newData);
  return newData;
}

export function getLearningData(): LearningData | null {
  try {
    const data = localStorage.getItem(LEARNING_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

function saveLearningData(data: LearningData): void {
  try {
    localStorage.setItem(LEARNING_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save learning data:', error);
  }
}

// Track product recommendation
export function trackRecommendation(
  productName: string,
  context: {
    userGoal: string;
    userConditions: string[];
    userMedications: string[];
  }
): void {
  const data = getLearningData() || initializeLearning();
  
  if (!data.productFeedback[productName]) {
    data.productFeedback[productName] = {
      productName,
      recommended: 0,
      clicked: 0,
      purchased: 0,
      positiveFeedback: 0,
      negativeFeedback: 0,
      commonConcerns: [],
      effectivenessRating: 0
    };
  }

  data.productFeedback[productName].recommended++;
  
  // Update conversation pattern
  const pattern = findOrCreatePattern(data, context.userGoal);
  pattern.keywords = [...new Set([...pattern.keywords, ...context.userConditions])];
  
  saveLearningData(data);
}

// Track user action on recommendation
export function trackUserAction(
  productName: string,
  action: 'clicked' | 'purchased' | 'positive_feedback' | 'negative_feedback'
): void {
  const data = getLearningData() || initializeLearning();
  
  if (!data.productFeedback[productName]) return;
  
  const feedback = data.productFeedback[productName];
  
  switch (action) {
    case 'clicked':
      feedback.clicked++;
      break;
    case 'purchased':
      feedback.purchased++;
      break;
    case 'positive_feedback':
      feedback.positiveFeedback++;
      break;
    case 'negative_feedback':
      feedback.negativeFeedback++;
      break;
  }
  
  // Recalculate effectiveness
  const totalInteractions = feedback.clicked + feedback.purchased + feedback.positiveFeedback + feedback.negativeFeedback;
  if (totalInteractions > 0) {
    feedback.effectivenessRating = 
      ((feedback.purchased * 3) + (feedback.positiveFeedback * 2) + feedback.clicked - feedback.negativeFeedback) / 
      (totalInteractions * 3);
  }
  
  saveLearningData(data);
}

// Record conversation outcome
export function recordOutcome(
  goal: string,
  recommendedProducts: string[],
  outcome: 'improved' | 'no_change' | 'worsened' | 'unknown',
  followUpNeeded: boolean
): void {
  const data = getLearningData() || initializeLearning();
  
  data.userOutcomes.push({
    date: new Date().toISOString(),
    goal,
    recommendedProducts,
    userReportedOutcome: outcome,
    followUpNeeded
  });
  
  // Keep only last 100 outcomes
  if (data.userOutcomes.length > 100) {
    data.userOutcomes = data.userOutcomes.slice(-100);
  }
  
  // Update medical insights
  updateMedicalInsight(data, goal, recommendedProducts, outcome);
  
  saveLearningData(data);
}

// Extract learning from conversation
export function learnFromConversation(
  userQuery: string,
  aiResponse: string,
  userFollowUp: string | null
): void {
  const data = getLearningData() || initializeLearning();
  
  // Extract products mentioned
  const products = extractProductsFromText(aiResponse);
  
  // Extract conditions mentioned
  const conditions = extractConditionsFromText(userQuery);
  
  // Determine query type
  const queryType = classifyQuery(userQuery);
  
  // Find or create pattern
  const pattern = findOrCreatePattern(data, queryType);
  
  // Update pattern
  pattern.keywords = [...new Set([...pattern.keywords, ...conditions])];
  
  if (userFollowUp) {
    const satisfaction = assessSatisfaction(userFollowUp);
    pattern.userSatisfaction = (pattern.userSatisfaction + satisfaction) / 2;
    
    if (satisfaction > 0.7) {
      pattern.successfulProducts = [...new Set([...pattern.successfulProducts, ...products])];
    } else if (satisfaction < 0.3) {
      pattern.unsuccessfulProducts = [...new Set([...pattern.unsuccessfulProducts, ...products])];
    }
  }
  
  saveLearningData(data);
}

// Get AI-enhanced recommendations based on learning
export function getEnhancedRecommendations(
  userGoal: string,
  userConditions: string[]
): {
  primary: string[];
  complementary: string[];
  reasoning: string;
} {
  const data = getLearningData() || initializeLearning();
  
  // Find relevant patterns
  const relevantPatterns = data.conversationPatterns.filter(p => 
    p.queryType === classifyQuery(userGoal) ||
    p.keywords.some(k => userConditions.includes(k))
  );
  
  // Score products based on historical success
  const productScores: Record<string, number> = {};
  
  relevantPatterns.forEach(pattern => {
    pattern.successfulProducts.forEach(product => {
      productScores[product] = (productScores[product] || 0) + pattern.userSatisfaction;
    });
    
    pattern.unsuccessfulProducts.forEach(product => {
      productScores[product] = (productScores[product] || 0) - 0.5;
    });
  });
  
  // Add feedback scores
  Object.entries(data.productFeedback).forEach(([product, feedback]) => {
    productScores[product] = (productScores[product] || 0) + feedback.effectivenessRating;
  });
  
  // Sort and categorize
  const sortedProducts = Object.entries(productScores)
    .sort((a, b) => b[1] - a[1])
    .map(([product]) => product);
  
  const primary = sortedProducts.slice(0, 2);
  const complementary = sortedProducts.slice(2, 4);
  
  // Generate reasoning
  const topProduct = primary[0];
  const feedback = topProduct ? data.productFeedback[topProduct] : null;
  
  let reasoning = 'Based on clinical evidence and user outcomes';
  if (feedback && feedback.recommended > 10) {
    reasoning += `, ${topProduct} has shown ${(feedback.effectivenessRating * 100).toFixed(0)}% effectiveness in similar cases`;
  }
  
  return { primary, complementary, reasoning };
}

// Generate learning insights for AI context
export function generateLearningContext(userGoal: string): string {
  const data = getLearningData() || initializeLearning();
  
  const insights: string[] = [];
  
  // Check for medical insights
  const insight = data.medicalInsights[userGoal.toLowerCase()];
  if (insight) {
    insights.push(`Historical data shows ${insight.effectiveProducts.join(', ')} are effective for ${userGoal}`);
    
    if (insight.contraindications.length > 0) {
      insights.push(`Watch for contraindications: ${insight.contraindications.join(', ')}`);
    }
  }
  
  // Check product feedback
  Object.entries(data.productFeedback)
    .filter(([_, f]) => f.recommended > 5)
    .sort((a, b) => b[1].effectivenessRating - a[1].effectivenessRating)
    .slice(0, 3)
    .forEach(([product, feedback]) => {
      if (feedback.effectivenessRating > 0.7) {
        insights.push(`${product} has high user satisfaction (${(feedback.effectivenessRating * 100).toFixed(0)}%)`);
      }
    });
  
  return insights.join('. ');
}

// Helper functions
function findOrCreatePattern(data: LearningData, queryType: string): ConversationPattern {
  let pattern = data.conversationPatterns.find(p => p.queryType === queryType);
  
  if (!pattern) {
    pattern = {
      queryType,
      keywords: [],
      successfulProducts: [],
      unsuccessfulProducts: [],
      userSatisfaction: 0.5,
      followUpQuestions: []
    };
    data.conversationPatterns.push(pattern);
  }
  
  return pattern;
}

function updateMedicalInsight(
  data: LearningData,
  goal: string,
  products: string[],
  outcome: string
): void {
  const key = goal.toLowerCase();
  
  if (!data.medicalInsights[key]) {
    data.medicalInsights[key] = {
      condition: goal,
      effectiveProducts: [],
      commonMedications: [],
      contraindications: [],
      evidenceStrength: 'emerging',
      lastUpdated: new Date().toISOString()
    };
  }
  
  const insight = data.medicalInsights[key];
  
  if (outcome === 'improved') {
    insight.effectiveProducts = [...new Set([...insight.effectiveProducts, ...products])];
  }
  
  // Update evidence strength based on data volume
  const relevantOutcomes = data.userOutcomes.filter(o => o.goal.toLowerCase() === key);
  if (relevantOutcomes.length > 20) {
    insight.evidenceStrength = 'strong';
  } else if (relevantOutcomes.length > 10) {
    insight.evidenceStrength = 'moderate';
  }
  
  insight.lastUpdated = new Date().toISOString();
}

function extractProductsFromText(text: string): string[] {
  const products = [
    'AgeCore NAD+', 'Neuro-Blue', 'Rest Atlas', 'Zen Mode',
    'Dermalux', 'FlexiCore', 'InnerGlow Logic', 'Longevity Core', 'NeuroForge'
  ];
  return products.filter(p => text.includes(p));
}

function extractConditionsFromText(text: string): string[] {
  const conditions = [
    'diabetes', 'hypertension', 'anxiety', 'depression', 'insomnia',
    'arthritis', 'migraine', 'asthma', 'stress', 'fatigue'
  ];
  const lower = text.toLowerCase();
  return conditions.filter(c => lower.includes(c));
}

function classifyQuery(query: string): string {
  const lower = query.toLowerCase();
  
  if (lower.includes('sleep') || lower.includes('insomnia')) return 'sleep';
  if (lower.includes('stress') || lower.includes('anxiety')) return 'stress';
  if (lower.includes('memory') || lower.includes('focus')) return 'cognitive';
  if (lower.includes('energy') || lower.includes('fatigue')) return 'energy';
  if (lower.includes('skin') || lower.includes('aging')) return 'anti-aging';
  if (lower.includes('joint') || lower.includes('pain')) return 'joint-health';
  if (lower.includes('gut') || lower.includes('digestion')) return 'gut-health';
  
  return 'general';
}

function assessSatisfaction(followUp: string): number {
  const positive = ['good', 'great', 'helped', 'better', 'improved', 'thanks', 'working'];
  const negative = ['bad', 'worse', 'not working', 'didn\'t help', 'problem', 'side effect'];
  
  const lower = followUp.toLowerCase();
  
  let score = 0.5;
  
  positive.forEach(word => {
    if (lower.includes(word)) score += 0.1;
  });
  
  negative.forEach(word => {
    if (lower.includes(word)) score -= 0.15;
  });
  
  return Math.max(0, Math.min(1, score));
}