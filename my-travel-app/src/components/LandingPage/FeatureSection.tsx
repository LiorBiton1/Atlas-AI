import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Sparkles, Clock, DollarSign, Plane, Users, Shield } from "lucide-react"

export default function FeatureSection() {
    return (
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
    )
}