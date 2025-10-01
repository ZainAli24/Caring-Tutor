
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ChatMessage } from '@/lib/types';
import { getTutorResponse } from '@/lib/actions';
import { ArrowUp, Bot, Loader2, User, HeartPulse, Copy, Check } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Markdown } from '@/components/markdown';


export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hello! I'm your Caring Tutor. What subject are you studying today? How can I help you?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showRelaxSuggestion, setShowRelaxSuggestion] = useState(false);
  const [copiedMessageIndex, setCopiedMessageIndex] = useState<number | null>(null);
  const userAvatar = PlaceHolderImages.find((p) => p.id === 'avatar-1');
  const { toast } = useToast();

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(() => {
        setCopiedMessageIndex(index);
        toast({
            title: 'Copied to clipboard',
        });
        setTimeout(() => setCopiedMessageIndex(null), 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        toast({
            variant: 'destructive',
            title: 'Failed to copy',
            description: 'Could not copy message to clipboard.',
        });
    });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    setShowRelaxSuggestion(false);
    const userMessage: ChatMessage = { role: 'user', content: input };
    const newMessages: ChatMessage[] = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getTutorResponse({ 
        question: input, 
        context: 'General a-level student',
        previousMessages: newMessages.slice(0, -1).map(({role, content}) => ({role: role === 'system' ? 'assistant' : role, content})),
      });
      
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: response.response },
      ]);
      
      if (response.sentiment === 'stressed') {
        setShowRelaxSuggestion(true);
      }
      
    } catch (error) {
      console.error('Error fetching tutor response:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Sorry, I encountered an error. Please try again.',
      })
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex-1 flex flex-col h-full">
      <CardHeader>
        {showRelaxSuggestion && (
          <Alert>
            <HeartPulse className="h-4 w-4" />
            <AlertTitle>Feeling Stressed?</AlertTitle>
            <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <span>It looks like you might be feeling overwhelmed. It's okay to take a break.</span>
              <Button variant="outline" asChild>
                <Link href="/relaxation-corner">Visit Relaxation Corner</Link>
              </Button>
            </AlertDescription>
          </Alert>
        )}
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full pr-4">
            <div className="space-y-6">
            {messages.map((message, index) => (
                <div
                key={index}
                className={cn(
                    'flex items-start gap-4 group',
                    message.role === 'user' ? 'justify-end' : ''
                )}
                >
                {message.role === 'assistant' && (
                    <Avatar className="h-9 w-9 border">
                        <AvatarFallback><Bot /></AvatarFallback>
                    </Avatar>
                )}
                 <div className={cn("flex items-center gap-2", message.role === 'user' ? 'flex-row-reverse' : 'flex-row')}>
                    <div
                        className={cn(
                        'max-w-xl rounded-lg p-3',
                        message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        )}
                    >
                        <Markdown>{message.content}</Markdown>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleCopy(message.content, index)}
                    >
                        {copiedMessageIndex === index ? (
                            <Check className="h-4 w-4 text-green-500" />
                        ) : (
                            <Copy className="h-4 w-4" />
                        )}
                        <span className="sr-only">Copy message</span>
                    </Button>
                </div>
                {message.role === 'user' && (
                     <Avatar className="h-9 w-9">
                        {userAvatar && (
                            <AvatarImage
                            src={userAvatar.imageUrl}
                            alt="User avatar"
                            data-ai-hint={userAvatar.imageHint}
                            />
                        )}
                        <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                )}
                </div>
            ))}
            {isLoading && (
                <div className="flex items-start gap-4">
                    <Avatar className="h-9 w-9 border">
                        <AvatarFallback><Bot /></AvatarFallback>
                    </Avatar>
                    <div className="max-w-xl rounded-lg p-3 bg-muted flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Thinking...</span>
                    </div>
                </div>
            )}
            </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="pt-4 border-t">
        <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about your topic..."
            className="min-h-0 flex-1 resize-none"
            rows={1}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                }
            }}
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            <ArrowUp className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
