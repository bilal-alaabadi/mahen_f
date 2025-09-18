// ========================= src/components/Checkout/Checkout.jsx (نهائي) =========================
import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RiBankCardLine } from "react-icons/ri";
import { getBaseUrl } from "../../utils/baseURL";
import { setCountry, clearGiftCard } from "../../redux/features/cart/cartSlice";
import Thw from "../../assets/images__4_-removebg-preview.png";

const Checkout = () => {
  const dispatch = useDispatch();

  const [error, setError] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [email, setEmail] = useState("");
  const [wilayat, setWilayat] = useState("");
  const [description, setDescription] = useState("");

  // وضع دفع المقدم (10 ر.ع) إذا كان ضمن الطلب تفصيل عباية
  const [payDeposit, setPayDeposit] = useState(false);

  // خيار دولة من دول الخليج (يظهر فقط إذا country === "دول الخليج")
  const [gulfCountry, setGulfCountry] = useState("");

  const { products, totalPrice, country, giftCard } = useSelector((state) => state.cart);

  const currency = country === "دول الخليج" ? "د.إ" : "ر.ع.";
  const exchangeRate = country === "دول الخليج" ? 9.5 : 1; // للعرض فقط

  // عدد المنتجات الإجمالي (لأجل زيادة 3 ريال لكل منتج إضافي في دول الخليج)
  const itemsCount = useMemo(
    () => products.reduce((t, p) => t + Number(p?.quantity || 0), 0),
    [products]
  );

  // رسوم الشحن الأساسية (تُخزَّن وتُحسب دائماً بالريال العُماني)
  const baseShippingFee = useMemo(() => {
    if (country === "دول الخليج") {
      if (gulfCountry === "الإمارات") {
        return 4; // ثابت
      }
      const extraItemsFee = Math.max(0, itemsCount - 1) * 3;
      return 7 + extraItemsFee;
    }
    // داخل عُمان تبقى 2 ر.ع كما هي
    return 2;
  }, [country, gulfCountry, itemsCount]);

  // بعد ذلك تُعرَض بحسب العملة المختارة (قد تُحوَّل إلى AED إن كانت دول الخليج)
  const shippingFee = baseShippingFee * exchangeRate;

  // هل يوجد ضمن الطلب "تفصيل عباية"؟
  const hasTailoredAbaya = useMemo(() => {
    const tailoredCategories = new Set(["تفصيل العبايات", "تفصيل عباية", "عباية", "عبايات"]);
    return products.some((p) => {
      const cat = (p.category || "").trim();
      const isAbayaCategory = tailoredCategories.has(cat);
      const hasMeasures = p.measurements && Object.keys(p.measurements).length > 0;
      return isAbayaCategory && hasMeasures;
    });
  }, [products]);

  useEffect(() => {
    if (products.length === 0) {
      setError("لا توجد منتجات في السلة. الرجاء إضافة منتجات قبل المتابعة إلى الدفع.");
    } else {
      setError("");
    }
  }, [products]);

  // عند التحويل إلى دول الخليج أوقف الدفع مقدم تلقائيًا
  useEffect(() => {
    if (country === "دول الخليج" && payDeposit) {
      setPayDeposit(false);
    }
  }, [country, payDeposit]);

  // حالة المقدم الفعلية: تُلغى قسرًا في دول الخليج
  const payDepositEffective = country === "دول الخليج" ? false : payDeposit;

  // ✅ الدفع
  const makePayment = async (e) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();

    if (products.length === 0) {
      setError("لا توجد منتجات في السلة. الرجاء إضافة منتجات قبل المتابعة إلى الدفع.");
      return;
    }

    if (!customerName || !customerPhone || !country || !wilayat || !email) {
      setError("الرجاء إدخال جميع المعلومات المطلوبة (الاسم، رقم الهاتف، البريد الإلكتروني، البلد، العنوان)");
      return;
    }

    if (country === "دول الخليج" && !gulfCountry) {
      setError("الرجاء اختيار الدولة ضمن دول الخليج.");
      return;
    }

    const countryToSend = country === "دول الخليج" ? gulfCountry : country;

    const body = {
      products: products.map((product) => ({
        _id: product._id,
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        image: Array.isArray(product.image) ? product.image[0] : product.image,
        measurements: product.measurements || {},
        category: product.category || "",
        giftCard: product.giftCard || undefined,
      })),
      customerName,
      customerPhone,
      country: countryToSend,
      gulfCountry,
      wilayat,
      description,
      email,
      depositMode: !!payDepositEffective,
      giftCard: giftCard || null,
    };

    try {
      const response = await fetch(`${getBaseUrl()}/api/orders/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.details?.error ||
            data?.details?.message ||
            data?.error ||
            "حدث خطأ أثناء إنشاء الجلسة"
        );
      }

      if (data.paymentLink) {
        window.location.href = data.paymentLink;
      } else {
        setError("حدث خطأ أثناء إنشاء رابط الدفع. الرجاء المحاولة مرة أخرى.");
      }
    } catch (err) {
      console.error("Error during payment process:", err);
      setError(err.message || "حدث خطأ أثناء عملية الدفع.");
    }
  };

  const displayTotal = useMemo(() => {
    if (payDepositEffective) return (10 * exchangeRate).toFixed(2); // 10 ر.ع
    return ((totalPrice + baseShippingFee) * exchangeRate).toFixed(2);
  }, [payDepositEffective, exchangeRate, totalPrice, baseShippingFee]);

  // ✅ عرض التفاصيل كنص واحد بفواصل • (شكل فقط)
  const renderMeasurementsDetails = (m) => {
    if (!m) return null;
    const parts = [];
    if (m.length) parts.push(`الطول: ${m.length}`);
    if (m.sleeveLength) parts.push(`طول الكم: ${m.sleeveLength}`);
    if (m.width) parts.push(`العرض: ${m.width}`);
    if (m.color) parts.push(`اللون: ${m.color}`);
    if (m.design) parts.push(`القصة: ${m.design}`);
    if (m.buttons) parts.push(`الأزرار: ${m.buttons}`);
    if (m.chestFrontWidth) parts.push(`عرض الصدر من الأمام: ${m.chestFrontWidth}`);
    if (m.sleeveFromShoulder) parts.push(`طول الأكمام من الكتف: ${m.sleeveFromShoulder}`);
    if (m.shoulderWidth) parts.push(`عرض الكتف: ${m.shoulderWidth}`);
    if (m.notes) parts.push(`ملاحظات: ${m.notes}`);

    const text = parts.join(" • ");
    if (!text) return null;

    return (
      <p className="text-xs text-gray-600 mt-1 leading-6 line-clamp-3 md:line-clamp-none">
        {text}
      </p>
    );
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      {/* Grid متناسق للهاتف والكمبيوتر */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {/* إدخال البيانات */}
        <div className="order-1 md:order-1 md:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 shadow p-4 md:p-6">
            <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-[#64472b]">تفاصيل الفاتورة</h1>
            {error && <div className="text-red-500 mb-4">{error}</div>}

            <form className="space-y-4 md:space-y-6" dir="rtl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">الاسم الكامل</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">رقم الهاتف</label>
                  <input
                    type="tel"
                    className="w-full p-2 border rounded-md"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">البريد الإلكتروني</label>
                  <input
                    type="email"
                    className="w-full p-2 border rounded-md"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="example@email.com"
                  />
                </div>

                {/* البلد */}
                <div>
                  <label className="block text-gray-700 mb-2">البلد</label>
                  <select
                    className="w-full p-2 border rounded-md bg-white"
                    value={country}
                    onChange={(e) => {
                      const val = e.target.value;
                      dispatch(setCountry(val));
                      if (val !== "دول الخليج") setGulfCountry("");
                    }}
                  >
                    <option value="عُمان">عُمان</option>
                    <option value="دول الخليج">دول الخليج</option>
                  </select>
                </div>
              </div>

              {country === "دول الخليج" && (
                <div>
                  <label className="block text-gray-700 mb-2">اختر الدولة (دول الخليج)</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={gulfCountry}
                    onChange={(e) => setGulfCountry(e.target.value)}
                  >
                    <option value="">اختر الدولة</option>
                    <option value="الإمارات">الإمارات</option>
                    <option value="السعودية">السعودية</option>
                    <option value="الكويت">الكويت</option>
                    <option value="قطر">قطر</option>
                    <option value="البحرين">البحرين</option>
                    <option value="أخرى">أخرى</option>
                  </select>
                  <p className="text-xs text-gray-600 mt-2">
                    الشحن: الإمارات <span className="font-semibold">4 ريال</span> — السعودية / الكويت / قطر / البحرين{" "}
                    <span className="font-semibold">7 ريال</span>، مع إضافة{" "}
                    <span className="font-semibold">3 ريال لكل منتج إضافي</span>.
                  </p>
                </div>
              )}

              <div>
                <label className="block text-gray-700 mb-2">العنوان</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={wilayat}
                  onChange={(e) => setWilayat(e.target.value)}
                  required
                  placeholder="الرجاء إدخال العنوان كاملاً"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">وصف إضافي (اختياري)</label>
                <textarea
                  className="w-full p-2 border rounded-md"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="أي ملاحظات أو تفاصيل إضافية عن الطلب"
                  rows="3"
                />
              </div>

              {/* زر دفع مقدم يظهر فقط إذا كان ضمن الطلب تفصيل عباية وليس في دول الخليج */}
              {hasTailoredAbaya && country !== "دول الخليج" && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setPayDeposit((v) => !v)}
                    className={`px-3 py-1 text-sm rounded-md border transition ${
                      payDeposit ? "bg-[#64472b] text-white border-[#64472b]" : "bg-white text-[#64472b] border-[#64472b]"
                    }`}
                  >
                    {payDeposit ? "إلغاء دفع المقدم" : "دفع مقدم 10 ر.ع"}
                  </button>
                  <p className="text-xs text-gray-600 mt-2">
                    عند تفعيل "دفع مقدم"، سيتم دفع 10 ر.ع الآن فقط، ويتم احتساب المبلغ المتبقي لاحقاً.
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* تأكيد الطلب */}
        <div className="order-2 md:order-2 md:col-span-1">
          <div className="w-full p-4 md:p-6 bg-white rounded-lg shadow-lg border border-gray-200 md:sticky md:top-4">
            <h2 className="text-lg md:text-xl font-bold mb-4 text-gray-800">طلبك</h2>

            <div className="space-y-4">
              {products.map((product) => (
                <div
                  key={`${product._id}-${JSON.stringify(product.measurements || {})}`}
                  className="py-2 border-b border-gray-100"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-gray-700">
                      {product.name} × {product.quantity}
                    </span>
                    <span className="text-gray-900 font-medium whitespace-nowrap">
                      {(Number(product.price || 0) * exchangeRate * Number(product.quantity || 1)).toFixed(2)} {currency}
                    </span>
                  </div>

                  {/* تفاصيل القياسات كنص مختصر */}
                  {renderMeasurementsDetails(product.measurements)}

                  {/* بطاقة الهدية الخاصة بالمنتج (شكل طبيعي) */}
                  {product.giftCard &&
                    ((product.giftCard.from && String(product.giftCard.from).trim()) ||
                      (product.giftCard.to && String(product.giftCard.to).trim()) ||
                      (product.giftCard.phone && String(product.giftCard.phone).trim()) ||
                      (product.giftCard.note && String(product.giftCard.note).trim())) && (
                      <div className="mt-2 p-2 rounded-md border border-gray-200 bg-white text-[12px] text-gray-700 space-y-0.5">
                        <div className="font-semibold text-[#64472b]">بطاقة هدية</div>
                        {product.giftCard.from && String(product.giftCard.from).trim() && (
                          <div>من: {product.giftCard.from}</div>
                        )}
                        {product.giftCard.to && String(product.giftCard.to).trim() && (
                          <div>إلى: {product.giftCard.to}</div>
                        )}
                        {product.giftCard.phone && String(product.giftCard.phone).trim() && (
                          <div>رقم المستلم: {product.giftCard.phone}</div>
                        )}
                        {product.giftCard.note && String(product.giftCard.note).trim() && (
                          <div>ملاحظات: {product.giftCard.note}</div>
                        )}
                      </div>
                    )}
                </div>
              ))}

              {/* بطاقة الهدية العامة (إن وُجدت) */}
              {giftCard && (giftCard.from || giftCard.to || giftCard.phone || giftCard.note) && (
                <div className="mt-2 p-3 rounded-md border border-gray-200 bg-white text-gray-800 space-y-1">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-[#64472b]">بطاقة هدية</h3>
                    <button
                      onClick={() => dispatch(clearGiftCard())}
                      className="text-xs text-red-600 underline hover:opacity-80"
                    >
                      إزالة البطاقة
                    </button>
                  </div>
                  {!!giftCard.from && <p>من: {giftCard.from}</p>}
                  {!!giftCard.to && <p>إلى: {giftCard.to}</p>}
                  {!!giftCard.phone && <p>رقم المستلم: {giftCard.phone}</p>}
                  {!!giftCard.note && <p>ملاحظات: {giftCard.note}</p>}
                </div>
              )}

              {/* رسوم الشحن تُخفى عند دفع المقدم */}
              {!payDepositEffective && (
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="text-gray-800">رسوم الشحن</span>
                  <p className="text-gray-900">
                    {currency}
                    {shippingFee.toFixed(2)}
                  </p>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <span className="text-gray-800 font-semibold">
                  {payDepositEffective ? "الإجمالي (دفعة مقدم)" : "الإجمالي"}
                </span>
                <p className="text-gray-900 font-bold">
                  {currency}
                  {displayTotal}
                </p>
              </div>
            </div>

            {/* بطاقة ثواني + زر الإتمام */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">بوابة ثواني للدفع الإلكتروني</h3>

              {/* بطاقة الدفع — شكل فقط */}
              <div
                onClick={(e) => {
                  if (products.length === 0) return;
                  makePayment(e);
                }}
                onKeyDown={(e) => {
                  if (products.length === 0) return;
                  if (e.key === "Enter" || e.key === " ") makePayment(e);
                }}
                role="button"
                aria-disabled={products.length === 0}
                tabIndex={products.length === 0 ? -1 : 0}
                className={[
                  "w-full rounded-xl border border-gray-200 bg-white",
                  "px-4 py-3 shadow-sm flex items-center justify-center gap-3",
                  "transition hover:shadow-md hover:border-[#64472b] hover:ring-1 hover:ring-[#64472b]/30",
                  products.length === 0 ? "opacity-50 pointer-events-none select-none" : "cursor-pointer"
                ].join(" ")}
              >
                <img src={Thw} alt="ثواني" className="h-10 w-10" loading="lazy" decoding="async" />
                <span className="text-gray-900 font-medium">
                  {payDepositEffective ? "دفع الدفعة (10 ر.ع)" : "الدفع باستخدام ثواني"}
                </span>
              </div>

              <p className="mt-4 text-sm text-gray-600">
                سيتم استخدام بياناتك الشخصية لمعالجة طلبك، ودعم تجربتك عبر هذا
                الموقع، ولأغراض أخرى موضحة في{" "}
                <a className="text-[#64472b] hover:underline">سياسة الخصوصية</a>.
              </p>

              <button
                onClick={makePayment}
                className="mt-4 w-full bg-[#64472b] text-white px-6 py-3 rounded-md hover:bg-[#503823] transition-colors disabled:opacity-50"
                disabled={products.length === 0}
              >
                إتمام الطلب
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
