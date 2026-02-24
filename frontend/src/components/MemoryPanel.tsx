import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Brain, 
  Pill, 
  AlertTriangle, 
  History, 
  Trash2, 
  ChevronDown, 
  ChevronUp,
  User
} from 'lucide-react';
import { 
  UserMemory, 
  getMemory, 
  initializeMemory, 
  clearMemory,
  generateMemoryContext
} from '@/api/memorySystem';

interface MemoryPanelProps {
  userId?: string;
}

export default function MemoryPanel({ userId = 'anonymous' }: MemoryPanelProps) {
  const [memory, setMemory] = useState<UserMemory | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const mem = getMemory(userId) || initializeMemory(userId);
    setMemory(mem);
  }, [userId]);

  const handleClearMemory = () => {
    if (confirm('Are you sure you want to clear all memory? This cannot be undone.')) {
      clearMemory(userId);
      setMemory(initializeMemory(userId));
    }
  };

  if (!memory) return null;

  const hasHealthInfo = 
    memory.healthProfile.conditions.length > 0 ||
    memory.healthProfile.medications.length > 0 ||
    memory.healthProfile.allergies.length > 0;

  const hasHistory = memory.conversationHistory.length > 0;

  if (!expanded) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setExpanded(true)}
        className="fixed bottom-20 right-4 z-50 shadow-lg"
      >
        <Brain className="w-4 h-4 mr-2" />
        Memory
        {hasHealthInfo && (
          <Badge variant="secondary" className="ml-2 text-xs">
            {memory.healthProfile.conditions.length + memory.healthProfile.medications.length}
          </Badge>
        )}
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-20 right-4 z-50 w-80 shadow-xl">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center">
            <Brain className="w-4 h-4 mr-2 text-indigo-600" />
            Dr. Idrak Memory
          </CardTitle>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setExpanded(false)}
            >
              <span className="text-lg">×</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        {memory.safetyFlags.requiresOversight && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 mb-3">
            <div className="flex items-center text-amber-800">
              <AlertTriangle className="w-4 h-4 mr-2" />
              <span className="text-xs font-medium">Medical Oversight Required</span>
            </div>
          </div>
        )}

        {!hasHealthInfo && !hasHistory ? (
          <p className="text-sm text-slate-500 text-center py-4">
            No memory yet. Dr. Idrak will learn about you as you chat.
          </p>
        ) : (
          <ScrollArea className={showDetails ? "h-64" : "h-auto"}>
            <div className="space-y-3">
              {/* Health Profile */}
              {memory.healthProfile.conditions.length > 0 && (
                <div>
                  <div className="flex items-center text-xs font-medium text-slate-700 mb-1">
                    <User className="w-3 h-3 mr-1" />
                    Conditions
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {memory.healthProfile.conditions.map((condition) => (
                      <Badge key={condition} variant="outline" className="text-xs">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {memory.healthProfile.medications.length > 0 && (
                <div>
                  <div className="flex items-center text-xs font-medium text-slate-700 mb-1">
                    <Pill className="w-3 h-3 mr-1" />
                    Medications
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {memory.healthProfile.medications.map((med) => (
                      <Badge key={med} variant="secondary" className="text-xs">
                        {med}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {memory.healthProfile.allergies.length > 0 && (
                <div>
                  <div className="flex items-center text-xs font-medium text-slate-700 mb-1">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Allergies
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {memory.healthProfile.allergies.map((allergy) => (
                      <Badge key={allergy} variant="destructive" className="text-xs">
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Conversation History */}
              {showDetails && memory.conversationHistory.length > 0 && (
                <div>
                  <div className="flex items-center text-xs font-medium text-slate-700 mb-1">
                    <History className="w-3 h-3 mr-1" />
                    Recent Conversations
                  </div>
                  <div className="space-y-2">
                    {memory.conversationHistory.slice(0, 3).map((conv, idx) => (
                      <div key={idx} className="text-xs text-slate-600 bg-slate-50 p-2 rounded">
                        <div className="text-slate-400 text-[10px]">
                          {new Date(conv.date).toLocaleDateString()}
                        </div>
                        <div className="line-clamp-2">{conv.summary}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Safety Flags */}
              {memory.safetyFlags.drugInteractions.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded p-2">
                  <div className="text-xs font-medium text-red-800 mb-1">
                    Known Interactions
                  </div>
                  <div className="text-xs text-red-700">
                    {memory.safetyFlags.drugInteractions.join(', ')}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        )}

        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-3 text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleClearMemory}
        >
          <Trash2 className="w-3 h-3 mr-2" />
          Clear Memory
        </Button>
      </CardContent>
    </Card>
  );
}