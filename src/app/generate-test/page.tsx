import { MainLayout } from '@/components/layout/main-layout';
import { GenerateTestForm } from './_components/generate-test-form';

export default function GenerateTestPage() {
    return (
        <MainLayout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold font-headline tracking-tight">Generate a New Test</h1>
                    <p className="text-muted-foreground">
                        Tell us what you want to learn, and we&apos;ll create a personalized test for you.
                    </p>
                </div>
                <GenerateTestForm />
            </div>
        </MainLayout>
    );
}
