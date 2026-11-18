
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const categories = [
  {
    name: "Classic Pizzas",
    description: "Timeless flavors everyone loves.",
    emoji: "🍕",
    color: "from-red-100 to-orange-50",
    accent: "text-red-600",
  },
  {
    name: "Vegetarian Pizzas",
    description: "Fresh veggies, delicious taste.",
    emoji: "🥦",
    color: "from-green-100 to-emerald-50",
    accent: "text-green-600",
  },
  {
    name: "Meat Lovers",
    description: "Loaded with your favorite meats.",
    emoji: "🍗",
    color: "from-orange-100 to-amber-50",
    accent: "text-orange-600",
  },
  {
    name: "Specialty / Gourmet Pizzas",
    description: "Discover something extraordinary.",
    emoji: "🧀",
    color: "from-yellow-100 to-amber-50",
    accent: "text-amber-600",
  },
  {
    name: "Sides & Appetizers",
    description: "Perfect bites to complete your meal.",
    emoji: "🍟",
    color: "from-rose-100 to-pink-50",
    accent: "text-rose-600",
  },
  {
    name: "Beverages & Desserts",
    description: "Sweet treats and refreshing drinks.",
    emoji: "🥤",
    color: "from-purple-100 to-violet-50",
    accent: "text-purple-600",
  },
];

export default function PizzaCategories() {
  return (
    <section className="bg-[#FFF9F0] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="mb-10 flex flex-col items-center text-center">
          <span className="mb-3 rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-[#C93627]">
            EXPLORE OUR MENU
          </span>

          <h2 className="text-3xl font-bold text-[#35100A] sm:text-4xl">
            Explore Pizza Categories
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
            From timeless classics to delicious desserts, find something
            perfect for every craving.
          </p>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <Link
                href={`/menu?category=${encodeURIComponent(category.name)}`}
                className={`group flex h-full items-center justify-between gap-4 rounded-2xl border border-orange-100 bg-linear-to-br ${category.color} p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#C93627]/30 hover:shadow-lg`}
              >
                <div className="flex items-center gap-4">
                  {/* Category Emoji */}
                  <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-white text-4xl shadow-sm transition-transform duration-300 group-hover:scale-110">
                    {category.emoji}
                  </div>

                  {/* Category Information */}
                  <div>
                    <h3 className="text-lg font-bold text-[#35100A]">
                      {category.name}
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      {category.description}
                    </p>
                  </div>
                </div>

                {/* Arrow Icon */}
                <ArrowUpRight
                  className={`size-5 shrink-0 ${category.accent} transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1`}
                />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
