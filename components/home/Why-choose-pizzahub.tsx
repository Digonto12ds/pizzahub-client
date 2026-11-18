
"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Pizza,
  Store,
  Clock3,
  HeartHandshake,
} from "lucide-react";

const benefits = [
  {
    icon: Pizza,
    title: "Wide Variety of Pizzas",
    description:
      "Explore classic, vegetarian, meat lover, and gourmet pizzas all in one place.",
  },
  {
    icon: Store,
    title: "Multiple Local Vendors",
    description:
      "Discover delicious food from different restaurants and local pizza vendors.",
  },
  {
    icon: Clock3,
    title: "Easy Ordering",
    description:
      "Browse the menu, choose your favorites, and place your order with ease.",
  },
  {
    icon: HeartHandshake,
    title: "Made for Pizza Lovers",
    description:
      "Enjoy a convenient way to discover new flavors and satisfy your pizza cravings.",
  },
];

export default function WhyChoosePizzaHub() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <span className="mb-3 inline-block rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-[#C93627]">
            WHY PIZZAHUB?
          </span>

          <h2 className="text-3xl font-bold text-[#35100A] sm:text-4xl">
            Your Pizza Experience, Made Better
          </h2>

          <p className="mt-4 text-sm leading-7 text-gray-600 sm:text-base">
            Great pizza is just the beginning. We make discovering and
            ordering your favorite food simple and enjoyable.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: shouldReduceMotion ? 0 : 0.12,
              },
            },
          }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <motion.div
                key={benefit.title}
                variants={{
                  hidden: shouldReduceMotion
                    ? { opacity: 1 }
                    : { opacity: 0, scale: 0.92 },
                  visible: {
                    opacity: 1,
                    scale: 1,
                    transition: {
                      duration: 0.5,
                      ease: "easeOut",
                    },
                  },
                }}
                whileHover={
                  shouldReduceMotion
                    ? undefined
                    : {
                        y: -5,
                        transition: { duration: 0.25 },
                      }
                }
                className="group rounded-2xl border border-orange-100 bg-[#FFF9F0] p-7 transition-shadow duration-300 hover:shadow-xl"
              >
                <motion.div
                  whileHover={
                    shouldReduceMotion
                      ? undefined
                      : { rotate: -8, scale: 1.1 }
                  }
                  transition={{ duration: 0.25 }}
                  className="mb-5 flex size-14 items-center justify-center rounded-xl bg-red-100"
                >
                  <Icon className="size-7 text-[#C93627]" />
                </motion.div>

                <h3 className="text-lg font-bold text-[#35100A]">
                  {benefit.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-600">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
