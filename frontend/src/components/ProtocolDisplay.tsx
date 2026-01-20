import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertTriangle, Shield } from 'lucide-react';
import { ProtocolRecommendation } from '@/lib/protocolEngine';
import { translations, Language } from '@/lib/translations';

interface ProtocolDisplayProps {
  recommendation: ProtocolRecommendation;
  language: Language;
  onNext: () => void;
}

export default function ProtocolDisplay({ recommendation, language, onNext }: ProtocolDisplayProps) {
  const t = translations[language];
  const isRTL = language === 'ar';

  if (!recommendation.protocol) {
    return (
      <Card className="p-6 bg-amber-50 border-2 border-amber-200">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-6 w-6 text-amber-600 shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-amber-900 mb-2">{t.complexProfile}</h3>
            <p className="text-amber-800 leading-relaxed">
              Your profile requires expert human review to ensure optimal safety and efficacy. 
              We recommend the Premium Clinical Oversight program.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const { protocol, eligibility, riskAssessment } = recommendation;
  const confidence = protocol.confidence;

  return (
    <div className="space-y-6">
      {/* Confidence & Safety Status */}
      <div className="flex items-center justify-center gap-3">
        <Shield className="h-5 w-5 text-indigo-600" />
        <Badge 
          variant={confidence === 'high' ? 'default' : 'secondary'}
          className={`text-sm px-4 py-2 ${confidence === 'high' ? 'bg-indigo-600' : 'bg-slate-500'}`}
        >
          {confidence === 'high' ? t.highConfidence : t.moderateConfidence}
        </Badge>
      </div>

      {/* Protocol Title */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2" dir={isRTL ? 'rtl' : 'ltr'}>
          {t.protocolTitle}
        </h2>
        <p className="text-lg text-indigo-600 font-semibold">{protocol.name}</p>
      </div>

      {/* Safety Warnings */}
      {riskAssessment.warnings.length > 0 && (
        <Card className="p-4 bg-amber-50 border-2 border-amber-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="font-semibold text-amber-900">{t.interactionDetected}</p>
              {riskAssessment.warnings.map((warning, index) => (
                <p key={index} className="text-sm text-amber-800">{warning}</p>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Core Product */}
      <Card className="p-6 border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="flex items-start gap-3 mb-4">
          <CheckCircle2 className="h-6 w-6 text-indigo-600 shrink-0 mt-1" />
          <div className="flex-1">
            <div className="text-sm font-semibold text-indigo-700 mb-1" dir={isRTL ? 'rtl' : 'ltr'}>
              {t.coreProduct}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{protocol.core.name}</h3>
            <p className="text-slate-700 mb-2">{protocol.core.description}</p>
            <p className="text-sm text-slate-600 italic mb-3">{protocol.core.mechanism}</p>
            <ul className="space-y-1">
              {protocol.core.benefits.map((benefit, index) => (
                <li key={index} className="text-sm text-slate-700 flex items-start gap-2">
                  <span className="text-indigo-500 mt-1">•</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      {/* Catalyst Product */}
      {protocol.catalyst.name !== 'Modified Protocol' && (
        <Card className="p-6 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
          <div className="flex items-start gap-3 mb-4">
            <CheckCircle2 className="h-6 w-6 text-blue-600 shrink-0 mt-1" />
            <div className="flex-1">
              <div className="text-sm font-semibold text-blue-700 mb-1" dir={isRTL ? 'rtl' : 'ltr'}>
                {t.catalystProduct}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{protocol.catalyst.name}</h3>
              <p className="text-slate-700 mb-2">{protocol.catalyst.description}</p>
              <p className="text-sm text-slate-600 italic mb-3">{protocol.catalyst.mechanism}</p>
              <ul className="space-y-1">
                {protocol.catalyst.benefits.map((benefit, index) => (
                  <li key={index} className="text-sm text-slate-700 flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      {/* Mechanistic Synergy */}
      <Card className="p-6 bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-violet-200">
        <h3 className="font-semibold text-violet-900 mb-2" dir={isRTL ? 'rtl' : 'ltr'}>
          {t.synergyReason}
        </h3>
        <p className="text-slate-700 mb-3" dir={isRTL ? 'rtl' : 'ltr'}>{protocol.synergyReason}</p>
        <p className="text-sm text-slate-600 italic" dir={isRTL ? 'rtl' : 'ltr'}>
          Mechanistic basis: {protocol.mechanisticBasis}
        </p>
      </Card>

      {/* Compliance Note */}
      <Card className="p-4 bg-slate-50 border-2 border-slate-200">
        <p className="text-xs text-slate-600 text-center leading-relaxed" dir={isRTL ? 'rtl' : 'ltr'}>
          {t.complianceNote}
        </p>
      </Card>

      {/* Next Button */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={onNext}
          size="lg"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 font-semibold"
        >
          {language === 'ar' ? 'التالي' : language === 'es' ? 'Siguiente' : 'Continue'}
        </Button>
      </div>
    </div>
  );
}