import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Send, Mic, Upload, Loader2 } from 'lucide-react';
import { generateResponse, analyzeImage } from '@/api/medgemmaClient';
import MessageBubble from './MessageBubble';
import { useToast } from '@/hooks/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstMessage, setIsFirstMessage] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send initial greeting when component mounts
  useEffect(() => {
    const sendInitialGreeting = async () => {
      if (isFirstMessage && messages.length === 0) {
        setIsLoading(true);
        try {
          const response = await generateResponse('Hello', []);
          const assistantMessage: Message = {
            role: 'assistant',
            content: response,
            timestamp: new Date(),
          };
          setMessages([assistantMessage]);
          setIsFirstMessage(false);
        } catch (error: any) {
          console.error('Error sending initial greeting:', error);
          toast({
            title: 'Connection Error',
            description: error.message || 'Failed to initialize chat',
            variant: 'destructive',
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    sendInitialGreeting();
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const conversationHistory = [...messages, userMessage].map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await generateResponse(input.trim(), conversationHistory);

      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Error generating response:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate response',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid File',
        description: 'Please upload an image file',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const imageData = event.target?.result as string;

        const userMessage: Message = {
          role: 'user',
          content: `[Uploaded medical document image]`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMessage]);

        try {
          const analysis = await analyzeImage(imageData);

          const assistantMessage: Message = {
            role: 'assistant',
            content: analysis,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, assistantMessage]);
        } catch (error: any) {
          console.error('Error analyzing image:', error);
          toast({
            title: 'Analysis Error',
            description: error.message || 'Failed to analyze image',
            variant: 'destructive',
          });
        } finally {
          setIsLoading(false);
        }
      };

      reader.readAsDataURL(file);
    } catch (error: any) {
      console.error('Error reading file:', error);
      toast({
        title: 'File Error',
        description: 'Failed to read file',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <img src="/idrak-logo.png" alt="Idrak Pharma" className="h-10" />
          <div>
            <h1 className="text-xl font-bold text-slate-900">Dr. Idrak</h1>
            <p className="text-sm text-slate-600">Clinical Guidance Agent</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message, index) => (
            <MessageBubble key={index} message={message} />
          ))}
          {isLoading && (
            <div className="flex justify-center">
              <Card className="p-4 bg-white border-slate-200">
                <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
              </Card>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-slate-200 p-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="shrink-0"
            >
              <Upload className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={isLoading}
              className="shrink-0"
            >
              <Mic className="h-5 w-5" />
            </Button>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe your health goals or concerns..."
              className="resize-none"
              rows={2}
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="shrink-0 bg-indigo-600 hover:bg-indigo-700"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-xs text-slate-500 mt-2 text-center">
            Not medical advice. Consult your healthcare provider for medical decisions.
          </p>
        </div>
      </div>
    </div>
  );
}