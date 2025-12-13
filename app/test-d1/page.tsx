'use client';

import { useState } from 'react';
import { testDatabase } from './actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestD1Page() {
  const [result, setResult] = useState<{
    success: boolean;
    mode: string;
    count: number;
    message: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTest = async () => {
    setIsLoading(true);
    try {
      const res = await testDatabase();
      setResult(res);
    } catch (error) {
      setResult({
        success: false,
        mode: 'unknown',
        count: 0,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Database Connection Test</CardTitle>
          <CardDescription>
            Test the hybrid database connection (Local SQLite in dev, Cloudflare D1 in production)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleTest} disabled={isLoading} className="w-full">
            {isLoading ? 'Testing...' : 'Test Database Connection'}
          </Button>

          {result && (
            <div
              className={`p-4 rounded-lg border ${
                result.success
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Status:</span>
                  <span>{result.success ? '✅ Connected' : '❌ Failed'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Mode:</span>
                  <span className="uppercase">{result.mode}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Stories Count:</span>
                  <span>{result.count}</span>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-sm">{result.message}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
