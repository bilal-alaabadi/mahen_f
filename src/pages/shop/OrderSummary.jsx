// ========================= src/components/cart/OrderSummary.jsx =========================
import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../../redux/features/cart/cartSlice';
import { Link } from 'react-router-dom';

const OrderSummary = ({ onClose }) => {
  const dispatch = useDispatch();
  const { products = [], totalPrice = 0, shippingFee = 0, country } = useSelector((s) => s.cart);

  // العملة وسعر الصرف
  const isAED = country === 'الإمارات' || country === 'دول الخليج';
  const currency = isAED ? 'د.إ' : 'ر.ع.';
  const exchangeRate = isAED ? 9.5 : 1;

  // الشحن محفوظ بالريال العُماني. لدول الخليج نفرض 5 ر.ع.
  const baseShippingFee = country === 'دول الخليج' ? 5 : Number(shippingFee || 0);

  // المجاميع
  const formattedTotalPrice = (Number(totalPrice) * exchangeRate).toFixed(2);
  const formattedShippingFee = (Number(baseShippingFee) * exchangeRate).toFixed(2);
  const formattedGrandTotal = (Number(totalPrice + baseShippingFee) * exchangeRate).toFixed(2);

  // 🔹 خريطة فتح/إغلاق تفاصيل القياسات لكل عنصر
  const [openMap, setOpenMap] = useState({}); // { [lineKey]: boolean }
  const toggleOpen = (key) =>
    setOpenMap((prev) => ({ ...prev, [key]: !prev[key] }));

  // 🔹 مفتاح ثابت لكل صف (يشمل القياسات وبطاقة الهدية لو وُجدت)
  const lineKeyOf = (item, i) => {
    const mk = item?.measurements ? JSON.stringify(item.measurements) : '{}';
    const gc = item?.giftCard ? JSON.stringify(item.giftCard) : '{}';
    return `${item?._id || item?.id || i}::${mk}::${gc}`;
  };

  // 🔹 بناء نص القياسات كسطر واحد مفصول بـ •
  const buildMeasurementsText = (m) => {
    if (!m) return '';
    const parts = [];
    // تفصيل العبايات
    if (m.length) parts.push(`الطول: ${m.length}`);
    if (m.sleeveLength) parts.push(`طول الكم: ${m.sleeveLength}`);
    if (m.width) parts.push(`العرض: ${m.width}`);
    if (m.color) parts.push(`اللون: ${m.color}`);
    if (m.design) parts.push(`القصة: ${m.design}`);
    if (m.buttons) parts.push(`الأزرار: ${m.buttons}`);
    // ملابس مناسبات
    if (m.chestFrontWidth) parts.push(`عرض الصدر (أمام): ${m.chestFrontWidth}`);
    if (m.sleeveFromShoulder) parts.push(`طول الأكمام من الكتف: ${m.sleeveFromShoulder}`);
    if (m.shoulderWidth) parts.push(`عرض الكتف: ${m.shoulderWidth}`);
    // عامة
    if (m.notes) parts.push(`ملاحظات: ${m.notes}`);
    return parts.join(' • ');
  };

  const ProductsList = useMemo(
    () => (
      <div className="space-y-2">
        {products.map((item, i) => {
          const qty = Number(item?.quantity || 0);
          const lineKey = lineKeyOf(item, i);
          const open = !!openMap[lineKey];
          const mText = buildMeasurementsText(item?.measurements);

          return (
            <div key={lineKey} className="rounded-md border border-gray-200 p-3">
              {/* رأس الصف */}
              <div className="flex items-center justify-between">
                <div className="text-gray-700">
                  <span className="inline-block min-w-10">عنصر #{i + 1}</span>
                  <span className="mx-2">× {qty}</span>
                </div>

                {/* زر عرض/إخفاء القياسات (يظهر فقط إذا فيه قياسات) */}
                {mText ? (
                  <button
                    type="button"
                    onClick={() => toggleOpen(lineKey)}
                    className="text-xs text-[#64472b] underline underline-offset-2 hover:opacity-80 transition"
                    aria-expanded={open}
                  >
                    {open ? 'إخفاء القياسات' : 'عرض القياسات'}
                  </button>
                ) : null}
              </div>

              {/* تفاصيل القياسات — كفقرة مختصرة مع تقليم على الجوال */}
              {open && mText && (
                <p className="mt-2 text-xs md:text-sm text-gray-600 leading-6 line-clamp-3 md:line-clamp-none">
                  {mText}
                </p>
              )}
            </div>
          );
        })}
      </div>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [products, openMap]
  );

  return (
    <div className="text-sm text-gray-800" dir="rtl">
      {/* قائمة المنتجات */}
      {products.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between font-semibold text-gray-700">
            <span>تفاصيل العناصر</span>
            <span className="text-xs text-gray-500">({products.length})</span>
          </div>
          <div className="mt-2">{ProductsList}</div>
        </div>
      )}

      {/* المجاميع */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">الإجمالي الفرعي</span>
          <span className="font-medium">
            {formattedTotalPrice} {currency}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">الشحن</span>
          <span className="font-medium">
            {formattedShippingFee} {currency}
          </span>
        </div>

        <p className="text-[12px] text-gray-500 leading-5 mt-2">
          سيتم احتساب الشحن والضرائب (إن وُجدت) عند إتمام الطلب. قد تُضاف رسوم إضافية حسب الوجهة.
        </p>

        <div className="flex items-center justify-between pt-2 border-t">
          <span className="font-bold text-base">المجموع</span>
          <span className="font-extrabold text-base">
            {formattedGrandTotal} {currency}
          </span>
        </div>
      </div>

      {/* الأزرار */}
      <div className="mt-3 space-y-2">
        <Link to="/checkout" className="block">
          <button
            onClick={onClose}
            className="w-full rounded-md bg-[#64472b] text-white py-2.5 text-sm font-medium hover:bg-[#503823] transition-colors"
          >
            المتابعة للدفع
          </button>
        </Link>

        <button
          onClick={() => dispatch(clearCart())}
          className="w-full rounded-md border border-gray-300 bg-white py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          مسح السلة
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;
