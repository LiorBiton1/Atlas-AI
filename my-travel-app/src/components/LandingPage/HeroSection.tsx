import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Star } from "lucide-react"
import Image from "next/image"

export default function HeroSection() {
    return (
        <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 overflow-hidden">
            {/* Beach Background Image */}
            <div className="absolute inset-0 z-0">

                <Image  src="/Palm-Tree.png"  alt="Beautiful tropical beach framed by palm trees" fill className="object-cover" priority />

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
                        <Button size="lg"className="bg-gradient-to-r from-[rgba(255,104,104,1)] to-[rgba(255,209,102,1)] hover:from-[rgba(255,104,104,0.9)] hover:to-[rgba(255,209,102,0.9)] shadow-lg text-[rgba(255,255,255,1)] font-semibold">
                            Plan My Dream Trip
                            <ArrowRight className="ml-2 h-4 w-4 text-[rgba(255,255,255,1)]" />
                        </Button>

                        <Button variant="outline" size="lg" className="border-[rgba(255,255,255,0.4)] text-[rgba(255,255,255,1)] hover:bg-[rgba(255,255,255,0.2)] backdrop-blur-sm bg-[rgba(255,255,255,0.1)]">
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
    )
}