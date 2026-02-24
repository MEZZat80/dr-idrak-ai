// MedMO-4B Client for Dr. Idrak
// Connects to Google Colab API server

const COLAB_API_URL = import.meta.env.VITE_MEDMO_API_URL || '';

export interface MedMOAnalysisRequest {
  image_base64: string;
  prompt?: string;
  language?: 'en' | 'ar';
}

export interface MedMOAnalysisResponse {
  analysis: string;
  model: string;
  language: string;
}

/**
 * Check if MedMO-4B API is available
 */
export async function isMedMOAvailable(): Promise<boolean> {
  if (!COLAB_API_URL) return false;
  
  try {
    const response = await fetch(`${COLAB_API_URL}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000)
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Analyze medical image using MedMO-4B
 */
export async function analyzeWithMedMO(
  request: MedMOAnalysisRequest
): Promise<MedMOAnalysisResponse> {
  if (!COLAB_API_URL) {
    throw new Error('MedMO API URL not configured');
  }
  
  const response = await fetch(`${COLAB_API_URL}/analyze/base64`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      image_base64: request.image_base64,
      prompt: request.prompt || 'Analyze this medical image and describe any abnormalities',
      language: request.language || 'en'
    })
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`MedMO analysis failed: ${error}`);
  }
  
  return response.json();
}

/**
 * Generate medical analysis prompt based on context
 */
export function generateMedMOPrompt(
  imageType: 'xray' | 'lab_report' | 'prescription' | 'general',
  userContext?: {
    symptoms?: string[];
    conditions?: string[];
    medications?: string[];
  }
): string {
  const prompts: Record<string, string> = {
    xray: 'Analyze this chest X-ray and identify any abnormalities, lesions, or pathological findings.',
    lab_report: 'Extract and interpret the lab results from this medical report. Identify any values outside normal ranges.',
    prescription: 'Read this prescription and identify the medications, dosages, and any potential drug interactions.',
    general: 'Analyze this medical image and describe any visible abnormalities or relevant clinical findings.'
  };
  
  let prompt = prompts[imageType] || prompts.general;
  
  // Add context if available
  if (userContext) {
    if (userContext.symptoms?.length) {
      prompt += ` The patient reports: ${userContext.symptoms.join(', ')}.`;
    }
    if (userContext.conditions?.length) {
      prompt += ` Known conditions: ${userContext.conditions.join(', ')}.`;
    }
  }
  
  return prompt;
}

/**
 * Fallback to Gemini if MedMO is not available
 */
export async function analyzeMedicalImage(
  imageBase64: string,
  prompt: string,
  language: 'en' | 'ar' = 'en',
  useMedMO: boolean = true
): Promise<string> {
  // Try MedMO first if available and enabled
  if (useMedMO && await isMedMOAvailable()) {
    try {
      const result = await analyzeWithMedMO({
        image_base64: imageBase64,
        prompt,
        language
      });
      return result.analysis;
    } catch (error) {
      console.warn('MedMO failed, falling back to Gemini:', error);
    }
  }
  
  // Fallback to Gemini
  const { analyzeImage } = await import('./medgemmaClient');
  return analyzeImage(imageBase64, prompt);
}