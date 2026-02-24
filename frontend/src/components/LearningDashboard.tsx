import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Lightbulb,
  Target,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import { 
  LearningData, 
  getLearningData, 
  initializeLearning,
  generateLearningContext
} from '@/api/selfLearning';

export default function LearningDashboard() {
  const [data, setData] = useState<LearningData | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    const learningData = getLearningData() || initializeLearning();
    setData(learningData);
  }, []);

  if (!data) return null;

  if (!showDashboard) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowDashboard(true)}
        className="fixed bottom-32 right-4 z-50 shadow-lg"
      >
        <Brain className="w-4 h-4 mr-2" />
        Learning
        {Object.keys(data.productFeedback).length > 0 && (
          <Badge variant="secondary" className="ml-2 text-xs">
            {Object.keys(data.productFeedback).length}
          </Badge>
        )}
      </Button>
    );
  }

  // Calculate stats
  const totalRecommendations = Object.values(data.productFeedback)
    .reduce((sum, f) => sum + f.recommended, 0);
  
  const totalPurchases = Object.values(data.productFeedback)
    .reduce((sum, f) => sum + f.purchased, 0);
  
  const avgSatisfaction = data.conversationPatterns.length > 0
    ? data.conversationPatterns.reduce((sum, p) => sum + p.userSatisfaction, 0) / data.conversationPatterns.length
    : 0;

  const topProducts = Object.entries(data.productFeedback)
    .sort((a, b) => b[1].effectivenessRating - a[1].effectivenessRating)
    .slice(0, 5);

  const insights = Object.entries(data.medicalInsights)
    .sort((a, b) => new Date(b[1].lastUpdated).getTime() - new Date(a[1].lastUpdated).getTime())
    .slice(0, 5);

  return (
    <Card className="fixed bottom-32 right-4 z-50 w-96 shadow-xl max-h-[80vh]">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center">
            <Brain className="w-4 h-4 mr-2 text-indigo-600" />
            Dr. Idrak Learning Insights
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setShowDashboard(false)}
          >
            <span className="text-lg">×</span>
          </Button>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Last analyzed: {new Date(data.lastAnalysis).toLocaleDateString()}
        </p>
      </CardHeader>

      <ScrollArea className="max-h-[60vh]">
        <CardContent className="p-4 pt-0 space-y-4">
          {/* Stats Overview */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-50 p-2 rounded text-center">
              <div className="text-lg font-bold text-indigo-600">{totalRecommendations}</div>
              <div className="text-[10px] text-slate-500">Recommendations</div>
            </div>
            <div className="bg-slate-50 p-2 rounded text-center">
              <div className="text-lg font-bold text-green-600">{totalPurchases}</div>
              <div className="text-[10px] text-slate-500">Purchases</div>
            </div>
            <div className="bg-slate-50 p-2 rounded text-center">
              <div className="text-lg font-bold text-amber-600">
                {(avgSatisfaction * 100).toFixed(0)}%
              </div>
              <div className="text-[10px] text-slate-500">Satisfaction</div>
            </div>
          </div>

          {/* Top Performing Products */}
          {topProducts.length > 0 && (
            <div>
              <div className="flex items-center text-xs font-medium text-slate-700 mb-2">
                <BarChart3 className="w-3 h-3 mr-1" />
                Top Performing Products
              </div>
              <div className="space-y-2">
                {topProducts.map(([product, feedback]) => (
                  <div key={product} className="bg-slate-50 p-2 rounded">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium">{product}</span>
                      <Badge 
                        variant={feedback.effectivenessRating > 0.7 ? 'default' : 'secondary'}
                        className="text-[10px]"
                      >
                        {(feedback.effectivenessRating * 100).toFixed(0)}%
                      </Badge>
                    </div>
                    <Progress 
                      value={feedback.effectivenessRating * 100} 
                      className="h-1"
                    />
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                      <span>{feedback.recommended} recs</span>
                      <span>•</span>
                      <span>{feedback.purchased} purchases</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Medical Insights */}
          {insights.length > 0 && (
            <div>
              <div className="flex items-center text-xs font-medium text-slate-700 mb-2">
                <Lightbulb className="w-3 h-3 mr-1" />
                Medical Insights
              </div>
              <div className="space-y-2">
                {insights.map(([condition, insight]) => (
                  <div key={condition} className="bg-indigo-50 p-2 rounded border border-indigo-100">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium capitalize">{condition}</span>
                      <Badge 
                        variant={
                          insight.evidenceStrength === 'strong' ? 'default' :
                          insight.evidenceStrength === 'moderate' ? 'secondary' :
                          'outline'
                        }
                        className="text-[10px]"
                      >
                        {insight.evidenceStrength}
                      </Badge>
                    </div>
                    <div className="text-[10px] text-slate-600">
                      Effective: {insight.effectiveProducts.slice(0, 3).join(', ')}
                    </div>
                  </div>
                ))}
  </div>
            </div>
          )}

          {/* Pattern Analysis */}
          {data.conversationPatterns.length > 0 && (
            <div>
              <div className="flex items-center text-xs font-medium text-slate-700 mb-2">
                <Target className="w-3 h-3 mr-1" />
                Conversation Patterns
              </div>
              <div className="space-y-1">
                {data.conversationPatterns
                  .sort((a, b) => b.userSatisfaction - a.userSatisfaction)
                  .slice(0, 3)
                  .map((pattern) => (
                    <div key={pattern.queryType} className="flex items-center justify-between text-xs">
                      <span className="capitalize">{pattern.queryType.replace('-', ' ')}</span>
                      <div className="flex items-center">
                        {pattern.userSatisfaction > 0.7 ? (
                          <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                        ) : pattern.userSatisfaction < 0.4 ? (
                          <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
                        ) : (
                          <Minus className="w-3 h-3 text-slate-400 mr-1" />
                        )}
                        <span className="text-slate-500">
                          {(pattern.userSatisfaction * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {totalRecommendations === 0 && (
            <p className="text-sm text-slate-500 text-center py-4">
              No learning data yet. Dr. Idrak will learn from conversations over time.
            </p>
          )}
        </CardContent>
      </ScrollArea>
    </Card>
  );
}