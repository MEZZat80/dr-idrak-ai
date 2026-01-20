export interface UserProfile {
  goal: string;
  medications: string[];
  conditions: string[];
  allergies: string[];
  ageOver18: boolean;
}

export interface RiskAssessment {
  eligibility: 'standard' | 'modified' | 'premium_required';
  excludedProducts: string[];
  warnings: string[];
  requiresHumanOversight: boolean;
}

// Medication interaction database
const medicationInteractions: Record<string, string[]> = {
  // SSRIs and serotonergic medications
  'ssri': ['Neuro-Blue'],
  'fluoxetine': ['Neuro-Blue'],
  'sertraline': ['Neuro-Blue'],
  'paroxetine': ['Neuro-Blue'],
  'citalopram': ['Neuro-Blue'],
  'escitalopram': ['Neuro-Blue'],
  'venlafaxine': ['Neuro-Blue'],
  'duloxetine': ['Neuro-Blue'],
  
  // MAO inhibitors
  'maoi': ['Neuro-Blue', 'Zen Mode'],
  'phenelzine': ['Neuro-Blue', 'Zen Mode'],
  'tranylcypromine': ['Neuro-Blue', 'Zen Mode'],
  
  // Blood thinners
  'warfarin': ['AgeCore NAD+'],
  'coumadin': ['AgeCore NAD+'],
  'apixaban': ['AgeCore NAD+'],
  'rivaroxaban': ['AgeCore NAD+'],
  
  // Diabetes medications
  'insulin': ['AgeCore NAD+'],
  'metformin': ['AgeCore NAD+'],
  
  // Blood pressure medications
  'lisinopril': ['Zen Mode'],
  'amlodipine': ['Zen Mode'],
  'losartan': ['Zen Mode']
};

const highRiskConditions = [
  'heart disease',
  'cardiac',
  'liver disease',
  'kidney disease',
  'renal',
  'seizure',
  'epilepsy',
  'bipolar',
  'schizophrenia',
  'pregnancy',
  'pregnant',
  'breastfeeding',
  'nursing'
];

export const assessRisk = (profile: UserProfile): RiskAssessment => {
  const excludedProducts: string[] = [];
  const warnings: string[] = [];
  let requiresHumanOversight = false;
  
  // Age verification
  if (!profile.ageOver18) {
    return {
      eligibility: 'premium_required',
      excludedProducts: [],
      warnings: ['Protocols for individuals under 18 require specialized assessment'],
      requiresHumanOversight: true
    };
  }
  
  // Check medication interactions
  const normalizedMeds = profile.medications.map(m => m.toLowerCase().trim());
  
  for (const med of normalizedMeds) {
    for (const [drugName, excludedProds] of Object.entries(medicationInteractions)) {
      if (med.includes(drugName)) {
        excludedProducts.push(...excludedProds);
        warnings.push(`Interaction detected: ${med} may interact with certain supplements`);
      }
    }
  }
  
  // Check high-risk conditions
  const normalizedConditions = [
    ...profile.conditions.map(c => c.toLowerCase().trim()),
    ...profile.allergies.map(a => a.toLowerCase().trim())
  ];
  
  for (const condition of normalizedConditions) {
    for (const riskCondition of highRiskConditions) {
      if (condition.includes(riskCondition)) {
        requiresHumanOversight = true;
        warnings.push(`Complex medical profile detected: ${condition}`);
      }
    }
  }
  
  // Determine eligibility
  let eligibility: 'standard' | 'modified' | 'premium_required' = 'standard';
  
  if (requiresHumanOversight || warnings.length > 2) {
    eligibility = 'premium_required';
  } else if (excludedProducts.length > 0) {
    eligibility = 'modified';
  }
  
  return {
    eligibility,
    excludedProducts: [...new Set(excludedProducts)], // Remove duplicates
    warnings,
    requiresHumanOversight
  };
};