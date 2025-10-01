import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BreathingExercise } from './_components/breathing-exercise';

export default function RelaxationCornerPage() {
    return (
        <MainLayout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold font-headline tracking-tight">Relaxation Corner</h1>
                    <p className="text-muted-foreground">
                        Take a moment to relax and recharge your mind.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Guided Breathing Exercise</CardTitle>
                        <CardDescription>
                            Follow the animation to practice box breathing. This can help calm your nervous system.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <BreathingExercise />
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
}
