import React from 'react'
import { motion, useAnimation } from 'framer-motion'
import bner from "../../assets/00-5.png"

const PromoBanner = () => {
  const controls = useAnimation();

  return (
    <div>
      <motion.img
        src={bner}
        alt=""
        initial={{ opacity: 0, y: -80 }}         // يبدأ من الأعلى
        animate={controls}
        whileInView={{ opacity: 1, y: 0 }}       // ينزل للأسفل
        viewport={{ amount: 0.5 }}               // يشتغل مع كل نزول بالصورة
        onViewportLeave={() => controls.start({ opacity: 0, y: -80 })} // يرجع للأعلى عند الخروج
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
        style={{ width: "100%", height: "auto", display: "block" }}
      />
    </div>
  )
}

export default PromoBanner
