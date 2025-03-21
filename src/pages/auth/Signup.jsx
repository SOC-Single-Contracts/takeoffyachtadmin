import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from "react";
import { login, logo } from '../../assets/images';
import { signup } from '../../services/api/auth';
import { Button } from '@material-tailwind/react';

const Signup = () => {
  const [Username, setUsername] = useState('');
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await signup(Username, Email, Password);
      navigate('/login', { 
        replace: true,
        state: { message: 'Signup successful! Please login with your credentials.' }
      });
    } catch (err) {
      setError('Signup failed. Please try again.');
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden md:block w-1/2">
        <img
          src={login} 
          alt="Yacht"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="w-full min-h-screen overflow-scroll md:w-1/2 flex items-center justify-center bg-white pt-16">
        <div className="w-full max-w-md px-8 py-8">
          <img src={logo} alt="yacht logo" className='max-w-[200px] mx-auto my-8'/>
    
          <h1 className="text-4xl font-semibold mb-6 text-center font-bold font-sora">Sign Up</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name<span className='text-red-500'>*</span>
              </label>
              <div className="relative mt-1">
                <input
                  type="text"
                  id="name"
                  value={Username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ham@example.com"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-[#BEA355] focus:outline-none"
                />
              </div>
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email<span className='text-red-500'>*</span>
              </label>
              <div className="relative mt-1">
                <input
                  type="email"
                  id="email"
                  value={Email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ham@example.com"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-[#BEA355] focus:outline-none"
                />
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password<span className='text-red-500'>*</span>
              </label>
              <div className="relative mt-1">
                <input
                  type="password"
                  id="password"
                  value={Password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-[#BEA355] focus:outline-none"
                />
              </div>
            </div>

            <div className="text-right mb-4">
              <a href="/forgot-password" className="text-sm text-[#BEA355] hover:underline">
                Forgot Password?
              </a>
            </div>

            <Button
              type="submit"
              size='md'
              className="w-full bg-[#BEA355] rounded-full text-white py-4 px-4 transition capitalize font-medium "
            >
              Signup
            </Button>

            <p className="text-sm text-center mt-4">
              Do you have an account?{" "}
              <Link to="/login" className="text-yellow-600 font-medium hover:underline">
                Login
              </Link>
            </p>

            <div className="flex items-center my-6">
              <hr className="flex-1 border-t border-gray-300" />
              <span className="px-4 text-sm text-gray-500">OR</span>
              <hr className="flex-1 border-t border-gray-300" />
            </div>

            <div className="space-y-4">
                <button className="w-full relative flex items-center justify-center rounded-full py-2 bg-slate-100 hover:bg-gray-200">
                    <img
                        src="https://www.svgrepo.com/show/475656/google-color.svg"
                        alt="Google"
                        className="absolute left-4 w-5 h-5"
                    />
                    <p className="text-center font-semibold">Sign Up with Google</p>
                </button>
                <button className="w-full relative flex items-center justify-center rounded-full py-2 bg-slate-100 hover:bg-gray-200">
                    <img
                        src="https://www.svgrepo.com/show/448224/facebook.svg"
                        alt="Facebook"
                        className="absolute left-4 w-5 h-5"
                    />
                    <p className="text-center font-semibold">Sign Up with Facebook</p>
                </button>
                <button className="w-full relative flex items-center justify-center rounded-full py-2 bg-slate-100 hover:bg-gray-200">
                    <img
                    src="https://www.svgrepo.com/show/494331/apple-round.svg"
                    alt="Apple"
                    className="absolute left-4 w-5 h-5"
                    />
                    <p className="text-center font-semibold">Sign Up with Apple</p>
                </button>
            </div>
            {error && <p>{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;