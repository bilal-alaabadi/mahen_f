// src/components/Card.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setGiftCard, clearGiftCard } from '../../../redux/features/cart/cartSlice';

const Card = () => {
  const dispatch = useDispatch();
  const giftCardFromStore = useSelector((s) => s.cart.giftCard);

  const [showGift, setShowGift] = useState(!!giftCardFromStore);
  const [giftFrom, setGiftFrom]   = useState(giftCardFromStore?.from  || '');
  const [giftTo, setGiftTo]       = useState(giftCardFromStore?.to    || '');
  const [giftPhone, setGiftPhone] = useState(giftCardFromStore?.phone || '');
  const [giftNote, setGiftNote]   = useState(giftCardFromStore?.note  || '');

  useEffect(() => {
    if (!showGift) {
      dispatch(clearGiftCard());
      return;
    }
    dispatch(setGiftCard({ from: giftFrom, to: giftTo, phone: giftPhone, note: giftNote }));
  }, [showGift, giftFrom, giftTo, giftPhone, giftNote, dispatch]);

  return (
    <div className="pt-3">
      <button
        type="button"
        onClick={() => setShowGift((v) => !v)}
        className="px-3 py-1 text-sm rounded-md border border-[#64472b] text-[#64472b] hover:bg-[#64472b] hover:text-white transition"
      >
        بطاقة هدية ؟
      </button>

      {showGift && (
        <div className="mt-3 p-3 border rounded-md space-y-3">
          <div>
            <label className="block text-gray-700 mb-1">من</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#64472b]/50"
              value={giftFrom}
              onChange={(e) => setGiftFrom(e.target.value)}
              placeholder="اسم المُرسِل"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">إلى</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#64472b]/50"
              value={giftTo}
              onChange={(e) => setGiftTo(e.target.value)}
              placeholder="اسم المُستلم"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">الرقم (رقم المستلم)</label>
            <input
              type="tel"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#64472b]/50"
              value={giftPhone}
              onChange={(e) => setGiftPhone(e.target.value)}
              placeholder="مثال: 9XXXXXXXX"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">ملاحظات الهدية</label>
            <textarea
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#64472b]/50"
              value={giftNote}
              onChange={(e) => setGiftNote(e.target.value)}
              placeholder="رسالة قصيرة تُرفق مع الهدية (اختياري)"
              rows="3"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;
