import Header from "@/components/LandingPage/Header"
import HeroSection from "@/components/LandingPage/HeroSection"
import FeaturesSection from "@/components/LandingPage/FeatureSection"
import HowItWorksSection from "@/components/LandingPage/HowItWorksSection"
import PopularDestinationsSection from "@/components/LandingPage/PopularDestinationsSection"
import TestimonialsSection from "@/components/LandingPage/TestimonialsSection"
import CTASection from "@/components/LandingPage/CTASection"
import Footer from "@/components/LandingPage/Footer"

export default function LandingPage() {
  return (
    <div className="h-screen overflow-y-auto">
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-1">
          <HeroSection />

          <FeaturesSection />

          <HowItWorksSection />

          <TestimonialsSection />

          <PopularDestinationsSection />

          <CTASection />
        </main>

        <Footer />
      </div>
    </div>
  )
}