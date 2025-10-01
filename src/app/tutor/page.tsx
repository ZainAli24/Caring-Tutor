import { MainLayout } from '@/components/layout/main-layout';
import { ChatInterface } from './_components/chat-interface';

export default function TutorPage() {
    return (
        <MainLayout>
            <div className="h-full flex flex-col">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold font-headline tracking-tight">Live Tutor</h1>
                    <p className="text-muted-foreground">
                        Ask a question and get guided help from your AI companion.
                    </p>
                </div>
                <ChatInterface />
            </div>
        </MainLayout>
    );
}
