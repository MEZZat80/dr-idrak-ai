import { Card } from '@/components/ui/card';
import { Language } from '@/api/translations';
import ReactMarkdown from 'react-markdown';
import LiteratureReferences from './LiteratureReferences';

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

// Extract product recommendations from message content
function extractProducts(content: string): string[] {
  const products = [
    'AgeCore NAD+', 'Neuro-Blue', 'Rest Atlas', 'Zen Mode',
    'Dermalux', 'FlexiCore', 'InnerGlow Logic', 'Longevity Core', 'NeuroForge'
  ];
  return products.filter(product => content.includes(product));
}

// Extract health goal from message content
function extractHealthGoal(content: string): string {
  const goals: Record<string, string> = {
    'cognitive': 'cognitive enhancement',
    'memory': 'cognitive enhancement',
    'focus': 'cognitive enhancement',
    'sleep': 'sleep support',
    'stress': 'stress management',
    'anxiety': 'stress management',
    'aging': 'longevity',
    'skin': 'skin health',
    'joint': 'joint health',
    'gut': 'gut health',
    'digestion': 'gut health'
  };
  
  const lowerContent = content.toLowerCase();
  for (const [keyword, goal] of Object.entries(goals)) {
    if (lowerContent.includes(keyword)) return goal;
  }
  return 'wellness';
}

export default function MessageBubble({ message, language }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const isRTL = language === 'ar';
  
  const products = extractProducts(message.content);
  const healthGoal = extractHealthGoal(message.content);
  const showReferences = !isUser && products.length > 0;

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
      <div className={`max-w-[85%] ${isUser ? '' : 'w-full'}`}>
        <Card
          className={`p-5 shadow-md ${
            isUser
              ? 'bg-indigo-600 text-white border-0'
              : 'bg-white text-slate-900 border-2 border-slate-200'
          }`}
        >
          <div className={`text-base leading-relaxed ${isRTL ? 'text-right markdown-rtl' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
            <ReactMarkdown 
              components={{
                a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline hover:text-indigo-800" />,
                p: ({node, ...props}) => <p {...props} className="mb-2 last:mb-0" />,
                ul: ({node, ...props}) => <ul {...props} className="list-disc list-inside mb-2" />,
                ol: ({node, ...props}) => <ol {...props} className="list-decimal list-inside mb-2" />,
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
          <div className={`text-xs mt-3 ${isUser ? 'text-indigo-200' : 'text-slate-400'} ${isRTL ? 'text-right' : 'text-left'}`}>
            {message.timestamp.toLocaleTimeString(language === 'ar' ? 'ar-EG' : language === 'es' ? 'es-ES' : 'en-US', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </Card>
        
        {showReferences && (
          <LiteratureReferences 
            productName={products[0]} 
            healthGoal={healthGoal} 
          />
        )}
      </div>
    </div>
  );
}