import { MainLayout } from '@/components/layout/main-layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MOCK_STUDENTS } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Student } from '@/lib/types';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function TeacherDashboardPage() {
    
    const getSentimentBadgeVariant = (sentiment: Student['sentiment']) => {
        switch(sentiment) {
            case 'calm': return 'default';
            case 'neutral': return 'secondary';
            case 'stressed': return 'destructive';
            default: return 'outline';
        }
    }

    return (
        <MainLayout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold font-headline tracking-tight">Teacher Dashboard</h1>
                    <p className="text-muted-foreground">Monitor student progress and well-being.</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Student Overview</CardTitle>
                        <CardDescription>
                            A list of your students and their recent activity.
                        </CardDescription>
                        <div className="relative pt-4">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search students..." className="pl-8" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student</TableHead>
                                    <TableHead>Well-being</TableHead>
                                    <TableHead>Overall Progress</TableHead>
                                    <TableHead className="text-right">Last Active</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {MOCK_STUDENTS.map(student => {
                                    const avatar = PlaceHolderImages.find(p => p.id === student.avatar);
                                    return (
                                    <TableRow key={student.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-4">
                                                <Avatar className="h-10 w-10">
                                                    {avatar && <AvatarImage src={avatar.imageUrl} alt={student.name} data-ai-hint="person portrait" />}
                                                    <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium">{student.name}</div>
                                                    <div className="text-sm text-muted-foreground">{student.email}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getSentimentBadgeVariant(student.sentiment)} className="capitalize">{student.sentiment}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Progress value={student.progress} className="w-24 h-2" />
                                                <span className="text-sm text-muted-foreground">{student.progress}%</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right text-muted-foreground">{student.lastActivity}</TableCell>
                                    </TableRow>
                                )})}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
}
