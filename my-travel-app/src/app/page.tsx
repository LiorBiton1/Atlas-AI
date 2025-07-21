import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Sparkles, Clock, Users, Star, ArrowRight, Plane, DollarSign, Shield } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { DestinationShowcase } from "@/components/LandingPage/destinationShowcase"

export default function LandingPage() {
  return (
    <div className="h-screen overflow-y-auto">
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-[rgba(255,255,255,0.95)] backdrop-blur supports-[backdrop-filter]:bg-[rgba(255,255,255,0.6)] sticky top-0 z-50">
        <Link className="flex items-center justify-center" href="#">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[rgba(0,191,255,1)] to-[rgba(64,224,208,1)] rounded-lg flex items-center justify-center">
              <MapPin className="h-5 w-5 text-[rgba(    255,255,255,1)]" />
            </div>
            <span className="font-bold text-xl text-[rgba(2,48,71,1)]">atlasAI</span>
          </div>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium hover:text-[rgba(0,191,255,1)] transition-colors text-[rgba(2,48,71,1)]"
            href="#features"
          >
            Features
          </Link>
          <Link
            className="text-sm font-medium hover:text-[rgba(0,191,255,1)] transition-colors text-[rgba(2,48,71,1)]"
            href="#how-it-works"
          >
            How it Works
          </Link>
          <Link className="text-sm font-medium hover:text-[rgba(0,191,255,1)] transition-colors text-[rgba(2,48,71,1)]" href="#pricing">
            Pricing
          </Link>
        </nav>
        <div className="ml-4 flex gap-2">
          <Button variant="ghost" size="sm" className="hover:text-[rgba(0,191,255,1)] text-[rgba(2,48,71,1)]">
            Sign In
          </Button>
          <Button
            size="sm"
            className="bg-gradient-to-r from-[rgba(0,191,255,1)] to-[rgba(64,224,208,1)] hover:from-[rgba(0,191,255,0.9)] hover:to-[rgba(64,224,208,0.9)]"
          >
            Get Started
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section with Beach Background */}
        <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 overflow-hidden">
          {/* Beach Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/Palm-Tree.png"
              alt="Beautiful tropical beach framed by palm trees"
              fill
              className="object-cover"
              priority
            />
            {/* Lighter overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-[rgba(2,48,71,0.7)] via-[rgba(0,191,255,0.4)] to-[rgba(2,48,71,0.2)]"></div>
          </div>

          <div className="container px-4 md:px-6 relative z-10 mx-auto">
            <div className="flex flex-col justify-center items-center text-center space-y-4">
              <div className="space-y-2">
                <Badge className="w-fit bg-[rgba(255,255,255,0.3)] text-[rgba(255,255,255,1)] border-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.4)] backdrop-blur-sm">
                  <Sparkles className="w-3 h-3 mr-1 text-white" />
                  AI-Powered Vacation Planning
                </Badge>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-[rgba(255,255,255,1)] drop-shadow-lg">
                  Your Dream Vacation Awaits
                </h1>
                <p className="max-w-[600px] text-[rgba(255,255,255,0.95)] md:text-xl drop-shadow-md">
                  Escape the ordinary and discover paradise with atlasAI. From tropical beaches to mountain retreats,
                  we&apos;ll craft the perfect getaway that matches your vacation dreams.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[rgba(255,104,104,1)] to-[rgba(255,209,102,1)] hover:from-[rgba(255,104,104,0.9)] hover:to-[rgba(255,209,102,0.9)] shadow-lg text-[rgba(255,255,255,1)] font-semibold"
                >
                  Plan My Dream Trip
                  <ArrowRight className="ml-2 h-4 w-4 text-[rgba(255,255,255,1)]" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-[rgba(255,255,255,0.4)] text-[rgba(255,255,255,1)] hover:bg-[rgba(255,255,255,0.2)] backdrop-blur-sm bg-[rgba(255,255,255,0.1)]"
                >
                  Watch Demo
                </Button>
              </div>
              <div className="flex items-center gap-4 text-sm text-[rgba(255,255,255,0.9)]">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-[rgba(255,209,102,1)] text-[rgba(255,209,102,1)]" />
                  <span className="font-medium">4.9/5</span>
                </div>
                <span>•</span>
                <span>10,000+ dream trips planned</span>
                <span>•</span>
                <span>Free to start</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-[rgba(135,206,235,0.2)] to-[rgba(255,255,255,1)]">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="secondary" className="bg-[rgba(0,191,255,0.1)] text-[rgba(0,191,255,1)] border-[rgba(0,191,255,0.2)]">
                  Features
                </Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-[rgba(2,48,71,1)]">
                  Everything you need for the ultimate getaway
                </h2>
                <p className="max-w-[900px] text-[rgba(2,48,71,0.7)] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  From sun-soaked beaches to cultural adventures, our AI creates the perfect vacation experience
                  tailored to your wanderlust.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-8">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-[rgba(255,255,255,1)] to-[rgba(135,206,235,0.1)]">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-[rgba(0,191,255,1)] to-[rgba(64,224,208,1)] rounded-lg flex items-center justify-center mb-4 shadow-md">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-[rgba(2,48,71,1)]">AI Paradise Finder</CardTitle>
                  <CardDescription className="text-[rgba(2,48,71,0.7)]">
                    Discover hidden beaches, secret viewpoints, and local gems that match your vacation style.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-[rgba(255,255,255,1)] to-[rgba(6,214,160,0.1)]">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-[rgba(6,214,160,1)] to-[rgba(64,224,208,1)] rounded-lg flex items-center justify-center mb-4 shadow-md">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-[rgba(2,48,71,1)]">Stress-Free Itineraries</CardTitle>
                  <CardDescription className="text-[rgba(2,48,71,0.7)]">
                    Relax while we optimize your vacation schedule, leaving more time for sunset cocktails.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-[rgba(255,255,255,1)] to-[rgba(255,209,102,0.1)]">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-[rgba(255,209,102,1)] to-[rgba(255,104,104,1)] rounded-lg flex items-center justify-center mb-4 shadow-md">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-[rgba(2,48,71,1)]">Smart Budget Planning</CardTitle>
                  <CardDescription className="text-[rgba(2,48,71,0.7)]">
                    Maximize your vacation budget with AI-powered deals and cost optimization.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-[rgba(255,255,255,1)] to-[rgba(255,104,104,0.1)]">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-[rgba(255,104,104,1)] to-[rgba(255,209,102,1)] rounded-lg flex items-center justify-center mb-4 shadow-md">
                    <Plane className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-[rgba(2,48,71,1)]">One-Click Booking</CardTitle>
                  <CardDescription className="text-[rgba(2,48,71,0.7)]">
                    Book flights, resorts, and activities seamlessly with exclusive vacation deals.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-[rgba(255,255,255,1)] to-[rgba(64,224,208,0.1)]">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-[rgba(64,224,208,1)] to-[rgba(6,214,160,1)] rounded-lg flex items-center justify-center mb-4 shadow-md">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-[rgba(2,48,71,1)]">Group Vacation Planning</CardTitle>
                  <CardDescription className="text-[rgba(2,48,71,0.7)]">
                    Plan the perfect group getaway with friends and family using shared vacation boards.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-[rgba(255,255,255,1)] to-[rgba(0,191,255,0.1)]">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-[rgba(0,191,255,1)] to-[rgba(255,104,104,1)] rounded-lg flex items-center justify-center mb-4 shadow-md">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-[rgba(2,48,71,1)]">24/7 Vacation Support</CardTitle>
                  <CardDescription className="text-[rgba(2,48,71,0.7)]">
                    Enjoy peace of mind with round-the-clock support during your dream vacation.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section
          id="how-it-works"
          className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-[rgba(246,232,195,0.3)] to-[rgba(64,224,208,0.1)]"
        >
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="secondary" className="bg-[rgba(6,214,160,0.1)] text-[rgba(6,214,160,1)] border-[rgba(6,214,160,0.2)]">
                  How it Works
                </Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-[rgba(2,48,71,1)]">
                  Your dream vacation in 3 easy steps
                </h2>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[rgba(255,104,104,1)] to-[rgba(255,209,102,1)] rounded-full flex items-center justify-center text-[rgba(255,255,255,1)] font-bold text-xl shadow-lg">
                  1
                </div>
                <h3 className="text-xl font-bold text-[rgba(2,48,71,1)]">Share your vacation dreams</h3>
                <p className="text-[rgba(2,48,71,0.7)]">
                  Tell us about your perfect getaway - beach paradise, mountain retreat, or cultural adventure.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[rgba(0,191,255,1)] to-[rgba(64,224,208,1)] rounded-full flex items-center justify-center text-[rgba(255,255,255,1)] font-bold text-xl shadow-lg">
                  2
                </div>
                <h3 className="text-xl font-bold text-[rgba(2,48,71,1)]">Get your personalized escape plan</h3>
                <p className="text-[rgba(2,48,71,0.7)]">
                  Receive a detailed vacation itinerary with the best beaches, restaurants, and Instagram-worthy spots.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[rgba(6,214,160,1)] to-[rgba(255,209,102,1)] rounded-full flex items-center justify-center text-[rgba(255,255,255,1)] font-bold text-xl shadow-lg">
                  3
                </div>
                <h3 className="text-xl font-bold text-[rgba(2,48,71,1)]">Pack your bags and go!</h3>
                <p className="text-[rgba(2,48,71,0.7)]">
                  Book everything seamlessly and get ready for the vacation of a lifetime.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-[rgba(135,206,235,0.1)] to-[rgba(246,232,195,0.2)]">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="secondary" className="bg-[rgba(255,104,104,0.1)] text-[rgba(255,104,104,1)] border-[rgba(255,104,104,0.2)]">
                  Testimonials
                </Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-[rgba(2,48,71,1)]">
                  Loved by vacationers worldwide
                </h2>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-8">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-[rgba(255,255,255,1)]">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-1 mb-4">
                    {["star1", "star2", "star3", "star4", "star5"].map((starId) => (
                      <Star key={starId} className="h-4 w-4 fill-[rgba(255,209,102,1)] text-[rgba(255,209,102,1)]" />
                    ))}
                  </div>
                  <p className="text-[rgba(2,48,71,0.7)] mb-4">
                    &quot;atlasAI planned the most incredible beach-hopping adventure in Thailand. Every sunset was perfect!&quot;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[rgba(0,191,255,1)] to-[rgba(64,224,208,1)] rounded-full flex items-center justify-center text-[rgba(255,255,255,1)] font-bold">
                      S
                    </div>
                    <div>
                      <p className="font-medium text-[rgba(2,48,71,1)]">Sarah Johnson</p>
                      <p className="text-sm text-[rgba(2,48,71,0.6)]">Travel Blogger</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-[rgba(255,255,255,1)]">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-1 mb-4">
                    {['star1', 'star2', 'star3', 'star4', 'star5'].map((starId) => (
                      <Star key={starId} className="h-4 w-4 fill-[rgba(255,209,102,1)] text-[rgba(255,209,102,1)]" />
                    ))}
                  </div>
                  <p className="text-[rgba(2,48,71,0.7)] mb-4">
                    &quot;Found the most amazing hidden hot springs in Iceland thanks to atlasAI. Pure vacation magic!&quot;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[rgba(255,104,104,1)] to-[rgba(255,209,102,1)] rounded-full flex items-center justify-center text-[rgba(255,255,255,1)] font-bold">
                      M
                    </div>
                    <div>
                      <p className="font-medium text-[rgba(2,48,71,1)]">Mike Chen</p>
                      <p className="text-sm text-[rgba(2,48,71,0.6)]">Adventure Seeker</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-[rgba(255,255,255,1)]">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-1 mb-4">
                    {['star1', 'star2', 'star3', 'star4', 'star5'].map((starId) => (
                      <Star key={starId} className="h-4 w-4 fill-[rgba(255,209,102,1)] text-[rgba(255,209,102,1)]" />
                    ))}
                  </div>
                  <p className="text-[rgba(2,48,71,0.7)] mb-4">
                    &quot;Our family beach vacation in Bali was flawless. The kids are still talking about the snorkeling
                    spots!&quot;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[rgba(6,214,160,1)] to-[rgba(64,224,208,1)] rounded-full flex items-center justify-center text-[rgba(255,255,255,1)] font-bold">
                      E
                    </div>
                    <div>
                      <p className="font-medium text-[rgba(2,48,71,1)]">Emily Rodriguez</p>
                      <p className="text-sm text-[rgba(2,48,71,0.6)]">Family Traveler</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Destination Showcase */}
        <DestinationShowcase />

        {/* CTA Section */}
        <section className="relative w-full py-12 md:py-24 lg:py-32 overflow-hidden">
          {/* Bright Beach Background */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/infinity-pool-sunset.png"
              alt="Luxury infinity pool at sunset"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[rgba(255,104,104,0.85)] via-[rgba(255,209,102,0.7)] to-[rgba(0,191,255,0.8)]"></div>
          </div>

          <div className="container px-4 md:px-6 relative z-10 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center text-[rgba(255,255,255,1)]">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl drop-shadow-lg">
                  Ready to escape to paradise?
                </h2>
                <p className="max-w-[600px] text-[rgba(255,255,255,0.95)] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed drop-shadow-md">
                  Join thousands of happy travelers who&apos;ve found their perfect vacation with atlasAI.
                </p>
              </div>
              <div className="w-full max-w-[500px] space-y-2 mx-auto">
                <form className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Enter your email for vacation inspiration"
                    className="flex-1 bg-[rgba(255,255,255,0.85)] border-[rgba(2,48,71,0.15)] text-[rgba(2,48,71,1)] placeholder:text-[rgba(2,48,71,0.7)] shadow backdrop-blur-sm"
                  />
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-[rgba(6,214,160,1)] to-[rgba(64,224,208,1)] hover:from-[rgba(6,214,160,0.9)] hover:to-[rgba(64,224,208,0.9)] text-[rgba(255,255,255,1)] font-semibold"
                  >
                    Get Started
                  </Button>
                </form>
                <p className="text-base md:text-lg text-[rgba(255,255,255,0.97)] font-medium">
                  Start planning your dream vacation for free. No credit card required.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-[rgba(255,255,255,1)]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-[rgba(0,191,255,1)] to-[rgba(64,224,208,1)] rounded flex items-center justify-center">
            <MapPin className="h-4 w-4 text-[rgba(255,255,255,1)]" />
          </div>
          <span className="font-medium text-[rgba(2,48,71,1)]">atlasAI</span>
        </div>
        <p className="text-xs text-[rgba(2,48,71,0.6)] sm:ml-4">© 2024 atlasAI. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-xs hover:underline underline-offset-4 text-[rgba(2,48,71,0.6)] hover:text-[rgba(0,191,255,1)]"
            href="#"
          >
            Terms of Service
          </Link>
          <Link
            className="text-xs hover:underline underline-offset-4 text-[rgba(2,48,71,0.6)] hover:text-[rgba(0,191,255,1)]"
            href="#"
          >
            Privacy Policy
          </Link>
          <Link
            className="text-xs hover:underline underline-offset-4 text-[rgba(2,48,71,0.6)] hover:text-[rgba(0,191,255,1)]"
            href="#"
          >
            Contact
          </Link>
        </nav>
      </footer>
    </div>
    </div>
  )
}