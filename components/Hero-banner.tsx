import Image from "next/image"
import Link from "next/link"

import { ArrowRight, Flame } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HeroBanner() {
  return (
    <section className="relative isolate min-h-145 overflow-hidden bg-[#210600] sm:min-h-155 lg:min-h-170">
      
      <Image
        src="/Banner.png"
        alt="Fresh hot pizza loaded with delicious toppings"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[68%_center]"
      />

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 z-0 	bg-linear-to-r from-[#190300]/95 via-[#260600]/75 to-transparent" />

      {/* Additional Bottom Overlay */}
      <div className="absolute inset-x-0 bottom-0 z-0 h-40 bg-linear-to-t from-black/40 to-transparent" />

      {/* Hero Content */}
      <div className="relative z-10 mx-auto flex min-h-145 max-w-7xl items-center px-5 py-20 sm:min-h-155 sm:px-8 lg:min-h-170 lg:px-10">
        <div className="max-w-2xl animate-in duration-1000 slide-in-from-bottom-5 fade-in">
          {/* Small Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-500/10 px-4 py-2 backdrop-blur-sm">
            <Flame size={16} className="fill-orange-400 text-orange-400" />

            <span className="text-xs font-bold tracking-[2px] text-orange-300 uppercase sm:text-sm">
              Fresh From The Oven
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl leading-[1.12] font-black tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Hot & Fresh Pizza
            <span className="mt-2 block text-[#FFAD42]">Delivered to</span>
            <span className="block text-white">Your Door.</span>
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-lg text-sm leading-7 text-white/75 sm:text-base sm:leading-8 lg:text-lg">
            Craving something delicious? Discover amazing local pizza shops,
            explore mouthwatering menus, and enjoy your favorite pizza delivered
            fresh and hot right to your doorstep.
          </p>

          {/* CTA Buttons */}
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link href="/menu">
              <Button
                size="lg"
                className="group h-12 rounded-full bg-[#D93627] px-7 text-sm font-bold text-white shadow-lg shadow-red-950/30 transition-all duration-300 hover:-translate-y-1 hover:bg-[#B82C20] hover:shadow-xl sm:h-14 sm:px-9"
              >
                Explore Pizza Menu
                <ArrowRight
                  size={18}
                  className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                />
              </Button>
            </Link>

            <span className="text-xs font-medium text-white/65 sm:text-sm">
              Made with love, served with flavor.
            </span>
          </div>

          {/* Bottom Highlights */}
          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-white/15 pt-6">
            <div>
              <p className="text-xl font-black text-white sm:text-2xl">Fresh</p>
              <p className="mt-1 text-xs text-white/55">Quality ingredients</p>
            </div>

            <div className="h-10 w-px bg-white/20" />

            <div>
              <p className="text-xl font-black text-white sm:text-2xl">Local</p>
              <p className="mt-1 text-xs text-white/55">Favorite pizza shops</p>
            </div>

            <div className="h-10 w-px bg-white/20" />

            <div>
              <p className="text-xl font-black text-white sm:text-2xl">
                Delicious
              </p>
              <p className="mt-1 text-xs text-white/55">Every single bite</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
