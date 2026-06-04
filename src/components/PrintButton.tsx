"use client";

import { motion } from "framer-motion";

export default function PrintButton() {
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handlePrint}
      className="px-4 py-2 border border-[#CBD5E1] hover:border-[#C4A35A] hover:bg-[#C4A35A] hover:text-white rounded-md text-[13px] font-semibold text-[#1E293B] transition-all duration-300 cursor-pointer bg-white shadow-sm"
    >
      Download PDF Report
    </motion.button>
  );
}
