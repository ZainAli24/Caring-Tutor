
'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MOCK_STUDENTS, MOCK_TEST_RESULTS } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { TestResult } from '@/lib/types';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
    const user = MOCK_STUDENTS[0];
    const userAvatar = PlaceHolderImages.find((p) => p.id === user.avatar);
    const [testResults, setTestResults] = useState<TestResult[]>(MOCK_TEST_RESULTS);

    useEffect(() => {
        const storedResults = localStorage.getItem('test_results');
        if (storedResults) {
          const parsedResults = JSON.parse(storedResults);
          if (parsedResults.length > 0) {
            setTestResults(parsedResults.sort((a: TestResult, b: TestResult) => new Date(b.date).getTime() - new Date(a.date).getTime()));
          }
        }
    }, []);

    const getScoreBadgeVariant = (score: number) => {
        if (score >= 80) return 'default';
        if (score >= 60) return 'secondary';
        return 'destructive';
    }

    return (
        <MainLayout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold font-headline tracking-tight">My Profile</h1>
                    <p className="text-muted-foreground">Manage your profile and track your progress.</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Your Information</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row items-start gap-8">
                        <Avatar className="h-24 w-24">
                            {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt={user.name} data-ai-hint="person portrait" />}
                            <AvatarFallback className="text-3xl">
                                {user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                        </Avatar>
                        <div className="grid gap-2 text-sm flex-1">
                            <div className="grid grid-cols-2">
                                <span className="font-semibold">Name:</span>
                                <span>{user.name}</span>
                            </div>
                             <div className="grid grid-cols-2">
                                <span className="font-semibold">Email:</span>
                                <span>{user.email}</span>
                            </div>
                             <div className="grid grid-cols-2">
                                <span className="font-semibold">Current Well-being:</span>
                                <span className="capitalize">{user.sentiment}</span>
                            </div>
                             <div className="grid grid-cols-2">
                                <span className="font-semibold">Last Active:</span>
                                <span>{user.lastActivity}</span>
                            </div>
                             <div className="grid grid-cols-2">
                                <span className="font-semibold">Overall Progress:</span>
                                <span>{user.progress}%</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Test History</CardTitle>
                        <CardDescription>A log of all the tests you have completed.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Topic</TableHead>
                                    <TableHead className="text-center">Score</TableHead>
                                    <TableHead className="text-right">Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {testResults.map(result => (
                                    <TableRow key={result.id}>
                                        <TableCell className="font-medium">{result.topic}</TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant={getScoreBadgeVariant(result.score)}>{result.score}%</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">{format(new Date(result.date), "PPP")}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
}
