import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, BookOpen, Loader2 } from 'lucide-react';
import { LiteratureResult, searchMedicalLiterature } from '@/api/medicalLiterature';

interface LiteratureReferencesProps {
  productName: string;
  healthGoal: string;
}

export default function LiteratureReferences({ productName, healthGoal }: LiteratureReferencesProps) {
  const [references, setReferences] = useState<LiteratureResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showReferences, setShowReferences] = useState(false);

  const fetchReferences = async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await searchMedicalLiterature(`${productName} ${healthGoal}`, 3);
      setReferences(results);
    } catch (err) {
      setError('Unable to fetch references at this time');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showReferences && references.length === 0) {
      fetchReferences();
    }
  }, [showReferences]);

  if (!showReferences) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowReferences(true)}
        className="mt-2"
      >
        <BookOpen className="w-4 h-4 mr-2" />
        View Scientific References
      </Button>
    );
  }

  if (loading) {
    return (
      <Card className="mt-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
            <span className="ml-2 text-sm text-slate-600">Searching medical literature...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mt-4">
        <CardContent className="p-4">
          <p className="text-sm text-slate-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (references.length === 0) {
    return (
      <Card className="mt-4">
        <CardContent className="p-4">
          <p className="text-sm text-slate-500">No references found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center">
          <BookOpen className="w-4 h-4 mr-2 text-indigo-600" />
          Scientific References
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-3">
          {references.map((ref) => (
            <div key={ref.id} className="border-l-2 border-indigo-200 pl-3 py-1">
              <p className="text-sm font-medium text-slate-800 line-clamp-2">
                {ref.title}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {ref.year}
                </Badge>
                <span className="text-xs text-slate-500 truncate max-w-[200px]">
                  {ref.journal}
                </span>
              </div>
              {ref.abstract && (
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                  {ref.abstract.substring(0, 150)}...
                </p>
              )}
              <a
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-xs text-indigo-600 hover:text-indigo-800 mt-1"
              >
                View on PubMed
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}