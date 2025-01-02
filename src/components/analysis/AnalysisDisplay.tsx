import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain } from 'lucide-react';

interface AnalysisDisplayProps {
  loading: boolean;
  analysis: string;
  onGenerate: () => void;
  t: (key: string) => string;
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({
  loading,
  analysis,
  onGenerate,
  t,
}) => {
  return (
    <Card className="p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{t('financial.analysis')}</h2>
        <Button onClick={onGenerate} disabled={loading}>
          <Brain className="mr-2 h-4 w-4" />
          {loading ? t('analyzing') : t('generate.analysis')}
        </Button>
      </div>
      {analysis && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="whitespace-pre-line">{analysis}</p>
        </div>
      )}
    </Card>
  );
};

export default AnalysisDisplay;