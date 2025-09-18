// ========================= src/pages/shop/SingleProduct.jsx =========================
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useFetchProductByIdQuery } from '../../../redux/features/products/productsApi';
import { addToCart, clearGiftCard } from '../../../redux/features/cart/cartSlice';
import ReviewsCard from '../reviews/ReviewsCard';
import Card from './Card';
import imge from "../../../assets/00-2.png";
import logo from "../../../assets/لوقو-02.png"; // 👈 الشعار لسكريم اللودينغ

const SingleProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { data, error, isLoading } = useFetchProductByIdQuery(id);
  const { country, giftCard } = useSelector((state) => state.cart);
  const singleProduct = data;
  const productReviews = data?.reviews || [];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageScale, setImageScale] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [cartQty, setCartQty] = useState(1);

  // ✅ قياسات ابتدائية
  const initialMeasurements = {
    length: '',
    sleeveLength: '',
    width: '',
    design: '',
    color: '',
    buttons: '',
    chestFrontWidth: '',
    sleeveFromShoulder: '',
    shoulderWidth: '',
    notes: '',
  };
  const [measurements, setMeasurements] = useState(initialMeasurements);

  // مفتاح لإعادة تركيب بطاقة الهدية بعد الإضافة
  const [giftResetKey, setGiftResetKey] = useState(0);

  const isAEDCountry = country === 'الإمارات' || country === 'دول الخليج';
  const currency = isAEDCountry ? 'د.إ' : 'ر.ع.';
  const exchangeRate = isAEDCountry ? 9.5 : 1;

  useEffect(() => {
    setImageScale(1.05);
    const timer = setTimeout(() => setImageScale(1), 300);
    return () => clearTimeout(timer);
  }, []);

  // 🚫 منع التمرير أثناء التحميل بالشعار
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isLoading]);

  const handleAddToCart = (product) => {
    if (product.category === 'تفصيل العبايات') {
      if (
        !measurements.length ||
        !measurements.sleeveLength ||
        !measurements.width ||
        !measurements.color ||
        !measurements.design ||
        !measurements.buttons
      ) {
        alert('الرجاء إدخال جميع القياسات المطلوبة');
        return;
      }
    }

    if (product.category === 'ملابس مناسبات') {
      if (
        !measurements.length ||
        !measurements.chestFrontWidth ||
        !measurements.sleeveFromShoulder ||
        !measurements.shoulderWidth
      ) {
        alert('الرجاء إدخال الطول، عرض الصدر من الأمام، طول الأكمام من الكتف، وعرض الكتف — بالإنش.');
        return;
      }
    }

    const unitBasePrice = Number(product.regularPrice ?? product.price ?? 0);
    const unitDisplayPrice = unitBasePrice * exchangeRate;
    const lineTotal = unitDisplayPrice * cartQty;

    setIsAddingToCart(true);

    const giftCardForLine =
      giftCard && (giftCard.from || giftCard.to || giftCard.phone || giftCard.note)
        ? { ...giftCard }
        : null;

    const productToAdd = {
      ...product,
      price: unitBasePrice,
      measurements: measurements,
      quantity: cartQty,
      lineTotal,
      currency,
      exchangeRate,
      giftCard: giftCardForLine,
    };

    dispatch(addToCart(productToAdd));

    // ✅ تصفير
    setMeasurements(initialMeasurements);
    setCartQty(1);
    setCurrentImageIndex(0);
    dispatch(clearGiftCard());
    setGiftResetKey((k) => k + 1);

    setTimeout(() => setIsAddingToCart(false), 700);
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === singleProduct.image.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? singleProduct.image.length - 1 : prevIndex - 1
    );
  };

  const handleMeasurementChange = (e) => {
    const { name, value } = e.target;
    setMeasurements((prev) => ({ ...prev, [name]: value }));
  };

  const increaseQty = () => setCartQty((q) => q + 1);
  const decreaseQty = () => setCartQty((q) => (q > 1 ? q - 1 : 1));

  // 🔄 شاشة تحميل بالشعار الكبير
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
        <div className="logo-wrapper">
          <img
            src={logo}
            alt="شعار المتجر"
            className="h-[340px] md:h-[500px] w-auto select-none"
            draggable="false"
          />
        </div>

        <style>{`
          .logo-wrapper {
            position: relative;
            display: inline-block;
            overflow: hidden;
            filter: drop-shadow(0 12px 32px rgba(0,0,0,0.12));
          }
          .logo-wrapper::before {
            content: '';
            position: absolute;
            top: -160%;
            left: 0;
            width: 100%;
            height: 320%;
            background: linear-gradient(
              to bottom,
              rgba(255,255,255,0) 0%,
              rgba(255,255,255,0.55) 50%,
              rgba(255,255,255,0) 100%
            );
            animation: shineMove 2.6s linear infinite;
            pointer-events: none;
          }
          @keyframes shineMove {
            0%   { top: -160%; }
            100% { top: 160%;  }
          }
        `}</style>
      </div>
    );
  }

  if (error) return <p>حدث خطأ أثناء تحميل تفاصيل المنتج.</p>;
  if (!singleProduct) return null;

  const currentBasePrice = Number(singleProduct.regularPrice ?? singleProduct.price ?? 0);
  const unitPrice = currentBasePrice * exchangeRate;

  const oldPrice = singleProduct.oldPrice ? singleProduct.oldPrice * exchangeRate : null;
  const hasRealDiscount = oldPrice && singleProduct.oldPrice > currentBasePrice;
  const discountPercentage = hasRealDiscount
    ? Math.round(((oldPrice - unitPrice) / oldPrice) * 100)
    : 0;

  const brandColor = '#64472b';

  return (
    <>
      <section className="flex justify-center">
        <img
          src={imge}
          alt="متجر حناء برغند"
          className="h-[21vh] object-cover md:h-[80vh] lg:h-[35vh]
                     w-full md:w-4/5 lg:w-screen"
        />
      </section>

      <section className='section__container bg-gradient-to-r mt-8' dir='rtl'>
        <div className='flex flex-col items-center md:flex-row gap-8'>
          {/* الصور */}
          <div className='md:w-1/2 w-full relative'>
            {hasRealDiscount && (
              <div className="absolute top-3 left-3 bg-[#64472b] text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                خصم {discountPercentage}%
              </div>
            )}

            {singleProduct.image && singleProduct.image.length > 0 ? (
              <>
                <div className="overflow-hidden rounded-md">
                  <img
                    src={singleProduct.image[currentImageIndex]}
                    alt={singleProduct.name}
                    className={`w-full h-auto transition-transform duration-300`}
                    style={{ transform: `scale(${imageScale})` }}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/500";
                      e.target.alt = "Image not found";
                    }}
                  />
                </div>

                {singleProduct.image.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className='absolute left-0 top-1/2 -translate-y-1/2 bg-white text-[color:#64472b] border border-[color:#64472b] p-2 rounded-full hover:bg-gray-50 shadow'
                      aria-label="الصورة السابقة"
                    >
                      <i className="ri-arrow-left-s-line"></i>
                    </button>
                    <button
                      onClick={nextImage}
                      className='absolute right-0 top-1/2 -translate-y-1/2 bg-white text-[color:#64472b] border border-[color:#64472b] p-2 rounded-full hover:bg-gray-50 shadow'
                      aria-label="الصورة التالية"
                    >
                      <i className="ri-arrow-right-s-line"></i>
                    </button>
                  </>
                )}

                {singleProduct.image.length > 1 && (
                  <div className="mt-4 grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8 gap-2">
                    {singleProduct.image.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`relative rounded-md overflow-hidden border ${
                          currentImageIndex === idx ? 'border-[color:#64472b]' : 'border-gray-200'
                        } hover:border-[color:#64472b]`}
                        aria-label={`صورة رقم ${idx + 1}`}
                      >
                        <img
                          src={img}
                          alt={`${singleProduct.name} - ${idx + 1}`}
                          className="w-full h-16 object-cover"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/150";
                            e.target.alt = "Image not found";
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <p className="text-red-600">لا توجد صور متاحة لهذا المنتج.</p>
            )}
          </div>

          {/* التفاصيل */}
          <div className='md:w-1/2 w-full'>
            <h3 className='text-2xl font-semibold mb-8 text-center'>{singleProduct.name}</h3>

            <div className='mb-8'>
              <div
                className='text-xl flex flex-col items-center gap-3 text-center'
                style={{ color: brandColor }}
              >
                <span>سعر الوحدة: {unitPrice.toFixed(2)} {currency}</span>
                {hasRealDiscount && oldPrice && (
                  <s className="text-[#9B2D1F] text-sm">
                    {oldPrice.toFixed(2)} {currency}
                  </s>
                )}
              </div>
            </div>

            <p className="text-gray-500 mb-8 text-lg font-medium leading-relaxed text-center space-y-3">
              <span className="text-gray-800 font-bold block mb-3">الوصف:</span>
              <span className="text-gray-600 block">{singleProduct.description}</span>
            </p>

            {/* عداد الكمية */}
            <div className="mb-6 flex flex-col items-center text-center">
              <label className="block text-gray-700 mb-3 font-bold text-lg">الكمية</label>

              <div className="inline-flex items-center gap-4 bg-gray-10 rounded-lg p-3 shadow-sm">
                <button
                  type="button"
                  onClick={decreaseQty}
                  className="w-12 h-12 flex items-center justify-center rounded-md bg-white text-[color:#64472b] border border-[color:#64472b] text-xl font-bold hover:bg-gray-50"
                  aria-label="تقليل الكمية"
                >
                  -
                </button>

                <div className="min-w-[3rem] text-center font-bold text-xl">{cartQty}</div>

                <button
                  type="button"
                  onClick={increaseQty}
                  className="w-12 h-12 flex items-center justify-center rounded-md bg-white text-[color:#64472b] border border-[color:#64472b] text-xl font-bold hover:bg-gray-50"
                  aria-label="زيادة الكمية"
                >
                  +
                </button>
              </div>
            </div>

            {singleProduct.category === 'تفصيل العبايات' && (
              <div className="mb-6 text-center">
                <div className="p-4 rounded-md">
                  <h4 className="text-lg font-semibold mb-4" style={{ color: brandColor }}>تفاصيل القياسات المطلوبة</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-1">الطول (إنش)</label>
                      <input
                        type="number"
                        name="length"
                        value={measurements.length}
                        onChange={handleMeasurementChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="أدخل الطول"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">طول الكم من نصف الرقبة (إنش)</label>
                      <input
                        type="number"
                        name="sleeveLength"
                        value={measurements.sleeveLength}
                        onChange={handleMeasurementChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="أدخل طول الكم"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">العرض (إنش)</label>
                      <input
                        type="number"
                        name="width"
                        value={measurements.width}
                        onChange={handleMeasurementChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="أدخل العرض"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">اللون</label>
                      <input
                        type="text"
                        name="color"
                        value={measurements.color}
                        onChange={handleMeasurementChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="أدخل اللون المطلوب"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">القطعة</label>
                      <select
                        name="design"
                        value={measurements.design}
                        onChange={handleMeasurementChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                      >
                        <option value="">اختر القصة</option>
                        <option value="مثل المعروضة">مثل المعروضة</option>
                        <option value="عادية">عادية</option>
                        <option value="كلوش">كلوش</option>
                        <option value="بحريني">بحريني</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">الأزرار</label>
                      <select
                        name="buttons"
                        value={measurements.buttons}
                        onChange={handleMeasurementChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                      >
                        <option value="">اختر نوع الأزرار</option>
                        <option value="بدون أزرار">بدون أزرار</option>
                        <option value="مع أزرار">مع أزرار</option>
                        <option value="خياطة بدون أزرار">خياطة بدون أزرار</option>
                      </select>
                    </div>
                  </div>
                  <div className='pt-2 text-sm text-gray-600'>ملاحظة : وقت الطلب يستغرق 5-25 يومًا.</div>
                </div>
              </div>
            )}

            {singleProduct.category === 'ملابس مناسبات' && (
              <div className="mb-6 text-center">
                <div className="p-4 rounded-md">
                  <h4 className="text-lg font-semibold mb-4" style={{ color: brandColor }}>قياسات ملابس المناسبات (بالإنش)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-1">الطول (إنش)</label>
                      <input
                        type="number"
                        name="length"
                        value={measurements.length}
                        onChange={handleMeasurementChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="أدخل الطول بالإنش"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">عرض الصدر من الأمام (إنش)</label>
                      <input
                        type="number"
                        name="chestFrontWidth"
                        value={measurements.chestFrontWidth}
                        onChange={handleMeasurementChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="أدخل عرض الصدر من الأمام بالإنش"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">طول الأكمام من الكتف (إنش)</label>
                      <input
                        type="number"
                        name="sleeveFromShoulder"
                        value={measurements.sleeveFromShoulder}
                        onChange={handleMeasurementChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="أدخل طول الأكمام من الكتف بالإنش"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">عرض الكتف (إنش)</label>
                      <input
                        type="number"
                        name="shoulderWidth"
                        value={measurements.shoulderWidth}
                        onChange={handleMeasurementChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="أدخل عرض الكتف بالإنش"
                        required
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-gray-700 mb-1">ملاحظات (اختياري)</label>
                    <textarea
                      name="notes"
                      value={measurements.notes}
                      onChange={handleMeasurementChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="أدخل أي ملاحظات إضافية"
                      rows="3"
                    />
                  </div>
                  <div className='pt-2 text-sm text-gray-600'>ملاحظة : وقت الطلب يستغرق 5-25 يومًا.</div>
                </div>
              </div>
            )}

            {/* بطاقة هدية — تظهر لكل المنتجات وتُعاد تهيئتها بعد الإضافة */}
            <div className="mb-6">
              <Card key={giftResetKey} />
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(singleProduct);
              }}
              className={`mt-6 px-6 py-3 rounded-md transition-all duration-200 relative overflow-hidden
                bg-[#64472b] text-white border border-[#64472b] hover:bg-[#503823]
                ${isAddingToCart ? 'bg-green-500 text-white border-green-500' : ''}
              `}
              disabled={
                (singleProduct.category === 'تفصيل العبايات' &&
                  (!measurements.length ||
                    !measurements.sleeveLength ||
                    !measurements.width ||
                    !measurements.color ||
                    !measurements.design ||
                    !measurements.buttons)) ||
                (singleProduct.category === 'ملابس مناسبات' &&
                  (!measurements.length ||
                    !measurements.chestFrontWidth ||
                    !measurements.sleeveFromShoulder ||
                    !measurements.shoulderWidth))
              }
              style={{
                opacity:
                  (singleProduct.category === 'تفصيل العبايات' &&
                    (!measurements.length ||
                      !measurements.sleeveLength ||
                      !measurements.width ||
                      !measurements.color ||
                      !measurements.design ||
                      !measurements.buttons)) ||
                  (singleProduct.category === 'ملابس مناسبات' &&
                    (!measurements.length ||
                      !measurements.chestFrontWidth ||
                      !measurements.sleeveFromShoulder ||
                      !measurements.shoulderWidth))
                    ? 0.6
                    : 1,
                cursor:
                  (singleProduct.category === 'تفصيل العبايات' &&
                    (!measurements.length ||
                      !measurements.sleeveLength ||
                      !measurements.width ||
                      !measurements.color ||
                      !measurements.design ||
                      !measurements.buttons)) ||
                  (singleProduct.category === 'ملابس مناسبات' &&
                    (!measurements.length ||
                      !measurements.chestFrontWidth ||
                      !measurements.sleeveFromShoulder ||
                      !measurements.shoulderWidth))
                    ? 'not-allowed'
                    : 'pointer',
              }}
            >
              {isAddingToCart ? (
                <>
                  <span className="animate-bounce">تمت الإضافة!</span>
                  <span className="absolute inset-0 bg-green-500 opacity-0 animate-fade"></span>
                </>
              ) : (
                'إضافة إلى السلة'
              )}
            </button>
          </div>
        </div>
      </section>

      <section className='section__container bg-gradient-to-r mt-8' dir='rtl'>
        <ReviewsCard productReviews={productReviews} />
      </section>
    </>
  );
};

export default SingleProduct;
