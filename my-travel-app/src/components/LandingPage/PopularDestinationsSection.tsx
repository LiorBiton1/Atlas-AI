import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { MapPin, Star } from "lucide-react"

export default function PopularDestinationsSection() {
  const destinations = [
    {
      name: "Maldives",
      image: "/infinity-pool-sunset.png",
      rating: 4.9,
      description: "Luxury infinity pools and stunning ocean sunsets",
      badge: "Luxury Paradise",
    },
    {
      name: "Bali, Indonesia",
      image: "/bali-village.png",
      rating: 4.8,
      description: "Cultural villages nestled in lush tropical landscapes",
      badge: "Cultural Haven",
    },
    {
      name: "Caribbean Islands",
      image: "/paradise-beach.png",
      rating: 4.9,
      description: "Pristine beaches with crystal clear turquoise waters",
      badge: "Island Paradise",
    },
    {
      name: "Hawaii, USA",
      image: "/tropical-beach-frame.png",
      rating: 4.7,
      description: "Hidden beaches framed by lush palm trees",
      badge: "Natural Wonder",
    },
  ]

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-[rgba(135,206,235,0.1)] to-[rgba(64,224,208,0.1)]">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <Badge variant="secondary" className="bg-[rgba(0,191,255,0.1)] text-[rgba(0,191,255,1)] border-[rgba(0,191,255,0.2)]">
            Popular Destinations
          </Badge>

          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-[rgba(2,48,71,1)]">
            Discover Your Next Paradise
          </h2>

          <p className="max-w-[600px] text-[rgba(2,48,71,0.7)] md:text-xl">
            From tropical beaches to cultural adventures, explore the world&apos;s most beautiful destinations
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {destinations.map((destination) => (
            <Card key={destination.name} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden bg-white">
              <div className="relative h-48">
                <Image src={destination.image || "/placeholder.svg"} alt={destination.name} fill className="object-cover" />

                <div className="absolute top-3 left-3">
                  <Badge className="bg-[rgba(255,255,255,0.9)] text-[rgba(2,48,71,1)] font-semibold shadow">
                    {destination.badge}
                  </Badge>
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-1 bg-[rgba(255,255,255,0.9)] rounded-full px-2 py-1 shadow">
                  <Star className="h-3 w-3 fill-[#FFD166] text-[#FFD166]" />
                  <span className="text-xs font-medium text-[rgba(2,48,71,1)]">{destination.rating}</span>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center gap-1 mb-2">
                  <MapPin className="h-4 w-4 text-[#00BFFF]" />

                  <h3 className="font-semibold text-[rgba(2,48,71,1)]">{destination.name}</h3>
                </div>
                
                <p className="text-sm text-[rgba(2,48,71,0.7)]">{destination.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
