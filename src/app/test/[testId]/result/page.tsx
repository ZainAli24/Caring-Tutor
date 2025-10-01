
'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GeneratedTest, UserAttempt, TestQuestion, TestResult } from '@/lib/types';
import { CheckCircle2, XCircle, Award, Target, MessageSquare, Repeat } from 'lucide-react';
import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useSearchParams, useParams } from 'next/navigation';
import { MOCK_TEST_RESULTS } from '@/lib/data';

const getFeedback = (score: number) => {
    if (score === 100) return { title: "Perfect Score!", message: "Incredible work! You've mastered this topic.", icon: <Award className="h-12 w-12 text-yellow-500" /> };
    if (score >= 80) return { title: "Excellent Job!", message: "You have a strong understanding of the material.", icon: <Award className="h-12 w-12 text-green-500" /> };
    if (score >= 60) return { title: "Good Effort!", message: "You're on the right track. A little more practice will make a big difference.", icon: <Target className="h-12 w-12 text-blue-500" /> };
    return { title: "Keep Practicing!", message: "Don't be discouraged. Reviewing your answers is a great way to learn.", icon: <MessageSquare className="h-12 w-12 text-orange-500" /> };
}

function ResultPageContent() {
    const searchParams = useSearchParams();
    const params = useParams();
    const testId = Array.isArray(params.testId) ? params.testId[0] : params.testId;
    const [results, setResults] = useState<UserAttempt | null>(null);
    const [test, setTest] = useState<GeneratedTest | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!testId) return;

        const resultsString = searchParams.get('results');
        let parsedResults: UserAttempt | null = null;
        if (resultsString) {
            try {
                parsedResults = JSON.parse(resultsString);
                setResults(parsedResults);
            } catch (error) {
                console.error("Failed to parse results data:", error);
            }
        }
        
        try {
            const testDataString = localStorage.getItem(`test_${testId}`);
            let testData: GeneratedTest | null = null;

            if (testDataString) {
                testData = JSON.parse(testDataString);
                setTest(testData);
            } else {
                // Fallback for mock data if not in local storage
                const mockTestResult = MOCK_TEST_RESULTS.find(t => t.id === testId);
                if(mockTestResult) {
                    // We don't have the questions for mock tests, so create a dummy test structure
                    const dummyTest: GeneratedTest = {
                        id: mockTestResult.id,
                        learningGoals: mockTestResult.topic,
                        knowledgeLevel: 'intermediate', // This is a placeholder
                        questions: Array(mockTestResult.totalQuestions).fill(0).map((_, i) => ({
                            question: `Question ${i + 1} for "${mockTestResult.topic}" (not available in mock data)`,
                            options: ['Option A', 'Option B', 'Option C', 'Option D'],
                            answerIndex: 0, // Placeholder
                            subtopic: mockTestResult.topic
                        }))
                    };
                    setTest(dummyTest);
                    testData = dummyTest;

                    if (!parsedResults) {
                        const fallbackResults: UserAttempt = {
                            testId: mockTestResult.id,
                            answers: [], // No answers available for mock review
                            score: mockTestResult.score,
                            correctAnswers: mockTestResult.correctAnswers,
                            totalQuestions: mockTestResult.totalQuestions,
                        };
                        setResults(fallbackResults);
                        parsedResults = fallbackResults;
                    }
                }
            }

            // Save result to localStorage for history
            if (parsedResults && testData) {
                const newTestResult: TestResult = {
                    id: parsedResults.testId,
                    userId: 'user_1', // Mock user ID
                    topic: testData.learningGoals,
                    score: parsedResults.score,
                    correctAnswers: parsedResults.correctAnswers,
                    totalQuestions: parsedResults.totalQuestions,
                    date: new Date().toISOString(),
                };

                const existingResultsString = localStorage.getItem('test_results');
                let allResults: TestResult[] = [];
                if (existingResultsString) {
                    allResults = JSON.parse(existingResultsString);
                }
                // Avoid duplicates
                if (!allResults.find(r => r.id === newTestResult.id)) {
                    allResults.push(newTestResult);
                    localStorage.setItem('test_results', JSON.stringify(allResults));
                }
            }
        } catch (error) {
            console.error("Failed to process test data:", error);
        } finally {
            setIsLoading(false);
        }
    }, [searchParams, testId]);
    
    if (isLoading) {
        return <div>Loading results...</div>;
    }

    if (!results || !test) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-destructive">Error</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Could not load test results. Please go back and try again.</p>
                </CardContent>
            </Card>
        );
    }

    const feedback = getFeedback(results.score);

    return (
        <div className="space-y-8">
            <Card className="text-center">
                <CardHeader>
                    <div className="flex justify-center mb-4">{feedback.icon}</div>
                    <CardTitle className="font-headline text-3xl">{feedback.title}</CardTitle>
                    <CardDescription>{feedback.message}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-baseline justify-center gap-2">
                        <span className="text-7xl font-bold tracking-tighter">{results.score}</span>
                        <span className="text-2xl text-muted-foreground">%</span>
                    </div>
                    <p className="text-muted-foreground">
                        You answered {results.correctAnswers} out of {results.totalQuestions} questions correctly.
                    </p>
                    <div className="flex justify-center gap-4 pt-4">
                        <Button asChild>
                            <Link href="/dashboard">Back to Dashboard</Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/generate-test"><Repeat className="mr-2 h-4 w-4" /> Take Another Test</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Answer Review</CardTitle>
                    <CardDescription>Review each question to understand your mistakes.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        {test.questions.map((q: TestQuestion, index: number) => {
                            const userAnswerIndex = results.answers[index];
                            const isCorrect = userAnswerIndex === q.answerIndex;
                            
                            // Only show correctness if answers are available
                            const displayCorrectness = results.answers.length > 0;

                            return (
                                <AccordionItem value={`item-${index}`} key={index}>
                                    <AccordionTrigger className={cn("text-left", 
                                        displayCorrectness ? (isCorrect ? 'text-green-600' : 'text-destructive') : ''
                                    )}>
                                        <div className="flex items-center gap-2">
                                            {displayCorrectness && (isCorrect ? <CheckCircle2 /> : <XCircle />)}
                                            {!displayCorrectness && <div className="h-5 w-5"/>}
                                            <span>Question {index + 1}: {q.question.substring(0, 80)}...</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="space-y-4 pt-4">
                                        <p className="font-semibold">{q.question}</p>
                                        {q.question.indexOf('not available in mock data') === -1 && <div className="space-y-2">
                                            {q.options.map((option, optIndex) => {
                                                const isUserAnswer = optIndex === userAnswerIndex;
                                                const isCorrectAnswer = optIndex === q.answerIndex;
                                                return (
                                                    <div key={optIndex} className={cn("p-3 rounded-md border-2 flex items-center gap-3", 
                                                        displayCorrectness && isCorrectAnswer ? "border-green-500 bg-green-500/10" : "",
                                                        displayCorrectness && isUserAnswer && !isCorrectAnswer ? "border-destructive bg-destructive/10" : "",
                                                    )}>
                                                        {displayCorrectness && (isCorrectAnswer ? <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" /> : 
                                                         isUserAnswer ? <XCircle className="h-5 w-5 text-destructive flex-shrink-0" /> : <div className="h-5 w-5 flex-shrink-0"/>)}
                                                        {!displayCorrectness && <div className="h-5 w-5 flex-shrink-0"/>}
                                                        <span>{option}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>}
                                    </AccordionContent>
                                </AccordionItem>
                            );
                        })}
                    </Accordion>
                </CardContent>
            </Card>
        </div>
    );
}

export default function ResultPage() {
    return (
        <MainLayout>
            <Suspense fallback={<div>Loading results...</div>}>
                <ResultPageContent />
            </Suspense>
        </MainLayout>
    );
}
