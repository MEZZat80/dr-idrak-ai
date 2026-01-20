# Dr. Idrak AI Clinical Guidance & Sales Agent - Development Plan

## Design Guidelines

### Design References (Primary Inspiration)
- **Healthcare.gov**: Clean, accessible medical interface
- **Calm.com**: Soothing wellness aesthetic
- **Style**: Modern Medical + Trust-Building + Conversational AI

### Color Palette
- Primary: #0A4D68 (Medical Teal - trust and professionalism)
- Secondary: #088395 (Bright Teal - interactive elements)
- Accent: #05BFDB (Light Cyan - highlights and CTAs)
- Background: #F8FEFF (Soft White - clean medical feel)
- Text: #1A1A1A (Dark Gray), #4A5568 (Medium Gray - secondary)
- Success: #10B981 (Green - positive actions)
- Warning: #F59E0B (Amber - caution states)
- Error: #EF4444 (Red - contraindications)

### Typography
- Heading1: Inter font-weight 700 (36px)
- Heading2: Inter font-weight 600 (28px)
- Heading3: Inter font-weight 600 (20px)
- Body/Normal: Inter font-weight 400 (16px)
- Body/Emphasis: Inter font-weight 600 (16px)
- Small: Inter font-weight 400 (14px)

### Key Component Styles
- **Chat Bubbles**: User messages (teal gradient), AI messages (white with subtle shadow)
- **Buttons**: Primary (teal #088395), hover: brighten 10%, rounded-lg
- **Cards**: White background, subtle border, 12px rounded, soft shadow
- **Input Fields**: White background, teal border on focus, rounded-md
- **Voice Button**: Circular, pulsing animation when recording

### Layout & Spacing
- Chat container: Max-width 900px, centered
- Message padding: 16px vertical, 20px horizontal
- Card spacing: 24px gaps between protocol cards
- Section padding: 40px vertical

### Images to Generate
1. **hero-medical-ai.jpg** - Modern AI healthcare interface with holographic medical symbols (Style: photorealistic, futuristic medical)
2. **wellness-journey.jpg** - Person meditating with wellness icons floating around (Style: photorealistic, calming atmosphere)
3. **supplement-protocol.jpg** - Premium supplement bottles arranged professionally (Style: photorealistic, product photography)
4. **voice-interaction.jpg** - Person speaking to AI assistant on device (Style: photorealistic, modern technology)

---

## Development Tasks

### 1. Project Setup & Structure
- Initialize shadcn-ui template
- Install additional dependencies: @google/generative-ai, react-speech-recognition, wavesurfer.js
- Create folder structure: components/chat, components/intake, components/protocol, lib/medgemma

### 2. Generate Images
- Create all 4 images using ImageCreator.generate_images following design guidelines

### 3. Core Components
- ChatInterface: Main conversation container with message history
- MessageBubble: User and AI message display with language support
- VoiceInput: Voice recording button with waveform visualization
- TextInput: Text input field with send button
- ImageUpload: Drag-drop area for medical documents/prescriptions
- AudioUpload: Audio file upload for voice notes

### 4. Intake System
- IntakeFlow: Step-by-step questionnaire manager
- GoalSelector: Wellness goal selection (focus, stress, sleep, aging, gut, joints, skin)
- MedicationInput: Current medications collector with autocomplete
- ConditionInput: Medical conditions and allergies input
- AgeVerification: Age range verification (under/over 18)

### 5. Risk & Protocol Engine
- riskStratification.ts: Interaction checking logic (SSRIs + Methylene Blue, etc.)
- protocolEngine.ts: Synergy-based product matching
- eligibilityCalculator.ts: Determine standard/modified/premium_required
- protocolMap.ts: Approved protocol definitions (Cognitive Dominance, Deep Restoration, etc.)

### 6. Protocol Display
- ProtocolCard: Visual card for recommended products
- ProductDetails: Core/Catalyst/Foundation product info
- SynergyExplanation: Clear synergy reasoning display
- ComplianceNote: Legal disclaimer component

### 7. Monetization Flow
- SubscriptionOptions: Monthly Protocol vs Premium Program
- PricingCard: Subscription tier display
- CTAButton: Decisive call-to-action button
- ActivationFlow: Subscription activation process

### 8. MedGemma Integration
- medgemmaClient.ts: Google Generative AI client setup
- languageDetection.ts: Automatic language detection (Arabic, English, Spanish)
- voiceProcessing.ts: Speech-to-text and text-to-speech
- imageAnalysis.ts: Medical document/prescription analysis
- conversationManager.ts: State management for intake progress

### 9. Multi-language Support
- translations.ts: Arabic, English, Spanish translations
- languageContext.tsx: Language state management
- rtlSupport.css: Right-to-left support for Arabic

### 10. Testing & Polish
- Test voice input/output in all languages
- Test image upload and analysis
- Verify risk stratification logic
- Test protocol recommendations
- Cross-browser compatibility
- Mobile responsiveness
- Accessibility (WCAG AA)

### 11. Final Check
- Run lint and build
- Verify all flows work end-to-end
- Check UI rendering quality