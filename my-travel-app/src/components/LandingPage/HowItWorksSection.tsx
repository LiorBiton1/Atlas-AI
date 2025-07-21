import { Badge } from "@/components/ui/badge"

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-[rgba(246,232,195,0.3)] to-[rgba(64,224,208,0.1)]">
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
          <div className="flex flex-col items-center space-y-4 text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-[rgba(255,104,104,1)] to-[rgba(255,209,102,1)] rounded-full flex items-center justify-center text-[rgba(255,255,255,1)] font-bold text-xl shadow-lg transition-transform duration-300 will-change-transform group-hover:translate-y-2">
              1
            </div>

            <div className="transition-transform duration-300 will-change-transform group-hover:-translate-y-2">
              <h3 className="text-xl font-bold text-[rgba(2,48,71,1)]">Share your vacation dreams</h3>
              <p className="text-[rgba(2,48,71,0.7)]">
                Tell us about your perfect getaway - beach paradise, mountain retreat, or cultural adventure.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-4 text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-[rgba(0,191,255,1)] to-[rgba(64,224,208,1)] rounded-full flex items-center justify-center text-[rgba(255,255,255,1)] font-bold text-xl shadow-lg transition-transform duration-300 will-change-transform group-hover:translate-y-2">
              2
            </div>

            <div className="transition-transform duration-300 will-change-transform group-hover:-translate-y-2">
              <h3 className="text-xl font-bold text-[rgba(2,48,71,1)]">Get your personalized getaway</h3>
              <p className="text-[rgba(2,48,71,0.7)]">
                Receive a detailed vacation itinerary with the best beaches, restaurants, and Instagram-worthy spots.
              </p>
            </div>
          </div>

           <div className="flex flex-col items-center space-y-4 text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-[rgba(6,214,160,1)] to-[rgba(255,209,102,1)] rounded-full flex items-center justify-center text-[rgba(255,255,255,1)] font-bold text-xl shadow-lg transition-transform duration-300 will-change-transform group-hover:translate-y-2">
              3
            </div>

            <div className="transition-transform duration-300 will-change-transform group-hover:-translate-y-2">
              <h3 className="text-xl font-bold text-[rgba(2,48,71,1)]">Pack your bags and go!</h3>

              <p className="text-[rgba(2,48,71,0.7)]">
                Book everything seamlessly and get ready for the vacation of a lifetime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}