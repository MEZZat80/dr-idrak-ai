import { Card } from '@/components/ui/card';
import { Language } from '@/api/translations';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface MessageBubbleProps {
  message: Message;
  language: Language;
}

export default function MessageBubble({ message, language }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const isRTL = language === 'ar';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
      <Card
        className={`max-w-[85%] p-5 shadow-md ${
          isUser
            ? 'bg-indigo-600 text-white border-0'
            : 'bg-white text-slate-900 border-2 border-slate-200'
        }`}
      >
        <div className={`text-base whitespace-pre-wrap leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
          {message.content}
        </div>
        <div className={`text-xs mt-3 ${isUser ? 'text-indigo-200' : 'text-slate-400'} ${isRTL ? 'text-right' : 'text-left'}`}>
          {message.timestamp.toLocaleTimeString(language === 'ar' ? 'ar-EG' : language === 'es' ? 'es-ES' : 'en-US', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </Card>
    </div>
  );
}