import { Protocol, getProtocolForGoal } from './protocolMap';
import { UserProfile, assessRisk, RiskAssessment } from './riskStratification';

export interface ProtocolRecommendation {
  eligibility: 'standard' | 'modified' | 'premium_required';
  goal: string;
  protocol: Protocol | null;
  riskAssessment: RiskAssessment;
  complianceNote: string;
  monetizationPath: 'monthly_subscription' | 'premium_program';
}

export const generateProtocol = (profile: UserProfile): ProtocolRecommendation => {
  // Get risk assessment
  const riskAssessment = assessRisk(profile);
  
  // Get base protocol for goal
  const protocol = getProtocolForGoal(profile.goal);
  
  // Modify protocol based on exclusions
  let modifiedProtocol = protocol;
  if (protocol && riskAssessment.excludedProducts.length > 0) {
    // Check if catalyst is excluded
    if (riskAssessment.excludedProducts.includes(protocol.catalyst.name)) {
      // Remove catalyst from protocol
      modifiedProtocol = {
        ...protocol,
        catalyst: {
          name: 'Modified Protocol',
          description: 'Catalyst excluded due to medication interaction',
          benefits: []
        },
        synergyReason: `${protocol.core.name} provides targeted support for your ${profile.goal} goal. The catalyst has been excluded due to potential interactions with your current medications.`
      };
    }
  }
  
  // Determine monetization path
  const monetizationPath = riskAssessment.eligibility === 'premium_required' 
    ? 'premium_program' 
    : 'monthly_subscription';
  
  return {
    eligibility: riskAssessment.eligibility,
    goal: profile.goal,
    protocol: modifiedProtocol,
    riskAssessment,
    complianceNote: 'General wellness support only. Not intended to diagnose, treat, cure, or prevent any disease.',
    monetizationPath
  };
};