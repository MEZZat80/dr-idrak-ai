import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Star, TrendingUp } from 'lucide-react';
import { ProtocolRecommendation } from '@/api/protocolEngine';
import { translations, Language } from '@/api/translations';

interface SubscriptionOptionsProps {
  recommendation: ProtocolRecommendation;
  language: Language;
  onSelect: (type: 'monthly' | 'premium') => void;
}

export default function SubscriptionOptions({ recommendation, language, onSelect }: SubscriptionOptionsProps) {
  const t = translations[language];
  const isRTL = language === 'ar';
  const isPremiumRequired = recommendation.monetizationPath === 'premium_program';

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2" dir={isRTL ? 'rtl' : 'ltr'}>
          {t.subscriptionTitle}
        </h2>
        <p className="text-slate-600" dir={isRTL ? 'rtl' : 'ltr'}>
          {isPremiumRequired 
            ? (language === 'ar' 
                ? 'بناءً على تعقيد ملفك الشخصي، نوصي بالإشراف السريري المتميز'
                : language === 'es'
                ? 'Según la complejidad de tu perfil, recomendamos supervisión clínica premium'
                : 'Based on your profile complexity, we recommend Premium Clinical Oversight')
            : (language === 'ar'
                ? 'البيولوجيا تتغير. البروتوكولات تتكيف.'
                : language === 'es'
                ? 'La biología cambia. Los protocolos se adaptan.'
                : 'Biology changes. Protocols adapt.')}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Monthly Subscription */}
        <Card className={`p-6 ${isPremiumRequired ? 'opacity-60' : 'border-2 border-indigo-200 shadow-lg'}`}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-6 w-6 text-indigo-600" />
            <h3 className="text-xl font-bold text-slate-900" dir={isRTL ? 'rtl' : 'ltr'}>
              {t.monthlySubscription}
            </h3>
          </div>
          
          <p className="text-slate-600 mb-6" dir={isRTL ? 'rtl' : 'ltr'}>{t.monthlyDesc}</p>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-2">
              <Check className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
              <span className="text-sm text-slate-700" dir={isRTL ? 'rtl' : 'ltr'}>
                {language === 'ar' 
                  ? 'بروتوكول قائم على الأدلة مصمم لملفك الشخصي'
                  : language === 'es'
                  ? 'Protocolo basado en evidencia diseñado para tu perfil'
                  : 'Evidence-based protocol designed for your profile'}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
              <span className="text-sm text-slate-700" dir={isRTL ? 'rtl' : 'ltr'}>
                {language === 'ar'
                  ? 'تحسين مستمر مع تكيف البروتوكول'
                  : language === 'es'
                  ? 'Optimización continua con adaptación de protocolo'
                  : 'Continuous optimization with protocol adaptation'}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
              <span className="text-sm text-slate-700" dir={isRTL ? 'rtl' : 'ltr'}>
                {language === 'ar'
                  ? 'توصيل شهري تلقائي'
                  : language === 'es'
                  ? 'Entrega mensual automática'
                  : 'Automatic monthly delivery'}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
              <span className="text-sm text-slate-700" dir={isRTL ? 'rtl' : 'ltr'}>
                {language === 'ar'
                  ? 'مرونة في الإلغاء'
                  : language === 'es'
                  ? 'Flexibilidad de cancelación'
                  : 'Cancellation flexibility'}
              </span>
            </div>
          </div>
          
          <Button
            onClick={() => onSelect('monthly')}
            disabled={isPremiumRequired}
            className="w-full bg-indigo-600 hover:bg-indigo-700 font-semibold"
            size="lg"
          >
            {t.activateButton}
          </Button>
        </Card>

        {/* Premium Program */}
        <Card className={`p-6 ${isPremiumRequired ? 'border-2 border-violet-300 bg-gradient-to-br from-violet-50 to-purple-50 shadow-lg' : 'border-2 border-slate-200'}`}>
          <div className="flex items-center gap-2 mb-4">
            <Star className="h-6 w-6 text-violet-600" />
            <h3 className="text-xl font-bold text-slate-900" dir={isRTL ? 'rtl' : 'ltr'}>
              {t.premiumProgram}
            </h3>
          </div>
          
          <p className="text-slate-600 mb-6" dir={isRTL ? 'rtl' : 'ltr'}>{t.premiumDesc}</p>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-2">
              <Check className="h-5 w-5 text-violet-600 shrink-0 mt-0.5" />
              <span className="text-sm text-slate-700" dir={isRTL ? 'rtl' : 'ltr'}>
                {language === 'ar'
                  ? 'جميع ميزات البرنامج الشهري'
                  : language === 'es'
                  ? 'Todas las características del programa mensual'
                  : 'All monthly program features'}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="h-5 w-5 text-violet-600 shrink-0 mt-0.5" />
              <span className="text-sm text-slate-700" dir={isRTL ? 'rtl' : 'ltr'}>
                {language === 'ar'
                  ? 'مراجعة بشرية متخصصة للملفات المعقدة'
                  : language === 'es'
                  ? 'Revisión humana experta para perfiles complejos'
                  : 'Expert human review for complex profiles'}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="h-5 w-5 text-violet-600 shrink-0 mt-0.5" />
              <span className="text-sm text-slate-700" dir={isRTL ? 'rtl' : 'ltr'}>
                {language === 'ar'
                  ? 'تعديلات البروتوكول بناءً على المراقبة'
                  : language === 'es'
                  ? 'Ajustes de protocolo basados en monitoreo'
                  : 'Protocol adjustments based on monitoring'}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="h-5 w-5 text-violet-600 shrink-0 mt-0.5" />
              <span className="text-sm text-slate-700" dir={isRTL ? 'rtl' : 'ltr'}>
                {language === 'ar'
                  ? 'دعم مباشر من فريق سريري'
                  : language === 'es'
                  ? 'Soporte directo del equipo clínico'
                  : 'Direct clinical team support'}
              </span>
            </div>
          </div>
          
          <Button
            onClick={() => onSelect('premium')}
            className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 font-semibold"
            size="lg"
          >
            {t.activateButton}
          </Button>
        </Card>
      </div>

      {/* Recommendation Note */}
      {isPremiumRequired && (
        <Card className="p-4 bg-violet-50 border-2 border-violet-200">
          <p className="text-sm text-violet-900 text-center leading-relaxed" dir={isRTL ? 'rtl' : 'ltr'}>
            {language === 'ar'
              ? 'نوصي بشدة بالإشراف السريري المتميز لملفك الشخصي لضمان السلامة المثلى والفعالية'
              : language === 'es'
              ? 'Recomendamos encarecidamente la supervisión clínica premium para tu perfil para garantizar la seguridad y eficacia óptimas'
              : 'We strongly recommend Premium Clinical Oversight for your profile to ensure optimal safety and efficacy'}
          </p>
        </Card>
      )}
    </div>
  );
}