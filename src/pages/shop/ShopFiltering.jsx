// ShopFiltering.jsx
import React from 'react';

const ShopFiltering = ({ filters, filtersState, setFiltersState, clearFilters }) => {
  return (
    <aside
      dir="rtl"
      className="w-full md:w-64 lg:w-72 flex-shrink-0"
      aria-label="لوحة الفلاتر"
    >
      <div className="sticky top-4">
        {/* بطاقة الفلاتر */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm p-4 md:p-5 space-y-5">
          {/* العنوان */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* أيقونة قمع التصفية */}
              <svg
                className="w-5 h-5 text-[#64472b]"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M3 5h18M6 10h12M10 15h4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
              <h3 className="text-lg font-semibold text-[#64472b]">الفلاتر</h3>
            </div>

            {/* زر مسح — نسخة صغيرة أعلى */}
            <button
              onClick={clearFilters}
              className="hidden md:inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border border-[#64472b]/20 text-[#64472b] hover:bg-[#64472b]/5 transition-colors"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M6 18L18 6M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
              مسح الكل
            </button>
          </div>

          {/* الفئات */}
          <section>
            <h4 className="font-medium text-base mb-3 text-gray-800">الفئة</h4>
            <hr className="border-gray-200 mb-3" />

            {/* شبكة شرائح أنيقة للفئات */}
            <div className="grid grid-cols-1 gap-2 max-h-[320px] overflow-auto pr-1 custom-scroll">
              {filters.categories.map((category) => {
                const checked = filtersState.category === category;
                return (
                  <label
                    key={category}
                    className={[
                      "relative cursor-pointer select-none group",
                      "rounded-xl border px-3 py-2 flex items-center justify-between gap-3",
                      "transition-all",
                      checked
                        ? "border-[#64472b] bg-[#64472b]/5 ring-1 ring-[#64472b]/30"
                        : "border-gray-200 hover:bg-gray-50"
                    ].join(" ")}
                  >
                    {/* الراديو مخفي لكن قابل للوصول */}
                    <input
                      type="radio"
                      name="category"
                      value={category}
                      checked={checked}
                      onChange={(e) =>
                        setFiltersState({
                          ...filtersState,
                          category: e.target.value,
                        })
                      }
                      className="peer sr-only"
                    />

                    {/* اسم الفئة */}
                    <span className="text-sm text-gray-800">{category}</span>

                    {/* دائرة اختيار مخصصة */}
                    <span
                      className={[
                        "flex items-center justify-center w-5 h-5 rounded-full border",
                        "transition-colors",
                        checked
                          ? "bg-[#64472b] border-[#64472b] text-white"
                          : "border-gray-300 bg-white text-transparent group-hover:border-[#64472b]/50"
                      ].join(" ")}
                      aria-hidden="true"
                    >
                      {/* علامة صح تظهر عند التحديد */}
                      <svg
                        viewBox="0 0 24 24"
                        className="w-3.5 h-3.5"
                        fill="none"
                      >
                        <path
                          d="M5 13l4 4L19 7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </label>
                );
              })}
            </div>
          </section>

          {/* زر مسح الفلاتر (نسخة كبيرة أسفل) */}
          <button
            onClick={clearFilters}
            className="w-full bg-[#64472b] text-white py-2.5 rounded-xl shadow hover:shadow-md hover:bg-[#5a3f26] active:scale-[0.99] transition-all"
          >
            مسح كل الفلاتر
          </button>
        </div>
      </div>

      {/* Scrollbar لطيف */}
      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 8px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 9999px; }
        .custom-scroll:hover::-webkit-scrollbar-thumb { background: #d1d5db; }
      `}</style>
    </aside>
  );
};

export default ShopFiltering;
