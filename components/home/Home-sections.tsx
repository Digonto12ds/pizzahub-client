"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";

import {
  getFeaturedMenuItems,
  type FeaturedMenuItem,
} from "@/lib/api/menu";

export default function HomeSections() {
  const [items, setItems] = useState<FeaturedMenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadFeaturedItems() {
      try {
        const data = await getFeaturedMenuItems();
        setItems(data);
      } catch (error) {
        console.error(error);
        setError("Unable to load featured menu items.");
      } finally {
        setLoading(false);
      }
    }

    loadFeaturedItems();
  }, []);

  return (
    <section className="bg-[#FFF9F0] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Section Heading */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#C93627]">
            Fresh from our restaurants
          </p>

          <h2 className="text-3xl font-extrabold text-[#35100A] sm:text-4xl">
            Featured Menu Items
          </h2>

          <p className="mt-4 text-sm leading-7 text-[#765D55] sm:text-base">
            Discover delicious favorites from restaurants on PizzaHub.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-97.5 animate-pulse rounded-2xl bg-[#F0E6D9]"
              />
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <p className="rounded-xl bg-white p-8 text-center text-red-600">
            {error}
          </p>
        )}

        {/* Empty State */}
        {!loading && !error && items.length === 0 && (
          <p className="rounded-xl bg-white p-8 text-center text-[#765D55]">
            No featured menu items available right now.
          </p>
        )}

        {/* Featured Menu Cards */}
        {!loading && !error && items.length > 0 && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.12,
                },
              },
            }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {items.map((item) => {
              const image = Array.isArray(item.images)
                ? item.images[0]
                : item.images;

              return (
                <motion.article
                  key={item._id}
                  variants={{
                    hidden: { opacity: 0, y: 25 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.45 },
                    },
                  }}
                  whileHover={{ y: -7 }}
                  className="group overflow-hidden rounded-2xl border border-[#F0E4D8] bg-white shadow-sm transition-shadow hover:shadow-xl"
                >
                  {/* Item Image */}
                  <div className="relative h-56 overflow-hidden bg-[#F4E9DC]">
                    <Image
                      src={image || "/Banner.png"}
                      alt={item.itemName}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-[#C93627] shadow-sm">
                      {item.category}
                    </span>
                  </div>

                  {/* Item Information */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-xl font-bold text-[#35100A]">
                        {item.itemName}
                      </h3>

                      <p className="shrink-0 text-lg font-extrabold text-[#C93627]">
                        ৳{item.price.toLocaleString("en-BD")}
                      </p>
                    </div>

                    {/* Location */}
                    <div className="mt-3 flex items-center gap-2 text-sm text-[#765D55]">
                      <MapPin
                        size={16}
                        className="shrink-0 text-[#C93627]"
                      />
                      <span>{item.location}</span>
                    </div>

                    {/* Vendor Information */}
                    <div className="mt-4 flex items-center gap-3 border-t border-[#F0E4D8] pt-4">
                      <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#F4E9DC]">
                        {item.vendor?.image ? (
                          <Image
                            src={item.vendor.image}
                            alt={item.vendor.name || "Restaurant vendor"}
                            fill
                            unoptimized
                            sizes="36px"
                            className="object-cover"
                          />
                        ) : (
                          <span>👨‍🍳</span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs text-[#9A8278]">
                          Prepared by
                        </p>

                        <p className="truncate text-sm font-semibold text-[#35100A]">
                          {item.vendor?.businessName ||
                            item.vendor?.name ||
                            "PizzaHub Restaurant"}
                        </p>
                      </div>
                    </div>

                    {/* View Details Button */}
                    <Link
                      href={`/menu/${item._id}`}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#C93627] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#A82B20]"
                    >
                      View Details
                      <ArrowRight size={17} />
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        )}

        {/* View All Menu */}
        <div className="mt-10 text-center">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 rounded-full border-2 border-[#C93627] px-7 py-3 font-bold text-[#C93627] transition-colors hover:bg-[#C93627] hover:text-white"
          >
            Explore Full Menu
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}