import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, Bot, BrainCircuit, HeartHandshake } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Logo } from '@/components/logo';

export default function LandingPage() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-image-1');
  const featureImage1 = PlaceHolderImages.find(p => p.id === 'feature-image-1');
  const featureImage2 = PlaceHolderImages.find(p => p.id === 'feature-image-2');
  const featureImage3 = PlaceHolderImages.find(p => p.id === 'feature-image-3');

  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tighter">
                Your Personal AI Tutor and Well-being Companion
              </h1>
              <p className="text-lg text-muted-foreground">
                Caring Tutor helps you master any subject with personalized guidance, while also keeping an eye on your well-being. Learn smarter, not harder.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/signup">
                    Start Your Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
              {heroImage && (
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  fill
                  className="object-cover"
                  data-ai-hint={heroImage.imageHint}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-muted/50 py-20 md:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-headline font-bold">A New Way to Learn</h2>
              <p className="text-lg text-muted-foreground mt-4">
                Discover features designed for effective and compassionate learning.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Bot className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="font-headline">AI Tutor Chat</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Get real-time, streaming help from our AI tutor. Ask anything, anytime, and get guided answers without the stress.</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <BrainCircuit className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="font-headline">Adaptive Tests</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Generate personalized tests that adapt to your skill level and help you focus on what you need to learn most.</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <HeartHandshake className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="font-headline">Well-being First</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Our AI analyzes sentiment to understand if you're feeling stressed, offering encouragement to keep you motivated.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 text-center">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">Ready to Elevate Your Learning?</h2>
            <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
              Join thousands of students who are learning more effectively and feeling better about it.
            </p>
            <Button size="lg" className="mt-8" asChild>
                <Link href="/signup">
                  Sign Up Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
            </Button>
        </section>
      </main>

      <footer className="bg-muted/50 border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between">
          <Logo />
          <p className="text-sm text-muted-foreground mt-4 sm:mt-0">&copy; {new Date().getFullYear()} Caring Tutor. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
