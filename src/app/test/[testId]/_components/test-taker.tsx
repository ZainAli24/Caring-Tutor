'use client';

import { useState } from 'react';
import { GeneratedTest, TestQuestion } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useRouter } from 'next/navigation';
import { Check, ChevronsRight, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

type TestTakerProps = {
  test: GeneratedTest;
};

export function TestTaker({ test }: TestTakerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isReviewing, setIsReviewing] = useState(false);
  const router = useRouter();

  const currentQuestion: TestQuestion = test.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / test.questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === test.questions.length - 1;

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: answerIndex,
    });
  };

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsReviewing(true);
    }
  };

  const handleSubmit = () => {
    // In a real app, this would be a server action to grade the test.
    // For the demo, we'll calculate results on the client and pass to the results page.
    let correctCount = 0;
    const userAnswers = test.questions.map((_, index) => selectedAnswers[index] ?? -1);

    test.questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.answerIndex) {
        correctCount++;
      }
    });

    const results = {
        testId: test.id,
        answers: userAnswers,
        score: Math.round((correctCount / test.questions.length) * 100),
        correctAnswers: correctCount,
        totalQuestions: test.questions.length,
    };

    const params = new URLSearchParams();
    params.set('results', JSON.stringify(results));
    params.set('testData', JSON.stringify(test));
    router.push(`/test/${test.id}/result?${params.toString()}`);
  };

  if (isReviewing) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Review Your Answers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {test.questions.map((q, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <p className="font-medium">Question {index + 1}: {q.question.substring(0, 50)}...</p>
                        {selectedAnswers[index] !== undefined ? (
                           <div className="flex items-center gap-2 text-green-600">
                             <Check className="h-5 w-5" />
                             <span>Answered</span>
                           </div>
                        ) : (
                            <span className="text-destructive font-medium">Not Answered</span>
                        )}
                    </div>
                ))}
            </CardContent>
            <CardFooter className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setIsReviewing(false)}>Back to Test</Button>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button>Submit Test <Send className="ml-2 h-4 w-4" /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you ready to submit?</AlertDialogTitle>
                            <AlertDialogDescription>
                                You cannot change your answers after submitting. Your test will be graded.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleSubmit}>Submit</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardFooter>
        </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
            <CardTitle className="font-headline text-xl">Question {currentQuestionIndex + 1} of {test.questions.length}</CardTitle>
            <span className="text-sm font-medium text-muted-foreground">{currentQuestion.subtopic}</span>
        </div>
        <Progress value={progress} className="w-full" />
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-lg font-semibold">{currentQuestion.question}</p>
        <RadioGroup
          onValueChange={(value) => handleAnswerSelect(parseInt(value))}
          value={String(selectedAnswers[currentQuestionIndex])}
          className="space-y-2"
        >
          {currentQuestion.options.map((option, index) => (
            <Label
              key={index}
              htmlFor={`option-${index}`}
              className={cn(
                  "flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors",
                  selectedAnswers[currentQuestionIndex] === index
                    ? "border-primary bg-primary/10"
                    : "border-border hover:bg-muted/50"
              )}
            >
              <RadioGroupItem value={String(index)} id={`option-${index}`} />
              <span>{option}</span>
            </Label>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>
        <Button onClick={handleNext} disabled={selectedAnswers[currentQuestionIndex] === undefined}>
          {isLastQuestion ? 'Review & Submit' : 'Next'}
          <ChevronsRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
