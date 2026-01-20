export interface Product {
  name: string;
  description: string;
  benefits: string[];
  mechanism: string;
}

export interface Protocol {
  name: string;
  core: Product;
  catalyst: Product;
  foundation?: Product;
  synergyReason: string;
  mechanisticBasis: string;
  targetGoals: string[];
  confidence: 'high' | 'moderate';
}

export const products: Record<string, Product> = {
  neuroForge: {
    name: "NeuroForge",
    description: "Cognitive pathway optimization",
    mechanism: "Supports acetylcholine synthesis and neuroplasticity signaling",
    benefits: [
      "Supports cognitive processing efficiency",
      "Promotes memory consolidation pathways",
      "Maintains healthy neurotransmitter balance"
    ]
  },
  neuroBlue: {
    name: "Neuro-Blue",
    description: "Mitochondrial catalyst",
    mechanism: "Enhances electron transport chain efficiency",
    benefits: [
      "Supports cellular energy metabolism",
      "Promotes mitochondrial function",
      "Maintains cognitive energy availability"
    ]
  },
  restAtlas: {
    name: "Rest Atlas",
    description: "Sleep architecture support",
    mechanism: "Modulates GABAergic signaling and circadian rhythm",
    benefits: [
      "Supports deep sleep phase duration",
      "Promotes natural sleep-wake cycle",
      "Maintains recovery process efficiency"
    ]
  },
  zenMode: {
    name: "Zen Mode",
    description: "HPA axis modulation",
    mechanism: "Supports cortisol regulation and stress response",
    benefits: [
      "Promotes healthy stress response",
      "Supports emotional regulation",
      "Maintains HPA axis balance"
    ]
  },
  ageCoreNAD: {
    name: "AgeCore NAD+",
    description: "NAD+ precursor optimization",
    mechanism: "Supports cellular NAD+ biosynthesis pathways",
    benefits: [
      "Promotes cellular energy production",
      "Supports DNA repair mechanisms",
      "Maintains healthy aging processes"
    ]
  },
  dermalux: {
    name: "Dermalux",
    description: "Collagen synthesis support",
    mechanism: "Provides structural protein precursors",
    benefits: [
      "Supports collagen production",
      "Promotes skin elasticity",
      "Maintains dermal cellular health"
    ]
  },
  innerGlowLogic: {
    name: "InnerGlow Logic",
    description: "Gut-brain axis optimization",
    mechanism: "Supports microbiome diversity and gut barrier integrity",
    benefits: [
      "Promotes digestive health",
      "Supports nutrient absorption",
      "Maintains gut microbiome balance"
    ]
  },
  longevityCore: {
    name: "Longevity Core",
    description: "Foundational micronutrient support",
    mechanism: "Provides essential cofactors for metabolic pathways",
    benefits: [
      "Supports baseline nutritional status",
      "Promotes metabolic efficiency",
      "Maintains cellular function"
    ]
  }
};

export const protocolMap: Record<string, Protocol> = {
  cognitiveDominance: {
    name: "Cognitive Performance Protocol",
    core: products.neuroForge,
    catalyst: products.neuroBlue,
    synergyReason: "NeuroForge provides neurotransmitter precursors while Neuro-Blue optimizes mitochondrial ATP production, creating substrate availability with energy efficiency.",
    mechanisticBasis: "Acetylcholine pathway support + mitochondrial electron transport enhancement",
    targetGoals: ["focus"],
    confidence: "high"
  },
  deepRestoration: {
    name: "Sleep & Recovery Protocol",
    core: products.restAtlas,
    catalyst: products.zenMode,
    synergyReason: "Rest Atlas supports GABAergic sleep signaling while Zen Mode reduces cortisol interference, enabling deeper sleep architecture.",
    mechanisticBasis: "GABA modulation + HPA axis regulation",
    targetGoals: ["sleep", "stress"],
    confidence: "high"
  },
  cellularResilience: {
    name: "Longevity & Cellular Health Protocol",
    core: products.ageCoreNAD,
    catalyst: products.dermalux,
    synergyReason: "AgeCore NAD+ powers cellular energy and DNA repair while Dermalux provides structural protein support, addressing both energy and structure.",
    mechanisticBasis: "NAD+ biosynthesis + collagen synthesis pathway support",
    targetGoals: ["aging", "skin"],
    confidence: "moderate"
  },
  foundationProtocol: {
    name: "Gut-Brain Foundation Protocol",
    core: products.innerGlowLogic,
    catalyst: products.longevityCore,
    synergyReason: "InnerGlow Logic optimizes gut absorption capacity while Longevity Core provides essential micronutrients, maximizing bioavailability.",
    mechanisticBasis: "Gut barrier integrity + micronutrient cofactor availability",
    targetGoals: ["gut", "joints"],
    confidence: "high"
  }
};

export const getProtocolForGoal = (goal: string): Protocol | null => {
  for (const protocol of Object.values(protocolMap)) {
    if (protocol.targetGoals.includes(goal)) {
      return protocol;
    }
  }
  return null;
};