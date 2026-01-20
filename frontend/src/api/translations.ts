export type Language = 'en' | 'ar' | 'es';

export const translations = {
  en: {
    welcome: "Welcome. I'm Dr. Idrak, your clinical guidance system.",
    intro: "I'll help you design an evidence-based supplement protocol tailored to your wellness goals and health profile. This is a guidance system, not medical advice.",
    startButton: "Begin Assessment",
    voiceInput: "Voice input",
    typeMessage: "Type your message...",
    send: "Send",
    uploadImage: "Upload medical document",
    uploadAudio: "Upload audio note",
    
    // Intake questions
    goalQuestion: "What is your primary optimization goal?",
    goals: {
      focus: "Cognitive Performance & Focus",
      stress: "Stress Resilience & Mood Balance",
      sleep: "Sleep Architecture & Recovery",
      aging: "Cellular Longevity & Healthspan",
      gut: "Gut-Brain Axis Optimization",
      joints: "Joint Health & Mobility",
      skin: "Dermal Health & Cellular Renewal"
    },
    medicationQuestion: "Are you currently taking any prescription medications? Please list them with dosages if possible.",
    conditionQuestion: "Do you have any diagnosed medical conditions or known allergies?",
    ageQuestion: "Please confirm you are 18 years or older.",
    
    // Protocol
    protocolTitle: "Evidence-Based Protocol",
    coreProduct: "Core Pathway",
    catalystProduct: "Catalyst Amplifier",
    foundationProduct: "Foundation Support",
    synergyReason: "Mechanistic Synergy",
    complianceNote: "This protocol supports general wellness optimization. It is not intended to diagnose, treat, cure, or prevent any disease. Consult your healthcare provider before starting any supplement regimen.",
    confidenceNote: "Protocol Confidence",
    
    // Monetization
    subscriptionTitle: "Optimization Path",
    monthlySubscription: "Continuous Optimization Program",
    monthlyDesc: "Biology changes. Your protocol should too.",
    premiumProgram: "Premium Clinical Oversight",
    premiumDesc: "Complex profiles require expert human review",
    activateButton: "Proceed",
    
    // Status
    analyzing: "Analyzing profile and interaction risk...",
    processing: "Processing...",
    listening: "Listening...",
    
    // Safety
    safetyFirst: "Safety First",
    interactionDetected: "Interaction Risk Detected",
    complexProfile: "Complex Profile — Premium Oversight Recommended",
    moderateConfidence: "Moderate Confidence Protocol",
    highConfidence: "High Confidence Protocol",
  },
  ar: {
    welcome: "مرحباً. أنا د. إدراك، نظام الإرشاد السريري الخاص بك.",
    intro: "سأساعدك في تصميم بروتوكول مكملات قائم على الأدلة ومصمم خصيصاً لأهدافك الصحية وملفك الطبي. هذا نظام إرشادي وليس استشارة طبية.",
    startButton: "بدء التقييم",
    voiceInput: "إدخال صوتي",
    typeMessage: "اكتب رسالتك...",
    send: "إرسال",
    uploadImage: "تحميل مستند طبي",
    uploadAudio: "تحميل ملاحظة صوتية",
    
    goalQuestion: "ما هو هدفك الأساسي للتحسين؟",
    goals: {
      focus: "الأداء المعرفي والتركيز",
      stress: "مرونة التوتر وتوازن المزاج",
      sleep: "بنية النوم والتعافي",
      aging: "طول العمر الخلوي والصحة",
      gut: "تحسين محور الأمعاء والدماغ",
      joints: "صحة المفاصل والحركة",
      skin: "الصحة الجلدية والتجديد الخلوي"
    },
    medicationQuestion: "هل تتناول حالياً أي أدوية موصوفة؟ يرجى ذكرها مع الجرعات إن أمكن.",
    conditionQuestion: "هل لديك أي حالات طبية مشخصة أو حساسية معروفة؟",
    ageQuestion: "يرجى تأكيد أنك 18 عاماً أو أكبر.",
    
    protocolTitle: "بروتوكول قائم على الأدلة",
    coreProduct: "المسار الأساسي",
    catalystProduct: "مضخم المحفز",
    foundationProduct: "الدعم الأساسي",
    synergyReason: "التآزر الميكانيكي",
    complianceNote: "يدعم هذا البروتوكول التحسين الصحي العام. وهو غير مخصص لتشخيص أو علاج أو شفاء أو منع أي مرض. استشر مقدم الرعاية الصحية قبل بدء أي نظام مكملات.",
    confidenceNote: "ثقة البروتوكول",
    
    subscriptionTitle: "مسار التحسين",
    monthlySubscription: "برنامج التحسين المستمر",
    monthlyDesc: "البيولوجيا تتغير. يجب أن يتغير بروتوكولك أيضاً.",
    premiumProgram: "الإشراف السريري المتميز",
    premiumDesc: "الملفات المعقدة تتطلب مراجعة بشرية متخصصة",
    activateButton: "متابعة",
    
    analyzing: "تحليل الملف الشخصي ومخاطر التفاعل...",
    processing: "جاري المعالجة...",
    listening: "الاستماع...",
    
    safetyFirst: "السلامة أولاً",
    interactionDetected: "اكتشاف خطر التفاعل",
    complexProfile: "ملف معقد — يُوصى بالإشراف المتميز",
    moderateConfidence: "بروتوكول ثقة معتدلة",
    highConfidence: "بروتوكول ثقة عالية",
  },
  es: {
    welcome: "Bienvenido. Soy Dr. Idrak, su sistema de orientación clínica.",
    intro: "Le ayudaré a diseñar un protocolo de suplementos basado en evidencia adaptado a sus objetivos de bienestar y perfil de salud. Este es un sistema de orientación, no asesoramiento médico.",
    startButton: "Comenzar Evaluación",
    voiceInput: "Entrada de voz",
    typeMessage: "Escribe tu mensaje...",
    send: "Enviar",
    uploadImage: "Subir documento médico",
    uploadAudio: "Subir nota de audio",
    
    goalQuestion: "¿Cuál es su objetivo principal de optimización?",
    goals: {
      focus: "Rendimiento Cognitivo y Enfoque",
      stress: "Resiliencia al Estrés y Balance del Estado de Ánimo",
      sleep: "Arquitectura del Sueño y Recuperación",
      aging: "Longevidad Celular y Salud",
      gut: "Optimización del Eje Intestino-Cerebro",
      joints: "Salud Articular y Movilidad",
      skin: "Salud Dérmica y Renovación Celular"
    },
    medicationQuestion: "¿Está tomando actualmente algún medicamento recetado? Por favor, enumérelos con dosis si es posible.",
    conditionQuestion: "¿Tiene alguna condición médica diagnosticada o alergias conocidas?",
    ageQuestion: "Por favor, confirme que tiene 18 años o más.",
    
    protocolTitle: "Protocolo Basado en Evidencia",
    coreProduct: "Vía Principal",
    catalystProduct: "Amplificador Catalizador",
    foundationProduct: "Soporte Fundamental",
    synergyReason: "Sinergia Mecanística",
    complianceNote: "Este protocolo apoya la optimización del bienestar general. No está destinado a diagnosticar, tratar, curar o prevenir ninguna enfermedad. Consulte a su proveedor de atención médica antes de comenzar cualquier régimen de suplementos.",
    confidenceNote: "Confianza del Protocolo",
    
    subscriptionTitle: "Camino de Optimización",
    monthlySubscription: "Programa de Optimización Continua",
    monthlyDesc: "La biología cambia. Su protocolo también debería.",
    premiumProgram: "Supervisión Clínica Premium",
    premiumDesc: "Los perfiles complejos requieren revisión humana experta",
    activateButton: "Proceder",
    
    analyzing: "Analizando perfil y riesgo de interacción...",
    processing: "Procesando...",
    listening: "Escuchando...",
    
    safetyFirst: "Seguridad Primero",
    interactionDetected: "Riesgo de Interacción Detectado",
    complexProfile: "Perfil Complejo — Se Recomienda Supervisión Premium",
    moderateConfidence: "Protocolo de Confianza Moderada",
    highConfidence: "Protocolo de Alta Confianza",
  }
};

export const detectLanguage = (text: string): Language => {
  // Arabic detection
  const arabicPattern = /[\u0600-\u06FF]/;
  if (arabicPattern.test(text)) return 'ar';
  
  // Spanish detection (common Spanish words)
  const spanishWords = /\b(hola|gracias|por favor|buenos|días|qué|cómo|estás|soy|tengo)\b/i;
  if (spanishWords.test(text)) return 'es';
  
  // Default to English
  return 'en';
};