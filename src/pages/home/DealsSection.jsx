import React from 'react';
import { motion, useAnimation } from 'framer-motion';
import img1 from "../../assets/00-3.png";
import img2 from "../../assets/00-4.png";

const slide = (direction) => ({
  hidden: { opacity: 0, x: direction === "right" ? 64 : -64 },
  show: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 120, damping: 18, mass: 0.45 },
  },
});

const DealsSection = () => {
  // تحكّم مستقل لكل صورة
  const controls1 = useAnimation();
  const controls2 = useAnimation();

  return (
    <section className="px-2 sm:px-4 py-8">
      <div className="mx-auto w-full max-w-screen-2xl space-y-6 md:space-y-10">

        {/* 1) الأول: من اليمين إلى اليسار */}
        <div className="flex justify-end overflow-hidden">
          <motion.img
            src={img1}
            alt="عرض 1"
            initial="hidden"
            animate={controls1}
            variants={slide("right")}
            // مهم: لا نضع once:true
            viewport={{ amount: 0.5 }} 
            onViewportEnter={() => controls1.start("show")}
            onViewportLeave={() => controls1.start("hidden")}
            className="select-none transform-gpu"
            style={{
              width: "80%",
              maxWidth: "1600px",
              height: "auto",
              display: "block",
            }}
            draggable={false}
          />
        </div>

        {/* 2) الثاني: من اليسار إلى اليمين */}
        <div className="flex justify-start overflow-hidden">
          <motion.img
            src={img2}
            alt="عرض 2"
            initial="hidden"
            animate={controls2}
            variants={slide("left")}
            viewport={{ amount: 0.5 }} 
            onViewportEnter={() => controls2.start("show")}
            onViewportLeave={() => controls2.start("hidden")}
            className="select-none transform-gpu"
            style={{
              width: "80%",
              maxWidth: "1600px",
              height: "auto",
              display: "block",
            }}
            draggable={false}
          />
        </div>

      </div>
    </section>
  );
};

export default DealsSection;
