'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GeneratedTest } from '@/lib/types';
import { TestTaker } from './_components/test-taker';
import { Suspense, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

function TestPageContent() {
    const params = useParams();
    const testId = Array.isArray(params.testId) ? params.testId[0] : params.testId;
    const [test, setTest] = useState<GeneratedTest | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!testId) return;
        try {
            const testDataString = localStorage.getItem(`test_${testId}`);
            if (testDataString) {
                setTest(JSON.parse(testDataString));
            }
        } catch (error) {
            console.error("Failed to parse test data from localStorage:", error);
        } finally {
            setIsLoading(false);
        }
    }, [testId]);

    if (isLoading) {
        return <div>Loading test...</div>;
    }
    
    if (!test) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-destructive">Error</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Could not load the test. Please go back and try generating it again.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold font-headline tracking-tight">Test: {test.learningGoals}</h1>
                <p className="text-muted-foreground">
                    Level: <span className="capitalize">{test.knowledgeLevel}</span>
                </p>
            </div>
            <TestTaker test={test} />
        </div>
    );
}

export default function TestPage() {
    return (
        <MainLayout>
            <Suspense fallback={<div>Loading test...</div>}>
                <TestPageContent />
            </Suspense>
        </MainLayout>
    );
}
