import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'
import { useLoginUserMutation } from '../redux/features/auth/authApi';
import { setUser } from '../redux/features/auth/authSlice';

const Login = () => {
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const disptach = useDispatch();
  const [loginUser, { isLoading: loginLoading }] = useLoginUserMutation()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault();
    const data = { email, password };

    try {
      const response = await loginUser(data).unwrap();
      const { user } = response;
      disptach(setUser({ user }));
      alert("تم تسجيل الدخول بنجاح");
      navigate("/")
    } catch (error) {
      setMessage("الرجاء إدخال بريد إلكتروني وكلمة مرور صحيحة");
    }
  }

  return (
    <section className='h-screen flex items-center justify-center'>
      <div className='max-w-sm border shadow bg-white mx-auto p-8 rounded-lg'>
        <h2 className='text-2xl font-semibold pt-5 text-center text-[#64472b]'>يرجى تسجيل الدخول</h2>
        <form onSubmit={handleLogin} className='space-y-5 max-w-sm mx-auto pt-8'>
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder='البريد الإلكتروني'
            required
            className='w-full bg-gray-100 focus:outline-none px-5 py-3 rounded-md'
          />
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder='كلمة المرور'
            required
            className='w-full bg-gray-100 focus:outline-none px-5 py-3 rounded-md'
          />
          {message && <p className='text-red-500'>{message}</p>}

          <button
            type='submit'
            className='w-full mt-5 bg-[#64472b] text-white hover:bg-[#503823] font-medium py-3 rounded-md transition'
          >
            تسجيل الدخول
          </button>
        </form>

        <p className='my-5 italic text-sm text-center'>
          ليس لديك حساب؟
          <Link to="/register" className='text-[#64472b] px-1 underline'>سجل هنا</Link>.
        </p>
      </div>
    </section>
  )
}

export default Login
