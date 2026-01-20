import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Shield, Microscope, TrendingUp, Globe } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
  onDemo: () => void;
}

export default function WelcomeScreen({ onStart, onDemo }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6">
      <div className="max-w-5xl w-full space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        {/* Logo and Hero Section */}
        <div className="text-center space-y-6">
          <div className="flex justify-center mb-8">
            <img 
              src="/idrak-logo.png" 
              alt="Idrak Pharma" 
              className="h-16 md:h-20"
            />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
            Dr. Idrak
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-700 font-medium">
            Clinical Guidance System
          </p>
          
          <p className="text-base md:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Evidence-based supplement protocol design tailored to your biology. 
            This is a guidance system that analyzes suitability and risk—not a replacement for medical care.
          </p>
        </div>

        {/* Core Principles */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 border-2 border-slate-200 hover:border-indigo-300 transition-all hover:shadow-lg bg-white">
            <Shield className="h-10 w-10 text-indigo-600 mb-4" />
            <h3 className="font-bold text-lg mb-2 text-slate-900">Safety First</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Automatic medication interaction analysis. Risk stratification before recommendation.
            </p>
          </Card>
          
          <Card className="p-6 border-2 border-slate-200 hover:border-blue-300 transition-all hover:shadow-lg bg-white">
            <Microscope className="h-10 w-10 text-blue-600 mb-4" />
            <h3 className="font-bold text-lg mb-2 text-slate-900">Science-Led</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Mechanistic synergy logic. Evidence-based pathway optimization, not trend-following.
            </p>
          </Card>
          
          <Card className="p-6 border-2 border-slate-200 hover:border-violet-300 transition-all hover:shadow-lg bg-white">
            <TrendingUp className="h-10 w-10 text-violet-600 mb-4" />
            <h3 className="font-bold text-lg mb-2 text-slate-900">Continuous Optimization</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Biology changes. Protocols adapt. Long-term value through monitoring and adjustment.
            </p>
          </Card>
        </div>

        {/* Confidence Gradient Notice */}
        <Card className="p-6 bg-gradient-to-r from-indigo-50 to-blue-50 border-2 border-indigo-200">
          <div className="space-y-3">
            <h3 className="font-bold text-lg text-slate-900">Managed Uncertainty</h3>
            <p className="text-slate-700 leading-relaxed">
              All protocols carry a confidence level based on interaction risk and profile complexity. 
              High confidence → standard protocol. Moderate confidence → conservative approach. 
              Low confidence or complex profiles → Premium Clinical Oversight with human review.
            </p>
          </div>
        </Card>

        {/* Language Support */}
        <Card className="p-5 bg-white border-2 border-slate-200">
          <div className="flex items-center gap-3">
            <Globe className="h-5 w-5 text-slate-600" />
            <p className="text-sm text-slate-600">
              Multi-language support: English • Arabic (العربية) • Spanish (Español)
            </p>
          </div>
        </Card>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={onStart}
            size="lg"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-6 text-lg shadow-lg font-semibold"
          >
            Begin Assessment
          </Button>
          
          <Button
            onClick={onDemo}
            size="lg"
            variant="outline"
            className="border-2 border-slate-300 text-slate-700 hover:bg-slate-50 px-10 py-6 text-lg font-semibold"
          >
            View Demo Flow
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center space-y-2">
          <p className="text-sm text-slate-500">
            Powered by MedGemma 1.5 • Voice & Document Analysis
          </p>
          <p className="text-xs text-slate-400">
            Not intended to diagnose, treat, cure, or prevent any disease. Consult your healthcare provider.
          </p>
        </div>
      </div>
    </div>
  );
}