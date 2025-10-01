
'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MOCK_STUDENTS, MOCK_TEST_RESULTS } from '@/lib/data';
import { Activity, ArrowRight, Bot, FileText, Smile, Meh, Frown } from 'lucide-react';
import Link from 'next/link';
import { DashboardChart } from './_components/dashboard-chart';
import { useEffect, useState } from 'react';
import { TestResult } from '@/lib/types';


export default function DashboardPage() {
  const [testResults, setTestResults] = useState<TestResult[]>(MOCK_TEST_RESULTS);
  
  useEffect(() => {
    const storedResults = localStorage.getItem('test_results');
    if (storedResults) {
      const parsedResults = JSON.parse(storedResults);
      if(parsedResults.length > 0) {
        setTestResults(parsedResults.sort((a: TestResult, b: TestResult) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      }
    }
  }, []);

  const recentTest = testResults[0];
  const studentSentiment = MOCK_STUDENTS[0].sentiment;

  const SentimentIcon = ({ sentiment }: { sentiment: 'calm' | 'neutral' | 'stressed' }) => {
    switch (sentiment) {
      case 'calm': return <Smile className="h-8 w-8 text-green-500" />;
      case 'neutral': return <Meh className="h-8 w-8 text-yellow-500" />;
      case 'stressed': return <Frown className="h-8 w-8 text-red-500" />;
    }
  };

  const resultsParam = JSON.stringify({
    testId: recentTest.id,
    answers: [], // Mock answers, not available from MOCK_TEST_RESULTS
    score: recentTest.score,
    correctAnswers: recentTest.correctAnswers,
    totalQuestions: recentTest.totalQuestions,
  });

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h1 className="text-3xl font-bold font-headline tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {MOCK_STUDENTS[0].name}!</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline"><Bot /> Start a Session</CardTitle>
              <CardDescription>Need help with a topic? Chat with your AI tutor now.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/tutor">Live Tutor <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline"><FileText /> Generate a Test</CardTitle>
              <CardDescription>Create a personalized test to check your knowledge.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/generate-test">New Test <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <Activity /> Recent Well-being
              </CardTitle>
              <CardDescription>Your recent sentiment during tutoring sessions.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center gap-4">
              <SentimentIcon sentiment={studentSentiment} />
              <span className="text-2xl font-bold capitalize">{studentSentiment}</span>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Recent Test Performance</CardTitle>
              <CardDescription>Your scores on the last few tests.</CardDescription>
            </CardHeader>
            <CardContent>
              <DashboardChart data={testResults} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Last Test Result</CardTitle>
              <CardDescription>
                A quick look at your performance on the "{recentTest.topic}" test.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-6xl font-bold">{recentTest.score}</span>
                <span className="text-muted-foreground">%</span>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                You correctly answered {recentTest.correctAnswers} out of {recentTest.totalQuestions} questions.
              </div>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/test/${recentTest.id}/result?results=${encodeURIComponent(resultsParam)}`}>Review Test</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
