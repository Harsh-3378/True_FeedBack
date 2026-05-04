'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
import messages from '@/messages.json'
import { 
  MessageSquare, 
  Shield, 
  Sparkles, 
  Lock,
  ArrowRight,
  LogOut
} from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const LandingPage = () => {
  const { data: session } = useSession()
  const router = useRouter()

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/')
  }

  const features = [
    {
      icon: <MessageSquare className="h-6 w-6 text-primary" />,
      title: 'Anonymous',
      description: 'Send and receive messages without revealing identity',
    },
    {
      icon: <Shield className="h-6 w-6 text-secondary" />,
      title: 'Private',
      description: 'Your privacy is our priority. Encrypted and secure',
    },
    {
      icon: <Sparkles className="h-6 w-6 text-accent" />,
      title: 'AI-Powered',
      description: 'Get intelligent message suggestions',
    },
    {
      icon: <Lock className="h-6 w-6 text-primary" />,
      title: 'Full Control',
      description: 'Toggle message acceptance anytime',
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Compact Header */}
      <header className="border-b border-border bg-surface/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-xl font-heading font-bold text-white">
            True <span className="text-gradient">Feedback</span>
          </Link>
          <div className="flex items-center gap-3">
            {session ? (
              <>
                <Link href="/dashboard">
                  <Button size="sm" className="btn-ghost">
                    Dashboard
                  </Button>
                </Link>
                <Button 
                  size="sm"
                  onClick={handleLogout}
                  className="btn-ghost"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button size="sm" className="btn-ghost">
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button size="sm" className="btn-primary">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-16 md:py-24">
        {/* Subtle background gradient */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/30 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/30 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="container mx-auto relative z-10 max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            {/* Left - Text */}
            <div className="space-y-6">
              <h1 className="text-5xl font-heading font-bold tracking-tight sm:text-6xl md:text-7xl">
                <span className="block text-white">Whisper</span>
                <span className="block text-gradient">Your Truth</span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                A sanctuary for honest conversations. Share feedback anonymously and grow together.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                {session ? (
                  <Link href="/dashboard">
                    <Button size="lg" className="btn-primary text-lg px-8 py-6">
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/sign-up">
                      <Button size="lg" className="btn-primary text-lg px-8 py-6">
                        Start Free
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                    <Link href="/sign-in">
                      <Button size="lg" className="text-lg px-8 py-6 hover:text-gray-300">
                        Sign In
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Right - Carousel */}
            <div className="flex justify-center">
              <Carousel
                plugins={[Autoplay({ delay: 4000 })]}
                className="w-full max-w-md"
              >
                <CarouselContent>
                  {messages.map((message, index) => (
                    <CarouselItem key={index}>
                      <Card className="">
                        <CardHeader>
                          <CardTitle className="text-sm text-primary">{message.title}</CardTitle>
                          <CardDescription className="text-xs text-tertiary">
                            {message.received}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="min-h-37.5 flex items-center">
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            &quot;{message.content}&quot;
                          </p>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="card-elevated" />
                <CarouselNext className="card-elevated" />
              </Carousel>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 bg-surface/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold text-white mb-4">
              Why Choose <span className="text-gradient">True Feedback</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need for honest, anonymous feedback
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card key={index} className="card-elevated hover-lift">
                <CardHeader className="pb-3">
                  <div className="mb-3 w-12 h-12 rounded-lg bg-linear-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg text-white font-heading">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!session && (
        <section className="px-4 py-20">
          <div className="container mx-auto text-center max-w-2xl">
            <h2 className="text-4xl font-heading font-bold text-white mb-4">
              Ready to Start?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands receiving honest, anonymous feedback
            </p>
            <Link href="/sign-up">
              <Button size="lg" className="btn-primary text-lg px-8 py-6">
                Create Free Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-border px-4 py-8 bg-surface/50">
        <div className="container mx-auto text-center">
          <p className="text-sm text-tertiary">
            © 2026 True Feedback. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
