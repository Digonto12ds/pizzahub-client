
"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  Search,
  ShoppingCart,
  Pizza,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Explore the Menu",
    description:
      "Browse different pizza categories and discover delicious items from local vendors.",
  },
  {
    number: "02",
    icon: ShoppingCart,
    title: "Choose & Order",
    description:
      "Select your favorite pizza, review the details, and place your order.",
  },
  {
    number: "03",
    icon: Pizza,
    title: "Enjoy Your Pizza",
    description:
      "Sit back, relax, and enjoy your delicious pizza when your order arrives.",
  },
];

export default function HowPizzaHubWorks() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="overflow-hidden bg-[#FFF9F0] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <span className="mb-3 inline-block rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-[#C93627]">
            SIMPLE & EASY
          </span>

          <h2 className="text-3xl font-bold text-[#35100A] sm:text-4xl">
            How PizzaHub Works
          </h2>

          <p className="mt-4 text-sm leading-7 text-gray-600 sm:text-base">
            Getting your favorite pizza is simple. Just follow these three
            easy steps!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.number}
                initial={
                  shouldReduceMotion
                    ? false
                    : {
                        opacity: 0,
                        rotateY: 12,
                        scale: 0.95,
                      }
                }
                whileInView={
                  shouldReduceMotion
                    ? undefined
                    : {
                        opacity: 1,
                        rotateY: 0,
                        scale: 1,
                      }
                }
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.65,
                  delay: shouldReduceMotion ? 0 : index * 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ transformPerspective: 1000 }}
                className="relative rounded-2xl border border-orange-100 bg-white p-8 text-center shadow-sm transition-shadow duration-300 hover:shadow-lg"
              >
                <span className="absolute right-5 top-5 text-3xl font-extrabold text-orange-100">
                  {step.number}
                </span>

                <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-red-100">
                  <motion.div
                    whileHover={
                      shouldReduceMotion ? undefined : { rotate: 360 }
                    }
                    transition={{ duration: 0.6 }}
                  >
                    <Icon className="size-9 text-[#C93627]" />
                  </motion.div>
                </div>

                <h3 className="text-xl font-bold text-[#35100A]">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-600">
                  {step.description}
                </p>

                {index !== steps.length - 1 && (
                  <ArrowRight className="absolute -right-6 top-1/2 z-10 hidden size-8 -translate-y-1/2 text-[#C93627] md:block" />
                )}
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 text-center"
        >
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 rounded-full bg-[#C93627] px-7 py-3.5 font-semibold text-white transition-colors duration-300 hover:bg-[#A92C20]"
          >
            Explore Menu
            <ArrowRight className="size-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
