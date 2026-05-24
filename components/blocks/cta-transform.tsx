"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function CtaTransform() {
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1], // easeOutExpo
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
      <motion.div
        className="bg-gradient-to-br from-[#8B1A1A] via-[#6e1414] to-[#2C2C2C] rounded-[2.5rem] p-10 md:p-16 text-center shadow-2xl relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        {/* Animated Background Glow Blobs inside CTA */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute w-[300px] h-[300px] rounded-full bg-[#C9A84C]/10 blur-[80px] -top-10 -left-10"
            animate={{
              x: [0, 30, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute w-[250px] h-[250px] rounded-full bg-white/5 blur-[70px] -bottom-10 -right-10"
            animate={{
              x: [0, -20, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
        </div>

        <motion.h2
          className="text-3xl md:text-5xl font-serif font-bold text-white mb-6 relative z-10 leading-tight"
          variants={itemVariants}
        >
          Prêt à transformer des vies avec nous ?
        </motion.h2>

        <motion.p
          className="text-gray-200 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light relative z-10"
          variants={itemVariants}
        >
          Chaque don, chaque heure de bénévolat est une pierre ajoutée à
          l'édifice de la solidarité.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center relative z-10"
          variants={itemVariants}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/don"
              className="inline-block bg-[#C9A84C] text-[#2C2C2C] px-10 py-4 rounded-full font-bold hover:bg-[#b0913b] transition-colors shadow-xl"
            >
              Agir maintenant
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/benevole"
              className="inline-block bg-white/10 backdrop-blur-md border border-white/30 text-white px-10 py-4 rounded-full font-bold hover:bg-white hover:text-[#2C2C2C] transition-colors"
            >
              Devenir bénévole
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
