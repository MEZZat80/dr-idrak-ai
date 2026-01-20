# Dr. Idrak - AI Clinical Guidance System 🏥

<div align="center">

![Dr. Idrak](https://img.shields.io/badge/AI-Clinical%20Guidance-blue)
![Idrak Pharma](https://img.shields.io/badge/Idrak-Pharma-green)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

**AI-powered clinical guidance agent for evidence-based supplement recommendations**

[Features](#features) • [Quick Start](#quick-start) • [Tech Stack](#tech-stack) • [Products](#products) • [Documentation](#documentation)

</div>

---

## 🌟 Overview

Dr. Idrak is an advanced AI clinical guidance system designed for **Idrak Pharma**, providing personalized, evidence-based supplement recommendations with comprehensive safety screening and drug interaction analysis.

### Key Capabilities
- 🧠 **Intelligent Product Recommendations** - AI-powered analysis of user health goals
- 🔒 **Safety First** - Comprehensive contraindication and drug interaction screening
- 🌍 **Multi-language Support** - English, Arabic, and Spanish
- 📄 **Medical Document Analysis** - Extract information from prescriptions and lab reports
- 🎤 **Voice Chat** - Hands-free interaction support
- 💊 **10 Official Products** - Complete Idrak Pharma catalog integration

---

## 🚀 Features

### Clinical Intelligence
- **Risk Stratification** - Automated assessment of user health profile
- **Drug Interaction Checking** - Real-time analysis of supplement-medication interactions
- **Contraindication Screening** - Identifies safety concerns based on medical conditions
- **Complementary Recommendations** - Smart upselling with synergistic product pairings

### AI Technology
- **Model**: Google Gemini 3 Flash Preview
- **Multimodal**: Text and image analysis
- **Streaming Responses**: Real-time conversational experience
- **Context Awareness**: Maintains conversation history for personalized guidance

### User Experience
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Dark Mode** - Eye-friendly interface
- **Accessibility** - WCAG compliant
- **Voice Input** - Speech-to-text support

---

## 📦 Products

Dr. Idrak provides guidance on the complete **Idrak Pharma** product line:

| Product | Purpose | Key Ingredients |
|---------|---------|-----------------|
| **AgeCore NAD+** | Cellular longevity & energy | NAD+, Quercetin, Resveratrol |
| **Neuro-Blue** | Cognitive enhancement | Methylene Blue |
| **Rest Atlas** | Sleep & stress support | Magnesium Glycinate |
| **Zen Mode** | Adaptogenic stress relief | Ashwagandha |
| **Dermalux** | Skin health & anti-aging | Collagen Complex |
| **FlexiCore** | Joint support & mobility | Joint Support Formula |
| **InnerGlow Logic** | Gut health & immunity | Probiotic Complex |
| **Longevity Core** | Holistic wellness | Ayurvedic Complex |
| **NeuroForge** | Cognitive function | Nootropic Blend |
| **Ignite+** | Vitality support | *Currently Out of Stock* |

> 🔗 **Official Store**: [idrak-pharma.com](https://www.idrak-pharma.com)

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Library**: shadcn/ui + Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router v6
- **Icons**: Lucide React

### AI & Backend
- **AI Model**: Google Gemini 3 Flash Preview
- **API**: Google Generative AI SDK
- **Backend** (Optional): FastAPI + Python
- **Database** (Optional): PostgreSQL with SQLAlchemy

### Development Tools
- **Package Manager**: pnpm
- **Linting**: ESLint
- **Type Checking**: TypeScript
- **Version Control**: Git

---

## 🏁 Quick Start

### Prerequisites
- Node.js 18+ and pnpm
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/dr-idrak-ai.git
cd dr-idrak-ai
```

2. **Install dependencies**
```bash
cd frontend
pnpm install
```

3. **Configure environment variables**
```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your API key
# VITE_GEMINI_API_KEY=your_actual_api_key_here
```

4. **Start development server**
```bash
pnpm run dev
```

5. **Open your browser**
```
http://localhost:5173
```

### Build for Production
```bash
pnpm run build
pnpm run preview
```

---

## 📖 Documentation

### Project Structure
```
dr-idrak-ai/
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── ChatInterface.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   └── ProtocolDisplay.tsx
│   │   ├── lib/             # Core logic
│   │   │   ├── medgemmaClient.ts    # AI client
│   │   │   ├── protocolEngine.ts    # Recommendation engine
│   │   │   └── riskStratification.ts
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Route pages
│   │   └── index.css        # Global styles
│   ├── public/              # Static assets
│   ├── .env.example         # Environment template
│   └── package.json
├── backend/                 # Optional FastAPI backend
└── README.md
```

### Key Files

**`src/lib/medgemmaClient.ts`**
- AI client configuration
- Product catalog integration
- Safety screening logic
- Multimodal image analysis

**`src/components/ChatInterface.tsx`**
- Main chat UI
- Message handling
- Voice input integration

**`src/lib/protocolEngine.ts`**
- Protocol generation logic
- Product recommendation algorithm
- Complementary product pairing

---

## 🔐 Security & Privacy

⚠️ **IMPORTANT**: Never commit your `.env` file to version control!

- API keys are stored in `.env` (git-ignored)
- No user data is stored on servers
- All AI processing happens via secure Google APIs
- HIPAA-aware design (not HIPAA-certified)

---

## 🌍 Multi-language Support

Dr. Idrak automatically detects and responds in:
- 🇺🇸 English
- 🇸🇦 Arabic (العربية)
- 🇪🇸 Spanish (Español)

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Idrak Pharma** - Product catalog and clinical guidelines
- **Google AI** - Gemini 3 Flash Preview model
- **shadcn/ui** - Beautiful UI components
- **Atoms Platform** - Development environment

---

## 📞 Support

For questions or support:
- 📧 Email: support@idrak-pharma.com
- 🌐 Website: [idrak-pharma.com](https://www.idrak-pharma.com)
- 💬 Chat: Available in the app

---

<div align="center">

**Built with ❤️ for Idrak Pharma**

Made by [Your Name] • Powered by Atoms Platform

</div>