"use client";

import { motion } from "framer-motion";
import { FiUtensils, FiActivity } from "react-icons/fi";

export default function DonationInfo() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
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
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      <motion.div variants={itemVariants}>
        <span className="inline-block py-1.5 px-4 border border-[#8B1A1A] text-[#8B1A1A] rounded-full text-xs font-bold tracking-widest uppercase bg-[#8B1A1A]/5">
          Votre Impact
        </span>
      </motion.div>

      <motion.h1
        className="text-4xl md:text-7xl font-serif font-bold text-[#2C2C2C] leading-tight"
        variants={itemVariants}
      >
        Transformer des vies,
        <br />
        <span className="italic text-[#C9A84C]">une histoire à la fois.</span>
      </motion.h1>

      <motion.p
        className="text-lg text-zinc-800 font-medium leading-relaxed max-w-xl"
        variants={itemVariants}
      >
        Chaque don à l'Association Saint Martin fournit bien plus que des
        ressources — il offre de la{" "}
        <span className="text-[#8B1A1A] font-bold">dignité</span>, de l'
        <span className="text-[#8B1A1A] font-bold">espoir</span> et ouvre un{" "}
        <span className="text-[#8B1A1A] font-bold">chemin vers l'avenir</span>{" "}
        pour les plus démunis.
      </motion.p>

      <div className="space-y-6 max-w-xl">
        {/* Card 1: 20 Euro */}
        <motion.div
          className="backdrop-blur-md bg-white/40 border border-white/50 shadow-md rounded-2xl p-6 flex items-start gap-4 hover:shadow-lg hover:bg-white/50 transition-all duration-300"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <div className="w-12 h-12 rounded-full bg-[#8B1A1A] flex items-center justify-center text-white flex-shrink-0 shadow-lg">
            <FiUtensils className="text-xl" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-xl text-[#8B1A1A] mb-1">
              20€ : Nutrition Quotidienne
            </h4>
            <p className="text-sm text-zinc-700 font-semibold leading-relaxed">
              Fournit cinq repas chauds et complets pour des personnes en
              instabilité de logement.
            </p>
          </div>
        </motion.div>

        {/* Card 2: 50 Euro */}
        <motion.div
          className="backdrop-blur-md bg-white/40 border border-white/50 shadow-md rounded-2xl p-6 flex items-start gap-4 hover:shadow-lg hover:bg-white/50 transition-all duration-300"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <div className="w-12 h-12 rounded-full bg-[#8B1A1A] flex items-center justify-center text-white flex-shrink-0 shadow-lg">
            <FiActivity className="text-xl" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-xl text-[#8B1A1A] mb-1">
              50€ : Soins d'Urgence
            </h4>
            <p className="text-sm text-zinc-700 font-semibold leading-relaxed">
              Finance un kit d'hygiène complet et des vêtements propres pour
              affronter l'hiver.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
