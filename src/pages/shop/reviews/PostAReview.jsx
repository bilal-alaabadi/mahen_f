import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useFetchProductByIdQuery } from '../../../redux/features/products/productsApi';
import { usePostReviewMutation } from '../../../redux/features/reviews/reviewsApi';

const PostAReview = ({ isModalOpen, handleClose }) => {
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth)
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const { refetch } = useFetchProductByIdQuery(id, { skip: !id });
  const [postReview] = usePostReviewMutation();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isModalOpen && !user) {
      handleClose?.();
      navigate('/register', { state: { from: location.pathname } });
    }
  }, [isModalOpen, user, navigate, location.pathname, handleClose]);

  const handleRating = (value) => {
    setRating(value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      handleClose?.();
      navigate('/register', { state: { from: location.pathname } });
      return;
    }

    const newComment = {
      comment,
      rating,
      userId: user?._id,
      productId: id
    }

    try {
      await postReview(newComment).unwrap();
      alert("تم نشر التعليق بنجاح!");
      setComment('');
      setRating(0);
      refetch();
    } catch (error) {
      alert(error?.data?.message || error.message || "حدث خطأ غير متوقع");
    }
    handleClose?.();
  }

  return (
    <div className={`fixed inset-0 bg-black/40 flex items-center justify-center z-40 px-2 ${isModalOpen ? 'block' : 'hidden'}`}>
      <div className='bg-white p-6 rounded-lg shadow-lg w-96 z-50'>
        <h2 className='text-lg font-semibold mb-4 text-[#64472b]'>انشر التعليق</h2>

        <div className='flex items-center mb-4 justify-center'>
          {
            [1, 2, 3, 4, 5].map((star, index) => (
              <span
                key={index}
                onClick={() => handleRating(star)}
                className='cursor-pointer text-yellow-500 text-2xl'
              >
                {rating >= star ? (<i className="ri-star-fill"></i>) : (<i className="ri-star-line"></i>)}
              </span>
            ))
          }
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows="4"
          className='w-full border border-gray-300 p-2 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-[#64472b]/50'
          placeholder="اكتب تعليقك هنا..."
        ></textarea>

        <div className='flex justify-end gap-2'>
          <button
            onClick={handleClose}
            className='px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition'
          >
            إلغاء
          </button>
          <button
            onClick={handleSubmit}
            className='px-4 py-2 bg-[#64472b] text-white rounded-md hover:bg-[#503823] transition'
          >
            إرسال
          </button>
        </div>
      </div>
    </div>
  )
}

export default PostAReview
