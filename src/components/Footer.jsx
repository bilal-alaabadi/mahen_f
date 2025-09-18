import React from "react";
import log from "../assets/00-1.png"; // شعار RF_COLLECTION
import { SiVisa, SiMastercard, SiApplepay, SiGooglepay } from "react-icons/si";
import { FaInstagram, FaWhatsapp, FaTiktok } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white" style={{ 
      '--footer-text': '#373431', 
      '--footer-hover': '#2e2a26', 
      '--footer-accent': '#d3ae27' 
    }}>
      {/* ===== شريط علوي FULL-BLEED ===== */}
      <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 36"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M28 0 H100 V36 H28 A28 28 0 0 1 28 0 Z" fill="var(--footer-text)" />
        </svg>

        <div className="relative max-w-7xl mx-auto px-4 py-8 md:py-12">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
            {/* الشعار */}
            <div className="shrink-0 self-start">
              <img
                src={log}
                alt="شعار RF_COLLECTION"
                className="w-28 md:w-40 object-contain select-none pointer-events-none"
              />
            </div>

            {/* وسائل الدفع */}
            <div className="text-white w-full md:w-auto md:ml-auto md:self-center">
              <div className="w-full flex justify-end">
                <div className="flex items-center gap-5 md:gap-6 mb-3 md:mb-4">
                  <SiVisa className="text-3xl md:text-4xl drop-shadow-sm" />
                  <SiMastercard className="text-3xl md:text-4xl drop-shadow-sm" />
                  <SiApplepay className="text-3xl md:text-4xl drop-shadow-sm" />
                  <SiGooglepay className="text-3xl md:text-4xl drop-shadow-sm" />
                </div>
              </div>

              <p className="text-right text-lg md:text-2xl font-semibold leading-relaxed text-[var(--footer-text)]">
                وسائل دفع متعددة
                <br />
                اختر وسيلة الدفع المناسبة
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* الأقسام السفلية */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="py-10 grid grid-cols-1 md:grid-cols-3 gap-10 bg-white text-[var(--footer-text)] md:text-right text-center">
          {/* روابط مهمة */}
          <div>
            <h4 className="text-xl font-bold mb-3">روابط مهمة</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/about" className="hover:text-[var(--footer-accent)] transition">
                  من نحن
                </a>
              </li>
              <li>
                <a href="/return-policy" className="hover:text-[var(--footer-accent)] transition">
                  سياسة الاستبدال والاسترجاع
                </a>
              </li>
            </ul>
          </div>

          {/* تواصل معنا */}
          <div>
            <h4 className="text-xl font-bold mb-3">تواصل معنا</h4>
            <p className="text-sm mb-4">+96876622757</p>
            <div className="flex justify-center md:justify-end gap-4">
              <a
                href="https://www.instagram.com/mahin_designss"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--footer-hover)] transition"
              >
                <FaInstagram className="text-xl" />
              </a>
              <a
                href="https://api.whatsapp.com/send/?phone=96876622757"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--footer-hover)] transition"
              >
                <FaWhatsapp className="text-xl" />
              </a>
              <a
                href="https://www.tiktok.com/@mahin_designss"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--footer-hover)] transition"
              >
                <FaTiktok className="text-xl" />
              </a>
            </div>
          </div>
        </div>

        {/* الحقوق */}
        <div className="border-t border-[var(--footer-accent)]/30 pt-4 pb-8 text-center text-sm text-[var(--footer-text)]" dir="rtl">
          جميع الحقوق محفوظة لدى ماهـين كولكشن—{" "}
          <a
            href="https://www.instagram.com/mobadeere/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[var(--footer-hover)] transition-colors"
          >
            تصميم مبادر
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
