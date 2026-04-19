"use client";

import Image from "next/image";
import Link from "next/link";
import { MoveRight } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  aboutStats,
  goldGradient,
  heroShowcaseImage,
  interiorDetail,
} from "./aboutContent";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.215, 0.61, 0.355, 1],
    },
  },
};

const reducedFadeInUp: Variants = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 },
  },
};

const reducedStaggerContainer: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1 },
};

const aboutHeroBackground = "/bg-image.JPG";

export default function AboutIntroMotion() {
  const shouldReduceMotion = useReducedMotion();
  const sectionFade = shouldReduceMotion ? reducedFadeInUp : fadeInUp;
  const sectionStagger = shouldReduceMotion
    ? reducedStaggerContainer
    : staggerContainer;

  return (
    <>
      <section className="relative left-1/2 isolate flex min-h-screen w-screen -translate-x-1/2 flex-col justify-center overflow-hidden pt-[calc(var(--site-nav-height)+var(--site-nav-clearance))] pb-20 text-secondary-950 lg:pt-[calc(var(--site-nav-height)+5rem)]">
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{ backgroundImage: `url('${aboutHeroBackground}')` }}
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(248,245,239,0.88)_0%,rgba(248,245,239,0.72)_48%,rgba(248,245,239,0.94)_100%)] lg:bg-[linear-gradient(90deg,rgba(248,245,239,0.94)_0%,rgba(248,245,239,0.78)_42%,rgba(248,245,239,0.18)_100%)]" />

        <motion.div
          variants={sectionStagger}
          initial="hidden"
          animate="visible"
          className="relative z-10 mx-auto grid w-full max-w-[1600px] items-start gap-16 px-6 lg:grid-cols-12 lg:px-12"
        >
          <div className="z-20 lg:col-span-7">
            <motion.div
              variants={sectionFade}
              className="flex items-center gap-4"
            >
              <span className="h-[1px] w-12 bg-gold-600" />
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.34em] text-gold-800">
                About EkPratishat / Nepal
              </span>
            </motion.div>

            <div className="mt-12 space-y-2 overflow-visible pb-3">
              <motion.h1
                variants={sectionFade}
                className="text-6xl font-black leading-[0.92] tracking-tighter text-secondary-950 drop-shadow-[0_1px_0_rgba(255,255,255,0.65)] sm:text-8xl lg:text-[9.5rem]"
              >
                REAL ESTATE <br />
                <span
                  className="text-transparent"
                  style={{
                    WebkitTextStroke: "1px rgba(15,23,42,0.58)",
                    WebkitTextFillColor: "rgba(15,23,42,0.08)",
                  }}
                >
                  MADE
                </span>{" "}
                <br />
                <motion.span
                  animate={
                    shouldReduceMotion
                      ? undefined
                      : { opacity: [0.82, 1, 0.82] }
                  }
                  transition={
                    shouldReduceMotion
                      ? undefined
                      : {
                          duration: 4,
                          repeat: Infinity,
                          ease: "linear",
                        }
                  }
                  className="inline-block"
                  style={{
                    backgroundImage: goldGradient,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  CLEAR.
                </motion.span>
              </motion.h1>
            </div>

            <motion.div
              variants={sectionFade}
              className="mt-20 flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-20"
            >
              <p className="max-w-md text-lg font-medium leading-relaxed text-secondary-900 sm:text-xl">
                EkPratishat is being built to make property movement easier to
                understand: buying, selling, listing, and renting with clearer
                information, stronger presentation, and practical next steps.
              </p>

              <div className="flex flex-col gap-6">
                <Link
                  href="/contact"
                  className="group flex items-center gap-3 font-mono text-[11px] font-black uppercase tracking-[0.3em] text-gold-900 transition-all hover:gap-5"
                >
                  Contact EkPratishat <MoveRight className="h-4 w-4" />
                </Link>
                <div className="h-[1px] w-full bg-secondary-900/10 transition-colors group-hover:bg-gold-500/50" />
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={
              shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }
            }
            animate={{ opacity: 1, x: 0 }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { duration: 1.2, delay: 0.6 }
            }
            className="relative lg:col-span-5 lg:pt-24"
          >
            <div className="relative">
              <div className="absolute -inset-8 rounded-[3rem] bg-secondary-950/[0.04] blur-3xl" />

              <div className="relative aspect-[4/5] overflow-hidden border-l border-t border-secondary-900/10 p-4 grayscale transition-all duration-700 hover:grayscale-0">
                <div className="absolute left-0 top-0 h-16 w-[2px] bg-gold-500 shadow-[0_0_15px_#F0C030]" />
                <div className="absolute left-0 top-0 h-[2px] w-16 bg-gold-500 shadow-[0_0_15px_#F0C030]" />

                <Image
                  src={heroShowcaseImage}
                  alt="Modern residential property"
                  fill
                  priority
                  sizes="(min-width: 1024px) 38vw, 100vw"
                  className="object-cover transition-transform duration-1000 hover:scale-105"
                />
              </div>

              <div className="absolute -bottom-16 -left-16 hidden w-56 overflow-hidden border border-white/60 bg-white/75 p-2 shadow-[0_40px_100px_-28px_rgba(15,23,42,0.35)] backdrop-blur-md lg:block">
                <div className="relative aspect-square">
                  <Image
                    src={interiorDetail}
                    alt="Interior Detail"
                    fill
                    sizes="224px"
                    className="object-cover opacity-90"
                  />
                </div>
                <div className="p-3">
                  <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-gold-500">
                    Property Focus
                  </p>
                  <p className="mt-1 text-[11px] font-medium text-secondary-600">
                    Sales, rentals, listings, and serious inquiries
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section className="border-y border-[#eadfce] bg-[#f5efe7] py-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionStagger}
          className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 md:grid-cols-4"
        >
          {aboutStats.map((item) => (
            <motion.div
              key={item.label}
              variants={sectionFade}
              className="group border-l-[3px] border-gold-600/30 pl-6 transition-all hover:border-gold-600"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold-800 transition-all duration-500 group-hover:text-gold-700">
                {item.label}
              </p>
              <p className="mt-3 text-xl font-bold tracking-tight text-secondary-900">
                {item.val}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </>
  );
}
